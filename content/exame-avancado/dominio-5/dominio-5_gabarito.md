# Gabarito — Bloco 5

**Domínio 5 — Context Management & Reliability (peso 15%)**

Fontes: `livro01.pdf`, `livro02.pdf`, objetivos de `livro03.md`.

---

## Q1 — Resposta correta: **C**

Quando fontes discordam genuinamente, a síntese deve preservar a incerteza no nível da fonte, distinguindo achados bem estabelecidos de afirmações contestadas, em vez de colapsar dados conflitantes numa única afirmação confiante.

- **A — errada:** Ordem de execução não afeta como o conflito é representado.
- **B — errada:** Contexto não é o problema: as três informações chegaram.
- **C — correta.**
- **D — errada:** Maioria não é critério de verdade — e a fonte mais recente é justamente a que muda o quadro.

**Tópicos:** Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: síntese deve preservar incerteza entre fontes, não colapsar conflito em afirmação única confiante
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=sinal-nao-confiavel

---

## Q2 — Resposta correta: **A**

Decisões que precisam continuar valendo ao longo de uma sessão longa devem ir para um objeto de estado estruturado, não depender do fluxo da conversa — sumarização, sliding window e retenção seletiva são as outras técnicas da mesma família.

- **A — correta.**
- **B — errada:** Temperatura alta aumenta a variação: piora.
- **C — errada:** Reler as próprias mensagens depende de elas ainda estarem no contexto — que é justamente o que se perdeu.
- **D — errada:** Recomeçar joga fora três horas e repete o mesmo desenho.

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: decisão que precisa continuar valendo vai para objeto de estado estruturado, não para o histórico de conversa
- Arquétipos: B=probabilistico-vs-garantia, C=montante-jusante, D=over-engineering

---

## Q3 — Resposta correta: **B**

Roteamento para revisão humana deve se basear em score de confiança, características do documento e ambiguidade em nível de campo, não em amostragem aleatória — dia da semana e comprimento do documento são proxies fracos.

- **A — errada:** Dia da semana não tem relação com dificuldade.
- **B — correta.**
- **C — errada:** Dobrar a amostragem aleatória dobra o custo e continua sem mirar no que erra.
- **D — errada:** Comprimento é proxy fraco: documento longo e padronizado extrai bem.

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: roteamento para revisão humana usa sinais objetivos (confiança, características, ambiguidade), não amostragem aleatória
- Arquétipos: A=feature-inexistente-verossimil, C=over-engineering, D=camada-alvo-errado

---

## Q4 — Resposta correta: **D**

Uma chave expirada é falha de acesso (`access_failure`), não "nenhum resultado" (`valid_empty`) — confundir os dois faz o coordenador concluir que um tema não tem cobertura quando na verdade ninguém conseguiu nem olhar.

- **A — errada:** Não houve estouro de contexto.
- **B — errada:** Exceção mataria o pipeline inteiro por uma credencial — pior.
- **C — errada:** Mais subagentes com a mesma credencial quebrada falham igual.
- **D — correta.**

**Tópicos:** Propagação de Erros

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: falha de acesso (chave expirada) e resultado vazio-válido são estados diferentes — confundi-los engana o coordenador sobre cobertura
- Arquétipos: A=camada-alvo-errado, B=extremo-vs-meio, C=camada-alvo-errado

---

## Q5 — Resposta correta: **B**

Isolamento de subagente, arquivos de scratchpad e leitura dirigida de arquivo sustentam exploração coerente de um código grande ao longo de sessões que excedem o limite de contexto — "memorizar" não é mecanismo, e trabalhar de memória sobre 500 mil linhas é alucinar.

- **A — errada:** Sessão eterna com auto-compact degrada por sumarização progressiva.
- **B — correta.**
- **C — errada:** "Memorizar" não é um mecanismo.
- **D — errada:** 500 mil linhas não cabem, e "trabalhar de memória" é alucinar.

**Tópicos:** Contexto de Codebase, Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: subagente isolado + scratchpad + leitura dirigida sustentam exploração de codebase além do limite de uma sessão
- Arquétipos: A=extremo-vs-meio, C=feature-inexistente-verossimil, D=over-engineering

---

## Q6 — Resposta correta: **A**

Formatos estruturados mantêm conteúdo e metadado de origem viajando juntos — a proveniência precisa viajar com a afirmação, não ao lado dela numa bibliografia solta ao final ou numa contagem de fontes.

- **A — correta.**
- **B — errada:** Bibliografia no fim não diz qual fonte sustenta qual afirmação.
- **C — errada:** Contar fontes não permite verificar nenhuma.
- **D — errada:** "Seja cuidadoso" é instrução vaga.

**Tópicos:** Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: proveniência precisa viajar junto com cada afirmação (formato estruturado), não separada em bibliografia ou contagem
- Arquétipos: B=montante-jusante, C=vazio-ausente, D=probabilistico-vs-garantia

---

## Q7 — Resposta correta: **D**

Um pacote estruturado que o agente monta antes de escalar — contexto, ações tentadas, bloqueio — evita que o humano precise vasculhar o histórico; encerrar sem escalar abandona o caso, e repetir tools que já falharam é loop improdutivo.

- **A — errada:** Encerrar sem escalar abandona o caso.
- **B — errada:** Repetir tools que já falharam é loop improdutivo com o cliente esperando.
- **C — errada:** Pedir para o cliente repetir tudo é justamente a experiência que o handoff evita.
- **D — correta.**

**Tópicos:** Enforcement de Workflow

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: handoff estruturado (contexto + ações + bloqueio) antes de escalar, em vez de abandonar ou repetir o que já falhou
- Arquétipos: A=vazio-ausente, B=camada-alvo-errado, C=camada-alvo-errado

---

## Q8 — Resposta correta: **A**

Quando três leituras plausíveis de um pedido levam a trabalhos materialmente diferentes, perguntar antes é mais barato que desfazer depois — fazer as três multiplica trabalho e risco, e escolher em silêncio esconde a decisão de quem tinha autoridade para tomá-la.

