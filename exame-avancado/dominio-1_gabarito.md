# Gabarito — Bloco 1

**Domínio 1 — Agentic Architecture & Orchestration (peso 27%)**

Fontes: `livro01.pdf`, `livro02.pdf`, objetivos de `livro03.md`.
Cada entrada traz: resposta · task statement do guia oficial · objetivo do livro03 ·
por que cada alternativa está certa ou errada · **palavras-gatilho** (leia só depois de responder).

---

### Q1 — Resposta: **D**
`TS 1.1 — loops agênticos (stop_reason)` · anti-pattern "check text contents"

- **A) ❌** Over-engineering clássico: um classificador de ML para um campo que a API já devolve pronto.
- **B) ❌** Enforcement por prompt. Mesmo instruído, o modelo pode emitir texto antes do `tool_use` — o material é explícito: "even since you said 'never call' it may still".
- **C) ❌** Cap de iteração não é lógica de controle, é rede de segurança. Não resolve o critério de parada errado.
- **D) ✅** `stop_reason` é o sinal **determinístico** do protocolo. `tool_use` significa "quero chamar uma função"; `end_turn` significa "terminei". Enquanto for `tool_use`, o programa executa a tool e devolve o `tool_result`.

**Palavras-gatilho:** `exits before` = sai antes de; `filler text` = texto de enchimento; `never run` = nunca chega a executar.

---

### Q2 — Resposta: **D**
`TS 1.1` · objetivo #1 — múltiplas tool calls no mesmo turno

- **A) ❌** `max_tokens` limita o tamanho da resposta, não a concorrência.
- **B) ❌** Fundir três tools numa só é rígido: perde a granularidade e só funciona para este caso específico.
- **C) ❌** Trocar de modelo muda raciocínio e custo, não o número de idas e voltas. A latência aqui é serialização, não velocidade do modelo.
- **D) ✅** Subtarefas independentes devem sair como **várias tool calls no mesmo turno do assistente**, executadas em paralelo, e voltar como vários `tool_result`. Corta os round-trips de 3 para 1.

**Palavras-gatilho:** `none depends on the others` = nenhuma depende das outras (⚠️ é o gatilho de paralelismo); `round-trip` = ida e volta.

---

### Q3 — Resposta: **D**
`TS 1.3 — spawn/Task/context passing` · objetivo #3

- **A) ❌** Não existe "chamada de carregamento de memória". Subagente não tem memória entre invocações.
- **B) ❌** Ferramenta não é o problema: mesmo com Read, ele não sabe **quais** arquivos ler.
- **C) ❌** Contexto do coordenador não é passado nem parcialmente — não é questão de ter enchido.
- **D) ✅** Regra dura do material: *"subagents do not automatically inherit parent context or share memory between invocations"*. "The documents we discussed" não existe para o subagente.

**Palavras-gatilho:** `we discussed` = que discutimos (referência a contexto que o subagente não tem); `as before` = como antes.

---

### Q4 — Resposta: **B**
`TS 1.4 / 1.5 — enforcement e hooks` · objetivo de gates programáticos

- **A) ❌** Confiar no auto-relato do agente. Sinal não confiável.
- **B) ✅** *"A gate is the concept: don't let this run until that is done. A hook is the mechanism."* `PreToolUse` bloqueia a chamada — garantia estrutural, não pedido.
- **C) ❌** Um booleano que o **próprio agente preenche** não é verificação — é o mesmo auto-relato com outra roupa.
- **D) ❌** O arquétipo mais cobrado da prova: **enforcement por prompt onde o requisito é garantia**. Já falhou 3 vezes; reposicionar o texto não muda a natureza.

**Palavras-gatilho:** `must never` = nunca pode; `guarantees` = garante (⚠️ pede mecanismo determinístico, não instrução).

---

### Q5 — Resposta: **A**
`TS 1.7 / 5.3` · objetivo #9 — persistência de estado para retomada

- **A) ✅** Estado durável por etapa, fora da conversa. Na retomada, pula o que já tem saída gravada.
- **B) ❌** Paralelizar não preserva trabalho concluído — só muda quando as perdas acontecem.
- **C) ❌** Resumo em linguagem natural na conversa não é registro confiável: some com compactação e não é verificável.
- **D) ❌** Retry ataca falha transitória, não retomada depois do crash do processo.

**Palavras-gatilho:** `discarding` = descartando; `from the beginning` = do começo.

---

### Q6 — Resposta: **D**
`TS 1.6 — decomposição` · Narrow Task Decomposition ⚠️ **seu ponto mais fraco (0/6)**

- **A) ❌** Não houve descarte por confiança: os temas nunca foram pesquisados.
- **B) ❌** Paralelo vs sequencial não tem relação com cobertura temática.
- **C) ❌** Subagentes não compartilham janela de contexto — é exatamente o contrário.
- **D) ✅** O material chama isso de *narrow decomposition*: o coordenador só delega o que pensou em perguntar, e como **cada subagente vê só seu contexto isolado, nenhum consegue sinalizar o que falta**.

**Palavras-gatilho:** `never mentions` = nunca menciona; `too narrow` = estreita demais; `flag what's missing` = sinalizar o que falta.

