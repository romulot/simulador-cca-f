# Simulado de Revisão — CCA-F | Domínio 4 (Prompt Engineering & Structured Output)

**Cobertura:** 4.1 (critérios explícitos) · 4.2 (few-shot) · 4.3 (`tool_use` + JSON schema) · 4.4 (validação/retry/feedback) · 4.5 (Message Batches API) · 4.6 (multi-instance/multi-pass review).
**Formato:** múltipla escolha baseada em cenário — 1 correta + 3 distratores (questões em inglês). 12 questões, nível prova, maioria Médio/Difícil. Inclui **4 itens cruzados inéditos** (Q8–Q11) combinando task statements.

> Responda antes de consultar o gabarito em `dominio-4_revisao_gabarito.md`.

---

## Q1
A CI gate uses Claude to flag code comments as "misleading" before a pull request can merge. Over three weeks the gate rejected 41 pull requests; a manual review found that 27 of those flagged comments simply used an outdated parameter name while the behavior the comment described remained correct. The team wants to cut the false-positive rate without weakening the gate's ability to catch real cases where a comment contradicts the code. What is the most effective fix?

- **A)** Add a step that asks the model to report a confidence score between 0 and 1 for each flagged comment, based on how certain it feels that the description is wrong, and reject only the ones scored above 0.8, tightening the gate without having to rewrite what counts as misleading.
- **B)** Replace the criterion with a verifiable condition on the code itself: flag a comment only when it asserts behavior that the code contradicts; an outdated parameter name paired with an otherwise correct description is not a defect.
- **C)** Train a classifier on the 41 labeled cases from this quarter and use it as a pre-filter before the gate runs.
- **D)** Run the review three times per pull request and reject a comment only when at least two of the three passes flag it.

## Q2
An extraction pipeline pulls dates from 900 invoices. Manual checks on 36 sampled records confirm the extracted value is correct in all 36 cases, but the written form varies across documents — `03/09/2026`, `3-set-26`, `2026-09-03` — and 9 of 31 checked records break a downstream parser that expects strict ISO 8601. The prompt already contains a detailed paragraph instructing the model to always use ISO 8601. What is the most effective next step?

- **A)** Rewrite the paragraph with even more detail and an explicit list of forbidden date formats.
- **B)** Normalize the extracted date string with a regex pass applied after extraction.
- **C)** Add a small set of input→output examples that show the canonical form for each date-like field.
- **D)** Lower the temperature parameter to reduce variance in the model's output.

## Q3
A pipeline extracts `numero_matricula` from lab reports using a forced `tool_choice` and a `strict` JSON schema in which the field is `required`. In 12% of the reports, the registration number does not appear anywhere in the source document, and in every one of those cases the model returns a plausible-looking but nonexistent number instead of signaling absence. The prompt already contains the instruction "do not invent values." What is the most effective fix?

- **A)** Change the schema itself: remove `numero_matricula` from `required`, or widen its type to accept `null`, since a required field under `strict` structurally forces the model to fill it with something.
- **B)** Reinforce the instruction with a few worked examples of reports that lack a registration number.
- **C)** Add `minLength` and a `pattern` constraint to `numero_matricula` in the schema so an invented value is far less likely to pass validation, catching the fabrication before it reaches downstream systems.
- **D)** Add a second tool that must run first to validate the registration number before the record is saved.

## Q4
A validation-and-retry loop with structured feedback resolves 3 of 6 problem documents on the second attempt, and 0 more on the third. For the documents that remain unresolved, the missing value simply is not present anywhere in the source; starting on the second attempt, the model returns an identifier whose exact form matches the pattern the feedback message described, even though no such identifier exists in the document. What is the most effective response for these unresolved documents?

- **A)** Raise the retry ceiling from two attempts to five.
- **B)** Relax the validator so the missing field is accepted without a matching value.
- **C)** Read the batch's overall 50% resolution rate and treat the loop as healthy enough to leave as is.
- **D)** Stop retrying that class of document and escalate it to a human reviewer instead of attempting a fourth pass.

## Q5
A team runs two workloads through Claude: (i) a pull-request review that blocks the merge until it finishes, with a 40-second median turnaround; (ii) a weekly scan of 12,000 files that produces a technical-debt report nobody is waiting on. To cut cost, someone proposes routing both workloads through the Message Batches API. What is the most effective recommendation?

- **A)** Send both workloads through the batch, since the discount applies equally to both and the volume justifies it.
- **B)** Send only the weekly scan through the batch; the signal is whether someone is blocked waiting, and the review blocks the merge while the batch window runs up to 24 hours with no latency guarantee.
- **C)** Send both workloads through the batch and shorten the batch window by configuration specifically for the pull-request review, so it comfortably fits inside the merge-blocking turnaround time.
- **D)** Keep both workloads synchronous, because the Message Batches API does not guarantee the order in which results are returned.

## Q6
A nightly job regenerates a set of tax-rate lookup tables from source spreadsheets and, in the same session, reviews its own diff before committing. Across nine consecutive sprints the self-review has approved every single diff — not one rejection — while six rounding-precision defects from that exact job reached production in the same period, each one a stale decimal-places value that the diff itself had changed. What is the most effective change to the review step?

- **A)** Add rounding precision explicitly to the checklist that same self-review turn already uses before approving a diff.
- **B)** Increase how much reasoning effort the review turn is allowed to spend, on the theory that additional thinking time is what would let the same reviewer finally notice what it keeps approving.
- **C)** Give the review turn a much larger context allowance, assuming size is what let the regressions slip past unnoticed.
- **D)** Have a separate Claude session that took no part in producing the tables look at the diff cold and treat what it reports as the review.

