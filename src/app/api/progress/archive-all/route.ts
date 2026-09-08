/** `POST /api/progress/archive-all` — arquiva todas as rodadas do usuário.
 *
 * Soft-delete: as rodadas continuam no banco com `arquivada = TRUE`, mas
 * desaparecem do histórico, dos cálculos de aprendizado e das estatísticas.
 * Inclui rodadas `em_andamento` — evita sessão ativa "fantasma" pós-reset. */
import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { obterUsuarioIdDaSessao } from "@/lib/auth/sessao";
import { arquivarTodasRodadas } from "@/db/repositorioRodadas";

function respostaErro(status: number, mensagem: string) {
  return NextResponse.json({ erro: mensagem }, { status });
}

export async function POST(request: Request): Promise<Response> {
  const userId = obterUsuarioIdDaSessao(request);
  if (userId === null) {
    return respostaErro(401, "não autenticado");
  }

  const db = await obterConexao();
  await arquivarTodasRodadas(db, userId);

  return NextResponse.json({ arquivadas: true }, { status: 200 });
}
