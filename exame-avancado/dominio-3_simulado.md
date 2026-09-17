# Exame Avançado — Bloco 3

**60 questions · multiple choice · one correct answer**

> Do not look at the answer key until you have finished the whole block.
> The domain and objective of each question are deliberately not shown.

---

### Q1

An organization's security team must ensure that no developer can enable `--dangerously-skip-permissions`, regardless of what they put in their personal or project settings.

Where must this be configured?

- **A)** In managed settings, applied organization-wide and taking precedence over all other scopes.
- **B)** In each developer's `~/.claude/settings.json`, so each one is individually restricted, though they can edit that file themselves.
- **C)** In `.claude/settings.local.json`, which is excluded from git but still applies only to whoever checks out the project on their own machine.
- **D)** In the project's `.claude/settings.json`, which goes into the repository but can be overridden by any developer's user-level settings.

---

### Q2

A monorepo has Python services and a TypeScript frontend. Python files must follow one set of conventions and TypeScript files another. Today both sets live in a single root `CLAUDE.md`, and Claude frequently applies Python rules to `.ts` files.

What is the appropriate mechanism?

- **A)** A longer root `CLAUDE.md` with clearer headings for each language, so Claude can distinguish the sections by reading more carefully.
- **B)** A hook that rejects edits violating the wrong language's conventions, since enforcement at save time catches cross-language mistakes reliably.
- **C)** Path-specific rules under `.claude/rules/` with glob patterns, so each rule set is loaded only for the files it applies to.
- **D)** A slash command the developer runs to declare which language they are working in, so Claude knows which convention set to apply for that session.

---

### Q3

A CI job runs Claude Code to review pull requests. The job must be fully non-interactive, and a downstream script needs to parse the result programmatically.

Which invocation fits?

- **A)** `claude "<review prompt>"` piped into a JSON parser, since the default output is already structured.
- **B)** `claude -p "<review prompt>" --output-format json`
- **C)** `claude --resume --output-format json`, resuming the most recent session so context is preserved between runs.
- **D)** `claude -p "<review prompt>"` with the reviewer reading the terminal output and recording findings manually.

---

### Q4

A team's permission configuration contains all three of the following for the same command: an `allow` rule, an `ask` rule, and a `deny` rule.

Which applies?

- **A)** The deny rule, because evaluation order is deny → ask → allow and the most restrictive rule wins.
- **B)** The rule defined at the highest settings scope, regardless of its type, since managed settings always trump project and user settings.
- **C)** The allow rule, because explicit allows override any defaults and signal that someone deliberately granted access.
- **D)** The ask rule, because it sits between the two extremes and acts as a tie-breaker when allow and deny conflict.

---

### Q5

An engineer writes the permission rule `Bash(ls *)` expecting it to cover the `lsof` command as well.

What actually happens?

- **A)** It matches `lsof`, because `*` matches any characters including the absence of a space, so any string starting with `ls` qualifies.
- **B)** It matches every command starting with the letters `ls`, including `lsof` and `lsblk`, the same as `Bash(ls*)` without a space.
- **C)** It matches neither `ls -la` nor `lsof`, because wildcards are not supported in Bash permission rules at all.
- **D)** It does not match `lsof`, because the space in the pattern is significant — it matches `ls -la` but not `lsof`.

---

### Q6

A CI pipeline runs Claude Code unattended. There is no human available to approve tool prompts, and the job runs inside a disposable container.

Which statement about `--dangerously-skip-permissions` is correct here?

- **A)** It should never be used under any circumstance, including in CI pipelines, because policy must apply uniformly across all environments.
- **B)** It is required for any non-interactive run, because `-p` cannot function without it and will block waiting for approval otherwise.
- **C)** It is unnecessary, because CI runs default to `bypassPermissions` mode automatically when no terminal is attached.
- **D)** This is a legitimate use case: an automated pipeline inside a disposable container with no human approver, where risk is contained.

---

### Q7

A developer adds a deny rule blocking `npx` and enables the bubblewrap sandbox, believing the two layers together prevent Claude from downloading and executing arbitrary code. They also run with `--dangerously-skip-permissions`.

Which risk remains?

