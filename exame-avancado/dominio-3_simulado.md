# Exame Avançado — Bloco 3

**60 questions · multiple choice · one correct answer**

> Do not look at the answer key until you have finished the whole block.
> The domain and objective of each question are deliberately not shown.

---

### Q1

An organization's security team must ensure that no developer can enable `--dangerously-skip-permissions`, regardless of what they put in their personal or project settings.

Where must this be configured?

- **A)** In managed settings, which are applied organization-wide and take precedence over user, project, and local settings.
- **B)** In each developer's `~/.claude/settings.json`.
- **C)** In `.claude/settings.local.json`, which is not checked into git.
- **D)** In the project's `.claude/settings.json`, so the whole team inherits it.

---

### Q2

A monorepo has Python services and a TypeScript frontend. Python files must follow one set of conventions and TypeScript files another. Today both sets live in a single root `CLAUDE.md`, and Claude frequently applies Python rules to `.ts` files.

What is the appropriate mechanism?

- **A)** A longer root `CLAUDE.md` with clearer headings for each language.
- **B)** A hook that rejects edits violating the wrong language's conventions.
- **C)** Path-specific rules under `.claude/rules/` with glob patterns, so each rule set is loaded only for the files it applies to.
- **D)** A slash command the developer runs to declare which language they are working in.

---

### Q3

A CI job runs Claude Code to review pull requests. The job must be fully non-interactive, and a downstream script needs to parse the result programmatically.

Which invocation fits?

- **A)** `claude "<review prompt>"` piped into a JSON parser.
- **B)** `claude -p "<review prompt>" --output-format json`
- **C)** `claude --resume --output-format json`
- **D)** `claude -p "<review prompt>"` with the reviewer reading the terminal output.

---

### Q4

A team's permission configuration contains all three of the following for the same command: an `allow` rule, an `ask` rule, and a `deny` rule.

Which applies?

- **A)** The deny rule, because evaluation order is deny → ask → allow and the most restrictive rule wins.
- **B)** The rule defined at the highest settings scope, regardless of its type.
- **C)** The allow rule, because explicit allows override defaults.
- **D)** The ask rule, because it sits between the two extremes.

---

### Q5

An engineer writes the permission rule `Bash(ls *)` expecting it to cover the `lsof` command as well.

What actually happens?

- **A)** It matches `lsof`, because `*` matches any characters including the absence of a space.
- **B)** It matches every command starting with the letters `ls`, including `lsof` and `lsblk`.
- **C)** It matches neither, because wildcards are not supported in Bash rules.
- **D)** It does not match `lsof`, because the space in the pattern matters — it matches `ls -la` but not `lsof`.

---

### Q6

A CI pipeline runs Claude Code unattended. There is no human available to approve tool prompts, and the job runs inside a disposable container.

Which statement about `--dangerously-skip-permissions` is correct here?

- **A)** It should never be used under any circumstance, including CI.
- **B)** It is required for any non-interactive run, because `-p` cannot work without it.
- **C)** It is unnecessary, because CI runs default to `bypassPermissions` automatically.
- **D)** This is one of the legitimate use cases — automated pipelines with no human approver — and risk is further reduced by running inside a sandbox or disposable environment.

---

### Q7

A developer adds a deny rule blocking `npx` and enables the bubblewrap sandbox, believing the two layers together prevent Claude from downloading and executing arbitrary code. They also run with `--dangerously-skip-permissions`.

Which risk remains?

- **A)** Bubblewrap does not exist on Linux, so no sandbox is actually applied.
- **B)** The sandbox blocks the deny rule from being evaluated.
- **C)** With permissions auto-approved, Claude can reason that the sandbox is the obstacle and act to remove it — the sandbox becomes something it can opt out of.
- **D)** The deny rule silently stops working when a sandbox is active.

---

### Q8

A reviewer agent flags the same three "possible SQL injection" findings on every run. Two are ORM calls that are safe; developers now ignore the agent's output entirely.

Which change most reduces the false positive rate?

