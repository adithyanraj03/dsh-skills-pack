---
name: ds-review-loop
description: "Pause the work, run ONE fresh-context review subagent on the current change, wait for its verdict, fix or push back, then continue the task. At most four rounds, one subagent at a time. Use before reporting a nontrivial change as done, before filing a PR, when the user says review it, get it reviewed, or /ds-review-loop."
metadata:
  source: "adapted from github.com/aicodeking/deepseek-stack (MIT, (c) 2026 AICodeKing)"
---

Make a change more correct by pausing for one fresh reviewer, then carrying on. The user runs with concurrency 1: never run a reviewer alongside other work or other subagents.

## Steps

1. Pause. Finish or revert the current step so the tree is in a known state. Make no edits from here until the review returns.
2. Scope the change.
   - In git: run `git status --short`. Do not stash, discard or include unrelated files. Find the base: if a remote exists, `git fetch origin` then `git merge-base HEAD origin/<base branch>`; with no remote, use the commit the task started from (or `HEAD` for uncommitted work). Use one diff command for every round, e.g. `git diff <base> -- <paths>`.
   - Not in git: list the changed files and use the checkpoint folder (see the `checkpoint` skill) as the base, e.g. `git diff --no-index <checkpoint>/<file> <file>`.
3. Write the goal and out-of-scope list in two sentences. Run the covering checks. Do not send code that fails them.
4. Start exactly one review subagent with the harness's subagent tool, and wait for it to finish. Do not start anything else while it runs. If the harness lets you pick a model, use the strongest one available at high reasoning effort; otherwise a fresh context of the same model is fine. Record which.
5. Send this brief:

   ```
   Review only. Do not edit, commit, push, comment or start subagents.
   Repo: <path>  Base: <base>  Diff: <diff command>
   Goal: <goal>  Out of scope: <list>  Checks: <results>
   Read the code around the diff. Use graft_callers on changed symbols and
   graft_ask / graft_skeleton for context; use grep only if graft tools are missing.
   Find bugs, broken callers and gaps against the goal.
   Flag code the goal does not need. Ignore style unless it hides a bug.
   blocker = goal case is wrong. should = real bug users will hit. nit = anything else.
   Reply: VERDICT: APPROVE or CHANGES, then one line per finding:
   R1 [blocker|should|nit] file:line claim. Fix: suggestion
   ```

6. Read the reply. A timeout, error or empty reply is not approval: retry once, then report it.
7. Judge each finding yourself against the code. Agree: make the smallest fix, preferring to delete or narrow code. Disagree: write a one-line reason with evidence (file:line, test output). Nit or out of scope: decline in one line.
8. Keep a ledger: id, severity, outcome, evidence. Re-run checks and the diff stat. If the diff grew, cut it back.
9. If any blocker or should was fixed, start the next round: a new single subagent with the brief, the ledger and the changes since the last round. Ask it to check only open ids and changed code.
10. When the loop stops, resume the original task where you paused.

## Stop when

- The reviewer returns APPROVE on the current diff, no blocker or should is open, and you have no concern left.
- A round returns only nits.
- Four rounds are done, or one item stays disputed after two exchanges. Report both sides in two or three lines each and let the user decide. This is not approval.

## Rules

- One reviewer subagent at a time, never in parallel. Never agree just to end the loop.
- Do not push during the loop. Push afterward only if the user asked to push or ship.
- Report rounds, reviewer, fixed and declined findings with reasons, and diff size before and after.
