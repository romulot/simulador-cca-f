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
- **C)** The Batches API with a synchronous fallback per document if any single document exceeds its processing time, ensuring the deadline is always met regardless of batch behavior.
- **D)** The synchronous Messages API, called in a tight loop for each document, which keeps individual latency predictable and makes retry logic straightforward to implement per call.

---

### Q2

A single review prompt asks Claude to check a pull request for security issues, business logic errors, and API design problems at once. Recall on security findings drops noticeably compared to a security-only prompt.

What explains this, and what is the fix?

- **A)** The prompt should list security first so it receives disproportionate attention and the model applies the most tokens to the leading concern before attention decays across the remaining ones.
- **B)** The model needs a larger context window to hold all three concerns without interference, since the diff and instructions together likely exceed the effective attention span of the current model tier.
- **C)** Competing concerns trade off recall; split into specialized passes with dedicated few-shot examples.
- **D)** The review should run twice with the same prompt and the results merged afterwards, since repetition increases the probability that each concern receives adequate coverage on at least one pass.

---

### Q3

An extraction schema requires `phone` on every record. Many source documents simply have no phone number, and the model invents plausible ones.

Which schema change addresses this?

- **A)** Lower the temperature so the model is less creative and less likely to generate plausible-sounding values when the source document does not contain a phone number.
- **B)** Add "do not make up phone numbers" to the prompt, combined with a note that the field can be left blank when no number appears in the source document.
- **C)** Make the field nullable or optional, so the model can represent absent values instead of fabricating one.
- **D)** Validate the phone numbers downstream and discard invalid ones, keeping only results that pass a format check or carrier lookup before they reach the database.

---

### Q4

A structured review of a 3,000-line file returns JSON that is cut off mid-object. The team raised `max_tokens` twice; the response is now near the model's limit and still truncates on the largest files.

What is the correct approach?

- **A)** Raise `max_tokens` beyond the model's limit by contacting support, since large file reviews are an enterprise use case and higher limits can be provisioned with a dedicated capacity agreement.
- **B)** Split into smaller scoped calls and merge the resulting data structures.
- **C)** Ask the model to be more concise so findings fit within the token budget, accepting that some lower-priority findings may be omitted when the file is especially large.
- **D)** Switch the output format from JSON to markdown, which is more compact and tolerates truncation more gracefully without corrupting the entire structure mid-object.

---

### Q5

A prompt says: "Extract the measurement from each ingredient. Return `{ "amount": number | null, "unit": string | null }`. If the measurement is informal or absent, return null for both fields." It then shows four examples, including `"a handful of salt"` → `{ "amount": null, "unit": null }`.

Which technique is this, and what does it buy?

- **A)** Tool use, which enforces schema compliance at the API level through a declared input schema that the model must satisfy structurally before the response is accepted.
- **B)** Prefilling, which forces the response to start with a given token sequence and constrains the model's generation path from the very first output token.
- **C)** Chain-of-thought prompting, which makes the model reason step by step before answering, exposing intermediate logic so errors can be caught before the final output is produced.
- **D)** Few-shot prompting, which anchors behavior and output format, reduces hallucination, and improves consistency — especially when edge cases like informal measurements are included.

---

### Q6

A team needs absolute schema compliance for an extraction feeding a typed database. Prompt-based JSON formatting produces valid output about 97% of the time.

Which method offers the strongest compliance?

- **A)** Prefill the response with `{` so the model must continue in JSON, which raises compliance rates by biasing the generation path toward structured output from the first token.
- **B)** Define a tool with the target schema as `input_schema` and force its use, so the model generates arguments shaped by the declared schema.
- **C)** Keep prompt-based formatting and retry the 3% of failures automatically, since the failure rate is low enough that a simple exponential-backoff retry loop keeps end-to-end reliability above 99.9%.
- **D)** Ask for JSON and repair malformed output with a parser on the client side, using a lenient parser that tolerates trailing commas and unquoted keys so recovery succeeds in most cases.

---

### Q7

A reviewer agent flags every `TODO` comment as a defect. The team considers these acceptable and wants them excluded permanently.

Which approach fits?

- **A)** Ask the reviewer each time to ignore `TODO` comments in this session, relying on the operator to include the instruction in every request that goes through the pipeline.
- **B)** Supply the accepted patterns and exclusion criteria as persistent context on every review.
- **C)** Filter `TODO` findings from the output in a post-processing step downstream, which keeps the prompt clean and centralizes the exclusion logic in a single place that is easy to update.
- **D)** Delete the `TODO` comments from the codebase to remove the trigger entirely, since eliminating the source of the flag is more robust than suppressing it after the fact.

---

### Q8

An extraction prompt must handle dates written as "Jan 5 2024", "1/5/24", and "05-01-2024".

Which instruction design is most effective?

- **A)** Accept whatever format the model returns and normalize in a downstream step, which keeps the prompt simple and separates extraction from formatting concerns.
- **B)** Reject documents whose dates are not already in ISO 8601 before processing, since ambiguous input formats introduce uncertainty that is hard to resolve reliably after the fact.
- **C)** State the normalization rule with worked examples — convert any format to ISO 8601, and for genuinely ambiguous dates set an explicit uncertainty flag.
- **D)** Ask the model to "use a consistent date format throughout its output," trusting that the model will converge on a single representation across documents once the consistency goal is named.

