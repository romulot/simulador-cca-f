/** `GET /api/historico` — lista as rodadas finalizadas do usuário da
 * sessão, mais recente primeiro. Resumo (placar recalculado, nunca lido de
 * coluna persistida); o detalhe completo de uma rodada é
 * `GET /api/historico/:id`. */
import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { listarHistorico } from "@/db/repositorioHistorico";
import { obterUsuarioIdDaSessao } from "@/lib/auth/sessao";

export async function GET(request: Request): Promise<Response> {
  const userId = obterUsuarioIdDaSessao(request);
  if (userId === null) {
    return NextResponse.json({ erro: "não autenticado" }, { status: 401 });
  }

  const db = await obterConexao();
  const entradas = await listarHistorico(db, userId);
  return NextResponse.json({ entradas });
}
