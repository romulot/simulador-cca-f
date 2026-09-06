# Gabarito de Revisão — CCA-F | Domínio 5 (Context Management & Reliability)

Explicações em PT-BR. O sufixo `· (x.y)` indica o(s) task statement(s); itens cruzados trazem `(cruza x.y + z.w)` e a nota "Task statements combinados" nos metadados.

> **Fio condutor do domínio, e é ele que decide quase todos os itens abaixo.** O eixo do distrator **se move de tópico para tópico**, e o candidato que decorou um reflexo erra o vizinho: 5.1 pede **estrutura determinística fora do histórico** (instruir o sumarizador não comprou nada medível); 5.2 pede **critério explícito em prosa** — aqui o gate determinístico é over-engineering, porque precisaria do rótulo que só existe na fixture; 5.3 pede **contrato de envelope + vocabulário de ação**, com a decisão ainda do modelo; 5.4 pede **arquitetura de contexto** (o que ocupa a janela e o que sobrevive à fronteira); 5.5 pede **desenho de medição** — a resposta não está no agente; 5.6 pede o **vínculo afirmação→fonte como campo**, com a reconciliação decidida na camada de cima.
>
> E a **família que atravessa o domínio inteiro**, cobrada em Q3, Q5 e Q9: `sem_evidencia` × `lacuna_por_falha` (5.3), `certifica_segmento` × `segmento_suspeito` (5.5), `contestado` × `temporal`/`metodologico` (5.6) são a **mesma frase** — *ausência de um sinal não é presença do sinal oposto*.

---

## Q1 — Resposta correta: **C** · (5.1)

O que se perdeu não foi volume, foi **um tipo de conteúdo**: valores, versões e prazos declarados pelo requisitante. Sumarização progressiva (K1) achata exatamente isso, e o conserto que **garante** a sobrevivência é estrutural — montar o bloco de restrições **do registro do ticket**, por código, e reenviá-lo verbatim em toda requisição, **fora** do histórico sumarizado. É o S1 do task statement, e o motivo de ele bater a instrução é que o bloco é imune à sumarização **por construção**, não por boa vontade do sumarizador. Princípio §5: enforcement estrutural > prompt quando o requisito é preservação garantida.

- **A — errada:** probabilístico onde o requisito é garantia, e é o **quase-certo** do item — é literalmente o braço `resumo-instruido` do exercício, que **empatou** com o resumo genérico (6/8 × 6/8, n=8, um modelo). A instrução mira o que o sumarizador *deveria* preservar; o bloco determinístico remove o sumarizador do caminho.
- **B — errada:** equívoco de capacidade. Janela maior adia a dobra, não a elimina em sessão que cresce sem teto, e não muda o fato de que a informação crítica está sujeita a um passo de compressão. Capacidade não é preservação.
- **C — correta.**
- **D — errada:** over-engineering, e ainda deixa a decisão dentro do caminho que falha: um classificador de "turno com restrição" acrescenta um modelo para escolher o que escapa da dobra, quando a restrição já existe em forma estruturada no próprio ticket e pode ser extraída por código.

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S2 — Code Generation with Claude Code
- Princípio testado: causa raiz > sintoma — bloco determinístico fora do histórico sumarizado, não instrução ao sumarizador

## Q2 — Resposta correta: **B** · (5.2)

Os três gatilhos já estão escritos, e mesmo assim o desk afoga: os três grupos amostrados são **exatamente os três proxies falsos** que o K3 desqualifica — complexidade (118), sentimento (44) e o enquadramento do próprio cliente (21). Dizer o que **não** é gatilho é a metade que quase todo mundo esquece do critério; sem as negativas, o modelo preenche a lacuna com os proxies que traz de fábrica. E note o eixo do 5.2: aqui a decisão é **julgamento sobre linguagem natural**, então a resposta certa **é** instrução de system prompt — o reflexo "prosa é fraca, use um gate" vindo do D1/D3 erra este item. Princípio §5: causa raiz > sintoma.

