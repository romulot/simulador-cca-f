# Gabarito de Revisão — CCA-F | Domínio 4 (Prompt Engineering & Structured Output)

Explicações em PT-BR. O sufixo `· (x.y)` indica o(s) task statement(s); itens cruzados trazem `(cruza x.y + z.w)` e a nota "Task statements combinados" nos metadados.

---

## Q1 — Resposta correta: **B** · (4.1)

A correta ataca a causa raiz: "comentário enganoso" é um adjetivo, não uma condição verificável. Trocá-lo por "flag apenas quando o comentário afirma comportamento que o código contradiz" elimina exatamente a classe dos 27 falsos positivos (nome de parâmetro desatualizado, comportamento correto) sem tocar na capacidade de pegar um comentário que de fato mente sobre o código. É o princípio do 4.1: um critério que nomeia uma condição sobre o código bate um adjetivo, e o defeito nasceu no critério, não em falta de mecanismo.

- **A — errada:** confiança auto-reportada é um proxy não confiável — mecanizar esse proxy com um threshold numérico apenas reordena o mesmo conjunto de candidatos já errado, sem tocar no critério vago que produziu os 27 falsos positivos.
- **B — correta.**
- **C — errada:** over-engineering — treinar um classificador sobre os 41 casos rotulados adiciona uma camada de ML quando o defeito está no critério de prompt, que um ajuste de texto já resolve.
- **D — errada:** três passes com o mesmo critério vago concordam no mesmo erro; voto/consenso suprime sinal em vez de consertar a causa.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 3 + integração 0 + cenário 1 + distratores 1
- Cenário: S5 — Claude Code for CI/CD
- Princípio testado: causa raiz > sintoma — o defeito está no critério, não em falta de mecanismo de gate

## Q2 — Resposta correta: **C** · (4.2)

O valor já sai certo em 36/36 — o conteúdo não é o problema. O que varia é a forma, e prosa detalhada (o parágrafo ISO 8601 já existente) não fixa forma: é exatamente o papel do braço de controle no exercício de few-shot, que ficou em 71% de conformidade de forma apesar de 100% de acurácia de valor. Exemplos de entrada→saída mostrando a forma canônica são o que ensina o modelo a reproduzir aquele formato, em vez de escolher entre formatos igualmente "corretos" em conteúdo.

- **A — errada:** mais prosa detalhada foi justamente o braço de controle medido e ficou em 71% de conformidade de forma — reforçar o mesmo mecanismo não resolve o que ele já provou não resolver.
- **B — errada:** normalizar com regex depois da extração esconde o sintoma na camada errada (pós-processamento) e não cobre o caso que o regex não previu; o requisito é de forma, que exemplo fixa na origem.
- **C — correta.**
- **D — errada:** `temperature` não é a causa de inconsistência de forma — é rejeitado com erro 400 nesta família de modelo, e a variação de forma não é ruído de amostragem, é ausência de exemplo.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 5 = Bloom 2 + integração 0 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: few-shot corrige forma quando prosa não corrige — eixo invertido do 4.1

## Q3 — Resposta correta: **A** · (4.3)

O campo está em `required` num schema `strict`, e esse regime não permite omissão: o modelo não pode devolver "sem informação" porque a plataforma exige um valor sintaticamente válido no campo. A pressão é estrutural — vem do schema, não da vontade do modelo — então a correção tem que ser estrutural: tirar o campo de `required` ou ampliar o tipo para aceitar `null`, dando ao modelo uma saída legítima para o caso real de ausência.

- **A — correta.**
- **B — errada:** reforçar a instrução em prosa é probabilístico onde a causa é estrutural; o modelo não está mentindo por falta de aviso, está poluindo o campo porque o schema não lhe dá outra opção.
- **C — errada:** `minLength`/`pattern` saem do schema enviado à API sem aviso e viram checagem local pós-geração — não impedem a geração do valor inventado, só o rejeitariam depois, e ainda não criam o `null` que falta.
- **D — errada:** uma tool de validação forçada sequencia a chamada, não desambigua nem resolve a ausência de dado; e a relação "este campo é válido dado aquele outro" não é o problema aqui — o problema é presença obrigatória sem saída para ausência real.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 3 + integração 0 + cenário 2 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: `required` em `strict` é causa estrutural, não probabilística — a correção mora no schema

## Q4 — Resposta correta: **D** · (4.4)

Retorno decrescente medido: 3 resolvidos na segunda tentativa, 0 na terceira. Quando o dado simplesmente não existe na fonte, mais tentativa não cria dado — e o resultado mais forte do 4.4 é que o feedback estruturado pode ENSINAR a forma da fabricação (o modelo aprende o padrão exigido e devolve um valor que casa com ele, mas que não existe). A resposta de produção é parar o retry por classe de documento e escalar para revisão humana, não insistir.

