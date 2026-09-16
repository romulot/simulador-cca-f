# Simulado Geral 01 — CCA-F (todos os domínios)

**Cobre:** Domínios 1–5, 2 questões por domínio.
**Distribuição:** D1 (Q1–Q2) · D2 (Q3–Q4) · D3 (Q5–Q6) · D4 (Q7–Q8) · D5 (Q9–Q10)
**Formato:** múltipla escolha — 1 correta + 3 distratores (formato oficial; questões em inglês)

> Responda tudo antes de abrir `simulado_geral_01_gabarito.md`. Meta: ≥ 80% de acerto (8/10).

---

## Q1 — Domínio 1 · Task Statement 1.2 (Coordinator/Subagent)
A medical-triage coordinator spawns three specialized subagents: `diagnosis`, `medication-check`, and `history-review`. When launching the `diagnosis` subagent, the coordinator passes only the patient's chief complaint in a short prompt: "The patient reports chest pain." Across 500 cases, the diagnosis subagent's recommendations are clinically wrong 31% of the time — almost always because it recommends treatments contraindicated by the patient's medication list or prior conditions. The coordinator has the full patient record available in its own context. What is the most effective fix?

- **A)** Give the `diagnosis` subagent direct read access to the hospital's EHR system via a tool so it can independently fetch the full patient record whenever it needs additional context.
- **B)** Inject the complete patient context — chief complaint, medication list, and relevant history — into the `diagnosis` subagent's prompt at spawn time, since each subagent starts with a fresh context and only knows what the coordinator explicitly provides.
- **C)** Add a `post-diagnosis` validation subagent that reviews each recommendation against the medication list after the fact, and flags contradictions for human review.
- **D)** Reduce the number of concurrent subagent invocations so the coordinator serializes all three agents and can inject corrections between steps based on earlier outputs.

## Q2 — Domínio 1 · Task Statement 1.4 (Workflow Enforcement)
A code review agent is supposed to always execute three steps in strict order: (1) lint, (2) security scan, (3) approval decision. The current implementation instructs Claude in the system prompt to "always lint first, then security scan, then decide." In 7% of runs, the agent skips directly to the approval decision — sometimes flagging clean code that has security vulnerabilities that a proper scan would have caught. What is the most robust way to enforce the mandatory order?

- **A)** Replace the natural-language instruction with a structured workflow in the harness itself: lint is called first by the harness unconditionally, its output is passed to the security scan tool, and only then does the harness allow the approval tool to be invoked — the model never has discretion over the order.
- **B)** Add more detailed few-shot examples in the system prompt showing the correct three-step sequence, so Claude learns from examples that skipping steps produces worse outcomes.
- **C)** Switch to a larger, more capable Claude model — the 7% skip rate is a reasoning failure that a more powerful model with better instruction-following would resolve.
- **D)** Add a `PostToolUse` hook that detects when the approval tool is called and automatically re-runs the linting and security scan after the fact if they were skipped.

## Q3 — Domínio 2 · Task Statement 2.1 (Tool Descriptions)
A customer support agent has a `retrieve_documents` tool whose description reads: "Retrieves relevant documents." In production, the agent calls this tool on virtually every turn — including turns where the user asks "What time is it?" or "Can you repeat that?" — causing unnecessary latency and cost. The tool's schema, input types, and the rest of the system prompt are correctly configured. What is the most effective fix?

- **A)** Change `tool_choice` to `{"type": "none"}` globally so the agent stops calling tools until the team rewrites the system prompt with explicit tool-calling instructions.
- **B)** Rewrite the tool description to specify exactly when the tool should be called: what inputs justify a lookup (a specific product, policy, or case number), and what inputs don't (greetings, clarifications, time-related questions) — so the model can make a correct cost/benefit decision.
- **C)** Add a classifier in front of the agent that routes only "document-related" messages to the agent, and handles all other messages with a simpler, tool-free model.
- **D)** Remove the `retrieve_documents` tool from the agent's tool list and inject retrieved documents directly into the system prompt at session start, so the model never needs to call a retrieval tool at runtime.