- **A — errada:** over-engineering na roupa de determinismo, e é o **quase-certo** para quem vem dos Domínios 1 e 3. O gate precisaria do **rótulo do caso** como entrada, e o rótulo não existe em produção; pior, ele bloquearia os dois gatilhos legítimos que não dependem de lacuna de política — o cliente que pede uma pessoa e o agente sem progresso.
- **B — correta.**
- **C — errada:** proxy plausível não confiável. Sentimento e complexidade são variáveis diferentes — o roteador léxico do exercício faz **2/6** contra um baseline burro de **3/6**, e nenhum limiar classifica os seis corretamente; o caso que nenhum corte conserta é justamente o furioso-mas-resolvível.
- **D — errada:** over-engineering, e treinado sobre a população errada: os 200 escalados já são a saída do critério defeituoso. Um classificador de complexidade automatiza o adjetivo em vez de substituí-lo por condição verificável.

**Tópicos:** Escalação de Ambiguidade

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 8 = Bloom 3 + integração 1 + cenário 2 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: causa raiz > sintoma — as três negativas são metade do critério; gate de escalação precisaria do rótulo que não existe

## Q3 — Resposta correta: **D** · (5.3)

O time consertou um anti-padrão do K4 e caiu no oposto. `status` com dois valores não distingue **"a busca rodou e não há nada"** de **"não conseguimos verificar"**, então o pipeline foi forçado a escolher uma leitura constante para as duas — e agora converte 47 ausências verificadas em lacunas, descartando achados legítimos e fazendo o cliente pagar de novo por buscas já feitas. A informação não está no prompt do coordenador: está no **contrato do relatório**, e é lá que ela precisa caber. Princípio §5: casar a ferramenta ao requisito — resultado vazio válido não é erro (é o 2.2 como pré-requisito do 5.3).

- **A — errada:** camada/alvo errado disfarçado de prudência. "Errar para o lado seguro" só é seguro quando as duas direções custam a mesma coisa, e não custam: publicar lacuna onde há ausência verificada joga fora um achado real e já gerou 12 recomissionamentos que voltaram vazios. O par `sem_evidencia` × `lacuna_por_falha` existe para **não** ser colapsado — em nenhuma das duas direções.
- **B — errada:** voto/consenso que suprime sinal, e ainda gasta chamada onde a fixture garante que não há ganho: repetir uma consulta que já retornou vazio válido é desperdício por erro de taxonomia. Uma segunda fonte não transforma ausência verificada em outra coisa.
- **C — errada:** over-engineering do arquétipo nº 1 — reconstruir com ML, a partir de texto livre, a distinção que um `enum` no contrato entrega de graça e sem ambiguidade. Classificar a `mensagem` é adivinhar o que o schema poderia ter afirmado.
- **D — correta.**

**Tópicos:** Propagação de Erros

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 9 = Bloom 4 + integração 1 + cenário 2 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: casar a ferramenta ao requisito — o contrato precisa separar vazio válido de falha de acesso, nas duas direções

## Q4 — Resposta correta: **A** · (5.4)

O scratchpad tem **duas metades** — manter o arquivo **e** referenciá-lo nas perguntas seguintes — e aqui só a primeira existe. A segunda metade não pode ser terceirizada para o subagente: um subagente spawnado começa **vazio** (não há herança automática de contexto), então "consulte o arquivo se for útil" delega a um agente sem contexto a decisão de descobrir que o contexto existe. O S3 do task statement nomeia o conserto: o coordenador **sumariza/seleciona e injeta** no prompt inicial da unidade seguinte. Princípio §5: causa raiz > sintoma.

- **A — correta.**
- **B — errada:** probabilístico onde o requisito é arquitetural, e é o **quase-certo** do item. Trocar "se for útil" por "você deve" reforça a mesma instrução no mesmo agente sem contexto; e mesmo cumprida, ela faz o subagente ler **96 entradas** para uma pergunta que precisa de duas ou três — troca uma degradação por outra.
- **C — errada:** camada errada, e é a distinção 3.1 × 3.3 aplicada aqui: `CLAUDE.md` é contexto **sempre-carregado**, e achados efêmeros de uma investigação pertencem a um artefato **on-demand**, reinjetado por relevância. Importar 96 entradas em toda sessão é o oposto de gestão de contexto.
- **D — errada:** camada/alvo errado — reforça a metade do mecanismo que já funciona. O arquivo é descrito como preciso e atual; escrever mais nele não faz ninguém lê-lo, e aumentar o volume torna a leitura futura mais cara.

**Tópicos:** Contexto de Codebase

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S2 — Code Generation with Claude Code
- Princípio testado: causa raiz > sintoma — reinjeção seletiva é a segunda metade do skill; subagente não herda contexto

## Q5 — Resposta correta: **C** · (5.5)

