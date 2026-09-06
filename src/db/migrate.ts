/** Aplica, em ordem, as migrations SQL ainda não registradas.
 *
 * Cada arquivo roda em transação e sob advisory lock: duas instâncias que
 * iniciem ao mesmo tempo não tentam aplicar a mesma versão em paralelo.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { Pool } from "pg";

// Caminho relativo ao cwd do processo (não `__dirname`): o Next.js mantém o
// cwd como a raiz do projeto em dev/build/start. Mesma convenção usada pelo
// catálogo para `content/simulados`.
const CAMINHO_MIGRATIONS = join(process.cwd(), "src/db/migrations");

export async function migrar(pool: Pool): Promise<void> {
  await pool.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    version TEXT PRIMARY KEY,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);

  const arquivos = readdirSync(CAMINHO_MIGRATIONS)
    .filter((arquivo) => /^\d+_[a-z0-9_]+\.sql$/.test(arquivo))
    .sort();

  for (const arquivo of arquivos) {
    const cliente = await pool.connect();
    try {
      await cliente.query("BEGIN");
      await cliente.query("SELECT pg_advisory_xact_lock(hashtext('simulador_cca_f_migrations'))");
      const aplicada = await cliente.query("SELECT 1 FROM schema_migrations WHERE version = $1", [arquivo]);
      if (aplicada.rowCount) {
        await cliente.query("COMMIT");
        continue;
      }
      await cliente.query(readFileSync(join(CAMINHO_MIGRATIONS, arquivo), "utf-8"));
      await cliente.query("INSERT INTO schema_migrations (version) VALUES ($1)", [arquivo]);
      await cliente.query("COMMIT");
    } catch (erro) {
      await cliente.query("ROLLBACK");
      throw erro;
    } finally {
      cliente.release();
    }
  }
}
