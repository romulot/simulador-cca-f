export interface EstadoParaPolling {
  modo: "pratica" | "prova";
  status: "em_andamento" | "finalizada";
  encerrada: boolean;
}

interface OpcoesPollingRodada<T extends EstadoParaPolling> {
  obterEstado: () => T | null;
  sincronizar: () => Promise<T | null>;
  aoEncerrar: () => Promise<void>;
  abaVisivel: () => boolean;
  intervaloMs?: number;
}

export function deveSincronizarRodada(
  estado: EstadoParaPolling | null,
  abaVisivel: boolean,
): boolean {
  return (
    abaVisivel &&
    estado?.modo === "prova" &&
    estado.status === "em_andamento" &&
    !estado.encerrada
  );
}

/** Agenda a sincronização sem permitir sobreposição entre ciclos. */
export function iniciarPollingRodada<T extends EstadoParaPolling>({
  obterEstado,
  sincronizar,
  aoEncerrar,
  abaVisivel,
  intervaloMs = 5000,
}: OpcoesPollingRodada<T>): () => void {
  let sincronizacaoEmAndamento = false;
  let parado = false;

  const intervalo = setInterval(async () => {
    if (
      parado ||
      sincronizacaoEmAndamento ||
      !deveSincronizarRodada(obterEstado(), abaVisivel())
    ) {
      return;
    }

    sincronizacaoEmAndamento = true;
    try {
      const atual = await sincronizar();
      if (atual?.encerrada && !parado) {
        parado = true;
        clearInterval(intervalo);
        await aoEncerrar();
      }
    } finally {
      sincronizacaoEmAndamento = false;
    }
  }, intervaloMs);

  return () => {
    parado = true;
    clearInterval(intervalo);
  };
}
