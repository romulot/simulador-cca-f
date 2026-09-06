/** `POST /api/rodadas` — cria uma rodada nova (prática ou prova).
 *
 * Modo prática aceita três formas de selecionar as questões (exatamente
 * uma por requisição):
 *   - `{ pares: string[] }` — nomes de pares descobertos por
 *     `catalogo.descobrir()`; valida cada nome contra o catálogo atual
 *     (rejeita nome inexistente ou par inválido), monta a lista de
 *     questões dos pares selecionados e embaralha.
 *   - `{ topicoId: string, quantidade?: number }` — "Praticar este
 *     tópico" (Fase 9): seleciona até `quantidade` (padrão 5) questões
 *     daquele tópico em todo o corpus, priorizando nunca respondidas,
 *     depois erradas, depois as mais antigas (`selecionarParaPraticar`).
 *   - `{ revisao: true }` — "Revisar meus erros" (Fase 10): todas as
 *     questões cuja última tentativa do usuário foi errada
 *     (`questoesEmRevisao`).
 *
 * Modo prova: recebe `{ modo: "prova" }`, aplica `sortear()` (cotas por
 * domínio, método do maior resto, déficit nunca redistribuído) sobre TODO o
 * corpus válido disponível.
 *
 * Em todos os casos, grava a rodada via `repositorioRodadas.criarRodada`
 * (associada ao usuário da sessão) e devolve só a PRIMEIRA questão, já
 * sanitizada (`paraQuestaoCliente` — nunca a resposta certa).
 */
import { NextResponse } from "next/server";

import { descobrir } from "@/lib/catalogo";
import { obterConexao } from "@/db/conexao";
import { carregarRodada, criarRodada } from "@/db/repositorioRodadas";
import { respostasBrutas } from "@/db/repositorioAprendizado";
import { obterUsuarioIdDaSessao } from "@/lib/auth/sessao";
import { criarRngPadrao, embaralhar, LIMITE_SEGUNDOS, pool, sortear } from "@/domain/sorteio";
import {
  QUANTIDADE_PRATICAR_PADRAO,
  questoesEmRevisao,
  selecionarParaPraticar,
} from "@/domain/aprendizado";
import { topicoPorId } from "@/domain/topicos";
import { paraQuestaoCliente } from "@/lib/api/questaoCliente";
import type { Questao } from "@/lib/parser/tipos";

interface ComposicaoResposta {
  cotas: Record<number, number>;
  disponivel: Record<number, number>;
  porDominio: Record<number, number>;
  deficit: Record<number, number>;
}

function respostaErro(status: number, mensagem: string) {
  return NextResponse.json({ erro: mensagem }, { status });
}

