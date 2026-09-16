# Gabarito — Bloco 4

**Domínio 4 — Prompt Engineering & Structured Output (peso 20%)**

Fontes: `livro01.pdf`, `livro02.pdf`, objetivos de `livro03.md`.
Itens ✅ *Verificado* foram conferidos na documentação oficial com citação literal.

> **Fatos da Message Batches API verificados** em https://platform.claude.com/docs/en/build-with-claude/batch-processing :
> *"You can access batch results when all messages have completed or after 24 hours, whichever comes first."* ·
> *"A Message Batch is limited to either 100,000 Message requests or 256 MB in size, whichever is reached first."* ·
> *"All usage is charged at 50% of the standard API prices."* ·
> *"most batches finishing in less than 1 hour"*.

---

### Q1 — Resposta: **B**
`TS 4.5` · objetivo #23

- **A) ❌** `max_tokens` não tem relação com o modo de processamento.
- **B) ✅** Nada bloqueia por documento e o prazo é o dia seguinte: é a definição do caso de batch — *"tasks that do not require immediate responses"*.
- **C) ❌** Fallback síncrono por documento anula a economia e a assincronia.
- **D) ❌** Loop síncrono de 50.000 chamadas bloqueia worker e paga preço cheio sem necessidade.

**Palavras-gatilho:** `nothing blocks on` = nada fica bloqueado esperando; `by the next business day` = até o próximo dia útil.

---

### Q2 — Resposta: **C**
`TS 4.6` · objetivo #24 — multi-pass review

- **A) ❌** Ordenar as preocupações não elimina a competição entre elas.
- **B) ❌** Não é falta de contexto: o prompt cabe. É competição por atenção.
- **C) ✅** O objetivo é literal: separar as preocupações em prompts focados com few-shot dedicado, *"preventing recall trade-offs from competing concerns in a single prompt"*.
- **D) ❌** Rodar o mesmo prompt duas vezes reproduz o mesmo trade-off duas vezes.

**Palavras-gatilho:** `recall` = revocação (quantos dos problemas reais ele encontra); `drops` = cai.

---

### Q3 — Resposta: **C**
`TS 4.3` · objetivo #26

- **A) ❌** Temperatura não cria uma opção que o schema não oferece.
- **B) ❌** Instrução no prompt não desfaz uma obrigatoriedade estrutural do schema.
- **C) ✅** O objetivo pede schemas *"with optional fields, nullable values… that allow the model to accurately represent missing or ambiguous information without fabricating values"*. Campo obrigatório onde o dado não existe **força** a invenção.
- **D) ❌** Descartar depois perde o registro e não impede a alucinação.

**Palavras-gatilho:** `invents plausible ones` = inventa números plausíveis.

---

### Q4 — Resposta: **B**
`TS 4.4` · objetivo #28 — truncamento

- **A) ❌** Não há como ultrapassar o limite do modelo.
- **B) ✅** O objetivo diz: dividir em chamadas menores e mesclar as estruturas, *"rather than increasing max_tokens beyond practical limits"*.
- **C) ❌** Pedir concisão sacrifica achados reais para caber no orçamento.
- **D) ❌** Markdown trunca igual — e ainda perde a estrutura.

**Palavras-gatilho:** `cut off mid-object` = cortado no meio do objeto; `beyond practical limits` = além dos limites práticos.

---

### Q5 — Resposta: **D**
`TS 4.2` · Few Shot Prompting

- **A) ❌** Não há tool nem `input_schema` no enunciado — é prompt com exemplos.
- **B) ❌** Prefill força o início da resposta; não é o que está descrito.
- **C) ❌** Não há raciocínio passo a passo nos exemplos.
- **D) ✅** É o exemplo literal do material. Few-shot *"provides consistent results, reduces hallucinations"*, e o material insiste: *"you should provide both good and bad examples"* — `"a handful of salt"` é justamente o caso de borda.

**Palavras-gatilho:** `informal or absent` = informal ou ausente; `anchors` = ancora.

---

### Q6 — Resposta: **B**
`TS 4.3` · objetivo #25

- **A) ❌** Prefill aumenta a chance de JSON, mas não valida o schema.
- **B) ✅** O objetivo classifica os métodos por rigor de conformidade e coloca tool use com JSON Schema no topo: o modelo gera argumentos **para caber no schema declarado**.
- **C) ❌** Retry dos 3% trata o sintoma e ainda gasta o dobro nesses casos.
- **D) ❌** Reparar JSON malformado é conviver com o problema.

