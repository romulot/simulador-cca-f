# Exame Avançado — Bloco 5

**60 questions · multiple choice · one correct answer**

> Do not look at the answer key until you have finished the whole block.
> The domain and objective of each question are deliberately not shown.

---

### Q1

A synthesis agent receives findings from three research subagents. Two sources agree that a drug trial showed a 40% improvement; a third, more recent source reports the result was not reproduced. The final report states flatly: "The treatment improves outcomes by 40%."

What went wrong?

- **A)** The subagents should have been run sequentially.
- **B)** The synthesis agent needed a larger context window.
- **C)** The synthesis collapsed contested claims into a single confident statement instead of preserving the disagreement between sources.
- **D)** The third source should have been discarded for contradicting the majority.

---

### Q2

A conversation with a coding agent has run for three hours. Recent responses have started contradicting decisions made early in the session.

Which mitigation directly addresses the cause?

- **A)** Summarize or trim the history and carry forward a structured state object holding the decisions that must remain in force.
- **B)** Raise the temperature so the agent varies its approach.
- **C)** Ask the agent to re-read its own earlier messages.
- **D)** Start over with the same prompt.

---

### Q3

An extraction pipeline sends every hundredth document to a human reviewer, chosen at random.

Which routing strategy is better?

- **A)** Review only the documents processed on Mondays.
- **B)** Route based on confidence, document characteristics, and field-level ambiguity, so the documents most likely to be wrong are the ones reviewed.
- **C)** Increase the random sampling rate to one in fifty.
- **D)** Review the longest documents, since length correlates with difficulty.

---

### Q4

A subagent's search tool returns an empty result because its API key expired. The subagent reports "no results found," and the coordinator concludes the topic has no coverage.

What is the failure?

- **A)** The subagent's context window was exhausted.
- **B)** The search tool should have thrown an exception to stop the pipeline.
- **C)** The coordinator should have run more subagents.
- **D)** An access failure was reported as a valid empty result, and the two require completely different responses.

---

### Q5

An agent exploring a 500,000-line codebase must sustain understanding across sessions that exceed the context limit.

Which combination of strategies applies?

- **A)** Keep one session open indefinitely and rely on auto-compaction.
- **B)** Isolate deep dives in subagents, persist findings to scratchpad files, and read files in a targeted way rather than broadly.
- **C)** Ask the agent to memorize the architecture before starting.
- **D)** Read the entire codebase into context once, then work from memory.

---

### Q6

A report generated from multi-agent research contains a claim with no indication of where it came from. The reviewer cannot verify it.

Which design prevents this?

- **A)** Subagents return structured findings carrying source metadata alongside each claim, so content and provenance travel together.
- **B)** The synthesis agent adds a bibliography at the end of the report.
- **C)** The report includes the total number of sources consulted.
- **D)** The coordinator asks each subagent to be careful about accuracy.

---

### Q7

A support agent has tried every tool available and still cannot resolve a billing dispute. The customer is waiting.

What should happen next?

- **A)** Tell the customer the request cannot be processed.
- **B)** Keep retrying the same tools until one succeeds.
- **C)** Ask the customer to restate the problem from the beginning.
- **D)** Escalate with a structured handoff package containing the case context, the actions already attempted and their results, and the specific decision the human must make.

---

### Q8

A user's request is genuinely ambiguous: "Clean up the reporting module" could mean deleting dead code, refactoring, or rewriting it.

What is the correct agent behavior?

- **A)** Ask a targeted clarifying question before acting, since the readings lead to materially different work.
- **B)** Do all three so that at least one matches.
- **C)** Report that the request is ambiguous and stop without offering options.
- **D)** Pick the most conservative interpretation and proceed silently.

---

### Q9

A tool that queries a monitoring API returns 8,000 lines of metrics when the agent needs one value. Subsequent reasoning in the session degrades.

Which mitigation applies?

- **A)** Ask the model to focus only on the relevant metric.
- **B)** Filter the tool's response so only the needed information enters the context.
- **C)** Call the monitoring API less frequently.
- **D)** Switch to a model with a larger context window.