---

### Q7 — Resposta: **B**
`TS 1.4` · objetivo #4 — goal-oriented vs procedural

- **A) ❌** Remenda o sintoma. O quarto passo ainda é um passo fixo — o próximo caso quebra igual.
- **B) ✅** Prompt procedural transforma o coordenador em executor de script: *"breaks when inputs are missing"*. Objetivo + critério de qualidade permite decidir o caminho e re-delegar.
- **C) ❌** Timeout ataca lentidão, não ausência de resultado útil.
- **D) ❌** Reordenar mantém a rigidez e ainda inverte a dependência.

**Palavras-gatilho:** `still calls` = mesmo assim chama; `empty analysis` = análise vazia.

---

### Q8 — Resposta: **C**
`TS 1.3 / 2.3` · objetivo #5 — restrição de tools no subagente

- **A) ❌** Plan mode é modo de sessão do Claude Code, não configuração de subagente — e não é o mecanismo de restrição aqui.
- **B) ❌** Modelo não define capacidade de escrita. Haiku com Edit edita.
- **C) ✅** `allowedTools` é *"enforced at the platform level"*. O subagente não tem como editar se a ferramenta não existe para ele.
- **D) ❌** Enforcement por prompt. Presença de tool implica permissão para o modelo — se Edit estiver lá, ele usa.

**Palavras-gatilho:** `regardless of what its prompt says` = independentemente do que o prompt diga (⚠️ pede enforcement de plataforma).

---

### Q9 — Resposta: **B**
`TS 1.7 / 5.1` · objetivo #2 — retomada de sessão

- **A) ❌** Ele só detecta se abrir os arquivos — e a premissa é que ele já propôs mudanças sem abrir.
- **B) ✅** *"Claude is unaware of how much time has past or any changes that may have occurred."* A retomada restaura a **conversa**, não o mundo. Resumo estruturado + re-leitura dirigida.
- **C) ❌** `/compact` resume a conversa; não consulta o repositório nem detecta mudanças externas.
- **D) ❌** Sessão retomada lê arquivos normalmente. O problema é não saber que precisa reler.

**Palavras-gatilho:** `overnight` = durante a noite; `already rewrote` = já reescreveu; `elapsed time` = tempo decorrido.

---

### Q10 — Resposta: **A**
`TS 1.6` · objetivo #7 — decomposição dinâmica

- **A) ✅** *"Dynamic adaptive decomposition: when intermediate findings should change what you do next."* Investigação de incidente é o caso canônico.
- **B) ❌** Contexto grande não substitui decisão adaptativa sobre o que investigar.
- **C) ❌** Prompt chaining serve quando *"the shape of the work is fixed regardless of content"* — o enunciado diz o oposto.
- **D) ❌** Cinco vezes o mesmo prompt gera sobreposição e desperdício, sem profundidade adicional.

**Palavras-gatilho:** `do not know in advance` = não sabem de antemão; `may raise new questions` = pode levantar novas perguntas.

---

### Q11 — Resposta: **B**
`TS 1.2 / 1.6` · Partitioning Research

- **A) ❌** Respostas mais curtas continuam sendo as mesmas três respostas.
- **B) ✅** *"If you give three research agents the same brief, you get three overlapping answers and wasted tokens. Carve up the scope so each agent owns a distinct slice."*
- **C) ❌** Reduz custo mas também cobertura — desiste do paralelismo em vez de usá-lo direito.
- **D) ❌** Deduplicar no fim já pagou os tokens. Trata sintoma.

**Palavras-gatilho:** `same brief` = mesmo briefing; `different wording` = redação diferente; `non-overlapping` = sem sobreposição.

---

### Q12 — Resposta: **B**
`TS 1.2 / 1.6` · Refinement Loop

- **A) ❌** "Seja minucioso" é instrução vaga — nenhum critério verificável.
- **B) ✅** O material é específico: `evaluate_coverage` *"forces the coordinator to commit to a score and a gap list in structured output before the loop can continue"*. Sem essa função forçante, não há mecanismo de reconhecer incompletude nem registro do que já foi tentado.
- **C) ❌** Mais agentes na primeira passada amplia cobertura por sorte, não fecha lacuna identificada.
- **D) ❌** Confiança auto-reportada é sinal não confiável — arquétipo clássico de distrator.

**Palavras-gatilho:** `one-shot` = de uma passada só; `quality bar` = barra de qualidade; `gap list` = lista de lacunas.

---

### Q13 — Resposta: **B**
`TS 1.7` · Fork-based session management

- **A) ❌** `/clear` apaga a conversa — perderia justamente a análise que se quer reaproveitar.
- **B) ✅** Fork parte de um estado comum e cria ramos independentes, *"each with their own uuids and history we can resume"*, isolados e paralelizáveis.
- **C) ❌** Sequencial no mesmo histórico contamina: cada tentativa vê a anterior.
- **D) ❌** "Manter separado mentalmente" não é isolamento, é esperança.

**Palavras-gatilho:** `without any branch contaminating` = sem que nenhum ramo contamine; `same completed analysis` = mesma análise já concluída.

---

