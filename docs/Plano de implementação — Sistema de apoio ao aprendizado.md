# Plano de implementação — Sistema de apoio ao aprendizado

## 1. Objetivo

Evoluir o `simulador-cca-f` para que ele não apenas informe se o usuário acertou ou errou uma questão, mas também ajude a identificar:

- por que errou;
- qual conceito precisa revisar;
- qual material estudar;
- quais questões praticar;
- quais tópicos apresentam dificuldade recorrente.

A meta é transformar o simulador progressivamente em uma ferramenta de preparação e revisão para a certificação.

---

# 2. Princípios da implementação

A implementação deve seguir alguns princípios:

- começar simples;
- evitar IA generativa na primeira versão;
- priorizar conteúdo curado;
- preferir documentação oficial;
- não depender de busca dinâmica no YouTube;
- reutilizar materiais entre várias questões;
- manter domínio e regras de aprendizado desacoplados da interface;
- preservar o histórico das respostas já realizadas.

---

# 3. Resultado esperado

O fluxo deverá evoluir de:

```text
Questão
  ↓
Resposta
  ↓
Correto / Incorreto
```

para:

```text
Questão
  ↓
Resposta
  ↓
Correto / Incorreto
  ↓
Explicação
  ↓
Tópicos relacionados
  ↓
Material recomendado
  ↓
Questões de reforço
  ↓
Histórico de aprendizagem
```

---

# 4. Fase 1 — Enriquecimento das questões

## Prioridade

P0

## Objetivo

Fazer cada questão possuir informação suficiente para ensinar o conteúdo depois da resposta.

---

## 4.1 Adicionar explicação da resposta correta

Cada questão deve possuir:

```ts
explicacao: string;
```

Exemplo:

```text
A alternativa C está correta porque...
```

A explicação deve ser:

- curta;
- objetiva;
- técnica;
- relacionada diretamente ao cenário da questão.

Evitar transformar a explicação em uma aula extensa.

> **Decisão de reaproveitamento:** o campo `resumo` já existe hoje em `Questao` (parágrafo de abertura do gabarito, já exibido na tela de resultado). `explicacao` reaproveita esse campo como base — não é um campo novo e paralelo. Onde o `resumo` já cobrir "por que a alternativa correta está certa" de forma isolada, nenhuma reescrita é necessária; onde não cobrir, ajustar o conteúdo do `resumo` existente em vez de criar um segundo campo.

---

# 4.2 Explicações por alternativa

Adicionar opcionalmente:

```ts
explicacoesAlternativas: {
  A?: string;
  B?: string;
  C?: string;
  D?: string;
};
```

Exemplo:

```text
A — Incorreta porque...
B — Incorreta porque...
C — Correta porque...
D — Incorreta porque...
```

Isso é especialmente importante para questões com alternativas semelhantes.

> **Já implementado:** `Questao.explicacoes` já existe no parser hoje, com um texto por letra A-D, e já é servido na tela de resultado. Esta fase não cria um campo novo — o trabalho real é **expor esse campo já existente também no feedback imediato do modo prática** (ver 5.4), não recriá-lo.

---

# 4.3 Adicionar tópicos às questões

Cada questão deve possuir:

```ts
topicos: string[];
```

Exemplo:

```json
[
  "MCP",
  "Tool Schema",
  "Tool Boundaries"
]
```

