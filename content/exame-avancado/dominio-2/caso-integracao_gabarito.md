# Gabarito — Integração de compras corporativas

## Q1 — Resposta correta: **B**

The order boundary must validate a catalog-backed SKU and size rather than trusting a plausible text match.

- **A — errada:** Price alone does not establish specification equivalence.
- **B — correta.**
- **C — errada:** Prompt examples cannot enforce the order schema.
- **D — errada:** A vendor mapping cannot substitute for the authoritative catalog.

**Tópicos:** Descrições de Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Integração de compras corporativas
- Cenário: Integração de compras corporativas
- Princípio testado: The order boundary must validate a catalog-backed SKU and size rather than trusting a plausible text match.
- Domínio: 2

## Q2 — Resposta correta: **A**

A typed transient failure permits a bounded retry; an empty result means a completed query with no matches.

- **A — correta.**
- **B — errada:** An empty success hides the transport failure.
- **C — errada:** Unstructured prose loses a reliable branch condition.
- **D — errada:** Unbounded retries can exceed the deadline and conceal failure.

**Tópicos:** Erros Estruturados

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Integração de compras corporativas
- Cenário: Integração de compras corporativas
- Princípio testado: A typed transient failure permits a bounded retry; an empty result means a completed query with no matches.
- Domínio: 2

## Q3 — Resposta correta: **C**

The specialist needs bounded, verified facts and a specific decision request.

- **A — errada:** The specialist has no automatic access to the coordinator's facts.
- **B — errada:** Broad histories expose unrelated department data.
- **C — correta.**
- **D — errada:** Post-hoc rationale does not validate authorization.

**Tópicos:** Coordenador e Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Integração de compras corporativas
- Cenário: Integração de compras corporativas
- Princípio testado: The specialist needs bounded, verified facts and a specific decision request.
- Domínio: 1

## Q4 — Resposta correta: **B**

The operation must be selected by stable identity and validated contract, not by display-name similarity.

- **A — errada:** Descriptions alone are not a stable operation identity.
- **B — correta.**
- **C — errada:** Parallel writes risk duplicate orders.
- **D — errada:** A prompt rename cannot resolve registry ambiguity.

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Integração de compras corporativas
- Cenário: Integração de compras corporativas
- Princípio testado: The operation must be selected by stable identity and validated contract, not by display-name similarity.
- Domínio: 2

## Q5 — Resposta correta: **C**

Explicit currency in typed arguments prevents a silent cross-currency order.

- **A — errada:** A default hides missing information.
- **B — errada:** A web domain cannot prove transaction currency.
- **C — correta.**
- **D — errada:** Prompt priority does not enforce typed financial consistency.

**Tópicos:** Tool Use Schema

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Integração de compras corporativas
- Cenário: Integração de compras corporativas
- Princípio testado: Explicit currency in typed arguments prevents a silent cross-currency order.
- Domínio: 4

## Q6 — Resposta correta: **A**

Tool selection should follow the task; a comparison needs reads, while writes require intent and authorization.

- **A — correta.**
- **B — errada:** A zero-quantity write still couples a read task to an unsafe operation.
- **C — errada:** Rollback may fail after an external side effect.
- **D — errada:** Removing purchase capability entirely breaks the authorized workflow.

**Tópicos:** Tool Choice

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Integração de compras corporativas
- Cenário: Integração de compras corporativas
- Princípio testado: Tool selection should follow the task; a comparison needs reads, while writes require intent and authorization.
- Domínio: 2

## Q7 — Resposta correta: **C**

Provenance and validity must be propagated; an expired external price cannot authorize a current order.

- **A — errada:** A caveat after an order cannot correct the amount.
- **B — errada:** Tool output is not automatically current.
- **C — correta.**
- **D — errada:** Silent substitution misstates provenance and may violate approval.

**Tópicos:** Propagação de Erros

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Integração de compras corporativas
- Cenário: Integração de compras corporativas
- Princípio testado: Provenance and validity must be propagated; an expired external price cannot authorize a current order.
- Domínio: 5

## Q8 — Resposta correta: **B**

A structured rate-limit signal lets the coordinator avoid impossible retries within the remaining deadline.

- **A — errada:** A hidden wait violates the request deadline.
- **B — correta.**
- **C — errada:** An empty success misrepresents the failure.
- **D — errada:** Aggressive retries worsen throttling and ignore the explicit delay.

