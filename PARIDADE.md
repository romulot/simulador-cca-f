# Checklist de paridade comportamental — TUI Python → Web

Mapeamento de cada regra de negócio preservada da versão original (TUI, `simulador/simulador/` no repositório antigo) para o teste automatizado que a trava nesta versão web. Produzido ao fechar a Fase 7 (Tarefa 26 do plano).

| Regra de negócio | Onde vive | Teste automatizado |
|---|---|---|
| Sorteio ponderado por domínio (cotas pelo método do maior resto) | `src/domain/sorteio.ts::cotas` | `sorteio.test.ts` — soma exatamente `TOTAL_PROVA`, distribuição do maior resto |
| Déficit de um domínio **nunca** é redistribuído para outro | `sorteio.ts::sortear` | `sorteio.test.ts` — déficit registrado, total sorteado fica menor que 60 |
| Tabela de pesos com soma ≤ 0 ou sinais mistos inválidos lança erro | `sorteio.ts::cotas` | `sorteio.test.ts` |
| Navegação bidirecional **sem wraparound** | `src/domain/rodada.ts::irPara` | `rodada.test.ts` — avançar na última/voltar na primeira não faz nada |
| Tempo é contado por **visita** à questão, não por resposta | `rodada.ts::registrarTempo` | `rodada.test.ts` — revisitar sem responder acumula tempo |
| `encerrada()` **nunca** equivale a "tudo respondido" | `rodada.ts::encerrada` | `rodada.test.ts` — todas respondidas sem `encerrar()` explícito continua ativa |
| `encerrar()` é idempotente (2ª chamada não muda `decorrido`/`esgotouTempo`) | `rodada.ts::encerrar` | `rodada.test.ts` + `encerrar/route.test.ts` |
| Placar com dois denominadores (sobre respondidas / sobre total) | `rodada.ts::placar` | `rodada.test.ts` — percentual diverge de percentualTotal com questões em branco |
| Rodada sem questão nenhuma já nasce encerrada | `rodada.ts::encerrada` | `rodada.test.ts` |
| `responder()` funciona mesmo sem cronômetro "vivo" em processo (reconstrução via banco) | `rodada.ts::responder` | `rodada.test.ts` — guarda é `inicioEm`, não `marcaEm` (bug real encontrado e corrigido na Tarefa 12) |
| Estatística (acertos/%) **nunca** é persistida — sempre recalculada na leitura | `src/db/repositorioHistorico.ts` | `repositorioHistorico.test.ts` |
| `esgotou_tempo` é um fato bruto persistido, não inferido depois | `src/db/repositorioRodadas.ts` | `repositorioRodadas.test.ts` |
| Snapshot de questão é **auto-contido** (texto completo, não só referência) | `repositorioRodadas.ts::criarRodada`/`carregarRodada` | `repositorioRodadas.test.ts` — round-trip preserva enunciado/alternativas/metadados |
| Autoridade sobre "o tempo da prova acabou" é **sempre do servidor** | `src/app/api/rodadas/[id]/questoes/[indice]/route.ts` | `route.test.ts` — ação rejeitada com 409 quando o limite já estourou, mesmo que o corpo diga outra coisa |
| Descoberta de pares nunca embutida em código — sempre varredura em disco | `src/lib/catalogo/index.ts::descobrir` | `catalogo/index.test.ts` — 35 pares reais + pares quebrados aparecem com `erro`, não somem |
| Par com gabarito ausente / contagem divergente / zero questões vira erro sinalizado, não desaparece | `catalogo.ts`, `parser.ts::carregarPar` | `catalogo/index.test.ts`, `parser.test.ts` |
| **CRITICAL** — path traversal em `carregarPar` (caminho fora de `content/simulados/`) | `parser.ts::validarDentroDoConteudo` | `parser.test.ts` — describe "guarda contra path traversal" |
| **CRITICAL** — symlink dentro de `content/simulados/` apontando pra fora | `parser.ts::validarDentroDoConteudo` (usa `realpathSync`) | `parser.test.ts` — mesmo describe acima |
| Metadados do gabarito (Bloom/Dificuldade/Rubrica/Cenário/Princípio) capturados, não descartados | `parser.ts::parseMetadados` | `parser.test.ts` — 240 questões reais com os 5 campos preenchidos |
| Corte oficial da prova (720/1000) **nunca** convertido — só citado como referência | `src/app/resultado/[id]/page.tsx` | `e2e/fluxo-completo.spec.ts` — texto "720/1000" e "sem conversão" visíveis |
| Nenhuma questão respondida sem confirmação explícita ao finalizar com itens em branco | `src/app/rodada/[id]/page.tsx` | `e2e/fluxo-completo.spec.ts` |
| Estado nunca comunicado só por cor (badges/trilha sempre têm ícone+texto) | `globals.css`, `Trilha.tsx`, `Barra.tsx` | Revisão manual (Tarefa 21); sem teste automatizado dedicado — ver limitação abaixo |

## Suítes e como rodar

- `yarn test` — 98 testes (Vitest): parser, catálogo, domínio, persistência, rotas de API.
- `yarn test:e2e` — 3 testes (Playwright): fluxo completo no navegador, modo prova, atalhos de teclado.
- `docker compose up -d --build` + verificação manual — build multi-stage, usuário não-root, persistência do volume entre `down`/`up`, remoção do histórico com `down -v`. Documentado e testado manualmente na Tarefa 24 (não há teste automatizado de Docker no CI desta versão).

## Limitações conhecidas (não bloqueiam a entrega, registradas para o time)

- **Contraste de cores**: a paleta (Tarefa 16-20) foi verificada visualmente (capturas de tela), mas não passou por uma auditoria formal de contraste WCAG. Recomendação: rodar uma ferramenta de auditoria (ex. Lighthouse) antes de considerar o design "fechado".
- **Sem teste automatizado para "nunca só cor"**: o princípio foi seguido na implementação (badges com ícone+texto, trilha com contorno/preenchimento diferentes) e revisado manualmente, mas não há um teste que trave isso — uma regressão futura (ex. alguém remover o ícone de um badge) não quebraria a suíte.
- **Docker não está no pipeline de CI** desta entrega — a validação foi manual (`docker build`/`docker compose up` rodados e verificados nesta sessão). Se o time adotar CI, vale adicionar um job que builda a imagem e roda `yarn test:e2e` contra o container.
