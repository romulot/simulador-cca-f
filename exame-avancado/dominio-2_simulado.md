# Exame Avançado — Bloco 2

**60 questions · multiple choice · one correct answer**

> Do not look at the answer key until you have finished the whole block.
> The domain and objective of each question are deliberately not shown.

---

### Q1

A support agent has two tools: `lookup_order` ("Gets order information") and `get_order_status` ("Returns order status"). The agent frequently calls the wrong one, and sometimes calls both.

Which fix addresses the root cause?

- **A)** Add a system prompt line saying "be careful when choosing between similar tools."
- **B)** Remove `get_order_status` and let the agent infer status from `lookup_order`.
- **C)** Set `tool_choice` to `any` so the agent is forced to pick one.
- **D)** Rewrite both descriptions to state each tool's distinct purpose, its input format, when to use it, and explicitly when to use the other one instead.

---

### Q2

A `process_refund` tool fails because the order is outside the return window. The team wants the agent to explain the policy to the customer rather than retry.

Which error payload design is correct?

- **A)** Return success with a note in the message field explaining the refund did not happen.
- **B)** Return the error with a flag marking it non-retryable and a customer-friendly explanation of the business rule, so the agent communicates instead of looping.
- **C)** Return a generic failure so the agent retries until it succeeds.
- **D)** Raise an exception that terminates the agent loop.

---

### Q3

An engineer is defining a `tool_result` block in the Messages API for a tool call that failed.

Which field signals the failure?

- **A)** `status`, set to `"failed"`.
- **B)** `retryable`, set to `false`.
- **C)** `stop_reason`, set to `"error"`.
- **D)** `is_error`, set to `true` in the `tool_result` block.

---

### Q4

A `search_documents` tool returns an empty list in two very different situations: the query genuinely matched nothing, and the backend index was unreachable.

Why does this matter?

- **A)** It does not matter, because the agent should report "no results" in both cases.
- **B)** It only matters for logging, since the agent's behavior is identical.
- **C)** Both return empty but require completely different responses, so the payload must distinguish a valid empty result from an access failure.
- **D)** The agent can infer the difference from how long the call took.

---

### Q5

A structured data extraction pipeline must never return a conversational reply — downstream parsing fails if it does.

Which configuration guarantees a tool call?

- **A)** Set `tool_choice` to force the specific extraction tool, which means the model will not return a plain end-turn text response.
- **B)** Set `tool_choice` to `none` and parse the text.
- **C)** Set `tool_choice` to `auto` and instruct the model to always use the tool.
- **D)** Increase `max_tokens` so the tool call always fits.

---

### Q6

An agent has 40 tools loaded. Engineers observe it picking plausible but wrong tools, asking for clarification when the answer is obvious, and occasionally inventing tool combinations that do not exist.

What is the diagnosis?

- **A)** The model is too small for the number of tools.
- **B)** The tools need longer descriptions.
- **C)** `tool_choice` should be set to `any`.
- **D)** Too many tools degrade decision quality; the toolset should be reduced, preferring a small general-purpose set over many niche ones.

---

### Q7

A synthesis subagent — whose job is to combine findings from other agents — has a web search tool in its context. Logs show it running its own searches instead of synthesizing.

What explains this?

- **A)** When a tool exists in an agent's context, the model treats it as available and appropriate — presence implies permission — so the tool must be removed from that agent's toolset.
- **B)** Web search is required for synthesis, so this is correct behavior.
- **C)** The synthesis agent's system prompt is too short.
- **D)** The coordinator passed the wrong findings.

---

### Q8

A team connects five MCP servers. The agent now sees every tool from all five at once.

Which statement is accurate?

- **A)** Only the first server's tools are loaded until it is disconnected.
- **B)** All tools are discovered and loaded at connection time as a flat list, with no awareness of which server each came from.
- **C)** Tools are loaded lazily, one server at a time, as needed.
- **D)** Tools are grouped by server, and the agent selects a server first.

---

### Q9

An MCP server exposes a company handbook. Agents currently call a `search_handbook` tool repeatedly, making several exploratory calls before finding the right section.

Which MCP concept fits better?

- **A)** Convert the handbook into a second MCP server.
- **B)** Increase the agent's iteration cap so the exploratory calls complete.
- **C)** Add more parameters to the `search_handbook` tool.
- **D)** Expose the handbook content as resources — read-only addressable data — so it can be read directly rather than discovered through repeated tool calls.

---

### Q10

A `.mcp.json` file must reference an API token without hardcoding the secret in a file that goes into git.

Which mechanism applies?