- **A — errada:** mais tentativa não cria dado; cada volta adicional só dá mais chance de o modelo reforçar a fabricação que o próprio feedback ensinou a forma dela.
- **B — errada:** afrouxar o validador esconde o problema em vez de escalá-lo — o campo passa a validar sem que o dado exista.
- **C — errada:** a taxa global de 50% esconde o limite do retry; a leitura correta é por classe/documento, não pela média do lote.
- **D — correta.**

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 8 = Bloom 4 + integração 0 + cenário 2 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: retorno decrescente do retry — feedback pode ensinar a forma da mentira, não só corrigir o conteúdo

## Q5 — Resposta correta: **B** · (4.5)

O sinal de roteamento entre síncrono e lote é "alguém fica bloqueado esperando?", não volume nem custo. A revisão de PR bloqueia o merge — cai em síncrono, independentemente de a chamada custar mais. A varredura semanal não bloqueia ninguém — cabe no lote, cuja janela de até 24 horas não tem SLA de latência garantido. Misturar as duas no mesmo mecanismo por causa do desconto ignora exatamente o eixo que decide.

- **A — errada:** volume e desconto não são o critério de roteamento; a revisão de PR bloqueando o merge é o sinal que desqualifica o lote para essa carga, por maior que seja o desconto.
- **B — correta.**
- **C — errada:** encurtar a janela do lote por configuração é feature inexistente — a janela de até 24h é propriedade da API, não parâmetro ajustável por chamada.
- **D — errada:** a ordem de retorno não é o problema do lote — `custom_id` resolve isso; o motivo real de manter a revisão síncrona é o bloqueio do merge, não a ordenação.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Médio
- Rubrica: 6 = Bloom 4 + integração 0 + cenário 1 + distratores 1
- Cenário: S5 — Claude Code for CI/CD
- Princípio testado: casar a ferramenta ao requisito — batch para tolerante a latência, síncrono para bloqueante

## Q6 — Resposta correta: **D** · (4.6)

Nove sprints sem uma única rejeição, com seis defeitos da mesma classe chegando à produção no mesmo período, não é evidência de que o critério de auto-revisão está bom — é evidência de que QUEM revisa nunca vai discordar de si mesmo. A mesma instância que gerou as tabelas carrega o próprio raciocínio da geração e tende a confirmar as decisões que tomou. Uma segunda instância que recebe só o diff, sem o contexto de geração, examina o código do zero e é o mecanismo que o guia nomeia como superior à auto-revisão instruída.

- **A — errada:** o guia nomeia instrução de auto-revisão detalhada — mesmo com a categoria de defeito nomeada — como o que a instância independente supera; adicionar uma categoria à lista não muda quem está revisando.
- **B — errada:** o guia nomeia extended thinking, junto com a auto-instrução, como inferior à revisão por instância independente; mais esforço de raciocínio sobre as próprias conclusões não cria a distância que falta.
- **C — errada:** equívoco de capacidade — nada no enunciado indica truncamento por janela; o problema é a mesma instância revisando o que ela mesma escreveu, não o tamanho do histórico.
- **D — correta.**

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: 4 = Bloom 2 + integração 0 + cenário 1 + distratores 1
- Cenário: S5 — Claude Code for CI/CD
- Princípio testado: revisão independente > auto-revisão — o defeito está no contexto do revisor, não na instrução

## Q7 — Resposta correta: **A** · (4.3)

`tool_choice: "any"` obriga o modelo a chamar alguma tool, o que desambigua o tipo de documento sem forçar uma tool específica — é exatamente o regime desenhado para "tipo de documento desconhecido com múltiplos schemas". E como nenhum regime de `tool_choice` impede toda resposta sem `tool_use`, a segunda parte da correção — tratar ausência de bloco `tool_use` como desfecho a rotear, não como registro vazio — fecha a regra transversal do domínio: resposta sem `tool_use` nunca é "zero achado".

- **A — correta.**
- **B — errada:** forçar a tool de um tipo específico sequencia (garante qual tool roda), não desambigua; os outros dois tipos de documento sairiam extraídos pelo schema errado.
- **C — errada:** ordenar o array `tools` para induzir a escolha do modelo é feature inexistente — a ordem do array não influencia a decisão de `tool_choice: "auto"`.
- **D — errada:** classificar o tipo com uma chamada prévia e então forçar a tool certa é over-engineering — `tool_choice: "any"` já resolve a mesma ambiguidade sem uma chamada extra.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 3 + integração 0 + cenário 2 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: `any` desambigua tipo, forçado sequencia — e resposta sem `tool_use` é desfecho, não registro vazio

