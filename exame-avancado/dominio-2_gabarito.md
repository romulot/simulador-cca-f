# Gabarito — Bloco 2

**Domínio 2 — Tool Design & MCP Integration (peso 18%)**

Fontes: `livro01.pdf`, `livro02.pdf`, objetivos de `livro03.md`.
Os itens marcados ✅ *Verificado* foram conferidos na documentação oficial com citação literal.

> ⚠️ **Distinção que o material do curso deixa turva e a prova pode cobrar:**
> `is_error` (snake_case) **é** um campo opcional do bloco `tool_result` da Messages API.
> `retryable` / `isRetryable` **não é** parâmetro da Messages API — é um campo que **você**
> coloca dentro do payload de erro da sua própria tool (convenção de design de tool / MCP),
> para que o agente mapeie tipo de erro → ação. Fonte do `is_error`:
> https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls

---

### Q1 — Resposta: **D**
`TS 2.1` · objetivo #36 — descrições de tools

- **A) ❌** "Tenha cuidado" é instrução vaga; o modelo não ganha critério nenhum.
- **B) ❌** Remover capacidade para contornar ambiguidade descarta funcionalidade legítima.
- **C) ❌** `any` força uma tool qualquer — não ensina qual é a certa. Piora: garante a escolha errada mais rápido.
- **D) ✅** O objetivo é literal: descrições devem distinguir *"purpose, input formats, use-case boundaries, and relationships to semantically similar tools"*. Duas tools quase sinônimas exigem que cada descrição diga quando usar **a outra**.

**Palavras-gatilho:** `root cause` = causa raiz; `semantically similar` = semanticamente parecidas.

---

### Q2 — Resposta: **B**
`TS 2.2` · erros estruturados

- **A) ❌** Retornar sucesso para algo que falhou é mentir para o agente — ele seguirá como se o reembolso tivesse ocorrido.
- **B) ✅** O material descreve exatamente isso: *"Including retryable: false flags and customer-friendly explanations for business rule violations so the agent can communicate appropriately."* Violação de regra de negócio não se resolve tentando de novo.
- **C) ❌** Falha genérica convida ao retry infinito de algo que nunca vai passar.
- **D) ❌** Exceção mata o loop: o agente perde a chance de explicar ao cliente.

**Palavras-gatilho:** `rather than retry` = em vez de tentar de novo; `return window` = prazo de devolução.

---

### Q3 — Resposta: **D**
`TS 2.2` · Messages API
✅ *Verificado:* *"`is_error` (optional): Set to `true` if the tool execution resulted in an error."* — https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls

- **A) ❌** Não existe campo `status` no `tool_result`.
- **B) ❌** ⚠️ `retryable` **não é** campo da Messages API — é convenção do seu próprio payload de erro.
- **C) ❌** `stop_reason` descreve por que o modelo parou (`tool_use` / `end_turn`), não o resultado da sua função.
- **D) ✅** `is_error: true` no bloco `tool_result`, junto com `tool_use_id` e `content`.

**Palavras-gatilho:** `signals the failure` = sinaliza a falha.

---

### Q4 — Resposta: **C**
`TS 2.2` · Access Failures vs Valid Empty Results

- **A) ❌** Reportar "sem resultados" quando o índice caiu esconde um incidente como se fosse resposta.
- **B) ❌** O comportamento **não** é idêntico: um caso segue adiante, o outro exige retry ou escalação.
- **C) ✅** *"Both of these return empty but they are not the same… different things and require completely different responses."* Daí `{"status": "valid_empty"}` vs `{"status": "access_failure"}`.
- **D) ❌** Inferir por duração da chamada é sinal não confiável — arquétipo clássico de distrator.

**Palavras-gatilho:** `genuinely matched nothing` = realmente não encontrou nada; `unreachable` = inacessível.

---

### Q5 — Resposta: **A**
`TS 2.3 / 4.3` · objetivo #27
✅ *Verificado:* `tool_choice` aceita `auto`, `any`, `tool` e `none` — https://platform.claude.com/cookbook/tool-use-tool-choice

- **A) ✅** *"TOOL — Must use this specific tool (forced). Will never return end_turn."* É a garantia que o pipeline exige.
- **B) ❌** `none` proíbe tools — o oposto.
- **C) ❌** `auto` permite retornar texto: *"May use or not use a tool."* Instrução não fecha essa porta.
- **D) ❌** `max_tokens` trata truncamento, não a decisão de chamar tool.

**Palavras-gatilho:** `must never` = nunca pode; `conversational reply` = resposta conversacional.

---

### Q6 — Resposta: **D**
`TS 2.3` · Too Many Tools

