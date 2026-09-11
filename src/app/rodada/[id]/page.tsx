"use client";

/** Tela de rodada/questão — o coração do app.
 *
 * `segundosGastos` (quanto tempo o candidato ficou na questão que está
 * saindo de cena) é medido no CLIENTE (timestamp de quando a questão
 * entrou em tela) e enviado a cada ação; a autoridade sobre "a prova
 * acabou" continua sendo do servidor (`encerrada`, recomputado a cada
 * sincronização periódica a partir de `iniciada_em` — nunca do relógio
 * daqui).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Cronometro } from "@/components/Cronometro";
import { Trilha, celulasDeRespostas } from "@/components/Trilha";
import { Dicas } from "@/components/Dicas";
import { TextoMarkdownInline } from "@/components/TextoMarkdownInline";
import { iniciarPollingRodada } from "@/lib/api/pollingRodada";

type Letra = "A" | "B" | "C" | "D";
const LETRAS: Letra[] = ["A", "B", "C", "D"];

interface QuestaoCliente {
  posicao: number;
  origem: string;
  dominio: number | null;
  numero: number;
  enunciado: string;
  alternativas: Record<Letra, string>;
}

/** Presente na resposta da API só no modo prática, só depois de responder
 * (nunca no modo prova — lá a explicação só aparece depois que a rodada
 * inteira encerra, na tela de resultado). */
interface FeedbackResposta {
  correta: Letra;
  explicacoes: Record<Letra, string>;
}

interface EstadoRodada {
  rodadaId: number;
  modo: "pratica" | "prova";
  status: "em_andamento" | "finalizada";
  totalQuestoes: number;
  limiteSegundos: number | null;
  restanteSegundos: number | null;
  decorridoSegundos: number;
  indiceAtual: number;
  respostas: Array<Letra | null>;
  encerrada: boolean;
  questaoAtual: QuestaoCliente | null;
}

const AVISO_SEGUNDOS = 5 * 60;

function proximaEmBranco(respostas: Array<Letra | null>, indiceAtual: number): number | null {
  const total = respostas.length;
  for (let passo = 1; passo <= total; passo++) {
    const i = (indiceAtual + passo) % total;
    if (respostas[i] === null) return i;
  }
  return null;
}

