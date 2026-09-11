import { afterEach, describe, expect, it, vi } from "vitest";

const estadoPool = vi.hoisted(() => ({
  instancias: [] as Array<{ query: ReturnType<typeof vi.fn> }>,
}));

vi.mock("pg", () => ({
  Pool: class {
    query = vi.fn();

    constructor() {
      estadoPool.instancias.push(this);
    }
  },
}));

describe("obterConexao", () => {
  afterEach(() => {
    delete globalThis.__simuladorPool;
    estadoPool.instancias.length = 0;
    vi.resetModules();
  });

  it("cria e reutiliza o mesmo pool sem executar queries ou migrations", async () => {
    const { obterConexao } = await import("./conexao");

    const primeira = obterConexao();
    const segunda = obterConexao();

    expect(segunda).toBe(primeira);
    expect(estadoPool.instancias).toHaveLength(1);
    expect(estadoPool.instancias[0].query).not.toHaveBeenCalled();
  });
});