- **A) ❌** Não é tamanho de modelo; é superfície de decisão.
- **B) ❌** Descrições mais longas com 40 tools aumentam o ruído.
- **C) ❌** `any` força uma escolha ruim em vez de evitá-la.
- **D) ✅** Os quatro sintomas do enunciado são a lista do material: *"model picks a plausible but wrong tool; model freezes and asks for clarification unnecessarily; model ignores specialist tools entirely; model hallucinates a tool combination."* Regra: *"prefer small, general-purpose toolsets over many niche ones."*

**Palavras-gatilho:** `plausible but wrong` = plausível porém errada; `inventing` = inventando.

---

### Q7 — Resposta: **A**
`TS 2.3` · Tools Specialization Misuse

- **A) ✅** *"When a tool exists in an agent's context, the model treats it as available and appropriate even if the agent's role doesn't call for it. Presence implies permission."* A correção é remover a tool do agente.
- **B) ❌** Síntese é combinar o que os outros acharam; pesquisar é o papel do outro agente.
- **C) ❌** Prompt mais longo não desfaz a presença da ferramenta.
- **D) ❌** Findings errados não explicam por que ele **pesquisa**.

**Palavras-gatilho:** `instead of synthesizing` = em vez de sintetizar; `presence implies permission` = presença implica permissão.

---

### Q8 — Resposta: **B**
`TS 2.4` · MCP Discovery

- **A) ❌** Não é um servidor por vez.
- **B) ✅** *"When you configure multiple MCP servers, all their tools are discovered and loaded at connection time — the agent sees them all at once as a flat list, with no awareness of which server each came from."*
- **C) ❌** Não é carregamento preguiçoso: é tudo na conexão.
- **D) ❌** Não há agrupamento por servidor nem seleção em duas etapas.

**Palavras-gatilho:** `flat list` = lista plana; `at connection time` = no momento da conexão.

---

### Q9 — Resposta: **D**
`TS 2.4` · objetivo #34 — resources vs tools

- **A) ❌** Outro servidor multiplica a lista plana de tools — piora.
- **B) ❌** Mais iterações é pagar mais caro pelo mesmo desenho ruim.
- **C) ❌** Mais parâmetros numa tool de busca não elimina o tateio.
- **D) ✅** O objetivo pede *"expose server content as resources to reduce exploratory tool calls and improve agent efficiency"*. Resource é dado endereçável e somente leitura; evita a série de chamadas de tateio.

**Palavras-gatilho:** `exploratory calls` = chamadas exploratórias/de tateio.

---

### Q10 — Resposta: **B**
`TS 2.4` · objetivo #35
✅ *Verificado:* *"Supported Syntax: `${VAR}` expands to environment variable value; `${VAR:-default}` expands to VAR if set, otherwise uses default. Variables can be expanded in: `command`, `args`, `env`, `url`, `headers`."* — https://code.claude.com/docs/en/mcp.md

- **A) ❌** `CLAUDE.md` é contexto lido pelo modelo — pior lugar possível para um segredo.
- **B) ✅** Expansão de variável de ambiente é o mecanismo previsto justamente para não versionar segredo.
- **C) ❌** Não existe substituição a partir do histórico do shell.
- **D) ❌** Servidores MCP usam segredos normalmente, via ambiente.

**Palavras-gatilho:** `without hardcoding` = sem fixar no código.

---

### Q11 — Resposta: **A**
`TS 2.4` · objetivo #35
✅ *Verificado:* escopos Local > Project > User — https://code.claude.com/docs/en/mcp.md

- **A) ✅** `.mcp.json` na raiz do projeto é a configuração de **escopo de projeto**, versionada e compartilhada com o time.
- **B) ❌** Managed settings é imposição organizacional, não distribuição por clone de repositório.
- **C) ❌** `settings.local.json` não vai para o git.
- **D) ❌** `~/.claude.json` é escopo de usuário — vale só para aquela pessoa.

**Palavras-gatilho:** `when they clone` = quando clonarem.

---

### Q12 — Resposta: **D**
`TS 2.4` · objetivo #35
✅ *Verificado:* *"When the same server is defined in multiple places, Claude Code connects to the highest-precedence version: (1) Local scope (highest) (2) Project scope (3) User scope…"* — https://code.claude.com/docs/en/mcp.md

- **A) ❌** Não há conexão simultânea com namespacing por escopo.
- **B) ❌** Project perde para Local.
- **C) ❌** User é o de **menor** precedência entre os três.
- **D) ✅** Local > Project > User.

**Palavras-gatilho:** `precedence` = precedência.

---

### Q13 — Resposta: **D**
`TS 2.3` · objetivo #33 — distribuição de tools

- **A) ❌** Auditar depois descobre o desvio quando ele já aconteceu.
- **B) ❌** Toolset completo + descrição de papel é enforcement por prompt: presença implica permissão.
- **C) ❌** `any` força chamada de tool; não impede a tool errada.
- **D) ✅** O objetivo pede atribuir *"only the tools required for its designated role, reducing decision complexity and preventing out-of-role tool invocations"*. Ganha-se nos dois lados: menos erro de seleção e papel respeitado.

