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

## Q1 — Resposta correta: **B**

Quando nenhum resultado por documento precisa ser imediato e o prazo aceitável é o próximo dia útil, o desenho certo é processamento em batch — nada fica bloqueado esperando, e é exatamente a definição do caso de uso de batch.

- **A — errada:** `max_tokens` não tem relação com o modo de processamento.
- **B — correta.**
- **C — errada:** Fallback síncrono por documento anula a economia e a assincronia.
- **D — errada:** Loop síncrono de 50.000 chamadas bloqueia worker e paga preço cheio sem necessidade.

**Tópicos:** Batch Processing

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: batch se aplica quando nada bloqueia esperando resposta imediata e o prazo é folgado
- Arquétipos: A=camada-alvo-errado, C=extremo-vs-meio, D=over-engineering

---

## Q2 — Resposta correta: **C**

Revisar várias preocupações diferentes num único prompt faz elas competirem por atenção; separar em prompts focados, cada um com seu próprio few-shot, evita essa perda de recall entre preocupações concorrentes.

- **A — errada:** Ordenar as preocupações não elimina a competição entre elas.
- **B — errada:** Não é falta de contexto: o prompt cabe. É competição por atenção.
- **C — correta.**
- **D — errada:** Rodar o mesmo prompt duas vezes reproduz o mesmo trade-off duas vezes.

**Tópicos:** Revisão Multi-Instância, Few-Shot

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Médio
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: separar preocupações em prompts dedicados com few-shot próprio evita competição por atenção e perda de recall
- Arquétipos: A=extremo-vs-meio, B=camada-alvo-errado, D=enumerar-vs-generalizar

---

## Q3 — Resposta correta: **C**

Um schema com campos opcionais e valores nulos deixa o modelo representar informação ausente ou ambígua com precisão — um campo obrigatório onde o dado não existe força a invenção de um valor plausível.

- **A — errada:** Temperatura não cria uma opção que o schema não oferece.
- **B — errada:** Instrução no prompt não desfaz uma obrigatoriedade estrutural do schema.
- **C — correta.**
- **D — errada:** Descartar depois perde o registro e não impede a alucinação.

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: campos opcionais/nullable no schema evitam que o modelo invente valor para representar dado ausente
- Arquétipos: A=camada-alvo-errado, B=probabilistico-vs-garantia, D=montante-jusante

---

## Q4 — Resposta correta: **B**

Quando a saída estruturada é cortada no meio por causa do tamanho, a correção é dividir em chamadas menores e mesclar as estruturas resultantes — aumentar `max_tokens` além do limite prático não é opção, e pedir concisão sacrifica achados reais.

- **A — errada:** Não há como ultrapassar o limite do modelo.
- **B — correta.**
- **C — errada:** Pedir concisão sacrifica achados reais para caber no orçamento.
- **D — errada:** Markdown trunca igual — e ainda perde a estrutura.

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: truncamento de saída estruturada se resolve dividindo e mesclando, não aumentando `max_tokens`
- Arquétipos: A=feature-inexistente-verossimil, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q5 — Resposta correta: **D**

Exemplos few-shot devem incluir tanto casos bons quanto ruins, inclusive casos de borda (como "um punhado de sal") — isso ancora o modelo em resultados consistentes e reduz alucinação em situações informais ou ambíguas.

- **A — errada:** Não há tool nem `input_schema` no enunciado — é prompt com exemplos.
- **B — errada:** Prefill força o início da resposta; não é o que está descrito.
- **C — errada:** Não há raciocínio passo a passo nos exemplos.
- **D — correta.**

**Tópicos:** Few-Shot

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: few-shot precisa de exemplos bons E ruins, incluindo casos de borda, para ancorar comportamento consistente
- Arquétipos: A=feature-inexistente-verossimil, B=camada-alvo-errado, C=camada-alvo-errado

---

## Q6 — Resposta correta: **B**

Entre os métodos de garantir conformidade estrutural, tool use com um JSON Schema fica no topo do rigor — o modelo gera os argumentos para caber no schema declarado; prefill, retry dos casos que falham ou reparo de JSON malformado são remendos que convivem com o problema.

- **A — errada:** Prefill aumenta a chance de JSON, mas não valida o schema.
- **B — correta.**
- **C — errada:** Retry dos 3% trata o sintoma e ainda gasta o dobro nesses casos.
- **D — errada:** Reparar JSON malformado é conviver com o problema.

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: tool use + JSON Schema é o método de maior rigor de conformidade estrutural, entre os citados
- Arquétipos: A=probabilistico-vs-garantia, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q7 — Resposta correta: **B**

Convenções específicas do projeto, padrões aceitos e critérios de exclusão devem ser fornecidos como contexto persistente, aplicado em toda revisão — não repetidos a cada pedido nem corrigidos só depois, no pós-processamento.

- **A — errada:** Pedir toda vez é o oposto de contexto persistente.
- **B — correta.**
- **C — errada:** Filtro pós-processamento já pagou os tokens e continua escondendo que o critério está errado.
- **D — errada:** Mudar o código para agradar o revisor é o rabo abanando o cachorro.

**Tópicos:** Critérios Explícitos

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: convenções e critérios de exclusão como contexto persistente aplicado em toda revisão, não por pedido pontual
- Arquétipos: A=camada-alvo-errado, C=montante-jusante, D=camada-alvo-errado

---

## Q8 — Resposta correta: **C**

Para datas em formatos variados e às vezes ambíguos (como "1/5/24"), a regra é converter para ISO 8601, preferir a interpretação ano-mês-dia quando ambíguo, e marcar um flag de incerteza — regra, exemplos resolvidos e sinalização de dúvida juntos.

