# Gabarito — Bloco 3

**Domínio 3 — Claude Code Configuration & Workflows (peso 20%)**

Fontes: `livro01.pdf`, `livro02.pdf`, objetivos de `livro03.md`.

---

## Q1 — Resposta correta: **A**

Managed settings tem a maior precedência na hierarquia (Managed > User > Project > Local) e pode travar flags como `--dangerously-skip-permissions` para a organização inteira, independente do que usuário ou projeto configurem.

- **A — correta.**
- **B — errada:** Settings de usuário é justamente o que precisa ser impedido de sobrescrever.
- **C — errada:** `settings.local.json` é o escopo mais baixo e pessoal — o contrário do que a segurança precisa.
- **D — errada:** Projeto é escopo mais baixo que managed: o desenvolvedor sobrescreve no settings dele.

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: managed settings tem precedência máxima e pode bloquear flags perigosas para toda a organização
- Arquétipos: B=camada-alvo-errado, C=extremo-vs-meio, D=camada-alvo-errado

---

## Q2 — Resposta correta: **C**

Uma regra por caminho com glob carrega orientação só quando o arquivo casa com o padrão — é o mecanismo desenhado para orientação condicional, diferente de inflar o `CLAUDE.md` (sempre carregado) ou de um hook (que só bloqueia, não ensina).

- **A — errada:** Um `CLAUDE.md` maior carrega tudo sempre — é a causa do problema, não a cura (e alimenta o "lost in the middle").
- **B — errada:** Hook garante, mas aqui é convenção de estilo, não requisito duro — e um hook não *ensina* a convenção, só rejeita.
- **C — correta.**
- **D — errada:** Depender de o humano declarar o contexto a cada sessão é frágil e manual.

**Tópicos:** Path Rules

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: path-specific rule com glob aplica orientação condicional só aos arquivos que casam com o padrão
- Arquétipos: A=extremo-vs-meio, B=camada-alvo-errado, D=probabilistico-vs-garantia

---

## Q3 — Resposta correta: **B**

Em um pipeline de CI, a sessão precisa rodar em modo não interativo (`-p`) e devolver `--output-format json` para que o passo seguinte consiga interpretar a saída por programa — sem `-p`, o job travaria esperando um input humano que não existe.

- **A — errada:** Sem `-p` a sessão é interativa: o job trava esperando input.
- **B — correta.**
- **C — errada:** `--resume` retoma uma sessão anterior; um job de CI parte do zero e não tem sessão para retomar.
- **D — errada:** Humano lendo terminal é exatamente o que um pipeline automatizado não tem.

**Tópicos:** CI/CD

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S5 — Claude Code for CI
- Princípio testado: `-p` + `--output-format json` habilitam execução não interativa e saída parseável em CI
- Arquétipos: A=probabilistico-vs-garantia, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q4 — Resposta correta: **A**

A ordem de avaliação de regras de permissão é deny → ask → allow, e a regra mais restritiva que casar é a que vale — não é o escopo que decide o conflito, é o tipo da regra.

- **A — correta.**
- **B — errada:** Escopo define de onde a regra vem, mas o tipo (deny) decide o conflito dentro da avaliação.
- **C — errada:** Inverte a ordem: allow é o último avaliado, não o vencedor.
- **D — errada:** `ask` não é um meio-termo que prevalece; deny vem antes.

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: deny é avaliado antes de allow — a regra mais restritiva sempre vence
- Arquétipos: B=camada-alvo-errado, C=extremo-vs-meio, D=extremo-vs-meio

---

## Q5 — Resposta correta: **D**

Em uma regra de permissão de Bash, o espaço antes do `*` faz parte do padrão — `Bash(ls *)` casa com `ls -la` mas não com `lsof`, porque o espaço literal precisa existir no comando.

- **A — errada:** O `*` casa com qualquer caractere, mas o espaço literal antes dele tem de existir no comando.
- **B — errada:** Seria verdade para `Bash(ls*)` (sem espaço) — e é justamente a confusão que a questão testa.
- **C — errada:** Wildcards são suportados, e em qualquer posição do comando.
- **D — correta.**

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: espaço em uma regra de wildcard de Bash é literal e faz parte do padrão casado
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=feature-inexistente-verossimil

---

## Q6 — Resposta correta: **D**

O uso de `--dangerously-skip-permissions` tem casos legítimos — devcontainer ou VM descartável sem risco real, pipeline automatizado sem humano para aprovar, e trabalho de risco muito baixo e bem delimitado — não é um "nunca" absoluto nem exclusivo de um modo automático de CI.

- **A — errada:** Absoluto demais: o material desaconselha o uso casual, mas reconhece os cenários automatizados.
- **B — errada:** `-p` não depende disso; são configurações independentes.
- **C — errada:** Não há modo `bypassPermissions` automático em CI.
- **D — correta.**

**Tópicos:** CI/CD

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S5 — Claude Code for CI
- Princípio testado: `--dangerously-skip-permissions` tem casos legítimos restritos a ambientes descartáveis/isolados ou automação sem humano disponível
- Arquétipos: A=extremo-vs-meio, B=camada-alvo-errado, C=feature-inexistente-verossimil

---

## Q7 — Resposta correta: **C**

O sandbox não protege quando o próprio modelo raciocina que o sandbox é o obstáculo e decide removê-lo — com `--dangerously-skip-permissions` essa decisão é auto-aprovada, e o sandbox vira algo que o modelo pode simplesmente desativar.

- **A — errada:** Bubblewrap é justamente o mecanismo de sandbox citado para Linux/WSL2.
- **B — errada:** O sandbox não impede a avaliação das permission rules.
- **C — correta.**
- **D — errada:** A regra de deny não é desativada pelo sandbox; o problema é a auto-aprovação de tudo.

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: sandbox + auto-aprovação total permite que o modelo raciocine para remover a própria proteção
- Arquétipos: A=feature-inexistente-verossimil, B=camada-alvo-errado, D=camada-alvo-errado

