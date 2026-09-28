# Gabarito — Migração em monorepo

## Q1 — Resposta correta: **B**

Scoped package guidance applies to the files being changed while compatible repository rules still matter.

- **A — errada:** The root default does not erase applicable scoped rules.
- **B — correta.**
- **C — errada:** A different package does not govern API-only edits.
- **D — errada:** Read order does not define instruction scope.

**Tópicos:** Hierarquia CLAUDE.md

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Migração em monorepo
- Cenário: Migração em monorepo
- Princípio testado: Scoped package guidance applies to the files being changed while compatible repository rules still matter.
- Domínio: 3

## Q2 — Resposta correta: **A**

A shared authorization path needs caller and invariant analysis before modification.

- **A — correta.**
- **B — errada:** CI failure is a late signal and may miss security regressions.
- **C — errada:** Skipping authorization violates the stated constraint.
- **D — errada:** A name cannot establish the complete contract.

**Tópicos:** Contexto de Codebase

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Migração em monorepo
- Cenário: Migração em monorepo
- Princípio testado: A shared authorization path needs caller and invariant analysis before modification.
- Domínio: 3

## Q3 — Resposta correta: **C**

Measured latency plus explicit invariants make the change verifiable.

- **A — errada:** A subjective report is not a measurement.
- **B — errada:** Line count is not a performance or safety measure.
- **C — correta.**
- **D — errada:** Explanation does not replace observed behavior.

**Tópicos:** Critérios Explícitos

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Migração em monorepo
- Cenário: Migração em monorepo
- Princípio testado: Measured latency plus explicit invariants make the change verifiable.
- Domínio: 4

## Q4 — Resposta correta: **B**

Investigation and a scoped plan reduce the chance of changing shared authorization behavior blindly.

- **A — errada:** A broad refactor expands risk before identifying the cause.
- **B — correta.**
- **C — errada:** Higher limits hide the underlying issue.
- **D — errada:** A release branch does not diagnose the timeout.

**Tópicos:** Plan Mode

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Migração em monorepo
- Cenário: Migração em monorepo
- Princípio testado: Investigation and a scoped plan reduce the chance of changing shared authorization behavior blindly.
- Domínio: 3

## Q5 — Resposta correta: **C**

A missing measurement cannot be converted into a successful performance claim.

- **A — errada:** Functional success does not prove p95 latency.
- **B — errada:** Prior means are not the current p95.
- **C — correta.**
- **D — errada:** Omission hides an unmet acceptance criterion.

**Tópicos:** Propagação de Erros

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Migração em monorepo
- Cenário: Migração em monorepo
- Princípio testado: A missing measurement cannot be converted into a successful performance claim.
- Domínio: 5

## Q6 — Resposta correta: **C**

Path-specific rules follow the files being edited; repository-wide constraints remain in force.

- **A — errada:** Reading a file does not make all edits part of that package.
- **B — errada:** Root rules still apply where compatible.
- **C — correta.**
- **D — errada:** Moving code solely to change rule scope damages ownership boundaries.

**Tópicos:** Path Rules

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Migração em monorepo
- Cenário: Migração em monorepo
- Princípio testado: Path-specific rules follow the files being edited; repository-wide constraints remain in force.
- Domínio: 3

## Q7 — Resposta correta: **B**

A gate tied to the exact commit enforces the condition before the side effect.

- **A — errada:** Prompt reminders cannot guarantee compliance.
- **B — correta.**
- **C — errada:** Self-attestation is not an independent check.
- **D — errada:** A comment after opening cannot block the action.

**Tópicos:** Hooks

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Migração em monorepo
- Cenário: Migração em monorepo
- Princípio testado: A gate tied to the exact commit enforces the condition before the side effect.
- Domínio: 1

## Q8 — Resposta correta: **C**

A check validates the commit it ran on, not subsequent edits.

- **A — errada:** Branch identity does not freeze content.
- **B — errada:** Line count does not preserve behavior.
- **C — correta.**
- **D — errada:** Prior review cannot validate new code.