**Palavras-gatilho:** `absolute schema compliance` = conformidade absoluta ao schema.

---

### Q7 — Resposta: **B**
`TS 4.1` · objetivo #30

- **A) ❌** Pedir toda vez é o oposto de contexto persistente.
- **B) ✅** O objetivo pede fornecer *"project-specific conventions, accepted patterns, and exclusion criteria as persistent context applied on every review"*. Permanente, não por pedido.
- **C) ❌** Filtro pós-processamento já pagou os tokens e continua escondendo que o critério está errado.
- **D) ❌** Mudar o código para agradar o revisor é o rabo abanando o cachorro.

**Palavras-gatilho:** `permanently` = permanentemente; `accepted patterns` = padrões aceitos.

---

### Q8 — Resposta: **C**
`TS 4.3` · objetivo #29 · Input Schema Tips

- **A) ❌** Normalizar depois exige adivinhar a intenção original de "1/5/24" sem o documento.
- **B) ❌** Rejeitar documentos reais porque o formato é variado é descartar o trabalho.
- **C) ✅** É a regra de normalização do material: *"DATE — convert any format to ISO 8601. Ambiguous dates (01/02/03): prefer YYYY-MM-DD interpretation, set unclear=true."* Regra + exemplos + flag de incerteza.
- **D) ❌** "Consistente" com o quê? Não define alvo.

**Palavras-gatilho:** `worked examples` = exemplos resolvidos; `ambiguous` = ambíguas.

---

### Q9 — Resposta: **D**
`TS 4.1` · objetivo #31 · False Positives when Vague Prompting

- **A) ❌** Tamanho não é a variável: o mesmo código com prompt explícito devolve só o achado real.
- **B) ❌** É capaz — o exemplo do material mostra que com critério explícito ele acerta.
- **C) ❌** Ordenar por confiança não remove os falsos positivos, só os empurra para baixo.
- **D) ✅** *"Vague prompts → over-flagging + wasted time. Model guesses patterns instead of rules. Define exact criteria for detection."*

**Palavras-gatilho:** `guesses patterns instead of applying a rule` = adivinha padrões em vez de aplicar uma regra.

---

### Q10 — Resposta: **B**
`TS 4.3` · objetivo #26 · Input Schema Tips

- **A) ❌** Remover o enum perde o fechamento do conjunto e a padronização.
- **B) ✅** *"For enums provide an ambiguous option."* Sem opção verdadeira, o modelo é obrigado a mentir com precisão.
- **C) ❌** Segunda tool para casos incertos é over-engineering de uma entrada de enum.
- **D) ❌** Obrigatório sem default agrava: força a escolha errada.

**Palavras-gatilho:** `rather than picking the closest` = em vez de escolher o mais próximo.

---

### Q11 — Resposta: **C**
`TS 4.3 / 2.3` · `tool_choice`

- **A) ❌** `auto` pode chamar tool.
- **B) ❌** `max_tokens` não controla uso de tool.
- **C) ✅** `none` = *"Cannot use any tools."* Garante texto puro para o consumidor a jusante.
- **D) ❌** `any` obriga a chamar tool — o oposto.

**Palavras-gatilho:** `never triggers` = nunca dispara.

---

### Q12 — Resposta: **C**
`TS 4.5` · objetivo #23
✅ *Verificado:* 50% do preço padrão · janela de 24h · maioria em menos de 1h.

- **A) ❌** Não há garantia de cinco minutos; a janela é de 24 horas.
- **B) ❌** O preço é 50% do padrão, não igual.
- **C) ✅** Todos os três fatos conferem com a doc oficial.
- **D) ❌** Não é gratuito para request nenhum.

**Palavras-gatilho:** `primary constraint` = restrição principal.

---

### Q13 — Resposta: **C**
`TS 4.1` · objetivo #31

- **A) ❌** "Só o que tiver certeza" delega o critério à confiança auto-reportada — sinal não confiável.
- **B) ❌** Ranquear mantém o ruído, só reordena.
- **C) ✅** O objetivo pede *"explicit inclusion and exclusion boundaries, preventing the model from generating findings in categories where performance is unreliable"*.
- **D) ❌** "Menos achados" pode cortar o bug real junto.

**Palavras-gatilho:** `out of scope` = fora do escopo; `equal prominence` = mesmo destaque.

---

### Q14 — Resposta: **A**
`TS 4.4` · Input Schema Tips (Validation Layer)

