/** Catálogo de materiais de estudo (Fase 4/5 do plano de aprendizado).
 *
 * Só documentação oficial da Anthropic, verificada por busca na web em
 * 2026-09-06 (URLs conferidas uma a uma; nenhuma inventada). Vídeos de
 * terceiros ficam de fora deliberadamente — curadoria de vídeo exige
 * julgamento humano sobre qualidade/precisão que não dá pra automatizar
 * com segurança (ver 8.3 do plano). Adicionar aqui manualmente quando
 * houver vídeos vetados.
 *
 * `docs.claude.com`/`docs.anthropic.com` hoje redirecionam: páginas de
 * Claude Code foram para `code.claude.com/docs/en/...`, páginas de API/
 * Claude Platform foram para `platform.claude.com/docs/en/...`. Os posts
 * do blog de engenharia (`anthropic.com/engineering/...`) não redirecionam.
 * Todas as URLs abaixo já apontam para o destino final.
 */
export type TipoRecurso = "documentacao" | "artigo" | "video";

export interface RecursoEstudo {
  id: string;
  topicoId: string;
  titulo: string;
  tipo: TipoRecurso;
  url: string;
  fonte: string;
  idioma?: "pt-BR" | "en";
  duracaoMinutos?: number;
  oficial: boolean;
}

const SUB_AGENTS = "https://code.claude.com/docs/en/sub-agents";
const HOOKS_GUIDE = "https://code.claude.com/docs/en/hooks-guide";
const MEMORY = "https://code.claude.com/docs/en/memory";
const BUILDING_EFFECTIVE_AGENTS = "https://www.anthropic.com/engineering/building-effective-agents";
const WRITING_TOOLS_FOR_AGENTS = "https://www.anthropic.com/engineering/writing-tools-for-agents";
const MULTI_AGENT_RESEARCH = "https://www.anthropic.com/engineering/multi-agent-research-system";
const CONTEXT_ENGINEERING = "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents";