- **A)** Bubblewrap does not exist on Linux, so no sandbox is actually applied and all Bash commands run unrestricted on the host.
- **B)** The sandbox blocks the deny rule from being evaluated at all, so the `npx` deny is silently ignored inside the sandboxed process.
- **C)** With permissions auto-approved, Claude can reason that the sandbox is the obstacle and act to remove it — the sandbox becomes something it can opt out of.
- **D)** The deny rule silently stops working whenever a sandbox is active, because the sandbox's allow-list takes precedence over deny rules.

---

### Q8

A reviewer agent flags the same three "possible SQL injection" findings on every run. Two are ORM calls that are safe; developers now ignore the agent's output entirely.

Which change most reduces the false positive rate?

- **A)** Run the review twice and report only findings that appear in both runs, since random false positives are unlikely to recur on a second independent pass over the same code.
- **B)** Only report findings the agent rates above 80% confidence, since the model's internal confidence score reliably correlates with actual risk and filters out speculative flags.
- **C)** Ask the agent to double-check each finding before reporting it, giving the model a second reasoning pass to catch mistakes it made the first time.
- **D)** Supply explicit inclusion and exclusion criteria as persistent context — for example, "flag only when user input is concatenated directly into a query string; do not flag ORM calls or prepared statements."

---

### Q9

An engineer wants a reusable, parameterized workflow — "review the diff on this branch against our standards and output JSON" — available to the whole team from inside Claude Code.

Which mechanism fits best?

- **A)** A hook registered on `PostToolUse`, which fires automatically after each tool call and can run a shell command to trigger the review.
- **B)** A permission rule allowing the review tools, so the review can proceed without prompts interrupting the flow.
- **C)** A paragraph appended to the root `CLAUDE.md`, so the instructions are always present and any developer can invoke the review by describing it.
- **D)** A slash command checked into the project, which can carry its own prompt, tool restrictions, and output expectations.

---

### Q10

A developer runs Claude Code in a repository they have never seen and asks, "How does authentication work here?" Reading every file would blow the context window.

Which exploration strategy is appropriate?

- **A)** Read every file under `src/` sequentially until the picture is complete, since a thorough read avoids missing any cross-cutting dependency.
- **B)** Use Glob to locate candidate files by name, Grep to find where relevant symbols appear, then Read only the files those searches identify.
- **C)** Ask the model to answer from its general knowledge of authentication patterns, since common frameworks are well represented in training data.
- **D)** Run Bash with `cat` on the whole repository and let the model filter out what it needs, since the model can ignore irrelevant lines efficiently.

---

### Q11

A team wants Claude Code to always know the project's build commands and architectural conventions, in every session, without anyone pasting them.

Which mechanism is designed for this?

- **A)** A `CLAUDE.md` file in the project, which is loaded as persistent project context.
- **B)** A `PreToolUse` hook that injects the conventions before each tool call, so they are present at the moment Claude needs them.
- **C)** An environment variable in `settings.json` that carries the convention text, since environment variables are visible to the process at runtime.
- **D)** A skill that the developer invokes at the start of each session, encapsulating the conventions in a single named command.

---

### Q12

A generated test suite compiles and passes, but every test asserts only that a function returns without throwing. Coverage numbers look good; real regressions still ship.

Which change most improves the quality of generated tests?

- **A)** Raise the coverage threshold in CI to require more assertions, since a stricter coverage gate forces the generator to produce tests with greater depth.
- **B)** Ask for more tests per function to increase the chance of meaningful ones, since with enough volume some tests will naturally check return values.
- **C)** Switch the test generation to a larger model that writes better tests, since larger models have seen more real-world test suites and internalize stronger conventions.
- **D)** Provide existing test files as context, state the fixture conventions, and define explicitly what separates a meaningful behavioral assertion from a trivial one.

---

### Q13

An engineer keeps personal preferences — a preferred spinner style and an extra allowed directory — that should apply to this project only and must never reach the team repository.

Which file is correct?

- **A)** `.claude/settings.local.json` in the repository, which holds personal project-specific preferences and is not checked into git.
- **B)** `~/.claude/settings.json`, which applies to all projects on the machine, not just this one.
- **C)** `.claude/settings.json` in the repository, which is checked into git and visible to every team member.
- **D)** The managed settings file, which is org-wide and admin-controlled, not suitable for personal preferences.

---

### Q14

A permission rule is written as bare `Read` with no parentheses.