**Palavras-gatilho:** `unable to invoke` = incapaz de invocar; `outside its role` = fora do seu papel.

---

### Q14 — Resposta: **C**
`TS 2.5` · objetivo #32

- **A) ❌** Grep busca padrão dentro de arquivos.
- **B) ❌** `cat` via Bash faz o mesmo, mas exige permissão de shell — ferramenta desproporcional para ler um arquivo.
- **C) ✅** *"Read → load file into context."* Caminho conhecido, arquivo específico.
- **D) ❌** Glob acha arquivos por padrão de nome.

**Palavras-gatilho:** `already known` = já conhecido.

---

### Q15 — Resposta: **C**
`TS 2.3` · objetivo #37 — sequenciamento

- **A) ❌** `any` garante que **alguma** tool seja chamada — não qual, nem em que ordem.
- **B) ❌** A ordem no array de tools não define ordem de chamada.
- **C) ✅** O objetivo pede *"sequence multi-tool workflows so prerequisite data is obtained before dependent tools are called"*. A dependência fica explícita no schema: o dado exigido não é obtenível pela própria tool.
- **D) ❌** Não há ordem alfabética; é invenção.

**Palavras-gatilho:** `before` = antes de; `cannot obtain on its own` = não consegue obter sozinha.

---

### Q16 — Resposta: **C**
`TS 2.1` · objetivo #36

- **A) ❌** Latência média não ajuda a formatar o argumento.
- **B) ❌** Custo pode orientar frequência de uso, não a forma da entrada.
- **C) ✅** A descrição deve declarar formato de entrada e restrições — é lendo o schema **e** a descrição que o modelo gera o JSON de chamada.
- **D) ❌** Linguagem de implementação é irrelevante para quem chama.

**Palavras-gatilho:** `malformed input` = entrada malformada.

---

### Q17 — Resposta: **C**
`TS 2.3` · `tool_choice`
✅ *Verificado:* *"Any (Force Tool Use): Requires Claude to call one of the provided tools, but lets it choose which one."* — https://platform.claude.com/cookbook/tool-use-tool-choice

- **A) ❌** `tool` fixa **uma** tool específica — não serve quando a ação varia.
- **B) ❌** `auto` permite responder só com texto.
- **C) ✅** `any` = *"Must use some tool, Claude picks which"*. Exatamente "sempre uma ação, mas qual varia".
- **D) ❌** `none` proíbe tools.

**Palavras-gatilho:** `never respond with plain text` = nunca responder só com texto.

---

### Q18 — Resposta: **A**
`TS 2.3` · `tool_choice`

- **A) ✅** `none` = *"Cannot use any tools"*. Raciocínio puro, sem ação.
- **B) ❌** `any` obriga a chamar.
- **C) ❌** `tool` força uma específica.
- **D) ❌** `auto` deixa o modelo decidir — pode chamar tool.

**Palavras-gatilho:** `no tool calls at all` = nenhuma chamada de tool.

---

### Q19 — Resposta: **D**
`TS 2.2` · MCP isError + retryable

- **A) ❌** Mandar o usuário tentar depois desiste de um erro que era retentável.
- **B) ❌** Resultado vazio "de sucesso" faz o agente seguir com dado que não existe.
- **C) ❌** Exceção encerra o loop — o agente perde a chance de tentar de novo.
- **D) ✅** Erro transitório: marcar como erro (para o agente saber que falhou) **e** identificar que é transitório, para que retry seja a ação certa. *"Tool failed ≠ loop failed. Use error type → action mapping (retry / fix / escalate)."*

**Palavras-gatilho:** `transient` = transitório.

---

### Q20 — Resposta: **B**
`TS 2.4` · objetivo #34

- **A) ❌** Não é uma distinção de sincronismo.
- **B) ✅** *"Tools → actions (do something); Resources → data (read something)."* Resources são dados somente leitura, controlados pela aplicação; tools são ações, controladas pelo modelo.
- **C) ❌** Não há depreciação: são conceitos complementares.
- **D) ❌** Não é uma distinção de origem remota vs local.

**Palavras-gatilho:** `practical difference` = diferença prática.

---

### Q21 — Resposta: **A**
`TS 2.3 / 4.3` · objetivos #25 e #27

- **A) ✅** Tool use com JSON Schema + `tool_choice` forçado é o método mais confiável de conformidade estrutural: o modelo gera JSON **para caber no schema**, e a chamada é garantida.
- **B) ❌** Pedir JSON no prompt é o método menos confiável dos três citados no objetivo #25.
- **C) ❌** `max_tokens` só evita truncamento; não garante conformidade nem ausência de prosa.
- **D) ❌** Regex sobre prosa é remendo: quebra quando o modelo muda o embrulho.

