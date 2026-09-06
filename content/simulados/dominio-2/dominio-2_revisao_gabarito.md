# Gabarito de Revisão — CCA-F | Domínio 2 (Tool Design & MCP Integration)

Explicações em PT-BR. O sufixo `· (x.y)` indica o task statement; itens cruzados trazem `(cruza X + Y)` no enunciado e a nota "Task statements combinados" nos metadados.

---

## Q1 — Resposta correta: **B** · (2.1)

A `description` (não o nome da função Python, não o system prompt) é o sinal de seleção. Duas tools com descrições vagas e sobrepostas — uma delas um "catch-all" de escopo amplo — precisam ser reescritas com fronteira explícita (o que cada uma cobre vs a outra).

- **A — errada:** renomear a função Python interna não muda o que é enviado à API (`name`/`description`/`input_schema`); mexe na camada errada (camada/alvo errado).
- **B — correta.**
- **C — errada:** mapa palavra→tool no system prompt, mantido à mão a cada nova frase que erra, é enforcement probabilístico onde o requisito pede um conserto determinístico na declaração da tool (probabilístico onde precisa ser determinístico).
- **D — errada:** forçar `tool_choice` para toda a fila mascara o problema de descrição e trava outras chamadas legítimas de `apply_codemod` — conserta na camada errada (camada/alvo errado).

**Tópicos:** Descrições de Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: descrições de ferramenta como seletor primário do LLM

## Q2 — Resposta correta: **A** · (2.4)

Variável obrigatória sem `:-default` ausente no ambiente faz o **parse do config falhar** antes de qualquer tentativa de conexão — não é um erro de rede/autenticação. A correção é popular a env var na máquina, não tocar no `.mcp.json` versionado.

- **A — correta.**
- **B — errada:** não existe cache de config a ser limpo nesse mecanismo — feature inexistente porém verossímil.
- **C — errada:** contraria o comportamento real (var obrigatória sem default falha o parse; não vira string vazia silenciosa) — equívoco de capacidade.
- **D — errada:** mover para `~/.claude.json` com valor hardcoded reintroduz segredo literal versionável/sincronizável e generaliza mal a precedência de scope para justificar uma alavanca errada (camada/alvo errado).

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: causa raiz > sintoma

## Q3 — Resposta correta: **C** · (2.2)

O mesmo payload malformado é reenviado sem mudança — isso é erro de **input do chamador** (`validation`), não uma falha temporária do serviço. `isRetryable: false` evita repetir uma chamada que nunca vai ter sucesso, e o `message` deve nomear o campo esperado.

- **A — errada:** um mismatch estrutural persistente não é resolvido por retry — chamar `transient` aqui é equívoco de capacidade.
- **B — errada:** `is_error` sozinho, sem categoria/mensagem, não dá ao chamador como corrigir o payload (não mapeia a um arquétipo §4 — erro mecanístico específico: `is_error` isolado não basta).
- **C — correta.**
- **D — errada:** "não-retryable implica sempre `business`" é uma generalização errada da taxonomia — o campo renomeado não é violação de política (não mapeia a um arquétipo §4 — erro mecanístico específico: categoria não decorre de retryable/não-retryable).

**Tópicos:** Erros Estruturados

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: categorização correta do erro estruturado (validation ≠ transient) orienta a decisão de retry

## Q4 — Resposta correta: **D** · (2.5)

Busca de **conteúdo** em muitos arquivos é o trabalho do Grep (ripgrep): saída estruturada, sem precisar ler cada arquivo inteiro via Read nem orquestrar o shell manualmente.

- **A — errada:** Glob casa **nomes** de arquivo, não conteúdo — não acharia arquivos cujo nome não contém "LEGACY_FLAG" mas cujo conteúdo sim (equívoco de capacidade).
- **B — errada:** shell-out via Bash com `find`/`xargs` reintroduz texto cru e escapa as deny-rules determinísticas das tools dedicadas — camada/alvo errado.
- **C — errada:** construir um serviço de indexação para uma busca pontual em 200 arquivos é over-engineering para o que o Grep já resolve diretamente.
- **D — correta.**

**Tópicos:** Built-in Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 2 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: casar a ferramenta ao requisito (busca de conteúdo → Grep, não Read/Bash)

## Q5 — Resposta correta: **C** · (2.3)

Quebra-automatismo: aqui **forçar `tool_choice`** é de fato a resposta certa — mas só no primeiro turno, retornando a `"auto"` depois. Isso garante deterministicamente o passo obrigatório sem travar o resto da sessão.

