import { beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";

import { poolTeste, criarUsuarioTeste } from "@/db/apoioTeste";
import { cookieSessaoTeste } from "@/lib/auth/apoioTeste";
import { criarRodada } from "@/db/repositorioRodadas";

let pool: Pool;
let userId: number;
let outroUsuarioId: number;

beforeEach(async () => {
  pool = await poolTeste();
  userId = await criarUsuarioTeste(pool);
  outroUsuarioId = await criarUsuarioTeste(pool);
});

function questaoFake() {
  return {
    origem: "teste",
    dominio: 1,
    numero: 1,
    enunciado: "Enunciado",
    alternativas: { A: "a", B: "b", C: "c", D: "d" },
    correta: "A" as const,
    resumo: "resumo",
    explicacoes: { A: "a", B: "b", C: "c", D: "d" },
    metadados: { bloom: "Aplicar", dificuldade: "Médio", rubrica: "r", cenario: "c", principioTestado: "p" },
    topicos: ["Teste"],
  };
}

describe("POST /api/progress/archive-all", () => {
  it("sem sessão devolve 401", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(new Request("http://localhost/api/progress/archive-all", { method: "POST" }));
    expect(resposta.status).toBe(401);
  });

  it("com sessão arquiva todas as rodadas do usuário e devolve 200", async () => {
    const id1 = await criarRodada(pool, { userId, questoes: [questaoFake()], modo: "pratica", limiteSegundos: null });
    const id2 = await criarRodada(pool, { userId, questoes: [questaoFake()], modo: "pratica", limiteSegundos: null });

    const { POST } = await import("./route");
    const resposta = await POST(
      new Request("http://localhost/api/progress/archive-all", {
        method: "POST",
        headers: { cookie: cookieSessaoTeste(userId) },
      }),
    );

    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.arquivadas).toBe(true);

    const resultado = await pool.query<{ arquivada: boolean }>(
      "SELECT arquivada FROM rodadas WHERE id = ANY($1)",
      [[id1, id2]],
    );
    expect(resultado.rows.every((r) => r.arquivada)).toBe(true);
  });

  it("não arquiva rodadas de outro usuário", async () => {
    const idOutro = await criarRodada(pool, { userId: outroUsuarioId, questoes: [questaoFake()], modo: "pratica", limiteSegundos: null });

    const { POST } = await import("./route");
    await POST(
      new Request("http://localhost/api/progress/archive-all", {
        method: "POST",
        headers: { cookie: cookieSessaoTeste(userId) },
      }),
    );

    const resultado = await pool.query<{ arquivada: boolean }>(
      "SELECT arquivada FROM rodadas WHERE id = $1",
      [idOutro],
    );
    expect(resultado.rows[0].arquivada).toBe(false);
  });
});
