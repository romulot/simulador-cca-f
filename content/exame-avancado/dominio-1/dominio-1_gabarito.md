# Gabarito — Bloco 1

**Domínio 1 — Agentic Architecture & Orchestration (peso 27%)**

Fontes: `livro01.pdf`, `livro02.pdf`, objetivos de `livro03.md`.
Cada entrada traz: resposta · task statement do guia oficial · objetivo do livro03 ·
por que cada alternativa está certa ou errada · **palavras-gatilho** (leia só depois de responder).

---

## Q1 — Resposta correta: **D**

O sinal confiável para decidir se o loop deve continuar é o `stop_reason` da API, não a presença de texto na resposta: enquanto for `tool_use` existe uma chamada pendente para executar; `end_turn` sinaliza conclusão.

- **A — errada:** Over-engineering clássico: um classificador de ML para um campo que a API já devolve pronto.
- **B — errada:** Enforcement por prompt. Mesmo instruído, o modelo pode emitir texto antes do `tool_use` — o material é explícito: "even since you said 'never call' it may still".
- **C — errada:** Cap de iteração não é lógica de controle, é rede de segurança. Não resolve o critério de parada errado.
- **D — correta.**

**Tópicos:** Loop Agêntico

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: `stop_reason` como sinal determinístico de parada do loop (nunca presença de texto)
- Arquétipos: A=over-engineering, B=probabilistico-vs-garantia, C=camada-alvo-errado

---

## Q2 — Resposta correta: **D**

Subtarefas independentes que não dependem umas das outras devem sair como múltiplas chamadas de ferramenta no mesmo turno do assistente, executadas em paralelo, cortando o número de idas e voltas com a API.

- **A — errada:** `max_tokens` limita o tamanho da resposta, não a concorrência.
- **B — errada:** Fundir três tools numa só é rígido: perde a granularidade e só funciona para este caso específico.
- **C — errada:** Trocar de modelo muda raciocínio e custo, não o número de idas e voltas. A latência aqui é serialização, não velocidade do modelo.
- **D — correta.**

**Tópicos:** Loop Agêntico

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 2 + integração 0 + cenário 1 + distratores 1
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: tool calls independentes saem em paralelo no mesmo turno, não serializadas
- Arquétipos: A=camada-alvo-errado, C=camada-alvo-errado

---

## Q3 — Resposta correta: **D**

Subagentes não herdam automaticamente o contexto do coordenador nem memória entre invocações: o que "foi discutido" na conversa principal não existe para o subagente a menos que seja passado explicitamente no prompt de spawn.

- **A — errada:** Não existe "chamada de carregamento de memória". Subagente não tem memória entre invocações.
- **B — errada:** Ferramenta não é o problema: mesmo com Read, ele não sabe **quais** arquivos ler.
- **C — errada:** Contexto do coordenador não é passado nem parcialmente — não é questão de ter enchido.
- **D — correta.**

**Tópicos:** Spawn de Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: subagente não herda contexto do pai — só o que é passado explicitamente no spawn
- Arquétipos: A=feature-inexistente-verossimil, B=camada-alvo-errado, C=montante-jusante

---

## Q4 — Resposta correta: **B**

Um gate estrutural (hook `PreToolUse`) bloqueia a chamada antes que ela aconteça — é mecanismo, não pedido. Um booleano de auto-relato ou instrução de prompt continua sendo o modelo se autoavaliando, o que não é garantia.

- **A — errada:** Confiar no auto-relato do agente. Sinal não confiável.
- **B — correta.**
- **C — errada:** Um booleano que o **próprio agente preenche** não é verificação — é o mesmo auto-relato com outra roupa.
- **D — errada:** O arquétipo mais cobrado da prova: **enforcement por prompt onde o requisito é garantia**. Já falhou 3 vezes; reposicionar o texto não muda a natureza.

**Tópicos:** Enforcement de Workflow, Hooks

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: hook `PreToolUse` como gate estrutural — garantia, não instrução
- Arquétipos: A=sinal-nao-confiavel, C=sinal-nao-confiavel, D=probabilistico-vs-garantia

---

## Q5 — Resposta correta: **A**

Retomar um processo longo depois de uma falha exige estado durável, gravado fora da conversa, por etapa concluída — na retomada, o sistema pula direto o que já tem saída registrada em vez de refazer o trabalho.

- **A — correta.**
- **B — errada:** Paralelizar não preserva trabalho concluído — só muda quando as perdas acontecem.
- **C — errada:** Resumo em linguagem natural na conversa não é registro confiável: some com compactação e não é verificável.
- **D — errada:** Retry ataca falha transitória, não retomada depois do crash do processo.

**Tópicos:** Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: estado durável por etapa (fora da conversa) permite retomar sem repetir trabalho
- Arquétipos: B=camada-alvo-errado, C=sinal-nao-confiavel, D=camada-alvo-errado

---

## Q6 — Resposta correta: **D**

Decomposição estreita ("narrow decomposition") é o coordenador delegar só o que ele pensou em perguntar; como cada subagente só vê seu próprio contexto isolado, nenhum deles consegue sinalizar de volta um tema importante que ficou de fora do escopo.

- **A — errada:** Não houve descarte por confiança: os temas nunca foram pesquisados.
- **B — errada:** Paralelo vs sequencial não tem relação com cobertura temática.
- **C — errada:** Subagentes não compartilham janela de contexto — é exatamente o contrário.
- **D — correta.**

**Tópicos:** Decomposição de Tarefas

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: decomposição estreita esconde lacunas porque nenhum subagente vê o quadro completo para sinalizar o que falta
- Arquétipos: A=montante-jusante, B=camada-alvo-errado, C=camada-alvo-errado

---

## Q7 — Resposta correta: **B**

Um prompt procedural (uma sequência fixa de passos) quebra assim que a entrada real diverge do caminho previsto. Definir o objetivo e o critério de qualidade, em vez da sequência exata, deixa o agente decidir o caminho e redelegar quando um passo falha.

- **A — errada:** Remenda o sintoma. O quarto passo ainda é um passo fixo — o próximo caso quebra igual.
- **B — correta.**
- **C — errada:** Timeout ataca lentidão, não ausência de resultado útil.
- **D — errada:** Reordenar mantém a rigidez e ainda inverte a dependência.