---

### Q9

A prompt reads: "Review this codebase for issues." The output contains three SQL injection findings, two of which are wrong and waste twenty minutes each.

What is the underlying problem?

- **A)** The codebase is too large for a single review call to handle reliably, so findings quality degrades when the input exceeds a certain size threshold.
- **B)** The model is not capable of detecting SQL injection patterns accurately, and the false positives indicate a fundamental limitation that cannot be addressed with prompting alone.
- **C)** The findings should have been sorted by confidence to surface real ones first, which would let the team triage the two false positives more quickly rather than investigating them in order.
- **D)** The prompt has no explicit detection criteria, so the model guesses patterns instead of applying a rule.

---

### Q10

A team wants their classification tool to be able to say "I could not determine this" rather than picking the closest enum value.

Which schema design supports that?

- **A)** Remove the enum constraint entirely and accept free text, which gives the model full flexibility to express uncertainty in natural language rather than forcing it into a constrained set.
- **B)** Include an explicit `unknown` or `other` option in the enum, so an accurate answer exists.
- **C)** Add a second tool dedicated to uncertain cases so the model can route there when its confidence is low, keeping the primary tool's enum clean and unambiguous for high-confidence classifications.
- **D)** Make the classification field required with no default value and no escape hatch, relying on downstream validation to catch misclassifications and route them for manual review.

---

### Q11

An engineer needs to guarantee that a summarization call never triggers a tool, because the downstream consumer parses free text.

Which setting applies?

- **A)** `tool_choice: auto`, which lets the model decide whether a tool is appropriate and generally avoids tool calls for summarization tasks where no structured output is needed.
- **B)** Removing `max_tokens`, which prevents the response from being cut short before the model has expressed its full reasoning and is therefore less likely to fall back on a structured tool call.
- **C)** `tool_choice: none`
- **D)** `tool_choice: any`, which signals that any available tool may be called and leaves the selection entirely to the model's judgment.

---

### Q12

A team runs a nightly batch of 80,000 classification requests. Cost is the primary constraint; results are consumed the following morning.

Which statement about the Message Batches API is accurate?

- **A)** It guarantees completion within five minutes for any batch size, making it suitable for near-real-time workloads that need results in under ten minutes.
- **B)** It charges the same as the synchronous API but removes rate-limit pressure, so the cost saving is indirect rather than a direct reduction in per-token price.
- **C)** It charges 50% of standard API prices and processes within a 24-hour window, with most batches completing in under an hour.
- **D)** It is free for the first 100,000 requests of the month, after which standard pricing applies to all requests including those already submitted in the same billing cycle.

---

### Q13

A code review prompt asks for findings but does not say what is out of scope. The agent reports stylistic preferences, speculative performance concerns, and one real bug, all with equal prominence.

Which prompt change is most effective?

- **A)** Ask the agent to report only findings it is sure about and suppress uncertain ones, relying on the model's self-assessed confidence to filter the output before it reaches the reviewer.
- **B)** Ask the agent to rank findings by importance so the real bug surfaces first, accepting that all findings are still reported but the reviewer sees the most critical one immediately.
- **C)** Define explicit inclusion and exclusion boundaries, stating the categories to report and the categories never to report.
- **D)** Ask for fewer total findings so the noise is reduced by volume, accepting that some real findings may be omitted when the total count is capped.

---

### Q14

A team validates model-generated tool input in Python before executing the tool, and validates the structured result before storing it.

Which statement matches the guidance?

- **A)** A JSON Schema constrains generation but is not full validation; a library such as Pydantic should validate both directions.
- **B)** Only the output needs validation, because the model-generated input is already schema-constrained and unlikely to violate business rules that the schema captures structurally.
- **C)** Validation should happen only in the downstream service that consumes the data, since early validation may reject inputs that would still produce valid and useful outputs after processing.
- **D)** JSON Schema validation in the tool definition makes application-level validation redundant and unnecessary, because the schema enforcement happens at the API boundary before the tool executes.

---

### Q15

An extraction run over invoices from twelve different vendors produces inconsistent field values for the same concept — "Total", "Amount Due", and "Grand Total" all map differently.

Which combination most improves accuracy?

- **A)** A structured schema with optional fields, explicit format normalization instructions, and few-shot examples covering the format variations.
- **B)** Post-processing rules that map each vendor's labels to canonical fields after extraction, updated whenever a new vendor is onboarded or an existing vendor changes their invoice template.
- **C)** A larger model with the same vague prompt and no structural changes, on the assumption that a more capable model will resolve the mapping ambiguity without additional guidance.
- **D)** One extraction run per vendor with vendor-specific prompts written and maintained by hand, which scales linearly with the number of vendors and diverges over time as templates change.

---

### Q16

A prompt for a security pass includes three few-shot examples of real SQL injection findings and two examples of safe ORM calls that must not be flagged.

Why include the negative examples?