Aritmética de agregação, não amostragem: o número semanal é uma **média ponderada** sobre todos os campos de todos os documentos, e o tipo novo pesa cerca de 5% da massa. Nessa proporção, um segmento pode degradar muito e ainda deixar o agregado **dentro da banda histórica** — uma queda de 12 pontos no segmento desloca o global em 0,6 ponto (0,05 × 12), menos que os 0,8 ponto de amplitude (96,4%–97,2%) em que ele já oscilou por onze semanas, e portanto indistinguível de ruído para quem lê só o número global. O agregado **não isola segmento**: não há nele nenhuma componente que responda pelo tipo novo, e é isso que o K1 nomeia. O conserto é **desenho de medição**: acurácia por célula **tipo × campo**, com o `n` ao lado de cada célula para que ninguém leia uma célula pequena como evidência em nenhuma direção. É o arco que o exercício mede — agregado 97,0% → campo 83,3% → tipo 92,9% → **célula 28,6%** —, onde só o cruzamento nomeia o problema. Princípio §5: causa raiz > sintoma.

- **A — errada:** equívoco de capacidade, e contradiz o enunciado: o número **já** é computado sobre todo documento processado. Mais massa numa média que mistura segmentos não separa segmento nenhum — o problema é a agregação, não o tamanho da amostra.
- **B — errada:** camada/alvo errado — culpa o extrator quando a pergunta em jogo é de medição. Um tipo novo com desempenho ruim não implica regressão nos tipos antigos; comparar versões de modelo investiga um sintoma que ninguém observou.
- **C — correta.**
- **D — errada:** proxy plausível não confiável. Confiança auto-reportada **sem calibração contra rótulo** não é sinal, e é justamente no erro sistemático de um segmento que ela costuma vir **alta** — o exercício mede a curva invertendo no topo (baixa 33,3% · média 100,0% · alta 98,1%).

**Tópicos:** Revisão e Calibração

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 2 + distratores 1
- Cenário: S6 — Structured Data Extraction
- Princípio testado: causa raiz > sintoma — o agregado dilui o segmento pequeno pelo peso dele; mede-se por célula, com o `n` ao lado

## Q6 — Resposta correta: **B** · (5.6)

O S1 já está cumprido **na origem** — os registros do subagente estão 100% completos —, e mesmo assim 82% das conclusões chegam sem documento. A perda está no **último contrato**: `conclusoes: string[]` não tem onde escrever a fonte de cada conclusão, então o vínculo afirmação→fonte morre exatamente no passo que agrega (K1). O K2 cobra que a síntese **preserve e mescle** o mapeamento, e isso exige que a saída dela seja objeto com os campos, não texto. Princípio §5: causa raiz > sintoma — a causa está na forma do que trafega, não na esperteza de quem escreve.

- **A — errada:** camada/alvo errado — o pedido em prosa está na camada certa mas não cria campo nenhum: a citação vira texto não conferível, some no próximo passo de compressão e não permite que ninguém audite a atribuição. É a lição do 5.4 medida (prosa não carrega âncora) aplicada à procedência.
- **B — correta.**
- **C — errada:** over-engineering, e no pior lugar possível: re-atribuir depois **adivinha** o vínculo que já existia e foi descartado, produzindo procedência plausível e não verificada — que é pior que procedência ausente, porque afirma algo específico e falso.
- **D — errada:** equívoco de capacidade, e é o **quase-certo** do item. Uma bibliografia mais detalhada aumenta o detalhe da **lista**, não o mapeamento **por afirmação**; com doze fontes citadas ao fim, o leitor continua sem saber qual delas sustenta qual conclusão.

**Tópicos:** Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 3 + integração 0 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: causa raiz > sintoma — o vínculo afirmação→fonte tem de ser campo do contrato de saída da síntese, não bibliografia nem instrução

## Q7 — Resposta correta: **D** · (5.2)

Quebra-automatismo do domínio: depois de treinar "na dúvida, escale", este item mostra o custo de escalar onde a ambiguidade é **resolvível com uma pergunta**. O K4 é explícito — múltiplos matches pedem **esclarecimento**, e o identificador que desambigua está a uma pergunta de distância (os revisores humanos fazem exatamente essa pergunta em 9 de 10 casos). Escalar aqui não é prudência, é transferir para a fila humana um passo que o agente pode dar; o gatilho legítimo continua existindo para quando a pergunta **não** resolver. Princípio §5: resposta proporcional / menor esforço primeiro.

