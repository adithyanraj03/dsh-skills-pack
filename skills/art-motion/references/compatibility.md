# Compatibility and Verification Scope

Verification date: 2026-10-08. The following separates installation/configuration, live host execution, and actual media generation; a pass at one level does not stand in for another.

## Installation and configuration upgrade

In an isolated Git worktree, the official skills CLI actually ran `skills add <local release package> --skill huashu-art-motion --agent <host> --yes --copy`, installing each target twice in a row. All three targets—claude-code, codex, and kimi-code-cli—succeeded, and media.json outside the install directory was byte-for-byte unchanged. What is verified here is preference retention after an overwrite reinstall; this does not claim to fully simulate every historical version or every installer's update implementation.

Old voice configuration merges new default fields without rewriting; the newly added image capability remains unselected and unauthorized. The CLI from the Codex install copy read the original system preference and revision rather than reverting to public defaults.

## Live host execution

- Codex CLI 0.160.1: a real session loaded the installed skill and guide and exercised the unconfigured state, generation disabled, no tools, existing-image import, and private system preference saving; the output image was byte-for-byte identical to the source, and configuration sources matched expectations.
- Claude Code 2.1.287: installation and the local CLI work; the live session returned 429 because of the test environment's weekly quota, so the model-execution regression was not completed. This must not be marked as a live pass, nor used to conclude that the skill is incompatible.
- Kimi Code CLI 0.38.0: installation and the local CLI work; the live session returned 403 because of the test account's access permissions, so the model-execution regression was not completed. In this version, non-interactive `--prompt` cannot be combined with `--auto` or `--yolo`; even after correcting the retry command, the account still returned 403.

These sessions used isolated workspaces and media configurations while reusing existing local logins; they were not three brand-new accounts. After the Claude/Kimi account conditions are restored, the live cases still need to be rerun. Tool capability depends on the actual session; a host name does not imply image generation is available.

## Actual media and automated tests

macOS system audio and Volcengine voice cloning completed real short-sentence generation; the current Codex session actually called built-in image generation, producing a 1536×1024 PNG with transparent pixels, and passed plan → tool call → receipt → project copy and SHA acceptance. The image tool call was made by the agent; the CLI did not make the call in its place. This test proves only the integration path and file properties; it does not replace an art-quality judgment.

Automated tests cover configuration merging, permission tightening, concurrent writes, legacy PCM output, incomplete voice streams, image feature/billing selection, cross-session plans, configuration rollback, concurrent image replacement, and release-object checks. CI runs on Linux; real system audio was verified only on macOS, and Windows/Linux system-audio backends are not yet implemented.

## Reproducible minimum checks

```sh
python scripts/capabilities.py status --config <an empty JSON file> --explain
python scripts/capabilities.py image-status --config <JSON that prohibits image generation> --mode generate
python scripts/capabilities.py use-image --file <existing PNG> --out <project>/images/new-file.png
python -m unittest discover -s tests -v
```

Actual image-tool verification forms a snapshot from the current tool schema as described in images.md; when there are no tools, explicitly return unavailable—never use a fictional tool to fake success. CI without credentials or authorization does not call paid media services.
