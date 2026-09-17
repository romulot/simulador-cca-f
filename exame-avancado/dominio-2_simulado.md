# Exame Avançado — Bloco 2

**60 questions · multiple choice · one correct answer**

> Do not look at the answer key until you have finished the whole block.
> The domain and objective of each question are deliberately not shown.

---

### Q1

A support agent has two tools: `lookup_order` ("Gets order information") and `get_order_status` ("Returns order status"). The agent frequently calls the wrong one, and sometimes calls both.

Which fix addresses the root cause?

- **A)** Add a system prompt line saying "be careful when choosing between similar tools, because incorrect tool selection causes cascading errors and degrades the overall conversation quality."
- **B)** Remove `get_order_status` to eliminate the ambiguity, since having fewer tools forces the agent to derive status from order data rather than calling a redundant endpoint.
- **C)** Set `tool_choice` to `any` so the agent is forced to pick one and commit rather than hedging between both tools on the same turn.
- **D)** Rewrite both descriptions to state each tool's distinct purpose, input format, and when to use the other one instead.

---

### Q2

A `process_refund` tool fails because the order is outside the return window. The team wants the agent to explain the policy to the customer rather than retry.

Which error payload design is correct?

- **A)** Return success with a note in the message field explaining the refund did not happen, so the agent can continue the conversation without treating it as a failure state.
- **B)** Return the error flagged as non-retryable with a customer-friendly explanation, so the agent communicates instead of looping.
- **C)** Return a generic failure so the agent retries automatically, since the return window may have been computed incorrectly and a retry could succeed with refreshed data.
- **D)** Raise an exception that terminates the agent loop and triggers an alert, so a human operator can review the failed refund attempt before any further action is taken.

---

### Q3

An engineer is defining a `tool_result` block in the Messages API for a tool call that failed.

Which field signals the failure?

- **A)** `status`, set to `"failed"`, which the Messages API reads as an error condition and surfaces in the assistant's reasoning about the tool call outcome.
- **B)** `retryable`, set to `false`, which both signals that the call failed and tells the API not to re-issue it in the same request cycle.
- **C)** `stop_reason`, set to `"error"`, which the model reads as a signal to halt tool-use processing and switch to a fallback response path.
- **D)** `is_error`, set to `true` in the `tool_result` block.

---

### Q4

A `search_documents` tool returns an empty list in two very different situations: the query genuinely matched nothing, and the backend index was unreachable.

Why does this matter?

- **A)** It does not matter; the agent should report "no results" in both cases and let the user decide whether to retry the query or reformulate it differently.
- **B)** It only matters for logging purposes, since the downstream agent behavior and conversation flow are identical regardless of which situation caused the empty list.
- **C)** Both situations return empty but require completely different responses, so the payload must distinguish a valid empty result from an access failure.
- **D)** The agent can infer the difference by measuring how long the call took and comparing it against the tool's documented baseline latency for successful index queries.

---

### Q5

A structured data extraction pipeline must never return a conversational reply — downstream parsing fails if it does.

Which configuration guarantees a tool call?

- **A)** Set `tool_choice` to force the specific extraction tool, preventing the model from returning a plain text response.
- **B)** Set `tool_choice` to `none` and parse the text output directly, since the model will produce clean structured text when tool calls are disabled entirely.
- **C)** Set `tool_choice` to `auto` and include a strong instruction telling the model to always use the extraction tool on every turn without exception.
- **D)** Increase `max_tokens` to ensure the full tool call fits within the response budget and is never truncated before the closing bracket.

---

### Q6

An agent has 40 tools loaded. Engineers observe it picking plausible but wrong tools, asking for clarification when the answer is obvious, and occasionally inventing tool combinations that do not exist.

What is the diagnosis?

- **A)** The underlying model is too small to hold 40 tool definitions in attention simultaneously, so a larger model tier should be selected before any other change is attempted.
- **B)** The tools need longer and more exhaustive descriptions covering every edge case, since the current descriptions leave too much ambiguity for a large toolset.
- **C)** `tool_choice` should be set to `any` to force a selection on every turn, which eliminates the clarification requests and prevents the model from reasoning without acting.
- **D)** Too many tools degrade decision quality; reduce the toolset, preferring small general-purpose sets over many niche ones.

---

### Q7

A synthesis subagent — whose job is to combine findings from other agents — has a web search tool in its context. Logs show it running its own searches instead of synthesizing.

What explains this?