**Palavras-gatilho:** `strict` = estrita; `no prose around it` = sem prosa em volta.

---

### Q22 — Resposta: **A**
`TS 4.3` · objetivo #26 · Input Schema Tips

- **A) ✅** *"For enums provide an ambiguous option."* Sem a saída `other`, o modelo é obrigado a escolher errado — o schema **induz** a alucinação.
- **B) ❌** Omitir o campo perde a informação de que houve um caso fora das categorias.
- **C) ❌** Texto livre perde toda a padronização que o enum dava.
- **D) ❌** Instrução no prompt não conserta um schema que não tem a opção correta.

**Palavras-gatilho:** `forces them into the closest match` = força-os na correspondência mais próxima.

---

### Q23 — Resposta: **D**
`TS 2.1` · objetivo #36

- **A) ❌** Nomes opacos pioram: o modelo perde o pouco de sinal que o nome dava.
- **B) ❌** README não entra no contexto do modelo.
- **C) ❌** Fundir esconde a distinção num parâmetro — o modelo continua tendo de escolher, agora sem descrição própria.
- **D) ✅** Tools semanticamente próximas exigem que a descrição declare a **relação** entre elas e as situações que pedem cada uma. É literalmente o objetivo.

**Palavras-gatilho:** `routes ... to the wrong one` = roteia para a errada.

---

### Q24 — Resposta: **D**
`TS 2.3` · Tools Specialization Misuse

- **A) ❌** Tools não consomem tokens de saída do agente dessa forma — o custo é de decisão e de definição no contexto.
- **B) ❌** Não é questão de timeout.
- **C) ❌** Tools não usadas **não** são ignoradas: o modelo as considera.
- **D) ✅** "Caso precise" é exatamente o raciocínio que o material desaconselha: presença implica permissão, e a superfície de decisão cresce sem ganho.

**Palavras-gatilho:** `in case it needs them` = caso venha a precisar delas.

---

### Q25 — Resposta: **C**
`TS 2.5` · objetivo #32

- **A) ❌** Grep busca conteúdo; não executa.
- **B) ❌** Ler o código do runner não o executa.
- **C) ✅** *"Bash → execute commands."* Rodar a suíte de testes é execução.
- **D) ❌** Glob resolve nomes de arquivo.

**Palavras-gatilho:** `run the project's test suite` = rodar a suíte de testes do projeto.

---

### Q26 — Resposta: **A**
`TS 2.2` · ⚠️ **fato de precisão**
✅ *Verificado:* na Messages API só existe `is_error` no `tool_result`; não há campo `retryable`/`isRetryable` na especificação da API — https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls

- **A) ✅** O booleano de retentabilidade vive no **payload de erro que você desenha** (categoria + descrição legível + retryable), para o agente mapear tipo de erro → ação. É convenção de design de tool/MCP, não parâmetro de API.
- **B) ❌** São coisas diferentes e complementares: `is_error` diz *falhou*; o flag de retentabilidade diz *o que fazer a respeito*.
- **C) ❌** Não é campo obrigatório da Messages API — não é campo da Messages API de forma alguma.
- **D) ❌** Nenhum campo do seu payload instrui a API a repetir a chamada. Quem decide repetir é o agente (ou o seu código).

**Palavras-gatilho:** `whether retrying is appropriate` = se vale a pena tentar de novo.

---

### Q27 — Resposta: **D**
`TS 2.5` · objetivo #32

- **A) ❌** Read não opera sobre a raiz do repositório como listagem.
- **B) ❌** Premissa falsa: as built-in tools encadeiam normalmente — e usar Bash aqui exige permissão de shell sem necessidade.
- **C) ❌** Inverte as funções das duas.
- **D) ✅** Glob para achar os arquivos pelo padrão de nome, Grep para buscar dentro deles. Cada tool no seu papel.

**Palavras-gatilho:** `then search within those files` = depois buscar dentro desses arquivos.

---

### Q28 — Resposta: **A**
`TS 5.1` · Tool Result Bloat

- **A) ✅** *"Filter only the information you need and pass that context."* O filtro pertence à tool, antes de o dado entrar no contexto.
- **B) ❌** Pedir para ignorar não desfaz os tokens já gastos nem o ruído.
- **C) ❌** Janela maior é adiar o problema pagando mais caro.
- **D) ❌** Chamar menos vezes pode quebrar a tarefa; o problema é o tamanho de cada resposta.

**Palavras-gatilho:** `degrades` = degrada; `of which the agent needs three fields` = da qual o agente precisa de três campos.

---

### Q29 — Resposta: **C**
`TS 2.3 / 4.3` · objetivo #27

