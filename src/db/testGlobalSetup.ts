/** Limpeza de dados de teste antes de cada execução do Vitest.
 *
 * Deleta todos os usuários criados por `criarUsuarioTeste` (emails no
 * padrão `teste-%`). O CASCADE em `rodadas` e `questoes_rodada` apaga os
 * dados derivados automaticamente.
 *
 * Roda no processo principal do Vitest (não nos workers), antes de qualquer
 * arquivo de teste, para garantir banco limpo independentemente do que ficou
 * de uma execução anterior interrompida.
 */
import { Pool } from "pg";

export async function setup() {
  const connectionString =
    process.env.DATABASE_URL ?? "postgres://postgres:simulador@localhost:5433/simulador";
  const pool = new Pool({ connectionString });
  try {
    await pool.query("DELETE FROM usuarios WHERE email LIKE 'teste-%'");
  } finally {
    await pool.end();
  }
}
