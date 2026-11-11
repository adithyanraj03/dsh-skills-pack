---
name: handoff
description: "Write a short end-of-session handoff note so the next session (or the user) can continue without rereading the transcript: goal, what is done with evidence, what is next, what failed and why, and open decisions. Use at the end of a long session, before a context reset, when pausing unfinished work, or when the user says wrap up, handoff, or where did we leave off."
---

# handoff

The transcript is not a handoff. Put the state in a file a fresh session can read in one minute.

## Steps

1. Write `HANDOFF.md` in the project root (or update it if it exists), under 80 lines:
   - **Goal**: one or two sentences, plus the check that proves the whole task done.
   - **Done**: each verified step with the command and result that proved it.
   - **Next**: ordered steps; the first is the exact next action.
   - **Failed / do not retry**: approaches that did not work, with the reason and the error text.
   - **Open decisions**: things only the user can decide, each with your recommendation.
   - **Key facts**: paths, commands, versions, gotchas, checkpoint folders.
2. Only verified facts go under Done. Anything unverified goes under Next as "verify X".
3. Run the secrets check on the note (see secrets-guard): no keys or tokens.
4. Tell the user the file path and the one-line status.

## Resuming from a handoff

1. Read `HANDOFF.md` (and `git log -5` if in git).
2. Re-run the check of the last Done item; if it fails, fix that first.
3. Do the first Next item.

## Rules

- Replace stale content; do not append forever. Collapse old Done items into one summary line.
- Plain sentences. Name things the way the user would.
