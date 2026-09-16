# Exame Avançado — banco de 300 questões

Banco gerado a partir do material do **Andrew Brown** para a CCA-F:

| Fonte | O que é |
|---|---|
| `livro01.pdf` | Curso completo (123 slides) |
| `livro02.pdf` | Cheat sheets (20 páginas) |
| `livro03.md` | 37 test objectives — a espinha dorsal das questões |

## Regras deste banco

- **60 questões por domínio**, 5 domínios = **300 questões**.
- **Enunciado e alternativas sempre em inglês** — a prova é 100% em inglês.
- **Cenários práticos**, não decoreba de flag: o que acontece num time real usando
  Claude Code, Agent SDK, Claude API e MCP.
- **O simulado não revela domínio nem objetivo.** Dentro de cada arquivo as
  questões vêm embaralhadas entre os test objectives. O mapeamento
  (domínio → task statement → objetivo do livro03) vive **só no gabarito**.

## Arquivos

| Domínio | Peso | Simulado | Gabarito |
|---|---|---|---|
| 1 — Agentic Architecture & Orchestration | 27% | `dominio-1_simulado.md` | `dominio-1_gabarito.md` |
| 2 — Tool Design & MCP Integration | 18% | `dominio-2_simulado.md` | `dominio-2_gabarito.md` |
| 3 — Claude Code Configuration & Workflows | 20% | `dominio-3_simulado.md` | `dominio-3_gabarito.md` |
| 4 — Prompt Engineering & Structured Output | 20% | `dominio-4_simulado.md` | `dominio-4_gabarito.md` |
| 5 — Context Management & Reliability | 15% | `dominio-5_simulado.md` | `dominio-5_gabarito.md` |

## Como usar

O formato de sessão do candidato é **10 questões por lote, embaralhadas, sem
revelar o domínio** — peça "me testa" e o sorteio é feito na hora, atravessando
os 5 arquivos. O % por domínio só aparece no fim da rodada.

Cada entrada do gabarito traz, além da resposta:

- **Domínio + task statement + test objective** do `livro03.md`
- **Por que cada alternativa está certa ou errada** (em português — é o momento de ensino)
- **Palavras-gatilho**: as 2–4 expressões em inglês do enunciado que mudam a leitura,
  glosadas em PT-BR. Leia essa linha **depois** de responder, nunca antes.
  Campo só deste material de origem, para uso manual — não é portado para o
  Simulador CCA-F (o app não tem esse campo no formato do gabarito nem o
  exibe em tela).

## Aviso

Questões derivadas de material de terceiros (Andrew Brown), para **estudo
pessoal**. Não redistribuir. Onde o material do curso diverge da documentação
oficial da Anthropic, **a documentação oficial vence** — o gabarito sinaliza
esses pontos com ⚠️.

## Manutenção

| Script | O que faz |
|---|---|
| `embaralhar.py` | Redistribui a posição da alternativa correta (15 por letra em cada bloco). As questões são escritas com a correta em A e embaralhadas depois; o `.dominio-N.lock` impede embaralhar duas vezes. |
| `verificar.py` | Confere contagem, formato das alternativas e sincronia simulado↔gabarito. Rode antes de commitar qualquer edição. |

## Verificação de fatos

Os fatos de mecanismo foram conferidos na documentação oficial com citação literal
(regra dura do `CLAUDE.md`). Verificados nesta geração:

| Fato | Fonte |
|---|---|
| Escopos MCP (Local > Project > User) e expansão `${VAR}` / `${VAR:-default}` | https://code.claude.com/docs/en/mcp.md |
| Permission rules `mcp__<server>` / `mcp__<server>__<tool>` / `mcp__*` | https://code.claude.com/docs/en/permissions.md |
| `is_error` no bloco `tool_result` (snake_case) | https://platform.claude.com/docs/en/agents-and-tools/tool-use/handle-tool-calls |
| `tool_choice`: `auto` / `any` / `tool` / `none` | https://platform.claude.com/cookbook/tool-use-tool-choice |
| Batches: janela de 24h · 50% do preço · 100.000 requests ou 256 MB | https://platform.claude.com/docs/en/build-with-claude/batch-processing |

⚠️ **Correção ao material do curso:** `retryable` / `isRetryable` **não é** campo da
Messages API. É uma convenção que você coloca no payload de erro da sua própria tool
(ou de um servidor MCP) para o agente mapear tipo de erro → ação. O campo da API é
`is_error`. Tratado nas questões do Bloco 2.