- **A — errada:** Normalizar depois exige adivinhar a intenção original de "1/5/24" sem o documento.
- **B — errada:** Rejeitar documentos reais porque o formato é variado é descartar o trabalho.
- **C — correta.**
- **D — errada:** "Consistente" com o quê? Não define alvo.

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: normalização de data usa regra + exemplos + flag de ambiguidade, não recusa nem "consistência" vaga
- Arquétipos: A=montante-jusante, B=extremo-vs-meio, D=vazio-ausente

---

## Q9 — Resposta correta: **D**

Um prompt vago faz o modelo adivinhar um padrão em vez de aplicar uma regra explícita, produzindo excesso de sinalização e tempo desperdiçado — o mesmo código com critério explícito devolve só o achado real.

- **A — errada:** Tamanho não é a variável: o mesmo código com prompt explícito devolve só o achado real.
- **B — errada:** É capaz — o exemplo do material mostra que com critério explícito ele acerta.
- **C — errada:** Ordenar por confiança não remove os falsos positivos, só os empurra para baixo.
- **D — correta.**

**Tópicos:** Critérios Explícitos

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: prompt vago leva o modelo a adivinhar padrão em vez de aplicar regra, gerando falsos positivos
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=extremo-vs-meio

---

## Q10 — Resposta correta: **B**

Um enum sem uma opção ambígua de escape obriga o modelo a "mentir com precisão", forçando a entrada real na categoria mais próxima mesmo quando nenhuma se encaixa — a correção é incluir a opção de escape, não remover o enum nem criar uma segunda tool.

- **A — errada:** Remover o enum perde o fechamento do conjunto e a padronização.
- **B — correta.**
- **C — errada:** Segunda tool para casos incertos é over-engineering de uma entrada de enum.
- **D — errada:** Obrigatório sem default agrava: força a escolha errada.

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: enum precisa de opção de escape ambígua; sem ela, o modelo força correspondência falsa
- Arquétipos: A=extremo-vs-meio, C=over-engineering, D=vazio-ausente

---

## Q11 — Resposta correta: **C**

`tool_choice: none` impede qualquer chamada de tool, garantindo texto puro para um consumidor a jusante que só sabe processar prosa.

- **A — errada:** `auto` pode chamar tool.
- **B — errada:** `max_tokens` não controla uso de tool.
- **C — correta.**
- **D — errada:** `any` obriga a chamar tool — o oposto.

**Tópicos:** Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `tool_choice: none` garante resposta em texto puro, sem chamada de tool
- Arquétipos: A=extremo-vs-meio, B=camada-alvo-errado, D=extremo-vs-meio

---

## Q12 — Resposta correta: **C**

A Message Batches API cobra 50% do preço padrão, garante acesso aos resultados quando tudo completa ou após 24 horas (o que vier primeiro), e a maioria dos batches termina em menos de uma hora.

- **A — errada:** Não há garantia de cinco minutos; a janela é de 24 horas.
- **B — errada:** O preço é 50% do padrão, não igual.
- **C — correta.**
- **D — errada:** Não é gratuito para request nenhum.

**Tópicos:** Batch Processing

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 3 = Bloom 1 + integração 0 + cenário 1 + distratores 1
- Cenário: S6 — Structured Data Extraction
- Princípio testado: batch processing custa metade do preço padrão, com janela de acesso de até 24h
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=camada-alvo-errado

---

## Q13 — Resposta correta: **C**

Fronteiras explícitas de inclusão e exclusão impedem o modelo de gerar achados em categorias onde seu desempenho é conhecidamente pouco confiável — depender de confiança auto-reportada ou só reordenar por confiança não removem o ruído.

- **A — errada:** "Só o que tiver certeza" delega o critério à confiança auto-reportada — sinal não confiável.
- **B — errada:** Ranquear mantém o ruído, só reordena.
- **C — correta.**
- **D — errada:** "Menos achados" pode cortar o bug real junto.

**Tópicos:** Critérios Explícitos

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: fronteiras explícitas de inclusão/exclusão impedem achados em categorias de baixa confiabilidade conhecida
- Arquétipos: A=sinal-nao-confiavel, B=camada-alvo-errado, D=camada-alvo-errado

---

## Q14 — Resposta correta: **A**

Schema não é validação completa — ferramentas como Pydantic ou Instructor devem validar tanto a entrada gerada pelo modelo quanto a saída, nas duas direções.

- **A — correta.**
- **B — errada:** A entrada gerada pelo modelo também precisa de validação.
- **C — errada:** Validar só a jusante descobre o erro depois de propagado.
- **D — errada:** O material afirma explicitamente o contrário.

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: validação estruturada (ex.: Pydantic) precisa cobrir entrada e saída do modelo, não só uma direção
- Arquétipos: B=vazio-ausente, C=montante-jusante, D=camada-alvo-errado

---

## Q15 — Resposta correta: **A**

Consistência entre formatos de documento variados vem da combinação de schemas com campos opcionais, instruções de normalização de formato e exemplos few-shot — regras de pós-processamento por fornecedor não escalam, e modelo maior com prompt vago mantém a inconsistência.

- **A — correta.**
- **B — errada:** Regras de pós-processamento por vendor é manutenção infinita — e não ajuda no décimo terceiro vendor.
- **C — errada:** Modelo maior com prompt vago mantém a inconsistência.
- **D — errada:** Doze prompts manuais não escalam e divergem com o tempo.

**Tópicos:** Tool Use Schema, Few-Shot

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Médio
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: schema com campos opcionais + normalização + few-shot juntos dão consistência entre formatos variados
- Arquétipos: B=over-engineering, C=probabilistico-vs-garantia, D=enumerar-vs-generalizar

