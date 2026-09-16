# Gabarito — Bloco 3

**Domínio 3 — Claude Code Configuration & Workflows (peso 20%)**

Fontes: `livro01.pdf`, `livro02.pdf`, objetivos de `livro03.md`.

---

### Q1 — Resposta: **A**
`TS 3.1` · objetivo #16 · Settings Scope

- **A) ✅** A hierarquia é Managed → User → Project → Local, e *"higher level scopes take precedence over lower level scopes"*. Existe um flag de managed settings para bloquear `--dangerously-skip-permissions` por completo.
- **B) ❌** Settings de usuário é justamente o que precisa ser impedido de sobrescrever.
- **C) ❌** `settings.local.json` é o escopo mais baixo e pessoal — o contrário do que a segurança precisa.
- **D) ❌** Projeto é escopo mais baixo que managed: o desenvolvedor sobrescreve no settings dele.

**Palavras-gatilho:** `regardless of what they put` = independentemente do que colocarem; `organization-wide` = para toda a organização.

---

### Q2 — Resposta: **C**
`TS 3.3` · objetivo #16 — path-specific rules

- **A) ❌** Um `CLAUDE.md` maior carrega tudo sempre — é a causa do problema, não a cura (e alimenta o "lost in the middle").
- **B) ❌** Hook garante, mas aqui é convenção de estilo, não requisito duro — e um hook não *ensina* a convenção, só rejeita.
- **C) ✅** Regra por caminho com glob carrega a orientação **só** quando o arquivo casa com o padrão. É o mecanismo desenhado para guidance condicional.
- **D) ❌** Depender de o humano declarar o contexto a cada sessão é frágil e manual.

**Palavras-gatilho:** `applies Python rules to .ts files` = aplica regras de Python em arquivos .ts.

---

### Q3 — Resposta: **B**
`TS 3.6` · objetivo #11 — CI/CD

- **A) ❌** Sem `-p` a sessão é interativa: o job trava esperando input.
- **B) ✅** `-p` roda em modo não interativo (print) e `--output-format json` entrega saída parseável pelo passo seguinte do pipeline.
- **C) ❌** `--resume` retoma uma sessão anterior; um job de CI parte do zero e não tem sessão para retomar.
- **D) ❌** Humano lendo terminal é exatamente o que um pipeline automatizado não tem.

**Palavras-gatilho:** `fully non-interactive` = totalmente não interativo; `parse programmatically` = interpretar por programa.

---

### Q4 — Resposta: **A**
`TS 3.1` · Permission Rules

- **A) ✅** *"Rules evaluation order is: deny → ask → allow. The least permissive/most restrictive rule will be applied."*
- **B) ❌** Escopo define de onde a regra vem, mas o tipo (deny) decide o conflito dentro da avaliação.
- **C) ❌** Inverte a ordem: allow é o último avaliado, não o vencedor.
- **D) ❌** `ask` não é um meio-termo que prevalece; deny vem antes.

**Palavras-gatilho:** `most restrictive` = mais restritiva.

---

### Q5 — Resposta: **D**
`TS 3.1` · Bash Wildcard Permissions

- **A) ❌** O `*` casa com qualquer caractere, mas o espaço literal antes dele tem de existir no comando.
- **B) ❌** Seria verdade para `Bash(ls*)` (sem espaço) — e é justamente a confusão que a questão testa.
- **C) ❌** Wildcards são suportados, e em qualquer posição do comando.
- **D) ✅** *"Spaces Matter! `Bash(ls *)` matches `ls -la` but not `lsof`."* O espaço faz parte do padrão.

**Palavras-gatilho:** `expecting it to cover` = esperando que cubra.

---

### Q6 — Resposta: **D**
`TS 3.4 / 3.6` · Dangerously Skip Permissions

- **A) ❌** Absoluto demais: o material desaconselha o uso casual, mas reconhece os cenários automatizados.
- **B) ❌** `-p` não depende disso; são configurações independentes.
- **C) ❌** Não há modo `bypassPermissions` automático em CI.
- **D) ✅** O material lista os casos legítimos: devcontainer/VM sem risco, **pipelines automatizados sem humano para aprovar**, e trabalho de risco muito baixo e bem delimitado. Rodar dentro de `/sandbox` reduz ainda mais o risco.

**Palavras-gatilho:** `unattended` = sem supervisão; `disposable container` = contêiner descartável.

---

### Q7 — Resposta: **C**
`TS 3.1 / 3.4` · Dangerous Scenario

- **A) ❌** Bubblewrap é justamente o mecanismo de sandbox citado para Linux/WSL2.
- **B) ❌** O sandbox não impede a avaliação das permission rules.
- **C) ✅** O cenário está literalmente no material: *"The sandbox cannot protect you when Claude actively reasons that the sandbox is the obstacle and decides to remove it. Because `--dangerously-skip-permissions` auto-approves that request, the sandbox becomes something Claude can simply opt out of."*
- **D) ❌** A regra de deny não é desativada pelo sandbox; o problema é a auto-aprovação de tudo.

