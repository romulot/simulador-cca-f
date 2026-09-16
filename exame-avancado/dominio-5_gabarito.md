# Gabarito — Bloco 5

**Domínio 5 — Context Management & Reliability (peso 15%)**

Fontes: `livro01.pdf`, `livro02.pdf`, objetivos de `livro03.md`.

---

### Q1 — Resposta: **C**
`TS 5.6` · objetivo #19 — síntese que preserva incerteza

- **A) ❌** Ordem de execução não afeta como o conflito é representado.
- **B) ❌** Contexto não é o problema: as três informações chegaram.
- **C) ✅** O objetivo é literal: a síntese deve *"preserve source-level uncertainty, distinguishing well-established findings from contested claims rather than collapsing conflicting data into single confident statements"*.
- **D) ❌** Maioria não é critério de verdade — e a fonte mais recente é justamente a que muda o quadro.

**Palavras-gatilho:** `was not reproduced` = não foi reproduzido; `flatly` = categoricamente; `collapsed` = colapsou/fundiu.

---

### Q2 — Resposta: **A**
`TS 5.1` · objetivo #21

- **A) ✅** O objetivo lista *"summarization, sliding windows, structured state objects, and selective retention"*. Decisões que precisam continuar valendo vão para um objeto de estado, não para o fluxo da conversa.
- **B) ❌** Temperatura alta aumenta a variação: piora.
- **C) ❌** Reler as próprias mensagens depende de elas ainda estarem no contexto — que é justamente o que se perdeu.
- **D) ❌** Recomeçar joga fora três horas e repete o mesmo desenho.

**Palavras-gatilho:** `contradicting decisions` = contradizendo decisões.

---

### Q3 — Resposta: **B**
`TS 5.5` · objetivo #22 — roteamento para revisão humana

- **A) ❌** Dia da semana não tem relação com dificuldade.
- **B) ✅** O objetivo pede roteamento *"based on confidence scores, document characteristics, and field-level ambiguity rather than random sampling"*.
- **C) ❌** Dobrar a amostragem aleatória dobra o custo e continua sem mirar no que erra.
- **D) ❌** Comprimento é proxy fraco: documento longo e padronizado extrai bem.

**Palavras-gatilho:** `at random` = aleatoriamente.

---

### Q4 — Resposta: **D**
`TS 5.3 / 2.2` · Access Failures vs Valid Empty Results

- **A) ❌** Não houve estouro de contexto.
- **B) ❌** Exceção mataria o pipeline inteiro por uma credencial — pior.
- **C) ❌** Mais subagentes com a mesma credencial quebrada falham igual.
- **D) ✅** Chave expirada é `access_failure`; "nenhum resultado" é `valid_empty`. Confundi-los faz o coordenador concluir que um tema não tem cobertura quando na verdade ninguém olhou.

**Palavras-gatilho:** `expired` = expirada; `concludes` = conclui.

---

### Q5 — Resposta: **B**
`TS 5.4` · objetivo #20

- **A) ❌** Sessão eterna com auto-compact degrada por sumarização progressiva.
- **B) ✅** O objetivo nomeia exatamente o trio: *"subagent isolation, scratchpad files, and targeted file reading — to sustain coherent codebase exploration across sessions exceeding context limits."*
- **C) ❌** "Memorizar" não é um mecanismo.
- **D) ❌** 500 mil linhas não cabem, e "trabalhar de memória" é alucinar.

**Palavras-gatilho:** `sustain` = sustentar; `exceed the context limit` = excedem o limite de contexto.

---

### Q6 — Resposta: **A**
`TS 5.6` · Raw Findings Dilemma

- **A) ✅** *"Structured formats keep content and metadata travelling together."* A proveniência precisa viajar **com** a afirmação, não ao lado dela.
- **B) ❌** Bibliografia no fim não diz qual fonte sustenta qual afirmação.
- **C) ❌** Contar fontes não permite verificar nenhuma.
- **D) ❌** "Seja cuidadoso" é instrução vaga.

**Palavras-gatilho:** `no indication of where it came from` = nenhuma indicação de onde veio.

---

### Q7 — Resposta: **D**
`TS 5.2 / 5.5` · Handoff Protocol

- **A) ❌** Encerrar sem escalar abandona o caso.
- **B) ❌** Repetir tools que já falharam é loop improdutivo com o cliente esperando.
- **C) ❌** Pedir para o cliente repetir tudo é justamente a experiência que o handoff evita.
- **D) ✅** *"A structured package the agent assembles before escalating — includes context, actions, blockers"*, para que o humano não precise vasculhar o histórico.

