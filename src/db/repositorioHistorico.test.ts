import { beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";

import type { Questao } from "@/lib/parser/tipos";
import { criarRodada as criarEstado, encerrar, iniciar, responder, type Relogio } from "@/domain/rodada";
import { poolTeste, criarUsuarioTeste } from "./apoioTeste";
import { criarRodada, salvarRodada } from "./repositorioRodadas";
import {
  carregarEntradaHistorico,
  contarHistorico,
  listarHistorico,
  ultimaEntradaHistorico,
} from "./repositorioHistorico";

function questaoFake(numero: number, correta: "A" | "B" | "C" | "D" = "A"): Questao {
  return {
    origem: `simulado_${numero}`,
    dominio: 1,
    numero,
    enunciado: `Enunciado ${numero}`,
    alternativas: { A: "a", B: "b", C: "c", D: "d" },
    correta,
    resumo: "resumo",
    explicacoes: { A: "a", B: "b", C: "c", D: "d" },
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

describe("repositorioHistorico", () => {
  let pool: Pool;
  let userId: number;
  let outroUsuarioId: number;

  beforeEach(async () => {
    pool = await poolTeste();
    userId = await criarUsuarioTeste(pool);
    outroUsuarioId = await criarUsuarioTeste(pool);
  });

  /** Cria e encerra uma rodada completa, persistindo o resultado. */
  async function criarRodadaFinalizada(
    dono: number,
    opts: { questoes: Questao[]; respostas: Array<"A" | "B" | "C" | "D">; modo?: "pratica" | "prova" },
  ): Promise<number> {
    const id = await criarRodada(pool, {
      userId: dono,
      questoes: opts.questoes,
      modo: opts.modo ?? "pratica",
      limiteSegundos: null,
    });
    const { relogio, avancarPara } = relogioControlado();
    let estado = iniciar(criarEstado(opts.questoes, { embaralhar: false }), relogio);
    opts.respostas.forEach((letra, i) => {
      avancarPara((i + 1) * 10);
      estado = responder(estado, letra, relogio);
    });
    estado = encerrar(estado, relogio);
    await salvarRodada(pool, id, estado, relogio, dono);
    return id;
  }

  it("uma rodada em andamento não aparece na listagem nem é 'a última'", async () => {
    await criarRodada(pool, { userId, questoes: [questaoFake(1)], modo: "pratica", limiteSegundos: null });

    expect(await listarHistorico(pool, userId)).toEqual([]);
    expect(await ultimaEntradaHistorico(pool, userId)).toBeNull();
    expect(await contarHistorico(pool, userId)).toBe(0);
  });

  it("uma rodada finalizada aparece no histórico com placar recalculado (não persistido)", async () => {
    const questoes = [questaoFake(1, "A"), questaoFake(2, "B"), questaoFake(3, "C")];
    // Responde 2 certas e 1 errada.
    await criarRodadaFinalizada(userId, { questoes, respostas: ["A", "B", "D"] });

    const entradas = await listarHistorico(pool, userId);
    expect(entradas).toHaveLength(1);
    expect(entradas[0].erro).toBeNull();
    expect(entradas[0].placar!.total).toBe(3);
    expect(entradas[0].placar!.acertos).toBe(2);
    expect(entradas[0].placar!.erros).toBe(1);
    expect(entradas[0].origens).toEqual(["simulado_1", "simulado_2", "simulado_3"]);

    expect(await contarHistorico(pool, userId)).toBe(1);
    expect((await ultimaEntradaHistorico(pool, userId))!.placar!.acertos).toBe(2);
  });

  it("listarHistorico ordena da mais recente para a mais antiga", async () => {
    const id1 = await criarRodadaFinalizada(userId, { questoes: [questaoFake(1, "A")], respostas: ["A"] });
    const id2 = await criarRodadaFinalizada(userId, { questoes: [questaoFake(2, "B")], respostas: ["B"] });

    const entradas = await listarHistorico(pool, userId);
    expect(entradas.map((e) => e.id)).toEqual([id2, id1]);
  });

  it("histórico é isolado por usuário: a rodada de outro usuário não aparece", async () => {
    await criarRodadaFinalizada(userId, { questoes: [questaoFake(1, "A")], respostas: ["A"] });
    await criarRodadaFinalizada(outroUsuarioId, { questoes: [questaoFake(2, "B")], respostas: ["B"] });

    expect(await contarHistorico(pool, userId)).toBe(1);
    expect(await contarHistorico(pool, outroUsuarioId)).toBe(1);
  });

  it("uma rodada com JSON corrompido em alternativas_json aparece com 'erro', sem derrubar a listagem", async () => {
    const idBoa = await criarRodadaFinalizada(userId, { questoes: [questaoFake(1, "A")], respostas: ["A"] });
    const idRuim = await criarRodadaFinalizada(userId, { questoes: [questaoFake(2, "B")], respostas: ["B"] });

    // Corrompe deliberadamente o JSON de uma questão da segunda rodada.
    await pool.query("UPDATE questoes_rodada SET alternativas_json = $1 WHERE rodada_id = $2", [
      "{ isso não é json válido",
      idRuim,
    ]);

    const entradas = await listarHistorico(pool, userId);
    expect(entradas).toHaveLength(2); // as duas continuam listadas

    const entradaRuim = entradas.find((e) => e.id === idRuim)!;
    expect(entradaRuim.erro).toMatch(/formato inesperado|ilegível/);
    expect(entradaRuim.placar).toBeNull();

    const entradaBoa = entradas.find((e) => e.id === idBoa)!;
    expect(entradaBoa.erro).toBeNull();
    expect(entradaBoa.placar!.acertos).toBe(1);
  });

  it("carregarEntradaHistorico devolve null para id inexistente (não é erro de dado, é ausência)", async () => {
    expect(await carregarEntradaHistorico(pool, 999999, userId)).toBeNull();
  });
});