- **A)** Run the review twice and report only findings that appear in both runs.
- **B)** Only report findings the agent rates above 80% confidence.
- **C)** Ask the agent to double-check each finding before reporting it.
- **D)** Supply project-specific conventions and explicit exclusion criteria as persistent context — for example, "flag only when user input is concatenated into a query string without parameterization; do not flag ORM calls or prepared statements."

---

### Q9

An engineer wants a reusable, parameterized workflow — "review the diff on this branch against our standards and output JSON" — available to the whole team from inside Claude Code.

Which mechanism fits best?

- **A)** A hook registered on `PostToolUse`.
- **B)** A permission rule allowing the review tools.
- **C)** A paragraph appended to the root `CLAUDE.md`.
- **D)** A slash command checked into the project, which can carry its own prompt, tool restrictions, and output expectations.

---

### Q10

A developer runs Claude Code in a repository they have never seen and asks, "How does authentication work here?" Reading every file would blow the context window.

Which exploration strategy is appropriate?

- **A)** Read every file under `src/` sequentially until the picture is complete.
- **B)** Use Glob to locate candidate files by name pattern, Grep to find where the relevant symbols appear, and Read only the specific files those searches identify.
- **C)** Ask the model to answer from its general knowledge of authentication patterns.
- **D)** Run Bash with `cat` on the whole repository and let the model filter.

---

### Q11

A team wants Claude Code to always know the project's build commands and architectural conventions, in every session, without anyone pasting them.

Which mechanism is designed for this?

- **A)** A `CLAUDE.md` file in the project, which is loaded as persistent project context.
- **B)** A `PreToolUse` hook that injects the conventions.
- **C)** An environment variable in `settings.json`.
- **D)** A skill that the developer invokes when needed.

---

### Q12

A generated test suite compiles and passes, but every test asserts only that a function returns without throwing. Coverage numbers look good; real regressions still ship.

Which change most improves the quality of generated tests?

- **A)** Raise the coverage threshold in CI.
- **B)** Ask for more tests per function.
- **C)** Switch the test generation to a larger model.
- **D)** Provide existing test files as context, state the fixture conventions, and define explicitly what separates a meaningful behavioral assertion from a trivial one.

---

### Q13

An engineer keeps personal preferences — a preferred spinner style and an extra allowed directory — that should apply to this project only and must never reach the team repository.

Which file is correct?

- **A)** `.claude/settings.local.json` in the repository, which holds personal project-specific preferences and is not checked into git.
- **B)** `~/.claude/settings.json`.
- **C)** `.claude/settings.json` in the repository.
- **D)** The managed settings file.

---

### Q14

A permission rule is written as bare `Read` with no parentheses.

What does it cover?

- **A)** Nothing, because a pattern is required.
- **B)** All reads of all files — the bare tool name means total coverage with no path filtering.
- **C)** Only reads of files in the project root.
- **D)** Only reads of files not excluded by `.gitignore`.

---

### Q15

A team wants to restrict Claude's web access so it may fetch from their internal documentation host but nothing else.

Which rule form applies?

- **A)** A Bash rule matching `curl *`.
- **B)** A Read rule with an absolute path pattern.
- **C)** A deny rule on the WebSearch tool.
- **D)** A WebFetch rule scoped by domain, such as `WebFetch(domain:docs.internal.example.com)`, with other domains denied.

---

### Q16

An engineer wants Claude to stop asking for confirmation on file edits for the remainder of the session, while still prompting for shell commands.

Which permission mode applies?

- **A)** `acceptEdits`
- **B)** `plan`
- **C)** `dontAsk`
- **D)** `bypassPermissions`

---

### Q17

A team's root `CLAUDE.md` has grown to several hundred lines covering testing, deployment, style, and security. Sessions now start with a large context cost, and developers report Claude ignoring the middle sections.

Which restructuring is most appropriate?

- **A)** Keep only always-relevant guidance in `CLAUDE.md`, move conditional guidance into path-specific rules and skills that load when relevant, and import shared fragments rather than inlining everything.
- **B)** Ask developers to paste the relevant section at the start of each session.
- **C)** Move the entire file into the system prompt via a settings override.
- **D)** Split the file into five files and import all five at the top of `CLAUDE.md`.

---

### Q18

A CI review job occasionally runs for twenty minutes and consumes far more tokens than budgeted when a pull request is unusually large.