- **A — correta.**
- **B — errada:** Fazer as três multiplica o trabalho e o risco.
- **C — errada:** Declarar ambiguidade e parar sem oferecer as opções empurra o problema de volta sem ajudar.
- **D — errada:** Escolher em silêncio esconde a decisão de quem tinha autoridade para tomá-la.

**Tópicos:** Escalação de Ambiguidade

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: ambiguidade genuína com interpretações materialmente diferentes pede pergunta antes de agir, não escolha silenciosa
- Arquétipos: B=over-engineering, C=vazio-ausente, D=probabilistico-vs-garantia

---

## Q9 — Resposta correta: **B**

O filtro do que o agente realmente precisa deve acontecer na própria tool, antes de o dado entrar no contexto — os tokens já entraram depois disso, "focar" não os remove, e janela maior só paga mais pelo mesmo ruído.

- **A — errada:** Os tokens já entraram; "focar" não os remove.
- **B — correta.**
- **C — errada:** Chamar menos vezes não reduz o tamanho de cada resposta.
- **D — errada:** Janela maior é pagar mais pelo mesmo ruído.

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: filtrar a saída da tool antes de entrar no contexto, não depois
- Arquétipos: A=montante-jusante, C=camada-alvo-errado, D=extremo-vs-meio

---

## Q10 — Resposta correta: **D**

Dados numéricos e de preço podem se perder ao longo de várias passadas de sumarização — a solução é extrair os dados-chave e reinjetá-los diretamente no próximo prompt, já que o processo de condensação em cadeia é o que os apaga, não um truncamento no fim.

- **A — errada:** Truncamento cortaria o fim; aqui os dados sumiram distribuídos ao longo das passadas.
- **B — errada:** O modelo processa datas e valores normalmente; a perda é do processo de condensação em cadeia.
- **C — errada:** Limite de batch não tem relação.
- **D — correta.**

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 2 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: extrair e reinjetar dados numéricos evita a perda ao longo de sumarizações sucessivas
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=camada-alvo-errado

---

## Q11 — Resposta correta: **A**

Quando a evidência entre fontes é genuinamente mista, o comportamento pedido é distinguir o que está consolidado do que é contestado — contar fontes não é peso de evidência, e média de valores conflitantes produz um número que nenhuma fonte afirma.

- **A — correta.**
- **B — errada:** Contagem de fontes não é peso de evidência.
- **C — errada:** Média de valores conflitantes produz um número que nenhuma fonte afirma.
- **D — errada:** Confiança auto-reportada como desempate: sinal não confiável.

**Tópicos:** Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: evidência mista pede distinguir consolidado de contestado, não média nem contagem de fontes
- Arquétipos: B=camada-alvo-errado, C=over-engineering, D=sinal-nao-confiavel

---

## Q12 — Resposta correta: **C**

Cada requisição à API é nova e sem estado — o histórico inteiro precisa ser reenviado a cada vez, o que faz o contexto crescer; a solução recomendada é resumir parte ou todo o histórico da conversa.

- **A — errada:** Não há limitação automática de crescimento.
- **B — errada:** A API não guarda a conversa por você nesse modelo de uso.
- **C — correta.**
- **D — errada:** Só a última mensagem perderia todo o contexto.

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: API é stateless — histórico cresce a cada requisição; a solução é resumir a conversa
- Arquétipos: A=feature-inexistente-verossimil, B=feature-inexistente-verossimil, D=extremo-vs-meio

---

## Q13 — Resposta correta: **C**

Diante de uma falha parcial num lote, o certo é preservar os quatro sucessos e declarar explicitamente a lacuna do que falhou — um relatório incompleto mas declarado é melhor que um que esconde a cobertura faltante.

- **A — errada:** Descartar quatro sucessos por uma falha é desperdício.
- **B — errada:** Substituir por saída "parecida" fabrica cobertura.
- **C — correta.**
- **D — errada:** Silenciar a lacuna faz o leitor acreditar em cobertura que não houve — é o erro de proveniência.

**Tópicos:** Propagação de Erros

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: falha parcial preserva sucessos e declara a lacuna explicitamente, nunca a esconde
- Arquétipos: A=over-engineering, B=feature-inexistente-verossimil, D=vazio-ausente

---

## Q14 — Resposta correta: **A**

Ao retomar uma sessão é preciso orientar o modelo explicitamente a se atualizar ou começar com um novo resumo estruturado — ele não sabe quanto tempo passou nem o que mudou; perguntar ao próprio agente o que mudou fora da sessão é perguntar a quem não tem como saber.

- **A — correta.**
- **B — errada:** Perguntar ao agente o que mudou fora da sessão é perguntar a quem não tem como saber.
- **C — errada:** `/compact` resume a conversa; não consulta o repositório.
- **D — errada:** Retomar restaura a **conversa**, não o estado do projeto.

**Tópicos:** Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: retomar sessão exige orientar explicitamente a atualização — o modelo não sabe o que mudou sozinho
- Arquétipos: B=sinal-nao-confiavel, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q15 — Resposta correta: **C**

Combinar o auto-relato de confiança com sinais objetivos — nulos em campos obrigatórios, layout desconhecido, validação cruzada reprovada — é a forma mais defensável de decidir revisão humana; confiança sozinha é o elo fraco, e mexer só no limiar não resolve isso.

- **A — errada:** Subir para 0,99 revisa quase tudo: a fila explode sem ganho de precisão.
- **B — errada:** Revisar tudo elimina o benefício da automação.
- **C — correta.**
- **D — errada:** Baixar o limiar revisa **menos** e deixa passar mais erro.

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: revisão humana deve combinar confiança auto-relatada com sinais objetivos, não confiar só num limiar de confiança
- Arquétipos: A=extremo-vs-meio, B=extremo-vs-meio, D=camada-alvo-errado

---