What does it cover?

- **A)** Nothing, because a pattern in parentheses is required for Read rules to have any effect.
- **B)** All reads of all files — the bare tool name means total coverage with no path filtering.
- **C)** Only reads of files in the project root directory, since the absence of a path defaults to the launch directory.
- **D)** Only reads of files not excluded by the project's `.gitignore`, since `.gitignore` patterns are applied automatically as a safety filter.

---

### Q15

A team wants to restrict Claude's web access so it may fetch from their internal documentation host but nothing else.

Which rule form applies?

- **A)** A Bash rule matching `curl *` to block curl-based fetches, covering all HTTP requests made through the shell.
- **B)** A Read rule with an absolute path pattern for the docs host, since Read handles all file and URL access uniformly.
- **C)** A deny rule on the WebSearch tool to block internet searches, which also prevents WebFetch from reaching outside domains.
- **D)** A WebFetch rule scoped by domain, such as `WebFetch(domain:docs.internal.example.com)`, with other domains denied.

---

### Q16

An engineer wants Claude to stop asking for confirmation on file edits for the remainder of the session, while still prompting for shell commands.

Which permission mode applies?

- **A)** `acceptEdits`
- **B)** `plan`, which prevents all file modifications and would require switching modes before any edit can proceed.
- **C)** `dontAsk`, which auto-denies tools that are not pre-approved rather than auto-accepting file edits.
- **D)** `bypassPermissions`, which skips every prompt including those for shell commands, removing the desired distinction.

---

### Q17

A team's root `CLAUDE.md` has grown to several hundred lines covering testing, deployment, style, and security. Sessions now start with a large context cost, and developers report Claude ignoring the middle sections.

Which restructuring is most appropriate?

- **A)** Keep only always-relevant guidance in `CLAUDE.md`, move conditional guidance into path-specific rules and skills that load when relevant, and import shared fragments instead of inlining them.
- **B)** Ask developers to paste the relevant section at the start of each session, so only the needed content enters the context and the model focuses on it immediately.
- **C)** Move the entire file into the system prompt via a settings override, since a system prompt is processed differently and avoids the lost-in-the-middle effect on user messages.
- **D)** Split the file into five files and import all five at the top of `CLAUDE.md`, which organizes the content without reducing the total tokens loaded.

---

### Q18

A CI review job occasionally runs for twenty minutes and consumes far more tokens than budgeted when a pull request is unusually large.

Which controls address this directly?

- **A)** A shorter prompt to reduce the input size, since the prompt tokens account for the majority of cost on large PRs.
- **B)** Running the job on a faster CI runner to cut wall-clock time, since the bottleneck is the time the model spends generating each response.
- **C)** Cost and turn limits on the CLI invocation, which cap runaway executions in automated contexts.
- **D)** Switching `--output-format` to text to reduce response verbosity, since JSON serialization adds overhead that inflates token counts.

---

### Q19

A developer wants Claude Code to review a change without the ability to modify the repository, and to return findings that a script can consume.

Which configuration satisfies both requirements?

- **A)** Run with `bypassPermissions` and review the diff manually afterward, reverting any edits the agent makes before merging.
- **B)** Run in `acceptEdits` mode and revert changes with git after the review, since git history makes any edits recoverable.
- **C)** Restrict the session to read-only tools via permission rules, and request structured JSON output.
- **D)** Ask Claude in the prompt not to edit anything, and parse its markdown response with a script that normalizes the formatting.

---

### Q20

An engineer needs to find every file whose name matches `*.service.ts` across a large repository.

Which built-in tool is designed for this?

- **A)** Glob
- **B)** Read, by iterating through a known directory listing and checking each filename.
- **C)** Grep, by searching for the pattern `service\.ts` in file paths returned by the filesystem.
- **D)** WebSearch, using the repository's file index if it has been published to a documentation site.

---

### Q21

A developer's first refactoring request produced code that ignored the project's error-handling convention. They are about to retry.

Which feedback is most likely to produce a correct result on the next attempt?

- **A)** "That was wrong, try again and follow our conventions this time," so Claude knows the previous output was rejected and must try differently.
- **B)** A request to rewrite the whole module from scratch, since a clean slate avoids the model anchoring on the flawed first attempt.
- **C)** A note that the output quality was disappointing, prompting the model to apply more effort on the retry.
- **D)** A concrete example of the convention applied to one affected function, plus the specific failure in the previous attempt.

