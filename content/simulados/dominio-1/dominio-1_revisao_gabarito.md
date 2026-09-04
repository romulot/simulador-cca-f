# Gabarito — Revisão do Domínio 1

**Simulado:** `dominio-1_revisao_simulado.md` · **Resumo:** `anotacoes/dominio-1_resumo.md`

> 12 questões (4 cruzadas). Explicações em português (momento de ensino). O(s) task statement(s) de cada questão está(ão) indicado(s) no cabeçalho.

---

## Q1 — Resposta correta: **A** · (1.1)

O "quem roda o loop" é a distinção-chave: no Agent SDK, `query()` **já** executa o loop agêntico completo — incluindo despachar tools e observar `stop_reason` — dentro do próprio processo do CLI. Manter um segundo loop manual por fora é redundante: ele reexecuta tool calls que o SDK já processou, daí a duplicidade de efeitos colaterais. A correção é remover a orquestração manual e apenas consumir o stream de mensagens.

- **A — correta.**
- **B — errada:** atribui a duplicidade a `max_tokens` insuficiente truncando o JSON — **equívoco de capacidade**: `max_tokens` não causa reexecução de chamadas; o sintoma real é a arquitetura de dois loops sobrepostos.
- **C — errada:** propõe um hook de deduplicação por comparação de nome+argumentos — **over-engineering**: adiciona uma camada de detecção para mascarar um bug que deveria simplesmente ser removido na origem (o loop redundante).
- **D — errada:** troca o modelo para reduzir a frequência de `tool_use` blocks — **camada/alvo errado**: ataca o modelo em vez da orquestração; não elimina o segundo loop que causa a reexecução.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: causa raiz > sintoma (remover a duplicidade de orquestração na origem, não mascará-la com uma camada extra)

## Q2 — Resposta correta: **B** · (1.2)

A seleção dinâmica de subagentes feita **uma única vez, no intake**, não é o problema — o problema é tratá-la como definitiva mesmo quando um subagente já em execução revela escopo novo. A correção mantém a eficiência da seleção dinâmica, mas devolve ao coordenador a responsabilidade de inspecionar achados e redespachar antes de fechar o ticket.

- **A — errada:** volta a invocar sempre os três subagentes — abandona o ganho de eficiência (35% de latência) só para não resolver o problema real de inspeção pós-fan-out; não mapeia a um arquétipo §4 — erro mecanístico específico (é ineficiência bruta, não um dos 7 padrões).
- **B — correta.**
- **C — errada:** subagente de billing mensageando o subagente de security diretamente, pulando o coordenador — **camada/alvo errado**: quebra o hub-and-spoke; decidir se o escopo deve crescer é decisão do coordenador, não dos pares.
- **D — errada:** classificador de "urgência" no texto da resposta como gatilho de escalação — **proxy plausível não confiável**: tom/urgência percebida não é sinal confiável de que uma nova área de compliance/segurança foi descoberta.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 4 + integração 0 + cenário 1 + distratores 1
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: decomposição dinâmica quando o escopo muda em runtime (o coordenador redelega, não substitui a seleção inicial por um roteiro fixo)

## Q3 — Resposta correta: **C** · (1.3)

