# Simulado de Revisão — CCA-F | Domínio 1 (Agentic Architecture & Orchestration)

**Cobre:** 1.1 a 1.7 (misturados), com 4 questões cruzadas (combinam dois task statements).
**Formato:** múltipla escolha — 1 correta + 3 distratores (formato oficial; questões em inglês).
**Resumo relacionado:** `anotacoes/dominio-1_resumo.md`

> Responda tudo antes de abrir `dominio-1_revisao_gabarito.md`. Meta: ≥ 80% de acerto. Este simulado é mais difícil que os de tópico — é o fechamento do domínio de maior peso (27%).

---

## Q1
A developer-productivity team migrates a Claude Code CLI helper from a hand-rolled Messages API loop to the Claude Agent SDK's `query()` function, but keeps their old `while stop_reason == "tool_use"` loop wrapped around the SDK call, re-executing any `tool_use` block it observes in the message stream. After the migration, telemetry across 300 runs shows 12% of tool calls with side effects — a file edit or a git commit — execute twice in the same run, with the second execution's result silently discarded. What is the most likely cause, and what fixes it?

- **A)** The Agent SDK's `query()` already runs the complete agentic loop internally; the hand-rolled outer loop is redundant and re-executes tools the SDK already ran. Remove the outer loop and consume the stream directly.
- **B)** The duplication happens because `max_tokens` is set too low for the tool's full JSON result to fit in a single response, causing the harness to silently reissue the identical call to retrieve the missing remainder of that result, one extra time per truncated call.
- **C)** Add a `PostToolUse` hook that checks whether an identical tool call with the same name and arguments already ran earlier in the session, and silently skips executing it again whenever that turns out to be the case, logging the skip for later audit.
- **D)** Switch the coordinator to a smaller model so it emits fewer `tool_use` blocks per turn overall, on the reasoning that fewer requested tool calls means a lower chance any single side-effecting call gets issued more than once.

## Q2
A customer support resolution coordinator is redesigned so that, instead of always invoking all three of its billing, technical, and security subagents, it classifies each ticket once at intake and invokes only the subagents matching that classification — cutting average resolution latency by 35%. For tickets that start as a pure billing question and only reveal a security concern after the billing subagent's own reply mentions it (e.g., "I also noticed unauthorized login attempts on this account"), the final report never covers the security angle, because the coordinator's classification already ran before that detail ever surfaced. What change addresses this without reverting to invoking every subagent on every ticket?

- **A)** Revert to always invoking all three subagents on every ticket regardless of classification, treating the added latency as an acceptable fixed cost of never missing an angle again.
- **B)** Have the coordinator inspect each subagent's returned findings for signals of a newly relevant angle — like the unexpected security mention — and dispatch the matching subagent before closing the ticket, instead of fixing the roster once at intake.
- **C)** Have the billing subagent, once it notices a security signal, message the security subagent directly to hand off the ticket, bypassing the coordinator entirely.
- **D)** Add a classifier that flags ticket replies sounding "urgent," and automatically escalate any ticket whose reply crosses that urgency threshold straight to a human agent.

## Q3
A multi-agent research coordinator keeps an internal running list of 12 candidate sources it has evaluated, indexed as source #1 through #12. When it spawns the synthesis subagent, the prompt reads: "Write the report using primarily sources #3, #7, and #11, the strongest ones." The synthesis subagent's report cites three sources, but none of its claims match the actual content of #3, #7, or #11 — it invents plausible-sounding claims and attributes them to sources that don't exist. What is the root cause, and what fixes it?

- **A)** Give the synthesis subagent `WebFetch` access so it can look up sources #3, #7, and #11 on its own, using the index numbers as search hints to locate them.
- **B)** Set `share_context=True` when spawning the synthesis subagent, so it can see the coordinator's internal source list automatically instead of relying on whatever is written in its prompt.
- **C)** The subagent's context is isolated from the coordinator's internal list; referencing sources only by index gave it no real content to reason over, so it fabricated citations. Include the actual content of #3, #7, and #11 directly in the spawn prompt.
- **D)** Run the synthesis step three times independently and keep only the citations that appear in at least two of the three separate runs, treating that cross-run agreement as a reliability filter for deciding which of the invented-sounding sources are genuine.

## Q4
A developer-productivity agent may open pull requests automatically, but policy requires that any PR touching files under `db/migrations/` must always wait for a human reviewer's explicit approval before merging, regardless of how confident the agent is in the change. The system prompt already states "never auto-merge migration files," repeated in bold. In 4% of recent runs, the agent's `auto_merge` call still went through on a migration-touching PR, because the agent judged that specific migration "trivial enough" to proceed despite the rule. What is the most effective fix?

