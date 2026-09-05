/** Hash de senha via `bcryptjs` — puro JS, sem binário nativo (ver
 * `docs/decisoes/persistencia-e-auth.md`). */
import bcrypt from "bcryptjs";

const RODADAS_HASH = 10;

export function hashSenha(senha: string): Promise<string> {
  return bcrypt.hash(senha, RODADAS_HASH);
}

export function verificarSenha(senha: string, hash: string): Promise<boolean> {
  return bcrypt.compare(senha, hash);
}
