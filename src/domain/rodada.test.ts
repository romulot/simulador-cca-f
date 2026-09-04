import { describe, expect, it } from "vitest";
import type { Questao } from "@/lib/parser/tipos";
import {
  atual,
  avancar,
  criarRodada,
  decorrido,
  emBranco,
  encerrar,
  encerrada,
  esgotado,
  iniciar,
  irPara,
  MODO_PRATICA,
  MODO_PROVA,
  placar,
  proximaEmBranco,
  responder,
  restaurarFinalizada,
  tudoRespondido,
  voltar,
  type Relogio,
} from "./rodada";

function questaoFake(numero: number, correta: "A" | "B" | "C" | "D" = "A"): Questao {
  return {
    origem: "teste",
    dominio: 1,
    numero,
    enunciado: `Enunciado ${numero}`,
    alternativas: { A: "a", B: "b", C: "c", D: "d" },
    correta,
    resumo: "resumo",
    explicacoes: { A: "a", B: "b", C: "c", D: "d" },
    metadados: {
      bloom: "Lembrar",
      dificuldade: "Fácil",
      rubrica: "rubrica",
      cenario: "cenário",
      principioTestado: "princípio",
    },
  };
}

/** Relógio de teste: cada chamada avança um número fixo de segundos,
 * controlado explicitamente pelo teste via `avancarPara`. */
function relogioControlado() {
  let agora = 0;
  const relogio: Relogio = () => agora;
  return { relogio, avancarPara: (t: number) => (agora = t) };
}

describe("criarRodada", () => {
  it("não embaralha quando embaralhar=false, preserva ordem de entrada", () => {
    const questoes = [questaoFake(1), questaoFake(2), questaoFake(3)];
    const estado = criarRodada(questoes, { embaralhar: false });
    expect(estado.questoes.map((q) => q.numero)).toEqual([1, 2, 3]);
    expect(estado.respostas).toEqual([null, null, null]);
    expect(estado.tempos).toEqual([0, 0, 0]);
  });

  it("exige rng quando embaralhar=true (default)", () => {
    expect(() => criarRodada([questaoFake(1)])).toThrow(/rng/);
  });
});

describe("encerrada — rodada vazia", () => {
  it("uma rodada sem questão nenhuma já nasce encerrada", () => {
    const estado = criarRodada([], { embaralhar: false });
    const { relogio } = relogioControlado();
    expect(encerrada(estado, relogio)).toBe(true);
    expect(atual(estado, relogio)).toBeNull();
  });
});

describe("navegação bidirecional sem wraparound", () => {
  it("avancar na última questão não faz nada", () => {
    const questoes = [questaoFake(1), questaoFake(2)];
    let estado = criarRodada(questoes, { embaralhar: false });
    const { relogio } = relogioControlado();
    estado = iniciar(estado, relogio);
    estado = irPara(estado, 1, relogio);
    expect(estado.indice).toBe(1);
    estado = avancar(estado, relogio);
    expect(estado.indice).toBe(1); // não deu a volta pra 0
  });

  it("voltar na primeira questão não faz nada", () => {
    const questoes = [questaoFake(1), questaoFake(2)];
    let estado = criarRodada(questoes, { embaralhar: false });
    const { relogio } = relogioControlado();
    estado = iniciar(estado, relogio);
    estado = voltar(estado, relogio);
    expect(estado.indice).toBe(0);
  });

  it("ir_para com índice igual ao atual não fecha tempo nem muda estado", () => {
    const questoes = [questaoFake(1), questaoFake(2)];
    let estado = criarRodada(questoes, { embaralhar: false });
    const { relogio, avancarPara } = relogioControlado();
    estado = iniciar(estado, relogio);
    avancarPara(10);
    const antes = estado;
    estado = irPara(estado, 0, relogio);
    expect(estado).toBe(antes); // mesma referência: no-op real, não só resultado igual
  });
});

describe("tempo por visita à questão (não por resposta)", () => {
  it("revisitar uma questão sem responder acumula tempo nela", () => {
    const questoes = [questaoFake(1), questaoFake(2)];
    let estado = criarRodada(questoes, { embaralhar: false });
    const { relogio, avancarPara } = relogioControlado();
    estado = iniciar(estado, relogio); // marca em 0, na questão 0

    avancarPara(5);
    estado = irPara(estado, 1, relogio); // fecha questão 0 com 5s, marca em 5, na questão 1

    avancarPara(8);
    estado = irPara(estado, 0, relogio); // fecha questão 1 com 3s, marca em 8, de volta na questão 0

    avancarPara(12);
    estado = irPara(estado, 1, relogio); // fecha questão 0 de novo: +4s = 9s total

    expect(estado.tempos[0]).toBeCloseTo(9); // 5 + 4, duas visitas somadas
    expect(estado.tempos[1]).toBeCloseTo(3);
  });

  it("responder acumula o tempo da questão respondida antes de avançar", () => {
    const questoes = [questaoFake(1), questaoFake(2)];
    let estado = criarRodada(questoes, { embaralhar: false });
    const { relogio, avancarPara } = relogioControlado();
    estado = iniciar(estado, relogio);
    avancarPara(7);
    estado = responder(estado, "A", relogio);
    expect(estado.tempos[0]).toBeCloseTo(7);
    expect(estado.indice).toBe(1);
    expect(estado.respostas[0]).toBe("A");
  });
});

describe("encerrada() nunca é equivalente a tudoRespondido()", () => {
  it("todas respondidas mas sem encerrar() explícito: rodada continua ativa", () => {
    const questoes = [questaoFake(1), questaoFake(2)];
    let estado = criarRodada(questoes, { embaralhar: false });
    const { relogio } = relogioControlado();
    estado = iniciar(estado, relogio);
    estado = responder(estado, "A", relogio);
    estado = irPara(estado, 1, relogio);
    estado = { ...estado, respostas: [estado.respostas[0], "A"] };

    expect(tudoRespondido(estado)).toBe(true);
    expect(encerrada(estado, relogio)).toBe(false);
  });
});

