"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type EstadoConfirmacao = "refazer-erradas" | "zerar-respondidas" | "zerar-tudo" | null;
type EstadoAcao = "idle" | "carregando" | "sucesso" | "erro";

export default function GerenciarProgresso() {
  const router = useRouter();
  const [emRevisao, setEmRevisao] = useState<number | null>(null);
  const [confirmando, setConfirmando] = useState<EstadoConfirmacao>(null);
  const [estadoAcao, setEstadoAcao] = useState<EstadoAcao>("idle");
  const [mensagemErro, setMensagemErro] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/aprendizado/resumo")
      .then((r) => r.json())
      .then((corpo) => setEmRevisao(corpo.emRevisao ?? 0))
      .catch(() => setEmRevisao(0));
  }, []);

  function solicitarConfirmacao(acao: EstadoConfirmacao) {
    setConfirmando(acao);
    setEstadoAcao("idle");
    setMensagemErro(null);
  }

  function cancelar() {
    setConfirmando(null);
    setEstadoAcao("idle");
    setMensagemErro(null);
  }

  async function refazerErradas() {
    setEstadoAcao("carregando");
    setMensagemErro(null);
    try {
      const resposta = await fetch("/api/rodadas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ modo: "pratica", revisao: true }),
      });
      const corpo = await resposta.json();
      if (!resposta.ok) {
        setMensagemErro(corpo.erro ?? "Não foi possível iniciar a revisão.");
        setEstadoAcao("erro");
        return;
      }
      router.push(`/rodada/${corpo.rodadaId}`);
    } catch {
      setMensagemErro("Falha de rede. Verifique sua conexão e tente novamente.");
      setEstadoAcao("erro");
    }
  }

  async function zerarRespondidas() {
    setEstadoAcao("carregando");
    setMensagemErro(null);
    try {
      const resposta = await fetch("/api/progress/archive-all", { method: "POST" });
      if (!resposta.ok) {
        const corpo = await resposta.json();
        setMensagemErro(corpo.erro ?? "Não foi possível arquivar as rodadas.");
        setEstadoAcao("erro");
        return;
      }
      setEstadoAcao("sucesso");
      setConfirmando(null);
      setTimeout(() => router.push("/"), 1200);
    } catch {
      setMensagemErro("Falha de rede. Verifique sua conexão e tente novamente.");
      setEstadoAcao("erro");
    }
  }

  async function zerarTudo() {
    setEstadoAcao("carregando");
    setMensagemErro(null);
    try {
      const resposta = await fetch("/api/progress", { method: "DELETE" });
      if (!resposta.ok) {
        const corpo = await resposta.json();
        setMensagemErro(corpo.erro ?? "Não foi possível apagar o progresso.");
        setEstadoAcao("erro");
        return;
      }
      setEstadoAcao("sucesso");
      setConfirmando(null);
      setTimeout(() => router.push("/"), 1200);
    } catch {
      setMensagemErro("Falha de rede. Verifique sua conexão e tente novamente.");
      setEstadoAcao("erro");
    }
  }

  const carregandoRevisao = emRevisao === null;
  const semErros = !carregandoRevisao && emRevisao === 0;

  return (
    <main className="pagina">
      <div className="envelope">
        <header>
          <Link href="/" className="botao botao-fantasma" style={{ marginBottom: "0.5rem" }}>
            ← Voltar
          </Link>
          <h1>Gerenciar progresso</h1>
          <p className="texto-fraco">
            Escolha o que deseja reiniciar. Leia a descrição de cada opção antes de confirmar.
          </p>
        </header>

        {estadoAcao === "sucesso" && (
          <p className="mensagem mensagem-sucesso" role="status">
            Feito. Redirecionando para o início…
          </p>
        )}

        {/* Ação 1: Refazer questões erradas */}
        <section className="painel pilha" aria-labelledby="refazer-titulo">
          <div className="painel-titulo">
            <h2 id="refazer-titulo">Refazer questões erradas</h2>
          </div>
          <p>
            Cria uma nova sessão de prática com todas as questões cuja sua última resposta foi
            incorreta. Nenhum dado é apagado — o histórico e as estatísticas permanecem intactos.
          </p>
          {confirmando === "refazer-erradas" ? (
            <div className="pilha">
              <p style={{ color: "var(--acento)" }}>
                Isso vai iniciar uma rodada com{" "}
                <strong>{carregandoRevisao ? "…" : emRevisao}</strong> questão(ões) errada(s).
                Nenhum dado será apagado.
              </p>
              {mensagemErro && confirmando === "refazer-erradas" && (
                <p className="texto-pequeno" style={{ color: "var(--erro)" }} role="alert">
                  {mensagemErro}
                </p>
              )}
              <div className="linha">
                <button
                  type="button"
                  className="botao botao-primario"
                  disabled={estadoAcao === "carregando"}
                  onClick={refazerErradas}
                >
                  {estadoAcao === "carregando" ? "Preparando…" : "Confirmar e iniciar"}
                </button>
                <button
                  type="button"
                  className="botao botao-fantasma"
                  disabled={estadoAcao === "carregando"}
                  onClick={cancelar}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="botao"
              disabled={semErros || carregandoRevisao}
              onClick={() => solicitarConfirmacao("refazer-erradas")}
            >
              {carregandoRevisao
                ? "Verificando…"
                : semErros
                  ? "Nenhuma questão errada"
                  : `Refazer ${emRevisao} questão(ões) errada(s)`}
            </button>
          )}
        </section>

        {/* Ação 2: Zerar questões respondidas */}
        <section className="painel pilha" aria-labelledby="zerar-respondidas-titulo">
          <div className="painel-titulo">
            <h2 id="zerar-respondidas-titulo">Zerar questões respondidas</h2>
          </div>
          <p>
            Arquiva todas as suas rodadas. Você voltará a ver todas as questões como se fosse a
            primeira vez. Suas rodadas anteriores são preservadas internamente, mas deixarão de
            aparecer no histórico e nas estatísticas.
          </p>
          {confirmando === "zerar-respondidas" ? (
            <div className="pilha">
              <p style={{ color: "var(--erro)" }}>
                Isso vai <strong>arquivar todas as suas rodadas</strong> — histórico e estatísticas
                serão zerados da sua visão. As respostas anteriores são preservadas internamente,
                mas não poderão ser recuperadas pela interface.
              </p>
              {mensagemErro && confirmando === "zerar-respondidas" && (
                <p className="texto-pequeno" style={{ color: "var(--erro)" }} role="alert">
                  {mensagemErro}
                </p>
              )}
              <div className="linha">
                <button
                  type="button"
                  className="botao"
                  style={{ borderColor: "var(--erro)", color: "var(--erro)" }}
                  disabled={estadoAcao === "carregando"}
                  onClick={zerarRespondidas}
                >
                  {estadoAcao === "carregando" ? "Arquivando…" : "Confirmar — arquivar rodadas"}
                </button>
                <button
                  type="button"
                  className="botao botao-fantasma"
                  disabled={estadoAcao === "carregando"}
                  onClick={cancelar}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="botao"
              onClick={() => solicitarConfirmacao("zerar-respondidas")}
            >
              Zerar questões respondidas
            </button>
          )}
        </section>

        {/* Ação 3: Zerar todo o progresso */}
        <section className="painel pilha" aria-labelledby="zerar-tudo-titulo">
          <div className="painel-titulo">
            <h2 id="zerar-tudo-titulo">Zerar todo o progresso</h2>
          </div>
          <p>
            Apaga permanentemente todas as suas rodadas e respostas. Diferente da opção anterior,
            os dados <strong>não são preservados</strong> — esta ação é irreversível.
          </p>
          {confirmando === "zerar-tudo" ? (
            <div className="pilha">
              <p style={{ color: "var(--erro)" }}>
                Isso vai <strong>apagar permanentemente todas as suas rodadas e respostas</strong>.
                Esta ação não pode ser desfeita.
              </p>
              {mensagemErro && confirmando === "zerar-tudo" && (
                <p className="texto-pequeno" style={{ color: "var(--erro)" }} role="alert">
                  {mensagemErro}
                </p>
              )}
              <div className="linha">
                <button
                  type="button"
                  className="botao"
                  style={{ borderColor: "var(--erro)", color: "var(--erro)" }}
                  disabled={estadoAcao === "carregando"}
                  onClick={zerarTudo}
                >
                  {estadoAcao === "carregando" ? "Apagando…" : "Confirmar — apagar tudo"}
                </button>
                <button
                  type="button"
                  className="botao botao-fantasma"
                  disabled={estadoAcao === "carregando"}
                  onClick={cancelar}
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="botao"
              onClick={() => solicitarConfirmacao("zerar-tudo")}
            >
              Zerar todo o progresso
            </button>
          )}
        </section>
      </div>
    </main>
  );
}
