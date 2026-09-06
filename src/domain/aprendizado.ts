/** Regras de aprendizado adaptativo (Fases 7-10 do plano de apoio ao
 * aprendizado): estatística por tópico, critério de "ponto fraco", seleção
 * de questões para praticar um tópico e detecção de questões em revisão.
 *
 * Tudo aqui é função pura sobre `RespostaBruta[]` — os FATOS brutos de
 * cada resposta já dada (nunca um percentual persistido; ver §10.2 do
 * plano). Quem lê esses fatos do banco é `db/repositorioAprendizado.ts`;
 * este módulo nunca toca o banco nem o filesystem, para poder ser testado
 * só com fixtures em memória.
 */
import type { Letra, Questao } from "@/lib/parser/tipos";
import { embaralhar, type Rng } from "./sorteio";
import { topicoPorNome } from "./topicos";

/** Um fato bruto: uma resposta já dada pelo usuário numa rodada finalizada.
 * `rodadaId` serve só para ordenar "mais recente"/"mais antiga" — nunca é
 * exibido. */
export interface RespostaBruta {
  origem: string;
  numero: number;
  dominio: number | null;
  resposta: Letra;
  correta: Letra;
  topicos: string[];
  rodadaId: number;
}

export interface EstatisticaTopico {
  topicoId: string;
  acertos: number;
  erros: number;
  totalRespondido: number;
  /** 0-100. */
  percentual: number;
}

/** Acertos/erros por tópico, contando CADA resposta (não deduplica por
 * questão — uma questão respondida em 3 rodadas diferentes conta 3 vezes,
 * de propósito: reflete o padrão real de prática, não só "acertou uma
 * vez"). Tags que não batem com o catálogo (`topicoPorNome` devolve
 * `undefined`) são ignoradas — não deveriam existir no corpus curado, mas
 * um dado ruim aqui não pode derrubar a tela inteira. */
export function estatisticasPorTopico(respostas: RespostaBruta[]): EstatisticaTopico[] {
  const acumulado = new Map<string, { acertos: number; erros: number }>();

  for (const r of respostas) {
    const acertou = r.resposta === r.correta;
    for (const nomeTopico of r.topicos) {
      const topico = topicoPorNome(nomeTopico);
      if (!topico) continue;
      const atual = acumulado.get(topico.id) ?? { acertos: 0, erros: 0 };
      if (acertou) atual.acertos++;
      else atual.erros++;
      acumulado.set(topico.id, atual);
    }
  }

  return [...acumulado.entries()].map(([topicoId, { acertos, erros }]) => ({
    topicoId,
    acertos,
    erros,
    totalRespondido: acertos + erros,
    percentual: ((acertos + erros) > 0 ? (acertos / (acertos + erros)) * 100 : 0),
  }));
}

export interface DesempenhoDominio {
  dominio: number;
  acertos: number;
  erros: number;
  totalRespondido: number;
  percentual: number;
}

/** Mesmo cálculo de `estatisticasPorTopico`, agrupado por domínio em vez de
 * tópico — usado para a manchete de cada domínio em "Meus pontos fracos".
 * Respostas sem domínio conhecido (`dominio: null`) são ignoradas. */
export function desempenhoPorDominio(respostas: RespostaBruta[]): DesempenhoDominio[] {
  const acumulado = new Map<number, { acertos: number; erros: number }>();

  for (const r of respostas) {
    if (r.dominio === null) continue;
    const acertou = r.resposta === r.correta;
    const atual = acumulado.get(r.dominio) ?? { acertos: 0, erros: 0 };
    if (acertou) atual.acertos++;
    else atual.erros++;
    acumulado.set(r.dominio, atual);
  }

  return [...acumulado.entries()].map(([dominio, { acertos, erros }]) => ({
    dominio,
    acertos,
    erros,
    totalRespondido: acertos + erros,
    percentual: ((acertos + erros) > 0 ? (acertos / (acertos + erros)) * 100 : 0),
  }));
}

export interface CriterioPontoFraco {
  /** Mínimo de respostas para um tópico entrar na análise — evita marcar
   * como fraco um tópico com só 1 questão respondida (§11.2). */
  minimoRespondido: number;
  /** Abaixo desse percentual (0-100), o tópico conta como "atenção". */
  limiarAtencao: number;
}

