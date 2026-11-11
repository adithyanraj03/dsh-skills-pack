---
name: ds-blast-radius
description: "Find what a change could break outside its own diff, then prove the key safety fact by running real code. Use before shipping a risky change, a refactor of shared code, a rename, or a config/schema/data-format change, for 'what could this break', 'blast radius of X', or /ds-blast-radius."
metadata:
  source: "adapted from github.com/aicodeking/deepseek-stack (MIT, (c) 2026 AICodeKing)"
---

# ds-blast-radius

Listing callers is easy. The job is finding the breakage that a code search will not show, and proving the change is safe with a run instead of an argument.

## Steps

1. Read the change: the diff, the symbols it adds, changes or removes, and the behavior it now has that the diff does not spell out.
2. Get the direct reach cheaply. Run `graft_callers <symbol>` for each changed or removed symbol to list who calls it and what it calls, and `graft_grep` for string uses (config keys, event names, route paths) that a call graph will not show. Fall back to grep only if the graft tools are not available. Do not spend more time here than that.
3. Find the one or two facts the change is safe because of, for example "this only removes cache entries that are already expired". Most risk clears if that fact holds. Spend your effort here.
4. Look where search stops. Read the source of libraries you call at their pinned version. Check timing: async ordering, teardown, retries. Follow data that leaves the code: API responses, database columns, file formats, config, saved checkpoints, other languages or scripts reading the same data.
5. Grade each key fact by how far you proved it:
   1. you said so (worthless alone),
   2. you pointed at a real file and line,
   3. you traced the failure path and showed it cannot be reached,
   4. you ran a script or test against the real code that fails loudly if you are wrong,
   5. you reproduced it in the running app.
6. Push each key fact to level 4 when it is cheap. Usually that is one small script calling the exact function in question.
7. Report: the callers found, the key facts, their proof level with the command and output, any real breakage found, and what stayed unproven.

## Stop when

- Every key fact is at level 4 or higher, or you have said why it could not be, and the report is written.
- Or you found a real break. Report it with the repro and stop.

## Rules

- A convincing write-up is not proof. Show output.
- Do not fix anything here. Hand fixes to the normal flow.