**Tópicos:** CI/CD

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Migração em monorepo
- Cenário: Migração em monorepo
- Princípio testado: A check validates the commit it ran on, not subsequent edits.
- Domínio: 3

## Q9 — Resposta correta: **B**

Examples inform approach but cannot override the bank's authorization requirement.

- **A — errada:** A prior example can be inappropriate here.
- **B — correta.**
- **C — errada:** Conditional bypass still weakens authorization.
- **D — errada:** Rejecting useful context is unnecessary.

**Tópicos:** Few-Shot

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Migração em monorepo
- Cenário: Migração em monorepo
- Princípio testado: Examples inform approach but cannot override the bank's authorization requirement.
- Domínio: 4

## Q10 — Resposta correta: **C**

Both latency and authorization are acceptance criteria; the iteration must satisfy both.

- **A — errada:** A known regression violates the task.
- **B — errada:** Longer lifetime worsens stale decisions.
- **C — correta.**
- **D — errada:** Removing a test hides a real failure.

**Tópicos:** Refinamento Iterativo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Migração em monorepo
- Cenário: Migração em monorepo
- Princípio testado: Both latency and authorization are acceptance criteria; the iteration must satisfy both.
- Domínio: 3

## Q11 — Resposta correta: **C**

A compact record must preserve authoritative facts and provenance while dropping irrelevant noise.

- **A — errada:** Raw logs can bury current constraints.
- **B — errada:** A conclusion alone is difficult to audit.
- **C — correta.**
- **D — errada:** A guess is not a replacement for policy evidence.

**Tópicos:** Contexto Longo

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Migração em monorepo
- Cenário: Migração em monorepo
- Princípio testado: A compact record must preserve authoritative facts and provenance while dropping irrelevant noise.
- Domínio: 5

## Q12 — Resposta correta: **A**

Reusable workflow guidance helps consistency without pretending incidents have identical causes.

- **A — correta.**
- **B — errada:** A fixed edit ignores the actual bottleneck.
- **C — errada:** Premature success hides missing evidence.
- **D — errada:** Embedding credentials exposes secrets unnecessarily.

**Tópicos:** Commands e Skills

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Migração em monorepo
- Cenário: Migração em monorepo
- Princípio testado: Reusable workflow guidance helps consistency without pretending incidents have identical causes.
- Domínio: 3

## Q13 — Resposta correta: **C**

Invalid output must not cross the commit boundary; a bounded repair can use explicit validator feedback.

- **A — errada:** Partial validity is still invalid.
- **B — errada:** A summary cannot override validator output.
- **C — correta.**
- **D — errada:** Silent schema relaxation changes the contract.

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Migração em monorepo
- Cenário: Migração em monorepo
- Princípio testado: Invalid output must not cross the commit boundary; a bounded repair can use explicit validator feedback.
- Domínio: 4

## Q14 — Resposta correta: **C**

Generated output can leak secrets just as source can; the failed gate must be resolved.

- **A — errada:** Source-only inspection misses build artifacts.
- **B — errada:** Hiding evidence does not remove exposure.
- **C — correta.**
- **D — errada:** Blanket suppression removes a useful protection.

**Tópicos:** CI/CD

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Migração em monorepo
- Cenário: Migração em monorepo
- Princípio testado: Generated output can leak secrets just as source can; the failed gate must be resolved.
- Domínio: 3

## Q15 — Resposta correta: **C**

Reviewers need causal changes and verifiable outcomes tied to the final state.

- **A — errada:** A claim without evidence is insufficient.
- **B — errada:** A file list lacks behavior and risk.
- **C — correta.**
- **D — errada:** A raw transcript obscures the decision and verification.

**Tópicos:** Plan Mode

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Migração em monorepo
- Cenário: Migração em monorepo
- Princípio testado: Reviewers need causal changes and verifiable outcomes tied to the final state.
- Domínio: 3
