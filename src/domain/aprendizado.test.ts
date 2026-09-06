import { describe, expect, it } from "vitest";
import type { Questao } from "@/lib/parser/tipos";
import {
  CRITERIO_PONTO_FRACO_PADRAO,
  desempenhoPorDominio,
  estatisticasPorTopico,
  pontosFracos,
  questoesEmRevisao,
  selecionarParaPraticar,
  type RespostaBruta,
} from "./aprendizado";

function resposta(parcial: Partial<RespostaBruta> & { origem: string; numero: number }): RespostaBruta {
  return {
    dominio: 1,
    resposta: "A",
    correta: "A",
    topicos: ["Hooks"],
    rodadaId: 1,
    ...parcial,
  };
}

function questaoFake(origem: string, numero: number, topicos: string[] = ["Hooks"]): Questao {
  return {
    origem,
    dominio: 1,
    numero,
    enunciado: `Enunciado ${origem}#${numero}`,
    alternativas: { A: "a", B: "b", C: "c", D: "d" },
    correta: "A",
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

const rngFixo: () => number = () => 0.5;

describe("estatisticasPorTopico", () => {
  it("conta cada resposta (não deduplica por questão)", () => {
    const respostas = [
      resposta({ origem: "a", numero: 1, topicos: ["Hooks"], resposta: "A", correta: "A" }),
      resposta({ origem: "a", numero: 1, topicos: ["Hooks"], resposta: "B", correta: "A", rodadaId: 2 }),
      resposta({ origem: "a", numero: 2, topicos: ["Hooks"], resposta: "A", correta: "A", rodadaId: 3 }),
    ];
    const stats = estatisticasPorTopico(respostas);
    expect(stats).toHaveLength(1);
    expect(stats[0]).toMatchObject({ topicoId: "hooks", acertos: 2, erros: 1, totalRespondido: 3 });
    expect(stats[0].percentual).toBeCloseTo((2 / 3) * 100);
  });

  it("uma resposta com múltiplos tópicos conta para cada um", () => {
    const respostas = [
      resposta({ origem: "a", numero: 1, topicos: ["Hooks", "Loop Agêntico"], resposta: "A", correta: "A" }),
    ];
    const stats = estatisticasPorTopico(respostas);
    const ids = stats.map((s) => s.topicoId).sort();
    expect(ids).toEqual(["hooks", "loop-agentico"]);
  });

  it("ignora tag que não bate com o catálogo, sem lançar", () => {
    const respostas = [resposta({ origem: "a", numero: 1, topicos: ["Tópico Inexistente"] })];
    expect(estatisticasPorTopico(respostas)).toEqual([]);
  });
});

describe("desempenhoPorDominio", () => {
  it("agrupa por domínio e ignora domínio null", () => {
    const respostas = [
      resposta({ origem: "a", numero: 1, dominio: 1, resposta: "A", correta: "A" }),
      resposta({ origem: "a", numero: 2, dominio: 1, resposta: "B", correta: "A" }),
      resposta({ origem: "b", numero: 1, dominio: 2, resposta: "A", correta: "A" }),
      resposta({ origem: "c", numero: 1, dominio: null, resposta: "A", correta: "A" }),
    ];
    const porDominio = desempenhoPorDominio(respostas);
    expect(porDominio.find((d) => d.dominio === 1)).toMatchObject({ acertos: 1, erros: 1 });
    expect(porDominio.find((d) => d.dominio === 2)).toMatchObject({ acertos: 1, erros: 0 });
    expect(porDominio).toHaveLength(2);
  });
});

describe("pontosFracos", () => {
  it("exige o mínimo de respostas antes de marcar como fraco", () => {
    const estatisticas = [
      { topicoId: "a", acertos: 0, erros: 2, totalRespondido: 2, percentual: 0 },
      { topicoId: "b", acertos: 0, erros: 3, totalRespondido: 3, percentual: 0 },
    ];
    const fracos = pontosFracos(estatisticas);
    expect(fracos.map((f) => f.topicoId)).toEqual(["b"]);
  });

  it("respeita o limiar de atenção e ordena do pior pro melhor", () => {
    const estatisticas = [
      { topicoId: "alto", acertos: 8, erros: 2, totalRespondido: 10, percentual: 80 },
      { topicoId: "baixo", acertos: 1, erros: 4, totalRespondido: 5, percentual: 20 },
      { topicoId: "medio", acertos: 3, erros: 3, totalRespondido: 6, percentual: 50 },
    ];
    const fracos = pontosFracos(estatisticas, CRITERIO_PONTO_FRACO_PADRAO);
    expect(fracos.map((f) => f.topicoId)).toEqual(["baixo", "medio"]);
  });
});

describe("questoesEmRevisao", () => {
  it("questão errada e nunca mais respondida fica em revisão", () => {
    const respostas = [resposta({ origem: "a", numero: 1, resposta: "B", correta: "A", rodadaId: 1 })];
    expect(questoesEmRevisao(respostas)).toEqual([
      { origem: "a", numero: 1, ultimaResposta: "B", correta: "A" },
    ]);
  });

  it("acertar numa tentativa mais recente tira a questão da revisão", () => {
    const respostas = [
      resposta({ origem: "a", numero: 1, resposta: "B", correta: "A", rodadaId: 1 }),
      resposta({ origem: "a", numero: 1, resposta: "A", correta: "A", rodadaId: 2 }),
    ];
    expect(questoesEmRevisao(respostas)).toEqual([]);
  });

  it("errar de novo numa tentativa mais recente mantém em revisão", () => {
    const respostas = [
      resposta({ origem: "a", numero: 1, resposta: "A", correta: "A", rodadaId: 1 }),
      resposta({ origem: "a", numero: 1, resposta: "C", correta: "A", rodadaId: 2 }),
    ];
    expect(questoesEmRevisao(respostas)).toEqual([
      { origem: "a", numero: 1, ultimaResposta: "C", correta: "A" },
    ]);
  });
});

describe("selecionarParaPraticar", () => {
  it("prioriza nunca respondidas, depois erradas, depois acertadas mais antigas", () => {
    const nunca = questaoFake("x", 1);
    const errada = questaoFake("x", 2);
    const acertadaAntiga = questaoFake("x", 3);
    const acertadaRecente = questaoFake("x", 4);

    const respostas = [
      resposta({ origem: "x", numero: 2, resposta: "B", correta: "A", rodadaId: 5 }),
      resposta({ origem: "x", numero: 3, resposta: "A", correta: "A", rodadaId: 1 }),
      resposta({ origem: "x", numero: 4, resposta: "A", correta: "A", rodadaId: 10 }),
    ];

    const selecionadas = selecionarParaPraticar(
      [acertadaRecente, acertadaAntiga, errada, nunca],
      respostas,
      3,
      rngFixo,
    );

    expect(selecionadas).toEqual([nunca, errada, acertadaAntiga]);
  });

  it("respeita a quantidade pedida", () => {
    const questoes = [questaoFake("x", 1), questaoFake("x", 2), questaoFake("x", 3)];
    const selecionadas = selecionarParaPraticar(questoes, [], 2, rngFixo);
    expect(selecionadas).toHaveLength(2);
  });

  it("devolve tudo se quantidade pedida for maior que o disponível", () => {
    const questoes = [questaoFake("x", 1)];
    const selecionadas = selecionarParaPraticar(questoes, [], 5, rngFixo);
    expect(selecionadas).toHaveLength(1);
  });
});