Which controls address this directly?

- **A)** A shorter prompt.
- **B)** Running the job on a faster CI runner.
- **C)** Cost and turn limits on the CLI invocation, which cap runaway executions in automated contexts.
- **D)** Switching `--output-format` to text.

---

### Q19

A developer wants Claude Code to review a change without the ability to modify the repository, and to return findings that a script can consume.

Which configuration satisfies both requirements?

- **A)** Run with `bypassPermissions` and review the diff manually.
- **B)** Run in `acceptEdits` mode and revert afterwards with git.
- **C)** Restrict the session to read-only tools via permission rules, and request structured JSON output.
- **D)** Ask Claude in the prompt not to edit anything, and parse its markdown response.

---

### Q20

An engineer needs to find every file whose name matches `*.service.ts` across a large repository.

Which built-in tool is designed for this?

- **A)** Glob
- **B)** Read
- **C)** Grep
- **D)** WebSearch

---

### Q21

A developer's first refactoring request produced code that ignored the project's error-handling convention. They are about to retry.

Which feedback is most likely to produce a correct result on the next attempt?

- **A)** "That was wrong, try again and follow our conventions this time."
- **B)** A request to rewrite the whole module from scratch.
- **C)** A note that the output quality was disappointing.
- **D)** A concrete example of the convention applied to one of the affected functions, plus the specific failure in the previous attempt.

---

### Q22

A reviewer finds eight separate problems in a generated migration script.

Which approach to feedback is most efficient?

- **A)** Send the two most important issues and hope the rest resolve themselves.
- **B)** Describe all eight issues in one consolidated message so the agent can evaluate them together and produce a single corrected version.
- **C)** Send each issue as its own message and let the agent fix them one at a time.
- **D)** Discard the output and restart with the original prompt.

---

### Q23

An organization must guarantee that only an approved list of MCP servers can ever be configured by any user in any project.

Where does that allowlist belong?

- **A)** In each project's `.mcp.json`.
- **B)** In `.claude/settings.local.json` for each developer.
- **C)** In managed settings, where the MCP allowlist is admin-defined and user additions are ignored.
- **D)** In each user's `~/.claude/settings.json`.

---

### Q24

A team wants sessions older than a set number of days deleted automatically, and one high-security project must persist no transcripts at all.

Which statement is correct?

- **A)** Disabling persistence requires deleting the `.claude` directory before each run.
- **B)** Session retention cannot be configured; transcripts are always kept for 30 days.
- **C)** Transcripts are only stored when `/rename` has been used on the session.
- **D)** A session retention period can be configured, and setting it to zero deletes all transcripts at startup and disables persistence — `/resume` then shows nothing.

---

### Q25

An engineer wants to search the contents of files for the regex `process\.env\.[A-Z_]+` across a repository.

Which built-in tool is designed for this?

- **A)** Read
- **B)** Bash with `find`
- **C)** Glob
- **D)** Grep

---

### Q26

A developer has been iterating on a feature for two hours. Context is nearly full, but the work so far is still relevant and they do not want to lose it.

Which command applies?

- **A)** `/rename`, which labels the session for later retrieval.
- **B)** `/rewind`, which restores the session to an earlier point.
- **C)** `/compact`, which summarizes the conversation to reduce token usage while keeping the thread going.
- **D)** `/clear`, which resets the conversation.

---

### Q27

A developer finishes a feature and wants to start an unrelated task in the same terminal, with no carry-over from the previous conversation, while keeping the project's `CLAUDE.md` guidance in effect.

Which command applies?

- **A)** `/compact`, which summarizes rather than resets.
- **B)** `/rewind`, which returns to an earlier state of the same task.
- **C)** `/clear`, which resets the current conversation but does not clear `CLAUDE.md` or auto memory.
- **D)** Restarting the terminal, which is the only way to clear context.

---

### Q28

A team must decide where to record the instruction "never commit directly to main." Every session in the repository must respect it, and it should be visible in code review.

Which location is appropriate?

- **A)** Each developer's `~/.claude/settings.json`.
- **B)** The project's `CLAUDE.md`, checked into the repository.
- **C)** A comment in the CI configuration file.
- **D)** A `.claude/settings.local.json` entry.

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

