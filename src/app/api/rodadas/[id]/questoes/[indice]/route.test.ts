import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { Questao } from "@/lib/parser/tipos";

let diretorioTemporario: string;

beforeAll(() => {
  diretorioTemporario = mkdtempSync(join(tmpdir(), "simulador-api-questoes-test-"));
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

async function novaRodada(questoes: Questao[], limiteSegundos: number | null = null) {
  const { obterConexao } = await import("@/db/conexao");
  const { criarRodada } = await import("@/db/repositorioRodadas");
  const db = obterConexao();
  const id = criarRodada(db, { questoes, modo: "pratica", limiteSegundos });
  return { db, id };
}

function post(url: string, corpo: unknown): Request {
  return new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
}

describe("GET /api/rodadas/:id/questoes/:indice", () => {
  it("leitura pura: não move o índice nem acumula tempo", async () => {
    const { id } = await novaRodada([questaoFake(1, "A"), questaoFake(2, "B")]);
    const { GET } = await import("./route");

    const resposta = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ id: String(id), indice: "1" }),
    });
    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.questao.posicao).toBe(1);
    expect(corpo.resposta).toBeNull();
    expect(corpo.questao).not.toHaveProperty("correta");
  });

  it("índice fora da faixa devolve 400", async () => {
    const { id } = await novaRodada([questaoFake(1)]);
    const { GET } = await import("./route");
    const resposta = await GET(new Request("http://localhost"), {
      params: Promise.resolve({ id: String(id), indice: "5" }),
    });
    expect(resposta.status).toBe(400);
  });
});

describe("POST /api/rodadas/:id/questoes/:indice — responder", () => {
  it("grava a resposta, acumula segundosGastos e avança para a próxima", async () => {
    const { id } = await novaRodada([questaoFake(1, "A"), questaoFake(2, "B")]);
    const { POST } = await import("./route");

    const resposta = await POST(
      post("http://localhost", { resposta: "A", segundosGastos: 12.5 }),
      { params: Promise.resolve({ id: String(id), indice: "0" }) },
    );

    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.indiceAtual).toBe(1);
    expect(corpo.respostas).toEqual(["A", null]);
    expect(corpo.questaoAtual.posicao).toBe(1);

    // Confirma que o tempo foi mesmo persistido (não só devolvido).
    const { carregarRodada } = await import("@/db/repositorioRodadas");
    const { obterConexao } = await import("@/db/conexao");
    const persistida = carregarRodada(obterConexao(), id)!;
    expect(persistida.estado.tempos[0]).toBeCloseTo(12.5);
  });

  it("rejeita agir sobre um índice que não é o atual do servidor (409)", async () => {
    const { id } = await novaRodada([questaoFake(1, "A"), questaoFake(2, "B")]);
    const { POST } = await import("./route");

    // O índice atual do servidor é 0; tentar responder na posição 1 deve
    // ser rejeitado (evita ação sobre posição que o servidor já passou).
    const resposta = await POST(post("http://localhost", { resposta: "A", segundosGastos: 1 }), {
      params: Promise.resolve({ id: String(id), indice: "1" }),
    });
    expect(resposta.status).toBe(409);
  });

  it("resposta inválida (fora de A-D) devolve 400", async () => {
    const { id } = await novaRodada([questaoFake(1)]);
    const { POST } = await import("./route");
    const resposta = await POST(
      post("http://localhost", { resposta: "Z", segundosGastos: 1 }),
      { params: Promise.resolve({ id: String(id), indice: "0" }) },
    );
    expect(resposta.status).toBe(400);
  });

  it("sem 'resposta' nem 'destino' devolve 400", async () => {
    const { id } = await novaRodada([questaoFake(1)]);
    const { POST } = await import("./route");
    const resposta = await POST(post("http://localhost", { segundosGastos: 1 }), {
      params: Promise.resolve({ id: String(id), indice: "0" }),
    });
    expect(resposta.status).toBe(400);
  });
});

describe("POST /api/rodadas/:id/questoes/:indice — navegar", () => {
  it("move para 'destino' sem gravar resposta", async () => {
    const { id } = await novaRodada([questaoFake(1), questaoFake(2), questaoFake(3)]);
    const { POST } = await import("./route");

    const resposta = await POST(
      post("http://localhost", { destino: 2, segundosGastos: 3 }),
      { params: Promise.resolve({ id: String(id), indice: "0" }) },
    );
    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.indiceAtual).toBe(2);
    expect(corpo.respostas).toEqual([null, null, null]);
  });

  it("'destino' fora da faixa devolve 400, sem mover o índice", async () => {
    const { id } = await novaRodada([questaoFake(1), questaoFake(2)]);
    const { POST } = await import("./route");

    const resposta = await POST(
      post("http://localhost", { destino: 99, segundosGastos: 1 }),
      { params: Promise.resolve({ id: String(id), indice: "0" }) },
    );
    expect(resposta.status).toBe(400);

    const { carregarRodada } = await import("@/db/repositorioRodadas");
    const { obterConexao } = await import("@/db/conexao");
    expect(carregarRodada(obterConexao(), id)!.estado.indice).toBe(0);
  });
});

describe("POST /api/rodadas/:id/questoes/:indice — autoridade do tempo no servidor", () => {
  it("rejeita qualquer ação quando o limite de tempo da rodada já estourou, mesmo que o cliente ache que não", async () => {
    // Limite de 1 segundo: qualquer chamada feita "depois" já deveria ver
    // esgotado()=true, calculado a partir de iniciada_em no servidor —
    // nunca a partir do que o cliente reporta.
    const { id } = await novaRodada([questaoFake(1, "A"), questaoFake(2, "B")], 1);

    await new Promise((resolve) => setTimeout(resolve, 1100));

    const { POST } = await import("./route");
    const resposta = await POST(
      post("http://localhost", { resposta: "A", segundosGastos: 0.5 }),
      { params: Promise.resolve({ id: String(id), indice: "0" }) },
    );

    expect(resposta.status).toBe(409);

    // E a resposta realmente não foi gravada.
    const { carregarRodada } = await import("@/db/repositorioRodadas");
    const { obterConexao } = await import("@/db/conexao");
    expect(carregarRodada(obterConexao(), id)!.estado.respostas[0]).toBeNull();
  });
});