- **A) ❌** `none` proíbe tools; a estrutura ficaria por conta do texto — o caso menos confiável.
- **B) ❌** `tool_choice` controla **se/qual** tool é chamada, não visibilidade.
- **C) ✅** Forçar a tool específica elimina o caminho "responder em texto" — a falha intermitente vinha justamente de o `auto` às vezes escolher conversar.
- **D) ❌** `auto` **não** garante chamada de tool.

**Palavras-gatilho:** `intermittent` = intermitente; `hard to reproduce` = difícil de reproduzir.

---

### Q30 — Resposta: **B**
`TS 2.3 / 2.4` · MCP Discovery

- **A) ❌** Mais iterações não melhora a seleção.
- **B) ✅** *"Risk: tool explosion without structure. Mitigation: limit servers or filter tools before exposure."*
- **C) ❌** `any` força a chamada de uma das 30.
- **D) ❌** Descrições longas para 30 tools desnecessárias aumentam o ruído.

**Palavras-gatilho:** `tool explosion` = explosão de tools; `before exposing` = antes de expor.

---

### Q31 — Resposta: **D**
`TS 4.3 / 4.4` · objetivo #26 · Input Schema Tips

- **A) ❌** `required` influencia a geração; não é decorativo.
- **B) ❌** Vale para qualquer tipo de propriedade.
- **C) ❌** Não há rejeição automática da API garantindo conformidade — por isso a camada de validação existe.
- **D) ✅** *"required expects properties to be provided"* e *"Claude will read the input schema and generate JSON to fit"* — mas o material também alerta: *"Schema ≠ full validation. Use tools like Pydantic / Instructor."*

**Palavras-gatilho:** `in practice` = na prática; `still needed` = ainda assim necessária.

---

### Q32 — Resposta: **B**
`TS 4.4` · Input Schema Tips (Validation Layer)

- **A) ❌** O próprio material diz que o schema não é validação completa.
- **B) ✅** *"Pydantic Library can be used to validate structured data in and as well as back out. Instructor is a library that uses Pydantic with more validation."*
- **C) ❌** Validar só a saída deixa entrar chamada malformada.
- **D) ❌** Validar depois de gravar é tarde: dado ruim já está no banco.

**Palavras-gatilho:** `in and out` = de entrada e de saída.

---

### Q33 — Resposta: **C**
`TS 2.1` · System Prompts Overriding Tools

- **A) ❌** Não há precedência garantida da descrição sobre o system prompt.
- **B) ❌** Trocar de modelo não elimina instruções conflitantes.
- **C) ✅** *"Reviewing system prompts for keyword-sensitive instructions that might override well-written tool descriptions."* A descrição pode estar impecável e ainda assim perder para uma regra genérica do system prompt.
- **D) ❌** Mover a descrição para o system prompt não resolve a contradição — só a concentra num lugar.

**Palavras-gatilho:** `hesitates unpredictably` = hesita de forma imprevisível; `keyword-sensitive` = sensível a palavras-chave.

---

### Q34 — Resposta: **B**
`TS 2.3` · `tool_choice`

- **A) ❌** `none` impede o uso quando ele for necessário.
- **B) ✅** *"AUTO — Claude decides whether to use a tool (default). May use or not use a tool."* É o modo de agente geral.
- **C) ❌** `any` obriga a chamar mesmo quando o conhecimento próprio bastaria.
- **D) ❌** `tool` força uma específica sempre.

**Palavras-gatilho:** `when it can` = quando conseguir; `only when needed` = só quando necessário.

---

### Q35 — Resposta: **B**
`TS 2.4 / 3.1` · MCP Rules
✅ *Verificado:* https://code.claude.com/docs/en/permissions.md

- **A) ❌** `mcp__linear` cobriria **todas** as tools do servidor — amplo demais.
- **B) ✅** `mcp__<server>__<tool>` casa com uma tool específica daquele servidor.
- **C) ❌** Falta o prefixo `mcp__`.
- **D) ❌** Falta o nome do servidor: a forma exige `mcp__<server>__<tool>`.

**Palavras-gatilho:** `and nothing else from it` = e nada mais dele.

---

### Q36 — Resposta: **D**
`TS 2.1` · objetivo #36

- **A) ❌** Forçar `process_refund` obrigaria reembolso em casos que exigem escalação — troca um erro por outro pior.
- **B) ❌** Remover a escalação quebra o requisito de saber quando escalar.
- **C) ❌** Renomear é sinal fraco comparado a um critério explícito.
- **D) ✅** Fronteira de uso é parte da descrição: dizer quando escalar **e quando não**. O modelo escala demais porque a descrição não delimita.

**Palavras-gatilho:** `far too often` = com frequência excessiva; `could resolve` = conseguiria resolver.

---

### Q37 — Resposta: **B**
`TS 4.3` · objetivo #26 · Input Schema Tips (Conditional Logic)