- **A)** Storing the token in `CLAUDE.md` instead.
- **B)** Environment variable expansion in `.mcp.json`, using `${VAR}` or `${VAR:-default}` syntax.
- **C)** A placeholder string that Claude Code replaces at startup from the shell history.
- **D)** MCP servers cannot use secrets; the token must be passed per-call.

---

### Q11

A team wants an MCP server configuration checked into the repository so every developer gets it automatically when they clone.

Which file is correct?

- **A)** `.mcp.json` at the project root, which is the project-scope configuration shared with the team.
- **B)** The managed settings file.
- **C)** `.claude/settings.local.json`.
- **D)** `~/.claude.json`, the user-scope configuration.

---

### Q12

The same MCP server name is defined at local, project, and user scope with different commands.

Which one does Claude Code connect to?

- **A)** All three simultaneously, with tools namespaced by scope.
- **B)** The project scope always wins, because it is checked into the repository.
- **C)** The user scope, because it is the most personal.
- **D)** The highest-precedence scope, with local taking precedence over project, and project over user.

---

### Q13

A coordinator delegates to three subagents: a searcher, an analyst, and a report writer. The team wants each to be unable to invoke tools outside its role.

Which approach is correct?

- **A)** Give all three the full toolset and audit misuse after the fact.
- **B)** Give all three the full toolset and describe their roles in their system prompts.
- **C)** Give all three the full toolset and use `tool_choice: any` on each call.
- **D)** Assign each subagent only the tools required for its role, which also reduces each agent's decision complexity.

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

- **A)** Set `tool_choice` to `any` so the model calls something.
- **B)** List the tools in the desired order in the tools array.
- **C)** Make the dependency explicit — the refund tool requires the account tier as an input it cannot obtain on its own, so the prerequisite call must happen first.
- **D)** Rely on the model calling them alphabetically.

---

### Q16

A tool description reads: "Use this tool to get data." The agent calls it with malformed input roughly one call in five.

Which aspect of tool description design is missing?

- **A)** The tool's average latency.
- **B)** A warning that the tool is expensive.
- **C)** The input format and the constraints on each field, which the description should state so the model generates conforming arguments.
- **D)** The tool's implementation language.

---

### Q17

An agent must always take an action on every turn — it can never respond with plain text — but which action is appropriate varies.

Which `tool_choice` setting matches?

- **A)** `tool`, which forces one specific named tool.
- **B)** `auto`, which lets the model decide whether to use a tool.
- **C)** `any`, which requires a tool call but lets the model choose which tool.
- **D)** `none`, which prevents tool use.

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

- **A)** As a message telling the user to try again later.
- **B)** As an empty successful result.
- **C)** As a thrown exception that ends the agent loop.
- **D)** As an error the agent can reason about — marked as an error, with the failure described and identified as transient so a retry is appropriate.

---

### Q20

An engineer asks what practical difference exists between MCP tools and MCP resources.

Which statement is correct?

- **A)** Tools are synchronous and resources are asynchronous.
- **B)** Tools are actions the agent executes; resources are read-only data the agent consumes.
- **C)** Resources are deprecated in favor of tools.
- **D)** Tools come from remote servers and resources from local files.

---

### Q21

An engineer wants to guarantee that the model produces output conforming to a strict JSON schema, with no prose around it.

Which method is most reliable?

- **A)** Define a tool whose `input_schema` is the required JSON Schema, and force that tool with `tool_choice`.
- **B)** Ask the model in the prompt to "respond only with valid JSON."
- **C)** Ask for JSON and increase `max_tokens` so it is never truncated.
- **D)** Ask for JSON and strip any surrounding prose with a regular expression.

---

### Q22

A tool's `input_schema` defines a `category` property with an enum of `billing`, `shipping`, and `technical`. Real tickets sometimes fit none of these, and the model forces them into the closest match.

Which schema improvement addresses this?

- **A)** Add an explicit fallback value such as `other` to the enum, so the model has an accurate option instead of being forced to guess.
- **B)** Make the field optional so the model can omit it.
- **C)** Remove the enum and accept free text.
- **D)** Add a system prompt instruction to be careful with categorization.

---

### Q23

A team writes two MCP tools for a payments server: `create_charge` and `create_payment_intent`. The agent routes requests to the wrong one about a third of the time.

Which description change helps most?

- **A)** Rename them to `tool_a` and `tool_b` to remove semantic confusion.
- **B)** Document the difference in the server's README.
- **C)** Merge them into one tool with a `mode` parameter.
- **D)** State in each description how it differs from the other and which situations call for each, since they are semantically similar.

---

### Q24