---

## Q8 — Resposta correta: **D**

Para eliminar um falso positivo sistemático de um revisor automatizado, o critério precisa incluir tanto quando marcar quanto quando não marcar (ex.: só sinalizar SQL injection quando a entrada vai direto para a query sem parametrização, nunca em ORM/prepared statement), como contexto persistente em toda revisão.

- **A — errada:** Rodar duas vezes reproduz o mesmo falso positivo nas duas — o erro é sistemático, não aleatório.
- **B — errada:** Confiança auto-reportada como filtro: sinal não confiável (e os falsos positivos costumam vir com confiança alta).
- **C — errada:** "Confira de novo" não adiciona critério — o modelo reconfere com a mesma régua vaga.
- **D — correta.**

**Tópicos:** CI/CD, Path Rules

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: critério de revisão precisa de inclusão e exclusão explícitas, como contexto persistente — não apenas "confira de novo"
- Arquétipos: A=sinal-nao-confiavel, B=sinal-nao-confiavel, C=camada-alvo-errado

---

## Q9 — Resposta correta: **D**

Um slash command versionado no projeto encapsula prompt, restrições e formato de saída esperado, e fica disponível por nome para o time inteiro — diferente de hook (reage a tool call), permission rule (só autoriza) ou `CLAUDE.md` (sempre carregado, não invocado sob demanda).

- **A — errada:** Hook reage a tool call; não é um workflow que alguém invoca.
- **B — errada:** Permission rule autoriza ferramentas; não carrega prompt nem procedimento.
- **C — errada:** `CLAUDE.md` é contexto sempre carregado, não workflow invocável sob demanda.
- **D — correta.**

**Tópicos:** Commands e Skills

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 2 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: slash command versionado é o workflow reutilizável e parametrizável, invocável por nome
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=camada-alvo-errado

---

## Q10 — Resposta correta: **B**

Para explorar um repositório grande sem estourar a janela de contexto, o caminho é Glob para localizar candidatos por nome, Grep para achar as ocorrências, e Read só para carregar o que a busca apontou — entendimento incremental com custo de contexto controlado.

- **A — errada:** Ler tudo sequencialmente estoura a janela — é o cenário que a pergunta pede para evitar.
- **B — correta.**
- **C — errada:** Responder de conhecimento geral ignora **este** código. É alucinação com boa aparência.
- **D — errada:** `cat` do repositório inteiro é a versão pior da mesma coisa: todo o ruído entra no contexto.

**Tópicos:** Contexto de Codebase, CI/CD

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: exploração incremental (Glob → Grep → Read do necessário) evita estourar a janela de contexto num repositório grande
- Arquétipos: A=extremo-vs-meio, C=camada-alvo-errado, D=extremo-vs-meio

---

## Q11 — Resposta correta: **A**

`CLAUDE.md` existe para ser o contexto persistente do projeto, carregado automaticamente em toda sessão, sem que ninguém precise colar nada manualmente.

- **A — correta.**
- **B — errada:** Hook dispara em tool call, não no início da sessão com contexto de projeto.
- **C — errada:** Variável de ambiente entrega valor a processos, não orientação ao modelo.
- **D — errada:** Skill precisa ser invocada — falha o requisito "em toda sessão, sem ação humana".

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `CLAUDE.md` é carregado automaticamente em toda sessão como contexto persistente do projeto
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=vazio-ausente

---

## Q12 — Resposta correta: **D**

Gerar testes de melhor qualidade exige dar como contexto os arquivos de teste existentes, as convenções de fixture do time, e um critério explícito do que separa uma asserção comportamental de uma trivial — subir o limiar de cobertura ou gerar mais testes triviais só piora a métrica sem melhorar a qualidade.

- **A — errada:** Elevar o limiar de cobertura premia justamente o teste trivial que já existe.
- **B — errada:** Mais testes triviais é mais do mesmo problema com cobertura ainda mais enganosa.
- **C — errada:** Modelo maior sem critério continua sem saber o que o time considera um bom teste.
- **D — correta.**

**Tópicos:** Refinamento Iterativo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: qualidade de teste gerado melhora com contexto de convenção + critério explícito de asserção comportamental vs. trivial
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=vazio-ausente

---

## Q13 — Resposta correta: **A**

Preferências pessoais específicas de um projeto, que nunca devem ir para o repositório compartilhado, ficam em `.claude/settings.local.json` — escopo local, não versionado.

- **A — correta.**
- **B — errada:** `~/.claude/settings.json` valeria para todos os projetos, não só este.
- **C — errada:** `.claude/settings.json` é o escopo **compartilhado** do time e vai para o git.
- **D — errada:** Managed é organizacional, gerido por IT/DevOps.

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 3 = Bloom 1 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: `settings.local.json` é o escopo pessoal de um projeto específico, não versionado
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q14 — Resposta correta: **B**

O nome nu de uma tool numa regra de permissão, sem parênteses, cobre tudo — nenhuma filtragem por domínio ou padrão; `Read` sozinho significa toda leitura, de qualquer arquivo.

- **A — errada:** O nome nu é uma forma válida — e a mais ampla.
- **B — correta.**
- **C — errada:** Restringir à raiz exigiria um padrão de caminho.
- **D — errada:** `.gitignore` afeta os padrões das regras de Read/Edit, não transforma o nome nu em regra filtrada.

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: nome nu de tool numa regra de permissão é cobertura total, sem filtro
- Arquétipos: A=extremo-vs-meio, C=feature-inexistente-verossimil, D=feature-inexistente-verossimil

---

## Q15 — Resposta correta: **D**

A tool WebFetch é controlada por regra de domínio (`WebFetch(domain:example.com)`, com allow/ask/deny) — bloquear `curl` no shell não a alcança, porque ela não passa pelo shell.

