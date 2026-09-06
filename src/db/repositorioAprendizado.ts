/** Leitura dos fatos brutos de resposta usados pelas regras de aprendizado
 * (`domain/aprendizado.ts`): estatística por tópico, pontos fracos,
 * seleção para praticar e detecção de questões em revisão.
 *
 * Só rodadas FINALIZADAS entram (mesmo espírito de
 * `repositorioHistorico.ts`: nunca considerar uma rodada que o candidato
 * ainda pode responder de novo) e só posições já respondidas (`resposta
 * IS NOT NULL`) — uma questão em branco não é um "fato de resposta".
 */
import type { Pool } from "pg";

import type { RespostaBruta } from "@/domain/aprendizado";
import type { Letra } from "@/lib/parser/tipos";

interface LinhaRespostaBruta {
  origem: string;
  numero: number;
  dominio: number | null;
  resposta: string;
  correta: string;
  topicos_json: string;
  rodada_id: number;
}

/** Todas as respostas já dadas por `userId` em rodadas finalizadas, da
 * mais antiga para a mais nova (`rodada_id` cresce com o tempo, por ser
 * `GENERATED ALWAYS AS IDENTITY`) — ordem que `domain/aprendizado.ts`
 * pressupõe para achar "a última tentativa" de cada questão. */
export async function respostasBrutas(pool: Pool, userId: number): Promise<RespostaBruta[]> {
  const resultado = await pool.query<LinhaRespostaBruta>(
    `SELECT qr.origem, qr.numero, qr.dominio, qr.resposta, qr.correta, qr.topicos_json, qr.rodada_id
     FROM questoes_rodada qr
     JOIN rodadas r ON r.id = qr.rodada_id
     WHERE r.user_id = $1 AND r.status = 'finalizada' AND qr.resposta IS NOT NULL
     ORDER BY qr.rodada_id ASC`,
    [userId],
  );

  return resultado.rows.map((linha) => ({
    origem: linha.origem,
    numero: linha.numero,
    dominio: linha.dominio,
    resposta: linha.resposta as Letra,
    correta: linha.correta as Letra,
    topicos: JSON.parse(linha.topicos_json),
    rodadaId: linha.rodada_id,
  }));
}