---

### Q10

A summarization pipeline condenses a legal document over several passes. Dates and monetary amounts have disappeared from the final summary.

Which statement explains this?

- **A)** The summary was truncated by `max_tokens`.
- **B)** The model cannot process dates and currency.
- **C)** The document exceeded the batch size limit.
- **D)** Progressive summarization tends to drop numerical detail; the key data should be extracted and re-injected directly into the next prompt.

---

### Q11

A synthesis agent must report on a topic where the evidence is genuinely mixed.

Which output design is appropriate?

- **A)** Distinguish well-established findings from contested ones, stating where sources disagree rather than choosing a winner silently.
- **B)** Report only the finding supported by the most sources.
- **C)** Report the average of the conflicting values.
- **D)** Report the finding from the source with the highest self-reported confidence.

---

### Q12

Every request to the model must carry the full conversation, and the conversation keeps growing.

Which statement is accurate?

- **A)** Growth is capped automatically by the model.
- **B)** The API stores the conversation server-side, so growth does not matter.
- **C)** Each request is stateless, so the whole history is re-sent; summarizing or trimming that history is the mitigation.
- **D)** Only the most recent message is sent.

---

### Q13

A coordinator receives a failure from one of five parallel subagents. The other four succeeded.

Which handling is most appropriate?

- **A)** Discard all five results and restart the pipeline.
- **B)** Substitute the failed subagent's output with the most similar successful one.
- **C)** Record what is missing, synthesize from what succeeded, and state explicitly in the output which portion could not be covered.
- **D)** Synthesize from the four and say nothing about the fifth.

---

### Q14

An engineer resumes a session from last week and asks the agent to continue. The agent proceeds confidently using assumptions that are now stale.

Which practice prevents this?

- **A)** Open the resumed session with a structured summary of what changed, and direct the agent to re-read the affected files.
- **B)** Ask the agent whether anything has changed.
- **C)** Run `/compact` before continuing.
- **D)** Trust that resuming restores the current state of the project.

---

### Q15

A team wants human review effort focused where it pays off. Their current rule reviews any extraction where the model reported confidence below 0.9.

Which improvement is most defensible?

- **A)** Raise the threshold to 0.99 to review more documents.
- **B)** Remove the confidence field and review everything.
- **C)** Combine confidence with objective signals — nulls in required fields, unfamiliar document layouts, failed cross-field validations — rather than relying on the self-reported score alone.
- **D)** Lower the threshold to 0.7 to review fewer documents.

---

### Q16

An agent working through a long refactor loses track of a constraint stated at the start: "do not change the public API."

Which mechanism most reliably keeps the constraint in force?

- **A)** Repeat the constraint once in the middle of the session.
- **B)** Carry the constraint in a structured state object that is re-included in each prompt, rather than relying on it surviving in the conversation history.
- **C)** Rely on auto-compaction preserving it.
- **D)** Ask the agent to remember it.

---

### Q17

A multi-agent system produces a report where one subagent's hallucinated statistic was accepted by the synthesis agent and presented as fact.

Which design reduces this risk?

- **A)** Run the synthesis twice and compare.
- **B)** Increase the number of research subagents.
- **C)** Ask the synthesis agent to fact-check every claim from its own knowledge.
- **D)** Require each finding to carry its source, so unsourced claims are visible and can be treated differently during synthesis.

---

### Q18

A developer is 40 messages into a debugging session. The relevant context is the last 10 messages; the first 30 concern a different, resolved problem.

Which strategy fits?

- **A)** Fork the session so both problems stay active.
- **B)** Continue and let the model decide what is relevant.
- **C)** Clear the session entirely and restart the debugging from scratch.
- **D)** Compact or trim the resolved portion, retaining selectively what still matters.

---

### Q19

A coordinator must decide whether a subagent failure is recoverable. The subagent reports: `{"error": "rate limited", "retryable": true}`.

Which response is appropriate?

