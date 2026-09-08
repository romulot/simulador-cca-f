import { beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";

import type { Questao } from "@/lib/parser/tipos";
import { criarRodada as criarEstado, encerrar, iniciar, responder, type Relogio } from "@/domain/rodada";
import { poolTeste, criarUsuarioTeste } from "./apoioTeste";
import { criarRodada, salvarRodada } from "./repositorioRodadas";
import { respostasBrutas } from "./repositorioAprendizado";

function questaoFake(
  origem: string,
  numero: number,
  correta: "A" | "B" | "C" | "D" = "A",
  topicos: string[] = ["Teste"],
): Questao {
  return {
    origem,
    dominio: 1,
    numero,
    enunciado: `Enunciado ${origem}#${numero}`,
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
    topicos,
  };
}

function relogioControlado() {
  let agora = 0;
  const relogio: Relogio = () => agora;
  return { relogio, avancarPara: (t: number) => (agora = t) };
}

describe("repositorioAprendizado", () => {
  let pool: Pool;
  let userId: number;
  let outroUsuarioId: number;

  beforeEach(async () => {
    pool = await poolTeste();
    userId = await criarUsuarioTeste(pool);
    outroUsuarioId = await criarUsuarioTeste(pool);
  });

  async function criarRodadaFinalizada(
    dono: number,
    questoes: Questao[],
    respostas: Array<"A" | "B" | "C" | "D">,
  ): Promise<number> {
    const id = await criarRodada(pool, { userId: dono, questoes, modo: "pratica", limiteSegundos: null });
    const { relogio, avancarPara } = relogioControlado();
    let estado = iniciar(criarEstado(questoes, { embaralhar: false }), relogio);
    respostas.forEach((letra, i) => {
      avancarPara((i + 1) * 10);
      estado = responder(estado, letra, relogio);
    });
    estado = encerrar(estado, relogio);
    await salvarRodada(pool, id, estado, relogio, dono);
    return id;
  }

  it("devolve os fatos de resposta de rodadas finalizadas, com tópicos parseados", async () => {
    await criarRodadaFinalizada(
      userId,
      [questaoFake("a", 1, "A", ["Hooks"]), questaoFake("a", 2, "B", ["Loop Agêntico"])],
      ["A", "C"],
    );

    const fatos = await respostasBrutas(pool, userId);
    expect(fatos).toHaveLength(2);
    expect(fatos[0]).toMatchObject({ origem: "a", numero: 1, resposta: "A", correta: "A", topicos: ["Hooks"] });
    expect(fatos[1]).toMatchObject({ origem: "a", numero: 2, resposta: "C", correta: "B", topicos: ["Loop Agêntico"] });
  });

  it("ignora rodada em andamento", async () => {
    await criarRodada(pool, {
      userId,
      questoes: [questaoFake("a", 1)],
      modo: "pratica",
      limiteSegundos: null,
    });
    expect(await respostasBrutas(pool, userId)).toEqual([]);
  });

  it("ignora questão em branco (resposta null)", async () => {
    await criarRodadaFinalizada(userId, [questaoFake("a", 1), questaoFake("a", 2)], ["A"]);
    const fatos = await respostasBrutas(pool, userId);
    expect(fatos).toHaveLength(1);
    expect(fatos[0].numero).toBe(1);
  });

  it("nunca mistura respostas de outro usuário", async () => {
    await criarRodadaFinalizada(userId, [questaoFake("a", 1)], ["A"]);
    await criarRodadaFinalizada(outroUsuarioId, [questaoFake("a", 1)], ["A"]);
    expect(await respostasBrutas(pool, userId)).toHaveLength(1);
  });

  it("ignora rodada finalizada com arquivada = TRUE", async () => {
    const id = await criarRodadaFinalizada(userId, [questaoFake("a", 1)], ["A"]);
    await pool.query("UPDATE rodadas SET arquivada = TRUE WHERE id = $1", [id]);
    expect(await respostasBrutas(pool, userId)).toEqual([]);
  });

  it("vem ordenado por rodada (mais antiga primeiro)", async () => {
    await criarRodadaFinalizada(userId, [questaoFake("a", 1)], ["A"]);
    await criarRodadaFinalizada(userId, [questaoFake("a", 1)], ["B"]);
    const fatos = await respostasBrutas(pool, userId);
    expect(fatos.map((f) => f.resposta)).toEqual(["A", "B"]);
    expect(fatos[0].rodadaId).toBeLessThan(fatos[1].rodadaId);
  });
});
