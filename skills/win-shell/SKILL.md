---
name: win-shell
description: "Rules for running shell commands on Windows: Git Bash vs PowerShell syntax, python vs python3, quoting paths with spaces, /c/ vs C:\\ drive paths, and what to do when git or gh fails on a non-system drive. Use before running any shell command in this environment, and whenever a command fails with 'not found', a path error, a quoting error, or a git ownership/safe.directory error."
---

# win-shell

Most wasted turns on Windows are shell mistakes, not code mistakes. Know which shell you are in before you type.

## Know your shell

- Check which shell the tool runs: Git Bash (POSIX `sh`) or PowerShell. Do not mix their syntax in one command.
- Git Bash: `/dev/null`, `$VAR`, `&&`, heredocs, forward slashes, drives as `/c/Users/...`, `/d/projects/...`.
- PowerShell: `$null`, `$env:VAR`, `Get-ChildItem`, backtick escapes, drives as `C:\Users\...`, `D:\projects\...`. `&&` works in PowerShell 7+, not in Windows PowerShell 5.1.
- cmd.exe syntax (`%VAR%`, `NUL`, `dir /s`) works in neither. Do not use it.

## Programs and names

- Python: use `python` (or `py -3`), not `python3`. On many Windows setups `python3` is missing or opens the Microsoft Store stub. Check once with `python --version`.
- Use `python -m pip`, not bare `pip`, so packages go to the same interpreter.
- Virtual envs: activate with `.venv\Scripts\Activate.ps1` (PowerShell) or `source .venv/Scripts/activate` (Git Bash). It is `Scripts`, not `bin`.
- Node tools: prefer `npx <tool>` or `pnpm exec <tool>` over global installs.
- Find a binary: `where <name>` (cmd/PowerShell) or `which <name>` (Git Bash). Use this as the first probe when a command is "not found".

## Paths

- Quote every path that has spaces: many folders do (for example `D:\Research Papers\...`).
- Pass absolute paths. `cd` in one command does not reliably carry to the next.
- When a script runs `subprocess` or calls a tool, give it Windows-style paths unless it is a POSIX tool inside Git Bash.
- Line endings: keep the file's existing ending. Do not convert a whole file from CRLF to LF as a side effect of an edit.

## git and gh on non-system drives

- If git says "detected dubious ownership" or "unsafe repository", the drive's ownership differs from the user. Report the exact message, and propose `git config --global --add safe.directory "<path with forward slashes>"`. Ask before running it, since it changes global config.
- If `gh` fails, run `gh auth status` and report the output before trying anything else. Do not retry the same `gh` command in a loop.
- Not every folder is a git repo. Check with `git rev-parse --is-inside-work-tree` before relying on git for undo (see the `checkpoint` skill).

## Long-running and interactive commands

- Never run commands that wait for input (`git rebase -i`, `Read-Host`, `pause`, editors). They hang.
- Use the harness's background or timeout option for long builds and training runs instead of a sleep loop.

## Stop when

- A command fails twice with the same shell-level error (not found, path, quoting, permission). Stop, show the exact error and the probe results (`where`, `--version`, `pwd`), and ask. Do not try a third variant.
