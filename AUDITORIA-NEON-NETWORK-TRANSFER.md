# Auditoria de Network Transfer - Neon

## Resumo executivo

Foi encontrada uma causa **crítica, concreta e quantitativamente plausível** para 6,28 GB de Network Transfer em poucos dias: a página de uma rodada faz polling de `GET /api/rodadas/:id` a cada 5 segundos e cada chamada reconstrói, a partir do PostgreSQL, a rodada inteira com dois `SELECT *`, incluindo todas as questões e seus textos. A API devolve ao navegador apenas a questão atual, mas a transferência Neon → aplicação já ocorreu.

O principal suspeito é, portanto, a combinação **polling contínuo + leitura integral da rodada**. Uma aba aberta produz 12 leituras por minuto ou 720 por hora. Usando apenas o corpus local como aproximação, uma prova de 60 questões representa cerca de 205,6 KB de texto-fonte por leitura e aproximadamente 148 MB/h por aba; uma prática contendo as 240 questões representa cerca de 822 KB por leitura e aproximadamente 592 MB/h. Nessa ordem de grandeza, 6,28 GB equivalem a cerca de 42,4 horas-aba de provas ou 10,6 horas-aba de uma prática completa. Essas contas são estimativas, não medições do banco.

Os três maiores riscos são:

1. polling a cada 5 segundos lendo o snapshot completo da rodada;
2. listagem de histórico sem limite, com padrão N+1 e recarga completa de cada rodada;
3. ações de resposta/navegação que recarregam a rodada inteira e atualizam todas as questões.

Há amplificadores adicionais: resumo de aprendizado sem limite, duas leituras completas ao encerrar e migrations verificadas no primeiro acesso de cada isolate serverless. As migrations aumentam round trips e latência, mas o retorno pequeno torna-as incapazes de explicar isoladamente os gigabytes.

**Conclusão:** o código demonstra capacidade suficiente para produzir o consumo observado, mas não permite atribuir retroativamente cada byte. Para comprovar causalidade histórica ainda são necessários contagem de requests, cardinalidades reais, tamanhos com `pg_column_size` e métricas correlacionadas da Neon/Vercel.

## Fluxo de dados

```text
Tela de rodada
  → GET /api/rodadas/:id (mount + a cada 5 s)
    → carregarRodada()
      → SELECT * FROM rodadas
      → SELECT * FROM questoes_rodada (todas as Q linhas)
        → Neon PostgreSQL transfere o snapshot completo à função Vercel
    → API seleciona/sanitiza somente a questão atual
  → navegador recebe um payload menor que o lido do banco

Home / Histórico
  → GET /api/historico
    → listarHistorico()
      → SELECT todos os IDs finalizados
      → para cada ID: carregarRodada()
        → 2 SELECTs e snapshot completo por rodada

Home / Desempenho / Gerenciar progresso
  → GET /api/aprendizado/resumo
    → respostasBrutas()
      → JOIN de todas as respostas finalizadas não arquivadas
```

O Network Transfer contabilizado pela Neon ocorre principalmente em **PostgreSQL → aplicação/Vercel**. O tamanho da resposta **aplicação → navegador** é outra camada e pode ser menor, como acontece no polling da rodada.

## Achados críticos

### [CRÍTICO] Polling contínuo lê a rodada inteira

**Arquivo:** `src/app/rodada/[id]/page.tsx`, `src/app/api/rodadas/[id]/route.ts`, `src/db/repositorioRodadas.ts`  
**Função:** efeitos de carregamento/sincronização, `GET`, `carregarRodada`  
**Endpoint:** `GET /api/rodadas/:id`  
**Query:** `SELECT * FROM rodadas WHERE id = $1 AND user_id = $2`; `SELECT * FROM questoes_rodada WHERE rodada_id = $1 ORDER BY posicao ASC`  
**Comportamento atual:** carga no mount e novo GET a cada 5 segundos, sem suspensão por visibilidade/foco e sem exclusão do modo prática. Cada GET lê uma linha de rodada e todas as Q questões.  
**Por que gera tráfego:** enunciados, alternativas, respostas, explicações, resumos e metadados de todas as questões atravessam Neon → Vercel a cada ciclo, embora a resposta HTTP exponha apenas a questão atual.  
**Impacto potencial:** 720 snapshots/hora/aba. Aproximação pelo corpus: ~148 MB/h para 60 questões e ~592 MB/h para 240 questões. JSON, valores persistidos e overhead não foram medidos.  
**Evidência encontrada no código:** `setInterval` de 5 segundos na página; rota delegando a `carregarRodada`; dois `SELECT *` sem projeção da posição atual.  
**Correção recomendada:** manter carga inicial; restringir sincronização periódica a prova ativa e documento visível, impedir concorrência e cessar no término/unmount. Criar leitura projetada que carregue somente os campos de estado necessários e a questão atual. Em prática, usar as respostas das próprias mutações em vez de polling.