- **A) ❌** Dividir em duas tools aumenta a superfície de decisão para uma regra de um campo.
- **B) ✅** *"Drive optional properties becoming required based on descriptions"* — exemplo do material: `category_detail` obrigatório quando `category` = `other`. Simula lógica condicional sem código.
- **C) ❌** Obrigatório sempre com string vazia gera dado lixo nos outros casos.
- **D) ❌** Validar e re-perguntar gasta um turno para algo que a descrição resolve na primeira.

**Palavras-gatilho:** `effectively required whenever` = na prática obrigatório sempre que.

---

### Q38 — Resposta: **C**
`TS 2.4` · objetivo #35

- **A) ❌** Iterações não fazem aparecer tool não descoberta.
- **B) ❌** Modelo maior também não vê o que não está no toolset.
- **C) ✅** O objetivo termina em *"verifying tool discovery"*. Servidor que sobe sem erro ainda pode não ter suas tools descobertas/expostas ao agente — é o primeiro fato a checar.
- **D) ❌** Reescrever descrição de tool que o agente não enxerga não muda nada.

**Palavras-gatilho:** `never uses` = nunca usa; `without errors` = sem erros.

---

### Q39 — Resposta: **D**
`TS 2.2` · Access Failures vs Valid Empty Results

- **A) ❌** Nada a ver com `required` do JSON Schema.
- **B) ❌** Não é sobre tamanho de payload.
- **C) ❌** Não existe retry automático da API disparado pelo seu payload.
- **D) ✅** Sem o campo de status, "nada encontrado" e "não consegui alcançar o dado" são indistinguíveis — e exigem ações opostas.

**Palavras-gatilho:** `look identical` = parecem idênticos.

---

### Q40 — Resposta: **B**
`TS 2.3` · Too Many Tools

- **A) ❌** Sentimento do cliente é sinal não confiável — e toolset dinâmico por humor é over-engineering.
- **B) ✅** *"More tools ≠ more capability."* O conjunto mínimo que cobre o papel é o desenho recomendado.
- **C) ❌** Uma tool por endpoint é o caminho mais rápido para dezenas de tools quase idênticas.
- **D) ❌** Expor tudo é exatamente a explosão de tools.

**Palavras-gatilho:** `how many tools to expose` = quantas tools expor.

---

### Q41 — Resposta: **D**
`TS 2.2 / 5.3` · erro estruturado

- **A) ❌** Mais frames de stack trace é mais ruído para o modelo interpretar.
- **B) ❌** Suprimir o erro produz o pior caso: falha silenciosa que vira resultado vazio válido.
- **C) ❌** Prosa livre obriga o agente a fazer parsing de linguagem natural — anti-pattern do material.
- **D) ✅** *"Use error type → action mapping (retry / fix / escalate)."* Categoria "authentication" diz ao agente que retry não resolve e que a ação é obter credencial ou escalar.

**Palavras-gatilho:** `surfaces as` = chega como; `raw stack trace` = stack trace cru.

---

### Q42 — Resposta: **C**
`TS 2.4` · objetivo #34

- **A) ❌** Inverte exatamente a distinção.
- **B) ❌** Modelar tudo como tool devolve o problema das chamadas exploratórias.
- **C) ✅** Escrever é ação → tool. Lista consultada apenas para leitura → resource.
- **D) ❌** Resource é somente leitura: não serve para a escrita.

**Palavras-gatilho:** `only ever read` = apenas leem, nunca escrevem.

---

### Q43 — Resposta: **A**
`TS 2.1` · objetivo #36

- **A) ✅** A descrição cobre os quatro itens do objetivo: propósito, formato de entrada, fronteira de uso e relação com uma tool adjacente (`get_customer`).
- **B) ❌** Não menciona autenticação nem servidor de origem.
- **C) ❌** Não menciona limites nem custo.
- **D) ❌** Não há detalhe de implementação nem tratamento de erro na descrição citada.

**Palavras-gatilho:** `Do not use for` = não use para (⚠️ fronteira de uso).

---

### Q44 — Resposta: **C**
`TS 2.5 / 2.4`

- **A) ❌** WebFetch busca conteúdo web, não o catálogo MCP.
- **B) ❌** Glob opera no sistema de arquivos local.
- **C) ✅** `ListMcpResourcesTool` — *"lists resources exposed by connected MCP servers"*.
- **D) ❌** Ler o código-fonte do servidor não é o mesmo que consultar o que ele expõe em runtime.

**Palavras-gatilho:** `exposes` = expõe.

---

### Q45 — Resposta: **C**
`TS 2.3 / 4.3` · objetivo #27

- **A) ❌** Sinalizar depois não impede o registro perdido.
- **B) ❌** Re-prompt é remediação depois da falha; ainda gasta turno e pode falhar de novo.
- **C) ✅** `tool_choice` forçando a tool específica: *"Will never return end_turn."* Nenhum documento passa sem chamada.
- **D) ❌** `auto` + instrução não fecha o caminho do texto puro — e "sem exceções" é requisito de garantia.