---

### Q22

A reviewer finds eight separate problems in a generated migration script.

Which approach to feedback is most efficient?

- **A)** Send the two most important issues and hope the rest resolve themselves once those structural problems are fixed.
- **B)** Describe all eight issues in one consolidated message so the agent can evaluate them together and produce a single corrected version.
- **C)** Send each issue as its own message and let the agent fix them one at a time, since focused single-issue prompts are easier for the model to act on correctly.
- **D)** Discard the output and restart with the original prompt, since returning to the original context avoids compounding edits made on a flawed draft.

---

### Q23

An organization must guarantee that only an approved list of MCP servers can ever be configured by any user in any project.

Where does that allowlist belong?

- **A)** In each project's `.mcp.json`, defined per-project so each team controls its own approved servers.
- **B)** In `.claude/settings.local.json` for each developer's machine, so each person manages their own approved list.
- **C)** In managed settings, where the MCP allowlist is admin-defined and user additions are ignored.
- **D)** In each user's `~/.claude/settings.json`, applied per machine, which each user can edit to add their own servers.

---

### Q24

A team wants sessions older than a set number of days deleted automatically, and one high-security project must persist no transcripts at all.

Which statement is correct?

- **A)** Disabling persistence requires deleting the `.claude` directory before each run, since there is no configuration option for it.
- **B)** Session retention cannot be configured; transcripts are always kept for 30 days with no way to shorten that window.
- **C)** Transcripts are only stored when the session has been named with `/rename`; unnamed sessions are discarded automatically.
- **D)** A session retention period can be configured, and setting it to zero deletes all transcripts at startup and disables persistence — `/resume` then shows nothing.

---

### Q25

An engineer wants to search the contents of files for the regex `process\.env\.[A-Z_]+` across a repository.

Which built-in tool is designed for this?

- **A)** Read, by loading each file one at a time and scanning the text with a follow-up Grep on the loaded content.
- **B)** Bash with `find`, which locates files by name and can pipe results to a pattern matcher for content search.
- **C)** Glob, which finds files by name pattern and can then be combined with Read to inspect each file for the target string.
- **D)** Grep

---

### Q26

A developer has been iterating on a feature for two hours. Context is nearly full, but the work so far is still relevant and they do not want to lose it.

Which command applies?

- **A)** `/rename`, which labels the session for later retrieval but does not reduce the tokens currently in context.
- **B)** `/rewind`, which restores the session to an earlier point, discarding the most recent work along with the context it consumed.
- **C)** `/compact`, which summarizes the conversation to reduce token usage while keeping the thread going.
- **D)** `/clear`, which wipes the conversation history entirely, including all progress made in the last two hours.

---

### Q27

A developer finishes a feature and wants to start an unrelated task in the same terminal, with no carry-over from the previous conversation, while keeping the project's `CLAUDE.md` guidance in effect.

Which command applies?

- **A)** `/compact`, which summarizes rather than resets the conversation, so prior context still influences the new task.
- **B)** `/rewind`, which returns to an earlier state of the current task rather than starting a clean slate.
- **C)** `/clear`, which resets the current conversation but does not clear `CLAUDE.md` or auto memory.
- **D)** Restarting the terminal, which would also close any running processes and lose the current working directory state.

---

### Q28

A team must decide where to record the instruction "never commit directly to main." Every session in the repository must respect it, and it should be visible in code review.

Which location is appropriate?

- **A)** Each developer's `~/.claude/settings.json`, applied on every project they open, which scatters the rule across machines and is not reviewable in the repository.
- **B)** The project's `CLAUDE.md`, checked into the repository.
- **C)** A comment in the CI configuration file, visible to the pipeline only and not read by the Claude Code agent as context.
- **D)** A `.claude/settings.local.json` entry, excluded from version control and invisible in any code review.

---

### Q29

An agent took a wrong approach ten turns ago, and everything since then is built on that mistake. The developer wants to return to the state just before the wrong turn.

Which command applies?

- **A)** `/compact`
- **B)** `/resume`
- **C)** `/rewind`
- **D)** `/clear`

---

### Q30

A guidance rule should apply only when someone edits files under `infra/terraform/`, and should be invisible the rest of the time.

