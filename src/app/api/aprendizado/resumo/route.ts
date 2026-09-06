/** `GET /api/aprendizado/resumo` — resumo de aprendizado do usuário da
 * sessão: domínios com ponto fraco (Fase 8) e quantas questões estão
 * aguardando revisão (Fase 10). Alimenta tanto a página "Meus pontos
 * fracos" quanto o card do dashboard.
 *
 * Estatística nunca é lida de coluna persistida — sempre recalculada aqui
 * a partir dos fatos brutos (`repositorioAprendizado.respostasBrutas`),
 * mesmo espírito de `repositorioHistorico.ts` (§10.2 do plano de
 * aprendizado).
 */
import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { respostasBrutas } from "@/db/repositorioAprendizado";
import { obterUsuarioIdDaSessao } from "@/lib/auth/sessao";
import {
  desempenhoPorDominio,
  estatisticasPorTopico,
  pontosFracos,
  questoesEmRevisao,
} from "@/domain/aprendizado";
import { topicoPorId } from "@/domain/topicos";

interface TopicoFracoResposta {
  topicoId: string;
  nome: string;
  acertos: number;
  erros: number;
  totalRespondido: number;
  percentual: number;
}

interface DominioResumoResposta {
  dominio: number;
  percentual: number;
  totalRespondido: number;
  topicosFracos: TopicoFracoResposta[];
}

export async function GET(request: Request): Promise<Response> {
  const userId = obterUsuarioIdDaSessao(request);
  if (userId === null) {
    return NextResponse.json({ erro: "não autenticado" }, { status: 401 });
  }

  const db = await obterConexao();
  const respostas = await respostasBrutas(db, userId);

  const fracos = pontosFracos(estatisticasPorTopico(respostas));
  const porDominio = new Map(desempenhoPorDominio(respostas).map((d) => [d.dominio, d]));

  const dominios = new Map<number, DominioResumoResposta>();
  for (const fraco of fracos) {
    const topico = topicoPorId(fraco.topicoId);
    if (!topico) continue; // defensivo: não deveria acontecer com o catálogo curado
    const resumoDominio = porDominio.get(topico.dominio);
    if (!resumoDominio) continue;
    if (!dominios.has(topico.dominio)) {
      dominios.set(topico.dominio, {
        dominio: topico.dominio,
        percentual: resumoDominio.percentual,
        totalRespondido: resumoDominio.totalRespondido,
        topicosFracos: [],
      });
    }
    dominios.get(topico.dominio)!.topicosFracos.push({
      topicoId: fraco.topicoId,
      nome: topico.nome,
      acertos: fraco.acertos,
      erros: fraco.erros,
      totalRespondido: fraco.totalRespondido,
      percentual: fraco.percentual,
    });
  }

  return NextResponse.json({
    dominios: [...dominios.values()].sort((a, b) => a.dominio - b.dominio),
    emRevisao: questoesEmRevisao(respostas).length,
  });
}