export default function TelaRodada() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [estado, setEstado] = useState<EstadoRodada | null>(null);
  const [erroCarregar, setErroCarregar] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResposta | null>(null);
  const [confirmandoFim, setConfirmandoFim] = useState(false);
  const mostradaEm = useRef<number>(0);
  const finalizando = useRef(false);
  const sincronizando = useRef(false);
  const estadoRef = useRef<EstadoRodada | null>(null);
  const confirmacaoRef = useRef<HTMLDivElement>(null);
  const botaoFinalizarRef = useRef<HTMLButtonElement>(null);

  // Move o foco para o painel de confirmação quando ele aparece — sem
  // isto, alguém usando leitor de tela não teria como notar que a
  // confirmação surgiu (o foco continuaria no botão "Finalizar rodada").
  useEffect(() => {
    if (confirmandoFim) confirmacaoRef.current?.focus();
  }, [confirmandoFim]);

  const carregar = useCallback(async () => {
    if (sincronizando.current) return null;
    sincronizando.current = true;
    try {
      const resposta = await fetch(`/api/rodadas/${id}`);
      if (!resposta.ok) {
        if (resposta.status === 404) setErroCarregar("rodada não encontrada");
        return null;
      }
      const corpo: EstadoRodada = await resposta.json();
      estadoRef.current = corpo;
      setEstado(corpo);
      return corpo;
    } finally {
      sincronizando.current = false;
    }
  }, [id]);

  const concluirRodadaEncerrada = useCallback(async () => {
    if (finalizando.current) return;
    finalizando.current = true;
    await fetch(`/api/rodadas/${id}/encerrar`, { method: "POST" });
    router.push(`/resultado/${id}`);
  }, [id, router]);

  useEffect(() => {
    void carregar().then((atual) => {
      if (atual?.encerrada) void concluirRodadaEncerrada();
    });
    mostradaEm.current = Date.now();
  }, [carregar, concluirRodadaEncerrada]);

  // Em prova ativa e visível, sincroniza com o relógio autoritativo do
  // servidor. Prática não possui limite e evolui pelas respostas das ações.
  useEffect(() => {
    if (
      estado?.modo !== "prova" ||
      estado.status !== "em_andamento" ||
      estado.encerrada ||
      finalizando.current
    ) {
      return;
    }

    return iniciarPollingRodada({
      obterEstado: () => (finalizando.current ? null : estadoRef.current),
      sincronizar: carregar,
      abaVisivel: () => document.visibilityState === "visible",
      aoEncerrar: concluirRodadaEncerrada,
    });
  }, [carregar, concluirRodadaEncerrada, estado?.encerrada, estado?.modo, estado?.status]);

  async function enviarAcao(corpo: { resposta?: Letra; destino?: number }) {
    if (!estado || enviando) return;
    setEnviando(true);
    const segundosGastos = (Date.now() - mostradaEm.current) / 1000;
    try {
      const resposta = await fetch(`/api/rodadas/${id}/questoes/${estado.indiceAtual}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...corpo, segundosGastos }),
      });
      if (resposta.status === 409) {
        // Ou já encerrou (tempo esgotou entre a exibição e o clique), ou o
        // índice já mudou por outro caminho — re-sincroniza em vez de
        // insistir num estado que o servidor não reconhece mais.
        const atual = await carregar();
        if (atual?.encerrada) router.push(`/resultado/${id}`);
        return;
      }
      const corpoResposta = await resposta.json();
      if (!resposta.ok) return;
      setEstado((anterior) => {
        if (!anterior) return anterior;
        const atualizado = {
          ...anterior,
          indiceAtual: corpoResposta.indiceAtual,
          respostas: corpoResposta.respostas,
          questaoAtual: corpoResposta.questaoAtual,
        };
        estadoRef.current = atualizado;
        return atualizado;
      });
      // Presente só quando acabou de responder no modo prática; ausente em
      // qualquer navegação (`destino`) ou no modo prova — o que limpa o
      // painel de feedback assim que o candidato sai da questão.
      setFeedback(corpoResposta.feedback ?? null);
      mostradaEm.current = Date.now();
    } finally {
      setEnviando(false);
    }
  }

  async function finalizar() {
    if (!estado) return;
    finalizando.current = true;
    const segundosGastos = (Date.now() - mostradaEm.current) / 1000;
    await fetch(`/api/rodadas/${id}/encerrar`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ segundosGastos }),
    });
    router.push(`/resultado/${id}`);
  }

  // Atalhos de teclado: A-D responde, ←/→ navega — no mesmo espírito da
  // TUI original, além dos botões (sempre acessíveis por si só via Tab).
  useEffect(() => {
    function aoTeclar(e: KeyboardEvent) {
      if (confirmandoFim) {
        if (e.key === "Escape") {
          setConfirmandoFim(false);
          botaoFinalizarRef.current?.focus();
        }
        return;
      }
      if (!estado || enviando) return;
      const letra = e.key.toUpperCase();
      if (LETRAS.includes(letra as Letra)) {
        // Enquanto o feedback da resposta atual está em tela, A–D não
        // reenvia — o candidato usa →/Avançar para seguir em frente.
        if (feedback) return;
        enviarAcao({ resposta: letra as Letra });
      } else if (e.key === "ArrowRight" && estado.indiceAtual < estado.totalQuestoes - 1) {
        enviarAcao({ destino: estado.indiceAtual + 1 });
      } else if (e.key === "ArrowLeft" && estado.indiceAtual > 0) {
        enviarAcao({ destino: estado.indiceAtual - 1 });
      }
    }
    window.addEventListener("keydown", aoTeclar);
    return () => window.removeEventListener("keydown", aoTeclar);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado, enviando, confirmandoFim, feedback]);

  if (erroCarregar) {
    return (
      <main className="pagina">
        <p role="alert">{erroCarregar}</p>
      </main>
    );
  }

  if (!estado || !estado.questaoAtual) {
    return (
      <main className="pagina">
        <p className="texto-fraco">Carregando…</p>
      </main>
    );
  }

  const { questaoAtual } = estado;
  const emBranco = estado.respostas
    .map((r, i) => (r === null ? i + 1 : null))
    .filter((n): n is number => n !== null);

  return (
    <main className="pagina">
      <div className="envelope">
        <div className="espaco-entre">
          <span className="mono texto-fraco">
            Questão {estado.indiceAtual + 1}/{estado.totalQuestoes}
          </span>
          {estado.modo === "prova" ? (
            <Cronometro
              segundosIniciais={estado.restanteSegundos ?? 0}
              sentido="regressivo"
              avisoAbaixoDe={AVISO_SEGUNDOS}
            />
          ) : (
            <Cronometro segundosIniciais={estado.decorridoSegundos} sentido="progressivo" />
          )}
        </div>

        <Trilha celulas={celulasDeRespostas(estado.respostas, estado.indiceAtual)} />

        <section className="painel pilha">
          <p className="texto-quebra" style={{ fontSize: "1.05rem" }}>
            <TextoMarkdownInline texto={questaoAtual.enunciado} />
          </p>
          <div className="pilha" role="group" aria-label="Alternativas">
            {LETRAS.map((letra) => {
              const marcada = estado.respostas[estado.indiceAtual] === letra;
              const ehCorreta = feedback?.correta === letra;
              const corDaBorda = feedback
                ? ehCorreta
                  ? "var(--acerto)"
                  : marcada
                    ? "var(--erro)"
                    : undefined
                : marcada
                  ? "var(--acento)"
                  : undefined;
              return (
                <button
                  key={letra}
                  type="button"
                  className="botao botao-alternativa"
                  style={{
                    justifyContent: "flex-start",
                    textAlign: "left",
                    borderColor: corDaBorda,
                    background: marcada && !feedback ? "var(--painel-fraco)" : undefined,
                    // `.botao:disabled` apaga a opacidade para 0.45 — correto
                    // para um botão comum inativo, mas aqui apagaria
                    // justamente a cor de certo/errado que é o conteúdo.
                    opacity: feedback ? 1 : undefined,
                  }}
                  disabled={enviando || feedback !== null}
                  aria-pressed={marcada}
                  onClick={() => enviarAcao({ resposta: letra })}
                >
                  <span className="mono">{letra})</span>{" "}
                  <span className="texto-quebra texto-alternativa">
                    <TextoMarkdownInline texto={questaoAtual.alternativas[letra]} />
                  </span>
                  {marcada && <span className="visualmente-oculto"> (selecionada)</span>}
                  {feedback && ehCorreta && (
                    <span className="badge badge-acerto" style={{ marginLeft: "0.5em" }}>
                      ← correta
                    </span>
                  )}
                  {feedback && marcada && !ehCorreta && (
                    <span className="badge badge-erro" style={{ marginLeft: "0.5em" }}>
                      ← sua resposta
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {feedback && (
          <section className="painel pilha" aria-live="polite">
            <p
              className={`mensagem ${estado.respostas[estado.indiceAtual] === feedback.correta ? "mensagem-sucesso" : "mensagem-erro"}`}
              role="status"
            >
              {estado.respostas[estado.indiceAtual] === feedback.correta
                ? "✓ Resposta correta"
                : "✕ Resposta incorreta"}
            </p>
            <p className="texto-pequeno texto-fraco" style={{ margin: 0 }}>
              Por que {feedback.correta} está correta?
            </p>
            <p className="texto-quebra" style={{ margin: 0 }}>
              <TextoMarkdownInline texto={feedback.explicacoes[feedback.correta]} />
            </p>
            {estado.respostas[estado.indiceAtual] !== null &&
              estado.respostas[estado.indiceAtual] !== feedback.correta && (
                <>
                  <p className="texto-pequeno texto-fraco" style={{ margin: 0 }}>
                    Por que {estado.respostas[estado.indiceAtual]} está incorreta?
                  </p>
                  <p className="texto-quebra" style={{ margin: 0 }}>
                    <TextoMarkdownInline texto={feedback.explicacoes[estado.respostas[estado.indiceAtual] as Letra]} />
                  </p>
                </>
              )}
          </section>
        )}

        <div className="espaco-entre">
          <button
            type="button"
            className="botao"
            disabled={estado.indiceAtual === 0 || enviando}
            onClick={() => enviarAcao({ destino: estado.indiceAtual - 1 })}
          >
            ← Voltar
          </button>
          <button
            type="button"
            className="botao"
            disabled={enviando}
            onClick={() => {
              const proxima = proximaEmBranco(estado.respostas, estado.indiceAtual);
              if (proxima !== null) enviarAcao({ destino: proxima });
            }}
          >
            Próxima em branco
          </button>
          <button
            type="button"
            className="botao"
            disabled={estado.indiceAtual === estado.totalQuestoes - 1 || enviando}
            onClick={() => enviarAcao({ destino: estado.indiceAtual + 1 })}
          >
            Avançar →
          </button>
        </div>

        <Dicas
          itens={[
            { tecla: "A–D", glosa: "responder" },
            { tecla: "←/→", glosa: "navegar" },
          ]}
        />

        <button
          type="button"
          ref={botaoFinalizarRef}
          className="botao botao-bloco"
          style={{ borderColor: "var(--erro)" }}
          onClick={() => setConfirmandoFim(true)}
        >
          Finalizar rodada
        </button>

        {confirmandoFim && (
          <div
            className="painel pilha"
            role="alertdialog"
            aria-labelledby="confirmar-titulo"
            ref={confirmacaoRef}
            tabIndex={-1}
          >
            <h2 id="confirmar-titulo" style={{ fontSize: "1rem" }}>
              {emBranco.length > 0
                ? `${emBranco.length} questão(ões) em branco: ${emBranco.join(", ")}. Finalizar mesmo assim?`
                : "Finalizar a rodada?"}
            </h2>
            <div className="linha">
              <button type="button" className="botao botao-primario" onClick={finalizar}>
                Sim, finalizar
              </button>
              <button
                type="button"
                className="botao"
                onClick={() => {
                  setConfirmandoFim(false);
                  botaoFinalizarRef.current?.focus();
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
