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

## Q1 — Resposta correta: **D**

Descrições de tool precisam declarar propósito, formatos de entrada, fronteiras de uso e relação com tools semanticamente parecidas — sem isso, o modelo escolhe errado entre duas tools quase sinônimas.

- **A — errada:** "Tenha cuidado" é instrução vaga; o modelo não ganha critério nenhum.
- **B — errada:** Remover capacidade para contornar ambiguidade descarta funcionalidade legítima.
- **C — errada:** `any` força uma tool qualquer — não ensina qual é a certa. Piora: garante a escolha errada mais rápido.
- **D — correta.**

**Tópicos:** Descrições de Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: descrição de tool deve declarar propósito, fronteira de uso e relação com tools parecidas
- Arquétipos: A=camada-alvo-errado, B=over-engineering, C=camada-alvo-errado

---

## Q2 — Resposta correta: **B**

Violação de regra de negócio (ex.: prazo de devolução expirado) deve devolver um erro estruturado com `retryable: false` e uma explicação apresentável ao cliente — tentar de novo não resolve uma regra de negócio.

- **A — errada:** Retornar sucesso para algo que falhou é mentir para o agente — ele seguirá como se o reembolso tivesse ocorrido.
- **B — correta.**
- **C — errada:** Falha genérica convida ao retry infinito de algo que nunca vai passar.
- **D — errada:** Exceção mata o loop: o agente perde a chance de explicar ao cliente.

**Tópicos:** Erros Estruturados

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 2 + integração 0 + cenário 1 + distratores 1
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: violação de regra de negócio é erro não-retentável com explicação pronta para o cliente
- Arquétipos: D=camada-alvo-errado

---

## Q3 — Resposta correta: **D**

O bloco `tool_result` sinaliza falha através do campo opcional `is_error: true`, junto com `tool_use_id` e `content` — não existe campo `status`, e `stop_reason` descreve outra coisa.

- **A — errada:** Não existe campo `status` no `tool_result`.
- **B — errada:** ⚠️ `retryable` **não é** campo da Messages API — é convenção do seu próprio payload de erro.
- **C — errada:** `stop_reason` descreve por que o modelo parou (`tool_use` / `end_turn`), não o resultado da sua função.
- **D — correta.**

**Tópicos:** Erros Estruturados

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `is_error: true` no `tool_result` sinaliza falha da execução da tool
- Arquétipos: A=feature-inexistente-verossimil, B=feature-inexistente-verossimil, C=camada-alvo-errado

---

## Q4 — Resposta correta: **C**

Resultado vazio por "não encontrei nada" e vazio por "não consegui acessar a fonte" são situações diferentes que pedem respostas diferentes — por isso a tool deve devolver um status explícito (`valid_empty` vs `access_failure`) em vez de um vazio ambíguo.

- **A — errada:** Reportar "sem resultados" quando o índice caiu esconde um incidente como se fosse resposta.
- **B — errada:** O comportamento **não** é idêntico: um caso segue adiante, o outro exige retry ou escalação.
- **C — correta.**
- **D — errada:** Inferir por duração da chamada é sinal não confiável — arquétipo clássico de distrator.

**Tópicos:** Erros Estruturados

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: distinguir vazio-válido de falha-de-acesso via campo de status explícito
- Arquétipos: A=vazio-ausente, B=vazio-ausente, D=sinal-nao-confiavel

---

## Q5 — Resposta correta: **A**

`tool_choice: {type: "tool", ...}` obriga o modelo a chamar aquela tool específica e nunca retornar `end_turn` — é a garantia estrutural que um pipeline determinístico exige.

- **A — correta.**
- **B — errada:** `none` proíbe tools — o oposto.
- **C — errada:** `auto` permite retornar texto: *"May use or not use a tool."* Instrução não fecha essa porta.
- **D — errada:** `max_tokens` trata truncamento, não a decisão de chamar tool.

**Tópicos:** Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `tool_choice: tool` força a chamada e nunca permite `end_turn` sem ela
- Arquétipos: B=extremo-vs-meio, C=probabilistico-vs-garantia, D=camada-alvo-errado

---

## Q6 — Resposta correta: **D**

Com muitas tools disponíveis, o modelo escolhe uma plausível mas errada, trava pedindo esclarecimento, ignora tools especializadas ou inventa uma combinação — a correção é preferir um conjunto pequeno e genérico de tools em vez de muitas nichadas.

- **A — errada:** Não é tamanho de modelo; é superfície de decisão.
- **B — errada:** Descrições mais longas com 40 tools aumentam o ruído.
- **C — errada:** `any` força uma escolha ruim em vez de evitá-la.
- **D — correta.**

**Tópicos:** Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: conjunto pequeno e genérico de tools reduz erro de seleção; muitas tools nichadas aumentam a superfície de decisão
- Arquétipos: A=camada-alvo-errado, B=extremo-vs-meio, C=over-engineering

---

## Q7 — Resposta correta: **A**

Quando uma tool existe no contexto do agente, o modelo a trata como disponível e apropriada mesmo que o papel do agente não peça isso — presença implica permissão; a correção é remover a tool do agente que não deveria usá-la.

- **A — correta.**
- **B — errada:** Síntese é combinar o que os outros acharam; pesquisar é o papel do outro agente.
- **C — errada:** Prompt mais longo não desfaz a presença da ferramenta.
- **D — errada:** Findings errados não explicam por que ele **pesquisa**.

**Tópicos:** Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: presença de uma tool implica permissão para o modelo usá-la — remover a tool é o único jeito de impedir
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=montante-jusante

