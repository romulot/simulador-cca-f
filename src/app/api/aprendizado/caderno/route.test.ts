import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { Pool } from "pg";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { poolTeste, criarUsuarioTeste } from "@/db/apoioTeste";
import { cookieSessaoTeste } from "@/lib/auth/apoioTeste";
import { criarRodada as criarEstado, encerrar, iniciar, responder, type Relogio } from "@/domain/rodada";
import { criarRodada, salvarRodada } from "@/db/repositorioRodadas";
import { descobrir, raizDoCurso } from "@/lib/catalogo";
import type { Letra } from "@/lib/parser/tipos";

let pool: Pool;
let userId: number;

beforeEach(async () => {
  pool = await poolTeste();
  userId = await criarUsuarioTeste(pool);
});

function relogioControlado() {
  let agora = 0;
  const relogio: Relogio = () => agora;
  return { relogio, avancarPara: (t: number) => (agora = t) };
}

/** Cria e finaliza uma rodada com UMA questão real do corpus (a primeira
 * de "1.1_loop_agentico"), respondida com a primeira letra ERRADA — para
 * exercitar o cruzamento de `questoesEmRevisao` com o texto real do corpus. */
async function criarRodadaErrada(dono: number) {
  const par = descobrir().find((p) => p.nome === "1.1_loop_agentico");
  if (!par || par.erro) throw new Error("fixture de conteúdo ausente: 1.1_loop_agentico");
  const questao = par.questoes[0];
  const errada = (["A", "B", "C", "D"] as Letra[]).find((l) => l !== questao.correta)!;

  const id = await criarRodada(pool, { userId: dono, questoes: [questao], modo: "pratica", limiteSegundos: null });
  const { relogio, avancarPara } = relogioControlado();
  let estado = iniciar(criarEstado([questao], { embaralhar: false }), relogio);
  avancarPara(10);
  estado = responder(estado, errada, relogio);
  estado = encerrar(estado, relogio);
  await salvarRodada(pool, id, estado, relogio, dono);
  return { questao, errada };
}

describe("GET /api/aprendizado/caderno", () => {
  it("sem sessão devolve 401", async () => {
    const { GET } = await import("./route");
    const resposta = await GET(new Request("http://localhost/api/aprendizado/caderno"));
    expect(resposta.status).toBe(401);
  });

  it("sem histórico devolve listas vazias", async () => {
    const { GET } = await import("./route");
    const resposta = await GET(
      new Request("http://localhost/api/aprendizado/caderno", { headers: { cookie: cookieSessaoTeste(userId) } }),
    );
    expect(resposta.status).toBe(200);
    const corpo = await resposta.json();
    expect(corpo).toEqual({ recorrentes: [], arquetiposFrequentes: [], emRevisao: [] });
  });

  it("cruza questão em revisão com o texto real do corpus", async () => {
    const { questao, errada } = await criarRodadaErrada(userId);

    const { GET } = await import("./route");
    const resposta = await GET(
      new Request("http://localhost/api/aprendizado/caderno", { headers: { cookie: cookieSessaoTeste(userId) } }),
    );
    const corpo = await resposta.json();

    expect(corpo.emRevisao).toHaveLength(1);
    const item = corpo.emRevisao[0];
    expect(item.origem).toBe(questao.origem);
    expect(item.numero).toBe(questao.numero);
    expect(item.enunciado).toBe(questao.enunciado);
    expect(item.ultimaResposta).toBe(errada);
    expect(item.correta).toBe(questao.correta);
    expect(item.explicacaoErrada).toBe(questao.explicacoes[errada]);
  });

  it("questão que sai da revisão (última tentativa certa) não aparece mais", async () => {
    const par = descobrir().find((p) => p.nome === "1.1_loop_agentico")!;
    const questao = par.questoes[0];

    const id = await criarRodada(pool, { userId, questoes: [questao], modo: "pratica", limiteSegundos: null });
    const { relogio, avancarPara } = relogioControlado();
    let estado = iniciar(criarEstado([questao], { embaralhar: false }), relogio);
    avancarPara(10);
    estado = responder(estado, questao.correta, relogio);
    estado = encerrar(estado, relogio);
    await salvarRodada(pool, id, estado, relogio, userId);

    const { GET } = await import("./route");
    const resposta = await GET(
      new Request("http://localhost/api/aprendizado/caderno", { headers: { cookie: cookieSessaoTeste(userId) } }),
    );
    const corpo = await resposta.json();
    expect(corpo.emRevisao).toHaveLength(0);
  });

  describe("rodada de curso 'exame-avancado' (Tarefa 4 do plano Exame Avançado)", () => {
    const dirFixture = join(raizDoCurso("exame-avancado"), "_fixture-tarefa4");

    afterEach(() => {
      rmSync(dirFixture, { recursive: true, force: true });
    });

    it("resolve o texto da questão pela raiz de exame-avancado, não pela de curso-antigo", async () => {
      mkdirSync(dirFixture, { recursive: true });
      writeFileSync(
        join(dirFixture, "fx_simulado.md"),
        [
          "# Simulado — Fixture",
          "",
          "## Q1",
          "",
          "Enunciado exclusivo do exame avançado.",
          "",
          "- **A)** Alternativa A",
          "- **B)** Alternativa B",
          "- **C)** Alternativa C",
          "- **D)** Alternativa D",
          "",
        ].join("\n"),
      );
      writeFileSync(
        join(dirFixture, "fx_gabarito.md"),
        [
          "# Gabarito — Fixture",
          "",
          "## Q1 — Resposta correta: **A**",
          "",
          "Resumo da fixture.",
          "",
          "- **A — correta.**",
          "- **B — errada:** não é B",
          "- **C — errada:** não é C",
          "- **D — errada:** não é D",
          "",
          "**Tópicos:** Teste",
          "",
          "**Metadados (revisão; não exibir ao candidato):**",
          "- Bloom: Lembrar",
          "- Dificuldade: Fácil",
          "- Rubrica: 2",
          "- Cenário: S1",
          "- Princípio testado: teste",
          "",
        ].join("\n"),
      );

      const par = descobrir(raizDoCurso("exame-avancado")).find((p) => p.nome === "fx");
      if (!par || par.erro) throw new Error(`fixture inválida: ${par?.erro}`);
      const questao = par.questoes[0];

      const id = await criarRodada(pool, {
        userId,
        questoes: [questao],
        modo: "pratica",
        curso: "exame-avancado",
        limiteSegundos: null,
      });
      const { relogio, avancarPara } = relogioControlado();
      let estado = iniciar(criarEstado([questao], { embaralhar: false }), relogio);
      avancarPara(10);
      estado = responder(estado, "B", relogio);
      estado = encerrar(estado, relogio);
      await salvarRodada(pool, id, estado, relogio, userId);

      const { GET } = await import("./route");
      const resposta = await GET(
        new Request("http://localhost/api/aprendizado/caderno", { headers: { cookie: cookieSessaoTeste(userId) } }),
      );
      const corpo = await resposta.json();

      expect(corpo.emRevisao).toHaveLength(1);
      expect(corpo.emRevisao[0].enunciado).toBe("Enunciado exclusivo do exame avançado.");
    });
  });
});