**Tópicos:** Enforcement de Workflow

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 4 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: prompt goal-oriented (objetivo + critério) é mais robusto que prompt procedural (sequência fixa de passos)
- Arquétipos: A=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q8 — Resposta correta: **C**

`allowedTools`/`disallowedTools` são aplicados na plataforma: se a ferramenta de edição não está no conjunto permitido do subagente, ele estruturalmente não tem como editar, independente do que o prompt ou o modelo digam.

- **A — errada:** Plan mode é modo de sessão do Claude Code, não configuração de subagente — e não é o mecanismo de restrição aqui.
- **B — errada:** Modelo não define capacidade de escrita. Haiku com Edit edita.
- **C — correta.**
- **D — errada:** Enforcement por prompt. Presença de tool implica permissão para o modelo — se Edit estiver lá, ele usa.

**Tópicos:** Spawn de Subagentes, Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `allowedTools`/`disallowedTools` são enforcement de plataforma, não sugestão de prompt
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=probabilistico-vs-garantia

---

## Q9 — Resposta correta: **B**

Retomar uma sessão restaura a conversa registrada, não o estado atual do mundo: o modelo não sabe quanto tempo passou nem o que mudou enquanto a sessão estava parada. Por isso a retomada precisa combinar um resumo estruturado com releitura dirigida do que pode ter mudado.

- **A — errada:** Ele só detecta se abrir os arquivos — e a premissa é que ele já propôs mudanças sem abrir.
- **B — correta.**
- **C — errada:** `/compact` resume a conversa; não consulta o repositório nem detecta mudanças externas.
- **D — errada:** Sessão retomada lê arquivos normalmente. O problema é não saber que precisa reler.

**Tópicos:** Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: retomar sessão restaura a conversa, não o mundo — o modelo desconhece mudanças ocorridas enquanto estava pausado
- Arquétipos: A=montante-jusante, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q10 — Resposta correta: **A**

Decomposição adaptativa dinâmica se aplica quando um achado intermediário muda o que precisa ser investigado a seguir — o caso canônico é investigação de incidente, em que a causa raiz só aparece depois de olhar os primeiros sinais.

- **A — correta.**
- **B — errada:** Contexto grande não substitui decisão adaptativa sobre o que investigar.
- **C — errada:** Prompt chaining serve quando *"the shape of the work is fixed regardless of content"* — o enunciado diz o oposto.
- **D — errada:** Cinco vezes o mesmo prompt gera sobreposição e desperdício, sem profundidade adicional.

**Tópicos:** Decomposição de Tarefas

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: decomposição dinâmica: um achado intermediário redefine o próximo passo da investigação
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=enumerar-vs-generalizar

---

## Q11 — Resposta correta: **B**

Dar o mesmo briefing a vários agentes de pesquisa produz respostas sobrepostas e desperdiça tokens; a correção é particionar o escopo para que cada agente cubra uma fatia distinta e sem sobreposição.

- **A — errada:** Respostas mais curtas continuam sendo as mesmas três respostas.
- **B — correta.**
- **C — errada:** Reduz custo mas também cobertura — desiste do paralelismo em vez de usá-lo direito.
- **D — errada:** Deduplicar no fim já pagou os tokens. Trata sintoma.

**Tópicos:** Decomposição de Tarefas

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: particionar o escopo entre agentes de pesquisa evita sobreposição e desperdício de tokens
- Arquétipos: A=camada-alvo-errado, C=extremo-vs-meio, D=montante-jusante

---

## Q12 — Resposta correta: **B**

Uma instrução vaga como "seja minucioso" não é um critério verificável; uma função forçante como `evaluate_coverage`, que exige um score e uma lista de lacunas em saída estruturada antes de o loop continuar, é o que de fato detecta cobertura incompleta.

- **A — errada:** "Seja minucioso" é instrução vaga — nenhum critério verificável.
- **B — correta.**
- **C — errada:** Mais agentes na primeira passada amplia cobertura por sorte, não fecha lacuna identificada.
- **D — errada:** Confiança auto-reportada é sinal não confiável — arquétipo clássico de distrator.

**Tópicos:** Decomposição de Tarefas

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: função forçante com saída estruturada (score + lista de lacunas) detecta cobertura incompleta; instrução vaga não
- Arquétipos: A=probabilistico-vs-garantia, C=camada-alvo-errado, D=sinal-nao-confiavel

---

## Q13 — Resposta correta: **B**

Fork de sessão parte de um estado comum e cria ramos independentes, cada um com seu próprio histórico e identificador, isolados entre si e retomáveis — diferente de `/clear` (apaga tudo) ou de continuar sequencialmente no mesmo histórico (contamina).

- **A — errada:** `/clear` apaga a conversa — perderia justamente a análise que se quer reaproveitar.
- **B — correta.**
- **C — errada:** Sequencial no mesmo histórico contamina: cada tentativa vê a anterior.
- **D — errada:** "Manter separado mentalmente" não é isolamento, é esperança.

**Tópicos:** Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: fork de sessão cria ramos independentes e isolados a partir de um estado comum
- Arquétipos: A=camada-alvo-errado, C=montante-jusante, D=sinal-nao-confiavel

---

## Q14 — Resposta correta: **D**

Sem a ferramenta de invocação de agente (Agent/Task) disponível no conjunto do coordenador, não existe mecanismo de spawn — declarar os subagentes e instruir o coordenador a delegar não cria, por si só, o canal técnico para chamá-los.

- **A — errada:** Ordem de declaração no arquivo não é um fator.
- **B — errada:** Prompt curto piora a seleção, não impede a invocação.
- **C — errada:** `max_tokens` não bloqueia chamada de tool.
- **D — correta.**

**Tópicos:** Spawn de Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: invocar um subagente exige a ferramenta de spawn disponível — definir o agente não basta
- Arquétipos: A=feature-inexistente-verossimil, B=camada-alvo-errado, C=camada-alvo-errado

---

## Q15 — Resposta correta: **D**

Numa arquitetura hub-and-spoke, o coordenador é o único ponto de passagem: toda mensagem de entrada, de saída e toda falha passam por ele, o que o torna o único lugar onde é possível inspecionar e controlar o fluxo inteiro.

