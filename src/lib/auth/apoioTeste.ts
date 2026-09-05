/** Apoio de teste: monta o cabeçalho `Cookie` de uma sessão válida, sem
 * passar pelas rotas de `/api/auth/*` — usado pelos testes de rota que só
 * precisam de "estar logado como X", não de exercitar o próprio login. */
import { criarValorCookieSessao, NOME_COOKIE_SESSAO } from "./sessao";

export function cookieSessaoTeste(userId: number): string {
  return `${NOME_COOKIE_SESSAO}=${criarValorCookieSessao(userId)}`;
}