describe("encerrar() é idempotente", () => {
  it("chamar duas vezes não altera decorrido nem esgotouTempo na segunda vez", () => {
    const questoes = [questaoFake(1)];
    let estado = criarRodada(questoes, { embaralhar: false, limiteSegundos: 100 });
    const { relogio, avancarPara } = relogioControlado();
    estado = iniciar(estado, relogio);

    avancarPara(50);
    estado = encerrar(estado, relogio);
    const decorrido1 = decorrido(estado, relogio);
    const esgotou1 = estado.esgotouTempo;

    avancarPara(999); // se não fosse idempotente, isso vazaria pro decorrido
    estado = encerrar(estado, relogio);
    const decorrido2 = decorrido(estado, relogio);

    expect(decorrido2).toBe(decorrido1);
    expect(estado.esgotouTempo).toBe(esgotou1);
    expect(decorrido1).toBeCloseTo(50);
    expect(esgotou1).toBe(false);
  });

  it("esgotouTempo fica true quando encerrar() é chamado após o limite", () => {
    const questoes = [questaoFake(1)];
    let estado = criarRodada(questoes, { embaralhar: false, limiteSegundos: 100 });
    const { relogio, avancarPara } = relogioControlado();
    estado = iniciar(estado, relogio);
    avancarPara(150);
    expect(esgotado(estado, relogio)).toBe(true);
    estado = encerrar(estado, relogio);
    expect(estado.esgotouTempo).toBe(true);
  });
});

describe("esgotado() encerra a rodada mesmo sem encerrar() explícito", () => {
  it("rodada com limite ultrapassado já reporta encerrada()=true", () => {
    const questoes = [questaoFake(1)];
    let estado = criarRodada(questoes, { embaralhar: false, limiteSegundos: 60 });
    const { relogio, avancarPara } = relogioControlado();
    estado = iniciar(estado, relogio);
    avancarPara(61);
    expect(encerrada(estado, relogio)).toBe(true);
    expect(atual(estado, relogio)).toBeNull();
  });
});

describe("proximaEmBranco / emBranco", () => {
  it("encontra a próxima em branco dando a volta", () => {
    const questoes = [questaoFake(1), questaoFake(2), questaoFake(3)];
    let estado = criarRodada(questoes, { embaralhar: false });
    const { relogio } = relogioControlado();
    estado = iniciar(estado, relogio);
    estado = irPara(estado, 2, relogio);
    estado = { ...estado, respostas: [null, "A", null] };

    expect(proximaEmBranco(estado)).toBe(0); // deu a volta a partir do índice 2
    expect(emBranco(estado)).toEqual([1, 3]); // 1-based
  });

  it("devolve null quando não há nenhuma em branco", () => {
    const questoes = [questaoFake(1)];
    let estado = criarRodada(questoes, { embaralhar: false });
    estado = { ...estado, respostas: ["A"] };
    expect(proximaEmBranco(estado)).toBeNull();
  });
});

describe("placar — dois denominadores", () => {
  it("percentual sobre respondidas e percentualTotal sobre o total divergem com em branco", () => {
    const questoes = [
      questaoFake(1, "A"),
      questaoFake(2, "B"),
      questaoFake(3, "C"),
      questaoFake(4, "D"),
    ];
    let estado = criarRodada(questoes, { embaralhar: false, modo: MODO_PROVA });
    const { relogio } = relogioControlado();
    estado = iniciar(estado, relogio);
    // Responde só 2 das 4, ambas certas.
    estado = { ...estado, respostas: ["A", "B", null, null] };

    const p = placar(estado, relogio);
    expect(p.total).toBe(4);
    expect(p.respondidas).toBe(2);
    expect(p.emBranco).toBe(2);
    expect(p.acertos).toBe(2);
    expect(p.erros).toBe(0);
    expect(p.percentual).toBe(100); // 2/2 respondidas
    expect(p.percentualTotal).toBe(50); // 2/4 do total — prova conta em branco como erro na manchete
  });

  it("rodada sem nenhuma resposta: percentual (sobre respondidas) é null", () => {
    const questoes = [questaoFake(1)];
    let estado = criarRodada(questoes, { embaralhar: false, modo: MODO_PRATICA });
    const { relogio } = relogioControlado();
    estado = iniciar(estado, relogio);
    const p = placar(estado, relogio);
    expect(p.percentual).toBeNull();
    expect(p.percentualTotal).toBe(0);
  });
});

describe("restaurarFinalizada", () => {
  it("reconstrói uma rodada encerrada cujo decorrido nunca consulta o relógio de novo", () => {
    const questoes = [questaoFake(1, "A"), questaoFake(2, "B")];
    const estado = restaurarFinalizada({
      questoes,
      respostas: ["A", "C"],
      tempos: [12, 34],
      decorrido: 46,
      modo: MODO_PRATICA,
      limiteSegundos: null,
      esgotouTempo: false,
    });

    // relógio "mentiroso": se decorrido() o consultasse, o valor mudaria.
    const relogioMentiroso: Relogio = () => 99999;

    expect(encerrada(estado, relogioMentiroso)).toBe(true);
    expect(decorrido(estado, relogioMentiroso)).toBe(46);
    const p = placar(estado, relogioMentiroso);
    expect(p.tempoTotal).toBe(46);
    expect(p.acertos).toBe(1);
    expect(p.erros).toBe(1);
  });
});
