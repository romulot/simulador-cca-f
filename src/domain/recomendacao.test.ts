import { describe, expect, it } from "vitest";
import type { Questao } from "@/lib/parser/tipos";
import type { EstatisticaTopico } from "./aprendizado";
import {
  contarDisponivelPorTopico,
  minutosEstimados,
  prioridades,
  proximaSessao,
  type ItemRecomendacao,
} from "./recomendacao";

function questaoFake(topicos: string[]): Questao {
  return {
    origem: "x",
    dominio: 1,
    numero: 1,
    enunciado: "e",
    alternativas: { A: "a", B: "b", C: "c", D: "d" },
    correta: "A",
    resumo: "r",
    explicacoes: { A: "a", B: "b", C: "c", D: "d" },
    metadados: { bloom: "Aplicar", dificuldade: "Médio", rubrica: "r", cenario: "c", principioTestado: "p" },
    topicos,
  };
}

function estatistica(parcial: Partial<EstatisticaTopico> & { topicoId: string }): EstatisticaTopico {
  return { acertos: 0, erros: 0, totalRespondido: 0, percentual: 0, ...parcial };
}

describe("contarDisponivelPorTopico", () => {
  it("conta questões por tópico e ignora tag fora do catálogo", () => {
    const questoes = [
      questaoFake(["Hooks"]),
      questaoFake(["Hooks", "Loop Agêntico"]),
      questaoFake(["Tópico Inexistente"]),
    ];
    const contagem = contarDisponivelPorTopico(questoes);
    expect(contagem.get("hooks")).toBe(2);
    expect(contagem.get("loop-agentico")).toBe(1);
    expect(contagem.size).toBe(2);
  });
});

describe("prioridades", () => {
  const topicos = [
    { id: "loop-agentico", nome: "Loop Agêntico", dominio: 1 },
    { id: "hooks", nome: "Hooks", dominio: 1 },
    { id: "descricoes-de-tools", nome: "Descrições de Tools", dominio: 2 },
  ];
  const pesos = { 1: 27, 2: 18 };

  it("prioriza cobertura zero (peso do domínio) acima de acurácia baixa em tópico já visto", () => {
    const disponivel = new Map([
      ["loop-agentico", 6],
      ["hooks", 6],
      ["descricoes-de-tools", 6],
    ]);
    // hooks: nunca visto (cobertura 0). loop-agentico: visto por completo mas com acerto baixo.
    const estatisticas = [estatistica({ topicoId: "loop-agentico", totalRespondido: 6, percentual: 20 })];

    const itens = prioridades(topicos, disponivel, estatisticas, pesos);
    const porId = new Map(itens.map((i) => [i.topicoId, i]));
    expect(porId.get("hooks")!.score).toBeGreaterThan(porId.get("loop-agentico")!.score);
  });

  it("pondera pelo peso do domínio quando a cobertura que falta é igual", () => {
    const disponivel = new Map([
      ["hooks", 6], // dominio 1, peso 27
      ["descricoes-de-tools", 6], // dominio 2, peso 18
    ]);
    const itens = prioridades(
      topicos.filter((t) => t.id !== "loop-agentico"),
      disponivel,
      [],
      pesos,
    );
    const porId = new Map(itens.map((i) => [i.topicoId, i]));
    expect(porId.get("hooks")!.score).toBeGreaterThan(porId.get("descricoes-de-tools")!.score);
  });

  it("cobertura é 0 quando não há nenhuma questão do tópico no corpus", () => {
    const itens = prioridades([topicos[0]], new Map(), [], pesos);
    expect(itens[0].cobertura).toBe(0);
    expect(itens[0].disponivel).toBe(0);
  });
});

describe("minutosEstimados", () => {
  it("é 0 sem questões disponíveis", () => {
    expect(minutosEstimados(0)).toBe(0);
  });

  it("arredonda o custo a partir do ritmo por questão, com piso de 1 minuto", () => {
    expect(minutosEstimados(6)).toBe(Math.round(6 * 1.7));
    expect(minutosEstimados(1)).toBeGreaterThanOrEqual(1);
  });
});

describe("proximaSessao", () => {
  function item(parcial: Partial<ItemRecomendacao> & { topicoId: string; dominio: number }): ItemRecomendacao {
    return { nome: parcial.topicoId, score: 0, vistas: 0, disponivel: 6, cobertura: 0, acuracia: null, ...parcial };
  }

  it("sempre inclui ao menos 1 item, mesmo com orçamento menor que o custo dele", () => {
    const itens = [item({ topicoId: "a", dominio: 1, disponivel: 6 })];
    const sessao = proximaSessao(itens, 1);
    expect(sessao.selecionados).toHaveLength(1);
  });

  it("nunca seleciona tópico sem questão disponível", () => {
    const itens = [item({ topicoId: "a", dominio: 1, disponivel: 0 })];
    const sessao = proximaSessao(itens, 30);
    expect(sessao.selecionados).toHaveLength(0);
  });

  it("para de adicionar quando o próximo item estouraria o orçamento", () => {
    const itens = [
      item({ topicoId: "a", dominio: 1, disponivel: 6 }), // ~10 min
      item({ topicoId: "b", dominio: 1, disponivel: 6 }), // ~10 min
      item({ topicoId: "c", dominio: 1, disponivel: 6 }), // ~10 min
    ];
    const sessao = proximaSessao(itens, 20);
    expect(sessao.selecionados.map((i) => i.topicoId)).toEqual(["a", "b"]);
  });

  it("sinaliza domínio com cobertura completa em todos os tópicos", () => {
    const itens = [
      item({ topicoId: "a", dominio: 1, disponivel: 6, cobertura: 100 }),
      item({ topicoId: "b", dominio: 1, disponivel: 6, cobertura: 100 }),
      item({ topicoId: "c", dominio: 2, disponivel: 6, cobertura: 40 }),
    ];
    const sessao = proximaSessao(itens, 5);
    expect(sessao.dominiosComCoberturaCompleta).toEqual([1]);
  });
});
