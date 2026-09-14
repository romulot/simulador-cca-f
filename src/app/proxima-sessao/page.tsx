"use client";

/** Tela "Próxima sessão" — recomendação adaptativa de que tópicos praticar
 * agora (peso do domínio × cobertura que falta × acurácia como fator
 * secundário, cortada pelo tempo disponível), mais o perfil do candidato
 * (data da prova, minutos por sessão padrão) usado como corte default.
 *
 * A recomendação é um palpite, não uma coleira: o candidato sempre pode
 * praticar qualquer tópico direto de "Meus pontos fracos" ou "Praticar",
 * ignorando esta ordenação. */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { formatarPercentual } from "@/lib/formatacao";

interface ItemRecomendacao {
  topicoId: string;
  nome: string;
  dominio: number;
  score: number;
  vistas: number;
  disponivel: number;
  cobertura: number;
  acuracia: number | null;
}

interface RespostaProximaSessao {
  minutosDisponiveis: number;
  selecionados: ItemRecomendacao[];
  minutosEstimados: number;
  dominiosComCoberturaCompleta: number[];
}

interface Perfil {
  dataProva: string | null;
  minutosSessaoPadrao: number | null;
}

function diasAte(dataIso: string): number {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const alvo = new Date(`${dataIso}T00:00:00`);
  return Math.round((alvo.getTime() - hoje.getTime()) / (24 * 60 * 60 * 1000));
}

export default function ProximaSessao() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [minutosCampo, setMinutosCampo] = useState("");
  const [dataProvaCampo, setDataProvaCampo] = useState("");
  const [salvandoPerfil, setSalvandoPerfil] = useState(false);

  const [sessao, setSessao] = useState<RespostaProximaSessao | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(false);
  const [praticando, setPraticando] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function carregarSessao(minutos?: number) {
    setCarregandoSessao(true);
    setErro(null);
    try {
      const query = minutos !== undefined ? `?minutos=${minutos}` : "";
      const resposta = await fetch(`/api/aprendizado/proxima-sessao${query}`);
      const corpo = await resposta.json();
      if (!resposta.ok) {
        setErro(corpo.erro ?? "não foi possível montar a próxima sessão");
        return;
      }
      setSessao(corpo);
    } catch {
      setErro("falha de rede ao montar a próxima sessão");
    } finally {
      setCarregandoSessao(false);
    }
  }

  useEffect(() => {
    fetch("/api/perfil")
      .then((r) => r.json())
      .then((corpo: Perfil) => {
        setPerfil(corpo);
        setMinutosCampo(corpo.minutosSessaoPadrao ? String(corpo.minutosSessaoPadrao) : "");
        setDataProvaCampo(corpo.dataProva ?? "");
      });
    carregarSessao();
  }, []);

  async function salvarPerfil(e: React.FormEvent) {
    e.preventDefault();
    setSalvandoPerfil(true);
    try {
      const resposta = await fetch("/api/perfil", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          dataProva: dataProvaCampo || null,
          minutosSessaoPadrao: minutosCampo ? Number(minutosCampo) : null,
        }),
      });
      const corpo = await resposta.json();
      if (resposta.ok) {
        setPerfil(corpo);
        await carregarSessao();
      }
    } finally {
      setSalvandoPerfil(false);
    }
  }

  async function praticarTopico(topicoId: string) {
    setPraticando(topicoId);
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
        setPraticando(null);
        return;
      }
      router.push(`/rodada/${corpo.rodadaId}`);
    } catch {
      setErro("falha de rede ao iniciar a prática");
      setPraticando(null);
    }
  }

  const restantes = perfil?.dataProva ? diasAte(perfil.dataProva) : null;

  return (
    <main className="pagina">
      <div className="envelope pilha">
        <div className="espaco-entre">
          <h1>Próxima sessão</h1>
          <Link href="/" className="botao botao-fantasma">
            ← Menu
          </Link>
        </div>

        <section className="painel pilha" aria-labelledby="perfil-titulo">
          <div className="painel-titulo">
            <h2 id="perfil-titulo">Meu perfil</h2>
          </div>
          <form className="pilha" onSubmit={salvarPerfil}>
            <div>
              <label className="rotulo" htmlFor="data-prova">
                Data da prova
              </label>
              <input
                id="data-prova"
                type="date"
                value={dataProvaCampo}
                onChange={(e) => setDataProvaCampo(e.target.value)}
                className="campo"
              />
            </div>
            <div>
              <label className="rotulo" htmlFor="minutos-sessao">
                Minutos por sessão (padrão)
              </label>
              <input
                id="minutos-sessao"
                type="number"
                min={1}
                value={minutosCampo}
                onChange={(e) => setMinutosCampo(e.target.value)}
                className="campo"
                placeholder="30"
              />
            </div>
            <button type="submit" className="botao botao-primario" disabled={salvandoPerfil}>
              {salvandoPerfil ? "Salvando…" : "Salvar perfil"}
            </button>
            {restantes !== null && (
              <p className="texto-pequeno texto-fraco" role="status">
                {restantes >= 0
                  ? `Faltam ${restantes} dia(s) para a prova.`
                  : `A data informada já passou (${Math.abs(restantes)} dia(s) atrás) — atualize se ainda não fez a prova.`}
              </p>
            )}
          </form>
        </section>

        <section className="painel pilha" aria-labelledby="sessao-titulo">
          <div className="painel-titulo">
            <h2 id="sessao-titulo">O que praticar agora</h2>
          </div>

          <div className="linha">
            {[15, 30, 60].map((min) => (
              <button
                key={min}
                type="button"
                className="botao botao-fantasma"
                disabled={carregandoSessao}
                onClick={() => carregarSessao(min)}
              >
                {min} min
              </button>
            ))}
          </div>

          {carregandoSessao && <p className="texto-fraco">Calculando…</p>}

          {sessao && !carregandoSessao && (
            <>
              <p className="texto-pequeno texto-fraco">
                Orçamento: {sessao.minutosDisponiveis} min · estimado {sessao.minutosEstimados} min ·
                ordenado por peso do domínio × cobertura que falta
              </p>

              {sessao.dominiosComCoberturaCompleta.length > 0 && (
                <p className="texto-pequeno" role="status">
                  ✓ Domínio(s) {sessao.dominiosComCoberturaCompleta.join(", ")} com cobertura
                  completa — considere o <strong>modo prova</strong> para medir sem o viés de saber
                  o tópico.
                </p>
              )}

              {sessao.selecionados.length === 0 ? (
                <p className="texto-fraco">
                  Nenhuma questão disponível no corpus para recomendar uma sessão agora.
                </p>
              ) : (
                <div className="pilha">
                  {sessao.selecionados.map((item) => (
                    <div key={item.topicoId} className="espaco-entre">
                      <span>
                        {item.nome}{" "}
                        <span className="texto-pequeno texto-fraco">
                          (Domínio {item.dominio} · {item.vistas}/{item.disponivel} vistas
                          {item.acuracia !== null ? ` · ${formatarPercentual(item.acuracia)}` : ""})
                        </span>
                        {item.vistas === 0 && (
                          <span className="badge badge-erro" style={{ marginLeft: "0.5em" }}>
                            cobertura zero
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        className="botao botao-primario"
                        disabled={praticando !== null}
                        onClick={() => praticarTopico(item.topicoId)}
                      >
                        {praticando === item.topicoId ? "Preparando…" : "Praticar"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {erro && (
            <p className="texto-pequeno" style={{ color: "var(--erro)" }} role="alert">
              {erro}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