### Q14 — Resposta: **D**
`TS 1.3` · objetivo #6 — diagnóstico de spawn mal configurado

- **A) ❌** Ordem de declaração no arquivo não é um fator.
- **B) ❌** Prompt curto piora a seleção, não impede a invocação.
- **C) ❌** `max_tokens` não bloqueia chamada de tool.
- **D) ✅** Sem a tool Agent no conjunto do coordenador, não existe **mecanismo** de spawn. Definir agentes e mandar delegar não cria o canal.

**Palavras-gatilho:** `never invokes` = nunca invoca; `wiring` (do objetivo) = ligação/fiação entre coordenador e subagente.

---

### Q15 — Resposta: **D**
`TS 1.2` · Hub-and-Spoke / Observability

- **A) ❌** Log estruturado ajuda, mas com conexões diretas continua não havendo camada única para capturar erro nem controlar o que cruza fronteira.
- **B) ❌** Histórico completo para todos explode contexto e não resolve rastreio.
- **C) ❌** Agente único descarta isolamento de contexto e especialização de papel.
- **D) ✅** *"Coordinator the single choke point: every message in, every message out, every failure — all flow through one place you can inspect and control."*

**Palavras-gatilho:** `directly` = diretamente; `choke point` = ponto único de passagem.

---

### Q16 — Resposta: **D**
`TS 1.1` · anti-pattern "arbitrary iteration cap"

- **A) ❌** Sem cap, um loop travado roda indefinidamente. O cap tem função, só não é a de controle.
- **B) ❌** Percentual auto-estimado é sinal não confiável.
- **C) ❌** Qualquer número fixo erra nos dois sentidos — corta tarefa complexa e sobra na simples.
- **D) ✅** *"You can have a cap of iterations. But ensure you use stop reason alongside it."* Cap = segurança; `stop_reason` = controle.

**Palavras-gatilho:** `silently truncated` = truncadas silenciosamente; `keep looping` = continuam em loop; `backstop` = salvaguarda.

---

### Q17 — Resposta: **D**
`TS 3.4 / 1.4` · objetivo #8 — arquitetura de revisão

- **A) ❌** `acceptEdits` aceita as edições automaticamente — a revisão vira post-mortem de 40 arquivos.
- **B) ❌** `/rewind` desfaz depois; o requisito é aprovar **antes** de qualquer modificação.
- **C) ❌** `bypassPermissions` remove toda a barreira. O oposto do requisito.
- **D) ✅** *"plan — Plan Mode: Claude can analyze but not modify files or execute commands."* Escopo grande + risco alto + aprovação humana obrigatória = plan mode.

**Palavras-gatilho:** `before any file is modified` = antes que qualquer arquivo seja modificado.

---

### Q18 — Resposta: **B**
`TS 1.4 / 5.2 / 5.5` · Handoff Protocol

- **A) ❌** Transcrição crua é exatamente "cavar no histórico", só que terceirizado para o humano.
- **B) ✅** *"A handoff protocol is a structured package the agent assembles before escalating — it ensures whoever receives the escalation has everything they need without having to dig through conversation history."* Contexto + ações tentadas + bloqueio + decisão necessária.
- **C) ❌** Score de confiança não carrega contexto nem ações.
- **D) ❌** Mais curto sem estrutura piora: menos informação, mesma reconstrução.

**Palavras-gatilho:** `reconstructing the case` = reconstruir o caso; `dig through` = vasculhar.

---

### Q19 — Resposta: **A**
`TS 5.3` · Subagent Failure Recovery

- **A) ✅** *"Bad pattern: propagate everything. Better: retry locally, try fallback, escalate only if exhausted."*
- **B) ❌** Ignorar erro produz síntese sobre dados incompletos sem que ninguém saiba.
- **C) ❌** Reiniciar tudo por um erro transitório é o mesmo desperdício com custo maior.
- **D) ❌** Retornar vazio mascara a falha — e vazio por erro ≠ vazio válido (ver Q sobre `access_failure` vs `valid_empty`).

**Palavras-gatilho:** `transient` = transitório; `aborts` = aborta; `exhausted` = esgotadas (as tentativas).

---

### Q20 — Resposta: **C**
`TS 1.6` · Prompt Chaining

- **A) ❌** Decidir em runtime o que já se sabe fixo adiciona custo e variabilidade sem ganho.
- **B) ❌** Adaptativo só se paga quando os achados mudam o que fazer em seguida. Aqui não mudam.
- **C) ✅** *"Good for: document processing, content transformation, ETL pipelines, any task where the shape of the work is fixed regardless of content."* É literalmente o caso descrito.
- **D) ❌** Os quatro passos são dependentes em cadeia — não dá para paralelizar.

**Palavras-gatilho:** `regardless of the document's content` = independentemente do conteúdo do documento (⚠️ gatilho de pipeline fixo).

---

### Q21 — Resposta: **B**
`TS 1.2` · Dynamic Selection

- **A) ❌** Garante o contrário: prevê explicitamente múltiplos agentes.
- **B) ✅** É o prompt de seleção dinâmica do material: simples → agente único; multi-step → sequencial; independentes → paralelo. O coordenador escolhe a **forma** da orquestração em runtime.
- **C) ❌** Permissão de tool é `allowedTools`, não texto de prompt.
- **D) ❌** Agregação continua necessária — é outra etapa do ciclo de vida.