- **A) ✅** *"Schema ≠ full validation. Use tools like Pydantic / Instructor. Validate: input to model, output from model."*
- **B) ❌** A entrada gerada pelo modelo também precisa de validação.
- **C) ❌** Validar só a jusante descobre o erro depois de propagado.
- **D) ❌** O material afirma explicitamente o contrário.

**Palavras-gatilho:** `both directions` = nas duas direções.

---

### Q15 — Resposta: **A**
`TS 4.3 / 4.2` · objetivo #29

- **A) ✅** O objetivo nomeia exatamente esse trio: *"structured schemas with optional fields, format normalization instructions, and few-shot examples — to reduce hallucination and improve consistency across varied document formats."*
- **B) ❌** Regras de pós-processamento por vendor é manutenção infinita — e não ajuda no décimo terceiro vendor.
- **C) ❌** Modelo maior com prompt vago mantém a inconsistência.
- **D) ❌** Doze prompts manuais não escalam e divergem com o tempo.

**Palavras-gatilho:** `varied document formats` = formatos variados de documento.

---

### Q16 — Resposta: **B**
`TS 4.2 / 4.1` · objetivo #24

- **A) ❌** JSON Schema não exige exemplos.
- **B) ✅** *"You should provide both good and bad examples."* Os exemplos negativos são o que ensina a **não** disparar — é a alavanca direta sobre falso positivo.
- **C) ❌** O efeito é o oposto: reduzem achados espúrios.
- **D) ❌** Adicionam tokens; a justificativa é qualidade, não custo.

**Palavras-gatilho:** `must not be flagged` = não devem ser sinalizados.

---

### Q17 — Resposta: **C**
`TS 4.3 / 5.6` · objetivo #26

- **A) ❌** Campo de notas livre não é consumível por sistema a jusante.
- **B) ❌** Confiança por documento inteiro não localiza **qual** campo é ambíguo.
- **C) ✅** O material usa exatamente esse padrão (`unclear=true`) para datas ambíguas: um campo dedicado em que o modelo declara a ambiguidade, em vez de escolher em silêncio.
- **D) ❌** Ausência do campo é ambígua: não distingue "ambíguo" de "não presente no documento".

**Palavras-gatilho:** `rather than silently choosing` = em vez de escolher silenciosamente.

---

### Q18 — Resposta: **D**
`TS 4.5` · objetivo #23

- **A) ❌** Os envelopes de latência são completamente diferentes.
- **B) ❌** "Menos de uma hora" ainda é eternidade num chat.
- **C) ❌** Mais barato não compensa deixar o usuário esperando até 24h.
- **D) ✅** O critério do objetivo é *"latency requirements, workflow blocking behavior"*. Chat com usuário esperando bloqueia — é síncrono por definição.

**Palavras-gatilho:** `customer-facing` = voltada ao cliente; `the user is waiting` = o usuário está esperando.

---

### Q19 — Resposta: **C**
`TS 4.6` · objetivo #24

- **A) ❌** O ponto é justamente ter exemplos **dedicados** por passada.
- **B) ❌** Nada garante zero falso positivo; isso vem de critério explícito, e ainda assim é redução, não eliminação.
- **C) ✅** O benefício nomeado no objetivo é evitar o trade-off de recall entre preocupações concorrentes.
- **D) ❌** Três passadas custam mais, não menos. O ganho é qualidade.

**Palavras-gatilho:** `primary benefit` = benefício principal.

---

### Q20 — Resposta: **C**
`TS 4.1` · objetivo #31

- **A) ❌** Não menciona retry.
- **B) ❌** Não há exemplo de entrada/saída na cláusula.
- **C) ✅** *"Tell the model what not to change."* Delimitar o que fica intocado é tão vinculante quanto dizer o que mudar — e é o que evita a mudança colateral.
- **D) ❌** Não trata de formato de saída.

**Palavras-gatilho:** `bounds the scope` = delimita o escopo.

---

### Q21 — Resposta: **D**
`TS 4.3` · objetivo #26

- **A) ❌** String vazia num campo de unidade é dado sujo: não distingue "vazio" de "ausente".
- **B) ❌** O documento está bem formado; quem tinha de acomodar a variação era o schema.
- **C) ❌** Não houve falha: "flour, sifted" realmente não tem medida.
- **D) ✅** Representar ausência com precisão **é** o comportamento desejado. O schema permite null e o prompt definiu quando usá-lo — o modelo acertou.

**Palavras-gatilho:** `rather than a failure` = em vez de uma falha.

---

### Q22 — Resposta: **B**
`TS 4.3` · objetivo #29 · Input Schema Tips

