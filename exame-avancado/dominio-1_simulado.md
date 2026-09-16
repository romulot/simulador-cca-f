# Exame Avançado — Bloco 1

**60 questions · multiple choice · one correct answer**

> Do not look at the answer key until you have finished the whole block.
> The domain and objective of each question are deliberately not shown.

---

### Q1

A team builds a support agent with the Anthropic SDK. Their loop ends when the assistant's text response contains the phrase "I have finished". In production the loop frequently exits before any refund is actually processed, because Claude writes "Let me look that up for you" and then emits a `tool_use` block that never runs.

What is the correct fix?

- **A)** Train a small classifier that decides, from the assistant's text, whether the turn is really complete.
- **B)** Add "Never write filler text before calling a tool" to the system prompt so the text check becomes reliable.
- **C)** Raise the maximum iteration count so the loop has more chances to reach the refund tool.
- **D)** Terminate the loop only when `stop_reason` is `end_turn`, and execute every `tool_use` block returned while `stop_reason` is `tool_use`.

---

### Q2

A research coordinator must gather the current stock price, the latest earnings summary, and recent analyst ratings for one company. None of the three depends on the others. The coordinator currently issues one tool call per turn and waits for each result before requesting the next.

What change most reduces total latency?

- **A)** Increase `max_tokens` so more work fits into each response.
- **B)** Merge the three tools into one tool that takes a ticker and returns everything.
- **C)** Switch the coordinator model from Sonnet to Opus so each turn resolves faster.
- **D)** Emit all three tool calls in a single assistant turn so they execute in parallel, then process the three `tool_result` blocks together.

---

### Q3

A coordinator spawns a `document-analyst` subagent with the prompt: "Analyze the documents we discussed and apply the same scoring rubric as before." The subagent replies that it cannot find any documents or rubric.

What is the underlying cause?

- **A)** The coordinator must call the subagent twice — once to load memory and once to do the work.
- **B)** The subagent's `allowedTools` list is missing the Read tool.
- **C)** The coordinator's context window filled up and evicted the earlier messages.
- **D)** Subagents run in an isolated context and inherit nothing from the coordinator, so every document reference and the full rubric must be written into the spawn prompt.

---

### Q4

A CI agent must never open a pull request before the full test suite has passed. The team added to `CLAUDE.md`: "IMPORTANT: always run tests before creating a PR." Over two weeks, three PRs were opened with failing tests.

Which approach guarantees the requirement?

- **A)** Ask the agent to confirm in its response that tests passed before it opens the PR.
- **B)** A `PreToolUse` hook on the PR-creation tool that checks a recorded test-pass state and blocks the call when it is absent.
- **C)** Give the PR tool a `tests_passed` boolean parameter that the agent fills in.
- **D)** Move the instruction to the top of `CLAUDE.md` and repeat it in the system prompt.

---

### Q5

A pipeline runs five subagents in sequence. It crashed after subagent three. On restart it re-ran all five from the beginning, discarding roughly forty minutes of completed work.

What design prevents this?

- **A)** Persist each subagent's structured output to durable storage keyed by step, and on restart skip any step whose output already exists.
- **B)** Run all five subagents in parallel so a crash affects only one of them.
- **C)** Ask the coordinator to summarize progress after each step so it can describe what was done.
- **D)** Increase the retry count on each subagent so transient failures do not reach the pipeline level.

---

### Q6

An engineer asks an agent to "research the electric vehicle market." The coordinator decomposes this into three subtasks: battery technology, major manufacturers, and EV sales figures. The final report never mentions charging infrastructure, government subsidies, or supply chain constraints.

Which statement best explains the failure?

- **A)** The synthesis step discarded the missing topics because they had low confidence scores.
- **B)** The coordinator used parallel execution when sequential execution was required.
- **C)** The subagents shared a context window and overwrote each other's findings.
- **D)** The decomposition was too narrow, and because each subagent sees only its own isolated context, none of them could flag the missing dimensions.

---

### Q7

A coordinator prompt reads: "Step 1: call the search agent. Step 2: call the analysis agent. Step 3: call the report agent." When the search agent returns nothing useful, the coordinator still calls the analysis agent, which produces an empty analysis, and the report agent writes a report about nothing.

Which change best addresses this?

