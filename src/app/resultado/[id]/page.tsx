"use client";

/** Tela de resultado — reaberta tanto ao fim de uma rodada quanto a partir
 * do histórico (mesmo componente, mesma rota `GET /api/historico/:id`).
 *
 * O relatório NÃO converte a taxa bruta de acerto para a escala oficial
 * 720/1000 — só cita a referência (a certificação não publica essa
 * conversão). Desempenho por domínio nunca usa cor condicional ao
 * acerto: o comprimento da barra é a informação, o peso oficial é só
 * contexto.
 */
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { Barra } from "@/components/Barra";
import { formatarData, formatarPercentual, mmss } from "@/lib/formatacao";
import { PESOS } from "@/domain/sorteio";
import { topicoPorNome } from "@/domain/topicos";
import { recursosPorTopico } from "@/data/recursos";

type Letra = "A" | "B" | "C" | "D";

interface QuestaoDetalhe {
  posicao: number;
  origem: string;
  dominio: number | null;
  numero: number;
  enunciado: string;
  alternativas: Record<Letra, string>;
  correta: Letra;
  resumo: string;
  explicacoes: Record<Letra, string>;
  metadados: {
    bloom: string;
    dificuldade: string;
    rubrica: string;
    cenario: string;
    principioTestado: string;
  };
  topicos: string[];
  resposta: Letra | null;
  segundos: number;
}

interface DetalheRodada {
  id: number;
  modo: "pratica" | "prova";
  quando: string;
  esgotouTempo: boolean;
  placar: {
    total: number;
    respondidas: number;
    emBranco: number;
    acertos: number;
    erros: number;
    percentual: number | null;
    percentualTotal: number | null;
    tempoTotal: number;
  };
  questoes: QuestaoDetalhe[];
}

function agregarPor<T extends string>(
  questoes: QuestaoDetalhe[],
  chave: (q: QuestaoDetalhe) => T,
): Array<{ chave: T; acertos: number; total: number }> {
  const mapa = new Map<T, { acertos: number; total: number }>();
  for (const q of questoes) {
    const k = chave(q);
    const atual = mapa.get(k) ?? { acertos: 0, total: 0 };
    atual.total += 1;
    if (q.resposta !== null && q.resposta === q.correta) atual.acertos += 1;
    mapa.set(k, atual);
  }
  return [...mapa.entries()].map(([chave, v]) => ({ chave, ...v }));
}

