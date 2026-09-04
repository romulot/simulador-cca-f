# Simulado de Revisão — CCA-F | Domínio 5 (Context Management & Reliability)

**Cobertura:** 5.1 (contexto em interações longas) · 5.2 (escalação/ambiguidade) · 5.3 (propagação de erros multi-agente) · 5.4 (contexto em codebases grandes) · 5.5 (human review / calibração de confiança) · 5.6 (proveniência e incerteza em síntese).
**Formato:** múltipla escolha baseada em cenário — 1 correta + 3 distratores (questões em inglês). 12 questões, nível prova, maioria Médio/Difícil. Inclui **4 itens cruzados inéditos** (Q9–Q12) combinando task statements; entre os quatro, os **seis** task statements aparecem.

> Responda antes de consultar o gabarito em `dominio-5_revisao_gabarito.md`.

---

## Q1
An Agent SDK service generates patches for tickets in sessions that routinely run past 50 turns; everything older than the last ten turns is folded into a running summary. Each ticket record stores the constraints the requester declared when the ticket was opened. Over one quarter, 23 of 140 merged patches violated a constraint the requester had stated in the opening turns — a pinned library version, a forbidden dependency, a latency budget. In all 23, the summary read "the requester described the integration and its constraints", naming none of them. Which change is most effective?

- **A)** Instruct the summarizer to enumerate every stated constraint verbatim whenever it folds an older turn into the running summary.
- **B)** Move the service to a model whose context window is large enough that the transcript never has to be folded at all.
- **C)** Build a constraints block from the ticket record and re-send it verbatim in every request, outside the summarized history.
- **D)** Add a step that classifies each turn for constraint-bearing content and keeps those turns verbatim while the rest is folded.

## Q2
A support agent's system prompt lists three escalation triggers verbatim: the customer asks for a person, the published policy does not address the request, the agent cannot make progress. Escalations still run at 3.1× the volume the review desk was sized for. A sample of 200 escalations breaks down as 118 multi-step cases fully covered by policy, 44 customers who wrote angrily but never asked for a person, and 21 requests the customer had framed as "I know this is an exception, but…" where the policy in fact covered it. Which change is most effective?

- **A)** Add a `PreToolUse` hook that blocks the escalation tool unless the policy lookup for that request came back with no matching section.
- **B)** Add the three negatives beside the triggers: complexity, sentiment and a customer framing a request as an exception are not triggers.
- **C)** Score each inbound message for sentiment and escalate only above a tuned threshold, so angry-but-covered cases stop reaching the desk.
- **D)** Train a case-complexity classifier on the 200 sampled escalations and let it decide which cases the agent is allowed to escalate.

## Q3
A multi-agent research system was corrected last quarter after a timed-out source had been reported as "no evidence found". The fix now marks every subtopic that returns no findings as "could not verify". Across 90 briefs since, 61 subtopics were marked that way; 47 of them came from queries that completed successfully and returned zero matches, and clients re-commissioned 12 of those searches, each of which again returned nothing. The subagent's report tool takes `{"status": "ok" | "erro", "mensagem": string}`. What is the most effective correction?

- **A)** Keep marking every finding-free subtopic as unverified, since over-reporting a gap is the safe direction and a re-run costs less than a published false negative.
- **B)** Have the subagent retry each finding-free query against an alternative source before reporting, so that a genuine absence is confirmed by a second source.
- **C)** Add a classifier over the subagent's `mensagem` text that decides, per subtopic, whether the report describes an access failure or a genuine absence.
- **D)** Extend the report contract so a completed query returning zero matches is distinguishable from an access failure, and record the first as a verified negative finding.

## Q4
A Claude Code exploration agent maintains `findings.md`, one entry per finding with file path and symbol; after three phases it holds 96 entries. Each new investigation is delegated with the `Task` tool, and the subagent's prompt ends with "consult `findings.md` if useful". Across 22 investigations the subagents opened the file in 4 of them, and 9 of the 22 reports re-derived a module the file already documented. The file itself is accurate and current. What is the most effective change?

