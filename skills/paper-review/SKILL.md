---
name: paper-review
description: "Get a referee-style review of a paper draft from ONE fresh-context review subagent (one at a time, never in parallel): novelty, whether claims are backed by results, baselines, method clarity, figures and tables, overclaiming and venue fit, with findings labeled major, minor or nit. Use before submission, after a major revision, when the user says review my paper, act as a reviewer, or /paper-review."
---

# paper-review

Find what a referee will hit before a referee does. The user runs with concurrency 1: one reviewer subagent at a time.

## Steps

1. Prepare. Build the paper (latex-build) so the reviewer reads the current PDF and sources. Note the target venue and its type (journal / conference), the page limit, and whether review is blind.
2. Write the brief for the reviewer:

   ```
   You are a critical but fair reviewer for <venue>. Review only; do not edit files.
   Paper: <path to PDF> and sources <folder>. Supplementary: <path or none>.
   Assess: (1) novelty vs the cited related work, (2) whether each claim in the
   abstract and contributions is backed by a result in the paper, (3) baselines
   and ablations that are missing, (4) clarity and reproducibility of the method
   (could someone reimplement it?), (5) figures and tables (readable, labeled,
   referenced), (6) overclaiming or unsupported generalisation, (7) fit to venue.
   Reply: SUMMARY (3 lines), SCORE (1-10) and CONFIDENCE (1-5), then one line per
   finding: P1 [major|minor|nit] <section or file:line> <issue>. Suggest: <fix>
   major = would cause rejection or a major revision. Quote the text you criticise.
   ```

3. Start exactly one review subagent with that brief and wait for it. Do not run anything else meanwhile. If a stronger model is selectable, use it. A timeout or empty reply is not a review: retry once, then report.
4. Check each finding against the paper yourself. Mark it: agree, disagree (with the evidence: section, table, line), or out of scope.
5. Report to the user: the summary and score, then agreed majors with a proposed fix each, minors, and the disagreements with reasons. Do not apply fixes to claims, results or structure without the user's go-ahead; you may apply agreed typo and clarity fixes via latex-edit.
6. Optional second round, only if the user asks or majors were fixed: a new single subagent with the brief, the previous findings and what changed. Ask it to check only the open items.

## Stop when

- The report is delivered. At most 2 rounds unless the user asks for more.

## Rules

- The reviewer never edits files and never starts subagents.
- Do not inflate or soften the score to please the user. Report it as given.
- A finding that says "add more experiments" must name which experiment and why; drop vague ones.
- For blind review, flag anything that reveals the authors (names, self-citations in first person, acknowledgements, repo links, file metadata).