- **A) ❌** Regex em JSON Schema **valida**, não reformata.
- **B) ✅** É o bloco `PHONE` do material: *"Strip all non-digit characters, then apply E.164"* com as transformações exemplificadas (`"555-123-4567" → "+15551234567"`).
- **C) ❌** "Bem formatado" não diz qual padrão.
- **D) ❌** Trigger de banco normaliza tarde e esconde o erro do pipeline.

**Palavras-gatilho:** `whatever format the source used` = qualquer formato que a fonte usou.

---

### Q23 — Resposta: **A**
`TS 4.5` · objetivo #23
✅ *Verificado:* *"A Message Batch is limited to either 100,000 Message requests or 256 MB in size, whichever is reached first."*

- **A) ✅** Os dois limites, o que for atingido primeiro.
- **B) ❌** 10 MB não é o limite; são 256 MB.
- **C) ❌** Existe limite de requests.
- **D) ❌** Número errado e "sem limite de tamanho" é falso.

**Palavras-gatilho:** `whichever is reached first` = o que for atingido primeiro.

---

### Q24 — Resposta: **B**
`TS 4.3` · objetivo #25

- **A) ❌** Pedir para omitir é enforcement por prompt: falha de vez em quando, que é exatamente o sintoma.
- **B) ✅** Estrutural = a saída chega como argumentos tipados, não como prosa que alguém tenta interpretar. Preâmbulo deixa de ser possível.
- **C) ❌** Cortar até o primeiro `|` é remendo frágil sobre o mesmo desenho.
- **D) ❌** Truncamento não é o problema aqui.

**Palavras-gatilho:** `structural rather than cosmetic` = estrutural em vez de cosmético.

---

### Q25 — Resposta: **C**
`TS 4.4` · objetivo #28

- **A) ❌** Elevar o limite não escala — o próximo PR maior trunca de novo.
- **B) ❌** Contexto cruzado entre arquivos não compensa perder a saída por truncamento.
- **C) ✅** Escopo menor + merge é a recomendação do objetivo; truncamento não é degradação suave, é corrupção da estrutura.
- **D) ❌** Markdown também trunca; só falha de forma menos visível.

**Palavras-gatilho:** `does not scale` = não escala; `corrupts` = corrompe.

---

### Q26 — Resposta: **D**
`TS 4.3 / 3.6`

- **A) ❌** "Detalhado e bem estruturado" não define campo nenhum.
- **B) ❌** Um achado por linha não carrega os cinco campos de forma não ambígua.
- **C) ❌** Markdown com cabeçalhos consistentes depende de o modelo ser consistente — a suposição que falha.
- **D) ✅** Campos exatos + valores permitidos + mecanismo restrito por schema. É o desenho que torna a saída consumível por máquina.

**Palavras-gatilho:** `a script can act on` = sobre o qual um script consegue agir.

---

### Q27 — Resposta: **A**
`TS 4.2` · Few Shot Prompting

- **A) ✅** *"Include edge cases (good + bad)."* Sem âncora para o caso difícil, o comportamento no caso difícil é livre.
- **B) ❌** Temperatura mais alta aumenta a variação — o oposto do desejado.
- **C) ❌** System prompt maior não substitui exemplo do caso de borda.
- **D) ❌** Mais exemplos do mesmo tipo reforça o que já funciona.

**Palavras-gatilho:** `erratic` = errático.

---

### Q28 — Resposta: **A**
`TS 4.3` · objetivo #25

- **A) ✅** A diferença é de mecanismo: com tool use o modelo preenche um schema declarado; com prompt ele formata prosa e torce.
- **B) ❌** Não são equivalentes — é justamente o que o objetivo pede para distinguir.
- **C) ❌** Derrotismo: tool use com schema é confiável o bastante para pipelines tipados.
- **D) ❌** Inverte a ordem de confiabilidade.

**Palavras-gatilho:** `more strictly` = de forma mais estrita.

---

### Q29 — Resposta: **D**
`TS 4.3` · objetivo #26

- **A) ❌** Opcional não resolve: o caso existe e precisa de valor.
- **B) ❌** Texto livre destrói a padronização que o enum existe para dar.
- **C) ❌** Inferir severidade de sentimento é o distrator de sinal não confiável.
- **D) ✅** Um enum que não cobre a realidade força resposta imprecisa — "outage total" vira "high" e perde a distinção que importava.

**Palavras-gatilho:** `real distribution of values` = distribuição real dos valores.

---

### Q30 — Resposta: **A**
`TS 5.1` · Progressive Summarization

