/** Conexão SQLite singleton do processo Next.js.
 *
 * O caminho do arquivo `.db` é configurável via `SIMULADOR_DB_PATH`, com
 * default `./data/simulador.db` (relativo à raiz do projeto — mesma
 * convenção de `process.cwd()` usada em `migrate.ts` e em
 * `src/lib/parser/parser.ts`). O diretório do arquivo é criado se ainda não
 * existir.
 *
 * A instância é guardada em `globalThis` (não só num módulo-nível `let`)
 * porque, em dev, o Fast Refresh do Next.js pode reavaliar este módulo mais
 * de uma vez no mesmo processo — sem isso, cada reavaliação abriria uma
 * conexão nova e vazaria a anterior.
 */
import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

import { migrar } from "./migrate";

const CAMINHO_PADRAO = join(process.cwd(), "data/simulador.db");

function caminhoBanco(): string {
  const configurado = process.env.SIMULADOR_DB_PATH;
  return configurado && configurado.trim() !== ""
    ? configurado
    : CAMINHO_PADRAO;
}

function abrirConexao(): Database.Database {
  const caminho = caminhoBanco();
  const diretorio = dirname(caminho);
  if (!existsSync(diretorio)) {
    mkdirSync(diretorio, { recursive: true });
  }

  const db = new Database(caminho);
  db.pragma("foreign_keys = ON");
  migrar(db);
  return db;
}

declare global {
  // eslint-disable-next-line no-var
  var __simuladorDb: Database.Database | undefined;
}

export function obterConexao(): Database.Database {
  if (!globalThis.__simuladorDb) {
    globalThis.__simuladorDb = abrirConexao();
  }
  return globalThis.__simuladorDb;
}