## Q16 — Resposta correta: **B**

Um objeto de estado estruturado, reinjetado a cada prompt, mantém uma restrição em vigor sem depender de sobreviver à sumarização do histórico — repetir uma vez no meio da conversa não garante isso, e "lembre-se" é instrução, não mecanismo.

- **A — errada:** Repetir uma vez no meio não garante que sobreviva às próximas compactações.
- **B — correta.**
- **C — errada:** Compactação **resume**; detalhes específicos podem sair.
- **D — errada:** "Lembre-se" é instrução, não mecanismo.

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: restrição que precisa valer sempre vive num objeto de estado reinjetado, não depende de sobreviver à compactação do histórico
- Arquétipos: A=extremo-vs-meio, C=camada-alvo-errado, D=probabilistico-vs-garantia

---

## Q17 — Resposta correta: **D**

Se toda afirmação carrega sua fonte, uma afirmação sem fonte fica visível e pode ser tratada de forma diferente na síntese — é a proveniência funcionando como controle contra alucinação, não rodar de novo ou usar mais subagentes.

- **A — errada:** Rodar duas vezes pode reproduzir a mesma invenção.
- **B — errada:** Mais subagentes é mais superfície para alucinação.
- **C — errada:** O agente de síntese checar com conhecimento próprio é alucinação verificando alucinação.
- **D — correta.**

**Tópicos:** Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: exigir fonte em cada afirmação torna visível a afirmação sem fonte, funcionando como controle contra invenção
- Arquétipos: A=sinal-nao-confiavel, B=extremo-vs-meio, C=probabilistico-vs-garantia

---

## Q18 — Resposta correta: **D**

Retenção seletiva — compactar ou remover a parte já resolvida da conversa, mantendo o que ainda opera — é a técnica certa; fork mantém os dois ramos vivos sem reduzir contexto, e limpar tudo perderia mensagens ainda relevantes.

- **A — errada:** Fork mantém os dois vivos — não reduz contexto em nenhum dos ramos.
- **B — errada:** Deixar o modelo pesar relevância é o que já está produzindo o problema.
- **C — errada:** Limpar tudo perde as 10 mensagens relevantes.
- **D — correta.**

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: retenção seletiva remove/compacta o que já foi resolvido, preservando o que ainda está em uso
- Arquétipos: A=camada-alvo-errado, B=sinal-nao-confiavel, C=extremo-vs-meio

---

## Q19 — Resposta correta: **C**

Um erro de limite de taxa é transitório — marcar como `retryable: true` e esperar para repetir é a ação correta; escalar para humano ou marcar como "sem achados" desperdiçam ou escondem uma falha que se resolve sozinha.

- **A — errada:** Escalar a humano um limite de taxa que se resolve sozinho desperdiça atenção humana.
- **B — errada:** Marcar como "sem achados" transforma falha transitória em lacuna permanente e invisível.
- **C — correta.**
- **D — errada:** Abortar tudo por um erro retentável descarta o trabalho dos outros quatro.

**Tópicos:** Erros Estruturados, Propagação de Erros

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: rate limit é transitório e retentável — não deve virar escalonamento nem lacuna silenciosa
- Arquétipos: A=over-engineering, B=vazio-ausente, D=camada-alvo-errado

---

## Q20 — Resposta correta: **C**

Quando a resposta depende de informação que o agente não consegue obter, o comportamento correto é declarar a limitação e escalar ou perguntar — disclaimer genérico em toda resposta dilui o sinal, e responder com confiança sobre uma suposição é o modo de falha mais caro.

- **A — errada:** Disclaimer genérico em toda resposta perde o sinal: quem lê deixa de distinguir os casos reais.
- **B — errada:** Recusar sem explicar não entrega nem a informação nem o caminho.
- **C — correta.**
- **D — errada:** Resposta confiante sobre suposição é o modo de falha mais caro.

**Tópicos:** Escalação de Ambiguidade

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: informação inacessível exige declarar a limitação e escalar, não disclaimer genérico nem resposta confiante sobre suposição
- Arquétipos: A=extremo-vs-meio, B=vazio-ausente, D=sinal-nao-confiavel

---

## Q21 — Resposta correta: **D**

Diante de muito conteúdo de uma vez, o modelo tende a usar bem o início e o fim e ignorar o meio — a solução é verificar e processar em seções; pedir atenção ao meio ou inverter a ordem não mudam a distribuição de atenção.

- **A — errada:** Pedir atenção ao meio não muda a distribuição de atenção em contexto longo.
- **B — errada:** `max_tokens` governa a saída, não a leitura da entrada.
- **C — errada:** Inverter a ordem só troca qual parte é ignorada.
- **D — correta.**

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: "lost in the middle" se resolve processando em seções, não pedindo atenção nem reordenando
- Arquétipos: A=probabilistico-vs-garantia, B=camada-alvo-errado, C=extremo-vs-meio

---

## Q22 — Resposta correta: **D**

Um campo de status/força por afirmação, junto com a fonte, permite ao leitor separar o que é sólido do que é provisório — um score único para o relatório inteiro ou tom cauteloso genérico não localizam qual afirmação específica é frágil.

- **A — errada:** Um score para o relatório inteiro não diz qual afirmação é frágil.
- **B — errada:** Tom cauteloso é estilo, não dado: o leitor não consegue filtrar por ele.
- **C — errada:** Lista de fontes desvinculada das afirmações é o problema, não a solução.
- **D — correta.**

**Tópicos:** Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: status/força por afirmação (não um score único do relatório) é o que permite distinguir sólido de provisório
- Arquétipos: A=vazio-ausente, B=sinal-nao-confiavel, C=camada-alvo-errado

---

## Q23 — Resposta correta: **C**

A auto-compactação usa a folga reservada da janela de contexto para resumir o histórico automaticamente; além disso o desenvolvedor tem `/compact` (resumir sob demanda) e `/clear` (zerar a conversa, preservando `CLAUDE.md` e AutoMemory).