export default function TelaResultado() {
  const params = useParams<{ id: string }>();
  const [detalhe, setDetalhe] = useState<DetalheRodada | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/historico/${params.id}`)
      .then(async (r) => {
        if (!r.ok) {
          const corpo = await r.json();
          setErro(corpo.erro ?? "não foi possível abrir esta rodada");
          return;
        }
        setDetalhe(await r.json());
      })
      .catch(() => setErro("falha de rede ao carregar o resultado"));
  }, [params.id]);

  if (erro) {
    return (
      <main className="pagina">
        <p role="alert">{erro}</p>
        <Link href="/" className="botao">
          ← Menu
        </Link>
      </main>
    );
  }
  if (!detalhe) {
    return (
      <main className="pagina">
        <p className="texto-fraco">Carregando…</p>
      </main>
    );
  }

  const { placar } = detalhe;
  const denominadorPrincipal = detalhe.modo === "prova" ? placar.total : placar.respondidas;
  const percentualPrincipal =
    detalhe.modo === "prova" ? placar.percentualTotal : placar.percentual;

  const origens = [...new Set(detalhe.questoes.map((q) => q.origem))].sort();
  const porDominio = agregarPor(detalhe.questoes, (q) => String(q.dominio ?? "sem domínio"));
  const porBloom = agregarPor(detalhe.questoes, (q) => q.metadados.bloom);
  const porDificuldade = agregarPor(detalhe.questoes, (q) => q.metadados.dificuldade);
  const erradas = detalhe.questoes.filter((q) => q.resposta !== null && q.resposta !== q.correta);

  return (
    <main className="pagina">
      <div className="envelope envelope-largo pilha">
        <div className="espaco-entre">
          <h1>Resultado</h1>
          <Link href="/" className="botao botao-fantasma">
            ← Menu
          </Link>
        </div>

        <section className="painel pilha">
          <div className="espaco-entre">
            <span className="mono texto-fraco">
              {detalhe.modo === "prova" ? "Modo prova" : origens.join(", ")} ·{" "}
              {formatarData(new Date(detalhe.quando))}
            </span>
            {detalhe.esgotouTempo && (
              <span className="badge badge-erro">⏱ tempo esgotado</span>
            )}
          </div>
          <p style={{ fontSize: "2rem", margin: 0 }} className="mono">
            {placar.acertos}/{denominadorPrincipal}{" "}
            <span className="texto-fraco" style={{ fontSize: "1.1rem" }}>
              ({formatarPercentual(percentualPrincipal)})
            </span>
          </p>
          <p className="texto-pequeno texto-fraco">
            Em branco {placar.emBranco} · Tempo {mmss(placar.tempoTotal)} · Corte da prova real:
            720/1000 — acima, a taxa bruta de acertos (sem conversão)
          </p>
        </section>

        {porDominio.length >= 2 && (
          <section className="painel pilha">
            <div className="painel-titulo">
              <h2>Desempenho por domínio</h2>
            </div>
            {porDominio
              .sort((a, b) => a.chave.localeCompare(b.chave))
              .map(({ chave, acertos, total }) => {
                const peso = PESOS[Number(chave)];
                return (
                  <div key={chave} className="linha">
                    <span className="mono texto-pequeno" style={{ width: "9rem" }}>
                      {/^\d+$/.test(chave) ? `Domínio ${chave}` : "Sem domínio"}
                    </span>
                    <span className="texto-pequeno texto-fraco" style={{ width: "4.5rem" }}>
                      {peso ? `peso ${peso}%` : "—"}
                    </span>
                    <Barra fracao={total > 0 ? acertos / total : 0} />
                    <span className="mono texto-pequeno" style={{ width: "5rem", textAlign: "right" }}>
                      {acertos}/{total}
                    </span>
                  </div>
                );
              })}
          </section>
        )}

        <section className="painel pilha">
          <div className="painel-titulo">
            <h2>Desempenho por nível cognitivo (Bloom) e dificuldade</h2>
          </div>
          <div className="pilha">
            {porBloom.map(({ chave, acertos, total }) => (
              <div key={chave} className="linha">
                <span className="texto-pequeno" style={{ width: "9rem" }}>
                  {chave}
                </span>
                <Barra fracao={total > 0 ? acertos / total : 0} />
                <span className="mono texto-pequeno" style={{ width: "4rem", textAlign: "right" }}>
                  {acertos}/{total}
                </span>
              </div>
            ))}
          </div>
          <div className="pilha">
            {porDificuldade.map(({ chave, acertos, total }) => (
              <div key={chave} className="linha">
                <span className="texto-pequeno" style={{ width: "9rem" }}>
                  {chave}
                </span>
                <Barra fracao={total > 0 ? acertos / total : 0} />
                <span className="mono texto-pequeno" style={{ width: "4rem", textAlign: "right" }}>
                  {acertos}/{total}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="painel pilha">
          <div className="painel-titulo">
            <h2>Todas as questões</h2>
          </div>
          <div className="pilha">
            {detalhe.questoes.map((q) => {
              const acertou = q.resposta !== null && q.resposta === q.correta;
              return (
                <div key={q.posicao} className="espaco-entre">
                  <span className="mono texto-pequeno">
                    Q{q.posicao + 1} · {q.origem} Q{q.numero} · {mmss(q.segundos)}
                  </span>
                  {q.resposta === null ? (
                    <span className="badge badge-neutro">não respondida</span>
                  ) : acertou ? (
                    <span className="badge badge-acerto">✓ acerto</span>
                  ) : (
                    <span className="badge badge-erro">
                      ✗ marcou {q.resposta} · correta {q.correta}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {erradas.length === 0 ? (
          <p className="badge badge-acerto" style={{ alignSelf: "flex-start" }}>
            ✓ nenhuma questão respondida está errada
          </p>
        ) : (
          <section className="pilha">
            <h2>Questões erradas</h2>
            {erradas.map((q) => (
              <article key={q.posicao} className="painel pilha">
                <h3 style={{ fontSize: "0.95rem", color: "var(--erro)" }}>
                  Q{q.posicao + 1} · {q.origem} Q{q.numero} · marcou {q.resposta} · correta{" "}
                  {q.correta}
                </h3>
                <p>{q.enunciado}</p>
                <div className="pilha">
                  {(Object.keys(q.alternativas) as Letra[]).map((letra) => {
                    const ehCorreta = letra === q.correta;
                    const ehMarcada = letra === q.resposta;
                    return (
                      <div key={letra}>
                        <p style={{ margin: 0 }}>
                          <strong className="mono">{letra})</strong> {q.alternativas[letra]}
                          {ehCorreta && (
                            <span className="badge badge-acerto" style={{ marginLeft: "0.5em" }}>
                              ← correta
                            </span>
                          )}
                          {ehMarcada && !ehCorreta && (
                            <span className="badge badge-erro" style={{ marginLeft: "0.5em" }}>
                              ← sua resposta
                            </span>
                          )}
                        </p>
                        <p className="texto-pequeno texto-fraco" style={{ marginLeft: "1.3em" }}>
                          {q.explicacoes[letra]}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {q.topicos.length > 0 && (
                  <div className="pilha" style={{ marginTop: "0.5em" }}>
                    <p className="texto-pequeno texto-fraco" style={{ margin: 0 }}>
                      Tópicos relacionados
                    </p>
                    <div className="linha" style={{ flexWrap: "wrap" }}>
                      {q.topicos.map((topico) => (
                        <span key={topico} className="badge badge-neutro">
                          {topico}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(() => {
                  const vistos = new Set<string>();
                  const materiais = q.topicos
                    .map((nome) => topicoPorNome(nome))
                    .filter((t) => t !== undefined)
                    .flatMap((topico) => recursosPorTopico(topico.id))
                    .filter((r) => (vistos.has(r.url) ? false : (vistos.add(r.url), true)));
                  if (materiais.length === 0) return null;
                  return (
                    <div className="pilha" style={{ marginTop: "0.5em" }}>
                      <p className="texto-pequeno texto-fraco" style={{ margin: 0 }}>
                        Material recomendado
                      </p>
                      <div className="pilha">
                        {materiais.map((recurso) => (
                          <a
                            key={recurso.id}
                            href={recurso.url}
                            target="_blank"
                            rel="noreferrer"
                            className="texto-pequeno"
                          >
                            {recurso.tipo === "video" ? "🎥" : "📖"} {recurso.titulo}
                            <span className="badge badge-neutro" style={{ marginLeft: "0.5em" }}>
                              {recurso.oficial ? `Oficial — ${recurso.fonte}` : "Material complementar"}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
