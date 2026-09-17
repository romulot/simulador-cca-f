# Exame Avançado — Bloco 5

**60 questions · multiple choice · one correct answer**

> Do not look at the answer key until you have finished the whole block.
> The domain and objective of each question are deliberately not shown.

---

### Q1

A synthesis agent receives findings from three research subagents. Two sources agree that a drug trial showed a 40% improvement; a third, more recent source reports the result was not reproduced. The final report states flatly: "The treatment improves outcomes by 40%."

What went wrong?

- **A)** The subagents should have been run sequentially so later findings could override earlier ones, since ordering determines which result the synthesis agent treats as authoritative.
- **B)** The synthesis agent needed a larger context window to hold all three sources simultaneously, so no finding was dropped before synthesis could complete.
- **C)** The synthesis collapsed contested claims into a single confident statement instead of preserving the disagreement.
- **D)** The third source should have been discarded because contradicting a majority finding without replication data is insufficient grounds to overturn the consensus.

---

### Q2

A conversation with a coding agent has run for three hours. Recent responses have started contradicting decisions made early in the session.

Which mitigation directly addresses the cause?

- **A)** Summarize the history and carry forward a structured state object with the decisions that must remain in force.
- **B)** Raise the temperature so the agent varies its approach and avoids repeating the same mistakes, introducing enough randomness to break the pattern of contradiction.
- **C)** Ask the agent to re-read its own earlier messages to recover the lost context, since the model can reconstruct decisions from its prior output if prompted explicitly.
- **D)** Start over with the same prompt and repeat the session from scratch, accepting the time cost to reset the contradiction pattern.

---

### Q3

An extraction pipeline sends every hundredth document to a human reviewer, chosen at random.

Which routing strategy is better?

- **A)** Review only the documents processed on Mondays, when processing volume is lower and reviewers have more time per document to catch subtle errors.
- **B)** Route based on confidence, document characteristics, and field-level ambiguity.
- **C)** Double the random sampling rate to one in fifty, since a larger statistical sample will surface more of the error population and give reviewers a representative cross-section to calibrate against.
- **D)** Review the longest documents, since length correlates with structural complexity and a longer document gives the model more opportunity to accumulate extraction drift across fields.

---

### Q4

A subagent's search tool returns an empty result because its API key expired. The subagent reports "no results found," and the coordinator concludes the topic has no coverage.

What is the failure?

- **A)** The subagent's context window was exhausted before the search could complete, causing the result buffer to be truncated to an empty payload.
- **B)** The search tool should have thrown an exception to halt the pipeline immediately, preventing the coordinator from acting on an incomplete state.
- **C)** The coordinator should have deployed more subagents to cover the same topic, since redundant search attempts would have surfaced results even if one credential failed.
- **D)** An access failure was reported as a valid empty result; the two require different responses.

---

### Q5

An agent exploring a 500,000-line codebase must sustain understanding across sessions that exceed the context limit.

Which combination of strategies applies?

- **A)** Keep one session open indefinitely and rely on auto-compaction to manage the window, trusting that the compaction summary will preserve architectural decisions accurately across the full codebase scope.
- **B)** Isolate deep dives in subagents, persist findings to scratchpad files, and read files in a targeted way.
- **C)** Ask the agent to memorize the architecture before starting any exploratory work, since committing structure to the system prompt at session start avoids repeated file reads during navigation.
- **D)** Read the entire codebase into context once, then work from memory for the rest of the session, since modern context windows are large enough to hold the dependency graph even if not every source line.

---

### Q6

A report generated from multi-agent research contains a claim with no indication of where it came from. The reviewer cannot verify it.

Which design prevents this?

- **A)** Subagents return structured findings with source metadata alongside each claim.
- **B)** The synthesis agent compiles a bibliography section at the end of the report listing all sources consulted, so the reviewer can cross-reference any claim against the full source list.
- **C)** The report includes the total number of sources consulted across all subagents, giving the reviewer a sense of the research breadth and the overall evidence base behind the findings.
- **D)** The coordinator instructs each subagent to be careful about accuracy before running, and to flag any claim the subagent cannot independently verify from two distinct sources.

---

### Q7

A support agent has tried every tool available and still cannot resolve a billing dispute. The customer is waiting.

What should happen next?

- **A)** Tell the customer the request cannot be processed and suggest they contact the billing department directly, since providing a clear next step reduces customer frustration even when the agent cannot resolve the issue.
- **B)** Keep retrying the same tools in different combinations until one succeeds, since varying tool parameters may surface a code path that the initial attempts missed.
- **C)** Ask the customer to restate the problem so the agent can attempt a fresh approach, since a rephrased description may reveal details the original statement omitted.
- **D)** Escalate with a structured handoff package — context, actions attempted, blocking decision.

---

### Q8

A user's request is genuinely ambiguous: "Clean up the reporting module" could mean deleting dead code, refactoring, or rewriting it.

What is the correct agent behavior?

- **A)** Ask a targeted clarifying question before acting.
- **B)** Attempt all three interpretations in parallel so that at least one matches the user's intent, since the cost of extra work is lower than the risk of choosing the wrong interpretation unilaterally.
- **C)** Report that the request is ambiguous and stop without offering the possible readings as options, so the user is forced to provide a precise specification rather than selecting from a pre-filtered list.
- **D)** Pick the most conservative interpretation and proceed silently, since any scope expansion beyond the minimum can be proposed as a follow-on once the baseline is done.

