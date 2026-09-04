# Simulador CCA-F

Simulador de provas para a certificação **Claude Architect Foundation (CCA-F)** — versão web, local, sem login. Cada pessoa do time roda a própria instância; o histórico fica na sua máquina.

Migrado de um simulador em TUI (terminal) para uma aplicação web em Next.js, preservando as regras de negócio originais (sorteio ponderado do modo prova, navegação sem wraparound, tempo por questão, dois denominadores de placar) e adicionando relatórios por nível cognitivo (Bloom) e por dificuldade, que a versão em terminal não tinha.

## Como usar

**Único pré-requisito: Docker e Docker Compose.** Não precisa instalar Node, Yarn nem nada além disso — todo o resto (compilador, dependências, o próprio Next.js) vive dentro da imagem.

```bash
docker compose up -d --build
```

Abra `http://localhost:3000`. Pronto — escolha "Praticar" (simulados específicos) ou "Modo prova" (60 questões sorteadas pelos pesos oficiais do exame, 2 horas).

Para parar:

```bash
docker compose down
```

Isso **preserva** o seu histórico de rodadas (fica num volume Docker nomeado, não dentro do container). Se quiser apagar o histórico e recomeçar do zero:

```bash
docker compose down -v
```

> `-v` remove o volume junto — não tem como desfazer.

## O que o app faz

- **Praticar**: escolha um ou mais simulados por domínio e responda no seu ritmo, sem limite de tempo.
- **Modo prova**: 60 questões sorteadas automaticamente respeitando a proporção oficial de peso por domínio (1: 27% · 2: 18% · 3: 20% · 4: 20% · 5: 15%), limite de 2 horas. Se o corpus não tiver questões suficientes num domínio, a prova roda com menos questões — o déficit aparece na composição, nunca é compensado por outro domínio.
- **Resultado**: placar (com os dois jeitos de contar — sobre as questões respondidas e sobre o total), desempenho por domínio, desempenho por nível cognitivo (Bloom) e por dificuldade, revisão completa das questões erradas com explicação de cada alternativa.
- **Histórico**: toda rodada finalizada fica salva e pode ser reaberta depois.

O relatório nunca converte a taxa bruta de acerto para a escala oficial da prova (720/1000) — só cita a referência, já que a certificação não publica essa conversão.

## Adicionar ou editar conteúdo (novos simulados)

O conteúdo mora em `content/simulados/dominio-N/`, um par de arquivos por tópico:

- `{topico}_simulado.md` — enunciado e alternativas.
- `{topico}_gabarito.md` — resposta correta, explicação por alternativa, e um bloco de metadados (Bloom, Dificuldade, Rubrica, Cenário, Princípio testado).

O formato exato está implementado em `src/lib/parser/parser.ts` (o parser rejeita qualquer arquivo fora do contrato, com uma mensagem de erro explicando o motivo). Depois de editar, é só reconstruir a imagem:

```bash
docker compose up -d --build
```

## Desenvolvimento local (sem Docker)

Só necessário se você for **editar código**, não para usar o simulador.

```bash
yarn install
yarn dev          # servidor de desenvolvimento em http://localhost:3000
yarn test         # testes unitários/integração (Vitest)
yarn test:e2e     # fluxo completo no navegador (Playwright, roda contra build de produção)
yarn build        # build de produção (o mesmo que o Dockerfile usa)
```

Requer Yarn Berry (`.yarnrc.yml` já fixa a versão) com `nodeLinker: node-modules` — necessário porque o driver do SQLite (`better-sqlite3`) é um módulo nativo.

## Estrutura do projeto

```
content/simulados/       conteúdo-fonte (markdown), organizado por domínio
src/lib/parser/           markdown -> Questao[] (com validação de formato)
src/lib/catalogo/         descoberta dos pares simulado/gabarito em disco
src/domain/               regras de negócio puras (sorteio, rodada/sessão)
src/db/                   schema SQLite, conexão, repositórios
src/app/api/              rotas HTTP (criar/navegar/responder/encerrar rodada, histórico, catálogo)
src/app/                  as 5 telas (menu, seleção, rodada, resultado, histórico)
src/components/           peças de UI reutilizáveis (trilha de progresso, barra, cronômetro)
e2e/                      teste de fluxo completo (Playwright)
```

## Variáveis de ambiente

| Variável | Default | Uso |
|---|---|---|
| `SIMULADOR_DB_PATH` | `./data/simulador.db` | Caminho do arquivo SQLite. Já configurado no `docker-compose.yml` para o volume nomeado — normalmente não precisa mexer. |

## Notas de arquitetura

- O tempo por questão (`segundosGastos`) é medido e reportado pelo **cliente** (não há cronômetro contínuo no servidor entre requisições HTTP). Já se a prova acabou por tempo é sempre recalculado no **servidor**, a partir de quando a rodada começou — o cliente nunca decide isso, e qualquer ação enviada depois do tempo esgotar é rejeitada.
- Estatísticas de rodada (acertos, percentual) nunca são persistidas — são recalculadas na leitura a partir das respostas brutas, pra nunca haver duas fontes de verdade divergentes.
- Cada questão de uma rodada é gravada com o texto completo (não só uma referência) — editar o conteúdo-fonte depois não muda o que uma rodada já feita mostra no histórico.