**Palavras-gatilho:** `use your judgment` = use seu julgamento; `passing results forward` = repassando os resultados adiante.

---

### Q22 — Resposta: **A**
`TS 1.2 / 1.6` · Dynamic Selection

- **A) ✅** *"Don't run full pipeline every time. Select only needed agents. Use agents only if they add value."*
- **B) ❌** Modelo barato para tudo degrada as consultas complexas — troca custo por qualidade no lugar errado.
- **C) ❌** Cache por string de consulta quase nunca acerta em linguagem natural, e não resolve o desperdício da primeira execução.
- **D) ❌** Reduzir contexto não reduz o número de agentes chamados.

**Palavras-gatilho:** `for every incoming query` = para toda consulta que chega; `add value` = agregar valor.

---

### Q23 — Resposta: **C**
`TS 1.3 / 2.1` · AgentDefinition

- **A) ❌** Controle de tools é `allowedTools`/`disallowedTools`.
- **B) ❌** O system prompt é campo separado; é a identidade e as regras de operação do agente.
- **C) ✅** *"description: what the coordinator sees when deciding whether to invoke this agent."* É uma **tool description** disfarçada — as mesmas regras valem: propósito, formato de entrada, limites de uso.
- **D) ❌** Não é texto de interface para o usuário final.

**Palavras-gatilho:** `wrong subagent` = subagente errado; `boundaries` = limites de uso.

---

### Q24 — Resposta: **A**
`TS 1.7` · Forking Sessions

- **A) ✅** *"Forking creates a new session ID while preserving the conversation history up to that point"* — e sem afetar a sessão original.
- **B) ❌** `/clear` zera a conversa (mantém `CLAUDE.md` e AutoMemory) — perde o histórico que se quer aproveitar.
- **C) ❌** ⚠️ `--continue` é **alias de `--resume`** segundo o material: continua a mesma sessão, não abre uma cópia.
- **D) ❌** `/compact` resume para economizar tokens; não cria ramo nem preserva o original separado.

**Palavras-gatilho:** `branch off` = ramificar; `untouched` = intacta.

---

### Q25 — Resposta: **D**
`TS 1.2` · Parallel vs Sequential

- **A) ❌** Fork serve para explorar caminhos alternativos, não para encadear dependências.
- **B) ❌** Em hub-and-spoke subagentes **nunca** se falam diretamente.
- **C) ❌** Paralelizar etapas dependentes produz entrada vazia nas seguintes.
- **D) ✅** *"Use sequential flow only when outputs depend on earlier steps."* Cada etapa consome a saída da anterior.

**Palavras-gatilho:** `consumes the previous stage's output` = consome a saída da etapa anterior.

---

### Q26 — Resposta: **A**
`TS 1.2` · Observability

- **A) ✅** O coordenador como choke point único é o que torna fluxo e falha inspecionáveis.
- **B) ❌** Falso: subagentes têm contexto **isolado**, não compartilhado.
- **C) ❌** Comunicação direta é justamente o que destrói a observabilidade.
- **D) ❌** Mesmo modelo não implica mesmo raciocínio nem visibilidade.

**Palavras-gatilho:** `which one returned nothing` = qual deles não retornou nada.

---

### Q27 — Resposta: **C**
`TS 1.1` · Appended Tool Results

- **A) ❌** Nova conversa descarta o histórico que dá sentido ao resultado.
- **B) ❌** Texto livre quebra o protocolo: o modelo espera o bloco tipado, casado com o `tool_use_id`.
- **C) ✅** *"Then you append the result of the data via 'type': 'tool_result'"* e chama a API de novo com a conversa atualizada. O loop continua.
- **D) ❌** O loop não terminou — `stop_reason` era `tool_use`, não `end_turn`.

**Palavras-gatilho:** `must do next` = deve fazer em seguida.

---

### Q28 — Resposta: **A**
`TS 1.4` · objetivo #4 — goal-oriented com critérios

- **A) ✅** B define o **objetivo** e o **critério do que é uma resposta completa** (caminhos, linhas, descrição, cobrir testes), deixando a estratégia de busca para o subagente. Adapta sem perder controle.
- **B) ❌** A remove ambiguidade e também adaptabilidade: se `processPayment` tiver outro nome em parte do repo, A não acha nada.
- **C) ❌** Inconsistência vem de critério ausente, não de sequência livre — e B tem critério.
- **D) ❌** Não são equivalentes: A fixa a sequência de tools, B fixa o resultado esperado.

**Palavras-gatilho:** `quality criteria` = critérios de qualidade; `including tests` = inclusive os testes.

---

### Q29 — Resposta: **C**
`TS 1.6` · validação de decomposição

- **A) ❌** Só na agregação é tarde: os subagentes já rodaram e gastaram.  (O material aceita checar **também** ali — mas a pergunta pede "antes de o trabalho começar".)
- **B) ❌** Listar todas as subtarefas possíveis é o oposto de decompor: vira pipeline fixo gigante.
- **C) ✅** *"To catch weak decomposition task we can implement a tool that will review it before proceeding forward to generate tasks."*
- **D) ❌** Repetir mais vezes uma decomposição ruim não a melhora.