- **A) ✅** *"Numerical and price data can get summarized out (dates, percentages, numbers). Solution: extract key data, and directly place back into next prompt."*
- **B) ❌** Inverter a ordem não muda a natureza da sumarização progressiva.
- **C) ❌** Menos etapas reduz a perda, mas não a elimina — e o material dá uma solução direta.
- **D) ❌** "Preserve todos os números" é instrução; a degradação é do processo de condensação.

**Palavras-gatilho:** `successive` = sucessivas; `re-inject` = reinjetar.

---

### Q31 — Resposta: **C**
`TS 4.1` · objetivo #31

- **A) ❌** Não há política de retry nem validação.
- **B) ❌** Não há limiar de confiança nem ranking.
- **C) ✅** "Sinalize apenas quando…" é o critério de inclusão; "Não sinalize ORM nem prepared statements" é o de exclusão. É o exemplo literal do material.
- **D) ❌** Não há exemplo entrada/saída nem schema.

**Palavras-gatilho:** `only when` = apenas quando; `Do not flag` = não sinalize.

---

### Q32 — Resposta: **B**
`TS 4.1 / 3.3` · objetivo #30

- **A) ❌** Inferir convenção do código é adivinhação — e o código é justamente o que está sob suspeita.
- **B) ✅** Separa o que é universal (o critério de detecção) do que é local (convenções e padrões aceitos daquele repositório, como contexto persistente próprio).
- **C) ❌** 40 prompts manuais divergem e ninguém mantém.
- **D) ❌** Aceitar a variação é aceitar o falso positivo.

**Palavras-gatilho:** `consistently across` = de forma consistente em.

---

### Q33 — Resposta: **B**
`TS 4.5` · objetivo #23

- **A) ❌** Paralelizar o loop síncrono continua pagando preço cheio e ocupando workers.
- **B) ✅** Nenhuma resposta por documento é necessária de imediato → batch. Corrige o bloqueio e o custo de uma vez.
- **C) ❌** Modelo menor no mesmo loop mantém o desenho errado.
- **D) ❌** Prompt menor não muda o modo de processamento.

**Palavras-gatilho:** `blocking a worker` = bloqueando um worker.

---

### Q34 — Resposta: **D**
`TS 4.3` · objetivo #26

- **A) ❌** Estimar é fabricar — exatamente o que o objetivo pede para evitar.
- **B) ❌** String num campo numérico quebra o schema e o consumidor tipado.
- **C) ❌** `0` é um valor numérico falso que vai contaminar somas e relatórios.
- **D) ✅** Null representa a ausência com precisão; o flag/status diz **por quê**, distinguindo "a determinar" de "não mencionado".

**Palavras-gatilho:** `to be determined` = a ser determinado.

---

### Q35 — Resposta: **D**
`TS 4.4`

- **A) ❌** `max_tokens` não tem relação.
- **B) ❌** JSON Schema não expressa "o total bate com a soma das linhas".
- **C) ❌** Tool forçada garante a chamada e a forma, não a semântica.
- **D) ✅** *"Schema ≠ full validation."* Conformidade de forma não é correção de conteúdo; regra de negócio é camada de aplicação.

**Palavras-gatilho:** `valid against the schema but semantically wrong` = válido contra o schema mas semanticamente errado.

---

### Q36 — Resposta: **D**
`TS 3.5 / 4.1` · objetivo #12

- **A) ❌** Oito requisições separadas arriscam que a correção de uma quebre outra.
- **B) ❌** "O que você melhoraria?" devolve o critério ao modelo — que já errou uma vez.
- **C) ❌** Reescrita sem listar os problemas repete os mesmos erros.
- **D) ✅** Descrição consolidada dos oito problemas, específica o bastante para uma revisão única e coerente.

**Palavras-gatilho:** `in one pass` = numa única passada.

---

### Q37 — Resposta: **C**
`TS 4.1 / 4.2`

- **A) ❌** Temperatura alta aumenta justamente a variação reclamada.
- **B) ❌** Comprimento não é a variável.
- **C) ✅** "Tom profissional" é julgamento subjetivo; critério concreto + exemplo aceitável é o par que estabiliza a saída.
- **D) ❌** Repetir a mesma instrução vaga duas vezes não a torna precisa.

**Palavras-gatilho:** `varies widely between runs` = varia muito entre execuções.

---

### Q38 — Resposta: **A**
`TS 5.5` · objetivo #22 — roteamento para revisão humana

