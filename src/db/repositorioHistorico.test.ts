import { afterEach, describe, expect, it } from "vitest";
import Database from "better-sqlite3";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import type { Questao } from "@/lib/parser/tipos";
import { criarRodada as criarEstado, encerrar, iniciar, responder, type Relogio } from "@/domain/rodada";
import { migrar } from "./migrate";
import { criarRodada, salvarRodada } from "./repositorioRodadas";
import {
  carregarEntradaHistorico,
  contarHistorico,
  listarHistorico,
  ultimaEntradaHistorico,
} from "./repositorioHistorico";

function questaoFake(numero: number, correta: "A" | "B" | "C" | "D" = "A"): Questao {
  return {
    origem: `simulado_${numero}`,
    dominio: 1,
    numero,
    enunciado: `Enunciado ${numero}`,
    alternativas: { A: "a", B: "b", C: "c", D: "d" },
    correta,
    resumo: "resumo",
    explicacoes: { A: "a", B: "b", C: "c", D: "d" },
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

/** Cria e encerra uma rodada completa, persistindo o resultado. */
function criarRodadaFinalizada(
  db: Database.Database,
  opts: { questoes: Questao[]; respostas: Array<"A" | "B" | "C" | "D">; modo?: "pratica" | "prova" },
): number {
  const id = criarRodada(db, {
    questoes: opts.questoes,
    modo: opts.modo ?? "pratica",
    limiteSegundos: null,
  });
  const { relogio, avancarPara } = relogioControlado();
  let estado = iniciar(criarEstado(opts.questoes, { embaralhar: false }), relogio);
  opts.respostas.forEach((letra, i) => {
    avancarPara((i + 1) * 10);
    estado = responder(estado, letra, relogio);
  });
  estado = encerrar(estado, relogio);
  salvarRodada(db, id, estado, relogio);
  return id;
}

describe("repositorioHistorico", () => {
  let diretorioTemporario: string | undefined;

  afterEach(() => {
    if (diretorioTemporario) {
      rmSync(diretorioTemporario, { recursive: true, force: true });
      diretorioTemporario = undefined;
    }
  });

  function bancoDeTeste(): Database.Database {
    diretorioTemporario = mkdtempSync(join(tmpdir(), "simulador-historico-test-"));
    const db = new Database(join(diretorioTemporario, "teste.db"));
    db.pragma("foreign_keys = ON");
    migrar(db);
    return db;
  }

  it("uma rodada em andamento não aparece na listagem nem é 'a última'", () => {
    const db = bancoDeTeste();
    criarRodada(db, { questoes: [questaoFake(1)], modo: "pratica", limiteSegundos: null });

    expect(listarHistorico(db)).toEqual([]);
    expect(ultimaEntradaHistorico(db)).toBeNull();
    expect(contarHistorico(db)).toBe(0);

    db.close();
  });

  it("uma rodada finalizada aparece no histórico com placar recalculado (não persistido)", () => {
    const db = bancoDeTeste();
    const questoes = [questaoFake(1, "A"), questaoFake(2, "B"), questaoFake(3, "C")];
    // Responde 2 certas e 1 errada.
    criarRodadaFinalizada(db, { questoes, respostas: ["A", "B", "D"] });

    const entradas = listarHistorico(db);
    expect(entradas).toHaveLength(1);
    expect(entradas[0].erro).toBeNull();
    expect(entradas[0].placar!.total).toBe(3);
    expect(entradas[0].placar!.acertos).toBe(2);
    expect(entradas[0].placar!.erros).toBe(1);
    expect(entradas[0].origens).toEqual(["simulado_1", "simulado_2", "simulado_3"]);

    expect(contarHistorico(db)).toBe(1);
    expect(ultimaEntradaHistorico(db)!.placar!.acertos).toBe(2);

    db.close();
  });

  it("listarHistorico ordena da mais recente para a mais antiga", () => {
    const db = bancoDeTeste();
    const id1 = criarRodadaFinalizada(db, { questoes: [questaoFake(1, "A")], respostas: ["A"] });
    const id2 = criarRodadaFinalizada(db, { questoes: [questaoFake(2, "B")], respostas: ["B"] });

    const entradas = listarHistorico(db);
    expect(entradas.map((e) => e.id)).toEqual([id2, id1]);

    db.close();
  });

  it("uma rodada com JSON corrompido em alternativas_json aparece com 'erro', sem derrubar a listagem", () => {
    const db = bancoDeTeste();
    const idBoa = criarRodadaFinalizada(db, { questoes: [questaoFake(1, "A")], respostas: ["A"] });
    const idRuim = criarRodadaFinalizada(db, { questoes: [questaoFake(2, "B")], respostas: ["B"] });

    // Corrompe deliberadamente o JSON de uma questão da segunda rodada.
    db.prepare("UPDATE questoes_rodada SET alternativas_json = ? WHERE rodada_id = ?").run(
      "{ isso não é json válido",
      idRuim,
    );

    const entradas = listarHistorico(db);
    expect(entradas).toHaveLength(2); // as duas continuam listadas

    const entradaRuim = entradas.find((e) => e.id === idRuim)!;
    expect(entradaRuim.erro).toMatch(/formato inesperado|ilegível/);
    expect(entradaRuim.placar).toBeNull();

    const entradaBoa = entradas.find((e) => e.id === idBoa)!;
    expect(entradaBoa.erro).toBeNull();
    expect(entradaBoa.placar!.acertos).toBe(1);

    db.close();
  });

  it("carregarEntradaHistorico devolve null para id inexistente (não é erro de dado, é ausência)", () => {
    const db = bancoDeTeste();
    expect(carregarEntradaHistorico(db, 999)).toBeNull();
    db.close();
  });
});