---

### Q9

A tool that queries a monitoring API returns 8,000 lines of metrics when the agent needs one value. Subsequent reasoning in the session degrades.

Which mitigation applies?

- **A)** Ask the model to focus only on the relevant metric and ignore the rest, since instruction-following at inference time can steer attention away from irrelevant tokens without changing the tool.
- **B)** Filter the tool's response so only the needed information enters the context.
- **C)** Call the monitoring API less frequently to reduce overall context growth, since fewer calls mean fewer large payloads and the total token budget is preserved for reasoning steps.
- **D)** Switch to a model with a larger context window to accommodate the full response, since a longer window means the irrelevant metrics occupy a smaller fraction of available capacity.

---

### Q10

A summarization pipeline condenses a legal document over several passes. Dates and monetary amounts have disappeared from the final summary.

Which statement explains this?

- **A)** The summary was truncated by `max_tokens` before the numerical content could be included, since token limits apply at the output boundary and the model fills prose before numbers.
- **B)** The model cannot reliably process date and currency formats in legal text, since these representations vary across jurisdictions and exceed the model's domain specialization.
- **C)** The document exceeded the maximum batch size for multi-pass summarization, causing the later passes to operate on an incomplete input that omitted the sections containing figures.
- **D)** Progressive summarization drops numerical detail; extract key data and re-inject it directly into the next prompt.

---

### Q11

A synthesis agent must report on a topic where the evidence is genuinely mixed.

Which output design is appropriate?

- **A)** Distinguish well-established findings from contested ones, noting where sources disagree.
- **B)** Report only the finding supported by the greatest number of sources consulted, since majority consensus across independent retrievals is the most defensible epistemic standard for automated synthesis.
- **C)** Report the average of the conflicting values as the best composite estimate, since averaging is a principled way to reduce variance when multiple independent measurements of the same quantity disagree.
- **D)** Report the finding from the source with the highest self-reported confidence score, since that score reflects the originating model's internal calibration and is the most direct proxy for reliability.

---

### Q12

Every request to the model must carry the full conversation, and the conversation keeps growing.

Which statement is accurate?

- **A)** Growth is capped automatically by the model once a safety threshold is reached, after which older messages are compressed in place to free capacity for new turns.
- **B)** The API stores conversation state server-side between calls, so the client only needs to send the latest user message and the model reconstructs the prior exchange from its session cache.
- **C)** Each request is stateless; summarizing or trimming the history is the mitigation.
- **D)** Only the most recent user message needs to be sent on each turn, since the model can reconstruct prior context from the continuation pattern in the new message alone.

---

### Q13

A coordinator receives a failure from one of five parallel subagents. The other four succeeded.

Which handling is most appropriate?

- **A)** Discard all five results and restart the pipeline from the beginning, since a partial result set introduces unknown selection bias into any synthesis built from it.
- **B)** Substitute the failed subagent's output with the most similar successful one to maintain coverage, since topical overlap between agents means a close neighbor can approximate the missing contribution.
- **C)** Record what is missing, synthesize from what succeeded, and state explicitly which portion could not be covered.
- **D)** Synthesize from the four successful results and omit any mention of the fifth, since noting a single failure draws disproportionate attention to a gap that represents only 20% of the planned scope.

---

### Q14

An engineer resumes a session from last week and asks the agent to continue. The agent proceeds confidently using assumptions that are now stale.

Which practice prevents this?

- **A)** Open the resumed session with a structured summary of what changed and direct the agent to re-read the affected files.
- **B)** Ask the agent whether anything in the codebase has changed since the last session, since the model can compare its internal representation of the project against the current file state and flag discrepancies.
- **C)** Run `/compact` to refresh the session state before continuing work, since compaction re-indexes the conversation against the current repository and surfaces any drift between them.
- **D)** Trust that resuming a session restores an accurate view of the current project state, since session metadata is checkpointed at the time of each save and reflects the file system at that moment.

---

### Q15

A team wants human review effort focused where it pays off. Their current rule reviews any extraction where the model reported confidence below 0.9.

Which improvement is most defensible?

- **A)** Raise the threshold to 0.99 so the system flags more documents for review, since a higher threshold is strictly more conservative and will never miss an error the lower threshold would have caught.
- **B)** Remove the confidence field entirely and route every extraction through human review, since eliminating automated triage removes the failure mode of misplaced confidence entirely.
- **C)** Combine confidence with objective signals — nulls in required fields, unfamiliar layouts, failed cross-field validations — rather than relying on the self-reported score alone.
- **D)** Lower the threshold to 0.7 so fewer documents consume reviewer time, since the saved capacity can be redirected to cases where reviewer judgment adds more value than the confidence score already captures.

---

### Q16

An agent working through a long refactor loses track of a constraint stated at the start: "do not change the public API."

Which mechanism most reliably keeps the constraint in force?

