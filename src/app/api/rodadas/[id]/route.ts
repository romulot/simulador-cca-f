/** `GET /api/rodadas/:id` — estado atual de uma rodada (retomar após reload).
 *
 * Devolve o suficiente para o cliente reconstruir a tela sem precisar
 * adivinhar nada: índice atual, respostas já dadas, tempo restante
 * (RECOMPUTADO aqui, a partir de `iniciada_em` — nunca aceito do cliente),
 * e a questão atual já sanitizada (nunca a resposta certa).
 */
import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { carregarRodada } from "@/db/repositorioRodadas";
import { atual, decorrido, encerrada, relogioPadrao, restante } from "@/domain/rodada";
import { paraQuestaoCliente } from "@/lib/api/questaoCliente";

function erro(status: number, mensagem: string) {
  return NextResponse.json({ erro: mensagem }, { status });
}

export async function GET(
  _request: Request,
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

  const relogio = relogioPadrao();
  const { estado } = persistida;
  const questaoAtual = atual(estado, relogio);

  return NextResponse.json({
    rodadaId: id,
    modo: estado.modo,
    status: persistida.status,
    totalQuestoes: estado.questoes.length,
    limiteSegundos: estado.limiteSegundos,
    restanteSegundos: restante(estado, relogio),
    decorridoSegundos: decorrido(estado, relogio),
    indiceAtual: estado.indice,
    respostas: estado.respostas,
    encerrada: encerrada(estado, relogio),
    questaoAtual: questaoAtual ? paraQuestaoCliente(questaoAtual, estado.indice) : null,
    composicao: persistida.composicao,
  });
}