- **A)** Presence implies permission: the model treats any tool in context as available and appropriate, so the tool must be removed from this agent's toolset.
- **B)** Web search is integral to synthesis because the agent must verify source accuracy before combining findings; this behavior reflects proper grounding and should be preserved.
- **C)** The synthesis agent's system prompt is too short to override the tool's presence, so the solution is to add a detailed multi-paragraph role description that explicitly deprioritizes search.
- **D)** The coordinator passed incorrect findings, so the synthesis agent falls back to independent research to cross-check them before proceeding with its summary.

---

### Q8

A team connects five MCP servers. The agent now sees every tool from all five at once.

Which statement is accurate?

- **A)** Only the first server's tools are loaded at startup; the remaining servers stay dormant until the first is explicitly disconnected or its connection times out.
- **B)** All tools are discovered and loaded at connection time as a flat list, with no awareness of which server each came from.
- **C)** Tools are loaded lazily on demand — the connection is established but tool definitions are fetched only when the agent issues a request that requires a specific capability.
- **D)** Tools are organized in a two-tier structure where the agent selects a server namespace first and then picks from that server's tool list in a second decision step.

---

### Q9

An MCP server exposes a company handbook. Agents currently call a `search_handbook` tool repeatedly, making several exploratory calls before finding the right section.

Which MCP concept fits better?

- **A)** Convert the handbook into a second isolated MCP server so its tools are discovered separately and the agent can mentally partition handbook lookups from other tasks.
- **B)** Increase the agent's iteration cap to give it enough turns to complete the exploratory calls without hitting the loop limit and returning a partial answer.
- **C)** Add more parameters to `search_handbook` — such as section filter, relevance threshold, and result count — so each call returns a narrower and more targeted result set.
- **D)** Expose the handbook as resources — read-only addressable data — so it can be read directly rather than discovered through repeated tool calls.

---

### Q10

A `.mcp.json` file must reference an API token without hardcoding the secret in a file that goes into git.

Which mechanism applies?

- **A)** Storing the token in `CLAUDE.md` so the model reads it as context at startup, which keeps it separate from the server configuration file that is committed to the repository.
- **B)** Environment variable expansion using `${VAR}` or `${VAR:-default}` syntax in `.mcp.json`.
- **C)** A placeholder string that Claude Code replaces at startup by reading the most recent matching entry from the user's shell history file.
- **D)** MCP servers cannot use secrets; the token must be embedded in each individual tool call as an explicit argument at invocation time.

---

### Q11

A team wants an MCP server configuration checked into the repository so every developer gets it automatically when they clone.

Which file is correct?

- **A)** `.mcp.json` at the project root, which is the project-scope configuration shared with the team.
- **B)** The managed settings file, which is pushed org-wide through the administrative console and does not depend on individual developers cloning any particular repository branch.
- **C)** `.claude/settings.local.json`, which is the right place for personal overrides but is excluded from version control by the default `.gitignore` rules.
- **D)** `~/.claude.json`, which lives in the user's home directory and applies only to that individual's machine, regardless of which repository they are working in.

---

### Q12

The same MCP server name is defined at local, project, and user scope with different commands.

Which one does Claude Code connect to?

- **A)** All three simultaneously, with each scope's tools namespaced separately so the agent can distinguish local from project from user versions.
- **B)** The project scope, because it is the one checked into the repository and therefore represents the team's agreed-upon configuration for this codebase.
- **C)** The user scope, because personal configuration reflects the developer's own environment preferences and overrides any shared defaults.
- **D)** Local scope wins over project, which wins over user.

---

### Q13

A coordinator delegates to three subagents: a searcher, an analyst, and a report writer. The team wants each to be unable to invoke tools outside its role.

Which approach is correct?

- **A)** Give all three the full toolset and audit misuse after the fact, using logs to identify out-of-role invocations and address them in the next iteration of system prompt tuning.
- **B)** Give all three the full toolset and describe their roles in their system prompts, since models reliably respect explicit role boundaries when the instructions are clearly stated.
- **C)** Give all three the full toolset and use `tool_choice: any` to force tool usage on each call, which ensures agents stay active without deferring to prose responses.
- **D)** Assign each subagent only the tools required for its role, reducing decision complexity and preventing out-of-role invocations structurally.

---

### Q14

A developer needs to load the contents of one specific file whose path is already known.

Which built-in tool is designed for this?

- **A)** Grep
- **B)** Bash with `cat`
- **C)** Read
- **D)** Glob

---

### Q15

A workflow requires that `get_customer` is called before `process_refund`, because the refund tool needs the customer's account tier.

Which approach sequences this reliably?