- **A — errada:** reforçar a instrução no prompt continua sendo enforcement probabilístico — foi exatamente o que já falhou em 6% dos casos (probabilístico onde precisa ser determinístico).
- **B — errada:** forçar em **todo** turno trava o pipeline — o agente nunca mais escolhe livremente entre `lookup_account`/`process_refund`/`escalate_to_human` (camada/alvo errado: aplica o mecanismo no escopo errado, todo turno em vez de só o primeiro).
- **C — correta.**
- **D — errada:** treinar um classificador para decidir se o primeiro passo é necessário é over-engineering para um requisito que `tool_choice` resolve nativamente.

**Tópicos:** Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 2 + integração 0 + cenário 1 + distratores 1
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: `tool_choice` forçado garante sequenciamento determinístico do primeiro passo, sem exigir enforcement por prompt

## Q6 — Resposta correta: **D** · (2.1)

O exemplo trabalhado faz parte do sinal de seleção tanto quanto a prosa da `description` — um exemplo que contradiz o propósito declarado (mostra resumo em vez de veredito) é o que o modelo está imitando. Corrigir o exemplo para bater com o formato declarado resolve na origem.

- **A — errada:** remover o exemplo não é a correção — um exemplo bem alinhado é sinal útil, não ruído a eliminar (não mapeia a um arquétipo §4 — erro mecanístico específico).
- **B — errada:** forçar `tool_choice` garante que a tool seja chamada, mas não corrige o **formato de saída** que a tool produz — camada/alvo errado.
- **C — errada:** um lembrete no system prompt tenta compensar por enforcement probabilístico um problema que mora na declaração da tool (probabilístico onde precisa ser determinístico).
- **D — correta.**

**Tópicos:** Descrições de Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: consistência interna da descrição (exemplo alinhado ao propósito declarado) como sinal de seleção

## Q7 — Resposta correta: **C** · (2.4)

Scope `local` é pessoal/não-versionado e vence `project` **sem merge de campos** — por isso só a máquina do engenheiro (onde o override local existe) continua vendo o binário de debug, e nenhum diff aparece no repositório compartilhado.

- **A — errada:** contradiz o próprio enunciado — nenhum diff aparece no repositório compartilhado; culpar um commit acidental é apontar para o lugar errado (camada/alvo errado).
- **B — errada:** contraria a regra explícita de precedência sem merge — os campos não se combinam entre scopes (equívoco de capacidade).
- **C — correta.**
- **D — errada:** não existe expiração automática de entradas de scope local — feature inexistente porém verossímil.

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: precedência de scope `local > project > user` sem merge de campos — usa-se a entry inteira do scope vencedor

## Q8 — Resposta correta: **B** · (2.2)

Mesma tool, duas causas reais diferentes: o 503 é recuperável com retry (transient/retryable) e o bloqueio de compliance é uma regra de negócio permanente até revisão manual (business/não-retryable). Separar as categorias evita tanto retry desperdiçado quanto esconder o motivo real do bloqueio.

- **A — errada:** tratar o bloqueio de compliance como transitório desperdiça chamadas em algo que retry nunca resolve — equívoco de capacidade.
- **B — correta.**
- **C — errada:** `validation` pressupõe input malformado do chamador; nenhum dos dois casos é isso (não mapeia a um arquétipo §4 — erro mecanístico específico: categoria não bate com a causa real).
- **D — errada:** inferir a causa pela redação de uma mensagem genérica é confiar num proxy não confiável, exatamente o problema que os metadados estruturados existem para eliminar (proxy plausível não confiável).

**Tópicos:** Erros Estruturados

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: categorização correta do erro estruturado guia retry local vs propagação/mensagem ao cliente

## Q9 — Resposta correta: **D** · (cruza 2.1 + 2.3)

`tool_choice` forçado para **uma única tool** ao longo de uma fila heterogênea quebra as outras operações legítimas (é sequenciar um passo, não desambiguar entre três formas de pedido diferentes). O conserto real continua sendo as descrições: voltar a `"auto"` e diferenciar as três com fronteira explícita.

- **A — errada:** manter a tool travada e só pedir "raciocine antes" no prompt é enforcement probabilístico sobreposto a uma escolha já travada — não resolve o `check_document_exists` que nunca mais é chamado (probabilístico onde precisa ser determinístico).
- **B — errada:** reatribuir a tool forçada turno a turno com base na frase mais recente é uma heurística frágil e cara de manter — over-engineering.
- **C — errada:** renomear só `check_document_exists` mantendo a escolha forçada em `fetch_document` não muda nada, porque a tool renomeada continua inacessível — camada/alvo errado.
- **D — correta.**

**Tópicos:** Descrições de Tools, Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 9 = Bloom 4 + integração 1 + cenário 2 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: descrições de ferramenta como seletor primário — `tool_choice` forçado serve para sequenciar um passo, não para desambiguar entre múltiplas formas de pedido no mesmo run
- Task statements combinados: 2.1 (descrições) + 2.3 (mecânica de `tool_choice` forçado)