- **A)** Escalate to a human immediately.
- **B)** Mark the topic as having no findings.
- **C)** Retry the subagent's work after a delay, since the error is marked as transient.
- **D)** Abort the entire pipeline.

---

### Q20

A team's agent handles a request whose correct answer depends on information the agent does not have and cannot obtain.

Which behavior is correct?

- **A)** Produce an answer and add a generic disclaimer to every response.
- **B)** Refuse the request entirely with no explanation.
- **C)** State the limitation explicitly and escalate or ask, rather than producing a confident answer built on an assumption.
- **D)** Produce the most likely answer without qualification.

---

### Q21

An agent summarizing a 50-page report consistently uses content from the first and last few pages and underuses the middle.

Which mitigation applies?

- **A)** Ask the model to pay attention to the middle.
- **B)** Increase `max_tokens` on the response.
- **C)** Reverse the page order so the middle becomes the end.
- **D)** Process the document in sections rather than passing all 50 pages in one prompt.

---

### Q22

A research coordinator must produce a report where a reader can tell which claims are solid and which are provisional.

Which subagent output design supports this?

- **A)** A single overall confidence score for the whole report.
- **B)** Prose summaries written in a cautious tone.
- **C)** A list of all sources at the end, unlinked to specific claims.
- **D)** Structured findings that include a field for the strength or status of each claim, alongside its source.

---

### Q23

A long-running agent session in Claude Code approaches the context limit while the developer is mid-task.

What does Claude Code do, and what can the developer do?

- **A)** The model switches to a larger variant automatically.
- **B)** The oldest messages are silently deleted with no summarization.
- **C)** Auto-compaction summarizes history using reserved headroom; the developer can also invoke compaction explicitly or clear the session.
- **D)** The session terminates and must be restarted.

---

### Q24

A subagent encounters a malformed document mid-batch. It cannot parse it.

Which behavior best serves the pipeline?

- **A)** Handle the failure locally where it can, report the specific document and reason for what it cannot, and continue with the rest.
- **B)** Skip the document silently and continue.
- **C)** Substitute an empty record for the document.
- **D)** Abort the batch and report the failure to the coordinator.

---

### Q25

A team debates whether a research agent should return prose summaries or structured data to the synthesis step.

Which consideration should decide?

- **A)** Whichever the subagent's model produces more quickly.
- **B)** Structured data is always better because it is machine-readable.
- **C)** What the downstream synthesis needs — structured data where fields are aggregated or filtered, prose where narrative nuance matters, and citation metadata in both cases.
- **D)** Prose is always better because it reads more naturally.

---

### Q26

An agent's answer depends on a file it was told about ten thousand tokens ago, and it now misremembers the file's contents.

Which practice addresses this?

- **A)** Paste the file again at the top of every message.
- **B)** Re-read the file at the point of use rather than relying on it persisting accurately in the conversation.
- **C)** Ask the agent to recall the file from memory more carefully.
- **D)** Increase the model's temperature.

---

### Q27

A support agent resolves 80% of contacts but the remaining 20% reach humans with no useful context, and handle time on those is high.

Which change has the largest effect on the escalated cases?

- **A)** A structured handoff protocol so the human receives context, attempted actions, and the blocking decision without reconstructing the case.
- **B)** Asking the agent to write a longer summary before escalating.
- **C)** Giving the agent more tools so fewer cases escalate.
- **D)** Raising the resolution target to 90%.

---

### Q28

A team's report aggregates findings from four subagents. Two of them cite the same underlying source, but the report presents the claim as independently corroborated.

Which design issue does this expose?

- **A)** The coordinator should have deduplicated by text similarity.
- **B)** The subagents should not have been run in parallel.
- **C)** Without source identifiers travelling with each finding, the synthesis cannot detect that two findings share one origin.
- **D)** The report should cite fewer sources.

---

### Q29

An agent is asked a question whose answer it is uncertain about, and the cost of being wrong is high — a production deployment decision.

Which behavior matches good practice?

