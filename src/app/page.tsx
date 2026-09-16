"use client";

/** Tela de menu — caminhos de prática, avaliação e histórico, cada um com
 * contagem dinâmica e desabilitado com motivo quando não há conteúdo
 * utilizável. Painel "última rodada" reaproveita a mesma formatação da
 * linha de histórico. */
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Barra } from "@/components/Barra";
import { formatarData, formatarPercentual, mmss } from "@/lib/formatacao";
import { CURSOS, type CursoId } from "@/lib/catalogo/curso";

const ROTULO_CURSO: Record<CursoId, string> = {
  "curso-antigo": "Curso Antigo",
  "exame-avancado": "Exame Avançado",
};

interface TotaisCatalogo {
  pares: number;
  paresValidos: number;
  questoes: number;
}

interface TopicoForte {
  topicoId: string;
  nome: string;
  percentual: number;
}

interface EntradaHistoricoResumo {
  id: number;
  quando: string | null;
  modo: "pratica" | "aleatorio" | "prova" | null;
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
  const [curso, setCurso] = useState<CursoId>("curso-antigo");
  const [totais, setTotais] = useState<TotaisCatalogo | null>(null);
  const [ultima, setUltima] = useState<EntradaHistoricoResumo | null>(null);
  const [totalRodadas, setTotalRodadas] = useState(0);
  const [iniciandoProva, setIniciandoProva] = useState(false);
  const [erroProva, setErroProva] = useState<string | null>(null);
  const [quantidadeAleatoria, setQuantidadeAleatoria] = useState("10");
  const [iniciandoAleatorio, setIniciandoAleatorio] = useState(false);
  const [erroAleatorio, setErroAleatorio] = useState<string | null>(null);
  const [emRevisao, setEmRevisao] = useState(0);
  const [iniciandoRevisao, setIniciandoRevisao] = useState(false);
  const [erroRevisao, setErroRevisao] = useState<string | null>(null);
  const [desempenhoGeral, setDesempenhoGeral] = useState<number | null>(null);
  const [pontosFortes, setPontosFortes] = useState<TopicoForte[]>([]);
  const [totalPontosAtencao, setTotalPontosAtencao] = useState(0);

  useEffect(() => {
    fetch(`/api/catalogo?curso=${curso}`)
      .then((r) => r.json())
      .then((corpo) => setTotais(corpo.totais));
  }, [curso]);

  useEffect(() => {
    fetch("/api/historico")
      .then((r) => r.json())
      .then((corpo) => {
        const entradas: EntradaHistoricoResumo[] = corpo.entradas;
        setTotalRodadas(entradas.length);
        setUltima(entradas[0] ?? null);
      });

    fetch("/api/aprendizado/resumo")
      .then((r) => r.json())
      .then((corpo) => {
        setEmRevisao(corpo.emRevisao ?? 0);
        setDesempenhoGeral(corpo.desempenhoGeral ?? null);
        setPontosFortes(corpo.pontosFortes ?? []);
        const totalAtencao = (corpo.dominios ?? []).reduce(
          (soma: number, d: { topicosFracos: unknown[] }) => soma + d.topicosFracos.length,
          0,
        );
        setTotalPontosAtencao(totalAtencao);
      });
  }, []);