- **A)** Repeat the constraint once mid-session so it is fresher in the context window, since recency bias means a constraint stated closer to the current turn receives more weight during generation.
- **B)** Carry the constraint in a structured state object re-included in each prompt.
- **C)** Rely on auto-compaction to preserve all critical constraints from earlier in the session, since the compaction summary is designed to retain semantically important information like named restrictions.
- **D)** Instruct the agent to remember the constraint and treat it as permanent, since explicit instruction to preserve a rule is sufficient for the model to maintain it across arbitrarily long refactor sessions.

---

### Q17

A multi-agent system produces a report where one subagent's hallucinated statistic was accepted by the synthesis agent and presented as fact.

Which design reduces this risk?

- **A)** Run the synthesis step twice and compare outputs to identify inconsistencies, since divergence between two independent synthesis runs is a reliable signal that one of them incorporated a hallucination.
- **B)** Increase the number of research subagents so hallucinations are outvoted, since a majority-vote aggregation across many independent retrievals will statistically suppress any single agent's invention.
- **C)** Ask the synthesis agent to fact-check every claim against its own background knowledge, since the synthesis model has broader training coverage than any individual subagent and can detect implausible values.
- **D)** Require each finding to carry its source, so unsourced claims are visible during synthesis.

---

### Q18

A developer is 40 messages into a debugging session. The relevant context is the last 10 messages; the first 30 concern a different, resolved problem.

Which strategy fits?

- **A)** Fork the session into two branches so both problems remain accessible, since preserving the full history in a parallel branch ensures that decisions from the resolved problem can inform the current one if they turn out to be related.
- **B)** Continue and let the model weigh what is relevant from the full history, since attention mechanisms are trained to down-weight resolved threads and the model will naturally focus on the active debugging context.
- **C)** Clear the session entirely and rebuild the debugging context from scratch, since a clean slate eliminates any residual influence from the resolved problem and establishes an unambiguous starting point.
- **D)** Compact or trim the resolved portion, retaining selectively what still matters.

---

### Q19

A coordinator must decide whether a subagent failure is recoverable. The subagent reports: `{"error": "rate limited", "retryable": true}`.

Which response is appropriate?

- **A)** Escalate to a human immediately, since any subagent failure in a production pipeline represents a control-flow deviation that requires human confirmation before the coordinator proceeds.
- **B)** Mark the topic as having no findings so the pipeline can proceed without it, since rate-limited subagents have effectively returned a null result and blocking the pipeline on transient infrastructure is worse.
- **C)** Retry after a delay, since the error is marked transient.
- **D)** Abort the entire pipeline and report the failure upstream to the caller, since partial pipelines produce incomplete outputs that may be more misleading than no output at all.

---

### Q20

A team's agent handles a request whose correct answer depends on information the agent does not have and cannot obtain.

Which behavior is correct?

- **A)** Produce an answer with a generic disclaimer appended to signal uncertainty, since surfacing a best-effort response with a caveat gives the user something actionable even when the ideal information is unavailable.
- **B)** Refuse the request entirely and provide no further guidance, since any response built on missing information risks misleading the user more than a refusal would.
- **C)** State the limitation explicitly and escalate or ask rather than answering from assumption.
- **D)** Produce the most likely answer without qualification and let the user judge its accuracy, since users are better positioned than the agent to assess fit-for-purpose given their domain knowledge.

---

### Q21

An agent summarizing a 50-page report consistently uses content from the first and last few pages and underuses the middle.

Which mitigation applies?

- **A)** Prompt the model explicitly to pay closer attention to the middle sections, since instruction-following can override the positional bias in long contexts when the directive is stated prominently enough.
- **B)** Increase `max_tokens` on the response to give the model more room to draw from, since a longer output budget allows the model to include more of the middle content it would otherwise skip due to length constraints.
- **C)** Reverse the page order so the middle content appears closer to the end of the input, since the model's recency bias means the last tokens in the prompt receive more representational weight during generation.
- **D)** Process the document in sections rather than passing all 50 pages in one prompt.

---

### Q22

A research coordinator must produce a report where a reader can tell which claims are solid and which are provisional.

Which subagent output design supports this?

- **A)** A single overall confidence score summarizing the quality of the whole report, since an aggregate score allows the reader to calibrate their reliance on the report as a unit without needing to evaluate each claim independently.
- **B)** Prose summaries written in a cautious tone throughout to signal general uncertainty, since consistent hedging language trains readers to apply appropriate skepticism uniformly across all findings.
- **C)** A list of all sources consulted, placed at the end, with counts per subagent so the reader can assess whether each agent's contribution was supported by sufficient retrieval depth.
- **D)** Structured findings with a field for the strength or status of each claim and its source.

---

### Q23

A long-running agent session in Claude Code approaches the context limit while the developer is mid-task.

What does Claude Code do, and what can the developer do?

- **A)** The model switches to a larger context variant automatically to avoid interruption, using the reserved headroom to complete the current turn before transitioning to the extended window.
- **B)** The oldest messages are silently deleted with no summarization or warning, freeing capacity by discarding the beginning of the conversation on the assumption that recent turns are more relevant.
- **C)** Auto-compaction summarizes history using reserved headroom; the developer can also compact explicitly or clear the session.
- **D)** The session terminates automatically and the developer must restart it, with the prior conversation available only through manual transcript recovery.

---

### Q24

A subagent encounters a malformed document mid-batch. It cannot parse it.

