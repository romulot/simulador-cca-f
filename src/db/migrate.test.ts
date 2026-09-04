import { describe, expect, it, afterEach } from "vitest";
import Database from "better-sqlite3";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { migrar } from "./migrate";

describe("migrate", () => {
  let diretorioTemporario: string | undefined;

  afterEach(() => {
    if (diretorioTemporario) {
      rmSync(diretorioTemporario, { recursive: true, force: true });
      diretorioTemporario = undefined;
    }
  });

  function bancoDeTeste(): { db: Database.Database; caminho: string } {
    diretorioTemporario = mkdtempSync(join(tmpdir(), "simulador-db-test-"));
    const caminho = join(diretorioTemporario, "teste.db");
    const db = new Database(caminho);
    db.pragma("foreign_keys = ON");
    return { db, caminho };
  }

  it("cria as tabelas 'rodadas' e 'questoes_rodada' num arquivo novo, sem erro", () => {
    const { db } = bancoDeTeste();

    expect(() => migrar(db)).not.toThrow();

    const tabelas = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
      )
      .all() as Array<{ name: string }>;
    const nomes = tabelas.map((t) => t.name);

    expect(nomes).toContain("rodadas");
    expect(nomes).toContain("questoes_rodada");

    db.close();
  });

  it("aplicar a migração duas vezes seguidas no mesmo arquivo não falha (idempotência)", () => {
    const { db } = bancoDeTeste();

    migrar(db);
    expect(() => migrar(db)).not.toThrow();

    db.close();
  });

  it("'questoes_rodada' tem todas as colunas do contrato, incluindo os 5 campos de metadados", () => {
    const { db } = bancoDeTeste();
    migrar(db);

    const colunas = db
      .prepare("PRAGMA table_info(questoes_rodada)")
      .all() as Array<{ name: string }>;
    const nomes = colunas.map((c) => c.name);

    expect(nomes).toEqual([
      "id",
      "rodada_id",
      "posicao",
      "origem",
      "dominio",
      "numero",
      "enunciado",
      "alternativas_json",
      "correta",
      "resumo",
      "explicacoes_json",
      "bloom",
      "dificuldade",
      "rubrica",
      "cenario",
      "principio_testado",
      "resposta",
      "segundos",
    ]);

    db.close();
  });

  it("'rodadas' tem todas as colunas do contrato", () => {
    const { db } = bancoDeTeste();
    migrar(db);

    const colunas = db
      .prepare("PRAGMA table_info(rodadas)")
      .all() as Array<{ name: string }>;
    const nomes = colunas.map((c) => c.name);

    expect(nomes).toEqual([
      "id",
      "modo",
      "iniciada_em",
      "limite_segundos",
      "decorrido_segundos",
      "esgotou_tempo",
      "status",
      "indice_atual",
      "cotas_json",
      "disponivel_json",
      "deficit_json",
    ]);

    db.close();
  });

  it("respeita ON DELETE CASCADE: apagar a rodada apaga as questões dela", () => {
    const { db } = bancoDeTeste();
    migrar(db);

    db.prepare(
      `INSERT INTO rodadas (id, modo, iniciada_em, status, indice_atual)
       VALUES (1, 'pratica', '2026-09-04T10:00:00', 'em_andamento', 0)`,
    ).run();
    db.prepare(
      `INSERT INTO questoes_rodada
         (rodada_id, posicao, origem, numero, enunciado, alternativas_json,
          correta, resumo, explicacoes_json, bloom, dificuldade, rubrica,
          cenario, principio_testado)
       VALUES
         (1, 0, 'origem-teste', 1, 'enunciado', '{}', 'A', 'resumo', '{}',
          'Aplicar', 'media', 'rubrica', 'cenario', 'principio')`,
    ).run();

    db.prepare("DELETE FROM rodadas WHERE id = 1").run();

    const restantes = db
      .prepare("SELECT COUNT(*) AS n FROM questoes_rodada")
      .get() as { n: number };
    expect(restantes.n).toBe(0);

    db.close();
  });

  it("índice único em (rodada_id, posicao) rejeita posição duplicada na mesma rodada", () => {
    const { db } = bancoDeTeste();
    migrar(db);

    db.prepare(
      `INSERT INTO rodadas (id, modo, iniciada_em, status, indice_atual)
       VALUES (1, 'prova', '2026-09-04T10:00:00', 'em_andamento', 0)`,
    ).run();

    const inserir = db.prepare(
      `INSERT INTO questoes_rodada
         (rodada_id, posicao, origem, numero, enunciado, alternativas_json,
          correta, resumo, explicacoes_json, bloom, dificuldade, rubrica,
          cenario, principio_testado)
       VALUES
         (1, 0, 'origem-teste', 1, 'enunciado', '{}', 'A', 'resumo', '{}',
          'Aplicar', 'media', 'rubrica', 'cenario', 'principio')`,
    );

    inserir.run();
    expect(() => inserir.run()).toThrow();

    db.close();
  });
});