- **A)** Add a fourth step instructing the coordinator to check the search results.
- **B)** Give the coordinator a goal and quality criteria, letting it decide which agents to invoke and re-delegate when coverage is insufficient.
- **C)** Increase the search agent's timeout so it has more time to find results.
- **D)** Reorder the steps so analysis runs before search.

---

### Q8

A developer wants a subagent that reviews code and must not be able to modify files or run shell commands, regardless of what its prompt says.

Which configuration enforces this?

- **A)** Run the subagent in plan mode so its edits are queued rather than applied.
- **B)** Set the subagent's model to Haiku, which cannot perform write operations.
- **C)** Define the subagent with an `allowedTools` list containing only Read, Grep, and Glob, so the restriction is applied at the platform level.
- **D)** Write "You are a read-only reviewer. Never edit files." in the subagent's system prompt.

---

### Q9

A team member resumes yesterday's session with `claude --resume` and immediately asks, "Continue where we left off with the migration." The agent proposes changes to files that a colleague already rewrote overnight.

What should the engineer do?

- **A)** Rely on the agent detecting the drift on its own once it opens the files.
- **B)** Provide a structured summary of what changed since the last session and ask the agent to re-read the affected files, because the agent has no awareness of elapsed time or external changes.
- **C)** Run `/compact` so the agent's summary of prior work is refreshed from the repository.
- **D)** Start a brand-new session, since resumed sessions cannot read files reliably.

---

### Q10

An investigation agent must explore a production incident. The team does not know in advance how deep the investigation will go: each finding may raise new questions.

Which orchestration pattern fits?

- **A)** Dynamic adaptive decomposition, where each finding reshapes which subtasks are generated next.
- **B)** A single agent with a very large context window and no subagents.
- **C)** Prompt chaining with a fixed sequence of five stages.
- **D)** Parallel execution of the same investigation prompt across five agents, keeping the best result.

---

### Q11

Three research subagents are all given the brief "research renewable energy adoption." The final report contains the same three statistics repeated in different wording, and token spend was triple the estimate.

What is the correct fix?

- **A)** Lower each subagent's `max_tokens` so they produce shorter answers.
- **B)** Partition the scope so each subagent owns a distinct, non-overlapping slice of the problem.
- **C)** Reduce the number of subagents from three to one.
- **D)** Add a deduplication step that removes repeated sentences from the final report.

---

### Q12

A coordinator aggregates subagent results once and returns the report. Reviewers consistently find gaps that a second round of research would have closed.

Which mechanism most reliably closes those gaps?

- **A)** An instruction telling the coordinator to "be thorough and make sure nothing is missing."
- **B)** A refinement loop where the coordinator calls an `evaluate_coverage` tool that must return a score and an explicit gap list in structured output before the loop may continue.
- **C)** Doubling the number of subagents in the first pass.
- **D)** Asking the report agent to state its confidence at the end of the report.

---

### Q13

An agent team wants to explore three competing refactoring strategies starting from the same completed analysis, without any branch contaminating the others.

Which approach fits?

- **A)** Run `/clear` between strategies so each one starts clean.
- **B)** Fork the session at the end of the analysis into three independent sessions, each with its own id and resumable history.
- **C)** Run the three strategies sequentially in the same session and use `/rewind` between them.
- **D)** Ask the agent to keep the three strategies mentally separate within one conversation.

---

### Q14

A coordinator was configured to delegate, but at runtime it performs all the work itself and never invokes a subagent. The `AgentDefinition` objects exist and the system prompt says "delegate each subtask."

Which cause should be investigated first?

- **A)** Whether the subagents were defined before the coordinator in the source file.
- **B)** Whether the subagents' system prompts are long enough to describe their roles.
- **C)** Whether the coordinator's `max_tokens` is high enough to hold subagent results.
- **D)** Whether the Agent tool is actually present in the coordinator's available tools, since without it there is no mechanism to spawn anything.

---

### Q15

In a multi-agent system, subagents call each other directly whenever they need data. Debugging a wrong final answer requires reading logs from five processes, and errors surface in different formats depending on which agent failed.

Which architectural change fixes this?

- **A)** Add structured logging to each subagent while keeping the direct connections.
- **B)** Give every subagent a copy of the full conversation history.
- **C)** Merge all five subagents into one agent with all the tools.
- **D)** Route every message through a coordinator in a hub-and-spoke topology, making it the single choke point for routing, context sharing, and error handling.