- **A)** Rewrite the system prompt rule with even stronger, more emphatic wording, making clear that no judgment call about triviality is ever allowed to override the no-auto-merge policy.
- **B)** Add a classifier that scores how "trivial" a migration diff looks, and only block `auto_merge` when that trivialness score falls below a chosen risk threshold.
- **C)** Add a `PreToolUse` hook that denies `auto_merge` whenever the PR's changed files include any path under `db/migrations/`, regardless of what the agent itself judges about the change.
- **D)** Add a `PostToolUse` hook that detects, only after the fact, when a migration-touching PR merged without human approval, and then automatically reverts that already-completed merge and reopens the PR for manual review.

## Q5
A customer support agent's `PostToolUse` hook is registered with `HookMatcher(matcher="mcp__billing__.*")`, intended to normalize timestamps returned only by `mcp__billing__get_order`. After a new tool, `mcp__billing__get_order_notes` — which returns free-text customer notes, not timestamps — is added to the same MCP server, the hook's date-parsing logic starts running against its output too, and 8% of order notes are silently corrupted because the regex partially matches unrelated digits inside the free text. What is the most effective fix?

- **A)** Narrow the `HookMatcher` to the exact tool name it is meant to normalize (or an anchored pattern), so the hook fires only for `get_order` and not for any other tool sharing the `mcp__billing__` prefix.
- **B)** Move the normalization logic from `PostToolUse` to `PreToolUse`, since intercepting the call before it executes would stop the corruption from ever reaching the model.
- **C)** Add a classifier inside the hook that first predicts, from the raw output text, whether a given tool's response "looks like" it contains a timestamp before applying the date-parsing regex.
- **D)** Disable the hook for now, and add a system-prompt instruction asking the model to double-check that order notes were not accidentally corrupted before it relies on them.

## Q6
A multi-agent research pipeline always runs the same four fixed stages for every literature-review query: keyword search, citation retrieval, cross-reference check, and summary synthesis. For 85% of queries this predictable order works well, but for the remaining 15% — open-ended "landscape" queries with no obvious search terms — the fixed keyword-search stage returns near-empty results and the whole pipeline collapses, since it assumed keyword search would always succeed first. A teammate proposes making the entire pipeline dynamic for every query, including the 85% that already work fine. Is that the right level of change?

- **A)** No — instead, keep the fixed four-stage pipeline for every query, but add a classifier that scores each query's likely keyword-search success in advance, and skip straight to summary synthesis whenever that score is low.
- **B)** Yes — since some queries already break the fixed pipeline, replacing it entirely with a dynamic planner for every query is the safer, more future-proof design, regardless of how well the 85% already perform.
- **C)** No — only the 15% open-ended queries need dynamic decomposition (explore first, then plan adaptive follow-ups); the 85% that fit the predictable flow should stay on the fixed pipeline, routing the two query types to different strategies.
- **D)** No — keep the fixed pipeline exactly as it is today, but whenever keyword search returns near-empty results for a landscape query, have the citation-retrieval stage silently reuse whatever citations the keyword-search stage happened to return for the most recent, entirely unrelated query instead.

## Q7
An engineer forks a completed dependency-upgrade session (`fork_session=True`) to try a riskier upgrade path, producing a new session with its own id, `fork-A`. Satisfied with that direction, she wants to keep iterating on `fork-A` across several more turns today, and worries that resuming it normally — `resume="fork-A"`, with `fork_session` left at its default — might accidentally re-branch away from the very fork she is trying to continue, or otherwise disturb the original session it came from. Is her concern warranted?

- **A)** Yes — every `resume` call on a session that itself originated from a fork implicitly re-forks it again, so continuing this way keeps spinning off new session ids on every turn instead of accumulating history in place.
- **B)** No — `fork-A` is a session in its own right; resuming it by its own id with `fork_session` at default simply continues accumulating its own history, the same as resuming any other session, with no further effect on the original.
- **C)** Yes — because `fork-A` was created from the original session, resuming it enough times will eventually merge its new turns back into that original session automatically.
- **D)** No — but only because she must set `fork_session=True` again on every later resume of `fork-A`, since any session created by a fork requires that flag on every subsequent turn to stay safe.

## Q8
In a customer support system, disputes over $1,000 must be escalated to a human billing specialist. Today, the escalation tool attaches the entire 50-message ticket transcript as-is, with no summary and no extracted fields. A time-motion study finds specialists spend a median of 9 minutes per case just re-reading the transcript to find the disputed transaction id, the amount, and what the customer already tried, before they can start actually resolving anything. What handoff design most directly addresses this?

- **A)** Reduce the attached transcript to only the last 10 messages instead of all 50, on the theory that the most recent messages are the ones most likely to contain what the specialist needs.
- **B)** Require the specialist to first re-run the case through the same billing subagent that originally handled it, so that subagent can regenerate its own account of what happened before the specialist starts reading anything.
- **C)** Add a sentiment classifier that scores which of the 50 messages sound most "frustrated," and surface only those flagged messages to the specialist first.
- **D)** Attach a structured summary with fixed fields — disputed transaction id, amount, prior remediation attempts, root-cause hypothesis, recommended next step — instead of the raw transcript.

