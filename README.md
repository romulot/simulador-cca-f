# Simulador CCA-F

Simulador de provas para a certificação **Claude Architect Foundation (CCA-F)** — aplicação web com login (email + senha), publicada em **Vercel** com banco de dados **Neon (Postgres)**. Cada conta tem seu próprio histórico de rodadas, isolado das demais.

Migrado de um simulador em TUI (terminal) para uma aplicação web em Next.js, preservando as regras de negócio originais (sorteio ponderado do modo prova, navegação sem wraparound, tempo por questão, dois denominadores de placar) e adicionando relatórios por nível cognitivo (Bloom) e por dificuldade, que a versão em terminal não tinha.

## O que o app faz

- **Cadastro/login**: e-mail + senha, com recuperação por link temporário. Cada conta só enxerga o próprio histórico.
- **Praticar**: escolha um ou mais simulados por domínio e responda no seu ritmo, sem limite de tempo.
- **Modo prova**: 60 questões sorteadas automaticamente respeitando a proporção oficial de peso por domínio (1: 27% · 2: 18% · 3: 20% · 4: 20% · 5: 15%), limite de 2 horas. Se o corpus não tiver questões suficientes num domínio, a prova roda com menos questões — o déficit aparece na composição, nunca é compensado por outro domínio.
- **Resultado**: placar (com os dois jeitos de contar — sobre as questões respondidas e sobre o total), desempenho por domínio, desempenho por nível cognitivo (Bloom) e por dificuldade, revisão completa das questões erradas com explicação de cada alternativa.
- **Histórico**: toda rodada finalizada fica salva (por conta) e pode ser reaberta depois.

O relatório nunca converte a taxa bruta de acerto para a escala oficial da prova (720/1000) — só cita a referência, já que a certificação não publica essa conversão.

## Publicar (Vercel + Neon)

