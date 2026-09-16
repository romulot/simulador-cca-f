# Plano de implementação — Exame Avançado (tagueamento e trilhas)

## 1. Diagnóstico resumido

`/exame-avancado/` (raiz do repositório, ainda não versionado) contém 300
questões (60 por domínio × 5 domínios) para a mesma certificação-alvo do
simulador (CCA-F), escritas para um fluxo de estudo próprio e independente,
não para o parser deste app.

A conversão de formato é majoritariamente mecânica:

- Simulado: heading `### Q{n}` (o parser exige `## Q{n}`); alternativas
  `- **A)** texto` já batem com o parser. Confirmado por execução real do
  parser: corrigindo só o heading, `parseSimulado` processa as 60 questões de
  um domínio sem erro.
- Gabarito: header `### Q{n} — Resposta: **X**` (o parser exige
  `## Q{n} ... Resposta correta: **X**`); explicações no formato
  `- **A) ❌** texto` / `- **D) ✅** texto` (o parser exige
  `- **A — errada:** texto` / `- **D — correta.**`); não há parágrafo de
  abertura antes das alternativas.

O que **não** é mecânico, e é o grosso do esforço: não existe bloco
`**Metadados (revisão; não exibir ao candidato):**` (5 campos obrigatórios —
Bloom, Dificuldade, Rubrica, Cenário, Princípio testado — sem eles o
gabarito não carrega), não existe linha `**Tópicos:**`, e não existem
arquétipos de distrator por alternativa errada. Esses dados alimentam
`domain/aprendizado.ts`, `domain/recomendacao.ts` e o "caderno de erros" —
precisam ser produzidos por curadoria (manual ou assistida por IA), questão
a questão, não extraídos do material de origem.

Confirmado por execução: hoje os 5 pares de `/exame-avancado` falham
**silenciosamente** contra o parser atual (o heading `###` não bate no
regex `QHEAD`; `blocos()` não encontra nenhum bloco e devolve lista vazia —
não lança erro, só devolve 0 questões).

Bloqueio técnico obrigatório: `src/lib/parser/parser.ts` define
`CONTEUDO_RAIZ` como uma única raiz fixa (`content/simulados`), guarda
contra path traversal. Qualquer caminho fora dela é rejeitado antes mesmo de
ler o arquivo — nenhum conteúdo novo pode ser lido sem tocar essa guarda.

Domínio é exibido ao candidato hoje em 5 telas (seleção, resultado,
desempenho, próxima sessão, caderno). A tela de prova em si
(`src/app/rodada/[id]/page.tsx`) já não exibe domínio — o campo existe no
tipo mas nunca é renderizado. Domínio como dado de cálculo interno
(`desempenhoPorDominio`, `recomendacao.ts`, pesos por domínio) está
desacoplado da UI — pode continuar sendo calculado e persistido sem ser
exibido.

Não há risco a dados de usuários: o histórico de rodadas é um snapshot
autocontido, sem chave estrangeira para uma tabela canônica de questões.

## 2. Decisões

- Conteúdo novo vive em `content/exame-avancado/dominio-{1..5}/`, mesma
  estrutura de diretório usada hoje em `content/simulados/`.
- A raiz de conteúdo permitida no parser passa de uma constante única para
  uma lista fixa de raízes definidas no código (nunca vinda de input
  externo), mantendo a mesma defesa contra path traversal.
- Cada rodada grava explicitamente a trilha (`curso-antigo` |
  `exame-avancado`) no banco; é esse valor — não o nome do arquivo — que
  decide qual raiz de conteúdo consultar depois.
- Ocultação de domínio acontece em duas camadas: a API não envia o campo
  para o cliente quando a trilha é `exame-avancado`, e a UI deixa de
  renderizar a seção/rótulo correspondente. Escondê-lo só no componente não
  é suficiente — o dado não deve nem trafegar para o cliente nessa trilha.
- O campo `**Palavras-gatilho:**`, presente no material de origem, é
  descartado — não entra no parser, no schema nem na UI. Está fora do
  escopo pedido (tagueamento + trilhas) e o corpus atual não tem equivalente.
- Preservar o corpus atual (240 questões, já tagueado) e o teste que trava
  "35 pares / 240 questões" exatamente como estão — a trilha "Curso Antigo"
  não pode regredir.