---

## Q16 — Resposta correta: **B**

Exemplos few-shot devem incluir casos bons e ruins — os exemplos negativos são o que ensina o modelo a não disparar em situações parecidas mas que não deveriam ser sinalizadas, sendo a alavanca direta contra falso positivo.

- **A — errada:** JSON Schema não exige exemplos.
- **B — correta.**
- **C — errada:** O efeito é o oposto: reduzem achados espúrios.
- **D — errada:** Adicionam tokens; a justificativa é qualidade, não custo.

**Tópicos:** Few-Shot, Critérios Explícitos

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: exemplos negativos (few-shot) ensinam o que NÃO sinalizar, reduzindo falso positivo diretamente
- Arquétipos: A=vazio-ausente, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q17 — Resposta correta: **C**

Para datas ambíguas, um campo dedicado (`unclear=true`) permite ao modelo declarar explicitamente a ambiguidade em vez de escolher em silêncio — nota livre não é consumível por sistema, e confiança sobre o documento inteiro não localiza qual campo é ambíguo.

- **A — errada:** Campo de notas livre não é consumível por sistema a jusante.
- **B — errada:** Confiança por documento inteiro não localiza **qual** campo é ambíguo.
- **C — correta.**
- **D — errada:** Ausência do campo é ambígua: não distingue "ambíguo" de "não presente no documento".

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: campo dedicado de ambiguidade declara incerteza explicitamente, em vez de escolher silenciosamente
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=vazio-ausente

---

## Q18 — Resposta correta: **D**

Um chat com o usuário esperando é síncrono por definição, porque bloqueia o fluxo até a resposta — os envelopes de latência de um chat e de um batch são completamente diferentes, e nenhum preço menor compensa deixar o usuário esperando até 24h.

- **A — errada:** Os envelopes de latência são completamente diferentes.
- **B — errada:** "Menos de uma hora" ainda é eternidade num chat.
- **C — errada:** Mais barato não compensa deixar o usuário esperando até 24h.
- **D — correta.**

**Tópicos:** Batch Processing

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: se o usuário está esperando ativamente, o processamento precisa ser síncrono, não batch
- Arquétipos: A=camada-alvo-errado, B=extremo-vs-meio, C=camada-alvo-errado

---

## Q19 — Resposta correta: **C**

O benefício principal de passadas separadas com exemplos dedicados é evitar o trade-off de recall entre preocupações concorrentes — não é eliminar falso positivo por completo nem economizar tokens (custa mais, mas ganha qualidade).

- **A — errada:** O ponto é justamente ter exemplos **dedicados** por passada.
- **B — errada:** Nada garante zero falso positivo; isso vem de critério explícito, e ainda assim é redução, não eliminação.
- **C — correta.**
- **D — errada:** Três passadas custam mais, não menos. O ganho é qualidade.

**Tópicos:** Revisão Multi-Instância

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: passadas especializadas evitam trade-off de recall entre preocupações concorrentes, não reduzem custo
- Arquétipos: A=vazio-ausente, B=extremo-vs-meio, D=camada-alvo-errado

---

## Q20 — Resposta correta: **C**

Dizer explicitamente o que não deve ser mudado é tão vinculante quanto dizer o que mudar, e é o que evita mudança colateral fora do escopo pretendido.

- **A — errada:** Não menciona retry.
- **B — errada:** Não há exemplo de entrada/saída na cláusula.
- **C — correta.**
- **D — errada:** Não trata de formato de saída.

**Tópicos:** Critérios Explícitos

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: delimitar o escopo inclui declarar explicitamente o que NÃO deve ser alterado
- Arquétipos: A=camada-alvo-errado, B=vazio-ausente, D=camada-alvo-errado

---

## Q21 — Resposta correta: **D**

Quando um ingrediente realmente não tem medida ("flour, sifted"), representar a ausência com um valor nulo explícito é o comportamento desejado — o schema permitia null e o prompt definiu quando usá-lo; o modelo acertou, não falhou.

- **A — errada:** String vazia num campo de unidade é dado sujo: não distingue "vazio" de "ausente".
- **B — errada:** O documento está bem formado; quem tinha de acomodar a variação era o schema.
- **C — errada:** Não houve falha: "flour, sifted" realmente não tem medida.
- **D — correta.**

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: representar ausência real com null explícito é sucesso, não falha de extração
- Arquétipos: A=vazio-ausente, B=montante-jusante, C=camada-alvo-errado

---

## Q22 — Resposta correta: **B**

Para normalizar telefone em qualquer formato de origem, a regra é remover todos os caracteres não numéricos e aplicar o formato E.164, com exemplos mostrando a transformação — regex no JSON Schema só valida, não reformata, e trigger de banco normaliza tarde demais.

- **A — errada:** Regex em JSON Schema **valida**, não reformata.
- **B — correta.**
- **C — errada:** "Bem formatado" não diz qual padrão.
- **D — errada:** Trigger de banco normaliza tarde e esconde o erro do pipeline.

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: normalização de telefone é regra explícita (remover não-dígitos + E.164) com exemplos, não validação nem correção tardia
- Arquétipos: A=camada-alvo-errado, C=vazio-ausente, D=montante-jusante

---

## Q23 — Resposta correta: **A**

Um Message Batch é limitado a 100.000 requisições ou 256 MB de tamanho, o que for atingido primeiro — os dois limites valem juntos, não um no lugar do outro.

- **A — correta.**
- **B — errada:** 10 MB não é o limite; são 256 MB.
- **C — errada:** Existe limite de requests.
- **D — errada:** Número errado e "sem limite de tamanho" é falso.

