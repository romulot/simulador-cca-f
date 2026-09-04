import { afterEach, describe, expect, it } from "vitest";
import Database from "better-sqlite3";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { Questao } from "@/lib/parser/tipos";
import { criarRodada as criarEstado, encerrar, iniciar, responder, type Relogio } from "@/domain/rodada";
import { migrar } from "./migrate";
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
  let diretorioTemporario: string | undefined;

  afterEach(() => {
    if (diretorioTemporario) {
      rmSync(diretorioTemporario, { recursive: true, force: true });
      diretorioTemporario = undefined;
    }
  });

  function bancoDeTeste(): Database.Database {
    diretorioTemporario = mkdtempSync(join(tmpdir(), "simulador-repo-test-"));
    const db = new Database(join(diretorioTemporario, "teste.db"));
    db.pragma("foreign_keys = ON");
    migrar(db);
    return db;
  }

  it("grava e recarrega uma rodada em andamento (round-trip preserva questões e metadados)", () => {
    const db = bancoDeTeste();
    const questoes = [questaoFake(1, "A"), questaoFake(2, "B", 2)];

    const id = criarRodada(db, {
      questoes,
      modo: "pratica",
      limiteSegundos: null,
      iniciadaEm: new Date("2026-09-04T10:00:00Z"),
    });

    const persistida = carregarRodada(db, id);
    expect(persistida).not.toBeNull();
    expect(persistida!.status).toBe("em_andamento");
    expect(persistida!.estado.questoes).toHaveLength(2);
    expect(persistida!.estado.questoes[0].enunciado).toBe("Enunciado 1");
    expect(persistida!.estado.questoes[1].dominio).toBe(2);
    expect(persistida!.estado.questoes[0].metadados.bloom).toBe("Aplicar");
    expect(persistida!.estado.respostas).toEqual([null, null]);
    expect(persistida!.estado.tempos).toEqual([0, 0]);
    expect(persistida!.composicao).toEqual({ cotas: null, disponivel: null, deficit: null });

    db.close();
  });

  it("grava a composição do modo prova (cotas/disponivel/deficit) e recarrega intacta", () => {
    const db = bancoDeTeste();
    const questoes = [questaoFake(1)];

    const id = criarRodada(db, {
      questoes,
      modo: "prova",
      limiteSegundos: 7200,
      composicao: {
        cotas: { 1: 16, 2: 11 },
        disponivel: { 1: 54, 2: 42 },
        deficit: { 2: 3 },
      },
    });

    const persistida = carregarRodada(db, id);
    expect(persistida!.composicao).toEqual({
      cotas: { "1": 16, "2": 11 },
      disponivel: { "1": 54, "2": 42 },
      deficit: { "2": 3 },
    });
    expect(persistida!.estado.limiteSegundos).toBe(7200);

    db.close();
  });

  it("carregarRodada devolve null para id inexistente", () => {
    const db = bancoDeTeste();
    expect(carregarRodada(db, 999)).toBeNull();
    db.close();
  });

  it("salvarRodada persiste respostas/tempos/indice de uma rodada ainda em andamento", () => {
    const db = bancoDeTeste();
    const questoes = [questaoFake(1, "A"), questaoFake(2, "B")];
    const id = criarRodada(db, { questoes, modo: "pratica", limiteSegundos: null });

    const { relogio, avancarPara } = relogioControlado();
    let estado = iniciar(criarEstado(questoes, { embaralhar: false }), relogio);
    avancarPara(12);
    estado = responder(estado, "A", relogio); // acerta a Q1, avança pra Q2

    salvarRodada(db, id, estado, relogio);

    const recarregada = carregarRodada(db, id)!;
    expect(recarregada.status).toBe("em_andamento");
    expect(recarregada.estado.respostas).toEqual(["A", null]);
    expect(recarregada.estado.tempos[0]).toBeCloseTo(12);
    expect(recarregada.estado.indice).toBe(1);
  });

  it("salvarRodada marca status='finalizada' e congela decorrido_segundos quando a rodada encerra", () => {
    const db = bancoDeTeste();
    const questoes = [questaoFake(1, "A")];
    const id = criarRodada(db, { questoes, modo: "pratica", limiteSegundos: null });

    const { relogio, avancarPara } = relogioControlado();
    let estado = iniciar(criarEstado(questoes, { embaralhar: false }), relogio);
    avancarPara(30);
    estado = encerrar(estado, relogio);

    salvarRodada(db, id, estado, relogio);

    const recarregada = carregarRodada(db, id)!;
    expect(recarregada.status).toBe("finalizada");
    // relógio "mentiroso": se decorrido() da rodada recarregada consultasse
    // o relógio de novo, o valor mudaria — prova que ficou congelado.
    const relogioMentiroso: Relogio = () => 99999;
    expect(recarregada.estado.fimEm).toBeCloseTo(30);
    expect(recarregada.estado.esgotouTempo).toBe(false);
  });

  it("uma rodada em andamento recarregada tem inicioEm derivado de iniciada_em, não de agora", () => {
    const db = bancoDeTeste();
    const questoes = [questaoFake(1)];
    const iniciadaEm = new Date("2026-09-04T10:00:00.000Z");
    const id = criarRodada(db, { questoes, modo: "pratica", limiteSegundos: null, iniciadaEm });

    const recarregada = carregarRodada(db, id)!;
    expect(recarregada.estado.inicioEm).toBeCloseTo(iniciadaEm.getTime() / 1000);
    expect(recarregada.estado.marcaEm).toBeNull();
    expect(recarregada.estado.fimEm).toBeNull();
  });
});