O pilar do 1.3: o **único canal pai→filho é a string do prompt**. Referenciar fontes só por índice (#3, #7, #11) não entrega conteúdo real — apenas um número que só faz sentido para o rastreamento interno do coordenador. Sem o conteúdo, o subagente de síntese não tem o que citar de verdade e inventa. A correção é colocar o conteúdo real das fontes no prompt de spawn.

- **A — errada:** dar `WebFetch` para o subagente "buscar" as fontes a partir dos números de índice — **camada/alvo errado**: índices não são URLs; a ferramenta certa não resolve um problema de conteúdo nunca enviado.
- **B — errada:** `share_context=True` para ver a lista interna do coordenador automaticamente — **feature inexistente porém verossímil**: esse campo não existe; contexto entre coordenador e subagente não é herdado, só passado explicitamente no prompt.
- **C — correta.**
- **D — errada:** rodar a síntese três vezes e manter só o que concorda em ≥2 execuções — **voto/consenso que suprime sinal**: concordância entre execuções não valida a existência real de uma fonte; três alucinações parecidas ainda são alucinações.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: contexto isolado exige conteúdo explícito no prompt, não referências que só o coordenador consegue resolver

## Q4 — Resposta correta: **C** · (1.4)

O requisito é garantia determinística independente do julgamento do modelo sobre "trivialidade" — exatamente o caso de um `PreToolUse` que nega `auto_merge` sempre que o diff toca `db/migrations/`, sem depender de o agente concordar com a regra.

- **A — errada:** reforçar o texto do prompt com mais ênfase — **probabilístico onde precisa ser determinístico**: já falhou 4% das vezes com a regra em negrito; mais texto não fecha a lacuna.
- **B — errada:** classificador de "trivialidade" do diff como gate — **over-engineering**: recria o mesmo julgamento subjetivo que já causou a falha, agora com uma camada de ML por cima.
- **C — correta.**
- **D — errada:** hook `PostToolUse` que reverte o merge depois de ele já ter ocorrido — **camada/alvo errado**: atua depois do fato; não é enforcement, é limpeza reativa — o merge indevido já aconteceu.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 3 = Bloom 2 + integração 0 + cenário 0 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: enforcement programático (hook/gate) > prompt quando o requisito exige garantia determinística

## Q5 — Resposta correta: **A** · (1.5)

A causa raiz não é o mecanismo de normalização em si — é o **escopo do matcher**. Um wildcard amplo (`mcp__billing__.*`) captura qualquer tool futura sob aquele prefixo, incluindo uma que não tem nada a ver com datas. A correção é escopar o matcher exatamente à tool que o hook deve normalizar.

- **A — correta.**
- **B — errada:** mover a lógica para `PreToolUse` — **camada/alvo errado**: o problema não é o estágio do hook (antes/depois da execução), é o alvo (matcher amplo); mudar de estágio não resolve o over-match.
- **C — errada:** classificador que prediz se o texto "parece" ter timestamp — **over-engineering**: adiciona uma camada de ML para compensar um matcher mal escopado, quando bastava corrigir o próprio matcher.
- **D — errada:** desativar o hook e pedir ao modelo que confira manualmente — **probabilístico onde precisa ser determinístico**: abandona a garantia determinística por uma checagem que depende do modelo lembrar de fazê-la.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: causa raiz > sintoma (o matcher mal escopado é a causa; normalização em si estava correta)

## Q6 — Resposta correta: **C** · (1.6) — *quebra do automatismo (parcial)*

A resposta certa é híbrida, e por isso mais difícil: nem manter tudo fixo, nem tornar tudo dinâmico. Os 85% previsíveis continuam bem servidos por um pipeline fixo (prompt chaining); só os 15% abertos, sem termos de busca óbvios, precisam de decomposição dinâmica (explorar primeiro, depois planejar). A correção certa roteia os dois tipos de consulta para estratégias diferentes, em vez de generalizar a mudança para todo o volume.

- **A — errada:** manter tudo fixo e adicionar um classificador de "provável sucesso da busca" para pular etapas — **proxy plausível não confiável**: uma predição de sucesso não é o mesmo que de fato ter dados suficientes; é um substituto arriscado para a exploração real.
- **B — errada:** tornar o pipeline inteiro dinâmico, mesmo para os 85% que já funcionam bem — **over-engineering**: paga o custo de um planner adaptativo em todo o volume para resolver uma falha que afeta só uma fração das consultas.
- **C — correta.**
- **D — errada:** reaproveitar silenciosamente citações de uma consulta anterior não relacionada quando a busca por palavra-chave falha — não mapeia a um arquétipo §4 — erro mecanístico específico (mistura resultados de consultas diferentes; é um erro de dados, não um dos 7 padrões).

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 8 = Bloom 4 + integração 0 + cenário 2 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: casar a estratégia de decomposição à forma real do trabalho (fixo para o previsível, dinâmico só para o subconjunto que de fato exige exploração)

## Q7 — Resposta correta: **B** · (1.7)

Uma vez criado, um fork é uma sessão como qualquer outra: tem seu próprio id e seu próprio histórico. Resumir `fork-A` pelo seu próprio id, sem `fork_session=True`, apenas continua acumulando o histórico *daquele* fork — não cria um novo branch e não tem qualquer efeito sobre a sessão original de onde ele veio.

- **A — errada:** afirma que todo `resume` de uma sessão originada de fork "re-forka" automaticamente — não mapeia a um arquétipo §4 — erro mecanístico específico (crença mecanicista plausível, mas errada, sobre o comportamento de `resume`).
- **B — correta.**
- **C — errada:** afirma que os branches se fundem de volta ao original automaticamente com o tempo — **feature inexistente porém verossímil**: não existe merge automático entre fork e sessão original; os branches permanecem paralelos até ação manual.
- **D — errada:** afirma que é preciso repetir `fork_session=True` em todo resume subsequente para "manter a segurança" — **equívoco de capacidade**: confunde o que a flag faz; `fork_session=True` só é necessário no momento de criar um novo branch, não para continuar um já existente.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 3 + integração 0 + cenário 0 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: fork cria um branch independente com id próprio; resumir esse branch pelo seu id não re-forka nem afeta o original

## Q8 — Resposta correta: **D** · (1.4)

O handoff para um humano que não vê o transcript completo deve trazer campos fixos e extraíveis de imediato — id da transação, valor, tentativas de remediação já feitas, hipótese de causa raiz, ação recomendada — não o transcript bruto nem um substituto heurístico dele.

- **A — errada:** truncar para as últimas 10 mensagens, assumindo que o mais recente é o mais relevante — **proxy plausível não confiável**: recência não garante que os campos necessários (id, valor, histórico de tentativas) estejam nas últimas mensagens.
- **B — errada:** fazer o especialista reprocessar o caso pelo mesmo subagente de billing antes de começar — **camada/alvo errado**: reaciona a automação upstream em vez de corrigir o payload de escalação que o coordenador já deveria montar.
- **C — errada:** classificador de "frustração" para priorizar mensagens — **proxy plausível não confiável**: sentimento não localiza os campos objetivos (id da transação, valor) que o especialista precisa.
- **D — correta.**

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 3 = Bloom 2 + integração 0 + cenário 1 + distratores 0
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: handoff estruturado (campos fixos) > texto livre ou transcript bruto para quem não vê o histórico completo

## Q9 — Resposta correta: **A** · (1.1 + 1.3) — *cruzada*

Cruza o contrato do loop (1.1) com o mecanismo de spawn via `Task` (1.3): o retorno do subagente chegou como uma mensagem de texto solta, não como um `tool_result` casado ao `tool_use_id` da chamada `Task`. Para o modelo, sua própria tool call nunca foi respondida — daí ele reemitir o mesmo spawn a cada turno. A correção devolve o resultado como `tool_result` propriamente casado, e o término volta a ser `stop_reason == "end_turn"`.

- **A — correta.**
- **B — errada:** teto de 1 spawn por tipo de subagente — **camada/alvo errado**: mascara o sintoma limitando a ferramenta, sem corrigir o elo quebrado (`tool_result` que nunca chega casado).
- **C — errada:** regra de prompt para não spawnar o mesmo subagente duas vezes — **probabilístico onde precisa ser determinístico**: depende do modelo lembrar de uma regra textual em vez de corrigir o contrato de retorno da tool.
- **D — errada:** janela de contexto maior — **equívoco de capacidade**: janela maior não resolve um `tool_result` que nunca foi enviado; o modelo não "esquece" algo que nunca recebeu.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 9 = Bloom 4 + integração 1 + cenário 2 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: causa raiz > sintoma — o contrato `tool_result`/`tool_use_id` governa tanto o loop (1.1) quanto o retorno do spawn (1.3)
- **Task statements combinados:** 1.1 (contrato `stop_reason`/término do loop) + 1.3 (mecanismo de retorno de um spawn via `Task`)

## Q10 — Resposta correta: **B** · (1.4 + 1.5) — *cruzada*

Cruza enforcement (1.4) com normalização (1.5): são dois hooks, em dois estágios, para dois requisitos diferentes. O gate de aprovação em `PreToolUse` já funciona e não deve ser tocado; a formatação de moeda é um problema de **resultado**, resolvido por um `PostToolUse` separado com `updatedToolOutput`. Não há razão para fundir as duas responsabilidades num só hook.

- **A — errada:** fundir as duas em um único `PostToolUse` que normaliza e reverte reembolsos indevidos — **camada/alvo errado**: aprovação precisa ocorrer **antes** da execução; fazer isso via `PostToolUse` (depois que o reembolso já rodou) anula a garantia que o gate original entregava.
- **B — correta.**
- **C — errada:** pedir ao modelo, via prompt, para formatar a moeda de forma consistente — **probabilístico onde precisa ser determinístico**: mesmo padrão do 1.5 — normalização de formato pertence a um hook, não à memória do modelo.
- **D — errada:** classificador de formato regional com escalação por confiança — **over-engineering**: uma tarefa de normalização de string ganha uma camada de ML e um caminho de escalação por confiança, quando `PostToolUse` já resolve deterministicamente.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 9 = Bloom 4 + integração 1 + cenário 2 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: casar o mecanismo ao requisito — gate de política em `PreToolUse`, normalização de resultado em `PostToolUse`; não fundir os dois estágios
- **Task statements combinados:** 1.4 (gate de aprovação já correto, não deve mudar) + 1.5 (normalização de saída heterogênea via `PostToolUse`)

## Q11 — Resposta correta: **D** · (1.2 + 1.6) — *cruzada*

Cruza decomposição (1.6) com o papel do coordenador (1.2), mas por um mecanismo **diferente** do da Q2. Aqui nenhum subagente descobre um ângulo novo em campo — os três executam exatamente o que lhes foi designado e voltam com relatórios limpos. O problema é que o **eixo de decomposição escolhido no início** (por fonte de dados) nunca corresponde ao eixo que a pergunta exige (por segmento). Nenhuma inspeção pós-fan-out ou redelegação sobre o mesmo eixo resolve isso, porque não há "lacuna de escopo" a preencher — é o desenho do fan-out que está errado. A correção é o coordenador (1.2) reescolher o eixo de decomposição (1.6) e reemitir o spawn: um subagente por segmento, cada um cobrindo as três fontes para o seu próprio segmento.

- **A — errada:** um quarto subagente relê os três relatórios por fonte depois de prontos e os reclassifica manualmente em buckets SMB/Enterprise — **camada/alvo errado**: tenta remendar o resultado por fora em vez de corrigir o eixo na origem; como os relatórios originais nunca capturaram a distinção por segmento, não há o que reclassificar de verdade.
- **B — errada:** juntar as três fontes no contexto de um único subagente, assumindo que ver tudo de uma vez basta para ele mesmo chegar à comparação por segmento — **equívoco de capacidade**: mais contexto bruto num único subagente não é o mesmo que reformular a decomposição pelo eixo certo; nada garante que a comparação por segmento emerja só por juntar as fontes.
- **C — errada:** o coordenador inspeciona os relatórios por fonte após o fan-out por detalhes de segmento "faltando" e spawna subagentes extras para preencher a lacuna — não mapeia a um arquétipo §4 — erro mecanístico específico: é exatamente o mecanismo correto da Q2 (descoberta de escopo em campo → redelegação), aplicado aqui a um problema que não é de escopo faltante — o eixo em si está errado desde o desenho, e mais subagentes no mesmo eixo por fonte continuam não produzindo uma comparação por segmento.
- **D — correta.**

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 9 = Bloom 4 + integração 1 + cenário 2 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: casar o eixo de decomposição à forma real da pergunta (1.6) — o coordenador (1.2) detém a decisão de reescolher esse eixo, não apenas inspecionar achados pós-fan-out em busca de lacunas
- **Task statements combinados:** 1.2 (coordenador decide e reemite o eixo de decomposição) + 1.6 (eixo de decomposição errado — por fonte — quando a pergunta exige comparação por segmento)

## Q12 — Resposta correta: **B** · (1.3 + 1.7) — *cruzada*

Cruza fork de sessão (1.7) com spawn/contexto isolado de subagentes (1.3). O isolamento de subagentes garante que eles não se vejam **entre si dentro da mesma árvore de spawn** — mas não impede que dois fluxos de trabalho paralelos, se rodados na mesma sessão-raiz, sigam mutando e acumulando o mesmo histórico do coordenador. Forkar a sessão analisada uma vez por ângulo dá a cada fluxo seu próprio branch independente (id próprio, original intacto); dentro de cada fork, o spawn de subagentes via `Task` funciona como sempre, com o isolamento de contexto normal entre eles.

- **A — errada:** spawnar os quatro subagentes a partir da sessão original única, confiando só no isolamento entre subagentes — não mapeia a um arquétipo §4 — erro mecanístico específico: isolamento entre subagentes não isola a **sessão do coordenador** em si; os dois ângulos continuariam acumulando e potencialmente mutando o mesmo histórico-raiz, o que o enunciado proíbe.
- **B — correta.**
- **C — errada:** `share_context=True` para os subagentes acessarem a baseline direto, sem forkar — **feature inexistente porém verossímil**: esse campo não existe no SDK; contexto entre coordenador e subagente é só o que vai explícito no prompt de spawn.
- **D — errada:** chamar `resume` duas vezes no id original, assumindo que cada `resume` cria um branch próprio — **equívoco de capacidade**: `resume` continua a mesma sessão pelo mesmo id; é `fork_session=True` que cria um branch novo, não `resume` isolado.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: `fork_session` isola o branch da conversa; dentro de cada branch, o isolamento de contexto entre subagentes (1.3) continua valendo normalmente
- **Task statements combinados:** 1.3 (spawn e contexto isolado entre subagentes) + 1.7 (`fork_session` para isolar branches paralelos de uma mesma baseline)

---

## Autoavaliação

| Acertos | Leitura |
|---|---|
| 11–12 | Domínio 1 sólido — pode avançar ao Domínio 2. |
| 8–10 | Bom; revise os task statements das questões erradas no resumo. |
| < 8 | Refaça os exercícios dos tópicos com erro antes de avançar (D1 é o maior peso: 27%). |

**Mapa questão → task statement:** Q1=1.1 · Q2=1.2 · Q3=1.3 · Q4=1.4 · Q5=1.5 · Q6=1.6 · Q7=1.7 · Q8=1.4 · Q9=1.1+1.3 · Q10=1.4+1.5 · Q11=1.2+1.6 · Q12=1.3+1.7.

**Cruzadas (mais difíceis):** Q9 (1.1+1.3), Q10 (1.4+1.5), Q11 (1.2+1.6), Q12 (1.3+1.7).
**Quebra do automatismo:** Q6 — nem tudo fixo, nem tudo dinâmico; a resposta certa roteia por tipo de consulta, recusando as duas generalizações extremas oferecidas como distratores.