- **A) ✅** O objetivo pede roteamento por *"confidence scores, document characteristics, and field-level ambiguity"* — a confiança é **um** sinal, não o critério. Sozinha, é auto-relato: sinal fraco.
- **B) ❌** Tratar confiança como sempre exata e critério único é o distrator clássico.
- **C) ❌** Não há proibição de campos de confiança em JSON Schema.
- **D) ❌** Latência não mede qualidade da extração.

**Palavras-gatilho:** `on its own` = por si só; `sole` = único.

---

### Q39 — Resposta: **D**
`TS 4.3` · objetivo #27

- **A) ❌** Sem tool, só prompt, é o método menos confiável.
- **B) ❌** `none` proíbe tools — impossibilita a extração.
- **C) ❌** `auto` permite responder em texto.
- **D) ✅** Schema define a forma; `tool_choice` forçando aquela tool garante que a chamada aconteça e que não venha resposta conversacional.

**Palavras-gatilho:** `always` / `never` = sempre / nunca (⚠️ requisito de garantia).

---

### Q40 — Resposta: **C**
`TS 4.6 / 4.2` · objetivo #24

- **A) ❌** A API não exige conjunto de exemplos por tool.
- **B) ❌** Conjuntos separados aumentam o total de tokens.
- **C) ✅** Exemplos ancoram o modelo na preocupação em questão; misturar exemplos de domínios diferentes dilui a âncora e reintroduz a competição entre preocupações.
- **D) ❌** Não há questão de licenciamento.

**Palavras-gatilho:** `dilutes` = dilui.

---

### Q41 — Resposta: **A**
`TS 4.2 / 4.3` · objetivo #29

- **A) ✅** O objetivo trata exatamente de consistência *"across varied document formats"*: exemplos dos layouts difíceis + instruções de normalização das suas peculiaridades.
- **B) ❌** Rejeitar os documentos difíceis é desistir do escopo.
- **C) ❌** `max_tokens` não melhora leitura de formulário escaneado.
- **D) ❌** Mandar todos para humano sem triagem joga fora a automação — e o objetivo #22 pede roteamento **por característica**, não em bloco.

**Palavras-gatilho:** `varies by document layout` = varia conforme o layout do documento.

---

### Q42 — Resposta: **D**
`TS 4.1` · objetivo #31

- **A) ❌** Truncamento é outro problema (objetivo #28).
- **B) ❌** Violação de schema é tratada por tool use e validação.
- **C) ❌** Rate limiting é out-of-scope da prova.
- **D) ✅** O objetivo é literal: fronteiras explícitas *"preventing the model from generating findings or extractions in categories where performance is unreliable"*.

**Palavras-gatilho:** `Never report` = nunca reporte.

---

### Q43 — Resposta: **A**
`TS 4.5` · objetivo #23
✅ *Verificado:* *"You can access batch results when all messages have completed or after 24 hours, whichever comes first."*

- **A) ✅** Resultados por requisição são recuperáveis, e o acesso se dá quando tudo completa ou ao fim da janela.
- **B) ❌** Não é preciso reenviar o batch inteiro por causa de uma falha.
- **C) ❌** Requisições com falha não somem silenciosamente.
- **D) ❌** Os resultados são individuais, não agregados.

**Palavras-gatilho:** `outcome of every single request` = o resultado de cada requisição.

---

### Q44 — Resposta: **B**
`TS 4.4` · objetivo #28

- **A) ❌** Recusa de JSON não é risco do merge.
- **B) ✅** O objetivo fala em *"merging resulting data structures"*: o merge precisa lidar com colisões, duplicatas e preservar a proveniência (de qual arquivo veio cada achado).
- **C) ❌** `tool_choice` é por requisição; não se "perde" entre chamadas.
- **D) ❌** Enum é restrição por chamada, não do merge.

**Palavras-gatilho:** `must handle` = precisa tratar.

---

### Q45 — Resposta: **C**
`TS 4.3` · objetivo #25

- **A) ❌** Mais exemplos reduz a frequência; não fecha a porta.
- **B) ❌** Apagar no parsing esconde que o modelo está fora do contrato.
- **C) ✅** Schema estrito na tool é o mecanismo; campo fora do schema deixa de ser uma saída natural para o modelo.
- **D) ❌** Enforcement por prompt: funciona quase sempre, que é o problema.

**Palavras-gatilho:** `keeps adding` = insiste em adicionar.

---

### Q46 — Resposta: **A**
`TS 4.2`