- **A — errada:** Não há troca automática de modelo.
- **B — errada:** Não há descarte silencioso sem sumarização — a folga existe justamente para resumir.
- **C — correta.**
- **D — errada:** A sessão não termina ao atingir o limite.

**Tópicos:** Contexto Longo, Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 1 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: auto-compactação usa buffer reservado; `/compact` e `/clear` são os comandos manuais equivalentes
- Arquétipos: A=feature-inexistente-verossimil, B=vazio-ausente, D=camada-alvo-errado

---

## Q24 — Resposta correta: **A**

Diante da falha de um documento no meio de um lote, o padrão é tentar de novo localmente, usar um fallback, e só escalar se as tentativas se esgotarem — reportando especificamente o que não deu certo, sem derrubar o lote inteiro nem pular em silêncio.

- **A — correta.**
- **B — errada:** Pular em silêncio produz cobertura falsa: ninguém sabe que faltou um.
- **C — errada:** Registro vazio substituto fabrica um dado que não existe.
- **D — errada:** Abortar o lote inteiro por um documento é a propagação indiscriminada que o material critica.

**Tópicos:** Propagação de Erros

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: falha isolada num lote pede retry/fallback/escalonamento e relato específico, não abortar tudo nem esconder
- Arquétipos: B=vazio-ausente, C=feature-inexistente-verossimil, D=extremo-vs-meio

---

## Q25 — Resposta correta: **C**

O schema de saída de um subagente deve ser desenhado no formato mais adequado para a síntese e o relatório a jusante — dados estruturados, prosa e metadados de citação, cada um onde serve; nem "estruturado é sempre melhor" nem "prosa é sempre melhor" se sustentam.

- **A — errada:** Velocidade do subagente não é critério de qualidade da síntese.
- **B — errada:** "Estruturado é sempre melhor" perde nuance narrativa quando ela é o produto.
- **C — correta.**
- **D — errada:** "Prosa é sempre melhor" ignora o caso em que a síntese agrega ou filtra campos.

**Tópicos:** Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: schema de saída do subagente é desenhado conforme a necessidade da síntese a jusante, sem regra universal
- Arquétipos: A=camada-alvo-errado, B=extremo-vs-meio, D=extremo-vs-meio

---

## Q26 — Resposta correta: **B**

Quando o modelo lembra errado um detalhe que está longe no histórico, a técnica certa é a leitura dirigida no ponto de uso — conteúdo distante na conversa não é fonte confiável; recolar a cada mensagem multiplica custo, e "lembre com mais cuidado" não é mecanismo.

- **A — errada:** Recolar o arquivo a cada mensagem multiplica o custo por turno.
- **B — correta.**
- **C — errada:** "Lembre com mais cuidado" não é mecanismo.
- **D — errada:** Temperatura alta aumenta a invenção.

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: leitura dirigida no ponto de uso corrige informação distante e não confiável no histórico
- Arquétipos: A=camada-alvo-errado, C=probabilistico-vs-garantia, D=camada-alvo-errado

---

## Q27 — Resposta correta: **A**

Para os 20% de casos que já escalam, o que muda o tempo de atendimento deles é a qualidade do pacote de handoff — resumo mais longo sem estrutura ou mais tools reduzem quem escala, mas não ajudam quem já está escalando.

- **A — correta.**
- **B — errada:** Resumo mais longo sem estrutura não é o mesmo que contexto + ações + bloqueio.
- **C — errada:** Mais tools reduz o volume escalado, mas não melhora os que ainda escalam — e ainda arrisca degradar a seleção de tools.
- **D — errada:** Elevar a meta não ajuda os casos que continuarão escalando.

**Tópicos:** Enforcement de Workflow

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: para casos já escalados, o que melhora o atendimento é o pacote de handoff estruturado, não reduzir a taxa de escalonamento
- Arquétipos: B=vazio-ausente, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q28 — Resposta correta: **C**

Sem um identificador de fonte viajando com cada achado, a síntese não consegue perceber que duas "confirmações" na verdade vêm da mesma fonte contada duas vezes — deduplicar por similaridade de texto não detecta essa origem comum com redações diferentes.

- **A — errada:** Deduplicar por similaridade de texto não detecta origem comum com redações diferentes.
- **B — errada:** Paralelismo não causa a perda de atribuição.
- **C — correta.**
- **D — errada:** Citar menos fontes não resolve a contagem dupla.

**Tópicos:** Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: identificador de fonte por achado é o que permite detectar corroboração duplicada da mesma origem
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=vazio-ausente

---

## Q29 — Resposta correta: **A**

Quando o custo de errar é alto, o comportamento certo é explicitar a incerteza e o que a resolveria, levando a decisão ao humano — confiança sem base ou um score numérico auto-estimado transferem a decisão sem transferir informação confiável.

- **A — correta.**
- **B — errada:** Confiança sem base é o modo de falha caro.
- **C — errada:** Recusa categórica de um tema inteiro é desproporcional.
- **D — errada:** Score numérico auto-estimado transfere a decisão sem transferir informação confiável.

**Tópicos:** Escalação de Ambiguidade

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: custo alto de erro é o gatilho para declarar incerteza e escalar ao humano, não decidir sozinho
- Arquétipos: B=sinal-nao-confiavel, C=extremo-vs-meio, D=sinal-nao-confiavel

---

## Q30 — Resposta correta: **C**

O estado do pipeline deve viver fora da conversa e ser consultado como fonte de verdade — o histórico é volátil por design; buffer maior só adia o estouro, e desligar compactação não resolve a perda de informação.

- **A — errada:** Buffer maior reserva mais espaço para resumir — não impede a perda de detalhe.
- **B — errada:** Instrução não recupera informação que saiu do contexto.
- **C — correta.**
- **D — errada:** Desligar compactação apenas adia o estouro.

