# Exame Avançado — Bloco 1

**60 questions · multiple choice · one correct answer**

> Do not look at the answer key until you have finished the whole block.
> The domain and objective of each question are deliberately not shown.

---

### Q1

A team builds a support agent with the Anthropic SDK. Their loop ends when the assistant's text response contains the phrase "I have finished". In production the loop frequently exits before any refund is actually processed, because Claude writes "Let me look that up for you" and then emits a `tool_use` block that never runs.

What is the correct fix?

- **A)** Train a small classifier on the assistant's text output to detect completion intent, since stop_reason is unreliable when the model mixes prose and tool calls in the same response turn.
- **B)** Add "Never write filler text before calling a tool" to the system prompt so the text check becomes reliable, ensuring the phrase only appears when work is actually done.
- **C)** Raise the maximum iteration count so the loop has more chances to reach the refund tool before the session ends.
- **D)** Check `stop_reason`: execute tool blocks on `tool_use`, exit only on `end_turn`.

---

### Q2

A research coordinator must gather the current stock price, the latest earnings summary, and recent analyst ratings for one company. None of the three depends on the others. The coordinator currently issues one tool call per turn and waits for each result before requesting the next.

What change most reduces total latency?

- **A)** Increase `max_tokens` so more work fits into each response, reducing the number of turns the coordinator needs to complete all three lookups.
- **B)** Merge the three tools into one that takes a ticker and returns all data in a single call, eliminating the need to coordinate separate results in a later turn.
- **C)** Switch the coordinator model from Sonnet to Opus so each turn resolves faster and the model reasons about parallel opportunities on its own.
- **D)** Emit all three tool calls in a single assistant turn so they execute in parallel, then process the results together.

---

### Q3

A coordinator spawns a `document-analyst` subagent with the prompt: "Analyze the documents we discussed and apply the same scoring rubric as before." The subagent replies that it cannot find any documents or rubric.

What is the underlying cause?

- **A)** The coordinator must call the subagent twice — once to load memory and once to do the work, since subagents require an initialization phase before accepting task prompts.
- **B)** The subagent's `allowedTools` list is missing the Read tool, so it cannot access any files even if the paths were provided in the spawn prompt.
- **C)** The coordinator's context window filled up and evicted the earlier messages, so the references to documents and rubric were silently dropped before the spawn call was made.
- **D)** Subagents inherit nothing from the coordinator; documents and rubric must be in the spawn prompt.

---

### Q4

A CI agent must never open a pull request before the full test suite has passed. The team added to `CLAUDE.md`: "IMPORTANT: always run tests before creating a PR." Over two weeks, three PRs were opened with failing tests.

Which approach guarantees the requirement?

- **A)** Ask the agent to confirm in its response that tests passed before it opens the PR, creating a self-verification step the agent must complete before proceeding.
- **B)** A `PreToolUse` hook on the PR-creation tool that checks recorded test-pass state and blocks the call when absent.
- **C)** Give the PR tool a `tests_passed` boolean parameter that the agent must fill in before calling, so the system has an explicit record of the agent's claim.
- **D)** Move the instruction to the top of `CLAUDE.md` and repeat it in bold in the system prompt so the model sees it twice on every request.

---

### Q5

A pipeline runs five subagents in sequence. It crashed after subagent three. On restart it re-ran all five from the beginning, discarding roughly forty minutes of completed work.

What design prevents this?

- **A)** Persist each subagent's output to durable storage keyed by step; on restart, skip any step that already has a stored result.
- **B)** Run all five subagents in parallel so a crash only affects one lane and the others can still complete their work independently.
- **C)** Ask the coordinator to summarize progress after each step inside the conversation so it can describe what was done when restarted.
- **D)** Increase the retry count on each subagent so transient failures are absorbed locally without escalating to a full pipeline restart.

---

### Q6

An engineer asks an agent to "research the electric vehicle market." The coordinator decomposes this into three subtasks: battery technology, major manufacturers, and EV sales figures. The final report never mentions charging infrastructure, government subsidies, or supply chain constraints.

Which statement best explains the failure?

- **A)** The synthesis step discarded the missing topics because they had low confidence scores and the aggregation logic was set to prefer high-confidence findings only.
- **B)** The coordinator used parallel execution when sequential execution was required, which prevented each subagent from building on the others' discoveries.
- **C)** The subagents shared a context window and overwrote each other's findings, causing the topics assigned to later agents to be lost entirely.
- **D)** The decomposition was too narrow; each subagent sees only its own slice and cannot flag what the coordinator never thought to assign.

---

### Q7

A coordinator prompt reads: "Step 1: call the search agent. Step 2: call the analysis agent. Step 3: call the report agent." When the search agent returns nothing useful, the coordinator still calls the analysis agent, which produces an empty analysis, and the report agent writes a report about nothing.

