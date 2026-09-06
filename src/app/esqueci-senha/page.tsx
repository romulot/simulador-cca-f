"use client";

import Link from "next/link";
import { useState } from "react";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      const resposta = await fetch("/api/auth/esqueci-senha", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const corpo = await resposta.json();
      if (!resposta.ok) setErro(corpo.erro ?? "Não foi possível enviar as instruções.");
      else setMensagem(corpo.mensagem);
    } catch {
      setErro("Falha de rede. Verifique sua conexão e tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return <main className="pagina"><div className="envelope envelope-auth">
    <header><p className="sobretitulo">Acesso à conta</p><h1>Recuperar senha</h1><p className="texto-fraco">Informe o e-mail associado à sua conta.</p></header>
    <form className="painel pilha" onSubmit={enviar}>
      <div><label className="rotulo" htmlFor="email">E-mail</label><input id="email" type="email" className="campo" autoComplete="email" required disabled={enviando || Boolean(mensagem)} value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      {erro && <p className="mensagem mensagem-erro" role="alert">{erro}</p>}
      {mensagem && <p className="mensagem mensagem-sucesso" role="status">{mensagem}</p>}
      {!mensagem && <button className="botao botao-primario botao-bloco" disabled={enviando}>{enviando ? "Enviando…" : "Enviar link"}</button>}
    </form>
    <p className="texto-pequeno texto-fraco"><Link href="/login">Voltar para o login</Link></p>
  </div></main>;
}