- **A)** Set `tool_choice` to `any` so the model calls something on each turn, relying on the natural flow of the conversation to produce the correct ordering over multiple exchanges.
- **B)** List the tools in the desired order in the tools array, since the model reads definitions sequentially and tends to call earlier-listed tools before later ones.
- **C)** Make the dependency explicit: the refund tool requires the account tier as an input it cannot obtain on its own, so the prerequisite call must come first.
- **D)** Rely on the model calling them alphabetically, since `get_customer` sorts before `process_refund` and the model typically respects lexicographic order in multi-step workflows.

---

### Q16

A tool description reads: "Use this tool to get data." The agent calls it with malformed input roughly one call in five.

Which aspect of tool description design is missing?

- **A)** The tool's average latency and P95 response time, which helps the model decide how frequently to call it and whether to prefer a cached result instead.
- **B)** A warning that the tool is expensive to call, which prompts the model to be more conservative and deliberate before committing to the invocation.
- **C)** The input format and constraints on each field, so the model generates conforming arguments.
- **D)** The tool's implementation language and runtime environment, which affects how the model interprets error messages and constructs debugging queries.

---

### Q17

An agent must always take an action on every turn — it can never respond with plain text — but which action is appropriate varies.

Which `tool_choice` setting matches?

- **A)** `tool`, which forces one specific named tool on every single turn regardless of context.
- **B)** `auto`, which lets the model decide whether to use a tool or return plain text based on the content of the current turn.
- **C)** `any`, which requires a tool call but lets the model choose which tool.
- **D)** `none`, which prevents tool use entirely and forces the model to respond with plain text on every turn.

---

### Q18

A team wants Claude to reason about a problem using only what is already in the conversation, with no tool calls at all for this one request.

Which `tool_choice` setting matches?

- **A)** `none`
- **B)** `any`
- **C)** `tool`
- **D)** `auto`

---

### Q19

A tool's underlying API returns a 500 error because of a transient network fault.

How should the tool result be structured?

- **A)** As a message telling the user to try again later, so the agent can surface the guidance immediately rather than consuming an extra turn on an internal retry attempt.
- **B)** As an empty successful result so the loop continues smoothly, since the absence of data is preferable to an error state that might cause the agent to abort the entire task.
- **C)** As a thrown exception that ends the agent loop and forces the orchestrator to restart the entire task from the beginning with a fresh context window.
- **D)** As an error result — marked as failed, identified as transient so the agent knows a retry is appropriate.

---

### Q20

An engineer asks what practical difference exists between MCP tools and MCP resources.

Which statement is correct?

- **A)** Tools are synchronous and block the agent loop until they return, while resources are fetched asynchronously so the agent can continue reasoning while the data loads in the background.
- **B)** Tools are actions the agent executes; resources are read-only data the agent consumes.
- **C)** Resources are a deprecated pattern that will be removed in a future MCP version, with tools serving as the unified interface for both actions and data retrieval going forward.
- **D)** Tools are provided by remote servers over the network while resources originate from the local filesystem, and mixing them in one session can cause path resolution conflicts.

---

### Q21

An engineer wants to guarantee that the model produces output conforming to a strict JSON schema, with no prose around it.

Which method is most reliable?

- **A)** Define a tool whose `input_schema` matches the target structure and force it with `tool_choice`.
- **B)** Prompt the model with "respond only with valid JSON matching the schema" and validate the response with a strict parser that raises on any deviation.
- **C)** Ask for JSON, increase `max_tokens` so the response is never truncated, and add a retry that re-requests on parse failure to handle edge cases.
- **D)** Ask for JSON and strip surrounding prose with a regular expression that anchors on the opening and closing braces to extract the object reliably.

---

### Q22

A tool's `input_schema` defines a `category` property with an enum of `billing`, `shipping`, and `technical`. Real tickets sometimes fit none of these, and the model forces them into the closest match.

Which schema improvement addresses this?

- **A)** Add an explicit `other` value to the enum so the model has an accurate option instead of being forced to guess.
- **B)** Make the field optional so the model can omit it when uncertain, which avoids forced miscategorization at the cost of losing the label on edge-case tickets.
- **C)** Remove the enum entirely and accept free-text input, since natural language classification by the model is more accurate than a constrained set of discrete values.
- **D)** Add a system prompt instruction telling the model to be careful with categorization and to flag ambiguous tickets with a special prefix before filling in the category field.

---

### Q23

A team writes two MCP tools for a payments server: `create_charge` and `create_payment_intent`. The agent routes requests to the wrong one about a third of the time.

Which description change helps most?

- **A)** Rename them to `tool_a` and `tool_b` to eliminate the semantic signal in the names, forcing the model to rely exclusively on the description text for disambiguation.
- **B)** Document the distinction in the server's README and link to it from each tool's description so developers can look up the difference during integration.
- **C)** Merge them into one tool with a `mode` parameter so the agent makes one choice instead of two, simplifying the decision surface at the cost of a slightly more complex schema.
- **D)** State in each description how it differs from the other and which situations call for each.