**Palavras-gatilho:** `still cannot resolve` = ainda assim não consegue resolver.

---

### Q8 — Resposta: **A**
`TS 5.2` · ambiguidade

- **A) ✅** As três leituras levam a trabalhos materialmente diferentes — é o caso em que perguntar antes é mais barato que desfazer depois.
- **B) ❌** Fazer as três multiplica o trabalho e o risco.
- **C) ❌** Declarar ambiguidade e parar sem oferecer as opções empurra o problema de volta sem ajudar.
- **D) ❌** Escolher em silêncio esconde a decisão de quem tinha autoridade para tomá-la.

**Palavras-gatilho:** `genuinely ambiguous` = genuinamente ambíguo; `materially different` = materialmente diferentes.

---

### Q9 — Resposta: **B**
`TS 5.1` · Tool Result Bloat

- **A) ❌** Os tokens já entraram; "focar" não os remove.
- **B) ✅** *"Filter only the information you need and pass that context."* O filtro é na tool, antes de entrar no contexto.
- **C) ❌** Chamar menos vezes não reduz o tamanho de cada resposta.
- **D) ❌** Janela maior é pagar mais pelo mesmo ruído.

**Palavras-gatilho:** `degrades` = degrada.

---

### Q10 — Resposta: **D**
`TS 5.1` · Progressive Summarization

- **A) ❌** Truncamento cortaria o fim; aqui os dados sumiram distribuídos ao longo das passadas.
- **B) ❌** O modelo processa datas e valores normalmente; a perda é do processo de condensação em cadeia.
- **C) ❌** Limite de batch não tem relação.
- **D) ✅** *"Numerical and price data can get summarized out, e.g. dates, percentages, numbers. Solution: extract key data, and directly place back into next prompt."*

**Palavras-gatilho:** `over several passes` = ao longo de várias passadas.

---

### Q11 — Resposta: **A**
`TS 5.6` · objetivo #19

- **A) ✅** Distinguir o consolidado do contestado é o comportamento pedido quando a evidência é genuinamente mista.
- **B) ❌** Contagem de fontes não é peso de evidência.
- **C) ❌** Média de valores conflitantes produz um número que nenhuma fonte afirma.
- **D) ❌** Confiança auto-reportada como desempate: sinal não confiável.

**Palavras-gatilho:** `genuinely mixed` = genuinamente mista; `choosing a winner silently` = escolher um vencedor silenciosamente.

---

### Q12 — Resposta: **C**
`TS 5.1` · Passing Complete Conversation History

- **A) ❌** Não há limitação automática de crescimento.
- **B) ❌** A API não guarda a conversa por você nesse modelo de uso.
- **C) ✅** *"Each request to the model is new, and so you have to pass the whole conversation each time, but this can grow the context really long. Solution: summarize parts or all of your conversation history."*
- **D) ❌** Só a última mensagem perderia todo o contexto.

**Palavras-gatilho:** `stateless` = sem estado.

---

### Q13 — Resposta: **C**
`TS 5.3 / 5.6`

- **A) ❌** Descartar quatro sucessos por uma falha é desperdício.
- **B) ❌** Substituir por saída "parecida" fabrica cobertura.
- **C) ✅** Preserva o que deu certo **e** declara a lacuna. Relatório que esconde cobertura faltante é pior que relatório incompleto declarado.
- **D) ❌** Silenciar a lacuna faz o leitor acreditar em cobertura que não houve — é o erro de proveniência.

**Palavras-gatilho:** `could not be covered` = não pôde ser coberto.

---

### Q14 — Resposta: **A**
`TS 1.7 / 5.1` · objetivo #2

- **A) ✅** *"When resuming a session you need to tell Claude to get up to speed or start fresh with a new structured summary."* Claude não sabe quanto tempo passou nem o que mudou.
- **B) ❌** Perguntar ao agente o que mudou fora da sessão é perguntar a quem não tem como saber.
- **C) ❌** `/compact` resume a conversa; não consulta o repositório.
- **D) ❌** Retomar restaura a **conversa**, não o estado do projeto.

**Palavras-gatilho:** `stale` = desatualizadas.

---

### Q15 — Resposta: **C**
`TS 5.5` · objetivo #22

- **A) ❌** Subir para 0,99 revisa quase tudo: a fila explode sem ganho de precisão.
- **B) ❌** Revisar tudo elimina o benefício da automação.
- **C) ✅** Combinar o auto-relato com sinais objetivos — nulos em campos obrigatórios, layout desconhecido, validação cruzada reprovada — é o que o objetivo pede. Confiança sozinha é o elo fraco.
- **D) ❌** Baixar o limiar revisa **menos** e deixa passar mais erro.

