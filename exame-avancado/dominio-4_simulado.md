# Exame Avançado — Bloco 4

**60 questions · multiple choice · one correct answer**

> Do not look at the answer key until you have finished the whole block.
> The domain and objective of each question are deliberately not shown.

---

### Q1

An extraction system processes 50,000 archived contracts overnight. Results are needed by the next business day; nothing blocks on any individual document.

Which processing mode fits?

- **A)** The synchronous Messages API with a very high `max_tokens`.
- **B)** The asynchronous Message Batches API, which suits workloads that do not require immediate responses.
- **C)** The Batches API with a synchronous fallback per document.
- **D)** The synchronous Messages API, called in a tight loop.

---

### Q2

A single review prompt asks Claude to check a pull request for security issues, business logic errors, and API design problems at once. Recall on security findings drops noticeably compared to a security-only prompt.

What explains this, and what is the fix?

- **A)** The prompt should list security first so it receives more attention.
- **B)** The model needs a larger context window to hold all three concerns.
- **C)** Competing concerns in one prompt trade off against each other; split into specialized passes, each with its own focused prompt and dedicated few-shot examples.
- **D)** The review should run twice with the same prompt and merge results.

---

### Q3

An extraction schema requires `phone` on every record. Many source documents simply have no phone number, and the model invents plausible ones.

Which schema change addresses this?

- **A)** Lower the temperature so the model is less creative.
- **B)** Add "do not make up phone numbers" to the prompt.
- **C)** Make the field nullable or optional, so the model can accurately represent that the value is absent instead of fabricating one.
- **D)** Validate the phone numbers downstream and discard invalid ones.

---

### Q4

A structured review of a 3,000-line file returns JSON that is cut off mid-object. The team raised `max_tokens` twice; the response is now near the model's limit and still truncates on the largest files.

What is the correct approach?

- **A)** Raise `max_tokens` beyond the model's limit.
- **B)** Split the review into smaller scoped API calls and merge the resulting data structures.
- **C)** Ask the model to be more concise in its findings.
- **D)** Switch the output format from JSON to markdown.

---

### Q5

A prompt says: "Extract the measurement from each ingredient. Return `{ "amount": number | null, "unit": string | null }`. If the measurement is informal or absent, return null for both fields." It then shows four examples, including `"a handful of salt"` → `{ "amount": null, "unit": null }`.

Which technique is this, and what does it buy?

- **A)** Tool use, which enforces schema compliance at the API level.
- **B)** Prefilling, which forces the response to start with a given token.
- **C)** Chain-of-thought prompting, which makes the model reason step by step.
- **D)** Few-shot prompting, which anchors both behavior and output format, reduces hallucination, and improves consistency — especially when edge cases are included.

---

### Q6

A team needs absolute schema compliance for an extraction feeding a typed database. Prompt-based JSON formatting produces valid output about 97% of the time.

Which method offers the strongest compliance?

- **A)** Prefill the response with `{` so the model must continue in JSON.
- **B)** Define a tool whose `input_schema` is the target schema and force its use, so the model generates arguments shaped by the schema.
- **C)** Keep prompt-based formatting and retry the 3% of failures.
- **D)** Ask for JSON and repair malformed output with a parser.

---

### Q7

A reviewer agent flags every `TODO` comment as a defect. The team considers these acceptable and wants them excluded permanently.

Which approach fits?

- **A)** Ask the reviewer each time to ignore `TODO` comments.
- **B)** Supply the accepted patterns and exclusion criteria as persistent context applied on every review.
- **C)** Filter `TODO` findings out of the output in a post-processing script.
- **D)** Delete the `TODO` comments from the codebase.

---

### Q8

An extraction prompt must handle dates written as "Jan 5 2024", "1/5/24", and "05-01-2024".

Which instruction design is most effective?

- **A)** Accept whatever format the model returns and normalize downstream.
- **B)** Reject documents whose dates are not already ISO 8601.
- **C)** State the normalization rule with worked examples — convert any format to ISO 8601, and for genuinely ambiguous dates set an explicit uncertainty flag.
- **D)** Ask the model to "use a consistent date format."

---

### Q9

A prompt reads: "Review this codebase for issues." The output contains three SQL injection findings, two of which are wrong and waste twenty minutes each.