- **A)** Surface the uncertainty and what would resolve it, and route the decision to a human.
- **B)** Give the most likely answer confidently, since hedging is unhelpful.
- **C)** Refuse to answer questions about deployments.
- **D)** Give an answer with a numeric confidence score and let the caller decide.

---

### Q30

A pipeline's state is held entirely in the conversation. After compaction, the coordinator repeats work it had already completed.

Which fix addresses the cause?

- **A)** Increase the reserved compaction buffer.
- **B)** Instruct the coordinator not to repeat work.
- **C)** Hold pipeline state in a structured object outside the conversation, and consult it rather than the history to decide what remains.
- **D)** Disable compaction.

---

### Q31

An agent in a long session begins a new, unrelated task while the previous task's context is still present. Its answers mix concerns from both.

Which command fits?

- **A)** `/rewind`, to return to the start of the previous task.
- **B)** `/compact`, to summarize the previous task.
- **C)** `/clear`, to reset the conversation while keeping project guidance in effect.
- **D)** `/resume`, to load a different session.

---

### Q32

A synthesis agent is given the instruction: "Resolve any conflicts by preferring the most specific data."

What does this provide?

- **A)** A stated, checkable rule for conflict resolution, so the synthesis does not resolve disagreements arbitrarily.
- **B)** A ranking of subagents by reliability.
- **C)** A mechanism for verifying source accuracy.
- **D)** A guarantee that no conflicts will arise.

---

### Q33

A team routes extractions to human review when any required field came back null.

Which characteristic makes this a reasonable signal?

- **A)** It correlates with document length.
- **B)** It catches every possible extraction error.
- **C)** It is cheaper to compute than a confidence score.
- **D)** It is an objective property of the output, not an estimate the model made about itself.

---

### Q34

An engineer must decide what a subagent should return to the coordinator: the full text of every document it read, or a condensed structured summary.

Which consideration is decisive?

- **A)** Full text is always safer because nothing is lost.
- **B)** The coordinator's context is finite, so subagents should return what synthesis needs — condensed, structured, with provenance — not raw material.
- **C)** The subagent should return whichever is shorter.
- **D)** The coordinator can compact whatever it receives.

---

### Q35

A long agent session has accumulated tool results, file contents, and reasoning. The developer wants to know what is consuming the context before deciding how to proceed.

Which step comes first?

- **A)** Switch to a larger-context model.
- **B)** Inspect the context breakdown by category to see what is actually consuming the window.
- **C)** Compact immediately.
- **D)** Clear the session.

---

### Q36

An agent reports: "I checked the logs and found no errors." In fact, the log query failed with a permissions error and returned nothing.

Which design failure does this illustrate?

- **A)** The agent should not have been given log access.
- **B)** The agent's context window was too small.
- **C)** The log query should have been retried more times.
- **D)** The tool did not distinguish an access failure from a valid empty result, so the agent reported absence of evidence as evidence of absence.

---

### Q37

A team wants a subagent's deep exploration of a legacy module to inform the main session without flooding it with the exploration transcript.

Which approach fits?

- **A)** Run the exploration in the main session and compact afterwards.
- **B)** Run the exploration in an isolated subagent context and return only a structured conclusion to the main session.
- **C)** Run the exploration and paste only the parts that look relevant.
- **D)** Run the exploration in a second terminal and summarize it by hand.

---

### Q38

A report must state that a market-size figure comes from a vendor's own marketing page rather than an independent source.

Which finding schema supports this?

- **A)** A timestamp of when the finding was produced.
- **B)** Source metadata that records not just that a source exists but what kind of source it is.
- **C)** A confidence score on the figure.
- **D)** A boolean marking the finding as verified.

---

### Q39

An agent has been asked to make a change that could affect production data. It is confident in its plan.

Which practice applies?

- **A)** Ask the agent to double-check its own plan first.
- **B)** Route the action through human approval before execution, because confidence is not a substitute for authorization on irreversible actions.
- **C)** Proceed, since the agent's confidence is high.
- **D)** Proceed and log the action for later audit.

---

