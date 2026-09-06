"use client";

/** Tela de login — email + senha, reaproveitando `.painel`/`.envelope`/
 * `.botao-primario` e o padrão de erro `role="alert"` já usado no menu e na
 * seleção. `useSearchParams` (para o parâmetro `proximo`, gravado pelo
 * proxy ao redirecionar) exige um limite de Suspense em build de produção. */
import { Suspense, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import CampoSenha from "@/components/CampoSenha";

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
  const erroRef = useRef<HTMLParagraphElement>(null);

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
        setErro(corpo.erro ?? "Não foi possível entrar.");
        setEnviando(false);
        requestAnimationFrame(() => erroRef.current?.focus());
        return;
      }
      router.push(destinoSeguro(searchParams.get("proximo")));
      router.refresh();
    } catch {
      setErro("Falha de rede ao entrar. Verifique sua conexão e tente novamente.");
      setEnviando(false);
      requestAnimationFrame(() => erroRef.current?.focus());
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
              disabled={enviando}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <div className="rotulo-linha">
              <label className="rotulo" htmlFor="senha">Senha</label>
              <Link className="link-secundario" href="/esqueci-senha">Esqueci minha senha</Link>
            </div>
            <CampoSenha id="senha" autoComplete="current-password" value={senha} onChange={setSenha} disabled={enviando} />
          </div>

          {erro && (
            <p ref={erroRef} className="mensagem mensagem-erro" role="alert" tabIndex={-1}>
              {erro}
            </p>
          )}

          <button type="submit" className="botao botao-primario botao-bloco" disabled={enviando}>
            {enviando ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="texto-pequeno texto-fraco">
          Ainda não possui conta? <Link href="/cadastro">Criar conta</Link>
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
