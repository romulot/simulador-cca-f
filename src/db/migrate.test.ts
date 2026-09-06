import { beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";

import { poolTeste, criarUsuarioTeste } from "./apoioTeste";
import { migrar } from "./migrate";

describe("migrate", () => {
  let pool: Pool;

  beforeEach(async () => {
    pool = await poolTeste();
  });

  it("cria as tabelas da aplicação e registra as migrations, sem erro", async () => {
    await expect(migrar(pool)).resolves.not.toThrow();

    const tabelas = await pool.query<{ table_name: string }>(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name",
    );
    const nomes = tabelas.rows.map((t) => t.table_name);

    expect(nomes).toContain("usuarios");
    expect(nomes).toContain("rodadas");
    expect(nomes).toContain("questoes_rodada");
    expect(nomes).toContain("password_reset_tokens");
    expect(nomes).toContain("schema_migrations");

    const versoes = await pool.query<{ version: string }>("SELECT version FROM schema_migrations ORDER BY version");
    expect(versoes.rows.map((linha) => linha.version)).toEqual([
      "001_initial.sql",
      "002_password_reset_tokens.sql",
      "003_topicos_questoes_rodada.sql",
    ]);
  });

  it("aplicar a migração duas vezes seguidas não falha (idempotência)", async () => {
    await migrar(pool);
    await expect(migrar(pool)).resolves.not.toThrow();
  });

  it("'questoes_rodada' tem todas as colunas do contrato, incluindo os 5 campos de metadados e tópicos", async () => {
    await migrar(pool);

    const colunas = await pool.query<{ column_name: string }>(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'questoes_rodada' ORDER BY ordinal_position",
    );
    const nomes = colunas.rows.map((c) => c.column_name);

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
      "topicos_json",
    ]);
  });

  it("'rodadas' tem todas as colunas do contrato, incluindo 'user_id'", async () => {
    await migrar(pool);

    const colunas = await pool.query<{ column_name: string }>(
      "SELECT column_name FROM information_schema.columns WHERE table_name = 'rodadas' ORDER BY ordinal_position",
    );
    const nomes = colunas.rows.map((c) => c.column_name);

    expect(nomes).toEqual([
      "id",
      "user_id",
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
  });

  it("respeita ON DELETE CASCADE: apagar a rodada apaga as questões dela", async () => {
    await migrar(pool);
    const userId = await criarUsuarioTeste(pool);

    const resultado = await pool.query<{ id: number }>(
      `INSERT INTO rodadas (user_id, modo, iniciada_em, status, indice_atual)
       VALUES ($1, 'pratica', '2026-09-04T10:00:00', 'em_andamento', 0)
       RETURNING id`,
      [userId],
    );
    const rodadaId = resultado.rows[0].id;

    await pool.query(
      `INSERT INTO questoes_rodada
         (rodada_id, posicao, origem, numero, enunciado, alternativas_json,
          correta, resumo, explicacoes_json, bloom, dificuldade, rubrica,
          cenario, principio_testado)
       VALUES
         ($1, 0, 'origem-teste', 1, 'enunciado', '{}', 'A', 'resumo', '{}',
          'Aplicar', 'media', 'rubrica', 'cenario', 'principio')`,
      [rodadaId],
    );

    await pool.query("DELETE FROM rodadas WHERE id = $1", [rodadaId]);

    const restantes = await pool.query<{ n: string }>(
      "SELECT COUNT(*) AS n FROM questoes_rodada WHERE rodada_id = $1",
      [rodadaId],
    );
    expect(Number(restantes.rows[0].n)).toBe(0);
  });

  it("índice único em (rodada_id, posicao) rejeita posição duplicada na mesma rodada", async () => {
    await migrar(pool);
    const userId = await criarUsuarioTeste(pool);

    const resultado = await pool.query<{ id: number }>(
      `INSERT INTO rodadas (user_id, modo, iniciada_em, status, indice_atual)
       VALUES ($1, 'prova', '2026-09-04T10:00:00', 'em_andamento', 0)
       RETURNING id`,
      [userId],
    );
    const rodadaId = resultado.rows[0].id;

    const inserir = () =>
      pool.query(
        `INSERT INTO questoes_rodada
           (rodada_id, posicao, origem, numero, enunciado, alternativas_json,
            correta, resumo, explicacoes_json, bloom, dificuldade, rubrica,
            cenario, principio_testado)
         VALUES
           ($1, 0, 'origem-teste', 1, 'enunciado', '{}', 'A', 'resumo', '{}',
            'Aplicar', 'media', 'rubrica', 'cenario', 'principio')`,
        [rodadaId],
      );

    await inserir();
    await expect(inserir()).rejects.toThrow();
  });
});