## Achados altos

### [ALTO] Histórico executa N+1 sem limite nem paginação

**Arquivo:** `src/db/repositorioHistorico.ts`, `src/db/repositorioRodadas.ts`, `src/app/api/historico/route.ts`  
**Função:** `listarHistorico`, `carregarEntradaHistorico`, `carregarRodada`  
**Endpoint:** `GET /api/historico`  
**Query:** busca todos os IDs finalizados e, para cada rodada, executa os dois `SELECT *` de `carregarRodada`.  
**Comportamento atual:** para R rodadas, executa `1 + 2R` SELECTs e lê todas as questões de todas as rodadas. Não há `LIMIT` nem paginação.  
**Por que gera tráfego:** o custo cresce com o histórico e repete textos grandes apenas para montar itens resumidos.  
**Impacto potencial:** não quantificável sem R e tamanho real das linhas. É linear no total de questões persistidas no histórico por chamada. A rota é chamada na home e na tela de histórico; a home usa somente quantidade e primeira entrada.  
**Evidência encontrada no código:** `SELECT id ... ORDER BY id DESC` sem limite seguido de loop que chama `carregarEntradaHistorico`.  
**Correção recomendada:** consulta projetada única para a listagem, paginação e endpoint/resumo específico para `COUNT(*)` + última entrada da home.

### [ALTO] Cada ação de questão relê e regrava toda a rodada

**Arquivo:** `src/app/api/rodadas/[id]/questoes/[indice]/route.ts`, `src/db/repositorioRodadas.ts`  
**Função:** `carregarContexto`, `salvarRodada`  
**Endpoint:** `POST /api/rodadas/:id/questoes/:indice`  
**Query:** dois `SELECT *` de `carregarRodada`; um `UPDATE rodadas`; Q `UPDATE questoes_rodada` dentro de loop.  
**Comportamento atual:** uma alteração de posição exige snapshot completo e persistência de todas as posições. Em prática, responder e avançar são duas ações separadas.  
**Por que gera tráfego:** a releitura integral gera egress; o loop de Q updates amplifica round trips/compute e tráfego de protocolo, ainda que writes não sejam o componente dominante do egress identificado.  
**Impacto potencial:** por interação, ao menos uma leitura de Q questões; no fluxo prático usual, duas ações podem duplicar esse custo. Não há dados para estimar bytes reais.  
**Evidência encontrada no código:** rota chama `carregarRodada`; `salvarRodada` percorre `rodada.questoes` e executa um update por item.  
**Correção recomendada:** projetar somente contexto necessário, atualizar apenas a posição modificada e campos da rodada em transação.

### [ALTO] Criação faz Q inserts sequenciais e recarga integral

**Arquivo:** `src/db/repositorioRodadas.ts`, `src/app/api/rodadas/route.ts`  
**Função:** `criarRodada`, handler `POST`  
**Endpoint:** `POST /api/rodadas`  
**Query:** um `INSERT rodadas RETURNING id`, Q `INSERT questoes_rodada` e, ao final, os dois `SELECT *` de `carregarRodada`.  
**Comportamento atual:** uma query por questão e nova leitura de tudo que acabou de ser gravado.  
**Por que gera tráfego:** a recarga final transfere todo o snapshot; os inserts sequenciais multiplicam round trips.  
**Impacto potencial:** proporcional a Q; ocorre a cada criação, portanto menos frequente que o polling.  
**Evidência encontrada no código:** loop de insert no repositório e chamada de recarga na rota.  
**Correção recomendada:** insert parametrizado em lote e construção da resposta a partir do estado já disponível, sem recarga integral.

## Achados médios

### [MÉDIO] Encerramento lê o snapshot completo duas vezes