## Q10 — Resposta correta: **A** · (cruza 2.2 + 2.4)

A causa é uma regra de negócio do servidor (freeze de release), não um problema de configuração — o erro correto é `business`/`isRetryable: false` nomeando o freeze. Trocar qual entry do `codeform` vence (local vs project) não muda a política que o servidor real aplica: é a alavanca errada, mesmo que a mecânica de precedência em si esteja certa.

- **A — correta.**
- **B — errada:** a precedência `local > project > user` sem merge é real, mas usá-la para apontar para uma variante "relaxada" só contorna a política de freeze em vez de resolvê-la — resolve no lugar errado (camada/alvo errado).
- **C — errada:** reforçar por prompt um retry cego de até 5 tentativas ignora que a causa é permanente enquanto o freeze durar — probabilístico onde precisa ser determinístico.
- **D — errada:** classificar como `transient` um bloqueio permanente de política é equívoco de capacidade — nenhuma tentativa local vai ter sucesso enquanto o freeze estiver ativo.

**Tópicos:** Erros Estruturados, MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: causa raiz > sintoma — a categoria do erro estruturado (business, não-retryable) deve refletir a causa real, e re-configurar scope não substitui isso
- Task statements combinados: 2.2 (erro estruturado propagado) + 2.4 (precedência de scope não é a alavanca para uma política do servidor)

## Q11 — Resposta correta: **B** · (cruza 2.3 + 2.5)

Least privilege aplica-se igualmente a built-ins e a tools MCP customizadas: Bash fica porque o papel legitimamente precisa **executar** a suíte `pytest` (execução, não busca em arquivo); `mcp__deploy__push_hotfix` sai porque está fora do papel deste subagente — a garantia vem de removê-la de `allowed_tools`, não de confiar que o modelo não vai chamá-la.

- **A — errada:** "evite Bash" mira leitura via shell-out (`cat`/`grep`/`find`), não a execução de um programa como `pytest` — remover Bash aqui é aplicar a diretriz fora do seu alvo (equívoco de capacidade).
- **B — correta.**
- **C — errada:** uma regra no system prompt proibindo a chamada é exatamente o que já falhou na auditoria — enforcement probabilístico (probabilístico onde precisa ser determinístico).
- **D — errada:** empacotar o `pytest` numa tool MCP nova só para "não usar Bash" é complexidade extra sem necessidade — over-engineering.

**Tópicos:** Tool Choice, Built-in Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 4 + integração 1 + cenário 1 + distratores 1
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: least privilege / ferramentas escopadas — `allowed_tools` escopa built-ins e tools MCP customizadas pelo mesmo princípio
- Task statements combinados: 2.3 (escopo de tools por papel) + 2.5 (julgamento de built-in: Bash para execução, não para busca)

## Q12 — Resposta correta: **A** · (cruza 2.1 + 2.4)

O prefixo `mcp__<server>__` existe para roteamento/execução (de qual servidor a tool veio), não é um sinal semântico que o modelo é garantido a usar para diferenciar conteúdo. As duas `description`s continuam vagas e quase idênticas — o mesmo problema de fronteira que qualquer par de tools sobrepostas, só que aqui as tools vêm de servidores MCP diferentes.

- **A — correta.**
- **B — errada:** não há shadowing de scope entre dois servidores MCP distintos que devem coexistir — diagnosticar como problema de precedência aponta para o lugar errado (camada/alvo errado).
- **C — errada:** um sufixo cosmético (`_v2`) no nome de registro não adiciona informação de fronteira; a mesma descrição vaga permanece — camada/alvo errado.
- **D — errada:** forçar `tool_choice` com base no formato aparente do ID é uma heurística frágil que não escala para pedidos de notícia — probabilístico onde precisa ser determinístico.

**Tópicos:** Descrições de Tools, MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: descrições de ferramenta como seletor primário do LLM — o namespace `mcp__server__tool` não substitui uma descrição diferenciada
- Task statements combinados: 2.1 (descrição como seletor) + 2.4 (namespacing/registro de tools MCP)

---

## Autoavaliação
- **11–12/12:** domínio sólido do Domínio 2 — pronto para o Domínio 3.
- **8–10/12:** revise os pontos que errou pelos resumos por task statement; atenção especial aos itens cruzados (Q9–Q12), que exigem combinar dois mecanismos ao mesmo tempo.
- **≤7/12:** releia `anotacoes/dominio-2_resumo.md` e rode os exercícios 2.1–2.5 antes de avançar ao Domínio 3.
