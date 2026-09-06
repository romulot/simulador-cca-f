import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { alterarSenhaComToken } from "@/db/repositorioResetSenha";
import { excedeuLimite, identificarCliente } from "@/lib/auth/rateLimit";
import { hashSenha } from "@/lib/auth/senha";
import { hashTokenReset } from "@/lib/auth/tokenReset";

const SENHA_MINIMA = 8;

export async function POST(request: Request): Promise<NextResponse> {
  const cliente = identificarCliente(request);
  if (excedeuLimite(`redefinir:${cliente}`, 10)) {
    return NextResponse.json({ erro: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });
  }

  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return NextResponse.json({ erro: "corpo da requisição não é JSON válido" }, { status: 400 });
  }
  const { token, senha } = (corpo ?? {}) as Record<string, unknown>;
  if (typeof token !== "string" || token.length < 20) {
    return NextResponse.json({ erro: "Link inválido ou expirado." }, { status: 400 });
  }
  if (typeof senha !== "string" || senha.length < SENHA_MINIMA) {
    return NextResponse.json({ erro: `A senha deve ter pelo menos ${SENHA_MINIMA} caracteres.` }, { status: 400 });
  }

  const alterada = await alterarSenhaComToken(
    await obterConexao(),
    hashTokenReset(token),
    await hashSenha(senha),
  );
  if (!alterada) {
    return NextResponse.json({ erro: "Link inválido ou expirado." }, { status: 400 });
  }
  return NextResponse.json({ mensagem: "Senha alterada com sucesso." });
}
