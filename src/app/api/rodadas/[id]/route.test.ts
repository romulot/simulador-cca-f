import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { Questao } from "@/lib/parser/tipos";

let diretorioTemporario: string;

beforeAll(() => {
  diretorioTemporario = mkdtempSync(join(tmpdir(), "simulador-api-rodada-id-test-"));
  process.env.SIMULADOR_DB_PATH = join(diretorioTemporario, "teste.db");
});

afterAll(() => {
  rmSync(diretorioTemporario, { recursive: true, force: true });
  delete process.env.SIMULADOR_DB_PATH;
});

function questaoFake(numero: number, correta: "A" | "B" | "C" | "D" = "A"): Questao {
  return {
    origem: "teste_origem",
    dominio: 1,
    numero,
    enunciado: `Enunciado ${numero}`,
    alternativas: { A: "a", B: "b", C: "c", D: "d" },
    correta,
    resumo: "resumo",
    explicacoes: { A: "a", B: "b", C: "c", D: "d" },
    metadados: {
      bloom: "Aplicar",
      dificuldade: "Médio",
      rubrica: "rubrica",
      cenario: "cenário",
      principioTestado: "princípio",
    },
  };
}

function requisicao(url: string): Request {
  return new Request(url);
}

describe("GET /api/rodadas/:id", () => {
  it("devolve o estado atual de uma rodada em andamento, sem vazar a resposta certa", async () => {
    const { obterConexao } = await import("@/db/conexao");
    const { criarRodada } = await import("@/db/repositorioRodadas");
    const { GET } = await import("./route");

    const db = obterConexao();
    const id = criarRodada(db, {
      questoes: [questaoFake(1, "A"), questaoFake(2, "B")],
      modo: "pratica",
      limiteSegundos: null,
    });

    const resposta = await GET(requisicao(`http://localhost/api/rodadas/${id}`), {
      params: Promise.resolve({ id: String(id) }),
    });

    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.rodadaId).toBe(id);
    expect(corpo.status).toBe("em_andamento");
    expect(corpo.totalQuestoes).toBe(2);
    expect(corpo.indiceAtual).toBe(0);
    expect(corpo.respostas).toEqual([null, null]);
    expect(corpo.encerrada).toBe(false);
    expect(corpo.questaoAtual.posicao).toBe(0);
    expect(corpo.questaoAtual).not.toHaveProperty("correta");
  });

  it("id inexistente devolve 404", async () => {
    const { GET } = await import("./route");
    const resposta = await GET(requisicao("http://localhost/api/rodadas/999999"), {
      params: Promise.resolve({ id: "999999" }),
    });
    expect(resposta.status).toBe(404);
  });

  it("id inválido (não numérico) devolve 400", async () => {
    const { GET } = await import("./route");
    const resposta = await GET(requisicao("http://localhost/api/rodadas/abc"), {
      params: Promise.resolve({ id: "abc" }),
    });
    expect(resposta.status).toBe(400);
  });
});
