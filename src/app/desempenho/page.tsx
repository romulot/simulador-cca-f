"use client";

/** Tela "Meus pontos fracos" (Fase 8) — domínios com pelo menos um tópico
 * fraco (§11.2: mínimo de respostas + abaixo do limiar de atenção),
 * listando os tópicos abaixo do limiar e um atalho para praticar cada um
 * (Fase 9, via `POST /api/rodadas` com `topicoId`). */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Barra } from "@/components/Barra";
import { formatarPercentual } from "@/lib/formatacao";

interface TopicoFraco {
  topicoId: string;
  nome: string;
  acertos: number;
  erros: number;
  totalRespondido: number;
  percentual: number;
}

interface DominioResumo {
  dominio: number;
  percentual: number;
  totalRespondido: number;
  topicosFracos: TopicoFraco[];
}

export default function MeusPontosFracos() {
  const router = useRouter();
  const [dominios, setDominios] = useState<DominioResumo[] | null>(null);
  const [estudando, setEstudando] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/aprendizado/resumo")
      .then((r) => r.json())
      .then((corpo) => setDominios(corpo.dominios));
  }, []);

  async function estudar(topicoId: string) {
    setEstudando(topicoId);
    setErro(null);
    try {
      const resposta = await fetch("/api/rodadas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ modo: "pratica", topicoId }),
      });
      const corpo = await resposta.json();
      if (!resposta.ok) {
        setErro(corpo.erro ?? "não foi possível iniciar a prática");
        setEstudando(null);
        return;
      }
      router.push(`/rodada/${corpo.rodadaId}`);
    } catch {
      setErro("falha de rede ao iniciar a prática");
      setEstudando(null);
    }
  }

  return (
    <main className="pagina">
      <div className="envelope">
        <div className="espaco-entre">
          <h1>Meus pontos fracos</h1>
          <Link href="/" className="botao botao-fantasma">
            ← Menu
          </Link>
        </div>

        {dominios === null && <p className="texto-fraco">Carregando…</p>}
        {dominios?.length === 0 && (
          <p className="texto-fraco">
            Sem pontos fracos identificados ainda. Um tópico só entra aqui depois de pelo menos 3
            respostas nele, com menos de 70% de acerto.
          </p>
        )}

        {dominios?.map((d) => (
          <section key={d.dominio} className="painel pilha">
            <div className="painel-titulo">
              <h2>Domínio {d.dominio}</h2>
              <span className="mono">{formatarPercentual(d.percentual)}</span>
            </div>
            <Barra fracao={d.percentual / 100} />

            <p className="texto-pequeno texto-fraco" style={{ margin: 0 }}>
              Principais dificuldades
            </p>
            <div className="pilha">
              {d.topicosFracos.map((t) => (
                <div key={t.topicoId} className="espaco-entre">
                  <span>
                    {t.nome}{" "}
                    <span className="texto-pequeno texto-fraco">
                      ({t.acertos}/{t.totalRespondido})
                    </span>
                  </span>
                  <div className="linha">
                    <span className="mono">{formatarPercentual(t.percentual)}</span>
                    <button
                      type="button"
                      className="botao botao-primario"
                      disabled={estudando !== null}
                      onClick={() => estudar(t.topicoId)}
                    >
                      {estudando === t.topicoId ? "Preparando…" : "Estudar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {erro && (
          <p className="texto-pequeno" style={{ color: "var(--erro)" }} role="alert">
            {erro}
          </p>
        )}
      </div>
    </main>
  );
}