**Palavras-gatilho:** `before work begins` = antes de o trabalho começar.

---

### Q30 — Resposta: **A**
`TS 1.7` · Resuming Sessions

- **A) ✅** *"Whenever you kill a session Claude in the IDE will provide the resume with the session_id."* `/resume` ou `claude --resume` restaura o histórico.
- **B) ❌** Não há replay automático de tool calls.
- **C) ❌** Sessões não são gravadas como markdown no repositório.
- **D) ❌** Sessões encerradas são retomáveis — é a funcionalidade central do tópico.

**Palavras-gatilho:** `kills` = encerra/mata; `pick it back up` = retomar.

---

### Q31 — Resposta: **C**
`TS 1.2` · Result Aggregation

- **A) ❌** Descartar tudo que é contraditado apaga informação boa junto com a ruim.
- **B) ❌** Concatenar empurra o conflito para o leitor — não é síntese.
- **C) ✅** É o prompt de agregação do material: *"Combine them into a single coherent response. Resolve any conflicts by preferring the most specific data."* Regra de conflito explícita e verificável.
- **D) ❌** Confiança auto-reportada como árbitro: sinal não confiável.

**Palavras-gatilho:** `disagree about` = discordam sobre; `most specific` = mais específico.

---

### Q32 — Resposta: **A**
`TS 1.3 / 2.3` · AgentDefinition

- **A) ✅** `allowedTools` / `disallowedTools` são *"enforced at the platform level"* — é o único par da lista que é estrutural.
- **B) ❌** Alias de modelo não define capacidade de ferramenta.
- **C) ❌** `name` e `description` orientam a **seleção** pelo coordenador; não impedem nada em runtime.
- **D) ❌** System prompt é instrução; instrução não é enforcement.

**Palavras-gatilho:** `structurally unable` = estruturalmente incapaz (⚠️ pede plataforma, não prompt).

---

### Q33 — Resposta: **B**
`TS 1.1` · Stop Reason

- **A) ❌** Ficar sem tokens é outro motivo de parada, não `end_turn`.
- **B) ✅** *"stop_reason: 'end_turn' is when the agent has decided to return you a result."* O loop encerra.
- **C) ❌** `end_turn` não significa aguardando confirmação; significa resposta final.
- **D) ❌** Querer chamar tool é `tool_use`.

**Palavras-gatilho:** `carries` = traz/carrega; `indicate` = indicar.

---

### Q34 — Resposta: **D**
`TS 5.6` · Raw Findings Dilemma

- **A) ❌** Contexto pequeno truncaria conteúdo; aqui o conteúdo chegou — o que sumiu foi a origem.
- **B) ❌** Verificar na web não recupera qual agente disse o quê.
- **C) ❌** Ordem de execução não afeta atribuição.
- **D) ✅** *"When you pass raw findings between agents as a single blob of text, attribution gets lost… by the time the final output is written, the provenance is gone."* Solução: objetos estruturados em que conteúdo e metadado viajam juntos.

**Palavras-gatilho:** `blob of text` = bloco único de texto; `traced to a source` = rastreada até uma fonte.

---

### Q35 — Resposta: **C**
`TS 1.2` · objetivo #1 / Parallel Tool Calls

- **A) ❌** Fundir em um agente perde isolamento e volta a ser um trabalho longo único.
- **B) ❌** Terminais manuais não é uma configuração de orquestração — e não escala.
- **C) ✅** Módulos independentes → execução concorrente. *"Run subagents in parallel when tasks are independent (no shared dependencies)."*
- **D) ❌** Sequencial soma as latências, seja o prompt curto ou longo.

**Palavras-gatilho:** `wall-clock time` = tempo de relógio (tempo real decorrido); `independent` = independentes.

---

### Q36 — Resposta: **C**
`TS 1.3 / 5.3` · Parallel Tool Calls / isolamento

- **A) ❌** Não há memória compartilhada para replay.
- **B) ❌** O pai não herda o contexto do subagente ao término — recebe o resultado.
- **C) ✅** *"Each agent runs in their own loop… we might not be able to see what the internal loop is doing."* Logo, o que precisa ser visível tem que ser **parte da saída** do subagente.
- **D) ❌** Sequencial não expõe o loop interno; só muda a ordem.

**Palavras-gatilho:** `only its final output` = apenas a saída final dele.

---

### Q37 — Resposta: **D**
`TS 1.5` · Programmatic Enforcement ⚠️ **tópico com 33% de acerto seu**

- **A) ❌** Checar depois da migração descobre o problema quando ele já aconteceu.
- **B) ❌** Ordem no prompt é sugestão.
- **C) ❌** Tool description também é texto para o modelo ler — não impede a chamada.
- **D) ✅** Gate + hook: *"Programmatic enforcement via prerequisite gates makes it structurally impossible to skip."* O hook dispara antes da tool e bloqueia.

**Palavras-gatilho:** `structurally impossible to skip` = estruturalmente impossível de pular.

---

### Q38 — Resposta: **D**
`TS 1.6` · Adaptive Investigation Plan