## Q8 — Resposta correta: **B** · (cruza 4.6 + 1.7)

Continuar a sessão do gerador com `--resume` mantém no histórico o próprio raciocínio que produziu o código — inclusive os thinking blocks, que voltam inalterados quando a sessão continua no mesmo modelo. O revisor passa a condicionar nas decisões da geração em vez de questioná-las do zero, e é exatamente esse mecanismo (não volume de contexto, não permissão de ferramenta) que explica por que o revisor parou de flagar um padrão que antes flagava sempre. A correção certa é uma instância independente que não carrega o raciocínio do gerador — não uma variação de `--resume`.

- **A — errada:** `/compact` reduz volume de contexto, mas o problema não é diluição por tamanho — é DE QUEM é o raciocínio presente no contexto; comprimir o histórico do gerador não remove sua influência sobre a leitura do revisor.
- **B — correta.**
- **C — errada:** camada errada, sem apoio no sintoma: uma perda de permissão de ferramenta produziria falha abrupta e localizável (o passo simplesmente não roda), não um revisor que passa a concordar com uma decisão que antes questionava.
- **D — errada:** `fork_session` é feature real, mas resolve isolamento de ESTADO (não mutar a sessão original) — não resolve herança de reasoning, que é o que faz o revisor parar de questionar a decisão.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S5 — Claude Code for CI/CD
- Princípio testado: revisão independente exige contexto isolado — `--resume`/`fork_session` resolvem estado, não herança de reasoning
- Task statements combinados: 4.6 (revisão independente vs. auto-revisão na mesma sessão) + 1.7 (`--resume`/`fork_session` resolvem estado de sessão, não herança de reasoning)

## Q9 — Resposta correta: **C** · (cruza 4.4 + 4.1)

As duas classes vivem em camadas diferentes do mesmo domínio. O erro aritmético (i) é uma classe que só código detecta com confiabilidade — pede validação em código mais feedback estruturado devolvido no `tool_result`, o mecanismo do 4.4. O falso positivo por critério vago (ii) não é um erro que validação em código resolve — o comentário É sintaticamente válido, o defeito está no critério de julgamento, que pede o conserto do 4.1. Um mecanismo só para as duas resolveria uma classe e ativamente estragaria a outra.

- **A — errada:** um gate único e indiferenciado rejeitaria os 19 falsos positivos de nomenclatura com a mesma regra que usa para a divergência aritmética — automatiza o critério (ii), que está errado, em vez de corrigi-lo, e ainda descarta (i) sem o feedback estruturado que permitiria ao modelo corrigir a soma.
- **B — errada:** um prompt mais detalhado não detecta erro aritmético; prosa não substitui validação em código para uma classe que é, por definição, verificável por cálculo.
- **C — correta.**
- **D — errada:** somar as duas classes numa taxa de erro única destrói a leitura por classe e esconde que um detector (o aritmético) já funciona bem, tratando-o como se tivesse o mesmo problema do outro.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 2 + distratores 1
- Cenário: S6 — Structured Data Extraction
- Princípio testado: casar o mecanismo à camada do defeito — validação em código para erro estrutural, critério explícito para erro de julgamento
- Task statements combinados: 4.4 (validação em código + feedback estruturado) + 4.1 (conserto de critério vago, não gate/classificador)

## Q10 — Resposta correta: **B** · (cruza 4.5 + 4.6)

Ninguém espera o resultado — o sinal do 4.5 aponta para o lote. Mas dentro do lote a decomposição do 4.6 continua valendo: um pass por arquivo evita a diluição de atenção de revisar 40 arquivos concatenados numa chamada só, e um pass de integração separado é o único que pode ver os dois lados de um contrato entre arquivos, algo que nenhum pass local alcança por desenho. Cada requisição — cada arquivo mais a de integração — carrega seu próprio `custom_id`, preservando a decomposição mesmo com a ordem de retorno do lote não sendo garantida.

- **A — errada:** falso — server tools rodam o loop de ferramenta inteiramente DENTRO do lote; a limitação real é mais estreita (não há conexão aberta para tool do cliente devolver `tool_result` no mesmo request), e não impede decompor a revisão em requisições separadas.
- **B — correta.**
- **C — errada:** camada errada — aumentar `max_tokens` tampa a saída truncada, mas não cria o pass de integração que vê os dois lados de um contrato entre arquivos; a lista de achados maior não substitui a decomposição.
- **D — errada:** reenviar o lote inteiro por causa de uma falha isolada é desproporcional; a correção certa é reenviar só o request falho, identificado pelo `custom_id`.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 8 = Bloom 4 + integração 1 + cenário 1 + distratores 2
- Cenário: S5 — Claude Code for CI/CD
- Princípio testado: casar a ferramenta ao requisito, mantendo a decomposição por arquivo + integração mesmo dentro do lote
- Task statements combinados: 4.5 (roteamento para batch e `custom_id`) + 4.6 (decomposição em passes locais e pass de integração)