**Arquivo:** `src/app/api/rodadas/[id]/encerrar/route.ts`, `src/db/repositorioRodadas.ts`  
**Função:** handler `POST`, `carregarRodada`, `salvarRodada`  
**Endpoint:** `POST /api/rodadas/:id/encerrar`  
**Query:** quatro SELECTs (duas cargas completas), um update da rodada e Q updates das questões.  
**Comportamento atual:** carrega antes da mudança, persiste tudo e relê após salvar.  
**Por que gera tráfego:** transfere duas vezes as mesmas Q questões.  
**Impacto potencial:** dois snapshots por encerramento; frequência por rodada, não contínua.  
**Evidência encontrada no código:** duas chamadas ao carregamento integral no fluxo do handler.  
**Correção recomendada:** confirmar/persistir em uma transação e montar a resposta do estado confirmado, atualizando somente a questão alterada.

### [MÉDIO] Resumo de aprendizado varre todas as respostas

**Arquivo:** `src/db/repositorioAprendizado.ts`, `src/app/api/aprendizado/resumo/route.ts`  
**Função:** `respostasBrutas`  
**Endpoint:** `GET /api/aprendizado/resumo`; também participa da criação de práticas por tópico/revisão  
**Query:** projeção de sete colunas de `questoes_rodada` com `JOIN rodadas`, sem limite, para todas as respostas finalizadas e não arquivadas do usuário.  
**Comportamento atual:** recalcula o resumo em cada visita à home, desempenho e gerenciamento, além de fluxos de prática.  
**Por que gera tráfego:** cardinalidade e bytes crescem com todo o histórico de respostas.  
**Impacto potencial:** não calculável sem total de respostas e tamanho de `topicos_json`; inferior aos snapshots com textos, mas recorrente.  
**Evidência encontrada no código:** SELECT sem `LIMIT` e efeitos de mount em três páginas.  
**Correção recomendada:** reduzir projeção e leituras de modo semanticamente equivalente; não aplicar janela arbitrária que mude última tentativa, pontos fortes/fracos ou revisão.

### [MÉDIO] Detalhes completos transferidos quando o consumidor precisa de tudo

**Arquivo:** `src/app/api/historico/[id]/route.ts`, `src/db/repositorioHistorico.ts`  
**Função:** `carregarEntradaHistorico`  
**Endpoint:** `GET /api/historico/:id`  
**Query:** os dois `SELECT *` de `carregarRodada`.  
**Comportamento atual:** lê e devolve o detalhe integral de uma rodada finalizada.  
**Por que gera tráfego:** o payload pode ser grande, porém esse consumidor precisa exibir o resultado completo e a chamada ocorre no mount da página de resultado.  
**Impacto potencial:** um snapshot por visita; não há evidência de loop.  
**Evidência encontrada no código:** página de resultado faz um único fetch no efeito de montagem.  
**Correção recomendada:** preservar o detalhe; selecionar colunas explicitamente e medir antes de qualquer redução funcional.

## Achados baixos

### [BAIXO] Migrations são verificadas em cold starts

**Arquivo:** `src/db/conexao.ts`, `src/db/migrate.ts`  
**Função:** `obterConexao`, `migrar`  
**Endpoint:** qualquer endpoint que seja o primeiro a acessar o banco em um novo isolate  
**Query:** criação de `schema_migrations`; por arquivo, transação, advisory lock, consulta de versão e eventual DDL/insert.  
**Comportamento atual:** pool e promessa de migration ficam em `globalThis`, evitando repetição dentro do mesmo isolate, mas não entre cold starts da Vercel. Com quatro migrations já aplicadas, há aproximadamente 17 comandos/round trips no primeiro acesso do isolate.  
**Por que gera tráfego:** repete verificações de schema em runtime. Os resultados são diminutos.  
**Impacto potencial:** latência, compute e pequeno tráfego; não explica gigabytes isoladamente.  
**Evidência encontrada no código:** `obterConexao` chama `migrar`; cache global é local ao isolate. Não há seed/carga de questões nesse caminho.  
**Correção recomendada:** executar migrations idempotentes como etapa explícita de deploy e deixar `obterConexao` apenas criar/reusar o pool.

### [BAIXO] `SELECT *` na linha de rodada busca colunas além de uma projeção mínima

