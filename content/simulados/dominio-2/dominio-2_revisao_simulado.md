# Simulado de Revisão — CCA-F | Domínio 2 (Tool Design & MCP Integration)

**Cobertura:** 2.1 (descrições de tools) · 2.2 (erros estruturados) · 2.3 (distribuição/`tool_choice`) · 2.4 (MCP servers) · 2.5 (built-in tools).
**Formato:** múltipla escolha baseada em cenário — 1 correta + 3 distratores (questões em inglês). 12 questões, nível prova, maioria Médio/Difícil. Inclui **4 itens cruzados inéditos** (Q9–Q12) combinando task statements.

> Responda antes de consultar o gabarito em `dominio-2_revisao_gabarito.md`.

---

## Q1
In the Developer Productivity agent's refactor subagent (Scenario 4), telemetry across 300 requests phrased as "relocate this function to utils.py" shows 70% are routed to the catch-all `apply_codemod` tool ("Applies a code transformation.") instead of the more specific `move_symbol` tool, whose description ("Moves a symbol to a different file.") technically already covers exactly this operation. Neither description states when to prefer one over the other, and `apply_codemod`'s broad wording plausibly covers almost any rewrite phrasing, including the ones `move_symbol` was built to handle. What is the most effective fix?

- **A)** Rename the `apply_codemod` Python function to `_internal_codemod` so the model treats it as an implementation detail rather than a selectable option, without touching either tool's `description` field.
- **B)** Rewrite both descriptions to state their boundaries explicitly — `move_symbol` handles relocating a symbol between files (covering synonyms like "relocate"/"move"), and `apply_codemod` is scoped to transformations not covered by the other named tools — restoring a clear differentiator.
- **C)** Add a system-prompt rule mapping specific verbs ("relocate", "move", "shift") to `move_symbol`, and keep expanding that verb list by hand whenever a new phrasing gets routed to the wrong tool.
- **D)** Force `tool_choice` to `{"type":"tool","name":"move_symbol"}` for every request this subagent handles, since that guarantees the correct tool regardless of how the request is phrased.

## Q2
In production, the Customer Support Resolution Agent's `crm` MCP server entry in the project's `.mcp.json` (Scenario 1) reads `"url": "${CRM_BASE_URL}/mcp"` with no fallback default, and its `headers` block reads `"Authorization": "Bearer ${CRM_TOKEN}"`. After a support engineer's laptop was reimaged, every one of that engineer's sessions now fails before a single tool call executes, with a config-parsing error rather than a connection or authentication error, while every other engineer's laptop still works normally. What is the most likely explanation and correct fix?

- **A)** `CRM_BASE_URL` has no default and is missing from the reimaged laptop's environment, so the config fails to parse at load time; the fix is to set `CRM_BASE_URL` (and confirm `CRM_TOKEN`) in that machine's environment, not to touch the committed `.mcp.json`.
- **B)** The reimaged laptop pulled a stale copy of `.mcp.json` from a local cache; the fix is to delete Claude Code's cache directory so the file is re-read fresh, which resolves the parsing error on its own.
- **C)** Both variables silently resolve to empty strings on a machine where they are unset, so the server starts with a blank URL and token and only fails once it tries to connect — the fix is to set both variables before the next login.
- **D)** Move the `crm` entry from the project's `.mcp.json` into that one engineer's `~/.claude.json` with the values hardcoded, since user scope always takes precedence over project scope, will bypass the parsing issue, and saves that one machine from ever having to manage environment variables for this server again.

## Q3
In the Multi-Agent Research System (Scenario 3), a `tag_source` tool used by a labeling subagent begins failing on every call this week after an upstream schema change renamed the `source_id` field to `sourceId`; the subagent is still sending the old `source_id` key, and the same malformed payload is retried unchanged up to the harness's retry cap before every run gives up. What should `tag_source` return, and why?

- **A)** `errorCategory: "transient"`, `isRetryable: true`, since the underlying tagging service itself has not gone down and the request format is a minor, temporary mismatch that a retry loop typically works through.
- **B)** `is_error: true` with no other fields, since the subagent's own prompt is responsible for noticing the schema drift and correcting the field name on the next attempt.
- **C)** `errorCategory: "validation"`, `isRetryable: false`, with a message naming the expected field (`sourceId`) so the caller can correct the payload rather than repeat the identical malformed call.
- **D)** `errorCategory: "business"`, `isRetryable: false`, with a customer-facing message explaining the tagging policy, since a non-retryable error should always be categorized as `business` regardless of its actual cause.