**Palavras-gatilho:** `silently drops` = descarta silenciosamente.

---

### Q46 — Resposta: **A**
`TS 2.1 / 2.3`

- **A) ✅** Duas tools para o mesmo trabalho criam seleção ambígua — é o mesmo mecanismo do "too many tools", agravado por sobreposição semântica direta.
- **B) ❌** Não há regra de precedência MCP sobre built-in.
- **C) ❌** Nem o contrário.
- **D) ❌** Não é inócuo: gera comportamento inconsistente entre execuções, que é o sintoma descrito.

**Palavras-gatilho:** `inconsistently` = de forma inconsistente.

---

### Q47 — Resposta: **C**
`TS 2.4 / 3.1` · MCP Rules
✅ *Verificado:* https://code.claude.com/docs/en/permissions.md

- **A) ❌** Falta o prefixo `mcp__`.
- **B) ❌** Sintaxe inexistente.
- **C) ✅** *"mcp__<server_name> matches any tool provided by the server"* — e o material cita `mcp__stripe` como exemplo de nome nu cobrindo todas as tools do servidor.
- **D) ❌** Regra de Bash não alcança tools MCP.

**Palavras-gatilho:** `with a single permission rule` = com uma única regra de permissão.

---

### Q48 — Resposta: **C**
`TS 2.1 / 4.3` · Input Schema Tips

- **A) ❌** `type` continua necessário: define a forma do dado.
- **B) ❌** Descrições valem para campos obrigatórios e opcionais.
- **C) ✅** *"Use descriptions to help guide choices"* — e *"description → guides decision-making"*. A descrição carrega o que o nome do campo não consegue dizer.
- **D) ❌** Falso: o modelo lê as descrições ao gerar a entrada.

**Palavras-gatilho:** `rather than relying on` = em vez de depender de.

---

### Q49 — Resposta: **D**
`TS 2.5 / 2.4`

- **A) ❌** WebFetch é para URLs da web.
- **B) ❌** Read opera sobre arquivos, não sobre URIs de resource MCP.
- **C) ❌** `curl` via Bash contorna o protocolo e exige permissão de shell.
- **D) ✅** `ReadMcpResourceTool` — *"reads a specific MCP resource by URI"*.

**Palavras-gatilho:** `whose URI is already known` = cuja URI já é conhecida.

---

### Q50 — Resposta: **A**
`TS 2.2`

- **A) ✅** *"Not all errors should retry. retryable: false → communicate, don't loop."* Entrada inválida não fica válida na quinta tentativa.
- **B) ❌** Mais tentativas do mesmo erro é desperdício garantido.
- **C) ❌** Timeout trata indisponibilidade; o serviço respondeu — rejeitou.
- **D) ❌** Outro provedor rejeitaria a mesma entrada inválida.

**Palavras-gatilho:** `identical call` = chamada idêntica; `exceeds` = excede.

---

### Q51 — Resposta: **B**
`TS 2.3` · Tool Choice

- **A) ❌** Inverte o que o material afirma.
- **B) ✅** O material é explícito: *"This setting is only available in the low level Anthropic SDK."* (⚠️ Trate como afirmação do curso sobre onde o parâmetro é exposto; o conceito cobrado é que `tool_choice` é parâmetro da chamada de API, não configuração de Claude Code nem de MCP.)
- **C) ❌** Não é chave de `settings.json`.
- **D) ❌** Não é campo de configuração de servidor MCP.

**Palavras-gatilho:** `lower-level` = de mais baixo nível.

---

### Q52 — Resposta: **C**
`TS 4.3` · objetivo #29 — normalização de formato

- **A) ❌** Segunda tool para ambiguidade é over-engineering de um problema de schema.
- **B) ❌** Normalizar só na implementação não impede "here" e "the office", que não têm como ser normalizados.
- **C) ✅** O material recomenda declarar a regra de formato — como no exemplo de normalização (`PHONE → E.164`, `DATE → ISO 8601`). Schema restrito + descrição de formato fazem o modelo gerar valores conformes.
- **D) ❌** Tornar opcional perde o dado.

**Palavras-gatilho:** `no further constraint` = sem restrição adicional.

---

### Q53 — Resposta: **A**
`TS 2.3` · Tools Specialization Misuse

- **A) ✅** Presença implica permissão: o escritor vai usar a busca, borrar a fronteira de papel e duplicar o trabalho do pesquisador (e os tokens).
- **B) ❌** O material diz o oposto: a tool presente é tratada como apropriada, mesmo fora do papel.
- **C) ❌** Não há essa condicionalidade implícita.
- **D) ❌** O coordenador não bloqueia chamadas internas de um subagente — o bloqueio é a **ausência** da tool.

**Palavras-gatilho:** `so it can check facts` = para que possa checar fatos.

---