Which mechanism matches?

- **A)** A deny rule on edits to that directory, which blocks all changes until a human approves each one.
- **B)** A skill the developer must remember to invoke before editing, which relies on human memory and breaks if someone forgets.
- **C)** A path-specific rule with a glob pattern scoped to that directory.
- **D)** A section in the root `CLAUDE.md` titled "Terraform," which is loaded in every session even when no Terraform files are touched.

---

### Q31

A team's `settings.json` sets a default model for all sessions and also restricts which models users can pick.

Which statement is accurate?

- **A)** Both are supported: one setting overrides the default model for all sessions, another restricts the selectable models via `/model`, `--model`, or `ANTHROPIC_MODEL`.
- **B)** Model settings are only available in managed settings, not in project or user settings, so a team-level `settings.json` cannot configure them.
- **C)** Only the default model can be set; restricting the model picker is not a supported configuration option.
- **D)** Restricting the selectable models also removes the "Default" option from the picker, so users lose access to the organization's standard model.

---

### Q32

A security-sensitive repository must block Claude from reading `.env` files anywhere in the project, with no exceptions.

Which configuration is correct?

- **A)** An ask rule on Read for `.env`, so the developer can approve legitimate cases on a case-by-case basis.
- **B)** Adding `.env` to `.gitignore` so the file is hidden from version control and not surfaced in the @ file picker.
- **C)** A deny rule on Read matching the `.env` pattern, because deny is evaluated first and is the most restrictive.
- **D)** An instruction in `CLAUDE.md` telling Claude never to read `.env` files, since every session loads this file and the model will follow the directive.

---

### Q33

A developer wants a repeatable workflow that carries its own instructions and can be invoked by name, but whose long intermediate output should not remain in the main session.

Which configuration achieves the isolation?

- **A)** Define it in `CLAUDE.md` so it is always present and any developer can trigger it by referencing its name in a prompt.
- **B)** Define it as a slash command and run `/compact` to clean up afterwards, which summarizes the intermediate output rather than removing it.
- **C)** Define it as a hook on `PostToolUse` so it triggers automatically after each tool call without explicit invocation.
- **D)** Define it as a Skill or slash command with `context: fork` in its frontmatter, so it runs in an isolated subagent context.

---

### Q34

An automated PR review must produce output that a downstream service stores in a database, with one record per finding.

Which combination is appropriate?

- **A)** A non-interactive run with JSON output, and a prompt that specifies exactly the fields each finding must contain.
- **B)** A prompt requesting a clear, well-organized summary of all findings, since a well-structured prose report is easy to parse line by line.
- **C)** An interactive session whose terminal output is captured to a log file, then post-processed by a script that strips ANSI codes and UI chrome.
- **D)** A structured markdown report that the downstream service parses with regular expressions, taking advantage of markdown's consistent heading syntax.

---

### Q35

A Claude Code review job loads the wrong standards: it reviews a backend service against the frontend style guide.

Which configuration error is most likely?

- **A)** The review configuration does not scope which project standards to load for the files under review.
- **B)** The permission rules are too permissive, granting read access to both style guides so the model reads whichever it encounters first.
- **C)** The output format is markdown rather than JSON, causing the model to conflate guide names when formatting section headers.
- **D)** The model is too small to reliably distinguish between the two guides when both appear in the same context window.

---

### Q36

A team asks whether hooks can be disabled entirely for a locked-down environment.

Which statement is correct?

- **A)** Hooks can only be disabled one at a time, by removing each definition individually from whichever settings file defines it.
- **B)** Hooks cannot be disabled once defined in a project configuration; the only option is to remove the Claude Code installation.
- **C)** A managed setting can disable all hooks and the custom status line, overriding hook definitions from user, project, and plugin sources.
- **D)** Disabling hooks requires uninstalling Claude Code from the machine and reinstalling without the hooks extension package.

---

### Q37

A developer notices that the `@` file picker never suggests files listed in `.gitignore`, but they need to reference a local `.env.example` that is gitignored.

Which statement is accurate?

- **A)** Only managed settings can change the picker's behavior, so individual developers cannot enable gitignored files on their own machines.
- **B)** The picker always shows all files; if `.env.example` is missing from suggestions, the file must not actually exist on disk.
- **C)** The picker hides gitignored files by default, and that behavior is configurable.
- **D)** Gitignored files can never be referenced in a prompt under any configuration, since the picker exclusion is enforced at the permission level.