- **A — errada:** Log estruturado ajuda, mas com conexões diretas continua não havendo camada única para capturar erro nem controlar o que cruza fronteira.
- **B — errada:** Histórico completo para todos explode contexto e não resolve rastreio.
- **C — errada:** Agente único descarta isolamento de contexto e especialização de papel.
- **D — correta.**

**Tópicos:** Coordenador e Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: coordenador como ponto único de passagem (choke point) viabiliza observabilidade e controle
- Arquétipos: A=camada-alvo-errado, B=extremo-vs-meio, C=camada-alvo-errado

---

## Q16 — Resposta correta: **D**

Um teto de iterações é uma rede de segurança contra loops travados, mas não é lógica de controle — o critério de parada correto continua sendo o `stop_reason`; os dois mecanismos são complementares, não substitutos um do outro.

- **A — errada:** Sem cap, um loop travado roda indefinidamente. O cap tem função, só não é a de controle.
- **B — errada:** Percentual auto-estimado é sinal não confiável.
- **C — errada:** Qualquer número fixo erra nos dois sentidos — corta tarefa complexa e sobra na simples.
- **D — correta.**

**Tópicos:** Loop Agêntico

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: cap de iterações é salvaguarda; `stop_reason` é o controle real de parada — os dois juntos, não um no lugar do outro
- Arquétipos: B=sinal-nao-confiavel, C=extremo-vs-meio

---

## Q17 — Resposta correta: **D**

Escopo grande, risco alto e exigência de aprovação humana antes de qualquer modificação é exatamente o caso de uso do Plan Mode: o agente analisa e propõe, mas não modifica arquivos nem executa comandos até ser aprovado.

- **A — errada:** `acceptEdits` aceita as edições automaticamente — a revisão vira post-mortem de 40 arquivos.
- **B — errada:** `/rewind` desfaz depois; o requisito é aprovar **antes** de qualquer modificação.
- **C — errada:** `bypassPermissions` remove toda a barreira. O oposto do requisito.
- **D — correta.**

**Tópicos:** Plan Mode

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: Plan Mode: análise sem modificação, aprovação humana obrigatória antes de qualquer mudança
- Arquétipos: A=probabilistico-vs-garantia, B=montante-jusante, C=extremo-vs-meio

---

## Q18 — Resposta correta: **B**

Um protocolo de handoff é um pacote estruturado que o agente monta antes de escalar para um humano — contexto, ações já tentadas, o bloqueio e a decisão necessária — para que quem recebe não precise vasculhar o histórico inteiro da conversa.

- **A — errada:** Transcrição crua é exatamente "cavar no histórico", só que terceirizado para o humano.
- **B — correta.**
- **C — errada:** Score de confiança não carrega contexto nem ações.
- **D — errada:** Mais curto sem estrutura piora: menos informação, mesma reconstrução.

**Tópicos:** Enforcement de Workflow

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: handoff estruturado (contexto + ações tentadas + bloqueio + decisão) evita reconstrução manual do caso pelo humano
- Arquétipos: A=montante-jusante, C=vazio-ausente, D=camada-alvo-errado

---

## Q19 — Resposta correta: **A**

Diante da falha de um subagente, o padrão recomendado é tentar de novo localmente, depois um fallback, e só escalar para um humano quando as tentativas se esgotarem — nunca propagar tudo indiscriminadamente nem mascarar a falha como se fosse sucesso.

- **A — correta.**
- **B — errada:** Ignorar erro produz síntese sobre dados incompletos sem que ninguém saiba.
- **C — errada:** Reiniciar tudo por um erro transitório é o mesmo desperdício com custo maior.
- **D — errada:** Retornar vazio mascara a falha — e vazio por erro ≠ vazio válido (ver Q sobre `access_failure` vs `valid_empty`).

**Tópicos:** Propagação de Erros

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: retry local → fallback → escalonamento só quando as tentativas se esgotam
- Arquétipos: B=vazio-ausente, C=over-engineering, D=vazio-ausente

---

## Q20 — Resposta correta: **C**

Encadeamento de prompts (prompt chaining) serve quando a forma do trabalho é fixa independente do conteúdo — ETL, transformação de documento — que é exatamente o caso de um pipeline de processamento em etapas fixas e sequenciais.

- **A — errada:** Decidir em runtime o que já se sabe fixo adiciona custo e variabilidade sem ganho.
- **B — errada:** Adaptativo só se paga quando os achados mudam o que fazer em seguida. Aqui não mudam.
- **C — correta.**
- **D — errada:** Os quatro passos são dependentes em cadeia — não dá para paralelizar.

**Tópicos:** Decomposição de Tarefas

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: prompt chaining é adequado quando a forma do trabalho é fixa, independente do conteúdo processado
- Arquétipos: A=over-engineering, B=over-engineering, D=camada-alvo-errado

---

## Q21 — Resposta correta: **B**

Seleção dinâmica de orquestração é o coordenador escolher, em tempo de execução, a forma da orquestração — agente único para tarefa simples, sequencial para multi-etapa dependente, paralelo para subtarefas independentes.

- **A — errada:** Garante o contrário: prevê explicitamente múltiplos agentes.
- **B — correta.**
- **C — errada:** Permissão de tool é `allowedTools`, não texto de prompt.
- **D — errada:** Agregação continua necessária — é outra etapa do ciclo de vida.

**Tópicos:** Coordenador e Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: o coordenador escolhe a forma da orquestração (único/sequencial/paralelo) dinamicamente, não fixa de antemão
- Arquétipos: A=camada-alvo-errado, C=camada-alvo-errado, D=vazio-ausente

---

## Q22 — Resposta correta: **A**

Nem toda consulta precisa do pipeline completo: selecionar só os agentes necessários e usá-los apenas quando agregam valor evita custo desnecessário sem sacrificar qualidade nas consultas que realmente precisam de mais agentes.

- **A — correta.**
- **B — errada:** Modelo barato para tudo degrada as consultas complexas — troca custo por qualidade no lugar errado.
- **C — errada:** Cache por string de consulta quase nunca acerta em linguagem natural, e não resolve o desperdício da primeira execução.
- **D — errada:** Reduzir contexto não reduz o número de agentes chamados.