A subagent whose role is writing the final report has `Bash`, `Edit`, and `Write` in its toolset "in case it needs them."

What is the risk?

- **A)** The extra tools consume the agent's output tokens.
- **B)** The tools will time out and fail the report.
- **C)** There is no risk; unused tools are ignored.
- **D)** Unneeded tools expand the decision surface and invite out-of-role invocations, because tool presence reads as permission.

---

### Q25

A developer must decide which built-in tool to use to run the project's test suite.

Which is correct?

- **A)** Grep, which can run commands against file contents.
- **B)** Read, after loading the test runner's source.
- **C)** Bash, which executes shell commands.
- **D)** Glob, which resolves the test file patterns.

---

### Q26

An MCP tool returns an error object that includes a category, a human-readable description, and a boolean indicating whether retrying is appropriate.

Which statement about that boolean is accurate?

- **A)** It is part of the error payload that the tool author designs so the agent can map error type to action; it is not a parameter of the Messages API itself.
- **B)** It replaces the need to mark the result as an error.
- **C)** It is a required field of the Messages API `tool_result` block.
- **D)** It instructs the API to retry the call automatically.

---

### Q27

An agent is told to find every file in the repository matching `**/*.test.ts` and then search within those files for `describe(`.

Which tool sequence is correct?

- **A)** Read on the repository root, then Bash to filter.
- **B)** Bash with `find` and `grep`, because built-in tools cannot chain.
- **C)** Grep to find the files, then Glob to search inside them.
- **D)** Glob to find the files by pattern, then Grep to search inside them.

---

### Q28

A tool that queries an internal API returns a 4,000-line JSON payload, of which the agent needs three fields. Context fills quickly and the agent's later reasoning degrades.

Which fix is appropriate?

- **A)** Filter the response inside the tool so only the needed fields are returned to the agent.
- **B)** Ask the agent to ignore the irrelevant parts of the payload.
- **C)** Increase the context window by switching models.
- **D)** Call the tool less often.

---

### Q29

A team's agent sometimes returns a conversational answer when the pipeline expects structured data, causing intermittent downstream failures that are hard to reproduce.

Which statement about `tool_choice` explains the fix?

- **A)** `none` guarantees structured output because the model must format it itself.
- **B)** `tool_choice` only affects which tools are visible, not whether they are called.
- **C)** Forcing a specific tool means the response will carry that tool call rather than ending the turn with plain text.
- **D)** `auto` guarantees a tool call whenever tools are provided.

---

### Q30

An engineer adds an MCP server that provides 30 tools, but the agent only ever needs 3 of them.

Which mitigation matches the guidance on tool explosion?

- **A)** Keep all 30 and raise the iteration cap.
- **B)** Limit which servers are connected or filter the tools before exposing them to the agent.
- **C)** Keep all 30 and set `tool_choice` to `any`.
- **D)** Keep all 30 and write longer descriptions.

---

### Q31

A tool's schema marks `customer_id` as required, but in practice the model sometimes calls it without one.

Which statement about JSON Schema in tool definitions is accurate?

- **A)** `required` is only documentation and has no effect on generation.
- **B)** `required` can only be applied to string properties.
- **C)** `required` is enforced by the API, which rejects non-conforming calls before they reach the tool.
- **D)** `required` expresses which properties must be provided, and the model reads the schema to generate conforming input — but a validation layer is still needed, because the schema is not full validation.

---

### Q32

A team wants to validate both the input the model generates for a tool and the structured data it returns, in Python.

Which approach matches the guidance?

- **A)** Rely on the JSON Schema in the tool definition alone.
- **B)** Use a validation library such as Pydantic — with something like Instructor layering more validation on top — to validate data in and out.
- **C)** Validate only the output, since the input comes from the model.
- **D)** Validate in the downstream service after storage.

---

### Q33

An agent's system prompt says "Never call external APIs without user confirmation." A tool description says "Call this immediately to fetch live pricing." The agent hesitates unpredictably.

What is the lesson?

- **A)** Tool descriptions always win over system prompts.
- **B)** The model should be switched to one with stronger instruction following.
- **C)** System prompts can contain keyword-sensitive instructions that override well-written tool descriptions, so both must be reviewed together for conflicts.
- **D)** The tool description should be moved into the system prompt.

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

- **A)** Set `tool_choice` to `tool` on `process_refund`.
- **B)** Remove the escalation tool entirely.
- **C)** Rename it to `last_resort_escalation`.
- **D)** State explicitly in the description the conditions under which escalation is appropriate and, just as importantly, when it is not.

---

### Q37