---

### Q38

A team wants Claude Code to run inside a sandbox so that shell commands cannot damage the host, and asks what the sandbox does and does not cover.

Which statement is accurate?

- **A)** The sandbox replaces the permission rule system entirely once enabled, making separate allow/deny rules redundant.
- **B)** The sandbox applies uniformly to every tool Claude can invoke, including Read, Write, Edit, and MCP tools.
- **C)** The sandbox applies to the Bash tool; it does not restrict Read, Write, Edit, WebSearch, WebFetch, MCP tools, hooks, or internal commands.
- **D)** The sandbox only restricts network access and leaves the filesystem unprotected, so file writes from Bash still go to the host.

---

### Q39

An engineer must decide between `plan` mode and direct execution for adding a new endpoint to a service they know well, with an existing test suite and a small blast radius.

Which choice is proportionate?

- **A)** Direct execution with `bypassPermissions` to avoid any interruptions during the work, since auto-approving all prompts speeds delivery.
- **B)** Direct execution, because scope and risk are low and the test suite verifies the result.
- **C)** Plan mode, because all endpoint additions are architectural changes requiring review, regardless of the size or familiarity of the codebase.
- **D)** Plan mode followed by a multi-phase review workflow to cover all edge cases, since a new endpoint always exposes a new attack surface.

---

### Q40

A developer's prompt reads: "Fix the login bug."

Which rewrite best reflects explicit criteria?

- **A)** "Fix the login bug and any related issues you find while investigating, since broader fixes prevent regressions in adjacent code."
- **B)** "Users see a blank screen after submitting the login form; it happens only when the email contains a `+`. Fix only the input sanitization in `/api/auth/login`. Do not change auth logic or token handling. Done when `user+tag@example.com` receives a session token."
- **C)** "Fix the login bug carefully and thoroughly, checking all edge cases to make sure no other login paths are affected."
- **D)** "Investigate the login system end-to-end and report everything you find, so we have a full picture before deciding what to fix."

---

### Q41

A developer needs to know how much of the context window is currently consumed and by what — messages, system prompt, tools, skills.

Which command applies?

- **A)** `/context`
- **B)** `/resume`, which lists prior sessions with their token sizes for comparison.
- **C)** `/status`, which reports the model name and connection state but not the token breakdown.
- **D)** `/compact`, which acts on the context rather than reporting it.

---

### Q42

A team is surprised that a portion of the context window appears reserved even in a brand-new session.

Which explanation is correct?

- **A)** Claude Code reserves an auto-compact buffer so there is headroom to summarize the conversation when limits are approached.
- **B)** The reservation is the model's output allocation and is hidden from `/context` to avoid confusing token accounting.
- **C)** It is a display bug in the `/context` command that misreports available tokens by subtracting a fixed offset.
- **D)** The reserved space is used to index the project's `.gitignore` patterns, which are preloaded for every file-picker query.

---

### Q43

A guidance item applies to every project the developer works on, on their machine only, and should not be shared with the team.

Which settings scope is correct?

- **A)** User settings, at `~/.claude/settings.json`.
- **B)** Project settings, at `<repo>/.claude/settings.json`, shared via git with every team member who clones the repo.
- **C)** Managed settings, imposed org-wide by IT or DevOps and applying to every machine in the organization.
- **D)** Local settings, at `<repo>/.claude/settings.local.json`, scoped to one project and not shared with anyone.

---

### Q44

An engineer wants environment variables — an internal registry URL and a feature flag — applied to every Claude Code session in a project.

Which mechanism is designed for this?

- **A)** The environment variables section of `settings.json`, which applies them to every session.
- **B)** A `PreToolUse` hook that injects the variables before each individual tool call, so they are refreshed on every invocation.
- **C)** Exporting them manually in the shell before each run and documenting it in the README so team members know to do the same.
- **D)** Writing their values into `CLAUDE.md` so the model knows them as text and can reference them when constructing shell commands.

---

### Q45

A team wants every Bash tool invocation to be logged to an internal audit service.

Which mechanism fits?

