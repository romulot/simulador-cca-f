/** `DELETE /api/progress` — apaga permanentemente todas as rodadas do usuário.
 *
 * Operação irreversível: remove todas as linhas em `rodadas` do usuário
 * (o CASCADE apaga `questoes_rodada` automaticamente). Usar apenas mediante
 * confirmação explícita do usuário na UI. */
import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { obterUsuarioIdDaSessao } from "@/lib/auth/sessao";
import { deletarTodasRodadas } from "@/db/repositorioRodadas";

function respostaErro(status: number, mensagem: string) {
  return NextResponse.json({ erro: mensagem }, { status });
}

export async function DELETE(request: Request): Promise<Response> {
  const userId = obterUsuarioIdDaSessao(request);
  if (userId === null) {
    return respostaErro(401, "não autenticado");
  }

  const db = await obterConexao();
  await deletarTodasRodadas(db, userId);

  return NextResponse.json({ deletadas: true }, { status: 200 });
}
