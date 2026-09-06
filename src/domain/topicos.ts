/** Catálogo central de tópicos (Fase 3 do plano de aprendizado).
 *
 * Cada tópico corresponde a um task statement da certificação — mesma
 * granularidade e mesmos rótulos já usados em `**Tópicos:**` no conteúdo
 * real (`content/simulados/**\/*_gabarito.md`); ver `parser.ts`. `id` é
 * estável e independente do texto de `nome` (não deriva por slugify), para
 * não quebrar se o rótulo mudar de redação no futuro.
 *
 * Este módulo é dado estático, não lógica: fica em `domain/` (não
 * `lib/`) porque é vocabulário do domínio de aprendizado, reaproveitado por
 * várias features (catálogo de materiais, estatística por tópico, "praticar
 * este tópico"), nunca acoplado a uma tela específica.
 */
export interface Topico {
  id: string;
  nome: string;
  /** Mesmo número usado em `Questao.dominio` — não um rótulo textual: o
   * app hoje só exibe "Domínio N" (ver `src/lib/catalogo/index.ts`), nunca
   * um nome descritivo por domínio; inventar um aqui divergiria do resto
   * do código sem necessidade. */
  dominio: number;
}

export const TOPICOS: Topico[] = [
  { id: "loop-agentico", nome: "Loop Agêntico", dominio: 1 },
  { id: "coordenador-e-subagentes", nome: "Coordenador e Subagentes", dominio: 1 },
  { id: "spawn-de-subagentes", nome: "Spawn de Subagentes", dominio: 1 },
  { id: "enforcement-de-workflow", nome: "Enforcement de Workflow", dominio: 1 },
  { id: "hooks", nome: "Hooks", dominio: 1 },
  { id: "decomposicao-de-tarefas", nome: "Decomposição de Tarefas", dominio: 1 },
  { id: "resume-e-fork-de-sessao", nome: "Resume e Fork de Sessão", dominio: 1 },

  { id: "descricoes-de-tools", nome: "Descrições de Tools", dominio: 2 },
  { id: "erros-estruturados", nome: "Erros Estruturados", dominio: 2 },
  { id: "tool-choice", nome: "Tool Choice", dominio: 2 },
  { id: "mcp-servers", nome: "MCP Servers", dominio: 2 },
  { id: "built-in-tools", nome: "Built-in Tools", dominio: 2 },

  { id: "hierarquia-claudemd", nome: "Hierarquia CLAUDE.md", dominio: 3 },
  { id: "commands-e-skills", nome: "Commands e Skills", dominio: 3 },
  { id: "path-rules", nome: "Path Rules", dominio: 3 },
  { id: "plan-mode", nome: "Plan Mode", dominio: 3 },
  { id: "refinamento-iterativo", nome: "Refinamento Iterativo", dominio: 3 },
  { id: "ci-cd", nome: "CI/CD", dominio: 3 },

  { id: "criterios-explicitos", nome: "Critérios Explícitos", dominio: 4 },
  { id: "few-shot", nome: "Few-Shot", dominio: 4 },
  { id: "tool-use-schema", nome: "Tool Use Schema", dominio: 4 },
  { id: "validacao-e-retry", nome: "Validação e Retry", dominio: 4 },
  { id: "batch-processing", nome: "Batch Processing", dominio: 4 },
  { id: "revisao-multi-instancia", nome: "Revisão Multi-Instância", dominio: 4 },

  { id: "contexto-longo", nome: "Contexto Longo", dominio: 5 },
  { id: "escalacao-de-ambiguidade", nome: "Escalação de Ambiguidade", dominio: 5 },
  { id: "propagacao-de-erros", nome: "Propagação de Erros", dominio: 5 },
  { id: "contexto-de-codebase", nome: "Contexto de Codebase", dominio: 5 },
  { id: "revisao-e-calibracao", nome: "Revisão e Calibração", dominio: 5 },
  { id: "proveniencia-e-sintese", nome: "Proveniência e Síntese", dominio: 5 },
];

const POR_NOME = new Map(TOPICOS.map((t) => [t.nome, t]));
const POR_ID = new Map(TOPICOS.map((t) => [t.id, t]));

/** Resolve o `nome` gravado em `Questao.topicos`/`questoes_rodada` para o
 * `Topico` completo do catálogo. `undefined` se o nome não bater com
 * nenhuma entrada (conteúdo com tag fora do catálogo — não deveria
 * acontecer com o corpus curado, mas quem chama decide como tratar). */
export function topicoPorNome(nome: string): Topico | undefined {
  return POR_NOME.get(nome);
}

export function topicoPorId(id: string): Topico | undefined {
  return POR_ID.get(id);
}