> **Decisão de granularidade (necessária antes de iniciar esta fase):** hoje não existe nenhum campo de tópico por questão — a menor unidade de agrupamento é o arquivo (`origem`, ~6 questões cada), com uma única linha `**Tópico:**` em texto livre por arquivo, hoje descartada pelo parser. Implementar `topicos: string[]` por questão, como no exemplo acima, exige: novo campo no tipo `Questao`, nova sintaxe no markdown, novo regex no parser, nova coluna em `questoes_rodada` e curadoria manual retroativa em todo o corpus já publicado (~240 questões). Essa decisão deve ser tomada explicitamente — reaproveitar `origem` (tópico por arquivo) reduz drasticamente o custo de curadoria, ao preço de granularidade mais grosseira.
>
> **Persistência:** uma vez decidido o formato, `topicos` deve ser gravado como snapshot na própria linha de `questoes_rodada` no momento da resposta — no mesmo padrão já usado para `resumo`/`explicacoes`/`metadados` — e não obtido por lookup dinâmico do conteúdo atual em `content/simulados/`. Sem isso, uma edição futura do tópico de uma questão reescreveria retroativamente a interpretação de respostas já dadas.

---

# 4.4 Manter domínio principal

Continuar utilizando o domínio da certificação como agrupamento principal.

Exemplo:

```text
Tool Design & MCP
```

e utilizar tópicos como subdivisão:

```text
Tool Design & MCP
  ├── MCP Server
  ├── Tool Schema
  ├── Error Handling
  └── Tool Boundaries
```

---

# 4.5 Critérios de aceite

Toda questão deverá possuir:

- domínio;
- pelo menos um tópico;
- resposta correta;
- explicação da resposta correta.

Explicações individuais das alternativas poderão ser opcionais inicialmente.

---

# 5. Fase 2 — Feedback após resposta

## Prioridade

P0

## Objetivo

Melhorar imediatamente a experiência após responder uma questão.

---

# 5.1 Quando acertar

Mostrar:

```text
✓ Resposta correta

Por que esta alternativa está correta?

[explicação]
```

Opcionalmente:

```text
Revisar conteúdo
```

---

# 5.2 Quando errar

Mostrar:

```text
✕ Resposta incorreta

Sua resposta:
B) ...

Resposta correta:
D) ...

Por que D está correta?
[explicação]

Por que B está incorreta?
[explicação específica]
```

---

# 5.3 Não revelar resposta antecipadamente

As explicações só devem aparecer:

- após responder, no modo prática;
- após encerramento da prova, no modo simulado/prova.

Preservar a lógica atual da experiência de prova.

---

# 5.4 Mudança de contrato de API necessária

Esta fase não é apenas uma mudança de interface.

Hoje, a rota que avança para a próxima questão devolve somente a próxima questão já sanitizada (sem resposta correta nem explicação). Resposta correta e explicação só ficam disponíveis depois que a rodada inteira é finalizada.

Para mostrar explicação logo após responder, no modo prática, é necessário:

- criar/alterar um endpoint que devolva resposta correta e explicação **da posição recém-respondida**;
- manter as demais posições da rodada sanitizadas (sem spoiler);
- preservar, sem alteração, o comportamento atual do modo simulado/prova (explicação só após encerramento).

---

# 6. Fase 3 — Catálogo de tópicos

## Prioridade

P1

## Objetivo

Evitar colocar URLs e materiais diretamente em cada questão.

Criar uma estrutura central de tópicos.

---

# 6.1 Modelo sugerido

```ts
type Topico = {
  id: string;
  nome: string;
  dominio: string;
  descricao?: string;
};
```

Exemplo:

```json
{
  "id": "tool-schema",
  "nome": "Tool Schemas",
  "dominio": "Tool Design & MCP"
}
```

---

# 6.2 Relação

A estrutura deve ficar:

```text
Questão
   │
   └── tópicos
         │
         ▼
       Tópico
```

Uma questão pode possuir vários tópicos.

Um tópico pode pertencer a várias questões.

---

# 7. Fase 4 — Catálogo de materiais

## Prioridade

P1

## Objetivo

Associar materiais confiáveis aos tópicos.

---

# 7.1 Modelo sugerido

```ts
type RecursoEstudo = {
  id: string;
  topicoId: string;

  titulo: string;

  tipo:
    | "documentacao"
    | "artigo"
    | "video";

  url: string;

  fonte: string;

  idioma?: "pt-BR" | "en";

  duracaoMinutos?: number;

  oficial: boolean;
};
```