**Arquivo:** `src/db/repositorioRodadas.ts`  
**Função:** `carregarRodada`  
**Endpoint:** todos os fluxos que delegam ao carregamento  
**Query:** `SELECT * FROM rodadas WHERE id = $1 AND user_id = $2`  
**Comportamento atual:** retorna no máximo uma linha, mas sem seleção explícita de colunas.  
**Por que gera tráfego:** transfere campos não necessariamente usados pelo consumidor específico.  
**Impacto potencial:** baixo por chamada comparado à coleção de questões; torna-se relevante pela frequência do polling.  
**Evidência encontrada no código:** uso literal de `SELECT *`.  
**Correção recomendada:** consultas projetadas por caso de uso, sem alterar silenciosamente o contrato de `carregarRodada` onde o estado integral for necessário.

## Queries auditadas

| Arquivo | Função | Query/operação | LIMIT? | Paginação? | Risco | Observação |
|---|---|---|---:|---:|---|---|
| `src/db/conexao.ts` / `migrate.ts` | `obterConexao` / `migrar` | schema table, lock, versão, DDL, insert de versão | Não | Não | Baixo | Primeiro acesso de cada isolate; sem seed runtime |
| `src/db/repositorioUsuarios.ts` | `criarUsuario` | `INSERT usuarios ... RETURNING id,email` | N/A | N/A | Baixo | Uma linha, retorno mínimo |
| `src/db/repositorioUsuarios.ts` | `buscarUsuarioPorEmail` | `SELECT id,email,senha_hash ... WHERE email=$1` | Não textual | Não | Baixo | `email` é único; 0–1 linha |
| `src/db/repositorioResetSenha.ts` | `criarTokenReset` | UPDATE tokens ativos + INSERT token | N/A | N/A | Baixo | Sem coleção retornada |
| `src/db/repositorioResetSenha.ts` | `alterarSenhaComToken` | SELECT token `FOR UPDATE`, UPDATE usuário/token | Não textual | Não | Baixo | Token único; 0–1 linha |
| `src/db/repositorioRodadas.ts` | `criarRodada` | INSERT rodada + Q INSERTs | N/A | N/A | Alto | Uma query por questão |
| `src/db/repositorioRodadas.ts` | `carregarRodada` | `SELECT *` rodada + `SELECT *` todas as questões | Não | Não | Crítico | Q linhas com textos/JSON completos |
| `src/db/repositorioRodadas.ts` | `salvarRodada` | UPDATE rodada + Q UPDATEs | N/A | N/A | Alto | Atualiza todas as posições em loop |
| `src/db/repositorioRodadas.ts` | `arquivarTodas` | UPDATE todas as rodadas do usuário | N/A | N/A | Baixo | Mutação explícita, sem retorno volumoso |
| `src/db/repositorioRodadas.ts` | `deletarTodas` | DELETE todas as rodadas do usuário | N/A | N/A | Baixo | Mutação explícita, sem retorno volumoso |
| `src/db/repositorioHistorico.ts` | `listarHistorico` | SELECT todos IDs + 2 SELECTs por rodada | Não | Não | Alto | N+1; snapshot completo de cada rodada |
| `src/db/repositorioHistorico.ts` | `ultimaEntradaHistorico` | ID mais recente + carregar rodada | Sim, 1 | Não | Médio | Uma carga completa |
| `src/db/repositorioHistorico.ts` | `contarHistorico` | `COUNT(*)` | N/A | N/A | Baixo | Uma linha |
| `src/db/repositorioAprendizado.ts` | `respostasBrutas` | SELECT 7 colunas com JOIN de todas as respostas | Não | Não | Médio | Cresce com o histórico |

Não foram encontradas queries de produção fora desses módulos. `src/db/apoioTeste.ts`, `src/db/testGlobalSetup.ts` e queries em testes são restritos ao ambiente de teste.

## Endpoints auditados

