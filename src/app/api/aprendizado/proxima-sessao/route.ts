/** `GET /api/aprendizado/proxima-sessao?minutos=NN` — recomendação
 * adaptativa de próxima sessão de estudo (peso do domínio × cobertura que
 * falta × acurácia como fator secundário, cortada pelo tempo disponível).
 *
 * `minutos` é opcional: se ausente, usa `minutosSessaoPadrao` do perfil do
 * candidato; se o perfil também não tiver, usa `MINUTOS_PADRAO` (30).
 *
 * Estatística nunca é lida de coluna persistida — sempre recalculada a
 * partir dos fatos brutos, mesmo espírito de `/api/aprendizado/resumo`.
 */
import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { obterPerfil } from "@/db/repositorioUsuarios";
import { respostasBrutas } from "@/db/repositorioAprendizado";
import { obterUsuarioIdDaSessao } from "@/lib/auth/sessao";
import { descobrir } from "@/lib/catalogo";
import { estatisticasPorTopico } from "@/domain/aprendizado";
import {
  contarDisponivelPorTopico,
  MINUTOS_PADRAO,
  prioridades,
  proximaSessao,
} from "@/domain/recomendacao";
import { TOPICOS } from "@/domain/topicos";

function respostaErro(status: number, mensagem: string) {
  return NextResponse.json({ erro: mensagem }, { status });
}

export async function GET(request: Request): Promise<Response> {
  const userId = obterUsuarioIdDaSessao(request);
  if (userId === null) {
    return respostaErro(401, "não autenticado");
  }

  const url = new URL(request.url);
  const minutosParam = url.searchParams.get("minutos");
  let minutosDisponiveis: number;
  if (minutosParam !== null) {
    const valor = Number(minutosParam);
    if (!Number.isInteger(valor) || valor <= 0) {
      return respostaErro(400, "'minutos' deve ser um inteiro positivo");
    }
    minutosDisponiveis = valor;
  } else {
    const db = await obterConexao();
    const perfil = await obterPerfil(db, userId);
    minutosDisponiveis = perfil.minutosSessaoPadrao ?? MINUTOS_PADRAO;
  }

  const db = await obterConexao();
  const respostas = await respostasBrutas(db, userId);
  const pares = descobrir();

  const validas = pares.filter((p) => p.erro === null).flatMap((p) => p.questoes);
  const disponivelPorTopico = contarDisponivelPorTopico(validas);
  const estatisticas = estatisticasPorTopico(respostas);

  const itens = prioridades(TOPICOS, disponivelPorTopico, estatisticas);
  const sessao = proximaSessao(itens, minutosDisponiveis);

  return NextResponse.json({
    minutosDisponiveis,
    selecionados: sessao.selecionados,
    minutosEstimados: sessao.minutosEstimados,
    dominiosComCoberturaCompleta: sessao.dominiosComCoberturaCompleta,
  });
}