- **A — errada:** Bloquear `curl` não cobre a tool WebFetch, que não passa pelo shell.
- **B — errada:** Regra de Read trata sistema de arquivos, não rede.
- **C — errada:** WebSearch é outra tool; negá-la não controla de onde o WebFetch busca.
- **D — correta.**

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 3 = Bloom 1 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: regra de permissão de WebFetch é por domínio, não via Bash/curl
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=camada-alvo-errado

---

## Q16 — Resposta correta: **A**

O modo `acceptEdits` aceita automaticamente as edições de arquivo durante a sessão, mas comandos de shell continuam pedindo confirmação — diferente de `plan` (nem edita), `dontAsk` (nega o que não está pré-aprovado) ou `bypassPermissions` (pula tudo, inclusive Bash).

- **A — correta.**
- **B — errada:** `plan` impede modificação de arquivo — o oposto do pedido.
- **C — errada:** `dontAsk` auto-**nega** o que não está pré-aprovado; não é auto-aceitar.
- **D — errada:** `bypassPermissions` pula **todos** os prompts, inclusive Bash.

**Tópicos:** Plan Mode

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `acceptEdits` só auto-aceita edição de arquivo; Bash continua pedindo confirmação
- Arquétipos: B=extremo-vs-meio, C=camada-alvo-errado, D=extremo-vs-meio

---

## Q17 — Resposta correta: **A**

Organizar orientação por quando ela se aplica — sempre-relevante em `CLAUDE.md`, condicional em path-specific rules/skills, e conteúdo compartilhado por import em vez de duplicado — ataca o custo de contexto e o efeito "lost in the middle" ao mesmo tempo.

- **A — correta.**
- **B — errada:** Colar manualmente a cada sessão desfaz o propósito do `CLAUDE.md`.
- **C — errada:** Mover para o system prompt não reduz nada: o custo e o efeito de meio continuam.
- **D — errada:** Importar os cinco no topo carrega exatamente o mesmo volume — só reorganiza os arquivos.

**Tópicos:** Hierarquia CLAUDE.md, Path Rules

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: separar orientação por "sempre relevante" vs. "condicional por caminho" reduz custo de contexto e "lost in the middle"
- Arquétipos: B=probabilistico-vs-garantia, C=camada-alvo-errado, D=enumerar-vs-generalizar

---

## Q18 — Resposta correta: **C**

Para evitar que uma execução em CI gaste muito mais tokens do que o orçado, a configuração precisa de limites explícitos de custo e de turnos que impeçam uma execução descontrolada — um prompt mais curto ou um runner mais rápido não limitam o gasto.

- **A — errada:** Prompt curto não limita quantos turnos o agente vai gastar num PR gigante.
- **B — errada:** Runner mais rápido paga a mesma conta de tokens mais depressa.
- **C — correta.**
- **D — errada:** Formato de saída não tem relação com consumo.

**Tópicos:** CI/CD

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 2 + integração 0 + cenário 1 + distratores 1
- Cenário: S5 — Claude Code for CI
- Princípio testado: limites explícitos de custo/turnos previnem execução descontrolada em CI
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=camada-alvo-errado

---

## Q19 — Resposta correta: **C**

Um job de revisão automatizada de PR deve restringir o acesso a tools desnecessárias (para não poder editar arquivos) e produzir saída estruturada adequada para processamento a jusante — reverter depois ou parsear markdown livre são soluções frágeis.

- **A — errada:** `bypassPermissions` + revisão manual falha os dois requisitos.
- **B — errada:** Reverter depois é limpeza de estrago, não prevenção.
- **C — correta.**
- **D — errada:** Pedir no prompt não impede a edição; e markdown parseado é frágil.

**Tópicos:** CI/CD

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S5 — Claude Code for CI
- Princípio testado: job de CI de revisão precisa restringir tools + saída estruturada, não markdown livre nem correção reativa
- Arquétipos: A=probabilistico-vs-garantia, B=montante-jusante, D=camada-alvo-errado

---

## Q20 — Resposta correta: **A**

Para achar arquivos cujo nome corresponde a um padrão, a tool certa é Glob — Read carrega um arquivo já conhecido, Grep busca dentro do conteúdo, e WebSearch busca na internet.

- **A — correta.**
- **B — errada:** Read carrega um arquivo que você já sabe qual é.
- **C — errada:** Grep busca **dentro** do conteúdo dos arquivos.
- **D — errada:** WebSearch busca na internet.

**Tópicos:** Built-in Tools, CI/CD

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 1 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: Glob busca arquivos por nome/padrão, não por conteúdo
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q21 — Resposta correta: **D**

O feedback que mais corrige um erro específico combina um exemplo concreto de entrada-saída com um apontamento pontual da falha — repetir a instrução vaga, reescrever do zero ou dar um julgamento sem conteúdo acionável não mudam o próximo resultado.

- **A — errada:** "Estava errado, siga nossas convenções" repete a vaguidade que causou o erro.
- **B — errada:** Reescrever do zero descarta a parte que estava certa e reintroduz o mesmo risco.
- **C — errada:** Julgamento de qualidade sem conteúdo acionável não muda nada.
- **D — correta.**

**Tópicos:** Refinamento Iterativo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: exemplo concreto entrada-saída + feedback pontual sobre a falha específica corrige melhor que instrução vaga
- Arquétipos: A=probabilistico-vs-garantia, B=extremo-vs-meio, C=vazio-ausente

---

## Q22 — Resposta correta: **B**

Ao corrigir vários problemas de uma vez, descrever todos os oito juntos permite uma correção coerente, em que a correção de um não quebra outro — corrigir um de cada vez multiplica turnos e arrisca regressão entre correções.

- **A — errada:** Torcer para o resto se resolver sozinho não é estratégia.
- **B — correta.**
- **C — errada:** Um por vez multiplica os turnos e arrisca regressões entre correções.
- **D — errada:** Recomeçar do prompt original volta ao mesmo resultado.

**Tópicos:** Refinamento Iterativo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: descrições de problema em lote (batched) permitem correção consolidada e coerente, sem regressão entre correções
- Arquétipos: A=sinal-nao-confiavel, C=extremo-vs-meio, D=camada-alvo-errado