### Q54 — Resposta: **B**
`TS 2.4` · objetivo #35
✅ *Verificado:* expansão suportada em `headers` — https://code.claude.com/docs/en/mcp.md

- **A) ❌** Hardcode + gitignore perde o compartilhamento da configuração e ainda deixa o segredo em disco em claro.
- **B) ✅** A expansão `${VAR}` / `${VAR:-default}` funciona nos headers, exatamente para token por ambiente.
- **C) ❌** `CLAUDE.md` é contexto lido pelo modelo — nunca coloque segredo ali.
- **D) ❌** Token por chamada expõe o segredo ao modelo.

**Palavras-gatilho:** `per environment` = por ambiente.

---

### Q55 — Resposta: **A**
`TS 2.1` · objetivo #36

- **A) ✅** Quando o comportamento muda conforme a entrada, a descrição precisa dizer **qual entrada seleciona qual efeito** — senão o modelo cria um registro achando que atualiza.
- **B) ❌** Tamanho de resposta não muda a decisão.
- **C) ❌** Versão não orienta a chamada.
- **D) ❌** Motor de banco é detalhe interno.

**Palavras-gatilho:** `depending on whether` = dependendo de se.

---

### Q56 — Resposta: **B**
`TS 2.5 / 3.1` · objetivo #32

- **A) ❌** Bash não filtra por relevância.
- **B) ✅** A tool built-in é específica para busca em conteúdo e evita conceder Bash — que é permissão ampla, marcada com `*` (requer permissão) e coberta pelo sandbox justamente por ser perigosa.
- **C) ❌** Executar comandos arbitrários é justamente o que não se quer aqui.
- **D) ❌** Velocidade não é a razão, e não é verdade em todo caso.

**Palavras-gatilho:** `favors` = favorece; `broad shell execution permission` = permissão ampla de execução de shell.

---

### Q57 — Resposta: **A**
`TS 2.2`

- **A) ✅** É o padrão do material para violação de regra de negócio: erro + não retentável + explicação apresentável ao cliente.
- **B) ❌** Sucesso com payload vazio faz o agente seguir como se a promoção tivesse sido aplicada.
- **C) ❌** Exceção encerra o loop; o caso era resolvível com uma explicação.
- **D) ❌** "Operação falhou" não dá ao agente o que dizer ao cliente.

**Palavras-gatilho:** `not eligible` = não elegível; `relay` = repassar.

---

### Q58 — Resposta: **B**
`TS 2.2` · MCP isError

- **A) ❌** É exatamente o contrário do propósito do flag.
- **B) ✅** *"The isError flag tells the agent a tool failed without terminating the loop — the agent receives the error as a tool result and can reason about what to do next."*
- **C) ❌** Não há retry transparente da API que esconda o erro do agente.
- **D) ❌** O erro não é descartado: ele é entregue como conteúdo do `tool_result`.

**Palavras-gatilho:** `rather than as a thrown exception` = em vez de uma exceção lançada.

---

### Q59 — Resposta: **B**
`TS 2.3 / 1.3` · objetivo #33

- **A) ❌** System prompt é instrução.
- **B) ✅** Estrutural = a tool não existe para aquele agente. Conceder leitura e não conceder escrita resolve no nível da plataforma.
- **C) ❌** Prompt de agregação do coordenador não governa o que o subagente pode chamar.
- **D) ❌** Descrição de tool é texto que o modelo lê — e presença continua implicando permissão.

**Palavras-gatilho:** `structural` = estrutural.

---

### Q60 — Resposta: **A**
`TS 2.4` · objetivo #34

- **A) ✅** O objetivo diz: expor conteúdo como resources *"to reduce exploratory tool calls and improve agent efficiency in cross-system queries"*. Quando a necessidade é **ler**, resource é o desenho certo.
- **B) ❌** Invertido: tools são model-controlled, resources são application-controlled.
- **C) ❌** Resources não contornam permissões.
- **D) ❌** Resources são somente leitura; escrita é tool.

**Palavras-gatilho:** `act on it` = agir sobre ele.

---

## Autoavaliação

| Acertos | Leitura |
|---|---|
| 54–60 (90%+) | Domínio sólido. |
| 43–53 (72–89%) | Faixa de aprovação. Disseque cada erro. |
| 30–42 (50–71%) | Releia descrições de tools (2.1), erros estruturados (2.2) e `tool_choice` (2.3). |
| < 30 | Refaça a teoria antes de nova rodada. |

**Os três eixos que este domínio cobra:**
1. **Descrição de tool** resolve seleção errada — não `tool_choice`, não prompt.
2. **`tool_choice`** resolve *se* uma tool é chamada — `auto` (pode), `any` (alguma), `tool` (aquela), `none` (nenhuma).
3. **Presença implica permissão** — a única forma de impedir uso fora do papel é **não dar a tool**.
