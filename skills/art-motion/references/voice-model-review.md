# Voice Cloning Model Review

The `selection` field in the platform record stores the model the user picked by ear, the speech rate, the voice registry reference, and the upgrade preference. Before calling that platform, run `voice_review.py --provider <platform>` to read the listening selection; an explicit model given in the current run takes precedence over the stored choice. Periodic updates keep `selection` and must not overwrite a personal choice with official candidates. Without a general-purpose provider adapter, follow the validated project call path the record points to, and do not describe a query tool as a synthesis tool.

Used for the pre-cloning check and for scheduled inspections the user has already authorized. The record lives in `voice-model-review.json`, in the same directory as the actual user config for `capabilities.py`; do not commit private config.

Each platform is stored separately:
```json
{"providers":{"qwen":{"checked_at":"2026-10-15T12:00:00+08:00","models":[],"sources":[],"findings":"official list and actual account callability are recorded separately"}}}
```

`checked_at` is updated only after the official material has been read successfully and verified in this run. A failure is recorded with `last_attempt_at` and `last_error`, keeping the old success time. `sources` keeps the source URL, the access date, and the relevant facts; `models` records the exact ID, the purpose, the official support status, and the measured status, and does not conflate ordinary TTS, voice design, and real-time conversation with voice cloning.

For Doubao, check the Volcano Doubao voice cloning and synthesis docs first; for Qwen, check the Bailian speech synthesis model list, the voice cloning guide, and the API docs first. Leaderboards serve as candidate leads only and cannot stand in as evidence of a public API ID or of account availability. Confirm whether old and new interfaces have migrated, the reference audio requirements, pricing, and model deprecations; finding nothing in search does not mean nothing changed.

The weekly check reads official material and local config only, updates the record, and reports additions, deprecations, or changed limits. Do not top up credits, retrain, switch the default, or repeat paid tests without authorization. After the user authorizes a test, record separately the requested model, the receipt, the audio acceptance, and the listening feedback; recommend changing the default only when actual listening and reliable call evidence are both sufficient.

Source: on 2026-10-15 the user asked for a weekly check of Doubao/Qwen updates, and for the current model and the last check time to be reported on every cloning run. If official material conflicts with an old record, revise the old conclusion and keep the basis for the correction; keep personal listening selections separate from public capability.