- **A)** They are required by the JSON Schema used for the tool definition, which mandates at least one counterexample per enum value to ensure the model understands each boundary.
- **B)** Examples anchor behavior in both directions; showing what not to flag suppresses false positives directly.
- **C)** Negative examples increase the total number of findings the model produces, since showing safe code alongside vulnerable code prompts the model to look harder for similar patterns.
- **D)** Negative examples lower the total token cost of the prompt by allowing shorter descriptions, since the contrast between good and bad examples conveys more information per token than descriptions alone.

---

### Q17

A team must extract data from documents where some fields are genuinely ambiguous. They want the model to flag ambiguity rather than silently choosing.

Which schema element supports this?

- **A)** A free-text notes field the model fills with any concerns it has, which allows the model to express nuanced uncertainty in natural language rather than being constrained to a binary signal.
- **B)** A confidence percentage the model estimates for the entire document as a whole, giving reviewers a single sortable score to prioritize which extractions to check first.
- **C)** A dedicated boolean uncertainty flag the model sets when the source is ambiguous, rather than silently choosing a value.
- **D)** Omitting the ambiguous field from the schema so its absence signals that ambiguity exists, keeping the schema lean by avoiding fields that only appear in a subset of documents.

---

### Q18

An engineer must choose between the synchronous Messages API and the Batches API for a customer-facing chat feature.

Which is correct?

- **A)** Either option works, since both APIs return within the same latency envelope and the choice is primarily a matter of infrastructure preference rather than a functional difference.
- **B)** The Batches API is preferable, because most batches finish in under an hour and that latency is acceptable for the majority of customer interactions that do not require instant replies.
- **C)** The Batches API, because it costs 50% less even if the user waits a bit longer, and the cost saving justifies the latency trade-off for most production customer-facing applications.
- **D)** The synchronous Messages API, because the workflow blocks on the response and the user is waiting.

---

### Q19

A review system runs three passes over the same diff: security, business logic, and API design. Each pass has its own prompt and its own examples.

What is the primary benefit?

- **A)** The passes can share a single set of few-shot examples, reducing duplication and keeping the total prompt size smaller than maintaining three separate example banks would require.
- **B)** Three separate passes guarantee zero false positives across all categories, since each specialized prompt is tuned precisely for its domain and eliminates the ambiguity that causes spurious findings.
- **C)** Each pass avoids the recall trade-off that competing concerns cause inside a single prompt.
- **D)** Three specialized passes cost less in total tokens than one combined pass would, since each specialized prompt is shorter and more focused than a single comprehensive prompt covering all three concerns.

---

### Q20

A prompt asks the model to "fix the input sanitization in `/api/auth/login` only" and adds "do not change the auth logic or token handling."

Which aspect of explicit criteria does the second clause demonstrate?

- **A)** Defining the retry policy for when the fix does not compile, ensuring the model knows how many attempts to make before surfacing an error rather than silently returning broken code.
- **B)** Providing a few-shot example of the desired output format, showing the model what a correctly scoped fix looks like so it can pattern-match against the example.
- **C)** Stating what must not change, which bounds the scope as firmly as stating what must.
- **D)** Setting the structured output format for the response, ensuring the model returns a diff rather than a prose explanation of what it would change.

---

### Q21

A structured extraction returns `"unit": "cups"` for `"2 cups flour"` and `"unit": null` for `"flour, sifted"`.

What makes the second case correct rather than a failure?

- **A)** The field should have defaulted to an empty string to avoid null values, which are harder to handle in typed languages and require explicit null checks throughout the consuming codebase.
- **B)** The document should have been rejected as malformed input before processing, since ingredients without measurements indicate a template inconsistency that extraction cannot reliably handle.
- **C)** The model failed to extract the value and the call should be retried, since a well-prompted model with sufficient examples should always return a unit string for any ingredient line.
- **D)** The schema allows null and the prompt defined when to use it — representing missing data accurately is the desired behavior.

---

### Q22

A team's extraction prompt produces phone numbers in whatever format the source used. Downstream systems require E.164.

Which approach matches the guidance?

- **A)** Add a regex to the JSON Schema and rely on it to reformat the numbers, since pattern constraints in the schema definition will cause the model to generate output that already matches the target format.
- **B)** State the normalization rule with worked transformations — strip non-digits, apply E.164, with examples of each input shape.
- **C)** Ask for "properly formatted" phone numbers without defining the target format, trusting the model to choose a globally consistent representation that downstream systems can handle.
- **D)** Normalize the numbers in the database layer using a trigger on insert, which keeps the extraction prompt simple and consolidates all formatting logic in the storage layer.

---

### Q23

A batch job must not exceed the platform's per-batch limits.

Which statement is accurate about Message Batches limits?

- **A)** A batch is limited to either 100,000 requests or 256 MB in size, whichever is reached first.
- **B)** A batch is limited to 10 MB regardless of request count or model used, and requests must be split across multiple submissions when total payload size exceeds that threshold.
- **C)** A batch has no request-count limit, only a 24-hour processing window, so the only practical constraint is ensuring the batch completes before the window expires.
- **D)** A batch is limited to 1,000 requests per submission, with no size limit, and batches beyond that count must be broken into multiple sequential submissions.

---

### Q24