1. Crie um projeto em [neon.tech](https://neon.tech) (free tier) e copie a **connection string com pooler** (host termina em `-pooler`) — é ela que deve virar `DATABASE_URL`, não a conexão direta, para não estourar o limite de conexões simultâneas em função serverless.
2. Importe o repositório em [vercel.com](https://vercel.com) (detecta Next.js automaticamente, sem configuração de build extra).
3. Crie uma chave na Resend e valide o domínio que enviará os e-mails de recuperação.
4. Nas variáveis de ambiente do projeto na Vercel (Production **e** Preview), configure:
   - `DATABASE_URL` — a connection string do passo 1.
   - `SESSION_SECRET` — uma string aleatória longa (ex.: `openssl rand -base64 32`), usada para assinar o cookie de sessão.
   - `APP_URL` — origem pública da aplicação, sem barra final (ex.: `https://simulador.exemplo`).
   - `RESEND_API_KEY` — chave privada da API da Resend.
   - `EMAIL_FROM` — remetente validado (ex.: `Simulador CCA-F <acesso@exemplo.com>`).
5. Faça o deploy. Na primeira requisição que tocar o banco, as migrations pendentes são aplicadas e registradas em `schema_migrations`.
6. Acesse a URL pública, cadastre a primeira conta e valide também a entrega do e-mail de recuperação.

Decisões de arquitetura e trade-offs aceitos (driver Postgres, esquema de sessão, hash de senha, escopo do que ficou de fora) estão em [`docs/decisoes/persistencia-e-auth.md`](docs/decisoes/persistencia-e-auth.md).

### Limitações conhecidas

- **Sem "sair de todos os dispositivos"** — a sessão é um cookie assinado sem estado no banco; ela expira sozinha (30 dias), mas não há como revogá-la antes disso.
- O rate limiting atual é local a cada processo. Ele reduz abuso casual, mas não substitui um limitador distribuído na borda para uma implantação com várias instâncias.
- Planos gratuitos de Vercel e Neon têm limites de uso e comportamento de "dormir" após inatividade (cold start) — não fazem parte deste repositório, consulte a documentação atual de cada provedor antes de decidir se atendem seu uso.

## Adicionar ou editar conteúdo (novos simulados)

O conteúdo mora em `content/simulados/dominio-N/`, um par de arquivos por tópico:

- `{topico}_simulado.md` — enunciado e alternativas.
- `{topico}_gabarito.md` — resposta correta, explicação por alternativa, e um bloco de metadados (Bloom, Dificuldade, Rubrica, Cenário, Princípio testado).

O formato exato está implementado em `src/lib/parser/parser.ts` (o parser rejeita qualquer arquivo fora do contrato, com uma mensagem de erro explicando o motivo). O conteúdo é lido do disco em runtime — um novo deploy (ou restart do processo) já reflete a mudança, sem passo extra.

## Desenvolvimento local

```bash
yarn install
```

O app precisa de um Postgres real (dev e testes usam a mesma infraestrutura — não há mais SQLite). O jeito mais simples é um container descartável, só para desenvolvimento (não faz parte do deploy da aplicação):

```bash
docker run -d --name simulador-pg-dev -e POSTGRES_PASSWORD=simulador -e POSTGRES_DB=simulador -p 5433:5432 postgres:16-alpine
```

Depois:

```bash
export DATABASE_URL="postgres://postgres:simulador@localhost:5433/simulador"
export SESSION_SECRET="qualquer-string-para-desenvolvimento-local"
export APP_URL="http://localhost:3000"
export RESEND_API_KEY="re_..."
export EMAIL_FROM="Simulador CCA-F <acesso@seu-dominio.com>"

yarn dev          # servidor de desenvolvimento em http://localhost:3000
yarn lint         # ESLint (inclui regras recomendadas do Next.js e TypeScript)
yarn typecheck    # verificação explícita de tipos, sem gerar arquivos
yarn test         # testes unitários/integração (Vitest) — usam o mesmo Postgres acima por padrão
yarn test:e2e     # fluxo completo no navegador (Playwright, roda contra build de produção)
yarn build        # build de produção
```

`vitest.config.mts` e `playwright.config.ts` já apontam para `postgres://postgres:simulador@localhost:5433/simulador` por padrão (o mesmo comando acima) — só exporte `DATABASE_URL`/`SESSION_SECRET` manualmente se seu Postgres de teste estiver em outro lugar.

## Estrutura do projeto

```
content/simulados/       conteúdo-fonte (markdown), organizado por domínio
src/lib/parser/           markdown -> Questao[] (com validação de formato)
src/lib/catalogo/         descoberta dos pares simulado/gabarito em disco
src/lib/auth/             hash de senha, sessão (cookie assinado)
src/domain/               regras de negócio puras (sorteio, rodada/sessão)
src/db/                   migrations Postgres, conexão (pool), repositórios
src/proxy.ts              bloqueia páginas/rotas sem sessão válida
src/app/api/              rotas HTTP (auth, criar/navegar/responder/encerrar rodada, histórico, catálogo)
src/app/                  as telas (login, cadastro, menu, seleção, rodada, resultado, histórico)
src/components/           peças de UI reutilizáveis (trilha de progresso, barra, cronômetro)
e2e/                      teste de fluxo completo (Playwright)
```

## Variáveis de ambiente

| Variável | Uso |
|---|---|
| `DATABASE_URL` | Connection string do Postgres (Neon com pooler em produção; Postgres local em dev/test). Obrigatória. |
| `SESSION_SECRET` | Chave usada para assinar o cookie de sessão (HMAC-SHA256). Obrigatória. |
| `APP_URL` | Origem pública usada para montar links de recuperação. Obrigatória para recuperação. |
| `RESEND_API_KEY` | Chave de API para envio dos e-mails. Obrigatória para recuperação. |
| `EMAIL_FROM` | Remetente validado no provedor de e-mail. Obrigatória para recuperação. |

`SESSION_SECRET` deve ser longa, aleatória, exclusiva por ambiente e armazenada somente como segredo da plataforma. Sessões já emitidas permanecem válidas até expirarem (30 dias), salvo troca global desse segredo.

## Testes e integração contínua

O workflow `.github/workflows/ci.yml` executa instalação imutável, lint, typecheck, testes e build em cada pull request e push para `main`, com um Postgres efêmero. O teste E2E permanece separado porque requer um ambiente de navegador apropriado.

## Notas de arquitetura

- O tempo por questão (`segundosGastos`) é medido e reportado pelo **cliente** (não há cronômetro contínuo no servidor entre requisições HTTP). Já se a prova acabou por tempo é sempre recalculado no **servidor**, a partir de quando a rodada começou — o cliente nunca decide isso, e qualquer ação enviada depois do tempo esgotar é rejeitada.
- Estatísticas de rodada (acertos, percentual) nunca são persistidas — são recalculadas na leitura a partir das respostas brutas, pra nunca haver duas fontes de verdade divergentes.
- Cada questão de uma rodada é gravada com o texto completo (não só uma referência) — editar o conteúdo-fonte depois não muda o que uma rodada já feita mostra no histórico.
- Toda rodada pertence a uma conta (`user_id`); todas as rotas de rodada/histórico checam posse antes de ler ou escrever, além da checagem de sessão em `src/proxy.ts` — ver `docs/decisoes/persistencia-e-auth.md`.