Which change best addresses this?

- **A)** Add a fourth step instructing the coordinator to check the search results before proceeding, so the script has an explicit branch that can catch empty responses.
- **B)** Replace the fixed script with a goal and quality criteria, letting the coordinator decide which agents to invoke and re-delegate when needed.
- **C)** Increase the search agent's timeout so it has more time to find results before the coordinator proceeds to the next fixed step.
- **D)** Reorder the steps so analysis runs before search, giving the analysis agent a chance to frame the question before raw retrieval happens.

---

### Q8

A developer wants a subagent that reviews code and must not be able to modify files or run shell commands, regardless of what its prompt says.

Which configuration enforces this?

- **A)** Run the subagent in plan mode so its edits are queued rather than applied immediately, giving a human the chance to reject them.
- **B)** Set the subagent's model to Haiku, which cannot perform write operations due to its smaller parameter count and constrained output.
- **C)** Define the subagent with `allowedTools: [Read, Grep, Glob]`, enforcing the restriction at the platform level.
- **D)** Write "You are a read-only reviewer. Never edit files or run commands under any circumstances." in the subagent's system prompt.

---

### Q9

A team member resumes yesterday's session with `claude --resume` and immediately asks, "Continue where we left off with the migration." The agent proposes changes to files that a colleague already rewrote overnight.

What should the engineer do?

- **A)** Rely on the agent detecting the drift on its own once it opens the files, since it will notice version mismatches when it reads the current content.
- **B)** Give the agent a summary of what changed and ask it to re-read the affected files, since it has no awareness of elapsed time or external changes.
- **C)** Run `/compact` so the agent's summary of prior work is refreshed from the repository and stale references are replaced.
- **D)** Start a brand-new session, since resumed sessions are sandboxed to their original snapshot and cannot read files that changed after the session was created.

---

### Q10

An investigation agent must explore a production incident. The team does not know in advance how deep the investigation will go: each finding may raise new questions.

Which orchestration pattern fits?

- **A)** Dynamic adaptive decomposition, where each finding reshapes the subtasks generated next.
- **B)** A single agent with a very large context window, no subagents, and the full log corpus loaded upfront so it can reason across all evidence in one pass.
- **C)** Prompt chaining with a fixed sequence of five stages covering collection, triage, root-cause, impact, and remediation regardless of what each stage uncovers.
- **D)** Parallel execution of the same investigation prompt across five independent agents, then a voting step to pick whichever returns the most detailed result.

---

### Q11

Three research subagents are all given the brief "research renewable energy adoption." The final report contains the same three statistics repeated in different wording, and token spend was triple the estimate.

What is the correct fix?

- **A)** Lower each subagent's `max_tokens` so they produce shorter answers, reducing redundancy by forcing each agent to be more selective.
- **B)** Partition the research scope so each subagent owns a distinct, non-overlapping slice.
- **C)** Reduce the number of subagents from three to one, accepting longer latency to eliminate the coordination cost entirely.
- **D)** Add a post-processing step that removes repeated sentences from the final report, cleaning up the duplication without changing how agents are briefed.

---

### Q12

A coordinator aggregates subagent results once and returns the report. Reviewers consistently find gaps that a second round of research would have closed.

Which mechanism most reliably closes those gaps?

- **A)** An instruction telling the coordinator to "be thorough and make sure nothing is missing before finalizing the report."
- **B)** A refinement loop with an `evaluate_coverage` tool that returns a score and an explicit gap list before the loop may continue.
- **C)** Doubling the number of subagents in the first pass to improve initial coverage and statistically reduce the chance of any single topic being missed.
- **D)** Asking the report agent to state its confidence level at the end, treating low confidence as a signal that another pass is needed.

---

### Q13

An agent team wants to explore three competing refactoring strategies starting from the same completed analysis, without any branch contaminating the others.

Which approach fits?

- **A)** Run `/clear` between strategies so each one starts clean, discarding any residue from prior attempts before the next strategy begins.
- **B)** Fork the session into three independent branches, each with its own id and resumable history, isolated from the others.
- **C)** Run the three strategies sequentially in the same session and use `/rewind` between them to roll back each attempt before starting the next.
- **D)** Ask the agent to keep the three strategies mentally separate within one conversation, tagging each response with the relevant strategy label.

---

### Q14

A coordinator was configured to delegate, but at runtime it performs all the work itself and never invokes a subagent. The `AgentDefinition` objects exist and the system prompt says "delegate each subtask."

Which cause should be investigated first?

