/** Pool de conexões Postgres singleton do processo Next.js.
 *
 * `DATABASE_URL` aponta para o Postgres (Neon em produção — usar o
 * endpoint com pooler, host com sufixo `-pooler`; um Postgres local em
 * dev/test). SSL é decidido pela própria connection string (`sslmode=...`),
 * não fixado aqui, para funcionar igual local (sem SSL) e na Neon (SSL
 * obrigatório).
 *
 * O pool e a promise de migração são guardados em `globalThis` (não só num
 * módulo-nível `let`) porque, em dev, o Fast Refresh do Next.js pode
 * reavaliar este módulo mais de uma vez no mesmo processo — sem isso, cada
 * reavaliação abriria um pool novo e vazaria o anterior, e a migração
 * rodaria mais de uma vez concorrentemente.
 */
import { Pool } from "pg";

import { migrar } from "./migrate";

function criarPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || connectionString.trim() === "") {
    throw new Error(
      "DATABASE_URL não configurada — necessária para conectar ao Postgres (Neon ou local).",
    );
  }
  return new Pool({ connectionString });
}

declare global {
  var __simuladorPool: Pool | undefined;
  var __simuladorMigracao: Promise<void> | undefined;
}

export async function obterConexao(): Promise<Pool> {
  if (!globalThis.__simuladorPool) {
    globalThis.__simuladorPool = criarPool();
  }
  if (!globalThis.__simuladorMigracao) {
    globalThis.__simuladorMigracao = migrar(globalThis.__simuladorPool);
  }
  await globalThis.__simuladorMigracao;
  return globalThis.__simuladorPool;
}
