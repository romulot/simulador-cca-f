/** Leitura do histórico de rodadas finalizadas.
 *
 * Porte do espírito de `simulador/simulador/historico.py` (Python): a
 * ESTATÍSTICA (acertos, percentual) nunca é lida de coluna persistida —
 * é sempre recalculada aqui, a partir das respostas brutas, via
 * `placar()` do domínio, para nunca haver duas fontes de verdade
 * divergentes. Uma rodada com dado corrompido (JSON inválido, campo
 * inesperado) aparece na listagem com `erro` preenchido em vez de
 * derrubar a listagem inteira — mesmo tratamento que o Python dá a um
 * snapshot ilegível.
 *
 * Toda função recebe `userId`: histórico é sempre o de UM usuário, nunca
 * global — isolamento herdado de `carregarRodada`/`rodadas.user_id`.
 */
import type { Pool } from "pg";

import { placar as placarDominio, relogioInerte, type Modo, type Placar } from "@/domain/rodada";
import { carregarRodada } from "./repositorioRodadas";

/** Uma linha do histórico — abrível ou não. */
export interface EntradaHistorico {
  id: number;
  quando: Date | null;
  modo: Modo | null;
  placar: Placar | null;
  esgotouTempo: boolean;
  /** Nomes distintos dos simulados da rodada, em ordem alfabética; só faz
   * sentido no modo prática (no modo prova é sempre o corpus inteiro sob os
   * pesos oficiais, não distingue nada). Vazio nas entradas com erro. */
  origens: string[];
  /** Motivo de a entrada não ser abrível; `null` quando está tudo certo. */
  erro: string | null;
}

function origensDistintas(origens: string[]): string[] {
  return [...new Set(origens)].sort();
}

/** Uma entrada do histórico a partir do id, com leitura defensiva: qualquer
 * erro de dado (não de programação) vira `erro` preenchido, não exceção. */
export async function carregarEntradaHistorico(
  pool: Pool,
  id: number,
  userId: number,
): Promise<EntradaHistorico | null> {
  const vazia: Omit<EntradaHistorico, "erro"> = {
    id,
    quando: null,
    modo: null,
    placar: null,
    esgotouTempo: false,
    origens: [],
  };

  let persistida;
  try {
    persistida = await carregarRodada(pool, id, userId);
  } catch (erro) {
    return { ...vazia, erro: `rodada ilegível: ${(erro as Error).message}` };
  }
  if (!persistida) return null;
  if (persistida.status !== "finalizada") {
    return { ...vazia, erro: "rodada ainda em andamento" };
  }

  try {
    const p = placarDominio(persistida.estado, relogioInerte());
    return {
      id,
      quando: persistida.iniciadaEm,
      modo: persistida.estado.modo,
      placar: p,
      esgotouTempo: persistida.estado.esgotouTempo,
      origens: origensDistintas(persistida.estado.questoes.map((q) => q.origem)),
      erro: null,
    };
  } catch (erro) {
    return { ...vazia, erro: `formato inesperado: ${(erro as Error).message}` };
  }
}

/** Rodadas finalizadas de `userId`, da mais recente para a mais antiga (por
 * id — igual à ordem cronológica, já que `id` é `GENERATED ALWAYS AS
 * IDENTITY`). */
export async function listarHistorico(pool: Pool, userId: number): Promise<EntradaHistorico[]> {
  const resultado = await pool.query<{ id: number }>(
    "SELECT id FROM rodadas WHERE user_id = $1 AND status = 'finalizada' AND arquivada = FALSE ORDER BY id DESC",
    [userId],
  );

  const entradas: EntradaHistorico[] = [];
  for (const linha of resultado.rows) {
    const entrada = await carregarEntradaHistorico(pool, linha.id, userId);
    if (entrada !== null) entradas.push(entrada);
  }
  return entradas;
}

/** A rodada finalizada mais recente de `userId`, ou `null` se não houver
 * nenhuma.
 *
 * Só abre 1 linha (não todas como `listarHistorico`) — para o painel
 * "última rodada" do menu, que precisa de uma rodada só.
 */
export async function ultimaEntradaHistorico(
  pool: Pool,
  userId: number,
): Promise<EntradaHistorico | null> {
  const resultado = await pool.query<{ id: number }>(
    "SELECT id FROM rodadas WHERE user_id = $1 AND status = 'finalizada' AND arquivada = FALSE ORDER BY id DESC LIMIT 1",
    [userId],
  );
  const linha = resultado.rows[0];
  if (!linha) return null;
  return carregarEntradaHistorico(pool, linha.id, userId);
}

/** Quantas rodadas finalizadas de `userId` existem, sem abrir nenhuma (para
 * redesenhos frequentes de tela que só precisam da contagem). */
export async function contarHistorico(pool: Pool, userId: number): Promise<number> {
  const resultado = await pool.query<{ n: string }>(
    "SELECT COUNT(*) AS n FROM rodadas WHERE user_id = $1 AND status = 'finalizada' AND arquivada = FALSE",
    [userId],
  );
  return Number(resultado.rows[0].n);
}