- **A)** Whether the subagents were defined before the coordinator in the source file, since declaration order can affect which objects the runtime resolves first.
- **B)** Whether the subagents' system prompts are long enough to describe their roles clearly enough for the coordinator to recognize them as distinct.
- **C)** Whether the coordinator's `max_tokens` is high enough to hold subagent results without truncation.
- **D)** Whether the Agent tool is present in the coordinator's available tools — without it, there is no mechanism to spawn subagents.

---

### Q15

In a multi-agent system, subagents call each other directly whenever they need data. Debugging a wrong final answer requires reading logs from five processes, and errors surface in different formats depending on which agent failed.

Which architectural change fixes this?

- **A)** Add structured logging to each subagent while keeping the direct connections between them, so at least the formats are consistent even if the paths remain distributed.
- **B)** Give every subagent a copy of the full conversation history so all activity is visible in one transcript and cross-agent queries can be answered without inter-agent calls.
- **C)** Merge all five subagents into one agent with all the tools, trading specialization for a single process whose log is easy to follow.
- **D)** Route all messages through a central coordinator, making it the single choke point for routing, context, and error handling.

---

### Q16

A team caps their agentic loop at 10 iterations and treats reaching the cap as "task complete." Complex tasks are silently truncated mid-work, and simple tasks keep looping after Claude has already produced a final answer.

What is the correct design?

- **A)** Remove the cap entirely and rely on the agent to stop itself using its own judgment about when the task is done.
- **B)** Have the agent report a percentage-complete estimate each iteration and stop when it reports 100%, treating the self-assessment as authoritative.
- **C)** Raise the cap to 50 so complex tasks fit within the allowed iterations and the truncation problem disappears for realistic workloads.
- **D)** Drive the loop with `stop_reason` and keep the cap only as a safety backstop against runaway loops.

---

### Q17

A refactoring request touches 40 files and carries real risk of breaking the build. A senior engineer must approve the approach before any file is modified.

Which Claude Code mode fits?

- **A)** `acceptEdits`, so the engineer reviews the diff after the edits land automatically and can revert if anything looks wrong.
- **B)** Direct execution followed by `/rewind` if the result is wrong, since the rewind can undo all changes if the engineer rejects the outcome.
- **C)** `bypassPermissions`, with the engineer watching the terminal for problems as each file is written.
- **D)** Plan mode, where Claude analyzes the codebase and presents an approach without modifying any file until the plan is approved.

---

### Q18

A support agent has exhausted its tools and must escalate a billing dispute to a human. Today it hands off with the message: "Customer is upset about a charge, please help." Agents receiving these escalations spend several minutes reconstructing the case.

What should the agent send instead?

- **A)** The complete raw conversation transcript so the human can read the whole exchange and draw their own conclusions without relying on the agent's framing.
- **B)** A structured package with the customer record, actions attempted, the specific blocker, and what the human needs to decide.
- **C)** A confidence score indicating how certain the agent is that escalation is needed, so the human can triage the case against others in the queue.
- **D)** A shorter free-text summary condensed to two sentences so the human can absorb it in seconds and act immediately.

---

### Q19

A subagent's file-read tool fails once with a transient network error. The subagent immediately reports the failure to the coordinator, which aborts the entire research pipeline.

Which failure-handling design is better?

- **A)** The subagent retries locally, tries a fallback, and escalates only what it cannot resolve.
- **B)** The coordinator ignores subagent errors entirely and synthesizes from whatever data arrived, treating missing pieces as not worth the latency of a retry.
- **C)** The coordinator catches the failure and restarts the whole pipeline from step one, ensuring all agents start fresh with a clean slate.
- **D)** The subagent returns an empty result so the pipeline continues without interruption, with no signal to the coordinator that any data is missing.

---

### Q20

A document-processing workflow always performs the same four steps — extract, normalize, validate, store — regardless of the document's content.

Which pattern is appropriate?

- **A)** A coordinator that decides at runtime which of the four steps to run for each document, adapting the pipeline to the document's specific characteristics.
- **B)** Dynamic adaptive decomposition, so the pipeline can react to each document's content and skip steps that do not apply to a given format.
- **C)** Prompt chaining — a fixed sequential pipeline — since the shape of the work is the same regardless of content.
- **D)** Parallel execution of all four steps to minimize latency, merging outputs in a final reconciliation step.

---

### Q21

An engineer writes a coordinator prompt: "You are a coordinator. Use your judgment: simple factual questions use a single agent; multi-step tasks delegate sequentially, passing results forward; independent subtasks delegate in parallel."

What does this prompt primarily achieve?

- **A)** It guarantees that the coordinator will never call more than one subagent at a time, since single-agent handling is listed first in the prompt.
- **B)** It lets the coordinator pick the right orchestration shape at runtime based on query complexity, rather than always running the full pipeline.
- **C)** It enforces at the platform level which tools each subagent may use, since the prompt defines what parallel and sequential mean operationally.
- **D)** It removes the need for the coordinator to aggregate results from subagents, since the routing logic subsumes the aggregation step.

