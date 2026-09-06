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

async function rodadaFinalizada(questoes: Questao[], dono = userId) {
  const { obterConexao } = await import("@/db/conexao");
  const { criarRodada, salvarRodada } = await import("@/db/repositorioRodadas");
  const { encerrar, iniciar, criarRodada: criarEstado } = await import("@/domain/rodada");
  const db = await obterConexao();
  const id = await criarRodada(db, { userId: dono, questoes, modo: "pratica", limiteSegundos: null });
  const relogio = () => 10;
  let estado = iniciar(criarEstado(questoes, { embaralhar: false }), relogio);
  estado = encerrar(estado, relogio);
  await salvarRodada(db, id, estado, relogio, dono);
  return id;
}

async function rodadaEmAndamento(questoes: Questao[], dono = userId) {
  const { obterConexao } = await import("@/db/conexao");
  const { criarRodada } = await import("@/db/repositorioRodadas");
  return criarRodada(await obterConexao(), { userId: dono, questoes, modo: "pratica", limiteSegundos: null });
}

function get(url: string, dono = userId): Request {
  return new Request(url, { headers: { cookie: cookieSessaoTeste(dono) } });
}

describe("GET /api/historico", () => {
  it("sem sessão devolve 401", async () => {
    const { GET } = await import("./route");
    const resposta = await GET(new Request("http://localhost"));
    expect(resposta.status).toBe(401);
  });

  it("lista só rodadas finalizadas, não as em andamento", async () => {
    const idFinalizada = await rodadaFinalizada([questaoFake(1, "A")]);
    await rodadaEmAndamento([questaoFake(2, "B")]);

    const { GET } = await import("./route");
    const resposta = await GET(get("http://localhost"));
    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.entradas.some((e: { id: number }) => e.id === idFinalizada)).toBe(true);
    expect(corpo.entradas.every((e: { id: number }) => e.id !== undefined)).toBe(true);
  });

  it("não lista rodadas finalizadas de outro usuário", async () => {
    await rodadaFinalizada([questaoFake(1, "A")], outroUsuarioId);

    const { GET } = await import("./route");
    const resposta = await GET(get("http://localhost"));
    const corpo = await resposta.json();
    expect(corpo.entradas).toEqual([]);
  });
});

describe("GET /api/historico/:id", () => {
  it("devolve o detalhe completo, com resposta certa e explicações", async () => {
    const id = await rodadaFinalizada([questaoFake(10, "C"), questaoFake(11, "D")]);
    const { GET } = await import("./[id]/route");
    const resposta = await GET(get("http://localhost"), {
      params: Promise.resolve({ id: String(id) }),
    });
    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.id).toBe(id);
    expect(corpo.questoes[0].correta).toBe("C");
    expect(corpo.questoes[0].explicacoes.C).toBeTruthy();
    expect(corpo.placar.total).toBe(2);
  });

  it("rodada de outro usuário devolve 404", async () => {
    const id = await rodadaFinalizada([questaoFake(30)], outroUsuarioId);
    const { GET } = await import("./[id]/route");
    const resposta = await GET(get("http://localhost"), {
      params: Promise.resolve({ id: String(id) }),
    });
    expect(resposta.status).toBe(404);
  });

  it("rodada ainda em andamento devolve 409, não vaza o detalhe", async () => {
    const id = await rodadaEmAndamento([questaoFake(20, "A")]);
    const { GET } = await import("./[id]/route");
    const resposta = await GET(get("http://localhost"), {
      params: Promise.resolve({ id: String(id) }),
    });
    expect(resposta.status).toBe(409);
  });

  it("id inexistente devolve 404", async () => {
    const { GET } = await import("./[id]/route");
    const resposta = await GET(get("http://localhost"), {
      params: Promise.resolve({ id: "999999" }),
    });
    expect(resposta.status).toBe(404);
  });
});