---

### Q16

A team caps their agentic loop at 10 iterations and treats reaching the cap as "task complete." Complex tasks are silently truncated mid-work, and simple tasks keep looping after Claude has already produced a final answer.

What is the correct design?

- **A)** Remove the cap entirely and rely on the agent to stop.
- **B)** Have the agent report a percentage-complete estimate each iteration and stop at 100%.
- **C)** Raise the cap to 50 so complex tasks fit.
- **D)** Use `stop_reason` as the control mechanism and keep the iteration cap only as a safety backstop against runaway loops.

---

### Q17

A refactoring request touches 40 files and carries real risk of breaking the build. A senior engineer must approve the approach before any file is modified.

Which Claude Code mode fits?

- **A)** `acceptEdits`, so the engineer reviews the diff after the edits land.
- **B)** Direct execution followed by `/rewind` if the result is wrong.
- **C)** `bypassPermissions`, with the engineer watching the terminal.
- **D)** Plan mode, where Claude analyzes the codebase and presents an approach but cannot modify files or execute commands until the plan is approved.

---

### Q18

A support agent has exhausted its tools and must escalate a billing dispute to a human. Today it hands off with the message: "Customer is upset about a charge, please help." Agents receiving these escalations spend several minutes reconstructing the case.

What should the agent send instead?

- **A)** The complete raw conversation transcript.
- **B)** A structured handoff package containing the customer record, the actions already attempted with their results, the specific blocker, and what the human needs to decide.
- **C)** A confidence score indicating how certain the agent is that escalation is needed.
- **D)** A shorter summary, so the human reads it faster.

---

### Q19

A subagent's file-read tool fails once with a transient network error. The subagent immediately reports the failure to the coordinator, which aborts the entire research pipeline.

Which failure-handling design is better?

- **A)** The subagent retries locally, tries a fallback, and propagates to the coordinator only what it could not resolve itself.
- **B)** The coordinator ignores subagent errors and synthesizes from whatever arrived.
- **C)** The coordinator catches the failure and restarts the whole pipeline from step one.
- **D)** The subagent returns an empty result so the pipeline continues uninterrupted.

---

### Q20

A document-processing workflow always performs the same four steps — extract, normalize, validate, store — regardless of the document's content.

Which pattern is appropriate?

- **A)** A coordinator that decides at runtime which of the four steps to run.
- **B)** Dynamic adaptive decomposition, so the system can react to each document.
- **C)** Prompt chaining, a fixed sequential pipeline, because the shape of the work does not change with the input.
- **D)** Parallel execution of all four steps to minimize latency.

---

### Q21

An engineer writes a coordinator prompt: "You are a coordinator. Use your judgment: simple factual questions use a single agent; multi-step tasks delegate sequentially, passing results forward; independent subtasks delegate in parallel."

What does this prompt primarily achieve?

- **A)** It guarantees that the coordinator will never call more than one subagent.
- **B)** It lets the coordinator select the orchestration shape at runtime based on query complexity, instead of running a full pipeline every time.
- **C)** It enforces at the platform level which tools each subagent may use.
- **D)** It removes the need for the coordinator to aggregate results.

---

### Q22

A team runs the complete six-agent research pipeline for every incoming query, including questions like "What year was the company founded?" Cost per query is far above budget.

What is the correct change?

- **A)** Have the coordinator select only the agents that add value for the given query, using a single agent for simple factual questions.
- **B)** Switch every agent to Haiku to cut the per-token cost.
- **C)** Cache the results of the six-agent pipeline keyed by query string.
- **D)** Reduce each agent's context window so it processes less data.

---

### Q23

A subagent is defined with a `description` field of "Handles stuff." The coordinator frequently invokes the wrong subagent.

What is the role of `description` in an `AgentDefinition`?

- **A)** It controls which tools the subagent is allowed to call.
- **B)** It is injected as the subagent's system prompt at spawn time.
- **C)** It is what the coordinator reads when deciding whether to invoke this agent, so it must state the agent's purpose and boundaries precisely.
- **D)** It is shown to the end user in the CLI output.

---

### Q24

During a long Claude Code session the engineer wants to branch off and try a risky approach, while keeping the ability to return to the current conversation untouched.

Which capability matches?

