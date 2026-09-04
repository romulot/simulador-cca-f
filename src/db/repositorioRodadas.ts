/** Persistência de uma rodada (prática ou prova) em SQLite.
 *
 * Duas responsabilidades, refletindo o schema (`schema.sql`):
 * `criarRodada` grava o snapshot AUTO-CONTIDO inicial (cada questão com seu
 * texto completo, não só um ID) e `carregarRodada`/`salvarRodada`
 * reconstroem e persistem o `RodadaEstado` de `src/domain/rodada.ts` entre
 * requisições HTTP.
 *
 * Este módulo NÃO decide política de tempo (quando chamar `irPara`,
 * `responder`, etc.) — isso é das rotas de API, que ainda vão consumir este
 * repositório. Aqui só entra/sai estado.
 */
import type Database from "better-sqlite3";

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
  esgotou_tempo: number;
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
  };
}

/** Grava uma rodada nova: 1 linha em `rodadas` + 1 linha por questão em
 * `questoes_rodada`, numa única transação. */
export function criarRodada(db: Database.Database, params: CriarRodadaParams): number {
  const iniciadaEm = params.iniciadaEm ?? new Date();

  const inserirRodada = db.prepare<{
    modo: string;
    iniciada_em: string;
    limite_segundos: number | null;
    cotas_json: string | null;
    disponivel_json: string | null;
    deficit_json: string | null;
  }>(`
    INSERT INTO rodadas
      (modo, iniciada_em, limite_segundos, decorrido_segundos, esgotou_tempo,
       status, indice_atual, cotas_json, disponivel_json, deficit_json)
    VALUES
      (@modo, @iniciada_em, @limite_segundos, NULL, 0,
       'em_andamento', 0, @cotas_json, @disponivel_json, @deficit_json)
  `);

  const inserirQuestao = db.prepare<{
    rodada_id: number;
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
  }>(`
    INSERT INTO questoes_rodada
      (rodada_id, posicao, origem, dominio, numero, enunciado,
       alternativas_json, correta, resumo, explicacoes_json,
       bloom, dificuldade, rubrica, cenario, principio_testado)
    VALUES
      (@rodada_id, @posicao, @origem, @dominio, @numero, @enunciado,
       @alternativas_json, @correta, @resumo, @explicacoes_json,
       @bloom, @dificuldade, @rubrica, @cenario, @principio_testado)
  `);

  const gravarTudo = db.transaction((questoes: Questao[]) => {
    const info = inserirRodada.run({
      modo: params.modo,
      iniciada_em: iniciadaEm.toISOString(),
      limite_segundos: params.limiteSegundos,
      cotas_json: params.composicao ? JSON.stringify(params.composicao.cotas) : null,
      disponivel_json: params.composicao ? JSON.stringify(params.composicao.disponivel) : null,
      deficit_json: params.composicao ? JSON.stringify(params.composicao.deficit) : null,
    });
    const rodadaId = Number(info.lastInsertRowid);

    questoes.forEach((q, posicao) => {
      inserirQuestao.run({
        rodada_id: rodadaId,
        posicao,
        origem: q.origem,
        dominio: q.dominio,
        numero: q.numero,
        enunciado: q.enunciado,
        alternativas_json: JSON.stringify(q.alternativas),
        correta: q.correta,
        resumo: q.resumo,
        explicacoes_json: JSON.stringify(q.explicacoes),
        bloom: q.metadados.bloom,
        dificuldade: q.metadados.dificuldade,
        rubrica: q.metadados.rubrica,
        cenario: q.metadados.cenario,
        principio_testado: q.metadados.principioTestado,
      });
    });

    return rodadaId;
  });

  return gravarTudo(params.questoes);
}

/** Reconstrói uma rodada persistida a partir do id, ou `null` se não existe.
 *
 * Rodada `finalizada`: usa `restaurarFinalizada` (o domínio nunca mais
 * consulta o relógio). Rodada `em_andamento`: reconstrói com `inicioEm` a
 * partir de `iniciada_em` (para que `decorrido()`/`esgotado()` continuem
 * sendo recomputados a partir de um timestamp do SERVIDOR, nunca do
 * relógio do cliente) e `marcaEm = null` (não há cronômetro rodando "ao
 * vivo" entre requisições HTTP — quem acumula `tempos[i]` entre uma
 * requisição e outra é a camada de API, não este repositório).
 */
export function carregarRodada(db: Database.Database, id: number): RodadaPersistida | null {
  const linhaRodada = db.prepare("SELECT * FROM rodadas WHERE id = ?").get(id) as
    | LinhaRodada
    | undefined;
  if (!linhaRodada) return null;

  const linhasQuestoes = db
    .prepare("SELECT * FROM questoes_rodada WHERE rodada_id = ? ORDER BY posicao ASC")
    .all(id) as LinhaQuestaoRodada[];

  const questoes = linhasQuestoes.map(linhaParaQuestao);
  const respostas = linhasQuestoes.map((l) => (l.resposta as Letra | null));
  const tempos = linhasQuestoes.map((l) => l.segundos);
  const modo = linhaRodada.modo as Modo;
  const esgotouTempo = linhaRodada.esgotou_tempo === 1;

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
 */
export function salvarRodada(
  db: Database.Database,
  id: number,
  estado: RodadaEstado,
  relogio: Relogio,
): void {
  const finalizada = encerrada(estado, relogio);

  const atualizarRodada = db.prepare<{
    id: number;
    indice_atual: number;
    esgotou_tempo: number;
    status: string;
    decorrido_segundos: number | null;
  }>(`
    UPDATE rodadas
    SET indice_atual = @indice_atual,
        esgotou_tempo = @esgotou_tempo,
        status = @status,
        decorrido_segundos = @decorrido_segundos
    WHERE id = @id
  `);

  const atualizarQuestao = db.prepare<{
    rodada_id: number;
    posicao: number;
    resposta: string | null;
    segundos: number;
  }>(`
    UPDATE questoes_rodada
    SET resposta = @resposta, segundos = @segundos
    WHERE rodada_id = @rodada_id AND posicao = @posicao
  `);

  const salvarTudo = db.transaction(() => {
    atualizarRodada.run({
      id,
      indice_atual: estado.indice,
      esgotou_tempo: estado.esgotouTempo ? 1 : 0,
      status: finalizada ? "finalizada" : "em_andamento",
      decorrido_segundos: finalizada ? decorridoDominio(estado, relogio) : null,
    });

    estado.questoes.forEach((_q, posicao) => {
      atualizarQuestao.run({
        rodada_id: id,
        posicao,
        resposta: estado.respostas[posicao],
        segundos: estado.tempos[posicao],
      });
    });
  });

  salvarTudo();
}
