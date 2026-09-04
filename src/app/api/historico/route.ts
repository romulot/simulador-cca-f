/** `GET /api/historico` — lista as rodadas finalizadas, mais recente
 * primeiro. Resumo (placar recalculado, nunca lido de coluna persistida);
 * o detalhe completo de uma rodada é `GET /api/historico/:id`. */
import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { listarHistorico } from "@/db/repositorioHistorico";

export async function GET(): Promise<Response> {
  const db = obterConexao();
  const entradas = listarHistorico(db);
  return NextResponse.json({ entradas });
}
