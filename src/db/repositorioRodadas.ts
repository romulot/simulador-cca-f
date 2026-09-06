/** Persistência de uma rodada (prática ou prova) em Postgres.
 *
 * Duas responsabilidades, refletindo o schema (`migrations/001_initial.sql`):
 * `criarRodada` grava o snapshot AUTO-CONTIDO inicial (cada questão com seu
 * texto completo, não só um ID) e `carregarRodada`/`salvarRodada`
 * reconstroem e persistem o `RodadaEstado` de `src/domain/rodada.ts` entre
 * requisições HTTP.
 *
 * Toda operação recebe `userId` e filtra/checa posse por ele — é o único
 * ponto de isolamento entre usuários (`questoes_rodada` não tem `user_id`
 * próprio, herda o isolamento via `rodada_id`).
 *
 * Este módulo NÃO decide política de tempo (quando chamar `irPara`,
 * `responder`, etc.) — isso é das rotas de API, que ainda vão consumir este
 * repositório. Aqui só entra/sai estado.
 */
import type { Pool } from "pg";

import type { Letra, Questao } from "@/lib/parser/tipos";
import {
  encerrada,
  decorrido as decorridoDominio,
  restaurarFinalizada,
  type Modo,
  type Relogio,
  type RodadaEstado,
} from "@/domain/rodada";

/** O que o modo prova registrou ao sortear (cotas/disponível/déficit por
 * domínio). `null` no modo prática, que não sorteia nada. */
export interface ComposicaoPersistida {
  cotas: Record<number, number> | null;
  disponivel: Record<number, number> | null;
  deficit: Record<number, number> | null;
}

export interface RodadaPersistida {
  id: number;
  estado: RodadaEstado;
  composicao: ComposicaoPersistida;
  status: "em_andamento" | "finalizada";
  /** Quando a rodada foi criada (timestamp de parede — não confundir com
   * `estado.inicioEm`, que é o mesmo instante só que na escala do relógio
   * do domínio). Evita uma segunda consulta em quem só quer exibir "quando
   * isso aconteceu" (ex.: histórico). */
  iniciadaEm: Date;
}

export interface CriarRodadaParams {
  /** Dono da rodada — todo acesso subsequente (carregar/salvar/histórico)
   * é filtrado por este id. */
  userId: number;
  /** Questões já na ordem final da rodada (embaralhada se aplicável) —
   * decisão de ordem é de quem chama, não deste repositório. */
  questoes: Questao[];
  modo: Modo;
  limiteSegundos: number | null;
  /** Só para o modo prova. */
  composicao?: {
    cotas: Record<number, number>;
    disponivel: Record<number, number>;
    deficit: Record<number, number>;
  };
  /** Timestamp de parede gravado como `iniciada_em` — não é o mesmo relógio
   * usado por `decorrido()`/`esgotado()` do domínio, é só "quando isso
   * aconteceu" para exibição/ordenação no histórico. Default: agora. */
  iniciadaEm?: Date;
}

interface LinhaRodada {
  id: number;
  modo: string;
  iniciada_em: string;
  limite_segundos: number | null;
  decorrido_segundos: number | null;
  esgotou_tempo: boolean;
  status: "em_andamento" | "finalizada";
  indice_atual: number;
  cotas_json: string | null;
  disponivel_json: string | null;
  deficit_json: string | null;
}

interface LinhaQuestaoRodada {
  posicao: number;
  origem: string;
  dominio: number | null;
  numero: number;
  enunciado: string;
  alternativas_json: string;
  correta: string;
  resumo: string;
  explicacoes_json: string;
  bloom: string;
  dificuldade: string;
  rubrica: string;
  cenario: string;
  principio_testado: string;
  topicos_json: string;
  resposta: string | null;
  segundos: number;
}

