/** Roda uma vez quando o servidor Next.js inicializa (antes de qualquer
 * requisição). Aplica migrations pendentes para que o schema do banco nunca
 * fique desatualizado em relação ao código implantado.
 *
 * A guarda `NEXT_RUNTIME === 'nodejs'` é obrigatória: `migrate.ts` usa
 * `node:fs`, que não existe no Edge Runtime.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { migrar } = await import("./db/migrate");
    const { obterConexao } = await import("./db/conexao");
    try {
      await migrar(obterConexao());
    } catch (erro) {
      console.error("[instrumentation] Falha ao aplicar migrations:", erro);
    }
  }
}