---

# 7.2 Hierarquia de recomendação

Exibir preferencialmente:

```text
1. Documentação oficial
2. Guias e artigos confiáveis
3. Vídeos
```

---

# 7.3 Diferenciar material oficial

A interface deve deixar claro:

```text
Oficial — Anthropic
```

ou:

```text
Material complementar
```

Evitar fazer um material independente parecer oficial.

---

# 8. Fase 5 — Vídeos do YouTube

## Prioridade

P1

## Objetivo

Adicionar vídeos úteis sem depender de resultados de busca imprevisíveis.

---

# 8.1 Não utilizar busca automática inicialmente

Evitar:

```text
erro
↓
consulta YouTube
↓
primeiro resultado
```

Os vídeos devem ser previamente selecionados.

---

# 8.2 Catálogo curado

Exemplo:

```json
{
  "topicoId": "mcp-server",
  "titulo": "Introdução ao MCP",
  "tipo": "video",
  "url": "...",
  "fonte": "Canal X",
  "idioma": "pt-BR",
  "duracaoMinutos": 15,
  "oficial": false
}
```

---

# 8.3 Critérios para aceitar um vídeo

Verificar:

- conteúdo atualizado;
- boa qualidade técnica;
- aderência ao tópico;
- ausência de informações contraditórias;
- duração razoável;
- idioma;
- fonte.

---

# 9. Fase 6 — Tela de revisão da questão

## Prioridade

P1

Criar uma experiência semelhante a:

```text
Questão incorreta

Sua resposta
B

Resposta correta
D

Explicação
[...]

Tópicos relacionados

• MCP Server
• Tool Schema

Material recomendado

📖 Documentação oficial
🎥 Vídeo recomendado — 12 min

[Praticar este tópico]
```

---

# 10. Fase 7 — Estatísticas por tópico

## Prioridade

P1

## Objetivo

Parar de analisar somente desempenho por prova ou domínio.

---

# 10.1 Calcular desempenho

Para cada tópico:

```text
acertos
erros
totalRespondido
percentual
```

Exemplo:

```text
Tool Schema

Acertos: 8
Erros: 5

61%
```

---

# 10.2 Não persistir percentual

Persistir os fatos:

```text
questão respondida
resposta escolhida
acertou/errou
```

Calcular:

```text
percentual
```

quando necessário.

Evita inconsistência de dados.

---

# 11. Fase 8 — Página “Meus pontos fracos”

## Prioridade

P1 alta

Criar uma nova página:

```text
/meus-pontos-fracos
```

ou:

```text
/desempenho
```

---

# 11.1 Exemplo

```text
Meus pontos fracos

Tool Design & MCP
68%

Principais dificuldades:

Tool Schema
55%

Error Handling
62%

MCP Server
74%

[Estudar]
```

---

# 11.2 Critério para ponto fraco

Não classificar um tópico como fraco com apenas uma questão respondida.

Exemplo inicial:

```text
mínimo: 3 questões respondidas
```

E considerar como atenção:

```text
< 70%
```

Esses valores devem ser configuráveis.

---

# 12. Fase 9 — “Praticar este tópico”

## Prioridade

P1

Adicionar:

```text
[Praticar este tópico]
```

O sistema deve selecionar questões que possuam a tag correspondente.

Exemplo:

```text
Tool Schema
↓
5 questões
```

---

# 12.1 Seleção

Priorizar:

```text
1. questões nunca respondidas
2. questões respondidas incorretamente
3. questões antigas
```

Evitar simplesmente repetir sempre as mesmas questões.

---

# 12.2 Quantidade inicial

Utilizar:

```text
5 questões
```

como padrão.

Opcionalmente:

```text
5
10
Todas
```

---

# 13. Fase 10 — Revisar meus erros

## Prioridade

P1 alta

Adicionar na dashboard:

