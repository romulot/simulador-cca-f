import { Pool } from "pg";

import { migrar } from "./migrate.ts";

type Dependencias = {
  criarPool: (connectionString: string) => Pool;
  migrar: (pool: Pool) => Promise<void>;
};

const dependenciasPadrao: Dependencias = {
  criarPool: (connectionString) => new Pool({ connectionString }),
  migrar,
};

export async function executarMigrationsAdministrativas(
  ambiente: Readonly<Record<string, string | undefined>> = process.env,
  dependencias: Dependencias = dependenciasPadrao,
): Promise<void> {
  const connectionString = ambiente.MIGRATION_DATABASE_URL;
  if (!connectionString || connectionString.trim() === "") {
    throw new Error(
      "MIGRATION_DATABASE_URL não configurada — use uma conexão administrativa Session Pooler/Direct na porta 5432.",
    );
  }

  const pool = dependencias.criarPool(connectionString);
  try {
    await dependencias.migrar(pool);
  } finally {
    await pool.end();
  }
}

if (import.meta.main) {
  executarMigrationsAdministrativas().catch((erro: unknown) => {
    const mensagem = erro instanceof Error ? erro.message : "Falha desconhecida ao executar migrations.";
    console.error(`Erro ao executar migrations: ${mensagem}`);
    process.exitCode = 1;
  });
}
