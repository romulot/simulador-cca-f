/** `POST /api/auth/registro` — cria uma conta nova (email + senha) e já
 * autentica (mesmo cookie de sessão que `/api/auth/login` grava). */
import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { criarUsuario, EmailJaCadastradoError } from "@/db/repositorioUsuarios";
import { hashSenha } from "@/lib/auth/senha";
import { excedeuLimite, identificarCliente } from "@/lib/auth/rateLimit";
import { NOME_COOKIE_SESSAO, OPCOES_COOKIE_SESSAO, criarValorCookieSessao } from "@/lib/auth/sessao";

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_MINIMA = 8;

function erro(status: number, mensagem: string) {
  return NextResponse.json({ erro: mensagem }, { status });
}

export async function POST(request: Request): Promise<NextResponse> {
  if (excedeuLimite(`registro:${identificarCliente(request)}`, 5)) {
    return erro(429, "muitas tentativas. Aguarde alguns minutos");
  }
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return erro(400, "corpo da requisição não é JSON válido");
  }

  if (!corpo || typeof corpo !== "object") {
    return erro(400, "'email' e 'senha' são obrigatórios");
  }
  const { email, senha } = corpo as Record<string, unknown>;

  if (typeof email !== "string" || !EMAIL_VALIDO.test(email.trim())) {
    return erro(400, "email inválido");
  }
  if (typeof senha !== "string" || senha.length < SENHA_MINIMA) {
    return erro(400, `senha deve ter pelo menos ${SENHA_MINIMA} caracteres`);
  }

  const pool = await obterConexao();
  const senhaHash = await hashSenha(senha);

  try {
    const usuario = await criarUsuario(pool, email, senhaHash);
    const resposta = NextResponse.json({ id: usuario.id, email: usuario.email }, { status: 201 });
    resposta.cookies.set(NOME_COOKIE_SESSAO, criarValorCookieSessao(usuario.id), OPCOES_COOKIE_SESSAO);
    return resposta;
  } catch (e) {
    if (e instanceof EmailJaCadastradoError) {
      return erro(409, "email já cadastrado");
    }
    throw e;
  }
}
