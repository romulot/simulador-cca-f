/** Aplica `schema.sql` a uma conexão SQLite, de forma idempotente.
 *
 * `schema.sql` usa `CREATE TABLE IF NOT EXISTS` / `CREATE INDEX IF NOT
 * EXISTS`, então rodar esta função duas vezes contra o mesmo banco não
 * falha nem duplica nada.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type Database from "better-sqlite3";

// Caminho relativo ao cwd do processo (não `__dirname`): o Next.js mantém o
// cwd como a raiz do projeto em dev/build/start, e um bundle empacotado
// perderia a posição relativa de `schema.sql` no disco. Mesma convenção já
// usada em `src/lib/parser/parser.ts` para `content/simulados`.
const CAMINHO_SCHEMA = join(process.cwd(), "src/db/schema.sql");

export function migrar(db: Database.Database): void {
  const schema = readFileSync(CAMINHO_SCHEMA, "utf-8");
  db.exec(schema);
}