- **A — errada:** camada/alvo errado — é o automatismo do domínio aplicado fora da sua condição. Ambiguidade **irredutível** vai para humano; esta é redutível, e a evidência está no enunciado: o revisor resolve 9 de 10 com uma pergunta que o agente também sabe fazer.
- **B — errada:** proxy plausível não confiável — heurística inventada no ponto exato onde o dado necessário está a uma pergunta de distância, e o custo do erro é agir sobre a conta de outra pessoa. "Conta mais ativa" não é evidência de identidade: é uma correlação que ninguém mediu.
- **C — errada:** camada/alvo errado, e resolve metade do problema: o hook impede a escrita errada e **não resolve o caso**. O cliente continua sem atendimento e o chat continua indo para o desk — que é precisamente o custo que o enunciado quer eliminar.
- **D — correta.**

**Tópicos:** Escalação de Ambiguidade

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 1 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: resposta proporcional — múltiplos matches pedem identificador adicional; escalar é para a ambiguidade que a pergunta não resolve

## Q8 — Resposta correta: **A** · (5.6)

O enunciado já entrega a metade contra-intuitiva, e quase todo mundo lê por cima: o achatamento **não perde campo nenhum** — período, unidade, método e fonte sobrevivem, e a auditoria confirma. O que se perde é o **alinhamento**. Nove valores só são legíveis como série quando período e valor ficam em colunas, uma linha por período; empilhados como bullets autocontidos, os mesmos campos exigem que o leitor reconstrua a comparação de cabeça — e foi assim que dois briefs saíram dizendo "estável" sobre uma série que subia. O S5 nomeia a regra: dado financeiro pede **tabela**, notícia pede **prosa** (a caracterização qualificadora da fonte não cabe numa célula), achado técnico pede **lista estruturada**. Uniformizar é conveniência do passo de mesclagem, paga pelo leitor. Na fixture do exercício isso é aritmético: a tabela financeira tem **36 células endereçáveis em 4 colunas**, e o achatamento imprime os mesmos 36 campos em **0 colunas** — propriedade da estrutura de dados, não medição de comportamento de modelo. Princípio §5: casar a ferramenta ao requisito.

- **A — correta.**
- **B — errada:** camada/alvo errado, e é o **quase-certo** do item — conserta o que não está quebrado. O enunciado afirma que nenhum campo se perde; frases mais completas tornam cada bullet autossuficiente e a **série** ainda menos legível, porque nove períodos viram nove sentenças que o leitor tem de alinhar sozinho.
- **C — errada:** probabilístico onde o requisito é de forma. Pedir ao sintetizador que narre a tendência troca o dado pela leitura que ele fez do dado: o leitor passa a depender de uma afirmação não conferível e continua sem a forma que permitiria checá-la — inclusive quando a narração estiver errada, como nos dois briefs.
- **D — errada:** over-engineering — acrescenta um passo classificador para recuperar o que a forma correta exibe de graça, e publica um rótulo derivado ao lado de uma série que segue ilegível: se o rótulo errar, o leitor não tem como perceber.

**Tópicos:** Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: casar a ferramenta ao requisito — cada tipo de conteúdo na forma que ele pede; o achatamento uniforme preserva os campos e destrói o alinhamento

## Q9 — Resposta correta: **B** · (cruza 5.6 + 5.5)

O mesmo sintoma — dois valores candidatos para um campo — tem **dois desfechos opostos**, e o discriminador é operacional, não estilístico: **os campos de procedência separam os dois valores?** Nos 210 casos entre publicadores diferentes eles separam (fonte, data, método), então a divergência é interpretável e o pipeline pode registrar as duas leituras com sua procedência sem perder nada — é o 5.6. Nos 46 casos internos a uma peça, um publicador e uma data, **nenhum campo distingue os valores**: a ambiguidade é irredutível e o desfecho certo é revisão humana — é o 5.5. Tratar as duas populações com uma política só, em qualquer direção, é o erro. Princípio §5: casar a ferramenta ao requisito.

- **A — errada:** camada/alvo errado, e desproporcional — dimensiona o desk para uma fila cuja maior parte (210 de 256) é automatizável sem perda de informação. "Máquina não resolve" é conclusão, não premissa: nos casos entre publicadores a procedência resolve.
- **B — correta.**
- **C — errada:** proxy plausível não confiável, aplicado às duas populações ao mesmo tempo. Nada na entrada ordena credibilidade; e no grupo interno a um documento o critério nem sequer se aplica — publicador é o **mesmo**, então o ranking não decide nada e a ambiguidade segue adiante em silêncio.
- **D — errada:** voto/consenso que suprime sinal. Duas leituras do mesmo documento tendem a convergir na mesma parte dele e a descartar a divergente; o resultado é fabricar unanimidade sobre uma contradição real, e a auto-concordância de um modelo não é evidência externa.