- **A) ❌** Observabilidade não é o critério de escolha aqui; adaptabilidade é. (E um plano adaptativo continua observável via coordenador.)
- **B) ❌** Mais etapas fixas continuam sendo um plano fixo.
- **C) ❌** Adaptativo não exige contexto compartilhado — subagentes seguem isolados.
- **D) ✅** *"An adaptive investigation plan treats each finding as an input to the next decision — not just data to collect, but a signal that reshapes what needs to be done next."*

**Palavras-gatilho:** `may require investigating` = pode exigir investigar; `regardless of what is discovered` = independentemente do que for descoberto.

---

### Q39 — Resposta: **A**
`TS 1.2` · Task Lifecycle

- **A) ✅** O prompt cobre decomposição ("break it into subtasks") e delegação ("delegate each one"), e ainda proíbe o coordenador de executar. Agregação fica para outra instrução.
- **B) ❌** Permissão de tool não se define em prompt.
- **C) ❌** Nada sobre persistência entre reinícios.
- **D) ❌** Não há nada sobre combinar resultados nem resolver conflito.

**Palavras-gatilho:** `Do not do the work yourself` = não faça o trabalho você mesmo.

---

### Q40 — Resposta: **C**
`TS 3.2 / 1.3` · objetivo #14 — `context: fork`

- **A) ❌** Markdown colapsado é cosmético; os tokens já entraram no contexto.
- **B) ❌** Modelo menor não isola contexto.
- **C) ✅** O objetivo é literal: aplicar `context: fork` no frontmatter de Skill/slash command para que execute em **contexto de subagente isolado**, evitando contaminar o estado da sessão.
- **D) ❌** `/clear` apagaria a sessão principal inteira — remédio pior que a doença.

**Palavras-gatilho:** `polluting` = poluindo; `only the conclusion matters` = só a conclusão importa.

---

### Q41 — Resposta: **C**
`TS 1.7 / 5.4` · objetivo #2 — re-análise dirigida

- **A) ❌** `/compact` resume a conversa; não conhece o repositório.
- **B) ❌** Reler tudo funciona mas queima contexto e tempo — o objetivo é restaurar estado **sem repetir trabalho anterior**.
- **C) ✅** O objetivo pede exatamente *"targeted re-analysis of changed files and context injection"*: injeta a lista do que mudou e manda reler só aquilo.
- **D) ❌** Confiar no resumo antigo é justamente o risco: ele descreve o mundo de uma semana atrás.

**Palavras-gatilho:** `only the files that changed` = apenas os arquivos que mudaram.

---

### Q42 — Resposta: **B**
`TS 1.2 / 1.6` · orquestração + partição

- **A) ❌** Agente único perde paralelismo e arrisca "lost in the middle" com quatro documentos longos.
- **B) ✅** Quatro políticas independentes → quatro fatias distintas em paralelo; a comparação com as regras de retenção é o passo de síntese, que **depende** das quatro saídas.
- **C) ❌** Sequencial serializa leituras que não têm dependência entre si.
- **D) ❌** Mesmo briefing para os quatro = sobreposição e desperdício (o erro de partição).

**Palavras-gatilho:** `flag conflicts with` = sinalizar conflitos com; `coverage and latency` = cobertura e latência.

---

### Q43 — Resposta: **B**
`TS 1.3` · objetivo #6 — diagnóstico

- **A) ❌** `allowedTools` não é conselho: é enforcement de plataforma.
- **B) ✅** Descasamento entre o que o prompt pede e o que `allowedTools` permite. Rodar testes exige Bash; o agente só tem leitura/busca.
- **C) ❌** Grep busca dentro de arquivos; não executa comandos.
- **D) ❌** Caminhos de teste não resolvem — ele não tem como **executar** nada.

**Palavras-gatilho:** `cannot complete` = não consegue concluir; `excludes` = exclui.

---

### Q44 — Resposta: **C**
`TS 5.1 / 1.7` · objetivo #9 — estado fora da conversa

- **A) ❌** Desligar compactação só adia o problema até o contexto estourar de vez.
- **B) ❌** "Lembre-se do que já delegou" depende do histórico — que é justamente o que foi compactado.
- **C) ✅** Objeto de estado estruturado fora do histórico. A compactação pode resumir a conversa; o estado permanece autoritativo.
- **D) ❌** Janela maior adia; não torna o registro confiável.

**Palavras-gatilho:** `only into the conversation history` = apenas no histórico da conversa; `re-delegates` = re-delega.

---

### Q45 — Resposta: **A**
`TS 1.3` · Agent Tool

- **A) ✅** *"Task is the old name. It's now called Agent. Some parts of code will reference Task."* Spawna subagente com contexto isolado, system prompt e conjunto de tools próprios.
- **B) ❌** Quem define sem spawnar é a `AgentDefinition`, não "Task".
- **C) ❌** Não há essa divisão de execução entre os dois nomes.
- **D) ❌** A lista de tarefas é TodoWrite/TaskCreate etc. — outra família de tools, não confundir pelo nome.

**Palavras-gatilho:** `interchangeably` = de forma intercambiável; `legacy name` = nome legado.

---