- **A)** Forking the session, which creates a new session id while preserving the conversation history up to that point and leaves the original intact.
- **B)** `/clear`, which resets the conversation but keeps `CLAUDE.md`.
- **C)** `--continue`, which opens a second copy of the current session.
- **D)** `/compact`, which summarizes the conversation so the risky path has room.

---

### Q25

An orchestration reads: coordinator → search agent → analysis agent → report agent, where each stage consumes the previous stage's output.

Which execution mode is required?

- **A)** Fork-based, because each agent needs its own session id.
- **B)** Hub-and-spoke with direct subagent-to-subagent messaging.
- **C)** Parallel, because all three agents are independent workers.
- **D)** Sequential, because each stage depends on the output of the one before it.

---

### Q26

A team wants to know why their coordinator sometimes produces reports missing entire topics. They cannot see which subagent received which brief or which one returned nothing.

Which property of hub-and-spoke addresses this?

- **A)** Because every message, result, and error passes through the coordinator, it is a single inspectable point for observability and control.
- **B)** Because subagents share one context window, all their activity is visible in a single transcript.
- **C)** Because subagents may talk to each other, failures are contained locally.
- **D)** Because the coordinator runs the same model as the subagents, their reasoning is identical.

---

### Q27

An agent receives `stop_reason: "tool_use"` with a request to call `lookup_order`. The program executes the function and gets back the order data.

What must the program do next?

- **A)** Start a new conversation with the order data in the system prompt.
- **B)** Append the output as a plain text user message describing the result.
- **C)** Append the function's output to the conversation as a message containing a `tool_result` block, then call the API again.
- **D)** Return the output directly to the end user, because the loop has ended.

---

### Q28

A pipeline coordinator must decide between two designs for delegating to a code-search subagent:

Design A: "Search for files containing `processPayment`, then read each one, then list the line numbers."
Design B: "Find every place where payment processing happens. Report file paths, line numbers, and a one-line description of each. Cover the whole repository, including tests."

Which statement is correct?

- **A)** Design B is goal-oriented with quality criteria, letting the subagent adapt its search strategy while the coordinator still controls what a complete answer looks like.
- **B)** Design A is better because it removes all ambiguity about the steps.
- **C)** Design B will produce inconsistent results because it does not fix the tool sequence.
- **D)** Both designs are equivalent because the subagent chooses its own tools anyway.

---

### Q29

A team notices their coordinator invents subtasks that the available subagents cannot perform, then reports failure.

Which control catches weak decomposition before work begins?

- **A)** A post-hoc check during result aggregation only.
- **B)** A longer system prompt listing every possible subtask in advance.
- **C)** A validation tool that reviews the proposed task list against coverage requirements before any subagent is delegated to.
- **D)** A higher iteration cap so the coordinator can retry until something works.

---

### Q30

An engineer kills a Claude Code session in the IDE and wants to pick it back up later exactly where it stopped.

What does Claude Code provide?

- **A)** A session id that can be used with `/resume` (or `claude --resume`) to restore the conversation history.
- **B)** An automatic replay of the last ten tool calls on next startup.
- **C)** A `.claude/session.md` file written to the repository root.
- **D)** Nothing — killed sessions are always lost.

---

### Q31

A coordinator receives outputs from a research agent, a writing agent, and a review agent. Two of them disagree about a product's release date.

Which aggregation instruction is most appropriate?

- **A)** "Discard any finding that another agent contradicts."
- **B)** "Return all three outputs concatenated so the reader can decide."
- **C)** "Combine them into a single coherent response. Resolve any conflicts by preferring the most specific data."
- **D)** "Ask the agent with the highest self-reported confidence to arbitrate."

---

### Q32

A team wants each of three subagents — searcher, analyst, writer — to be structurally unable to perform the others' jobs.

Which combination of `AgentDefinition` fields carries that enforcement?

- **A)** `allowedTools` and `disallowedTools`, which are enforced at the platform level rather than by instruction.
- **B)** The model alias assigned to each agent.
- **C)** `name` and `description`, which tell the coordinator what each agent is for.
- **D)** The system prompt alone, since it defines the agent's identity and operating rules.

---

### Q33

An agent processing a customer request calls `get_customer`, then `lookup_order`, then decides it has enough information and writes a reply. The API response for the final turn carries `stop_reason: "end_turn"`.