- **A) ✅** O material sugere ir além do par entrada/saída (*"you can score your examples"*): a justificativa explicita o critério, tornando a fronteira de decisão transferível para casos novos.
- **B) ❌** Justificativa não é exigência do formato few-shot.
- **C) ❌** Chain-of-thought é raciocínio do modelo na resposta, não anotação nos exemplos.
- **D) ❌** Nenhum número de exemplos cai a zero por causa disso.

**Palavras-gatilho:** `decision boundary` = fronteira de decisão; `unseen inputs` = entradas não vistas.

---

### Q47 — Resposta: **D**
`TS 5.1` · Lost in the Middle

- **A) ❌** Não é incapacidade; é distribuição de atenção em contexto longo.
- **B) ❌** O tamanho do diff não é a variável — o guia é que é grande demais.
- **C) ❌** Formato JSON não corrige o efeito de meio.
- **D) ✅** *"If you give a model lots of data… it tends to use the first few and last pages and ignore the middle content. Solution: check and process in sections."*

**Palavras-gatilho:** `ignore the middle` = ignora o meio; `targeted passes` = passadas dirigidas.

---

### Q48 — Resposta: **D**
`TS 4.1` · objetivo #31

- **A) ❌** Limiar de confiança usa sinal fraco e afeta todas as categorias.
- **B) ❌** Hook bloqueia execução de tool; não molda o conteúdo da revisão.
- **C) ❌** Filtro por palavra derruba também o achado de performance legítimo, se houver.
- **D) ✅** Categoria nomeada como fora de escopo no prompt — critério de exclusão explícito, que é o mecanismo previsto.

**Palavras-gatilho:** `speculative` = especulativas.

---

### Q49 — Resposta: **D**
`TS 4.3` · objetivo #26

- **A) ❌** String num campo tipado como data quebra o consumidor.
- **B) ❌** Data atual como default é um valor inventado que parece legítimo — o pior tipo de erro.
- **C) ❌** Omitir o registro inteiro descarta todos os outros campos que foram extraídos com sucesso.
- **D) ✅** Campo de data nullable com null explícito: o consumidor distingue "não especificado" de qualquer data real.

**Palavras-gatilho:** `did not specify` = não especificou.

---

### Q50 — Resposta: **A**
`TS 4.1` · objetivo #31

- **A) ✅** "Bom" é julgamento; "três bullets, menos de 20 palavras, cobrindo decisão/responsável/prazo, sem contexto de fundo" é verificável item a item — inclusive o que **não** incluir.
- **B) ❌** Comprimento não é a causa.
- **C) ❌** Não há mudança de temperatura no enunciado.
- **D) ❌** Não é o formato de bullet que melhora; é o critério.

**Palavras-gatilho:** `checkable` = verificáveis.

---

### Q51 — Resposta: **B**
`TS 4.4` · objetivos #27 e #26

- **A) ❌** A chamada não falhou; os argumentos violaram uma regra de negócio.
- **B) ✅** Forçar a tool garante **que** ela seja chamada e **a forma** dos argumentos. Regra cruzada entre campos é semântica — camada de validação e retry continua necessária.
- **C) ❌** `tool_choice` não expressa regra entre campos.
- **D) ❌** Premissa falsa: tool forçada não implica argumentos corretos.

**Palavras-gatilho:** `cross-field rule` = regra entre campos.

---

### Q52 — Resposta: **A**
`TS 4.4` · objetivo #28

- **A) ✅** O merge é a parte frágil da estratégia de dividir: chaves compartilhadas, ordenação e o caso de uma das chamadas voltar vazia precisam de regra definida.
- **B) ❌** Temperatura não determina como as estruturas se combinam.
- **C) ❌** Estar no mesmo batch não é relevante para a coerência do registro.
- **D) ❌** `max_tokens` igual não é requisito de montagem.

**Palavras-gatilho:** `assembled into one record` = montadas num único registro.

---

### Q53 — Resposta: **A**
`TS 4.3 / 4.2` · objetivo #29

- **A) ✅** É o bloco `COUNTRY` da mesma família de regras de normalização: declarar a representação alvo e mapear as variantes observadas com exemplos.
- **B) ❌** Deduplicar depois exige adivinhar o mapeamento fora do contexto do documento.
- **C) ❌** Empurrar a normalização para os consumidores multiplica o trabalho por consumidor.
- **D) ❌** "O país" não define representação.

**Palavras-gatilho:** `variant` = variante.

---

### Q54 — Resposta: **A**
`TS 4.6` · objetivo #24

