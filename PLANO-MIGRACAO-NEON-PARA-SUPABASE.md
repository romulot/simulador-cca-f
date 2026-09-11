# Plano de Migração — Neon PostgreSQL para Supabase PostgreSQL

## Resumo executivo

O projeto é **compatível com pequena alteração/configuração**. Ele usa PostgreSQL convencional por meio de `pg`, sem SDK, driver, API, extensão ou tipo específico do Neon. É possível manter:

- `pg`;
- `DATABASE_URL`;
- autenticação própria;
- hashes bcrypt existentes;
- cookies/sessões existentes, caso usuários e IDs sejam preservados;
- migrations SQL atuais.

Para a aplicação na Vercel, recomenda-se a **Shared Transaction Pooler** do Supabase, porta `6543`, com `sslmode=require`. Para `pg_dump`, `pg_restore` e migrations, deve-se usar conexão **Direct**, porta `5432`, quando o executor alcançar IPv6 (ou o projeto tiver o add-on IPv4); caso contrário, usar a **Shared Session Pooler**, porta `5432`. O Transaction Pooler não deve ser usado para operações administrativas.

Na migração mínima, a única mudança obrigatória na aplicação implantada é o **valor** de `DATABASE_URL`. Não é necessário trocar biblioteca nem autenticação. Há dois hardenings recomendados para uma tarefa posterior: ajustar conscientemente o tamanho do pool por isolate e retirar migrations do caminho de requests.

## Evidências e escopo

### Código inspecionado

- `package.json`
- `src/db/conexao.ts`
- `src/db/migrate.ts`
- `src/db/migrations/001_initial.sql`
- `src/db/migrations/002_password_reset_tokens.sql`
- `src/db/migrations/003_topicos_questoes_rodada.sql`
- `src/db/migrations/004_arquivada_rodadas.sql`
- `src/db/schema.sql`
- repositórios em `src/db/`
- autenticação em `src/lib/auth/`
- rotas em `src/app/api/`
- `README.md`, `vitest.config.mts` e `playwright.config.ts`

### Fontes oficiais atuais