- Licenciamento do material de origem de `/exame-avancado` ("não
  redistribuir", declarado no README) é uma ressalva de produto do dono do
  conteúdo, não um bloqueio técnico — registrada como risco, não como
  tarefa.

## 3. Tarefas

### Tarefa 1 — Parametrizar a raiz de conteúdo permitida no parser

**Arquivos-alvo**

- `src/lib/parser/parser.ts` (constante `CONTEUDO_RAIZ`, função
  `validarDentroDoConteudo`).

**Mudança**

Trocar a constante única por uma lista de raízes permitidas
(`content/simulados` e `content/exame-avancado`, ambas resolvidas com
`realpathSync` no load do módulo). `validarDentroDoConteudo` aceita o
caminho se ele estiver dentro de qualquer uma das raízes da lista e continua
rejeitando com `FormatoInvalido` fora de todas elas. Não afrouxar a
checagem — só ampliar o conjunto de prefixos válidos, com valores fixos no
código.

**Critério de pronto**

Teste em `src/lib/parser/parser.test.ts` cobrindo: caminho dentro de
`content/simulados` continua aceito; caminho dentro de
`content/exame-avancado` passa a ser aceito; caminho fora de ambas continua
rejeitado. Suíte atual do parser continua verde.

**NIVEL:** SENSÍVEL  
**DOCS:** não  
**UI:** não

### Tarefa 2 — Modelar "trilha" na descoberta do catálogo

**Depende de:** Tarefa 1 (para poder testar a raiz nova de ponta a ponta).

**Arquivos-alvo**

- `src/lib/catalogo/index.ts`
- `src/lib/catalogo/index.test.ts` (apenas adições — não tocar nos testes
  existentes do corpus de 240 questões).

**Mudança**

`descobrir(raiz)` já aceita uma raiz por parâmetro. Falta um ponto único de
mapeamento nome-de-trilha → raiz de disco (ex.:
`{ "curso-antigo": ".../content/simulados", "exame-avancado":
".../content/exame-avancado" }`), para que os chamadores parem de assumir
implicitamente uma única raiz. Evitar nomear o identificador TypeScript como
`Trilha` — já existe `src/components/Trilha.tsx` (barra de progresso de
questão, conceito não relacionado); usar um nome que não colida.

**Critério de pronto**

Com fixtures de teste (não o corpus real), `descobrir(raizFixture)`
continua funcionando como hoje para uma raiz alternativa; o registro de
raízes por trilha existe e é usado por pelo menos um teste. `index.test.ts`
original ("35 pares / 240 questões / 5 grupos") permanece inalterado e
verde.

**NIVEL:** PADRÃO  
**DOCS:** não  
**UI:** não

### Tarefa 3 — Persistir a trilha da rodada

**Depende de:** Tarefas 1 e 2.

**Arquivos-alvo**

- Nova migration, ex. `src/db/migrations/009_trilha_rodadas.sql`.
- `src/db/repositorioRodadas.ts`
- `src/app/api/rodadas/route.ts` (POST)

**Mudança**

Migration nova (não editar migrations antigas) adicionando coluna
`trilha TEXT NOT NULL DEFAULT 'curso-antigo' CHECK (trilha IN
('curso-antigo','exame-avancado'))` em `rodadas` — o default preserva
rodadas históricas existentes sem exigir backfill manual.
`repositorioRodadas` passa a gravar e devolver `trilha` ao criar/carregar
uma rodada. `POST /api/rodadas` passa a aceitar um campo `trilha` no corpo,
validado contra o enum fixo antes de qualquer uso — esse valor nunca deve
ser usado para montar caminho de arquivo diretamente, só para indexar o
registro de raízes da Tarefa 2. Registrar explicitamente no código se
`PESOS` (`src/domain/sorteio.ts`, hoje 27/18/20/20/15 fixo e global) continua
compartilhado entre as duas trilhas — hoje bate por coincidência com os
pesos do README do exame-avançado, isso não deve ficar implícito.

**Critério de pronto**

Criar rodada com `trilha: "exame-avancado"` grava e devolve a trilha certa;
criar sem o campo (ou com `curso-antigo`) preserva o comportamento atual
1:1; valor fora do enum é rejeitado com 400 antes de tocar o
catálogo/filesystem. Testes existentes de `rodadas/route.test.ts` continuam
verdes.

**NIVEL:** SENSÍVEL  
**DOCS:** sim  
**UI:** não

### Tarefa 4 — Resolver a trilha correta nas rotas de leitura pós-rodada

**Depende de:** Tarefas 2 e 3.

**Arquivos-alvo**

- `src/app/api/historico/[id]/route.ts`
- `src/app/api/aprendizado/resumo/route.ts`
- `src/app/api/aprendizado/caderno/route.ts`
- `src/app/api/aprendizado/proxima-sessao/route.ts`

**Mudança**

Essas rotas chamam `descobrir()` hoje com a raiz padrão implícita para
recompor dados a partir de `origem`/`dominio` gravados na rodada/histórico.
Precisam resolver a raiz certa a partir da `trilha` gravada em cada rodada
(Tarefa 3) — sem isso, qualquer rodada da trilha "Exame Avançado" quebra
silenciosamente essas telas. Onde uma rota agrega dados de várias rodadas de
trilhas diferentes (`aprendizado/resumo`, `caderno`), garantir que cada
registro é resolvido pela sua própria raiz, sem misturar.

**Critério de pronto**

Com uma fixture de rodada marcada `exame-avancado`, as 4 rotas devolvem os
dados da questão corretamente; uma rodada `curso-antigo` continua
funcionando exatamente como hoje. Testes existentes de
`aprendizado/caderno/route.test.ts` e afins continuam verdes.

**NIVEL:** PADRÃO  
**DOCS:** não  
**UI:** não

### Tarefa 5 — Script de conversão mecânica do par simulado/gabarito

**Arquivos-alvo**

- Novo script de conversão (ex. `exame-avancado/converter.py`, ao lado de
  `embaralhar.py`/`verificar.py`, ou um script TS em `scripts/`).
- Lê `exame-avancado/dominio-{1..5}_{simulado,gabarito}.md` (origem,
  intocada) e escreve em
  `content/exame-avancado/dominio-{1..5}/dominio-{1..5}_{simulado,gabarito}.md`.

**Mudança**

Só transformações sintáticas, sem julgamento de conteúdo:

- `### Q{n}` → `## Q{n}` (simulado e gabarito).
- `### Q{n} — Resposta: **X**` → `## Q{n} — Resposta correta: **X**`.
- `- **A) ❌** texto` → `- **A — errada:** texto`.
- `- **D) ✅** texto` → `- **D — correta.**` (a alternativa correta não
  carrega texto próprio — regra já vigente no parser).
- Não inventar parágrafo de abertura, bloco de metadados, `**Tópicos:**`
  nem `Arquétipos:` — isso é curadoria (Tarefa 6).
- Descartar a linha `**Palavras-gatilho:**` na conversão.

**Critério de pronto**

`parseSimulado` sobre os 5 arquivos convertidos carrega as 300 questões
(60×5) sem erro de estrutura de alternativas. `parseGabarito` sobre os 5
arquivos convertidos falha exclusivamente com "bloco de metadados ausente"
/ "linha '\*\*Tópicos:\*\*' ausente" — nenhum outro tipo de erro estrutural,
confirmável rodando o parser real contra a saída do script.

**NIVEL:** TRIVIAL  
**DOCS:** não  
**UI:** não

### Tarefa 6 — Pipeline de tagueamento pedagógico (curadoria, 300 questões)

**Depende de:** Tarefa 5.

**Arquivos-alvo**

- Os 5 `content/exame-avancado/dominio-{1..5}/dominio-{1..5}_gabarito.md`
  gerados pela Tarefa 5.
- Ampliação do escopo textual de
  `.claude/agents/simulador-cca-f-content.md` para cobrir também
  `content/exame-avancado/**/*_gabarito.md`.

**Mudança (por questão, 300×)**

1. Escrever o parágrafo de abertura (resumo) do gabarito — obrigatório para
   o parser, hoje inexistente na fonte.
2. Preencher o bloco de Metadados com os 5 campos obrigatórios, respeitando
   o vocabulário fechado de fato já em uso no corpus atual: `Bloom` ∈
   {Lembrar, Aplicar, Analisar, Avaliar}; `Dificuldade` ∈ {Fácil, Médio,
   Difícil}; `Cenário` ∈ conjunto nomeado com prefixo S1–S4; `Rubrica` como
   fórmula textual derivada ("N = Bloom X + integração Y + cenário Z +
   distratores W"); `Princípio testado` como frase curta.
3. Adicionar `**Tópicos:**` com ao menos 1 tag por questão.
4. Adicionar `Arquétipos: A=id, C=id` (quando a alternativa errada se
   encaixar claramente) usando exclusivamente os 10 ids canônicos de
   `src/domain/arquetipos.ts` — nunca na alternativa correta, nunca mais de
   um id por alternativa, nunca forçar encaixe sem arquétipo claro.

**Critério de pronto**

`descobrir()` apontando para `content/exame-avancado` devolve 5 pares
válidos (`erro === null`) somando 300 questões, sem `FormatoInvalido`. Teste
de integridade garante: toda alternativa errada com arquétipo usa um id do
conjunto canônico; a alternativa correta nunca tem arquétipo; todo
`Bloom`/`Dificuldade` usa apenas os valores do vocabulário fechado. O
critério de pronto é o resultado verificável (parser + testes de
integridade passam) — não a técnica usada para produzir o conteúdo.

**NIVEL:** PADRÃO  
**DOCS:** não  
**UI:** não

### Tarefa 7 — Descartar o campo "Palavras-gatilho"

**Arquivos-alvo**

- `exame-avancado/README.md`

**Mudança**

Ajustar o README para deixar claro que o campo "Palavras-gatilho" é só do
material de origem/uso manual fora do app, não é portado para o Simulador
CCA-F.

**Critério de pronto**

README de `exame-avancado/` não afirma mais que o app exibirá
"Palavras-gatilho"; o script da Tarefa 5 comprovadamente descarta a linha
sem gerar erro de parsing.

**NIVEL:** TRIVIAL  
**DOCS:** sim  
**UI:** não

### Tarefa 8 — Ocultar domínio nas 5 telas, condicional à trilha

**Depende de:** Tarefas 3 e 4.

**Arquivos-alvo (API)**

- `src/app/api/catalogo/route.ts`
- `src/app/api/historico/[id]/route.ts`
- `src/app/api/aprendizado/resumo/route.ts`
- `src/app/api/aprendizado/proxima-sessao/route.ts`
- `src/app/api/aprendizado/caderno/route.ts`

**Arquivos-alvo (UI)**

- `src/app/selecao/page.tsx` (`<h2>{grupo.grupo}</h2>`)
- `src/app/resultado/[id]/page.tsx` (seção "Desempenho por domínio")
- `src/app/desempenho/page.tsx` (`<h2>Domínio {d.dominio}</h2>` por card)
- `src/app/proxima-sessao/page.tsx` (menções a "Domínio X")
- `src/app/caderno/page.tsx` ("(Domínio {r.dominio})")
- `src/app/rodada/[id]/page.tsx` (já não exibe domínio — só confirmar que
  nenhuma regressão introduz exibição ali)

**Mudança**

Quando a rodada/registro pertence à trilha "Exame Avançado", as rotas acima
não incluem o campo de domínio no JSON de resposta — o dado não deve
trafegar para o cliente nessa trilha, para não ficar exposto via
devtools/network mesmo que a UI não o renderize. As 5 telas passam a
renderizar a seção/rótulo de domínio condicionalmente à presença do dado (ou
a um flag de trilha explícito), preservando layout e ordem das demais
informações quando a seção é omitida. O cálculo/persistência interna de
domínio (`domain/aprendizado.ts`, `domain/recomendacao.ts`,
`questoes_rodada.dominio`) não muda.

**Critério de pronto**

Para uma rodada/entrada de trilha "Exame Avançado", nenhuma das 5 telas
exibe a palavra "Domínio" nem número de domínio em nenhum estado; o payload
JSON das rotas correspondentes não contém o campo de domínio (ou o contém
omitido) para essa trilha; para "Curso Antigo" as 5 telas continuam
idênticas ao comportamento atual.

**NIVEL:** SENSÍVEL  
**DOCS:** sim  
**UI:** sim

### Tarefa 9 — Navegação/menu novo com as duas trilhas rotuladas

**Depende de:** Tarefas 2 e 3 (estrutura); idealmente após 6 e 8 para a
trilha nova já ter conteúdo utilizável e domínio oculto de fato.

**Arquivos-alvo**

- `src/app/page.tsx`
- Telas/fluxos de início de rodada (`selecao`, e os `fetch("/api/rodadas",
  ...)` de prova/aleatório/revisão).

**Mudança**

Introduzir uma escolha explícita de trilha antes do menu atual, com os
rótulos exatos **"Curso Antigo"** (aponta para `content/simulados`) e
**"Exame Avançado"** (aponta para `content/exame-avancado`) — as duas
convivendo, nenhuma removida. Toda ação que hoje dispara `POST /api/rodadas`
passa a enviar a trilha escolhida. Histórico, desempenho, próxima sessão e
caderno continuam agregando as duas trilhas, respeitando a ocultação de
domínio da Tarefa 8 conforme a trilha de cada registro.

**Critério de pronto**

A partir do menu, é possível concluir uma rodada completa em "Curso Antigo"
e uma em "Exame Avançado" sem nenhuma tela misturar conteúdo das duas
trilhas numa mesma rodada; os rótulos aparecem exatamente com esse texto na
navegação; nenhum fluxo existente de "Curso Antigo" muda de posição/
comportamento perceptível além da adição da escolha de trilha.

**NIVEL:** PADRÃO  
**DOCS:** sim  
**UI:** sim

### Tarefa 10 — Cobertura de teste da nova estrutura, sem quebrar a existente

**Depende de:** Tarefa 6 (corpus real das 300 questões tagueadas para a
asserção de integração final).

**Arquivos-alvo**

- Novo teste, ex. `src/lib/catalogo/index.exame-avancado.test.ts` (separado
  do bloco que trava "35 pares / 240 questões", sem tocá-lo).

**Mudança**

Teste de integração equivalente ao já existente para o corpus antigo, mas
para `content/exame-avancado`: `descobrir(RAIZ_EXAME_AVANCADO)` encontra 5
pares, todos com `erro === null`, somando 300 questões, agrupados em 5
domínios.

**Critério de pronto**

Novo teste passa contra o corpus real pós-tagueamento; suíte completa verde,
incluindo o teste original de 240 questões inalterado.

**NIVEL:** TRIVIAL  
**DOCS:** não  
**UI:** não

## 4. Dependências e ordem recomendada

1 → 2 → 3 → 4 → (5 pode rodar em paralelo a 1–4) → 6 → 7 (junto com 5/6) →
8 → 9 → 10 (fechamento).

- A integração de trilha na API/rotas (3, 4) não deve preceder a
  parametrização da raiz do parser (1) nem a modelagem de trilha no
  catálogo (2).
- A ocultação de domínio (8) depende de 3 e 4 estarem corretas — se a raiz
  errada for consultada, o sintoma mais provável é "não encontrado", não
  vazamento; o risco real de vazamento é implementar 8 só na UI, sem tocar a
  API.
- O menu novo (9) pode ser construído estruturalmente assim que 2/3
  existirem, mas só faz sentido para o usuário final depois de 6 (conteúdo
  utilizável) e 8 (domínio oculto de fato).

## 5. Riscos

- **Tarefa 6 é o gargalo real de prazo** — curadoria de 300 questões com
  julgamento humano/de IA, esforço não determinístico, diferente das demais
  tarefas (mecânicas/arquiteturais).
- Ocultar domínio só na camada de UI, sem tocar a API, é o risco concreto de
  vazamento via inspeção de rede.
- `PESOS` (`src/domain/sorteio.ts`) é hoje uma constante global única
  (27/18/20/20/15) usada tanto por `sortear()` quanto por `recomendacao.ts`;
  bate por coincidência com os pesos do README do exame-avançado — se algum
  dia divergir, precisará virar por-trilha.
- `origem` em `questoes_rodada`/histórico não é necessariamente único entre
  trilhas (ambas usam nomes "dominio-N"); a Tarefa 4 deve resolver a raiz
  pela `trilha` persistida (Tarefa 3), nunca inferir a trilha a partir de
  `origem` sozinho.
- A tela de seleção (`selecao/page.tsx`) assume implicitamente vários pares
  por domínio (35 hoje); o exame-avançado tem só 1 par por domínio (5 no
  total) — validar durante a implementação que a tela continua fazendo
  sentido nesse formato mais achatado, sem virar um redesenho novo.
- Licenciamento do material de origem de `/exame-avancado` ("não
  redistribuir", declarado no README): ressalva de produto a manter em
  vista ao decidir onde versionar `content/exame-avancado/`, não é tarefa
  técnica deste plano.

## 6. Limitações

Diagnóstico e plano baseados em leitura de código e conteúdo, mais uma
execução real do parser (`parseSimulado`/`parseGabarito`) contra os
arquivos de `/exame-avancado` nesta sessão — confirmando a falha silenciosa
do formato atual e a compatibilidade do lado "simulado" após correção do
heading. Não houve execução do app fim a fim nem inspeção renderizada das 5
telas envolvidas na ocultação de domínio; isso deve fazer parte da
validação de cada tarefa de UI durante a implementação.
