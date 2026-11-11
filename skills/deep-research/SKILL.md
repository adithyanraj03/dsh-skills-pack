---
name: deep-research
description: "Run a wide, verified research sweep on one question by fanning out parallel subagents, one per angle, then synthesising. USE FOR: deep research, research this, investigate thoroughly, sweep the literature, multi-angle research, fact-check across sources, current state of X, compare sources on X, /deep-research, deep_research tool. DO NOT USE FOR: single-fact lookups, one-page summaries, code archaeology in a repo, or anything answerable from one web_search."
license: MIT
metadata:
  author: adithyanraj03
  version: "1.0.0"
---

# deep-research

Trigger it with **`/research [1-8] <topic>`** — the command posts a fan-out
instruction as a user message, and you then delegate with `subagent`, one call per
angle, all in one message.

There is deliberately **no `deep_research` tool**. A tool that started subagents
itself was removed: the runtime accepted the call, the children ran, and their
results were delivered to nobody. The built-in `subagent` tool is what the harness
treats as a real delegation, so the model must be the one calling it.

## Why parallel, and why subagents

One agent researching six things serially spends most of its context remembering
what it already read. Six children each read one thing and report a compact
result. Use **subagents, not `workflow`**: the workflow worker provisions write
access on the workspace and fails on drives where the account lacks
`WRITE_OWNER`; subagents run in-process and need no grant.

## The sweep

Six angles, chosen to overlap as little as possible:

1. **primary sources** — announcements, filings, docs, first-party statements
2. **quantitative evidence** — numbers, series, measurements, trend over time
3. **recent timeline** — what changed in the last 90 days, in order, dated
4. **expert / analyst commentary** — and where those experts disagree
5. **counter-case** — strongest evidence against, and what would falsify it
6. **cross-check** — where independent sources agree, where only one speaks

Adapt the six to the question; keep them non-overlapping. Six is the default
because it covers a question from both sides without becoming a crowd.

## What every child must do

- **Fetch every URL** before citing it. A citation that was never fetched is a
  guess wearing a link.
- **Drop, don't qualify.** If the source will not load, the claim moves to `gaps`.
- **Date everything.** Prefer the last 90 days unless the angle is historical.
- **Return JSON only:**

```json
{"angle": "...", "findings": [{"claim": "...", "evidence": "...",
 "source": "https://...", "date": "YYYY-MM-DD", "verified": true}],
 "confidence": "high|medium|low", "gaps": ["..."]}
```

## Synthesising

Children report by **message**, not as the tool's return value — wait for them to
land, then synthesise:

1. Group findings by claim, not by child. Three children touching the same fact
   is corroboration only if their sources are independent — check that they are.
2. Keep every `source` with its claim. Drop any claim whose evidence is a single
   unverified source, and say so in the answer rather than silently omitting it.
3. Report disagreements explicitly. "Source A says 4.1, source B says 3.8, and
   neither explains why" is a finding, not a gap to smooth over.
4. Carry `gaps` into the final answer as "what I could not confirm".

## Honest limits

- Depth caps apply: a child cannot fan out beyond the configured depth.
- `maxActiveSubagents` caps concurrency; more angles than slots will queue.
- Parallel children cost tokens in proportion to the angle count. Six is roughly
  six times one sweep — worth it for a decision, wasteful for a lookup.
