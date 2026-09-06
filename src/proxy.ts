/** Proxy (ver `docs/decisoes/persistencia-e-auth.md` — substitui
 * `middleware.ts`, descontinuado nesta versão do Next.js) — bloqueia
 * páginas e rotas de API que exigem sessão.
 *
 * `/api/catalogo` e as rotas `/api/auth/*` ficam públicas por decisão do
 * usuário (catálogo só lê conteúdo estático, sem dado de usuário). Isso NÃO
 * substitui a checagem de posse (`user_id`) dentro de cada rota de
 * rodada/histórico — a própria documentação do Next.js recomenda não
 * confiar só no proxy para autorização.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { obterUsuarioIdDaSessao } from "@/lib/auth/sessao";

const PAGINAS_PUBLICAS = new Set(["/login", "/cadastro", "/esqueci-senha", "/redefinir-senha"]);
const PREFIXOS_API_PUBLICOS = ["/api/auth/", "/api/catalogo"];

function ehPublico(pathname: string): boolean {
  if (PAGINAS_PUBLICAS.has(pathname)) return true;
  return PREFIXOS_API_PUBLICOS.some((prefixo) => pathname.startsWith(prefixo));
}

export function proxy(request: NextRequest): Response {
  const { pathname } = request.nextUrl;
  if (ehPublico(pathname)) return NextResponse.next();

  if (obterUsuarioIdDaSessao(request) !== null) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ erro: "não autenticado" }, { status: 401 });
  }

  const destino = new URL("/login", request.url);
  destino.searchParams.set("proximo", pathname);
  return NextResponse.redirect(destino);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