What does this indicate?

- **A)** The agent ran out of tokens before finishing.
- **B)** The agent has decided to return a result to the caller, and the loop should terminate.
- **C)** The agent is waiting for the user to confirm before continuing.
- **D)** The agent wants to call another tool but lacks permission.

---

### Q34

A multi-agent pipeline passes findings between agents as one large blob of prose. The synthesis agent produces a report where no claim can be traced to a source.

What is the root cause?

- **A)** The synthesis agent's context window was too small to hold all findings.
- **B)** The synthesis agent lacked a web-search tool to verify claims.
- **C)** The subagents were run in parallel instead of sequentially.
- **D)** Raw text passing loses attribution, because content and metadata do not travel together.

---

### Q35

A coordinator spawns four subagents to review four independent modules. The team wants wall-clock time to be roughly that of one review, not four.

Which instruction achieves this?

- **A)** Merge the four modules into one review task for a single subagent.
- **B)** Fork the session four times and run each review in a separate terminal manually.
- **C)** Instruct the coordinator to run the four subagents concurrently, since the tasks share no dependencies.
- **D)** Instruct the coordinator to run them sequentially but with a shorter prompt each.

---

### Q36

An engineer notices that after a subagent finishes, the coordinator cannot inspect what happened inside the subagent's loop — only its final output is visible.

Which statement is accurate?

- **A)** The coordinator can always replay a subagent's internal steps from shared memory.
- **B)** The coordinator inherits the subagent's context automatically when the subagent finishes.
- **C)** Each subagent runs its own loop in an isolated context, so the coordinator sees the returned result rather than the internal steps; what must be visible has to be part of the subagent's output.
- **D)** Subagent internals are visible only when the subagents run sequentially.

---

### Q37

A workflow must guarantee that a database migration is never applied before a backup tool has run successfully in the same session.

Which implementation satisfies "structurally impossible to skip"?

- **A)** A post-migration check that reports whether a backup existed.
- **B)** Ordering the tools in the system prompt so backup appears first.
- **C)** A tool description on the migration tool stating that backup must run first.
- **D)** A prerequisite gate implemented as a hook that fires before the migration tool and blocks it unless the recorded backup state is present.

---

### Q38

A team is choosing between a fixed three-stage pipeline and an adaptive plan for a security audit where each vulnerability found may require investigating different subsystems.

Which statement correctly distinguishes them?

- **A)** A fixed plan is preferable because it is easier to observe.
- **B)** An adaptive plan is simply a fixed plan with more stages.
- **C)** An adaptive plan requires all subagents to share one context window.
- **D)** An adaptive plan treats each finding as a signal that reshapes what to do next, while a fixed plan executes the same stages regardless of what is discovered.

---

### Q39

A coordinator agent's prompt says: "When given a task, break it into subtasks and delegate each one using the available tools. Do not do the work yourself."

Which part of the task lifecycle does this prompt address?

- **A)** Task decomposition and delegation, leaving aggregation to a later instruction.
- **B)** Tool permission enforcement for each subagent.
- **C)** Session persistence across restarts.
- **D)** Result aggregation and conflict resolution.

---

### Q40

An engineer wants a slash command for deep dependency analysis to run without polluting the main session's context, because its output is long and only the conclusion matters.

Which configuration achieves this?

- **A)** Wrap the command's output in a collapsed markdown block.
- **B)** Run the command with a smaller model so it produces less text.
- **C)** Set `context: fork` in the command's frontmatter so it executes in an isolated subagent context.
- **D)** Add `/clear` at the end of the command body.

---

### Q41

After resuming a week-old session, an engineer wants the agent to re-analyze only the files that changed since the session ended, not the whole module.

Which approach is most efficient and reliable?

- **A)** Run `/compact` so the agent regenerates its understanding of the codebase.
- **B)** Ask the agent to re-read every file in the module to be safe.
- **C)** Inject the list of changed files into the resumed session and instruct the agent to re-read those specific files before continuing.
- **D)** Trust the agent's stored summary of the module from the earlier session.

---

### Q42

A team must decide between having the coordinator run a single subagent, a sequential chain, or parallel subagents. The incoming query is: "Compare the privacy policies of these four vendors and flag conflicts with our data retention rules."

Which structure best satisfies coverage and latency?

