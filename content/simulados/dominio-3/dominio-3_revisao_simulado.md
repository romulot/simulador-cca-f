# Simulado de Revisão — CCA-F | Domínio 3 (Claude Code Configuration & Workflows)

**Cobertura:** 3.1 (hierarquia CLAUDE.md/`@import`/rules) · 3.2 (commands e skills) · 3.3 (path-specific rules) · 3.4 (plan mode × execução direta) · 3.5 (refinamento iterativo) · 3.6 (CI/CD).
**Formato:** múltipla escolha baseada em cenário — 1 correta + 3 distratores (questões em inglês). 12 questões, nível prova, maioria Médio/Difícil. Inclui **4 itens cruzados inéditos** (Q9–Q12) combinando task statements.

> Responda antes de consultar o gabarito em `dominio-3_revisao_gabarito.md`.

---

## Q1
A monorepo team moved its API conventions out of a 900-line root `CLAUDE.md` into `standards/api-conventions.md`. In the root `CLAUDE.md` the migration was documented inside a fenced block that reads "we pull shared standards in like this:" followed by the line `@standards/api-conventions.md`. Over the following two weeks, 11 of 14 pull requests touching `packages/api/` violate the naming convention that file defines, while every other section of the root memory file is clearly being followed. `/memory` lists the root `CLAUDE.md` as loaded and does not list `standards/api-conventions.md`. What is the most likely cause?

- **A)** The import chain exceeded the 4-hop recursion ceiling, so `api-conventions.md` was dropped silently even though the syntax is correct and the file exists on disk.
- **B)** Relative import paths resolve against the session's working directory, so the import only succeeds for developers who launch Claude Code from the repository root and fails for everyone else.
- **C)** The `@standards/api-conventions.md` token sits inside a fenced code block, where it is treated as literal text rather than an import, so that file is never loaded.
- **D)** Imported files load on demand rather than at launch, so the conventions only enter context after someone explicitly asks Claude to read `standards/api-conventions.md` first.

## Q2
A platform team ships `.claude/skills/migration-check/SKILL.md` in the repository so that Claude runs the team's schema-migration checklist whenever a developer touches a migration file. Its `description` field is detailed and accurate. Over 30 sessions the skill has never run unless a developer typed `/migration-check` by hand, and the checklist was skipped on 8 migrations that shipped. The skill body itself works correctly every time it is invoked. Its frontmatter carries `name`, `description`, `argument-hint`, `allowed-tools` and `disable-model-invocation: true`. What is the most effective fix?

- **A)** Remove `disable-model-invocation: true`, the field that restricts this skill to user invocation and blocks triggering from the `description`.
- **B)** Move the checklist text into the project's `CLAUDE.md`, so it is always in context and no invocation decision has to be made at all.
- **C)** Delete `argument-hint` from the frontmatter, since a skill that declares expected arguments cannot be auto-invoked without them being supplied.
- **D)** Broaden `allowed-tools` to include every tool the checklist might need, since a skill whose tool list is too narrow is skipped rather than invoked.

## Q3
An infrastructure team wants Claude to run its Terraform gate whenever someone edits a `.tf` file anywhere in the monorepo: run `terraform fmt`, run `tflint`, compare the plan against a committed policy file, and walk a 40-item review checklist that lives in three supporting markdown files. Today the whole thing is pasted into the body of a single `.claude/rules/terraform.md` with `paths: ["**/*.tf"]`, and reviewers report the middle steps are frequently skipped. Which mechanism fits this requirement best?

- **A)** Keep the rule and split it into three path-scoped rules under `.claude/rules/`, one per phase, all matching `**/*.tf`, so each phase's instructions load independently.
- **B)** Move the content to a `CLAUDE.md` inside each directory that contains Terraform code, so the gate loads whenever Claude works in one of those subtrees.
- **C)** Keep the rule but drop `paths:` so it becomes global, guaranteeing the gate is in context on every session regardless of which files are opened.
- **D)** Package it as a skill with `paths: ["**/*.tf"]`, so a behavior block with its own supporting files and tools activates instead of one long instruction.

## Q4
A developer entered plan mode with Shift+Tab, reviewed a migration plan, and approved it with "Yes, and use auto mode". Twenty minutes later, in the same session, they asked an unrelated question about a failing test; Claude edited 6 files without stopping to ask. The developer files a bug report saying plan mode stopped working after the first approval, and notes that `.claude/settings.json` has no `permissions` block at all. What is the most likely explanation?