Which behavior best serves the pipeline?

- **A)** Handle the failure locally, report the specific document and reason, and continue with the rest of the batch.
- **B)** Skip the document silently and proceed as if it had never been assigned, since a single malformed document is unlikely to affect aggregate pipeline results and reporting it adds noise to the coordinator's state.
- **C)** Substitute an empty record in place of the failed document to preserve batch size and keep downstream index alignment intact, flagging it with a low-confidence marker to indicate the slot is synthetic.
- **D)** Abort the batch entirely and escalate the failure to the coordinator for a decision, since processing a batch with a known gap could introduce inconsistencies that are harder to remediate than a clean restart.

---

### Q25

A team debates whether a research agent should return prose summaries or structured data to the synthesis step.

Which consideration should decide?

- **A)** Whichever format the subagent's model produces with lower latency, since synthesis quality depends on throughput at the research tier and format conversion can always be done cheaply at synthesis time.
- **B)** Structured data is always preferable because it is machine-readable and unambiguous, and any narrative nuance that prose captures can be encoded in string fields without loss of fidelity.
- **C)** What the downstream synthesis step needs — structured data where fields are aggregated, prose where narrative nuance matters.
- **D)** Prose is always preferable because it preserves context and narrative coherence, and synthesis agents trained on natural language output are better calibrated to combine prose findings than to join structured records.

---

### Q26

An agent's answer depends on a file it was told about ten thousand tokens ago, and it now misremembers the file's contents.

Which practice addresses this?

- **A)** Paste the full file again at the top of every new message in the session, since ensuring the file is always in the recency window eliminates positional degradation of file-based facts.
- **B)** Re-read the file at the point of use rather than relying on it in the conversation.
- **C)** Prompt the agent to recall the file's contents more carefully before answering, since explicit recall prompts activate stronger retrieval from the context window and reduce confabulation.
- **D)** Raise the model's temperature so it explores more diverse completions of the file, since higher temperature widens the sampling distribution and may surface the correct value that the greedy path missed.

---

### Q27

A support agent resolves 80% of contacts but the remaining 20% reach humans with no useful context, and handle time on those is high.

Which change has the largest effect on the escalated cases?

- **A)** A structured handoff protocol so the human receives context, attempted actions, and the blocking decision.
- **B)** Instruct the agent to write a longer and more detailed narrative summary before escalating, since a thorough written account gives the human agent the background needed to reconstruct the case without additional investigation.
- **C)** Give the agent more tools so fewer cases escalate in the first place, reducing the total escalated volume and therefore the aggregate handle-time impact even if individual case handling does not improve.
- **D)** Raise the agent's resolution target to 90% to shrink the escalation rate, redirecting investment to automation quality so that the cases that do reach humans are the hardest ones where human judgment is genuinely indispensable.

---

### Q28

A team's report aggregates findings from four subagents. Two of them cite the same underlying source, but the report presents the claim as independently corroborated.

Which design issue does this expose?

- **A)** The coordinator should have deduplicated findings by comparing text similarity before synthesis, since fuzzy matching across subagent outputs would surface near-identical phrasings that indicate common sourcing.
- **B)** The subagents should not have been run in parallel, since sequential execution would have allowed each agent to check prior agents' citations before adding its own, preventing duplicate source inclusion.
- **C)** Without source identifiers travelling with each finding, the synthesis cannot detect that two findings share one origin.
- **D)** The report should have cited fewer sources to avoid the appearance of false corroboration, since a smaller reference list is easier for reviewers to audit for overlap and therefore more honest in practice.

---

### Q29

An agent is asked a question whose answer it is uncertain about, and the cost of being wrong is high — a production deployment decision.

Which behavior matches good practice?

- **A)** Surface the uncertainty and what would resolve it, and route the decision to a human.
- **B)** Give the most likely answer confidently, since adding uncertainty hedges makes responses less actionable and shifts the cognitive burden to the caller without improving decision quality in time-sensitive contexts.
- **C)** Decline to answer any questions that touch production systems or deployment decisions, since the irreversibility of production actions places them categorically outside the scope of automated recommendation.
- **D)** Provide an answer paired with a numeric confidence score and let the caller bear the risk, since quantified uncertainty is more useful than refusal and the caller can apply their own threshold to decide whether to act.

---

### Q30

A pipeline's state is held entirely in the conversation. After compaction, the coordinator repeats work it had already completed.

Which fix addresses the cause?

- **A)** Increase the reserved compaction buffer so more history survives the summarization, since a larger buffer gives the compaction algorithm more tokens to work with and reduces the chance of dropping completed-step markers.
- **B)** Instruct the coordinator explicitly not to repeat work it has already done, since a persistent system-prompt rule constraining repetition will survive compaction and block re-execution of prior steps.
- **C)** Hold pipeline state in a structured object outside the conversation, and consult it to decide what remains.
- **D)** Disable compaction entirely so the full conversation history is always present, since the cost of a larger context is justified when pipeline integrity depends on the coordinator's ability to audit every prior step.

---

### Q31

An agent in a long session begins a new, unrelated task while the previous task's context is still present. Its answers mix concerns from both.

Which command fits?

