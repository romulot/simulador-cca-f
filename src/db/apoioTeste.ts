/** Apoio compartilhado pelos testes que exercitam a camada de dados real.
 *
 * Não existe mais um banco SQLite em arquivo temporário por teste (era
 * possível porque cada arquivo era uma instância física isolada). Com
 * Postgres há UM banco real compartilhado por todos os testes (ver
 * `vitest.config.mts` — `DATABASE_URL` aponta para um Postgres local de
 * desenvolvimento); o isolamento agora vem de cada teste operar sobre o
 * PRÓPRIO usuário (`criarUsuarioTeste`), já que toda tabela de dado
 * (`rodadas`) é filtrada por `user_id` — dados de outro teste/usuário nunca
 * aparecem nas consultas de um teste que não é dono deles.
 */
import { Pool } from "pg";

import { migrar } from "./migrate";

declare global {
  // eslint-disable-next-line no-var
  var __poolTeste: Pool | undefined;
  // eslint-disable-next-line no-var
  var __migracaoTeste: Promise<void> | undefined;
}

function connectionStringTeste(): string {
  const valor = process.env.DATABASE_URL;
  if (!valor || valor.trim() === "") {
    throw new Error(
      "DATABASE_URL não configurada — os testes precisam de um Postgres real " +
        "(ver README, seção 'Desenvolvimento local').",
    );
  }
  return valor;
}

export async function poolTeste(): Promise<Pool> {
  if (!globalThis.__poolTeste) {
    globalThis.__poolTeste = new Pool({ connectionString: connectionStringTeste() });
  }
  if (!globalThis.__migracaoTeste) {
    globalThis.__migracaoTeste = migrar(globalThis.__poolTeste);
  }
  await globalThis.__migracaoTeste;
  return globalThis.__poolTeste;
}

let contadorUsuario = 0;

/** Cria um usuário novo (email descartável, hash não usado em nenhuma
 * verificação) e devolve o id — cada teste que precisa de isolamento chama
 * isto no seu próprio `beforeEach`. */
export async function criarUsuarioTeste(pool: Pool): Promise<number> {
  contadorUsuario += 1;
  const email = `teste-${process.pid}-${Date.now()}-${contadorUsuario}@exemplo.invalido`;
  const resultado = await pool.query<{ id: number }>(
    "INSERT INTO usuarios (email, senha_hash) VALUES ($1, 'hash-nao-usado-em-teste') RETURNING id",
    [email],
  );
  return resultado.rows[0].id;
}