---

## Q23 — Resposta correta: **C**

Existe uma allowlist de servidores MCP exclusiva de managed settings — indefinida significa sem restrição, array vazio significa travar todos os servidores MCP — e uma denylist com precedência sobre ela; nenhum escopo mais baixo consegue essa restrição organizacional.

- **A — errada:** `.mcp.json` é o que se quer restringir, não o lugar da restrição.
- **B — errada:** Local settings é o escopo mais fraco.
- **C — correta.**
- **D — errada:** Settings de usuário é sobrescrevível pelo próprio usuário.

**Tópicos:** MCP Servers, Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 1 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: allowlist/denylist de servidores MCP por organização só existe em managed settings
- Arquétipos: A=camada-alvo-errado, B=extremo-vs-meio, D=camada-alvo-errado

---

## Q24 — Resposta correta: **D**

Configurar o valor de retenção de sessão como 0 apaga todas as transcrições no início e desabilita a persistência por completo — nenhum `.jsonl` novo é gravado, `/resume` não mostra nada, e hooks recebem `transcript_path` vazio.

- **A — errada:** Não é preciso apagar diretório: o valor 0 já desabilita a persistência.
- **B — errada:** É configurável; 30 dias é apenas o padrão.
- **C — errada:** `/rename` apenas rotula a sessão; não controla se ela é gravada.
- **D — correta.**

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 3 = Bloom 1 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: retenção de sessão configurada como 0 desabilita persistência de transcrição por completo
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=camada-alvo-errado

---

## Q25 — Resposta correta: **D**

Para buscar um padrão dentro do conteúdo de arquivos, a tool certa é Grep — Read carrega um arquivo específico, Glob acha por nome, e `find` via Bash exige permissão de shell desproporcional.

- **A — errada:** Read carrega um arquivo específico; não busca.
- **B — errada:** `find` localiza por nome/atributo e exige permissão de Bash — ferramenta errada para conteúdo.
- **C — errada:** Glob acha arquivos por nome, não por conteúdo.
- **D — correta.**

**Tópicos:** Built-in Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: Grep busca padrão dentro do conteúdo de arquivos
- Arquétipos: A=camada-alvo-errado, B=over-engineering, C=camada-alvo-errado

---

## Q26 — Resposta correta: **C**

Quando o contexto está quase cheio mas o trabalho em andamento não pode ser perdido, `/compact` resume a conversa para liberar tokens preservando a linha de trabalho — `/rewind` voltaria no tempo e `/clear` apagaria tudo.

- **A — errada:** `/rename` só rotula; não libera contexto.
- **B — errada:** `/rewind` volta no tempo — perde as duas horas de progresso.
- **C — correta.**
- **D — errada:** `/clear` apagaria justamente o trabalho que ainda importa.

**Tópicos:** Resume e Fork de Sessão, Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `/compact` libera tokens resumindo a conversa, sem descartar o progresso como `/clear` faria
- Arquétipos: A=vazio-ausente, B=camada-alvo-errado, D=extremo-vs-meio

---

## Q27 — Resposta correta: **C**

Para zerar a conversa sem herdar nada da tarefa anterior, mas mantendo a orientação de projeto, `/clear` limpa a conversa atual sem apagar `CLAUDE.md` nem AutoMemory — reiniciar o terminal não é necessário para isso.

- **A — errada:** `/compact` resume e mantém o fio — haveria carry-over.
- **B — errada:** `/rewind` é para voltar dentro da mesma tarefa.
- **C — correta.**
- **D — errada:** Reiniciar o terminal não é "a única forma" — `/clear` existe para isso.

**Tópicos:** Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `/clear` zera a conversa sem afetar `CLAUDE.md`/AutoMemory
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=over-engineering

---

## Q28 — Resposta correta: **B**

Uma orientação de projeto que precisa valer para toda sessão no repositório e ser revisável pelo time em code review deve ir para o `CLAUDE.md` versionado — settings pessoais e `settings.local.json` não chegam aos colegas, e comentário em YAML de CI não é lido como contexto.

- **A — errada:** Settings pessoal não alcança os colegas.
- **B — correta.**
- **C — errada:** Comentário em YAML de CI não é lido como contexto pelo agente.
- **D — errada:** `settings.local.json` não vai para o git — invisível em code review.

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `CLAUDE.md` versionado é visível em code review; settings pessoais/locais não
- Arquétipos: A=camada-alvo-errado, C=feature-inexistente-verossimil, D=camada-alvo-errado

---

## Q29 — Resposta correta: **C**

Para voltar a um ponto anterior dentro da mesma sessão, descartando um erro sem perder os turnos bons antes dele, o comando certo é `/rewind` — `/compact` só resume, `/resume` retoma outra sessão, e `/clear` apagaria tudo.

- **A — errada:** `/compact` resume o histórico; não desfaz decisões.
- **B — errada:** `/resume` retoma **outra** sessão anterior; não navega dentro da atual.
- **C — correta.**
- **D — errada:** `/clear` apaga tudo, inclusive os nove turnos bons antes do erro.

**Tópicos:** Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `/rewind` restaura a sessão atual a um ponto anterior específico
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=extremo-vs-meio

---

## Q30 — Resposta correta: **C**

Uma regra por caminho com glob carrega quando os arquivos casam com o padrão e fica invisível no resto do tempo — é o mecanismo de orientação condicional; deny bloqueia em vez de orientar, e uma skill exige que alguém lembre de invocar.

- **A — errada:** Deny bloqueia a edição — não é orientação, é proibição.
- **B — errada:** Skill exige que alguém lembre de invocar.
- **C — correta.**
- **D — errada:** Seção no `CLAUDE.md` é carregada sempre, em toda sessão.

**Tópicos:** Path Rules

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: path-specific rule é o mecanismo certo para orientação condicional por caminho, presente só quando relevante
- Arquétipos: A=extremo-vs-meio, B=probabilistico-vs-garantia, D=camada-alvo-errado

