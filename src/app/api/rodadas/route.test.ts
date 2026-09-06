import { beforeEach, describe, expect, it } from "vitest";

import { poolTeste, criarUsuarioTeste } from "@/db/apoioTeste";
import { cookieSessaoTeste } from "@/lib/auth/apoioTeste";

let userId: number;

beforeEach(async () => {
  const pool = await poolTeste();
  userId = await criarUsuarioTeste(pool);
});

function requisicao(corpo: unknown, cookie = cookieSessaoTeste(userId)): Request {
  return new Request("http://localhost/api/rodadas", {
    method: "POST",
    headers: { "content-type": "application/json", cookie },
    body: JSON.stringify(corpo),
  });
}

describe("POST /api/rodadas", () => {
  it("sem sessão devolve 401", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(
      new Request("http://localhost/api/rodadas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ modo: "prova" }),
      }),
    );
    expect(resposta.status).toBe(401);
  });

  it("modo pratica com pares válidos cria rodada com a soma exata de questões, sem vazar a resposta certa", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(
      requisicao({ modo: "pratica", pares: ["1.1_loop_agentico", "1.2_coordinator_subagent"] }),
    );

    expect(resposta.status).toBe(201);
    const corpo = await resposta.json();
    expect(corpo.modo).toBe("pratica");
    expect(typeof corpo.rodadaId).toBe("number");
    expect(corpo.totalQuestoes).toBe(12); // 6 + 6
    expect(corpo.limiteSegundos).toBeNull();
    expect(corpo.composicao).toBeNull();
    expect(corpo.questaoAtual.posicao).toBe(0);
    expect(corpo.questaoAtual).not.toHaveProperty("correta");
    expect(corpo.questaoAtual).not.toHaveProperty("explicacoes");
    expect(corpo.questaoAtual).not.toHaveProperty("resumo");
    expect(corpo.questaoAtual).not.toHaveProperty("metadados");
    expect(corpo.questaoAtual.alternativas.A).toBeTruthy();
  });

  it("modo pratica com par inexistente retorna 400", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(requisicao({ modo: "pratica", pares: ["nao_existe_de_verdade"] }));
    expect(resposta.status).toBe(400);
    const corpo = await resposta.json();
    expect(corpo.erro).toMatch(/nao_existe_de_verdade/);
  });

  it("modo pratica sem 'pares' (ou vazio) retorna 400", async () => {
    const { POST } = await import("./route");
    const semCampo = await POST(requisicao({ modo: "pratica" }));
    expect(semCampo.status).toBe(400);

    const vazio = await POST(requisicao({ modo: "pratica", pares: [] }));
    expect(vazio.status).toBe(400);
  });

  it("modo prova sorteia 60 questões pelos pesos oficiais, com limite de tempo e composição", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(requisicao({ modo: "prova" }));

    expect(resposta.status).toBe(201);
    const corpo = await resposta.json();
    expect(corpo.modo).toBe("prova");
    expect(corpo.totalQuestoes).toBe(60);
    expect(corpo.limiteSegundos).toBe(120 * 60);
    expect(corpo.composicao).not.toBeNull();
    expect(corpo.composicao.deficit).toEqual({}); // corpus atual é farto o suficiente pra cota
    const somaCotas = Object.values(corpo.composicao.cotas as Record<string, number>).reduce(
      (a, b) => a + b,
      0,
    );
    expect(somaCotas).toBe(60);
  });

  it("modo pratica com 'topicoId' seleciona só questões daquele tópico", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(requisicao({ modo: "pratica", topicoId: "hooks", quantidade: 3 }));

    expect(resposta.status).toBe(201);
    const corpo = await resposta.json();
    expect(corpo.modo).toBe("pratica");
    expect(corpo.totalQuestoes).toBeLessThanOrEqual(3);
    expect(corpo.totalQuestoes).toBeGreaterThan(0);
    expect(corpo.limiteSegundos).toBeNull();
  });

  it("modo pratica com 'topicoId' desconhecido retorna 400", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(requisicao({ modo: "pratica", topicoId: "topico-que-nao-existe" }));
    expect(resposta.status).toBe(400);
  });

  it("modo pratica com 'topicoId' e 'quantidade' inválida (0 ou negativa) retorna 400", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(requisicao({ modo: "pratica", topicoId: "hooks", quantidade: 0 }));
    expect(resposta.status).toBe(400);
  });

  it("modo pratica com mais de uma forma de seleção (pares + topicoId) retorna 400", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(
      requisicao({ modo: "pratica", pares: ["1.1_loop_agentico"], topicoId: "hooks" }),
    );
    expect(resposta.status).toBe(400);
  });

  it("modo pratica com 'revisao' sem nenhuma questão errada anteriormente retorna 422", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(requisicao({ modo: "pratica", revisao: true }));
    expect(resposta.status).toBe(422);
  });

  it("modo pratica com 'revisao' seleciona questão cuja última tentativa foi errada", async () => {
    const { descobrir } = await import("@/lib/catalogo");
    const { criarRodada: criarRodadaPersistida, salvarRodada } = await import("@/db/repositorioRodadas");
    const { criarRodada: criarEstado, iniciar, responder, encerrar } = await import("@/domain/rodada");
    const { obterConexao } = await import("@/db/conexao");

    const par = descobrir().find((p) => p.erro === null)!;
    const questao = par.questoes[0];
    const errada = (["A", "B", "C", "D"] as const).find((l) => l !== questao.correta)!;

    const db = await obterConexao();
    const id = await criarRodadaPersistida(db, {
      userId,
      questoes: [questao],
      modo: "pratica",
      limiteSegundos: null,
    });
    const relogio = () => 10;
    let estado = iniciar(criarEstado([questao], { embaralhar: false }), relogio);
    estado = responder(estado, errada, relogio);
    estado = encerrar(estado, relogio);
    await salvarRodada(db, id, estado, relogio, userId);

    const { POST } = await import("./route");
    const respostaRevisao = await POST(requisicao({ modo: "pratica", revisao: true }));
    expect(respostaRevisao.status).toBe(201);
    const corpo = await respostaRevisao.json();
    expect(corpo.totalQuestoes).toBe(1);
  });

  it("'modo' ausente ou inválido retorna 400", async () => {
    const { POST } = await import("./route");
    const ausente = await POST(requisicao({}));
    expect(ausente.status).toBe(400);

    const invalido = await POST(requisicao({ modo: "turbo" }));
    expect(invalido.status).toBe(400);
  });

  it("corpo que não é JSON válido retorna 400 em vez de derrubar a rota", async () => {
    const { POST } = await import("./route");
    const resposta = await POST(
      new Request("http://localhost/api/rodadas", {
        method: "POST",
        headers: { "content-type": "application/json", cookie: cookieSessaoTeste(userId) },
        body: "{ isso não é json",
      }),
    );
    expect(resposta.status).toBe(400);
  });
});