An agent must produce output that a downstream service consumes as typed records. Today it returns markdown with a table, and the parser breaks whenever the model adds a preamble.

Which fix is structural rather than cosmetic?

- **A)** Ask the model to omit the preamble before the table each time, and add a reminder at the end of the prompt since instructions at both boundaries tend to reduce the rate of non-compliant responses.
- **B)** Define the record shape as a tool `input_schema` and force the tool call, so output arrives as structured arguments rather than prose.
- **C)** Strip everything before the first `|` character as a post-processing step, since the table content itself is structurally correct and only the leading prose needs to be removed.
- **D)** Increase `max_tokens` so the table is never cut off mid-row, ensuring the parser always receives a complete markdown table even when the model includes a lengthy preamble before the data.

---

### Q25

A team reviews 200-file pull requests with a single API call and hits truncation. They consider two options: one call per file, or one call for the whole PR with a higher token limit.

Which reasoning is correct?

- **A)** Raising the limit is correct because splitting calls loses cross-file context and the model cannot correlate a vulnerability in one file with the interface it exploits in another without seeing both simultaneously.
- **B)** One call is always preferable because it keeps all context in a single prompt, and the model's attention mechanisms are designed to handle large context windows without degradation in practice.
- **C)** Scope the calls smaller and merge the resulting structures, because raising the limit does not scale and truncation corrupts the output.
- **D)** Switch to markdown output, which tolerates truncation more gracefully than JSON and allows the parser to recover partial results rather than failing on a malformed closing bracket.

---

### Q26

A CI review must produce findings a script can act on: file, line, severity, category, and description.

Which prompt design supports this?

- **A)** Ask for a "detailed and well-structured report" with all relevant information, since a capable model will include all five fields when the prompt signals that the consumer needs to act on the output.
- **B)** Ask for one finding per line so the script can split on newlines, with a delimiter like a pipe character separating the five fields in a documented order the script can parse.
- **C)** Ask for markdown with consistent headings that the script can parse reliably, since markdown structure is stable enough that a well-written regex can extract the five fields from each heading block.
- **D)** Specify the exact fields and allowed values for each, and return them through a schema-constrained mechanism rather than asking for a readable report.

---

### Q27

A few-shot prompt contains only examples of correct, well-formed inputs. In production, malformed and edge-case inputs produce erratic output.

What is missing?

- **A)** Examples covering the edge cases and undesirable outputs, so the model has an anchor for those situations.
- **B)** A higher temperature setting so the model generalizes better to unusual inputs, since higher temperature increases the probability of exploring the response space beyond the patterns seen in examples.
- **C)** A longer system prompt with more detailed instructions about edge cases, since explicit rules stated in prose can cover the long tail of malformed inputs more efficiently than examples for each variant.
- **D)** More examples of the same well-formed type to reinforce the pattern further, on the theory that a stronger prior on correct inputs will implicitly push the model away from incorrect outputs.

---

### Q28

A team must choose between asking the model to output JSON in its text response versus defining a tool with a JSON Schema.

Which statement about reliability is correct?

- **A)** Tool use with a JSON Schema enforces structure more strictly, because the model generates arguments to fit a declared schema rather than formatting prose.
- **B)** Both are equally reliable when the prompt is well-written and the schema is clear, so the choice should be made on implementation convenience rather than output quality.
- **C)** Neither approach is reliable; all model output must be repaired before use, since even tool use occasionally produces arguments that are structurally valid but semantically inconsistent with the intent.
- **D)** Prompt-based JSON is more reliable because it avoids the overhead of tool use setup and gives the model more freedom to express nuance that a rigid schema would prevent it from capturing.

---

### Q29

An extraction schema for a support ticket defines `severity` with values `low`, `medium`, `high`. A ticket describes a total outage.

Which schema concern does this expose?

- **A)** The `severity` field should be optional so the model can skip it when unsure, avoiding forced categorization when no value in the enum clearly fits the situation being described.
- **B)** The enum should be replaced with a free-text field so the model can be precise, allowing it to use domain-specific terms like "outage" or "degraded" that the fixed enum cannot express.
- **C)** The model should infer severity from the sentiment of the ticket text, using sentiment as a proxy signal that correlates with urgency even when the ticket author does not explicitly state a severity level.
- **D)** The enum must cover the real distribution of values, or the model is forced into an inaccurate answer.

---

### Q30

A summarization chain condenses a 40-page report in four successive steps. The final summary has lost the specific percentages and dates that mattered most.

Which mitigation applies?

- **A)** Extract the key data points explicitly and re-inject them directly into the next prompt, rather than letting them pass through successive summaries.
- **B)** Reverse the order and summarize from the end of the document backwards instead, since the most recent data — which typically appears at the end — is most likely to be preserved when summarization starts there.
- **C)** Use fewer summarization steps and a larger model to reduce cumulative loss, since fewer handoffs between summaries mean fewer opportunities for specific numerical values to be paraphrased away.
- **D)** Add an instruction asking the model to preserve all numbers and dates it encounters, trusting that an explicit instruction will override the model's tendency to condense precise values into approximate language.

---

### Q31

A review prompt says "Flag SQL injection risks only when user input is passed directly to a query string without parameterization. Do not flag ORM calls or prepared statements."