- **A)** A deny rule on edits to that directory.
- **B)** A skill the developer must remember to invoke.
- **C)** A path-specific rule with a glob pattern scoped to that directory.
- **D)** A section in the root `CLAUDE.md` titled "Terraform".

---

### Q31

A team's `settings.json` sets a default model for all sessions and also restricts which models users can pick.

Which statement is accurate?

- **A)** Both are supported: one setting overrides the default model for all sessions, another restricts the selectable models via `/model`, `--model`, or `ANTHROPIC_MODEL`.
- **B)** Model settings are only available in managed settings.
- **C)** Only the default model can be set; restricting the picker is not configurable.
- **D)** Restricting models also removes the "Default" option from the picker.

---

### Q32

A security-sensitive repository must block Claude from reading `.env` files anywhere in the project, with no exceptions.

Which configuration is correct?

- **A)** An ask rule on Read for `.env`, so the developer can approve legitimate cases.
- **B)** Adding `.env` to `.gitignore`.
- **C)** A deny rule on Read matching the `.env` pattern, because deny is evaluated first and is the most restrictive.
- **D)** An instruction in `CLAUDE.md` telling Claude never to read `.env`.

---

### Q33

A developer wants a repeatable workflow that carries its own instructions and can be invoked by name, but whose long intermediate output should not remain in the main session.

Which configuration achieves the isolation?

- **A)** Define it in `CLAUDE.md` so it is always available.
- **B)** Define it as a slash command and run `/compact` afterwards.
- **C)** Define it as a hook on `PostToolUse`.
- **D)** Define it as a Skill or slash command with `context: fork` in its frontmatter, so it runs in an isolated subagent context.

---

### Q34

An automated PR review must produce output that a downstream service stores in a database, with one record per finding.

Which combination is appropriate?

- **A)** A non-interactive run with JSON output, and a prompt that specifies exactly the fields each finding must contain.
- **B)** A prompt asking for "a clear, well-organized summary."
- **C)** An interactive session whose terminal output is captured to a log file.
- **D)** A markdown report that the downstream service parses with regular expressions.

---

### Q35

A Claude Code review job loads the wrong standards: it reviews a backend service against the frontend style guide.

Which configuration error is most likely?

- **A)** The review configuration does not scope which project standards to load for the files under review.
- **B)** The permission rules are too permissive.
- **C)** The output format is markdown rather than JSON.
- **D)** The model is too small to distinguish the two guides.

---

### Q36

A team asks whether hooks can be disabled entirely for a locked-down environment.

Which statement is correct?

- **A)** Hooks can only be disabled one at a time, by removing each definition.
- **B)** Hooks cannot be disabled once defined in a project.
- **C)** A managed setting can disable all hooks and the custom status line, overriding hook definitions from user, project, and plugin sources.
- **D)** Disabling hooks requires uninstalling Claude Code.

---

### Q37

A developer notices that the `@` file picker never suggests files listed in `.gitignore`, but they need to reference a local `.env.example` that is gitignored.

Which statement is accurate?

- **A)** Only managed settings can change picker behavior.
- **B)** The picker always shows all files; the file must not exist.
- **C)** The picker hides gitignored files by default, and that behavior is configurable.
- **D)** Gitignored files can never be referenced in a prompt.

---

### Q38

A team wants Claude Code to run inside a sandbox so that shell commands cannot damage the host, and asks what the sandbox does and does not cover.

Which statement is accurate?

- **A)** The sandbox replaces the permission system entirely.
- **B)** The sandbox applies to every tool Claude can call.
- **C)** The sandbox applies to the Bash tool; it does not restrict Read, Write, Edit, WebSearch, WebFetch, MCP tools, hooks, or internal commands.
- **D)** The sandbox only limits network access and nothing else.

---

### Q39

An engineer must decide between `plan` mode and direct execution for adding a new endpoint to a service they know well, with an existing test suite and a small blast radius.

Which choice is proportionate?

- **A)** Direct execution with `bypassPermissions` to avoid interruptions.
- **B)** Direct execution, because scope and risk are low and tests verify the result.
- **C)** Plan mode, because all new endpoints are architectural changes.
- **D)** Plan mode followed by a multi-phase review workflow.