```text
14 questões aguardando revisão

[Revisar meus erros]
```

---

# 13.1 Fluxo

Selecionar questões que o usuário errou anteriormente.

```text
Questão
↓
Usuário responde novamente
↓
Acertou?
```

Se acertar:

```text
✓ Revisada
```

Se errar:

```text
⚠ Continua em revisão
```

---

# 13.2 Evitar decorar respostas

Não mostrar inicialmente:

```text
Você respondeu B anteriormente.
```

O usuário deve tentar resolver novamente sem influência da resposta antiga.

Mostrar histórico somente depois.

---

# 14. Fase 11 — Erros recorrentes

## Prioridade

P2

## Objetivo

Detectar tópicos que continuam apresentando dificuldade.

---

# 14.1 Regra inicial

Exemplo:

```text
1 erro
→ revisão recomendada

3 erros no mesmo tópico
→ dificuldade recorrente

5 erros
→ prioridade alta
```

---

# 14.2 Interface

Exemplo:

```text
⚠ Dificuldade recorrente

Você apresentou dificuldade em
Tool Schema em várias questões.

[Revisar conteúdo]
```

---

# 15. Fase 12 — Revisão espaçada

## Prioridade

P2

Não implementar na primeira versão.

---

# 15.1 Fluxo simplificado

```text
Erro
↓
revisar em 1 dia

Acertou
↓
revisar em 3 dias

Acertou novamente
↓
revisar em 7 dias

Acertou novamente
↓
revisar em 14 dias
```

---

# 15.2 Estado sugerido

Adicionar futuramente informações como:

```text
ultimaRevisao
proximaRevisao
nivelRevisao
```

---

# 16. Fase 13 — Dashboard de aprendizado

## Prioridade

P2

A dashboard poderá evoluir para mostrar:

```text
Desempenho geral
82%

Pontos fortes
✓ Prompt Engineering
✓ Claude Code

Pontos de atenção
⚠ Tool Design & MCP
⚠ Context Management

Questões para revisar
14

Revisões de hoje
5
```

---

# 17. Modelo conceitual

A arquitetura final deve aproximar-se de:

```text
Usuário
   │
   ├── Rodadas
   │      │
   │      └── Respostas
   │
   └── Histórico de aprendizado
              │
              ▼

Questão
   │
   ├── domínio
   │
   └── tópicos
          │
          ▼
        Tópico
          │
          ├── documentos
          ├── artigos
          ├── vídeos
          └── questões relacionadas
```

---

# 18. Estrutura de código sugerida

Manter a arquitetura atual e adicionar progressivamente:

```text
src/

  domain/
    aprendizado.ts
    topicos.ts

  data/
    topicos/
    recursos/

  components/
    feedback/
      ExplicacaoQuestao.tsx
      RecursosEstudo.tsx
      DesempenhoTopico.tsx

  app/
    desempenho/
    revisao/
```

Não é necessário criar tudo imediatamente.

---

# 19. Testes necessários

> **Pré-requisito:** hoje não existe suíte de validação sobre o conteúdo real em `content/simulados/` (o teste de sanidade existente é um placeholder). Os testes abaixo pressupõem essa suíte — ela deve ser criada como parte da Fase 1, não depois.

## Questões

Testar:

```text
questão possui tópico válido
questão possui explicação
tópico pertence a domínio existente
```

---

## Materiais

Testar:

```text
recurso aponta para tópico existente
tipo é válido
URL existe no formato esperado
```

---

## Estatísticas

Testar:

```text
acertos
erros
percentual
mínimo de respostas
```

---

## Revisão

Testar:

```text
questão errada entra em revisão
questão revisada corretamente muda de estado
erro posterior mantém dificuldade
```

---

# 20. Ordem recomendada de implementação

## Sprint/Fase A — Conteúdo

```text
1. Adicionar explicações
2. Adicionar tópicos
3. Revisar estrutura das questões
```

Objetivo:

