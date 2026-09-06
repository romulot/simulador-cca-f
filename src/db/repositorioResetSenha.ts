import type { Pool } from "pg";

export async function criarTokenReset(
  pool: Pool,
  userId: number,
  tokenHash: string,
  expiresAt: Date,
): Promise<void> {
  await pool.query("UPDATE password_reset_tokens SET used_at = now() WHERE user_id = $1 AND used_at IS NULL", [userId]);
  await pool.query(
    "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)",
    [userId, tokenHash, expiresAt],
  );
}

export async function alterarSenhaComToken(
  pool: Pool,
  tokenHash: string,
  senhaHash: string,
): Promise<boolean> {
  const cliente = await pool.connect();
  try {
    await cliente.query("BEGIN");
    const token = await cliente.query<{ id: number; user_id: number }>(
      `SELECT id, user_id FROM password_reset_tokens
       WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()
       FOR UPDATE`,
      [tokenHash],
    );
    const linha = token.rows[0];
    if (!linha) {
      await cliente.query("ROLLBACK");
      return false;
    }
    await cliente.query("UPDATE usuarios SET senha_hash = $1 WHERE id = $2", [senhaHash, linha.user_id]);
    await cliente.query("UPDATE password_reset_tokens SET used_at = now() WHERE id = $1", [linha.id]);
    await cliente.query("COMMIT");
    return true;
  } catch (erro) {
    await cliente.query("ROLLBACK");
    throw erro;
  } finally {
    cliente.release();
  }
}
