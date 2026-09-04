/** `GET`/`POST /api/rodadas/:id/questoes/:indice` — leitura e mutação da
 * questão em `:indice`.
 *
 * `GET`: leitura pura (não move o índice, não acumula tempo) — a questão
 * naquela posição, sanitizada, mais a resposta que o próprio candidato já
 * deu ali (se houver).
 *
 * `POST`: age SOBRE a questão em `:indice`, que precisa ser exatamente a
 * questão atual do servidor (rejeita com 409 se não for — evita que uma
 * requisição atrasada aja sobre uma posição que o servidor já deixou para
 * trás). Duas ações possíveis no corpo:
 *   - `{ resposta: "A", segundosGastos }` — grava a resposta e avança
 *     (equivalente a `responder()` do domínio).
 *   - `{ destino: 3, segundosGastos }` — navega para `destino`, sem
 *     gravar resposta (equivalente a `irPara()`).
 *
 * `segundosGastos` é SEMPRE o tempo que o candidato passou olhando para a
 * questão `:indice` antes desta chamada — reportado pelo cliente e só
 * ACUMULADO aqui (a rota, não o domínio, soma isso a `tempos[indice]`,
 * porque não há cronômetro vivo em processo entre requisições HTTP; ver
 * `RodadaEstado.marcaEm` em `src/domain/rodada.ts`). O que NUNCA vem do
 * cliente é se o tempo da PROVA esgotou — isso é sempre recomputado a
 * partir de `iniciada_em` (ver `encerrada()`/`GET /api/rodadas/:id`).
 */
import { NextResponse } from "next/server";

import { obterConexao } from "@/db/conexao";
import { carregarRodada, salvarRodada } from "@/db/repositorioRodadas";
import { encerrada, irPara, relogioPadrao, responder, type RodadaEstado } from "@/domain/rodada";
import { paraQuestaoCliente } from "@/lib/api/questaoCliente";
import type { Letra } from "@/lib/parser/tipos";

const LETRAS_VALIDAS = new Set(["A", "B", "C", "D"]);

function erro(status: number, mensagem: string) {
  return NextResponse.json({ erro: mensagem }, { status });
}

interface ParamsRota {
  params: Promise<{ id: string; indice: string }>;
}

interface ContextoValido {
  db: ReturnType<typeof obterConexao>;
  id: number;
  estado: RodadaEstado;
  indice: number;
}

/** Resolve e valida id/índice comuns a GET e POST; devolve a resposta de
 * erro pronta quando algo não bate. */
function carregarContexto(
  idParam: string,
  indiceParam: string,
): { erro: Response } | { erro?: undefined; contexto: ContextoValido } {
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return { erro: erro(400, "id inválido") };
  }

  const db = obterConexao();
  const persistida = carregarRodada(db, id);
  if (!persistida) {
    return { erro: erro(404, "rodada não encontrada") };
  }

  const indice = Number(indiceParam);
  if (!Number.isInteger(indice) || indice < 0 || indice >= persistida.estado.questoes.length) {
    return { erro: erro(400, "índice fora da faixa da rodada") };
  }

  return { contexto: { db, id, estado: persistida.estado, indice } };
}

export async function GET(_request: Request, { params }: ParamsRota): Promise<Response> {
  const { id: idParam, indice: indiceParam } = await params;
  const resultado = carregarContexto(idParam, indiceParam);
  if (resultado.erro) return resultado.erro;

  const { estado, indice } = resultado.contexto;
  return NextResponse.json({
    questao: paraQuestaoCliente(estado.questoes[indice], indice),
    resposta: estado.respostas[indice],
  });
}

interface CorpoAcao {
  segundosGastos: number;
  destino?: number;
  resposta?: Letra;
}

function corpoValido(corpo: unknown): corpo is CorpoAcao {
  if (!corpo || typeof corpo !== "object") return false;
  const c = corpo as Record<string, unknown>;
  return typeof c.segundosGastos === "number" && Number.isFinite(c.segundosGastos) && c.segundosGastos >= 0;
}

export async function POST(request: Request, { params }: ParamsRota): Promise<Response> {
  const { id: idParam, indice: indiceParam } = await params;
  const resultado = carregarContexto(idParam, indiceParam);
  if (resultado.erro) return resultado.erro;
  const { db, id, estado: estadoCarregado, indice } = resultado.contexto;

  const relogio = relogioPadrao();

  // A autoridade sobre "a prova acabou" é sempre do servidor: se
  // `encerrada()` (por tempo esgotado ou por `encerrar()` explícito já
  // ter sido chamado) já é true aqui, nenhuma ação do cliente é aceita —
  // mesmo que o cliente ainda ache que há tempo.
  if (encerrada(estadoCarregado, relogio)) {
    return erro(409, "rodada já encerrada");
  }
  if (indice !== estadoCarregado.indice) {
    return erro(
      409,
      `a questão atual do servidor é a posição ${estadoCarregado.indice}, não ${indice}`,
    );
  }

  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return erro(400, "corpo da requisição não é JSON válido");
  }
  if (!corpoValido(corpo)) {
    return erro(400, "'segundosGastos' deve ser um número >= 0");
  }

  // Acumula o tempo reportado pelo cliente na questão que está saindo de
  // cena. É a própria rota que soma (não `responder()`/`irPara()`): o
  // domínio não tem "marcaEm" vivo entre requisições HTTP, então quem
  // sabe quanto tempo se passou enquanto o candidato olhava a tela é só o
  // cliente.
  const tempos = [...estadoCarregado.tempos];
  tempos[indice] += corpo.segundosGastos;
  let estado: RodadaEstado = { ...estadoCarregado, tempos };

  if (corpo.resposta !== undefined) {
    if (!LETRAS_VALIDAS.has(corpo.resposta)) {
      return erro(400, "'resposta' deve ser 'A', 'B', 'C' ou 'D'");
    }
    estado = responder(estado, corpo.resposta, relogio);
  } else if (corpo.destino !== undefined) {
    if (
      !Number.isInteger(corpo.destino) ||
      corpo.destino < 0 ||
      corpo.destino >= estado.questoes.length
    ) {
      return erro(400, "'destino' fora da faixa da rodada");
    }
    estado = irPara(estado, corpo.destino, relogio);
  } else {
    return erro(400, "informe 'resposta' ou 'destino'");
  }

  salvarRodada(db, id, estado, relogio);

  return NextResponse.json({
    indiceAtual: estado.indice,
    respostas: estado.respostas,
    questaoAtual: paraQuestaoCliente(estado.questoes[estado.indice], estado.indice),
  });
}