## Q9
A multi-agent research coordinator runs its own agentic loop: each turn it either calls the `Task` tool to spawn a subagent or, once satisfied, emits a final answer. In production, once a subagent finishes, the harness appends only the subagent's raw output as a new plain user-role text message — not a `tool_result` block matched to the original `Task` call's `tool_use_id` — before calling the API again. Across every run with two or more subagents, the coordinator re-spawns the exact same subagent repeatedly, up to a hard cap of 8 spawns, even though the subagent fully answered the first time. What is the root cause, and what fixes it?

- **A)** No `tool_result` was ever matched to that `tool_use_id`, so the model never sees the spawn answered and reissues the same call. Feed the result back as a matched `tool_result`, and stop on `stop_reason == "end_turn"`.
- **B)** Cap the number of times any single subagent type may be spawned at 1 for the entire session, hard-blocking any second spawn of that subagent no matter what the surrounding conversation state looks like, and logging every blocked attempt for review.
- **C)** Add a system-prompt rule instructing the coordinator never to spawn the same subagent twice in a row within the same run, restating the rule again at the top of every subsequent turn for reinforcement.
- **D)** Give the coordinator a larger context window, since repeatedly re-spawning the same subagent is a sign that earlier turns — including the missing spawn result — are falling out of the model's attention span.

## Q10
A customer support system enforces a `PreToolUse` gate that denies `process_refund` above $500 without prior manager approval, redirecting the agent to call `request_manager_approval` instead — this works in 100% of trials. Separately, once a refund does go through, the same tool's raw result returns the processed amount as a string with inconsistent currency formatting (`"$1,200.00"`, `"1200 USD"`, `"USD 1200"`, depending on which regional endpoint handled it), and 15% of customer-facing confirmation messages show that raw string verbatim. The team wants to fix the formatting without touching the approval gate that already works correctly. What is the right combined design?

- **A)** Move the approval-gate logic out of `PreToolUse` and into the same `PostToolUse` stage as the formatting fix, combining both into one hook that normalizes the amount and retroactively reverses any refund that should not have gone through.
- **B)** Leave the `PreToolUse` approval gate exactly as-is, and add a separate `PostToolUse` hook on the same tool that rewrites the processed-amount string into one consistent currency format via `updatedToolOutput`, since gating execution and normalizing a result are different jobs at different stages.
- **C)** Add a system-prompt instruction asking the model to always rewrite refund confirmation amounts into one consistent currency format before it sends them to the customer.
- **D)** Replace the currency-formatting fix with a classifier that detects which of the three regional formats a given string is in, and escalates to a human for manual reformatting whenever its confidence is below a threshold.

## Q11
A multi-agent research coordinator investigating why churn differs between the SMB and Enterprise segments decomposes the work by data source into three subagents — one each for CRM notes, billing/usage logs, and support-ticket transcripts. All three return clean, well-supported reports, matching the same by-source split that worked cleanly across the coordinator's last 8 quarterly investigations. This quarter, when the coordinator assembles the three reports into one answer, none of them addresses the original question, because every report is organized by source and no subagent was ever asked to compare SMB against Enterprise — that comparison axis never entered any subagent's scope. What is the most effective fix?

- **A)** Add a fourth subagent whose only job is to re-read the three existing source-based reports after the fact and manually sort their content into SMB versus Enterprise buckets.
- **B)** Collapse the three source-specific subagents into a single subagent that reads CRM notes, billing/usage logs, and support-ticket transcripts together in one context, on the assumption that seeing every source at once lets it work out the segment comparison on its own.
- **C)** Have the coordinator inspect each subagent's per-source report after the fan-out for segment-level detail it seems to be missing, and spawn additional subagents to fill in any gaps it finds before closing the report.
- **D)** Re-decompose the work along the axis the question actually requires — one subagent per segment (SMB, Enterprise), each analyzing all three data sources for its own segment — and only then compare the two segment-level reports.

## Q12
A research team has one fully analyzed session — 25 sources ingested, findings synthesized — that a stakeholder already signed off on. They now want to explore two independent follow-up angles in parallel on top of that baseline: each follow-up should spawn its own pair of specialized subagents (a searcher and a fact-checker) via the `Task` tool, and neither follow-up's subagents should be able to see or influence the other follow-up's work in any way. What combined design achieves this?

- **A)** Spawn all four subagents — two searchers, two fact-checkers — from the single original session in one turn, relying on each subagent's own isolated context alone to keep the two follow-up angles from interfering with each other.
- **B)** Fork the analyzed session twice with `fork_session=True`, once per follow-up angle, so each gets its own independent branch off the same baseline; within each fork, the coordinator spawns its own searcher and fact-checker subagents via `Task` as usual.
- **C)** Set `share_context=True` when spawning each follow-up's subagents, so each pair can reference the original baseline's full findings directly without needing to fork anything at all.
- **D)** Call `resume` on the original session's id twice, once per follow-up angle, on the assumption that each `resume` call automatically creates its own independent branch the same way `fork_session=True` would.