---

### Q24

A subagent whose role is writing the final report has `Bash`, `Edit`, and `Write` in its toolset "in case it needs them."

What is the risk?

- **A)** The extra tools inflate the prompt size with their schema definitions, consuming output tokens proportional to their combined schema length and reducing the budget for the actual report content.
- **B)** The tools will time out under sustained load since the reporting subagent shares rate-limit quota with other subagents that use the same tools more frequently.
- **C)** There is no meaningful risk; the model reliably ignores tools that are irrelevant to the current task description and only invokes them when there is a clear justification.
- **D)** Unneeded tools expand the decision surface and invite out-of-role invocations, because tool presence reads as permission.

---

### Q25

A developer must decide which built-in tool to use to run the project's test suite.

Which is correct?

- **A)** Grep, which can run commands against file contents.
- **B)** Read, after loading the test runner's source code.
- **C)** Bash, which executes shell commands.
- **D)** Glob, which resolves the test file patterns.

---

### Q26

An MCP tool returns an error object that includes a category, a human-readable description, and a boolean indicating whether retrying is appropriate.

Which statement about that boolean is accurate?

- **A)** It lives in the tool author's error payload design so the agent can map error type to action; it is not a field of the Messages API.
- **B)** It replaces `is_error` entirely, making it unnecessary to mark the result as an error since the boolean already communicates failure through its presence in the payload.
- **C)** It is a required field of the Messages API `tool_result` block that must be present in every response, whether the call succeeded or failed, to satisfy API schema validation.
- **D)** Setting it to `true` causes the Messages API to transparently reissue the tool call on the server side without surfacing the failure to the agent or the application code.

---

### Q27

An agent is told to find every file in the repository matching `**/*.test.ts` and then search within those files for `describe(`.

Which tool sequence is correct?

- **A)** Read on the repository root to get a file listing, then Bash to filter the output with shell utilities and pipe it into a search command.
- **B)** Bash with `find` and `grep` combined in a single pipeline, because built-in tools cannot be chained across turns without intermediate state storage.
- **C)** Grep to find the files by content pattern, then Glob to resolve the full paths and confirm each match exists at the expected location.
- **D)** Glob to find the files by pattern, then Grep to search inside them.

---

### Q28

A tool that queries an internal API returns a 4,000-line JSON payload, of which the agent needs three fields. Context fills quickly and the agent's later reasoning degrades.

Which fix is appropriate?

- **A)** Filter the response inside the tool so only the needed fields are returned to the agent.
- **B)** Instruct the agent via system prompt to ignore the irrelevant parts of the payload and focus only on the three fields it needs for subsequent reasoning steps.
- **C)** Switch to a model with a larger context window so the full payload fits without crowding out later turns and the agent can scan the raw data directly.
- **D)** Reduce the call frequency by caching the last response and reusing it across turns, which slows context fill even though each individual response remains oversized.

---

### Q29

A team's agent sometimes returns a conversational answer when the pipeline expects structured data, causing intermittent downstream failures that are hard to reproduce.

Which statement about `tool_choice` explains the fix?

- **A)** `none` guarantees structured output because it disables tool calls and forces the model to produce a clean, undecorated text response that a parser can consume reliably.
- **B)** `tool_choice` controls only which tools appear in the context window, not whether the model actually calls one, so it cannot address the intermittent plain-text responses.
- **C)** Forcing a specific tool with `tool_choice` ensures the response carries that tool call rather than ending the turn with plain text.
- **D)** `auto` guarantees a tool call whenever tools are present in the request, because the model defaults to using tools when they are available and applicable to the turn.

---

### Q30

An engineer adds an MCP server that provides 30 tools, but the agent only ever needs 3 of them.

Which mitigation matches the guidance on tool explosion?

- **A)** Keep all 30 tools and raise the iteration cap to give the agent more turns to evaluate its options before committing to a selection on each step of the task.
- **B)** Limit which servers are connected or filter tools before exposing them to the agent.
- **C)** Keep all 30 tools and set `tool_choice` to `any` to force a selection on every turn, which prevents the agent from stalling when the large toolset makes the decision costly.
- **D)** Keep all 30 tools and write longer, more detailed descriptions for each one to reduce confusion, since clearer documentation can compensate for a large toolset.

---

### Q31

A tool's schema marks `customer_id` as required, but in practice the model sometimes calls it without one.

Which statement about JSON Schema in tool definitions is accurate?

