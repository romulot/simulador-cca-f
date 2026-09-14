/** `POST /api/auth/registro` — cadastro público desativado.
 *
 * O simulador é de acesso restrito: somente as contas previamente
 * provisionadas no banco podem autenticar. Manter a barreira nesta rota
 * (e não apenas esconder a tela) impede cadastros por chamadas diretas à
 * API. */
import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { erro: "cadastro público desativado" },
    { status: 403 },
  );
}
