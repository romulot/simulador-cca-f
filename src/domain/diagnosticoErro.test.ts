import { describe, expect, it } from "vitest";
import { diagnosticarErros, type QuestaoParaDiagnostico } from "./diagnosticoErro";

function questao(parcial: Partial<QuestaoParaDiagnostico> & { posicao: number }): QuestaoParaDiagnostico {
  return { segundos: 10, resposta: "A", correta: "A", ...parcial };
}

describe("diagnosticarErros", () => {
  it("rodada vazia não lança e não tem erro", () => {
    expect(diagnosticarErros([])).toEqual({
      mediaSegundos: 0,
      erros: [],
      fadiga: false,
      sinalGeral: null,
    });
  });

  it("classifica erro acima da média como conceito", () => {
    const questoes = [
      questao({ posicao: 0, segundos: 10, resposta: "A", correta: "A" }),
      questao({ posicao: 1, segundos: 10, resposta: "A", correta: "A" }),
      questao({ posicao: 2, segundos: 40, resposta: "B", correta: "A" }), // média=20, 40>20
    ];
    const d = diagnosticarErros(questoes);
    expect(d.mediaSegundos).toBeCloseTo(20);
    expect(d.erros).toEqual([{ posicao: 2, segundos: 40, classificacao: "conceito" }]);
    expect(d.sinalGeral).toBe("todas_conceito");
  });

  it("classifica erro na média ou abaixo como desatenção", () => {
    const questoes = [
      questao({ posicao: 0, segundos: 30, resposta: "A", correta: "A" }),
      questao({ posicao: 1, segundos: 30, resposta: "A", correta: "A" }),
      questao({ posicao: 2, segundos: 0, resposta: "B", correta: "A" }), // média=20, 0<=20
    ];
    const d = diagnosticarErros(questoes);
    expect(d.erros).toEqual([{ posicao: 2, segundos: 0, classificacao: "desatencao" }]);
    expect(d.sinalGeral).toBe("todas_desatencao");
  });

  it("tempo igual à média conta como desatenção (limite não-inclusivo do lado conceito)", () => {
    const questoes = [
      questao({ posicao: 0, segundos: 20, resposta: "A", correta: "A" }),
      questao({ posicao: 1, segundos: 20, resposta: "B", correta: "A" }),
    ];
    const d = diagnosticarErros(questoes);
    expect(d.erros[0].classificacao).toBe("desatencao");
  });

  it("questão em branco (resposta null) não vira erro, mas conta na média", () => {
    const questoes = [
      questao({ posicao: 0, segundos: 100, resposta: null, correta: "A" }),
      questao({ posicao: 1, segundos: 0, resposta: "A", correta: "A" }),
    ];
    const d = diagnosticarErros(questoes);
    expect(d.erros).toEqual([]);
    expect(d.mediaSegundos).toBeCloseTo(50);
  });

  it("sinalGeral é null quando os erros se dividem entre as duas causas", () => {
    const questoes = [
      questao({ posicao: 0, segundos: 10, resposta: "A", correta: "A" }),
      questao({ posicao: 1, segundos: 10, resposta: "A", correta: "A" }),
      questao({ posicao: 2, segundos: 100, resposta: "B", correta: "A" }), // conceito
      questao({ posicao: 3, segundos: 0, resposta: "B", correta: "A" }), // desatenção
    ];
    const d = diagnosticarErros(questoes);
    expect(d.sinalGeral).toBeNull();
  });

  it("sinaliza fadiga quando mais de 1/4 das questões passam de 2x a média", () => {
    // 5 questões, média = (10+10+10+10+100)/5 = 28; 2x média = 56.
    // Só a última (100) passa de 56 -> 1 questão lenta, limite = floor(5/4) = 1.
    // 1 > 1 é falso -> sem fadiga ainda.
    const semFadiga = diagnosticarErros([
      questao({ posicao: 0, segundos: 10 }),
      questao({ posicao: 1, segundos: 10 }),
      questao({ posicao: 2, segundos: 10 }),
      questao({ posicao: 3, segundos: 10 }),
      questao({ posicao: 4, segundos: 100 }),
    ]);
    expect(semFadiga.fadiga).toBe(false);

    // 8 questões, 3 bem acima de 2x a média -> limite = floor(8/4) = 2; 3 > 2 -> fadiga.
    const comFadiga = diagnosticarErros([
      questao({ posicao: 0, segundos: 10 }),
      questao({ posicao: 1, segundos: 10 }),
      questao({ posicao: 2, segundos: 10 }),
      questao({ posicao: 3, segundos: 10 }),
      questao({ posicao: 4, segundos: 10 }),
      questao({ posicao: 5, segundos: 90 }),
      questao({ posicao: 6, segundos: 90 }),
      questao({ posicao: 7, segundos: 90 }),
    ]);
    expect(comFadiga.fadiga).toBe(true);
  });
});
