/** `GET /api/historico/:id` — detalhe completo de UMA rodada finalizada.
 *
 * Único lugar (além da resposta imediata de `POST .../encerrar`) que expõe
 * `correta`/`explicacoes`/`metadados` de uma rodada — só é chamado depois
 * que ela já encerrou, nunca para uma em andamento (por isso o 409
 * explícito abaixo, em vez de vazar o detalhe de uma rodada que ainda
 * pode ser jogada).
 */
import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { carregarRodada } from "@/db/repositorioRodadas";
import { montarDetalheRodada } from "@/lib/api/detalheRodada";

function erro(status: number, mensagem: string) {
  return NextResponse.json({ erro: mensagem }, { status });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return erro(400, "id inválido");
  }

  const db = obterConexao();
  const persistida = carregarRodada(db, id);
  if (!persistida) {
    return erro(404, "rodada não encontrada");
  }
  if (persistida.status !== "finalizada") {
    return erro(409, "rodada ainda em andamento — use GET /api/rodadas/:id");
  }

  return NextResponse.json(montarDetalheRodada(persistida));
}
