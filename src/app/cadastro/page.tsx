"use client";

/** Tela de cadastro — email + senha + confirmação, mesmo padrão visual da
 * tela de login (`.painel`/`.envelope`/`.botao-primario`, erro `role="alert"`). */
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SENHA_MINIMA = 8;

export default function CadastroPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      setErro("as senhas não coincidem");
      return;
    }
    if (senha.length < SENHA_MINIMA) {
      setErro(`a senha deve ter pelo menos ${SENHA_MINIMA} caracteres`);
      return;
    }

    setEnviando(true);
    setErro(null);
    try {
      const resposta = await fetch("/api/auth/registro", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const corpo = await resposta.json();
      if (!resposta.ok) {
        setErro(corpo.erro ?? "não foi possível criar a conta");
        setEnviando(false);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setErro("falha de rede ao criar a conta");
      setEnviando(false);
    }
  }

  return (
    <main className="pagina">
      <div className="envelope">
        <header>
          <h1>Simulador CCA-F</h1>
          <p className="texto-fraco">Crie sua conta para praticar e guardar seu histórico.</p>
        </header>

        <form className="painel pilha" onSubmit={enviar}>
          <div>
            <label className="rotulo" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="campo"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="rotulo" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              className="campo"
              autoComplete="new-password"
              minLength={SENHA_MINIMA}
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          <div>
            <label className="rotulo" htmlFor="confirmar-senha">
              Confirmar senha
            </label>
            <input
              id="confirmar-senha"
              type="password"
              className="campo"
              autoComplete="new-password"
              minLength={SENHA_MINIMA}
              required
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>

          {erro && (
            <p className="texto-pequeno" style={{ color: "var(--erro)" }} role="alert">
              {erro}
            </p>
          )}

          <button type="submit" className="botao botao-primario botao-bloco" disabled={enviando}>
            {enviando ? "Criando conta…" : "Criar conta"}
          </button>
        </form>

        <p className="texto-pequeno texto-fraco">
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
      </div>
    </main>
  );
}