**Tópicos:** Batch Processing

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: limite de um Message Batch é 100.000 requisições OU 256 MB, o que vier primeiro
- Arquétipos: B=camada-alvo-errado, C=vazio-ausente, D=feature-inexistente-verossimil

---

## Q24 — Resposta correta: **B**

Pedir para o modelo omitir um preâmbulo é enforcement por prompt e falha de vez em quando; a correção estrutural é a saída chegar como argumentos tipados de uma chamada de tool, não como prosa que alguém tenta interpretar — aí o preâmbulo deixa de ser possível.

- **A — errada:** Pedir para omitir é enforcement por prompt: falha de vez em quando, que é exatamente o sintoma.
- **B — correta.**
- **C — errada:** Cortar até o primeiro `|` é remendo frágil sobre o mesmo desenho.
- **D — errada:** Truncamento não é o problema aqui.

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: saída como argumentos tipados de tool elimina estruturalmente o preâmbulo, ao contrário de pedir por prompt
- Arquétipos: A=probabilistico-vs-garantia, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q25 — Resposta correta: **C**

Dividir em escopo menor e mesclar depois é a recomendação certa contra truncamento — elevar o limite não escala para o próximo PR maior, e truncamento de saída estruturada não é degradação suave, é corrupção da estrutura.

- **A — errada:** Elevar o limite não escala — o próximo PR maior trunca de novo.
- **B — errada:** Contexto cruzado entre arquivos não compensa perder a saída por truncamento.
- **C — correta.**
- **D — errada:** Markdown também trunca; só falha de forma menos visível.

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: escopo menor + merge escala contra truncamento; elevar limite ou usar markdown não resolvem de fato
- Arquétipos: A=extremo-vs-meio, B=camada-alvo-errado, D=camada-alvo-errado

---

## Q26 — Resposta correta: **D**

Para que um script consiga agir sobre a saída de um revisor automatizado, ela precisa de campos exatos, valores permitidos e um mecanismo restrito por schema — "detalhado e bem estruturado" não define campo nenhum, e depender do modelo ser consistente em markdown é o pressuposto que falha.

- **A — errada:** "Detalhado e bem estruturado" não define campo nenhum.
- **B — errada:** Um achado por linha não carrega os cinco campos de forma não ambígua.
- **C — errada:** Markdown com cabeçalhos consistentes depende de o modelo ser consistente — a suposição que falha.
- **D — correta.**

**Tópicos:** Tool Use Schema, CI/CD

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S5 — Claude Code for CI
- Princípio testado: saída consumível por máquina exige campos exatos + valores permitidos + restrição por schema, não prosa "bem organizada"
- Arquétipos: A=vazio-ausente, B=vazio-ausente, C=sinal-nao-confiavel

---

## Q27 — Resposta correta: **A**

Exemplos few-shot precisam incluir casos de borda, tanto bons quanto ruins — sem uma âncora para o caso difícil, o comportamento nesse caso fica livre e errático; temperatura mais alta só piora a variação.

- **A — correta.**
- **B — errada:** Temperatura mais alta aumenta a variação — o oposto do desejado.
- **C — errada:** System prompt maior não substitui exemplo do caso de borda.
- **D — errada:** Mais exemplos do mesmo tipo reforça o que já funciona.

**Tópicos:** Few-Shot

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: casos de borda precisam de exemplo próprio nos few-shot; sem eles o comportamento nesse caso é errático
- Arquétipos: B=extremo-vs-meio, C=camada-alvo-errado, D=enumerar-vs-generalizar

---

## Q28 — Resposta correta: **A**

A diferença entre tool use e pedir formato via prompt é de mecanismo — com tool use o modelo preenche um schema declarado; com prompt ele formata prosa e torce para caber, bem menos confiável para um pipeline tipado.

- **A — correta.**
- **B — errada:** Não são equivalentes — é justamente o que o objetivo pede para distinguir.
- **C — errada:** Derrotismo: tool use com schema é confiável o bastante para pipelines tipados.
- **D — errada:** Inverte a ordem de confiabilidade.

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: tool use preenche schema declarado; prompt apenas formata prosa — mecanismos com confiabilidade bem diferente
- Arquétipos: B=camada-alvo-errado, C=sinal-nao-confiavel, D=camada-alvo-errado

---

## Q29 — Resposta correta: **D**

Um enum que não cobre a distribuição real dos valores força o modelo a mapear um caso mais grave numa categoria mais fraca (ex.: "outage total" virando "high"), perdendo a distinção que importava — texto livre destrói a padronização, e inferir por sentimento é sinal não confiável.

- **A — errada:** Opcional não resolve: o caso existe e precisa de valor.
- **B — errada:** Texto livre destrói a padronização que o enum existe para dar.
- **C — errada:** Inferir severidade de sentimento é o distrator de sinal não confiável.
- **D — correta.**

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: enum incompleto força imprecisão na categoria escolhida, perdendo distinções reais
- Arquétipos: A=vazio-ausente, B=extremo-vs-meio, C=sinal-nao-confiavel

---

## Q30 — Resposta correta: **A**

Dados numéricos e de preço tendem a se perder em sumarizações sucessivas — a solução é extrair os dados-chave e reinjetá-los diretamente no próximo prompt, em vez de confiar que a sumarização os preserve.

- **A — correta.**
- **B — errada:** Inverter a ordem não muda a natureza da sumarização progressiva.
- **C — errada:** Menos etapas reduz a perda, mas não a elimina — e o material dá uma solução direta.
- **D — errada:** "Preserve todos os números" é instrução; a degradação é do processo de condensação.

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: extrair e reinjetar dados numéricos evita que sumarização progressiva os perca
- Arquétipos: B=camada-alvo-errado, C=extremo-vs-meio, D=probabilistico-vs-garantia

