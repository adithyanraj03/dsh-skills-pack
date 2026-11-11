---
name: secrets-guard
description: "Keep API keys, tokens, passwords and credential files out of code, configs, commits, logs, published packages, artifacts and chat output. Use before writing a config or .env file, committing, pushing, publishing a package or plugin, uploading or sharing files, creating a checkpoint that will be shared, or when you see something that looks like a key."
---

# secrets-guard

A leaked key is public the moment it is pushed or published. Check before anything leaves the machine.

## When writing code or config

- Read secrets from environment variables (for example a provider config's `apiKeyEnv`), never inline them.
- Put local values in a `.env` or local config file that is gitignored, and commit a `.env.example` with placeholder values.
- Never copy values out of `.credentials.yaml`, `API keys` folders, `.env` files, or the harness's credential stores into code, docs, prompts or chat. Refer to them by name.
- Never print a secret in output. If you must show that one is set, show its length or the first 4 characters only.

## Before commit, push, publish or share

1. List what will leave: `git diff --cached --name-only`, `npm pack --dry-run`, the files of an upload, or the bundle of an arXiv/package release.
2. Scan those files for:
   - key-shaped strings: `sk-`, `ghp_`, `gho_`, `github_pat_`, `xox[bap]-`, `AKIA`, `AIza`, `-----BEGIN ... PRIVATE KEY-----`, long base64/hex blobs assigned to `key`, `token`, `secret`, `password`, `api_key`;
   - files that should never ship: `.env`, `.credentials.yaml`, `*.pem`, `*.key`, `id_rsa*`, `*.p12`, browser profiles, session/history dumps;
   - personal paths and identifiers that do not need to ship: `C:\Users\<name>\...`, internal hostnames, email addresses in logs.
   Use `graft_grep` for code; use plain grep (or `git grep`) for configs, logs and non-code files.
3. If anything is found: stop, remove it from the files, add the file to `.gitignore` if it should never be tracked, and report what was found (file and line, never the value).

## If a secret was already committed or published

- Say so plainly to the user right away. Removing it from the latest commit does not remove it from history or from a published package.
- The real fix is rotating the key at the provider. Recommend that first. Rewriting git history or unpublishing is the user's decision; do not do it without asking.

## Stop when

- The scan is clean and the list of shipped files is shown, or the findings are reported and fixed.
