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

/** Perfil do candidato usado pelo motor de recomendação adaptativa
 * (`domain/recomendacao.ts`): data da prova (urgência) e minutos por sessão
 * padrão (corte de tempo quando a rota não recebe 'minutos' explícito).
 * Ambos opcionais — nem todo candidato preenche antes de praticar.
 *
 * `dataProva` é texto ISO 'YYYY-MM-DD', nunca um tipo Date nativo do
 * driver: evita a conversão de fuso horário que `pg` aplicaria a uma coluna
 * DATE/TIMESTAMPTZ (mesma razão de `rodadas.iniciada_em` ser TEXT). Quem
 * exibe o valor formata a string diretamente, sem passar por `new Date()`.
 */
export interface PerfilCandidato {
  dataProva: string | null;
  minutosSessaoPadrao: number | null;
}

export async function obterPerfil(pool: Pool, userId: number): Promise<PerfilCandidato> {
  const resultado = await pool.query<{ data_prova: string | null; minutos_sessao_padrao: number | null }>(
    "SELECT data_prova, minutos_sessao_padrao FROM usuarios WHERE id = $1",
    [userId],
  );
  const linha = resultado.rows[0];
  if (!linha) {
    throw new Error(`obterPerfil: usuário ${userId} não encontrado`);
  }
  return { dataProva: linha.data_prova, minutosSessaoPadrao: linha.minutos_sessao_padrao };
}

export async function salvarPerfil(
  pool: Pool,
  userId: number,
  perfil: PerfilCandidato,
): Promise<void> {
  await pool.query(
    "UPDATE usuarios SET data_prova = $2, minutos_sessao_padrao = $3 WHERE id = $1",
    [userId, perfil.dataProva, perfil.minutosSessaoPadrao],
  );
}