- **A)** Have the coordinator select the entries relevant to each question and inject them into the subagent's prompt, instead of pointing the subagent at the file.
- **B)** Reword the instruction so the subagent is told it must read `findings.md` before its first search, rather than being told to consult it if useful.
- **C)** Pull `findings.md` into `CLAUDE.md` with an `@import`, so that its contents are loaded automatically at the start of every session.
- **D)** Have each subagent append its own findings to `findings.md` when it finishes, so the file keeps growing and later investigations have more to draw on.

## Q5
An extraction service publishes one weekly accuracy number computed over every field of every document it processed that week. It has sat between 96.4% and 97.2% for eleven consecutive weeks. In week 7 a new document type was onboarded and now accounts for roughly 5% of volume; support tickets reporting extraction errors on that type have tripled since, and all 40 tickets sampled were genuine errors. The weekly number has not moved. What is the most likely root cause, and the fix?

- **A)** The weekly measurement covers too few documents to detect a change of this size; computing it over every processed document would surface the regression.
- **B)** The extractor regressed when the new type was onboarded; re-running the previous model version over that type would show how far it degraded.
- **C)** A 5% segment can degrade while the aggregate stays in its band; report accuracy per document-type × field cell, with each cell's `n` beside it.
- **D)** The dashboard carries no confidence signal; publishing the mean self-reported confidence per week would reveal the drop the accuracy number hides.

## Q6
Each subagent in a research system returns findings as structured records carrying `fonte_id`, the supporting excerpt and `data_publicacao`, and an audit confirms 100% of those records are complete. The synthesis agent's own output tool takes `{"conclusoes": string[], "fontes_consultadas": string[]}`. Over the last 40 briefs, readers could trace 18% of the published conclusions to a specific document; the rest were traceable only to the list of twelve sources at the end. No subagent failed. What is the most effective change?

- **A)** Instruct the synthesis agent to name the source document inside the text of every conclusion it writes into the final report.
- **B)** Change the synthesis output contract so each conclusion is an object carrying the `fonte_id`s, period and method of the records it came from.
- **C)** Add a verification pass that reads each published conclusion and re-attributes it to the most likely document among the twelve sources.
- **D)** Expand `fontes_consultadas` to hold the full citation of every source, so a reader has enough detail to locate the document behind a conclusion.

## Q7
A support agent resolves the customer before acting on anything. Its `buscar_cliente` tool returns every record matching the name it is given, and in 11% of chats that is two or more records. The agent currently hands every one of those chats to a human, and multi-match chats are now 38% of the review desk's volume; reviewers close 9 of every 10 of them by asking the customer for the last four digits of their document number, which the agent has a tool to look up. What is the most effective change?

- **A)** Keep escalating multi-match chats, since an ambiguous customer identity is exactly the class of case a human reviewer should own end to end.
- **B)** Have the agent select the record with the most recent activity and carry on, since an active account is the one the customer is writing about.
- **C)** Add a `PreToolUse` hook that blocks any write while more than one customer record matches, so no row is ever written against the wrong account.
- **D)** Instruct the agent to treat a multi-match result as ambiguity and ask for another identifier, escalating only if that does not resolve it.

## Q8
A research system merges eight subtopic reports into one brief. To keep the merge mechanical, the synthesis step rewrites every finding — quarterly volumes, press statements, latency measurements — into a single uniform bullet list, one bullet per finding. An audit confirms the rewrite drops nothing: period, unit, method and source survive in every bullet. Even so, across 40 briefs readers came back asking which way a nine-row volume series was moving in 23 of them, and two briefs went out describing that series as flat when its values had risen. Which change is most effective?

- **A)** Render each type in the form it calls for: the volume series as a table, one row per period; the press material as prose; technical findings as a list.
- **B)** Expand every bullet into a full sentence spelling out metric, unit and reference period, so no field has to be inferred from where the bullet sits.
- **C)** Instruct the synthesis agent to state in prose, under the list, which way each series is moving, so a reader who misses it in the bullets reads it there.
- **D)** Add a pass over the merged list that classifies each series as rising, flat or falling and publishes that label beside the bullets of that series.

