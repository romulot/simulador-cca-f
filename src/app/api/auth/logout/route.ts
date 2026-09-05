/** `POST /api/auth/logout` — encerra a sessão (expira o cookie). */
import { NextResponse } from "next/server";

import { NOME_COOKIE_SESSAO, OPCOES_COOKIE_SESSAO } from "@/lib/auth/sessao";

export async function POST(): Promise<NextResponse> {
  const resposta = NextResponse.json({ ok: true });
  resposta.cookies.set(NOME_COOKIE_SESSAO, "", { ...OPCOES_COOKIE_SESSAO, maxAge: 0 });
  return resposta;
}
