import { describe, expect, it } from "vitest";
import { createHmac } from "node:crypto";

import { NOME_COOKIE_SESSAO, criarValorCookieSessao, obterUsuarioIdDaSessao } from "./sessao";

function requisicaoComCookie(valor: string): Request {
  return new Request("http://localhost", { headers: { cookie: `${NOME_COOKIE_SESSAO}=${valor}` } });
}

function assinar(payloadB64: string): string {
  return createHmac("sha256", process.env.SESSION_SECRET!).update(payloadB64).digest("base64url");
}

describe("sessao", () => {
  it("round-trip: cookie criado é validado de volta com o mesmo uid", () => {
    const valor = criarValorCookieSessao(7);
    expect(obterUsuarioIdDaSessao(requisicaoComCookie(valor))).toBe(7);
  });

  it("sem cookie devolve null", () => {
    expect(obterUsuarioIdDaSessao(new Request("http://localhost"))).toBeNull();
  });

  it("sem cookie de sessão (outro cookie presente) devolve null", () => {
    const req = new Request("http://localhost", { headers: { cookie: "outro=valor" } });
    expect(obterUsuarioIdDaSessao(req)).toBeNull();
  });

  it("cookie sem ponto separador devolve null", () => {
    expect(obterUsuarioIdDaSessao(requisicaoComCookie("semponto"))).toBeNull();
  });

  it("cookie com assinatura adulterada devolve null", () => {
    const valor = criarValorCookieSessao(7);
    const adulterado = valor.slice(0, -1) + (valor.endsWith("A") ? "B" : "A");
    expect(obterUsuarioIdDaSessao(requisicaoComCookie(adulterado))).toBeNull();
  });

  it("cookie expirado devolve null", () => {
    const payload = { uid: 7, exp: Math.floor(Date.now() / 1000) - 60 };
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const valor = `${payloadB64}.${assinar(payloadB64)}`;
    expect(obterUsuarioIdDaSessao(requisicaoComCookie(valor))).toBeNull();
  });

  it("payload que não é JSON válido devolve null", () => {
    const payloadB64 = Buffer.from("nao e json").toString("base64url");
    const valor = `${payloadB64}.${assinar(payloadB64)}`;
    expect(obterUsuarioIdDaSessao(requisicaoComCookie(valor))).toBeNull();
  });

  it("payload com 'uid' de tipo errado (string, não number) devolve null", () => {
    const payloadB64 = Buffer.from(
      JSON.stringify({ uid: "7", exp: Math.floor(Date.now() / 1000) + 60 }),
    ).toString("base64url");
    const valor = `${payloadB64}.${assinar(payloadB64)}`;
    expect(obterUsuarioIdDaSessao(requisicaoComCookie(valor))).toBeNull();
  });
});