- **A)** `/rewind`, to return to the start of the previous task and branch from there, preserving both task threads as independent timelines.
- **B)** `/compact`, to summarize the previous task and reduce its footprint in context, keeping a compressed record that can still be referenced if the two tasks turn out to be related.
- **C)** `/clear`, to reset the conversation while keeping project guidance in effect.
- **D)** `/resume`, to load a saved session from a different project checkpoint and continue from a clean task boundary without losing project-level configuration.

---

### Q32

A synthesis agent is given the instruction: "Resolve any conflicts by preferring the most specific data."

What does this provide?

- **A)** A stated, checkable rule for conflict resolution, so the synthesis does not resolve disagreements arbitrarily.
- **B)** A ranking of subagents by reliability that the synthesis can use when sources disagree, since specificity of data correlates with the retrieval precision of the agent that produced it.
- **C)** A mechanism for verifying whether each source's data is accurate and trustworthy, since more specific claims are narrower in scope and therefore easier to cross-validate against external references.
- **D)** A guarantee that conflicting data will not appear in the final synthesis output, since the rule provides a deterministic tiebreaker that always selects exactly one value from any set of disagreeing inputs.

---

### Q33

A team routes extractions to human review when any required field came back null.

Which characteristic makes this a reasonable signal?

- **A)** It correlates with document length, which is itself a proxy for extraction difficulty, and length-correlated signals are more stable across document types than model-internal confidence estimates.
- **B)** It catches every possible extraction error that could appear in the output, making it a complete quality gate that eliminates the need for any additional review signal.
- **C)** It is cheaper and faster to compute than a model-generated confidence score, and for high-volume pipelines the operational cost of confidence scoring often exceeds the value of the marginal precision it provides.
- **D)** It is an objective property of the output, not an estimate the model made about itself.

---

### Q34

An engineer must decide what a subagent should return to the coordinator: the full text of every document it read, or a condensed structured summary.

Which consideration is decisive?

- **A)** Full text is always safer because no information is lost in translation or summarization, and for high-stakes synthesis the coordinator should have access to the original record to adjudicate any dispute between subagent interpretations.
- **B)** Subagents should return what synthesis needs — condensed, structured, with provenance.
- **C)** The subagent should return whichever option is shorter in tokens, since minimizing coordinator context cost is the primary optimization target when subagents run in parallel and their outputs converge simultaneously.
- **D)** The coordinator can compact whatever it receives if the context grows too large, so the subagent's return format is a tunable parameter that can be adjusted reactively rather than fixed at design time.

---

### Q35

A long agent session has accumulated tool results, file contents, and reasoning. The developer wants to know what is consuming the context before deciding how to proceed.

Which step comes first?

- **A)** Switch to a larger-context model to gain headroom before diagnosing the problem, since additional capacity provides room to run diagnostic tools without risk of triggering compaction mid-diagnosis.
- **B)** Inspect the context breakdown by category to see what is consuming the window.
- **C)** Run compaction immediately to free space and then reassess what remains, since compaction is low-risk and getting under the limit restores the ability to run any diagnostic command without budget pressure.
- **D)** Clear the session entirely and start fresh with a focused prompt, since a targeted restart eliminates accumulation noise and restores predictable context growth from a known baseline.

---

### Q36

An agent reports: "I checked the logs and found no errors." In fact, the log query failed with a permissions error and returned nothing.

Which design failure does this illustrate?

- **A)** The agent should not have been granted access to the log system in the first place, since least-privilege design would have routed log inspection through a dedicated tool with controlled output formatting.
- **B)** The agent's context window was too small to hold the log query and its result, causing the result to be truncated before the error code was visible to the model.
- **C)** The log query should have been retried more times before the agent drew a conclusion, since transient permission errors can self-resolve and multiple attempts would have distinguished a persistent denial from a momentary one.
- **D)** The tool did not distinguish an access failure from a valid empty result, so the agent treated absence of evidence as evidence of absence.

---

### Q37

A team wants a subagent's deep exploration of a legacy module to inform the main session without flooding it with the exploration transcript.

Which approach fits?

- **A)** Run the exploration in the main session and compact afterwards to reduce the footprint, since compaction is designed to distill large exploration transcripts into their key findings with minimal information loss.
- **B)** Run the exploration in an isolated subagent and return only a structured conclusion.
- **C)** Run the exploration and paste into the main session only the parts that look relevant, since manual curation by the developer applies human judgment that automated summarization cannot replicate.
- **D)** Run the exploration in a separate terminal and summarize the output by hand before sharing it, since external summarization by a human editor produces higher-fidelity structured conclusions than automated subagent distillation.

---

### Q38

A report must state that a market-size figure comes from a vendor's own marketing page rather than an independent source.

Which finding schema supports this?

- **A)** A timestamp recording when the finding was produced by the subagent, since the recency of retrieval is a proxy for whether the source reflects the vendor's current claims or an outdated marketing position.
- **B)** Source metadata recording what kind of source it is, not just that one exists.
- **C)** A numerical confidence score attached to the figure itself, since a low score signals that the extracting model recognized the claim as potentially self-serving and down-weighted it accordingly.
- **D)** A boolean field marking the finding as verified or unverified, since a binary flag is sufficient to distinguish analyst-reviewed data from raw marketing claims for downstream filtering.

---

### Q39