What is the underlying problem?

- **A)** The codebase is too large for one review.
- **B)** The model is not capable of detecting SQL injection.
- **C)** The findings should have been sorted by confidence.
- **D)** The prompt has no explicit detection criteria, so the model guesses patterns instead of applying a rule.

---

### Q10

A team wants their classification tool to be able to say "I could not determine this" rather than picking the closest enum value.

Which schema design supports that?

- **A)** Remove the enum constraint entirely.
- **B)** Include an explicit ambiguous or `other` option in the enum, so an accurate answer exists.
- **C)** Add a second tool for uncertain cases.
- **D)** Make the classification field required with no default.

---

### Q11

An engineer needs to guarantee that a summarization call never triggers a tool, because the downstream consumer parses free text.

Which setting applies?

- **A)** `tool_choice: auto`
- **B)** Removing `max_tokens`
- **C)** `tool_choice: none`
- **D)** `tool_choice: any`

---

### Q12

A team runs a nightly batch of 80,000 classification requests. Cost is the primary constraint; results are consumed the following morning.

Which statement about the Message Batches API is accurate?

- **A)** It guarantees completion within five minutes.
- **B)** It charges the same as the synchronous API but with higher rate limits.
- **C)** It charges 50% of standard API prices and processes within a 24-hour window, with most batches completing in under an hour.
- **D)** It is free for the first 100,000 requests.

---

### Q13

A code review prompt asks for findings but does not say what is out of scope. The agent reports stylistic preferences, speculative performance concerns, and one real bug, all with equal prominence.

Which prompt change is most effective?

- **A)** Ask the agent to report only findings it is sure about.
- **B)** Ask the agent to rank findings by importance.
- **C)** Define explicit inclusion and exclusion boundaries, stating the categories to report and the categories never to report.
- **D)** Ask for fewer findings.

---

### Q14

A team validates model-generated tool input in Python before executing the tool, and validates the structured result before storing it.

Which statement matches the guidance?

- **A)** A JSON Schema constrains generation but is not full validation, so a library such as Pydantic should validate both directions.
- **B)** Only the output needs validation, because the input is schema-constrained.
- **C)** Validation should happen only in the downstream service.
- **D)** JSON Schema validation in the tool definition makes application-level validation redundant.

---

### Q15

An extraction run over invoices from twelve different vendors produces inconsistent field values for the same concept — "Total", "Amount Due", and "Grand Total" all map differently.

Which combination most improves accuracy?

- **A)** A structured schema with optional fields, explicit format normalization instructions, and few-shot examples covering the format variations.
- **B)** Post-processing rules that map each vendor's labels to canonical fields.
- **C)** A larger model with the same prompt.
- **D)** One extraction run per vendor with vendor-specific prompts written by hand.

---

### Q16

A prompt for a security pass includes three few-shot examples of real SQL injection findings and two examples of safe ORM calls that must not be flagged.

Why include the negative examples?

- **A)** Negative examples are required by the JSON Schema.
- **B)** Examples anchor behavior in both directions; showing what not to flag is what suppresses the false positives.
- **C)** Negative examples increase the total number of findings.
- **D)** Negative examples reduce token cost.

---

### Q17

A team must extract data from documents where some fields are genuinely ambiguous. They want the model to flag ambiguity rather than silently choosing.

Which schema element supports this?

- **A)** A free-text notes field the model fills at will.
- **B)** A confidence percentage the model estimates for the whole document.
- **C)** A dedicated field — such as a boolean uncertainty flag — that the model sets when the source is ambiguous.
- **D)** Omitting the ambiguous field entirely, so its absence signals ambiguity.

---

### Q18

An engineer must choose between the synchronous Messages API and the Batches API for a customer-facing chat feature.

Which is correct?

- **A)** Either, since both return within the same latency envelope.
- **B)** The Batches API, because most batches finish in under an hour.
- **C)** The Batches API, because it is cheaper.
- **D)** The synchronous Messages API, because the workflow blocks on the response and the user is waiting.

---

### Q19

A review system runs three passes over the same diff: security, business logic, and API design. Each pass has its own prompt and its own examples.

What is the primary benefit?