- **A) ✅** Duas causas somadas: competição por atenção entre as preocupações e diluição dos exemplos, que servem a uma delas e atrapalham as outras.
- **B) ❌** Falso: a API não processa "só a primeira instrução".
- **C) ❌** O enunciado não indica estouro de contexto.
- **D) ❌** Um schema pode representar várias preocupações — não é a limitação.

**Palavras-gatilho:** `even though` = ainda que; `clearly` = claramente.

---

### Q55 — Resposta: **C**
`TS 5.5 / 5.6` · objetivo #22

- **A) ❌** Layout fora do template conhecido é característica do documento — o objetivo cita isso explicitamente.
- **B) ❌** Falha em regra de validação cruzada é o sinal mais duro que existe.
- **C) ✅** Confiança auto-reportada é o sinal mais fraco da lista — é o modelo avaliando a si mesmo. As outras três são fatos verificáveis sobre a extração e o documento.
- **D) ❌** Campo obrigatório que voltou null é fato objetivo e forte.

**Palavras-gatilho:** `weakest on its own` = o mais fraco isoladamente.

---

### Q56 — Resposta: **B**
`TS 4.3` · JSON Schema

- **A) ❌** `type: string` aceita qualquer string.
- **B) ✅** *"enum → allowed values"* e *"enum → reduces ambiguity"*. É o elemento que fecha o conjunto.
- **C) ❌** `required` obriga a presença, não restringe o valor.
- **D) ❌** Descrição orienta, mas não restringe formalmente.

**Palavras-gatilho:** `closed set` = conjunto fechado; `never invent` = nunca inventar.

---

### Q57 — Resposta: **B**
`TS 4.4`

- **A) ❌** Lote maior não dilui erro: gera mais linhas ruins.
- **B) ✅** Validar contra as regras de negócio **antes** da escrita, com caminho de revisão ou retry para as falhas. Descobrir no insert é tarde e opaco.
- **C) ❌** Afrouxar constraint é aceitar dado ruim no banco.
- **D) ❌** Inserir uma a uma isola a falha mas não a previne nem a trata.

**Palavras-gatilho:** `only at insert time` = só no momento da inserção.

---

### Q58 — Resposta: **B**
`TS 4.2 / 4.6` · objetivos #24 e #30

- **A) ❌** Exemplos aumentam o custo de tokens; a justificativa é precisão.
- **B) ✅** Exemplos do que **parece** problema mas não é são a alavanca direta sobre falso positivo — ancoram os dois lados da fronteira.
- **C) ❌** Schema de tool não exige exemplos.
- **D) ❌** O objetivo é reduzir achados espúrios, não aumentar a contagem.

**Palavras-gatilho:** `looks suspicious but is correct` = parece suspeito mas está correto.

---

### Q59 — Resposta: **A**
`TS 4.3`

- **A) ✅** Container estruturado com array vazio torna "nada encontrado" um resultado explícito e consumível, distinto de "não houve resposta".
- **B) ❌** Achado fantasma com severidade "none" polui a tabela e exige filtro especial em toda consulta.
- **C) ❌** Ausência de tool call é indistinguível de falha para o consumidor.
- **D) ❌** Prosa quebra o contrato estruturado.

**Palavras-gatilho:** `a valid outcome` = um resultado válido.

---

### Q60 — Resposta: **D**
`TS 4.5` · objetivo #23

- **A) ❌** Garantia ao minuto não é o requisito; o requisito é caber na janela.
- **B) ❌** Ter prazo não implica precisar de resposta síncrona — implica ter janela.
- **C) ❌** Os custos **não** são iguais: batch custa metade.
- **D) ✅** O critério é bloqueio e janela aceitável: ninguém espera resposta individual, e a janela de processamento cabe entre meia-noite e 8h.

**Palavras-gatilho:** `comfortably precedes` = precede com folga.

---

## Autoavaliação

| Acertos | Leitura |
|---|---|
| 54–60 (90%+) | Domínio sólido. |
| 43–53 (72–89%) | Faixa de aprovação. Disseque cada erro. |
| 30–42 (50–71%) | Releia critérios explícitos (4.1), schema com nullable/enum (4.3) e truncamento (4.4). |
| < 30 | Refaça a teoria antes de nova rodada. |

**Os quatro reflexos deste domínio:**
1. **Prompt vago → falso positivo.** Critério explícito tem inclusão **e** exclusão.
2. **Campo obrigatório onde o dado não existe → alucinação.** Nullable/optional e enum com opção de escape.
3. **Truncamento → dividir e mesclar**, nunca "aumentar `max_tokens`".
4. **Uma passada com várias preocupações → perda de recall.** Passadas especializadas com exemplos próprios.