**Palavras-gatilho:** `most defensible` = mais defensável; `self-reported` = auto-relatado.

---

### Q16 — Resposta: **B**
`TS 5.1` · objetivo #21

- **A) ❌** Repetir uma vez no meio não garante que sobreviva às próximas compactações.
- **B) ✅** Objeto de estado estruturado reinjetado a cada prompt: a restrição não depende de sobreviver à sumarização do histórico.
- **C) ❌** Compactação **resume**; detalhes específicos podem sair.
- **D) ❌** "Lembre-se" é instrução, não mecanismo.

**Palavras-gatilho:** `keeps the constraint in force` = mantém a restrição em vigor.

---

### Q17 — Resposta: **D**
`TS 5.6` · objetivo #18

- **A) ❌** Rodar duas vezes pode reproduzir a mesma invenção.
- **B) ❌** Mais subagentes é mais superfície para alucinação.
- **C) ❌** O agente de síntese checar com conhecimento próprio é alucinação verificando alucinação.
- **D) ✅** Se toda afirmação carrega fonte, a afirmação **sem** fonte fica visível e pode ser tratada de forma diferente na síntese. É a proveniência funcionando como controle.

**Palavras-gatilho:** `accepted as fact` = aceita como fato; `unsourced` = sem fonte.

---

### Q18 — Resposta: **D**
`TS 5.1 / 5.4` · objetivo #21

- **A) ❌** Fork mantém os dois vivos — não reduz contexto em nenhum dos ramos.
- **B) ❌** Deixar o modelo pesar relevância é o que já está produzindo o problema.
- **C) ❌** Limpar tudo perde as 10 mensagens relevantes.
- **D) ✅** Retenção seletiva: compactar ou remover a parte resolvida, mantendo o que ainda opera. É a técnica nomeada no objetivo.

**Palavras-gatilho:** `resolved` = resolvido; `selectively` = seletivamente.

---

### Q19 — Resposta: **C**
`TS 5.3 / 2.2` · Retryable Flag

- **A) ❌** Escalar a humano um limite de taxa que se resolve sozinho desperdiça atenção humana.
- **B) ❌** Marcar como "sem achados" transforma falha transitória em lacuna permanente e invisível.
- **C) ✅** *"retryable: true → safe to retry."* Rate limit é transitório: esperar e repetir é a ação correta.
- **D) ❌** Abortar tudo por um erro retentável descarta o trabalho dos outros quatro.

**Palavras-gatilho:** `rate limited` = limitado por taxa.

---

### Q20 — Resposta: **C**
`TS 5.2 / 5.6`

- **A) ❌** Disclaimer genérico em toda resposta perde o sinal: quem lê deixa de distinguir os casos reais.
- **B) ❌** Recusar sem explicar não entrega nem a informação nem o caminho.
- **C) ✅** Declarar a limitação e escalar/perguntar é o comportamento correto quando a resposta depende de informação inacessível.
- **D) ❌** Resposta confiante sobre suposição é o modo de falha mais caro.

**Palavras-gatilho:** `cannot obtain` = não consegue obter.

---

### Q21 — Resposta: **D**
`TS 5.1` · Lost in the Middle

- **A) ❌** Pedir atenção ao meio não muda a distribuição de atenção em contexto longo.
- **B) ❌** `max_tokens` governa a saída, não a leitura da entrada.
- **C) ❌** Inverter a ordem só troca qual parte é ignorada.
- **D) ✅** *"It tends to use the first few and last pages and ignore the middle content. Solution: check and process in sections."*

**Palavras-gatilho:** `underuses` = subutiliza.

---

### Q22 — Resposta: **D**
`TS 5.6` · objetivos #18 e #19

- **A) ❌** Um score para o relatório inteiro não diz qual afirmação é frágil.
- **B) ❌** Tom cauteloso é estilo, não dado: o leitor não consegue filtrar por ele.
- **C) ❌** Lista de fontes desvinculada das afirmações é o problema, não a solução.
- **D) ✅** Campo de status/força da afirmação + fonte permite ao leitor separar sólido de provisório. É proveniência com granularidade.

**Palavras-gatilho:** `solid` = sólidas; `provisional` = provisórias.

---

### Q23 — Resposta: **C**
`TS 5.4` · auto-compact / `/compact` / `/clear`

