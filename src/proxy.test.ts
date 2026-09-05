import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";

import { NOME_COOKIE_SESSAO, criarValorCookieSessao } from "@/lib/auth/sessao";
import { proxy } from "./proxy";

function requisicao(url: string, comSessao = false): NextRequest {
  const headers = comSessao
    ? { cookie: `${NOME_COOKIE_SESSAO}=${criarValorCookieSessao(1)}` }
    : undefined;
  return new NextRequest(new Request(url, { headers }));
}

describe("proxy", () => {
  it("página protegida sem sessão redireciona para /login", () => {
    const resposta = proxy(requisicao("http://localhost/"));
    expect(resposta.status).toBe(307);
    const destino = new URL(resposta.headers.get("location")!);
    expect(destino.pathname).toBe("/login");
    expect(destino.searchParams.get("proximo")).toBe("/");
  });

  it("página protegida com sessão válida deixa passar", () => {
    const resposta = proxy(requisicao("http://localhost/historico", true));
    expect(resposta.headers.get("x-middleware-next")).toBe("1");
  });

  it("rota de API protegida sem sessão devolve 401 JSON, não redireciona", () => {
    const resposta = proxy(requisicao("http://localhost/api/historico"));
    expect(resposta.status).toBe(401);
    expect(resposta.headers.get("location")).toBeNull();
  });

  it("rota de API protegida com sessão válida deixa passar", () => {
    const resposta = proxy(requisicao("http://localhost/api/rodadas", true));
    expect(resposta.headers.get("x-middleware-next")).toBe("1");
  });

  it("/login e /cadastro ficam públicas mesmo sem sessão", () => {
    expect(proxy(requisicao("http://localhost/login")).headers.get("x-middleware-next")).toBe("1");
    expect(proxy(requisicao("http://localhost/cadastro")).headers.get("x-middleware-next")).toBe("1");
  });

  it("/api/catalogo e /api/auth/* ficam públicas mesmo sem sessão", () => {
    expect(proxy(requisicao("http://localhost/api/catalogo")).headers.get("x-middleware-next")).toBe("1");
    expect(proxy(requisicao("http://localhost/api/auth/login")).headers.get("x-middleware-next")).toBe(
      "1",
    );
  });
});
