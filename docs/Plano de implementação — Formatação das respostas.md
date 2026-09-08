# Plano de implementação — Formatação das respostas

## 1. Diagnóstico resumido

O conteúdo dos simulados usa Markdown inline intencionalmente, principalmente
`**negrito**`, `*itálico*` e `` `código` ``. O parser preserva essa marcação,
mas as telas de rodada e resultado inserem as strings diretamente no JSX. Como
não existe uma etapa de renderização, os delimitadores aparecem como texto para
o usuário.

Não foram encontradas sequências literais `***` em `content/` ou `src/`. O
sintoma relatado pode resultar da exibição literal ou da proximidade de
delimitadores Markdown. A varredura dos aproximadamente 2.400 campos exibíveis
encontrou:

- 669 campos com `**`;
- 1.033 campos com backticks;
- 51 campos com itálico.

O fluxo confirmado é:

1. `src/lib/parser/parser.ts` preserva o Markdown inline;
2. `src/db/repositorioRodadas.ts` persiste o conteúdo sem transformação;
3. `src/app/rodada/[id]/page.tsx` e `src/app/resultado/[id]/page.tsx`
   exibem as strings como texto JSX.

Não há evidência de corrupção do corpus. A causa é o contrato incompleto entre
o formato do conteúdo e a camada de apresentação.

## 2. Decisões

- Manter o Markdown inline como parte do conteúdo semântico.
- Manter o parser e o formato persistido inalterados.
- Corrigir a apresentação na borda da interface, contemplando também rodadas
  históricas já armazenadas.
- Suportar somente `strong`, `em` e `code` inline.
- Produzir exclusivamente nós React seguros; não usar
  `dangerouslySetInnerHTML`.
- Não habilitar HTML cru, links, imagens ou Markdown em bloco.
- Preservar delimitadores incompletos ou ambíguos como texto literal.
- Não introduzir dependência enquanto a gramática permanecer restrita a esses
  três elementos.
- Preservar layout, componentes, comportamento, acessibilidade e identidade
  visual existentes.

## 3. Tarefas

### Tarefa 1 — Implementar o renderer inline seguro

**Arquivos-alvo**

- Criar `src/components/TextoMarkdownInline.tsx`.
- Criar `src/components/TextoMarkdownInline.test.tsx`.
- Ajustar `src/app/globals.css` somente para os estilos semânticos necessários.

**Mudança**

Implementar um tokenizer determinístico para `**negrito**`, `*itálico*` e
`` `código` ``. Código inline terá precedência e não interpretará marcadores no
seu interior. O renderer deverá preservar espaços, pontuação, quebras e todo
texto que não corresponda à gramática suportada.

Os estilos devem reutilizar os tokens existentes. `code` deve usar a fonte
monoespaçada do projeto, com tratamento discreto que não altere a hierarquia
visual. Ajustes de quebra, como `overflow-wrap`, só devem ser introduzidos se a
validação visual demonstrar necessidade.

**Cobertura mínima**

- marcações isoladas e combinadas;
- código contendo asteriscos;
- delimitadores sem fechamento;
- texto sem Markdown;
- caracteres `<`, `>`, `&`, aspas simples e duplas;
- conteúdo semelhante a HTML malicioso;
- sintaxe de link preservada como texto, sem criar elemento clicável;
- fronteiras de marcação que possam aparentar `***`.

Os testes podem usar `renderToStaticMarkup` de `react-dom/server`, evitando uma
nova dependência de ambiente DOM quando desnecessária.

**Critério de pronto**

- marcações válidas geram somente `<strong>`, `<em>` e `<code>`;
- delimitadores válidos deixam de aparecer para o usuário;
- entradas inválidas não perdem caracteres;
- nenhuma tag ou atributo originado no conteúdo é executado;
- todos os testes direcionados passam.

**NIVEL:** MÉDIO  
**DOCS:** não  
**UI:** sim

### Tarefa 2 — Integrar o renderer às telas

**Dependência:** Tarefa 1.

**Arquivos-alvo**

- `src/app/rodada/[id]/page.tsx`;
- `src/app/resultado/[id]/page.tsx`.

**Mudança**