An agent has been asked to make a change that could affect production data. It is confident in its plan.

Which practice applies?

- **A)** Ask the agent to review its own plan one more time to catch any errors before acting, since a second-pass self-review activates different reasoning paths and surfaces issues that the initial planning step may have missed.
- **B)** Route the action through human approval before execution; confidence is not authorization.
- **C)** Proceed, since the agent's high confidence indicates a low probability of error, and delaying irreversible actions for approval on every confident plan introduces latency that defeats the purpose of agentic automation.
- **D)** Proceed and log the action immediately afterward to create an audit trail, since after-the-fact logging provides accountability and allows rollback planning even when pre-execution approval is not required.

---

### Q40

A coordinator's five subagents each return findings in their own ad-hoc prose format. Synthesis quality varies unpredictably between runs.

Which change addresses the cause?

- **A)** Run the subagents sequentially so each can adapt its format to the previous output, since format convergence through chain-of-context propagation reduces variance more reliably than a top-down schema constraint.
- **B)** Ask the synthesis agent to normalize all five formats before combining them, since a dedicated normalization step by a capable model can handle format heterogeneity without requiring upstream agents to change their output.
- **C)** Use the same underlying model for all five subagents to reduce format variance, since a single model family produces more consistent structural patterns across independent runs than a heterogeneous model mix.
- **D)** Define a common output schema all subagents must return, so synthesis operates on uniform structures.

---

### Q41

A team is deciding what belongs in a sliding window of retained conversation versus what can be dropped.

Which retention policy is most defensible?

- **A)** Retain the most recent N messages regardless of their content or relevance, since recency is a conservative default that preserves the complete thread of the most recent task without requiring semantic classification.
- **B)** Retain the longest messages, since message length correlates with information density and longer messages are statistically more likely to contain the structured decisions and constraints the policy aims to preserve.
- **C)** Retain everything and trust the model to weigh what is relevant at inference time, since modern attention mechanisms are designed to down-weight outdated information and up-weight semantically relevant content dynamically.
- **D)** Retain decisions, constraints, and open questions; drop resolved exchanges and superseded tool output.

---

### Q42

A support agent escalates every case where the customer uses angry language.

Which criticism is valid?

- **A)** Sentiment is an unreliable escalation signal; routing should be based on what the agent could and could not resolve.
- **B)** The agent should offer an apology and de-escalation attempt before transferring the case, since reducing emotional intensity before handoff improves the human agent's starting position and shortens handle time.
- **C)** Accurate sentiment detection requires a dedicated sentiment analysis model, not a general-purpose agent, since a fine-tuned classifier trained on support transcripts will outperform a general model on edge cases and sarcasm.
- **D)** The agent should escalate more cases overall, not just those with angry language, since broader escalation reduces false-negative risk and the cost of over-escalation is lower than the cost of a missed critical case.

---

### Q43

A coordinator aggregates findings and must indicate that one area was investigated but produced nothing.

Which representation is correct?

- **A)** Report the area with a note that data was unavailable, without clarifying whether it was searched, since the distinction between "searched and empty" and "not searched" is a pipeline implementation detail that should not appear in user-facing reports.
- **B)** Report a placeholder finding with low confidence to mark the coverage attempt, since a low-confidence entry preserves the slot in the output schema and signals to downstream consumers that the area was attempted even if no content is available.
- **C)** Omit the area from the report so it does not create confusion for the reader, since a report that acknowledges gaps invites questions the coordinator cannot answer and may undermine the reader's confidence in the covered sections.
- **D)** Explicitly state the area was covered and returned no findings, distinct from areas never investigated.

---

### Q44

An engineer must decide how a multi-session codebase exploration records what it has learned.

Which storage choice best survives compaction and session boundaries?

- **A)** The conversation history of the longest-running session in the project, since the highest-volume session contains the most accumulated context and is least likely to have had critical findings compressed out.
- **B)** The summary generated by auto-compaction at the end of the previous session, since this is optimized by the compaction algorithm to retain the highest-value information from the session in the smallest token footprint.
- **C)** The developer's own notes kept outside the agent session, since human-curated notes are always more reliable than machine-generated summaries and survive any platform-level session management.
- **D)** A file in the repository that each session reads at the start and appends to as it learns.

---

### Q45

A synthesis step receives one finding stating a company has 500 employees and another stating 1,200, both from dated sources.

Which handling is correct?

- **A)** Average the two figures to produce a single consolidated estimate of 850, since averaging is a principled method for reconciling conflicting quantitative measurements when neither source can be independently verified.
- **B)** Present both with sources and dates, noting the discrepancy.
- **C)** Choose the larger figure as more likely to reflect the company's current size, since organizations generally grow over time and the higher number is the better forward-looking estimate absent other information.
- **D)** Omit the employee count from the report until a more reliable source is found, since publishing a range that spans 140% of the lower bound signals research failure rather than honest uncertainty.

---

### Q46

An agent working on a large migration must decide, at each step, which files to read.

Which approach manages context best?