---

### Q40

A developer's prompt reads: "Fix the login bug."

Which rewrite best reflects explicit criteria?

- **A)** "Fix the login bug and any related issues you find."
- **B)** "Users see a blank screen after submitting the login form; it happens only when the email contains a `+`. Fix only the input sanitization in `/api/auth/login`. Do not change auth logic or token handling. Done when `user+tag@example.com` receives a session token."
- **C)** "Fix the login bug carefully and thoroughly."
- **D)** "Investigate the login system and report what you find."

---

### Q41

A developer needs to know how much of the context window is currently consumed and by what — messages, system prompt, tools, skills.

Which command applies?

- **A)** `/context`
- **B)** `/resume`
- **C)** `/status`
- **D)** `/compact`

---

### Q42

A team is surprised that a portion of the context window appears reserved even in a brand-new session.

Which explanation is correct?

- **A)** Claude Code reserves an auto-compact buffer so there is headroom to summarize the conversation when limits are approached.
- **B)** The reservation is the model's own output allocation and cannot be observed.
- **C)** It is a display bug in `/context`.
- **D)** The reserved space holds the `.gitignore` index.

---

### Q43

A guidance item applies to every project the developer works on, on their machine only, and should not be shared with the team.

Which settings scope is correct?

- **A)** User settings, at `~/.claude/settings.json`.
- **B)** Project settings, at `<repo>/.claude/settings.json`.
- **C)** Managed settings.
- **D)** Local settings, at `<repo>/.claude/settings.local.json`.

---

### Q44

An engineer wants environment variables — an internal registry URL and a feature flag — applied to every Claude Code session in a project.

Which mechanism is designed for this?

- **A)** The environment variables section of `settings.json`, which applies them to every session.
- **B)** A `PreToolUse` hook that sets them before each tool call.
- **C)** Exporting them in the shell before each run and documenting it in the README.
- **D)** Writing them into `CLAUDE.md` so Claude knows their values.

---

### Q45

A team wants every Bash tool invocation to be logged to an internal audit service.

Which mechanism fits?

- **A)** A slash command developers run at the end of the session.
- **B)** A hook that runs a command after every Bash tool use.
- **C)** A permission rule that allows Bash only when logging is on.
- **D)** A `CLAUDE.md` instruction to log each command.

---

### Q46

A read rule is written with a leading `/`, as in `/src/config/*`.

What does that prefix mean?

- **A)** Relative to the current working directory where Claude Code was launched.
- **B)** Relative to the project root, which makes it portable across machines.
- **C)** Relative to the user's home directory.
- **D)** Absolute from the filesystem root.

---

### Q47

A team needs a rule targeting the developer's dotfiles, which live in the same place on every machine regardless of which project is open.

Which path prefix applies?

- **A)** `/`, which anchors to the project root.
- **B)** No prefix, which anchors to the current working directory.
- **C)** `//`, which anchors to the filesystem root.
- **D)** `~/`, which anchors the pattern to the home directory.

---

### Q48

A CI pipeline must fail the build when Claude's review returns any finding of severity `blocker`.

Which design makes that check reliable?

- **A)** Have a human read the output and fail the build manually.
- **B)** Ask Claude to exit with a non-zero status when it finds a blocker.
- **C)** Grep the markdown output for the word "blocker".
- **D)** Have Claude emit structured JSON with a severity field, and let the CI script decide based on that field.

---

### Q49

A developer wants one specific MCP server from a project's `.mcp.json` approved automatically, while the others still require confirmation.

Which statement is accurate?

- **A)** MCP approval is all-or-nothing per project.
- **B)** Specific servers from `.mcp.json` can be approved individually, separately from a setting that auto-approves all of them.
- **C)** Individual approval requires editing the server's source code.
- **D)** MCP servers listed in `.mcp.json` are always auto-approved.

---

### Q50

A developer wants Claude to auto-deny any tool that has not been pre-approved, instead of interrupting them with prompts.

Which permission mode matches?

- **A)** `bypassPermissions`
- **B)** `acceptEdits`
- **C)** `default`
- **D)** `dontAsk`

