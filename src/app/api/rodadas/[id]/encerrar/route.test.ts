import { beforeEach, describe, expect, it } from "vitest";

import type { Questao } from "@/lib/parser/tipos";
import { poolTeste, criarUsuarioTeste } from "@/db/apoioTeste";
import { cookieSessaoTeste } from "@/lib/auth/apoioTeste";

let userId: number;
let outroUsuarioId: number;

beforeEach(async () => {
  const pool = await poolTeste();
  userId = await criarUsuarioTeste(pool);
  outroUsuarioId = await criarUsuarioTeste(pool);
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
    explicacoes: { A: "expl a", B: "expl b", C: "expl c", D: "expl d" },
    metadados: {
      bloom: "Aplicar",
      dificuldade: "Médio",
      rubrica: "rubrica",
      cenario: "cenário",
      principioTestado: "princípio",
    },
  };
}

async function novaRodada(questoes: Questao[], limiteSegundos: number | null = null, dono = userId) {
  const { obterConexao } = await import("@/db/conexao");
  const { criarRodada } = await import("@/db/repositorioRodadas");
  const db = await obterConexao();
  const id = await criarRodada(db, { userId: dono, questoes, modo: "pratica", limiteSegundos });
  return { db, id };
}

function post(corpo?: unknown, dono = userId): Request {
  return new Request("http://localhost", {
    method: "POST",
    headers: {
      ...(corpo !== undefined ? { "content-type": "application/json" } : {}),
      cookie: cookieSessaoTeste(dono),
    },
    body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
  });
}

describe("POST /api/rodadas/:id/encerrar", () => {
  it("encerra e devolve o detalhe completo, com resposta certa e explicações reveladas", async () => {
    const { id } = await novaRodada([questaoFake(1, "A"), questaoFake(2, "B")]);
    const { POST } = await import("./route");

    const resposta = await POST(post(), { params: Promise.resolve({ id: String(id) }) });

    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.id).toBe(id);
    expect(corpo.placar.total).toBe(2);
    expect(corpo.placar.respondidas).toBe(0);
    expect(corpo.placar.emBranco).toBe(2);
    expect(corpo.questoes).toHaveLength(2);
    expect(corpo.questoes[0].correta).toBe("A"); // agora pode revelar
    expect(corpo.questoes[0].explicacoes.A).toBeTruthy();
  });

  it("rodada de outro usuário devolve 404", async () => {
    const { id } = await novaRodada([questaoFake(1)]);
    const { POST } = await import("./route");
    const resposta = await POST(post(undefined, outroUsuarioId), {
      params: Promise.resolve({ id: String(id) }),
    });
    expect(resposta.status).toBe(404);
  });

  it("é idempotente: chamar duas vezes não muda o placar nem o tempo persistido", async () => {
    const { id } = await novaRodada([questaoFake(1, "A")]);
    const { POST } = await import("./route");

    const primeira = await POST(post({ segundosGastos: 30 }), {
      params: Promise.resolve({ id: String(id) }),
    });
    const corpoPrimeira = await primeira.json();

    const segunda = await POST(post({ segundosGastos: 999 }), {
      params: Promise.resolve({ id: String(id) }),
    });
    const corpoSegunda = await segunda.json();

    expect(corpoSegunda.placar.tempoTotal).toBeCloseTo(corpoPrimeira.placar.tempoTotal);
    expect(corpoSegunda.questoes[0].segundos).toBeCloseTo(corpoPrimeira.questoes[0].segundos);
  });

  it("acumula 'segundosGastos' na questão atual antes de encerrar", async () => {
    const { id } = await novaRodada([questaoFake(1, "A"), questaoFake(2, "B")]);
    const { POST } = await import("./route");

    const resposta = await POST(post({ segundosGastos: 42 }), {
      params: Promise.resolve({ id: String(id) }),
    });
    const corpo = await resposta.json();
    expect(corpo.questoes[0].segundos).toBeCloseTo(42);
  });

  it("id inexistente devolve 404", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(post(), { params: Promise.resolve({ id: "999999" }) });
    expect(resposta.status).toBe(404);
  });

  it("encerra mesmo com questões em branco (sem exigir tudoRespondido)", async () => {
    const { id } = await novaRodada([questaoFake(1), questaoFake(2), questaoFake(3)]);
    const { POST } = await import("./route");
    const resposta = await POST(post(), { params: Promise.resolve({ id: String(id) }) });
    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.placar.emBranco).toBe(3);
  });

  it("corpo malformado devolve 400 em vez de derrubar a rota", async () => {
    const { id } = await novaRodada([questaoFake(1)]);
    const { POST } = await import("./route");
    const resposta = await POST(
      new Request("http://localhost", {
        method: "POST",
        headers: { "content-type": "application/json", cookie: cookieSessaoTeste(userId) },
        body: "{ nao é json",
      }),
      { params: Promise.resolve({ id: String(id) }) },
    );
    expect(resposta.status).toBe(400);
  });
});
