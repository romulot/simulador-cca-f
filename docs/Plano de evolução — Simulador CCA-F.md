# Plano de evolução — Simulador CCA-F

## 1. Objetivo

Evoluir o projeto `simulador-cca-f` em quatro frentes principais:

1. corrigir problemas técnicos atuais;
2. melhorar a experiência de autenticação;
3. aumentar segurança e confiabilidade;
4. preparar o projeto para crescer sem exigir refatorações grandes no futuro.

A arquitetura atual deve ser preservada sempre que possível.

---

# 2. Princípios da implementação

Durante esta evolução, manter:

- regras de negócio dentro de `src/domain`;
- acesso ao banco encapsulado em `src/db`;
- APIs responsáveis por autenticação, autorização e orquestração;
- componentes React sem lógica de negócio desnecessária;
- isolamento obrigatório dos dados por `user_id`;
- testes determinísticos;
- estado das rodadas serializável;
- snapshot das questões no histórico.

Evitar neste momento:

- Prisma;
- Redux;
- Zustand para regras de domínio;
- Redis sem necessidade concreta;
- microserviços;
- refatoração arquitetural ampla.

---

# 3. Fase 1 — Correções técnicas imediatas

## Prioridade

P0

## Objetivo

Eliminar inconsistências atuais no projeto antes de adicionar novas funcionalidades.

---

## 3.1 Corrigir o lint

### Problema

O projeto usa Next.js 16, mas o `package.json` ainda possui:

```json
"lint": "next lint"
```

Esse comando não deve mais ser utilizado.

### Implementação

Alterar para:

```json
"lint": "eslint .",
"lint:fix": "eslint . --fix"
```

Criar ou revisar:

```text
eslint.config.mjs
```

### Validação

Executar:

```bash
yarn lint
```

Resultado esperado:

```text
0 erros
```

---

## 3.2 Adicionar typecheck explícito

Adicionar ao `package.json`:

```json
"typecheck": "tsc --noEmit"
```

### Validação

```bash
yarn typecheck
```

Deve finalizar sem erros.

---

## 3.3 Atualizar README

### Problema

A documentação ainda descreve uma arquitetura antiga, baseada em:

- aplicação local;
- ausência de login;
- persistência local/Docker.

A implementação atual já possui:

- autenticação;
- usuários;
- PostgreSQL;
- Neon;
- deploy web.

### Atualizar documentação com

```text
Visão geral
Stack
Arquitetura
Autenticação
Banco de dados
Variáveis de ambiente
Execução local
Testes
Deploy
```

### Variáveis documentadas

Exemplo:

```env
DATABASE_URL=
SESSION_SECRET=
```

Posteriormente:

```env
RESEND_API_KEY=
APP_URL=
EMAIL_FROM=
```

---

# 4. Fase 2 — Melhorias da tela de login

## Prioridade

P1

## Objetivo

Melhorar usabilidade, acessibilidade e percepção de qualidade.

---

## 4.1 Mostrar e ocultar senha

Adicionar botão de olho dentro ou ao lado do campo de senha.

### Comportamento

Estado inicial:

```text
•••••••• 👁
```

Ao clicar:

```text
minhasenha 🙈
```

O botão deve:

```tsx
type="button"
```

e possuir:

```tsx
aria-label="Mostrar senha"
```

ou:

```tsx
aria-label="Ocultar senha"
```

### Critérios de aceite

- não submete o formulário;
- funciona via teclado;
- possui `aria-label`;
- mantém o valor digitado;
- não altera a senha;
- funciona em desktop e mobile.

---

# 4.2 Configurar autocomplete

No e-mail:

```tsx
autoComplete="email"
```

Na senha:

```tsx
autoComplete="current-password"
```

Na criação de senha:

```tsx
autoComplete="new-password"
```

---

# 4.3 Estado de carregamento

Ao clicar em:

```text
Entrar
```

alterar temporariamente para:

```text
Entrando...
```

Durante a requisição:

- desabilitar botão;
- impedir submissão duplicada;
- manter campos visíveis;
- exibir erro se ocorrer falha.

---

# 4.4 Melhor tratamento visual de erro

Backend deve continuar utilizando mensagem genérica:

```text
E-mail ou senha inválidos.
```

Não revelar se:

- e-mail existe;
- usuário existe;
- senha está errada.

Na interface:

- destacar erro de maneira clara;
- não limpar automaticamente o e-mail;
- preferencialmente manter a senha para permitir correção do usuário;
- mover foco ou anunciar o erro para leitores de tela.

---

# 4.5 Link de recuperação de senha

Adicionar próximo ao campo de senha:

```text
Esqueci minha senha
```

Destino:

```text
/esqueci-senha
```

---

# 4.6 Link para cadastro

Caso cadastro continue aberto:

```text
Ainda não possui conta? Criar conta
```

Evitar competir visualmente com o botão principal de login.

---

# 5. Fase 3 — Recuperação de senha

## Prioridade

P1 alta

## Objetivo

Permitir recuperação segura da conta sem intervenção manual no banco.

---

# 5.1 Fluxo completo