---

## Q8 — Resposta correta: **B**

Ao configurar múltiplos servidores MCP, todas as tools de todos eles são descobertas na conexão e apresentadas ao agente como uma lista plana única, sem indicação de qual servidor forneceu cada uma.

- **A — errada:** Não é um servidor por vez.
- **B — correta.**
- **C — errada:** Não é carregamento preguiçoso: é tudo na conexão.
- **D — errada:** Não há agrupamento por servidor nem seleção em duas etapas.

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: MCP descobre e expõe as tools de todos os servidores conectados como uma lista plana única, no momento da conexão
- Arquétipos: A=camada-alvo-errado, C=camada-alvo-errado, D=feature-inexistente-verossimil

---

## Q9 — Resposta correta: **D**

Expor conteúdo do servidor como resource (dado endereçável e só leitura) reduz o número de chamadas de tateio exploratório que o agente precisaria fazer para descobrir a mesma informação via tool.

- **A — errada:** Outro servidor multiplica a lista plana de tools — piora.
- **B — errada:** Mais iterações é pagar mais caro pelo mesmo desenho ruim.
- **C — errada:** Mais parâmetros numa tool de busca não elimina o tateio.
- **D — correta.**

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: resources reduzem chamadas exploratórias de tool para dados que só precisam ser lidos
- Arquétipos: A=extremo-vs-meio, B=over-engineering, C=camada-alvo-errado

---

## Q10 — Resposta correta: **B**

Segredos de servidores MCP devem vir de expansão de variável de ambiente (`${VAR}`) na configuração, nunca hardcoded em `CLAUDE.md` (que o modelo lê) nem versionados diretamente.

- **A — errada:** `CLAUDE.md` é contexto lido pelo modelo — pior lugar possível para um segredo.
- **B — correta.**
- **C — errada:** Não existe substituição a partir do histórico do shell.
- **D — errada:** Servidores MCP usam segredos normalmente, via ambiente.

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: expansão de variável de ambiente evita versionar segredo na configuração de servidor MCP
- Arquétipos: A=camada-alvo-errado, C=feature-inexistente-verossimil, D=camada-alvo-errado

---

## Q11 — Resposta correta: **A**

`.mcp.json` na raiz do projeto é a configuração de escopo de projeto, versionada e compartilhada automaticamente com quem clona o repositório.

- **A — correta.**
- **B — errada:** Managed settings é imposição organizacional, não distribuição por clone de repositório.
- **C — errada:** `settings.local.json` não vai para o git.
- **D — errada:** `~/.claude.json` é escopo de usuário — vale só para aquela pessoa.

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 3 = Bloom 1 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: `.mcp.json` no repositório é escopo de projeto, compartilhado por clone
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q12 — Resposta correta: **D**

Quando o mesmo servidor MCP é definido em mais de um escopo, vale a versão de maior precedência: Local, depois Project, depois User.

- **A — errada:** Não há conexão simultânea com namespacing por escopo.
- **B — errada:** Project perde para Local.
- **C — errada:** User é o de **menor** precedência entre os três.
- **D — correta.**

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: precedência de escopo MCP é Local > Project > User
- Arquétipos: A=feature-inexistente-verossimil, B=camada-alvo-errado, C=camada-alvo-errado

---

## Q13 — Resposta correta: **D**

Atribuir a cada subagente só as tools exigidas pelo seu papel reduz a complexidade de decisão e estruturalmente impede invocação de tool fora do papel — diferente de auditar depois ou de confiar em instrução de prompt.

- **A — errada:** Auditar depois descobre o desvio quando ele já aconteceu.
- **B — errada:** Toolset completo + descrição de papel é enforcement por prompt: presença implica permissão.
- **C — errada:** `any` força chamada de tool; não impede a tool errada.
- **D — correta.**

**Tópicos:** Tool Choice, Descrições de Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `allowedTools` restrito ao papel reduz erro de seleção e impede uso fora do papel ao mesmo tempo
- Arquétipos: A=montante-jusante, B=probabilistico-vs-garantia, C=camada-alvo-errado

---

## Q14 — Resposta correta: **C**

Para carregar um arquivo de caminho já conhecido, a tool certa é Read — Grep busca padrão dentro de arquivos, Glob acha arquivos por nome, e `cat` via Bash exige permissão de shell desproporcional.

- **A — errada:** Grep busca padrão dentro de arquivos.
- **B — errada:** `cat` via Bash faz o mesmo, mas exige permissão de shell — ferramenta desproporcional para ler um arquivo.
- **C — correta.**
- **D — errada:** Glob acha arquivos por padrão de nome.

**Tópicos:** Built-in Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: Read carrega arquivo de caminho conhecido no contexto; não é papel de Grep/Glob/Bash
- Arquétipos: A=camada-alvo-errado, B=over-engineering, D=camada-alvo-errado

---

## Q15 — Resposta correta: **C**

Workflows de múltiplas tools se sequenciam deixando explícito no schema que um dado pré-requisito não é obtenível pela própria tool — assim o modelo é levado a chamar antes a tool que fornece esse pré-requisito.

- **A — errada:** `any` garante que **alguma** tool seja chamada — não qual, nem em que ordem.
- **B — errada:** A ordem no array de tools não define ordem de chamada.
- **C — correta.**
- **D — errada:** Não há ordem alfabética; é invenção.

**Tópicos:** Tool Choice, Descrições de Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: dependência entre tools fica explícita no schema (dado que a tool não consegue obter sozinha), não em ordem de array nem em `tool_choice=any`
- Arquétipos: A=camada-alvo-errado, B=feature-inexistente-verossimil, D=feature-inexistente-verossimil

