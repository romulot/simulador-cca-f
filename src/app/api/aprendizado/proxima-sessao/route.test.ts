import { beforeEach, describe, expect, it } from "vitest";

import { poolTeste, criarUsuarioTeste } from "@/db/apoioTeste";
import { cookieSessaoTeste } from "@/lib/auth/apoioTeste";

let userId: number;

beforeEach(async () => {
  const pool = await poolTeste();
  userId = await criarUsuarioTeste(pool);
});

describe("GET /api/aprendizado/proxima-sessao", () => {
  it("sem sessão devolve 401", async () => {
    const { GET } = await import("./route");
    const resposta = await GET(new Request("http://localhost/api/aprendizado/proxima-sessao"));
    expect(resposta.status).toBe(401);
  });

  it("candidato sem histórico recebe sessão com tópicos de cobertura zero", async () => {
    const { GET } = await import("./route");
    const resposta = await GET(
      new Request("http://localhost/api/aprendizado/proxima-sessao?minutos=20", {
        headers: { cookie: cookieSessaoTeste(userId) },
      }),
    );
    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.minutosDisponiveis).toBe(20);
    expect(corpo.selecionados.length).toBeGreaterThan(0);
    expect(corpo.selecionados[0].cobertura).toBe(0);
    expect(corpo.selecionados[0].vistas).toBe(0);
  });

  it("usa minutosSessaoPadrao do perfil quando 'minutos' não é informado", async () => {
    const { PUT } = await import("../../perfil/route");
    await PUT(
      new Request("http://localhost/api/perfil", {
        method: "PUT",
        headers: { cookie: cookieSessaoTeste(userId), "content-type": "application/json" },
        body: JSON.stringify({ minutosSessaoPadrao: 5 }),
      }),
    );

    const { GET } = await import("./route");
    const resposta = await GET(
      new Request("http://localhost/api/aprendizado/proxima-sessao", {
        headers: { cookie: cookieSessaoTeste(userId) },
      }),
    );
    const corpo = await resposta.json();
    expect(corpo.minutosDisponiveis).toBe(5);
  });

  it("rejeita 'minutos' inválido", async () => {
    const { GET } = await import("./route");
    const resposta = await GET(
      new Request("http://localhost/api/aprendizado/proxima-sessao?minutos=abc", {
        headers: { cookie: cookieSessaoTeste(userId) },
      }),
    );
    expect(resposta.status).toBe(400);
  });
});