## Q9 (cruza 5.6 + 5.5)
A document pipeline routes anything holding two candidate values for the same field to a human queue, which is now running 3.4× over capacity. Two populations sit in that queue. In 210 cases the two values come from different publishers, with different collection dates and different stated methods, and reviewers close them by recording both. In 46 cases both values sit inside one filing, from one publisher on one date, with nothing to tell them apart, and reviewers resolve those by contacting the publisher. What is the most effective change?

- **A)** Send both populations to the queue as today and grow the review desk, since a divergence a machine cannot resolve is by definition a human's decision.
- **B)** Split them by whether the provenance fields separate the values: annotate the cross-publisher cases and keep the single-filing ones in the queue.
- **C)** Rank the publishers by credibility and keep the higher-ranked value in both populations, queueing a case only when two publishers happen to rank equal.
- **D)** Run every document through a second extraction pass and keep only values both passes produce, so that a single-pass artefact never reaches the queue at all.

## Q10 (cruza 5.6 + 5.3)
A research system's report envelope already carries `categoria`, `attempted`, partial results and alternative sources, and the coordinator recovers from failures well. A new symptom: when two sources return successfully with different numbers for the same statistic, the subagent reports `{"status": "erro", "categoria": "validation", "mensagem": "conflicting sources"}`. Across 70 briefs the coordinator re-delegated those subtopics with a new query 2.4 times on average, then recorded 31 of them as coverage gaps — though both sources had answered. What is the most effective change?

- **A)** Add `conflito` to the `categoria` enum, so the coordinator can tell a source conflict from a validation failure and stop re-delegating those subtopics.
- **B)** Instruct the subagent to pick the more credible of the two sources and report a single value, naming the value it discarded in `mensagem`.
- **C)** Raise the coordinator's re-delegation budget for `validation` and vary the query more aggressively, giving a conflicting subtopic more chances to resolve.
- **D)** Report divergence on the success path — each value with its `fonte_id`, period and method — leaving reconciliation as a coordinator decision, not a recovery.

## Q11 (cruza 5.4 + 5.1)
A nightly headless Claude Code job migrates 30 modules; each module is one investigate-then-edit unit, and the run opens by stating three migration invariants. Last week the job died at module 12, and rerunning it redid all 30 from scratch. Separately, in the three runs that did complete, modules after roughly the twentieth stopped honouring two of the three invariants — by that point those opening turns had been folded into the session's running summary. What is the most effective change?

- **A)** Rerun with `--resume <session-id>`: the restored session carries the full history, tool calls and results included, so the completed modules come back with it.
- **B)** Export each finished module's state to a known path with a manifest the next run loads, and re-send the invariants as a fixed block in every prompt.
- **C)** Move the job to a model with a far larger context window, so the transcript never has to be folded and a rerun keeps everything the previous run produced.
- **D)** Have each run export finished-module state to a known path and load it at startup, and instruct the summarizer to reproduce the three invariants verbatim whenever it folds a turn.

## Q12 (cruza 5.2 + 5.5)
A support agent uses two mechanisms. Escalation follows three stated triggers: the customer asks for a person, the policy does not address the request, the agent cannot progress. Separately, routine refunds are auto-approved when the agent's self-reported confidence clears a threshold chosen against a 400-ticket labelled set — high band 98.6% correct (n=140), medium 90.0% (n=40), low 60.0% (n=20), monotonic, with every category inside the high band at or above 98% and n ≥ 30. A proposal replaces the three triggers with that same threshold. What is the best response?

- **A)** Adopt the proposal: the threshold is calibrated against a labelled set, so it is a measured instrument and should replace criteria that were written by hand.
- **B)** Drop the confidence routing too and decide both by the three triggers, since a model's self-reported confidence is a poorly calibrated signal to route on.
- **C)** Keep both: the triggers decide escalation, a criterion about the request, and the calibrated threshold stays on refund approval, where it was measured.
- **D)** Replace both with a classifier trained on the 400 labelled tickets, producing one score that decides escalation and refund auto-approval at the same time.