- **A)** A slash command developers run at the end of each session to flush the log, capturing commands from the session transcript.
- **B)** A hook that runs a shell command after every Bash tool use.
- **C)** A permission rule that allows Bash only when the audit service confirms it is running, coupling execution approval to the audit system's health check.
- **D)** A `CLAUDE.md` instruction asking Claude to log each command it runs, relying on the model to include the logging call in every Bash invocation.

---

### Q46

A read rule is written with a leading `/`, as in `/src/config/*`.

What does that prefix mean?

- **A)** Relative to the current working directory where Claude Code was launched, so it resolves differently depending on where the user starts the tool.
- **B)** Relative to the project root, which makes it portable across machines.
- **C)** Relative to the user's home directory, equivalent to `~/src/config/*` on any machine.
- **D)** Absolute from the filesystem root, pinned to that exact path and failing on any machine where the directory is elsewhere.

---

### Q47

A team needs a rule targeting the developer's dotfiles, which live in the same place on every machine regardless of which project is open.

Which path prefix applies?

- **A)** `/`, which anchors to the project root and resolves to a different absolute path on each developer's machine.
- **B)** No prefix, which anchors to the directory where Claude Code was launched, varying by terminal session.
- **C)** `//`, which anchors to the filesystem root at `/` and resolves to the same absolute location everywhere.
- **D)** `~/`, which anchors the pattern to the home directory.

---

### Q48

A CI pipeline must fail the build when Claude's review returns any finding of severity `blocker`.

Which design makes that check reliable?

- **A)** Have a human read the output and decide whether to fail the build manually, since a human reviewer can apply judgment that a script cannot.
- **B)** Ask Claude to exit with a non-zero status code when it finds a blocker, since the model can set the process exit code through a Bash call.
- **C)** Grep the markdown output for the word "blocker" to detect flagged findings, since the word appears in every blocker finding and not in passing ones.
- **D)** Have Claude emit structured JSON with a severity field, and let the CI script decide based on that field.

---

### Q49

A developer wants one specific MCP server from a project's `.mcp.json` approved automatically, while the others still require confirmation.

Which statement is accurate?

- **A)** MCP approval is all-or-nothing: either every server in `.mcp.json` is auto-approved or none are, with no middle option.
- **B)** Specific servers from `.mcp.json` can be approved individually, separately from the setting that auto-approves all of them.
- **C)** Granting approval to an individual server requires editing that server's source code to include a trust declaration Claude Code recognizes.
- **D)** All servers listed in `.mcp.json` are auto-approved without any configuration the moment they appear in the file.

---

### Q50

A developer wants Claude to auto-deny any tool that has not been pre-approved, instead of interrupting them with prompts.

Which permission mode matches?

- **A)** `bypassPermissions`, which auto-approves rather than auto-denies every tool invocation.
- **B)** `acceptEdits`, which auto-accepts file edits specifically, the opposite of denying unapproved tools.
- **C)** `default`, which prompts the user on first use of each tool rather than denying anything automatically.
- **D)** `dontAsk`

---

### Q51

A large legacy service must be documented. The engineer plans to work across several sessions and wants understanding to accumulate rather than restart each time.

Which approach fits?

- **A)** Paste the previous session's full transcript at the start of each new session, so the new session begins with complete awareness of prior findings.
- **B)** Write findings incrementally to a scratchpad file and read it at the start of each session before exploring further.
- **C)** Re-explore the service from scratch each session to avoid relying on stale conclusions that may have been based on misread code.
- **D)** Keep one very long session open and rely on auto-compaction to manage context, since the model summarizes as it goes and preserves key facts.

---

### Q52

A team wants the Claude Code review agent to have no ability to run shell commands or edit files during CI review runs, enforced by configuration rather than by prompt.

Which mechanism applies?

- **A)** A system prompt line stating that the agent must remain read-only, since the system prompt is authoritative and the model will not override it.
- **B)** Permission rules denying Bash, Edit, and Write for that invocation.
- **C)** Reviewing the diff after each run and reverting any unwanted changes with git, so any accidental edits are recoverable before merge.
- **D)** Running the review with a smaller model that lacks broad tool capabilities, since a constrained model is less likely to invoke dangerous tools.

---

### Q53

An engineer asks whether a session started in Claude Code for Web can be continued in their local terminal.

Which statement is accurate?