- **A)** Plan mode is advisory guidance to the model rather than a permission boundary, so Claude followed it while the plan was the topic and drifted once the conversation moved on.
- **B)** Approving the plan ended plan mode and put the session into the mode named by the chosen option; plan mode does not persist after approval, so subsequent turns ran under auto mode.
- **C)** With no `permissions` block in `.claude/settings.json`, the session silently fell back to `bypassPermissions`, which is why the later edits were neither blocked nor prompted.
- **D)** Plan mode applies only to the request it was entered on, and a new topic in the same session requires re-approving the original plan before edits are gated again.

## Q5
A developer productivity harness drives `claude -p --output-format json` in a loop: round 1 asks for an implementation, then the harness runs the test suite and feeds the real pytest output back with `--resume <session_id>`. Round 1 runs with the project directory as its working directory; rounds 2 and 3 are launched from the repository root with the project path passed in the prompt text. The logs show that each round returns a different `session_id`, that the CLI reported it could not find the session being resumed, and that each round rewrites the implementation from scratch, repeating a mistake it had already corrected. What is the most effective fix?

- **A)** Replace `--resume <session_id>` with `--fork-session`, so each round branches off the previous one instead of trying to look up a session that the harness cannot locate.
- **B)** Stop resuming and send each round as a fresh session that includes the full pytest output, since the failing test already carries the input, the actual value and the expected value.
- **C)** Launch every round from the same project directory as round 1, because session lookup is scoped to the project directory, so the resume finds the session and the previous attempt stays in context.
- **D)** Summarize each failure into a short prose diagnosis before sending it, so the follow-up prompt stays small enough that session continuity stops mattering across rounds.

## Q6
A CI extraction gate calls `claude -p --output-format json --json-schema <schema>`. The schema declares `"effective_date": {"type": "string", "format": "date"}` and the gate feeds `structured_output` straight into a downstream service that parses dates strictly. Runs come back with `subtype: "success"` and a populated `structured_output`, yet 6% of records reach the downstream service as `"07/03/2024"` or `"March 7, 2024"` and crash it. Nothing in the run reports a validation error. What is the most effective fix?

- **A)** Validate the date fields in the gate before passing records downstream, since `format` is an annotation and is not enforced by schema validation.
- **B)** Update the schema's `$schema` keyword to JSON Schema 2020-12, whose `format` assertion is enforced, so non-conforming dates are rejected at the source.
- **C)** Add an instruction to the prompt requiring ISO 8601 dates and two worked examples, so the model stops emitting the locale-style variants.
- **D)** Retry the call whenever a record fails downstream parsing, up to three attempts, and accept the first response whose dates all parse cleanly.

## Q7
A service owner asks Claude Code to change a retry constant from 3 to 5. The constant appears in 4 files under `services/`, the stack trace in the ticket names the exact line in each of them, the values are literals with no callers to update, and the team has done this same edit twice before with no design discussion. A teammate objects that "4 files means this has to go through plan mode first". Which approach is most appropriate?

- **A)** Run it in plan mode, since the number of files touched is the signal that decides the mode and 4 files is past the point where direct execution is defensible.
- **B)** Run it in plan mode with the Explore subagent doing discovery first, so the blast radius across `services/` is mapped before any file is edited.
- **C)** Split it into 4 direct-execution sessions, one per file, so each edit is small and independently reviewable without needing a plan at all.
- **D)** Run it as direct execution: the cause is known, the change is local and mechanical, and there is no competing approach for a plan to choose between.

## Q8
Two developers on the same repository, same branch, same CLI version, report different Claude Code behavior: one gets commit messages in the team's Conventional Commits format every time, the other never does, and neither can find the convention documented in any file they share. Both have local uncommitted work. The team wants the convention to apply for everyone, including two contractors who join next week. What is the most effective first step?

- **A)** Have both developers paste the Conventional Commits rule at the top of each session's first prompt until the divergence is understood, so behavior is consistent while the investigation proceeds.
- **B)** Run `/memory` on both machines to list the memory files actually loaded, which shows which scope the convention lives in before anything is moved or rewritten.
- **C)** Consolidate every convention the team can think of into a single root `CLAUDE.md`, since one always-loaded file removes the possibility of per-machine divergence.
- **D)** Add a `PreToolUse` hook that rejects any `git commit` whose message does not match the Conventional Commits pattern, which makes the format mandatory regardless of memory.