---

## Q16 — Resposta correta: **C**

A descrição da tool deve declarar formato de entrada e restrições — é lendo o schema junto com a descrição que o modelo gera um JSON de chamada bem formado.

- **A — errada:** Latência média não ajuda a formatar o argumento.
- **B — errada:** Custo pode orientar frequência de uso, não a forma da entrada.
- **C — correta.**
- **D — errada:** Linguagem de implementação é irrelevante para quem chama.

**Tópicos:** Descrições de Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 2 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: descrição de tool deve declarar formato de entrada esperado e restrições
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=camada-alvo-errado

---

## Q17 — Resposta correta: **C**

`tool_choice: any` obriga o modelo a chamar alguma tool, mas deixa a escolha de qual a cargo dele — é o modo certo quando sempre existe uma ação a tomar, mas ela varia.

- **A — errada:** `tool` fixa **uma** tool específica — não serve quando a ação varia.
- **B — errada:** `auto` permite responder só com texto.
- **C — correta.**
- **D — errada:** `none` proíbe tools.

**Tópicos:** Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `any` força alguma chamada de tool, mas o modelo escolhe qual
- Arquétipos: A=extremo-vs-meio, B=probabilistico-vs-garantia, D=extremo-vs-meio

---

## Q18 — Resposta correta: **A**

`tool_choice: none` impede qualquer chamada de tool, forçando o modelo a responder só com raciocínio em texto.

- **A — correta.**
- **B — errada:** `any` obriga a chamar.
- **C — errada:** `tool` força uma específica.
- **D — errada:** `auto` deixa o modelo decidir — pode chamar tool.

**Tópicos:** Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `none` proíbe qualquer chamada de tool
- Arquétipos: B=extremo-vs-meio, C=extremo-vs-meio, D=probabilistico-vs-garantia

---

## Q19 — Resposta correta: **D**

Um erro transitório deve ser sinalizado como erro (para o agente saber que a tool falhou) e identificado como transitório, para que retry seja a ação recomendada — falha da tool não é o mesmo que falha do loop.

- **A — errada:** Mandar o usuário tentar depois desiste de um erro que era retentável.
- **B — errada:** Resultado vazio "de sucesso" faz o agente seguir com dado que não existe.
- **C — errada:** Exceção encerra o loop — o agente perde a chance de tentar de novo.
- **D — correta.**

**Tópicos:** Erros Estruturados

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: mapear tipo de erro (transitório/permanente) para ação (retry/fix/escalate), sempre sinalizando a falha
- Arquétipos: A=camada-alvo-errado, B=vazio-ausente, C=camada-alvo-errado

---

## Q20 — Resposta correta: **B**

Tools são ações controladas pelo modelo (fazer algo); resources são dados controlados pela aplicação, só leitura (ler algo) — a distinção não é sobre sincronismo, depreciação ou localização.

- **A — errada:** Não é uma distinção de sincronismo.
- **B — correta.**
- **C — errada:** Não há depreciação: são conceitos complementares.
- **D — errada:** Não é uma distinção de origem remota vs local.

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: tools = ação controlada pelo modelo; resources = dado só-leitura controlado pela aplicação
- Arquétipos: A=camada-alvo-errado, C=feature-inexistente-verossimil, D=camada-alvo-errado

---

## Q21 — Resposta correta: **A**

Usar tool use com um JSON Schema e `tool_choice` forçado é o método mais confiável de conformidade estrutural: o modelo gera o JSON para caber no schema e a chamada é garantida — pedir JSON em texto ou aplicar regex depois são remendos menos confiáveis.

- **A — correta.**
- **B — errada:** Pedir JSON no prompt é o método menos confiável dos três citados no objetivo #25.
- **C — errada:** `max_tokens` só evita truncamento; não garante conformidade nem ausência de prosa.
- **D — errada:** Regex sobre prosa é remendo: quebra quando o modelo muda o embrulho.

**Tópicos:** Tool Choice, Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Médio
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: tool use + schema + `tool_choice` forçado é mais confiável que pedir JSON em prosa ou extrair com regex depois
- Arquétipos: B=probabilistico-vs-garantia, C=camada-alvo-errado, D=montante-jusante

---

## Q22 — Resposta correta: **A**

Um enum sem uma opção ambígua tipo "other" obriga o modelo a forçar qualquer entrada fora das categorias na correspondência mais próxima — o próprio schema induz a alucinação; a correção é incluir a opção de escape.

- **A — correta.**
- **B — errada:** Omitir o campo perde a informação de que houve um caso fora das categorias.
- **C — errada:** Texto livre perde toda a padronização que o enum dava.
- **D — errada:** Instrução no prompt não conserta um schema que não tem a opção correta.

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: enum precisa de uma opção de escape ("other") para não forçar correspondência falsa
- Arquétipos: B=vazio-ausente, C=extremo-vs-meio, D=camada-alvo-errado

---

## Q23 — Resposta correta: **D**

Quando duas tools são semanticamente próximas, a descrição de cada uma precisa declarar a relação com a outra e quando usar qual — nomes mais claros, README externo ou fundir as duas não substituem essa declaração explícita.

- **A — errada:** Nomes opacos pioram: o modelo perde o pouco de sinal que o nome dava.
- **B — errada:** README não entra no contexto do modelo.
- **C — errada:** Fundir esconde a distinção num parâmetro — o modelo continua tendo de escolher, agora sem descrição própria.
- **D — correta.**