function linhaParaQuestao(linha: LinhaQuestaoRodada): Questao {
  return {
    origem: linha.origem,
    dominio: linha.dominio,
    numero: linha.numero,
    enunciado: linha.enunciado,
    alternativas: JSON.parse(linha.alternativas_json),
    correta: linha.correta as Letra,
    resumo: linha.resumo,
    explicacoes: JSON.parse(linha.explicacoes_json),
    metadados: {
      bloom: linha.bloom,
      dificuldade: linha.dificuldade,
      rubrica: linha.rubrica,
      cenario: linha.cenario,
      principioTestado: linha.principio_testado,
    },
    topicos: JSON.parse(linha.topicos_json),
  };
}

/** Grava uma rodada nova: 1 linha em `rodadas` + 1 linha por questão em
 * `questoes_rodada`, numa única transação. */
export async function criarRodada(pool: Pool, params: CriarRodadaParams): Promise<number> {
  const iniciadaEm = params.iniciadaEm ?? new Date();

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const resultado = await client.query<{ id: number }>(
      `INSERT INTO rodadas
         (user_id, modo, iniciada_em, limite_segundos, decorrido_segundos, esgotou_tempo,
          status, indice_atual, cotas_json, disponivel_json, deficit_json)
       VALUES
         ($1, $2, $3, $4, NULL, FALSE,
          'em_andamento', 0, $5, $6, $7)
       RETURNING id`,
      [
        params.userId,
        params.modo,
        iniciadaEm.toISOString(),
        params.limiteSegundos,
        params.composicao ? JSON.stringify(params.composicao.cotas) : null,
        params.composicao ? JSON.stringify(params.composicao.disponivel) : null,
        params.composicao ? JSON.stringify(params.composicao.deficit) : null,
      ],
    );
    const rodadaId = resultado.rows[0].id;

    for (let posicao = 0; posicao < params.questoes.length; posicao++) {
      const q = params.questoes[posicao];
      await client.query(
        `INSERT INTO questoes_rodada
           (rodada_id, posicao, origem, dominio, numero, enunciado,
            alternativas_json, correta, resumo, explicacoes_json,
            bloom, dificuldade, rubrica, cenario, principio_testado, topicos_json)
         VALUES
           ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          rodadaId,
          posicao,
          q.origem,
          q.dominio,
          q.numero,
          q.enunciado,
          JSON.stringify(q.alternativas),
          q.correta,
          q.resumo,
          JSON.stringify(q.explicacoes),
          q.metadados.bloom,
          q.metadados.dificuldade,
          q.metadados.rubrica,
          q.metadados.cenario,
          q.metadados.principioTestado,
          JSON.stringify(q.topicos),
        ],
      );
    }

    await client.query("COMMIT");
    return rodadaId;
  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    client.release();
  }
}

/** Reconstrói uma rodada persistida a partir do id, ou `null` se não existe
 * OU não pertence a `userId` (mesmo tratamento — nunca revela a um usuário
 * que um id de outro dono existe).
 *
 * Rodada `finalizada`: usa `restaurarFinalizada` (o domínio nunca mais
 * consulta o relógio). Rodada `em_andamento`: reconstrói com `inicioEm` a
 * partir de `iniciada_em` (para que `decorrido()`/`esgotado()` continuem
 * sendo recomputados a partir de um timestamp do SERVIDOR, nunca do
 * relógio do cliente) e `marcaEm = null` (não há cronômetro rodando "ao
 * vivo" entre requisições HTTP — quem acumula `tempos[i]` entre uma
 * requisição e outra é a camada de API, não este repositório).
 */
export async function carregarRodada(
  pool: Pool,
  id: number,
  userId: number,
): Promise<RodadaPersistida | null> {
  const resultadoRodada = await pool.query<LinhaRodada>(
    "SELECT * FROM rodadas WHERE id = $1 AND user_id = $2",
    [id, userId],
  );
  const linhaRodada = resultadoRodada.rows[0];
  if (!linhaRodada) return null;

  const resultadoQuestoes = await pool.query<LinhaQuestaoRodada>(
    "SELECT * FROM questoes_rodada WHERE rodada_id = $1 ORDER BY posicao ASC",
    [id],
  );
  const linhasQuestoes = resultadoQuestoes.rows;

  const questoes = linhasQuestoes.map(linhaParaQuestao);
  const respostas = linhasQuestoes.map((l) => (l.resposta as Letra | null));
  const tempos = linhasQuestoes.map((l) => l.segundos);
  const modo = linhaRodada.modo as Modo;
  const esgotouTempo = linhaRodada.esgotou_tempo;

  const estado: RodadaEstado =
    linhaRodada.status === "finalizada"
      ? {
          ...restaurarFinalizada({
            questoes,
            respostas,
            tempos,
            decorrido: linhaRodada.decorrido_segundos ?? 0,
            modo,
            limiteSegundos: linhaRodada.limite_segundos,
            esgotouTempo,
          }),
          indice: linhaRodada.indice_atual,
        }
      : {
          questoes,
          respostas,
          tempos,
          indice: linhaRodada.indice_atual,
          modo,
          limiteSegundos: linhaRodada.limite_segundos,
          esgotouTempo,
          inicioEm: Date.parse(linhaRodada.iniciada_em) / 1000,
          marcaEm: null,
          fimEm: null,
        };

  return {
    id,
    estado,
    composicao: {
      cotas: linhaRodada.cotas_json ? JSON.parse(linhaRodada.cotas_json) : null,
      disponivel: linhaRodada.disponivel_json ? JSON.parse(linhaRodada.disponivel_json) : null,
      deficit: linhaRodada.deficit_json ? JSON.parse(linhaRodada.deficit_json) : null,
    },
    status: linhaRodada.status,
    iniciadaEm: new Date(linhaRodada.iniciada_em),
  };
}

/** Persiste as mutações de um `RodadaEstado` já carregado (respostas,
 * tempos, índice, e — se a rodada acabou de encerrar — status e
 * `decorrido_segundos`/`esgotou_tempo`).
 *
 * `relogio` decide se `estado` já está encerrada (`encerrada()` do
 * domínio) — chamado aqui, não antes, porque é o ÚNICO ponto que grava
 * `status='finalizada'` e congela `decorrido_segundos`.
 *
 * `userId` é checado na cláusula `WHERE` da própria atualização (defesa em
 * profundidade: mesmo que o chamador já tenha validado posse via
 * `carregarRodada`, esta função nunca escreve numa rodada de outro dono). Se
 * a atualização de `rodadas` não afetar nenhuma linha (id inexistente ou de
 * outro dono), a transação é revertida SEM tocar `questoes_rodada` — sem
 * essa checagem, as questões seriam atualizadas por `rodada_id` mesmo
 * quando a linha de `rodadas` não pertence a `userId`.
 */
export async function salvarRodada(
  pool: Pool,
  id: number,
  estado: RodadaEstado,
  relogio: Relogio,
  userId: number,
): Promise<void> {
  const finalizada = encerrada(estado, relogio);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const resultadoRodada = await client.query(
      `UPDATE rodadas
       SET indice_atual = $1,
           esgotou_tempo = $2,
           status = $3,
           decorrido_segundos = $4
       WHERE id = $5 AND user_id = $6`,
      [
        estado.indice,
        estado.esgotouTempo,
        finalizada ? "finalizada" : "em_andamento",
        finalizada ? decorridoDominio(estado, relogio) : null,
        id,
        userId,
      ],
    );

    if (resultadoRodada.rowCount === 0) {
      throw new Error(
        `salvarRodada: rodada ${id} não encontrada para o usuário ${userId} — nada foi salvo`,
      );
    }

    for (let posicao = 0; posicao < estado.questoes.length; posicao++) {
      await client.query(
        `UPDATE questoes_rodada
         SET resposta = $1, segundos = $2
         WHERE rodada_id = $3 AND posicao = $4`,
        [estado.respostas[posicao], estado.tempos[posicao], id, posicao],
      );
    }

    await client.query("COMMIT");
  } catch (erro) {
    await client.query("ROLLBACK");
    throw erro;
  } finally {
    client.release();
  }
}
