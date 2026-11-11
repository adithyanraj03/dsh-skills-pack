---
name: dsh-plugin-dev
description: "Conventions and pitfalls for building, installing, testing and releasing dsh (DeepSeek Harness) plugins: cordis.patch.yml, the host half and the browser (client) half, package.json dsh fields, dsh.plugin.json, linking into a profile, the pnpm ERR_PNPM_IGNORED_BUILDS trap, and tool-parameter design. Use when creating or changing a dsh plugin, when a plugin installs but does not appear, or when preparing a plugin release."
---

# dsh-plugin-dev

A dsh plugin is an npm package with two halves that the loader wires together. Most failures are wiring, not code: the plugin installs, dsh starts cleanly, and nothing shows up.

## Layout (match the existing plugins)

Reference plugins to copy from: published dsh plugins such as `dsh-graft-plugin` and `dsh-cite-lens` (github.com/adithyanraj03), and any local plugins under your profile's `plugins/` directory. Read one with `graft_map` / `graft_skeleton` before writing a new one.

- `package.json`
  - `name`: the npm package name. `"type": "module"`, `main` pointing at the host entry (e.g. `./src/index.js`).
  - `exports` must include `"."`, `"./client"` (if there is a browser half), `"./cordis.patch.yml"` and `"./package.json"`.
  - `files` must list every file the package needs at runtime, including `cordis.patch.yml`, `dsh.plugin.json`, built client files and the icon. A file missing here works locally via `link:` and breaks after publish.
  - `dsh.bundle.patch`: `"./cordis.patch.yml"`.
  - `dsh.client`: `platform: "web"`, the `inject` list of `@deepseek-ai/dsh-client-ui-*` packages the client uses, and its entry.
- `cordis.patch.yml`: mounts the host half with an `insert` row. The row's `name` MUST equal the package name exactly, because the loader imports that specifier. The row's `id` is the plugin's storage/prompt/effect key: once released, do not rename it, or saved user state is orphaned.
- `dsh.plugin.json`: `id`, `version` (keep in sync with package.json), `main`, `description`, `engines.dsh` (minimum host version), `contributes.commands`, `client.main`.
- Browser half: source in `src/client/`, bundled by `build.mjs` into `lib/client.js`. Rebuild after every client edit; the profile loads the built file.

## Renaming

The package name lives in three places that must change together: `package.json` `name`, the `name` field of the `cordis.patch.yml` insert row, and the install command in `README.md`. Miss one and the plugin installs and then fails to mount.

## Tool design for the model

- No boolean parameters. Use string enums (`detail: "full" | "brief"`). Some OpenAI-compatible servers emit a tool call that sets a boolean as literal `tool_call` text, and it never runs.
- Short, concrete tool descriptions that say when to use the tool and what it returns.
- Errors returned to the model name the fix ("graft CLI not on PATH: run npm install -g @nanonets/graft"), not just the failure.

## Local install and test

- The working profile is `<DSH_HOME>/profiles/web` (default `~/.dsh/profiles/web`). Local plugins are linked in its `package.json` as `"<name>": "link:<absolute path to the plugin folder>"`.
- Run the plugin's own tests first: `npm test` (node `--test` or the `scripts/test-*.mjs` files).
- Then restart dsh on the profile and check the plugin really mounted: the UI element appears, its `/command` works, and the dumped config contains exactly one row with its `id` (`dsh --profile web --dump-config`, then search for `id: <plugin-id>`).
- Never install the published package into a profile that already links the local copy of the same plugin: you get two rows with one id. Remove the local row and `link:` entry first, or test in a throwaway profile.
- Do not edit the profile's `cordis.patch.yml` provider/model config while working on a plugin; it holds the user's model and API setup.

## The silent-install trap (pnpm 10+)

pnpm 10 blocks `postinstall` scripts from unapproved packages and exits non-zero with `ERR_PNPM_IGNORED_BUILDS`. dsh then skips writing the plugin's bundle row: the dependency is in `package.json`, the plugin is not in `dsh.profile.bundles`, and dsh starts with no error.

Fix: in the profile directory run `pnpm approve-builds` and approve the plugin, then re-run the `dsh plugin --profile web add <name>`. If nothing is awaiting approval, look in `pnpm-workspace.yaml` for an unanswered placeholder entry for the plugin and set it to `true` first.

Also: `dsh plugin ... update <name> --latest` may not move a version pinned in `pnpm-lock.yaml`. Use `pnpm add <name>@<version>` in the profile directory.

## Host version compatibility

- dsh 0.2 requires every strict remote codec to carry a `create()` schema factory; 0.1 used a `schema` key. Ship both when supporting both hosts.
- Some `@deepseek-ai/dsh-client-ui-*` packages were removed in later host versions. Check each one in `dsh.client.inject` still exists on the target host.
- Record the tested host versions in the README's compatibility table, with what was verified.

## Release

1. Bump the version in `package.json` and `dsh.plugin.json`.
2. `npm test`, `node build.mjs` if there is a client, then `npm pack --dry-run` and check that every runtime file is listed.
3. Install from a clean clone (`dsh plugin --profile web add github:<owner>/<repo>`) and verify it mounts, before publishing.
4. Release notes in the owner's format: a headline feature section with numbered what-the-user-sees steps, an "Also in this version" list, and a "File | Use it if" table for install paths. Credit contributors with `@handle` and PR link in the first line.
5. Publishing to npm, pushing tags or posting to the marketplace are outward-facing: ask before doing them.

## Stop when

- The plugin's tests pass, it mounts on a restarted profile with exactly one row, and its UI/command/tools are confirmed working, each with the evidence.
- Or it does not mount after the checks above. Report the dumped-config row status, the pnpm output and the dsh startup log lines.