- [Conexões PostgreSQL no Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Pooling e limites no Supabase](https://supabase.com/docs/guides/database/connecting-to-postgres/pooling-and-limits)
- [Migração de PostgreSQL para Supabase](https://supabase.com/docs/guides/platform/migrating-to-supabase/postgres)
- [Prepared statements e Transaction Pooler](https://supabase.com/docs/guides/troubleshooting/disabling-prepared-statements-qL8lEL)
- [Pools em Vercel Functions](https://vercel.com/kb/guide/connection-pooling-with-functions)
- [Gerenciamento de pools com Fluid Compute](https://vercel.com/kb/guide/efficiently-manage-database-connection-pools-with-fluid-compute)
- [Pooling no Neon](https://neon.com/docs/connect/connection-pooling)
- [pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html)

Nenhum banco, conta ou variável real foi acessado. As conclusões sobre infraestrutura são documentais; as conclusões sobre comportamento da aplicação vêm do código.

## 1. Acesso atual ao banco

| Item | Estado atual | Arquivos |
|---|---|---|
| Biblioteca | `pg` `^8.23.0` e `@types/pg` | `package.json` |
| Pool | `new Pool({ connectionString })` | `src/db/conexao.ts` |
| URL | Apenas `process.env.DATABASE_URL` | `src/db/conexao.ts` |
| Reuso | Pool e promessa de migration em `globalThis` | `src/db/conexao.ts` |
| SSL | Delegado à connection string (`sslmode`) | `src/db/conexao.ts` |
| Migration | Executada no primeiro acesso DB de cada isolate | `src/db/conexao.ts`, `src/db/migrate.ts` |
| Transações | `pool.connect()` e mesmo `PoolClient` entre `BEGIN`/`COMMIT`/`ROLLBACK` | repositórios e `migrate.ts` |
| Neon específico | Apenas comentários/README indicando URL `-pooler` | `src/db/conexao.ts`, `README.md` |

Não existem:

- dependências `@neondatabase/*`;
- hostname Neon codificado;
- uso de API/CLI Neon em runtime;
- extensão `neon`;
- SDK do Supabase;
- `LISTEN`/`NOTIFY`, tabelas temporárias, cursor ou estado de sessão;
- prepared statements nomeados (`query({ name: ... })`).

O singleton em `globalThis` funciona somente dentro do mesmo isolate/processo. Em Vercel, cada novo isolate pode criar seu próprio `pg.Pool`.

## 2. Compatibilidade com Supabase

| Recurso | Classificação | Fundamentação |
|---|---|---|
| `pg` / node-postgres | Compatível sem alteração | Supabase expõe PostgreSQL padrão |
| Contrato `DATABASE_URL` | Compatível sem alteração | Somente o valor/host/usuário/porta mudam |
| SSL via URL | Compatível com pequena configuração | Usar `sslmode=require` na URL Supabase |
| `pg.Pool` | Compatível com pequena configuração opcional | Pool global já existe; tamanho e lifecycle merecem hardening serverless |
| Transações | Compatível sem alteração | Cada transação usa um único `PoolClient` |
| `SELECT ... FOR UPDATE` | Compatível sem alteração | PostgreSQL padrão, dentro de transação |
| Prepared statements | Compatível sem alteração | O código não cria statements nomeados; Transaction Pooler não aceita os nomeados |
| Advisory lock | Compatível sem alteração SQL | Usa `pg_advisory_xact_lock`, lock transacional |
| JSON | Compatível sem alteração | Valores JSON estão em `TEXT`, tratados no TypeScript |
| `TIMESTAMPTZ` / `now()` | Compatível sem alteração | Tipos/funções PostgreSQL padrão |
| ISO 8601 em `TEXT` | Compatível sem alteração | Decisão da aplicação, não do provedor |
| Foreign keys/cascades/checks | Compatível sem alteração | Recursos PostgreSQL padrão |
| `INTEGER GENERATED ALWAYS AS IDENTITY` | Compatível sem alteração | Preservar/sincronizar sequences no restore |
| Índices | Compatível sem alteração | B-tree/unique padrão |
| Migrations SQL | Compatível sem alteração | Não usam extensões nem recursos Neon |
| Migration automática em request | Compatível, mas operacionalmente inadequada | Deve ser separada futuramente da URL de runtime/pooler transacional |

**Veredito geral:** compatível com pequena alteração/configuração. A compatibilidade SQL é direta; o cuidado real está no modo de conexão e no cutover dos dados.

## 3. Vercel + Supabase

### Opção recomendada para runtime

**Shared Transaction Pooler — porta 6543.** O próprio Supabase a recomenda para funções serverless/edge, pois conexões curtas e numerosas podem ser multiplexadas. Exemplo fictício:

```text
postgresql://postgres.projeto_exemplo:senha_ficticia@aws-0-regiao.pooler.supabase.com:6543/postgres?sslmode=require
```

O host deve ser copiado do painel; o índice/região não deve ser adivinhado.

### Comparação

| Opção | Uso indicado | Adequação ao projeto |
|---|---|---|
| Direct `5432` | Administração, migrations, dump/restore; backend persistente | Não recomendada para runtime serverless horizontal; pode exigir IPv6 |
| Shared Session Pooler `5432` | Ferramentas/admin via IPv4, prepared/session state | Boa alternativa administrativa; mantém backend reservado por sessão e escala pior no runtime |
| Shared Transaction Pooler `6543` | Serverless e conexões curtas | Recomendada para a aplicação Vercel |

### Transações e prepared statements

As transações atuais são compatíveis porque cada uma reserva um `PoolClient` e executa `BEGIN`, queries e `COMMIT`/`ROLLBACK` na mesma conexão lógica. O código não usa prepared statements nomeados nem depende de estado entre transações.

Mesmo assim, migrations, dump e restore devem usar Direct/Session. O fato de uma DDL eventualmente funcionar pelo Transaction Pooler não a torna uma operação suportada ou prudente.

### Cold starts e limites

- cada isolate pode criar um pool próprio;
- o primeiro acesso também verifica/aplica migrations;
- warm isolates reutilizam seu pool;
- muitos isolates multiplicam conexões do lado da aplicação, mesmo havendo Supavisor;
- a URL transaction evita dedicar um backend permanentemente a cada cliente.

O Supabase orienta pool de uma conexão em funções serverless. A documentação mais recente da Vercel para Fluid Compute recomenda pool global, baixo `idleTimeoutMillis`, `attachDatabasePool` e evitar `max: 1` quando há concorrência no mesmo instance. Como o projeto não possui `@vercel/functions`, não se deve introduzir essa dependência nesta migração sem medição. Decisão recomendada:

1. para o cutover mínimo, conservar o pool atual e usar Transaction Pooler;
2. medir conexões/espera em staging;
3. em tarefa separada, escolher entre `max: 1` ou integração Fluid Compute com base no modo real de execução e concorrência.

## 4. Variáveis de ambiente

| Variável | Classificação | Ação |
|---|---|---|
| `DATABASE_URL` | Permanece; valor muda | Runtime Vercel recebe URL Transaction Pooler com `sslmode=require` |
| `MIGRATION_DATABASE_URL` ou `DB_DIRECT_URL` | Pode ser adicionada futuramente | Útil em CI/operação; não é lida hoje pela aplicação |
| `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` | Não utilizadas | Não adicionar |
| Variáveis Neon específicas | Inexistentes | Nada a remover |
| Variáveis SDK Supabase | Desnecessárias | Não adicionar |
| `SESSION_SECRET` | Permanece | Preservar no cenário A; rotacionar no cenário B |
| `APP_URL` | Permanece | Sem mudança por causa do banco |
| `RESEND_API_KEY`, `EMAIL_FROM` | Permanecem | Sem mudança por causa do banco |

Exemplos fictícios administrativos:

```text
# Direct: IPv6 por padrão, ou IPv4 add-on
postgresql://postgres:senha_ficticia@db.projeto_exemplo.supabase.co:5432/postgres?sslmode=require

# Session Pooler: fallback IPv4 para administração
postgresql://postgres.projeto_exemplo:senha_ficticia@aws-0-regiao.pooler.supabase.com:5432/postgres?sslmode=require
```

Segredos não devem aparecer em comandos literais, logs, documentação ou histórico do shell.

## 5. Schema e migrations

### Ordem canônica

1. `001_initial.sql`: `usuarios`, `rodadas`, `questoes_rodada`, constraints, FKs e índices.
2. `002_password_reset_tokens.sql`: tokens e índice por usuário.
3. `003_topicos_questoes_rodada.sql`: `topicos_json TEXT NOT NULL DEFAULT '[]'`.
4. `004_arquivada_rodadas.sql`: `arquivada BOOLEAN NOT NULL DEFAULT FALSE`.

`src/db/migrate.ts` cria `schema_migrations`, ordena os arquivos pelo nome, usa uma transação por arquivo, adquire `pg_advisory_xact_lock` e registra a versão aplicada.

### Objetos encontrados

- tabelas: `usuarios`, `rodadas`, `questoes_rodada`, `password_reset_tokens`, `schema_migrations`;
- FKs com `ON DELETE CASCADE` entre usuários, rodadas, questões e tokens;
- uniques em email, token e `(rodada_id, posicao)`;
- checks para modo, status, resposta/correta;
- índices por `user_id`, `(rodada_id,posicao)` e tokens por usuário;
- identities/sequences para IDs;
- nenhum `CREATE EXTENSION`.

As migrations podem criar o schema no Supabase **sem alteração SQL**. `src/db/schema.sql` não contém as evoluções 002–004 e não deve ser usado isoladamente como fonte do destino.

## 6. Dados existentes

| Dado | Origem | Reconstruível? | Impacto da perda |
|---|---|---:|---|
| Usuários | Banco | Não | Contas deixam de existir |
| Hashes de senha | Banco (`bcryptjs`) | Não | Senhas não podem ser recuperadas; exigir recadastro/reset |
| Tokens de redefinição | Banco | Não; apenas novos tokens | Links ativos deixam de funcionar |
| Rodadas | Banco | Não | Estado, modo, tempo, índice e composição perdidos |
| Questões das rodadas | Snapshot no banco | Não com fidelidade | Catálogo atual pode divergir do snapshot histórico |
| Respostas/tempos | Banco | Não | Histórico, revisão e métricas são perdidos |
| Histórico | Derivado das rodadas/questões | Sim, somente se a base for migrada | Sem base, desaparece |
| Aprendizado | Derivado das respostas | Sim, somente se respostas forem migradas | Sem respostas, reinicia vazio |
| Catálogo | `content/simulados/**/*.md` | Sim | Continua disponível no deploy |

Sem exportação do Neon, apenas schema e catálogo sobrevivem. Usuários, hashes, IDs, rodadas, snapshots, respostas e progresso serão perdidos.

## 7. Autenticação

A autenticação atual é própria:

- `bcryptjs` para hashes de senha;
- busca do usuário por email no PostgreSQL;
- cookie `simulador_sessao` com payload `{ uid, exp }`;
- assinatura HMAC-SHA256 usando `SESSION_SECRET`;
- cookie `httpOnly`, `sameSite=lax`, `secure` em produção;
- validade de 30 dias;
- nenhuma tabela de sessão e nenhum Supabase Auth.

Para preservar contas e sessões no cenário A:

1. migrar `usuarios.id`, `email`, `senha_hash` e `criado_em` sem re-hash;
2. preservar os IDs usados pelas FKs;
3. conservar exatamente o mesmo `SESSION_SECRET` e domínio/path do cookie;
4. migrar rodadas/questões para manter referências;
5. migrar tokens se for desejado preservar links ainda válidos.

Se o destino começar vazio, deve-se **rotacionar `SESSION_SECRET`** antes do go-live. Cookies antigos continuariam criptograficamente válidos e poderiam apontar para IDs reutilizados por novas contas — um pequeno detalhe com dentes bastante desagradáveis.

## 8. Estratégias de migração

### Cenário A — Neon permite exportação (recomendado)

#### Preparação

- reativar acesso à origem apenas quando autorizado;
- usar URL Neon Direct, sem sufixo `-pooler`;
- confirmar versões dos servidores e usar cliente `pg_dump` da mesma major da origem ou mais novo compatível;
- agendar janela e bloquear escritas antes do dump final;
- usar destino Supabase vazio para full restore.

#### Dump fictício

```bash
export NEON_DIRECT_URL='postgresql://usuario:senha_ficticia@host-neon-exemplo/db?sslmode=require'

pg_dump \
  --dbname="$NEON_DIRECT_URL" \
  --format=custom \
  --no-owner \
  --no-privileges \
  --no-subscriptions \
  --verbose \
  --file=simulador.dump
```

#### Restore fictício

```bash
export SUPABASE_ADMIN_URL='postgresql://usuario:senha_ficticia@host-supabase-exemplo:5432/postgres?sslmode=require'

pg_restore \
  --dbname="$SUPABASE_ADMIN_URL" \
  --no-owner \
  --no-privileges \
  --exit-on-error \
  --verbose \
  simulador.dump
```

Cuidados:

- não migrar roles/owners gerenciados do Neon;
- não alterar schemas internos `auth`, `storage`, `realtime` ou extensões do Supabase;
- não pré-aplicar migrations antes de um full restore, evitando conflitos de objetos;
- full dump deve incluir `schema_migrations`, schema, dados e ajuste das sequences;
- confirmar sequences depois do restore, mesmo que o archive as contenha;
- manter a origem intacta durante a janela de rollback.

Validação de contagens, exemplo:

```sql
SELECT 'usuarios' AS tabela, COUNT(*) FROM usuarios
UNION ALL SELECT 'rodadas', COUNT(*) FROM rodadas
UNION ALL SELECT 'questoes_rodada', COUNT(*) FROM questoes_rodada
UNION ALL SELECT 'password_reset_tokens', COUNT(*) FROM password_reset_tokens;
```

Também validar FKs órfãs, `schema_migrations`, maiores IDs e próximo valor de cada identity/sequence.

### Cenário B — Neon não permite exportação

1. criar destino vazio;
2. aplicar migrations `001`–`004`, em ordem, por Direct/Session `5432`;
3. confirmar tabela `schema_migrations`, constraints e índices;
4. manter o catálogo versionado em `content/simulados/`;
5. aceitar formalmente a perda de usuários, hashes, tokens, rodadas, snapshots, respostas, histórico e aprendizado;
6. rotacionar `SESSION_SECRET` para invalidar cookies antigos;
7. comunicar recadastro e reinício do progresso;
8. manter a origem congelada para possível recuperação posterior.

## 9. Plano passo a passo

### Fase 1 — Criar/configurar projeto Supabase

**Ação:** escolher região próxima à execução Vercel; criar destino vazio; registrar versão PostgreSQL, disponibilidade IPv6, Direct, Session e Transaction URLs em cofre.  
**Arquivos/configurações:** projeto Supabase; nenhum arquivo local nesta fase.  
**Riscos:** latência regional, IPv6 indisponível no executor, destino contaminado.  
**Critério de aceite:** projeto vazio, URLs classificadas por finalidade e credenciais protegidas.  
**NIVEL: ALTO · DOCS: sim · UI: não.**

### Fase 2 — Configurar conexão

**Ação:** reservar Transaction Pooler `6543` para runtime e Direct/Session `5432` para administração; incluir `sslmode=require`. Não alterar Vercel ainda.  
**Arquivos/configurações:** cofre/runbook; futuramente `DATABASE_URL` Vercel.  
**Riscos:** misturar credenciais/portas; adivinhar hostname.  
**Critério de aceite:** cada URL testada de forma controlada e identificada como runtime ou administração.  
**NIVEL: ALTO · DOCS: sim · UI: não.**

### Fase 3 — Criar schema

**Ação:** cenário A: restaurar full dump em destino vazio, sem pré-migrations. Cenário B: aplicar `001`–`004` por conexão administrativa.  
**Arquivos/configurações:** `src/db/migrations/*.sql`, `src/db/migrate.ts`; não usar `schema.sql` isolado.  
**Riscos:** objetos duplicados, ordem incorreta, owners/ACLs.  
**Critério de aceite:** todas as tabelas, versões, constraints e índices equivalentes à origem/código.  
**NIVEL: CRÍTICO · DOCS: sim · UI: não.**

### Fase 4 — Migrar/restaurar dados

**Ação:** cenário A: bloquear writers, gerar dump final Direct e restaurar por Direct/Session. Cenário B: registrar aceite das perdas e iniciar vazio.  
**Arquivos/configurações:** bancos origem/destino e archive temporário protegido.  
**Riscos:** split-brain, restore parcial, sequences incorretas, vazamento do dump.  
**Critério de aceite:** contagens, IDs, hashes, FKs, `schema_migrations` e sequences conferidos.  
**NIVEL: CRÍTICO · DOCS: sim · UI: não.**

### Fase 5 — Configurar ambiente local

**Ação:** manter PostgreSQL local atual para testes; quando autorizado, testar uma URL Supabase apenas em arquivo ignorado/ambiente efêmero. Não commitar credenciais.  
**Arquivos/configurações:** `.env.local` ignorado, `vitest.config.mts`, `playwright.config.ts`; estes dois não precisam mudar para continuar locais.  
**Riscos:** misturar banco de teste e produção; expor segredo.  
**Critério de aceite:** testes locais continuam isolados e nenhum segredo aparece no Git/log.  
**NIVEL: ALTO · DOCS: sim · UI: não.**

### Fase 6 — Testar aplicação localmente/staging

**Ação:** executar migrations em destino descartável e testar login, cadastro, reset, prova, prática, retomada, encerramento, histórico e aprendizado; validar transações/locks.  
**Arquivos/configurações:** suítes existentes e ambiente Supabase não produtivo.  
**Riscos:** testar contra produção; deixar dados artificiais.  
**Critério de aceite:** testes e smoke tests passam sem erro SQL/conexão; isolamento por usuário preservado.  
**NIVEL: CRÍTICO · DOCS: sim · UI: não.**

### Fase 7 — Atualizar Vercel

**Ação:** alterar apenas `DATABASE_URL` para Transaction Pooler nos escopos corretos. Cenário A: conservar `SESSION_SECRET`; cenário B: rotacioná-lo.  
**Arquivos/configurações:** Environment Variables da Vercel.  
**Riscos:** preview/prod cruzados, segredo errado, sessões inválidas.  
**Critério de aceite:** variáveis por ambiente conferidas e nenhuma URL administrativa usada no runtime.  
**NIVEL: CRÍTICO · DOCS: sim · UI: não.**

### Fase 8 — Deploy/cutover

**Ação:** após validação mínima do destino, redeploy/restart para consumir a nova URL; impedir novas escritas na origem; manter plano de rollback.  
**Arquivos/configurações:** deployment Vercel e configuração operacional.  
**Riscos:** escrita simultânea nos dois bancos, cold-start storm, rollback após divergência.  
**Critério de aceite:** aplicação grava somente no Supabase; Neon permanece congelado durante a retenção.  
**NIVEL: CRÍTICO · DOCS: sim · UI: não.**

### Fase 9 — Validação pós-migração

**Ação:** repetir contagens/integridade; testar sessão existente no cenário A; criar e retomar rodada; observar conexões, latência, timeouts, locks e erros na Vercel/Supabase.  
**Arquivos/configurações:** logs Vercel, métricas Supabase, runbook.  
**Riscos:** defeito silencioso de sequence/FK ou saturação do pool.  
**Critério de aceite:** fluxos críticos passam, contagens conferem, inserts geram novos IDs válidos e período de observação termina sem regressão crítica.  
**NIVEL: CRÍTICO · DOCS: sim · UI: não.**

## Dependências e ordem de decisão

```text
Escolher cenário e política de sessão
  → obter URLs e confirmar conectividade administrativa
    → ensaiar schema/dump/restore
      → capturar baseline e bloquear escritas
        → restore produtivo e validação mínima
          → trocar DATABASE_URL e fazer deploy
            → validação, observação e aceite/rollback
```

O rollback é simples apenas antes de haver escritas relevantes no Supabase. Após divergência, trocar a URL de volta não reconcilia dados.

## Alterações obrigatórias e hardenings futuros

### Obrigatórias para a migração

- criar o destino Supabase;
- usar URL administrativa Direct/Session para schema/dados;
- trocar o valor da `DATABASE_URL` da Vercel pela Transaction Pooler;
- garantir `sslmode=require`;
- restaurar dados ou aceitar formalmente as perdas;
- preservar `SESSION_SECRET` no cenário A ou rotacioná-lo no B;
- validar identities/sequences e integridade.

### Não obrigatórias no cutover mínimo

- trocar `pg`;
- instalar SDK Supabase;
- usar Supabase Auth;
- alterar queries/repositórios;
- converter colunas JSON/TEXT;
- adicionar RLS para o acesso server-side atual;
- adicionar uma nova variável ao runtime.

### Hardening posterior recomendado

- retirar `migrar()` do primeiro request e usar uma URL administrativa explícita;
- definir política de `pg.Pool` após medir concorrência/Fluid Compute;
- considerar `attachDatabasePool` somente se a dependência e o ambiente Vercel forem adotados conscientemente;
- atualizar ou gerar novamente `schema.sql` para não divergir das migrations.

## Riscos principais

1. **Perda de identidade e progresso:** sem dump, contas e dados transacionais não são reconstruíveis.
2. **Sessões apontando para IDs reutilizados:** no cenário B, preservar o secret seria inseguro; rotacioná-lo é obrigatório.
3. **URL errada por finalidade:** Transaction Pooler no dump/migration ou Direct no runtime serverless.
4. **Divergência durante cutover:** writes após o snapshot tornam rollback e reconciliação difíceis.
5. **Sequences desalinhadas:** restore pode parecer correto e falhar no primeiro insert.
6. **Multiplicação de pools por isolate:** acompanhar conexões depois do deploy.
7. **Migration em cold start:** permanece um risco operacional conhecido até hardening posterior.

## Critérios finais de sucesso

- aplicação continua usando `pg` e autenticação própria;
- nenhuma dependência Supabase é necessária;
- runtime usa Transaction Pooler com SSL;
- operações administrativas usam Direct/Session;
- migrations `001`–`004` produzem schema equivalente;
- cenário A preserva usuários, hashes, IDs, tokens, rodadas e respostas;
- cenário B invalida cookies antigos e comunica perda/recadastro;
- Vercel grava exclusivamente no Supabase após o cutover;
- rollback permanece disponível durante a janela acordada.

