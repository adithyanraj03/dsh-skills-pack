# 13 · Voiceover and voice cloning

For the unified entry point and configuration see the [optional voice guide](capabilities.md); for interface details see the [VO API](voiceover-api.md).

Reuse an existing recording first; when new voice is needed, use the user's configuration to choose system audio or an already-bound cloned voice. `scripts/vo.py say/train/voices` keeps the old call entry points and shares the same out-of-install-directory configuration with `scripts/capabilities.py`.

Each say produces exactly one take and does not automatically run three candidates or ASR. Re-recording keeps `--fit/--match`; when it finishes you still have to verify the lines, proper nouns, joins, and subtitles. Specific models, speech rates, voices, and credentials are not hard-coded in this document.