## Q4
A coding agent in the Developer Productivity workflow (Scenario 4) is asked "which of these 200 config files still reference the deprecated `LEGACY_FLAG` setting?" It opens all 200 files one at a time with the Read tool and scans each for the string manually, which takes several minutes and occasionally times out before finishing. What is the most effective built-in-tool approach?

- **A)** Use the Glob tool with the pattern `**/*LEGACY_FLAG*` to find every file whose name matches, since Glob is the faster built-in for locating files across a large tree.
- **B)** Use the Bash tool to run `find . -exec grep -l LEGACY_FLAG {} \; | xargs -P4`, parallelizing the scan across four workers to cut down the wall-clock time.
- **C)** Write a small pre-indexing script that scans and caches all 200 files' contents into a lookup table before running the search, keeping the cache continuously synchronized with a background file-watcher so this and every future query hit the cache instead of the filesystem and results never go stale between one search and the next.
- **D)** Use the Grep tool to search for `LEGACY_FLAG` across the 200 files directly — it returns only the matching files/lines in structured form, instead of reading every file's full contents through Read.

## Q5
A customer-support pipeline (Scenario 1) requires that every session open with a mandatory `verify_identity` call before any other tool executes, and only after that first call succeeds should the agent freely choose among `lookup_account`, `process_refund`, and `escalate_to_human` for the rest of the conversation. A new engineer, wary of "over-constraining `tool_choice`," instead adds a system-prompt line: "Always call verify_identity first, before anything else." In a 200-session audit, 6% of sessions still open with a different tool being called first. What is the most effective fix?

- **A)** Keep the system-prompt instruction, but reword it more emphatically (e.g., in all caps) so the model is less likely to skip it on any given session.
- **B)** Force `tool_choice` to `{"type":"tool","name":"verify_identity"}` for every turn of the entire session, not only the first, to make absolutely sure identity is never skipped.
- **C)** Force `tool_choice` to `{"type":"tool","name":"verify_identity"}` on the session's first turn only, then return `tool_choice` to `"auto"` for every turn after that.
- **D)** Build a small classifier that reviews each session's opening message and predicts, before the first tool call, whether `verify_identity` is actually required this time.

## Q6
A `verify_claim_against_source` tool used by a fact-checking subagent (Scenario 3) has an otherwise well-written description — including a clear "use this when you need to check whether a stated claim is supported by a specific source" line — but the description's single worked example shows the tool being called to produce a plain-language summary of the source instead of a support/refute verdict. Across 60 recent calls, the subagent's outputs match the example's summary format in 80% of cases rather than returning a verdict. What is the most likely cause and fix?

- **A)** Remove the worked example entirely, since examples are inherently unreliable signals and the model should rely only on the prose description.
- **B)** Force `tool_choice` to `verify_claim_against_source` on every call, treating the repeated call itself as sufficient assurance that the subagent is at least attempting the right kind of check, even while its output format keeps not matching what the description declares.
- **C)** Add a system-prompt reminder telling the subagent "always return a verdict, not a summary, when using verify_claim_against_source."
- **D)** Rewrite the worked example so its output matches the declared verdict format (e.g., `{"claim": ..., "supported": true/false, "evidence": ...}`) — the example currently contradicts the stated purpose, and the model is imitating the example over the prose.

## Q7
In production, a developer-productivity engineer (Scenario 4) temporarily added a local-scope override for the team's `test-runner` MCP server, pointing its `command` at a locally patched debug binary while investigating a flaky test, and forgot to remove the override afterward. Three weeks later, every teammate who pulls the same branch runs the standard `test-runner` defined in the project's `.mcp.json`, but that one engineer's sessions keep silently launching the patched debug binary — well after the investigation ended, with no diff showing anywhere in the shared repository. What correctly explains this, and what should the engineer do?