---

## Q31 — Resposta correta: **A**

São duas configurações distintas: uma sobrescreve o modelo padrão de todas as sessões, e outra restringe quais modelos podem ser escolhidos via `/model`, `--model` ou variável de ambiente — nenhuma das duas é exclusiva de managed settings, e a restrição de seletor não afeta a opção "Default".

- **A — correta.**
- **B — errada:** Não são exclusivas de managed settings.
- **C — errada:** Restringir o seletor é configurável.
- **D — errada:** ⚠️ Pegadinha: a doc diz explicitamente que a restrição *"does NOT affect the 'Default' option in the model picker"*.

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: modelo padrão e restrição de seleção de modelo são duas configurações independentes, nenhuma exclusiva de managed settings
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=feature-inexistente-verossimil

---

## Q32 — Resposta correta: **C**

Para bloquear acesso a arquivos sensíveis sem exceção, a regra certa é deny — avaliada primeiro e a mais restritiva; `ask` deixaria uma porta aberta, `.gitignore` só impede commit (não leitura), e instrução em `CLAUDE.md` é enforcement por prompt.

- **A — errada:** `ask` deixa a porta aberta — o requisito é "sem exceções".
- **B — errada:** `.gitignore` impede commit, não leitura. (E padrões de Read/Edit seguem a **especificação** do gitignore — o que não é a mesma coisa que respeitar o arquivo.)
- **C — correta.**
- **D — errada:** Instrução em `CLAUDE.md` é enforcement por prompt.

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: deny é a única regra que garante bloqueio sem exceção — não `ask`, `.gitignore` ou instrução em prompt
- Arquétipos: A=probabilistico-vs-garantia, B=camada-alvo-errado, D=probabilistico-vs-garantia

---

## Q33 — Resposta correta: **D**

`context: fork` no frontmatter de uma skill ou slash command faz ela rodar em contexto de subagente isolado, evitando que o processamento intermediário contamine o estado da sessão principal — só a conclusão volta.

- **A — errada:** `CLAUDE.md` é contexto sempre presente, não workflow isolado.
- **B — errada:** `/compact` depois já pagou os tokens da saída longa e resume o resto junto.
- **C — errada:** Hook não é invocável por nome nem carrega instruções de workflow.
- **D — correta.**

**Tópicos:** Commands e Skills, Spawn de Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `context: fork` isola execução de workflow em subagente, evitando contaminar a sessão principal
- Arquétipos: A=camada-alvo-errado, B=montante-jusante, C=feature-inexistente-verossimil

---

## Q34 — Resposta correta: **A**

Para que um consumidor a jusante receba registros, não prosa, a execução precisa ser não interativa com saída JSON e um prompt que defina exatamente os campos de cada achado — um registro por achado, tipado.

- **A — correta.**
- **B — errada:** "Resumo claro e bem organizado" não define campo nenhum.
- **C — errada:** Log de terminal capturado é texto não estruturado com ruído de UI.
- **D — errada:** Regex sobre markdown quebra na primeira variação de formatação.

**Tópicos:** CI/CD

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S5 — Claude Code for CI
- Princípio testado: execução não interativa + JSON + campos definidos no prompt produzem saída consumível a jusante
- Arquétipos: B=vazio-ausente, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q35 — Resposta correta: **A**

Um job de revisão automatizada precisa carregar o guia de padrões correto para os arquivos em questão — sem esse escopo, ele aplica a orientação errada, e nem permissão ampla nem formato de saída resolvem esse problema de contexto.

- **A — correta.**
- **B — errada:** Permissão ampla não escolhe qual padrão carregar.
- **C — errada:** Formato de saída não tem relação com qual guia foi lido.
- **D — errada:** Não é capacidade do modelo: ele recebeu o guia errado como contexto.

**Tópicos:** CI/CD, Path Rules

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 1 + cenário 1 + distratores 1
- Cenário: S5 — Claude Code for CI
- Princípio testado: job de revisão de CI precisa carregar explicitamente o guia de padrões certo para o escopo dos arquivos revisados
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q36 — Resposta correta: **C**

Existe uma configuração que desativa todos os hooks (e a status line customizada) de uma vez, e em managed settings existe um modo de bloqueio em que só hooks de managed settings e do SDK rodam, travando os de usuário/projeto/plugin.

- **A — errada:** Há desligamento global, não só remoção individual.
- **B — errada:** Podem ser desabilitados.
- **C — correta.**
- **D — errada:** Desinstalar é desnecessário.

**Tópicos:** Hooks

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: hooks podem ser desligados globalmente, e managed settings pode travar quais hooks rodam na organização
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=over-engineering

---

## Q37 — Resposta correta: **C**

Por padrão, o seletor de arquivo com `@` esconde os arquivos que batem com `.gitignore`; uma configuração permite mostrar todos os arquivos, inclusive os ignorados pelo git.

- **A — errada:** Não é exclusivo de managed settings.
- **B — errada:** Premissa invertida: o padrão é esconder.
- **C — correta.**
- **D — errada:** Podem ser referenciados; a questão é o autocomplete escondê-los por padrão.

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: seletor `@` esconde arquivos gitignored por padrão, configurável para mostrar todos
- Arquétipos: A=extremo-vs-meio, B=camada-alvo-errado, D=vazio-ausente

---

## Q38 — Resposta correta: **C**

O sandbox só se aplica às tools de Bash — ele não restringe Read, Write, Edit, WebSearch, WebFetch, tools MCP, hooks ou comandos internos; assumir que ele cobre tudo é a suposição perigosa que faz alguém desenhar um controle de segurança que na verdade não existe.

- **A — errada:** Sandbox e permissões são camadas complementares.
- **B — errada:** Falso, e é a suposição perigosa.
- **C — correta.**
- **D — errada:** Rede é só um dos recursos controlados (há também espaço de armazenamento/memória e inspeção do host).

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: sandbox cobre só a execução via Bash — não é uma proteção geral para todas as tools
- Arquétipos: A=camada-alvo-errado, B=sinal-nao-confiavel, D=extremo-vs-meio