export const RECURSOS: RecursoEstudo[] = [
  // Domínio 1 — Orquestração e agentes
  { id: "loop-agentico-bea", topicoId: "loop-agentico", titulo: "Building Effective AI Agents", tipo: "artigo", url: BUILDING_EFFECTIVE_AGENTS, fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "coordenador-subagentes-doc", topicoId: "coordenador-e-subagentes", titulo: "Create custom subagents", tipo: "documentacao", url: SUB_AGENTS, fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "spawn-subagentes-doc", topicoId: "spawn-de-subagentes", titulo: "Create custom subagents", tipo: "documentacao", url: SUB_AGENTS, fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "enforcement-workflow-doc", topicoId: "enforcement-de-workflow", titulo: "Automate actions with hooks", tipo: "documentacao", url: HOOKS_GUIDE, fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "hooks-doc", topicoId: "hooks", titulo: "Automate actions with hooks", tipo: "documentacao", url: HOOKS_GUIDE, fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "decomposicao-tarefas-bea", topicoId: "decomposicao-de-tarefas", titulo: "Building Effective AI Agents", tipo: "artigo", url: BUILDING_EFFECTIVE_AGENTS, fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "resume-fork-doc", topicoId: "resume-e-fork-de-sessao", titulo: "CLI reference (--resume, --continue, --fork-session)", tipo: "documentacao", url: "https://code.claude.com/docs/en/cli-reference", fonte: "Anthropic", idioma: "en", oficial: true },

  // Domínio 2 — Tool design & MCP
  { id: "descricoes-tools-doc", topicoId: "descricoes-de-tools", titulo: "Writing effective tools for AI agents", tipo: "artigo", url: WRITING_TOOLS_FOR_AGENTS, fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "erros-estruturados-doc", topicoId: "erros-estruturados", titulo: "Writing effective tools for AI agents", tipo: "artigo", url: WRITING_TOOLS_FOR_AGENTS, fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "tool-choice-doc", topicoId: "tool-choice", titulo: "Define tools (tool_choice: auto/any/tool/none)", tipo: "documentacao", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools", fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "mcp-servers-doc", topicoId: "mcp-servers", titulo: "Connect Claude Code to tools via MCP", tipo: "documentacao", url: "https://code.claude.com/docs/en/mcp", fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "built-in-tools-doc", topicoId: "built-in-tools", titulo: "Claude Code settings (permissões por ferramenta)", tipo: "documentacao", url: "https://code.claude.com/docs/en/settings", fonte: "Anthropic", idioma: "en", oficial: true },

  // Domínio 3 — Configuração e workflow
  { id: "hierarquia-claudemd-doc", topicoId: "hierarquia-claudemd", titulo: "How Claude remembers your project", tipo: "documentacao", url: MEMORY, fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "commands-doc", topicoId: "commands-e-skills", titulo: "Slash commands", tipo: "documentacao", url: "https://code.claude.com/docs/en/slash-commands", fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "skills-doc", topicoId: "commands-e-skills", titulo: "Extend Claude with skills", tipo: "documentacao", url: "https://code.claude.com/docs/en/skills", fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "path-rules-doc", topicoId: "path-rules", titulo: "How Claude remembers your project (.claude/rules/, paths)", tipo: "documentacao", url: MEMORY, fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "plan-mode-doc", topicoId: "plan-mode", titulo: "Interactive mode (plan mode)", tipo: "documentacao", url: "https://code.claude.com/docs/en/interactive-mode", fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "refinamento-iterativo-bea", topicoId: "refinamento-iterativo", titulo: "Building Effective AI Agents", tipo: "artigo", url: BUILDING_EFFECTIVE_AGENTS, fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "ci-cd-doc", topicoId: "ci-cd", titulo: "Claude Code GitHub Actions", tipo: "documentacao", url: "https://code.claude.com/docs/en/github-actions", fonte: "Anthropic", idioma: "en", oficial: true },

  // Domínio 4 — Prompting e avaliação
  { id: "criterios-explicitos-doc", topicoId: "criterios-explicitos", titulo: "Be clear, direct, and detailed", tipo: "documentacao", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/be-clear-and-direct", fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "few-shot-doc", topicoId: "few-shot", titulo: "Use examples (multishot prompting)", tipo: "documentacao", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/multishot-prompting", fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "tool-use-schema-doc", topicoId: "tool-use-schema", titulo: "Define tools (input_schema)", tipo: "documentacao", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/define-tools", fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "validacao-retry-bea", topicoId: "validacao-e-retry", titulo: "Building Effective AI Agents", tipo: "artigo", url: BUILDING_EFFECTIVE_AGENTS, fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "batch-processing-doc", topicoId: "batch-processing", titulo: "Batch processing (Message Batches API)", tipo: "documentacao", url: "https://platform.claude.com/docs/en/build-with-claude/batch-processing", fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "revisao-multi-instancia-doc", topicoId: "revisao-multi-instancia", titulo: "How we built our multi-agent research system", tipo: "artigo", url: MULTI_AGENT_RESEARCH, fonte: "Anthropic", idioma: "en", oficial: true },

  // Domínio 5 — Contexto, erros e síntese
  { id: "contexto-longo-doc", topicoId: "contexto-longo", titulo: "Effective context engineering for AI agents", tipo: "artigo", url: CONTEXT_ENGINEERING, fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "escalacao-ambiguidade-doc", topicoId: "escalacao-de-ambiguidade", titulo: "Trustworthy agents in practice", tipo: "artigo", url: "https://www.anthropic.com/research/trustworthy-agents", fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "propagacao-erros-doc", topicoId: "propagacao-de-erros", titulo: "Writing effective tools for AI agents", tipo: "artigo", url: WRITING_TOOLS_FOR_AGENTS, fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "contexto-codebase-doc", topicoId: "contexto-de-codebase", titulo: "Effective context engineering for AI agents", tipo: "artigo", url: CONTEXT_ENGINEERING, fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "revisao-calibracao-doc", topicoId: "revisao-e-calibracao", titulo: "How we built our multi-agent research system", tipo: "artigo", url: MULTI_AGENT_RESEARCH, fonte: "Anthropic", idioma: "en", oficial: true },
  { id: "proveniencia-sintese-doc", topicoId: "proveniencia-e-sintese", titulo: "How we built our multi-agent research system", tipo: "artigo", url: MULTI_AGENT_RESEARCH, fonte: "Anthropic", idioma: "en", oficial: true },
];

const POR_TOPICO = new Map<string, RecursoEstudo[]>();
for (const r of RECURSOS) {
  const lista = POR_TOPICO.get(r.topicoId) ?? [];
  lista.push(r);
  POR_TOPICO.set(r.topicoId, lista);
}

/** Materiais associados a um tópico, na ordem do catálogo (§7.2: oficial
 * primeiro, já refletido pela ordem de inserção acima). Array vazio — não
 * `undefined` — quando o tópico ainda não tem material curado. */
export function recursosPorTopico(topicoId: string): RecursoEstudo[] {
  return POR_TOPICO.get(topicoId) ?? [];
}