**Palavras-gatilho:** `believing the two layers together prevent` = acreditando que as duas camadas juntas impedem; `opt out of` = optar por sair de.

---

### Q8 — Resposta: **D**
`TS 3.6 / 4.1` · objetivos #30 e #31 — falsos positivos

- **A) ❌** Rodar duas vezes reproduz o mesmo falso positivo nas duas — o erro é sistemático, não aleatório.
- **B) ❌** Confiança auto-reportada como filtro: sinal não confiável (e os falsos positivos costumam vir com confiança alta).
- **C) ❌** "Confira de novo" não adiciona critério — o modelo reconfere com a mesma régua vaga.
- **D) ✅** *"Flag SQL injection risks only when user input is passed directly to a query string without parameterization. Do not flag ORM calls or prepared statements."* Critério de inclusão **e** exclusão, aplicado como contexto persistente em toda revisão.

**Palavras-gatilho:** `false positive` = falso positivo; `exclusion criteria` = critérios de exclusão.

---

### Q9 — Resposta: **D**
`TS 3.2` · slash commands

- **A) ❌** Hook reage a tool call; não é um workflow que alguém invoca.
- **B) ❌** Permission rule autoriza ferramentas; não carrega prompt nem procedimento.
- **C) ❌** `CLAUDE.md` é contexto sempre carregado, não workflow invocável sob demanda.
- **D) ✅** Slash command versionado no projeto encapsula prompt, restrições e expectativa de saída, e fica disponível por nome para o time inteiro.

**Palavras-gatilho:** `reusable, parameterized` = reutilizável e parametrizável.

---

### Q10 — Resposta: **B**
`TS 3.5 / 5.4` · objetivo #17 — exploração de codebase

- **A) ❌** Ler tudo sequencialmente estoura a janela — é o cenário que a pergunta pede para evitar.
- **B) ✅** Glob localiza candidatos por nome, Grep encontra as ocorrências, Read carrega **só** o que a busca apontou. Entendimento incremental com custo de contexto controlado.
- **C) ❌** Responder de conhecimento geral ignora **este** código. É alucinação com boa aparência.
- **D) ❌** `cat` do repositório inteiro é a versão pior da mesma coisa: todo o ruído entra no contexto.

**Palavras-gatilho:** `blow the context window` = estourar a janela de contexto.

---

### Q11 — Resposta: **A**
`TS 3.1` · CLAUDE.md

- **A) ✅** `CLAUDE.md` existe para ser o contexto persistente do projeto, carregado em toda sessão sem ninguém colar nada.
- **B) ❌** Hook dispara em tool call, não no início da sessão com contexto de projeto.
- **C) ❌** Variável de ambiente entrega valor a processos, não orientação ao modelo.
- **D) ❌** Skill precisa ser invocada — falha o requisito "em toda sessão, sem ação humana".

**Palavras-gatilho:** `without anyone pasting them` = sem ninguém colá-las.

---

### Q12 — Resposta: **D**
`TS 3.5` · objetivo #15 — qualidade de testes gerados

- **A) ❌** Elevar o limiar de cobertura premia justamente o teste trivial que já existe.
- **B) ❌** Mais testes triviais é mais do mesmo problema com cobertura ainda mais enganosa.
- **C) ❌** Modelo maior sem critério continua sem saber o que o time considera um bom teste.
- **D) ✅** O objetivo é literal: arquivos de teste existentes como contexto, convenções de fixture, e **critério explícito** do que separa asserção comportamental de asserção trivial.

**Palavras-gatilho:** `returns without throwing` = retorna sem lançar exceção; `trivial assertions` = asserções triviais.

---

### Q13 — Resposta: **A**
`TS 3.1` · Settings Scope

- **A) ✅** *"Local Settings: personal project-specific preferences, not checked into git"* — `<repo>/.claude/settings.local.json`. É exatamente o caso.
- **B) ❌** `~/.claude/settings.json` valeria para todos os projetos, não só este.
- **C) ❌** `.claude/settings.json` é o escopo **compartilhado** do time e vai para o git.
- **D) ❌** Managed é organizacional, gerido por IT/DevOps.

**Palavras-gatilho:** `this project only` = apenas este projeto; `must never reach` = nunca pode chegar a.

---

### Q14 — Resposta: **B**
`TS 3.1` · Bare Name Tool Rules

- **A) ❌** O nome nu é uma forma válida — e a mais ampla.
- **B) ✅** *"The bare tool name with no parentheses = total coverage. No domain filtering, no patterns."* `Read` = todas as leituras, todos os arquivos.
- **C) ❌** Restringir à raiz exigiria um padrão de caminho.
- **D) ❌** `.gitignore` afeta os padrões das regras de Read/Edit, não transforma o nome nu em regra filtrada.