**Tópicos:** Coordenador e Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: seleção dinâmica de agentes (só os necessários) em vez de rodar o pipeline completo sempre
- Arquétipos: B=extremo-vs-meio, C=sinal-nao-confiavel, D=camada-alvo-errado

---

## Q23 — Resposta correta: **C**

O campo `description` de um `AgentDefinition` é o que o coordenador lê para decidir se invoca aquele agente — é uma descrição de ferramenta disfarçada, e por isso segue as mesmas regras: propósito claro, formato de entrada esperado e limites de uso.

- **A — errada:** Controle de tools é `allowedTools`/`disallowedTools`.
- **B — errada:** O system prompt é campo separado; é a identidade e as regras de operação do agente.
- **C — correta.**
- **D — errada:** Não é texto de interface para o usuário final.

**Tópicos:** Descrições de Tools, Spawn de Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 1 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: `description` de um subagente é lida pelo coordenador para decidir invocação — mesmas regras de uma tool description
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=camada-alvo-errado

---

## Q24 — Resposta correta: **A**

Fork de sessão cria um novo identificador de sessão preservando o histórico da conversa até aquele ponto, sem afetar a sessão original — diferente de `/clear` (zera), `--continue`/`--resume` (retoma a mesma sessão) ou `/compact` (resume para economizar tokens).

- **A — correta.**
- **B — errada:** `/clear` zera a conversa (mantém `CLAUDE.md` e AutoMemory) — perde o histórico que se quer aproveitar.
- **C — errada:** ⚠️ `--continue` é **alias de `--resume`** segundo o material: continua a mesma sessão, não abre uma cópia.
- **D — errada:** `/compact` resume para economizar tokens; não cria ramo nem preserva o original separado.

**Tópicos:** Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Difícil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: fork cria uma nova sessão a partir do histórico atual, preservando a original intacta
- Arquétipos: B=camada-alvo-errado, C=feature-inexistente-verossimil, D=camada-alvo-errado

---

## Q25 — Resposta correta: **D**

Fluxo sequencial deve ser usado quando cada etapa consome a saída da etapa anterior — paralelizar etapas dependentes produz entrada vazia para quem viria depois, e comunicação direta entre subagentes não existe em hub-and-spoke.

- **A — errada:** Fork serve para explorar caminhos alternativos, não para encadear dependências.
- **B — errada:** Em hub-and-spoke subagentes **nunca** se falam diretamente.
- **C — errada:** Paralelizar etapas dependentes produz entrada vazia nas seguintes.
- **D — correta.**

**Tópicos:** Coordenador e Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: usar fluxo sequencial quando uma etapa depende da saída da etapa anterior
- Arquétipos: A=camada-alvo-errado, B=feature-inexistente-verossimil, C=vazio-ausente

---

## Q26 — Resposta correta: **A**

É o coordenador atuando como ponto único de passagem que torna o fluxo e as falhas de cada subagente inspecionáveis — subagentes têm contexto isolado entre si, não compartilhado, e comunicação direta destruiria essa observabilidade.

- **A — correta.**
- **B — errada:** Falso: subagentes têm contexto **isolado**, não compartilhado.
- **C — errada:** Comunicação direta é justamente o que destrói a observabilidade.
- **D — errada:** Mesmo modelo não implica mesmo raciocínio nem visibilidade.

**Tópicos:** Coordenador e Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: coordenador como ponto único de passagem é o que viabiliza observabilidade de falhas
- Arquétipos: B=feature-inexistente-verossimil, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q27 — Resposta correta: **C**

Depois de uma chamada de ferramenta, o resultado deve ser anexado como um bloco `tool_result` tipado, casado ao `tool_use_id` correspondente, e a API é chamada de novo com a conversa atualizada — o loop continua até `stop_reason` virar `end_turn`.

- **A — errada:** Nova conversa descarta o histórico que dá sentido ao resultado.
- **B — errada:** Texto livre quebra o protocolo: o modelo espera o bloco tipado, casado com o `tool_use_id`.
- **C — correta.**
- **D — errada:** O loop não terminou — `stop_reason` era `tool_use`, não `end_turn`.

**Tópicos:** Loop Agêntico

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: resultado de tool call é anexado como bloco `tool_result` tipado, casado ao `tool_use_id`, não texto livre
- Arquétipos: A=montante-jusante, B=probabilistico-vs-garantia, D=camada-alvo-errado

---

## Q28 — Resposta correta: **A**

Definir o objetivo e o critério do que conta como resposta completa (quais caminhos, cobertura de testes) deixa a estratégia de busca livre para o subagente decidir, sem perder controle sobre o que precisa ser entregue — diferente de fixar a sequência exata de tools.

- **A — correta.**
- **B — errada:** A remove ambiguidade e também adaptabilidade: se `processPayment` tiver outro nome em parte do repo, A não acha nada.
- **C — errada:** Inconsistência vem de critério ausente, não de sequência livre — e B tem critério.
- **D — errada:** Não são equivalentes: A fixa a sequência de tools, B fixa o resultado esperado.

**Tópicos:** Enforcement de Workflow

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: definir objetivo + critério de completude adapta sem perder controle, melhor que fixar a sequência de tools
- Arquétipos: B=extremo-vs-meio, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q29 — Resposta correta: **C**

Para detectar decomposição fraca antes que o trabalho comece, implementa-se uma tool que revisa a lista de subtarefas antes de prosseguir para gerá-las de fato — verificar só na agregação final é tarde demais, os subagentes já rodaram e gastaram.

- **A — errada:** Só na agregação é tarde: os subagentes já rodaram e gastaram.  (O material aceita checar **também** ali — mas a pergunta pede "antes de o trabalho começar".)
- **B — errada:** Listar todas as subtarefas possíveis é o oposto de decompor: vira pipeline fixo gigante.
- **C — correta.**
- **D — errada:** Repetir mais vezes uma decomposição ruim não a melhora.

**Tópicos:** Decomposição de Tarefas

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: revisar a decomposição antes de delegar, não só na agregação final do resultado
- Arquétipos: A=montante-jusante, B=extremo-vs-meio, D=sinal-nao-confiavel

---

## Q30 — Resposta correta: **A**