---

### Q22

A team runs the complete six-agent research pipeline for every incoming query, including questions like "What year was the company founded?" Cost per query is far above budget.

What is the correct change?

- **A)** Have the coordinator select only the agents that add value for the query, skipping the rest.
- **B)** Switch every agent to Haiku to cut the per-token cost across the board, accepting some quality loss on complex queries to bring the average cost down.
- **C)** Cache the pipeline output keyed by query string so repeated questions are free, and invest in query normalization to maximize cache hit rate.
- **D)** Reduce each agent's context window so each one processes less data per call and the total token count across the pipeline falls.

---

### Q23

A subagent is defined with a `description` field of "Handles stuff." The coordinator frequently invokes the wrong subagent.

What is the role of `description` in an `AgentDefinition`?

- **A)** It controls which tools the subagent may call at runtime, acting as a whitelist the platform enforces before any tool invocation proceeds.
- **B)** It is injected verbatim as the subagent's system prompt at spawn time, so it sets the agent's identity and operating constraints directly.
- **C)** It is what the coordinator reads when deciding whether to invoke this agent; it must state purpose and usage boundaries precisely.
- **D)** It is displayed to the end user in the CLI output so they can see which agent handled their request.

---

### Q24

During a long Claude Code session the engineer wants to branch off and try a risky approach, while keeping the ability to return to the current conversation untouched.

Which capability matches?

- **A)** Forking the session, which creates a new session id from the current state while leaving the original intact.
- **B)** `/clear`, which resets the conversation but keeps `CLAUDE.md` and AutoMemory loaded so the agent retains project context.
- **C)** `--continue`, which resumes the most recent session from disk rather than opening a new branch alongside the current one.
- **D)** `/compact`, which summarizes the conversation to free up context window space for the risky exploratory work ahead.

---

### Q25

An orchestration reads: coordinator → search agent → analysis agent → report agent, where each stage consumes the previous stage's output.

Which execution mode is required?

- **A)** Fork-based, since each agent needs its own session id to track work separately and avoid clobbering each other's state.
- **B)** Hub-and-spoke with direct subagent-to-subagent messaging so results pass between agents without each hop going through the coordinator.
- **C)** Parallel, because all three agents are independent workers with no shared data and should run simultaneously to minimize wall-clock time.
- **D)** Sequential, because each stage depends on the output of the one before it.

---

### Q26

A team wants to know why their coordinator sometimes produces reports missing entire topics. They cannot see which subagent received which brief or which one returned nothing.

Which property of hub-and-spoke addresses this?

- **A)** Every message, result, and failure flows through the coordinator, making it a single inspectable point for observability and control.
- **B)** Subagents share one context window, so all their activity appears in a single transcript that the team can search for missing topics.
- **C)** Subagents communicate directly with each other, so failures are contained locally without involving the coordinator and creating noise in its log.
- **D)** The coordinator uses the same model as the subagents, so their reasoning style is consistent and outputs are easier to compare side by side.

---

### Q27

An agent receives `stop_reason: "tool_use"` with a request to call `lookup_order`. The program executes the function and gets back the order data.

What must the program do next?

- **A)** Start a new conversation with the order data placed in the system prompt, so the model has a clean context that includes the result without any prior tool_use overhead.
- **B)** Append the output as a plain text user message describing the result, which the model can read just as well as a typed tool_result block.
- **C)** Append a `tool_result` block with the function's output to the conversation, then call the API again.
- **D)** Return the output directly to the end user, because the loop has now ended and no further model call is needed.

---

### Q28

A pipeline coordinator must decide between two designs for delegating to a code-search subagent:

Design A: "Search for files containing `processPayment`, then read each one, then list the line numbers."
Design B: "Find every place where payment processing happens. Report file paths, line numbers, and a one-line description of each. Cover the whole repository, including tests."

Which statement is correct?

- **A)** Design B sets the goal and quality criteria, letting the subagent choose how to search while the coordinator defines what a complete answer looks like.
- **B)** Design A is better because it removes all ambiguity about the required steps, ensuring the subagent follows a deterministic path that is easy to debug when results are incomplete.
- **C)** Design B will produce inconsistent results because it does not fix the order of tool calls, leaving the subagent free to search in ways that miss files found only by a specific sequence.
- **D)** Both designs are equivalent because the subagent selects its own tools regardless of the prompt and will follow the same search strategy either way.

---

### Q29

A team notices their coordinator invents subtasks that the available subagents cannot perform, then reports failure.

Which control catches weak decomposition before work begins?

