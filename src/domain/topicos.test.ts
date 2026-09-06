import { describe, expect, it } from "vitest";
import { readdirSync } from "node:fs";
import { join } from "node:path";

import { carregarPar } from "@/lib/parser/parser";
import { TOPICOS, topicoPorId, topicoPorNome } from "./topicos";

describe("catálogo de tópicos", () => {
  it("não tem id nem nome duplicado", () => {
    const ids = TOPICOS.map((t) => t.id);
    const nomes = TOPICOS.map((t) => t.nome);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(nomes).size).toBe(nomes.length);
  });

  it("todo tópico tem domínio entre 1 e 5", () => {
    for (const t of TOPICOS) {
      expect(t.dominio).toBeGreaterThanOrEqual(1);
      expect(t.dominio).toBeLessThanOrEqual(5);
    }
  });

  it("topicoPorNome/topicoPorId resolvem uma entrada real e null para desconhecido", () => {
    const primeiro = TOPICOS[0];
    expect(topicoPorNome(primeiro.nome)).toEqual(primeiro);
    expect(topicoPorId(primeiro.id)).toEqual(primeiro);
    expect(topicoPorNome("Tópico que não existe")).toBeUndefined();
    expect(topicoPorId("id-que-nao-existe")).toBeUndefined();
  });

  it("todo 'topicos' gravado no corpus real bate com um nome do catálogo", () => {
    const baseDir = join(process.cwd(), "content/simulados");
    const dominios = readdirSync(baseDir).filter((d) => d.startsWith("dominio-"));
    const naoEncontrados = new Set<string>();

    for (const dominio of dominios) {
      const dominioPath = join(baseDir, dominio);
      const simulados = readdirSync(dominioPath).filter((a) => a.endsWith("_simulado.md")).sort();
      for (const nomeSimulado of simulados) {
        const nomeGabarito = nomeSimulado.replace("_simulado.md", "_gabarito.md");
        const questoes = carregarPar(join(dominioPath, nomeSimulado), join(dominioPath, nomeGabarito));
        for (const q of questoes) {
          for (const topico of q.topicos) {
            if (!topicoPorNome(topico)) naoEncontrados.add(topico);
          }
        }
      }
    }

    expect([...naoEncontrados]).toEqual([]);
  });
});
