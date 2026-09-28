/** Tarefa 10 do plano Exame Avançado: cobertura de integração do corpus
 * `content/exame-avancado/` (Tarefas 5 e 6 do mesmo plano) — separado do
 * describe "descobrir — corpus real" de `index.test.ts` (que trava o corpus
 * de `content/simulados/`) para não precisar tocá-lo.
 */
import { describe, expect, it } from "vitest";

import { agrupar, descobrir, raizDoCurso } from "./index";
import { idArquetipoValido } from "@/domain/arquetipos";
import { topicoPorNome } from "@/domain/topicos";
import { LETRAS } from "@/lib/parser/tipos";

const RAIZ = raizDoCurso("exame-avancado");
const BLOOM_VALIDOS = new Set(["Lembrar", "Aplicar", "Analisar", "Avaliar"]);
const DIFICULDADE_VALIDAS = new Set(["Fácil", "Médio", "Difícil"]);

describe("descobrir — corpus content/exame-avancado (Tarefas 5 e 6)", () => {
  it("encontra 5 blocos avulsos e 4 casos completos, todos válidos", () => {
    const pares = descobrir(RAIZ);
    expect(pares).toHaveLength(9);
    expect(pares.every((p) => p.erro === null)).toBe(true);

    const totalQuestoes = pares.reduce((acc, p) => acc + p.questoes.length, 0);
    expect(totalQuestoes).toBe(360);
    const caso = pares.find((p) => p.nome === "caso-atendimento");
    expect(caso?.questoes).toHaveLength(10);
    expect(caso?.questoes.every((q) => q.casoBase?.includes("stateless workers"))).toBe(true);
  });

  it("os quatro casos totalizam 60 questões nas cotas do exame", () => {
    const casos = descobrir(RAIZ).filter((p) => p.nome.startsWith("caso-"));
    expect(casos.map((p) => p.questoes.length).sort((a, b) => a - b)).toEqual([10, 15, 15, 20]);
    const contagem = Object.fromEntries([1, 2, 3, 4, 5].map((d) => [d, 0]));
    for (const caso of casos) {
      expect(caso.questoes.every((q) => q.casoBase === caso.questoes[0].casoBase)).toBe(true);
      for (const q of caso.questoes) contagem[q.dominio!]++;
    }
    expect(contagem).toEqual({ 1: 16, 2: 11, 3: 12, 4: 12, 5: 9 });
  });

  it("agrupa em 5 domínios internamente (dado de cálculo — nunca exibido nesta trilha, ver Tarefa 8)", () => {
    const pares = descobrir(RAIZ);
    const grupos = agrupar(pares);
    expect(grupos.map(([nome]) => nome)).toEqual([
      "Domínio 1",
      "Domínio 2",
      "Domínio 3",
      "Domínio 4",
      "Domínio 5",
    ]);
  });

  it("todo Bloom/Dificuldade usa só o vocabulário fechado do corpus atual", () => {
    const pares = descobrir(RAIZ);
    for (const par of pares) {
      for (const q of par.questoes) {
        expect(BLOOM_VALIDOS.has(q.metadados.bloom)).toBe(true);
        expect(DIFICULDADE_VALIDAS.has(q.metadados.dificuldade)).toBe(true);
        expect(q.topicos.length).toBeGreaterThan(0);
        for (const nome of q.topicos) {
          expect(topicoPorNome(nome)).toBeDefined();
        }
      }
    }
  });

  it("arquétipos: id sempre canônico, nunca na alternativa correta, cobertura alta", () => {
    const pares = descobrir(RAIZ);
    let totalErradas = 0;
    let totalTageadas = 0;

    for (const par of pares) {
      for (const q of par.questoes) {
        const tags = q.arquetiposErrados ?? {};
        for (const letra of LETRAS.filter((l) => l !== q.correta)) {
          totalErradas++;
          if (letra in tags) totalTageadas++;
        }
        for (const [letra, id] of Object.entries(tags)) {
          expect(letra).not.toBe(q.correta);
          expect(idArquetipoValido(id as string)).toBe(true);
        }
      }
    }

    expect(totalErradas).toBe(1080); // 360 questões × 3 alternativas erradas
    expect(totalTageadas).toBeGreaterThanOrEqual(850); // banco anterior continua curado; casos novos têm explicações individuais
  });
});