- **A)** The debug binary was accidentally committed into `.mcp.json` at some point, so every teammate is secretly running the debug variant too — it just hasn't caused visible failures for anyone else yet.
- **B)** `.mcp.json` and local-scope overrides merge field-by-field, so only the `command` field changed for this engineer, while every other field (env, timeout) still comes from the shared project file.
- **C)** Local scope isn't committed or shared and takes precedence over project scope with no field merging, so only this engineer's machine resolves to the debug binary; the fix is to remove the local-scope override on that machine.
- **D)** Local-scope entries expire automatically after a fixed time window, so the override should have stopped applying on its own by now — something else must be causing the drift.

## Q8
A `charge_payment_method` tool wraps a third-party gateway (Scenario 1) that intermittently returns a 503 for about 1 in 15 calls, always succeeding on an immediate retry with the identical request; today it returns the identical `{"isError": true, "message": "Operation failed"}` payload for that 503 case and for a separate case where the account has an active compliance hold that blocks all charges by policy until manual review. A support engineer reviewing 400 recent failures cannot tell the two cases apart from the logs alone. What should the tool's response distinguish, and how should each be handled?

- **A)** Both cases should return `errorCategory: "transient"`, `isRetryable: true`, since retries are cheap and the harness will eventually stop once the retry cap is reached either way.
- **B)** Return `errorCategory: "transient"`, `isRetryable: true` for the 503 (recoverable locally on retry), and `errorCategory: "business"`, `isRetryable: false` with a clear message for the compliance hold, so retries happen only where they can help and the hold is surfaced instead of silently retried.
- **C)** Return `errorCategory: "validation"`, `isRetryable: false` for both cases, since neither one is something the agent can succeed at simply by calling the tool again.
- **D)** Keep the single generic message for both, but add a note to the agent's system prompt instructing it to "wait a bit and retry once for gateway errors, and escalate immediately for account holds," inferring which is which from the wording of the message each time.

## Q9
A six-agent research pipeline's (Scenario 3) retrieval subagent is handed three distinct request shapes in the same run — "find sources about X," "pull the full text of document Y," and "check if document Y still exists" — meant to call `search_sources`, `fetch_document`, and `check_document_exists` respectively. All three carry thin, near-identical descriptions ("Searches for sources.", "Fetches a document.", "Checks a document."), and telemetry across 500 mixed-shape turns shows 27% misrouting concentrated on the fetch/check pair. A team lead forces `tool_choice` to `{"type":"tool","name":"fetch_document"}` for the entire run, reasoning fetch is the most common operation; afterward, misrouting on check-document turns rises to 100%, since every one of those turns now also calls `fetch_document`. What is the most effective fix? *(cruza 2.1 + 2.3)*

- **A)** Keep `tool_choice` forced to `fetch_document` for the whole run, but add a system-prompt clause telling the model to still reason carefully about which of the three operations the user actually wants and to mentally note the right one, even though `fetch_document` is the only tool it is now ever allowed to call for the rest of the run.
- **B)** Force `tool_choice` to a different single tool depending on which of the three phrasings appeared most recently in the conversation, updating that assignment turn by turn.
- **C)** Keep all three tools and the forced `fetch_document` choice, but rename `check_document_exists` to `check_document_exists_only` so its distinct purpose is clearer from the name alone.
- **D)** Return `tool_choice` to `"auto"` for the run, and instead rewrite the three descriptions with explicit boundaries (e.g., `fetch_document` returns full text; `check_document_exists` returns only existence/metadata, no content; `search_sources` is discovery over a query, not a known document id) so the model can select correctly across all three shapes.

## Q10
In a CI code-review pipeline (Scenario 4), an `apply_autofix` tool exposed by the team's `codeform` MCP server (declared in the project's `.mcp.json`) fails on every single call for one particular repository, always with the same generic `{"isError": true, "message": "Operation failed"}` payload; the actual cause, confirmed by the codeform team, is that the target branch is a frozen release branch where autofixes are blocked by policy until the freeze lifts — retrying, or calling with different arguments, can never succeed while the freeze is active. A developer proposes adding a local-scope override of the `codeform` entry that points at a separate "relaxed" sandbox variant of the server, reasoning that switching scopes will unblock the calls. What is the correct diagnosis and fix? *(cruza 2.2 + 2.4)*