## Q11 — Resposta correta: **A** · (cruza 4.6 + 4.1 + 5.5)

A tabela de calibração já existe e já está sendo usada: 91% de acerto na faixa alta (auto-fechada) e 12% na faixa baixa (roteada a analista). Isso não é motivo para trocar de mecanismo — é motivo para manter exatamente esse mecanismo e continuar medindo. A resposta correta usa a confiança auto-reportada como o guia prescreve para este task statement: sinal de ROTEAMENTO com calibração PUBLICADA, nunca um threshold isolado que ignora a taxa medida por faixa. É o quebra-automatismo do domínio: o mesmo proxy que era distrator em 4.1/4.3/4.4 aqui é a skill certa, desde que venha com a calibração medida ao lado.

- **A — correta.**
- **B — errada:** over-engineering, e o próprio enunciado descarta a opção ao dizer que não há orçamento para treinar nada — o roteamento por confiança auto-reportada já está calibrado e funcionando.
- **C — errada:** suprime sinal — mesmo a faixa baixa tem 12% de acerto; parar de rotear esses achados para analista descarta esse defeito verdadeiro sem que ninguém o veja.
- **D — errada:** é o erro clássico do 4.1 — um threshold único e determinístico substitui a fila calibrada por faixa, jogando fora justamente a informação de que as faixas têm taxas de acerto muito diferentes (91% × 12%).

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: 9 = Bloom 4 + integração 2 + cenário 1 + distratores 2
- Cenário: S5 — Claude Code for CI/CD
- Princípio testado: confiança auto-reportada serve para roteamento calibrado e medido, nunca como gate automático
- Task statements combinados: 4.6 (confiança por achado para roteamento) + 4.1 (proxy auto-reportado como distrator clássico quando mecanizado em gate) + 5.5 (calibração de confiança para revisão humana)

## Q12 — Resposta correta: **A** · (4.5)

`stop_reason: "end_turn"` sem bloco `tool_use` é um desfecho — o modelo não executou a extração esperada, seja por que motivo for. Contá-lo como "nada a extrair" conflaciona duas situações completamente diferentes: `campos: []` COM o bloco `tool_use` presente é uma afirmação real ("processei e não achei campo nenhum"); a mesma lista vazia SEM o bloco é ausência de extração. Os onze têm que saltar fora do numerador e do denominador do placar e serem reenviados individualmente, usando o `custom_id` de cada um para não afetar os 289 que de fato foram processados.

- **A — correta.**
- **B — errada:** é exatamente a conflação que o item testa — tool forçada aumenta a chance de chamada, mas não garante `tool_use` em toda resposta; com o bloco ausente não há evidência de que a extração ocorreu.
- **C — errada:** desproporcional — o `custom_id` identifica exatamente quais dos 300 requests voltaram sem `tool_use`; não há motivo para reenviar os 289 que já responderam corretamente.
- **D — errada:** camada errada — trocar `tool_choice` de forçado para `any` ataca ambiguidade de TIPO de documento (um problema do 4.3), mas a tool já estava disponível e forçada nesses onze; eles são desfechos que precisam ser identificados e reenviados por `custom_id`, não um problema de disponibilidade de tool.

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: 7 = Bloom 3 + integração 1 + cenário 1 + distratores 2
- Cenário: S6 — Structured Data Extraction
- Princípio testado: resposta sem bloco `tool_use` é desfecho, nunca "zero achados" — regra transversal do domínio, com raiz no 3.6

---

## Autoavaliação
- **11–12/12:** domínio sólido do Domínio 4 — pronto para o Domínio 5 (Context Management & Reliability).
- **8–10/12:** revise os pontos que errou por `anotacoes/dominio-4_resumo.md`; atenção especial aos itens cruzados (Q8–Q11), que exigem combinar dois ou três mecanismos ao mesmo tempo, e ao quebra-automatismo da Q11 (confiança auto-reportada como skill legítima, não como distrator).
- **≤7/12:** releia o resumo inteiro — em especial o "Fio condutor do domínio" e a tabela de inversão do eixo — e revise os simulados de tópico único de 4.1 a 4.6 antes de avançar ao Domínio 5.
