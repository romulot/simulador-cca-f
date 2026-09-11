# Decisões — persistência (Supabase Postgres) e autenticação

Atualizado após a migração do banco para Supabase Postgres.

## Driver Postgres: `pg` (node-postgres)

`pg` é compatível com o protocolo de fio do Postgres: funciona contra o
Postgres local usado em dev/test e contra o Supabase. Em produção,
`DATABASE_URL` aponta para o **Shared Transaction Pooler** na porta `6543`,
adequado ao runtime serverless. Migrations são executadas fora do runtime por
`npm run db:migrate`, usando exclusivamente `MIGRATION_DATABASE_URL` com
Session Pooler/Direct na porta `5432`.

O runtime apenas cria ou reutiliza seu pool; não consulta `schema_migrations`
nem executa DDL automaticamente.

## Sessão: cookie assinado próprio (sem tabela de sessão, sem Auth.js)

Cookie `simulador_sessao` carrega `{ uid, exp }` codificado em base64url +
assinatura HMAC-SHA256 (chave em `SESSION_SECRET`). Sem estado no banco:
validar a sessão é só verificar a assinatura e a expiração, sem consulta
extra por requisição. `httpOnly`, `secure` em produção, `sameSite=lax`.

Trade-off aceito: não há revogação de sessão antes da expiração (sem
"deslogar em todos os dispositivos"). Não pedido; documentado como
limitação, não implementado por suposição.

## Hash de senha: `bcryptjs`

Puro JS, sem binário nativo — evita repetir a classe de risco de
compatibilidade de plataforma que `better-sqlite3` já causou neste projeto.

## Proteção de rotas: `src/proxy.ts`, não `src/middleware.ts`

Esta versão do Next.js (16) renomeou `middleware` para `proxy` —
`middleware.ts` está descontinuado. Ver `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
Proxy roda em runtime Node.js por padrão nesta versão (sem precisar de
configuração extra) e a própria documentação recomenda checar autenticação
também dentro de cada rota, não só no proxy — por isso as 6 rotas de
rodada/histórico continuam validando posse (`user_id`) mesmo com o proxy
bloqueando acesso sem sessão.

## Rota pública: `/api/catalogo`

Só lê conteúdo estático das provas, sem dado de usuário — fica fora da
autenticação (decisão do usuário).

## Fora de escopo (limitação registrada, não implementada)

Recuperação de senha por email: não há provedor de email no projeto.