**Tópicos:** Descrições de Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: tools semanticamente próximas exigem que a descrição declare a relação e o critério de escolha entre elas
- Arquétipos: A=camada-alvo-errado, B=montante-jusante, C=over-engineering

---

## Q24 — Resposta correta: **D**

Manter tools "só por precaução" no conjunto do agente é exatamente o raciocínio que aumenta a superfície de decisão sem ganho — presença implica permissão, então cada tool extra é mais uma chance de escolha errada.

- **A — errada:** Tools não consomem tokens de saída do agente dessa forma — o custo é de decisão e de definição no contexto.
- **B — errada:** Não é questão de timeout.
- **C — errada:** Tools não usadas **não** são ignoradas: o modelo as considera.
- **D — correta.**

**Tópicos:** Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: manter tools por precaução aumenta a superfície de decisão e o risco de seleção errada, sem ganho real
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=vazio-ausente

---

## Q25 — Resposta correta: **C**

Rodar a suíte de testes do projeto é execução de comando, papel da tool Bash — Grep busca conteúdo, Glob resolve nomes de arquivo, e ler o código do executor não o executa.

- **A — errada:** Grep busca conteúdo; não executa.
- **B — errada:** Ler o código do runner não o executa.
- **C — correta.**
- **D — errada:** Glob resolve nomes de arquivo.

**Tópicos:** Built-in Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 3 = Bloom 1 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: Bash executa comandos; não confundir com busca (Grep) ou listagem (Glob)
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=camada-alvo-errado

---

## Q26 — Resposta correta: **A**

O campo de retentabilidade não existe na Messages API — ele vive no payload de erro que você mesmo desenha dentro do `tool_result`, junto com categoria e explicação legível, para que o agente mapeie tipo de erro para ação.

- **A — correta.**
- **B — errada:** São coisas diferentes e complementares: `is_error` diz *falhou*; o flag de retentabilidade diz *o que fazer a respeito*.
- **C — errada:** Não é campo obrigatório da Messages API — não é campo da Messages API de forma alguma.
- **D — errada:** Nenhum campo do seu payload instrui a API a repetir a chamada. Quem decide repetir é o agente (ou o seu código).

**Tópicos:** Erros Estruturados

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `retryable` é convenção do seu próprio payload de erro, não campo da Messages API — `is_error` é o único campo de erro que a API define
- Arquétipos: B=camada-alvo-errado, C=feature-inexistente-verossimil, D=feature-inexistente-verossimil

---

## Q27 — Resposta correta: **D**

Para achar arquivos por padrão de nome e depois buscar um termo dentro deles, a combinação certa é Glob seguido de Grep — cada tool no seu papel, sem precisar de Bash.

- **A — errada:** Read não opera sobre a raiz do repositório como listagem.
- **B — errada:** Premissa falsa: as built-in tools encadeiam normalmente — e usar Bash aqui exige permissão de shell sem necessidade.
- **C — errada:** Inverte as funções das duas.
- **D — correta.**

**Tópicos:** Built-in Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: Glob localiza arquivos por nome; Grep busca conteúdo dentro deles — não o contrário
- Arquétipos: A=camada-alvo-errado, B=over-engineering, C=camada-alvo-errado

---

## Q28 — Resposta correta: **A**

Quando o agente só precisa de poucos campos de um resultado grande, o filtro deve acontecer na própria tool, antes de o dado entrar no contexto — pedir para o modelo ignorar o resto, ou aumentar a janela, não evitam o custo já pago.

- **A — correta.**
- **B — errada:** Pedir para ignorar não desfaz os tokens já gastos nem o ruído.
- **C — errada:** Janela maior é adiar o problema pagando mais caro.
- **D — errada:** Chamar menos vezes pode quebrar a tarefa; o problema é o tamanho de cada resposta.

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: filtrar a saída da tool para só o necessário, antes de entrar no contexto — não depois
- Arquétipos: B=montante-jusante, C=extremo-vs-meio, D=camada-alvo-errado

---

## Q29 — Resposta correta: **C**

Uma falha intermitente e difícil de reproduzir, em que o agente às vezes responde em texto em vez de chamar a tool, é sintoma de `tool_choice: auto`; forçar a tool específica elimina esse caminho por completo.

- **A — errada:** `none` proíbe tools; a estrutura ficaria por conta do texto — o caso menos confiável.
- **B — errada:** `tool_choice` controla **se/qual** tool é chamada, não visibilidade.
- **C — correta.**
- **D — errada:** `auto` **não** garante chamada de tool.

**Tópicos:** Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: `tool_choice` forçado elimina o caminho intermitente de resposta em texto que `auto` permite
- Arquétipos: A=extremo-vs-meio, B=camada-alvo-errado, D=probabilistico-vs-garantia

---

## Q30 — Resposta correta: **B**

Expor 30 tools de uma vez, vindas de vários servidores MCP, é explosão de tools sem estrutura — a mitigação é limitar servidores conectados ou filtrar quais tools são expostas antes de chegar ao agente.

- **A — errada:** Mais iterações não melhora a seleção.
- **B — correta.**
- **C — errada:** `any` força a chamada de uma das 30.
- **D — errada:** Descrições longas para 30 tools desnecessárias aumentam o ruído.

**Tópicos:** MCP Servers, Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: limitar/filtrar tools expostas evita a explosão de tools de múltiplos servidores MCP
- Arquétipos: A=camada-alvo-errado, C=probabilistico-vs-garantia, D=over-engineering

---

## Q31 — Resposta correta: **D**