Which two elements of prompt design does this combine?

- **A)** A retry policy and a validation layer for output format, ensuring the model knows how to handle cases where its initial output does not meet the expected structure.
- **B)** A confidence threshold and a severity ranking for findings, sorting results by how certain the model is before presenting them to the reviewer.
- **C)** An explicit inclusion criterion and an explicit exclusion criterion.
- **D)** A few-shot example and a JSON Schema definition, pairing a concrete illustration of the desired output with a structural constraint that enforces its format.

---

### Q32

A team wants the same review prompt to behave consistently across 40 repositories with different conventions.

Which approach fits?

- **A)** Let the model infer each repository's conventions from the code it is reviewing, trusting that sufficient context in the diff will allow it to distinguish accepted patterns from genuine violations.
- **B)** Keep the detection criteria in the shared prompt and supply each repository's accepted patterns and conventions as its own persistent context.
- **C)** Write 40 separate prompts by hand, one tailored to each repository's style, and store them in a configuration file that the pipeline reads when it determines which repository is being reviewed.
- **D)** Use a single prompt and accept that some variation across repositories is inevitable, since perfect consistency is impossible when the underlying codebases themselves have different styles.

---

### Q33

A pipeline needs 100,000 documents classified. The team's first implementation makes 100,000 synchronous calls in a loop, and the job takes days while blocking a worker.

Which change is appropriate?

- **A)** Parallelize the synchronous loop by spreading it across more workers, which reduces wall-clock time without changing the processing mode and keeps the existing retry and logging logic intact.
- **B)** Submit the work as batches, since nothing depends on an immediate per-document response.
- **C)** Use a smaller, faster model for the same synchronous loop to cut latency, since a model optimized for speed will process each document quickly enough to make the sequential loop practical at this scale.
- **D)** Reduce the prompt length so each individual call completes more quickly, since shorter prompts reduce time-to-first-token and total generation time for every one of the hundred thousand calls.

---

### Q34

An extraction tool's schema marks `contract_value` as a number. Some contracts state "to be determined."

Which design handles this accurately?

- **A)** Have the model estimate a likely value based on similar contracts in context, since a plausible estimate is more useful to downstream consumers than a null that requires special handling.
- **B)** Have the model output the string "TBD" in the number field as a sentinel, which preserves the original document language and lets consumers search for the string to identify unresolved contracts.
- **C)** Have the model output `0` to indicate the value is not yet determined, since zero is a valid number in the schema and signals to the consumer that the value requires follow-up.
- **D)** Allow the field to be null and pair it with a status flag indicating why the value is absent.

---

### Q35

A team's structured output occasionally arrives valid against the schema but semantically wrong — a date in the future for a past event, a total that does not match the line items.

Which layer catches this?

- **A)** A higher `max_tokens` setting to give the model more room to reason through the arithmetic before committing to a total, reducing the frequency of calculation errors in longer extraction outputs.
- **B)** A stricter JSON Schema with additional type constraints on the fields, such as minimum and maximum bounds on dates and numeric fields that reflect the plausible real-world range of values.
- **C)** A forced tool call to ensure the output is always structured and typed, which eliminates the risk of the model embedding a semantically incorrect value inside a prose sentence rather than a structured field.
- **D)** An application-level validation layer with business rules, because schema conformance does not imply semantic correctness.

---

### Q36

A reviewer wants the model to evaluate eight specific issues it identified in the previous output, in one pass.

Which framing is most effective?

- **A)** Send the eight issues as eight separate requests, one per issue, so each request is focused and the model gives its full attention to a single problem without the risk of cross-contamination between fixes.
- **B)** Ask "what would you improve?" and let the model identify what to address, since the model may recognize additional issues beyond the eight already identified and produce a more thorough revision.
- **C)** Ask for a full rewrite without listing the specific issues to fix, on the theory that a fresh generation unconstrained by the original will naturally avoid the same mistakes.
- **D)** Describe all eight issues together with enough specificity that the model can address them in a single consolidated revision.

---

### Q37

A prompt asks for a summary "in a professional tone." Output quality varies widely between runs.

Which change most improves consistency?

- **A)** Raise the temperature to encourage more varied and creative interpretations, since a higher temperature causes the model to sample more broadly and occasionally land on a better phrasing.
- **B)** Ask for a longer summary to give the model more room to be professional, since a higher word count provides more surface area for the professional tone to manifest across sentences.
- **C)** Replace the subjective instruction with concrete criteria and an example of an acceptable output.
- **D)** Add "be professional" a second time at the end of the prompt to reinforce it, since instructions repeated at the end of a prompt are weighted more heavily in the model's generation.

---

### Q38

A team is deciding whether to add a `confidence` field to their extraction schema so a reviewer can prioritize.

Which consideration is most important?

- **A)** A self-reported confidence value is a weak signal on its own; routing decisions should also use document characteristics and field-level ambiguity, not confidence alone.
- **B)** Confidence scores are always accurate and should serve as the sole routing criterion, since the model's internal probability estimates reflect genuine uncertainty about the extraction quality.
- **C)** Confidence fields are not permitted in a valid JSON Schema definition and would cause validation errors when the schema is compiled or used with a compliant validator.
- **D)** Confidence should be computed from the API response latency as an objective measure, since longer generation times correlate with higher uncertainty and provide a signal that does not rely on self-reporting.

