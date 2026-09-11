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
    explicacoes: { A: "a", B: "b", C: "c", D: "d" },
    metadados: {
      bloom: "Aplicar",
      dificuldade: "Médio",
      rubrica: "rubrica",
      cenario: "cenário",
      principioTestado: "princípio",
    },
    topicos: ["Teste"],
  };
}

function requisicao(url: string, dono = userId): Request {
  return new Request(url, { headers: { cookie: cookieSessaoTeste(dono) } });
}

describe("GET /api/rodadas/:id", () => {
  it("sem sessão devolve 401", async () => {
    const { GET } = await import("./route");
    const resposta = await GET(new Request("http://localhost/api/rodadas/1"), {
      params: Promise.resolve({ id: "1" }),
    });
    expect(resposta.status).toBe(401);
  });

  it("devolve o estado atual de uma rodada em andamento, sem vazar a resposta certa", async () => {
    const { obterConexao } = await import("@/db/conexao");
    const { criarRodada } = await import("@/db/repositorioRodadas");
    const { GET } = await import("./route");

    const db = await obterConexao();
    const id = await criarRodada(db, {
      userId,
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
    expect(corpo.composicao).toEqual({ cotas: null, disponivel: null, deficit: null });
  });

  it("rodada de outro usuário devolve 404, igual a inexistente", async () => {
    const { obterConexao } = await import("@/db/conexao");
    const { criarRodada } = await import("@/db/repositorioRodadas");
    const { GET } = await import("./route");

    const db = await obterConexao();
    const id = await criarRodada(db, {
      userId,
      questoes: [questaoFake(1)],
      modo: "pratica",
      limiteSegundos: null,
    });

    const resposta = await GET(requisicao(`http://localhost/api/rodadas/${id}`, outroUsuarioId), {
      params: Promise.resolve({ id: String(id) }),
    });
    expect(resposta.status).toBe(404);
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