---

## Q31 — Resposta correta: **C**

"Sinalize apenas quando a entrada vai direto para a query sem parametrização" é o critério de inclusão; "não sinalize ORM nem prepared statements" é o de exclusão — os dois juntos formam o critério explícito completo.

- **A — errada:** Não há política de retry nem validação.
- **B — errada:** Não há limiar de confiança nem ranking.
- **C — correta.**
- **D — errada:** Não há exemplo entrada/saída nem schema.

**Tópicos:** Critérios Explícitos

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: critério explícito completo tem cláusula de inclusão E de exclusão, não uma sozinha
- Arquétipos: A=feature-inexistente-verossimil, B=sinal-nao-confiavel, D=vazio-ausente

---

## Q32 — Resposta correta: **B**

O critério de detecção (universal) deve ficar separado das convenções e padrões aceitos daquele repositório específico (local), fornecidos como contexto persistente próprio — inferir convenção a partir do próprio código sob suspeita é adivinhação.

- **A — errada:** Inferir convenção do código é adivinhação — e o código é justamente o que está sob suspeita.
- **B — correta.**
- **C — errada:** 40 prompts manuais divergem e ninguém mantém.
- **D — errada:** Aceitar a variação é aceitar o falso positivo.

**Tópicos:** Critérios Explícitos, Path Rules

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: separar critério de detecção universal de convenções locais, fornecidas como contexto persistente por repositório
- Arquétipos: A=montante-jusante, C=enumerar-vs-generalizar, D=vazio-ausente

---

## Q33 — Resposta correta: **B**

Como nenhuma resposta por documento é necessária de imediato, mudar para processamento em batch corrige o bloqueio de worker e o custo ao mesmo tempo — paralelizar o loop síncrono ou trocar de modelo mantêm o desenho errado.

- **A — errada:** Paralelizar o loop síncrono continua pagando preço cheio e ocupando workers.
- **B — correta.**
- **C — errada:** Modelo menor no mesmo loop mantém o desenho errado.
- **D — errada:** Prompt menor não muda o modo de processamento.

**Tópicos:** Batch Processing

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 2 + integração 0 + cenário 1 + distratores 1
- Cenário: S6 — Structured Data Extraction
- Princípio testado: batch corrige bloqueio de worker e custo simultaneamente, quando nada precisa de resposta imediata
- Arquétipos: A=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q34 — Resposta correta: **D**

Um campo numérico nulo, acompanhado de um flag de status, representa a ausência com precisão e ainda diz o motivo — distinguindo "a determinar" de "não mencionado"; estimar é fabricar dado, e zero é um valor falso que contamina somas.

- **A — errada:** Estimar é fabricar — exatamente o que o objetivo pede para evitar.
- **B — errada:** String num campo numérico quebra o schema e o consumidor tipado.
- **C — errada:** `0` é um valor numérico falso que vai contaminar somas e relatórios.
- **D — correta.**

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: null + campo de status distingue motivos de ausência sem inventar valor numérico
- Arquétipos: A=probabilistico-vs-garantia, B=camada-alvo-errado, C=vazio-ausente

---

## Q35 — Resposta correta: **D**

Um valor pode ser válido contra o schema (tipo, formato) e ainda estar semanticamente errado (ex.: total não bate com a soma das linhas) — schema não é validação completa; regra de negócio entre campos é responsabilidade da camada de aplicação.

- **A — errada:** `max_tokens` não tem relação.
- **B — errada:** JSON Schema não expressa "o total bate com a soma das linhas".
- **C — errada:** Tool forçada garante a chamada e a forma, não a semântica.
- **D — correta.**

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: conformidade de schema não garante correção semântica entre campos — isso é validação de aplicação
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=probabilistico-vs-garantia

---

## Q36 — Resposta correta: **D**

Uma descrição consolidada dos oito problemas, específica o bastante para orientar uma revisão única e coerente, evita que a correção de um problema quebre outro — requisições separadas ou perguntar "o que você melhoraria" devolvem o critério ao modelo que já errou.

- **A — errada:** Oito requisições separadas arriscam que a correção de uma quebre outra.
- **B — errada:** "O que você melhoraria?" devolve o critério ao modelo — que já errou uma vez.
- **C — errada:** Reescrita sem listar os problemas repete os mesmos erros.
- **D — correta.**

**Tópicos:** Refinamento Iterativo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: descrição consolidada e específica de todos os problemas permite correção coerente numa única passada
- Arquétipos: A=extremo-vs-meio, B=sinal-nao-confiavel, C=vazio-ausente

---

## Q37 — Resposta correta: **C**

"Tom profissional" é julgamento subjetivo que varia entre execuções — um critério concreto combinado com um exemplo aceitável é o par que estabiliza a saída; temperatura mais alta e comprimento não são a variável em jogo.

- **A — errada:** Temperatura alta aumenta justamente a variação reclamada.
- **B — errada:** Comprimento não é a variável.
- **C — correta.**
- **D — errada:** Repetir a mesma instrução vaga duas vezes não a torna precisa.

**Tópicos:** Refinamento Iterativo, Few-Shot

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: critério concreto + exemplo aceitável estabilizam saída que depende de julgamento subjetivo vago
- Arquétipos: A=extremo-vs-meio, B=camada-alvo-errado, D=probabilistico-vs-garantia

---

## Q38 — Resposta correta: **A**

Roteamento para revisão humana deve combinar score de confiança, características do documento e ambiguidade em nível de campo — confiança sozinha é auto-relato do modelo, um sinal fraco isolado, mesmo sendo um sinal válido entre vários.