`required` no schema orienta o modelo a preencher aquele campo, mas não é validação completa — a API não rejeita automaticamente uma chamada mal formada, por isso ainda é preciso uma camada de validação própria.

- **A — errada:** `required` influencia a geração; não é decorativo.
- **B — errada:** Vale para qualquer tipo de propriedade.
- **C — errada:** Não há rejeição automática da API garantindo conformidade — por isso a camada de validação existe.
- **D — correta.**

**Tópicos:** Tool Use Schema, Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: schema com `required` guia a geração, mas não substitui uma camada explícita de validação
- Arquétipos: A=camada-alvo-errado, B=extremo-vs-meio, C=probabilistico-vs-garantia

---

## Q32 — Resposta correta: **B**

Bibliotecas como Pydantic (e Instructor, que usa Pydantic com mais validação) servem para validar dados estruturados tanto na entrada quanto na saída — o próprio material já avisa que o schema sozinho não é validação completa.

- **A — errada:** O próprio material diz que o schema não é validação completa.
- **B — correta.**
- **C — errada:** Validar só a saída deixa entrar chamada malformada.
- **D — errada:** Validar depois de gravar é tarde: dado ruim já está no banco.

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: Pydantic/Instructor validam entrada e saída estruturada; schema sozinho não basta
- Arquétipos: A=probabilistico-vs-garantia, C=vazio-ausente, D=montante-jusante

---

## Q33 — Resposta correta: **C**

Uma regra genérica sensível a palavras-chave no system prompt pode sobrepor uma descrição de tool bem escrita, fazendo o modelo hesitar de forma imprevisível — revisar o system prompt em busca desse conflito é necessário mesmo com a descrição impecável.

- **A — errada:** Não há precedência garantida da descrição sobre o system prompt.
- **B — errada:** Trocar de modelo não elimina instruções conflitantes.
- **C — correta.**
- **D — errada:** Mover a descrição para o system prompt não resolve a contradição — só a concentra num lugar.

**Tópicos:** Descrições de Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: revisar o system prompt por regras que conflitam e sobrepõem descrições de tool bem escritas
- Arquétipos: A=probabilistico-vs-garantia, B=camada-alvo-errado, D=camada-alvo-errado

---

## Q34 — Resposta correta: **B**

`tool_choice: auto` é o padrão em que o modelo decide se usa uma tool ou não — é o modo certo para um agente de propósito geral que só deve chamar tool quando precisar.

- **A — errada:** `none` impede o uso quando ele for necessário.
- **B — correta.**
- **C — errada:** `any` obriga a chamar mesmo quando o conhecimento próprio bastaria.
- **D — errada:** `tool` força uma específica sempre.

**Tópicos:** Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 3 = Bloom 1 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: `auto` é o padrão: o modelo decide se e qual tool usar
- Arquétipos: A=extremo-vs-meio, C=extremo-vs-meio, D=extremo-vs-meio

---

## Q35 — Resposta correta: **B**

Uma regra de permissão para exatamente uma tool de um servidor MCP usa a forma `mcp__<server>__<tool>` — sem o nome da tool ela cobre o servidor inteiro, e sem o prefixo `mcp__` não é sintaxe válida.

- **A — errada:** `mcp__linear` cobriria **todas** as tools do servidor — amplo demais.
- **B — correta.**
- **C — errada:** Falta o prefixo `mcp__`.
- **D — errada:** Falta o nome do servidor: a forma exige `mcp__<server>__<tool>`.

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: sintaxe de permissão MCP para uma tool específica é `mcp__<server>__<tool>`
- Arquétipos: A=extremo-vs-meio, C=feature-inexistente-verossimil, D=feature-inexistente-verossimil

---

## Q36 — Resposta correta: **D**

Quando o modelo escala com frequência excessiva casos que na verdade poderia resolver, o problema é a descrição da tool de resolução não delimitar quando escalar e quando não — forçar sempre uma ação ou remover a opção de escalar trocam um erro por outro.

- **A — errada:** Forçar `process_refund` obrigaria reembolso em casos que exigem escalação — troca um erro por outro pior.
- **B — errada:** Remover a escalação quebra o requisito de saber quando escalar.
- **C — errada:** Renomear é sinal fraco comparado a um critério explícito.
- **D — correta.**

**Tópicos:** Descrições de Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: descrição de tool precisa delimitar tanto quando usar quanto quando NÃO usar (fronteira de uso)
- Arquétipos: A=extremo-vs-meio, B=extremo-vs-meio, C=camada-alvo-errado

---

## Q37 — Resposta correta: **B**

Para simular lógica condicional sem código, a descrição declara que uma propriedade opcional passa a ser exigida dependendo do valor de outra (ex.: detalhe obrigatório quando a categoria é "outro") — dividir em duas tools ou validar depois são soluções mais pesadas para o mesmo problema.

- **A — errada:** Dividir em duas tools aumenta a superfície de decisão para uma regra de um campo.
- **B — correta.**
- **C — errada:** Obrigatório sempre com string vazia gera dado lixo nos outros casos.
- **D — errada:** Validar e re-perguntar gasta um turno para algo que a descrição resolve na primeira.

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: descrição pode tornar um campo opcional efetivamente obrigatório sob certa condição, simulando lógica condicional
- Arquétipos: A=over-engineering, C=vazio-ausente, D=camada-alvo-errado

---

## Q38 — Resposta correta: **C**

Um servidor MCP pode subir sem erro e ainda assim não ter suas tools de fato descobertas e expostas ao agente — esse é o primeiro fato a verificar antes de mexer em descrição de tool ou trocar de modelo.