Ao encerrar uma sessão, o ambiente devolve um identificador de sessão que permite retomá-la depois (`/resume` ou `claude --resume`), restaurando o histórico da conversa — não há replay automático de tool calls nem gravação como markdown no repositório.

- **A — correta.**
- **B — errada:** Não há replay automático de tool calls.
- **C — errada:** Sessões não são gravadas como markdown no repositório.
- **D — errada:** Sessões encerradas são retomáveis — é a funcionalidade central do tópico.

**Tópicos:** Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 3 = Bloom 1 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: sessão encerrada é retomável pelo `session_id`, restaurando o histórico da conversa
- Arquétipos: B=feature-inexistente-verossimil, C=feature-inexistente-verossimil

---

## Q31 — Resposta correta: **C**

Ao agregar resultados de múltiplos agentes que discordam entre si, a regra de conflito precisa ser explícita e verificável — por exemplo, preferir o dado mais específico — em vez de descartar tudo que diverge ou empurrar o conflito bruto para o leitor.

- **A — errada:** Descartar tudo que é contraditado apaga informação boa junto com a ruim.
- **B — errada:** Concatenar empurra o conflito para o leitor — não é síntese.
- **C — correta.**
- **D — errada:** Confiança auto-reportada como árbitro: sinal não confiável.

**Tópicos:** Coordenador e Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: agregação de resultados conflitantes precisa de regra de resolução explícita (ex.: preferir o dado mais específico)
- Arquétipos: A=vazio-ausente, B=camada-alvo-errado, D=sinal-nao-confiavel

---

## Q32 — Resposta correta: **A**

De todos os campos de um `AgentDefinition`, só `allowedTools`/`disallowedTools` são de fato aplicados na plataforma — os demais (nome, descrição, system prompt) orientam a seleção e o comportamento, mas não impedem nada estruturalmente.

- **A — correta.**
- **B — errada:** Alias de modelo não define capacidade de ferramenta.
- **C — errada:** `name` e `description` orientam a **seleção** pelo coordenador; não impedem nada em runtime.
- **D — errada:** System prompt é instrução; instrução não é enforcement.

**Tópicos:** Spawn de Subagentes, Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `allowedTools`/`disallowedTools` é o único campo de `AgentDefinition` com enforcement de plataforma
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=probabilistico-vs-garantia

---

## Q33 — Resposta correta: **B**

`stop_reason: "end_turn"` indica que o agente decidiu devolver um resultado final ao usuário, encerrando o loop — diferente de ficar sem tokens (outro motivo de parada) ou de querer chamar uma tool (`tool_use`).

- **A — errada:** Ficar sem tokens é outro motivo de parada, não `end_turn`.
- **B — correta.**
- **C — errada:** `end_turn` não significa aguardando confirmação; significa resposta final.
- **D — errada:** Querer chamar tool é `tool_use`.

**Tópicos:** Loop Agêntico

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 3 = Bloom 1 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: `end_turn` sinaliza resposta final do agente, encerrando o loop
- Arquétipos: A=camada-alvo-errado, D=camada-alvo-errado

---

## Q34 — Resposta correta: **D**

Passar achados brutos entre agentes como um único bloco de texto perde a atribuição de origem — quando o texto final é escrito, já não dá mais para saber qual agente disse o quê. A correção é usar objetos estruturados em que conteúdo e metadado de origem viajam juntos.

- **A — errada:** Contexto pequeno truncaria conteúdo; aqui o conteúdo chegou — o que sumiu foi a origem.
- **B — errada:** Verificar na web não recupera qual agente disse o quê.
- **C — errada:** Ordem de execução não afeta atribuição.
- **D — correta.**

**Tópicos:** Descrições de Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: objetos estruturados (conteúdo + metadado de origem) preservam atribuição entre agentes; texto solto não
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=camada-alvo-errado

---

## Q35 — Resposta correta: **C**

Módulos de trabalho independentes, sem dependência compartilhada entre si, devem rodar como subagentes em paralelo — fundir tudo num agente único ou rodar terminais manuais descarta o paralelismo sem necessidade.

- **A — errada:** Fundir em um agente perde isolamento e volta a ser um trabalho longo único.
- **B — errada:** Terminais manuais não é uma configuração de orquestração — e não escala.
- **C — correta.**
- **D — errada:** Sequencial soma as latências, seja o prompt curto ou longo.

**Tópicos:** Coordenador e Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: tarefas independentes sem dependência compartilhada rodam em paralelo, reduzindo tempo de relógio
- Arquétipos: A=over-engineering, B=feature-inexistente-verossimil, D=extremo-vs-meio

---

## Q36 — Resposta correta: **C**

Como cada subagente roda seu próprio loop interno de forma opaca para o coordenador, qualquer coisa que precise ser visível — passos intermediários, decisões — precisa ser incluída explicitamente na saída final que o subagente devolve.

- **A — errada:** Não há memória compartilhada para replay.
- **B — errada:** O pai não herda o contexto do subagente ao término — recebe o resultado.
- **C — correta.**
- **D — errada:** Sequencial não expõe o loop interno; só muda a ordem.

**Tópicos:** Spawn de Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: o loop interno de um subagente é opaco ao coordenador — o que precisa ser visível tem que estar na saída estruturada
- Arquétipos: A=feature-inexistente-verossimil, B=camada-alvo-errado, D=camada-alvo-errado

---

## Q37 — Resposta correta: **D**

Um gate programático (hook `PreToolUse` casado com a condição de pré-requisito) torna estruturalmente impossível pular uma etapa obrigatória — checar depois, reordenar no prompt ou reescrever a descrição da tool não bloqueiam a chamada de fato.

- **A — errada:** Checar depois da migração descobre o problema quando ele já aconteceu.
- **B — errada:** Ordem no prompt é sugestão.
- **C — errada:** Tool description também é texto para o modelo ler — não impede a chamada.
- **D — correta.**

**Tópicos:** Hooks, Enforcement de Workflow

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: gate programático via hook `PreToolUse` torna impossível pular um pré-requisito, não apenas desencorajado
- Arquétipos: A=montante-jusante, B=probabilistico-vs-garantia, C=probabilistico-vs-garantia

---

## Q38 — Resposta correta: **D**

Um plano de investigação adaptativo trata cada achado como entrada para a próxima decisão, não apenas como dado coletado — é um sinal que redesenha o que precisa ser feito a seguir, ao contrário de um plano com etapas fixas de antemão.