- **A)** A post-hoc check run only during result aggregation, after subagents have finished, to detect tasks that returned errors or empty results.
- **B)** A longer system prompt listing every possible subtask the coordinator might need, so it never invents tasks outside the predefined set.
- **C)** A validation tool that reviews the proposed task list against coverage requirements before delegation begins.
- **D)** A higher iteration cap so the coordinator can retry failed subtasks until something works, cycling through alternatives automatically.

---

### Q30

An engineer kills a Claude Code session in the IDE and wants to pick it back up later exactly where it stopped.

What does Claude Code provide?

- **A)** A session id usable with `/resume` or `claude --resume` to restore the full conversation history.
- **B)** An automatic replay of the last ten tool calls when the IDE restarts, re-executing each one in order to rebuild the final state.
- **C)** A `.claude/session.md` file written to the repository root after every session, containing a full transcript that can be re-imported manually.
- **D)** Nothing — killed sessions are treated as discarded and cannot be recovered once the IDE process exits.

---

### Q31

A coordinator receives outputs from a research agent, a writing agent, and a review agent. Two of them disagree about a product's release date.

Which aggregation instruction is most appropriate?

- **A)** "Discard any finding that another agent contradicts, keeping only those that all three agents agree on, even if agreement means omitting important details."
- **B)** "Return the three outputs concatenated in the order received so the reader can decide which to trust based on their own assessment of the sources."
- **C)** "Combine them into a single coherent response; resolve conflicts by preferring the most specific data."
- **D)** "Ask the agent with the highest self-reported confidence to arbitrate the disagreement, deferring fully to its judgment on the conflicting point."

---

### Q32

A team wants each of three subagents — searcher, analyst, writer — to be structurally unable to perform the others' jobs.

Which combination of `AgentDefinition` fields carries that enforcement?

- **A)** `allowedTools` and `disallowedTools`, enforced at the platform level independent of any instruction.
- **B)** The model alias assigned to each agent, since different models have different built-in capabilities that align naturally with different job roles.
- **C)** `name` and `description`, which tell the coordinator what each agent is for and when to invoke it, creating clear role separation in the coordinator's decision logic.
- **D)** The system prompt alone, which defines the agent's identity and operating rules completely and is the authoritative source of behavioral constraints.

---

### Q33

An agent processing a customer request calls `get_customer`, then `lookup_order`, then decides it has enough information and writes a reply. The API response for the final turn carries `stop_reason: "end_turn"`.

What does this indicate?

- **A)** The agent exhausted its token budget before producing a complete response and stopped mid-generation to avoid exceeding the limit.
- **B)** The agent has finished and is returning a result; the loop should terminate.
- **C)** The agent is waiting for the user to confirm an action before continuing to the next step in its reasoning chain.
- **D)** The agent wants to call another tool but lacks the required permission and is signaling that it is blocked from proceeding.

---

### Q34

A multi-agent pipeline passes findings between agents as one large blob of prose. The synthesis agent produces a report where no claim can be traced to a source.

What is the root cause?

- **A)** The synthesis agent's context window was too small to hold all findings at once, forcing it to drop older ones before it could record their origins.
- **B)** The synthesis agent lacked a web-search tool to verify each claim independently and link it back to the authoritative source document.
- **C)** Running subagents in parallel instead of sequentially caused attribution to be lost, because each agent's output arrived without positional ordering.
- **D)** Passing findings as a single prose blob loses attribution, since content and source metadata are not kept together.

---

### Q35

A coordinator spawns four subagents to review four independent modules. The team wants wall-clock time to be roughly that of one review, not four.

Which instruction achieves this?

- **A)** Merge the four modules into one review task for a single subagent, accepting a longer single runtime in exchange for simpler coordination.
- **B)** Fork the session four times and run each review in a separate terminal manually, coordinating results by hand after all four finish.
- **C)** Run the four subagents concurrently, since the module reviews share no dependencies.
- **D)** Run them sequentially with a shorter prompt per subagent to reduce total token usage and overall elapsed time across all four passes.

---

### Q36

An engineer notices that after a subagent finishes, the coordinator cannot inspect what happened inside the subagent's loop — only its final output is visible.

Which statement is accurate?

- **A)** The coordinator can replay a subagent's internal steps by querying shared memory, since the platform persists all intermediate tool calls to a common store.
- **B)** The coordinator automatically inherits the subagent's full context when the subagent finishes, including all intermediate messages and tool results from the internal loop.
- **C)** Each subagent runs in an isolated context, so the coordinator only receives the final output; any intermediate steps that need to be visible must be included in that output.
- **D)** The subagent's internal steps are only accessible when subagents run sequentially, not in parallel, because sequential mode preserves the log in the shared history.

---

### Q37

A workflow must guarantee that a database migration is never applied before a backup tool has run successfully in the same session.

Which implementation satisfies "structurally impossible to skip"?