**Palavras-gatilho:** `bare` = nu/sem adornos; `total coverage` = cobertura total.

---

### Q15 — Resposta: **D**
`TS 3.1` · WebFetch Rules

- **A) ❌** Bloquear `curl` não cobre a tool WebFetch, que não passa pelo shell.
- **B) ❌** Regra de Read trata sistema de arquivos, não rede.
- **C) ❌** WebSearch é outra tool; negá-la não controla de onde o WebFetch busca.
- **D) ✅** *"The WebFetch tool… takes a domain name"* — `WebFetch(domain:example.com)`, com allow/ask/deny por domínio.

**Palavras-gatilho:** `internal documentation host` = servidor interno de documentação.

---

### Q16 — Resposta: **A**
`TS 3.4` · Permission Modes

- **A) ✅** *"acceptEdits — automatically accepts file edit permissions for the session."* Comandos de shell continuam pedindo confirmação.
- **B) ❌** `plan` impede modificação de arquivo — o oposto do pedido.
- **C) ❌** `dontAsk` auto-**nega** o que não está pré-aprovado; não é auto-aceitar.
- **D) ❌** `bypassPermissions` pula **todos** os prompts, inclusive Bash.

**Palavras-gatilho:** `while still prompting for` = continuando a pedir confirmação para.

---

### Q17 — Resposta: **A**
`TS 3.1 / 3.3 / 5.4` · objetivo #16

- **A) ✅** Separa por **quando a orientação se aplica**: o sempre-relevante em `CLAUDE.md`, o condicional em path-specific rules e skills, e o compartilhado por import em vez de duplicado. Ataca custo de contexto e o "lost in the middle" ao mesmo tempo.
- **B) ❌** Colar manualmente a cada sessão desfaz o propósito do `CLAUDE.md`.
- **C) ❌** Mover para o system prompt não reduz nada: o custo e o efeito de meio continuam.
- **D) ❌** Importar os cinco no topo carrega exatamente o mesmo volume — só reorganiza os arquivos.

**Palavras-gatilho:** `always-relevant` = sempre relevante; `load when relevant` = carregar quando for relevante.

---

### Q18 — Resposta: **C**
`TS 3.6` · objetivo #11

- **A) ❌** Prompt curto não limita quantos turnos o agente vai gastar num PR gigante.
- **B) ❌** Runner mais rápido paga a mesma conta de tokens mais depressa.
- **C) ✅** O objetivo cita explicitamente *"cost and turn limits that prevent runaway executions"* como parte da configuração de CI/CD.
- **D) ❌** Formato de saída não tem relação com consumo.

**Palavras-gatilho:** `runaway` = descontrolada; `far more tokens than budgeted` = muito mais tokens que o orçado.

---

### Q19 — Resposta: **C**
`TS 3.6` · objetivo #13

- **A) ❌** `bypassPermissions` + revisão manual falha os dois requisitos.
- **B) ❌** Reverter depois é limpeza de estrago, não prevenção.
- **C) ✅** O objetivo pede configuração que *"restrict unnecessary tool access and produce structured output suitable for automated downstream processing"*. Restrição por permissão + JSON.
- **D) ❌** Pedir no prompt não impede a edição; e markdown parseado é frágil.

**Palavras-gatilho:** `without the ability to` = sem a capacidade de; `a script can consume` = um script consegue consumir.

---

### Q20 — Resposta: **A**
`TS 2.5 / 3.5` · objetivo #32 — built-in tools

- **A) ✅** *"Glob → find files by pattern."* Busca por **nome** de arquivo.
- **B) ❌** Read carrega um arquivo que você já sabe qual é.
- **C) ❌** Grep busca **dentro** do conteúdo dos arquivos.
- **D) ❌** WebSearch busca na internet.

**Palavras-gatilho:** `whose name matches` = cujo nome corresponde a.

---

### Q21 — Resposta: **D**
`TS 3.5` · objetivo #12 — refinamento iterativo

- **A) ❌** "Estava errado, siga nossas convenções" repete a vaguidade que causou o erro.
- **B) ❌** Reescrever do zero descarta a parte que estava certa e reintroduz o mesmo risco.
- **C) ❌** Julgamento de qualidade sem conteúdo acionável não muda nada.
- **D) ✅** O objetivo pede *"concrete input-output examples, targeted feedback on specific failures"*. Exemplo concreto + falha específica é o par que corrige.

**Palavras-gatilho:** `most likely to produce` = com maior probabilidade de produzir.

---

### Q22 — Resposta: **B**
`TS 3.5` · objetivo #12 — feedback em lote