- **A) ❌** Não há troca automática de modelo.
- **B) ❌** Não há descarte silencioso sem sumarização — a folga existe justamente para resumir.
- **C) ✅** A auto-compactação usa a folga reservada para resumir o histórico; além disso o desenvolvedor tem `/compact` (resumir) e `/clear` (zerar, preservando `CLAUDE.md` e AutoMemory).
- **D) ❌** A sessão não termina ao atingir o limite.

**Palavras-gatilho:** `mid-task` = no meio da tarefa.

---

### Q24 — Resposta: **A**
`TS 5.3` · Subagent Failure Recovery

- **A) ✅** *"Retry locally, try fallback, escalate only if exhausted"* — e reportar **especificamente** o que não conseguiu, sem derrubar o lote.
- **B) ❌** Pular em silêncio produz cobertura falsa: ninguém sabe que faltou um.
- **C) ❌** Registro vazio substituto fabrica um dado que não existe.
- **D) ❌** Abortar o lote inteiro por um documento é a propagação indiscriminada que o material critica.

**Palavras-gatilho:** `mid-batch` = no meio do lote.

---

### Q25 — Resposta: **C**
`TS 5.6` · objetivo #18

- **A) ❌** Velocidade do subagente não é critério de qualidade da síntese.
- **B) ❌** "Estruturado é sempre melhor" perde nuance narrativa quando ela é o produto.
- **C) ✅** O objetivo pede desenhar o schema de saída *"in the format best suited to downstream synthesis and reporting"* — dados estruturados, prosa e metadados de citação, cada um onde serve.
- **D) ❌** "Prosa é sempre melhor" ignora o caso em que a síntese agrega ou filtra campos.

**Palavras-gatilho:** `downstream` = a jusante; `nuance` = nuance.

---

### Q26 — Resposta: **B**
`TS 5.1 / 5.4`

- **A) ❌** Recolar o arquivo a cada mensagem multiplica o custo por turno.
- **B) ✅** Leitura dirigida no ponto de uso é a técnica do objetivo #20. Conteúdo distante no histórico não é fonte confiável.
- **C) ❌** "Lembre com mais cuidado" não é mecanismo.
- **D) ❌** Temperatura alta aumenta a invenção.

**Palavras-gatilho:** `misremembers` = lembra errado.

---

### Q27 — Resposta: **A**
`TS 5.2 / 5.5` · Handoff Protocol

- **A) ✅** A pergunta é sobre os 20% que **já** escalaram: o que muda o tempo de atendimento deles é o pacote de handoff, não a taxa de resolução.
- **B) ❌** Resumo mais longo sem estrutura não é o mesmo que contexto + ações + bloqueio.
- **C) ❌** Mais tools reduz o volume escalado, mas não melhora os que ainda escalam — e ainda arrisca degradar a seleção de tools.
- **D) ❌** Elevar a meta não ajuda os casos que continuarão escalando.

**Palavras-gatilho:** `handle time` = tempo de atendimento; `largest effect on the escalated cases` = maior efeito nos casos escalados.

---

### Q28 — Resposta: **C**
`TS 5.6` · Raw Findings Dilemma

- **A) ❌** Deduplicar por similaridade de texto não detecta origem comum com redações diferentes.
- **B) ❌** Paralelismo não causa a perda de atribuição.
- **C) ✅** Sem identificador de fonte viajando com cada achado, a síntese não tem como perceber que duas "confirmações" são a mesma fonte contada duas vezes.
- **D) ❌** Citar menos fontes não resolve a contagem dupla.

**Palavras-gatilho:** `independently corroborated` = corroborado independentemente.

---

### Q29 — Resposta: **A**
`TS 5.2 / 5.5`

- **A) ✅** Explicitar a incerteza **e o que a resolveria**, e levar a decisão ao humano. Custo alto de erro é o gatilho de revisão humana.
- **B) ❌** Confiança sem base é o modo de falha caro.
- **C) ❌** Recusa categórica de um tema inteiro é desproporcional.
- **D) ❌** Score numérico auto-estimado transfere a decisão sem transferir informação confiável.

**Palavras-gatilho:** `cost of being wrong is high` = o custo de errar é alto.

---

### Q30 — Resposta: **C**
`TS 5.1 / 1.7` · objetivo #9

- **A) ❌** Buffer maior reserva mais espaço para resumir — não impede a perda de detalhe.
- **B) ❌** Instrução não recupera informação que saiu do contexto.
- **C) ✅** Estado do pipeline fora da conversa, consultado como fonte de verdade. O histórico é volátil por design.
- **D) ❌** Desligar compactação apenas adia o estouro.

