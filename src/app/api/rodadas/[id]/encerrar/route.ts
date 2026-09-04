/** `POST /api/rodadas/:id/encerrar` — fim explícito de uma rodada.
 *
 * Idempotente: chamar de novo numa rodada já finalizada não altera
 * `decorrido`/`esgotouTempo` (mesma garantia de `encerrar()` do domínio) —
 * só devolve o detalhe já congelado.
 *
 * `esgotouTempo` NUNCA vem do corpo da requisição: é sempre `esgotado()`
 * recomputado no servidor a partir de `iniciada_em`, o mesmo princípio das
 * outras rotas de mutação de rodada.
 */
import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { carregarRodada, salvarRodada } from "@/db/repositorioRodadas";
import { encerrar, relogioPadrao } from "@/domain/rodada";
import { montarDetalheRodada } from "@/lib/api/detalheRodada";

function erro(status: number, mensagem: string) {
  return NextResponse.json({ erro: mensagem }, { status });
}

interface CorpoEncerrar {
  /** Tempo gasto na questão que estava em cena antes desta chamada
   * (opcional — o cliente pode chamar encerrar sem ter "saído" de uma
   * questão via navegação primeiro). Mesmo significado de
   * `segundosGastos` na rota de questões/navegação. */
  segundosGastos?: number;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return erro(400, "id inválido");
  }

  const db = obterConexao();
  const persistida = carregarRodada(db, id);
  if (!persistida) {
    return erro(404, "rodada não encontrada");
  }

  let corpo: CorpoEncerrar = {};
  const bruto = await request.text();
  if (bruto.length > 0) {
    try {
      corpo = JSON.parse(bruto);
    } catch {
      return erro(400, "corpo da requisição não é JSON válido");
    }
    if (
      corpo.segundosGastos !== undefined &&
      (typeof corpo.segundosGastos !== "number" ||
        !Number.isFinite(corpo.segundosGastos) ||
        corpo.segundosGastos < 0)
    ) {
      return erro(400, "'segundosGastos' deve ser um número >= 0");
    }
  }

  const relogio = relogioPadrao();
  let estado = persistida.estado;

  if (corpo.segundosGastos !== undefined && persistida.status === "em_andamento") {
    const tempos = [...estado.tempos];
    tempos[estado.indice] += corpo.segundosGastos;
    estado = { ...estado, tempos };
  }

  estado = encerrar(estado, relogio);
  salvarRodada(db, id, estado, relogio);

  // Recarrega para montar o detalhe a partir do estado já persistido e
  // congelado (restaurarFinalizada por dentro de carregarRodada) — evita
  // depender do `estado` em memória desta chamada bater 1:1 com o que foi
  // de fato gravado.
  const persistidaFinal = carregarRodada(db, id)!;

  return NextResponse.json(montarDetalheRodada(persistidaFinal));
}
