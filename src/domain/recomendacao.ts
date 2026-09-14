/** Motor de recomendação adaptativa de próxima sessão.
 *
 * Porte de `.claude/skills/proxima-sessao/scripts/recomendar.py` (no
 * laboratório de estudos `claude-cca-f-estudos`) para TypeScript.
 *
 * A ordenação é por PESO DO DOMÍNIO × COBERTURA QUE FALTA, não pela nota do
 * último simulado: cobertura zero é risco maior que nota baixa em tópico já
 * praticado (task statement nunca praticado tende a render pior na prova
 * real do que um já visto e com acerto baixo). Acurácia entra só como fator
 * secundário.
 *
 * Diferença deliberada do script original: lá, "cobertura" divide pelo
 * número fixo de 6 questões por task statement (constante do banco Anderês
 * vendorizado). Aqui — regra geral deste módulo (ver `domain/sorteio.ts`,
 * mesma nota em `PESOS`) — o número de questões por tópico NUNCA é
 * embutido: é sempre contado a partir do corpus real (`contarDisponivelPorTopico`),
 * porque descreve o CORPUS, não o exame. Um tópico com 8 questões no
 * simulador-cca-f não fica com "cobertura > 100%" por comparação com uma
 * constante importada do outro projeto.
 */
import type { Questao } from "@/lib/parser/tipos";
import { PESOS } from "./sorteio";
import { topicoPorNome, type Topico } from "./topicos";
import type { EstatisticaTopico } from "./aprendizado";

/** Quantas questões do corpus estão tagueadas para cada tópico — a base da
 * "cobertura". Ignora tags que não batem com o catálogo, mesmo tratamento
 * defensivo de `aprendizado.ts::estatisticasPorTopico`. */
export function contarDisponivelPorTopico(questoes: Questao[]): Map<string, number> {
  const contagem = new Map<string, number>();
  for (const q of questoes) {
    for (const nomeTopico of q.topicos) {
      const topico = topicoPorNome(nomeTopico);
      if (!topico) continue;
      contagem.set(topico.id, (contagem.get(topico.id) ?? 0) + 1);
    }
  }
  return contagem;
}

export interface ItemRecomendacao {
  topicoId: string;
  nome: string;
  dominio: number;
  score: number;
  vistas: number;
  disponivel: number;
  /** 0-100; 0 quando não há nenhuma questão do tópico no corpus. */
  cobertura: number;
  /** 0-100, ou null quando o tópico nunca foi respondido. */
  acuracia: number | null;
}

/** Peso secundário da taxa de erro na fórmula do score — mesmo valor do
 * script de referência (`0.4`): cobertura que falta domina a ordenação,
 * acurácia baixa só desempata entre tópicos com cobertura parecida. */
const FATOR_ACURACIA_SECUNDARIO = 0.4;

/** Ordena todos os tópicos do catálogo pelo score de prioridade, do maior
 * para o menor. Tópicos sem nenhuma questão disponível no corpus
 * (`disponivel === 0`) entram com cobertura 0 mas ficam sinalizados — quem
 * consome decide se pula (não há o que praticar ali agora). */
export function prioridades(
  topicos: Topico[],
  disponivelPorTopico: Map<string, number>,
  estatisticas: EstatisticaTopico[],
  pesos: Record<number, number> = PESOS,
): ItemRecomendacao[] {
  const estatisticaPorTopico = new Map(estatisticas.map((e) => [e.topicoId, e]));

  const itens = topicos.map((topico): ItemRecomendacao => {
    const stat = estatisticaPorTopico.get(topico.id);
    const vistas = stat?.totalRespondido ?? 0;
    const disponivel = disponivelPorTopico.get(topico.id) ?? 0;
    const cobertura = disponivel > 0 ? Math.min(100, (100 * vistas) / disponivel) : 0;
    const acuracia = stat ? stat.percentual : null;

    const falta = (100 - cobertura) / 100;
    const erro = acuracia !== null ? (100 - acuracia) / 100 : 0;
    const peso = pesos[topico.dominio] ?? 0;
    const score = peso * (falta + FATOR_ACURACIA_SECUNDARIO * erro);

    return {
      topicoId: topico.id,
      nome: topico.nome,
      dominio: topico.dominio,
      score,
      vistas,
      disponivel,
      cobertura,
      acuracia,
    };
  });

  return itens.sort((a, b) => b.score - a.score);
}

/** Minutos estimados para praticar um tópico — ritmo pedagógico assumido
 * (não descreve o corpus, por isso pode ser uma constante: é a mesma
 * lógica que já justifica `PESOS` em `sorteio.ts` poder ser fixo). Baseado
 * em ~1,7 min por questão (6 questões a ~10 min, referência do script
 * original), aplicado ao número REAL de questões do tópico. */
export const MINUTOS_POR_QUESTAO_ESTIMADO = 1.7;

export function minutosEstimados(disponivel: number): number {
  if (disponivel <= 0) return 0;
  return Math.max(1, Math.round(disponivel * MINUTOS_POR_QUESTAO_ESTIMADO));
}

export interface ProximaSessao {
  selecionados: ItemRecomendacao[];
  minutosEstimados: number;
  /** Domínios em que TODOS os tópicos do catálogo já atingiram 100% de
   * cobertura — sinal de que o próximo passo é o modo prova, não mais
   * prática por tópico (prática por tópico infla a nota; só o modo prova
   * mede de verdade). */
  dominiosComCoberturaCompleta: number[];
}

/** Seleciona os tópicos da próxima sessão, gastando o orçamento de minutos
 * na ordem de prioridade. Sempre inclui pelo menos 1 item (se houver algum
 * com questão disponível), mesmo que o custo estimado dele sozinho já
 * exceda o orçamento — um orçamento pequeno não deveria devolver sessão
 * vazia. Tópicos sem nenhuma questão no corpus (`disponivel === 0`) nunca
 * são selecionados: não há o que praticar. */
export function proximaSessao(
  itensOrdenados: ItemRecomendacao[],
  minutosDisponiveis: number,
): ProximaSessao {
  const selecionados: ItemRecomendacao[] = [];
  let acumulado = 0;

  for (const item of itensOrdenados) {
    if (item.disponivel === 0) continue;
    const custo = minutosEstimados(item.disponivel);
    if (selecionados.length > 0 && acumulado + custo > minutosDisponiveis) continue;
    selecionados.push(item);
    acumulado += custo;
  }

  const porDominio = new Map<number, ItemRecomendacao[]>();
  for (const item of itensOrdenados) {
    const lista = porDominio.get(item.dominio) ?? [];
    lista.push(item);
    porDominio.set(item.dominio, lista);
  }
  const dominiosComCoberturaCompleta = [...porDominio.entries()]
    .filter(([, itens]) => itens.every((i) => i.disponivel > 0 && i.cobertura >= 100))
    .map(([dominio]) => dominio)
    .sort((a, b) => a - b);

  return { selecionados, minutosEstimados: acumulado, dominiosComCoberturaCompleta };
}

export const MINUTOS_PADRAO = 30;
