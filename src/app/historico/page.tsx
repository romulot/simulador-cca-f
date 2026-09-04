"use client";

/** Tela de histórico — lista de rodadas passadas reabríveis; entradas
 * corrompidas aparecem com o motivo em vez de sumirem (mesmo tratamento
 * que `repositorioHistorico.ts` já garante na leitura). */
import { useEffect, useState } from "react";
import Link from "next/link";

import { formatarData, formatarPercentual, mmss } from "@/lib/formatacao";

interface EntradaHistorico {
  id: number;
  quando: string | null;
  modo: "pratica" | "prova" | null;
  placar: {
    total: number;
    respondidas: number;
    acertos: number;
    percentual: number | null;
    percentualTotal: number | null;
    tempoTotal: number;
  } | null;
  esgotouTempo: boolean;
  origens: string[];
  erro: string | null;
}

export default function Historico() {
  const [entradas, setEntradas] = useState<EntradaHistorico[] | null>(null);

  useEffect(() => {
    fetch("/api/historico")
      .then((r) => r.json())
      .then((corpo) => setEntradas(corpo.entradas));
  }, []);

  return (
    <main className="pagina">
      <div className="envelope">
        <div className="espaco-entre">
          <h1>Histórico</h1>
          <Link href="/" className="botao botao-fantasma">
            ← Menu
          </Link>
        </div>

        {entradas === null && <p className="texto-fraco">Carregando…</p>}
        {entradas?.length === 0 && <p className="texto-fraco">Nenhuma rodada ainda.</p>}

        <div className="pilha">
          {entradas?.map((entrada) => {
            if (entrada.erro || !entrada.placar) {
              return (
                <div key={entrada.id} className="painel espaco-entre">
                  <span className="texto-pequeno">Rodada #{entrada.id}</span>
                  <span className="badge badge-erro" title={entrada.erro ?? undefined}>
                    ✗ {entrada.erro ?? "indisponível"}
                  </span>
                </div>
              );
            }
            const denominador =
              entrada.modo === "prova" ? entrada.placar.total : entrada.placar.respondidas;
            const percentual =
              entrada.modo === "prova" ? entrada.placar.percentualTotal : entrada.placar.percentual;
            return (
              <Link
                key={entrada.id}
                href={`/resultado/${entrada.id}`}
                className="painel"
                style={{ display: "block", textDecoration: "none", color: "inherit" }}
              >
                <div className="espaco-entre">
                  <span>
                    {entrada.modo === "prova" ? "Modo prova" : entrada.origens.join(", ")}
                  </span>
                  {entrada.esgotouTempo && <span className="badge badge-erro">⏱ esgotado</span>}
                </div>
                <div className="espaco-entre">
                  <span className="texto-pequeno texto-fraco mono">
                    {entrada.quando ? formatarData(new Date(entrada.quando)) : "—"}
                  </span>
                  <span className="mono">
                    {entrada.placar.acertos}/{denominador} ({formatarPercentual(percentual)}) ·{" "}
                    {mmss(entrada.placar.tempoTotal)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