---

### Q39

An engineer wants the model to always call an extraction tool, and never to answer conversationally, for a specific document-processing endpoint.

Which combination is correct?

- **A)** No tool defined, plus a prompt demanding structured JSON output only, which relies entirely on instruction-following to prevent the model from producing prose when the document is ambiguous or incomplete.
- **B)** A tool defined with the target schema, plus `tool_choice: none` to suppress free text, which disables tools entirely and forces the model to produce a plain text response that the prompt can then constrain.
- **C)** A tool defined with the target schema, plus `tool_choice: auto` to let the model decide whether to call the tool or answer in prose based on the content of the document being processed.
- **D)** A tool defined with the target `input_schema`, plus `tool_choice` set to force that specific tool.

---

### Q40

A team splits a large code review into a security pass and a maintainability pass. The security pass uses examples of vulnerabilities; the maintainability pass uses examples of code smells.

Why are separate example sets appropriate?

- **A)** The API requires a distinct example set for each tool definition used, and mixing examples across tools causes the model to apply the wrong schema to each concern.
- **B)** Keeping examples separate reduces the total number of tokens sent per request, since each pass only carries the examples relevant to its concern rather than a combined set.
- **C)** Examples anchor the model to the concern at hand; mixing unrelated examples dilutes the anchor and reintroduces the recall trade-off.
- **D)** Examples from different domains must never be reused between prompts for licensing reasons, since the examples may contain proprietary code patterns that cannot be shared across prompts legally.

---

### Q41

A team's extraction accuracy varies by document layout: clean PDFs extract well, scanned forms poorly.

Which response matches the guidance on extraction accuracy patterns?

- **A)** Add few-shot examples drawn from the harder layouts and normalization instructions for their quirks, so the prompt covers the variation.
- **B)** Reject all scanned forms before they reach the extraction pipeline, routing them to an alternative OCR preprocessing step that normalizes the layout before any model call is made.
- **C)** Raise `max_tokens` for scanned forms to give the model more room to process them, since longer outputs allow the model to express uncertainty and attempt multiple interpretations of ambiguous fields.
- **D)** Treat scanned forms as unsupported and route them all to human reviewers without any triage, since the accuracy gap is too large to close with prompt engineering alone and automation would introduce more errors than it prevents.

---

### Q42

A prompt instructs: "Return only findings in the categories: security, correctness, and data loss. Never report formatting, naming, or test coverage."

Which risk does the second sentence specifically mitigate?

- **A)** Output truncation caused by too many findings exceeding the token limit, which would cause the JSON to be cut off before the closing bracket and corrupt the entire result.
- **B)** Schema violations in the structured output format, since findings in unexpected categories may not conform to the severity enum values defined for the three permitted categories.
- **C)** API rate limiting from too many concurrent review calls, since excluding three categories reduces the average number of findings per document and therefore the response size.
- **D)** Findings generated in categories where the model's performance is unreliable or where the team does not want them.

---

### Q43

An engineer needs 60,000 documents summarized and can wait overnight, but must know the outcome of every single request.

Which statement is accurate?

- **A)** Batch results become available when all messages complete or after the processing window, and each request's outcome is individually retrievable.
- **B)** Batches must be resubmitted entirely if any single request within them fails, which means a single transient error forces the engineer to re-run all sixty thousand documents at full cost.
- **C)** Failed requests in a batch are silently dropped and not included in results, so the engineer must compare the input count to the output count to detect failures.
- **D)** Batch results are aggregated into a single response and individual outcomes are not retrievable, requiring the engineer to re-run failed documents identified from the aggregate error count.

---

### Q44

A team's structured output for a multi-file review is assembled by merging per-file results.

Which risk must the merge step handle?

- **A)** The model refusing to produce JSON for certain file types or sizes, which would leave gaps in the merged output that the assembly step cannot fill without re-running those specific files.
- **B)** Collisions and duplicates across files, and preserving which file each finding came from.
- **C)** Losing the `tool_choice` setting between successive API calls, which could cause some files to return prose instead of structured JSON and break the merge step entirely.
- **D)** Exceeding the enum constraint on the severity field across the merged set, since combining findings from many files increases the chance that at least one contains an out-of-range severity value.

---

### Q45

A prompt defines an output schema but the model keeps adding an extra explanatory field not in the schema.

Which approach most reliably prevents this?

- **A)** Increase the number of few-shot examples showing outputs without the extra field, reinforcing the pattern with enough repetition that the model stops adding the field in production.
- **B)** Delete unexpected fields during parsing before they reach the application layer, keeping the parsing logic simple by silently ignoring any key that does not appear in the expected schema.
- **C)** Use a tool with a strict `input_schema` and force it, so the generated arguments are shaped by the declared schema.
- **D)** Add "do not add extra fields" to the prompt as an explicit instruction, combined with a note explaining that extra fields will cause downstream errors so the model understands the stakes.

---

### Q46

A classification prompt gives four examples, each labeled with the correct class and a short note on why.

Which effect does the rationale add?

