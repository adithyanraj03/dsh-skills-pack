# Maintenance and Extension

Public code and public recommendations stay inside the package; personal platform, voice and credential references are kept outside the install directory. Do not turn individual experience into a default authorization for everyone.

## Local checks

```sh
python -m pip install requests Pillow
# ffmpeg/ffprobe must also be installed on the system; they are not installed automatically during normal skill activation
python -m unittest discover -s tests -v
```

Unit tests do not call real voice or image generation services. For real host acceptance see the [compatibility record](references/compatibility.md). A new adapter must specify: configuration, probing, the request and output contract, and failure behavior; replacing base_url alone is not enough to claim compatibility with another platform.

## Image tool bridging

Read the [image guide](references/images.md). The host provides the actual tool declarations, the agent performs the calls, and the CLI produces the plan and accepts the artifacts. A receipt is not a platform-signed provenance authentication. Existing images, generation disabled, no tools, unknown billing, reference-image permission and generation failure all need coverage.

A standalone image API executor remains an optional extension; this version does not install it automatically, does not register accounts, and does not borrow another agent's login state.

## Preserve user configuration on update

The install directory may be replaced; the user's media.json must not be written into it. Old configuration gains new fields through default-value merging, new capabilities default to unselected/unauthorized, and existing voice timbres are not retrained or reset automatically. When changing field semantics, provide explicit migration and rollback methods.

## Release checks

After reviewing the changes, stage this release's public files, then generate the file manifest:

```sh
python scripts/check_release.py manifest --repo .
git add release-manifest.json
python scripts/check_release.py check --repo . --ref INDEX
# after committing, verify all pending commits, replacing base with the actual remote baseline
python scripts/check_release.py check --repo . --ref HEAD --base origin/main
```

Check Git objects, not just files on disk; credentials written and then deleted in an intermediate commit are caught too. The manifest only proves the reviewed file set matches — it does not replace code review, real media acceptance or license verification. Bypassing the check or rewriting history to pass as a first release is forbidden.

When reusing code, also preserve the license boundaries of the original fonts, stroke-order data and character demos. Personal feedback stays in personal configuration; only methods and interface experience with reproducible evidence enter the public docs, annotated with date, scope and verification status.