### Q46 — Resposta: **A**
`TS 1.5 / 1.4` · gate determinístico

- **A) ✅** Limite de valor é regra de negócio: pertence ao código, antes da tool. Independe do que o modelo concluiu diante da insistência.
- **B) ❌** Few-shot melhora a tendência, não dá garantia — e o requisito é "nunca".
- **C) ❌** Negrito e repetição são o mesmo enforcement por prompt que já falhou.
- **D) ❌** Temperatura não cria garantia; e no material o remédio para "não pode acontecer" é sempre estrutural.

**Palavras-gatilho:** `persistent` = insistente; `reliable` = confiável/garantido.

---

### Q47 — Resposta: **B**
`TS 5.6` · objetivo #18 — schema de saída de subagente

- **A) ❌** Saída crua de tool é ruído (tool result bloat) e não é rastreável.
- **B) ✅** *"Use structured objects to keep content + metadata together. Include fields like id, type, confidence, and source details. Enables traceability."*
- **C) ❌** Prosa é justamente o que perde atribuição no caminho.
- **D) ❌** Um número por agente não liga **cada afirmação** à sua fonte.

**Palavras-gatilho:** `traced to` = rastreada até; `source metadata` = metadados de origem.

---

### Q48 — Resposta: **B**
`TS 1.6` · objetivo #7 ⚠️ **seu ponto mais fraco**

- **A) ❌** Mesmo briefing em cinco agentes = sobreposição; e "a resposta mais longa" não é critério de qualidade.
- **B) ✅** Escopo desconhecido de antemão → subtarefas geradas dinamicamente; o critério de parada é *"stop when no new signal emerges"*.
- **C) ❌** Lista fixa de dez decide antes de saber — é o erro de decomposição estreita com outro nome.
- **D) ❌** Um prompt gigante não substitui investigação iterativa e estoura contexto.

**Palavras-gatilho:** `unknown until work begins` = desconhecido até o trabalho começar; `every reason` = todas as razões.

---

### Q49 — Resposta: **A**
`TS 3.4` · Permission Modes

- **A) ✅** `plan` — *"Claude can analyze but not modify files or execute commands."* Exatamente o pedido.
- **B) ❌** `dontAsk` **auto-nega** tools não pré-aprovadas — não é um modo de análise-e-aprovação, é supressão de prompts de permissão.
- **C) ❌** `bypassPermissions` pula todas as confirmações.
- **D) ❌** `acceptEdits` aceita edições de arquivo automaticamente na sessão.

**Palavras-gatilho:** `without touching any file` = sem tocar em nenhum arquivo.

---

### Q50 — Resposta: **D**
`TS 1.7 / 5.1` · objetivo #9

- **A) ❌** System prompt é instrução estática, não log de progresso.
- **B) ❌** Retomar restaura o histórico **como ele está**, incluindo o que já foi resumido.
- **C) ❌** Compactação não preserva tool results literais; ela resume.
- **D) ✅** Histórico de conversa pode ser compactado ou truncado — não é registro confiável de etapas concluídas. Estado durável externo é o requisito.

**Palavras-gatilho:** `must not redo` = não pode refazer; `reliable record` = registro confiável.

---

### Q51 — Resposta: **B**
`TS 1.2` · Task Lifecycle

- **A) ❌** Seleção de agentes é decidir quem invocar, não o que fazer com o que voltou.
- **B) ✅** Combinar saídas de múltiplos agentes numa resposta coerente é a etapa de agregação de resultados.
- **C) ❌** Escopo de permissão é configuração, não etapa do ciclo.
- **D) ❌** Decomposição acontece antes, ao quebrar a tarefa.

**Palavras-gatilho:** `coherent` = coerente/unificada.

---

### Q52 — Resposta: **C**
`TS 1.2 / 5.3` · observabilidade em paralelo

- **A) ❌** Cap de iteração não tem relação com observabilidade.
- **B) ❌** Abandonar o paralelismo troca latência por visibilidade — e ainda assim o loop interno continua opaco.
- **C) ✅** Se o loop interno não é observável ao vivo, o rastro precisa vir **na saída estruturada** do subagente para o coordenador inspecionar depois.
- **D) ❌** Canais diretos entre subagentes destroem o choke point único.

**Palavras-gatilho:** `mid-flight` = em pleno voo (durante a execução); `inspectable trace` = rastro inspecionável.

---

### Q53 — Resposta: **C**
`TS 1.3` · objetivo #5

- **A) ❌** Contexto maior não define papel.
- **B) ❌** Agentes não aprendem entre invocações — não há memória compartilhada.
- **C) ✅** A `AgentDefinition` existe para **delimitar o papel** antes da primeira mensagem: identidade, regras de operação e fronteiras. Sem isso, nem a seleção pelo coordenador nem o comportamento ficam limitados.
- **D) ❌** Mais tools piora: presença de tool implica permissão, e a seleção fica ainda mais ruidosa.

**Palavras-gatilho:** `general helper` = ajudante genérico; `bounded` = delimitado.

---

### Q54 — Resposta: **A**
`TS 1.6` · validação de decomposição