- **A) ❌** Torcer para o resto se resolver sozinho não é estratégia.
- **B) ✅** O objetivo cita *"batched issue descriptions for consolidated evaluation"*: os oito problemas juntos permitem uma correção coerente, sem que a correção de um quebre outro.
- **C) ❌** Um por vez multiplica os turnos e arrisca regressões entre correções.
- **D) ❌** Recomeçar do prompt original volta ao mesmo resultado.

**Palavras-gatilho:** `consolidated` = consolidada; `at a time` = de cada vez.

---

### Q23 — Resposta: **C**
`TS 2.4 / 3.1` · MCP Server Controls

- **A) ❌** `.mcp.json` é o que se quer restringir, não o lugar da restrição.
- **B) ❌** Local settings é o escopo mais fraco.
- **C) ✅** Existe uma allowlist de servidores MCP **exclusiva de managed settings**: *"Allowlist of MCP servers users may configure. Undefined = no restrictions. Empty array = lock down all MCP servers."* E existe uma denylist que tem precedência sobre ela.
- **D) ❌** Settings de usuário é sobrescrevível pelo próprio usuário.

**Palavras-gatilho:** `by any user in any project` = por qualquer usuário em qualquer projeto.

---

### Q24 — Resposta: **D**
`TS 3.1` · Session & Storage Settings

- **A) ❌** Não é preciso apagar diretório: o valor 0 já desabilita a persistência.
- **B) ❌** É configurável; 30 dias é apenas o padrão.
- **C) ❌** `/rename` apenas rotula a sessão; não controla se ela é gravada.
- **D) ✅** *"Delete sessions inactive for more than N days (default: 30). Set to 0 to delete ALL transcripts at startup and disable persistence entirely. When 0: no new .jsonl files written, /resume shows nothing, hooks get empty transcript_path."*

**Palavras-gatilho:** `persist no transcripts at all` = não persistir transcrição nenhuma.

---

### Q25 — Resposta: **D**
`TS 2.5` · objetivo #32

- **A) ❌** Read carrega um arquivo específico; não busca.
- **B) ❌** `find` localiza por nome/atributo e exige permissão de Bash — ferramenta errada para conteúdo.
- **C) ❌** Glob acha arquivos por nome, não por conteúdo.
- **D) ✅** *"Grep → search inside files."* Busca por padrão **no conteúdo**.

**Palavras-gatilho:** `search the contents of` = buscar no conteúdo de.

---

### Q26 — Resposta: **C**
`TS 5.4` · Compact and Clear

- **A) ❌** `/rename` só rotula; não libera contexto.
- **B) ❌** `/rewind` volta no tempo — perde as duas horas de progresso.
- **C) ✅** *"/compact — create a summarized conversation to save tokens."* Preserva a linha de trabalho reduzindo tokens.
- **D) ❌** `/clear` apagaria justamente o trabalho que ainda importa.

**Palavras-gatilho:** `nearly full` = quase cheio; `do not want to lose` = não querem perder.

---

### Q27 — Resposta: **C**
`TS 5.4` · Compact and Clear

- **A) ❌** `/compact` resume e mantém o fio — haveria carry-over.
- **B) ❌** `/rewind` é para voltar dentro da mesma tarefa.
- **C) ✅** *"/clear — clear the current conversation. Clear will not clear out CLAUDE.md files or AutoMemory."* Exatamente o pedido: zera a conversa, mantém a orientação do projeto.
- **D) ❌** Reiniciar o terminal não é "a única forma" — `/clear` existe para isso.

**Palavras-gatilho:** `no carry-over` = sem resquício/herança; `in effect` = em vigor.

---

### Q28 — Resposta: **B**
`TS 3.1`

- **A) ❌** Settings pessoal não alcança os colegas.
- **B) ✅** Regra de projeto, válida para toda sessão no repositório e revisável em code review → `CLAUDE.md` versionado.
- **C) ❌** Comentário em YAML de CI não é lido como contexto pelo agente.
- **D) ❌** `settings.local.json` não vai para o git — invisível em code review.

**Palavras-gatilho:** `visible in code review` = visível na revisão de código.

---

### Q29 — Resposta: **C**
`TS 1.7 / 3.5` · Rename and Rewind

- **A) ❌** `/compact` resume o histórico; não desfaz decisões.
- **B) ❌** `/resume` retoma **outra** sessão anterior; não navega dentro da atual.
- **C) ✅** *"/rewind restore a session to an older point."*
- **D) ❌** `/clear` apaga tudo, inclusive os nove turnos bons antes do erro.

**Palavras-gatilho:** `built on that mistake` = construído sobre aquele erro.

---

### Q30 — Resposta: **C**
`TS 3.3` · objetivo #16