- **A)** A post-migration check that verifies whether a backup was taken during the session, flagging the issue in a report after the migration has already run.
- **B)** Ordering the tools in the system prompt so the backup tool description appears before migration, signaling to the model that backup is the expected first step.
- **C)** A note in the migration tool's description stating that a backup must run first, which the model reads and is expected to follow as a strong preference.
- **D)** A hook that fires before the migration tool and blocks execution unless a recorded backup state is present.

---

### Q38

A team is choosing between a fixed three-stage pipeline and an adaptive plan for a security audit where each vulnerability found may require investigating different subsystems.

Which statement correctly distinguishes them?

- **A)** A fixed plan is preferable because it is easier to observe and debug, and the predictable stage sequence makes it straightforward to add logging and reproduce failures.
- **B)** An adaptive plan is simply a fixed plan with more stages added to handle edge cases, so the two approaches differ only in the number of predefined steps.
- **C)** An adaptive plan requires all subagents to share one context window to coordinate decisions, since each agent must know what the others found before choosing its next action.
- **D)** An adaptive plan uses each finding to reshape subsequent steps; a fixed plan runs the same stages regardless of what is discovered.

---

### Q39

A coordinator agent's prompt says: "When given a task, break it into subtasks and delegate each one using the available tools. Do not do the work yourself."

Which part of the task lifecycle does this prompt address?

- **A)** Task decomposition and delegation, while leaving result aggregation to a separate instruction.
- **B)** Tool permission enforcement, restricting which tools each subagent may access when it receives a delegated subtask.
- **C)** Session persistence, ensuring that the coordinator's state is preserved across restarts so delegated work is not lost.
- **D)** Result aggregation and conflict resolution, guiding the coordinator on how to combine outputs once all subagents have returned their findings.

---

### Q40

An engineer wants a slash command for deep dependency analysis to run without polluting the main session's context, because its output is long and only the conclusion matters.

Which configuration achieves this?

- **A)** Wrap the command's output in a collapsed markdown section to visually hide it from the terminal display without affecting the tokens consumed.
- **B)** Run the command with a smaller model so it generates less output text and the context impact on the main session is reduced proportionally.
- **C)** Set `context: fork` in the frontmatter so the command runs in an isolated subagent context.
- **D)** Append `/clear` at the end of the command body to wipe the main session's state automatically after the command finishes running.

---

### Q41

After resuming a week-old session, an engineer wants the agent to re-analyze only the files that changed since the session ended, not the whole module.

Which approach is most efficient and reliable?

- **A)** Run `/compact` so the agent regenerates its understanding of the codebase from the condensed history and picks up recent changes it may have missed.
- **B)** Ask the agent to re-read every file in the module to ensure nothing is missed, accepting the extra token cost as the price of completeness.
- **C)** Inject the list of changed files and instruct the agent to re-read only those before continuing.
- **D)** Trust the agent's stored summary of the module from the earlier session without re-reading, since the summary captures the design intent rather than transient file contents.

---

### Q42

A team must decide between having the coordinator run a single subagent, a sequential chain, or parallel subagents. The incoming query is: "Compare the privacy policies of these four vendors and flag conflicts with our data retention rules."

Which structure best satisfies coverage and latency?

- **A)** A single agent reading all four policies in one pass, accepting serialized reads in exchange for simpler result handling and no coordination overhead.
- **B)** Four parallel subagents, each owning one vendor policy, followed by a synthesis step comparing them against the retention rules.
- **C)** A sequential chain where each agent reads one policy and passes a running summary to the next, building context cumulatively across the four documents.
- **D)** Four parallel subagents each given the full brief covering all four vendors, letting each independently produce a full comparison to catch anything the others miss.

---

### Q43

A subagent is spawned with `allowedTools: ["Read", "Grep", "Glob"]` but its prompt instructs it to "run the test suite and report failures." At runtime the subagent reports that it cannot complete the task.

What is the correct diagnosis?

- **A)** `allowedTools` is advisory; the real problem is the model choosing not to use the right tool, and rephrasing the prompt would resolve the issue.
- **B)** The prompt requires Bash to run tests, but `allowedTools` excludes it — the capability and the permission are mismatched.
- **C)** Grep can run shell commands in some configurations, so the issue is the system prompt wording and not the tool set.
- **D)** The coordinator failed to pass the test file paths to the subagent, leaving it unable to locate the files it would need to execute.

---

### Q44

A long-running agent pipeline writes intermediate findings only into the conversation history. After a context compaction, the coordinator re-delegates work that had already been completed.

Which fix addresses the root cause?

- **A)** Disable auto-compaction so the conversation history is never summarized or truncated, preserving every delegation record for the coordinator to reference.
- **B)** Instruct the coordinator to remember what it has already delegated and avoid repeating it, relying on its in-context memory to prevent duplication.
- **C)** Persist findings in a structured state object outside the conversation and have the coordinator consult it before delegating.
- **D)** Switch to a 1M-token model so the full history fits without ever being compacted, eliminating the risk of any record being lost to summarization.