- **A) ✅** O material mostra os dois pontos: uma tool que revisa a lista de tarefas **antes** de delegar, e a checagem de lacunas **durante a agregação**, antes de produzir a resposta.
- **B) ❌** Subagentes têm contexto isolado — são justamente os que não conseguem ver o que falta.
- **C) ❌** Depender de o usuário perceber é transferir o defeito para fora do sistema.
- **D) ❌** `stop_reason` diz por que o loop parou, não se a cobertura foi suficiente.

**Palavras-gatilho:** `covered everything` = cobriu tudo; `before the final report ships` = antes de o relatório final sair.

---

### Q55 — Resposta: **C**
`TS 1.7` · Resuming Sessions Considerations

- **A) ❌** Retomar recarrega o **histórico**, não relê arquivos automaticamente.
- **B) ❌** Não há expiração de 24h; e a `cleanupPeriodDays` (padrão 30) apaga sessões inativas — coisa diferente.
- **C) ✅** *"Claude is unaware of how much time has past or any changes that may have occurred from a previous session."* Contexto retomado pode estar silenciosamente desatualizado.
- **D) ❌** Confiança auto-reportada não detecta mudança externa. Sinal não confiável.

**Palavras-gatilho:** `stale` = desatualizado; `silently` = silenciosamente (⚠️ o perigo é não haver aviso).

---

### Q56 — Resposta: **C**
`TS 1.3` · Agent Tool

- **A) ❌** Nem sempre bloqueante — paralelismo é suportado nativamente.
- **B) ❌** Nem sempre em background — bloquear é um dos padrões suportados.
- **C) ✅** *"The parent (main agent) may block while waiting or it might be parallelized."* A escolha segue a existência ou não de dependência.
- **D) ❌** Subagentes paralelos são isolados; não trocam resultados parciais entre si.

**Palavras-gatilho:** `before it can proceed` = antes de poder prosseguir; `collects later` = coleta depois.

---

### Q57 — Resposta: **D**
`TS 1.5` · PreToolUse / PostToolUse ⚠️ **tópico com 33% de acerto seu**

- **A) ❌** Reescrever parâmetros antes da execução é, de novo, momento de `PreToolUse`.
- **B) ❌** Bloquear é papel do `PreToolUse`: *"Pre: validate, enforce rules."* Depois da execução já é tarde.
- **C) ❌** Hook não escolhe modelo.
- **D) ✅** *"Post: store results, update state."* O `PostToolUse` roda **depois** da execução — é onde se registra o que aconteceu para gates posteriores consultarem.

**Palavras-gatilho:** `after the tool ran` = depois que a tool rodou; `later gates` = gates posteriores.

---

### Q58 — Resposta: **B**
`TS 1.2` · Observability / controle de fronteira

- **A) ❌** System prompt é instrução ao modelo, não controle de fluxo de informação.
- **B) ✅** *"Coordinator the single choke point… you can't control what information crosses boundaries"* sem ele. Com ele, política de fluxo é aplicável e auditável num lugar só.
- **C) ❌** Política distribuída por subagente é inconsistente e não auditável centralmente.
- **D) ❌** Tamanho de contexto não é fronteira de confiança.

**Palavras-gatilho:** `crosses trust boundaries` = cruza fronteiras de confiança.

---

### Q59 — Resposta: **D**
`TS 1.4 / 3.4` · objetivo #8 — proporcionalidade

- **A) ❌** Fork por arquivo fragmenta uma mudança que é atômica por natureza.
- **B) ❌** Plan mode para renomear um helper privado é cerimônia sem retorno. Over-engineering.
- **C) ❌** Workflow multi-fase com agente revisor é desproporcional ao risco.
- **D) ✅** Escopo pequeno, risco baixo, verificação automática existente → execução direta. O objetivo pede escolher **com base em escopo, risco e necessidade de aprovação humana** — nem tudo merece plan mode.

**Palavras-gatilho:** `private helper` = função auxiliar privada; `proportionate` = proporcional.

---

### Q60 — Resposta: **A**
`TS 1.1` · anti-pattern "check text contents"

- **A) ✅** *"Claude often returns text alongside a tool_use block… Stopping on any text response means you'd bail out before the tool is ever executed."*
- **B) ❌** Não é loop infinito — é o contrário: encerra cedo demais.
- **C) ❌** O cap nem chega a ser atingido, porque o loop sai no primeiro turno com texto.
- **D) ❌** Premissa falsa: texto aparece junto com tool calls com frequência.

**Palavras-gatilho:** `any text block` = qualquer bloco de texto; `alongside` = junto com.

---

## Autoavaliação

| Acertos | Leitura |
|---|---|
| 54–60 (90%+) | Domínio sólido. Vá para o Domínio 3. |
| 43–53 (72–89%) | Na faixa de aprovação. Disseque **cada** erro antes de seguir. |
| 30–42 (50–71%) | Lacuna real. Releia os blocos de decomposição (1.6), hooks (1.5) e sessão (1.7). |
| < 30 | Refaça a teoria do domínio antes de nova rodada. |

**Depois de corrigir, responda:** cada erro foi de **conceito** ou de **leitura do inglês**? Erro de leitura não vira reforço de task statement — vira treino de leitura dirigido.