- **A) ❌** Deny bloqueia a edição — não é orientação, é proibição.
- **B) ❌** Skill exige que alguém lembre de invocar.
- **C) ✅** Path-specific rule com glob é o mecanismo de guidance condicional por caminho — carrega quando os arquivos casam e fica fora do caminho no resto do tempo.
- **D) ❌** Seção no `CLAUDE.md` é carregada sempre, em toda sessão.

**Palavras-gatilho:** `invisible the rest of the time` = invisível no resto do tempo.

---

### Q31 — Resposta: **A**
`TS 3.1` · Model Settings

- **A) ✅** São duas configurações distintas: sobrescrever o modelo padrão de todas as sessões, e restringir quais modelos podem ser escolhidos via `/model`, `--model`, Config tool ou `ANTHROPIC_MODEL`.
- **B) ❌** Não são exclusivas de managed settings.
- **C) ❌** Restringir o seletor é configurável.
- **D) ❌** ⚠️ Pegadinha: a doc diz explicitamente que a restrição *"does NOT affect the 'Default' option in the model picker"*.

**Palavras-gatilho:** `restricts which models users can pick` = restringe quais modelos os usuários podem escolher.

---

### Q32 — Resposta: **C**
`TS 3.1` · Permission Rules

- **A) ❌** `ask` deixa a porta aberta — o requisito é "sem exceções".
- **B) ❌** `.gitignore` impede commit, não leitura. (E padrões de Read/Edit seguem a **especificação** do gitignore — o que não é a mesma coisa que respeitar o arquivo.)
- **C) ✅** Deny é avaliado primeiro e é a regra mais restritiva. É o que o material recomenda *"for sensitive files and dangerous commands"*.
- **D) ❌** Instrução em `CLAUDE.md` é enforcement por prompt.

**Palavras-gatilho:** `with no exceptions` = sem exceções.

---

### Q33 — Resposta: **D**
`TS 3.2` · objetivo #14 — `context: fork`

- **A) ❌** `CLAUDE.md` é contexto sempre presente, não workflow isolado.
- **B) ❌** `/compact` depois já pagou os tokens da saída longa e resume o resto junto.
- **C) ❌** Hook não é invocável por nome nem carrega instruções de workflow.
- **D) ✅** `context: fork` no frontmatter faz a Skill/slash command rodar em **contexto de subagente isolado**, evitando contaminação do estado da sessão. Só a conclusão volta.

**Palavras-gatilho:** `should not remain in` = não deve permanecer em.

---

### Q34 — Resposta: **A**
`TS 3.6 / 4.3` · objetivo #13

- **A) ✅** Execução não interativa com saída JSON + prompt que define os campos exatos de cada finding. O consumidor a jusante recebe registros, não prosa.
- **B) ❌** "Resumo claro e bem organizado" não define campo nenhum.
- **C) ❌** Log de terminal capturado é texto não estruturado com ruído de UI.
- **D) ❌** Regex sobre markdown quebra na primeira variação de formatação.

**Palavras-gatilho:** `one record per finding` = um registro por achado.

---

### Q35 — Resposta: **A**
`TS 3.6 / 3.3` · objetivo #13

- **A) ✅** O objetivo pede configurações de revisão que *"load the correct project standards"*. Sem escopo, o job carrega o guia errado para os arquivos em questão.
- **B) ❌** Permissão ampla não escolhe qual padrão carregar.
- **C) ❌** Formato de saída não tem relação com qual guia foi lido.
- **D) ❌** Não é capacidade do modelo: ele recebeu o guia errado como contexto.

**Palavras-gatilho:** `loads the wrong standards` = carrega os padrões errados.

---

### Q36 — Resposta: **C**
`TS 1.5 / 3.1` · Hooks Settings

- **A) ❌** Há desligamento global, não só remoção individual.
- **B) ❌** Podem ser desabilitados.
- **C) ✅** Existe uma configuração que *"disable ALL hooks and the custom status line (overrides everything below)"*, e em managed settings há o lockdown em que só hooks de managed-settings e do SDK rodam, bloqueando os de usuário/projeto/plugin.
- **D) ❌** Desinstalar é desnecessário.

**Palavras-gatilho:** `locked-down` = travado/restrito.

---

### Q37 — Resposta: **C**
`TS 3.1` · File I/O Settings

- **A) ❌** Não é exclusivo de managed settings.
- **B) ❌** Premissa invertida: o padrão é esconder.
- **C) ✅** *"Whether the @ file picker hides files matched by .gitignore (default: true). Set to false to show ALL files in the picker, including gitignored ones."*
- **D) ❌** Podem ser referenciados; a questão é o autocomplete escondê-los por padrão.

**Palavras-gatilho:** `never suggests` = nunca sugere.

---

### Q38 — Resposta: **C**
`TS 3.1 / 3.4` · Sandboxing

