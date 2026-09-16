/** Payload completo de uma rodada JÁ FINALIZADA.
 *
 * Diferente de `questaoCliente.ts` (usado enquanto a rodada está em
 * andamento), aqui `correta`/`explicacoes`/`metadados` são expostos de
 * propósito — só é seguro chamar isto depois que a rodada encerrou
 * (`persistida.status === "finalizada"`), nunca antes. Usado tanto pela
 * rota de encerrar (resposta imediata) quanto pelo histórico (reabrir uma
 * rodada passada) — mesmo formato, um lugar só que monta.
 */
import { placar as placarDominio, relogioInerte, type Modo, type Placar } from "@/domain/rodada";
import { diagnosticarErros, type DiagnosticoRodada } from "@/domain/diagnosticoErro";
import type { CursoId } from "@/lib/catalogo";
import type { AlternativasPorLetra, Letra, MetadadosQuestao } from "@/lib/parser/tipos";
import type { ComposicaoPersistida, RodadaPersistida } from "@/db/repositorioRodadas";

/** Rótulo de `origem` devolvido ao cliente no lugar do nome real de arquivo
 * quando `curso === "exame-avancado"` — o nome real segue o padrão
 * `dominio-N`, que revelaria o domínio da questão tão diretamente quanto o
 * próprio número. Ver Tarefa 8 do plano Exame Avançado. */
const ORIGEM_OCULTA = "exame-avancado";

export interface QuestaoDetalhe {
  posicao: number;
  origem: string;
  dominio: number | null;
  numero: number;
  enunciado: string;
  alternativas: AlternativasPorLetra;
  correta: Letra;
  resumo: string;
  explicacoes: AlternativasPorLetra;
  metadados: MetadadosQuestao;
  topicos: string[];
  resposta: Letra | null;
  segundos: number;
}

export interface DetalheRodada {
  id: number;
  modo: Modo;
  curso: CursoId;
  quando: string; // ISO
  esgotouTempo: boolean;
  placar: Placar;
  composicao: ComposicaoPersistida;
  questoes: QuestaoDetalhe[];
  /** Classificação de cada erro por tempo (conceito vs. desatenção) e sinal
   * de fadiga da rodada — ver `domain/diagnosticoErro.ts`. */
  diagnostico: DiagnosticoRodada;
}

/** Monta o detalhe completo a partir de uma `RodadaPersistida` já
 * finalizada. Lança se `status !== "finalizada"` — é um erro de
 * programação chamar isto para uma rodada em andamento, não um caso a
 * tratar graciosamente (o chamador decide o que fazer antes de chegar
 * aqui). */
export function montarDetalheRodada(persistida: RodadaPersistida): DetalheRodada {
  if (persistida.status !== "finalizada") {
    throw new Error("montarDetalheRodada: só pode ser chamado para uma rodada finalizada");
  }

  const { estado } = persistida;
  const placar = placarDominio(estado, relogioInerte());
  // Trilha "Exame Avançado" nunca revela domínio ao candidato (decisão de
  // produto do plano): o dado continua calculado/persistido internamente
  // (placar, diagnóstico), só não trafega para o cliente nesta trilha.
  const ocultarDominio = persistida.curso === "exame-avancado";

  const questoes: QuestaoDetalhe[] = estado.questoes.map((q, posicao) => ({
    posicao,
    origem: ocultarDominio ? ORIGEM_OCULTA : q.origem,
    dominio: ocultarDominio ? null : q.dominio,
    numero: q.numero,
    enunciado: q.enunciado,
    alternativas: q.alternativas,
    correta: q.correta,
    resumo: q.resumo,
    explicacoes: q.explicacoes,
    metadados: q.metadados,
    topicos: q.topicos,
    resposta: estado.respostas[posicao],
    segundos: estado.tempos[posicao],
  }));

  const diagnostico = diagnosticarErros(
    questoes.map((q) => ({
      posicao: q.posicao,
      segundos: q.segundos,
      resposta: q.resposta,
      correta: q.correta,
    })),
  );

  return {
    id: persistida.id,
    modo: estado.modo,
    curso: persistida.curso,
    quando: persistida.iniciadaEm.toISOString(),
    esgotouTempo: estado.esgotouTempo,
    placar,
    composicao: persistida.composicao,
    questoes,
    diagnostico,
  };
}