## Q7
A pipeline receives three mixed document types, with one extraction tool defined per type, and calls the model with `tool_choice: "auto"`. In 4 of 27 documents, the model answers with plain text instead of calling any tool, and the pipeline writes an empty record to the database for each of those four. What is the most effective fix?

- **A)** Switch to `tool_choice: {"type": "any"}` to force some tool call and disambiguate the document type, and treat a response without a `tool_use` block as an outcome to route for review rather than as an empty record.
- **B)** Force the tool for whichever document type is most common in the corpus.
- **C)** Reorder the `tools` array to put the most frequent document type first, to bias the model's choice.
- **D)** Add a preliminary call that classifies the document type in plain text using the same model, wait for that response, and then issue a second call that forces the tool matching whatever type it returned.

## Q8 (cruza 4.6 + 1.7)
To avoid re-sending context, a team changed its review step to continue the generator's own session with `--resume` instead of starting fresh. Before the change, the review consistently flagged the module's habit of catching and swallowing every exception at the top level; after the change, across the last 14 reviews, it has not flagged that pattern once, even though three production incidents in the same period trace back to a swallowed exception. What is the most likely cause, and which mechanism restores the reviewer's independence?

- **A)** Run `/compact` on the resumed session before the review turn, to cut context dilution from the accumulated generation history, so the reviewer works from a cleaner, shorter transcript.
- **B)** The resumed session carries the generator's own reasoning, so the reviewer stops questioning it; a fresh, context-free review instance is what restores that independence.
- **C)** The resumed session silently lost the tool permission the review step needs, so that check no longer runs.
- **D)** Keep `--resume` but add `fork_session`, so the review no longer mutates the generator's original session state.

## Q9 (cruza 4.4 + 4.1)
The same extraction pipeline surfaces two different error classes. In the last release: (i) 6 of 340 invoices have a line-item sum that does not match the declared total, a mismatch detectable by re-computing the sum in code; (ii) a code-review pass has flagged 19 comments as defective this month whenever they name a parameter whose spelling is outdated, even though the behavior each comment describes remains accurate. A proposal is to fix both with one mechanism. What is the most effective approach?

- **A)** Add one deterministic gate that rejects any output failing either check, applied uniformly to both classes, so a single review step consistently enforces both quality bars without maintaining two separate mechanisms for two different kinds of mistake.
- **B)** Write a single, more detailed prompt that instructs the model to avoid both kinds of mistake.
- **C)** Treat them as two separate layers: the arithmetic mismatch needs code-level validation with structured `tool_result` feedback; the criterion needs to be corrected directly. One mechanism would fix one and break the other.
- **D)** Combine both error types into one overall error rate and use it to prioritize which pipeline to fix first.

## Q10 (cruza 4.5 + 4.6)
An overnight review of a 40-file pull request has nobody waiting on the result, and the team's budget comfortably fits a single batch submission. The proposal on the table is one request per pull request, with all 40 files concatenated into a single prompt. What is the most effective way to structure the batch submission instead?

- **A)** Keep the single concatenated request, since the Message Batches API does not support tool calling and a decomposed review would require it.
- **B)** Submit one request per file for a local pass, plus one additional request that reviews the extracted interfaces and call sites for cross-file integration issues, each request carrying its own `custom_id`.
- **C)** Keep the single concatenated request but raise `max_tokens` so the findings list is not truncated.
- **D)** If any file in the review turns out to have an issue, resubmit the entire batch the following night to be safe.

## Q11 (cruza 4.6 + 4.1 + 5.5)
A CI pipeline routes an independent review instance's findings into a triage queue by self-reported confidence per finding. Measured over the last quarter: findings auto-closed at the high-confidence band show a 91% real-defect hit rate against analyst disposition, while findings sitting in the low-confidence band show only a 12% hit rate. There is no budget for another model and no budget for training anything. What is the most effective next step?

- **A)** Keep asking for a confidence score per finding, keep auto-closing the high-confidence band, route everything else to the analyst queue, and keep publishing the hit rate per band so the boundary is set by what is measured.
- **B)** Train a classifier on this quarter's accepted and rejected findings and use it to re-rank the queue instead of the self-reported confidence.
- **C)** Stop routing low-confidence findings to the queue at all, so analysts only ever see what already looks likely to be real.
- **D)** Block the merge automatically whenever a finding's self-reported confidence score is above 0.8, so the strongest findings can never simply sit around in the queue waiting for an analyst who is already behind on everything else.

## Q12
A batch job runs structured extraction over 300 invoices with a forced extraction tool. Eleven of the requests come back with `stop_reason: "end_turn"` and no `tool_use` block at all. The pipeline recorded all eleven as entries with `campos: []`, and the generated report states "11 invoices had nothing to extract." What is the most effective correction?

- **A)** Treat a response with no `tool_use` block as an outcome, not a completed extraction: remove those eleven from the empty-invoice count's numerator and denominator, and resubmit them by `custom_id`.
- **B)** Count them as empty, since a forced tool guarantees the model processed the invoice and found nothing worth extracting.
- **C)** Resubmit the entire 300-invoice batch, since it is not clear in advance which requests would be affected.
- **D)** Switch `tool_choice` from forced to `{"type": "any"}`, so the model always has some tool available to call instead of answering in plain text.
