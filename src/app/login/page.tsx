"use client";

/** Tela de login — email + senha, reaproveitando `.painel`/`.envelope`/
 * `.botao-primario` e o padrão de erro `role="alert"` já usado no menu e na
 * seleção. `useSearchParams` (para o parâmetro `proximo`, gravado pelo
 * proxy ao redirecionar) exige um limite de Suspense em build de produção. */
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function destinoSeguro(proximo: string | null): string {
  // Só aceita caminho relativo iniciado por "/" — nunca uma URL absoluta,
  // que poderia redirecionar para fora do próprio app.
  if (proximo && proximo.startsWith("/") && !proximo.startsWith("//")) return proximo;
  return "/";
}

function FormularioLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });
      const corpo = await resposta.json();
      if (!resposta.ok) {
        setErro(corpo.erro ?? "não foi possível entrar");
        setEnviando(false);
        return;
      }
      router.push(destinoSeguro(searchParams.get("proximo")));
      router.refresh();
    } catch {
      setErro("falha de rede ao entrar");
      setEnviando(false);
    }
  }

  return (
    <main className="pagina">
      <div className="envelope">
        <header>
          <h1>Simulador CCA-F</h1>
          <p className="texto-fraco">Entre com sua conta para continuar.</p>
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
              autoComplete="current-password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>

          {erro && (
            <p className="texto-pequeno" style={{ color: "var(--erro)" }} role="alert">
              {erro}
            </p>
          )}

          <button type="submit" className="botao botao-primario botao-bloco" disabled={enviando}>
            {enviando ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="texto-pequeno texto-fraco">
          Ainda não tem conta? <Link href="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="pagina">
          <div className="envelope">
            <p className="texto-fraco">Carregando…</p>
          </div>
        </main>
      }
    >
      <FormularioLogin />
    </Suspense>
  );
}