## Q4 — Domínio 2 · Task Statement 2.3 (tool_choice / Distribution)
A data-ingestion pipeline agent runs in two modes: `ingestion` (writes records to the database) and `analysis` (reads and summarizes). During `ingestion` mode, the agent occasionally calls the `analyze_data` tool unprompted — once per 50 runs — producing summary output instead of inserting the record. The `insert_record` and `analyze_data` tools are both present in the tool list in both modes. What is the most targeted fix?

- **A)** Remove `analyze_data` from the tool list entirely so the agent can never call it during ingestion, and add it back for analysis mode runs.
- **B)** Use `tool_choice: {"type": "tool", "name": "insert_record"}` during ingestion mode to force the model to always call `insert_record` on every turn, regardless of context.
- **C)** Remove both tools from the list during ingestion mode and rely solely on natural-language instructions telling the agent not to analyze data.
- **D)** Add a `PostToolUse` hook that detects `analyze_data` calls during ingestion and cancels their output, logging them as anomalies.

## Q5 — Domínio 3 · Task Statement 3.1 (CLAUDE.md Hierarchy)
An engineering team has a global `~/.claude/CLAUDE.md` that includes: "All code review comments must be written in English." A specific repository has a `CLAUDE.md` at its root containing: "Este projeto usa Português. Todos os comentários de revisão devem ser em Português." When developers work inside that repository, Claude continues writing review comments in English. What explains this behavior, and what is the correct fix?

- **A)** Claude reads only the global CLAUDE.md for performance reasons; project-level files are advisory. To enforce Portuguese, move the instruction to a `.claude/settings.json` key that overrides the global file.
- **B)** The global CLAUDE.md takes precedence over project-level files because global instructions are assumed to be organization-wide policy. The only fix is to remove the English instruction from the global file.
- **C)** Claude merges all CLAUDE.md files it finds, and when both files address the same concern with conflicting instructions, the global instruction wins because it was defined first. The fix is to rename the project-level file to `.claude/CLAUDE.md` so it is treated as the higher-priority override.
- **D)** CLAUDE.md files at the project level should override the global file for instructions that are more specific; the bug is that the project-level file uses a non-English instruction keyword. The fix is to rephrase the project instruction in English: "Write all review comments in Portuguese."

## Q6 — Domínio 3 · Task Statement 3.4 (Plan Mode vs. Direct Execution)
A developer on a new team asks Claude Code: "Refactor the entire authentication module." Claude immediately begins editing files across 12 locations without presenting a plan. The developer, unfamiliar with the codebase, had expected a proposal to review before any changes were made. Which CLAUDE.md configuration would create the safest interaction pattern for this kind of large, cross-cutting task?

- **A)** Add to CLAUDE.md: "Before making any changes that touch more than 3 files, enter plan mode and wait for explicit user approval of the plan before executing." This scopes the plan gate to the tasks where the risk of unreviewable surprise changes is highest.
- **B)** Add to CLAUDE.md: "Always ask the user for confirmation before writing any file." This creates a per-file approval gate that ensures no change happens without direct permission.
- **C)** Add to CLAUDE.md: "Never refactor authentication code." This prevents the specific task class that caused the problem.
- **D)** Add to CLAUDE.md: "Prefer small, atomic changes." This general principle naturally leads Claude to propose smaller, more reviewable steps without requiring a formal plan gate.

## Q7 — Domínio 4 · Task Statement 4.2 (Few-shot Prompting)
An invoice-data extraction agent achieves 78% accuracy on a test set of 200 invoices. After adding 5 few-shot examples to the system prompt — each showing an invoice image alongside the correctly structured JSON output — accuracy improves to 91%. A new team member claims: "The improvement happened because the model now has more total context to work with, so it performs better." What is the more precise explanation?

