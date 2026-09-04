"use client";

/** Tela de seleção — pares agrupados por domínio, marcação múltipla,
 * pares quebrados aparecem com o motivo mas não são selecionáveis. */
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ParResumo {
  nome: string;
  rotulo: string;
  totalQuestoes: number;
  erro: string | null;
}

interface GrupoResumo {
  grupo: string;
  pares: ParResumo[];
}

export default function Selecao() {
  const router = useRouter();
  const [grupos, setGrupos] = useState<GrupoResumo[] | null>(null);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [iniciando, setIniciando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/catalogo")
      .then((r) => r.json())
      .then((corpo) => setGrupos(corpo.grupos));
  }, []);

  function alternar(nome: string) {
    setSelecionados((atual) => {
      const proximo = new Set(atual);
      if (proximo.has(nome)) proximo.delete(nome);
      else proximo.add(nome);
      return proximo;
    });
  }

  function alternarGrupo(grupo: GrupoResumo) {
    const validos = grupo.pares.filter((p) => p.erro === null).map((p) => p.nome);
    const todosMarcados = validos.every((n) => selecionados.has(n));
    setSelecionados((atual) => {
      const proximo = new Set(atual);
      for (const n of validos) {
        if (todosMarcados) proximo.delete(n);
        else proximo.add(n);
      }
      return proximo;
    });
  }

  const totalQuestoesSelecionadas =
    grupos
      ?.flatMap((g) => g.pares)
      .filter((p) => selecionados.has(p.nome))
      .reduce((acc, p) => acc + p.totalQuestoes, 0) ?? 0;

  async function iniciar() {
    setIniciando(true);
    setErro(null);
    try {
      const resposta = await fetch("/api/rodadas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ modo: "pratica", pares: [...selecionados] }),
      });
      const corpo = await resposta.json();
      if (!resposta.ok) {
        setErro(corpo.erro ?? "não foi possível iniciar a rodada");
        setIniciando(false);
        return;
      }
      router.push(`/rodada/${corpo.rodadaId}`);
    } catch {
      setErro("falha de rede ao iniciar a rodada");
      setIniciando(false);
    }
  }

  return (
    <main className="pagina">
      <div className="envelope">
        <div className="espaco-entre">
          <h1>Praticar</h1>
          <Link href="/" className="botao botao-fantasma">
            ← Menu
          </Link>
        </div>

        {grupos === null && <p className="texto-fraco">Carregando…</p>}

        {grupos?.map((grupo) => {
          const validos = grupo.pares.filter((p) => p.erro === null);
          const todosMarcados =
            validos.length > 0 && validos.every((p) => selecionados.has(p.nome));
          return (
            <section key={grupo.grupo} className="painel">
              <div className="painel-titulo">
                <h2>{grupo.grupo}</h2>
                <button
                  type="button"
                  className="botao botao-fantasma texto-pequeno"
                  onClick={() => alternarGrupo(grupo)}
                  disabled={validos.length === 0}
                >
                  {todosMarcados ? "Desmarcar tudo" : "Marcar tudo"}
                </button>
              </div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }} className="pilha">
                {grupo.pares.map((par) => (
                  <li key={par.nome}>
                    <label
                      className="linha"
                      style={{
                        cursor: par.erro ? "not-allowed" : "pointer",
                        opacity: par.erro ? 0.55 : 1,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={selecionados.has(par.nome)}
                        disabled={par.erro !== null}
                        onChange={() => alternar(par.nome)}
                      />
                      <span style={{ flex: 1 }}>{par.rotulo}</span>
                      {par.erro ? (
                        <span className="badge badge-erro" title={par.erro}>
                          ✗ indisponível
                        </span>
                      ) : (
                        <span className="texto-pequeno texto-fraco mono">
                          {par.totalQuestoes}Q
                        </span>
                      )}
                    </label>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <div className="painel espaco-entre" style={{ position: "sticky", bottom: "1rem" }}>
          <span className="mono">
            {selecionados.size} simulados selecionados · {totalQuestoesSelecionadas} questões
          </span>
          <button
            type="button"
            className="botao botao-primario"
            disabled={selecionados.size === 0 || iniciando}
            onClick={iniciar}
          >
            {iniciando ? "Iniciando…" : "Começar"}
          </button>
        </div>
        {erro && (
          <p role="alert" style={{ color: "var(--erro)" }}>
            {erro}
          </p>
        )}
      </div>
    </main>
  );
}