---

## Q39 — Resposta correta: **B**

Escopo pequeno, risco baixo e verificação automática já existente pedem execução direta, escolhida pela proporção entre risco e cerimônia — plan mode, workflow multi-fase ou tratar toda mudança como arquitetural são over-engineering para esse caso.

- **A — errada:** `bypassPermissions` "para não ser interrompido" troca segurança por conveniência sem necessidade.
- **B — correta.**
- **C — errada:** "Todo endpoint é mudança arquitetural" é regra absoluta que gera cerimônia onde não há risco.
- **D — errada:** Plan mode + workflow multi-fase é over-engineering para esse escopo.

**Tópicos:** Plan Mode

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: escolher o mecanismo de revisão pela proporção entre escopo, risco e verificação disponível — nem tudo pede o mecanismo mais pesado
- Arquétipos: A=probabilistico-vs-garantia, C=extremo-vs-meio, D=over-engineering

---

## Q40 — Resposta correta: **B**

Um pedido de correção de bug bem especificado declara o sintoma, como reproduzir, o escopo de arquivo, o que não deve ser mudado e a condição de pronto — "e quaisquer problemas relacionados" amplia o escopo, e advérbios como "com cuidado" não são critério.

- **A — errada:** "E quaisquer problemas relacionados" **amplia** o escopo — convite a falso positivo e a mudança não pedida.
- **B — correta.**
- **C — errada:** "Com cuidado e minuciosamente" são advérbios, não critérios.
- **D — errada:** Investigar e reportar é outra tarefa; não corrige o bug.

**Tópicos:** Critérios Explícitos, CI/CD

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: critério explícito de correção inclui o que NÃO mudar, além do sintoma, reprodução, escopo e condição de pronto
- Arquétipos: A=extremo-vs-meio, C=vazio-ausente, D=camada-alvo-errado

---

## Q41 — Resposta correta: **A**

`/context` mostra quantos tokens já foram consumidos na sessão atual e quantos ainda estão disponíveis, detalhado por categoria (mensagens, system, tools, skills).

- **A — correta.**
- **B — errada:** `/resume` escolhe uma sessão anterior.
- **C — errada:** Não é o comando descrito no material para essa função.
- **D — errada:** `/compact` age sobre o contexto; não o inspeciona.

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `/context` detalha consumo de tokens da sessão por categoria
- Arquétipos: B=camada-alvo-errado, C=feature-inexistente-verossimil, D=camada-alvo-errado

---

## Q42 — Resposta correta: **A**

O buffer de auto-compact é uma parte reservada da janela de contexto que garante folga suficiente para resumir o histórico quando o limite se aproxima — por isso uma sessão nova já aparece com parte do espaço reservada, sem ser bug.

- **A — correta.**
- **B — errada:** É observável — aparece no `/context`.
- **C — errada:** Não é bug; é comportamento documentado.
- **D — errada:** Não existe "índice do .gitignore" no contexto.

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: buffer de auto-compact reserva espaço de contexto para permitir resumir o histórico antes do limite
- Arquétipos: B=camada-alvo-errado, C=sinal-nao-confiavel, D=feature-inexistente-verossimil

---

## Q43 — Resposta correta: **A**

Uma preferência pessoal que deve valer em todos os projetos, mas só naquela máquina, vai em `~/.claude/settings.json` — escopo de usuário; project é compartilhado via git, managed é organizacional, e local vale só para um projeto.

- **A — correta.**
- **B — errada:** Project settings é compartilhado com o time via git.
- **C — errada:** Managed é imposto pela organização.
- **D — errada:** Local settings vale só para **aquele** projeto.

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 3 = Bloom 1 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: `~/.claude/settings.json` (escopo de usuário) vale para todos os projetos, só naquela máquina
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q44 — Resposta correta: **A**

A seção de variáveis de ambiente no `settings.json` é aplicada a toda sessão, útil para segredos, configuração de tool e feature flags — diferente de hook por tool call, export manual no shell (depende de lembrar) ou `CLAUDE.md` (informa o modelo, não define ambiente de execução).

- **A — correta.**
- **B — errada:** Hook por tool call é o lugar errado e o momento errado.
- **C — errada:** Exportar no shell depende de cada pessoa lembrar; não é configuração.
- **D — errada:** `CLAUDE.md` informa o modelo; não define ambiente de execução.

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: variáveis de ambiente em `settings.json` são aplicadas automaticamente a toda sessão
- Arquétipos: B=camada-alvo-errado, C=sinal-nao-confiavel, D=camada-alvo-errado

---

## Q45 — Resposta correta: **B**

Para auditar toda invocação de Bash de forma confiável, um hook `PostToolUse` roda um comando depois de cada uso da tool — permission rule só autoriza ou nega, e pedir ao próprio modelo para logar é enforcement por prompt, que falha silenciosamente.

- **A — errada:** Comando manual no fim da sessão perde o que aconteceu no meio.
- **B — correta.**
- **C — errada:** Permission rule autoriza ou nega; não executa efeito colateral.
- **D — errada:** Pedir ao modelo para logar é enforcement por prompt: falha silenciosamente.

**Tópicos:** Hooks

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: hook `PostToolUse` registra toda invocação de uma tool de forma confiável, diferente de pedir ao modelo para logar
- Arquétipos: A=camada-alvo-errado, C=camada-alvo-errado, D=probabilistico-vs-garantia

---

## Q46 — Resposta correta: **B**

Um prefixo `/` numa regra de Read/Edit é relativo à raiz do projeto — ancorado onde quer que fique a raiz do repositório, portável entre máquinas; diretório atual não tem prefixo, home é `~/`, raiz do sistema é `//`.