- **A — errada:** Iterações não fazem aparecer tool não descoberta.
- **B — errada:** Modelo maior também não vê o que não está no toolset.
- **C — correta.**
- **D — errada:** Reescrever descrição de tool que o agente não enxerga não muda nada.

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: verificar a descoberta de tools do servidor MCP antes de qualquer outra hipótese
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=montante-jusante

---

## Q39 — Resposta correta: **D**

Sem um campo de status explícito, "não encontrei nada" e "não consegui alcançar a fonte" ficam indistinguíveis no resultado da tool — e as duas situações exigem respostas opostas do agente.

- **A — errada:** Nada a ver com `required` do JSON Schema.
- **B — errada:** Não é sobre tamanho de payload.
- **C — errada:** Não existe retry automático da API disparado pelo seu payload.
- **D — correta.**

**Tópicos:** Erros Estruturados

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: campo de status explícito distingue vazio-válido de falha-de-acesso; ausência dele os torna indistinguíveis
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=feature-inexistente-verossimil

---

## Q40 — Resposta correta: **B**

Mais tools não é mais capacidade — o desenho recomendado é o conjunto mínimo que cobre o papel do agente, não uma tool por endpoint nem todo o catálogo exposto de uma vez.

- **A — errada:** Sentimento do cliente é sinal não confiável — e toolset dinâmico por humor é over-engineering.
- **B — correta.**
- **C — errada:** Uma tool por endpoint é o caminho mais rápido para dezenas de tools quase idênticas.
- **D — errada:** Expor tudo é exatamente a explosão de tools.

**Tópicos:** Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: conjunto mínimo de tools que cobre o papel, não o máximo disponível
- Arquétipos: A=sinal-nao-confiavel, C=enumerar-vs-generalizar, D=over-engineering

---

## Q41 — Resposta correta: **D**

Uma categoria de erro como "authentication" no payload estruturado diz ao agente que retry não resolve e que a ação certa é obter credencial ou escalar — mais stack trace cru ou prosa livre só aumentam o ruído que o agente tem que interpretar.

- **A — errada:** Mais frames de stack trace é mais ruído para o modelo interpretar.
- **B — errada:** Suprimir o erro produz o pior caso: falha silenciosa que vira resultado vazio válido.
- **C — errada:** Prosa livre obriga o agente a fazer parsing de linguagem natural — anti-pattern do material.
- **D — correta.**

**Tópicos:** Erros Estruturados

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: categoria de erro estruturado orienta a ação certa (retry/fix/escalate), sem exigir parsing de texto livre
- Arquétipos: A=camada-alvo-errado, B=vazio-ausente, C=camada-alvo-errado

---

## Q42 — Resposta correta: **C**

Uma operação de escrita é ação e deve ser modelada como tool; uma lista só consultada para leitura é dado e deve ser modelada como resource — não o contrário.

- **A — errada:** Inverte exatamente a distinção.
- **B — errada:** Modelar tudo como tool devolve o problema das chamadas exploratórias.
- **C — correta.**
- **D — errada:** Resource é somente leitura: não serve para a escrita.

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: escrita é tool (ação); leitura pura é resource (dado)
- Arquétipos: A=camada-alvo-errado, B=over-engineering, D=camada-alvo-errado

---

## Q43 — Resposta correta: **A**

Uma boa descrição de tool cobre propósito, formato de entrada, fronteira de uso e relação com uma tool adjacente semanticamente parecida — autenticação, custo e detalhe de implementação não fazem parte do que a descrição precisa declarar.

- **A — correta.**
- **B — errada:** Não menciona autenticação nem servidor de origem.
- **C — errada:** Não menciona limites nem custo.
- **D — errada:** Não há detalhe de implementação nem tratamento de erro na descrição citada.

**Tópicos:** Descrições de Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: descrição de tool completa cobre propósito, formato de entrada, fronteira de uso e relação com tool adjacente
- Arquétipos: B=vazio-ausente, C=vazio-ausente, D=camada-alvo-errado

---

## Q44 — Resposta correta: **C**

`ListMcpResourcesTool` lista os resources expostos pelos servidores MCP conectados — WebFetch busca conteúdo web, Glob opera no sistema de arquivos local, e ler o código-fonte do servidor não reflete o que ele expõe em runtime.

- **A — errada:** WebFetch busca conteúdo web, não o catálogo MCP.
- **B — errada:** Glob opera no sistema de arquivos local.
- **C — correta.**
- **D — errada:** Ler o código-fonte do servidor não é o mesmo que consultar o que ele expõe em runtime.

**Tópicos:** MCP Servers, Built-in Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 1 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `ListMcpResourcesTool` lista os resources expostos por servidores MCP conectados
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=montante-jusante

---

## Q45 — Resposta correta: **C**

Para garantir que nenhum documento passe sem ser registrado, forçar a tool específica impede o modelo de retornar `end_turn` sem chamá-la — sinalizar depois ou pedir de novo ainda deixam passar casos, e "sem exceções" é um requisito de garantia.

- **A — errada:** Sinalizar depois não impede o registro perdido.
- **B — errada:** Re-prompt é remediação depois da falha; ainda gasta turno e pode falhar de novo.
- **C — correta.**
- **D — errada:** `auto` + instrução não fecha o caminho do texto puro — e "sem exceções" é requisito de garantia.

**Tópicos:** Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: `tool_choice` forçado garante a chamada em todo caso, quando o requisito é "sem exceção nenhuma"
- Arquétipos: A=montante-jusante, B=camada-alvo-errado, D=probabilistico-vs-garantia