| Endpoint | Queries executadas (caso normal) | Tamanho potencial da resposta | Frequência provável | Risco |
|---|---:|---|---|---|
| `POST /api/auth/login` | 1 SELECT, mais migration possível | Pequeno | Submit | Baixo |
| `POST /api/auth/registro` | 1 INSERT, mais migration possível | Pequeno | Submit | Baixo |
| `POST /api/auth/logout` | 0 | Pequeno | Clique | Baixo |
| `POST /api/auth/esqueci-senha` | 1 SELECT; se existir, 1 UPDATE + 1 INSERT | Pequeno | Submit | Baixo |
| `POST /api/auth/redefinir-senha` | 1 SELECT + 2 UPDATEs em transação | Pequeno | Submit | Baixo |
| `GET /api/catalogo` | 0; lê filesystem/catálogo local | Catálogo de questões | Mount home/seleção | Baixo para Neon |
| `GET /api/aprendizado/resumo` | 1 SELECT sem limite | Cresce com todas as respostas | Mount em 3 páginas e fluxos de prática | Médio |
| `GET /api/historico` | `1 + 2R` SELECTs | Cresce com todas as rodadas | Mount home e histórico | Alto |
| `GET /api/historico/:id` | 2 SELECTs integrais | Uma rodada completa | Mount do resultado | Médio |
| `POST /api/rodadas` | 1 + Q INSERTs + 2 SELECTs; pode somar aprendizado | Uma rodada criada | Clique | Alto |
| `GET /api/rodadas/:id` | 2 SELECTs integrais | HTTP parcial; leitura DB integral | Mount + 5 s | Crítico |
| `GET /api/rodadas/:id/questoes/:indice` | 2 SELECTs integrais | Questão/estado | Se utilizado diretamente | Alto |
| `POST /api/rodadas/:id/questoes/:indice` | 2 SELECTs + 1 UPDATE + Q UPDATEs | Estado/feedback | Cada resposta/navegação | Alto |
| `POST /api/rodadas/:id/encerrar` | 4 SELECTs + 1 UPDATE + Q UPDATEs | Detalhe completo | Uma vez por rodada, ou detecção do timer | Médio |
| `POST /api/progress/archive-all` | 1 UPDATE | Pequeno | Clique | Baixo |
| `DELETE /api/progress` | 1 DELETE em cascata | Pequeno | Clique | Baixo |

As contagens não incluem os comandos de migration que podem ocorrer no primeiro acesso ao banco de um isolate novo.

## Chamadas do frontend

| Componente | Endpoint | Gatilho | Frequência | Risco Neon |
|---|---|---|---|---|
| `src/app/page.tsx` | `/api/catalogo` | mount | 1 por montagem | Baixo (sem DB) |
| `src/app/page.tsx` | `/api/historico` | mount | 1 por montagem | Alto |
| `src/app/page.tsx` | `/api/aprendizado/resumo` | mount | 1 por montagem | Médio |
| `src/app/page.tsx` | `/api/rodadas` | clique | 1 por criação | Alto |
| `src/app/page.tsx` | `/api/auth/logout` | clique; depois `router.refresh()` | 1 por logout; remount pode repetir chamadas da home | Baixo direto |
| `src/app/selecao/page.tsx` | `/api/catalogo` | mount | 1 por montagem | Baixo (sem DB) |
| `src/app/selecao/page.tsx` | `/api/rodadas` | clique | 1 por criação | Alto |
| `src/app/rodada/[id]/page.tsx` | `/api/rodadas/:id` | mount + intervalo | a cada 5 s | Crítico |
| `src/app/rodada/[id]/page.tsx` | `/api/rodadas/:id/questoes/:indice` | resposta/navegação | 1 por ação; prática usualmente separa responder/avançar | Alto |
| `src/app/rodada/[id]/page.tsx` | `/api/rodadas/:id/encerrar` | clique ou expiração detectada | 1 por encerramento esperado | Médio |
| `src/app/historico/page.tsx` | `/api/historico` | mount | 1 por montagem | Alto |
| `src/app/resultado/[id]/page.tsx` | `/api/historico/:id` | mount | 1 por montagem | Médio |
| `src/app/resultado/[id]/page.tsx` | `/api/rodadas` | clique por tópico | 1 por criação | Alto |
| `src/app/desempenho/page.tsx` | `/api/aprendizado/resumo` | mount | 1 por montagem | Médio |
| `src/app/desempenho/page.tsx` | `/api/rodadas` | clique | 1 por criação | Alto |
| `src/app/gerenciar-progresso/page.tsx` | `/api/aprendizado/resumo` | mount | 1 por montagem | Médio |
| `src/app/gerenciar-progresso/page.tsx` | `/api/rodadas`, `/api/progress/*` | clique | 1 por ação | Baixo–Alto conforme rota |
| Login/cadastro/reset | `/api/auth/*` | submit | 1 por tentativa | Baixo |