**Palavras-gatilho:** `entirely in the conversation` = inteiramente na conversa.

---

### Q31 — Resposta: **C**
`TS 5.4` · Compact and Clear

- **A) ❌** `/rewind` volta dentro da tarefa anterior.
- **B) ❌** `/compact` resume e mantém o fio: a contaminação continua, só que resumida.
- **C) ✅** `/clear` zera a conversa e **não** limpa `CLAUDE.md` nem AutoMemory — exatamente o que se quer ao trocar de tarefa.
- **D) ❌** `/resume` carrega outra sessão — não é o que se pede.

**Palavras-gatilho:** `mix concerns from both` = misturam assuntos dos dois.

---

### Q32 — Resposta: **A**
`TS 5.6 / 1.2`

- **A) ✅** "Prefira o dado mais específico" é regra declarada e verificável — a síntese deixa de resolver conflito por acaso.
- **B) ❌** Não é ranking de confiabilidade de agentes.
- **C) ❌** Não verifica acurácia de fonte alguma.
- **D) ❌** Não elimina conflitos; define o que fazer com eles.

**Palavras-gatilho:** `arbitrarily` = arbitrariamente.

---

### Q33 — Resposta: **D**
`TS 5.5` · objetivo #22

- **A) ❌** Correlação com comprimento não é a razão.
- **B) ❌** Não pega todo erro: um valor errado mas preenchido passa.
- **C) ❌** Custo de cálculo não é o critério de qualidade do sinal.
- **D) ✅** Campo obrigatório que voltou null é propriedade objetiva e verificável da saída — diferente de uma estimativa que o modelo fez sobre si mesmo.

**Palavras-gatilho:** `objective property` = propriedade objetiva.

---

### Q34 — Resposta: **B**
`TS 5.6 / 5.1` · objetivo #18

- **A) ❌** "Nada se perde" perde tudo quando o contexto estoura.
- **B) ✅** O contexto do coordenador é finito. O subagente existe justamente para absorver o volume e devolver o essencial **com proveniência**.
- **C) ❌** "O mais curto" não é critério: curto e sem fonte é inútil.
- **D) ❌** Compactar depois de encher é remediar um desenho evitável.

**Palavras-gatilho:** `decisive` = decisiva.

---

### Q35 — Resposta: **B**
`TS 5.4` · `/context`

- **A) ❌** Modelo maior adia sem entender a causa.
- **B) ✅** Ver a quebra por categoria antes de agir: pode ser que o peso esteja em tool results (filtrar na tool) e não no histórico (compactar).
- **C) ❌** Compactar sem olhar pode resumir justamente o que importa e deixar o verdadeiro vilão.
- **D) ❌** Limpar descarta tudo sem diagnóstico.

**Palavras-gatilho:** `before deciding how to proceed` = antes de decidir como prosseguir.

---

### Q36 — Resposta: **D**
`TS 5.3 / 2.2` · Access Failures vs Valid Empty Results

- **A) ❌** Retirar o acesso não conserta a ambiguidade do retorno.
- **B) ❌** Contexto não tem relação.
- **C) ❌** Mais tentativas com a mesma permissão falham igual.
- **D) ✅** O agente transformou "não consegui olhar" em "olhei e não há nada". É o caso canônico: ausência de evidência virou evidência de ausência.

**Palavras-gatilho:** `absence of evidence as evidence of absence` = ausência de evidência como evidência de ausência.

---

### Q37 — Resposta: **B**
`TS 5.4 / 1.3` · objetivo #20

- **A) ❌** Explorar na sessão principal já pagou o custo antes de compactar.
- **B) ✅** Isolamento em subagente: a exploração acontece num contexto separado e só a conclusão estruturada volta. É o mecanismo do objetivo.
- **C) ❌** Colar "o que parece relevante" é seleção manual e frágil.
- **D) ❌** Resumir à mão num segundo terminal não é uma arquitetura.

**Palavras-gatilho:** `without flooding it` = sem inundá-la.

---

### Q38 — Resposta: **B**
`TS 5.6` · objetivo #18

- **A) ❌** Timestamp diz quando o achado foi gerado, não sua qualidade.
- **B) ✅** O metadado de fonte precisa carregar **tipo** de fonte, não só existência — é o que permite ao leitor pesar material de marketing contra fonte independente.
- **C) ❌** Score de confiança não diz a natureza da fonte.
- **D) ❌** Booleano "verificado" esconde por quem e contra o quê.

