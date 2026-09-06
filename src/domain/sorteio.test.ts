import { describe, it, expect } from "vitest";

import { cotas, pool, sortear, PESOS, TOTAL_PROVA, type Rng } from "./sorteio";
import type { Questao } from "@/lib/parser/tipos";

/** RNG determinístico (LCG) só para os testes: mesma semente, mesma
 * sequência, mesma saída de `sortear` -- é a propriedade que "reprodutível"
 * exige.
 */
function rngDeterministico(semente: number): Rng {
  let estado = semente >>> 0;
  return () => {
    estado = (estado * 1664525 + 1013904223) >>> 0;
    return estado / 2 ** 32;
  };
}

function questaoFake(dominio: number | null, numero: number): Questao {
  return {
    origem: `dominio-${dominio ?? "x"}_teste`,
    dominio,
    numero,
    enunciado: `Enunciado ${numero}`,
    alternativas: { A: "a", B: "b", C: "c", D: "d" },
    correta: "A",
    resumo: "resumo",
    explicacoes: { A: "a", B: "b", C: "c", D: "d" },
    metadados: {
      bloom: "lembrar",
      dificuldade: "facil",
      rubrica: "rubrica",
      cenario: "cenario",
      principioTestado: "principio",
    },
    topicos: ["teste"],
  };
}

/** Pool "farto": 30 questões por domínio, mais que qualquer cota exige. */
function poolFarto(): Record<number, Questao[]> {
  const questoes: Questao[] = [];
  for (const dominio of [1, 2, 3, 4, 5]) {
    for (let n = 1; n <= 30; n++) {
      questoes.push(questaoFake(dominio, n));
    }
  }
  return pool(questoes);
}

describe("cotas", () => {
  it("soma exatamente o total pedido", () => {
    const alvo = cotas(PESOS, TOTAL_PROVA);
    const soma = Object.values(alvo).reduce((a, b) => a + b, 0);
    expect(soma).toBe(60);
  });

  it("distribui o resto pelo maior resto fracionário (D2 ganha a sobra)", () => {
    const alvo = cotas(PESOS, TOTAL_PROVA);
    // 16,2 / 10,8 / 12 / 12 / 9 -> pisos somam 59, sobra 1 para D2 (0,8)
    expect(alvo).toEqual({ 1: 16, 2: 11, 3: 12, 4: 12, 5: 9 });
  });

  it("lança erro para tabela de pesos com soma <= 0", () => {
    expect(() => cotas({ 1: 0, 2: 0 }, 60)).toThrow();
    expect(() => cotas({ 1: -3, 2: -3, 3: 10 }, 60)).toThrow();
  });

  it("com apenas 1 domínio em 100% do peso, atribui todo o total", () => {
    const pesosUnicos = { 1: 100 };
    const alvo = cotas(pesosUnicos, 60);
    expect(alvo).toEqual({ 1: 60 });
    expect(Object.values(alvo).reduce((a, b) => a + b, 0)).toBe(60);
  });
});

describe("pool", () => {
  it("agrupa por domínio e ignora questões com dominio null", () => {
    const questoes = [
      questaoFake(1, 1),
      questaoFake(1, 2),
      questaoFake(2, 1),
      questaoFake(null, 1),
    ];
    const agrupado = pool(questoes);
    expect(agrupado[1]).toHaveLength(2);
    expect(agrupado[2]).toHaveLength(1);
    expect(agrupado[3]).toBeUndefined();
  });
});

describe("sortear", () => {
  it("é reprodutível: mesma entrada + mesmo RNG produz a mesma saída", () => {
    const p = poolFarto();
    const resultado1 = sortear(p, rngDeterministico(42));
    const resultado2 = sortear(p, rngDeterministico(42));

    expect(resultado2.porDominio).toEqual(resultado1.porDominio);
    expect(resultado2.questoes.map((q) => `${q.dominio}-${q.numero}`)).toEqual(
      resultado1.questoes.map((q) => `${q.dominio}-${q.numero}`),
    );
  });

  it("com pool farto, sorteia exatamente 60 questões e sem déficit", () => {
    const p = poolFarto();
    const resultado = sortear(p, rngDeterministico(7));

    expect(resultado.questoes).toHaveLength(60);
    expect(resultado.deficit).toEqual({});
  });

  it("domínio com pool menor que a cota gera déficit e NÃO é compensado por outro domínio", () => {
    const p = poolFarto();
    // D2 pede cota 11 (ver teste de cotas acima); deixamos só 3 disponíveis.
    p[2] = p[2].slice(0, 3);

    const resultado = sortear(p, rngDeterministico(1));

    expect(resultado.deficit[2]).toBe(8); // 11 - 3
    expect(resultado.porDominio[2]).toBe(3);

    const totalSorteado = resultado.questoes.length;
    expect(totalSorteado).toBeLessThan(60);
    // conferindo que não foi "compensado": a soma esperada é 60 - 8
    expect(totalSorteado).toBe(52);
  });

  it("domínio com 0 questões disponíveis registra déficit = cota inteira", () => {
    const p = poolFarto();
    // D1 pede cota 16; deixamos 0 disponíveis: déficit máximo
    p[1] = [];

    const resultado = sortear(p, rngDeterministico(1));

    expect(resultado.deficit[1]).toBe(16); // cota inteira
    expect(resultado.porDominio[1]).toBeUndefined(); // não sorteado
    expect(resultado.disponivel[1]).toBe(0);
    expect(resultado.questoes.length).toBe(44); // 60 - 16
  });

  it("cota + deficit = total para cada domínio em qualquer configuração", () => {
    const p = poolFarto();
    // Deixa alguns domínios com poucas questões
    p[1] = p[1].slice(0, 5); // D1 cota 16, disponível 5
    p[3] = p[3].slice(0, 0); // D3 cota 12, disponível 0

    const resultado = sortear(p, rngDeterministico(99));

    // Para D1: sorteado + deficit = cota
    const sorteadoD1 = resultado.porDominio[1] ?? 0;
    const deficitD1 = resultado.deficit[1] ?? 0;
    expect(sorteadoD1 + deficitD1).toBe(resultado.cotas[1]);

    // Para D3: sorteado + deficit = cota (déficit = cota, sorteado = 0)
    const sorteadoD3 = resultado.porDominio[3] ?? 0;
    const deficitD3 = resultado.deficit[3] ?? 0;
    expect(sorteadoD3 + deficitD3).toBe(resultado.cotas[3]);
  });
});
