# Progresso — Simulador CCA-F (web)

Status em: 2026-09-04. Repositório: `/home/romulo/Documentos/git/simulador-cca-f/` (git local, ainda não enviado ao GitHub).

Este documento existe para retomar o trabalho depois de uma pausa (ex.: orçamento de sessão esgotado). Descreve o que já está pronto e testado, e a ordem do que falta.

## Contexto do projeto

Migração do simulador de prova em TUI Python (CCA-F — Claude Architect Foundation) para uma aplicação web local: Next.js (App Router, TS) + Yarn Berry + SQLite (`better-sqlite3`) + Docker Compose como forma padrão de execução. Sem login — cada pessoa do time (20 pessoas) roda a própria instância local via Docker.

Plano completo (26 tarefas, 7 fases) foi definido em modo `/crivo --full` (todas as tarefas marcadas `NIVEL: SENSIVEL`, passando por coder → tester → reviewer → security-auditor).

**Decisões fixadas, não reabrir sem motivo:**
- Stack: Next.js + Yarn Berry (`nodeLinker: node-modules`, por causa do driver nativo `better-sqlite3`).
- Persistência: SQLite em arquivo, dentro do container Docker (path configurável via `SIMULADOR_DB_PATH`, default `./data/simulador.db`).
- Docker Compose é o caminho padrão de execução (não opcional) — mas o único pré-requisito no host de quem só usa é Docker + Compose, nada de Node/Yarn local.
- Metadados do gabarito (Bloom, Dificuldade, Rubrica, Cenário, Princípio testado), descartados na TUI original, agora são **capturados** para alimentar relatórios extras.
- Conteúdo markdown-fonte foi **copiado** (não referenciado por caminho externo) para `content/simulados/` dentro deste repo — autossuficiente para ir ao git.
- Autoridade do cronômetro/fim de rodada é sempre do servidor, nunca do relógio do cliente.

## O que já está pronto (testado e commitado)

| # | Tarefa | Onde | Commit |
|---|--------|------|--------|
| 1 | Scaffold Next.js + Yarn Berry + Vitest | raiz do projeto | `49ed08f`, `0aadfcf` |
| 2 | Corpus de simulados copiado (70 arquivos, 240 questões, 5 domínios) | `content/simulados/` | `ffe454b` |
| 3 | Parser markdown→TS (com captura de metadados Bloom/Dificuldade/Rubrica/Cenário/Princípio) | `src/lib/parser/` | `486d0a7` |
| 4 | Testes do parser (35 pares reais + casos de erro) | `src/lib/parser/parser.test.ts` | `486d0a7` |
| 5 | Motor de sorteio ponderado do modo prova (cotas por maior resto, déficit nunca redistribuído) | `src/domain/sorteio.ts` | `3bb89f5` |
| 8 | Schema SQLite + conexão + migração idempotente | `src/db/` | `3bb89f5` |
| 6 | Motor de rodada (navegação sem wrap, tempo por visita, encerramento idempotente, placar com 2 denominadores) | `src/domain/rodada.ts` | `fcbe24f` |
| 7 | Testes unitários de domínio | já coberto por `sorteio.test.ts` (10 testes) + `rodada.test.ts` (17 testes) | `fcbe24f` |
| 9 | Repositório de acesso a dados (rodadas + histórico) | `src/db/repositorioRodadas.ts`, `src/db/repositorioHistorico.ts` | `6c17e18` |
| 10 | Testes de persistência | já coberto por `repositorioRodadas.test.ts` (6 testes) + `repositorioHistorico.test.ts` (6 testes) | `6c17e18` |
| — | **Catálogo** (não numerado no plano original, pré-requisito descoberto ao implementar a Tarefa 11) | `src/lib/catalogo/index.ts` | `8fc0928` |
| 11 | `POST /api/rodadas` (criar rodada prática/prova) | `src/app/api/rodadas/route.ts`, `src/lib/api/questaoCliente.ts` | `08034fb` |
| 12 | `GET /api/rodadas/:id` (retomar) + `GET`/`POST /api/rodadas/:id/questoes/:indice` (navegar/responder) | `src/app/api/rodadas/[id]/route.ts`, `.../questoes/[indice]/route.ts` | `dcf74ec` |
| 13 | `POST /api/rodadas/:id/encerrar` | `src/app/api/rodadas/[id]/encerrar/route.ts`, `src/lib/api/detalheRodada.ts` | `e85838e` |
| 14 | `GET /api/historico` + `GET /api/historico/:id` | `src/app/api/historico/route.ts`, `.../[id]/route.ts` | `4aee84c` |
| 15 | Testes de rotas de API | já coberto: teste dedicado ao lado de cada rota (94 testes no total ao final da Fase 5) | `4aee84c` |
| — | **Sistema de design** (paleta, tipografia, componentes base) | `src/app/globals.css`, `src/app/layout.tsx`, `src/components/` | `53aea8b` |
| — | **`GET /api/catalogo`** (não numerado, pré-requisito das telas 16/17) | `src/app/api/catalogo/route.ts` | `eff0dd1` |
| 16-20 | 5 telas (menu, seleção, rodada/questão, resultado, histórico) | `src/app/page.tsx`, `src/app/selecao/`, `src/app/rodada/[id]/`, `src/app/resultado/[id]/`, `src/app/historico/` | `1694aa9` |
| 21 | Acessibilidade transversal | foco gerenciado no diálogo de confirmação, Escape fecha, nunca só cor | `c138da2` |
| 22 | Testes de fluxo (E2E) | `e2e/fluxo-completo.spec.ts` (Playwright, `yarn test:e2e`) | `c138da2` |