---

### Q45

An engineer is told that "Task" and "Agent" appear interchangeably in code samples and documentation for spawning subagents.

Which statement is accurate?

- **A)** Task is the legacy name for what is now called Agent; both spawn a subagent with isolated context, system prompt, and tools.
- **B)** Task spawns a subagent while Agent only defines one without executing it, so they serve complementary roles in the same lifecycle step.
- **C)** Task runs synchronously while Agent always runs in the background asynchronously, making them suitable for different concurrency patterns.
- **D)** They are unrelated: Task manages the coordinator's to-do list while Agent is the mechanism that actually spawns and communicates with subagents.

---

### Q46

A support agent is told: "Never issue a refund above $500 without escalating." Logs show it issued a $900 refund because the customer was persistent.

Which mechanism makes the limit reliable?

- **A)** A gate that intercepts every call to the refund tool and rejects it if the amount exceeds the threshold.
- **B)** A few-shot example in the system prompt showing a correctly refused $900 refund, training the model to recognize and decline similar requests.
- **C)** Restating the rule in bold at the start and end of the system prompt, ensuring the model encounters the constraint regardless of where attention is focused.
- **D)** Lowering the model's temperature so it adheres to instructions more consistently and is less likely to be swayed by persuasive customer language.

---

### Q47

Three subagents return findings. The coordinator must produce a report where each claim can be traced to the agent and source that produced it.

Which subagent output design supports this?

- **A)** Raw tool output forwarded verbatim from each subagent to the coordinator, preserving the original response without any transformation that might lose detail.
- **B)** Structured objects pairing each claim with its source metadata: agent id, document or URL, and confidence score.
- **C)** Prose summaries from each subagent, since they integrate more naturally into the final report and a skilled writer can weave attribution into the narrative.
- **D)** A single confidence score per subagent summarizing the overall reliability of all its findings, allowing the coordinator to weight each agent's contribution accordingly.

---

### Q48

A coordinator must handle a task whose scope is unknown until work begins: "Find every reason our checkout conversion dropped last month."

Which decomposition strategy is appropriate?

- **A)** Send the same broad brief to five agents in parallel and pick whichever returns the longest answer, since length correlates with thoroughness for open-ended investigations.
- **B)** Generate subtasks dynamically as findings arrive, stopping when further investigation yields no new signal.
- **C)** Define a fixed list of ten subtasks up front covering all likely hypotheses and run them all, ensuring systematic coverage even if some subtasks turn out to be irrelevant.
- **D)** Run a single subagent with a very long prompt enumerating every possible hypothesis at once, so the full investigation fits in one context window and avoids coordination overhead.

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

- **A)** State should live in the system prompt, which is re-sent on every API request and is therefore always available regardless of what happened to the conversation history.
- **B)** Conversation history is sufficient because resumed sessions restore it completely, and the coordinator can scan the transcript to identify which steps already produced results.
- **C)** Either location works, since compaction preserves all tool results verbatim and the coordinator can always find completed steps in the history even after summarization.
- **D)** External durable state is required; conversation history can be compacted or truncated and is not a reliable record of what has been completed.

---

### Q51

A coordinator is instructed: "You have received outputs from multiple agents. Combine them into a single coherent response."

Which stage of the coordinator's lifecycle is this?

- **A)** Agent selection — choosing which subagents to invoke for the task based on the query's requirements.
- **B)** Result aggregation — combining multiple agent outputs into one response.
- **C)** Tool permission scoping — deciding which tools each subagent may access before delegation begins.
- **D)** Task decomposition — breaking the original task into subtasks before any agent is invoked.

---

### Q52

A team observes that when subagents run in parallel, they cannot watch what each internal loop is doing while it runs, which makes mid-flight debugging hard.

Which mitigation is appropriate?

- **A)** Increase the coordinator's iteration cap to allow more time for a human to attach a debugger and inspect the running subagents before they finish.
- **B)** Switch to sequential execution permanently so each subagent can be monitored in turn, accepting the latency cost as necessary for adequate visibility.
- **C)** Require each subagent to return a structured step log alongside its findings, giving the coordinator an inspectable trace after the fact.
- **D)** Give subagents direct channels to each other so they can report progress in real time and surface issues before the coordinator collects final results.

---

### Q53

An engineer creates a subagent whose system prompt is empty and whose description reads "general helper." The coordinator invokes it for tasks ranging from writing code to summarizing PDFs, with inconsistent quality.

What is the design error?