export const CRITERIO_PONTO_FRACO_PADRAO: CriterioPontoFraco = {
  minimoRespondido: 3,
  limiarAtencao: 70,
};

/** Tópicos "fracos": respondidos o suficiente para ter sinal (§11.2) e
 * abaixo do limiar de atenção. Ordenado do pior percentual para o melhor. */
export function pontosFracos(
  estatisticas: EstatisticaTopico[],
  criterio: CriterioPontoFraco = CRITERIO_PONTO_FRACO_PADRAO,
): EstatisticaTopico[] {
  return estatisticas
    .filter((e) => e.totalRespondido >= criterio.minimoRespondido && e.percentual < criterio.limiarAtencao)
    .sort((a, b) => a.percentual - b.percentual);
}

/** Chave estável para casar uma `Questao` do corpus com um fato de
 * resposta — mesma convenção do parser (`origem` + `numero`). */
function chaveQuestao(origem: string, numero: number): string {
  return `${origem}#${numero}`;
}

/** A última tentativa de cada questão já respondida, na ordem de
 * `respostas` (que deve vir ordenada por `rodadaId` ascendente — quem
 * chama, `repositorioAprendizado.respostasBrutas`, já garante isso). Usa
 * um `Map`: a última inserção de cada chave sobrescreve as anteriores, daí
 * "a última tentativa" sair de graça da ordem de inserção. */
function ultimaTentativaPorQuestao(respostas: RespostaBruta[]): Map<string, RespostaBruta> {
  const ultima = new Map<string, RespostaBruta>();
  for (const r of respostas) {
    ultima.set(chaveQuestao(r.origem, r.numero), r);
  }
  return ultima;
}

export interface QuestaoEmRevisao {
  origem: string;
  numero: number;
  ultimaResposta: Letra;
  correta: Letra;
}

/** Questões cuja ÚLTIMA tentativa foi errada — "aguardando revisão" (Fase
 * 10). Uma questão sai desta lista assim que o usuário acerta numa
 * tentativa mais recente; não é contagem de erros, é estado atual. */
export function questoesEmRevisao(respostas: RespostaBruta[]): QuestaoEmRevisao[] {
  return [...ultimaTentativaPorQuestao(respostas).values()]
    .filter((r) => r.resposta !== r.correta)
    .map((r) => ({
      origem: r.origem,
      numero: r.numero,
      ultimaResposta: r.resposta,
      correta: r.correta,
    }));
}

/** Seleciona até `quantidade` questões de `candidatas` (já filtradas pelo
 * tópico pedido, por quem chama) para "Praticar este tópico" (§12.1):
 * nunca respondidas primeiro, depois respondidas incorretamente (a última
 * tentativa), depois as demais da mais antiga para a mais nova — evita
 * repetir sempre as mesmas questões dentro de cada prioridade embaralhando
 * o grupo de "nunca respondidas" e o de "erradas". */
export function selecionarParaPraticar(
  candidatas: Questao[],
  respostas: RespostaBruta[],
  quantidade: number,
  rng: Rng,
): Questao[] {
  const ultimaPorQuestao = ultimaTentativaPorQuestao(respostas);

  const nuncaRespondidas: Questao[] = [];
  const erradas: Questao[] = [];
  const acertadas: Array<{ questao: Questao; rodadaId: number }> = [];

  for (const q of candidatas) {
    const ultima = ultimaPorQuestao.get(chaveQuestao(q.origem, q.numero));
    if (!ultima) {
      nuncaRespondidas.push(q);
    } else if (ultima.resposta !== ultima.correta) {
      erradas.push(q);
    } else {
      acertadas.push({ questao: q, rodadaId: ultima.rodadaId });
    }
  }

  acertadas.sort((a, b) => a.rodadaId - b.rodadaId);

  const selecionadas = [
    ...embaralhar(nuncaRespondidas, rng),
    ...embaralhar(erradas, rng),
    ...acertadas.map((a) => a.questao),
  ];

  return selecionadas.slice(0, quantidade);
}

export const QUANTIDADE_PRATICAR_PADRAO = 5;