- **A)** The passes can share a single set of few-shot examples.
- **B)** Three passes guarantee no false positives.
- **C)** Each pass avoids the recall trade-off that competing concerns cause inside a single prompt.
- **D)** The three passes cost less in total than one combined pass.

---

### Q20

A prompt asks the model to "fix the input sanitization in `/api/auth/login` only" and adds "do not change the auth logic or token handling."

Which aspect of explicit criteria does the second clause demonstrate?

- **A)** Defining the retry policy.
- **B)** Providing a few-shot example.
- **C)** Stating what must not change, which bounds the scope as firmly as stating what must.
- **D)** Setting the output format.

---

### Q21

A structured extraction returns `"unit": "cups"` for `"2 cups flour"` and `"unit": null` for `"flour, sifted"`.

What makes the second case correct rather than a failure?

- **A)** The field should have defaulted to an empty string.
- **B)** The document should have been rejected as malformed.
- **C)** The model failed to extract and should be retried.
- **D)** The schema allows null, and the prompt instructed that absent or informal measurements return null — representing missing data accurately is the desired behavior.

---

### Q22

A team's extraction prompt produces phone numbers in whatever format the source used. Downstream systems require E.164.

Which approach matches the guidance?

- **A)** Add a regex to the JSON Schema and rely on it to reformat.
- **B)** State the normalization rule in the prompt with worked transformations — strip non-digits, apply E.164, with examples of each input shape.
- **C)** Ask for "properly formatted" phone numbers.
- **D)** Normalize in the database layer with a trigger.

---

### Q23

A batch job must not exceed the platform's per-batch limits.

Which statement is accurate about Message Batches limits?

- **A)** A batch is limited to either 100,000 requests or 256 MB in size, whichever is reached first.
- **B)** A batch is limited to 10 MB regardless of request count.
- **C)** A batch has no request limit, only a 24-hour window.
- **D)** A batch is limited to 1,000 requests with no size limit.

---

### Q24

An agent must produce output that a downstream service consumes as typed records. Today it returns markdown with a table, and the parser breaks whenever the model adds a preamble.

Which fix is structural rather than cosmetic?

- **A)** Ask the model to omit the preamble.
- **B)** Define the record shape as a tool `input_schema` and force the tool call, so the output arrives as structured arguments rather than prose.
- **C)** Strip everything before the first `|` character.
- **D)** Increase `max_tokens` so the table is never cut.

---

### Q25

A team reviews 200-file pull requests with a single API call and hits truncation. They consider two options: one call per file, or one call for the whole PR with a higher token limit.

Which reasoning is correct?

- **A)** Raising the limit is correct because merging loses information.
- **B)** One call is always preferable because it preserves cross-file context.
- **C)** Scope the calls smaller — per file or per group — and merge the resulting structures, because raising the limit does not scale and truncation corrupts the output.
- **D)** Switch to markdown, which does not truncate.

---

### Q26

A CI review must produce findings a script can act on: file, line, severity, category, and description.

Which prompt design supports this?

- **A)** Ask for a "detailed and well-structured report."
- **B)** Ask for one finding per line of output.
- **C)** Ask for markdown with consistent headings the script can parse.
- **D)** Specify the exact fields and allowed values for each, and return them through a schema-constrained mechanism rather than asking for a readable report.

---

### Q27

A few-shot prompt contains only examples of correct, well-formed inputs. In production, malformed and edge-case inputs produce erratic output.

What is missing?

- **A)** Examples covering the edge cases and the undesirable outputs, so the model has an anchor for those situations too.
- **B)** A higher temperature so the model generalizes.
- **C)** A longer system prompt.
- **D)** More examples of the same well-formed type.

---

### Q28

A team must choose between asking the model to output JSON in its text response versus defining a tool with a JSON Schema.

Which statement about reliability is correct?

- **A)** Tool use with a JSON Schema enforces structure more strictly, because the model generates arguments to fit a declared schema rather than formatting prose.
- **B)** Both are equally reliable if the prompt is clear enough.
- **C)** Neither is reliable; output must always be repaired.
- **D)** Prompt-based JSON is more reliable because it avoids the tool-use overhead.

---

### Q29

An extraction schema for a support ticket defines `severity` with values `low`, `medium`, `high`. A ticket describes a total outage.

Which schema concern does this expose?