Não foi encontrado polling em outros componentes. O intervalo de 1 segundo de `Cronometro` altera apenas estado local. Os `setTimeout` de gerenciamento apenas navegam após feedback. `router.refresh()` aparece após login, cadastro e logout e pode remontar consumidores, mas não cria loop autônomo. React Strict Mode pode duplicar efeitos em desenvolvimento; não há evidência no código de duplicação em produção.

## Tratamento de erro no login

**CODIGO:** `src/app/login/page.tsx` chama `await resposta.json()` antes de verificar `resposta.ok`. Se o backend lançar e o runtime devolver um 500 vazio ou HTML, o parse falha e o `catch` apresenta “Falha de rede”, embora o fetch tenha recebido uma resposta HTTP.

Recomendação de contrato, sem implementação nesta auditoria:

| Situação | Classificação recomendada |
|---|---|
| rejeição do `fetch`, timeout/abort ou ausência de resposta | Falha real de rede/conectividade |
| 400 | Dados inválidos; orientar correção dos campos |
| 401 | Credenciais inválidas |
| 429 | Muitas tentativas; orientar aguardar |
| 500 | Erro interno; tentativa posterior, sem atribuir à conexão do usuário |
| 502, 503, 504 ou erro de indisponibilidade DB normalizado pelo backend | Serviço temporariamente indisponível |

O corpo deve ser lido de forma tolerante a JSON, vazio ou texto, separadamente da captura de erros de transporte. Detalhes de banco não devem ser expostos ao cliente; logs do servidor devem receber erro sanitizado e identificador de correlação. O formulário, foco, layout e padrão visual existentes devem ser preservados. A mudança necessária é local ao estado/microcopy de erro; não há justificativa para redesign.

## Hipótese para os 6.28 GB

1. **Mais provável — polling + snapshot integral.** Uma aba de rodada aberta executa 720 leituras completas/hora. A aproximação com o corpus local coloca 6,28 GB na ordem de 42,4 horas-aba para provas de 60 questões ou 10,6 horas-aba para uma prática com 240. Abas abandonadas, várias sessões ou práticas grandes reduzem rapidamente o tempo necessário.
2. **Provável amplificador — histórico N+1 e resumo de aprendizado.** A home lê todo o histórico, embora use resumo, e também varre as respostas. Visitas e navegação repetem essas leituras; conforme R cresce, `/api/historico` relê todos os snapshots anteriores.
3. **Possível amplificador secundário — ações integrais e cold starts.** Responder, avançar, criar e encerrar repetem snapshots e/ou Q operações. Cold starts ainda executam verificações de migration. Esses padrões aumentam consumo, mas o código não sustenta migrations como causa principal dos gigabytes.

O contraste entre ~40 MB armazenados e 6,28 GB transferidos é coerente com a releitura frequente do mesmo conjunto: 6,28 GB representam aproximadamente 157 vezes o storage informado. A relação é apenas ilustrativa porque storage contabilizado, bytes de linhas e Network Transfer não são métricas diretamente equivalentes.

## Plano de correção

### Fase 1 — Correções críticas

Mudanças necessárias antes de reativar o Neon:

1. **Restringir o polling da rodada.**  
   Arquivos: `src/app/rodada/[id]/page.tsx` e testes da página. Manter carga inicial; sincronizar somente prova ativa, página visível e sem request concorrente; não fazer polling em prática; limpar intervalo no unmount.  
   Critério: zero polling em prática/aba oculta e no máximo um ciclo ativo em prova visível. **NIVEL: CRITICO · DOCS: não · UI: não.**

2. **Criar leitura projetada do estado atual.**  
   Arquivos: `src/db/repositorioRodadas.ts`, `src/app/api/rodadas/[id]/route.ts` e testes. Consultar colunas explícitas, campos leves necessários e somente a questão atual; preservar autenticação, cálculo temporal e contrato sanitizado.  
   Critério: rota sem `SELECT *`/coleção completa e testes de contrato intactos. **NIVEL: CRITICO · DOCS: não · UI: não.**

3. **Retirar migrations do caminho das requisições.**  
   Arquivos: `src/db/conexao.ts`, `src/db/migrate.ts`, `package.json`, entrada explícita de migration, testes e documentação de deploy.  
   Critério: obter conexão não consulta `schema_migrations`; comando idempotente roda antes de servir a versão e falha claramente. **NIVEL: CRITICO · DOCS: sim · UI: não.**