## Q9 (cruza 3.3 + 3.1)
A security team must guarantee that one instruction — never write cloud credentials into Terraform files, always reference the secret manager — is present in every engineer's Claude Code context and cannot be removed or overridden by anyone on the engineering team, on any machine. An engineer proposes putting it in `.claude/rules/terraform-secrets.md` with `paths: ["**/*.tf"]` and a `scope: managed` frontmatter field. What should the team do instead?

- **A)** Put the instruction in the managed policy `CLAUDE.md` at `/etc/claude-code/CLAUDE.md`, which is the memory layer engineers cannot override; `.claude/rules/` has no managed scope.
- **B)** Keep the path-scoped rule but move it to `~/.claude/rules/terraform-secrets.md` on every machine, so it sits outside the repository and no pull request can modify it.
- **C)** Keep the path-scoped rule in the repository and protect it with a CODEOWNERS entry plus a pull-request template line stating that the file must not be edited.
- **D)** Keep the path-scoped rule and add `scope: managed`, which is exactly what that field is for; the proposal is correct and only the file location needs to move under `.claude/`.

## Q10 (cruza 3.2 + 1.7)
Forty minutes into a session, a developer has Claude fully briefed on a payment module: the failing behavior, the constraints, three dead ends already ruled out. Two viable refactors remain — extract a strategy interface, or collapse the branches into a table-driven lookup — and the developer wants to try both from exactly this point and compare the results, without losing the current conversation or re-establishing the context. What is the right mechanism?

- **A)** Wrap each refactor in a skill with `context: fork`, so each one runs in an isolated subagent and returns a summary to the main conversation for comparison.
- **B)** Run each refactor as a separate `claude -p --resume <session_id>` call against the current session, so both attempts start from the same briefed context.
- **C)** Fork the session — `/branch` in the CLI, `fork_session` in the Agent SDK — which copies the whole conversation so each branch explores one refactor from this exact state.
- **D)** Delegate each refactor to an Explore subagent, which gets its own context window and reports back without polluting the main conversation with either attempt.

## Q11 (cruza 3.4 + 3.6)
A compliance requirement states that the CI review job must be incapable of modifying the repository it reviews — not merely unlikely to. The current job runs `claude -p --bare --output-format json --json-schema <schema> --allowedTools "Read,Grep,Glob"` and the review prompt ends with "do not modify any files; only report findings". An audit found one run last quarter where a file under `.github/` was rewritten. Which change satisfies the requirement?

- **A)** Add `--permission-mode plan` to the job, so edits are blocked while the review still reads the diff and produces its findings.
- **B)** Strengthen the prompt with an explicit prohibition plus examples of refused edit requests, and log every tool call so a violation is caught in review.
- **C)** Keep `--allowedTools "Read,Grep,Glob"` and add `--max-turns 3`, so the run cannot reach a turn in which it would attempt a write.
- **D)** Restrict which tools exist with `--tools "Read,Grep,Glob"`, since `--allowedTools` only pre-approves tools instead of removing the write tools.

## Q12 (cruza 3.1 + 3.2)
A team's `.claude/skills/commit-helper/SKILL.md` encodes 4 commit conventions and is committed to the repository. One developer also keeps `~/.claude/skills/commit-helper/SKILL.md`, a two-line personal shortcut written months ago. That developer's commits satisfy only the personal shortcut and miss all 4 team conventions, while the same developer's personal `~/.claude/CLAUDE.md` preferences and the project's `CLAUDE.md` rules both clearly take effect together in every session. What explains the difference, and what is the correct fix?

- **A)** Skill bodies are concatenated like memory files, but the personal file's shorter body is loaded last and truncates the team content; the fix is to shorten the team skill so both fit.
- **B)** Skills with the same name across scopes override without merging, so the personal skill fully replaces the team's, while memory files concatenate across layers; renaming the personal skill lets both coexist.
- **C)** Claude picks whichever of the two skills has the `description` that better matches the request, so the personal one keeps winning; the fix is to write a more specific `description` on the team skill.
- **D)** Project-scope skills load on demand while user-scope skills are always in context, so the personal one is simply seen first; the fix is to add a `paths` glob to the team skill so it loads earlier.