**Tópicos:** Contexto Longo, Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: estado crítico deve viver fora da conversa (fonte de verdade externa), não dentro do histórico volátil
- Arquétipos: A=camada-alvo-errado, B=probabilistico-vs-garantia, D=camada-alvo-errado

---

## Q31 — Resposta correta: **C**

Para trocar de assunto sem misturar contexto da tarefa anterior, `/clear` zera a conversa mas não limpa `CLAUDE.md` nem AutoMemory — `/compact` mantém o fio (contaminação continua, só resumida), e `/resume` carregaria outra sessão.

- **A — errada:** `/rewind` volta dentro da tarefa anterior.
- **B — errada:** `/compact` resume e mantém o fio: a contaminação continua, só que resumida.
- **C — correta.**
- **D — errada:** `/resume` carrega outra sessão — não é o que se pede.

**Tópicos:** Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 2 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: `/clear` zera conversa sem afetar `CLAUDE.md`/AutoMemory — certo para trocar de tarefa sem misturar contexto
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=camada-alvo-errado

---

## Q32 — Resposta correta: **A**

"Prefira o dado mais específico" é uma regra de resolução de conflito declarada e verificável — a síntese deixa de resolver divergência por acaso; não é ranking de confiabilidade de agentes nem verificação de acurácia de fonte.

- **A — correta.**
- **B — errada:** Não é ranking de confiabilidade de agentes.
- **C — errada:** Não verifica acurácia de fonte alguma.
- **D — errada:** Não elimina conflitos; define o que fazer com eles.

**Tópicos:** Coordenador e Subagentes, Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: regra explícita de resolução de conflito (ex.: preferir o dado mais específico) evita resolução arbitrária de divergência
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=vazio-ausente

---

## Q33 — Resposta correta: **D**

Um campo obrigatório que voltou nulo é uma propriedade objetiva e verificável da saída — diferente de uma estimativa que o próprio modelo fez sobre si mesmo; correlação com comprimento ou custo de cálculo não são o critério de qualidade do sinal.

- **A — errada:** Correlação com comprimento não é a razão.
- **B — errada:** Não pega todo erro: um valor errado mas preenchido passa.
- **C — errada:** Custo de cálculo não é o critério de qualidade do sinal.
- **D — correta.**

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S6 — Structured Data Extraction
- Princípio testado: campo obrigatório nulo é sinal objetivo e verificável, diferente de autoavaliação do modelo
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=camada-alvo-errado

---

## Q34 — Resposta correta: **B**

O contexto do coordenador é finito — o subagente existe justamente para absorver o volume de exploração e devolver o essencial com proveniência; "nada se perde" ignora que o contexto estoura, e compactar só depois de encher é remediar um desenho evitável.

- **A — errada:** "Nada se perde" perde tudo quando o contexto estoura.
- **B — correta.**
- **C — errada:** "O mais curto" não é critério: curto e sem fonte é inútil.
- **D — errada:** Compactar depois de encher é remediar um desenho evitável.

**Tópicos:** Spawn de Subagentes, Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: subagente absorve volume e devolve o essencial com proveniência, evitando estourar o contexto finito do coordenador
- Arquétipos: A=vazio-ausente, C=vazio-ausente, D=montante-jusante

---

## Q35 — Resposta correta: **B**

Antes de decidir como agir, ver a quebra de consumo por categoria em `/context` evita compactar o histórico quando o peso real está em resultados de tool (que deveriam ser filtrados na origem) — modelo maior adia sem entender a causa.

- **A — errada:** Modelo maior adia sem entender a causa.
- **B — correta.**
- **C — errada:** Compactar sem olhar pode resumir justamente o que importa e deixar o verdadeiro vilão.
- **D — errada:** Limpar descarta tudo sem diagnóstico.

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: verificar o consumo de contexto por categoria antes de decidir a ação (compactar vs. filtrar tool), não agir às cegas
- Arquétipos: A=camada-alvo-errado, C=sinal-nao-confiavel, D=extremo-vs-meio

---

## Q36 — Resposta correta: **D**

O agente transformou "não consegui olhar" em "olhei e não há nada" — é o caso canônico de tratar ausência de evidência como evidência de ausência; retirar acesso ou tentar de novo com a mesma permissão quebrada não corrige a ambiguidade do retorno.

- **A — errada:** Retirar o acesso não conserta a ambiguidade do retorno.
- **B — errada:** Contexto não tem relação.
- **C — errada:** Mais tentativas com a mesma permissão falham igual.
- **D — correta.**

**Tópicos:** Propagação de Erros

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: "não consegui verificar" e "verifiquei e não há" são estados diferentes — confundi-los trata ausência de evidência como evidência de ausência
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=camada-alvo-errado

---

## Q37 — Resposta correta: **B**

Isolamento em subagente — a exploração acontece num contexto separado e só a conclusão estruturada volta para a sessão principal — evita inundar o contexto principal; explorar na sessão principal já paga o custo antes de qualquer compactação.

- **A — errada:** Explorar na sessão principal já pagou o custo antes de compactar.
- **B — correta.**
- **C — errada:** Colar "o que parece relevante" é seleção manual e frágil.
- **D — errada:** Resumir à mão num segundo terminal não é uma arquitetura.

**Tópicos:** Contexto de Codebase, Spawn de Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: isolar exploração em subagente evita inundar a sessão principal; só a conclusão estruturada retorna
- Arquétipos: A=montante-jusante, C=camada-alvo-errado, D=over-engineering

---

## Q38 — Resposta correta: **B**

O metadado de fonte precisa carregar o tipo de fonte (ex.: marketing do próprio fornecedor vs. fonte independente), não só a existência de uma fonte — é o que permite ao leitor pesar a credibilidade de cada uma; timestamp e score de confiança não dizem isso.

- **A — errada:** Timestamp diz quando o achado foi gerado, não sua qualidade.
- **B — correta.**
- **C — errada:** Score de confiança não diz a natureza da fonte.
- **D — errada:** Booleano "verificado" esconde por quem e contra o quê.

