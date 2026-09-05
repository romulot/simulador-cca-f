import { beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";

import type { Questao } from "@/lib/parser/tipos";
import { criarRodada as criarEstado, encerrar, iniciar, responder, type Relogio } from "@/domain/rodada";
import { poolTeste, criarUsuarioTeste } from "./apoioTeste";
import { carregarRodada, criarRodada, salvarRodada } from "./repositorioRodadas";

function questaoFake(numero: number, correta: "A" | "B" | "C" | "D" = "A", dominio: number | null = 1): Questao {
  return {
    origem: "teste_origem",
    dominio,
    numero,
    enunciado: `Enunciado ${numero}`,
    alternativas: { A: "a", B: "b", C: "c", D: "d" },
    correta,
    resumo: "resumo",
    explicacoes: { A: "expl a", B: "expl b", C: "expl c", D: "expl d" },
    metadados: {
      bloom: "Aplicar",
      dificuldade: "Médio",
      rubrica: "rubrica",
      cenario: "cenário",
      principioTestado: "princípio",
    },
  };
}

function relogioControlado() {
  let agora = 0;
  const relogio: Relogio = () => agora;
  return { relogio, avancarPara: (t: number) => (agora = t) };
}

describe("repositorioRodadas", () => {
  let pool: Pool;
  let userId: number;
  let outroUsuarioId: number;

  beforeEach(async () => {
    pool = await poolTeste();
    userId = await criarUsuarioTeste(pool);
    outroUsuarioId = await criarUsuarioTeste(pool);
  });

  it("grava e recarrega uma rodada em andamento (round-trip preserva questões e metadados)", async () => {
    const questoes = [questaoFake(1, "A"), questaoFake(2, "B", 2)];

    const id = await criarRodada(pool, {
      userId,
      questoes,
      modo: "pratica",
      limiteSegundos: null,
      iniciadaEm: new Date("2026-09-04T10:00:00Z"),
    });

    const persistida = await carregarRodada(pool, id, userId);
    expect(persistida).not.toBeNull();
    expect(persistida!.status).toBe("em_andamento");
    expect(persistida!.estado.questoes).toHaveLength(2);
    expect(persistida!.estado.questoes[0].enunciado).toBe("Enunciado 1");
    expect(persistida!.estado.questoes[1].dominio).toBe(2);
    expect(persistida!.estado.questoes[0].metadados.bloom).toBe("Aplicar");
    expect(persistida!.estado.respostas).toEqual([null, null]);
    expect(persistida!.estado.tempos).toEqual([0, 0]);
    expect(persistida!.composicao).toEqual({ cotas: null, disponivel: null, deficit: null });
  });

  it("grava a composição do modo prova (cotas/disponivel/deficit) e recarrega intacta", async () => {
    const questoes = [questaoFake(1)];

    const id = await criarRodada(pool, {
      userId,
      questoes,
      modo: "prova",
      limiteSegundos: 7200,
      composicao: {
        cotas: { 1: 16, 2: 11 },
        disponivel: { 1: 54, 2: 42 },
        deficit: { 2: 3 },
      },
    });

    const persistida = await carregarRodada(pool, id, userId);
    expect(persistida!.composicao).toEqual({
      cotas: { "1": 16, "2": 11 },
      disponivel: { "1": 54, "2": 42 },
      deficit: { "2": 3 },
    });
    expect(persistida!.estado.limiteSegundos).toBe(7200);
  });

  it("carregarRodada devolve null para id inexistente", async () => {
    expect(await carregarRodada(pool, 999999, userId)).toBeNull();
  });

  it("carregarRodada devolve null quando a rodada pertence a outro usuário", async () => {
    const id = await criarRodada(pool, { userId, questoes: [questaoFake(1)], modo: "pratica", limiteSegundos: null });
    expect(await carregarRodada(pool, id, outroUsuarioId)).toBeNull();
  });

  it("salvarRodada persiste respostas/tempos/indice de uma rodada ainda em andamento", async () => {
    const questoes = [questaoFake(1, "A"), questaoFake(2, "B")];
    const id = await criarRodada(pool, { userId, questoes, modo: "pratica", limiteSegundos: null });

    const { relogio, avancarPara } = relogioControlado();
    let estado = iniciar(criarEstado(questoes, { embaralhar: false }), relogio);
    avancarPara(12);
    estado = responder(estado, "A", relogio); // acerta a Q1, avança pra Q2

    await salvarRodada(pool, id, estado, relogio, userId);

    const recarregada = (await carregarRodada(pool, id, userId))!;
    expect(recarregada.status).toBe("em_andamento");
    expect(recarregada.estado.respostas).toEqual(["A", null]);
    expect(recarregada.estado.tempos[0]).toBeCloseTo(12);
    expect(recarregada.estado.indice).toBe(1);
  });

  it("salvarRodada rejeita e não afeta uma rodada de outro usuário", async () => {
    const questoes = [questaoFake(1, "A")];
    const id = await criarRodada(pool, { userId, questoes, modo: "pratica", limiteSegundos: null });

    const { relogio } = relogioControlado();
    const estado = responder(iniciar(criarEstado(questoes, { embaralhar: false }), relogio), "A", relogio);

    await expect(salvarRodada(pool, id, estado, relogio, outroUsuarioId)).rejects.toThrow();

    const aindaDoDono = (await carregarRodada(pool, id, userId))!;
    expect(aindaDoDono.estado.respostas).toEqual([null]);
  });

  it("salvarRodada marca status='finalizada' e congela decorrido_segundos quando a rodada encerra", async () => {
    const questoes = [questaoFake(1, "A")];
    const id = await criarRodada(pool, { userId, questoes, modo: "pratica", limiteSegundos: null });

    const { relogio, avancarPara } = relogioControlado();
    let estado = iniciar(criarEstado(questoes, { embaralhar: false }), relogio);
    avancarPara(30);
    estado = encerrar(estado, relogio);

    await salvarRodada(pool, id, estado, relogio, userId);

    const recarregada = (await carregarRodada(pool, id, userId))!;
    expect(recarregada.status).toBe("finalizada");
    expect(recarregada.estado.fimEm).toBeCloseTo(30);
    expect(recarregada.estado.esgotouTempo).toBe(false);
  });

  it("uma rodada em andamento recarregada tem inicioEm derivado de iniciada_em, não de agora", async () => {
    const questoes = [questaoFake(1)];
    const iniciadaEm = new Date("2026-09-04T10:00:00.000Z");
    const id = await criarRodada(pool, { userId, questoes, modo: "pratica", limiteSegundos: null, iniciadaEm });

    const recarregada = (await carregarRodada(pool, id, userId))!;
    expect(recarregada.estado.inicioEm).toBeCloseTo(iniciadaEm.getTime() / 1000);
    expect(recarregada.estado.marcaEm).toBeNull();
    expect(recarregada.estado.fimEm).toBeNull();
  });
});
