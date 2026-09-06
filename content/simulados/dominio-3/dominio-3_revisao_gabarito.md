# Gabarito de Revisão — CCA-F | Domínio 3 (Claude Code Configuration & Workflows)

Explicações em PT-BR. O sufixo `· (x.y)` indica o task statement; itens cruzados trazem `(cruza X + Y)` no enunciado e a nota "Task statements combinados" nos metadados.

---

## Q1 — Resposta correta: **C** · (3.1)

`@import` **ignora tokens dentro de code span (`` `...` ``) e de fenced block** — senão qualquer exemplo de sintaxe escrito na documentação do próprio CLAUDE.md viraria um import. A linha documentava a sintaxe *dentro* do bloco cercado, então nunca foi um import: o arquivo não entra no assembly, e é por isso que `/memory` lista o root e não lista `standards/api-conventions.md`. A correção é mover a linha para fora do bloco.

- **A — errada:** o teto de 4 hops corta a partir do 5º nível; aqui há **um** hop (root → standards). Diagnóstico no mecanismo errado (camada/alvo errado).
- **B — errada:** path relativo de `@import` resolve **relativo ao arquivo que importa**, não ao cwd — a premissa é falsa (equívoco de capacidade).
- **C — correta.**
- **D — errada:** `@import` é expandido junto com a camada que o contém, no momento em que ela carrega; "on-demand" é o CLAUDE.md de **subdiretório**, não o import (camada/alvo errado).

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 1 + cenário 1 + distratores 1
- Cenário: S2 — Code Generation with Claude Code
- Princípio testado: causa raiz > sintoma — o sintoma "o Claude ignora a convenção" tem causa em resolução de config

## Q2 — Resposta correta: **A** · (3.2)

Skill é **model-invocable por padrão** (Claude decide pela `description`); `disable-model-invocation: true` a **restringe a user-only**. Com esse campo presente, uma `description` perfeita não muda nada — o gatilho automático está desligado por configuração. Remover o campo é a correção proporcional e determinística.

- **A — correta.**
- **B — errada:** joga uma checklist longa no contexto de **toda** sessão para resolver um problema de invocação; perde a carga on-demand que justifica a skill (resposta desproporcional / camada errada).
- **C — errada:** `argument-hint` é **hint de autocomplete**, não pré-condição de invocação — atribui a um campo de UX um poder que ele não tem (equívoco de capacidade).
- **D — errada:** `allowed-tools` escopa as tools **durante** a execução; ele não decide se a skill é acionada. A skill funciona quando invocada, o que já descarta essa hipótese (camada/alvo errado).

**Tópicos:** Commands e Skills

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: controle de invocação é config determinística, não qualidade de redação da `description`

## Q3 — Resposta correta: **D** · (3.3)

Uma **path-rule injeta texto de instrução** quando o glob casa; uma **skill com `paths`** ativa um **bloco de comportamento** — diretório próprio, arquivos de apoio lidos sob demanda (progressive disclosure) e tools escopadas. Um gate de 4 fases com scripts, arquivo de política e checklist em três markdowns é exatamente o segundo caso: o sintoma "as fases do meio são puladas" é o de uma parede de instrução em prosa, não de glob errado (o `**/*.tf` já casa).

- **A — errada:** três rules em vez de uma continua sendo texto injetado, sem scripts nem arquivos de apoio; muda a embalagem, não o mecanismo (camada/alvo errado).
- **B — errada:** CLAUDE.md de subdiretório é local a **uma** subárvore e sempre-carregado para ela — não cobre `.tf` espalhado pelo monorepo e não resolve a execução em fases (mecanismo errado para o padrão de espalhamento).
- **C — errada:** tornar a rule global põe as 4 fases no contexto de toda sessão, inclusive as que não tocam Terraform — custo de contexto sem resolver o problema relatado.
- **D — correta.**

**Tópicos:** Path Rules

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 1 + distratores 2
- Cenário: S5 — Claude Code for CI
- Princípio testado: casar o mecanismo ao requisito — `paths` de rule × `paths` de skill usam o mesmo glob e fazem coisas diferentes

## Q4 — Resposta correta: **B** · (3.4)