- **A — correta.**
- **B — errada:** Tratar confiança como sempre exata e critério único é o distrator clássico.
- **C — errada:** Não há proibição de campos de confiança em JSON Schema.
- **D — errada:** Latência não mede qualidade da extração.

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: confiança do modelo é um sinal entre vários para roteamento — nunca o critério único
- Arquétipos: B=sinal-nao-confiavel, C=feature-inexistente-verossimil, D=camada-alvo-errado

---

## Q39 — Resposta correta: **D**

Quando o requisito é "sempre extrair, nunca responder em texto", o schema define a forma e `tool_choice` forçando aquela tool garante que a chamada aconteça e que não venha uma resposta conversacional — sem tool ou com `auto`/`none`, essa garantia não existe.

- **A — errada:** Sem tool, só prompt, é o método menos confiável.
- **B — errada:** `none` proíbe tools — impossibilita a extração.
- **C — errada:** `auto` permite responder em texto.
- **D — correta.**

**Tópicos:** Tool Choice, Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: requisito de "sempre/nunca" pede schema + `tool_choice` forçado, não apenas prompt ou `auto`
- Arquétipos: A=probabilistico-vs-garantia, B=extremo-vs-meio, C=probabilistico-vs-garantia

---

## Q40 — Resposta correta: **C**

Exemplos ancoram o modelo na preocupação específica que estão ensinando — misturar exemplos de preocupações diferentes num mesmo conjunto dilui essa âncora e reintroduz a competição entre preocupações que passadas separadas tentam evitar.

- **A — errada:** A API não exige conjunto de exemplos por tool.
- **B — errada:** Conjuntos separados aumentam o total de tokens.
- **C — correta.**
- **D — errada:** Não há questão de licenciamento.

**Tópicos:** Few-Shot, Revisão Multi-Instância

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: exemplos de preocupações diferentes misturados diluem a âncora de cada um, reintroduzindo competição
- Arquétipos: A=feature-inexistente-verossimil, B=camada-alvo-errado, D=feature-inexistente-verossimil

---

## Q41 — Resposta correta: **A**

Consistência entre formatos de documento difíceis vem de exemplos dos layouts problemáticos combinados com instruções de normalização das peculiaridades de cada um — recusar os documentos difíceis ou mandar tudo para revisão humana sem triagem desistem do escopo.

- **A — correta.**
- **B — errada:** Rejeitar os documentos difíceis é desistir do escopo.
- **C — errada:** `max_tokens` não melhora leitura de formulário escaneado.
- **D — errada:** Mandar todos para humano sem triagem joga fora a automação — e o objetivo #22 pede roteamento **por característica**, não em bloco.

**Tópicos:** Few-Shot, Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: exemplos dos layouts difíceis + normalização de suas peculiaridades dão consistência, sem descartar escopo
- Arquétipos: B=extremo-vs-meio, C=camada-alvo-errado, D=montante-jusante

---

## Q42 — Resposta correta: **D**

Fronteiras explícitas no prompt impedem o modelo de gerar achados em categorias onde seu desempenho é conhecidamente pouco confiável — diferente de truncamento, violação de schema ou rate limiting, que são outros problemas.