- **A — errada:** Observabilidade não é o critério de escolha aqui; adaptabilidade é. (E um plano adaptativo continua observável via coordenador.)
- **B — errada:** Mais etapas fixas continuam sendo um plano fixo.
- **C — errada:** Adaptativo não exige contexto compartilhado — subagentes seguem isolados.
- **D — correta.**

**Tópicos:** Decomposição de Tarefas

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: cada achado intermediário é um sinal que redefine o próximo passo, não só dado a acumular
- Arquétipos: A=camada-alvo-errado, B=extremo-vs-meio, C=camada-alvo-errado

---

## Q39 — Resposta correta: **A**

Um prompt de coordenador bem desenhado cobre decomposição (quebrar em subtarefas), delegação (mandar cada uma para um subagente) e proíbe explicitamente o coordenador de executar o trabalho ele mesmo — agregação é responsabilidade separada.

- **A — correta.**
- **B — errada:** Permissão de tool não se define em prompt.
- **C — errada:** Nada sobre persistência entre reinícios.
- **D — errada:** Não há nada sobre combinar resultados nem resolver conflito.

**Tópicos:** Coordenador e Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: prompt de coordenador define decomposição e delegação, e proíbe o coordenador de executar diretamente
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=vazio-ausente

---

## Q40 — Resposta correta: **C**

O atributo `context: fork` no frontmatter de uma skill ou slash command faz com que ela execute em contexto de subagente isolado, evitando que o processamento intermediário polua o estado da sessão principal.

- **A — errada:** Markdown colapsado é cosmético; os tokens já entraram no contexto.
- **B — errada:** Modelo menor não isola contexto.
- **C — correta.**
- **D — errada:** `/clear` apagaria a sessão principal inteira — remédio pior que a doença.

**Tópicos:** Hierarquia CLAUDE.md, Spawn de Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `context: fork` isola a execução de uma skill/command em contexto de subagente, sem poluir a sessão principal
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=extremo-vs-meio

---

## Q41 — Resposta correta: **C**

Depois de uma pausa longa, o mais eficiente é injetar no contexto exatamente a lista de arquivos que mudaram e pedir uma releitura dirigida a eles — reler tudo funciona mas desperdiça contexto, e confiar num resumo antigo arrisca trabalhar com informação desatualizada.

- **A — errada:** `/compact` resume a conversa; não conhece o repositório.
- **B — errada:** Reler tudo funciona mas queima contexto e tempo — o objetivo é restaurar estado **sem repetir trabalho anterior**.
- **C — correta.**
- **D — errada:** Confiar no resumo antigo é justamente o risco: ele descreve o mundo de uma semana atrás.

**Tópicos:** Resume e Fork de Sessão, Contexto de Codebase

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Médio
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: re-análise dirigida (injetar só os arquivos que mudaram) é mais eficiente que reler tudo ou confiar em resumo antigo
- Arquétipos: A=camada-alvo-errado, B=over-engineering, D=sinal-nao-confiavel

---

## Q42 — Resposta correta: **B**

Quatro políticas independentes devem ser lidas em paralelo, uma por agente, e só a comparação final com as regras de retenção — que depende das quatro saídas — é o passo de síntese sequencial.

- **A — errada:** Agente único perde paralelismo e arrisca "lost in the middle" com quatro documentos longos.
- **B — correta.**
- **C — errada:** Sequencial serializa leituras que não têm dependência entre si.
- **D — errada:** Mesmo briefing para os quatro = sobreposição e desperdício (o erro de partição).

**Tópicos:** Decomposição de Tarefas

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 2 + integração 0 + cenário 1 + distratores 1
- Cenário: S6 — Structured Data Extraction
- Princípio testado: leituras independentes em paralelo, síntese sequencial só na etapa que de fato depende de todas as saídas
- Arquétipos: A=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q43 — Resposta correta: **B**

Rodar testes exige executar comandos (Bash); se o `allowedTools` do subagente só permite leitura e busca, existe um descasamento estrutural entre o que o prompt pede e o que a plataforma de fato permite a ele fazer.

- **A — errada:** `allowedTools` não é conselho: é enforcement de plataforma.
- **B — correta.**
- **C — errada:** Grep busca dentro de arquivos; não executa comandos.
- **D — errada:** Caminhos de teste não resolvem — ele não tem como **executar** nada.

**Tópicos:** Spawn de Subagentes, Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: descasamento entre o que o prompt pede e o `allowedTools` configurado impede a tarefa, independente da redação do prompt
- Arquétipos: A=probabilistico-vs-garantia, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q44 — Resposta correta: **C**

Um objeto de estado estruturado, mantido fora do histórico da conversa, permanece autoritativo mesmo quando a conversa é compactada — a compactação resume o histórico, mas não deveria tocar o estado que vive fora dele.

- **A — errada:** Desligar compactação só adia o problema até o contexto estourar de vez.
- **B — errada:** "Lembre-se do que já delegou" depende do histórico — que é justamente o que foi compactado.
- **C — correta.**
- **D — errada:** Janela maior adia; não torna o registro confiável.

**Tópicos:** Resume e Fork de Sessão, Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: estado estruturado fora do histórico da conversa sobrevive à compactação, ao contrário do histórico em si
- Arquétipos: A=camada-alvo-errado, B=montante-jusante, D=extremo-vs-meio

---

## Q45 — Resposta correta: **A**

"Task" é o nome legado da mesma ferramenta hoje chamada "Agent": ela spawna um subagente com contexto isolado, system prompt e conjunto de tools próprios — os dois nomes se referem ao mesmo mecanismo, não a funcionalidades diferentes.

- **A — correta.**
- **B — errada:** Quem define sem spawnar é a `AgentDefinition`, não "Task".
- **C — errada:** Não há essa divisão de execução entre os dois nomes.
- **D — errada:** A lista de tarefas é TodoWrite/TaskCreate etc. — outra família de tools, não confundir pelo nome.

**Tópicos:** Spawn de Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: "Task" é o nome legado de "Agent" — mesma ferramenta de spawn de subagente
- Arquétipos: B=camada-alvo-errado, D=feature-inexistente-verossimil

---