Aprovar o plano **sai** do plan mode: a sessão passa ao modo descrito pela opção escolhida — "Yes, and use auto mode" põe a sessão em auto mode. Plan mode **não persiste** depois da aprovação; para voltar a planejar é Shift+Tab / `/plan` por prompt, e se o requisito é que edição sempre seja aprovada, isso é `permissions.defaultMode` (ou deny rule / hook `PreToolUse`), não memória do modo anterior.

- **A — errada:** plan mode é **modo de permissão**, não orientação; descrevê-lo como advisory inverte o mecanismo (equívoco de capacidade). Prosa é que seria advisory.
- **B — correta.**
- **C — errada:** ausência de `permissions` não promove a sessão a `bypassPermissions`; o modo veio da opção de aprovação escolhida (feature/comportamento inexistente).
- **D — errada:** não há "re-aprovar o plano original" — a aprovação **encerrou** o plan mode; não é um estado que volta por mudança de assunto (camada/alvo errado).

**Tópicos:** Plan Mode

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 1 + cenário 1 + distratores 1
- Cenário: S2 — Code Generation with Claude Code
- Princípio testado: causa raiz > sintoma — o ciclo de vida do modo de permissão explica o comportamento, não uma falha do modelo

## Q5 — Resposta correta: **C** · (3.5)

A busca de `session_id` é **escopada ao diretório do projeto**. Rodando as rodadas 2 e 3 da raiz do repositório, o `--resume` não encontra a sessão da rodada 1 — cada rodada abre uma sessão nova e perde o contexto da tentativa anterior, que é justamente o que faz a correção ser incremental em vez de recomeço. Rodar sempre do mesmo diretório restaura a continuidade.

- **A — errada:** `--fork-session` também depende de localizar a sessão-mãe; e forkar não é o que se quer aqui (iteração na mesma tarefa) — mecanismo errado para o sintoma (camada/alvo errado).
- **B — errada:** a saída do pytest carrega o que falhou, mas não o que já foi tentado e descartado; abrir sessão nova a cada rodada é aceitar como projeto exatamente o defeito observado (equívoco de capacidade).
- **C — correta.**
- **D — errada:** resumir a falha em prosa joga fora entrada, valor obtido e valor esperado — é o erro central da iteração test-driven, e não tem relação com o resume falhando.

**Tópicos:** Refinamento Iterativo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 2 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: casar a ferramenta ao requisito — devolver a falha real **na mesma sessão** exige que o resume de fato encontre a sessão

## Q6 — Resposta correta: **A** · (3.6)

`--json-schema` valida contra **JSON Schema draft-07**, e nesse contrato `format` é **anotação — não é enforced**. Um schema que usa `format: "date"` para "garantir" data ISO não garante nada: o run volta `success` com `structured_output` presente e o valor fora de forma. A garantia tem de morar no gate, em código determinístico, antes de entregar ao serviço a jusante.

- **A — correta.**
- **B — errada:** o SDK valida em draft-07 e **rejeita** schema que declare draft mais novo; a premissa da alternativa falha na plataforma (equívoco de capacidade / feature inexistente).
- **C — errada:** prompt e exemplos reduzem a incidência, mas o requisito é que nada fora de forma passe — probabilístico onde precisa ser determinístico (contraste 1.4/1.5).
- **D — errada:** retry até "todas as datas parsearem" gasta chamadas e mascara o defeito de validação; é retry cego sobre erro que não é transitório (voto/retry que suprime sinal).

**Tópicos:** CI/CD

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 1 + cenário 1 + distratores 1
- Cenário: S5 — Claude Code for CI
- Princípio testado: enforcement programático > declaração decorativa — validação real no gate

## Q7 — Resposta correta: **D** · (3.4) — quebra-automatismo

A decisão vem dos **sinais observáveis**, não da contagem de arquivos: a causa já é conhecida (o stack trace nomeia cada linha), a mudança é local e mecânica, não há implicação arquitetural e **não existe mais de uma abordagem válida** para um plano escolher entre. É o caso canônico de execução direta — plan mode aqui é a resposta desproporcional cujo preço se paga em turnos e tokens sem nenhuma mudança entregue.