- **A — errada:** Diretório atual é sem prefixo (ou `./`).
- **B — correta.**
- **C — errada:** Home é `~/`.
- **D — errada:** Absoluto da raiz do sistema é `//`.

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 3 = Bloom 1 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: prefixo `/` em regra de Read/Edit é relativo à raiz do projeto, portável entre máquinas
- Arquétipos: A=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q47 — Resposta correta: **D**

Para uma regra que sempre deve apontar para o diretório home, independente de qual projeto está aberto, o prefixo certo é `~/` — `/` é raiz do projeto, sem prefixo é o diretório de lançamento, e `//` é a raiz do sistema de arquivos.

- **A — errada:** `/` é raiz do projeto — muda conforme o repositório aberto.
- **B — errada:** Sem prefixo é o diretório de onde o Claude Code foi lançado.
- **C — errada:** `//` é raiz do sistema de arquivos.
- **D — correta.**

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 3 = Bloom 1 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: prefixo `~/` em regra de Read/Edit sempre aponta para o diretório home, independente do projeto
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=camada-alvo-errado

---

## Q48 — Resposta correta: **D**

Para decidir de forma confiável se um build deve falhar, o campo de severidade precisa vir em JSON estruturado e tipado, com a decisão tomada pelo script — humano no meio quebra a automação, e buscar a palavra "blocker" por texto casa até com frases que dizem que não há blockers.

- **A — errada:** Humano no meio quebra a automação do gate.
- **B — errada:** Depender de o agente escolher o exit code é confiar em comportamento não garantido.
- **C — errada:** Grep por "blocker" casa com a palavra em qualquer lugar — inclusive numa frase que diz que **não** há blockers.
- **D — correta.**

**Tópicos:** CI/CD

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S5 — Claude Code for CI
- Princípio testado: decisão de falhar o build deve vir de um campo estruturado e tipado, não de texto livre ou comportamento não garantido
- Arquétipos: A=camada-alvo-errado, B=sinal-nao-confiavel, C=sinal-nao-confiavel

---

## Q49 — Resposta correta: **B**

Além de aprovar todos os servidores listados em `.mcp.json` de uma vez, existe uma configuração para aprovar servidores específicos individualmente (e uma para rejeitar servidores específicos) — não é tudo-ou-nada.

- **A — errada:** Não é tudo-ou-nada: há aprovação seletiva.
- **B — correta.**
- **C — errada:** Nada a ver com código-fonte do servidor.
- **D — errada:** Servidores de `.mcp.json` não são aprovados automaticamente por padrão.

**Tópicos:** MCP Servers, Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 1 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: managed settings permite aprovar servidores MCP de `.mcp.json` individualmente, não só todos de uma vez
- Arquétipos: A=extremo-vs-meio, C=feature-inexistente-verossimil, D=camada-alvo-errado

---

## Q50 — Resposta correta: **D**

O modo `dontAsk` nega automaticamente qualquer tool que não esteja pré-aprovada via `/permissions` ou regras de allow, em vez de interromper pedindo confirmação — diferente de `bypassPermissions` (aprova tudo) ou `acceptEdits` (aceita edição).

- **A — errada:** `bypassPermissions` auto-aprova tudo.
- **B — errada:** `acceptEdits` auto-aceita edições — o oposto de negar.
- **C — errada:** `default` é justamente o que pergunta no primeiro uso de cada tool.
- **D — correta.**

**Tópicos:** Plan Mode

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `dontAsk` nega automaticamente o que não está pré-aprovado, em vez de perguntar
- Arquétipos: A=extremo-vs-meio, B=extremo-vs-meio, C=camada-alvo-errado

---

## Q51 — Resposta correta: **B**

Para acumular descobertas ao longo de várias sessões sem estourar contexto, a combinação recomendada é isolamento de subagente, arquivos de scratchpad e leitura dirigida de arquivo — o scratchpad é o estado durável entre sessões; colar a transcrição inteira ou reexplorar do zero desperdiçam exatamente o que se quer evitar.

- **A — errada:** Colar a transcrição inteira reintroduz todo o custo de contexto que a compactação tinha removido.
- **B — correta.**
- **C — errada:** Reexplorar do zero é o desperdício que se quer evitar.
- **D — errada:** Sessão eterna com auto-compact degrada: a sumarização progressiva perde números e detalhes.

**Tópicos:** Contexto Longo, Contexto de Codebase

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: arquivo de scratchpad como estado durável entre sessões sustenta exploração além dos limites de contexto de uma sessão só
- Arquétipos: A=montante-jusante, C=camada-alvo-errado, D=extremo-vs-meio

---

## Q52 — Resposta correta: **B**

Para garantir que um job de CI nunca escreva no repositório, a garantia vem de regras de permissão negando Bash/Edit/Write — imposta pela configuração, independente do que o modelo decida; uma linha no system prompt continua sendo instrução, não garantia.

- **A — errada:** Linha no system prompt é instrução, não garantia.
- **B — correta.**
- **C — errada:** Reverter depois é remediação, não prevenção.
- **D — errada:** Modelo menor tem as mesmas ferramentas.

**Tópicos:** CI/CD, Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S5 — Claude Code for CI
- Princípio testado: regra de permissão negando ferramentas é garantia por configuração; instrução em prompt não é
- Arquétipos: A=probabilistico-vs-garantia, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q53 — Resposta correta: **C**

Uma sessão iniciada via Remote Control ou Claude Code for Web pode ser continuada localmente pela IDE — não exige exportar nem colar a transcrição, e as duas formas de sessão não ficam permanentemente isoladas uma da outra.

- **A — errada:** Não exige exportar nem colar transcrição.
- **B — errada:** Não são permanentemente separadas.
- **C — correta.**
- **D — errada:** Sessões web também são retomáveis.

**Tópicos:** Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: sessão iniciada remotamente (Web/Remote Control) pode ser continuada localmente na IDE
- Arquétipos: A=over-engineering, B=extremo-vs-meio, D=camada-alvo-errado

---

## Q54 — Resposta correta: **D**