- **A) ❌** Sandbox e permissões são camadas complementares.
- **B) ❌** Falso, e é a suposição perigosa.
- **C) ✅** *"The sandbox only applies to the Bash tools. It does not restrict other tools — Read, Write, Edit, WebSearch, WebFetch, MCP tools, hooks, or internal commands."* Fato de alto valor: quem acha que o sandbox cobre tudo desenha um controle que não existe.
- **D) ❌** Rede é só um dos recursos controlados (há também espaço de armazenamento/memória e inspeção do host).

**Palavras-gatilho:** `does and does not cover` = o que cobre e o que não cobre.

---

### Q39 — Resposta: **B**
`TS 3.4` · objetivo #8

- **A) ❌** `bypassPermissions` "para não ser interrompido" troca segurança por conveniência sem necessidade.
- **B) ✅** Escopo pequeno + risco baixo + verificação automática → execução direta. Escolher pela proporção é o que o objetivo pede.
- **C) ❌** "Todo endpoint é mudança arquitetural" é regra absoluta que gera cerimônia onde não há risco.
- **D) ❌** Plan mode + workflow multi-fase é over-engineering para esse escopo.

**Palavras-gatilho:** `blast radius` = raio de impacto; `proportionate` = proporcional.

---

### Q40 — Resposta: **B**
`TS 4.1` · objetivo #31 — critérios explícitos

- **A) ❌** "E quaisquer problemas relacionados" **amplia** o escopo — convite a falso positivo e a mudança não pedida.
- **B) ✅** É o exemplo "very explicit" do material: sintoma, condição de reprodução, escopo do arquivo, **o que não mudar**, e a condição de pronto.
- **C) ❌** "Com cuidado e minuciosamente" são advérbios, não critérios.
- **D) ❌** Investigar e reportar é outra tarefa; não corrige o bug.

**Palavras-gatilho:** `Do not change` = não altere (⚠️ dizer o que **não** mudar é parte do critério explícito).

---

### Q41 — Resposta: **A**
`TS 5.4` · `/context`

- **A) ✅** *"/context shows tokens consumed in the current session and available tokens, broken down by category"* — mensagens, system, tools, skills.
- **B) ❌** `/resume` escolhe uma sessão anterior.
- **C) ❌** Não é o comando descrito no material para essa função.
- **D) ❌** `/compact` age sobre o contexto; não o inspeciona.

**Palavras-gatilho:** `consumed` = consumido; `by what` = por quê/por quais partes.

---

### Q42 — Resposta: **A**
`TS 5.4` · auto-compact buffer

- **A) ✅** *"The auto-compact buffer in Claude Code is a reserved portion of the model's context window that ensures there is enough headroom to summarize conversation history when limits are approached."* Por isso a sessão nova já aparece com parte reservada.
- **B) ❌** É observável — aparece no `/context`.
- **C) ❌** Não é bug; é comportamento documentado.
- **D) ❌** Não existe "índice do .gitignore" no contexto.

**Palavras-gatilho:** `reserved` = reservado; `headroom` = folga.

---

### Q43 — Resposta: **A**
`TS 3.1` · Settings Scope

- **A) ✅** *"User Settings: personal preferences for all projects — `~/.claude/settings.json`."* Todos os projetos, só a máquina dele.
- **B) ❌** Project settings é compartilhado com o time via git.
- **C) ❌** Managed é imposto pela organização.
- **D) ❌** Local settings vale só para **aquele** projeto.

**Palavras-gatilho:** `every project` = todos os projetos; `their machine only` = só na máquina dele.

---

### Q44 — Resposta: **A**
`TS 3.1` · Environment Variables Settings

- **A) ✅** *"Applied to every session — useful for secrets, tool config, feature flags."* É a seção de env do `settings.json`.
- **B) ❌** Hook por tool call é o lugar errado e o momento errado.
- **C) ❌** Exportar no shell depende de cada pessoa lembrar; não é configuração.
- **D) ❌** `CLAUDE.md` informa o modelo; não define ambiente de execução.

**Palavras-gatilho:** `applied to every session` = aplicadas a toda sessão.

---

### Q45 — Resposta: **B**
`TS 1.5 / 3.1` · Hooks

- **A) ❌** Comando manual no fim da sessão perde o que aconteceu no meio.
- **B) ✅** A própria doc de settings descreve definições de hook que *"run a shell command after every Bash tool use"* — é o `PostToolUse` aplicado a auditoria.
- **C) ❌** Permission rule autoriza ou nega; não executa efeito colateral.
- **D) ❌** Pedir ao modelo para logar é enforcement por prompt: falha silenciosamente.

**Palavras-gatilho:** `every ... invocation` = toda invocação.

---

### Q46 — Resposta: **B**
`TS 3.1` · Read and Edit Rules