export async function POST(request: Request): Promise<Response> {
  const userId = obterUsuarioIdDaSessao(request);
  if (userId === null) {
    return respostaErro(401, "não autenticado");
  }

  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return respostaErro(400, "corpo da requisição não é JSON válido");
  }

  if (!corpo || typeof corpo !== "object" || !("modo" in corpo)) {
    return respostaErro(400, "'modo' é obrigatório");
  }
  const modo = (corpo as { modo: unknown }).modo;
  if (modo !== "pratica" && modo !== "prova") {
    return respostaErro(400, "'modo' deve ser 'pratica' ou 'prova'");
  }

  const paresDisponiveis = descobrir();
  const rng = criarRngPadrao();

  let questoes: Questao[];
  let limiteSegundos: number | null;
  let composicaoResposta: ComposicaoResposta | null = null;

  if (modo === "prova") {
    const validas = paresDisponiveis.filter((p) => p.erro === null).flatMap((p) => p.questoes);
    const poolPorDominio = pool(validas);
    const resultado = sortear(poolPorDominio, rng);

    if (resultado.questoes.length === 0) {
      return respostaErro(422, "nenhuma questão disponível para montar a prova");
    }

    questoes = resultado.questoes;
    limiteSegundos = LIMITE_SEGUNDOS;
    composicaoResposta = {
      cotas: resultado.cotas,
      disponivel: resultado.disponivel,
      porDominio: resultado.porDominio,
      deficit: resultado.deficit,
    };
  } else {
    const corpoObj = corpo as Record<string, unknown>;
    const metodos = ["pares", "topicoId", "revisao"].filter((campo) => campo in corpoObj);
    if (metodos.length === 0) {
      return respostaErro(400, "informe 'pares', 'topicoId' ou 'revisao'");
    }
    if (metodos.length > 1) {
      return respostaErro(400, "informe só uma forma de seleção: 'pares', 'topicoId' ou 'revisao'");
    }

    limiteSegundos = null;

    if ("pares" in corpoObj) {
      const paresPedidos = corpoObj.pares;
      if (!Array.isArray(paresPedidos) || paresPedidos.length === 0) {
        return respostaErro(400, "'pares' deve ser uma lista não vazia de nomes de simulados");
      }
      if (!paresPedidos.every((p): p is string => typeof p === "string")) {
        return respostaErro(400, "'pares' deve conter apenas strings");
      }

      const porNome = new Map(paresDisponiveis.map((p) => [p.nome, p]));
      const invalidos = paresPedidos.filter((nome) => {
        const par = porNome.get(nome);
        return !par || par.erro !== null;
      });
      if (invalidos.length > 0) {
        return respostaErro(400, `simulados inexistentes ou inválidos: ${invalidos.join(", ")}`);
      }

      const selecionadas = paresPedidos.flatMap((nome) => porNome.get(nome)!.questoes);
      questoes = embaralhar(selecionadas, rng);
    } else if ("topicoId" in corpoObj) {
      // Fase 9 — "Praticar este tópico": até `quantidade` questões daquele
      // tópico em todo o corpus, priorizadas por selecionarParaPraticar().
      const topicoId = corpoObj.topicoId;
      const topico = typeof topicoId === "string" ? topicoPorId(topicoId) : undefined;
      if (!topico) {
        return respostaErro(400, "'topicoId' desconhecido");
      }

      const quantidadePedida = corpoObj.quantidade;
      const quantidade = quantidadePedida === undefined ? QUANTIDADE_PRATICAR_PADRAO : Number(quantidadePedida);
      if (!Number.isInteger(quantidade) || quantidade <= 0) {
        return respostaErro(400, "'quantidade' deve ser um inteiro positivo");
      }

      const validas = paresDisponiveis.filter((p) => p.erro === null).flatMap((p) => p.questoes);
      const candidatas = validas.filter((q) => q.topicos.includes(topico.nome));
      if (candidatas.length === 0) {
        return respostaErro(422, "nenhuma questão disponível para esse tópico");
      }

      const db = await obterConexao();
      const respostas = await respostasBrutas(db, userId);
      questoes = selecionarParaPraticar(candidatas, respostas, quantidade, rng);
    } else {
      // Fase 10 — "Revisar meus erros": todas as questões cuja última
      // tentativa do usuário foi errada.
      const validas = paresDisponiveis.filter((p) => p.erro === null).flatMap((p) => p.questoes);
      const porChave = new Map(validas.map((q) => [`${q.origem}#${q.numero}`, q]));

      const db = await obterConexao();
      const respostas = await respostasBrutas(db, userId);
      const encontradas = questoesEmRevisao(respostas)
        .map((r) => porChave.get(`${r.origem}#${r.numero}`))
        .filter((q): q is Questao => q !== undefined);

      if (encontradas.length === 0) {
        return respostaErro(422, "nenhuma questão aguardando revisão");
      }
      questoes = embaralhar(encontradas, rng);
    }
  }

  const db = await obterConexao();
  const rodadaId = await criarRodada(db, {
    userId,
    questoes,
    modo,
    limiteSegundos,
    composicao: composicaoResposta
      ? {
          cotas: composicaoResposta.cotas,
          disponivel: composicaoResposta.disponivel,
          deficit: composicaoResposta.deficit,
        }
      : undefined,
    iniciadaEm: new Date(),
  });

  // Recarrega em vez de reaproveitar `questoes` em memória: garante que a
  // primeira questão devolvida é exatamente a que ficou gravada na posição
  // 0 (mesma fonte da verdade que qualquer requisição futura de navegação).
  const persistida = (await carregarRodada(db, rodadaId, userId))!;

  return NextResponse.json(
    {
      rodadaId,
      modo,
      totalQuestoes: persistida.estado.questoes.length,
      limiteSegundos,
      questaoAtual: paraQuestaoCliente(persistida.estado.questoes[0], 0),
      composicao: composicaoResposta,
    },
    { status: 201 },
  );
}