- **A)** `required` is purely decorative documentation; the model reads it as a hint but the SDK ignores it entirely when constructing the tool definition sent to the API.
- **B)** `required` can only be applied to string-typed properties; applying it to numeric or boolean fields causes the API to silently drop the constraint during schema parsing.
- **C)** The API fully enforces `required` constraints and rejects non-conforming calls before they reach the tool implementation, so no application-level validation is needed.
- **D)** `required` guides the model to include those properties, but a validation layer is still needed because the schema alone is not full enforcement.

---

### Q32

A team wants to validate both the input the model generates for a tool and the structured data it returns, in Python.

Which approach matches the guidance?

- **A)** Rely on the JSON Schema in the tool definition alone, since the API enforces it bidirectionally and any deviation triggers an error before the tool code runs.
- **B)** Use Pydantic — with Instructor layering additional validation on top — to validate data in and out.
- **C)** Validate only the model's structured output, since the tool input is generated from a strict schema and any conformance issues are caught automatically at the API boundary.
- **D)** Validate in the downstream service after data has been persisted, since that is the point where a schema violation would first cause a detectable application error.

---

### Q33

An agent's system prompt says "Never call external APIs without user confirmation." A tool description says "Call this immediately to fetch live pricing." The agent hesitates unpredictably.

What is the lesson?

- **A)** Tool descriptions always override conflicting system prompt instructions because the model resolves tool-level context after system-prompt-level context in its attention pass.
- **B)** The model should be replaced with one that has stronger instruction-following capability, since a well-tuned model should be able to resolve the conflict by preferring the more specific instruction.
- **C)** System prompts can contain keyword-sensitive instructions that override well-written tool descriptions, so both must be reviewed together for conflicts.
- **D)** Copying the tool description into the system prompt consolidates all guidance in one place and eliminates the tension between the two instruction sources for this tool.

---

### Q34

An engineer needs an agent that can answer from its own knowledge when it can, and use tools only when needed.

Which `tool_choice` setting matches?

- **A)** `none`
- **B)** `auto`
- **C)** `any`
- **D)** `tool`

---

### Q35

A permission rule must allow only the `create_issue` tool from an MCP server named `linear`, and nothing else from it.

Which form is correct?

- **A)** `mcp__linear`
- **B)** `mcp__linear__create_issue`
- **C)** `linear__create_issue`
- **D)** `mcp__create_issue`

---

### Q36

A tool named `escalate_to_human` exists alongside `process_refund` and `lookup_order`. The agent escalates far too often, including cases it could resolve.

Which description change most likely helps?

- **A)** Set `tool_choice` to `tool` on `process_refund` to redirect the agent toward resolution, preventing escalation calls while the refund path is available and applicable.
- **B)** Remove the escalation tool from the toolset entirely so the agent is structurally prevented from escalating any case, forcing it to resolve every situation independently.
- **C)** Rename it to `last_resort_escalation` to signal lower priority through the name, since the model uses tool names as strong signals when deciding between semantically similar options.
- **D)** State in the description the specific conditions that warrant escalation and, equally, when it is not appropriate.

---

### Q37

A tool's `input_schema` has an optional field `category_detail`. The team wants it to be effectively required whenever `category` is `other`.

Which approach matches the guidance for schema design?

- **A)** Split into two separate tools — one for non-other categories and one for the other case — so each tool's schema is unconditionally simple and the model never faces a conditional field.
- **B)** Express the conditional requirement in the field descriptions so the model understands when the optional field must be provided.
- **C)** Mark `category_detail` as required unconditionally and instruct the model to send an empty string for categories where it is irrelevant, accepting the noise in exchange for consistency.
- **D)** Leave the schema as-is, validate `category_detail` downstream on every call, and re-prompt the model with an error message whenever the field is missing for an `other` ticket.

---

### Q38

An MCP integration was added but the agent never uses the new tools. The server process starts without errors.

Which verification step comes first?

- **A)** Raise the agent's iteration cap to give it more turns, since the tools may be present but the agent hasn't reached the point in the task flow where they become relevant.
- **B)** Switch to a larger model that has broader tool-awareness capabilities, since smaller models sometimes fail to recognize newly registered tools in a dense toolset.
- **C)** Confirm the tools were actually discovered and appear in the agent's available toolset.
- **D)** Rewrite the tool descriptions to make them more prominent and distinctive, using stronger action verbs and explicit trigger phrases that the model will match to common task patterns.

---

### Q39

A tool returns `{"status": "valid_empty"}` in one case and `{"status": "access_failure"}` in another.

What does this design accomplish?