4. **Classificar corretamente erros do login.**  
   Arquivo: `src/app/login/page.tsx` e testes. Separar erro de transporte, parse tolerante e status 400/401/429/500/502–504.  
   Critério: somente rejeição real do fetch aparece como falha de rede; 500 vazio/HTML não é confundido; mensagem segue acessível. **NIVEL: ALTO · DOCS: não · UI: sim.**

### Fase 2 — Redução de tráfego

5. Separar o resumo da home (`COUNT(*)` + última entrada) da listagem de histórico.  
6. Eliminar `1 + 2R` com consulta projetada de listagem e paginação.  
7. Nas ações, ler contexto mínimo e atualizar somente a questão alterada, em transação.  
8. Inserir questões da nova rodada em lote e remover a recarga final.  
9. Encerrar sem segunda leitura integral e sem Q updates desnecessários.  
10. Reduzir a projeção do aprendizado sem impor corte que altere a semântica.

Cada tarefa deve preservar isolamento por `user_id`, atomicidade, status HTTP, tempo, pontuação, prática/prova, arquivamento e tratamento defensivo de dados existentes. Tarefas 7–9 devem ser sequenciais porque compartilham `repositorioRodadas.ts`.

### Fase 3 — Observabilidade

- Registrar por endpoint: contagem, duração, status e identificador de correlação.
- Registrar por consulta crítica: duração, `rowCount`, linhas afetadas e bytes aproximados do resultado serializado.
- Nunca registrar conteúdo de questões/respostas, cookies, hashes, tokens, credenciais ou parâmetros sensíveis.
- Medir tamanhos reais por amostragem com `pg_column_size`/agregados seguros e cardinalidades por usuário/rodada.
- Correlacionar janela, deployment e rota entre logs da Vercel, erros e métricas de Network Transfer da Neon.
- Documentar a execução de migrations fora do runtime e o procedimento antes/depois.

`pg_column_size`, tamanho do JSON HTTP e Network Transfer medem camadas diferentes; devem ser comparados, não somados como equivalentes.

### Fase 4 — Validação

1. Criar cenários equivalentes de prova de 60 questões e prática grande, com uma aba e múltiplas abas controladas.
2. Confirmar nos logs: zero polling em prática/aba oculta; frequência prevista em prova; nenhuma sobreposição.
3. Confirmar que GET de estado lê somente a questão atual e que histórico não cresce em `1 + 2R` queries.
4. Comparar antes/depois: requests por endpoint, queries, linhas e bytes aproximados durante a mesma janela/cenário.
5. Acompanhar Network Transfer da Neon após reativação em janelas curtas, com limite operacional conservador e alerta.
6. Executar testes unitários/de rota, lint, typecheck, build e E2E de login, prova, prática, retomada, encerramento e histórico.
7. Validar isolamento por usuário e ausência de regressão nos contratos antes de considerar a correção concluída.

Não se deve definir uma porcentagem de redução antes de existir linha de base medida. O critério é demonstrar que os multiplicadores identificados desapareceram e que o consumo observado caiu no mesmo cenário.

## Metodologia, evidências e limitações

- **CODIGO:** buscas cobriram arquivos de produção em `src/db`, todas as rotas sob `src/app/api`, páginas/componentes com `fetch`, efeitos, timers e refresh, auxiliares de autenticação e `src/proxy.ts`.
- **CODIGO:** `src/proxy.ts`/middleware não acessa banco. Não existe seed de questões na conexão; o conteúdo vem do filesystem e é persistido ao criar rodadas.
- **RENDERIZADO:** não realizado. Não era necessário para provar o fluxo de dados; a avaliação do login foi estática e limitada à classificação da mensagem.
- **INFERENCIA:** frequências derivam dos gatilhos e intervalos presentes no código; estimativas em bytes usam o corpus local como proxy.
- **HIPOTESE:** a atribuição dos 6,28 GB ao polling é a explicação mais provável, não uma medição retrospectiva.
- **Limitação operacional:** com o Neon pausado e sem métricas/logs históricos fornecidos, não foi possível consultar tamanhos reais, cardinalidades, logs de query ou contagem de requests.

