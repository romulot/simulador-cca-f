/** `GET /api/aprendizado/resumo` — resumo de aprendizado do usuário da
 * sessão: domínios com ponto fraco (Fase 8), quantas questões estão
 * aguardando revisão (Fase 10), tópicos com dificuldade recorrente (Fase
 * 11) e a manchete geral do dashboard (Fase 13: desempenho geral e
 * pontos fortes). Alimenta a página "Meus pontos fracos" e o dashboard.
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
  desempenhoGeral,
  desempenhoPorDominio,
  errosRecorrentes,
  estatisticasPorTopico,
  pontosFortes,
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

interface TopicoForteResposta {
  topicoId: string;
  nome: string;
  percentual: number;
}

interface ErroRecorrenteResposta {
  topicoId: string;
  nome: string;
  dominio: number;
  erros: number;
  severidade: "recorrente" | "alta";
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

  const estatisticas = estatisticasPorTopico(respostas);

  const fortes: TopicoForteResposta[] = pontosFortes(estatisticas)
    .map((f) => {
      const topico = topicoPorId(f.topicoId);
      return topico ? { topicoId: f.topicoId, nome: topico.nome, percentual: f.percentual } : null;
    })
    .filter((t): t is TopicoForteResposta => t !== null);

  const recorrentes: ErroRecorrenteResposta[] = errosRecorrentes(estatisticas)
    .map((e) => {
      const topico = topicoPorId(e.topicoId);
      return topico
        ? { topicoId: e.topicoId, nome: topico.nome, dominio: topico.dominio, erros: e.erros, severidade: e.severidade }
        : null;
    })
    .filter((t): t is ErroRecorrenteResposta => t !== null);

  return NextResponse.json({
    dominios: [...dominios.values()].sort((a, b) => a.dominio - b.dominio),
    emRevisao: questoesEmRevisao(respostas).length,
    desempenhoGeral: desempenhoGeral(respostas),
    pontosFortes: fortes,
    errosRecorrentes: recorrentes,
  });
}