- **A — errada:** Truncamento é outro problema (objetivo #28).
- **B — errada:** Violação de schema é tratada por tool use e validação.
- **C — errada:** Rate limiting é out-of-scope da prova.
- **D — correta.**

**Tópicos:** Critérios Explícitos

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 2 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: fronteiras explícitas de escopo impedem achados em categorias de baixa confiabilidade — não é o mesmo mecanismo de truncamento/validação/rate-limit
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=camada-alvo-errado

---

## Q43 — Resposta correta: **A**

Os resultados de um Message Batch são recuperáveis individualmente por requisição, e o acesso acontece quando tudo completa ou ao fim da janela de 24 horas, o que vier primeiro — não é preciso reenviar o batch inteiro por uma falha pontual.

- **A — correta.**
- **B — errada:** Não é preciso reenviar o batch inteiro por causa de uma falha.
- **C — errada:** Requisições com falha não somem silenciosamente.
- **D — errada:** Os resultados são individuais, não agregados.

**Tópicos:** Batch Processing

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: resultados de batch são recuperáveis por requisição individual, acesso após conclusão ou 24h
- Arquétipos: B=camada-alvo-errado, C=vazio-ausente, D=camada-alvo-errado

---

## Q44 — Resposta correta: **B**

Ao mesclar estruturas resultantes de chamadas divididas, o merge precisa tratar colisões, duplicatas e preservar de qual arquivo veio cada achado — recusa de JSON, `tool_choice` por chamada e enum não são os riscos relevantes aqui.

- **A — errada:** Recusa de JSON não é risco do merge.
- **B — correta.**
- **C — errada:** `tool_choice` é por requisição; não se "perde" entre chamadas.
- **D — errada:** Enum é restrição por chamada, não do merge.

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S6 — Structured Data Extraction
- Princípio testado: merge de estruturas divididas precisa tratar colisão/duplicata e preservar proveniência
- Arquétipos: A=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q45 — Resposta correta: **C**

Um schema estrito na tool é o mecanismo que impede um campo fora do contrato — mais exemplos só reduzem a frequência, apagar no parsing esconde que o modelo está fora do contrato, e pedir para não incluir é enforcement por prompt que funciona quase sempre.

- **A — errada:** Mais exemplos reduz a frequência; não fecha a porta.
- **B — errada:** Apagar no parsing esconde que o modelo está fora do contrato.
- **C — correta.**
- **D — errada:** Enforcement por prompt: funciona quase sempre, que é o problema.

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: schema estrito impede estruturalmente campo fora do contrato; não é questão de mais exemplos ou instrução
- Arquétipos: A=extremo-vs-meio, B=vazio-ausente, D=probabilistico-vs-garantia

---

## Q46 — Resposta correta: **A**

Ir além do par entrada/saída e anotar cada exemplo com uma justificativa explicita o critério de decisão, tornando a fronteira transferível para casos novos que os exemplos não cobriram diretamente.

- **A — correta.**
- **B — errada:** Justificativa não é exigência do formato few-shot.
- **C — errada:** Chain-of-thought é raciocínio do modelo na resposta, não anotação nos exemplos.
- **D — errada:** Nenhum número de exemplos cai a zero por causa disso.

**Tópicos:** Few-Shot

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: justificativa anotada nos exemplos few-shot torna a fronteira de decisão transferível a casos novos
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=vazio-ausente

---

## Q47 — Resposta correta: **D**

Diante de muito dado de uma vez, o modelo tende a usar bem as primeiras e últimas partes e ignorar o meio — a solução é verificar e processar em seções, com passadas dirigidas, em vez de confiar numa passada única sobre tudo.

- **A — errada:** Não é incapacidade; é distribuição de atenção em contexto longo.
- **B — errada:** O tamanho do diff não é a variável — o guia é que é grande demais.
- **C — errada:** Formato JSON não corrige o efeito de meio.
- **D — correta.**

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: "lost in the middle" se mitiga processando em seções, não confiando numa passada única sobre volume grande
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=camada-alvo-errado

---

## Q48 — Resposta correta: **D**

Nomear uma categoria como fora de escopo diretamente no prompt é o critério de exclusão explícito, o mecanismo previsto para isso — limiar de confiança usa sinal fraco, hook não molda conteúdo de revisão, e filtro por palavra-chave derruba achados legítimos junto.

- **A — errada:** Limiar de confiança usa sinal fraco e afeta todas as categorias.
- **B — errada:** Hook bloqueia execução de tool; não molda o conteúdo da revisão.
- **C — errada:** Filtro por palavra derruba também o achado de performance legítimo, se houver.
- **D — correta.**

**Tópicos:** Critérios Explícitos

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: categoria nomeada como fora de escopo no prompt é o critério de exclusão explícito correto
- Arquétipos: A=sinal-nao-confiavel, B=camada-alvo-errado, C=sinal-nao-confiavel

---

## Q49 — Resposta correta: **D**

Um campo de data nullable com null explícito permite ao consumidor distinguir "documento não especificou" de qualquer data real — string num campo tipado quebra o consumidor, data atual como default é um valor inventado, e omitir o registro descarta os outros campos extraídos com sucesso.

- **A — errada:** String num campo tipado como data quebra o consumidor.
- **B — errada:** Data atual como default é um valor inventado que parece legítimo — o pior tipo de erro.
- **C — errada:** Omitir o registro inteiro descarta todos os outros campos que foram extraídos com sucesso.
- **D — correta.**

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: campo nullable com null explícito distingue "não especificado" de qualquer valor real, sem inventar nem descartar o registro
- Arquétipos: A=camada-alvo-errado, B=feature-inexistente-verossimil, C=camada-alvo-errado

---

## Q50 — Resposta correta: **A**

"Bom" é julgamento subjetivo; "três bullets, menos de 20 palavras, cobrindo decisão/responsável/prazo, sem contexto de fundo" é verificável item a item, inclusive o que não incluir.

- **A — correta.**
- **B — errada:** Comprimento não é a causa.
- **C — errada:** Não há mudança de temperatura no enunciado.
- **D — errada:** Não é o formato de bullet que melhora; é o critério.

**Tópicos:** Critérios Explícitos

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: critério verificável item a item (incluindo o que não incluir) substitui julgamento subjetivo como "bom"
- Arquétipos: B=camada-alvo-errado, C=vazio-ausente, D=camada-alvo-errado

---

## Q51 — Resposta correta: **B**

Forçar a tool garante que ela seja chamada e a forma dos argumentos — mas uma regra entre campos (semântica) continua exigindo uma camada de validação e retry separada; a chamada em si não falhou, os argumentos é que violaram uma regra de negócio.

- **A — errada:** A chamada não falhou; os argumentos violaram uma regra de negócio.
- **B — correta.**
- **C — errada:** `tool_choice` não expressa regra entre campos.
- **D — errada:** Premissa falsa: tool forçada não implica argumentos corretos.

**Tópicos:** Tool Choice, Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: `tool_choice` forçado garante chamada e forma; regra semântica entre campos ainda precisa de validação própria
- Arquétipos: A=camada-alvo-errado, C=camada-alvo-errado, D=probabilistico-vs-garantia

---

## Q52 — Resposta correta: **A**

O merge é a parte frágil de dividir uma extração em chamadas: chaves compartilhadas, ordenação e o caso de uma das chamadas voltar vazia precisam de regra definida — temperatura, mesmo batch ou `max_tokens` igual não resolvem isso.

- **A — correta.**
- **B — errada:** Temperatura não determina como as estruturas se combinam.
- **C — errada:** Estar no mesmo batch não é relevante para a coerência do registro.
- **D — errada:** `max_tokens` igual não é requisito de montagem.

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S6 — Structured Data Extraction
- Princípio testado: merge de chamadas divididas precisa de regra explícita para chaves compartilhadas, ordem e chamada vazia
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q53 — Resposta correta: **A**

Normalizar país segue a mesma família de regras de normalização — declarar a representação alvo e mapear as variantes observadas com exemplos, em vez de deduplicar depois (perde o contexto do documento) ou empurrar a normalização para cada consumidor.

- **A — correta.**
- **B — errada:** Deduplicar depois exige adivinhar o mapeamento fora do contexto do documento.
- **C — errada:** Empurrar a normalização para os consumidores multiplica o trabalho por consumidor.
- **D — errada:** "O país" não define representação.

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: normalização de país é regra + mapeamento de variantes com exemplos, mesma família das outras normalizações
- Arquétipos: B=montante-jusante, C=camada-alvo-errado, D=vazio-ausente

---

## Q54 — Resposta correta: **A**

Mesmo com instruções claras, uma única passada com várias preocupações sofre de duas causas somadas — competição por atenção entre as preocupações e diluição dos exemplos, que servem bem a uma delas e atrapalham as outras.

- **A — correta.**
- **B — errada:** Falso: a API não processa "só a primeira instrução".
- **C — errada:** O enunciado não indica estouro de contexto.
- **D — errada:** Um schema pode representar várias preocupações — não é a limitação.

**Tópicos:** Revisão Multi-Instância, Few-Shot

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: uma passada com múltiplas preocupações sofre de competição por atenção E diluição de exemplos, não de uma causa só
- Arquétipos: B=feature-inexistente-verossimil, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q55 — Resposta correta: **C**

Confiança auto-reportada é o sinal mais fraco isoladamente entre os citados, porque é o modelo avaliando a si mesmo — layout fora do template, falha em validação cruzada e campo obrigatório vindo null são fatos verificáveis e objetivos.

- **A — errada:** Layout fora do template conhecido é característica do documento — o objetivo cita isso explicitamente.
- **B — errada:** Falha em regra de validação cruzada é o sinal mais duro que existe.
- **C — correta.**
- **D — errada:** Campo obrigatório que voltou null é fato objetivo e forte.

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S6 — Structured Data Extraction
- Princípio testado: confiança auto-reportada é o sinal mais fraco isoladamente, comparado a fatos verificáveis sobre documento/extração
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=camada-alvo-errado

---

## Q56 — Resposta correta: **B**

`enum` é o elemento do JSON Schema que fecha o conjunto de valores permitidos, reduzindo ambiguidade — `type: string` aceita qualquer string, `required` só obriga presença, e descrição orienta sem restringir formalmente.

- **A — errada:** `type: string` aceita qualquer string.
- **B — correta.**
- **C — errada:** `required` obriga a presença, não restringe o valor.
- **D — errada:** Descrição orienta, mas não restringe formalmente.

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 3 = Bloom 1 + integração 0 + cenário 1 + distratores 1
- Cenário: S6 — Structured Data Extraction
- Princípio testado: `enum` é o único elemento do schema que fecha o conjunto de valores permitidos
- Arquétipos: A=camada-alvo-errado, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q57 — Resposta correta: **B**

Validar contra as regras de negócio antes da escrita, com um caminho de revisão ou retry para as falhas, evita descobrir o erro só no momento da inserção no banco — afrouxar constraint ou inserir uma a uma não previnem nem tratam o problema de fato.

- **A — errada:** Lote maior não dilui erro: gera mais linhas ruins.
- **B — correta.**
- **C — errada:** Afrouxar constraint é aceitar dado ruim no banco.
- **D — errada:** Inserir uma a uma isola a falha mas não a previne nem a trata.

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: validação de regra de negócio antes da escrita (com retry/revisão) evita descoberta tardia no insert
- Arquétipos: A=camada-alvo-errado, C=vazio-ausente, D=camada-alvo-errado

---

## Q58 — Resposta correta: **B**

Exemplos do que parece um problema mas na verdade não é são a alavanca direta contra falso positivo — ancoram os dois lados da fronteira de decisão, não só o lado do que deve ser sinalizado.

- **A — errada:** Exemplos aumentam o custo de tokens; a justificativa é precisão.
- **B — correta.**
- **C — errada:** Schema de tool não exige exemplos.
- **D — errada:** O objetivo é reduzir achados espúrios, não aumentar a contagem.

**Tópicos:** Few-Shot, Critérios Explícitos

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: exemplos do tipo "parece problema mas não é" ancoram a fronteira contra falso positivo
- Arquétipos: A=camada-alvo-errado, C=vazio-ausente, D=camada-alvo-errado

---

## Q59 — Resposta correta: **A**

Um container estruturado com um array vazio torna "nada encontrado" um resultado explícito e consumível, distinto de "não houve resposta nenhuma" — um achado fantasma com severidade "none" polui a tabela, e ausência de chamada de tool é indistinguível de falha.

- **A — correta.**
- **B — errada:** Achado fantasma com severidade "none" polui a tabela e exige filtro especial em toda consulta.
- **C — errada:** Ausência de tool call é indistinguível de falha para o consumidor.
- **D — errada:** Prosa quebra o contrato estruturado.

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: array vazio num container estruturado é resultado válido e explícito de "nada encontrado", diferente de ausência de resposta
- Arquétipos: B=vazio-ausente, C=vazio-ausente, D=camada-alvo-errado

---

## Q60 — Resposta correta: **D**

O critério que decide por batch é bloqueio e janela aceitável — ninguém espera resposta individual, e a janela de processamento cabe dentro do período disponível (ex.: entre meia-noite e 8h); os custos entre batch e síncrono não são iguais, e ter prazo não implica precisar de resposta síncrona.

- **A — errada:** Garantia ao minuto não é o requisito; o requisito é caber na janela.
- **B — errada:** Ter prazo não implica precisar de resposta síncrona — implica ter janela.
- **C — errada:** Os custos **não** são iguais: batch custa metade.
- **D — correta.**

**Tópicos:** Batch Processing

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: batch se justifica por ninguém esperar resposta individual E a janela de tempo caber no processamento
- Arquétipos: A=extremo-vs-meio, B=camada-alvo-errado, C=camada-alvo-errado

---