```text
Login
  ↓
Esqueci minha senha
  ↓
Usuário informa e-mail
  ↓
API gera token seguro
  ↓
Sistema envia link por e-mail
  ↓
Usuário acessa link
  ↓
Nova senha
  ↓
Confirmação
  ↓
Token invalidado
  ↓
Login
```

---

# 5.2 Nova página

Criar:

```text
/esqueci-senha
```

Conteúdo:

```text
Recuperar senha

Informe o e-mail associado à sua conta.

[E-mail]

[Enviar link]
```

---

# 5.3 Não revelar existência da conta

Após submissão, sempre retornar algo como:

```text
Se existir uma conta associada a este e-mail,
enviaremos as instruções para redefinir a senha.
```

Essa resposta deve ser usada tanto para:

```text
e-mail existente
```

quanto:

```text
e-mail inexistente
```

Isso reduz enumeração de usuários.

---

# 5.4 Criar tabela de tokens

Adicionar migration para:

```sql
password_reset_tokens
```

Estrutura sugerida:

```sql
id
user_id
token_hash
expires_at
used_at
created_at
```

Com relacionamento:

```text
user_id → usuarios.id
```

---

# 5.5 Não armazenar token puro

Gerar token criptograficamente seguro.

Exemplo conceitual:

```text
token original:
x9AmK2...

token enviado ao usuário:
x9AmK2...

banco:
SHA-256(x9AmK2...)
```

A API deve comparar o hash recebido com o hash armazenado.

---

# 5.6 Expiração do token

Sugestão:

```text
30 minutos
```

O token deve ser considerado inválido quando:

```text
expires_at < agora
```

---

# 5.7 Token de uso único

Após troca da senha:

```text
used_at = NOW()
```

Tokens usados não poderão ser reutilizados.

Também pode ser considerada a exclusão dos tokens antigos do usuário.

---

# 5.8 Nova página de senha

Criar:

```text
/redefinir-senha?token=...
```

Tela:

```text
Nova senha
[•••••••• 👁]

Confirmar senha
[•••••••• 👁]

[Alterar senha]
```

---

# 5.9 Requisitos de senha

Evitar regras excessivamente complexas.

Requisito inicial:

```text
mínimo de 8 caracteres
```

Preferencialmente permitir senhas longas e frases-senha.

---

# 5.10 Confirmação de senha

Antes do envio:

```text
senha === confirmarSenha
```

Caso contrário:

```text
As senhas não coincidem.
```

---

# 5.11 Após troca da senha

Exibir:

```text
Senha alterada com sucesso.
Você já pode entrar com sua nova senha.
```

Depois:

```text
redirecionar → /login
```

---

# 6. Fase 4 — Serviço de e-mail

## Prioridade

P1

## Objetivo

Permitir envio de recuperação de senha sem acoplamento direto ao provedor.

---

# 6.1 Criar camada de e-mail

Estrutura sugerida:

```text
src/
  lib/
    email/
      enviarResetSenha.ts
```

A API não deve chamar diretamente o SDK do provedor em diversos locais.

---

# 6.2 Provedor inicial

Sugestão:

```text
Resend
```

Alternativas futuras:

```text
Brevo
Postmark
Amazon SES
```

---

# 6.3 Variáveis de ambiente

Adicionar:

```env
RESEND_API_KEY=
EMAIL_FROM=
APP_URL=
```

Exemplo de URL gerada:

```text
${APP_URL}/redefinir-senha?token=...
```

Nunca utilizar URL fixa de localhost em produção.

---

# 7. Fase 5 — Segurança da autenticação

## Prioridade

P1

---

# 7.1 Rate limiting

Aplicar principalmente em:

```text
POST /api/auth/login
POST /api/auth/registro
POST /api/auth/esqueci-senha
```

Objetivo:

- reduzir brute force;
- reduzir spam de recuperação;
- evitar abuso automatizado.

---

# 7.2 SESSION_SECRET

Documentar que:

```env
SESSION_SECRET
```

deve ser:

- longo;
- aleatório;
- secreto;
- diferente por ambiente;
- armazenado somente como variável de ambiente.

Nunca versionar no Git.

---

# 7.3 Sessões

A implementação atual de cookies assinados pode ser mantida.

Entretanto documentar que:

```text
sessões emitidas permanecem válidas até expirar
```

salvo mudança global do segredo.

---

# 7.4 Evolução futura de sessão

Não implementar agora, a menos que surjam requisitos como:

```text
Sair de todos os dispositivos
Bloquear usuário
Trocar senha e revogar sessões
Listar dispositivos conectados
```

Quando necessário, avaliar:

```text
session_version
```

ou sessões persistidas no banco.

---

# 8. Fase 6 — Cadastro

## Prioridade

P2

---

# 8.1 Mostrar senha

Adicionar o mesmo comportamento do login.

---

# 8.2 Confirmar senha

Campos:

```text
Senha
Confirmar senha
```

Não permitir envio enquanto forem diferentes.

---

# 8.3 Indicador simples de requisito

Exemplo:

```text
✓ Pelo menos 8 caracteres
```

Evitar medidores de “força” excessivamente complexos sem necessidade.

---