**Palavras-gatilho:** `vendor's own marketing page` = página de marketing do próprio fornecedor.

---

### Q39 — Resposta: **B**
`TS 5.5`

- **A) ❌** O agente revisar a si mesmo mantém o mesmo ponto cego.
- **B) ✅** Ação irreversível sobre dados de produção exige autorização humana. Confiança do agente não é autorização — nem é sinal confiável.
- **C) ❌** Confiança alta é justamente o distrator: o modelo é confiante quando erra também.
- **D) ❌** Log posterior documenta o estrago; não o evita.

**Palavras-gatilho:** `irreversible` = irreversíveis; `not a substitute for authorization` = não substitui autorização.

---

### Q40 — Resposta: **D**
`TS 5.6` · objetivo #18

- **A) ❌** Sequencial não faz formatos convergirem.
- **B) ❌** Normalizar na síntese é fazer parsing de linguagem natural — anti-pattern do material.
- **C) ❌** Mesmo modelo não impõe mesmo formato.
- **D) ✅** Schema comum de saída torna a síntese uma operação sobre estruturas uniformes, em vez de interpretação de cinco formatos improvisados.

**Palavras-gatilho:** `ad-hoc` = improvisado; `varies unpredictably` = varia de forma imprevisível.

---

### Q41 — Resposta: **D**
`TS 5.1` · objetivo #21 — retenção seletiva

- **A) ❌** Últimas N mensagens descarta uma restrição dada no início e mantém conversa fiada recente.
- **B) ❌** Comprimento não indica importância — tool result gigante é o caso típico do contrário.
- **C) ❌** Reter tudo é o problema que a política existe para resolver.
- **D) ✅** O critério é **função**, não posição nem tamanho: decisões, restrições e perguntas em aberto continuam operando; troca resolvida e saída de tool superada não.

**Palavras-gatilho:** `superseded` = superada/substituída.

---

### Q42 — Resposta: **A**
`TS 5.2`

- **A) ✅** Sentimento é sinal não confiável — cliente calmo pode ter caso insolúvel e cliente irritado pode ter problema trivial. O critério é **capacidade de resolução**, não humor.
- **B) ❌** Pedir desculpas é tom, não roteamento.
- **C) ❌** Adicionar um modelo de sentimento é over-engineering sobre um sinal que não deveria decidir.
- **D) ❌** Volume não é a questão; o critério é que está errado.

**Palavras-gatilho:** `angry language` = linguagem irritada; `valid criticism` = crítica procedente.

---

### Q43 — Resposta: **D**
`TS 5.6 / 1.6`

- **A) ❌** "Dado indisponível" sem dizer se houve busca reproduz a ambiguidade.
- **B) ❌** Achado-placeholder polui o relatório com algo que ninguém afirmou.
- **C) ❌** Omitir torna as duas situações indistinguíveis.
- **D) ✅** "Investigado, nada encontrado" e "nunca investigado" são estados diferentes — e é a distinção que permite ao leitor saber onde há lacuna de cobertura.

**Palavras-gatilho:** `distinct from` = distinto de.

---

### Q44 — Resposta: **D**
`TS 5.4` · objetivo #20 — scratchpad

- **A) ❌** Histórico de conversa é o que a compactação resume.
- **B) ❌** O resumo da auto-compactação é derivado e lossy — não é registro.
- **C) ❌** Memória do desenvolvedor não é um mecanismo do sistema.
- **D) ✅** Arquivo no repositório sobrevive a compactação, a fim de sessão e a troca de máquina. É o estado durável do objetivo.

**Palavras-gatilho:** `survives` = sobrevive a.

---

### Q45 — Resposta: **B**
`TS 5.6` · objetivo #19

- **A) ❌** Média entre 500 e 1.200 produz 850, que nenhuma fonte sustenta.
- **B) ✅** Apresentar os dois com fonte e data, apontando a discrepância — é o leitor que tem contexto para decidir qual serve.
- **C) ❌** "Maior é mais atual" é suposição, não evidência.
- **D) ❌** Omitir apaga informação útil por causa de um conflito que podia ser declarado.

**Palavras-gatilho:** `discrepancy` = discrepância; `dated sources` = fontes datadas.

---

### Q46 — Resposta: **B**
`TS 5.4` · objetivo #17 / #20

- **A) ❌** Carregar o módulo inteiro preventivamente é o consumo que se quer evitar.
- **B) ✅** Leitura dirigida guiada por busca prévia: entendimento incremental sem estourar a janela.
- **C) ❌** Ordem alfabética é aleatória em relação à relevância.
- **D) ❌** Conhecimento geral não conhece **este** código.