---

## Q46 — Resposta correta: **A**

Duas tools diferentes que fazem o mesmo trabalho criam seleção ambígua entre execuções — o mesmo mecanismo de "muitas tools" agravado por sobreposição semântica direta; a correção é remover a redundância.

- **A — correta.**
- **B — errada:** Não há regra de precedência MCP sobre built-in.
- **C — errada:** Nem o contrário.
- **D — errada:** Não é inócuo: gera comportamento inconsistente entre execuções, que é o sintoma descrito.

**Tópicos:** Descrições de Tools, Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: duas tools redundantes para o mesmo trabalho geram seleção inconsistente entre execuções
- Arquétipos: B=feature-inexistente-verossimil, C=feature-inexistente-verossimil, D=sinal-nao-confiavel

---

## Q47 — Resposta correta: **C**

Uma regra de permissão com só `mcp__<server>` (sem o nome da tool) cobre todas as tools daquele servidor com uma única regra — diferente de `mcp__<server>__<tool>`, que cobre só uma.

- **A — errada:** Falta o prefixo `mcp__`.
- **B — errada:** Sintaxe inexistente.
- **C — correta.**
- **D — errada:** Regra de Bash não alcança tools MCP.

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `mcp__<server>` (sem tool) casa com qualquer tool daquele servidor
- Arquétipos: A=feature-inexistente-verossimil, B=feature-inexistente-verossimil, D=camada-alvo-errado

---

## Q48 — Resposta correta: **C**

Descrições em campos do schema orientam a escolha de valor tanto em campos obrigatórios quanto opcionais — o nome do campo sozinho raramente carrega informação suficiente.

- **A — errada:** `type` continua necessário: define a forma do dado.
- **B — errada:** Descrições valem para campos obrigatórios e opcionais.
- **C — correta.**
- **D — errada:** Falso: o modelo lê as descrições ao gerar a entrada.

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: descrições de campo (obrigatório ou opcional) orientam a decisão do modelo sobre o valor a preencher
- Arquétipos: A=camada-alvo-errado, B=vazio-ausente, D=sinal-nao-confiavel

---

## Q49 — Resposta correta: **D**

Para ler um resource MCP específico cuja URI já é conhecida, a tool certa é `ReadMcpResourceTool` — WebFetch é para URLs da web, Read opera sobre arquivos locais, e `curl` via Bash contorna o protocolo.

- **A — errada:** WebFetch é para URLs da web.
- **B — errada:** Read opera sobre arquivos, não sobre URIs de resource MCP.
- **C — errada:** `curl` via Bash contorna o protocolo e exige permissão de shell.
- **D — correta.**

**Tópicos:** MCP Servers, Built-in Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 1 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `ReadMcpResourceTool` lê um resource MCP específico por URI conhecida
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=over-engineering

---

## Q50 — Resposta correta: **A**

Nem todo erro deve ser tentado de novo — uma entrada inválida continua inválida na quinta tentativa; o payload de erro deve marcar `retryable: false` para que o agente comunique o problema em vez de repetir a mesma chamada.

- **A — correta.**
- **B — errada:** Mais tentativas do mesmo erro é desperdício garantido.
- **C — errada:** Timeout trata indisponibilidade; o serviço respondeu — rejeitou.
- **D — errada:** Outro provedor rejeitaria a mesma entrada inválida.

**Tópicos:** Erros Estruturados

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `retryable: false` para erros que uma nova tentativa idêntica não resolve (ex.: entrada inválida)
- Arquétipos: B=over-engineering, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q51 — Resposta correta: **B**

`tool_choice` é um parâmetro da chamada de API (Messages), não uma configuração de Claude Code nem de servidor MCP — ele controla se e qual tool é usada naquela chamada específica.

- **A — errada:** Inverte o que o material afirma.
- **B — correta.**
- **C — errada:** Não é chave de `settings.json`.
- **D — errada:** Não é campo de configuração de servidor MCP.

**Tópicos:** Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Difícil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `tool_choice` é parâmetro da API de mensagens, não configuração de Claude Code ou MCP
- Arquétipos: A=camada-alvo-errado, C=feature-inexistente-verossimil, D=camada-alvo-errado

---

## Q52 — Resposta correta: **C**

Declarar a regra de formato na descrição do campo (ex.: telefone em E.164, data em ISO 8601) faz o modelo normalizar o valor ao gerar a chamada — normalizar só depois na implementação não resolve entradas como "aqui" ou "o escritório", sem forma canônica nenhuma.

- **A — errada:** Segunda tool para ambiguidade é over-engineering de um problema de schema.
- **B — errada:** Normalizar só na implementação não impede "here" e "the office", que não têm como ser normalizados.
- **C — correta.**
- **D — errada:** Tornar opcional perde o dado.

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: declarar formato esperado na descrição do schema (ex.: E.164, ISO 8601) leva o modelo a gerar valores já normalizados
- Arquétipos: A=over-engineering, B=montante-jusante, D=vazio-ausente

---

## Q53 — Resposta correta: **A**

Dar a tool de busca a um agente escritor faz esse agente tratá-la como apropriada mesmo fora do seu papel, borrando a fronteira entre escrever e pesquisar e duplicando trabalho — presença implica permissão, então a correção é não dar a tool.

- **A — correta.**
- **B — errada:** O material diz o oposto: a tool presente é tratada como apropriada, mesmo fora do papel.
- **C — errada:** Não há essa condicionalidade implícita.
- **D — errada:** O coordenador não bloqueia chamadas internas de um subagente — o bloqueio é a **ausência** da tool.