- **A)** The subagent needs a larger context window to handle diverse tasks reliably, since each task type requires different amounts of context to perform well.
- **B)** The coordinator should invoke it more often so it learns the expected patterns over time, improving quality through repeated exposure to the task distribution.
- **C)** Without a proper `AgentDefinition`, the agent's role is unconstrained — neither selection nor behavior is bounded to a specific domain.
- **D)** The agent's tool set should be expanded so it can handle any type of task assigned to it without encountering missing-capability errors.

---

### Q54

A team wants to verify that a coordinator's decomposition covered everything before the final report ships.

Where can this check be placed, according to the coordinator lifecycle?

- **A)** At either point: before delegation via a task-list review tool, or during aggregation as a gap check before the answer is produced.
- **B)** Only inside each subagent, since each one knows its own scope best and is the only component that can detect when its assigned slice is incomplete.
- **C)** Only through the user's follow-up question after the report is delivered, since the coordinator cannot assess its own coverage from inside the same reasoning context.
- **D)** Only at the API level by inspecting `stop_reason` after each turn, since that field signals whether the model believes it has finished all necessary work.

---

### Q55

An engineer resumes a session and the agent confidently continues from an assumption that was true last Tuesday but is now stale.

Which statement explains the risk?

- **A)** Resuming a session always reloads the current state of every file that was previously read, so any drift would be caught automatically on the first file access.
- **B)** Sessions expire after 24 hours, so the agent should have refused to resume the old one and prompted the user to start fresh.
- **C)** Claude has no awareness of elapsed time or external changes; resumed context can be silently stale.
- **D)** The agent's confidence score feature would have flagged the staleness automatically if the feature flag had been enabled in the session configuration.

---

### Q56

A coordinator delegates to a subagent and needs the subagent's answer before it can proceed. Elsewhere in the same workflow, it fires three independent subagents whose results it collects later.

Which statement describes this correctly?

- **A)** Subagents always block the parent, so any parallelism must be implemented outside the agent framework using threads or async constructs in the host application.
- **B)** Subagents always run in the background; the parent can never block waiting for one and must poll for results on a timer or callback.
- **C)** The parent can block on a single subagent or fire several in parallel; both modes are supported, and the choice depends on dependency.
- **D)** When running in parallel, subagents automatically share partial results with each other as they progress, enabling them to coordinate without involving the parent coordinator.

---

### Q57

A team implements a `PostToolUse` hook after their deployment tool. What is the most appropriate use of that hook?

- **A)** Rewriting the deployment tool's input parameters to correct them before execution starts, since PostToolUse has access to the parameters before they are sent to the tool.
- **B)** Blocking the deployment call when required prerequisites have not been met yet, intercepting the call before the tool runs and returning an error to the model.
- **C)** Selecting which model the agent should use for its next reasoning turn, since PostToolUse can inject model-selection directives into the subsequent request.
- **D)** Recording the deployment result and updating workflow state so subsequent gates know it completed.

---

### Q58

A research system's coordinator is the only component that talks to the outside world; subagents receive briefs and return findings. A security reviewer asks how the team controls what information crosses trust boundaries.

Which answer is correct?

- **A)** Each subagent's system prompt defines what information it may send or receive, and because the coordinator enforces which prompts are used, control flows indirectly from the prompt design.
- **B)** Because every inbound and outbound message flows through the coordinator, information-flow policy can be enforced and audited in one place.
- **C)** Each subagent independently enforces its own information-flow policy, since it alone knows its scope and can decide which findings to include in its response.
- **D)** Trust boundaries are enforced by limiting the size of each subagent's context window, preventing it from accumulating enough information to leak sensitive data.

---

### Q59

A team must choose between plan mode, direct execution, and a multi-phase workflow for: renaming a single private helper function used in two files, with tests covering both.

Which choice is proportionate?

- **A)** A forked session for each file, to keep the two rename operations fully isolated and independently reversible.
- **B)** Plan mode, to get explicit approval before any change is made, since even a rename can have unexpected downstream effects worth reviewing.
- **C)** A multi-phase workflow with a dedicated review agent checking each phase, ensuring no rename cascades into unexpected call sites.
- **D)** Direct execution — scope is small, risk is low, and the existing tests cover the result.

---

### Q60

An agent's loop is implemented so that whenever the API response contains any text block, the program returns that text to the user and stops.

What behavior will this produce?

- **A)** The loop will frequently exit early, before tool calls run, because Claude often emits text in the same response as a `tool_use` block.
- **B)** The loop will run forever, because text always accompanies every tool call the model emits and the exit condition is therefore never reached.
- **C)** The loop will run until the iteration cap is hit, since text responses delay but never stop the loop from eventually reaching the final tool call.
- **D)** The loop will behave correctly — text only appears on the final turn, never alongside tool calls, so the exit condition reliably identifies completion.

---

**End of block — 60 questions.**
