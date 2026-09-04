import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

let diretorioTemporario: string;

// Redireciona a conexão singleton (src/db/conexao.ts) para um arquivo
// temporário ANTES de qualquer chamada a obterConexao() (que só acontece
// dentro do handler POST, nunca em tempo de import) — isolando os testes
// deste arquivo do banco de desenvolvimento real.
beforeAll(() => {
  diretorioTemporario = mkdtempSync(join(tmpdir(), "simulador-api-rodadas-test-"));
  process.env.SIMULADOR_DB_PATH = join(diretorioTemporario, "teste.db");
});

afterAll(() => {
  rmSync(diretorioTemporario, { recursive: true, force: true });
  delete process.env.SIMULADOR_DB_PATH;
});

function requisicao(corpo: unknown): Request {
  return new Request("http://localhost/api/rodadas", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(corpo),
  });
}

describe("POST /api/rodadas", () => {
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
        headers: { "content-type": "application/json" },
        body: "{ isso não é json",
      }),
    );
    expect(resposta.status).toBe(400);
  });
});