já melhorar a experiência sem alterar profundamente o sistema.

---

## Sprint/Fase B — Feedback

```text
4. Melhorar retorno após resposta
5. Mostrar explicação
6. Mostrar explicação da alternativa escolhida
```

---

## Sprint/Fase C — Materiais

```text
7. Criar catálogo de tópicos
8. Criar catálogo de recursos
9. Adicionar documentação oficial
10. Adicionar vídeos curados
11. Criar tela de revisão da questão (Fase 6)
```

Item 11 depende apenas de explicação (Sprint B), tópicos (Sprint A) e catálogo de materiais (itens 7-10 deste sprint) — por isso fecha este sprint em vez de ficar sem sprint atribuído.

---

## Sprint/Fase D — Prática e diagnóstico

```text
12. Calcular desempenho por tópico
13. Implementar "Praticar este tópico"
14. Criar "Meus pontos fracos" (com botão [Estudar] já funcional, apontando para o item 13)
15. Implementar "Revisar meus erros"
```

"Praticar este tópico" (item 13) é implementado antes de "Meus pontos fracos" (item 14) porque o mockup da Fase 8 já prevê um botão `[Estudar]` cujo destino funcional é a Fase 9 — entregar a tela de pontos fracos antes deixaria esse botão sem destino.

---

## Sprint/Fase E — Evolução

```text
16. Detectar erros recorrentes
17. Criar revisão espaçada
18. Evoluir dashboard
```

---

# 21. Prioridades

## P0

```text
Explicação das questões
Tópicos
Feedback de erro
```

---

## P1

```text
Catálogo de materiais
Documentação oficial
Vídeos curados
Estatísticas por tópico
Meus pontos fracos
Praticar tópico
Revisar erros
```

---

## P2

```text
Erros recorrentes
Revisão espaçada
Dashboard avançada
```

---

# 22. O que não implementar agora

Evitar nesta fase:

```text
IA gerando explicações em tempo real
busca automática no YouTube
embeddings
vector database
RAG
recomendação por LLM
chatbot tutor
```

Esses recursos podem ser avaliados futuramente.

Primeiro deve existir uma boa base estruturada de:

```text
questão
+
explicação
+
tópico
+
material
+
histórico
```

---

# 23. Critérios de conclusão da primeira entrega

A primeira versão desta funcionalidade será considerada concluída quando:

- toda questão possuir domínio, validado por suíte automatizada sobre o corpus real (sem `null`);
- toda questão possuir pelo menos um tópico, na granularidade decidida em 4.3;
- toda questão possuir explicação (reaproveitando o campo `resumo` já existente, conforme decisão em 4.1, sem exigir campo duplicado);
- erros mostrarem resposta correta e explicação tanto no modo prática (logo após responder, via contrato de API descrito em 5.4) quanto no modo simulado/prova (após encerramento, como já ocorre hoje);
- materiais puderem ser associados por tópico;
- documentação oficial puder ser apresentada;
- vídeos curados puderem ser recomendados;
- o sistema conseguir calcular desempenho por tópico, a partir de tópicos gravados como snapshot em `questoes_rodada` (não por lookup dinâmico do conteúdo atual);
- existir uma forma de praticar questões de um tópico;
- existir uma forma de revisar questões erradas;
- existir suíte automatizada validando o corpus real de `content/simulados/` (substituindo o teste de sanidade placeholder atual).

---

# 24. Resultado esperado

Após a implementação, um erro deixará de ser apenas:

```text
Resposta incorreta.
```

e passará a gerar:

```text
Resposta incorreta

↓
Entenda o erro

↓
Revise o conceito

↓
Veja material recomendado

↓
Pratique questões semelhantes

↓
Acompanhe se a dificuldade continua
```

O simulador passa então a exercer três funções:

```text
Avaliar
Diagnosticar
Ensinar
```

sem exigir, neste primeiro momento, nenhuma infraestrutura de IA adicional.