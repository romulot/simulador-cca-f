import { afterEach, describe, expect, it, vi } from "vitest";

import { iniciarPollingRodada } from "./pollingRodada";

const PROVA_ATIVA = {
  modo: "prova" as const,
  status: "em_andamento" as const,
  encerrada: false,
};

afterEach(() => {
  vi.useRealTimers();
});

describe("iniciarPollingRodada", () => {
  it("não sincroniza rodada em modo prática", async () => {
    vi.useFakeTimers();
    const sincronizar = vi.fn();
    const parar = iniciarPollingRodada({
      obterEstado: () => ({ ...PROVA_ATIVA, modo: "pratica" }),
      sincronizar,
      aoEncerrar: vi.fn(),
      abaVisivel: () => true,
    });

    await vi.advanceTimersByTimeAsync(15_000);

    expect(sincronizar).not.toHaveBeenCalled();
    parar();
  });

  it("sincroniza prova ativa quando a aba está visível", async () => {
    vi.useFakeTimers();
    const sincronizar = vi.fn().mockResolvedValue(PROVA_ATIVA);
    const parar = iniciarPollingRodada({
      obterEstado: () => PROVA_ATIVA,
      sincronizar,
      aoEncerrar: vi.fn(),
      abaVisivel: () => true,
    });

    await vi.advanceTimersByTimeAsync(10_000);

    expect(sincronizar).toHaveBeenCalledTimes(2);
    parar();
  });

  it("suspende a sincronização enquanto a aba está oculta", async () => {
    vi.useFakeTimers();
    let visivel = false;
    const sincronizar = vi.fn().mockResolvedValue(PROVA_ATIVA);
    const parar = iniciarPollingRodada({
      obterEstado: () => PROVA_ATIVA,
      sincronizar,
      aoEncerrar: vi.fn(),
      abaVisivel: () => visivel,
    });

    await vi.advanceTimersByTimeAsync(10_000);
    expect(sincronizar).not.toHaveBeenCalled();

    visivel = true;
    await vi.advanceTimersByTimeAsync(5_000);
    expect(sincronizar).toHaveBeenCalledOnce();
    parar();
  });

  it("para após detectar o encerramento", async () => {
    vi.useFakeTimers();
    const sincronizar = vi.fn().mockResolvedValue({ ...PROVA_ATIVA, encerrada: true });
    const aoEncerrar = vi.fn().mockResolvedValue(undefined);
    iniciarPollingRodada({
      obterEstado: () => PROVA_ATIVA,
      sincronizar,
      aoEncerrar,
      abaVisivel: () => true,
    });

    await vi.advanceTimersByTimeAsync(15_000);

    expect(sincronizar).toHaveBeenCalledOnce();
    expect(aoEncerrar).toHaveBeenCalledOnce();
  });

  it("não inicia outro request enquanto a sincronização anterior está pendente", async () => {
    vi.useFakeTimers();
    let resolver!: (estado: typeof PROVA_ATIVA) => void;
    const pendente = new Promise<typeof PROVA_ATIVA>((resolve) => {
      resolver = resolve;
    });
    const sincronizar = vi.fn().mockReturnValue(pendente);
    const parar = iniciarPollingRodada({
      obterEstado: () => PROVA_ATIVA,
      sincronizar,
      aoEncerrar: vi.fn(),
      abaVisivel: () => true,
    });

    await vi.advanceTimersByTimeAsync(15_000);
    expect(sincronizar).toHaveBeenCalledOnce();

    resolver(PROVA_ATIVA);
    await Promise.resolve();
    await vi.advanceTimersByTimeAsync(5_000);
    expect(sincronizar).toHaveBeenCalledTimes(2);
    parar();
  });

  it("limpa o intervalo ao desmontar", async () => {
    vi.useFakeTimers();
    const sincronizar = vi.fn().mockResolvedValue(PROVA_ATIVA);
    const parar = iniciarPollingRodada({
      obterEstado: () => PROVA_ATIVA,
      sincronizar,
      aoEncerrar: vi.fn(),
      abaVisivel: () => true,
    });

    parar();
    await vi.advanceTimersByTimeAsync(10_000);

    expect(sincronizar).not.toHaveBeenCalled();
  });
});