- **A)** It sharpens the decision boundary the examples encode, helping the model apply the same criterion to unseen inputs.
- **B)** The rationale note is a required element of the few-shot format for classification tasks, and omitting it causes the model to treat the examples as unlabeled and ignore the class labels.
- **C)** It converts the prompt into a full chain-of-thought prompt that the model reasons through step by step before producing its answer, adding latency but improving accuracy on ambiguous inputs.
- **D)** It eliminates the need for additional examples, reducing the total count to zero because a well-explained rationale is equivalent to several additional labeled examples in terms of boundary definition.

---

### Q47

A review agent is asked to evaluate a diff against a style guide that is 4,000 lines long. The agent's findings ignore most of the guide.

Which explanation is most likely?

- **A)** The agent is fundamentally unable to read and apply style guides as reference material, and the task requires a fine-tuned model specifically trained on this codebase's conventions to produce reliable results.
- **B)** The diff is too small to trigger the rules present in the style guide, since the model only applies rules that are relevant to the code it can see and a small diff matches few of the four thousand lines of rules.
- **C)** The style guide must be converted to JSON before the model can use it effectively, since structured data is processed more reliably than natural language prose when the model needs to look up and apply specific rules.
- **D)** With a very large body of reference material, content in the middle tends to be underused; section the guide and apply it in targeted passes.

---

### Q48

A team wants to prevent a review agent from reporting speculative performance concerns, which are almost always wrong in their codebase.

Which mechanism is appropriate?

- **A)** A confidence threshold applied to all findings before they are reported, which filters out low-confidence findings across all categories and should reduce speculative performance concerns along with other uncertain findings.
- **B)** A hook that blocks the review tool from executing when performance is mentioned in the diff, preventing the tool call from reaching the model when the context suggests performance optimization is the topic.
- **C)** A post-processing filter that removes any finding containing the word "performance," which is fast to implement and catches the most common form of the unwanted findings without modifying the prompt.
- **D)** An explicit exclusion criterion in the prompt naming that category as out of scope.

---

### Q49

An engineer is choosing how to represent "the document did not specify a delivery date" in an extraction schema.

Which representation is most accurate?

- **A)** The string "unknown" stored in a date-typed field as a sentinel value, which preserves the information that a lookup was attempted while keeping the field populated for consumers that cannot handle null.
- **B)** The current date inserted as a default when no date is found in the document, ensuring the field is always populated so consumers do not need special null-handling logic in their date processing code.
- **C)** Omitting the entire record so its absence in the output signals that the date was missing, which keeps the output clean but requires consumers to join against the input list to detect which records had no delivery date.
- **D)** A nullable date field set to null, so downstream consumers can distinguish "not specified" from any real date.

---

### Q50

A team's first-pass prompt asks for "a good summary." The second attempt adds: "Three bullets, each under 20 words, covering decision, owner, and deadline. Do not include background."

Which change explains the improvement?

- **A)** Concrete, checkable criteria replaced a subjective quality judgment.
- **B)** The second prompt is longer, which gives the model more guidance overall and signals through its length that the task has specific requirements the model should take seriously.
- **C)** The second prompt implicitly lowers the temperature by being more specific, constraining the generation space so the model samples from a narrower distribution that excludes verbose or tangential responses.
- **D)** The second prompt uses bullet format, which language models handle more naturally than prose instructions and produces more consistent structure across repeated runs of the same prompt.

---

### Q51

A pipeline forces a tool call for extraction. Occasionally the model's arguments still fail application validation — a required cross-field rule is violated.

What is the correct interpretation?

- **A)** The forced tool call failed and should be retried immediately at the API level, since a validation failure in the arguments indicates that the model did not fully process the tool definition before generating its response.
- **B)** Forcing a tool guarantees the call and the schema shape, but not business-rule correctness; a validation and retry layer remains necessary.
- **C)** Cross-field validation rules should be expressed directly inside `tool_choice`, using the forcing parameter to encode the constraint so the API enforces it before returning the response to the application.
- **D)** Forced tool calls are always semantically valid, so the schema must be incorrectly defined if validation failures occur, and the fix is to tighten the schema until the constraint is expressed structurally.

---

### Q52

A team splits an extraction into two calls: one for header fields, one for line items. The results must be assembled into one record.

Which consideration matters most?

- **A)** Defining how the two structures merge — shared keys, ordering, and what happens when one call returns nothing.
- **B)** Ensuring both calls use the same temperature so outputs are stylistically consistent and the merge step does not need to normalize different phrasings of the same value across the two responses.
- **C)** Ensuring both calls are submitted within the same batch for atomic processing, so either both succeed or both fail together and the merge step never receives a partial result from only one of the two calls.
- **D)** Ensuring both calls use the same `max_tokens` value to keep outputs comparable in length and prevent one call from producing a much more detailed result than the other.

---

### Q53

A prompt asks the model to extract a `country` field. Sources write "USA", "U.S.", "United States", and "us".

Which instruction design is most effective?

