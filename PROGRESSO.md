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

Tarefas 1–5 e 8 passaram pelos 4 portões do modo `--full` (coder/tester/reviewer/security-auditor). Na Tarefa 3 apareceram **2 achados CRITICAL de segurança** (path traversal e bypass via symlink em `carregarPar()`), ambos corrigidos com aprovação explícita do usuário — ver `src/lib/parser/parser.ts`, função `validarDentroDoConteudo`. A partir da Tarefa 6, a execução passou para o **modo Single** (esta mesma sessão, sem subagentes) por restrição de orçamento — o usuário pediu para pausar após cada tarefa concluída e perguntar antes de seguir para a próxima.

Na Tarefa 9 surgiram 2 correções em código já aprovado, encontradas ao implementar: `schema.sql` tinha `decorrido_segundos`/`segundos` como `INTEGER` (truncava a precisão de ponto flutuante do domínio — corrigido para `REAL`); e `vitest.config.mts` nunca teve o alias `@/` configurado (só não tinha quebrado ainda porque todo import cruzado anterior era `import type`, apagado em build — corrigido com `resolve.alias` espelhando `tsconfig.json`).

`yarn build` e `yarn test` (58 testes, 7 arquivos) passam limpos no estado atual do repositório.

## O que falta (ordem do plano original)

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

O modo `--full` (multiagente com 4 portões por tarefa) consumiu muito mais tokens do que o previsto para completar as 6 primeiras tarefas — em parte por 2 achados CRITICAL reais que exigiram ciclos extras de correção, e por retrabalhos MINOR. A partir da Tarefa 6, a execução passou para o modo `Single` (esta sessão, sem subagentes): eu implemento, rodo `yarn build`/`yarn test`, reviso o próprio diff e commito — sem os agentes separados de tester/reviewer/security-auditor. O usuário pediu explicitamente para eu pausar ao final de cada tarefa concluída e perguntar antes de seguir para a próxima, em vez de encadear tudo automaticamente.

## Como retomar

1. Ler este arquivo.
2. Conferir `git log --oneline` para confirmar que o estado do repositório bate com a tabela acima.
3. Rodar `yarn install && yarn build && yarn test` para confirmar que nada regrediu.
4. Continuar pela Tarefa 11 (Fase 5 — rotas de API), na ordem listada — perguntando ao usuário antes de cada nova tarefa, conforme pedido.