---

### Q51

A large legacy service must be documented. The engineer plans to work across several sessions and wants understanding to accumulate rather than restart each time.

Which approach fits?

- **A)** Paste the previous session's full transcript at the start of each new session.
- **B)** Write findings incrementally to a scratchpad file in the repository, and start each session by reading it before exploring further.
- **C)** Re-explore the service from scratch each session to avoid stale conclusions.
- **D)** Keep one very long session open and rely on auto-compaction.

---

### Q52

A team wants the Claude Code review agent to have no ability to run shell commands or edit files during CI review runs, enforced by configuration rather than by prompt.

Which mechanism applies?

- **A)** A system prompt line stating the agent is read-only.
- **B)** Permission rules denying Bash, Edit, and Write for that invocation.
- **C)** Reviewing the diff after the run and reverting unwanted changes.
- **D)** Running the review with a smaller model.

---

### Q53

An engineer asks whether a session started in Claude Code for Web can be continued in their local terminal.

Which statement is accurate?

- **A)** Continuing requires exporting the transcript and pasting it.
- **B)** Web and local sessions are permanently separate.
- **C)** A session started via Remote Control or Claude Code for Web can be continued locally.
- **D)** Only local sessions can be resumed at all.

---

### Q54

A project's conventions file needs to include a shared standards document that also lives in another file, without duplicating its content.

Which mechanism is designed for this?

- **A)** A symlink in the `.claude` directory.
- **B)** Copying the content into `CLAUDE.md` and updating both when it changes.
- **C)** A hook that concatenates the files at session start.
- **D)** An import in `CLAUDE.md` that pulls in the other file's content.

---

### Q55

An MCP permission rule is written as `mcp__github`.

What does it cover?

- **A)** Every tool provided by the `github` server.
- **B)** Every MCP server whose name begins with `github`.
- **C)** Only a tool literally named `github`.
- **D)** Nothing, because a tool name is required after the server name.

---

### Q56

A team wants their CI review to consider only the files changed in the pull request, not the whole repository.

Which approach is most appropriate?

- **A)** Increase the turn limit so a full-repository review completes.
- **B)** Ask Claude to review only what seems relevant.
- **C)** Let Claude explore the repository and decide which files the PR touched.
- **D)** Compute the changed file list in the pipeline and pass it into the prompt as the explicit scope of the review.

---

### Q57

An engineer must choose between putting a rule in `CLAUDE.md`, in a Skill, or in a hook. The rule is: "The deployment script must never run against production without an approved change ticket."

Which mechanism satisfies the requirement?

- **A)** A Skill, because deployment is a specialized workflow.
- **B)** A hook, because the requirement is a guarantee that must hold regardless of what the model decides.
- **C)** `CLAUDE.md`, because it is loaded in every session.
- **D)** A settings permission rule of type `ask`, so a human confirms each time.

---

### Q58

A developer wants Claude to respond in Portuguese while keeping code and identifiers in English.

Which mechanism is designed for the language preference?

- **A)** An environment variable read by the model at runtime.
- **B)** A permission rule scoped by locale.
- **C)** The output language setting in `settings.json`.
- **D)** Renaming the session with `/rename`.

---

### Q59

A first attempt at generating an API client produced correct but inconsistent naming. The developer wants the second attempt to match the house style exactly.

Which input is most effective?

- **A)** A request to make the naming "more consistent."
- **B)** A concrete input-output example: one existing client method and the corresponding generated method as it should look.
- **C)** A link to the style guide's homepage.
- **D)** The instruction "match our house style."

---

### Q60

A team is deciding where a piece of guidance belongs. The guidance is: "When writing database migrations, always include a rollback section." It is relevant only when files under `db/migrations/` are being edited, and it is advisory rather than a hard guarantee.

Which mechanism is the best fit?

- **A)** A line in the root `CLAUDE.md`, loaded in every session.
- **B)** A path-specific rule scoped to `db/migrations/`, which loads the guidance exactly when those files are in play.
- **C)** A permission rule denying edits to `db/migrations/`.
- **D)** A hook that blocks any migration file lacking a rollback section.

---

**End of block — 60 questions.**