# 9. Fase 7 — Migrações versionadas

## Prioridade

P1

## Problema atual

O projeto utiliza um `schema.sql` executado como estrutura principal.

Isso funciona para criação inicial, porém dificulta alterações incrementais.

---

# 9.1 Estrutura sugerida

```text
src/db/migrations/
  001_initial.sql
  002_password_reset_tokens.sql
  003_...
```

---

# 9.2 Controle de migrations

Criar tabela:

```sql
schema_migrations
```

Exemplo:

```text
version
executed_at
```

---

# 9.3 Funcionamento

Ao inicializar:

```text
001 executada? → sim
002 executada? → não
```

Executar somente:

```text
002
```

Depois registrar.

---

# 10. Fase 8 — Testes

## Prioridade

P1

---

# 10.1 Login

Testar:

```text
login válido
senha inválida
usuário inexistente
body inválido
sessão criada
```

---

# 10.2 Recuperação de senha

Testar:

```text
e-mail existente
e-mail inexistente
token válido
token inválido
token expirado
token já utilizado
senhas diferentes
senha abaixo do mínimo
```

---

# 10.3 Segurança entre usuários

Cenário obrigatório:

```text
Usuário A cria rodada.
Usuário B tenta acessar.
```

Resultado esperado:

```text
acesso negado
```

Repetir para:

```text
GET
UPDATE
FINALIZAÇÃO
HISTÓRICO
```

---

# 10.4 Mostrar senha

Teste de UI:

```text
senha começa oculta
clicar no olho → senha visível
clicar novamente → senha oculta
```

---

# 11. Fase 9 — CI

## Prioridade

P1 alta

Criar:

```text
.github/workflows/ci.yml
```

---

## Pipeline

Executar:

```bash
yarn install --immutable
yarn lint
yarn typecheck
yarn test
yarn build
```

E, quando ambiente apropriado estiver disponível:

```bash
yarn test:e2e
```

---

## Política

Pull Request só deve ser considerado saudável quando:

```text
lint ✓
typecheck ✓
tests ✓
build ✓
```

---

# 12. Fase 10 — Logging e observabilidade

## Prioridade

P2

Adicionar logging estruturado no backend.

Registrar:

```text
rota
status
userId
rodadaId
latência
tipo do erro
```

Nunca registrar:

```text
senha
token de reset
SESSION_SECRET
cookie de sessão
DATABASE_URL completa
```

---

# 13. Ordem recomendada de implementação

## Etapa A — Base

```text
1. Corrigir lint
2. Criar typecheck
3. Atualizar README
4. Criar CI
```

---

## Etapa B — Login

```text
5. Mostrar/ocultar senha
6. Autocomplete
7. Loading
8. Tratamento visual de erros
9. Link "Esqueci minha senha"
```

---

## Etapa C — Recuperação

```text
10. Criar migrations versionadas
11. Criar password_reset_tokens
12. Criar API de solicitação
13. Criar serviço de e-mail
14. Criar /esqueci-senha
15. Criar /redefinir-senha
16. Alterar senha
17. Invalidar token
```

---

## Etapa D — Segurança

```text
18. Rate limiting
19. Testes de autorização por usuário
20. Testes de recuperação de senha
```

---

## Etapa E — Acabamento

```text
21. Melhorar cadastro
22. Logging estruturado
23. Revisar UX responsiva
24. Revisar acessibilidade
```

---

# 14. Critérios de conclusão

A implementação será considerada concluída quando:

- `yarn lint` funcionar;
- `yarn typecheck` passar;
- testes unitários passarem;
- build de produção funcionar;
- login permitir mostrar/ocultar senha;
- login possuir estado de carregamento;
- recuperação de senha funcionar por e-mail;
- token possuir expiração;
- token só puder ser utilizado uma vez;
- tokens não forem armazenados em texto puro;
- APIs não revelarem existência do usuário;
- dados continuarem isolados por `user_id`;
- CI validar Pull Requests;
- README refletir a arquitetura atual;
- nenhuma credencial ou segredo estiver versionado.

---

# 15. Prioridades finais

## P0

```text
Corrigir lint
Atualizar README
```

## P1

```text
CI
Typecheck
Mostrar senha
Recuperação de senha
E-mail
Migrations
Rate limiting
Testes de autorização
```

## P2

```text
Melhorias no cadastro
Logging
Melhorias adicionais de acessibilidade
Gestão avançada de sessão
```

---

# 16. Resultado esperado

Ao final, a arquitetura permanece essencialmente:

```text
                Next.js
                   │
           ┌───────┴────────┐
           │                │
           ▼                ▼
          UI              API
                            │
                ┌───────────┴──────────┐
                ▼                      ▼
              Domain                   DB
                                         │
                                   PostgreSQL
```

Com a camada de autenticação evoluindo para:

```text
Login
  │
  ├── Sessão
  │
  ├── Rate Limit
  │
  └── Recuperação de senha
             │
             ├── Token temporário
             ├── PostgreSQL
             └── Serviço de e-mail
```

A intenção é aumentar segurança e maturidade sem transformar um projeto simples e bem estruturado em uma arquitetura desnecessariamente complexa.