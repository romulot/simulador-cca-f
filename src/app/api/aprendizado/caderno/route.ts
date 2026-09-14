/** `GET /api/aprendizado/caderno` — caderno de erros/revisão: erros
 * recorrentes por tópico, quais arquétipos de distrator mais confundem o
 * candidato, e o texto completo de cada questão aguardando revisão (última
 * tentativa errada) — tudo derivado dos fatos brutos, nunca de coluna
 * persistida (mesmo espírito de `/api/aprendizado/resumo`).
 *
 * Cruza `questoesEmRevisao` (que só tem origem/número) com o corpus vivo
 * (`descobrir()`) para expor enunciado/alternativas/explicação — o mesmo
 * texto que o candidato já viu na rodada, sem duplicar nada em banco.
 */
import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { respostasBrutas } from "@/db/repositorioAprendizado";
import { obterUsuarioIdDaSessao } from "@/lib/auth/sessao";
import { descobrir } from "@/lib/catalogo";
import {
  arquetiposMaisFrequentes,
  errosRecorrentes,
  estatisticasPorTopico,
  questoesEmRevisao,
} from "@/domain/aprendizado";
import { arquetipoPorId } from "@/domain/arquetipos";
import { topicoPorId } from "@/domain/topicos";
import type { Letra, Questao } from "@/lib/parser/tipos";

export async function GET(request: Request): Promise<Response> {
  const userId = obterUsuarioIdDaSessao(request);
  if (userId === null) {
    return NextResponse.json({ erro: "não autenticado" }, { status: 401 });
  }

  const db = await obterConexao();
  const respostas = await respostasBrutas(db, userId);

  const estatisticas = estatisticasPorTopico(respostas);
  const recorrentes = errosRecorrentes(estatisticas)
    .map((e) => {
      const topico = topicoPorId(e.topicoId);
      return topico
        ? { topicoId: e.topicoId, nome: topico.nome, dominio: topico.dominio, erros: e.erros, severidade: e.severidade }
        : null;
    })
    .filter((t): t is NonNullable<typeof t> => t !== null);

  const arquetiposFrequentes = arquetiposMaisFrequentes(respostas)
    .map(({ arquetipoId, contagem }) => {
      const arquetipo = arquetipoPorId(arquetipoId);
      return arquetipo ? { arquetipoId, nome: arquetipo.nome, antidoto: arquetipo.antidoto, contagem } : null;
    })
    .filter((a): a is NonNullable<typeof a> => a !== null);

  const pares = descobrir();
  const validas = pares.filter((p) => p.erro === null).flatMap((p) => p.questoes);
  const porChave = new Map(validas.map((q) => [`${q.origem}#${q.numero}`, q]));

  const emRevisao = questoesEmRevisao(respostas)
    .map((r) => {
      const questao = porChave.get(`${r.origem}#${r.numero}`);
      if (!questao) return null;
      return montarRevisao(questao, r.ultimaResposta, r.correta);
    })
    .filter((q): q is NonNullable<typeof q> => q !== null);

  return NextResponse.json({ recorrentes, arquetiposFrequentes, emRevisao });
}

function montarRevisao(questao: Questao, ultimaResposta: Letra, correta: Letra) {
  const arquetipoId = questao.arquetiposErrados?.[ultimaResposta] ?? null;
  const arquetipo = arquetipoId ? arquetipoPorId(arquetipoId) : undefined;
  return {
    origem: questao.origem,
    numero: questao.numero,
    dominio: questao.dominio,
    enunciado: questao.enunciado,
    alternativas: questao.alternativas,
    correta,
    ultimaResposta,
    explicacaoErrada: questao.explicacoes[ultimaResposta],
    explicacaoCorreta: questao.explicacoes[correta],
    arquetipo: arquetipo ? { id: arquetipo.id, nome: arquetipo.nome, antidoto: arquetipo.antidoto } : null,
  };
}