`CLAUDE.md` suporta importar outro arquivo, mantendo uma única fonte da verdade para conteúdo compartilhado entre projetos, sem duplicar — symlink é truque de sistema de arquivos, copiar cria cópias divergentes, e um hook que concatena arquivos reinventa algo que já existe pronto.

- **A — errada:** Symlink é truque de sistema de arquivos, não o mecanismo previsto.
- **B — errada:** Copiar cria duas cópias que divergem — o problema que a pergunta pede para evitar.
- **C — errada:** Hook de início de sessão concatenando arquivos é solução caseira para algo que já existe.
- **D — correta.**

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: import em `CLAUDE.md` compartilha conteúdo entre projetos sem duplicar nem divergir
- Arquétipos: A=camada-alvo-errado, B=montante-jusante, C=over-engineering

---

## Q55 — Resposta correta: **A**

`mcp__<server_name>` sozinho casa com qualquer tool fornecida por aquele servidor — existe também a forma `mcp__<server>__<tool>` para uma tool específica, e um glob na posição do nome da tool para cobrir todos os servidores de uma vez.

- **A — correta.**
- **B — errada:** Não é casamento por prefixo de nome de servidor; é o servidor exato.
- **C — errada:** Não é o nome de uma tool: é o prefixo do servidor.
- **D — errada:** O nome da tool é opcional — sem ele, cobre o servidor inteiro.

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 3 = Bloom 1 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: `mcp__<server_name>` sem nome de tool cobre todas as tools daquele servidor
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q56 — Resposta correta: **D**

O pipeline de CI já sabe qual é o diff da mudança — passar essa lista como escopo explícito para o agente é determinístico e barato, diferente de deixá-lo descobrir sozinho, usar critério vago ("o que parecer relevante") ou aumentar o limite de turnos para revisar o repositório inteiro.

- **A — errada:** Elevar o limite de turnos paga por uma revisão de repositório inteiro que ninguém pediu.
- **B — errada:** "O que parecer relevante" é vago — gera revisão inconsistente entre execuções.
- **C — errada:** Deixar o agente descobrir o diff gasta turnos para obter algo que o CI já tem pronto.
- **D — correta.**

**Tópicos:** CI/CD

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S5 — Claude Code for CI
- Princípio testado: escopo explícito (o diff já conhecido pelo pipeline) é determinístico; descoberta ou critério vago não são
- Arquétipos: A=over-engineering, B=sinal-nao-confiavel, C=camada-alvo-errado

---

## Q57 — Resposta correta: **B**

Uma regra absoluta como "nunca contra produção sem ticket aprovado" é uma garantia, e garantia se implementa como gate/hook que verifica um estado externo (o ticket existe?) — não como texto que o modelo lê, mesmo num `CLAUDE.md` sempre carregado ou num `ask` que depende do humano avaliar certo toda vez.

- **A — errada:** Skill organiza um workflow; não impede a execução fora dele.
- **B — correta.**
- **C — errada:** `CLAUDE.md` é sempre carregado, mas continua sendo instrução.
- **D — errada:** `ask` melhora, mas depende de o humano avaliar corretamente a cada vez, e não verifica a existência do ticket. Em automação, ninguém responde ao prompt.

**Tópicos:** Enforcement de Workflow, CI/CD

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S5 — Claude Code for CI
- Princípio testado: requisito absoluto ("nunca sem X") precisa de gate/hook que verifique estado externo, não instrução textual
- Arquétipos: A=camada-alvo-errado, C=probabilistico-vs-garantia, D=probabilistico-vs-garantia

---

## Q58 — Resposta correta: **C**

Existe uma configuração de idioma de resposta preferido no `settings.json`, ao lado do output style que ajusta o system prompt — o modelo não lê variáveis de ambiente por conta própria, permissões não têm dimensão de idioma, e `/rename` só rotula a sessão.

- **A — errada:** O modelo não lê variáveis de ambiente por conta própria.
- **B — errada:** Permissões não têm dimensão de idioma.
- **C — correta.**
- **D — errada:** `/rename` rotula a sessão.

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: idioma de resposta preferido é uma configuração dedicada em `settings.json`
- Arquétipos: A=feature-inexistente-verossimil, B=camada-alvo-errado, D=camada-alvo-errado

---

## Q59 — Resposta correta: **B**

Um exemplo concreto de entrada e saída esperada ancora formato e nomenclatura de um jeito que instrução vaga ("mais consistente", "siga nosso estilo") não consegue — é o mesmo mecanismo de few-shot aplicado ao refinamento iterativo.

- **A — errada:** "Mais consistente" não define com o quê.
- **B — correta.**
- **C — errada:** Link para a home do guia não coloca o conteúdo no contexto.
- **D — errada:** "Siga nosso estilo" pressupõe que o modelo saiba qual é.

**Tópicos:** Refinamento Iterativo, Few-Shot

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: exemplo concreto entrada→saída (few-shot) ancora formato/nomenclatura melhor que instrução vaga de estilo
- Arquétipos: A=vazio-ausente, C=camada-alvo-errado, D=probabilistico-vs-garantia

---

## Q60 — Resposta correta: **B**

Quando a orientação só vale para um diretório específico (ex.: `db/migrations/`) e é consultiva, não uma garantia rígida, os dois critérios juntos apontam para uma path-specific rule — `CLAUDE.md` carregaria sempre, negar edição impediria o trabalho, e um hook implicaria garantia onde o enunciado pede só orientação.

- **A — errada:** `CLAUDE.md` carrega em toda sessão orientação que só vale num diretório.
- **B — correta.**
- **C — errada:** Negar edições impede o trabalho em vez de orientá-lo.
- **D — errada:** Hook é para garantia. O enunciado diz explicitamente que é advisory — usar hook aqui é over-engineering, e ainda quebra migrações legítimas sem rollback.

**Tópicos:** Path Rules

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: orientação condicional por caminho E consultiva (não garantia) aponta para path-specific rule, não `CLAUDE.md` nem hook
- Arquétipos: A=camada-alvo-errado, C=extremo-vs-meio, D=over-engineering

---
