import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Pool } from "pg";

import type { Questao } from "@/lib/parser/tipos";
import { criarRodada as criarEstado, encerrar, iniciar, responder, type Relogio } from "@/domain/rodada";
import { poolTeste, criarUsuarioTeste } from "./apoioTeste";
import { arquivarTodasRodadas, carregarEstadoRodadaLeve, carregarRodada, criarRodada, deletarTodasRodadas, salvarRodada } from "./repositorioRodadas";

function questaoFake(numero: number, correta: "A" | "B" | "C" | "D" = "A", dominio: number | null = 1): Questao {
  return {
    origem: "teste_origem",
    dominio,
    numero,
    enunciado: `Enunciado ${numero}`,
    alternativas: { A: "a", B: "b", C: "c", D: "d" },
    correta,
    resumo: "resumo",
    explicacoes: { A: "expl a", B: "expl b", C: "expl c", D: "expl d" },
    metadados: {
      bloom: "Aplicar",
      dificuldade: "Médio",
      rubrica: "rubrica",
      cenario: "cenário",
      principioTestado: "princípio",
    },
    topicos: ["Teste"],
  };
}

function relogioControlado() {
  let agora = 0;
  const relogio: Relogio = () => agora;
  return { relogio, avancarPara: (t: number) => (agora = t) };
}

