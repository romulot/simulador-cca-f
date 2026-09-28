# Gabarito — Caso piloto: atendimento e reembolsos

## Q1 — Resposta correta: **B**

The API's stop reason determines whether tool calls remain to be executed; incidental text is not a completion signal.

- **A — errada:** Classification is probabilistic and still ignores the API's explicit control signal.
- **B — correta.**
- **C — errada:** A prompt cannot guarantee that no text accompanies a tool call.
- **D — errada:** A larger turn limit does not repair an incorrect stopping condition.

**Tópicos:** Loop Agêntico

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: controle do loop em fluxo de suporte
- Cenário: Caso piloto — atendimento
- Princípio testado: stop_reason governa execução de ferramentas

## Q2 — Resposta correta: **A**

The two read-only calls are independent and can run concurrently; the financial side effect must wait for verified results.

- **A — correta.**
- **B — errada:** A financial transfer cannot be undone reliably by cancellation after execution.
- **C — errada:** Cross-customer reuse without correct policy scope can produce a wrong authorization.
- **D — errada:** Combining retrieval and transfer weakens the necessary validation boundary.

**Tópicos:** Loop Agêntico

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: dependências e efeitos colaterais
- Cenário: Caso piloto — atendimento
- Princípio testado: paralelizar leituras independentes sem antecipar mutação

## Q3 — Resposta correta: **B**

The specialist has isolated context and needs a precise, minimal handoff with the relevant verified facts.

- **A — errada:** Full cross-customer history violates the isolation requirement.
- **B — correta.**
- **C — errada:** Capacity does not supply missing facts.
- **D — errada:** Guessing the customer creates an authorization and accuracy risk.

**Tópicos:** Spawn de Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Aplicar
- Dificuldade: Médio
- Rubrica: passagem explícita de contexto
- Cenário: Caso piloto — atendimento
- Princípio testado: delegação com fatos mínimos e identidade correta

## Q4 — Resposta correta: **C**

Customer-written text is untrusted input. A server-side check at the transfer boundary enforces the limit regardless of the model's interpretation.

- **A — errada:** Prompt placement does not enforce a financial limit.
- **B — errada:** An explanation after the decision cannot prevent the transfer.
- **C — correta.**
- **D — errada:** Removing all notes also discards legitimate evidence and does not replace enforcement.

**Tópicos:** Enforcement de Workflow

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: entrada não confiável e limite financeiro
- Cenário: Caso piloto — atendimento
- Princípio testado: validar no limite de execução, não no texto recuperado

## Q5 — Resposta correta: **B**

Approval must be verified by the execution layer and tied to this operation; a model-provided flag is self-attestation.

- **A — errada:** Examples improve behavior but cannot guarantee authorization.
- **B — correta.**
- **C — errada:** The model could set the flag without a real approval.
- **D — errada:** Review after transfer cannot prevent an unauthorized payment.

**Tópicos:** Enforcement de Workflow

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: autorização de efeito financeiro
- Cenário: Caso piloto — atendimento
- Princípio testado: aprovação verificável vinculada à operação

## Q6 — Resposta correta: **B**

The refund service must recognize the same operation across retries; local memory alone disappears in a crash.

- **A — errada:** A new key defeats deduplication.
- **B — correta.**
- **C — errada:** A longer timeout does not cover process failure after the transfer.
- **D — errada:** Blindly skipping retries loses requests that never reached the service.

**Tópicos:** Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: falha entre side effect e persistência
- Cenário: Caso piloto — atendimento
- Princípio testado: idempotência ponta a ponta

## Q7 — Resposta correta: **B**

Durable, scoped checkpoints allow completed validated steps to be reused, while the refund key protects the side effect.

- **A — errada:** A prose summary is not a verified checkpoint or refund state.
- **B — correta.**
- **C — errada:** Token count cannot reconstruct execution state.
- **D — errada:** A client cookie is unsuitable for authoritative tool state and may expose sensitive data.

**Tópicos:** Resume e Fork de Sessão

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Analisar
- Dificuldade: Difícil
- Rubrica: recuperação após falha
- Cenário: Caso piloto — atendimento
- Princípio testado: checkpoints duráveis por etapa

## Q8 — Resposta correta: **C**

The data boundary must be enforced in retrieval and task construction, before information reaches the specialist.

- **A — errada:** A prompt warning cannot erase data already disclosed in context.
- **B — errada:** Temperature does not provide data isolation.
- **C — correta.**
- **D — errada:** Hiding identifiers visually leaves the cross-customer disclosure intact.

**Tópicos:** Spawn de Subagentes

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: isolamento de contexto
- Cenário: Caso piloto — atendimento
- Princípio testado: escopo de dados antes da delegação

## Q9 — Resposta correta: **B**

Unavailable analysis must not be interpreted as approval. Bounded retry and escalation preserve progress without a risky side effect.

- **A — errada:** Successful reads do not imply a positive policy decision.
- **B — correta.**
- **C — errada:** Infinite retry prevents a defined resolution path.
- **D — errada:** A smaller amount still requires a justified decision.

**Tópicos:** Enforcement de Workflow

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: propagação de falha
- Cenário: Caso piloto — atendimento
- Princípio testado: não transformar ausência de decisão em autorização

## Q10 — Resposta correta: **C**

An auditable decision needs scoped evidence, policy version and identifiers linking approval and financial action.

- **A — errada:** The final text alone does not prove which policy or tool outputs were used.
- **B — errada:** Other customers' full conversations violate the isolation requirement.
- **C — correta.**
- **D — errada:** A screenshot confirms display, not the authorization chain.

**Tópicos:** Enforcement de Workflow

**Metadados (revisão; não exibir ao candidato):**
- Bloom: Avaliar
- Dificuldade: Difícil
- Rubrica: rastreabilidade de decisão
- Cenário: Caso piloto — atendimento
- Princípio testado: trilha de auditoria escopada e verificável