**Tópicos:** Proveniência e Síntese, Revisão e Calibração

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 10 = Bloom 4 + integração 2 + cenário 2 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: casar a ferramenta ao requisito — a pergunta é se a procedência separa os valores; se separa, anota-se; se não, é revisão humana
- Task statements combinados: 5.6 (conflito entre fontes credíveis, resolvido por procedência) + 5.5 (conflito interno a um documento ⇒ roteamento para revisão humana)

## Q10 — Resposta correta: **D** · (cruza 5.6 + 5.3)

O erro de camada mais provável do domínio: os dois envelopes existem para coisas diferentes. O do **5.3** carrega **o que não deu certo** — categoria, `attempted`, parciais, alternativas — para o coordenador **recuperar**. O do **5.6** carrega **de onde veio o que deu certo** — `fonte_id`, período, método — para o coordenador **reconciliar**. Aqui nada falhou: as duas fontes responderam, e empurrar divergência pelo caminho de erro faz o coordenador aplicar recuperação a um problema que não é de recuperação — daí re-delegar 2,4 vezes e depois publicar 31 falsas lacunas, que é o falso negativo mais grave do 5.3. Princípio §5: causa raiz > sintoma.

- **A — errada:** camada/alvo errado, e é o **quase-certo** do item. Um valor novo no enum de falha para de re-delegar e continua tratando sucesso como erro: o resultado permanece no caminho de recuperação, sem `fonte_id`, sem período e sem método, ou seja, sem o que a reconciliação exige.
- **B — errada:** camada/alvo errado — pré-resolução onde o S3 do 5.6 a proíbe. A decisão de reconciliar é da camada de cima; um subagente que escolhe antes de reportar destrói o segundo valor, e uma nota em texto livre não é conferível nem recupera o número descartado.
- **C — errada:** equívoco de capacidade — mais orçamento e mais variação de query supõem escassez onde não há: nenhuma re-consulta faz duas fontes credíveis passarem a concordar. É repetir no escuro, a mesma distração da questão-exemplo do guia sobre backoff com status genérico.
- **D — correta.**

**Tópicos:** Proveniência e Síntese, Propagação de Erros

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 10 = Bloom 4 + integração 2 + cenário 2 + distratores 2
- Cenário: S3 — Multi-Agent Research System
- Princípio testado: causa raiz > sintoma — o envelope de falha e o de procedência são contratos distintos; divergência entre sucessos não é erro
- Task statements combinados: 5.3 (envelope de erro estruturado para recuperação) + 5.6 (envelope de procedência no caminho de sucesso, para reconciliação)

## Q11 — Resposta correta: **B** · (cruza 5.4 + 5.1)

São **dois problemas de camadas diferentes**, e só uma alternativa ataca os dois onde eles vivem. O crash é **trabalho perdido**: recuperar exige estado exportado para um **local conhecido** e um **manifesto** que a execução seguinte carrega — o S4/K4 do 5.4. A erosão dos invariantes é **contexto perdido dentro da execução**: os turnos de abertura foram dobrados no resumo, e a resposta é o bloco determinístico reenviado em cada prompt de módulo, **fora** do histórico sumarizado — o S1 do 5.1. Sessão e manifesto resolvem problemas diferentes, e este job precisa do segundo. O item só discrimina porque **D acerta a metade do 5.4 e erra a do 5.1**: quem domina um dos dois task statements chega a duas alternativas, não a uma. Princípio §5: causa raiz > sintoma.

