/** `POST /api/auth/login` — autentica por email+senha.
 *
 * Email inexistente e senha errada devolvem a MESMA mensagem de erro — não
 * dá pista sobre qual dos dois estava errado (evita enumeração de contas).
 */
import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { buscarUsuarioPorEmail } from "@/db/repositorioUsuarios";
import { verificarSenha } from "@/lib/auth/senha";
import { excedeuLimite, identificarCliente } from "@/lib/auth/rateLimit";
import { NOME_COOKIE_SESSAO, OPCOES_COOKIE_SESSAO, criarValorCookieSessao } from "@/lib/auth/sessao";

const MENSAGEM_CREDENCIAIS_INVALIDAS = "email ou senha inválidos";

function erro(status: number, mensagem: string) {
  return NextResponse.json({ erro: mensagem }, { status });
}

export async function POST(request: Request): Promise<NextResponse> {
  if (excedeuLimite(`login:${identificarCliente(request)}`, 10)) {
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
  if (typeof email !== "string" || typeof senha !== "string") {
    return erro(400, "'email' e 'senha' são obrigatórios");
  }

  const pool = await obterConexao();
  const usuario = await buscarUsuarioPorEmail(pool, email);
  if (!usuario) {
    return erro(401, MENSAGEM_CREDENCIAIS_INVALIDAS);
  }

  const senhaCorreta = await verificarSenha(senha, usuario.senhaHash);
  if (!senhaCorreta) {
    return erro(401, MENSAGEM_CREDENCIAIS_INVALIDAS);
  }

  const resposta = NextResponse.json({ id: usuario.id, email: usuario.email });
  resposta.cookies.set(NOME_COOKIE_SESSAO, criarValorCookieSessao(usuario.id), OPCOES_COOKIE_SESSAO);
  return resposta;
}