- **A) ❌** Diretório atual é sem prefixo (ou `./`).
- **B) ✅** *"`/` Relative to project root. The most common style for project work. Anchored to wherever the repo root is, so it's portable across machines."*
- **C) ❌** Home é `~/`.
- **D) ❌** Absoluto da raiz do sistema é `//`.

**Palavras-gatilho:** `leading` = inicial (no início); `portable` = portátil.

---

### Q47 — Resposta: **D**
`TS 3.1` · Read and Edit Rules

- **A) ❌** `/` é raiz do projeto — muda conforme o repositório aberto.
- **B) ❌** Sem prefixo é o diretório de onde o Claude Code foi lançado.
- **C) ❌** `//` é raiz do sistema de arquivos.
- **D) ✅** *"`~/` From home directory. Useful for dotfiles, personal configs, and user-specific directories that are consistent across projects."*

**Palavras-gatilho:** `regardless of which project is open` = independentemente de qual projeto esteja aberto.

---

### Q48 — Resposta: **D**
`TS 3.6 / 4.3`

- **A) ❌** Humano no meio quebra a automação do gate.
- **B) ❌** Depender de o agente escolher o exit code é confiar em comportamento não garantido.
- **C) ❌** Grep por "blocker" casa com a palavra em qualquer lugar — inclusive numa frase que diz que **não** há blockers.
- **D) ✅** Campo de severidade em JSON estruturado; a decisão de falhar o build fica no script, com dado tipado. Determinístico.

**Palavras-gatilho:** `fail the build` = reprovar o build; `reliable` = confiável.

---

### Q49 — Resposta: **B**
`TS 2.4 / 3.1` · MCP Server Controls

- **A) ❌** Não é tudo-ou-nada: há aprovação seletiva.
- **B) ✅** O material distingue as duas configurações: *"Auto-approve ALL servers listed in project .mcp.json files"* e *"Approve only specific servers from .mcp.json"* (além de rejeitar servidores específicos).
- **C) ❌** Nada a ver com código-fonte do servidor.
- **D) ❌** Servidores de `.mcp.json` não são aprovados automaticamente por padrão.

**Palavras-gatilho:** `individually` = individualmente.

---

### Q50 — Resposta: **D**
`TS 3.4` · Permission Modes

- **A) ❌** `bypassPermissions` auto-aprova tudo.
- **B) ❌** `acceptEdits` auto-aceita edições — o oposto de negar.
- **C) ❌** `default` é justamente o que pergunta no primeiro uso de cada tool.
- **D) ✅** *"dontAsk — auto-denies tools unless pre-approved via /permissions or permissions.allow rules."* Nega em vez de perguntar.

**Palavras-gatilho:** `auto-deny` = negar automaticamente; `instead of interrupting` = em vez de interromper.

---

### Q51 — Resposta: **B**
`TS 5.1 / 5.4` · objetivo #20 — scratchpad

- **A) ❌** Colar a transcrição inteira reintroduz todo o custo de contexto que a compactação tinha removido.
- **B) ✅** O objetivo cita *"subagent isolation, scratchpad files, and targeted file reading"* para sustentar exploração coerente **além** dos limites de contexto. O arquivo é o estado durável entre sessões.
- **C) ❌** Reexplorar do zero é o desperdício que se quer evitar.
- **D) ❌** Sessão eterna com auto-compact degrada: a sumarização progressiva perde números e detalhes.

**Palavras-gatilho:** `accumulate` = acumular; `rather than restart` = em vez de recomeçar.

---

### Q52 — Resposta: **B**
`TS 3.6 / 3.1` · objetivo #13

- **A) ❌** Linha no system prompt é instrução, não garantia.
- **B) ✅** Regras de permissão negando Bash/Edit/Write são enforcement de configuração — independem do que o modelo decide.
- **C) ❌** Reverter depois é remediação, não prevenção.
- **D) ❌** Modelo menor tem as mesmas ferramentas.

**Palavras-gatilho:** `enforced by configuration rather than by prompt` = imposto por configuração, não por prompt.

---

### Q53 — Resposta: **C**
`TS 1.7` · Claude Code Sessions

- **A) ❌** Não exige exportar nem colar transcrição.
- **B) ❌** Não são permanentemente separadas.
- **C) ✅** *"A session started via Remote Control or Claude Code for Web can be continued locally via the IDE."*
- **D) ❌** Sessões web também são retomáveis.

**Palavras-gatilho:** `continued in` = continuada em.

---

### Q54 — Resposta: **D**
`TS 3.1` · `@import`

- **A) ❌** Symlink é truque de sistema de arquivos, não o mecanismo previsto.
- **B) ❌** Copiar cria duas cópias que divergem — o problema que a pergunta pede para evitar.
- **C) ❌** Hook de início de sessão concatenando arquivos é solução caseira para algo que já existe.
- **D) ✅** `CLAUDE.md` suporta importar outro arquivo, mantendo uma única fonte da verdade para o documento compartilhado.