- **A — errada:** camada/alvo errado, e é o **quase-certo** mais fino do domínio. A afirmação sobre `--resume` está correta — a sessão retomada restaura o histórico completo, com tool calls e resultados —, e é exatamente por isso que ela não basta: volta o que **já havia sido devolvido ao transcript**, não o que o crash interrompeu no meio, e não toca no segundo sintoma, que acontece **dentro** de uma execução que nem crashou.
- **B — correta.**
- **C — errada:** equívoco de capacidade, cobrando dois preços de uma vez: janela maior não recupera trabalho de um processo que morreu (o estado nunca esteve numa janela) e não garante preservação do que a dobra descarta — adia a dobra, não a substitui por garantia.
- **D — errada:** **acerta o lado do 5.4 e erra o do 5.1** — é o item que um candidato que estudou só o scratchpad marca. Exportar o estado dos módulos concluídos para um caminho conhecido e recarregá-lo no início resolve o crash; mas confiar no sumarizador para reproduzir os invariantes é probabilístico onde o requisito é garantia, e é literalmente o braço `resumo-instruido` do 5.1, que **empatou** com o resumo genérico (6/8 × 6/8, n=8, um modelo). Só o bloco reenviado fora do histórico tira o sumarizador do caminho.

**Tópicos:** Contexto de Codebase, Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 10 = Bloom 4 + integração 2 + cenário 2 + distratores 2
- Cenário: S2 — Code Generation with Claude Code
- Princípio testado: causa raiz > sintoma — `--resume` restaura a conversa; manifesto preserva o trabalho e bloco determinístico preserva o critério
- Task statements combinados: 5.4 (export de estado + manifesto para recuperação de crash) + 5.1 (bloco determinístico fora do histórico sumarizado)

## Q12 — Resposta correta: **C** · (cruza 5.2 + 5.5)

Os dois mecanismos decidem coisas **diferentes**, e a calibração medida autoriza exatamente aquilo que ela mediu. A escalação é **critério sobre o pedido**: *o cliente pediu uma pessoa?*, *a política é silente sobre isto?* — perguntas cuja resposta não fica mais verdadeira porque o modelo se declara confiante, e para as quais a confiança nunca foi medida. A aprovação de reembolso é onde existe **rótulo**: faixas monotônicas, cada categoria dentro da faixa alta com `n ≥ 30`, ou seja, o skill S3 do 5.5 satisfeito, inclusive na parte que quase todo mundo esquece — validar **por segmento**, não só no agregado. Manter cada instrumento no escopo em que foi validado é a resposta. Princípio §5: casar a ferramenta ao requisito.

- **A — errada:** proxy plausível não confiável, na forma mais sutil: **extrapolar um instrumento calibrado para fora da população em que foi calibrado**. As 400 etiquetas medem acerto de reembolso, não "este cliente pediu um humano"; e um limiar não tem como implementar um gatilho que é uma condição verificável sobre o texto do pedido.
- **B — errada:** camada/alvo errado — é a Questão 3 do guia aplicada onde ela não vale. O guia reprova confiança auto-reportada **sem calibração**; a condição que separa distrator de skill é ser **medida contra rótulo**, e aqui ela é, com faixas monotônicas e `n` por segmento. Descartar o instrumento validado joga fora a única medição confiável do enunciado.
- **C — correta.**
- **D — errada:** over-engineering, e destrói a separação que faz o sistema funcionar: um score único mistura duas decisões com custos de erro diferentes, foi treinado sobre rótulos que só cobrem reembolso, e substitui gatilhos auditáveis por uma saída que ninguém consegue explicar a um cliente que pediu uma pessoa.

**Tópicos:** Escalação de Ambiguidade, Revisão e Calibração

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 10 = Bloom 4 + integração 2 + cenário 2 + distratores 2
- Cenário: S1 — Customer Support Resolution Agent
- Princípio testado: casar a ferramenta ao requisito — critério explícito decide escalação; limiar calibrado contra rótulo decide só o que foi medido
- Task statements combinados: 5.2 (gatilhos de escalação como critério explícito) + 5.5 (limiar por calibração medida contra conjunto rotulado, validada por segmento)

---

## Autoavaliação
- **11–12/12:** domínio sólido do Domínio 5 — e, com D1 a D4 já fechados, o currículo inteiro está coberto. Passe aos simulados de revisão dos domínios de maior peso (D1, 27%; D3 e D4, 20% cada) como revisão espaçada.
- **8–10/12:** revise por `anotacoes/dominio-5_resumo.md` os pontos que errou, com atenção especial aos cruzados (Q9–Q12): os quatro exigem decidir **qual camada** resolve o sintoma, e os quatro têm um quase-certo desenhado para quem sabe metade.
- **≤7/12:** releia o resumo inteiro, em especial a tabela do eixo que se move de 5.1 a 5.6 e a família `sem_evidencia` × `lacuna` / `certifica` × `suspeito` / `contestado` × `temporal`. Depois refaça os seis simulados de tópico único antes de voltar aqui.
