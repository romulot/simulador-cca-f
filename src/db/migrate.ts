/** Aplica `schema.sql` a um pool Postgres, de forma idempotente.
 *
 * `schema.sql` usa `CREATE TABLE IF NOT EXISTS` / `CREATE INDEX IF NOT
 * EXISTS`, então rodar esta função duas vezes contra o mesmo banco não
 * falha nem duplica nada. `pool.query()` com uma única string (sem
 * parâmetros) usa o protocolo "simple query" do Postgres, que aceita
 * múltiplos statements separados por `;` numa chamada só — não precisa
 * dividir o schema em comandos individuais.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Pool } from "pg";

// Caminho relativo ao cwd do processo (não `__dirname`): o Next.js mantém o
// cwd como a raiz do projeto em dev/build/start, e um bundle empacotado
// perderia a posição relativa de `schema.sql` no disco. Mesma convenção já
// usada em `src/lib/parser/parser.ts` para `content/simulados`.
const CAMINHO_SCHEMA = join(process.cwd(), "src/db/schema.sql");

export async function migrar(pool: Pool): Promise<void> {
  const schema = readFileSync(CAMINHO_SCHEMA, "utf-8");
  await pool.query(schema);
}