**Palavras-gatilho:** `without duplicating` = sem duplicar.

---

### Q55 — Resposta: **A**
`TS 2.4 / 3.1` · MCP Rules
✅ *Verificado na doc oficial: https://code.claude.com/docs/en/permissions.md*

- **A) ✅** `mcp__<server_name>` casa com **qualquer tool fornecida por aquele servidor**. Existe também `mcp__<server>__<tool>` para uma tool específica, e glob na posição do nome da tool (`mcp__*` casa com toda tool MCP de todos os servidores).
- **B) ❌** Não é casamento por prefixo de nome de servidor; é o servidor exato.
- **C) ❌** Não é o nome de uma tool: é o prefixo do servidor.
- **D) ❌** O nome da tool é opcional — sem ele, cobre o servidor inteiro.

**Palavras-gatilho:** `cover` = abranger.

---

### Q56 — Resposta: **D**
`TS 3.6 / 4.1`

- **A) ❌** Elevar o limite de turnos paga por uma revisão de repositório inteiro que ninguém pediu.
- **B) ❌** "O que parecer relevante" é vago — gera revisão inconsistente entre execuções.
- **C) ❌** Deixar o agente descobrir o diff gasta turnos para obter algo que o CI já tem pronto.
- **D) ✅** O pipeline sabe o diff; passá-lo como escopo explícito é determinístico e barato. Critério explícito, não descoberta.

**Palavras-gatilho:** `only the files changed` = apenas os arquivos alterados.

---

### Q57 — Resposta: **B**
`TS 1.5 / 3.1` · objetivo #16

- **A) ❌** Skill organiza um workflow; não impede a execução fora dele.
- **B) ✅** "Nunca contra produção sem ticket aprovado" é **garantia**. Garantia é gate/hook, verificando um estado externo — não texto que o modelo lê.
- **C) ❌** `CLAUDE.md` é sempre carregado, mas continua sendo instrução.
- **D) ❌** `ask` melhora, mas depende de o humano avaliar corretamente a cada vez, e não verifica a existência do ticket. Em automação, ninguém responde ao prompt.

**Palavras-gatilho:** `must never` = nunca pode; `regardless of what the model decides` = independentemente do que o modelo decidir.

---

### Q58 — Resposta: **C**
`TS 3.1` · Output and Language Settings

- **A) ❌** O modelo não lê variáveis de ambiente por conta própria.
- **B) ❌** Permissões não têm dimensão de idioma.
- **C) ✅** Existe uma configuração de *"Claude's preferred response language"* no `settings.json` (ao lado do output style, que ajusta o system prompt).
- **D) ❌** `/rename` rotula a sessão.

**Palavras-gatilho:** `while keeping` = mantendo.

---

### Q59 — Resposta: **B**
`TS 3.5 / 4.2` · objetivo #12

- **A) ❌** "Mais consistente" não define com o quê.
- **B) ✅** Exemplo concreto entrada→saída é o mecanismo que ancora formato e nomenclatura (few-shot aplicado ao refinamento).
- **C) ❌** Link para a home do guia não coloca o conteúdo no contexto.
- **D) ❌** "Siga nosso estilo" pressupõe que o modelo saiba qual é.

**Palavras-gatilho:** `house style` = estilo da casa (convenção interna); `exactly` = exatamente.

---

### Q60 — Resposta: **B**
`TS 3.3` · objetivo #16 — escolha do mecanismo

- **A) ❌** `CLAUDE.md` carrega em toda sessão orientação que só vale num diretório.
- **B) ✅** Dois critérios decidem: **quando se aplica** (só em `db/migrations/`) e **que tipo de orientação é** (advisory). Condicional + advisory = path-specific rule.
- **C) ❌** Negar edições impede o trabalho em vez de orientá-lo.
- **D) ❌** Hook é para garantia. O enunciado diz explicitamente que é advisory — usar hook aqui é over-engineering, e ainda quebra migrações legítimas sem rollback.

**Palavras-gatilho:** `advisory rather than a hard guarantee` = orientativa, não uma garantia rígida (⚠️ é o que descarta o hook).

---

## Autoavaliação

| Acertos | Leitura |
|---|---|
| 54–60 (90%+) | Domínio sólido. |
| 43–53 (72–89%) | Faixa de aprovação. Disseque cada erro. |
| 30–42 (50–71%) | Releia settings scope, permission rules e escolha de mecanismo (3.1/3.3). |
| < 30 | Refaça a teoria antes de nova rodada. |

**A pergunta que mais cai neste domínio:** *qual mecanismo?* — `CLAUDE.md` (sempre), path-specific rule (condicional por caminho), Skill/slash command (workflow invocável), hook (garantia), permission rule (autorização). Decida sempre por **quando se aplica** e **se precisa ser garantia**.