- **A)** It satisfies the JSON Schema `required` constraint, ensuring the response always includes the mandatory status field and passes schema validation at the API boundary.
- **B)** It reduces payload size compared to returning a null, since a short string is more compact than a null value followed by an explanatory field in the error branch.
- **C)** It signals the Messages API to evaluate the status value and decide automatically whether to retry the tool call or pass the result through to the next reasoning step.
- **D)** It lets the agent distinguish "nothing matched" from "I could not reach the data," enabling the correct follow-up action for each case.

---

### Q40

A team is designing the toolset for a customer support agent handling returns, billing disputes, and account issues, backed by MCP tools.

Which principle should guide how many tools to expose?

- **A)** Expose tools dynamically based on detected customer sentiment, since a frustrated customer benefits from a wider set of resolution options while a satisfied one needs fewer tools.
- **B)** Expose the smallest set that covers the role; more tools degrade selection quality rather than adding capability.
- **C)** Expose one tool per backend endpoint to maximize granularity, since fine-grained tools give the agent precise control and avoid the need for multi-purpose tools with complex schemas.
- **D)** Expose every tool the backend offers so the agent is never blocked; a capable model can select correctly even from a large toolset when descriptions are sufficiently detailed.

---

### Q41

A subagent fails when its MCP tool cannot authenticate. The failure surfaces to the coordinator as a raw stack trace, and the coordinator aborts.

Which tool design would have helped?

- **A)** A longer stack trace with more frames and variable state at each level, giving the coordinator richer debugging context to decide whether to retry or escalate the failure.
- **B)** Suppressing the error entirely and returning an empty result so the coordinator can continue the task without interruption, logging the authentication failure silently in the background.
- **C)** Returning the error as plain prose so the coordinator can parse the natural language description and determine the appropriate recovery action without requiring structured parsing.
- **D)** A structured error identifying the failure category — authentication — so the agent can map error type to action rather than parsing a trace.

---

### Q42

An engineer must expose an operation that writes to a ticketing system and, separately, the current list of open tickets which agents only ever read.

How should these be modeled in MCP?

- **A)** The write as a resource and the ticket list as a tool, since resources support both reading and writing while tools are reserved for operations that do not return persistent data.
- **B)** Both as tools, because both operations interact with the same ticketing system backend and consistency of interface reduces the cognitive load on agents using the server.
- **C)** The write operation as a tool, and the open ticket list as a resource.
- **D)** Both as resources, since both involve returning data from the ticketing system to the agent and resources provide a more efficient transfer path for structured list data.

---

### Q43

A tool description says: "Searches the knowledge base. Input: a natural language query string. Use for policy and how-to questions. Do not use for account-specific data — use `get_customer` for that."

Which qualities does this description demonstrate?

- **A)** Purpose, input format, use-case boundary, and its relationship to a semantically adjacent tool.
- **B)** Authentication scope, the originating MCP server, and the security context required to invoke the tool in production environments with strict access controls.
- **C)** Rate limits, per-call usage cost, quota enforcement rules, and the behavior the agent should expect when the monthly quota is exhausted mid-task.
- **D)** Implementation details, internal error handling behavior, and the retry strategy the tool applies before surfacing a failure to the calling agent.

---

### Q44

A developer wants to confirm which resources a connected MCP server exposes.

Which built-in capability applies?

- **A)** WebFetch pointed at the server's base URL to retrieve its manifest, since MCP servers expose a standard discovery endpoint that returns the resource catalog as JSON.
- **B)** Glob pointed at the server's installation directory to enumerate its resource definition files and infer the exposed URIs from the file naming convention.
- **C)** The tool that lists resources exposed by connected MCP servers.
- **D)** Grep searching the server's source code for resource registration calls, which reveals all resources whether or not they are currently active in the running process.

---

### Q45

A pipeline requires that the extraction tool is called on every single document, with no exceptions, because a missing call silently drops a record.

Which configuration matches?

- **A)** A post-processing validation step that flags any record with a missing extraction result and re-queues it for a second pass through the pipeline before the batch is marked complete.
- **B)** A retry loop that detects turns without a tool call in the response and re-prompts the model until extraction appears, with exponential backoff to avoid hammering the API.
- **C)** `tool_choice` forcing that specific tool, ensuring the model cannot end the turn with a plain text response.
- **D)** `tool_choice: auto` combined with a strong system prompt instruction saying "always call the extraction tool," trusting that the model will comply consistently across all document types.

---

### Q46

An agent has both a `read_file` MCP tool from a filesystem server and the built-in Read tool. It uses them inconsistently.

Which consideration applies?