**Palavras-gatilho:** `preemptively` = preventivamente.

---

### Q47 — Resposta: **C**
`TS 5.1 / 5.4`

- **A) ❌** Temperatura não explica perda de informação do histórico.
- **B) ❌** A resposta foi recebida; ela se perdeu no resumo.
- **C) ✅** Compactação **resume**: detalhes específicos podem sair. O que precisa sobreviver vai para forma durável e estruturada.
- **D) ❌** Falso — compactação não é preservação literal.

**Palavras-gatilho:** `already answered` = já respondida.

---

### Q48 — Resposta: **A**
`TS 5.5 / 5.6` · objetivos #22 e #26

- **A) ✅** Ambiguidade por campo + origem de cada valor permite ao revisor conferir só o que é duvidoso, em vez de reler o documento inteiro.
- **B) ❌** Nota geral não localiza o problema — é o mesmo defeito do score único.
- **C) ❌** Versão do modelo não ajuda na decisão daquele registro.
- **D) ❌** Tempo de processamento não indica confiabilidade.

**Palavras-gatilho:** `quickly` = rapidamente; `field-level` = por campo.

---

### Q49 — Resposta: **D**
`TS 5.1`

- **A) ❌** Responder de dentro do contexto da tarefa mistura os dois assuntos — o modo de falha típico.
- **B) ❌** Recusar responder é rígido sem necessidade.
- **C) ❌** Abandonar a tarefa perde o trabalho em curso.
- **D) ✅** Manter o estado da tarefa explícito impede que a interrupção desloque o contexto necessário para retomar.

**Palavras-gatilho:** `displacing` = deslocando.

---

### Q50 — Resposta: **A**
`TS 5.3 / 2.2`

- **A) ✅** Falha idêntica três vezes no mesmo campo é erro determinístico, não transitório. `retryable` deveria ser falso: corrigir a entrada ou escalar.
- **B) ❌** Marcar como vazio esconde uma falha real e propaga lacuna silenciosa.
- **C) ❌** Mais tentativas do mesmo erro é desperdício garantido.
- **D) ❌** Trocar o modelo não conserta uma entrada que viola o schema.

**Palavras-gatilho:** `identically` = de forma idêntica.

---

### Q51 — Resposta: **C**
`TS 5.6` · objetivo #19

- **A) ❌** Comprimento não tem relação.
- **B) ❌** O número de citações não é o problema; é a indistinção entre elas.
- **C) ✅** O relatório não diferencia bem-estabelecido de fracamente sustentado — exatamente o que o objetivo pede para preservar.
- **D) ❌** Excluir automaticamente um tipo de fonte descarta informação que pode ser o único sinal disponível.

**Palavras-gatilho:** `same weight` = mesmo peso; `weakly supported` = fracamente sustentadas.

---

### Q52 — Resposta: **B**
`TS 5.4 / 1.2` · objetivo #20

- **A) ❌** Menos threads reduz cobertura — viola o requisito.
- **B) ✅** Isolamento em subagente: o coordenador guarda só os resumos retornados, não a exploração bruta. Reduz contexto **sem** reduzir cobertura, que é a restrição do enunciado.
- **C) ❌** Achados mais curtos perdem conteúdo; o problema é a exploração bruta, não o achado.
- **D) ❌** Janela maior é custo, não desenho.

**Palavras-gatilho:** `without losing coverage` = sem perder cobertura.

---

### Q53 — Resposta: **C**
`TS 5.1 / 2.3` · Tool Result Bloat

- **A) ❌** Codificação compacta reduz bytes, não o ruído conceitual dos 198 campos.
- **B) ❌** Resumir depois gasta um turno para limpar sujeira evitável.
- **C) ✅** A tool devolve o que o papel exige. Filtrar na origem é a recomendação; e casa com dar a cada agente só o que ele precisa.
- **D) ❌** "Ignorar" não desfaz os tokens já consumidos.

**Palavras-gatilho:** `needs the account tier` = precisa do nível da conta.

---

### Q54 — Resposta: **B**
`TS 5.6` · objetivos #19 e #31

- **A) ❌** Contexto não é a limitação descrita.
- **B) ✅** Faltam as duas metades: a regra de resolução de conflito (ex.: preferir o dado mais específico) **e** a instrução de preservar a divergência quando ela for genuína, em vez de colapsá-la.
- **C) ❌** Score por agente é sinal auto-reportado — não é regra de resolução.
- **D) ❌** Mais subagentes é mais divergência para tratar sem regra.

