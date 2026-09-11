/** `GET /api/rodadas/:id` — estado atual de uma rodada (retomar após reload).
 *
 * Devolve o suficiente para o cliente reconstruir a tela sem precisar
 * adivinhar nada: índice atual, respostas já dadas, tempo restante
 * (RECOMPUTADO aqui, a partir de `iniciada_em` — nunca aceito do cliente),
 * e a questão atual já sanitizada (nunca a resposta certa).
 *
 * Uma rodada de outro usuário devolve 404 — mesmo tratamento de "não
 * existe" (nunca revela que o id pertence a outra conta).
 */
import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { carregarEstadoRodadaLeve } from "@/db/repositorioRodadas";
import { obterUsuarioIdDaSessao } from "@/lib/auth/sessao";

function erro(status: number, mensagem: string) {
  return NextResponse.json({ erro: mensagem }, { status });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const userId = obterUsuarioIdDaSessao(request);
  if (userId === null) {
    return erro(401, "não autenticado");
  }

  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return erro(400, "id inválido");
  }

  const db = await obterConexao();
  const persistida = await carregarEstadoRodadaLeve(db, id, userId);
  if (!persistida) {
    return erro(404, "rodada não encontrada");
  }

  const decorridoSegundos =
    persistida.status === "finalizada"
      ? (persistida.decorridoSegundos ?? 0)
      : Math.max(0, Date.now() / 1000 - persistida.iniciadaEm.getTime() / 1000);
  const restanteSegundos =
    persistida.limiteSegundos === null
      ? null
      : Math.max(0, persistida.limiteSegundos - decorridoSegundos);
  const estaEncerrada =
    persistida.totalQuestoes === 0 ||
    persistida.status === "finalizada" ||
    (persistida.limiteSegundos !== null && decorridoSegundos >= persistida.limiteSegundos);

  return NextResponse.json({
    rodadaId: id,
    modo: persistida.modo,
    status: persistida.status,
    totalQuestoes: persistida.totalQuestoes,
    limiteSegundos: persistida.limiteSegundos,
    restanteSegundos,
    decorridoSegundos,
    indiceAtual: persistida.indiceAtual,
    respostas: persistida.respostas,
    encerrada: estaEncerrada,
    questaoAtual: estaEncerrada ? null : persistida.questaoAtual,
    composicao: persistida.composicao,
  });
}
