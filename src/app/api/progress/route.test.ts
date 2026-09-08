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

describe("DELETE /api/progress", () => {
  it("sem sessão devolve 401", async () => {
    const { DELETE } = await import("./route");
    const resposta = await DELETE(new Request("http://localhost/api/progress", { method: "DELETE" }));
    expect(resposta.status).toBe(401);
  });

  it("com sessão apaga todas as rodadas e questoes_rodada do usuário e devolve 200", async () => {
    const id = await criarRodada(pool, { userId, questoes: [questaoFake()], modo: "pratica", limiteSegundos: null });

    const { DELETE } = await import("./route");
    const resposta = await DELETE(
      new Request("http://localhost/api/progress", {
        method: "DELETE",
        headers: { cookie: cookieSessaoTeste(userId) },
      }),
    );

    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.deletadas).toBe(true);

    const rodadas = await pool.query("SELECT id FROM rodadas WHERE user_id = $1", [userId]);
    expect(rodadas.rows).toHaveLength(0);

    const questoes = await pool.query("SELECT rodada_id FROM questoes_rodada WHERE rodada_id = $1", [id]);
    expect(questoes.rows).toHaveLength(0);
  });

  it("não apaga rodadas de outro usuário", async () => {
    const idOutro = await criarRodada(pool, { userId: outroUsuarioId, questoes: [questaoFake()], modo: "pratica", limiteSegundos: null });

    const { DELETE } = await import("./route");
    await DELETE(
      new Request("http://localhost/api/progress", {
        method: "DELETE",
        headers: { cookie: cookieSessaoTeste(userId) },
      }),
    );

    const resultado = await pool.query<{ id: number }>("SELECT id FROM rodadas WHERE id = $1", [idOutro]);
    expect(resultado.rows).toHaveLength(1);
  });
});
