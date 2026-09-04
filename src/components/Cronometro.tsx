"use client";

/** Mostra um tempo em MM:SS, andando localmente entre sincronizações com o
 * servidor (que é quem de fato decide quando o tempo acaba — ver
 * `src/domain/rodada.ts::esgotado`). Este componente só EXIBE; a página
 * que o usa é quem re-sincroniza com `GET /api/rodadas/:id` periodicamente
 * e reage de verdade ao tempo esgotar.
 */
import { useEffect, useState } from "react";

export interface CronometroProps {
  /** Segundos no momento em que este valor foi lido do servidor. */
  segundosIniciais: number;
  /** "regressivo" conta pra baixo (modo prova); "progressivo" conta pra cima (prática). */
  sentido: "regressivo" | "progressivo";
  /** Abaixo deste limiar (só faz sentido no regressivo), o cronômetro
   * ganha o estilo de aviso — cor sozinha nunca é o único sinal: o rótulo
   * `role="status"` avisa por texto também, uma vez, quando cruza o limiar. */
  avisoAbaixoDe?: number;
  className?: string;
}

function formatar(segundos: number): string {
  const s = Math.max(0, Math.round(segundos));
  const m = Math.floor(s / 60);
  const resto = s % 60;
  return `${String(m).padStart(2, "0")}:${String(resto).padStart(2, "0")}`;
}

export function Cronometro({
  segundosIniciais,
  sentido,
  avisoAbaixoDe,
  className,
}: CronometroProps) {
  const [segundos, setSegundos] = useState(segundosIniciais);
  const [avisouUmaVez, setAvisouUmaVez] = useState(false);

  // Novo valor do servidor chegou (re-sincronização) — readota o relógio
  // local a partir dele, em vez de deixar o drift local acumular.
  useEffect(() => {
    setSegundos(segundosIniciais);
  }, [segundosIniciais]);

  useEffect(() => {
    const id = setInterval(() => {
      setSegundos((atual) => {
        const proximo = sentido === "regressivo" ? atual - 1 : atual + 1;
        return sentido === "regressivo" ? Math.max(0, proximo) : proximo;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [sentido]);

  const emAviso =
    sentido === "regressivo" && avisoAbaixoDe !== undefined && segundos <= avisoAbaixoDe;

  useEffect(() => {
    if (emAviso) setAvisouUmaVez(true);
  }, [emAviso]);

  return (
    <span
      className={["mono", className].filter(Boolean).join(" ")}
      style={emAviso ? { color: "var(--erro)", fontWeight: 700 } : undefined}
    >
      {formatar(segundos)}
      <span className="visualmente-oculto" role="status">
        {emAviso && !avisouUmaVez
          ? "Atenção: menos de cinco minutos restantes."
          : ""}
      </span>
    </span>
  );
}
