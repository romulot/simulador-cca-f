/** Pool de conexões Postgres singleton do processo Next.js.
 *
 * `DATABASE_URL` aponta para o Supabase Transaction Pooler em produção ou
 * para um Postgres local em dev/test. SSL é decidido pela própria connection
 * string (`sslmode=...`), não fixado aqui.
 *
 * O pool é guardado em `globalThis` (não só num módulo-nível `let`) porque,
 * em dev, o Fast Refresh do Next.js pode reavaliar este módulo mais de uma
 * vez no mesmo processo — sem isso, cada reavaliação abriria um pool novo e
 * vazaria o anterior.
 */
import { Pool } from "pg";

function criarPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.trim() === "") {
    throw new Error(
      "DATABASE_URL não configurada — necessária para a conexão de runtime com o Postgres.",
    );
  }
  return new Pool({ connectionString });
}

declare global {
  var __simuladorPool: Pool | undefined;
}

export function obterConexao(): Pool {
  if (!globalThis.__simuladorPool) {
    globalThis.__simuladorPool = criarPool();
  }
  return globalThis.__simuladorPool;
}
