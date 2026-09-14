/** `GET/PUT /api/perfil` — perfil do candidato usado pelo motor de
 * recomendação adaptativa: data da prova e minutos por sessão padrão.
 *
 * Ambos os campos são opcionais; `PUT` aceita `null` explícito para limpar
 * um campo já preenchido (distinto de omitir o campo, que mantém o valor
 * atual).
 */
import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { obterUsuarioIdDaSessao } from "@/lib/auth/sessao";
import { obterPerfil, salvarPerfil } from "@/db/repositorioUsuarios";

const DATA_ISO_RE = /^\d{4}-\d{2}-\d{2}$/;

function respostaErro(status: number, mensagem: string) {
  return NextResponse.json({ erro: mensagem }, { status });
}

export async function GET(request: Request): Promise<Response> {
  const userId = obterUsuarioIdDaSessao(request);
  if (userId === null) {
    return respostaErro(401, "não autenticado");
  }

  const db = await obterConexao();
  const perfil = await obterPerfil(db, userId);
  return NextResponse.json(perfil);
}

export async function PUT(request: Request): Promise<Response> {
  const userId = obterUsuarioIdDaSessao(request);
  if (userId === null) {
    return respostaErro(401, "não autenticado");
  }

  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return respostaErro(400, "corpo da requisição não é JSON válido");
  }
  if (!corpo || typeof corpo !== "object") {
    return respostaErro(400, "corpo deve ser um objeto");
  }
  const corpoObj = corpo as Record<string, unknown>;

  const db = await obterConexao();
  const atual = await obterPerfil(db, userId);

  let dataProva = atual.dataProva;
  if ("dataProva" in corpoObj) {
    const valor = corpoObj.dataProva;
    if (valor === null) {
      dataProva = null;
    } else if (typeof valor === "string" && DATA_ISO_RE.test(valor)) {
      dataProva = valor;
    } else {
      return respostaErro(400, "'dataProva' deve ser 'YYYY-MM-DD' ou null");
    }
  }

  let minutosSessaoPadrao = atual.minutosSessaoPadrao;
  if ("minutosSessaoPadrao" in corpoObj) {
    const valor = corpoObj.minutosSessaoPadrao;
    if (valor === null) {
      minutosSessaoPadrao = null;
    } else if (typeof valor === "number" && Number.isInteger(valor) && valor > 0) {
      minutosSessaoPadrao = valor;
    } else {
      return respostaErro(400, "'minutosSessaoPadrao' deve ser um inteiro positivo ou null");
    }
  }

  await salvarPerfil(db, userId, { dataProva, minutosSessaoPadrao });
  return NextResponse.json({ dataProva, minutosSessaoPadrao });
}