## Q46 — Resposta correta: **A**

Um limite de valor que nunca pode ser ultrapassado é regra de negócio e deve ser aplicada em código, antes da tool ser chamada — independe de quão insistente for o pedido do usuário, já que few-shot, negrito e temperatura só influenciam tendência, não garantem nada.

- **A — correta.**
- **B — errada:** Few-shot melhora a tendência, não dá garantia — e o requisito é "nunca".
- **C — errada:** Negrito e repetição são o mesmo enforcement por prompt que já falhou.
- **D — errada:** Temperatura não cria garantia; e no material o remédio para "não pode acontecer" é sempre estrutural.

**Tópicos:** Enforcement de Workflow

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 2 + integração 0 + cenário 1 + distratores 1
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: limite absoluto de negócio ("nunca") precisa ser gate em código, não instrução por prompt
- Arquétipos: B=probabilistico-vs-garantia, C=probabilistico-vs-garantia, D=probabilistico-vs-garantia

---

## Q47 — Resposta correta: **B**

A saída de um subagente deve ser um objeto estruturado que mantém conteúdo e metadado juntos — campos como id, tipo, confiança e detalhes de origem — o que viabiliza rastreabilidade; prosa ou saída crua de tool perdem essa ligação.

- **A — errada:** Saída crua de tool é ruído (tool result bloat) e não é rastreável.
- **B — correta.**
- **C — errada:** Prosa é justamente o que perde atribuição no caminho.
- **D — errada:** Um número por agente não liga **cada afirmação** à sua fonte.

**Tópicos:** Descrições de Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: objetos estruturados com metadado de origem (id, tipo, confiança, fonte) viabilizam rastreabilidade
- Arquétipos: A=camada-alvo-errado, C=camada-alvo-errado, D=vazio-ausente

---

## Q48 — Resposta correta: **B**

Quando o escopo não é conhecido de antemão, subtarefas precisam ser geradas dinamicamente à medida que a investigação avança, parando quando nenhum sinal novo aparece — uma lista fixa decidida cedo demais é o mesmo erro de decomposição estreita com outro nome.

- **A — errada:** Mesmo briefing em cinco agentes = sobreposição; e "a resposta mais longa" não é critério de qualidade.
- **B — correta.**
- **C — errada:** Lista fixa de dez decide antes de saber — é o erro de decomposição estreita com outro nome.
- **D — errada:** Um prompt gigante não substitui investigação iterativa e estoura contexto.

**Tópicos:** Decomposição de Tarefas

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: escopo desconhecido de antemão exige geração dinâmica de subtarefas, com critério de parada por ausência de sinal novo
- Arquétipos: A=extremo-vs-meio, C=enumerar-vs-generalizar, D=over-engineering

---

## Q49 — Resposta correta: **A**

O Plan Mode do Claude Code permite que o agente analise e proponha mudanças sem modificar arquivos nem executar comandos — é literalmente o modo desenhado para analisar antes de tocar em qualquer coisa.

- **A — correta.**
- **B — errada:** `dontAsk` **auto-nega** tools não pré-aprovadas — não é um modo de análise-e-aprovação, é supressão de prompts de permissão.
- **C — errada:** `bypassPermissions` pula todas as confirmações.
- **D — errada:** `acceptEdits` aceita edições de arquivo automaticamente na sessão.

**Tópicos:** Plan Mode

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: Plan Mode analisa sem modificar arquivos nem executar comandos
- Arquétipos: B=camada-alvo-errado, C=extremo-vs-meio, D=camada-alvo-errado

---

## Q50 — Resposta correta: **D**

O histórico de conversa pode ser compactado ou truncado a qualquer momento, então não é um registro confiável de quais etapas já foram concluídas — o requisito de nunca refazer trabalho pede um estado externo durável, não uma leitura do histórico.

- **A — errada:** System prompt é instrução estática, não log de progresso.
- **B — errada:** Retomar restaura o histórico **como ele está**, incluindo o que já foi resumido.
- **C — errada:** Compactação não preserva tool results literais; ela resume.
- **D — correta.**

**Tópicos:** Resume e Fork de Sessão, Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: histórico de conversa não é registro confiável de progresso — pode ser compactado ou truncado
- Arquétipos: A=camada-alvo-errado, B=sinal-nao-confiavel, C=vazio-ausente

---

## Q51 — Resposta correta: **B**

Combinar as saídas de múltiplos agentes numa resposta única e coerente é a etapa de agregação de resultados do ciclo de vida da tarefa — distinta da seleção de agentes, da configuração de escopo de permissão e da decomposição inicial.

- **A — errada:** Seleção de agentes é decidir quem invocar, não o que fazer com o que voltou.
- **B — correta.**
- **C — errada:** Escopo de permissão é configuração, não etapa do ciclo.
- **D — errada:** Decomposição acontece antes, ao quebrar a tarefa.

**Tópicos:** Coordenador e Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 3 = Bloom 1 + integração 0 + cenário 1 + distratores 1
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: agregação de resultados é a etapa que combina saídas de múltiplos agentes numa resposta coerente
- Arquétipos: A=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q52 — Resposta correta: **C**

Como o loop interno de um subagente paralelo não é observável ao vivo, o rastro do que ele fez precisa vir na própria saída estruturada, para o coordenador inspecionar depois — abandonar o paralelismo não resolve, só troca latência por uma visibilidade que ainda não existiria.

- **A — errada:** Cap de iteração não tem relação com observabilidade.
- **B — errada:** Abandonar o paralelismo troca latência por visibilidade — e ainda assim o loop interno continua opaco.
- **C — correta.**
- **D — errada:** Canais diretos entre subagentes destroem o choke point único.

**Tópicos:** Spawn de Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: rastro de execução de subagente paralelo precisa estar na saída estruturada, já que o loop interno não é observável ao vivo
- Arquétipos: A=camada-alvo-errado, B=extremo-vs-meio, D=camada-alvo-errado

---

## Q53 — Resposta correta: **C**

Um `AgentDefinition` existe justamente para delimitar o papel do subagente antes da primeira mensagem — identidade, regras de operação e fronteiras — sem isso nem a seleção pelo coordenador nem o comportamento do agente ficam limitados.

