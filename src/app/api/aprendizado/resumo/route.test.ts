import { beforeEach, describe, expect, it } from "vitest";

import type { Questao } from "@/lib/parser/tipos";
import { poolTeste, criarUsuarioTeste } from "@/db/apoioTeste";
import { cookieSessaoTeste } from "@/lib/auth/apoioTeste";

let userId: number;

beforeEach(async () => {
  const pool = await poolTeste();
  userId = await criarUsuarioTeste(pool);
});

function questaoFake(
  origem: string,
  numero: number,
  correta: "A" | "B" | "C" | "D",
  topicos: string[],
  dominio = 1,
): Questao {
  return {
    origem,
    dominio,
    numero,
    enunciado: `Enunciado ${origem}#${numero}`,
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
    topicos,
  };
}

async function rodadaFinalizada(questoes: Questao[], respostas: Array<"A" | "B" | "C" | "D">, dono = userId) {
  const { obterConexao } = await import("@/db/conexao");
  const { criarRodada, salvarRodada } = await import("@/db/repositorioRodadas");
  const { encerrar, iniciar, responder, criarRodada: criarEstado } = await import("@/domain/rodada");
  const db = await obterConexao();
  const id = await criarRodada(db, { userId: dono, questoes, modo: "pratica", limiteSegundos: null });
  const relogio = () => 10;
  let estado = iniciar(criarEstado(questoes, { embaralhar: false }), relogio);
  respostas.forEach((letra) => {
    estado = responder(estado, letra, relogio);
  });
  estado = encerrar(estado, relogio);
  await salvarRodada(db, id, estado, relogio, dono);
  return id;
}

function get(url: string, dono = userId): Request {
  return new Request(url, { headers: { cookie: cookieSessaoTeste(dono) } });
}

describe("GET /api/aprendizado/resumo", () => {
  it("sem sessão devolve 401", async () => {
    const { GET } = await import("./route");
    const resposta = await GET(new Request("http://localhost"));
    expect(resposta.status).toBe(401);
  });

  it("sem histórico nenhum, devolve listas vazias", async () => {
    const { GET } = await import("./route");
    const resposta = await GET(get("http://localhost"));
    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo).toEqual({
      dominios: [],
      emRevisao: 0,
      desempenhoGeral: null,
      pontosFortes: [],
      errosRecorrentes: [],
    });
  });

  it("marca um tópico como fraco só com respostas suficientes e abaixo do limiar", async () => {
    // "Hooks" (domínio 1): 1 acerto, 3 erros -> 25%, 4 respostas (>= mínimo).
    await rodadaFinalizada(
      [
        questaoFake("a", 1, "A", ["Hooks"]),
        questaoFake("a", 2, "A", ["Hooks"]),
        questaoFake("a", 3, "A", ["Hooks"]),
        questaoFake("a", 4, "A", ["Hooks"]),
      ],
      ["A", "B", "B", "B"],
    );

    const { GET } = await import("./route");
    const resposta = await GET(get("http://localhost"));
    const corpo = await resposta.json();

    expect(corpo.dominios).toHaveLength(1);
    expect(corpo.dominios[0].dominio).toBe(1);
    expect(corpo.dominios[0].topicosFracos).toHaveLength(1);
    expect(corpo.dominios[0].topicosFracos[0]).toMatchObject({
      topicoId: "hooks",
      nome: "Hooks",
      acertos: 1,
      erros: 3,
      totalRespondido: 4,
    });
    expect(corpo.dominios[0].topicosFracos[0].percentual).toBeCloseTo(25);
  });

  it("não marca tópico com poucas respostas, mesmo com 0%", async () => {
    await rodadaFinalizada(
      [questaoFake("a", 1, "A", ["Hooks"]), questaoFake("a", 2, "A", ["Hooks"])],
      ["B", "B"],
    );
    const { GET } = await import("./route");
    const corpo = await (await GET(get("http://localhost"))).json();
    expect(corpo.dominios).toEqual([]);
  });

  it("conta questões em revisão (última tentativa errada)", async () => {
    await rodadaFinalizada([questaoFake("a", 1, "A", ["Hooks"])], ["B"]);
    const { GET } = await import("./route");
    const corpo = await (await GET(get("http://localhost"))).json();
    expect(corpo.emRevisao).toBe(1);
  });

  it("não mistura dados de outro usuário", async () => {
    const outroUsuarioId = await criarUsuarioTeste(await poolTeste());
    await rodadaFinalizada(
      [questaoFake("a", 1, "A", ["Hooks"]), questaoFake("a", 2, "A", ["Hooks"]), questaoFake("a", 3, "A", ["Hooks"])],
      ["B", "B", "B"],
      outroUsuarioId,
    );
    const { GET } = await import("./route");
    const corpo = await (await GET(get("http://localhost"))).json();
    expect(corpo).toEqual({
      dominios: [],
      emRevisao: 0,
      desempenhoGeral: null,
      pontosFortes: [],
      errosRecorrentes: [],
    });
  });

  it("calcula desempenho geral sobre todas as respostas", async () => {
    await rodadaFinalizada(
      [questaoFake("a", 1, "A", ["Hooks"]), questaoFake("a", 2, "A", ["Hooks"])],
      ["A", "B"],
    );
    const { GET } = await import("./route");
    const corpo = await (await GET(get("http://localhost"))).json();
    expect(corpo.desempenhoGeral).toBeCloseTo(50);
  });

  it("marca ponto forte com respostas suficientes e percentual alto", async () => {
    await rodadaFinalizada(
      [
        questaoFake("a", 1, "A", ["Hooks"]),
        questaoFake("a", 2, "A", ["Hooks"]),
        questaoFake("a", 3, "A", ["Hooks"]),
      ],
      ["A", "A", "A"],
    );
    const { GET } = await import("./route");
    const corpo = await (await GET(get("http://localhost"))).json();
    expect(corpo.pontosFortes).toEqual([{ topicoId: "hooks", nome: "Hooks", percentual: 100 }]);
  });

  it("rodadas arquivadas não entram no resumo — emRevisao, desempenhoGeral e pontosFortes zeram", async () => {
    const id = await rodadaFinalizada(
      [questaoFake("a", 1, "A", ["Hooks"]), questaoFake("a", 2, "A", ["Hooks"])],
      ["B", "A"],
    );
    const pool = await poolTeste();
    await pool.query("UPDATE rodadas SET arquivada = TRUE WHERE id = $1", [id]);

    const { GET } = await import("./route");
    const corpo = await (await GET(get("http://localhost"))).json();
    expect(corpo).toEqual({
      dominios: [],
      emRevisao: 0,
      desempenhoGeral: null,
      pontosFortes: [],
      errosRecorrentes: [],
    });
  });

  it("marca dificuldade recorrente a partir de 3 erros no mesmo tópico", async () => {
    await rodadaFinalizada(
      [
        questaoFake("a", 1, "A", ["Hooks"]),
        questaoFake("a", 2, "A", ["Hooks"]),
        questaoFake("a", 3, "A", ["Hooks"]),
      ],
      ["B", "B", "B"],
    );
    const { GET } = await import("./route");
    const corpo = await (await GET(get("http://localhost"))).json();
    expect(corpo.errosRecorrentes).toEqual([
      { topicoId: "hooks", nome: "Hooks", dominio: 1, erros: 3, severidade: "recorrente" },
    ]);
  });
});
