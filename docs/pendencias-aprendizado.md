# Pendências do sistema de apoio ao aprendizado

Do plano em `docs/Plano de implementação — Sistema de apoio ao aprendizado.md`, todos os 18 itens da seção 20 ("Ordem recomendada de implementação") estão implementados, exceto os dois abaixo — ambos deixados de fora por decisão já tomada (não por lacuna de execução). Este documento registra o que falta concretamente, pra quando alguém decidir retomar.

## 1. Vídeos curados (Fase 5, §8) — conteúdo, não código

**Por que ficou de fora**: o plano determina, em §8.1, não usar busca automática no YouTube ("erro → consulta YouTube → primeiro resultado" é explicitamente o que evitar). Curadoria de vídeo exige julgamento humano sobre qualidade técnica e precisão que não dá pra automatizar com segurança.

**O que já existe** (não precisa mudar):

- `RecursoEstudo` (`src/data/recursos.ts`) já suporta `tipo: "video"`, `duracaoMinutos` e `idioma` no modelo.
- A tela de resultado (`src/app/resultado/[id]/page.tsx`) e a de pontos fracos (`src/app/desempenho/page.tsx`) já renderizam vídeo com ícone 🎥 e badge "Material complementar" (vs. "Oficial — {fonte}" pra documentação da Anthropic) — a distinção de §7.3 já está pronta pro tipo vídeo também.
- `recursos.test.ts` já valida qualquer entrada nova (URL https, `topicoId` existente no catálogo, `tipo` válido).

**O que falta**: alguém (humano) escolher vídeos reais aplicando os critérios do plano (§8.3):

- conteúdo atualizado;
- boa qualidade técnica;
- aderência ao tópico;
- ausência de informações contraditórias;
- duração razoável;
- idioma;
- fonte confiável.

E adicionar cada um como uma entrada em `RECURSOS` (`src/data/recursos.ts`), por exemplo:

```ts
{
  id: "mcp-server-intro-canal-x",
  topicoId: "mcp-server", // precisa existir em src/domain/topicos.ts
  titulo: "Introdução ao MCP",
  tipo: "video",
  url: "https://...",
  fonte: "Canal X",
  idioma: "pt-BR",
  duracaoMinutos: 15,
  oficial: false,
}
```

Depois de adicionar, rodar `yarn test src/data/recursos.test.ts` pra validar o formato.

## 2. Revisão espaçada (Fase 12, §15) — feature nova, não implementada

**Por que ficou de fora**: o próprio plano marca esta fase como "não implementar na primeira versão" (P2). Confirmado explicitamente com o usuário na Sprint E: optou por implementar só Fase 11 (erros recorrentes) e Fase 13 (dashboard), deixando esta de fora.

**Estado atual**: nada existe no código. `questoesEmRevisao` (`src/domain/aprendizado.ts`) já cobre uma versão simples — "questões cuja última tentativa foi errada" — mas sem agendamento: não sabe *quando* a questão deve voltar a ser mostrada, só *se* ela está errada agora.

**O que o plano pede** (fluxo simplificado, §15.1):

```text
Errou           → revisar em 1 dia
Acertou         → revisar em 3 dias
Acertou de novo → revisar em 7 dias
Acertou de novo → revisar em 14 dias
```

**O que precisaria ser construído**:

- **Estado persistido por questão+usuário** (§15.2 sugere `ultimaRevisao`, `proximaRevisao`, `nivelRevisao`) — hoje não existe nenhuma tabela desse tipo; `questoes_rodada` é um snapshot por rodada, não um registro por questão ao longo do tempo. Precisa de uma tabela nova (ex. `revisoes_espacadas`, chaveada por `user_id` + `origem` + `numero`) ou de uma extensão do modelo existente.
- **Algoritmo de agendamento**: função pura que, dado o nível atual e se a última resposta foi certa/errada, calcula o próximo nível e a próxima data — mesmo espírito de `domain/aprendizado.ts`, sem tocar banco.
- **Consulta "revisões de hoje"**: `proximaRevisao <= hoje`, pra alimentar a métrica que ficou de fora do dashboard (Fase 13) — hoje `/api/aprendizado/resumo` não tem esse campo.
- **Decisão de produto pendente**: como esta feature convive com "Revisar meus erros" (Fase 10), que já existe e é mais simples (sem agendamento)? Prováveis caminhos: (a) substituir o critério de "Revisar meus erros" por `proximaRevisao <= hoje`, ou (b) manter os dois como conceitos separados. Isso não estava decidido no plano e precisa de uma escolha antes de implementar — não é uma ambiguidade que dê pra resolver só lendo código.

## Resumo

| Item | Tipo de pendência | Bloqueio |
|---|---|---|
| Vídeos curados | Conteúdo (dados), zero código novo | Precisa de curadoria humana — só usar o modelo já pronto |
| Revisão espaçada | Feature nova (schema + domínio + API + UI) | Precisa de uma decisão de produto sobre conviver com "Revisar meus erros" antes de desenhar a implementação |