### Q40

A coordinator's five subagents each return findings in their own ad-hoc prose format. Synthesis quality varies unpredictably between runs.

Which change addresses the cause?

- **A)** Run the subagents sequentially so their outputs converge.
- **B)** Ask the synthesis agent to normalize the formats itself.
- **C)** Use the same model for all five subagents.
- **D)** Define a common output schema all subagents must return, so synthesis operates on uniform structures.

---

### Q41

A team is deciding what belongs in a sliding window of retained conversation versus what can be dropped.

Which retention policy is most defensible?

- **A)** Retain the most recent N messages regardless of content.
- **B)** Retain the longest messages, since they carry the most information.
- **C)** Retain everything and rely on the model to weigh relevance.
- **D)** Retain selectively — decisions, constraints, and unresolved questions — and drop resolved exchanges and superseded tool output.

---

### Q42

A support agent escalates every case where the customer uses angry language.

Which criticism is valid?

- **A)** Sentiment is an unreliable escalation signal; routing should be based on what the agent could and could not resolve.
- **B)** The agent should apologize before escalating.
- **C)** Sentiment analysis requires a separate model.
- **D)** The agent should escalate more cases, not fewer.

---

### Q43

A coordinator aggregates findings and must indicate that one area was investigated but produced nothing.

Which representation is correct?

- **A)** Reporting the area with a note that data was unavailable, without saying whether it was searched.
- **B)** Reporting a placeholder finding with low confidence.
- **C)** Omitting the area from the report.
- **D)** An explicit statement that the area was covered and returned no findings, distinct from an area that was never investigated.

---

### Q44

An engineer must decide how a multi-session codebase exploration records what it has learned.

Which storage choice best survives compaction and session boundaries?

- **A)** The conversation history of the longest-running session.
- **B)** The agent's summary produced by auto-compaction.
- **C)** The developer's memory of previous sessions.
- **D)** A file in the repository that each session reads at the start and appends to as it learns.

---

### Q45

A synthesis step receives one finding stating a company has 500 employees and another stating 1,200, both from dated sources.

Which handling is correct?

- **A)** Average the two figures.
- **B)** Present both with their sources and dates, noting the discrepancy, rather than silently choosing one.
- **C)** Choose the larger figure as more likely to be current.
- **D)** Omit the employee count from the report.

---

### Q46

An agent working on a large migration must decide, at each step, which files to read.

Which approach manages context best?

- **A)** Load every file in the module at the start so nothing is missed.
- **B)** Read the specific files the current step requires, guided by prior search, rather than loading the module preemptively.
- **C)** Read files in alphabetical order until the context is full.
- **D)** Rely on the agent's general knowledge of similar codebases.

---

### Q47

A team observes that after auto-compaction, the agent occasionally repeats a question the user already answered.

Which explanation is correct?

- **A)** The agent's temperature is too high.
- **B)** The user's answer was never received by the model.
- **C)** Compaction summarizes history, so specific details can be lost; anything that must survive should be held in a durable structured form.
- **D)** Compaction preserves all content verbatim, so this cannot happen.

---

### Q48

A human reviewer must decide quickly whether an extraction is trustworthy. The record contains only the extracted values.

Which addition helps most?

- **A)** Field-level indicators of ambiguity and the source location each value was drawn from.
- **B)** A single overall quality grade.
- **C)** The model version used.
- **D)** The total processing time for the document.

---

### Q49

An agent is midway through a multi-step task when the user asks an unrelated question.

Which behavior best preserves reliability?

- **A)** Answer from the task's context without distinguishing the two.
- **B)** Refuse the question until the task completes.
- **C)** Abandon the task and start the new question fresh.
- **D)** Answer the question while keeping the task's state explicit, so the task can resume without the interruption displacing its context.

---

### Q50

A pipeline retries a failed subagent three times. Each attempt fails identically with a schema validation error on the same field.

Which conclusion is correct?

