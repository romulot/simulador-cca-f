"use client";

/** Tela "Caderno de erros" — erros recorrentes por tópico, quais
 * arquétipos de distrator mais confundem o candidato, e o texto completo
 * das questões aguardando revisão. Tudo derivado ao vivo (nunca editado à
 * mão), no espírito do `caderno-erros.md`/`caderno-mobile` do laboratório
 * de estudos — aqui como leitura sempre atualizada, não um arquivo curado.
 *
 * "Modo véspera" (toggle local, sem chamada de rede): reduz a tela ao que
 * importa na reta final — só recorrência de severidade alta e as 5
 * questões em revisão mais citadas por arquétipo frequente primeiro. */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { TextoMarkdownInline } from "@/components/TextoMarkdownInline";

type Letra = "A" | "B" | "C" | "D";

interface Recorrente {
  topicoId: string;
  nome: string;
  dominio: number;
  erros: number;
  severidade: "recorrente" | "alta";
}

interface ArquetipoFrequente {
  arquetipoId: string;
  nome: string;
  antidoto: string;
  contagem: number;
}

interface QuestaoRevisao {
  origem: string;
  numero: number;
  dominio: number | null;
  enunciado: string;
  alternativas: Record<Letra, string>;
  correta: Letra;
  ultimaResposta: Letra;
  explicacaoErrada: string;
  explicacaoCorreta: string;
  arquetipo: { id: string; nome: string; antidoto: string } | null;
}

interface RespostaCaderno {
  recorrentes: Recorrente[];
  arquetiposFrequentes: ArquetipoFrequente[];
  emRevisao: QuestaoRevisao[];
}

const LIMITE_VESPERA = 5;

export default function CadernoDeErros() {
  const [dados, setDados] = useState<RespostaCaderno | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [modoVespera, setModoVespera] = useState(false);

  useEffect(() => {
    fetch("/api/aprendizado/caderno")
      .then(async (r) => {
        if (!r.ok) {
          const corpo = await r.json();
          setErro(corpo.erro ?? "não foi possível carregar o caderno");
          return;
        }
        setDados(await r.json());
      })
      .catch(() => setErro("falha de rede ao carregar o caderno"));
  }, []);

  const recorrentesVisiveis = useMemo(() => {
    if (!dados) return [];
    return modoVespera ? dados.recorrentes.filter((r) => r.severidade === "alta") : dados.recorrentes;
  }, [dados, modoVespera]);

  const emRevisaoVisiveis = useMemo(() => {
    if (!dados) return [];
    return modoVespera ? dados.emRevisao.slice(0, LIMITE_VESPERA) : dados.emRevisao;
  }, [dados, modoVespera]);

  return (
    <main className="pagina">
      <div className="envelope pilha">
        <div className="espaco-entre">
          <h1>Caderno de erros</h1>
          <Link href="/" className="botao botao-fantasma">
            ← Menu
          </Link>
        </div>

        <div className="espaco-entre">
          <label className="linha" style={{ alignItems: "center" }}>
            <input
              type="checkbox"
              checked={modoVespera}
              onChange={(e) => setModoVespera(e.target.checked)}
            />
            <span className="texto-pequeno">
              Modo véspera — só o essencial (severidade alta, {LIMITE_VESPERA} questões)
            </span>
          </label>
        </div>

        {erro && (
          <p className="texto-pequeno" style={{ color: "var(--erro)" }} role="alert">
            {erro}
          </p>
        )}
        {!dados && !erro && <p className="texto-fraco">Carregando…</p>}

        {dados && dados.recorrentes.length === 0 && dados.emRevisao.length === 0 && (
          <p className="texto-fraco">
            Nenhum erro recorrente nem questão aguardando revisão — caderno limpo por enquanto.
          </p>
        )}

        {recorrentesVisiveis.length > 0 && (
          <section className="painel pilha" aria-labelledby="recorrentes-titulo">
            <div className="painel-titulo">
              <h2 id="recorrentes-titulo">Dificuldade recorrente</h2>
            </div>
            <div className="pilha">
              {recorrentesVisiveis.map((r) => (
                <div key={r.topicoId} className="espaco-entre">
                  <span>
                    {r.nome} <span className="texto-pequeno texto-fraco">(Domínio {r.dominio})</span>
                  </span>
                  <span className={`badge ${r.severidade === "alta" ? "badge-erro" : "badge-neutro"}`}>
                    {r.erros} erros · {r.severidade === "alta" ? "prioridade alta" : "recorrente"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {!modoVespera && dados && dados.arquetiposFrequentes.length > 0 && (
          <section className="painel pilha" aria-labelledby="arquetipos-titulo">
            <div className="painel-titulo">
              <h2 id="arquetipos-titulo">Arquétipos que mais te confundem</h2>
            </div>
            <div className="pilha">
              {dados.arquetiposFrequentes.map((a) => (
                <div key={a.arquetipoId} className="pilha">
                  <div className="espaco-entre">
                    <strong>{a.nome}</strong>
                    <span className="badge badge-neutro">{a.contagem}×</span>
                  </div>
                  <p className="texto-pequeno texto-fraco" style={{ margin: 0 }}>
                    Antídoto: {a.antidoto}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {emRevisaoVisiveis.length > 0 && (
          <section className="pilha">
            <h2>Questões aguardando revisão ({emRevisaoVisiveis.length})</h2>
            {emRevisaoVisiveis.map((q) => (
              <article key={`${q.origem}#${q.numero}`} className="painel pilha">
                <h3 style={{ fontSize: "0.95rem", color: "var(--erro)", margin: 0 }}>
                  {q.origem} Q{q.numero} · marcou {q.ultimaResposta} · correta {q.correta}
                </h3>
                <p><TextoMarkdownInline texto={q.enunciado} /></p>
                <div>
                  <p style={{ margin: 0 }}>
                    <strong className="mono">{q.ultimaResposta})</strong>{" "}
                    <TextoMarkdownInline texto={q.alternativas[q.ultimaResposta]} />
                  </p>
                  <p className="texto-pequeno texto-fraco" style={{ marginLeft: "1.3em" }}>
                    <TextoMarkdownInline texto={q.explicacaoErrada} />
                  </p>
                </div>
                {q.arquetipo && (
                  <p className="texto-pequeno" style={{ margin: 0 }}>
                    <span className="badge badge-neutro">{q.arquetipo.nome}</span>{" "}
                    <span className="texto-fraco">Antídoto: {q.arquetipo.antidoto}</span>
                  </p>
                )}
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
