"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import CampoSenha from "@/components/CampoSenha";

const SENHA_MINIMA = 8;

function FormularioRedefinicao() {
  const token = useSearchParams().get("token") ?? "";
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    if (senha !== confirmacao) return setErro("As senhas não coincidem.");
    setEnviando(true); setErro(null);
    try {
      const resposta = await fetch("/api/auth/redefinir-senha", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, senha }) });
      const corpo = await resposta.json();
      if (!resposta.ok) setErro(corpo.erro ?? "Não foi possível alterar a senha.");
      else setSucesso(true);
    } catch { setErro("Falha de rede. Verifique sua conexão e tente novamente."); }
    finally { setEnviando(false); }
  }

  return <main className="pagina"><div className="envelope envelope-auth">
    <header><p className="sobretitulo">Acesso à conta</p><h1>Definir nova senha</h1><p className="texto-fraco">Use pelo menos oito caracteres. Frases-senha são bem-vindas.</p></header>
    {sucesso ? <div className="painel pilha"><p className="mensagem mensagem-sucesso" role="status">Senha alterada com sucesso. Você já pode entrar com sua nova senha.</p><Link className="botao botao-primario botao-bloco" href="/login">Ir para o login</Link></div> :
    <form className="painel pilha" onSubmit={enviar}>
      {!token && <p className="mensagem mensagem-erro" role="alert">O link de redefinição está incompleto.</p>}
      <div><label className="rotulo" htmlFor="nova-senha">Nova senha</label><CampoSenha id="nova-senha" autoComplete="new-password" minLength={SENHA_MINIMA} value={senha} onChange={setSenha} disabled={enviando} /></div>
      <div><label className="rotulo" htmlFor="confirmar-senha">Confirmar senha</label><CampoSenha id="confirmar-senha" autoComplete="new-password" minLength={SENHA_MINIMA} value={confirmacao} onChange={setConfirmacao} disabled={enviando} /></div>
      {erro && <p className="mensagem mensagem-erro" role="alert">{erro}</p>}
      <button className="botao botao-primario botao-bloco" disabled={enviando || !token}>{enviando ? "Alterando…" : "Alterar senha"}</button>
    </form>}
  </div></main>;
}

export default function RedefinirSenhaPage() {
  return <Suspense fallback={<main className="pagina"><p className="texto-fraco">Carregando…</p></main>}><FormularioRedefinicao /></Suspense>;
}
