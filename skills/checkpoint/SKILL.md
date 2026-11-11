---
name: checkpoint
description: "Save a restore point before a risky or multi-file edit, and restore it if the edit goes wrong. Works in git repos and in plain folders without git. Use before a refactor, a bulk edit, a dependency change, an edit to a LaTeX paper, before trying a new approach after a failure, or when the user says checkpoint, snapshot, back this up, or undo."
---

# checkpoint

An edit you cannot undo is a risk you did not need. Take a restore point first; it costs seconds.

## Save

1. List the files you are about to change.
2. Check for git: `git rev-parse --is-inside-work-tree`.
3. In a git repo:
   - Run `git status --short` and note which of your target files already have uncommitted user changes.
   - Copy the target files to a backup folder as below even in git. Do not commit, stash or reset on the user's behalf, because that changes their history or work.
   - If the user has asked you to commit as you go, a commit of only your target files on the current branch is fine instead.
4. Backup folder (always works): copy each target file to `.checkpoints/<YYYYMMDD-HHMMSS>-<label>/` in the project root, keeping the relative path. Write a `MANIFEST.txt` there with the label, the time and the list of files.
5. Make sure `.checkpoints/` will not be committed or shipped: if the folder is a git repo and `.checkpoints/` is not ignored, add it to `.git/info/exclude` (local only, not `.gitignore`).
6. Say in one line: the checkpoint path and the files it holds.

## Restore

1. Show what will change: `git diff --no-index <checkpoint>/<file> <file>` for each file.
2. Copy the files back from the checkpoint. Only the files in the manifest. Never delete other files.
3. Run the check that was passing before (build, test, LaTeX compile) and show the output.

## Clean up

- Keep checkpoints until the task's final check passes. Then tell the user the folder can be deleted. Do not delete it without asking.

## Rules

- Never use `git stash`, `git reset --hard`, `git checkout .` or `git clean` as a checkpoint or restore. They touch work that is not yours.
- Never put secrets into a checkpoint that will be shared. Checkpoints stay local.
- Large binary files (datasets, model weights, PDFs over ~50 MB): do not copy them; note them in the manifest as "not backed up".
