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

Todas passaram pelos 4 portões (coder/tester/reviewer/security-auditor). Na Tarefa 3 apareceram **2 achados CRITICAL de segurança** (path traversal e bypass via symlink em `carregarPar()`), ambos corrigidos com aprovação explícita do usuário antes de prosseguir — ver `src/lib/parser/parser.ts`, função `validarDentroDoConteudo`. Também houve 3 retrabalhos MINOR menores (campo de metadado duplicado, erro de fs vazando, nome de diretório de fixture de teste colidindo com filtro de domínio) — todos corrigidos.

`yarn build` e `yarn test` (30 testes, 4 arquivos) passam limpos no estado atual do repositório.

## O que falta (ordem do plano original)

**Fase 3 — Domínio (parcial)**
- [ ] 6. Motor de rodada (`src/domain/rodada.ts`): navegação bidirecional sem wraparound, tempo por visita à questão, `encerrada()` como ato explícito, placar com dois denominadores. Depende de: 5 (pronto).
- [ ] 7. Testes unitários de domínio (cobrindo 5 e 6 juntos, se ainda não estiver coberto o suficiente).

**Fase 4 — Persistência (parcial)**
- [ ] 9. Repositório de acesso a dados (`src/db/repositorioRodadas.ts`, `repositorioHistorico.ts`) — grava rodada/snapshot, histórico recalcula estatística na leitura (nunca persistida). Depende de: 8 (pronto), 3 (pronto), 6.
- [ ] 10. Testes de persistência.

**Fase 5 — API (rotas Next.js)** — depende de 6 e 9
- [ ] 11. `POST /api/rodadas` (criar rodada)
- [ ] 12. Rotas de questão/navegação (autoridade do cronômetro no servidor)
- [ ] 13. `POST .../encerrar`
- [ ] 14. `GET /api/historico`
- [ ] 15. Testes de rotas de API

**Fase 6 — UI (5 telas + acessibilidade)** — depende da Fase 5
- [ ] 16. Menu · 17. Seleção · 18. Rodada/Questão · 19. Resultado · 20. Histórico
- [ ] 21. Revisão de acessibilidade transversal (nunca só cor para transmitir estado)
- [ ] 22. Testes de fluxo das telas

**Fase 7 — Docker e documentação** — depende das fases anteriores
- [ ] 23. Dockerfile multi-stage
- [ ] 24. Docker Compose (volume nomeado para o `.db`, sem bind mount externo)
- [ ] 25. README (uso via `docker compose up`, único pré-requisito é Docker)
- [ ] 26. Checklist final de paridade comportamental (regra de negócio → teste correspondente)

## Nota sobre orçamento e modo de execução

O modo `--full` (multiagente com 4 portões por tarefa) consumiu muito mais tokens do que o previsto para completar só 6 das 26 tarefas — em parte por 2 achados CRITICAL reais que exigiram ciclos extras de correção, e por retrabalhos MINOR. Ao retomar, considerar rodar o restante em modo `Single` (mesma sessão, sem os 4 agentes separados por tarefa) para caber melhor no orçamento, mantendo o mesmo rigor de teste/build a cada passo — essa foi a direção acertada com o usuário na sessão anterior, mas a execução foi pausada antes de trocar de modo.

## Como retomar

1. Ler este arquivo.
2. Conferir `git log --oneline` para confirmar que o estado do repositório bate com a tabela acima.
3. Rodar `yarn install && yarn build && yarn test` para confirmar que nada regrediu.
4. Continuar pela Tarefa 6, na ordem listada.
