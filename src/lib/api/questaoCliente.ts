/** Questão como o cliente deve recebê-la ANTES de responder.
 *
 * Nunca inclui `correta`, `explicacoes`, `resumo` nem `metadados` — esses
 * campos só devem chegar ao navegador depois que a questão for respondida
 * (na revisão), ou o candidato veria a resposta certa antes de escolher.
 * Ponto único de conversão: toda rota que devolve uma questão "em jogo"
 * (criar rodada, navegar) passa por aqui, para não haver um segundo lugar
 * que esqueça de sanitizar.
 */
import type { AlternativasPorLetra, Questao } from "@/lib/parser/tipos";

export interface QuestaoCliente {
  /** posição 0-based dentro da rodada — não confundir com `numero`, que é
   * a numeração dentro do arquivo de origem. */
  posicao: number;
  origem: string;
  dominio: number | null;
  numero: number;
  enunciado: string;
  alternativas: AlternativasPorLetra;
}

export function paraQuestaoCliente(questao: Questao, posicao: number): QuestaoCliente {
  return {
    posicao,
    origem: questao.origem,
    dominio: questao.dominio,
    numero: questao.numero,
    enunciado: questao.enunciado,
    alternativas: questao.alternativas,
  };
}