- **A — errada:** eleva "número de arquivos" a critério único; é o automatismo que o item testa. Multi-arquivo pesa quando **também** há abordagem em aberto ou implicação arquitetural.
- **B — errada:** plan mode **e** Explore para mapear um valor literal cuja localização o ticket já dá — over-engineering em duas camadas.
- **C — errada:** quatro sessões para uma edição mecânica idêntica multiplica overhead e perde a visão do conjunto; granularidade sem benefício (resposta desproporcional).
- **D — correta.**

**Tópicos:** Plan Mode

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 2 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: resposta proporcional / menor esforço que ataca a causa raiz

## Q8 — Resposta correta: **B** · (3.1)

Antes de mover ou reescrever qualquer coisa, é preciso saber **de onde** a instrução vem. `/memory` é o comando de **inspeção**: lista os arquivos de memória efetivamente carregados naquela sessão. Nas duas máquinas ele revela a assimetria — a convenção mora no `~/.claude/CLAUDE.md` (ou num `CLAUDE.local.md` gitignored) de um dos devs, escopo pessoal que não vai para o git e por isso não chega ao colega nem aos contratados. Só depois disso a correção (mover para `./CLAUDE.md`, versionado) é uma decisão informada.

- **A — errada:** repetir a instrução no prompt trata o sintoma por sessão, não propaga para os contratados e não descobre nada (prompt onde o problema é escopo de config).
- **B — correta.**
- **C — errada:** consolidar tudo num CLAUDE.md monolítico é a resposta oposta à modularização por `@import`/`.claude/rules/`, infla contexto e ainda pode não conter a convenção que ninguém localizou.
- **D — errada:** hook `PreToolUse` é a resposta certa quando o requisito é **impedir** um commit fora do padrão; aqui o pedido é fazer a convenção valer para todos e o primeiro passo é diagnóstico — enforcement antes do diagnóstico é resposta desproporcional.

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 1 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: causa raiz > sintoma — `/memory` inspeciona qual escopo está carregado antes de qualquer mudança

## Q9 — Resposta correta: **A** · (cruza 3.3 + 3.1)

`.claude/rules/` **não tem scope managed**: rules vivem em escopo project (versionado, editável por quem tem acesso ao repo) e user (`~/.claude/rules/`, pessoal). A única camada de memória **não sobrescrevível** é a **managed policy** do CLAUDE.md (`/etc/claude-code/CLAUDE.md`), distribuída pela organização. O requisito é "presente sempre e não removível" → é essa camada, aceitando que ela carrega em toda sessão em vez de on-demand por glob.

- **A — correta.**
- **B — errada:** `~/.claude/rules/` é escopo **pessoal** — cada engenheiro pode editar ou apagar o arquivo na própria máquina; move na direção oposta da garantia.
- **C — errada:** CODEOWNERS e texto em template de PR são controles **sociais/de processo**; não impedem uma edição local nem garantem presença no contexto (probabilístico onde precisa ser determinístico).
- **D — errada:** `scope: managed` em rule não existe — é feature verossímil por analogia com o managed do CLAUDE.md, e endossar a proposta é o erro que o item cobra.

**Tópicos:** Path Rules, Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 1 + distratores 2
- Cenário: S5 — Claude Code for CI
- Princípio testado: garantia é propriedade do mecanismo — só a camada managed é não sobrescrevível
- Task statements combinados: 3.3 (escopos e limites de `.claude/rules/`) + 3.1 (camada managed do CLAUDE.md)

## Q10 — Resposta correta: **C** · (cruza 3.2 + 1.7)

O que se quer é **ramificar a conversa inteira** a partir de um estado caro de construir, para explorar dois caminhos em paralelo sem perder o original: isso é **session fork** (`/branch` no CLI, `fork_session` no Agent SDK), que copia todo o histórico para uma sessão nova.

- **A — errada:** `context: fork` isola **a execução de uma skill** num sub-agente e devolve só um resumo — não preserva nem ramifica a conversa, e o sub-agente não herda os 40 minutos de contexto do mesmo jeito. É o cruzamento 3.2×1.7 que o item testa.
- **B — errada:** `--resume` continua **a mesma** sessão; duas tentativas resumidas contaminam uma à outra em vez de correrem em ramos independentes (mecanismo errado).
- **C — correta.**
- **D — errada:** Explore é subagente **read-only** especializado em descoberta (Write/Edit negados) — não implementa refactor nenhum (camada/alvo errado).

