# Decisões — persistência (Neon) e autenticação

Registrado antes da implementação, conforme plano de migração Vercel+Neon+login.

## Driver Postgres: `pg` (node-postgres), não `@neondatabase/serverless`

O driver serverless da Neon (HTTP/WebSocket) evita gerenciar pool manualmente,
mas só fala o protocolo da Neon — não conecta a um Postgres local qualquer,
o que tornaria impossível testar a camada de dados sem uma conta Neon real.

`pg` é 100% compatível com o protocolo de fio do Postgres: funciona igual
contra um Postgres local (usado neste projeto para dev/test) e contra a
Neon. Em produção, `DATABASE_URL` deve apontar para o **endpoint com pooler**
da Neon (host com sufixo `-pooler`) — isso resolve o problema de limite de
conexões simultâneas em função serverless sem trocar de biblioteca.

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
