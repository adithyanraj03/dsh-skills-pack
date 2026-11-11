# Optional Voice: Configuration, Skipping, and Existing Material

This page covers optional voice: existing audio, macOS system audio, and Volcengine voice cloning. For the image channel, see the [image capabilities guide](images.md). Configuration uses one external file; no services or plugins are installed.

## Before you start

Check only when the task needs voice; silent animation goes straight into the picture pipeline. If the user already supplied a suitable audio track, use it unless they explicitly ask for re-voicing. Audio-only tasks do not need to start animation design or review.

`S` is the skill directory actually read for this run; it is not fixed to the author's machine or any agent-specific directory. Claude Code, Codex, and Kimi all call the same CLI and do not depend on host-specific hooks.

```sh
python "$S/scripts/capabilities.py" status --explain
# Add --project only when you need preferences from a trusted project
python "$S/scripts/capabilities.py" status --project <project> --explain
```

The check only reads this tool's configuration, the specified credential source of the selected adapter, and necessary local dependencies; it does not verify online. `configured_unverified` means the conditions for calling exist—it does not mean the account or audio quality has been verified; `needs_configuration` is the state that requires choosing a voice method; `prompt:false` means the user previously chose manual configuration, so do not ask again unprompted. The success of an actual request is determined by the artifact and receipt.

On first missing configuration, ask only the one item needed this time: reuse a recording, system audio, your own clone, or skip. If the user has already specified, carry out their choice directly; for a new cloud call / paid usage / training, use authorization already granted for this run—if there is none, state the gap. Do not ask the user to paste a key into the chat.

## Save scope and skipping

An ordinary choice applies only to this run; save it as a user default only when the user says "from now on / default / remember." Ordinary configuration lives outside the install directory: on macOS/Linux, `$XDG_CONFIG_HOME/huashu/media.json` (or `~/.config/huashu/media.json` when unset); on Windows, `%APPDATA%/huashu/media.json`. `HUASHU_CONFIG_HOME` can override the directory; `--config` replaces the default user file.

The agent collects the choices, generates non-sensitive JSON, and hands it to the script to write; the script does not block waiting for stdin interaction.

```sh
# Example JSON: {"preferences":{"voice":{"mode":"system"}}}
python "$S/scripts/capabilities.py" configure --scope user --input <choice.json>
python "$S/scripts/capabilities.py" skip --scope task  # not persisted; skip for this run
python "$S/scripts/capabilities.py" skip --scope user  # enable manually later; do not ask repeatedly
python "$S/scripts/capabilities.py" reset --field preferences.voice
python "$S/scripts/capabilities.py" reset --field onboarding.voice
```

"Skip this time" is recorded in the task state; the next action must not reopen the questionnaire. No answer is not consent, and configure is not run. In batch mode, when required configuration is missing, return the reason with a non-zero exit code; a silent preview may be delivered only when the user accepts a basic preview, and it must not be called a complete voiceover film.

Precedence: this run's arguments → project preferences → user preferences → public defaults. A project's `<project>/.huashu/media.json` accepts only a limited set of preferences and `deny` policy; it cannot contain credentials, private voice bindings, or grants of permission. `status --explain` identifies each field's source; writes use a cross-process lock, and `--expected-revision` prevents a whole-file edit based on an old configuration from overwriting a newer one.

## Three voice paths

```sh
# 1. Reuse existing audio, preserving it byte for byte and generating metadata; if no copy is needed, reference the original track directly
python "$S/scripts/capabilities.py" use-audio --audio original-recording.wav --out <project>/audio/vo.wav
# 2. System audio: macOS only, fixed 48kHz WAV; for Chinese, choose from installed Mandarin voices by default
python "$S/scripts/capabilities.py" say "Text to read" --mode system --out <project>/audio/vo.wav
# 3. Configured and authorized Volcengine voice cloning
python "$S/scripts/capabilities.py" say "Text to read" --mode clone --out <project>/audio/vo.wav
# Legacy calls remain compatible and share the same configuration
python "$S/scripts/vo.py" say "Confirmed pick-up line" --out <project>/audio/pickup.wav \
  --fit 3.5 --match original-track.wav --match-ss 10 --match-t 3.5
```