A tool's `input_schema` has an optional field `category_detail`. The team wants it to be effectively required whenever `category` is `other`.

Which approach matches the guidance for schema design?

- **A)** Split the tool into two tools, one per case.
- **B)** Express the conditional requirement in the field descriptions, so the model understands when the optional field must be provided.
- **C)** Mark it as required unconditionally and accept empty strings.
- **D)** Validate it downstream and re-prompt on failure.

---

### Q38

An MCP integration was added but the agent never uses the new tools. The server process starts without errors.

Which verification step comes first?

- **A)** Increase the agent's iteration cap.
- **B)** Switch the agent to a larger model.
- **C)** Confirm the tools were actually discovered — that the server is connected and its tools appear in the agent's available toolset.
- **D)** Rewrite the tool descriptions.

---

### Q39

A tool returns `{"status": "valid_empty"}` in one case and `{"status": "access_failure"}` in another.

What does this design accomplish?

- **A)** It satisfies the JSON Schema `required` constraint.
- **B)** It reduces the payload size.
- **C)** It tells the API whether to retry automatically.
- **D)** It lets the agent take different actions for "there is genuinely nothing" versus "I could not reach the data," which look identical without the distinction.

---

### Q40

A team is designing the toolset for a customer support agent handling returns, billing disputes, and account issues, backed by MCP tools.

Which principle should guide how many tools to expose?

- **A)** Expose tools dynamically based on the customer's sentiment.
- **B)** Expose the smallest set that covers the role, because more tools degrade selection quality rather than adding capability.
- **C)** Expose one tool per backend endpoint for maximum granularity.
- **D)** Expose every tool the backend offers, so the agent is never blocked.

---

### Q41

A subagent fails when its MCP tool cannot authenticate. The failure surfaces to the coordinator as a raw stack trace, and the coordinator aborts.

Which tool design would have helped?

- **A)** A longer stack trace with more frames.
- **B)** Suppressing the error and returning an empty result.
- **C)** Returning the error as plain prose in the tool result.
- **D)** A structured error identifying the failure category — authentication — so the agent can map error type to action rather than parsing a trace.

---

### Q42

An engineer must expose an operation that writes to a ticketing system and, separately, the current list of open tickets which agents only ever read.

How should these be modeled in MCP?

- **A)** The write as a resource and the list as a tool.
- **B)** Both as tools, since both involve the ticketing system.
- **C)** The write operation as a tool, and the open ticket list as a resource.
- **D)** Both as resources, since both return data.

---

### Q43

A tool description says: "Searches the knowledge base. Input: a natural language query string. Use for policy and how-to questions. Do not use for account-specific data — use `get_customer` for that."

Which qualities does this description demonstrate?

- **A)** Purpose, input format, use-case boundary, and its relationship to a semantically adjacent tool.
- **B)** Authentication scope and server origin.
- **C)** Rate limits and cost.
- **D)** Implementation detail and error handling.

---

### Q44

A developer wants to confirm which resources a connected MCP server exposes.

Which built-in capability applies?

- **A)** WebFetch, against the server's URL.
- **B)** Glob, pointed at the server's directory.
- **C)** The tool that lists resources exposed by connected MCP servers.
- **D)** Grep, searching the server's source.

---

### Q45

A pipeline requires that the extraction tool is called on every single document, with no exceptions, because a missing call silently drops a record.

Which configuration matches?

- **A)** A validation step that flags dropped records after the fact.
- **B)** A retry loop that re-prompts when no tool call appears.
- **C)** `tool_choice` forcing that specific tool, which means the model will not end the turn with a plain text response.
- **D)** `tool_choice: auto` plus a strong instruction.

---

### Q46

An agent has both a `read_file` MCP tool from a filesystem server and the built-in Read tool. It uses them inconsistently.

Which consideration applies?

- **A)** Overlapping tools create ambiguous selection; the toolset should avoid exposing two tools that do the same job, or their descriptions must draw a clear boundary.
- **B)** MCP tools always take precedence over built-in tools.
- **C)** Built-in tools always take precedence over MCP tools.
- **D)** The duplication is harmless because both produce the same result.

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

- **A)** Descriptions replace the need for `type` declarations.
- **B)** Descriptions are only read when the field is required.
- **C)** Descriptions guide the model's generation and should be used to disambiguate fields and encode constraints the names cannot express.
- **D)** Descriptions are ignored by the model and serve only as developer documentation.

---

### Q49

An agent needs to read a specific MCP resource whose URI is already known.

Which built-in capability applies?

- **A)** WebFetch, pointed at the URI.
- **B)** Read, pointed at the URI.
- **C)** Bash with `curl`.
- **D)** The tool that reads a specific MCP resource by URI.