**Tópicos:** Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: metadado de fonte precisa incluir o TIPO de fonte, para o leitor pesar credibilidade, não só confirmar existência
- Arquétipos: A=camada-alvo-errado, C=sinal-nao-confiavel, D=vazio-ausente

---

## Q39 — Resposta correta: **B**

Uma ação irreversível sobre dados de produção exige autorização humana — a confiança do próprio agente não é autorização nem sinal confiável, especialmente porque o modelo pode estar confiante justamente quando erra.

- **A — errada:** O agente revisar a si mesmo mantém o mesmo ponto cego.
- **B — correta.**
- **C — errada:** Confiança alta é justamente o distrator: o modelo é confiante quando erra também.
- **D — errada:** Log posterior documenta o estrago; não o evita.

**Tópicos:** Enforcement de Workflow

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: ação irreversível em produção exige autorização humana, nunca confiança auto-relatada do agente
- Arquétipos: A=montante-jusante, C=sinal-nao-confiavel, D=camada-alvo-errado

---

## Q40 — Resposta correta: **D**

Um schema de saída comum entre os subagentes torna a síntese uma operação sobre estruturas uniformes, em vez de interpretação de formatos improvisados e imprevisíveis — sequenciar a execução ou usar o mesmo modelo não impõem formato nenhum.

- **A — errada:** Sequencial não faz formatos convergirem.
- **B — errada:** Normalizar na síntese é fazer parsing de linguagem natural — anti-pattern do material.
- **C — errada:** Mesmo modelo não impõe mesmo formato.
- **D — correta.**

**Tópicos:** Proveniência e Síntese, Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: schema de saída comum entre agentes evita que a síntese precise interpretar formatos improvisados e variáveis
- Arquétipos: A=camada-alvo-errado, B=montante-jusante, C=camada-alvo-errado

---

## Q41 — Resposta correta: **D**

O critério de retenção seletiva é a função da informação, não sua posição ou tamanho — decisões, restrições e perguntas em aberto continuam operando; uma troca já resolvida ou uma saída de tool já superada, não.

- **A — errada:** Últimas N mensagens descarta uma restrição dada no início e mantém conversa fiada recente.
- **B — errada:** Comprimento não indica importância — tool result gigante é o caso típico do contrário.
- **C — errada:** Reter tudo é o problema que a política existe para resolver.
- **D — correta.**

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: retenção seletiva decide pela função da informação (ainda opera?), não por posição no histórico nem tamanho
- Arquétipos: A=camada-alvo-errado, B=sinal-nao-confiavel, C=extremo-vs-meio

---

## Q42 — Resposta correta: **A**

Sentimento do cliente é sinal não confiável para decidir escalonamento — um cliente calmo pode ter um caso insolúvel e um irritado pode ter um problema trivial; o critério certo é a capacidade de resolução do próprio caso, não o humor de quem escreveu.

- **A — correta.**
- **B — errada:** Pedir desculpas é tom, não roteamento.
- **C — errada:** Adicionar um modelo de sentimento é over-engineering sobre um sinal que não deveria decidir.
- **D — errada:** Volume não é a questão; o critério é que está errado.

**Tópicos:** Escalação de Ambiguidade

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: roteamento de suporte deve se basear em capacidade de resolução do caso, não em sentimento/tom do cliente
- Arquétipos: B=camada-alvo-errado, C=over-engineering, D=camada-alvo-errado

---

## Q43 — Resposta correta: **D**

"Investigado, nada encontrado" e "nunca investigado" são estados diferentes que precisam ficar distinguíveis no relatório — é essa distinção que permite ao leitor saber onde ainda há lacuna de cobertura, em vez de assumir que tudo foi coberto.

- **A — errada:** "Dado indisponível" sem dizer se houve busca reproduz a ambiguidade.
- **B — errada:** Achado-placeholder polui o relatório com algo que ninguém afirmou.
- **C — errada:** Omitir torna as duas situações indistinguíveis.
- **D — correta.**

**Tópicos:** Propagação de Erros

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: relatório precisa distinguir "investigado sem achado" de "nunca investigado" para expor lacunas de cobertura reais
- Arquétipos: A=vazio-ausente, B=feature-inexistente-verossimil, C=vazio-ausente

---

## Q44 — Resposta correta: **D**

Um arquivo de scratchpad no repositório sobrevive à compactação, ao fim da sessão e à troca de máquina — é o estado durável do objetivo; histórico de conversa é o que a compactação resume, e o resumo da auto-compactação é derivado e lossy.

- **A — errada:** Histórico de conversa é o que a compactação resume.
- **B — errada:** O resumo da auto-compactação é derivado e lossy — não é registro.
- **C — errada:** Memória do desenvolvedor não é um mecanismo do sistema.
- **D — correta.**

**Tópicos:** Contexto de Codebase, Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: arquivo de scratchpad no repositório é estado durável que sobrevive a compactação, fim de sessão e troca de máquina
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, C=feature-inexistente-verossimil

---

## Q45 — Resposta correta: **B**

Diante de dois números conflitantes de fontes diferentes, o certo é apresentar os dois com fonte e data, apontando a discrepância — quem lê tem o contexto para decidir qual serve; média entre os dois produz um valor que nenhuma fonte sustenta.

- **A — errada:** Média entre 500 e 1.200 produz 850, que nenhuma fonte sustenta.
- **B — correta.**
- **C — errada:** "Maior é mais atual" é suposição, não evidência.
- **D — errada:** Omitir apaga informação útil por causa de um conflito que podia ser declarado.

**Tópicos:** Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: números conflitantes se apresentam os dois, com fonte e data, apontando a discrepância — nunca média nem suposição
- Arquétipos: A=extremo-vs-meio, C=sinal-nao-confiavel, D=vazio-ausente

---

## Q46 — Resposta correta: **B**

Leitura dirigida guiada por uma busca prévia permite entendimento incremental de um módulo grande sem estourar a janela de contexto — carregar tudo preventivamente é exatamente o consumo que se quer evitar, e ordem alfabética não tem relação com relevância.

