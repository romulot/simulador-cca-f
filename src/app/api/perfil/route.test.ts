import { beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";

import { poolTeste, criarUsuarioTeste } from "@/db/apoioTeste";
import { cookieSessaoTeste } from "@/lib/auth/apoioTeste";

let pool: Pool;
let userId: number;

beforeEach(async () => {
  pool = await poolTeste();
  userId = await criarUsuarioTeste(pool);
});

describe("GET /api/perfil", () => {
  it("sem sessão devolve 401", async () => {
    const { GET } = await import("./route");
    const resposta = await GET(new Request("http://localhost/api/perfil"));
    expect(resposta.status).toBe(401);
  });

  it("perfil recém-criado vem com os dois campos null", async () => {
    const { GET } = await import("./route");
    const resposta = await GET(
      new Request("http://localhost/api/perfil", { headers: { cookie: cookieSessaoTeste(userId) } }),
    );
    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo).toEqual({ dataProva: null, minutosSessaoPadrao: null });
  });
});

describe("PUT /api/perfil", () => {
  it("sem sessão devolve 401", async () => {
    const { PUT } = await import("./route");
    const resposta = await PUT(
      new Request("http://localhost/api/perfil", { method: "PUT", body: JSON.stringify({}) }),
    );
    expect(resposta.status).toBe(401);
  });

  it("grava dataProva e minutosSessaoPadrao e devolve o perfil salvo", async () => {
    const { PUT } = await import("./route");
    const resposta = await PUT(
      new Request("http://localhost/api/perfil", {
        method: "PUT",
        headers: { cookie: cookieSessaoTeste(userId), "content-type": "application/json" },
        body: JSON.stringify({ dataProva: "2026-12-01", minutosSessaoPadrao: 45 }),
      }),
    );
    expect(resposta.status).toBe(200);
    expect(await resposta.json()).toEqual({ dataProva: "2026-12-01", minutosSessaoPadrao: 45 });

    const linha = await pool.query("SELECT data_prova, minutos_sessao_padrao FROM usuarios WHERE id = $1", [userId]);
    expect(linha.rows[0]).toEqual({ data_prova: "2026-12-01", minutos_sessao_padrao: 45 });
  });

  it("atualiza só o campo enviado, preservando o outro já salvo", async () => {
    const { PUT } = await import("./route");
    await PUT(
      new Request("http://localhost/api/perfil", {
        method: "PUT",
        headers: { cookie: cookieSessaoTeste(userId), "content-type": "application/json" },
        body: JSON.stringify({ dataProva: "2026-12-01", minutosSessaoPadrao: 45 }),
      }),
    );

    const resposta = await PUT(
      new Request("http://localhost/api/perfil", {
        method: "PUT",
        headers: { cookie: cookieSessaoTeste(userId), "content-type": "application/json" },
        body: JSON.stringify({ minutosSessaoPadrao: 20 }),
      }),
    );
    expect(await resposta.json()).toEqual({ dataProva: "2026-12-01", minutosSessaoPadrao: 20 });
  });

  it("rejeita dataProva em formato inválido", async () => {
    const { PUT } = await import("./route");
    const resposta = await PUT(
      new Request("http://localhost/api/perfil", {
        method: "PUT",
        headers: { cookie: cookieSessaoTeste(userId), "content-type": "application/json" },
        body: JSON.stringify({ dataProva: "01/12/2026" }),
      }),
    );
    expect(resposta.status).toBe(400);
  });

  it("rejeita minutosSessaoPadrao não positivo", async () => {
    const { PUT } = await import("./route");
    const resposta = await PUT(
      new Request("http://localhost/api/perfil", {
        method: "PUT",
        headers: { cookie: cookieSessaoTeste(userId), "content-type": "application/json" },
        body: JSON.stringify({ minutosSessaoPadrao: 0 }),
      }),
    );
    expect(resposta.status).toBe(400);
  });

  it("limpa um campo já preenchido com null explícito", async () => {
    const { PUT } = await import("./route");
    await PUT(
      new Request("http://localhost/api/perfil", {
        method: "PUT",
        headers: { cookie: cookieSessaoTeste(userId), "content-type": "application/json" },
        body: JSON.stringify({ dataProva: "2026-12-01" }),
      }),
    );
    const resposta = await PUT(
      new Request("http://localhost/api/perfil", {
        method: "PUT",
        headers: { cookie: cookieSessaoTeste(userId), "content-type": "application/json" },
        body: JSON.stringify({ dataProva: null }),
      }),
    );
    expect(await resposta.json()).toEqual({ dataProva: null, minutosSessaoPadrao: null });
  });
});