Tarefas 1–5 e 8 passaram pelos 4 portões do modo `--full` (coder/tester/reviewer/security-auditor). Na Tarefa 3 apareceram **2 achados CRITICAL de segurança** (path traversal e bypass via symlink em `carregarPar()`), ambos corrigidos com aprovação explícita do usuário — ver `src/lib/parser/parser.ts`, função `validarDentroDoConteudo`. A partir da Tarefa 6, a execução passou para o **modo Single** (esta mesma sessão, sem subagentes) por restrição de orçamento — o usuário pediu para pausar após cada tarefa concluída e perguntar antes de seguir para a próxima.

Na Tarefa 9 surgiram 2 correções em código já aprovado, encontradas ao implementar: `schema.sql` tinha `decorrido_segundos`/`segundos` como `INTEGER` (truncava a precisão de ponto flutuante do domínio — corrigido para `REAL`); e `vitest.config.mts` nunca teve o alias `@/` configurado (só não tinha quebrado ainda porque todo import cruzado anterior era `import type`, apagado em build — corrigido com `resolve.alias` espelhando `tsconfig.json`).

O plano original (replanejado para `--full`) pulou uma peça que a Tarefa 11 precisa: descoberta/catálogo de pares (equivalente a `catalogo.py`). Implementei como pré-requisito não numerado, documentado na tabela acima.

A rota `POST /api/rodadas` devolve a questão ao cliente só depois de sanitizada (`paraQuestaoCliente`) — nunca a resposta certa, explicação ou metadados antes de responder. As rotas de histórico/encerrar usam o helper simétrico `montarDetalheRodada` (`src/lib/api/detalheRodada.ts`), que só pode ser chamado para uma rodada `finalizada` — nunca para uma em andamento.

**Bugs reais encontrados e corrigidos durante a Fase 5** (todos com teste que trava a correção):
- `responder()` (Tarefa 6) checava `marcaEm === null` como guarda de "cronômetro nunca iniciado" — mas uma rodada recarregada do banco entre requisições HTTP tem `marcaEm=null` de propósito (sem cronômetro vivo em processo). Isso fazia toda resposta via API ser silenciosamente ignorada. Corrigido para checar `inicioEm === null`, que é o sinal verdadeiro.
- Corrida de teste real (não só flakiness): `catalogo/index.test.ts` varre `content/simulados/` inteiro; `parser.test.ts` cria/remove sua própria fixture na mesma árvore (obrigatório — a guarda de path traversal da Tarefa 3 só aceita caminhos dentro de `content/simulados/`). Rodando em paralelo (padrão do Vitest), a varredura do catálogo ocasionalmente pegava a fixture do parser pela metade. Corrigido com `fileParallelism: false` no `vitest.config.mts`.

**Decisão de design registrada**: o domínio (`rodada.ts`) não tem cronômetro "vivo" entre requisições HTTP — cada chamada de API é um processo sem memória da anterior. Por isso, `segundosGastos` (quanto tempo o candidato passou numa questão) é sempre REPORTADO PELO CLIENTE e acumulado pela própria rota (não pelo `registrarTempo` interno do domínio, que só soma tempo dentro de uma única chamada com relógio contínuo). Já se a PROVA acabou (por tempo) é sempre recomputado no servidor a partir de `iniciada_em` — o cliente nunca decide isso; toda rota de mutação rejeita com 409 se `encerrada()` já for `true`.

`yarn build` e `yarn test` (94 testes, 13 arquivos) passam limpos no estado atual do repositório.

**Fase 6 concluída** com verificação real no navegador (Playwright): 2 bugs de UI encontrados e corrigidos (botões-link sublinhados; barra fixa da seleção renderizando fora de ordem) — ver commit `c138da2` para detalhes. `yarn test` (95 testes) e `yarn test:e2e` (3 testes Playwright) passam limpos.

## O que falta (ordem do plano original)

**Fase 5 — API (rotas Next.js)** — depende de 6 e 9
- [ ] 11. `POST /api/rodadas` (criar rodada)
- [ ] 12. Rotas de questão/navegação (autoridade do cronômetro no servidor)
- [ ] 13. `POST .../encerrar`
- [ ] 14. `GET /api/historico`
- [ ] 15. Testes de rotas de API

**Fase 7 — Docker e documentação** — depende das fases anteriores
- [ ] 23. Dockerfile multi-stage
- [ ] 24. Docker Compose (volume nomeado para o `.db`, sem bind mount externo)
- [ ] 25. README (uso via `docker compose up`, único pré-requisito é Docker)
- [ ] 26. Checklist final de paridade comportamental (regra de negócio → teste correspondente)

## Nota sobre orçamento e modo de execução

O modo `--full` (multiagente com 4 portões por tarefa) consumiu muito mais tokens do que o previsto para completar as 6 primeiras tarefas — em parte por 2 achados CRITICAL reais que exigiram ciclos extras de correção, e por retrabalhos MINOR. A partir da Tarefa 6, a execução passou para o modo `Single` (esta sessão, sem subagentes): eu implemento, rodo `yarn build`/`yarn test`, reviso o próprio diff e commito — sem os agentes separados de tester/reviewer/security-auditor. O usuário pediu explicitamente para eu pausar ao final de cada tarefa concluída e perguntar antes de seguir para a próxima, em vez de encadear tudo automaticamente.

## Como retomar

1. Ler este arquivo.
2. Conferir `git log --oneline` para confirmar que o estado do repositório bate com a tabela acima.
3. Rodar `yarn install && yarn build && yarn test` para confirmar que nada regrediu.
4. Continuar pela Tarefa 23 (Fase 7 — Docker e documentação), na ordem listada.