- **A)** Specify the target representation and give worked examples mapping each observed variant to it.
- **B)** Accept all variants in the extraction and deduplicate them in a later processing step, which keeps the prompt simple and centralizes the normalization logic in a dedicated data cleaning stage.
- **C)** Add a `country_raw` field to capture the source text and leave normalization to downstream consumers, which preserves the original document language and avoids encoding normalization assumptions in the prompt.
- **D)** Ask for "the country" and trust the model to pick a consistent representation, since a capable model will naturally converge on a standard form like ISO 3166 when the field name implies a canonical value.

---

### Q54

A reviewer wants to know why a single combined review prompt underperforms three specialized ones, even though the combined prompt lists all three concerns clearly.

Which explanation is correct?

- **A)** Concerns compete for the model's attention within one prompt, and the few-shot examples for one concern may dilute the others rather than help them.
- **B)** The API processes only the first listed instruction in any given prompt, discarding subsequent instructions when the combined prompt exceeds a threshold number of directives.
- **C)** The combined prompt is almost certainly exceeding the available context window, causing the model to lose the later concerns as they fall outside the effective attention range.
- **D)** A JSON Schema can only represent one concern at a time, so the model cannot produce structured output that captures findings from multiple concern categories in a single response.

---

### Q55

A team needs to decide whether a given extraction should go to a human reviewer.

Which routing input is the weakest on its own?

- **A)** Whether the document layout matched a known template in the system, which is a verifiable structural property that correlates strongly with extraction reliability across document types.
- **B)** Whether cross-field validation rules failed during post-processing, which is the hardest signal available since it reflects a logical contradiction in the extracted values rather than a soft uncertainty.
- **C)** The model's self-reported confidence score for the extraction.
- **D)** Whether required fields came back null in the extraction output, which is an objective fact about the result that directly indicates the model could not find a value the schema requires.

---

### Q56

An engineer wants the model to return exactly one of a fixed set of routing destinations, and to never invent a new one.

Which schema element enforces the closed set?

- **A)** A `type: string` declaration on the field, which accepts any string value and does not constrain the model to the specific routing destinations the engineer has defined.
- **B)** An `enum` listing the allowed values explicitly.
- **C)** A `required` declaration marking the field as mandatory, which ensures the model always returns a value for the field but does not restrict which string it chooses to put there.
- **D)** A `description` field naming the allowed values as examples, which provides guidance the model may follow but does not structurally prevent it from inventing a new destination.

---

### Q57

A batch of extraction results is written into a typed table. About 2% of rows fail the database's constraints, and the failures are discovered only at insert time.

Which design change addresses this earlier?

- **A)** Increase the batch size so the failure rate averages out across more rows, reducing the impact of the 2% failure rate by processing more successful rows alongside each failing one.
- **B)** Validate each result against the business rules before the write, and route failures to a review or retry path.
- **C)** Relax the database constraints so fewer rows are rejected at insert time, accepting that a small percentage of semantically invalid rows is an acceptable trade-off for a higher write success rate.
- **D)** Insert rows one at a time so each failure is isolated and easier to debug, which prevents a single bad row from blocking the entire batch but still discovers the problem at insert time rather than earlier.

---

### Q58

A prompt for a business-logic review includes two examples of real logic errors and two examples of code that looks suspicious but is correct.

Which objective does this serve?

- **A)** Reducing the total token cost of sending the prompt to the API, since showing the model what not to flag allows the system prompt to be shorter than one that describes every valid pattern in prose.
- **B)** Reducing false positives by anchoring what should not be flagged, alongside what should.
- **C)** Satisfying the tool schema's requirement for examples in its definition, as the JSON Schema validator rejects tool definitions that do not include at least one positive and one negative example per field.
- **D)** Increasing the total number of findings the model produces per run, since exposure to suspicious-but-correct code prompts the model to look harder for similar patterns that may actually be errors.

---

### Q59

A team's review output must be consumed by a service that stores one row per finding, and an empty result set is a valid outcome.

Which design handles the empty case cleanly?

- **A)** Always return the structured container with an empty findings array, so "nothing found" is explicit rather than an absent response.
- **B)** Return a single placeholder finding with severity "none" to confirm the review ran, which gives the consuming service a row to process and avoids the need for special handling of an empty array.
- **C)** Return no tool call when there is nothing to report, leaving the response empty so the consuming service can treat an absent tool call as equivalent to a clean review with zero findings.
- **D)** Return a prose message saying no issues were found in this revision, which is human-readable and can be logged directly without any parsing, making the empty case easy to handle in the service's logging pipeline.

---

### Q60

An engineer must choose between the synchronous API and batches for a nightly report that must be on an executive's desk by 8 a.m., with the job starting at midnight.

Which reasoning is correct?

- **A)** Batches are inappropriate because completion time cannot be guaranteed to the minute, and any uncertainty in the delivery window is unacceptable when the output goes directly to an executive.
- **B)** The synchronous API is required whenever there is a hard deadline on the output, since only synchronous processing guarantees that each request completes before the next one begins and the total time is therefore predictable.
- **C)** Both options cost the same, so latency characteristics alone should decide, and the synchronous API should be chosen since it provides more predictable per-request latency even if total throughput is lower.
- **D)** Batches fit, because the workflow does not block on individual responses and the processing window comfortably precedes the deadline.

---

**End of block — 60 questions.**