- **A — errada:** Carregar o módulo inteiro preventivamente é o consumo que se quer evitar.
- **B — correta.**
- **C — errada:** Ordem alfabética é aleatória em relação à relevância.
- **D — errada:** Conhecimento geral não conhece **este** código.

**Tópicos:** Contexto de Codebase

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: leitura dirigida guiada por busca prévia evita carregar módulo inteiro preventivamente
- Arquétipos: A=over-engineering, C=camada-alvo-errado, D=montante-jusante

---

## Q47 — Resposta correta: **C**

Compactação resume, e detalhes específicos podem sair nesse processo — o que precisa sobreviver com precisão tem que ir para uma forma durável e estruturada, fora do histórico compactável; a resposta antiga foi recebida, mas se perdeu no resumo.

- **A — errada:** Temperatura não explica perda de informação do histórico.
- **B — errada:** A resposta foi recebida; ela se perdeu no resumo.
- **C — correta.**
- **D — errada:** Falso — compactação não é preservação literal.

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S4 — Developer Productivity
- Princípio testado: informação que precisa sobreviver com precisão vai para estado durável, não confia em não ser perdida na compactação
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=camada-alvo-errado

---

## Q48 — Resposta correta: **A**

Ambiguidade por campo, junto com a origem de cada valor extraído, permite ao revisor humano conferir só o que é duvidoso em vez de reler o documento inteiro — nota geral e versão do modelo não localizam o campo problemático.

- **A — correta.**
- **B — errada:** Nota geral não localiza o problema — é o mesmo defeito do score único.
- **C — errada:** Versão do modelo não ajuda na decisão daquele registro.
- **D — errada:** Tempo de processamento não indica confiabilidade.

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: ambiguidade e origem POR CAMPO permitem revisão dirigida, ao contrário de um score geral do documento
- Arquétipos: B=vazio-ausente, C=camada-alvo-errado, D=sinal-nao-confiavel

---

## Q49 — Resposta correta: **D**

Manter o estado da tarefa em curso explícito impede que uma interrupção desloque o contexto necessário para retomá-la depois — responder de dentro do contexto da tarefa mistura os dois assuntos, e abandonar ou recusar perdem o trabalho em curso.

- **A — errada:** Responder de dentro do contexto da tarefa mistura os dois assuntos — o modo de falha típico.
- **B — errada:** Recusar responder é rígido sem necessidade.
- **C — errada:** Abandonar a tarefa perde o trabalho em curso.
- **D — correta.**

**Tópicos:** Contexto Longo, Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: estado de tarefa explícito impede que uma interrupção desloque o contexto necessário para retomar depois
- Arquétipos: A=camada-alvo-errado, B=extremo-vs-meio, C=camada-alvo-errado

---

## Q50 — Resposta correta: **A**

Uma falha idêntica repetida três vezes no mesmo campo é um erro determinístico, não transitório — `retryable` deveria ser falso, e a ação certa é corrigir a entrada ou escalar, não tentar de novo nem mascarar como vazio.

- **A — correta.**
- **B — errada:** Marcar como vazio esconde uma falha real e propaga lacuna silenciosa.
- **C — errada:** Mais tentativas do mesmo erro é desperdício garantido.
- **D — errada:** Trocar o modelo não conserta uma entrada que viola o schema.

**Tópicos:** Erros Estruturados, Propagação de Erros

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: falha idêntica e repetida é determinística (`retryable: false`), não transitória — precisa de correção ou escalonamento
- Arquétipos: B=vazio-ausente, C=over-engineering, D=camada-alvo-errado

---

## Q51 — Resposta correta: **C**

O problema real do relatório é não diferenciar o que é bem estabelecido do que é fracamente sustentado — exatamente o que a síntese deveria preservar; comprimento e número de citações não são o defeito, e excluir um tipo de fonte automaticamente descarta um sinal possivelmente único.

- **A — errada:** Comprimento não tem relação.
- **B — errada:** O número de citações não é o problema; é a indistinção entre elas.
- **C — correta.**
- **D — errada:** Excluir automaticamente um tipo de fonte descarta informação que pode ser o único sinal disponível.

**Tópicos:** Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: relatório precisa diferenciar força de evidência entre afirmações, não tratar tudo com o mesmo peso
- Arquétipos: A=camada-alvo-errado, B=camada-alvo-errado, D=extremo-vs-meio

---

## Q52 — Resposta correta: **B**

Isolamento em subagente permite ao coordenador guardar só os resumos retornados, não a exploração bruta — reduz contexto sem reduzir cobertura, que é exatamente a restrição do enunciado; menos threads reduziria cobertura, o que viola o requisito.

- **A — errada:** Menos threads reduz cobertura — viola o requisito.
- **B — correta.**
- **C — errada:** Achados mais curtos perdem conteúdo; o problema é a exploração bruta, não o achado.
- **D — errada:** Janela maior é custo, não desenho.

**Tópicos:** Spawn de Subagentes, Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: subagente isolado reduz contexto do coordenador sem reduzir cobertura, guardando só o resumo, não a exploração bruta
- Arquétipos: A=extremo-vs-meio, C=camada-alvo-errado, D=camada-alvo-errado

---

## Q53 — Resposta correta: **C**

A tool deveria devolver só o que o papel do agente exige — filtrar na origem é a recomendação, dando a cada agente só o que ele precisa; codificação compacta reduz bytes mas não o ruído conceitual, e resumir depois gasta um turno limpando sujeira evitável.

- **A — errada:** Codificação compacta reduz bytes, não o ruído conceitual dos 198 campos.
- **B — errada:** Resumir depois gasta um turno para limpar sujeira evitável.
- **C — correta.**
- **D — errada:** "Ignorar" não desfaz os tokens já consumidos.