  async function iniciarRevisao() {
    setIniciandoRevisao(true);
    setErroRevisao(null);
    try {
      const resposta = await fetch("/api/rodadas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ modo: "pratica", revisao: true, curso }),
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
        body: JSON.stringify({ modo: "prova", curso }),
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

  async function iniciarAleatorio() {
    const quantidade = Number(quantidadeAleatoria);
    if (
      !Number.isInteger(quantidade) ||
      quantidade <= 0 ||
      (totais !== null && quantidade > totais.questoes)
    ) {
      setErroAleatorio(
        totais ? `Informe um número entre 1 e ${totais.questoes}.` : "Informe um número válido.",
      );
      return;
    }

    setIniciandoAleatorio(true);
    setErroAleatorio(null);
    try {
      const resposta = await fetch("/api/rodadas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ modo: "aleatorio", quantidade, curso }),
      });
      const corpo = await resposta.json();
      if (!resposta.ok) {
        setErroAleatorio(corpo.erro ?? "não foi possível iniciar o modo aleatório");
        setIniciandoAleatorio(false);
        return;
      }
      router.push(`/rodada/${corpo.rodadaId}`);
    } catch {
      setErroAleatorio("falha de rede ao iniciar o modo aleatório");
      setIniciandoAleatorio(false);
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

        <div className="painel pilha" role="radiogroup" aria-label="Curso">
          <div className="linha">
            {CURSOS.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={curso === c}
                className={`botao ${curso === c ? "botao-primario" : "botao-fantasma"}`}
                onClick={() => setCurso(c)}
              >
                {ROTULO_CURSO[c]}
              </button>
            ))}
          </div>
        </div>

        <div className="painel pilha">
          <Link
            href={`/selecao?curso=${curso}`}
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
              Nenhum conteúdo utilizável foi encontrado para {ROTULO_CURSO[curso]}.
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

          <div className="painel pilha" style={{ padding: "0.85rem" }}>
            <strong>Modo aleatório</strong>
            <div className="linha" style={{ alignItems: "end" }}>
              <div style={{ flex: 1 }}>
                <label
                  className="texto-pequeno texto-fraco"
                  htmlFor="quantidade-aleatoria"
                >
                  Número de questões
                </label>
                <input
                  id="quantidade-aleatoria"
                  type="number"
                  className="campo"
                  min={1}
                  max={totais?.questoes}
                  step={1}
                  value={quantidadeAleatoria}
                  disabled={semConteudo || iniciandoAleatorio}
                  onChange={(evento) => setQuantidadeAleatoria(evento.target.value)}
                />
              </div>
              <button
                type="button"
                className="botao"
                disabled={semConteudo || iniciandoAleatorio}
                onClick={iniciarAleatorio}
              >
                {iniciandoAleatorio ? "Sorteando…" : "Começar"}
              </button>
            </div>
            {!carregando && (
              <span className="texto-pequeno texto-fraco">
                Escolha de 1 a {totais.questoes}; 2 min por questão e correção ao finalizar.
              </span>
            )}
            {erroAleatorio && (
              <p className="texto-pequeno" style={{ color: "var(--erro)" }} role="alert">
                {erroAleatorio}
              </p>
            )}
          </div>

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

          <Link href="/proxima-sessao" className="botao botao-bloco">
            Próxima sessão
          </Link>

          <Link
            href="/caderno"
            className={`botao botao-bloco${totalRodadas === 0 ? " botao-desabilitado" : ""}`}
            aria-disabled={totalRodadas === 0}
            tabIndex={totalRodadas === 0 ? -1 : undefined}
            onClick={(e) => totalRodadas === 0 && e.preventDefault()}
          >
            Caderno de erros
          </Link>

          <Link href="/gerenciar-progresso" className="botao botao-fantasma botao-bloco">
            Gerenciar progresso
          </Link>
        </div>

        {desempenhoGeral !== null && (
          <section className="painel pilha" aria-labelledby="desempenho-titulo">
            <div className="painel-titulo">
              <h2 id="desempenho-titulo">Meu desempenho</h2>
              <span className="mono">{formatarPercentual(desempenhoGeral)}</span>
            </div>
            <div className="linha" style={{ flexWrap: "wrap" }}>
              {pontosFortes.slice(0, 3).map((t) => (
                <span key={t.topicoId} className="badge badge-acerto">
                  ✓ {t.nome}
                </span>
              ))}
              {totalPontosAtencao > 0 && (
                <span className="badge badge-erro">
                  ⚠ {totalPontosAtencao} ponto(s) de atenção
                </span>
              )}
            </div>
            {totalPontosAtencao > 0 && (
              <Link href="/desempenho" className="botao botao-fantasma">
                Ver pontos fracos →
              </Link>
            )}
          </section>
        )}

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
                  {ultima.modo === "prova"
                    ? "Modo prova"
                    : ultima.modo === "aleatorio"
                      ? "Modo aleatório"
                      : ultima.origens.join(", ")}
                </span>
                <span className="mono">
                  {ultima.placar.acertos}/
                  {ultima.modo === "prova" || ultima.modo === "aleatorio"
                    ? ultima.placar.total
                    : ultima.placar.respondidas} (
                  {formatarPercentual(
                    ultima.modo === "prova" || ultima.modo === "aleatorio"
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
                      (ultima.modo === "prova" || ultima.modo === "aleatorio"
                        ? ultima.placar.total
                        : ultima.placar.respondidas || 1)
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
