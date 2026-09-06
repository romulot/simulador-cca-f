import { describe, expect, it } from "vitest";

import { TOPICOS } from "@/domain/topicos";
import { RECURSOS, recursosPorTopico } from "./recursos";

describe("catálogo de materiais", () => {
  it("todo recurso aponta para um tópico existente no catálogo", () => {
    const idsValidos = new Set(TOPICOS.map((t) => t.id));
    for (const r of RECURSOS) {
      expect(idsValidos.has(r.topicoId), `topicoId desconhecido: ${r.topicoId}`).toBe(true);
    }
  });

  it("todo recurso tem id único e URL no formato esperado (https://)", () => {
    const ids = RECURSOS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of RECURSOS) {
      expect(r.url).toMatch(/^https:\/\//);
    }
  });

  it("tipo é sempre um valor válido", () => {
    const tiposValidos = new Set(["documentacao", "artigo", "video"]);
    for (const r of RECURSOS) {
      expect(tiposValidos.has(r.tipo)).toBe(true);
    }
  });

  it("recursosPorTopico devolve array vazio (não undefined) para tópico sem material", () => {
    expect(recursosPorTopico("id-sem-material-nenhum")).toEqual([]);
  });

  it("recursosPorTopico devolve os recursos certos para um tópico real", () => {
    const lista = recursosPorTopico("hooks");
    expect(lista.length).toBeGreaterThan(0);
    expect(lista.every((r) => r.topicoId === "hooks")).toBe(true);
  });
});
