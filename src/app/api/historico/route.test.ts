import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { Questao } from "@/lib/parser/tipos";

let diretorioTemporario: string;

beforeAll(() => {
  diretorioTemporario = mkdtempSync(join(tmpdir(), "simulador-api-historico-test-"));
  process.env.SIMULADOR_DB_PATH = join(diretorioTemporario, "teste.db");
});

afterAll(() => {
  rmSync(diretorioTemporario, { recursive: true, force: true });
  delete process.env.SIMULADOR_DB_PATH;
});

function questaoFake(numero: number, correta: "A" | "B" | "C" | "D" = "A"): Questao {
  return {
    origem: `simulado_${numero}`,
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

async function rodadaFinalizada(questoes: Questao[]) {
  const { obterConexao } = await import("@/db/conexao");
  const { criarRodada, carregarRodada, salvarRodada } = await import("@/db/repositorioRodadas");
  const { encerrar, iniciar, criarRodada: criarEstado } = await import("@/domain/rodada");
  const db = obterConexao();
  const id = criarRodada(db, { questoes, modo: "pratica", limiteSegundos: null });
  const relogio = () => 10;
  let estado = iniciar(criarEstado(questoes, { embaralhar: false }), relogio);
  estado = encerrar(estado, relogio);
  salvarRodada(db, id, estado, relogio);
  return id;
}

async function rodadaEmAndamento(questoes: Questao[]) {
  const { obterConexao } = await import("@/db/conexao");
  const { criarRodada } = await import("@/db/repositorioRodadas");
  return criarRodada(obterConexao(), { questoes, modo: "pratica", limiteSegundos: null });
}

describe("GET /api/historico", () => {
  it("lista só rodadas finalizadas, não as em andamento", async () => {
    const idFinalizada = await rodadaFinalizada([questaoFake(1, "A")]);
    await rodadaEmAndamento([questaoFake(2, "B")]);

    const { GET } = await import("./route");
    const resposta = await GET();
    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.entradas.some((e: { id: number }) => e.id === idFinalizada)).toBe(true);
    expect(corpo.entradas.every((e: { id: number }) => e.id !== undefined)).toBe(true);
  });
});

describe("GET /api/historico/:id", () => {
  it("devolve o detalhe completo, com resposta certa e explicações", async () => {
    const id = await rodadaFinalizada([questaoFake(10, "C"), questaoFake(11, "D")]);
    const { GET } = await import("./[id]/route");
    const resposta = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ id: String(id) }),
    });
    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.id).toBe(id);
    expect(corpo.questoes[0].correta).toBe("C");
    expect(corpo.questoes[0].explicacoes.C).toBeTruthy();
    expect(corpo.placar.total).toBe(2);
  });

  it("rodada ainda em andamento devolve 409, não vaza o detalhe", async () => {
    const id = await rodadaEmAndamento([questaoFake(20, "A")]);
    const { GET } = await import("./[id]/route");
    const resposta = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ id: String(id) }),
    });
    expect(resposta.status).toBe(409);
  });

  it("id inexistente devolve 404", async () => {
    const { GET } = await import("./[id]/route");
    const resposta = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ id: "999999" }),
    });
    expect(resposta.status).toBe(404);
  });
});