- **A)** A single agent reading all four policies in one context, to avoid coordination overhead.
- **B)** Four parallel subagents, one per vendor policy, followed by a synthesis step that compares them against the retention rules.
- **C)** A sequential chain where each agent reads one policy and passes it forward.
- **D)** Four parallel subagents each given the same brief covering all four vendors.

---

### Q43

A subagent is spawned with `allowedTools: ["Read", "Grep", "Glob"]` but its prompt instructs it to "run the test suite and report failures." At runtime the subagent reports that it cannot complete the task.

What is the correct diagnosis?

- **A)** `allowedTools` is advisory, so the real problem is the model choosing not to comply.
- **B)** The subagent's prompt requires a capability its tool permissions exclude — the task needs Bash, which was not granted.
- **C)** Grep can run shell commands, so the issue is the subagent's system prompt wording.
- **D)** The coordinator failed to pass the test file paths.

---

### Q44

A long-running agent pipeline writes intermediate findings only into the conversation history. After a context compaction, the coordinator re-delegates work that had already been completed.

Which fix addresses the root cause?

- **A)** Disable auto-compaction so history is never summarized.
- **B)** Instruct the coordinator to remember what it has already delegated.
- **C)** Persist findings in a structured state object outside the conversation, and have the coordinator read that state to decide what remains.
- **D)** Increase the model's context window by switching to a 1M-token variant.

---

### Q45

An engineer is told that "Task" and "Agent" appear interchangeably in code samples and documentation for spawning subagents.

Which statement is accurate?

- **A)** Task is the legacy name for the tool now called Agent; both refer to spawning a subagent with its own isolated context, system prompt, and tool set.
- **B)** Task spawns a subagent while Agent defines one without spawning it.
- **C)** Task runs synchronously and Agent always runs in the background.
- **D)** They are different tools: Task manages the todo list, Agent spawns subagents.

---

### Q46

A support agent is told: "Never issue a refund above $500 without escalating." Logs show it issued a $900 refund because the customer was persistent.

Which mechanism makes the limit reliable?

- **A)** A gate in front of the refund tool that rejects any call above the threshold, independent of what the model decided.
- **B)** Adding a few-shot example showing a refused $900 refund.
- **C)** Restating the rule in bold at the start and end of the system prompt.
- **D)** Lowering the model's temperature so it follows instructions more strictly.

---

### Q47

Three subagents return findings. The coordinator must produce a report where each claim can be traced to the agent and source that produced it.

Which subagent output design supports this?

- **A)** Raw tool output forwarded verbatim from each subagent.
- **B)** Structured objects carrying the claim together with its source metadata — identifier, source url or document, and confidence — rather than prose.
- **C)** Long prose summaries, since they read more naturally in the final report.
- **D)** A single confidence number per subagent covering all of its findings.

---

### Q48

A coordinator must handle a task whose scope is unknown until work begins: "Find every reason our checkout conversion dropped last month."

Which decomposition strategy is appropriate?

- **A)** Run the same broad brief across five agents and pick the longest answer.
- **B)** Generate subtasks dynamically as findings arrive, stopping when new investigation produces no new signal.
- **C)** Fix a list of ten subtasks up front and run all of them.
- **D)** Run one subagent with a very long prompt covering every hypothesis.

---

### Q49

An engineer wants Claude Code to analyze a proposed architecture change without touching any file or running any command, then present the approach for approval.

Which permission mode matches?

- **A)** `plan`
- **B)** `dontAsk`
- **C)** `bypassPermissions`
- **D)** `acceptEdits`

---

### Q50

After a crash, a pipeline resumes and must not redo completed work. The team debates whether resumption state should live in the conversation transcript or in an external store.

Which reasoning is correct?

- **A)** State should live in the system prompt, which is re-sent on every request.
- **B)** Conversation history is sufficient, because resumed sessions restore it in full.
- **C)** Either works, since compaction preserves all tool results verbatim.
- **D)** External durable state is required, because conversation history can be compacted or truncated and is not a reliable record of completed steps.

---

### Q51

A coordinator is instructed: "You have received outputs from multiple agents. Combine them into a single coherent response."

Which stage of the coordinator's lifecycle is this?

- **A)** Agent selection.
- **B)** Result aggregation.
- **C)** Tool permission scoping.
- **D)** Task decomposition.

