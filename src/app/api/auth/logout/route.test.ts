import { describe, expect, it } from "vitest";

import { NOME_COOKIE_SESSAO } from "@/lib/auth/sessao";

describe("POST /api/auth/logout", () => {
  it("expira o cookie de sessão e devolve 200", async () => {
    const { POST } = await import("./route");
    const resposta = await POST();

    expect(resposta.status).toBe(200);
    const cookie = resposta.cookies.get(NOME_COOKIE_SESSAO);
    expect(cookie?.value).toBe("");
    expect(cookie?.maxAge).toBe(0);
  });
});
