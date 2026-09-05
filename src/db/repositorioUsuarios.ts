/** Persistência de usuários (cadastro/login). */
import type { Pool } from "pg";

export interface Usuario {
  id: number;
  email: string;
  senhaHash: string;
}

/** Lançado quando `criarUsuario` recebe um email já cadastrado — permite à
 * rota de registro distinguir esse caso de qualquer outro erro de banco. */
export class EmailJaCadastradoError extends Error {
  constructor(email: string) {
    super(`email já cadastrado: ${email}`);
    this.name = "EmailJaCadastradoError";
  }
}

function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function criarUsuario(
  pool: Pool,
  email: string,
  senhaHash: string,
): Promise<Usuario> {
  const emailNormalizado = normalizarEmail(email);
  try {
    const resultado = await pool.query<{ id: number; email: string }>(
      "INSERT INTO usuarios (email, senha_hash) VALUES ($1, $2) RETURNING id, email",
      [emailNormalizado, senhaHash],
    );
    const linha = resultado.rows[0];
    return { id: linha.id, email: linha.email, senhaHash };
  } catch (erro) {
    if ((erro as { code?: string }).code === "23505") {
      throw new EmailJaCadastradoError(emailNormalizado);
    }
    throw erro;
  }
}

export async function buscarUsuarioPorEmail(pool: Pool, email: string): Promise<Usuario | null> {
  const resultado = await pool.query<{ id: number; email: string; senha_hash: string }>(
    "SELECT id, email, senha_hash FROM usuarios WHERE email = $1",
    [normalizarEmail(email)],
  );
  const linha = resultado.rows[0];
  if (!linha) return null;
  return { id: linha.id, email: linha.email, senhaHash: linha.senha_hash };
}
