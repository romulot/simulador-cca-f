/** Sessão via cookie assinado — sem tabela de sessão no banco (ver
 * `docs/decisoes/persistencia-e-auth.md`).
 *
 * Cookie carrega `{ uid, exp }` codificado em base64url, com assinatura
 * HMAC-SHA256 (chave `SESSION_SECRET`) anexada. Validar é só recomputar a
 * assinatura (comparação em tempo constante) e checar a expiração — sem
 * consulta ao banco por requisição.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export const NOME_COOKIE_SESSAO = "simulador_sessao";
const DURACAO_SEGUNDOS = 30 * 24 * 60 * 60; // 30 dias

interface PayloadSessao {
  uid: number;
  exp: number;
}

export const OPCOES_COOKIE_SESSAO = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: DURACAO_SEGUNDOS,
};

function segredo(): string {
  const valor = process.env.SESSION_SECRET;
  if (!valor || valor.trim() === "") {
    throw new Error("SESSION_SECRET não configurada — necessária para assinar a sessão.");
  }
  return valor;
}

function assinar(payloadB64: string): string {
  return createHmac("sha256", segredo()).update(payloadB64).digest("base64url");
}

/** Valor a gravar no cookie `NOME_COOKIE_SESSAO` para autenticar `userId`. */
export function criarValorCookieSessao(userId: number): string {
  const payload: PayloadSessao = {
    uid: userId,
    exp: Math.floor(Date.now() / 1000) + DURACAO_SEGUNDOS,
  };
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${payloadB64}.${assinar(payloadB64)}`;
}

function lerCookie(request: Request): string | null {
  const cabecalho = request.headers.get("cookie");
  if (!cabecalho) return null;
  for (const parte of cabecalho.split(";")) {
    const separador = parte.indexOf("=");
    if (separador === -1) continue;
    const nome = parte.slice(0, separador).trim();
    if (nome === NOME_COOKIE_SESSAO) return parte.slice(separador + 1).trim();
  }
  return null;
}

/** `userId` da sessão válida no cookie de `request`, ou `null` se ausente,
 * malformada, com assinatura inválida ou expirada. Aceita qualquer `Request`
 * (rotas de API recebem `Request` puro; `NextRequest` também é um). */
export function obterUsuarioIdDaSessao(request: Request): number | null {
  const valor = lerCookie(request);
  if (!valor) return null;

  const ponto = valor.indexOf(".");
  if (ponto === -1) return null;
  const payloadB64 = valor.slice(0, ponto);
  const assinatura = valor.slice(ponto + 1);

  const esperada = assinar(payloadB64);
  const bufAssinatura = Buffer.from(assinatura);
  const bufEsperada = Buffer.from(esperada);
  if (bufAssinatura.length !== bufEsperada.length || !timingSafeEqual(bufAssinatura, bufEsperada)) {
    return null;
  }

  let payload: PayloadSessao;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, "base64url").toString("utf-8"));
  } catch {
    return null;
  }
  if (typeof payload.uid !== "number" || typeof payload.exp !== "number") return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  return payload.uid;
}
