import { describe, expect, it } from "vitest";

function requisicao(curso?: string): Request {
  const url = curso ? `http://localhost/api/catalogo?curso=${curso}` : "http://localhost/api/catalogo";
  return new Request(url);
}

describe("GET /api/catalogo", () => {
  it("sem 'curso' (default curso-antigo), agrupa o corpus real por domínio, com contagens corretas", async () => {
    const { GET } = await import("./route");
    const resposta = await GET(requisicao());
    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();

    const nomesDominio = corpo.grupos
      .map((g: { grupo: string }) => g.grupo)
      .filter((g: string) => g.startsWith("Domínio"));
    expect(nomesDominio).toEqual(["Domínio 1", "Domínio 2", "Domínio 3", "Domínio 4", "Domínio 5"]);

    // Nunca deve vazar texto de questão — só contagens.
    const primeiroPar = corpo.grupos[0].pares[0];
    expect(primeiroPar).not.toHaveProperty("questoes");
    expect(primeiroPar).not.toHaveProperty("enunciado");
    expect(typeof primeiroPar.totalQuestoes).toBe("number");
  });

  it("'curso: \"exame-avancado\"' devolve um único grupo agregado, sem nome de par nem grupo ligado a domínio", async () => {
    const { GET } = await import("./route");
    const resposta = await GET(requisicao("exame-avancado"));
    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();

    expect(corpo.grupos).toHaveLength(1);
    expect(corpo.grupos[0].grupo).toBe("Exame Avançado");
    expect(corpo.grupos[0].pares).toHaveLength(1);
    expect(corpo.grupos[0].pares[0].nome).not.toMatch(/dominio/);
    expect(corpo.grupos[0].pares[0].totalQuestoes).toBe(300);
    expect(corpo.totais.questoes).toBe(300);
  });

  it("'curso' desconhecido retorna 400", async () => {
    const { GET } = await import("./route");
    const resposta = await GET(requisicao("curso-secreto"));
    expect(resposta.status).toBe(400);
  });
});