- **A)** Load every file in the module at session start so nothing is missed during migration, since upfront loading eliminates the risk of mid-task context switches and ensures the full dependency graph is visible from the first step.
- **B)** Read the specific files the current step requires, guided by prior search.
- **C)** Read files in alphabetical order, proceeding through the list until the context is full, since alphabetical traversal provides a reproducible and bias-free coverage order when relevance ranking is unavailable.
- **D)** Rely on the agent's general knowledge of similar codebases to avoid reading files at all, since pattern-matched assumptions about naming conventions and module structure can fill most gaps without consuming context on file reads.

---

### Q47

A team observes that after auto-compaction, the agent occasionally repeats a question the user already answered.

Which explanation is correct?

- **A)** The agent's temperature setting is too high, causing it to vary its behavior unexpectedly and generate questions that a lower-temperature run would have suppressed given the same context.
- **B)** The user's answer was never received or acknowledged by the model in the original turn, meaning it was always absent from the context rather than present and later lost to compaction.
- **C)** Compaction summarizes history and can lose specific details; answers that must survive should be held in a durable structured form.
- **D)** Compaction preserves all session content verbatim, so if the agent is repeating a question it means the original answer was semantically identical to an unanswered state and compaction correctly omitted it.

---

### Q48

A human reviewer must decide quickly whether an extraction is trustworthy. The record contains only the extracted values.

Which addition helps most?

- **A)** Field-level ambiguity indicators and the source location each value was drawn from.
- **B)** A single overall quality grade for the extraction record as a whole, since a composite score allows the reviewer to triage the queue by grade before opening any record and concentrating attention on the lowest-scored items.
- **C)** The model version and parameters used to generate the extraction, since version-specific failure modes are known and the reviewer can apply version-aware heuristics to identify likely error patterns without reading the full document.
- **D)** The total processing time the document took to extract, since documents that took longer signal higher model uncertainty and a higher probability that the extraction required multiple internal revision passes.

---

### Q49

An agent is midway through a multi-step task when the user asks an unrelated question.

Which behavior best preserves reliability?

- **A)** Answer from the current task context without distinguishing the interruption from task work, since keeping all exchanges in a single thread simplifies context management and avoids the overhead of explicit state-saving.
- **B)** Decline the question and ask the user to wait until the current task is complete, since protecting the active task from context disruption is more important than responsiveness to ad-hoc queries.
- **C)** Set aside the current task entirely and address the new question from a clean state, since starting fresh for the interruption prevents cross-contamination of task context into the answer.
- **D)** Answer the question while keeping the task's state explicit, so the task can resume without the interruption displacing its context.

---

### Q50

A pipeline retries a failed subagent three times. Each attempt fails identically with a schema validation error on the same field.

Which conclusion is correct?

- **A)** The error is not transient; the identical failure indicates a deterministic input problem that requires escalation or input correction.
- **B)** The pipeline should mark the result as empty and continue so downstream steps are not blocked, since a consistently failing subagent has effectively returned null and the pipeline should treat it the same as a valid empty result.
- **C)** The retry count should be increased further to allow more attempts before giving up, since three retries is an arbitrary limit and a higher count may allow transient infrastructure issues to self-resolve between attempts.
- **D)** The subagent should be swapped for a different model that may handle the schema differently, since model-specific parsing behavior can resolve validation errors that are actually caused by format sensitivity rather than input invalidity.

---

### Q51

A research report cites a claim traced to a single blog post. The reader treats it with the same weight as a claim supported by three peer-reviewed papers.

Which design gap does this reveal?

- **A)** The report should have been shorter so weaker claims were excluded by length constraints, since a strict word limit forces the synthesis agent to prioritize the strongest evidence and naturally filters out low-confidence citations.
- **B)** The report cites too many sources, diluting the reader's ability to assess individual ones, since a smaller reference list would make the blog post conspicuous by contrast and prompt the reader to apply appropriate skepticism.
- **C)** The output does not distinguish well-established findings from weakly supported ones.
- **D)** The blog post should have been excluded automatically based on source type filtering rules, since a categorical filter applied at retrieval time is more reliable than relying on the synthesis agent to signal evidentiary weakness through report structure.

---

### Q52

A team wants to reduce the context cost of a research pipeline without losing coverage.

Which approach fits?

- **A)** Reduce the number of research threads so each one consumes less context overall, since fewer parallel threads lower the aggregate token budget required and the coverage reduction can be offset by deeper per-thread exploration.
- **B)** Isolate each research thread in its own subagent so the coordinator holds only the returned summaries.
- **C)** Instruct subagents to write shorter findings and omit supporting detail, since a tighter output constraint reduces coordinator context cost while preserving the topical coverage that the pipeline requires.
- **D)** Increase the coordinator's context window to accommodate the full research output, since a larger window eliminates the need to optimize subagent return formats and lets the coordinator work with richer raw data.

---

### Q53

An agent's tool returns a customer record with 200 fields. The agent needs the account tier and the billing status.

Which practice applies?

- **A)** Have the tool return the record in a more compact binary or compressed encoding, since reducing byte size per field lowers token consumption across the 200 fields and makes the full record fit within the agent's attention budget.
- **B)** Have the agent summarize the full record before proceeding with the task, since a model-generated summary of the 200 fields would distill the most relevant attributes and reduce context noise for subsequent reasoning steps.
- **C)** Have the tool return only the fields the agent's role requires.
- **D)** Have the agent proceed and mentally ignore the other 198 fields during reasoning, since large-context models are designed to attend selectively and will naturally focus on the two fields the task references.