**Palavras-gatilho:** `for reliable handling of disagreement` = para tratar divergência de forma confiável.

---

### Q55 — Resposta: **B**
`TS 5.4` · `/context`

- **A) ❌** Tempo decorrido não se traduz em consumo de contexto.
- **B) ✅** A inspeção de contexto mostra tokens consumidos e disponíveis por categoria, **incluindo** a folga reservada para a auto-compactação.
- **C) ❌** Esperar acontecer não é planejar.
- **D) ❌** Contar mensagens não mede tokens: uma mensagem pode ser um arquivo inteiro.

**Palavras-gatilho:** `near the point where` = perto do ponto em que.

---

### Q56 — Resposta: **A**
`TS 5.5` · objetivo #22

- **A) ✅** O sinal está errado, não o limiar: os erros que vazaram não eram capturados por ele. É preciso descobrir o que distinguia **aqueles** documentos e rotear por isso.
- **B) ❌** Mais capacidade revisa mais do que já estava certo.
- **C) ❌** Remover a revisão porque ela está mal direcionada elimina a única barreira que restava.
- **D) ❌** Baixar o limiar aumenta a fila usando o mesmo sinal que não pega os erros reais.

**Palavras-gatilho:** `never flagged` = nunca sinalizou; `re-derive` = rederivar.

---

### Q57 — Resposta: **A**
`TS 5.3 / 5.6`

- **A) ✅** Sem saber se a busca **executou** e qual escopo cobriu, "não encontrei" não sustenta "não existe". É a mesma raiz de `access_failure` vs `valid_empty`.
- **B) ❌** O agente de síntese não tem informação melhor que o coordenador sobre isso.
- **C) ❌** É exatamente a inferência inválida.
- **D) ❌** Re-delegar indefinidamente é loop sem critério de parada.

**Palavras-gatilho:** `cannot be concluded` = não se pode concluir.

---

### Q58 — Resposta: **D**
`TS 5.6`

- **A) ❌** Um número de confiança não diz **de onde** veio a conclusão.
- **B) ❌** Estilo cauteloso uniforme achata a distinção: tudo parece igualmente incerto.
- **C) ❌** Disclaimer no fim não marca quais frases são inferidas.
- **D) ✅** Separar o que veio de evidência do que veio de inferência é proveniência aplicada ao raciocínio — o leitor sabe onde pisar firme.

**Palavras-gatilho:** `rests on an assumption` = repousa sobre uma suposição.

---

### Q59 — Resposta: **C**
`TS 5.4`

- **A) ❌** Nova sessão descarta também o que ainda é relevante.
- **B) ❌** Aceitar o custo degrada as respostas seguintes.
- **C) ✅** `/compact` resume o que ficou para trás e libera espaço mantendo o fio de trabalho — é o caso de uso direto.
- **D) ❌** Reler o arquivo que não é mais necessário dobra o custo.

**Palavras-gatilho:** `no longer needs` = não precisa mais.

---

### Q60 — Resposta: **A**
`TS 5.6 / 1.2` · proveniência + observabilidade

- **A) ✅** As duas peças juntas: proveniência **no dado** (identificador de agente e de fonte em cada achado) e o coordenador como ponto único por onde tudo passa — *"every message in, every message out, every failure"*.
- **B) ❌** Contexto maior não cria rastreabilidade.
- **C) ❌** Revisão posterior por outro modelo não identifica qual subagente produziu o quê.
- **D) ❌** Log verboso com comunicação direta entre subagentes destrói o ponto único de inspeção.

**Palavras-gatilho:** `trace which subagent` = rastrear qual subagente.

---

## Autoavaliação

| Acertos | Leitura |
|---|---|
| 54–60 (90%+) | Domínio sólido. |
| 43–53 (72–89%) | Faixa de aprovação. Disseque cada erro. |
| 30–42 (50–71%) | Releia problemas de contexto longo (5.1), proveniência (5.6) e roteamento humano (5.5). |
| < 30 | Refaça a teoria antes de nova rodada. |

**Os três reflexos deste domínio:**
1. **Vazio não é vazio.** `valid_empty` ≠ `access_failure` — e confundir os dois produz relatório confiante sobre nada.
2. **Conteúdo e proveniência viajam juntos.** Prosa entre agentes perde atribuição; estrutura preserva.
3. **Sinal auto-reportado é fraco.** Confiança do modelo e sentimento do cliente não decidem roteamento — fatos objetivos sobre a saída decidem.