---

### Q50

A customer support agent's `process_refund` tool fails validation because the refund amount exceeds the order total. The agent retries the identical call four times before giving up.

What is missing from the error design?

- **A)** A signal that this class of error is not worth retrying, because the input is invalid rather than the service being unavailable.
- **B)** A higher retry limit so it eventually succeeds.
- **C)** A longer timeout on the refund service.
- **D)** A fallback to a second refund provider.

---

### Q51

An engineer asks whether `tool_choice` is available when using the Claude Agent SDK's higher-level agent loop or only in the lower-level SDK.

Which statement matches the course material?

- **A)** `tool_choice` is only available in the Agent SDK.
- **B)** `tool_choice` is a parameter of the lower-level Anthropic SDK API call.
- **C)** `tool_choice` is a Claude Code settings key.
- **D)** `tool_choice` is an MCP server configuration field.

---

### Q52

A team designs a `get_weather` tool whose schema takes `location` as a string with no further constraint. The model passes values like "here", "the office", and "NYC".

Which schema improvement is most effective?

- **A)** Add a second tool for ambiguous locations.
- **B)** Accept the values and normalize them in the tool implementation only.
- **C)** Constrain and describe the expected format — for example, city and country, or coordinates — so the model generates conforming values.
- **D)** Make `location` optional.

---

### Q53

A research agent's role is to gather sources. A separate agent's role is to write the report. The team gives the writer the search tool "so it can check facts."

Which outcome should be expected?

- **A)** The writer will use the search tool, blurring the role boundary and duplicating the researcher's work.
- **B)** The writer will ignore the tool because its system prompt does not mention it.
- **C)** The writer will only use it when the researcher fails.
- **D)** The coordinator will block the call automatically.

---

### Q54

An MCP server requires a bearer token in an HTTP header, supplied per environment.

Which configuration approach fits `.mcp.json`?

- **A)** Hardcode the token and add `.mcp.json` to `.gitignore`.
- **B)** Reference an environment variable in the headers using the supported expansion syntax.
- **C)** Store the token in `CLAUDE.md` for the agent to read.
- **D)** Pass the token as an argument to every tool call.

---

### Q55

A team is writing the description for a tool that both creates and updates records depending on whether an ID is supplied.

Which description quality matters most here?

- **A)** Stating the input condition that selects each behavior, so the model knows which effect its call will have.
- **B)** Stating the average response size.
- **C)** Stating the tool's version number.
- **D)** Stating the database engine used.

---

### Q56

An agent operating on a codebase must decide between Grep and Bash with `grep` for searching file contents.

Which consideration favors the built-in tool?

- **A)** Bash results are automatically filtered for relevance.
- **B)** The built-in search tool is purpose-built for this and avoids requiring broad shell execution permission.
- **C)** The built-in tool can execute arbitrary commands if needed.
- **D)** Bash is faster in every case.

---

### Q57

A tool returns a business rule violation — "customer is not eligible for this promotion." The agent's correct behavior is to explain this to the customer.

Which error design supports that?

- **A)** Mark it as an error, flag it as not worth retrying, and include a customer-facing explanation the agent can relay.
- **B)** Return it as a successful result with an empty payload.
- **C)** Throw an exception so the loop terminates and a human takes over.
- **D)** Return a generic "operation failed" message.

---

### Q58

An agent calls a tool that fails, and the failure is returned as a tool result marked as an error rather than as a thrown exception.

What is the effect on the agent loop?

- **A)** The loop terminates immediately.
- **B)** The loop continues; the agent receives the error as a tool result and can reason about what to do next.
- **C)** The API retries the call transparently and the agent never sees the error.
- **D)** The error is discarded and an empty result is substituted.

---

### Q59

A team must choose where to put the rule "this subagent may read files but must never write them."

Which placement makes the rule structural?

- **A)** The subagent's system prompt.
- **B)** The subagent's tool assignment, granting read tools and withholding write tools.
- **C)** A note in the coordinator's aggregation prompt.
- **D)** The tool descriptions of the write tools.

---

### Q60

An engineer is deciding between exposing a cross-system query as a tool the agent calls repeatedly to explore, or as content the agent can read directly.

Which consideration favors resources?

- **A)** Exposing content as resources reduces exploratory tool calls and improves efficiency when the agent mainly needs to read data rather than act on it.
- **B)** Resources are invoked by the model rather than the application.
- **C)** Resources bypass the permission system.
- **D)** Resources can perform writes that tools cannot.

---

**End of block — 60 questions.**