---

### Q54

A synthesis agent is told: "You have received outputs from multiple agents. Combine them into a single coherent response."

What is missing for reliable handling of disagreement?

- **A)** A larger context window to hold all agent outputs simultaneously, since synthesis agents that cannot fit all inputs in a single pass must chunk the combination step and lose cross-agent comparison fidelity.
- **B)** An explicit conflict-resolution rule and an instruction to preserve genuine disagreement rather than collapsing it.
- **C)** A confidence score per agent so the synthesis can weight their contributions, since calibrated confidence scores allow the synthesis to perform a weighted average that reflects each agent's reliability rather than treating all inputs equally.
- **D)** More subagents to produce additional data points for each contested claim, since a larger evidence pool makes majority-voting more statistically reliable and reduces the impact of any single agent's error.

---

### Q55

A developer wants to know whether their session is near the point where compaction will trigger.

Which step applies?

- **A)** Estimate from the elapsed session time and the typical compaction interval, since session duration is a reliable proxy for token accumulation when the conversation involves a predictable mix of tool calls and reasoning steps.
- **B)** Inspect the token usage and remaining window, including the reserved compaction headroom.
- **C)** Continue working and wait for compaction to occur naturally as an observable event, since the compaction notification provides enough warning to save state before the summarization step begins.
- **D)** Count the number of messages in the transcript as a proxy for token usage, since message count is a consistent predictor of context consumption across session types and avoids the need for a separate inspection command.

---

### Q56

An extraction system's human review queue is overloaded. Analysis shows most reviewed documents were correct, and the errors that reached production came from documents the rule never flagged.

Which change is indicated?

- **A)** Re-derive the routing signal from what actually distinguished the failed documents, not from tuning the existing threshold.
- **B)** Increase review team capacity so the queue can process more documents per day, since throughput constraints are the proximate cause of the backlog and additional reviewers will clear it while the signal is refined in parallel.
- **C)** Remove human review entirely, since the data shows most reviewed documents were already correct and the review process is therefore consuming capacity without improving production quality.
- **D)** Lower the confidence threshold to flag more documents and widen the safety net, since the current threshold is demonstrably too narrow and a broader flag will eventually capture the document types that are currently reaching production with errors.

---

### Q57

A coordinator must decide whether a subagent's inability to find information means the information does not exist.

Which reasoning is correct?

- **A)** It cannot be concluded without knowing whether the search executed successfully and what scope it covered.
- **B)** The coordinator should delegate the judgment to the synthesis agent, which has broader context across all subagent outputs and is better positioned to assess whether the gap is a retrieval artifact or a genuine absence.
- **C)** If the subagent returned nothing, the information does not exist in the searched domain, since a well-scoped search that completes without results is the operational definition of confirmed absence.
- **D)** The coordinator should assume the information exists and re-delegate the search indefinitely, since repeated search attempts with different query formulations will eventually surface information that a single pass missed.

---

### Q58

A team wants their agent to be explicit when a conclusion rests on an assumption rather than on retrieved evidence.

Which output design supports this?

- **A)** A single confidence number attached to each conclusion in the report, since a calibrated score below a threshold communicates that the conclusion is assumption-based and lets the reader apply their own risk tolerance.
- **B)** A cautious and hedged writing style maintained consistently throughout all outputs, since uniform hedging ensures the reader never mistakenly treats an inferred conclusion as evidence-backed due to inconsistent tone.
- **C)** A blanket disclaimer placed at the end of every report noting that some conclusions may be inferred, since a single disclosure statement covers all inferences collectively and avoids cluttering the report body with per-claim markers.
- **D)** Explicit markers or separate fields distinguishing evidence-backed statements from inferred ones.

---

### Q59

A session's context is dominated by a large file the agent read early and no longer needs.

Which approach is most appropriate?

- **A)** Start a new session and re-establish all relevant context from scratch, since a clean session eliminates not only the stale file but also any other accumulated noise and restores predictable context growth.
- **B)** Continue working and accept the token cost of the stale file in context, since the overhead of session management and context reconstruction often exceeds the cost of carrying a single large file for the remainder of the session.
- **C)** Compact the session so the superseded content is summarized away.
- **D)** Re-read the file to refresh the agent's representation of its contents, since re-reading signals to the model that the file is still active and prevents attention mechanisms from down-weighting it as stale context.

---

### Q60

A multi-agent system must remain debuggable when a report turns out to be wrong. The team needs to trace which subagent produced the incorrect claim and from what source.

Which combination provides this?

- **A)** Structured findings with agent and source identifiers, flowing through a coordinator that every message passes through.
- **B)** A larger context window on the coordinator so it retains the full output of every subagent, since holding complete subagent transcripts in coordinator memory allows post-hoc inspection of the full reasoning chain for any claim.
- **C)** A post-hoc review of the final report by a second model trained to detect errors, since a specialized review model can attribute incorrect claims to their likely source by comparing the report's claims against known subagent reliability profiles.
- **D)** Verbose logging inside each subagent combined with direct subagent-to-subagent communication, since a richer local log and shorter message paths reduce latency and produce more granular debugging data than routing everything through a coordinator bottleneck.

---

**End of block — 60 questions.**