- **A)** `severity` should be optional.
- **B)** The enum should be free text.
- **C)** The model should infer severity from sentiment.
- **D)** The enum must actually cover the real distribution of values, or the model is forced into an inaccurate answer.

---

### Q30

A summarization chain condenses a 40-page report in four successive steps. The final summary has lost the specific percentages and dates that mattered most.

Which mitigation applies?

- **A)** Extract the key data points explicitly and re-inject them directly into the next prompt, rather than letting them pass through successive summaries.
- **B)** Summarize from the end of the document backwards.
- **C)** Use fewer summarization steps with a larger model.
- **D)** Ask the model to preserve all numbers.

---

### Q31

A review prompt says "Flag SQL injection risks only when user input is passed directly to a query string without parameterization. Do not flag ORM calls or prepared statements."

Which two elements of prompt design does this combine?

- **A)** A retry policy and a validation layer.
- **B)** A confidence threshold and a severity ranking.
- **C)** An explicit inclusion criterion and an explicit exclusion criterion.
- **D)** A few-shot example and a JSON Schema.

---

### Q32

A team wants the same review prompt to behave consistently across 40 repositories with different conventions.

Which approach fits?

- **A)** Let the model infer each repository's conventions from the code it reviews.
- **B)** Keep the detection criteria in the shared prompt and supply each repository's accepted patterns and conventions as its own persistent context.
- **C)** Write 40 separate prompts by hand.
- **D)** Use one prompt and accept the variation.

---

### Q33

A pipeline needs 100,000 documents classified. The team's first implementation makes 100,000 synchronous calls in a loop, and the job takes days while blocking a worker.

Which change is appropriate?

- **A)** Parallelize the synchronous loop across more workers.
- **B)** Submit the work as batches, since nothing depends on an immediate per-document response.
- **C)** Use a smaller model for the same synchronous loop.
- **D)** Reduce the prompt length so each call is faster.

---

### Q34

An extraction tool's schema marks `contract_value` as a number. Some contracts state "to be determined."

Which design handles this accurately?

- **A)** Have the model estimate a likely value.
- **B)** Have the model output the string "TBD" in the number field.
- **C)** Have the model output `0` when the value is undetermined.
- **D)** Allow the field to be null and pair it with a status or flag indicating why the value is absent.

---

### Q35

A team's structured output occasionally arrives valid against the schema but semantically wrong — a date in the future for a past event, a total that does not match the line items.

Which layer catches this?

- **A)** A higher `max_tokens`.
- **B)** A stricter JSON Schema.
- **C)** A forced tool call.
- **D)** An application-level validation layer with business rules, because schema conformance does not imply semantic correctness.

---

### Q36

A reviewer wants the model to evaluate eight specific issues it identified in the previous output, in one pass.

Which framing is most effective?

- **A)** Send the eight issues as eight separate requests.
- **B)** Ask "what would you improve?" and let the model decide.
- **C)** Ask for a full rewrite without listing the issues.
- **D)** Describe all eight issues together with enough specificity that the model can address them in a single consolidated revision.

---

### Q37

A prompt asks for a summary "in a professional tone." Output quality varies widely between runs.

Which change most improves consistency?

- **A)** Raise the temperature to encourage variety.
- **B)** Ask for a longer summary.
- **C)** Replace the subjective instruction with concrete criteria and an example of an acceptable output.
- **D)** Add "be professional" a second time at the end.

---

### Q38

A team is deciding whether to add a `confidence` field to their extraction schema so a reviewer can prioritize.

Which consideration is most important?

- **A)** A self-reported confidence value is a weak signal on its own; routing decisions should also use document characteristics and field-level ambiguity, not confidence alone.
- **B)** Confidence scores are always accurate and should be the sole routing criterion.
- **C)** Confidence fields are prohibited in JSON Schema.
- **D)** Confidence should be computed from the response latency.

---

### Q39

An engineer wants the model to always call an extraction tool, and never to answer conversationally, for a specific document-processing endpoint.

Which combination is correct?

- **A)** No tool, plus a prompt demanding JSON only.
- **B)** A tool defined with the target schema, plus `tool_choice: none`.
- **C)** A tool defined with the target schema, plus `tool_choice: auto`.
- **D)** A tool defined with the target `input_schema`, plus `tool_choice` set to force that specific tool.