- **A)** Overlapping tools create ambiguous selection; avoid exposing two tools that do the same job, or draw a clear boundary in their descriptions.
- **B)** MCP tools always take precedence over built-in tools when both are present, so the inconsistency will resolve itself once the model learns the precedence rule through repeated use.
- **C)** Built-in tools always take precedence over MCP tools in every scenario, so the `read_file` MCP tool is effectively unreachable and should be removed to avoid confusing the model.
- **D)** The duplication is harmless because both tools produce the same bytes for any given path, so the agent's choice between them has no observable effect on downstream task outcomes.

---

### Q47

A team must allow every tool from an MCP server named `stripe` with a single permission rule.

Which form is correct?

- **A)** `stripe__*`
- **B)** `mcp(stripe)`
- **C)** `mcp__stripe`
- **D)** `Bash(stripe *)`

---

### Q48

A tool's schema uses a description on each property to guide the model's choices, rather than relying on property names alone.

Which statement is accurate?

- **A)** Descriptions make `type` declarations unnecessary because the model infers the expected data type from the description text and formats its output accordingly.
- **B)** The model reads property descriptions only when the field is marked as required; optional fields without a required flag have their descriptions skipped during generation.
- **C)** Descriptions guide the model's generation and should disambiguate fields and encode constraints the names alone cannot express.
- **D)** Descriptions are not read by the model during generation and serve exclusively as documentation for human developers inspecting the tool definition.

---

### Q49

An agent needs to read a specific MCP resource whose URI is already known.

Which built-in capability applies?

- **A)** WebFetch, pointed at the URI as a web address, since MCP resource URIs follow the HTTP URL convention and can be fetched with standard web tooling.
- **B)** Read, pointed at the URI as a file path, which works for local filesystem URIs and falls back gracefully when the URI resolves to a remote MCP resource instead.
- **C)** Bash with `curl` to fetch the URI directly from the command line, bypassing the MCP protocol layer and receiving the raw response without schema normalization.
- **D)** The tool that reads a specific MCP resource by URI.

---

### Q50

A customer support agent's `process_refund` tool fails validation because the refund amount exceeds the order total. The agent retries the identical call four times before giving up.

What is missing from the error design?

- **A)** A signal that this class of error is not worth retrying, since the input is invalid rather than the service being temporarily unavailable.
- **B)** A higher retry limit so the service eventually processes the amount after enough attempts, since validation thresholds sometimes fluctuate under load.
- **C)** A longer timeout on the refund service so it has more processing time to evaluate edge cases and potentially approve amounts that initially appear to exceed the order total.
- **D)** A fallback to a secondary refund provider whose validation rules may be more permissive and might accept the amount that the primary provider rejected.

---

### Q51

An engineer asks whether `tool_choice` is available when using the Claude Agent SDK's higher-level agent loop or only in the lower-level SDK.

Which statement matches the course material?

- **A)** `tool_choice` is exclusively available in the higher-level Agent SDK, where the agent loop abstraction exposes it as a per-step configuration option not present in the raw API.
- **B)** `tool_choice` is a parameter of the lower-level Anthropic SDK API call.
- **C)** `tool_choice` is a persistent key in the Claude Code `settings.json` configuration file that applies globally to every API call made during a session.
- **D)** `tool_choice` is a field in MCP server configuration that tells the server which of its tools should be preferred when the client does not specify a target tool explicitly.

---

### Q52

A team designs a `get_weather` tool whose schema takes `location` as a string with no further constraint. The model passes values like "here", "the office", and "NYC".

Which schema improvement is most effective?

- **A)** Add a second tool specifically for resolving ambiguous location references before the weather call, creating a two-step flow that normalizes the input before the main query.
- **B)** Accept any value inside the tool and normalize it using a geocoding library, since runtime resolution handles a wider range of formats than any static schema constraint can anticipate.
- **C)** Constrain and describe the expected format — such as city and country, or coordinates — so the model generates conforming values.
- **D)** Make `location` optional and let the tool default to a configured fallback location when the field is absent, which avoids the ambiguous-string problem by eliminating unconstrained input.

---

### Q53

A research agent's role is to gather sources. A separate agent's role is to write the report. The team gives the writer the search tool "so it can check facts."

Which outcome should be expected?

- **A)** The writer will use the search tool, blurring the role boundary and duplicating the researcher's work.
- **B)** The writer will ignore the tool because its system prompt defines a clear role boundary, and well-tuned models reliably respect explicit role constraints over implicit tool affordances.
- **C)** The writer will invoke the search tool only when the researcher's output contains an unresolved citation or a claim that lacks a supporting source reference.
- **D)** The coordinator will automatically detect and block the writer's search calls since cross-agent tool usage without coordinator approval violates the platform's multi-agent permission model.

