"use client";

/** Tela de menu — três caminhos (praticar, prova, histórico), cada um com
 * contagem dinâmica e desabilitado com motivo quando não há conteúdo
 * utilizável. Painel "última rodada" reaproveita a mesma formatação da
 * linha de histórico. */
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Barra } from "@/components/Barra";
import { formatarData, formatarPercentual, mmss } from "@/lib/formatacao";

interface TotaisCatalogo {
  pares: number;
  paresValidos: number;
  questoes: number;
}

interface EntradaHistoricoResumo {
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
  origens: string[];
  erro: string | null;
}

export default function Menu() {
  const router = useRouter();
  const [totais, setTotais] = useState<TotaisCatalogo | null>(null);
  const [ultima, setUltima] = useState<EntradaHistoricoResumo | null>(null);
  const [totalRodadas, setTotalRodadas] = useState(0);
  const [iniciandoProva, setIniciandoProva] = useState(false);
  const [erroProva, setErroProva] = useState<string | null>(null);
  const [emRevisao, setEmRevisao] = useState(0);
  const [iniciandoRevisao, setIniciandoRevisao] = useState(false);
  const [erroRevisao, setErroRevisao] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/catalogo")
      .then((r) => r.json())
      .then((corpo) => setTotais(corpo.totais));

    fetch("/api/historico")
      .then((r) => r.json())
      .then((corpo) => {
        const entradas: EntradaHistoricoResumo[] = corpo.entradas;
        setTotalRodadas(entradas.length);
        setUltima(entradas[0] ?? null);
      });

    fetch("/api/aprendizado/resumo")
      .then((r) => r.json())
      .then((corpo) => setEmRevisao(corpo.emRevisao ?? 0));
  }, []);

  async function iniciarRevisao() {
    setIniciandoRevisao(true);
    setErroRevisao(null);
    try {
      const resposta = await fetch("/api/rodadas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ modo: "pratica", revisao: true }),
      });
      const corpo = await resposta.json();
      if (!resposta.ok) {
        setErroRevisao(corpo.erro ?? "não foi possível iniciar a revisão");
        setIniciandoRevisao(false);
        return;
      }
      router.push(`/rodada/${corpo.rodadaId}`);
    } catch {
      setErroRevisao("falha de rede ao iniciar a revisão");
      setIniciandoRevisao(false);
    }
  }

  async function iniciarProva() {
    setIniciandoProva(true);
    setErroProva(null);
    try {
      const resposta = await fetch("/api/rodadas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ modo: "prova" }),
      });
      const corpo = await resposta.json();
      if (!resposta.ok) {
        setErroProva(corpo.erro ?? "não foi possível iniciar a prova");
        setIniciandoProva(false);
        return;
      }
      router.push(`/rodada/${corpo.rodadaId}`);
    } catch {
      setErroProva("falha de rede ao iniciar a prova");
      setIniciandoProva(false);
    }
  }

  const carregando = totais === null;
  const semConteudo = totais !== null && totais.paresValidos === 0;

  async function sair() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="pagina">
      <div className="envelope">
        <header className="espaco-entre" style={{ alignItems: "flex-start" }}>
          <div>
            <h1>Simulador CCA-F</h1>
            <p className="texto-fraco">
              Prática e simulado da certificação Claude Architect Foundation.
            </p>
          </div>
          <button type="button" className="botao botao-fantasma" onClick={sair}>
            Sair
          </button>
        </header>

        <div className="painel pilha">
          <Link
            href="/selecao"
            className={`botao botao-primario botao-bloco${semConteudo ? " botao-desabilitado" : ""}`}
            aria-disabled={semConteudo}
            tabIndex={semConteudo ? -1 : undefined}
            onClick={(e) => semConteudo && e.preventDefault()}
          >
            Praticar
            {!carregando && (
              <span className="texto-pequeno">
                {" "}
                — {totais.paresValidos} simulados, {totais.questoes} questões
              </span>
            )}
          </Link>
          {semConteudo && (
            <p className="texto-pequeno texto-fraco" role="status">
              Nenhum simulado utilizável foi encontrado em <code>content/simulados/</code>.
            </p>
          )}

          <button
            type="button"
            className="botao botao-bloco"
            disabled={semConteudo || iniciandoProva}
            onClick={iniciarProva}
          >
            {iniciandoProva ? "Sorteando…" : "Modo prova"}
            {!carregando && !iniciandoProva && (
              <span className="texto-pequeno"> — 60 questões, 2h</span>
            )}
          </button>
          {erroProva && (
            <p className="texto-pequeno" style={{ color: "var(--erro)" }} role="alert">
              {erroProva}
            </p>
          )}

          <Link
            href="/historico"
            className={`botao botao-bloco${totalRodadas === 0 ? " botao-desabilitado" : ""}`}
            aria-disabled={totalRodadas === 0}
            tabIndex={totalRodadas === 0 ? -1 : undefined}
            onClick={(e) => totalRodadas === 0 && e.preventDefault()}
          >
            Histórico
            <span className="texto-pequeno"> — {totalRodadas} rodadas</span>
          </Link>

          <Link
            href="/desempenho"
            className={`botao botao-bloco${totalRodadas === 0 ? " botao-desabilitado" : ""}`}
            aria-disabled={totalRodadas === 0}
            tabIndex={totalRodadas === 0 ? -1 : undefined}
            onClick={(e) => totalRodadas === 0 && e.preventDefault()}
          >
            Meus pontos fracos
          </Link>
        </div>

        {emRevisao > 0 && (
          <section className="painel pilha" aria-labelledby="revisao-titulo">
            <div className="painel-titulo">
              <h2 id="revisao-titulo">Revisar meus erros</h2>
            </div>
            <div className="espaco-entre">
              <span>{emRevisao} questão(ões) aguardando revisão</span>
              <button
                type="button"
                className="botao botao-primario"
                disabled={iniciandoRevisao}
                onClick={iniciarRevisao}
              >
                {iniciandoRevisao ? "Preparando…" : "Revisar meus erros"}
              </button>
            </div>
            {erroRevisao && (
              <p className="texto-pequeno" style={{ color: "var(--erro)" }} role="alert">
                {erroRevisao}
              </p>
            )}
          </section>
        )}

        {ultima && ultima.placar && (
          <section className="painel" aria-labelledby="ultima-rodada-titulo">
            <div className="painel-titulo">
              <h2 id="ultima-rodada-titulo">Última rodada</h2>
              {ultima.quando && (
                <span className="texto-pequeno texto-fraco mono">
                  {formatarData(new Date(ultima.quando))}
                </span>
              )}
            </div>
            <div className="pilha">
              <div className="espaco-entre">
                <span>
                  {ultima.modo === "prova" ? "Modo prova" : ultima.origens.join(", ")}
                </span>
                <span className="mono">
                  {ultima.placar.acertos}/
                  {ultima.modo === "prova" ? ultima.placar.total : ultima.placar.respondidas} (
                  {formatarPercentual(
                    ultima.modo === "prova"
                      ? ultima.placar.percentualTotal
                      : ultima.placar.percentual,
                  )}
                  ) · {mmss(ultima.placar.tempoTotal)}
                </span>
              </div>
              <Barra
                fracao={
                  ultima.placar.total > 0
                    ? ultima.placar.acertos /
                      (ultima.modo === "prova" ? ultima.placar.total : ultima.placar.respondidas || 1)
                    : 0
                }
              />
              <Link href={`/resultado/${ultima.id}`} className="botao botao-fantasma">
                Ver resultado completo →
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
