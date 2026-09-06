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
import type { AlternativasPorLetra, Letra, MetadadosQuestao } from "@/lib/parser/tipos";
import type { ComposicaoPersistida, RodadaPersistida } from "@/db/repositorioRodadas";

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
  quando: string; // ISO
  esgotouTempo: boolean;
  placar: Placar;
  composicao: ComposicaoPersistida;
  questoes: QuestaoDetalhe[];
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

  const questoes: QuestaoDetalhe[] = estado.questoes.map((q, posicao) => ({
    posicao,
    origem: q.origem,
    dominio: q.dominio,
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

  return {
    id: persistida.id,
    modo: estado.modo,
    quando: persistida.iniciadaEm.toISOString(),
    esgotouTempo: estado.esgotouTempo,
    placar,
    composicao: persistida.composicao,
    questoes,
  };
}