**Tópicos:** Contexto Longo, Descrições de Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: filtrar na origem (na tool) para dar a cada agente só o que seu papel precisa, não depois
- Arquétipos: A=camada-alvo-errado, B=montante-jusante, D=vazio-ausente

---

## Q54 — Resposta correta: **B**

Para tratar divergência entre agentes de forma confiável faltam as duas metades: uma regra de resolução de conflito (ex.: preferir o dado mais específico) e a instrução de preservar a divergência quando ela for genuína, em vez de colapsá-la sempre numa única resposta.

- **A — errada:** Contexto não é a limitação descrita.
- **B — correta.**
- **C — errada:** Score por agente é sinal auto-reportado — não é regra de resolução.
- **D — errada:** Mais subagentes é mais divergência para tratar sem regra.

**Tópicos:** Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: tratar divergência exige regra de resolução E instrução de preservar divergência genuína — as duas coisas, não uma
- Arquétipos: A=camada-alvo-errado, C=sinal-nao-confiavel, D=extremo-vs-meio

---

## Q55 — Resposta correta: **B**

A inspeção de contexto mostra tokens consumidos e disponíveis por categoria, incluindo a folga reservada para a auto-compactação — tempo decorrido e contagem de mensagens não se traduzem em consumo real de tokens.

- **A — errada:** Tempo decorrido não se traduz em consumo de contexto.
- **B — correta.**
- **C — errada:** Esperar acontecer não é planejar.
- **D — errada:** Contar mensagens não mede tokens: uma mensagem pode ser um arquivo inteiro.

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Lembrar
- Dificuldade: Fácil
- Rubrica: 4 = Bloom 1 + integração 0 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: inspeção de contexto mostra consumo por categoria, incluindo o buffer reservado para auto-compact
- Arquétipos: A=camada-alvo-errado, C=probabilistico-vs-garantia, D=camada-alvo-errado

---

## Q56 — Resposta correta: **A**

Quando erros continuam vazando apesar da revisão, o problema costuma ser o sinal de roteamento em si, não o limiar — é preciso descobrir o que de fato distinguia os documentos que vazaram e rotear por isso, não só mexer no limiar do mesmo sinal ruim.

- **A — correta.**
- **B — errada:** Mais capacidade revisa mais do que já estava certo.
- **C — errada:** Remover a revisão porque ela está mal direcionada elimina a única barreira que restava.
- **D — errada:** Baixar o limiar aumenta a fila usando o mesmo sinal que não pega os erros reais.

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 4 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: erros vazando apesar da revisão indicam sinal de roteamento errado, não apenas limiar mal calibrado
- Arquétipos: B=extremo-vs-meio, C=over-engineering, D=extremo-vs-meio

---

## Q57 — Resposta correta: **A**

Sem saber se a busca de fato executou e qual escopo cobriu, "não encontrei" não sustenta a conclusão "não existe" — é a mesma raiz da distinção entre falha de acesso e resultado vazio-válido.

- **A — correta.**
- **B — errada:** O agente de síntese não tem informação melhor que o coordenador sobre isso.
- **C — errada:** É exatamente a inferência inválida.
- **D — errada:** Re-delegar indefinidamente é loop sem critério de parada.

**Tópicos:** Propagação de Erros

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: "não encontrei" só vira "não existe" se se souber que a busca realmente executou e com qual escopo
- Arquétipos: B=camada-alvo-errado, C=sinal-nao-confiavel, D=extremo-vs-meio

---

## Q58 — Resposta correta: **D**

Separar o que veio de evidência direta do que veio de inferência é proveniência aplicada ao próprio raciocínio da síntese — o leitor sabe onde pisar firme; um número de confiança ou um disclaimer genérico não marcam qual frase específica é inferida.

- **A — errada:** Um número de confiança não diz **de onde** veio a conclusão.
- **B — errada:** Estilo cauteloso uniforme achata a distinção: tudo parece igualmente incerto.
- **C — errada:** Disclaimer no fim não marca quais frases são inferidas.
- **D — correta.**

**Tópicos:** Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: distinguir explicitamente afirmação baseada em evidência de afirmação inferida, frase a frase
- Arquétipos: A=vazio-ausente, B=extremo-vs-meio, C=vazio-ausente

---

## Q59 — Resposta correta: **C**

`/compact` resume o que já ficou para trás e libera espaço mantendo o fio de trabalho em curso — é o caso de uso direto quando parte do contexto não é mais necessária; nova sessão descartaria também o que ainda é relevante.

- **A — errada:** Nova sessão descarta também o que ainda é relevante.
- **B — errada:** Aceitar o custo degrada as respostas seguintes.
- **C — correta.**
- **D — errada:** Reler o arquivo que não é mais necessário dobra o custo.

**Tópicos:** Contexto Longo, Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Fácil
- Rubrica: 6 = Bloom 2 + integração 1 + cenário 1 + distratores 2
- Cenário: S4 — Developer Productivity
- Princípio testado: `/compact` libera espaço resumindo o que passou, mantendo o fio de trabalho — não descarta tudo como uma sessão nova
- Arquétipos: A=extremo-vs-meio, B=probabilistico-vs-garantia, D=over-engineering

---

## Q60 — Resposta correta: **A**

Rastrear qual subagente produziu qual achado exige as duas peças juntas — proveniência no próprio dado (identificador de agente e de fonte em cada achado) e o coordenador como ponto único por onde tudo passa; contexto maior ou revisão por outro modelo não substituem isso.

- **A — correta.**
- **B — errada:** Contexto maior não cria rastreabilidade.
- **C — errada:** Revisão posterior por outro modelo não identifica qual subagente produziu o quê.
- **D — errada:** Log verboso com comunicação direta entre subagentes destrói o ponto único de inspeção.

**Tópicos:** Proveniência e Síntese, Coordenador e Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: rastreabilidade exige proveniência no dado E coordenador como ponto único de passagem, as duas juntas
- Arquétipos: B=camada-alvo-errado, C=camada-alvo-errado, D=montante-jusante

---