**Tópicos:** Commands e Skills, Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 1 + distratores 2
- Cenário: S2 — Code Generation with Claude Code
- Princípio testado: casar o mecanismo ao requisito — ramificar conversa × isolar execução × delegar descoberta são três coisas
- Task statements combinados: 3.2 (`context: fork` em skill) + 1.7 (session fork / `fork_session`)

## Q11 — Resposta correta: **D** · (cruza 3.4 + 3.6)

O requisito é de **incapacidade**, não de improbabilidade. `--allowedTools` **pré-aprova** tools (pula o prompt de confirmação) — não remove Write/Edit do pool disponível ao run. `--tools` é a flag que **restringe quais tools existem** na execução: sem a tool declarada, a escrita não é uma ação possível.

- **A — errada:** plan mode é modo de permissão, mas em sessão onde bypass permissions está disponível a CLI **não aplica** seus blocks, e escrita em protected path segue apenas *prompted* — não é garantia (e o achado da auditoria é exatamente uma escrita sob `.github/`).
- **B — errada:** prosa mais forte + log é enforcement probabilístico com detecção **depois** do fato; o requisito pede que o run não consiga escrever (probabilístico onde precisa ser determinístico).
- **C — errada:** `--max-turns` limita turnos e **sai com erro** ao estourar; nada nele impede uma escrita dentro do 1º turno — camada errada, e ainda introduz um desfecho de falha para o gate tratar.
- **D — correta.**

**Tópicos:** Plan Mode, CI/CD

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 9 = Bloom 4 + integração 2 + cenário 1 + distratores 2
- Cenário: S5 — Claude Code for CI
- Princípio testado: least privilege determinístico — restringir o conjunto de tools, não pré-aprovar nem pedir em prosa
- Task statements combinados: 3.4 (modo de permissão não é garantia sob bypass) + 3.6 (`--tools` × `--allowedTools` × `--max-turns` em CI)

## Q12 — Resposta correta: **B** · (cruza 3.1 + 3.2)

São **dois mecanismos de resolução diferentes**, e o cenário mostra os dois lado a lado. Commands/skills de mesmo nome fazem **override sem merge** — a variante pessoal em `~/.claude/skills/` substitui inteira a do projeto, então as 4 convenções do time simplesmente não existem para aquele dev. Memória **concatena** por camada, e é por isso que as preferências pessoais e as regras do projeto convivem na mesma sessão. Nome diferente ⇒ os dois artefatos coexistem: renomear o atalho pessoal resolve.

- **A — errada:** skills não concatenam nem "truncam" a versão do time — inverte o mecanismo de resolução (equívoco de capacidade).
- **B — correta.**
- **C — errada:** a escolha entre duas skills de **mesmo nome** não é feita por qualidade de `description`; só uma existe depois da resolução de escopo (camada/alvo errado).
- **D — errada:** on-demand × sempre-carregado é o eixo de CLAUDE.md de subdiretório e path-rule, não a explicação do shadowing; e `paths` não muda precedência de escopo (camada/alvo errado).

**Tópicos:** Hierarquia CLAUDE.md, Commands e Skills

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 8 = Bloom 3 + integração 2 + cenário 2 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: casar o modelo mental ao mecanismo — memória concatena, commands/skills e MCP fazem override sem merge
- Task statements combinados: 3.1 (concatenação de memória por camada) + 3.2 (override de escopo project × user em skills)

---

## Autoavaliação
- **11–12/12:** domínio sólido do Domínio 3 — pronto para o Domínio 4 (Prompt Engineering & Structured Output).
- **8–10/12:** revise os pontos que errou por `anotacoes/dominio-3_resumo.md`; atenção especial aos itens cruzados (Q9–Q12), que exigem combinar dois mecanismos ao mesmo tempo.
- **≤7/12:** releia o resumo e rode os exercícios 3.1–3.6 (comece pelos caminhos de custo zero de 3.4/3.5/3.6) antes de avançar ao Domínio 4.