- **A)** The error is not transient; retrying the identical call cannot succeed, and the failure should be escalated or the input corrected.
- **B)** The pipeline should mark the result as empty and continue.
- **C)** The retry count should be increased.
- **D)** The subagent should be replaced with a different model.

---

### Q51

A research report cites a claim traced to a single blog post. The reader treats it with the same weight as a claim supported by three peer-reviewed papers.

Which design gap does this reveal?

- **A)** The report should have been shorter.
- **B)** The report cites too many sources.
- **C)** The output does not distinguish well-established findings from weakly supported ones.
- **D)** The blog post should have been excluded automatically.

---

### Q52

A team wants to reduce the context cost of a research pipeline without losing coverage.

Which approach fits?

- **A)** Reduce the number of research threads.
- **B)** Isolate each research thread in its own subagent so the coordinator holds only the returned summaries, not the raw exploration.
- **C)** Ask subagents to write shorter findings.
- **D)** Increase the coordinator's context window.

---

### Q53

An agent's tool returns a customer record with 200 fields. The agent needs the account tier and the billing status.

Which practice applies?

- **A)** Have the tool return the record in a more compact encoding.
- **B)** Have the agent summarize the record before continuing.
- **C)** Have the tool return only the fields the agent's role requires.
- **D)** Have the agent ignore the other 198 fields.

---

### Q54

A synthesis agent is told: "You have received outputs from multiple agents. Combine them into a single coherent response."

What is missing for reliable handling of disagreement?

- **A)** A larger context window.
- **B)** An explicit rule for resolving conflicts, and an instruction to preserve disagreement where it is genuine rather than collapsing it.
- **C)** A confidence score per agent.
- **D)** More subagents.

---

### Q55

A developer wants to know whether their session is near the point where compaction will trigger.

Which step applies?

- **A)** Estimate from the elapsed session time.
- **B)** Inspect the token usage and remaining window, which includes the reserved compaction headroom.
- **C)** Wait for compaction to occur and observe.
- **D)** Count the messages in the transcript.

---

### Q56

An extraction system's human review queue is overloaded. Analysis shows most reviewed documents were correct, and the errors that reached production came from documents the rule never flagged.

Which change is indicated?

- **A)** Re-derive the routing signals from what actually distinguished the failed documents, rather than tuning the threshold on the existing signal.
- **B)** Increase the review capacity.
- **C)** Remove human review, since most reviewed documents were correct.
- **D)** Lower the confidence threshold to flag more documents.

---

### Q57

A coordinator must decide whether a subagent's inability to find information means the information does not exist.

Which reasoning is correct?

- **A)** It cannot be concluded without knowing whether the search executed successfully and what scope it covered.
- **B)** The coordinator should ask the synthesis agent to decide.
- **C)** If the subagent found nothing, the information does not exist.
- **D)** The coordinator should assume the information exists and re-delegate indefinitely.

---

### Q58

A team wants their agent to be explicit when a conclusion rests on an assumption rather than on retrieved evidence.

Which output design supports this?

- **A)** A single confidence number attached to the conclusion.
- **B)** A cautious writing style throughout.
- **C)** A disclaimer at the end of every report.
- **D)** Separate fields, or an explicit marker, distinguishing evidence-backed statements from inferred ones.

---

### Q59

A session's context is dominated by a large file the agent read early and no longer needs.

Which approach is most appropriate?

- **A)** Start a new session and re-establish everything from scratch.
- **B)** Continue and accept the cost.
- **C)** Compact the session so the superseded content is summarized away, keeping what still matters.
- **D)** Read the file again to refresh it.

---

### Q60

A multi-agent system must remain debuggable when a report turns out to be wrong. The team needs to trace which subagent produced the incorrect claim and from what source.

Which combination provides this?

- **A)** Structured findings carrying agent and source identifiers, flowing through a coordinator that is the single point every message passes through.
- **B)** A larger context window on the coordinator so it retains everything.
- **C)** A post-hoc review of the final report by a second model.
- **D)** Verbose logging inside each subagent, with direct subagent-to-subagent communication.

---

**End of block — 60 questions.**