describe("repositorioRodadas", () => {
  let pool: Pool;
  let userId: number;
  let outroUsuarioId: number;

  beforeEach(async () => {
    pool = await poolTeste();
    userId = await criarUsuarioTeste(pool);
    outroUsuarioId = await criarUsuarioTeste(pool);
  });

  it("grava e recarrega uma rodada em andamento (round-trip preserva questões e metadados)", async () => {
    const questoes = [questaoFake(1, "A"), questaoFake(2, "B", 2)];

    const id = await criarRodada(pool, {
      userId,
      questoes,
      modo: "pratica",
      limiteSegundos: null,
      iniciadaEm: new Date("2026-09-04T10:00:00Z"),
    });

    const persistida = await carregarRodada(pool, id, userId);
    expect(persistida).not.toBeNull();
    expect(persistida!.status).toBe("em_andamento");
    expect(persistida!.estado.questoes).toHaveLength(2);
    expect(persistida!.estado.questoes[0].enunciado).toBe("Enunciado 1");
    expect(persistida!.estado.questoes[1].dominio).toBe(2);
    expect(persistida!.estado.questoes[0].metadados.bloom).toBe("Aplicar");
    expect(persistida!.estado.respostas).toEqual([null, null]);
    expect(persistida!.estado.tempos).toEqual([0, 0]);
    expect(persistida!.composicao).toEqual({ cotas: null, disponivel: null, deficit: null });
  });

  it("grava a composição do modo prova (cotas/disponivel/deficit) e recarrega intacta", async () => {
    const questoes = [questaoFake(1)];

    const id = await criarRodada(pool, {
      userId,
      questoes,
      modo: "prova",
      limiteSegundos: 7200,
      composicao: {
        cotas: { 1: 16, 2: 11 },
        disponivel: { 1: 54, 2: 42 },
        deficit: { 2: 3 },
      },
    });

    const persistida = await carregarRodada(pool, id, userId);
    expect(persistida!.composicao).toEqual({
      cotas: { "1": 16, "2": 11 },
      disponivel: { "1": 54, "2": 42 },
      deficit: { "2": 3 },
    });
    expect(persistida!.estado.limiteSegundos).toBe(7200);
  });

  it("carregarRodada devolve null para id inexistente", async () => {
    expect(await carregarRodada(pool, 999999, userId)).toBeNull();
  });

  it("carregarRodada devolve null quando a rodada pertence a outro usuário", async () => {
    const id = await criarRodada(pool, { userId, questoes: [questaoFake(1)], modo: "pratica", limiteSegundos: null });
    expect(await carregarRodada(pool, id, outroUsuarioId)).toBeNull();
  });

  describe("carregarEstadoRodadaLeve", () => {
    it("carrega respostas e somente a questão da posição atual", async () => {
      const id = await criarRodada(pool, {
        userId,
        questoes: [questaoFake(1), questaoFake(2)],
        modo: "prova",
        limiteSegundos: 7200,
      });
      await pool.query(
        "UPDATE rodadas SET indice_atual = 1 WHERE id = $1 AND user_id = $2",
        [id, userId],
      );

      const estado = await carregarEstadoRodadaLeve(pool, id, userId);

      expect(estado).toMatchObject({
        id,
        modo: "prova",
        status: "em_andamento",
        indiceAtual: 1,
        totalQuestoes: 2,
        respostas: [null, null],
      });
      expect(estado?.questaoAtual).toMatchObject({ posicao: 1, numero: 2, enunciado: "Enunciado 2" });
      expect(estado?.questaoAtual).not.toHaveProperty("correta");
      expect(estado?.questaoAtual).not.toHaveProperty("explicacoes");
    });

    it("preserva isolamento por user_id", async () => {
      const id = await criarRodada(pool, {
        userId,
        questoes: [questaoFake(1)],
        modo: "prova",
        limiteSegundos: 7200,
      });

      expect(await carregarEstadoRodadaLeve(pool, id, outroUsuarioId)).toBeNull();
    });

    it("usa colunas explícitas e filtra a consulta pesada pela posição atual", async () => {
      const query = vi
        .fn()
        .mockResolvedValueOnce({
          rows: [
            {
              id: 7,
              modo: "prova",
              iniciada_em: "2026-09-04T10:00:00.000Z",
              limite_segundos: 7200,
              decorrido_segundos: null,
              esgotou_tempo: false,
              status: "em_andamento",
              indice_atual: 3,
              cotas_json: '{"1":16}',
              disponivel_json: '{"1":54}',
              deficit_json: null,
              total_questoes: 60,
              respostas: Array(60).fill(null),
            },
          ],
        })
        .mockResolvedValueOnce({
          rows: [
            {
              posicao: 3,
              origem: "teste_origem",
              dominio: 1,
              numero: 4,
              enunciado: "Enunciado 4",
              alternativas_json: '{"A":"a","B":"b","C":"c","D":"d"}',
            },
          ],
        });
      const poolSimulado = { query } as unknown as Pool;

      await carregarEstadoRodadaLeve(poolSimulado, 7, 11);

      expect(query).toHaveBeenCalledTimes(2);
      const sqlEstado = String(query.mock.calls[0][0]);
      const sqlQuestao = String(query.mock.calls[1][0]);
      expect(`${sqlEstado}\n${sqlQuestao}`).not.toMatch(/SELECT\s+\*/i);
      expect(sqlQuestao).toContain("qr.posicao = $2");
      expect(sqlQuestao).toContain("r.user_id = $3");
      expect(query.mock.calls[1][1]).toEqual([7, 3, 11]);
      expect(sqlQuestao).not.toContain("qr.correta");
      expect(sqlQuestao).not.toContain("qr.explicacoes_json");
    });
  });

  it("salvarRodada persiste respostas/tempos/indice de uma rodada ainda em andamento", async () => {
    const questoes = [questaoFake(1, "A"), questaoFake(2, "B")];
    const id = await criarRodada(pool, { userId, questoes, modo: "pratica", limiteSegundos: null });

    const { relogio, avancarPara } = relogioControlado();
    let estado = iniciar(criarEstado(questoes, { embaralhar: false }), relogio);
    avancarPara(12);
    estado = responder(estado, "A", relogio); // acerta a Q1, avança pra Q2

    await salvarRodada(pool, id, estado, relogio, userId);

    const recarregada = (await carregarRodada(pool, id, userId))!;
    expect(recarregada.status).toBe("em_andamento");
    expect(recarregada.estado.respostas).toEqual(["A", null]);
    expect(recarregada.estado.tempos[0]).toBeCloseTo(12);
    expect(recarregada.estado.indice).toBe(1);
  });

  it("salvarRodada rejeita e não afeta uma rodada de outro usuário", async () => {
    const questoes = [questaoFake(1, "A")];
    const id = await criarRodada(pool, { userId, questoes, modo: "pratica", limiteSegundos: null });

    const { relogio } = relogioControlado();
    const estado = responder(iniciar(criarEstado(questoes, { embaralhar: false }), relogio), "A", relogio);

    await expect(salvarRodada(pool, id, estado, relogio, outroUsuarioId)).rejects.toThrow();

    const aindaDoDono = (await carregarRodada(pool, id, userId))!;
    expect(aindaDoDono.estado.respostas).toEqual([null]);
  });

  it("salvarRodada marca status='finalizada' e congela decorrido_segundos quando a rodada encerra", async () => {
    const questoes = [questaoFake(1, "A")];
    const id = await criarRodada(pool, { userId, questoes, modo: "pratica", limiteSegundos: null });

    const { relogio, avancarPara } = relogioControlado();
    let estado = iniciar(criarEstado(questoes, { embaralhar: false }), relogio);
    avancarPara(30);
    estado = encerrar(estado, relogio);

    await salvarRodada(pool, id, estado, relogio, userId);

    const recarregada = (await carregarRodada(pool, id, userId))!;
    expect(recarregada.status).toBe("finalizada");
    expect(recarregada.estado.fimEm).toBeCloseTo(30);
    expect(recarregada.estado.esgotouTempo).toBe(false);
  });

  describe("arquivarTodasRodadas", () => {
    it("marca todas as rodadas do usuário como arquivada = TRUE, incluindo em_andamento", async () => {
      const idFinalizada = await criarRodada(pool, { userId, questoes: [questaoFake(1)], modo: "pratica", limiteSegundos: null });
      const { relogio } = relogioControlado();
      const estadoEncerrado = encerrar(iniciar(criarEstado([questaoFake(1)], { embaralhar: false }), relogio), relogio);
      await salvarRodada(pool, idFinalizada, estadoEncerrado, relogio, userId);

      const idEmAndamento = await criarRodada(pool, { userId, questoes: [questaoFake(2)], modo: "pratica", limiteSegundos: null });

      await arquivarTodasRodadas(pool, userId);

      const resultado = await pool.query<{ id: number; arquivada: boolean }>(
        "SELECT id, arquivada FROM rodadas WHERE user_id = $1 ORDER BY id",
        [userId],
      );
      expect(resultado.rows).toHaveLength(2);
      expect(resultado.rows.every((r) => r.arquivada)).toBe(true);
      expect(resultado.rows.map((r) => r.id)).toContain(idFinalizada);
      expect(resultado.rows.map((r) => r.id)).toContain(idEmAndamento);
    });

    it("não afeta rodadas de outro usuário", async () => {
      await criarRodada(pool, { userId, questoes: [questaoFake(1)], modo: "pratica", limiteSegundos: null });
      const idOutro = await criarRodada(pool, { userId: outroUsuarioId, questoes: [questaoFake(1)], modo: "pratica", limiteSegundos: null });

      await arquivarTodasRodadas(pool, userId);

      const resultado = await pool.query<{ arquivada: boolean }>(
        "SELECT arquivada FROM rodadas WHERE id = $1",
        [idOutro],
      );
      expect(resultado.rows[0].arquivada).toBe(false);
    });
  });

  describe("deletarTodasRodadas", () => {
    it("remove todas as rodadas e questoes_rodada do usuário (CASCADE)", async () => {
      const id = await criarRodada(pool, { userId, questoes: [questaoFake(1)], modo: "pratica", limiteSegundos: null });

      await deletarTodasRodadas(pool, userId);

      const rodadas = await pool.query("SELECT id FROM rodadas WHERE user_id = $1", [userId]);
      expect(rodadas.rows).toHaveLength(0);

      const questoes = await pool.query("SELECT rodada_id FROM questoes_rodada WHERE rodada_id = $1", [id]);
      expect(questoes.rows).toHaveLength(0);
    });

    it("inclui rodadas em andamento na exclusão", async () => {
      await criarRodada(pool, { userId, questoes: [questaoFake(1)], modo: "pratica", limiteSegundos: null });
      const { relogio } = relogioControlado();
      const idFinalizada = await criarRodada(pool, { userId, questoes: [questaoFake(2)], modo: "pratica", limiteSegundos: null });
      await salvarRodada(pool, idFinalizada, encerrar(iniciar(criarEstado([questaoFake(2)], { embaralhar: false }), relogio), relogio), relogio, userId);

      await deletarTodasRodadas(pool, userId);

      const resultado = await pool.query("SELECT id FROM rodadas WHERE user_id = $1", [userId]);
      expect(resultado.rows).toHaveLength(0);
    });

    it("não afeta rodadas de outro usuário", async () => {
      await criarRodada(pool, { userId, questoes: [questaoFake(1)], modo: "pratica", limiteSegundos: null });
      const idOutro = await criarRodada(pool, { userId: outroUsuarioId, questoes: [questaoFake(1)], modo: "pratica", limiteSegundos: null });

      await deletarTodasRodadas(pool, userId);

      const resultado = await pool.query<{ id: number }>("SELECT id FROM rodadas WHERE id = $1", [idOutro]);
      expect(resultado.rows).toHaveLength(1);
    });
  });

  it("uma rodada em andamento recarregada tem inicioEm derivado de iniciada_em, não de agora", async () => {
    const questoes = [questaoFake(1)];
    const iniciadaEm = new Date("2026-09-04T10:00:00.000Z");
    const id = await criarRodada(pool, { userId, questoes, modo: "pratica", limiteSegundos: null, iniciadaEm });

    const recarregada = (await carregarRodada(pool, id, userId))!;
    expect(recarregada.estado.inicioEm).toBeCloseTo(iniciadaEm.getTime() / 1000);
    expect(recarregada.estado.marcaEm).toBeNull();
    expect(recarregada.estado.fimEm).toBeNull();
  });
});