- **A — errada:** Contexto maior não define papel.
- **B — errada:** Agentes não aprendem entre invocações — não há memória compartilhada.
- **C — correta.**
- **D — errada:** Mais tools piora: presença de tool implica permissão, e a seleção fica ainda mais ruidosa.

**Tópicos:** Spawn de Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `AgentDefinition` delimita papel, regras e fronteiras do subagente antes de qualquer invocação
- Arquétipos: A=camada-alvo-errado, B=feature-inexistente-verossimil, D=extremo-vs-meio

---

## Q54 — Resposta correta: **A**

Cobertura completa é validada em dois pontos: uma checagem da lista de subtarefas antes de delegar e uma checagem de lacunas na agregação, antes de o relatório final sair — subagentes isolados não conseguem ver o que falta, e depender do usuário perceber transfere o defeito para fora do sistema.

- **A — correta.**
- **B — errada:** Subagentes têm contexto isolado — são justamente os que não conseguem ver o que falta.
- **C — errada:** Depender de o usuário perceber é transferir o defeito para fora do sistema.
- **D — errada:** `stop_reason` diz por que o loop parou, não se a cobertura foi suficiente.

**Tópicos:** Decomposição de Tarefas

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: cobertura é validada tanto antes de delegar quanto na agregação final, nunca só delegada a subagentes isolados ou ao usuário
- Arquétipos: B=camada-alvo-errado, C=montante-jusante, D=camada-alvo-errado

---

## Q55 — Resposta correta: **C**

Ao retomar uma sessão, o modelo não sabe quanto tempo passou nem o que pode ter mudado desde então — o contexto retomado pode estar silenciosamente desatualizado, e nenhuma configuração de expiração ou releitura automática resolve isso sozinha.

- **A — errada:** Retomar recarrega o **histórico**, não relê arquivos automaticamente.
- **B — errada:** Não há expiração de 24h; e a `cleanupPeriodDays` (padrão 30) apaga sessões inativas — coisa diferente.
- **C — correta.**
- **D — errada:** Confiança auto-reportada não detecta mudança externa. Sinal não confiável.

**Tópicos:** Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: sessão retomada pode estar silenciosamente desatualizada — o modelo desconhece o tempo decorrido
- Arquétipos: A=camada-alvo-errado, B=feature-inexistente-verossimil, D=sinal-nao-confiavel

---

## Q56 — Resposta correta: **C**

A escolha entre o agente principal bloquear esperando um subagente ou paralelizar depende de existir ou não dependência entre eles — não é sempre uma coisa nem sempre outra, e subagentes paralelos continuam isolados entre si.

- **A — errada:** Nem sempre bloqueante — paralelismo é suportado nativamente.
- **B — errada:** Nem sempre em background — bloquear é um dos padrões suportados.
- **C — correta.**
- **D — errada:** Subagentes paralelos são isolados; não trocam resultados parciais entre si.

**Tópicos:** Spawn de Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: bloquear vs. paralelizar a espera por um subagente depende da dependência entre as tarefas, não é fixo
- Arquétipos: A=extremo-vs-meio, B=extremo-vs-meio, D=feature-inexistente-verossimil

---

## Q57 — Resposta correta: **D**

O hook `PostToolUse` roda depois que a ferramenta já executou, sendo o lugar certo para registrar o resultado e atualizar estado que gates posteriores vão consultar — bloquear ou reescrever parâmetros antes da execução é papel do `PreToolUse`.

- **A — errada:** Reescrever parâmetros antes da execução é, de novo, momento de `PreToolUse`.
- **B — errada:** Bloquear é papel do `PreToolUse`: *"Pre: validate, enforce rules."* Depois da execução já é tarde.
- **C — errada:** Hook não escolhe modelo.
- **D — correta.**

**Tópicos:** Hooks

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Difícil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `PostToolUse` registra resultado/estado depois da execução, para gates posteriores consultarem
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=feature-inexistente-verossimil

---

## Q58 — Resposta correta: **B**

É o coordenador como ponto único de passagem que permite aplicar e auditar uma política de fluxo de informação num só lugar — sem ele, cada subagente aplicaria sua própria regra de forma inconsistente e não auditável centralmente.

- **A — errada:** System prompt é instrução ao modelo, não controle de fluxo de informação.
- **B — correta.**
- **C — errada:** Política distribuída por subagente é inconsistente e não auditável centralmente.
- **D — errada:** Tamanho de contexto não é fronteira de confiança.

**Tópicos:** Coordenador e Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: política de fluxo de informação sensível é aplicável e auditável só quando centralizada no coordenador
- Arquétipos: A=camada-alvo-errado, C=extremo-vs-meio, D=camada-alvo-errado

---

## Q59 — Resposta correta: **D**

A escolha de arquitetura precisa ser proporcional a escopo, risco e necessidade de aprovação humana — para uma mudança pequena, de risco baixo e com verificação automática já existente, execução direta basta; plan mode ou fluxo multi-fase seriam cerimônia sem retorno.

- **A — errada:** Fork por arquivo fragmenta uma mudança que é atômica por natureza.
- **B — errada:** Plan mode para renomear um helper privado é cerimônia sem retorno. Over-engineering.
- **C — errada:** Workflow multi-fase com agente revisor é desproporcional ao risco.
- **D — correta.**

**Tópicos:** Plan Mode, Enforcement de Workflow

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Médio
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: arquitetura de revisão deve ser proporcional a escopo, risco e necessidade de aprovação humana — nem tudo pede o mecanismo mais pesado
- Arquétipos: A=extremo-vs-meio, B=over-engineering, C=over-engineering

---

## Q60 — Resposta correta: **A**

O modelo frequentemente devolve texto junto com um bloco `tool_use` no mesmo turno; parar o loop assim que aparece qualquer texto faria o programa desistir antes mesmo de a ferramenta ser executada.

- **A — correta.**
- **B — errada:** Não é loop infinito — é o contrário: encerra cedo demais.
- **C — errada:** O cap nem chega a ser atingido, porque o loop sai no primeiro turno com texto.
- **D — errada:** Premissa falsa: texto aparece junto com tool calls com frequência.

**Tópicos:** Loop Agêntico

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: texto e `tool_use` podem coexistir no mesmo turno — parar no primeiro texto aborta antes da execução real
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---
