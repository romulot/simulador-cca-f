import { describe, expect, it } from "vitest";

describe("POST /api/auth/registro", () => {
  it("recusa cadastro público sem criar sessão", async () => {
    const { POST } = await import("./route");
    const resposta = await POST();

    expect(resposta.status).toBe(403);
    const corpo = await resposta.json();
    expect(corpo.erro).toBe("cadastro público desativado");
    expect(resposta.cookies.getAll()).toEqual([]);
  });
});
