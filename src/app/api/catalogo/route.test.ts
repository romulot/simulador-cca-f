import { describe, expect, it } from "vitest";

describe("GET /api/catalogo", () => {
  it("agrupa o corpus real em 5 domínios, todos válidos, somando 240 questões", async () => {
    const { GET } = await import("./route");
    const resposta = await GET();
    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();

    expect(corpo.grupos.map((g: { grupo: string }) => g.grupo)).toEqual([
      "Domínio 1",
      "Domínio 2",
      "Domínio 3",
      "Domínio 4",
      "Domínio 5",
    ]);
    expect(corpo.totais.pares).toBe(35);
    expect(corpo.totais.paresValidos).toBe(35);
    expect(corpo.totais.questoes).toBe(240);

    // Nunca deve vazar texto de questão — só contagens.
    const primeiroPar = corpo.grupos[0].pares[0];
    expect(primeiroPar).not.toHaveProperty("questoes");
    expect(primeiroPar).not.toHaveProperty("enunciado");
    expect(typeof primeiroPar.totalQuestoes).toBe("number");
  });
});