---

### Q40

A team splits a large code review into a security pass and a maintainability pass. The security pass uses examples of vulnerabilities; the maintainability pass uses examples of code smells.

Why are separate example sets appropriate?

- **A)** The API requires a distinct example set per tool.
- **B)** Separate example sets reduce total token usage.
- **C)** Examples anchor the model to the concern at hand; mixing unrelated examples in one prompt dilutes the anchor and reintroduces the recall trade-off.
- **D)** Examples must never be reused between prompts for licensing reasons.

---

### Q41

A team's extraction accuracy varies by document layout: clean PDFs extract well, scanned forms poorly.

Which response matches the guidance on extraction accuracy patterns?

- **A)** Add few-shot examples drawn from the harder layouts and normalization instructions for their quirks, so the prompt covers the variation.
- **B)** Reject scanned forms.
- **C)** Raise `max_tokens` for scanned forms.
- **D)** Assume scanned forms are unsupported and route them all to humans without triage.

---

### Q42

A prompt instructs: "Return only findings in the categories: security, correctness, and data loss. Never report formatting, naming, or test coverage."

Which risk does the second sentence specifically mitigate?

- **A)** Output truncation.
- **B)** Schema violations.
- **C)** Rate limiting.
- **D)** Findings generated in categories where the model's performance is unreliable or where the team does not want them.

---

### Q43

An engineer needs 60,000 documents summarized and can wait overnight, but must know the outcome of every single request.

Which statement is accurate?

- **A)** Batch results become available when all messages complete or after the processing window, whichever comes first, and each request's outcome is retrievable.
- **B)** Batches must be resubmitted entirely if any request fails.
- **C)** Failed requests in a batch are silently dropped.
- **D)** Batch results are aggregated and individual outcomes are not retrievable.

---

### Q44

A team's structured output for a multi-file review is assembled by merging per-file results.

Which risk must the merge step handle?

- **A)** The model refusing to produce JSON.
- **B)** Collisions and duplicates across files, and preserving which file each finding came from.
- **C)** Losing the `tool_choice` setting between calls.
- **D)** Exceeding the enum constraint.

---

### Q45

A prompt defines an output schema but the model keeps adding an extra explanatory field not in the schema.

Which approach most reliably prevents this?

- **A)** Increase the number of few-shot examples.
- **B)** Delete unexpected fields during parsing.
- **C)** Use a tool with a strict `input_schema` and force it, so the generated arguments are shaped by the declared schema.
- **D)** Add "do not add extra fields" to the prompt.

---

### Q46

A classification prompt gives four examples, each labeled with the correct class and a short note on why.

Which effect does the rationale add?

- **A)** It sharpens the decision boundary the examples encode, helping the model apply the same criterion to unseen inputs.
- **B)** It is required by the few-shot format.
- **C)** It converts the prompt into a chain-of-thought prompt.
- **D)** It reduces the number of examples needed to zero.

---

### Q47

A review agent is asked to evaluate a diff against a style guide that is 4,000 lines long. The agent's findings ignore most of the guide.

Which explanation is most likely?

- **A)** The agent cannot read style guides.
- **B)** The diff is too small to trigger the rules.
- **C)** The style guide must be converted to JSON.
- **D)** With a very large body of reference material, content in the middle tends to be underused, so the guide should be sectioned and applied in targeted passes.

---

### Q48

A team wants to prevent a review agent from reporting speculative performance concerns, which are almost always wrong in their codebase.

Which mechanism is appropriate?

- **A)** A confidence threshold applied to all findings.
- **B)** A hook that blocks the review tool.
- **C)** A post-processing filter on the word "performance."
- **D)** An explicit exclusion criterion in the prompt naming that category as out of scope.

---

### Q49

An engineer is choosing how to represent "the document did not specify a delivery date" in an extraction schema.

Which representation is most accurate?

- **A)** The string "unknown" in a date-typed field.
- **B)** The current date as a default.
- **C)** Omitting the record entirely.
- **D)** A nullable date field set to null, so downstream consumers can distinguish "not specified" from any real date.

---

### Q50

A team's first-pass prompt asks for "a good summary." The second attempt adds: "Three bullets, each under 20 words, covering decision, owner, and deadline. Do not include background."

Which change explains the improvement?