Existing outputs are not overwritten. On success, write the adjacent `<output>.json` sidecar recording duration, sample rate, SHA, and source; for cloning, record the requested model and do not claim it is the actual model reported by the server. Validate raw PCM as container audio before exporting s16le; write the sample rate and mono format into the sidecar. System voices do not support Volcengine model or speed parameters.

The public default is "no voice method chosen," not the author's voice. Recommended Volcengine defaults are expressive, restoration mode, speed 0; users can adjust them in `provider_options.volcengine`. Private configuration may keep a different speed and voice. For the full set of fields, see `schemas/media.schema.json`; do not guess field names.

Existing platform voices do not need retraining:

```sh
python "$S/scripts/capabilities.py" bind --name narrator --speaker-id S_xxx --default
```

`bind` only registers a local alias; it does not call the platform, does not modify the existing `~/.vo/voices.json`, and does not automatically enable cloud calls. `--default` only changes the default reference; the generation method still needs to be set to clone.

## Volcengine configuration and authorization

Credentials are read from process environment variables; you can also point to an existing file in the private `bindings.volcengine.env_file`, or specify one temporarily with `VO_ENV`. Environment variables take precedence; the tool does not automatically scan the current directory, home directory, or the author's workspace for `.env` files. The configuration stores variable names / file references, not key values.

Enabling cloud cloning requires: `preferences.voice.mode=clone`, a resolvable voice, and both `policy.cloud` and `policy.paid_api` set to allow—or explicit authorization from the user for this run. `--allow-cloud` and `--allow-paid-api` only express authorization already granted for this run; they are not a way for the tool to bypass rules and cannot override deny. When the user changes their own prohibitions, first change the corresponding configuration explicitly; host/organization restrictions still apply. A project can only tighten, never grant.

Network proxy behavior is controlled by the private `bindings.volcengine.trust_env`; the public default honors the environment. Do not impose one machine's proxy-failure experience on all installers. Basic configuration / existing audio need only the Python standard library; audio acceptance needs ffprobe; system audio and fitting need ffmpeg; Volcengine additionally needs requests. Report missing dependencies; do not install them automatically.

Training is a separate operation and requires an explicit voice slot and authorization for this training run; `--force` only skips the low-level check, not authorization. Only when `--default` is passed is the training result set as the registry default.

```sh
python "$S/scripts/vo.py" train --audio my-recording.wav --speaker S_xxx --name "My Voice" \
  --allow-cloud --allow-paid-api --allow-voice-training
```

Training changes the remote voice. The authorization flags in the example may be used only after the user has actually agreed; do not treat them as a routine prerequisite for synthesis.

## Acceptance and failure

Fitting keeps the existing coarse adjustment + atempo and generates at most 3 times; each attempt may be billed. If the final difference exceeds ±0.05 seconds, return failure and keep the `.unfitted` candidate; do not claim the duration is acceptable. Synthesis must receive a successful end message from the server; near-empty, silent, or error responses must not be submitted as final artifacts. A network timeout may mean the order was already accepted—mark the result uncertain and do not blindly repeat the request.

A final film still needs a word-for-word read-back and a listen-through for proper nouns; the CLI does not automatically do three-candidate listening selection or ASR. Pickups should be checked for seams, subtitles, and the picture timeline; when video-pipeline is already in use, follow its paste-back and subtitle workflow—standalone users may also use their own editing project.

## Maintenance and evolution

Source: 2026-10-08, P0/P1 capability configuration implementation. Read this page and the relevant API notes before use; for reproducible interface failures, add tests before fixing code. Write general parameter patterns into this page or `voiceover-api.md`, with the date and scope; write personal listening choices into private configuration/private feedback—they must not become public hard requirements. Correct old conclusions by editing the original text; configuration upgrades must not erase preferences or automatically enable new capabilities.