---

### Q52

A team observes that when subagents run in parallel, they cannot watch what each internal loop is doing while it runs, which makes mid-flight debugging hard.

Which mitigation is appropriate?

- **A)** Increase the coordinator's iteration cap.
- **B)** Switch to sequential execution permanently.
- **C)** Require each subagent to return a structured record of the steps it took alongside its findings, so the coordinator has an inspectable trace after the fact.
- **D)** Give subagents direct channels to each other so they can report progress.

---

### Q53

An engineer creates a subagent whose system prompt is empty and whose description reads "general helper." The coordinator invokes it for tasks ranging from writing code to summarizing PDFs, with inconsistent quality.

What is the design error?

- **A)** The agent needs a larger context window.
- **B)** The coordinator should invoke it more often so it learns the pattern.
- **C)** The `AgentDefinition` fails to constrain the agent to a designated role, so neither the coordinator's selection nor the agent's behavior is bounded.
- **D)** The agent's tools should be expanded so it can handle any task.

---

### Q54

A team wants to verify that a coordinator's decomposition covered everything before the final report ships.

Where can this check be placed, according to the coordinator lifecycle?

- **A)** Either before delegation, via a review tool on the proposed task list, or during aggregation, as a gap check before producing the answer.
- **B)** Only inside each subagent, since they know their own scope.
- **C)** Only in the user's follow-up question.
- **D)** Only at the API level, via `stop_reason`.

---

### Q55

An engineer resumes a session and the agent confidently continues from an assumption that was true last Tuesday but is now stale.

Which statement explains the risk?

- **A)** Resuming a session always reloads the current state of every file referenced earlier.
- **B)** Sessions expire after 24 hours, so the agent should have refused to resume.
- **C)** Claude has no awareness of elapsed time or of changes made outside the session, so resumed context can be silently stale.
- **D)** The agent's confidence score would have flagged the staleness if it had been enabled.

---

### Q56

A coordinator delegates to a subagent and needs the subagent's answer before it can proceed. Elsewhere in the same workflow, it fires three independent subagents whose results it collects later.

Which statement describes this correctly?

- **A)** Subagents always block the parent, so parallelism must be implemented outside the agent framework.
- **B)** Subagents always run in the background and the parent can never block.
- **C)** The parent may block while waiting for a subagent, or spawn several and parallelize; both patterns are supported and the choice depends on whether a dependency exists.
- **D)** Parallel subagents automatically share their partial results with each other.

---

### Q57

A team implements a `PostToolUse` hook after their deployment tool. What is the most appropriate use of that hook?

- **A)** Rewriting the deployment tool's input parameters before execution.
- **B)** Blocking the deployment when prerequisites are missing.
- **C)** Choosing which model the agent uses for the next turn.
- **D)** Recording the result and updating workflow state after the tool ran, so later gates can check what has been completed.

---

### Q58

A research system's coordinator is the only component that talks to the outside world; subagents receive briefs and return findings. A security reviewer asks how the team controls what information crosses trust boundaries.

Which answer is correct?

- **A)** Information flow is controlled by the model's system prompt in each subagent.
- **B)** The coordinator is the single point where every message in and out passes, so information-flow policy can be enforced and inspected there.
- **C)** Each subagent enforces its own policy, since it knows its own scope best.
- **D)** Trust boundaries are enforced by the size of each subagent's context window.

---

### Q59

A team must choose between plan mode, direct execution, and a multi-phase workflow for: renaming a single private helper function used in two files, with tests covering both.

Which choice is proportionate?

- **A)** A forked session per file, to isolate the changes.
- **B)** Plan mode, because every change should be approved first.
- **C)** A multi-phase workflow with a dedicated review agent.
- **D)** Direct execution, because the scope is small, the risk is low, and tests verify the result.

---

### Q60

An agent's loop is implemented so that whenever the API response contains any text block, the program returns that text to the user and stops.

What behavior will this produce?

- **A)** The loop will frequently exit before executing tool calls, because Claude often emits text alongside a `tool_use` block in the same response.
- **B)** The loop will never terminate, because text always accompanies tool calls.
- **C)** The loop will terminate only when the model reaches its iteration cap.
- **D)** The loop will behave correctly, since text only appears on the final turn.

---

**End of block — 60 questions.**