- **A)** Concrete, checkable criteria replaced a subjective quality judgment.
- **B)** The second prompt is longer.
- **C)** The second prompt lowers the temperature.
- **D)** The second prompt uses bullets, which models handle better.

---

### Q51

A pipeline forces a tool call for extraction. Occasionally the model's arguments still fail application validation — a required cross-field rule is violated.

What is the correct interpretation?

- **A)** The forced tool call failed and should be retried at the API level.
- **B)** Forcing a tool guarantees the call and the schema shape, but not business-rule correctness, so a validation and retry layer remains necessary.
- **C)** Cross-field rules should be expressed in `tool_choice`.
- **D)** The schema must be wrong, since forced tool calls are always valid.

---

### Q52

A team splits an extraction into two calls: one for header fields, one for line items. The results must be assembled into one record.

Which consideration matters most?

- **A)** Defining how the two structures merge — shared keys, ordering, and what happens when one call returns nothing.
- **B)** Ensuring both calls use the same temperature.
- **C)** Ensuring both calls run in the same batch.
- **D)** Ensuring both calls use the same `max_tokens`.

---

### Q53

A prompt asks the model to extract a `country` field. Sources write "USA", "U.S.", "United States", and "us".

Which instruction design is most effective?

- **A)** Specify the target representation and give worked examples mapping each observed variant to it.
- **B)** Accept all variants and deduplicate later.
- **C)** Add a `country_raw` field and leave normalization to consumers.
- **D)** Ask for "the country."

---

### Q54

A reviewer wants to know why a single combined review prompt underperforms three specialized ones, even though the combined prompt lists all three concerns clearly.

Which explanation is correct?

- **A)** Concerns compete for the model's attention within one prompt, and the few-shot examples for one concern do not help — and may dilute — the others.
- **B)** The API processes only the first instruction in a prompt.
- **C)** The combined prompt exceeds the context window.
- **D)** Only one concern can be expressed per JSON Schema.

---

### Q55

A team needs to decide whether a given extraction should go to a human reviewer.

Which routing input is the weakest on its own?

- **A)** Whether the document layout matched a known template.
- **B)** Whether cross-field validation rules failed.
- **C)** The model's self-reported confidence score.
- **D)** Whether required fields came back null.

---

### Q56

An engineer wants the model to return exactly one of a fixed set of routing destinations, and to never invent a new one.

Which schema element enforces the closed set?

- **A)** A `type: string` declaration.
- **B)** An `enum` listing the allowed values.
- **C)** A `required` declaration on the field.
- **D)** A `description` naming the allowed values.

---

### Q57

A batch of extraction results is written into a typed table. About 2% of rows fail the database's constraints, and the failures are discovered only at insert time.

Which design change addresses this earlier?

- **A)** Increase the batch size so the failure rate averages out.
- **B)** Validate each result against the business rules before the write, and route failures to a review or retry path.
- **C)** Relax the database constraints.
- **D)** Insert rows one at a time so failures are isolated.

---

### Q58

A prompt for a business-logic review includes two examples of real logic errors and two examples of code that looks suspicious but is correct.

Which objective does this serve?

- **A)** Reducing the token cost of the prompt.
- **B)** Reducing false positives by anchoring what should not be flagged, alongside what should.
- **C)** Satisfying the tool schema's example requirement.
- **D)** Increasing the number of findings per run.

---

### Q59

A team's review output must be consumed by a service that stores one row per finding, and an empty result set is a valid outcome.

Which design handles the empty case cleanly?

- **A)** Always return the structured container with an empty findings array, so "nothing found" is explicit rather than an absent response.
- **B)** Return a single finding with severity "none".
- **C)** Return no tool call when there is nothing to report.
- **D)** Return prose saying no issues were found.

---

### Q60

An engineer must choose between the synchronous API and batches for a nightly report that must be on an executive's desk by 8 a.m., with the job starting at midnight.

Which reasoning is correct?

- **A)** Batches are inappropriate because completion time is not guaranteed to the minute.
- **B)** The synchronous API is required because there is a deadline.
- **C)** Either choice costs the same, so latency should decide.
- **D)** Batches fit, because the workflow does not block on individual responses and the processing window comfortably precedes the deadline.

---

**End of block — 60 questions.**
