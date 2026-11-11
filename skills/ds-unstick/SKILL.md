---
name: ds-unstick
description: "Break out of a repeating failure: name the assumption behind all the failed fixes, test it directly, list three other approaches, pick one, and restart clean. Use when the same error or wrong behavior comes back after two fix attempts, or when you notice you are retrying small variations of one idea. Invoke as /ds-unstick."
metadata:
  source: "adapted from github.com/aicodeking/deepseek-stack (MIT, (c) 2026 AICodeKing)"
---

# ds-unstick

When two fixes fail the same way, the problem is usually a wrong belief, not a wrong edit. Find that belief and test it.

## Steps

1. Stop editing. Do not try a third variation of the same fix.
2. Write down each failed attempt in one line: what you changed and what happened. Include the exact error text.
3. Write the assumption that all of those attempts shared. Typical examples: "this file is the one that runs", "the config is loaded", "the function receives a string", "the cache is cleared", "the error comes from my code", "this is the python / node / shell I think it is". Name one, in one sentence.
4. Test that assumption directly with the cheapest probe that gives a yes or no answer, and paste the result:
   - Who really calls this, and what does it call: `graft_callers <symbol>`.
   - Where is the real definition or every use: `graft_grep` or `graft_ask`.
   - Which binary or version runs: `where python`, `which node`, `--version`.
   - What value arrives at runtime: one print or log line, or a minimal script.
   - What the installed version's docs say, for the exact version installed.
   Use plain grep only for logs and non-code text, or when the graft tools are not available.
5. If the assumption is false, you have found the real problem. Plan the fix from the new fact.
6. If the assumption holds, list 3 different approaches. "Different" means another mechanism, library, layer or data path, not a tweak of the same edit. Give each approach one line on cost and risk.
7. Pick one approach and say why in one sentence.
8. Restart from a clean state if the failed attempts left debris. Revert only the edits you made during the failed attempts:
   - If you made a checkpoint before starting (see the `checkpoint` skill), restore it.
   - In git, restore only the specific files you changed: `git restore -- <file>` or `git checkout -- <file>`, after checking with `git diff -- <file>` that the file holds only your changes.
   - Never run `git stash`, `git reset --hard`, or `git checkout .`. They also wipe the user's uncommitted work.
   - If a file mixes your edits with the user's, undo your hunks by hand and show the diff.
9. Record the false assumption or the chosen approach where a later session will see it (a handoff note, ledger, or the task list) so nobody repeats the failed attempts.
10. Go back to the normal edit-check loop with the new approach.

## Stop when

- The probe in step 4 explains the failure, or the new approach passes its check.
- Two rounds of this skill have failed. Stop and report to the user: the attempts, the assumptions you tested, and the evidence. Ask for direction.

## Rules

- Do not repeat a fix that has already failed, even with small changes.
- Evidence beats reasoning. If a probe takes a minute, run it.
- Keep the failed-attempt list, because it is the most useful part of the report.
- Use a clean state before a new approach, so that old edits cannot hide the result.