**Tópicos:** Tool Choice, Descrições de Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: presença de uma tool fora do papel do agente borra a fronteira de responsabilidade — mesmo sem uso indevido planejado
- Arquétipos: B=camada-alvo-errado, C=feature-inexistente-verossimil, D=camada-alvo-errado

---

## Q54 — Resposta correta: **B**

A expansão `${VAR}`/`${VAR:-default}` funciona também dentro de `headers` na configuração de servidor MCP, permitindo um token por ambiente sem hardcode nem exposição do segredo ao modelo.

- **A — errada:** Hardcode + gitignore perde o compartilhamento da configuração e ainda deixa o segredo em disco em claro.
- **B — correta.**
- **C — errada:** `CLAUDE.md` é contexto lido pelo modelo — nunca coloque segredo ali.
- **D — errada:** Token por chamada expõe o segredo ao modelo.

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 2 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: expansão de variável de ambiente funciona em `headers`, não só em `command`/`args`/`env`/`url`
- Arquétipos: A=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q55 — Resposta correta: **A**

Quando o comportamento de uma tool muda conforme a entrada (ex.: criar vs. atualizar um registro dependendo de um campo), a descrição precisa declarar qual entrada seleciona qual efeito — senão o modelo pode escolher o efeito errado achando que faz outra coisa.

- **A — correta.**
- **B — errada:** Tamanho de resposta não muda a decisão.
- **C — errada:** Versão não orienta a chamada.
- **D — errada:** Motor de banco é detalhe interno.

**Tópicos:** Descrições de Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: descrição precisa declarar qual valor de entrada aciona qual comportamento, quando a tool tem efeitos condicionais
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q56 — Resposta correta: **B**

Uma tool built-in específica para busca em conteúdo resolve a necessidade sem conceder Bash, que é uma permissão ampla de execução de comandos e por isso tratada como sensível pelo sandbox.

- **A — errada:** Bash não filtra por relevância.
- **B — correta.**
- **C — errada:** Executar comandos arbitrários é justamente o que não se quer aqui.
- **D — errada:** Velocidade não é a razão, e não é verdade em todo caso.

**Tópicos:** Built-in Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: preferir tool built-in específica de busca em vez de conceder Bash (permissão ampla) quando a necessidade é só buscar conteúdo
- Arquétipos: A=camada-alvo-errado, C=extremo-vs-meio, D=camada-alvo-errado

---

## Q57 — Resposta correta: **A**

Quando o cliente não é elegível para uma promoção, o padrão certo é um erro estruturado marcado como não retentável, com uma explicação que o agente possa repassar ao cliente — sucesso com payload vazio ou uma exceção crua não dão ao agente o que dizer.

- **A — correta.**
- **B — errada:** Sucesso com payload vazio faz o agente seguir como se a promoção tivesse sido aplicada.
- **C — errada:** Exceção encerra o loop; o caso era resolvível com uma explicação.
- **D — errada:** "Operação falhou" não dá ao agente o que dizer ao cliente.

**Tópicos:** Erros Estruturados

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: erro de elegibilidade é não-retentável e vem com explicação pronta para repassar ao cliente
- Arquétipos: B=vazio-ausente, C=camada-alvo-errado, D=vazio-ausente

---

## Q58 — Resposta correta: **B**

O flag `isError` avisa o agente que uma tool falhou sem encerrar o loop — o agente recebe o erro como conteúdo do `tool_result` e pode decidir o que fazer a seguir, em vez de a execução simplesmente parar.

- **A — errada:** É exatamente o contrário do propósito do flag.
- **B — correta.**
- **C — errada:** Não há retry transparente da API que esconda o erro do agente.
- **D — errada:** O erro não é descartado: ele é entregue como conteúdo do `tool_result`.

**Tópicos:** Erros Estruturados

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `isError` comunica falha da tool ao agente sem interromper o loop
- Arquétipos: A=camada-alvo-errado, C=feature-inexistente-verossimil, D=vazio-ausente

---

## Q59 — Resposta correta: **B**

Para impedir estruturalmente que um subagente escreva, a solução é não conceder a tool de escrita a ele — conceder leitura e negar escrita resolve no nível de plataforma, diferente de instrução de prompt ou de regra do coordenador.

- **A — errada:** System prompt é instrução.
- **B — correta.**
- **C — errada:** Prompt de agregação do coordenador não governa o que o subagente pode chamar.
- **D — errada:** Descrição de tool é texto que o modelo lê — e presença continua implicando permissão.

**Tópicos:** Tool Choice, Coordenador e Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: garantia estrutural de "não pode escrever" é a tool de escrita simplesmente não existir para aquele agente
- Arquétipos: A=probabilistico-vs-garantia, C=camada-alvo-errado, D=probabilistico-vs-garantia

---

## Q60 — Resposta correta: **A**

Quando a necessidade é ler dado de outro sistema repetidamente, expor esse conteúdo como resource é o desenho certo — reduz chamadas exploratórias de tool e melhora a eficiência do agente em consultas entre sistemas.

- **A — correta.**
- **B — errada:** Invertido: tools são model-controlled, resources são application-controlled.
- **C — errada:** Resources não contornam permissões.
- **D — errada:** Resources são somente leitura; escrita é tool.

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: expor dado só-leitura como resource melhora eficiência em consultas cross-system, em vez de modelar como tool
- Arquétipos: B=camada-alvo-errado, C=feature-inexistente-verossimil, D=camada-alvo-errado

---