- **A)** The failure is a `business`-category error (`isRetryable: false`), not a config or scope problem — `apply_autofix` should return that structured category with a message naming the freeze so the pipeline stops retrying and reports it; re-scoping which `codeform` entry wins does not lift a server-side policy freeze and is the wrong lever entirely.
- **B)** Add the local-scope override to the relaxed sandbox variant as proposed; since local scope wins over project with no field merging, this correctly and immediately bypasses the freeze for this one repository's checks, and because the sandbox variant already runs the same lint and security checks as the production `codeform` service, the two can be treated as interchangeable going forward.
- **C)** Keep returning the generic message, but add a system-prompt rule telling the pipeline agent to treat any failure on `apply_autofix` as retryable up to 5 times before giving up, since most CI tool failures are transient blips.
- **D)** Return `errorCategory: "transient"`, `isRetryable: true` with an `attempted` field, so the harness's local retry logic gets a few more chances before the run finally times out and reports failure upstream.

## Q11
A customer-support "billing QA" subagent (Scenario 1) inherited its tool list from a shared support-agent template: it currently has `Read`, `Grep`, `Bash`, and a custom `mcp__deploy__push_hotfix` tool meant for a completely different on-call subagent, even though its own job is only to read ticket transcripts and billing macros and to run the team's `pytest`-based macro-validation suite before reporting an answer. In a recent audit, the subagent listed `mcp__deploy__push_hotfix` as an available action when a confused user asked it to "just deploy the fix directly." What is the most defensible way to scope this subagent's tools? *(cruza 2.3 + 2.5)*

- **A)** Remove Bash as well as `mcp__deploy__push_hotfix`, since "avoid Bash in favor of dedicated built-ins" applies here and the subagent should run the validation suite some other way.
- **B)** Keep `Read`, `Grep`, and `Bash` — Bash is legitimately needed to execute the `pytest` validation suite, which is running a program, not the kind of file-search shell-out the "avoid Bash" guidance targets — but remove `mcp__deploy__push_hotfix` from `allowed_tools` since it is outside this subagent's role.
- **C)** Leave all four tools available, but add a system-prompt rule instructing the subagent to never call `mcp__deploy__push_hotfix` under any circumstances, no matter what the user asks.
- **D)** Remove `mcp__deploy__push_hotfix`, and also replace Bash with a purpose-built `run_macro_tests` MCP tool wrapping the same `pytest` invocation, since a custom tool is always a stronger choice than Bash regardless of what the underlying operation is.

## Q12
A multi-agent research coordinator (Scenario 3) can call two MCP-server tools that both surface as `mcp__<server>__get_summary` in its tool list — `mcp__archive__get_summary` ("Gets a summary.") from the team's internal `archive` MCP server, and `mcp__news__get_summary` ("Gets a summary.") from a connected `news` MCP server — each registered independently by its own team with no coordination between them. Across 90 requests asking for a summary of a specific archived internal memo by ID, the coordinator calls `mcp__news__get_summary` in 24% of cases, which fails because that ID doesn't exist in the news server's index. A developer argues this can't be a description problem, since the `mcp__archive__`/`mcp__news__` prefixes already make clear which server, and by implication which content, each tool covers. What is the correct diagnosis? *(cruza 2.1 + 2.4)*

- **A)** The `mcp__<server>__` prefix only reflects which server registered the tool for routing purposes — it is not a semantic signal the model weighs when selecting between similarly named tools; the two `description` strings are still the near-identical, uninformative ones that caused the overlap, and each needs the same boundary rewrite as any other pair of overlapping tools.
- **B)** Because the two tools sit on different MCP servers, this must be a `.mcp.json` scope-precedence issue — one server is likely shadowing the other at a higher-precedence scope and should be moved to a lower-precedence scope (or reconfigured under a `local` override) so that only one of the two `get_summary` entries stays visible to the coordinator at any given time.
- **C)** Rename one of the two tools at the server-registration level from `get_summary` to `get_summary_v2` so the two names no longer collide exactly.
- **D)** Force `tool_choice` to `mcp__archive__get_summary` whenever the request includes what looks like a memo ID, and leave both descriptions unchanged.