---

### Q54

An MCP server requires a bearer token in an HTTP header, supplied per environment.

Which configuration approach fits `.mcp.json`?

- **A)** Hardcode the token in the file and add `.mcp.json` to `.gitignore` so the secret never reaches the remote repository, accepting that developers must manually share the token out of band.
- **B)** Reference an environment variable in the headers using the supported `${VAR}` expansion syntax.
- **C)** Store the token in `CLAUDE.md` so the agent can read it at the start of each session and inject it into the appropriate header when making requests to the MCP server.
- **D)** Pass the token as an explicit argument to every individual tool call so the server can validate it per-request, keeping the configuration file free of any authentication material.

---

### Q55

A team is writing the description for a tool that both creates and updates records depending on whether an ID is supplied.

Which description quality matters most here?

- **A)** Stating the input condition that selects each behavior so the model knows which effect its call will have.
- **B)** Stating the average number of records returned or modified per call so the model can estimate the side-effect scope before deciding whether to invoke the tool.
- **C)** Stating the tool's current semantic version number and release date so the model knows whether it is working with the latest API contract or an older interface.
- **D)** Stating the underlying database engine, connection pool size, and schema version so the model can adapt its input format to match the storage backend's constraints.

---

### Q56

An agent operating on a codebase must decide between Grep and Bash with `grep` for searching file contents.

Which consideration favors the built-in tool?

- **A)** Bash results are automatically filtered for relevance by the runtime before reaching the model's context, reducing noise compared to the raw output of the built-in search tool.
- **B)** The built-in search tool is purpose-built for this and avoids requiring broad shell execution permission.
- **C)** The built-in Grep tool can execute arbitrary shell commands when the search pattern requires it, combining search and execution in a single tool call without needing Bash permissions.
- **D)** Bash with `grep` is measurably slower in every benchmark because it spawns a subprocess, whereas the built-in tool reads files through a native API with lower overhead.

---

### Q57

A tool returns a business rule violation — "customer is not eligible for this promotion." The agent's correct behavior is to explain this to the customer.

Which error design supports that?

- **A)** Mark it as an error, flag it as not worth retrying, and include a customer-facing explanation the agent can relay.
- **B)** Return it as a successful result with an empty data payload so the agent's loop continues without entering an error-handling branch that might suppress the explanation.
- **C)** Throw an exception so the loop terminates immediately and a human operator can craft a personalized explanation rather than relying on the agent to get the message right.
- **D)** Return a generic "operation failed" message and trust the agent to infer the appropriate customer-facing explanation from the context of the prior conversation turns.

---

### Q58

An agent calls a tool that fails, and the failure is returned as a tool result marked as an error rather than as a thrown exception.

What is the effect on the agent loop?

- **A)** The loop terminates immediately upon receiving the error-marked result, since any tool failure is treated as a fatal event that requires human intervention before the task can resume.
- **B)** The loop continues; the agent receives the error as a tool result and can reason about what to do next.
- **C)** The API retries the tool call transparently up to three times before surfacing the error, so the agent only sees a failure after the built-in retry budget is exhausted.
- **D)** The error result is silently discarded and replaced with an empty successful result so downstream tools that depend on this call's output receive a neutral value instead of an error.

---

### Q59

A team must choose where to put the rule "this subagent may read files but must never write them."

Which placement makes the rule structural?

- **A)** The subagent's system prompt as an explicit instruction, since a well-stated prohibition is reliably followed by current models and eliminates the need for structural enforcement.
- **B)** The subagent's tool assignment, granting read tools and withholding write tools.
- **C)** A reminder note in the coordinator's aggregation prompt, trusting it to verify at collection time that the subagent has not issued any write calls during the task.
- **D)** The description field of each write tool, warning agents not to call it under this role, since the model reads tool descriptions before deciding to invoke and will respect a prohibition stated there.

---

### Q60

An engineer is deciding between exposing a cross-system query as a tool the agent calls repeatedly to explore, or as content the agent can read directly.

Which consideration favors resources?

- **A)** Exposing content as resources reduces exploratory tool calls and improves efficiency when the agent mainly needs to read rather than act.
- **B)** Resources are model-controlled, giving the agent more autonomy over when and how frequently to fetch them compared to application-controlled tools that impose rate limits and quotas.
- **C)** Resources bypass the permission system entirely, allowing the agent to access cross-system data without requiring explicit approval rules for each data source in the integration.
- **D)** Resources can perform writes that tools handle poorly, making them the right choice whenever the agent needs to modify data in addition to reading it from the source system.

---

**End of block — 60 questions.**