Substituir a exibição direta das strings pelo componente compartilhado em:

- enunciados;
- textos das alternativas;
- explicação da resposta correta;
- explicação da resposta incorreta;
- revisão das questões no resultado e no histórico.

Preservar letras das alternativas, botões, badges, ARIA, ordem do conteúdo,
handlers, seleção, feedback e navegação por teclado.

**Critério de pronto**

- enunciados, alternativas e explicações não são mais interpolados diretamente
  nas duas páginas;
- negrito, itálico e código usam elementos HTML semânticos;
- rodada, resultado e histórico apresentam o mesmo comportamento;
- não há mudança nas regras de resposta, feedback ou navegação.

**NIVEL:** PADRÃO  
**DOCS:** não  
**UI:** sim

### Tarefa 3 — Validar o corpus e o fluxo histórico

**Dependências:** Tarefas 1 e 2.

**Arquivos-alvo**

- Ampliar `src/components/TextoMarkdownInline.test.tsx`.
- Ajustar `e2e/fluxo-completo.spec.ts` apenas se houver conteúdo determinístico
  apropriado para a asserção.

**Mudança**

Executar todos os campos exibíveis do corpus pelo renderer, usando os parsers
existentes. Para cada campo, verificar que:

- a renderização não lança exceção;
- o texto visível é preservado, removendo apenas delimitadores válidos;
- nenhuma tag fora da lista permitida é criada.

Quando o fluxo E2E oferecer uma questão determinística, verificar elementos
`strong`, `em` ou `code` na rodada e ao reabrir uma rodada pelo histórico. O E2E
não deve depender de sorteio para ser a única prova da formatação.

**Critério de pronto**

- todos os aproximadamente 2.400 campos do corpus renderizam sem erro;
- ocorrências de negrito, código e itálico são exercitadas;
- a reabertura de snapshots históricos é validada quando o ambiente permitir;
- testes, typecheck, lint e E2E aplicável passam.

**NIVEL:** MÉDIO  
**DOCS:** não  
**UI:** sim

## 4. Dependências e ordem recomendada

1. Definir e testar o contrato seguro do renderer.
2. Integrar o componente às telas.
3. Executar a regressão do corpus, a validação visual e o fluxo histórico.

A integração não deve preceder os testes de segurança do renderer. A validação
do corpus depende da gramática definitiva da primeira tarefa.

## 5. Validação prevista

- Testes unitários do renderer.
- Teste de regressão sobre todo o corpus.
- `yarn test`.
- Typecheck conforme o script disponível no projeto.
- `yarn lint`.
- `yarn test:e2e`, com PostgreSQL e demais requisitos disponíveis.
- Inspeção visual em desktop e mobile.
- Inspeção nos temas claro e escuro, se ambos estiverem disponíveis.
- Verificação de wrapping de código longo dentro de botões e painéis.
- Verificação de foco, contraste e leitura por tecnologia assistiva.

Validações indisponíveis devem ser registradas explicitamente; não devem ser
declaradas como executadas.

## 6. Riscos

- Um tokenizer restrito não deve ser tratado como implementação completa de
  CommonMark. Escapes avançados, `_ênfase_`, links, listas, blocos e HTML ficam
  deliberadamente fora do contrato.
- Expandir a gramática informalmente pode criar casos ambíguos. Se o conteúdo
  passar a exigir estruturas adicionais, deve-se reavaliar o uso de uma
  biblioteca especializada.
- Usar `dangerouslySetInnerHTML` ou habilitar HTML cru introduziria risco de
  XSS.
- Remover marcadores no parser degradaria a semântica e não corrigiria
  snapshots históricos.
- Estilos de código inline podem aumentar a altura ou prejudicar a quebra de
  alternativas longas.
- O E2E atual depende de PostgreSQL e pode selecionar conteúdo dinamicamente;
  por isso, a cobertura unitária e do corpus é obrigatória.

## 7. Limitações do diagnóstico

A causa foi confirmada por inspeção estática do conteúdo, parser, persistência,
API e JSX. A aplicação não foi iniciada e nenhuma captura visual foi realizada
durante o diagnóstico. A futura implementação deve, portanto, incluir a
validação renderizada prevista neste plano.