**Tópicos:** Erros Estruturados

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Integração de compras corporativas
- Cenário: Integração de compras corporativas
- Princípio testado: A structured rate-limit signal lets the coordinator avoid impossible retries within the remaining deadline.
- Domínio: 2

## Q9 — Resposta correta: **C**

A financial write needs a validated approval decision; bounded repair cannot turn failure into permission.

- **A — errada:** A nominal amount alone may not satisfy department policy.
- **B — errada:** Unstructured text lacks a verifiable approval record.
- **C — correta.**
- **D — errada:** Silent denial loses the distinction between policy rejection and technical failure.

**Tópicos:** Validação e Retry

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Integração de compras corporativas
- Cenário: Integração de compras corporativas
- Princípio testado: A financial write needs a validated approval decision; bounded repair cannot turn failure into permission.
- Domínio: 4

## Q10 — Resposta correta: **C**

External text cannot grant authority; the order service must verify approval independently.

- **A — errada:** Prompt precedence alone is not an enforcement boundary.
- **B — errada:** Removing quotes makes purchases uninformed.
- **C — correta.**
- **D — errada:** A model vote remains a probabilistic judgment over untrusted content.

**Tópicos:** Enforcement de Workflow

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Integração de compras corporativas
- Cenário: Integração de compras corporativas
- Princípio testado: External text cannot grant authority; the order service must verify approval independently.
- Domínio: 1

## Q11 — Resposta correta: **C**

Least privilege removes a needless execution surface from the purchase flow.

- **A — errada:** A prompt request does not remove the capability.
- **B — errada:** HTTPS does not make page instructions trustworthy.
- **C — correta.**
- **D — errada:** Running page-supplied code creates the very exposure to avoid.

**Tópicos:** Built-in Tools

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Integração de compras corporativas
- Cenário: Integração de compras corporativas
- Princípio testado: Least privilege removes a needless execution surface from the purchase flow.
- Domínio: 2

## Q12 — Resposta correta: **B**

A useful synthesis distinguishes known amounts from missing inputs and preserves provenance.

- **A — errada:** A listed price is not necessarily total cost.
- **B — correta.**
- **C — errada:** An average cannot infer an unquoted shipping charge.
- **D — errada:** Recency does not erase a material discrepancy.

**Tópicos:** Proveniência e Síntese

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Integração de compras corporativas
- Cenário: Integração de compras corporativas
- Princípio testado: A useful synthesis distinguishes known amounts from missing inputs and preserves provenance.
- Domínio: 5

## Q13 — Resposta correta: **C**

Explicit eligibility criteria prevent an attractive but incomparable quote from winning.

- **A — errada:** "Best" leaves the decision criterion undefined.
- **B — errada:** A vague feeling cannot be audited.
- **C — correta.**
- **D — errada:** Examples cannot override missing current evidence.

**Tópicos:** Critérios Explícitos

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Integração de compras corporativas
- Cenário: Integração de compras corporativas
- Princípio testado: Explicit eligibility criteria prevent an attractive but incomparable quote from winning.
- Domínio: 4

## Q14 — Resposta correta: **C**

An ambiguous write outcome requires reconciliation against the original idempotent operation.

- **A — errada:** A fresh ID can duplicate the order.
- **B — errada:** A different account does not solve outcome ambiguity.
- **C — correta.**
- **D — errada:** An invented confirmation is unsupported by the order service.

**Tópicos:** Erros Estruturados

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Integração de compras corporativas
- Cenário: Integração de compras corporativas
- Princípio testado: An ambiguous write outcome requires reconciliation against the original idempotent operation.
- Domínio: 2

## Q15 — Resposta correta: **B**

The MCP server should mediate scoped operations while secrets remain outside the model context.

- **A — errada:** Transport encryption does not justify exposing credentials to the model.
- **B — correta.**
- **C — errada:** A hidden prompt section is still model context.
- **D — errada:** Shell arguments can leak secrets and bypass scoped operations.

**Tópicos:** MCP Servers

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: decisão contextual no Integração de compras corporativas
- Cenário: Integração de compras corporativas
- Princípio testado: The MCP server should mediate scoped operations while secrets remain outside the model context.
- Domínio: 2
