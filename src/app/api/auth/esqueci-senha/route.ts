import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { criarTokenReset } from "@/db/repositorioResetSenha";
import { buscarUsuarioPorEmail } from "@/db/repositorioUsuarios";
import { excedeuLimite, identificarCliente } from "@/lib/auth/rateLimit";
import { DURACAO_TOKEN_RESET_MS, gerarTokenReset, hashTokenReset } from "@/lib/auth/tokenReset";
import { enviarResetSenha } from "@/lib/email/enviarResetSenha";

const MENSAGEM = "Se existir uma conta associada a este e-mail, enviaremos as instruções para redefinir a senha.";
const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request): Promise<NextResponse> {
  const cliente = identificarCliente(request);
  if (excedeuLimite(`reset:${cliente}`, 5)) {
    return NextResponse.json({ erro: "Muitas tentativas. Aguarde alguns minutos." }, { status: 429 });
  }

  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return NextResponse.json({ erro: "corpo da requisição não é JSON válido" }, { status: 400 });
  }
  const email = (corpo as { email?: unknown } | null)?.email;
  if (typeof email !== "string" || !EMAIL_VALIDO.test(email.trim())) {
    return NextResponse.json({ erro: "email inválido" }, { status: 400 });
  }

  const pool = await obterConexao();
  const usuario = await buscarUsuarioPorEmail(pool, email);
  if (usuario) {
    const token = gerarTokenReset();
    await criarTokenReset(
      pool,
      usuario.id,
      hashTokenReset(token),
      new Date(Date.now() + DURACAO_TOKEN_RESET_MS),
    );
    const appUrl = process.env.APP_URL?.replace(/\/$/, "");
    if (!appUrl) throw new Error("APP_URL não configurada.");
    await enviarResetSenha({
      destinatario: usuario.email,
      link: `${appUrl}/redefinir-senha?token=${encodeURIComponent(token)}`,
    });
  }

  return NextResponse.json({ mensagem: MENSAGEM });
}