- **A)** Continuing requires exporting the session transcript and pasting it into the local session as context.
- **B)** Web and local sessions are permanently separate and cannot be merged or continued across surfaces.
- **C)** A session started via Remote Control or Claude Code for Web can be continued locally.
- **D)** Only sessions started locally can ever be resumed in any context; web sessions expire when the browser tab closes.

---

### Q54

A project's conventions file needs to include a shared standards document that also lives in another file, without duplicating its content.

Which mechanism is designed for this?

- **A)** A symlink in the `.claude` directory pointing to the shared file, so the filesystem presents a single logical path.
- **B)** Copying the content into `CLAUDE.md` and keeping both copies in sync manually, using a diff tool to catch divergence during code review.
- **C)** A session-start hook that concatenates the two files at runtime and writes the result to a temp file that Claude reads.
- **D)** An import directive in `CLAUDE.md` that pulls in the other file's content.

---

### Q55

An MCP permission rule is written as `mcp__github`.

What does it cover?

- **A)** Every tool provided by the `github` MCP server.
- **B)** Every MCP server whose name begins with the prefix `github`, such as `github-issues` or `github-prs`.
- **C)** Only a tool literally named `github` on any connected server, regardless of which server provides it.
- **D)** Nothing, because a specific tool name must follow the server name for the rule to match any tool.

---

### Q56

A team wants their CI review to consider only the files changed in the pull request, not the whole repository.

Which approach is most appropriate?

- **A)** Increase the turn limit so a full-repository review can complete without hitting the cap, since the model naturally focuses on changed areas when given enough turns.
- **B)** Ask Claude to review only what seems relevant, trusting its judgment to scope the work and skip unrelated files.
- **C)** Let Claude explore the repository and infer which files the PR likely touched, using commit messages and timestamps as hints.
- **D)** Compute the changed file list in the pipeline and pass it into the prompt as the explicit scope of the review.

---

### Q57

An engineer must choose between putting a rule in `CLAUDE.md`, in a Skill, or in a hook. The rule is: "The deployment script must never run against production without an approved change ticket."

Which mechanism satisfies the requirement?

- **A)** A Skill, because deployment is a specialized workflow that should be encapsulated and invoked intentionally by the engineer.
- **B)** A hook, because the requirement is a guarantee that must hold regardless of what the model decides.
- **C)** `CLAUDE.md`, because it is loaded automatically in every session and the model will see the rule before attempting any deployment.
- **D)** A permission rule of type `ask`, so a human manually confirms each deployment attempt and can verify the ticket exists before approving.

---

### Q58

A developer wants Claude to respond in Portuguese while keeping code and identifiers in English.

Which mechanism is designed for the language preference?

- **A)** An environment variable set in the shell before launching Claude Code, since environment variables configure runtime behavior for Claude's response generation.
- **B)** A permission rule scoped to the response locale, restricting responses to a specific language code the model checks before replying.
- **C)** The output language setting in `settings.json`.
- **D)** A session label set with `/rename` at the start of each session, since naming the session with a language tag signals the preferred locale.

---

### Q59

A first attempt at generating an API client produced correct but inconsistent naming. The developer wants the second attempt to match the house style exactly.

Which input is most effective?

- **A)** A request to make the naming "more consistent across the client," giving the model freedom to apply its own consistency rules.
- **B)** A concrete input-output example: one existing client method and the corresponding generated method as it should look.
- **C)** A link to the style guide's homepage for reference, so the model can read the guide and apply its own interpretation.
- **D)** The instruction "match our house style" added to the prompt, trusting that the model has inferred the team's conventions from prior messages.

---

### Q60

A team is deciding where a piece of guidance belongs. The guidance is: "When writing database migrations, always include a rollback section." It is relevant only when files under `db/migrations/` are being edited, and it is advisory rather than a hard guarantee.

Which mechanism is the best fit?

- **A)** A line in the root `CLAUDE.md`, loaded in every session regardless of context.
- **B)** A path-specific rule scoped to `db/migrations/`, which loads the guidance exactly when those files are in play.
- **C)** A permission rule denying all edits to `db/migrations/` without review, treating any migration change as high-risk regardless of content.
- **D)** A hook that blocks any migration file lacking a rollback section before saving, which enforces the rule as a hard gate rather than an advisory.

---

**End of block — 60 questions.**
