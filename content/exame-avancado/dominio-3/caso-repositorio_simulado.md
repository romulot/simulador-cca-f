# Exame Avançado — Migração em monorepo

## Caso base

A bank maintains a monorepo with a customer API, a migration utility, and a web app. A Claude Code agent is asked to update the API without changing the database schema or committing secrets. Root `CLAUDE.md` defines repository-wide conventions; package-specific instructions cover the API and migration utility. A required CI job runs tests and security checks before a pull request can be merged. Developers can inspect and edit source, but production credentials are unavailable in the workspace. A human owns release approval. A previous attempt changed unrelated packages and relied on an agent-written claim that tests passed without checking CI.

The team now asks the agent to fix a timeout in the API while preserving authorization behavior. New evidence arrives as the investigation progresses. Apply the repository and release constraints throughout the following questions.

---

## Q1

The API package instructions require a different test command from the root default. The agent is editing only API files. Which instruction set should drive its verification?

- **A)** Only the root instructions, because they are always more authoritative than package guidance.
- **B)** The package-specific instructions for API work together with compatible root conventions.
- **C)** The migration utility instructions, because database behavior might be affected indirectly.
- **D)** Whichever instruction file was opened most recently by the agent.

---

## Q2

The agent sees `authorizeRequest` called from two API routes and a shared middleware. It proposes changing the middleware to speed up one route. What investigation should precede that edit?

- **A)** Search the middleware's callers, tests and authorization assumptions, then constrain the change to the proven bottleneck.
- **B)** Edit the middleware first and let CI reveal affected routes.
- **C)** Remove middleware from the slow route because fewer checks always reduce latency.
- **D)** Ask the model to infer the authorization contract from the function name alone.

---

## Q3

A request says "make the API fast" while the bank forbids schema changes and authorization regressions. Which acceptance criteria make the task reviewable?

- **A)** "The agent reports that the API feels responsive."
- **B)** "The patch uses fewer lines than before."
- **C)** "The measured timeout path meets the agreed latency target, schema diff is empty, and authorization tests remain green."
- **D)** "The model explains its reasoning in a long final message."

---

## Q4

The timeout might involve shared middleware and multiple packages. What is the best first agent action?

- **A)** Make a broad automated refactor across all packages to maximize consistency.
- **B)** Inspect the call path and propose a scoped plan before edits, then execute after the likely cause and checks are clear.
- **C)** Skip investigation and increase every timeout value.
- **D)** Create a production release branch immediately so changes are visible.

---

## Q5

A load test returns 200 responses but its p95 latency measurement is missing because the metrics collector failed. How should the agent report the outcome?

- **A)** Claim the performance target passed because functional requests succeeded.
- **B)** Use the mean latency from a previous release as this run's p95.
- **C)** Mark performance verification inconclusive, preserve the collector error, and rerun with working measurement.
- **D)** Omit performance from the PR description to keep attention on green tests.

---

## Q6

The migration package has stricter rollback rules than the API package. The agent only reads a migration file while editing the API. What scope decision is sound?

- **A)** Apply migration edit rules to every file because the migration file was read.
- **B)** Ignore all root rules once any package rule exists.
- **C)** Apply edit-specific migration rules only if migration files are changed; keep global constraints for all work.
- **D)** Move the API change into the migration package so its stronger rules apply.

---

## Q7

The agent previously opened PRs without verified tests. What mechanism can block PR creation until a trusted check succeeds?

- **A)** A reminder in `CLAUDE.md` that says "never forget tests."
- **B)** A `PreToolUse` gate on PR creation that verifies a recorded CI result for the exact commit.
- **C)** A boolean `tests_passed` argument filled in by the same agent.
- **D)** A reviewer comment added automatically after the PR is opened.

---

## Q8

CI is green on commit A; the agent then changes authorization code in commit B. Should it cite A's result when opening the PR?

- **A)** Yes, because both commits share a branch name.
- **B)** Yes, if only a small number of lines changed.
- **C)** No; rerun or verify checks for B, and bind the gate to B's commit SHA.
- **D)** No checks are needed once an earlier commit was reviewed.

---

## Q9

A teammate adds examples of past timeout fixes. One example disables authorization checks, conflicting with the current constraints. How should the agent use them?

- **A)** Copy the example because few-shot examples override the task.
- **B)** Treat examples as illustrative, discard the conflicting pattern and follow explicit constraints and verified tests.
- **C)** Blend the examples by disabling checks only under load.
- **D)** Avoid all examples and refuse to investigate the timeout.

---

## Q10

A scoped cache improves p95 but serves stale authorization decisions after role changes. What is the best next iteration?

- **A)** Keep the faster cache and record the stale decision as a known limitation.
- **B)** Extend the cache lifetime so fewer requests perform authorization.
- **C)** Revise invalidation or cache scope, then repeat latency and role-change tests before claiming success.
- **D)** Delete the role-change test because it does not measure latency.

---

## Q11

The agent's context has accumulated logs from many packages and starts quoting an obsolete policy excerpt. What should be carried forward into a compact working context?

- **A)** All raw logs, regardless of relevance, because more context is always safer.
- **B)** Only the latest assistant conclusion, without source references.
- **C)** Verified current constraints, relevant file paths, observed measurements and unresolved questions, with references to source artifacts.
- **D)** A fresh guess about policy so the agent can continue quickly.

---

## Q12

Several teams repeatedly perform the same API timeout diagnosis. They want reusable steps, but each incident still needs its own evidence. What is appropriate?

- **A)** A reusable skill or command that defines investigation and verification steps while requiring incident-specific measurements.
- **B)** A fixed patch that changes the same middleware line for every incident.
- **C)** A global prompt instructing the agent to report success before measurements exist.
- **D)** A production credential embedded in the skill for convenience.

---

## Q13

A code generation step outputs a config file that fails schema validation. A retry produces another invalid file. What is the correct boundary?

- **A)** Commit the second file because it is closer to valid.
- **B)** Accept it if the agent's summary says validation passed.
- **C)** Bound the retry, surface the validation errors, and stop before committing if the contract remains unmet.
- **D)** Relax the schema silently in production to accept both files.

---

## Q14

A PR passes unit tests but fails a security check that detects a token in a generated artifact. The token is not in source. What should happen?

- **A)** Merge because source files are clean.
- **B)** Remove the artifact from the evidence and preserve the token in the build output.
- **C)** Treat the artifact as a leak, remove the token at its origin, rotate it if exposed, and rerun checks before merge.
- **D)** Suppress the check for generated files permanently.

---

## Q15

The fix now touches the API and shared authorization middleware. A developer asks for the final PR summary. Which summary is most useful?

- **A)** "Fixed timeout; all good."
- **B)** A list of edited files with no measured impact.
- **C)** The cause, scoped changes, current commit's latency and authorization evidence, remaining limitations, and rollback path.
- **D)** A transcript of every agent thought and tool call.

---