- **A)** The five examples increased the total token count of the prompt, giving the model a larger attention window over which to resolve ambiguity in the invoice fields.
- **B)** The examples act as a format specification: they demonstrate the exact schema, field names, and edge-case handling the team expects, reducing the distribution of plausible-but-wrong output formats the model might otherwise produce.
- **C)** The model fine-tuned itself in real time using the five examples as training signal, updating its internal weights to match the desired extraction pattern.
- **D)** Adding examples improves performance because it instructs the model to "try harder" — the presence of worked examples signals that this is a high-stakes task requiring more careful reasoning.

## Q8 — Domínio 4 · Task Statement 4.4 (Validation & Retry)
A SQL-generation agent produces syntactically invalid queries on ~12% of first attempts. The team wants a retry loop: execute the query against a validation endpoint, and if it fails, ask Claude to fix the error and try again. Which design introduces the least risk of infinite loops while preserving the agent's ability to recover from genuine mistakes?

- **A)** Retry indefinitely until the query passes validation, since any finite cap would risk abandoning a query that just needs one more correction.
- **B)** Retry up to N times (e.g., 3), passing the specific validation error message back to Claude each time; stop and surface an error to the caller if validation hasn't passed after N attempts.
- **C)** On the first failure, immediately escalate to a human reviewer rather than asking Claude to self-correct, since the model that generated the wrong query is unlikely to fix it correctly.
- **D)** Add a second Claude call that independently generates an alternative query from scratch each time the first fails, using a higher temperature to increase variety, repeating until one passes.

## Q9 — Domínio 5 · Task Statement 5.2 (Escalation & Ambiguity)
A research agent is given the task: "Summarize the recent regulatory changes affecting fintech companies." The task provides no time window, no jurisdiction, and no definition of "fintech." The agent produces a confident, well-formatted 4-page summary. A compliance officer reviewing it notes it conflates EU regulations from 2019, US regulations from 2023, and UK regulations from 2024 as if they were a single unified framework — producing a document that could mislead a reader into misapplying regulations across jurisdictions. What was the root failure in the agent's behavior?

- **A)** The agent lacked access to a legal database tool and fabricated the regulatory content based on its training data, which is inherently outdated.
- **B)** The agent failed to escalate on unresolved ambiguity: instead of acknowledging that "recent," "fintech," and the missing jurisdiction made the task under-specified and asking for clarification, it resolved all ambiguities silently on its own and produced a confident answer that obscured its assumptions.
- **C)** The agent's system prompt did not include enough few-shot examples of properly scoped regulatory summaries, so the model defaulted to the broadest possible interpretation.
- **D)** The failure is a hallucination problem: the model invented regulatory details not present in its training data and should be replaced with a model that has a more recent knowledge cutoff.

## Q10 — Domínio 5 · Task Statement 5.3 (Error Propagation)
A three-step invoice pipeline runs as follows: Step 1 extracts the client name from an email body; Step 2 looks up the client's contract by exact name match in the database; Step 3 calculates and logs the invoice amount from the contract. An email arrives mentioning "ACME Corp," but the database contains the entry "Acme Corporation." Step 2 returns an empty result; Step 3 silently calculates a $0 invoice and logs it without raising any flag. No error is surfaced at any point. What single intervention most effectively prevents silent propagation of this class of mismatch error through the pipeline?

- **A)** Replace the exact-name lookup in Step 2 with a fuzzy-match search that returns the closest database entry, so "ACME Corp" maps to "Acme Corporation" automatically.
- **B)** Add explicit validation at the boundary between Step 2 and Step 3: if the contract lookup returns an empty or ambiguous result, the pipeline must halt and surface an actionable error — rather than passing a null/empty value downstream where it silently corrupts the output.
- **C)** Add a final review step after Step 3 that audits all invoices below a configurable minimum threshold (e.g., $1) and flags them for human review.
- **D)** Standardize all client names to uppercase in both the email extraction step and the database, so "ACME Corp" and "Acme Corporation" would both normalize to "ACME CORP" and match.
