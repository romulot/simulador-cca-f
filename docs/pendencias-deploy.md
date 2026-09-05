# Pendências para publicar (Vercel + Neon)

O código já está pronto e mergeado em `main` (ver `docs/decisoes/persistencia-e-auth.md` para as decisões de arquitetura). O que falta é só provisionamento.

## 1. Neon (banco de dados) — ✅ feito

- [x] Projeto criado: `simulador-cca-f` (id `super-credit-01940521`, org `Romulo Almeida`, região `aws-us-east-2`, Postgres 18).
- [x] Connection string com pooler obtida (branch `production`, database `neondb`, role `neondb_owner`) — guardada fora deste arquivo (repo é público). Está nas env vars da Vercel como `DATABASE_URL`.

## 2. Vercel (hospedagem) — ✅ feito

- [x] Projeto `simulador-cca-f` criado no team `Romulo's projects` (`romulo-teams`).
- [x] Git conectado a `romulot/simulador-cca-f`.

## 3. Variáveis de ambiente na Vercel — ✅ feito

- [x] `DATABASE_URL` e `SESSION_SECRET` configuradas em Production e Preview.

## 4. Deploy e validação

- [ ] Disparar o primeiro deploy de produção (o projeto foi conectado ao Git depois do último push em `main`, então ainda não rodou nenhum build — falta um push novo ou um deploy manual pela dashboard).
- [ ] Na primeira requisição que tocar o banco, o schema é criado sozinho (`CREATE TABLE IF NOT EXISTS`, idempotente) — não precisa rodar migração manual.
- [ ] Abrir a URL pública e validar o fluxo completo:
  - [ ] cadastro de uma conta nova;
  - [ ] login;
  - [ ] praticar um simulado;
  - [ ] modo prova;
  - [ ] histórico mostra as rodadas;
  - [ ] logout;
  - [ ] **isolamento**: criar uma segunda conta e confirmar que ela não vê o histórico da primeira.

## Nota de segurança

A connection string do Neon (com a senha da role `neondb_owner`) e o `SESSION_SECRET` circularam em texto puro numa sessão de chat ao serem gerados/consultados. Nenhum dos dois foi commitado neste repositório. Como boa prática, considere rotacionar a senha da role no Neon (`reset_postgres_role_password` ou pelo console) e atualizar o valor em `DATABASE_URL` na Vercel — não é obrigatório, mas elimina qualquer exposição residual.

## Melhorias que ficaram de fora (não pedidas, vale considerar depois)

- **Rate limiting em `/api/auth/login` e `/api/auth/registro`** — hoje não há proteção contra força bruta.
- Recuperação de senha por email — precisa de um provedor de email (ex. Resend), que o projeto não tem.
- Revogar sessão antes da expiração (30 dias) — a sessão é um cookie assinado sem estado no banco, não dá para invalidar de fora.
