# Volcano Doubao Voice Cloning 2.0 · Interface Details and Measured Notes

The historical interface record dates from 2026-09-13; the query section was updated on 2026-09-18. New users configure per capabilities.md first; service limits follow the actual response at call time. Official docs: Volcano Engine Documentation Center, "Doubao Voice" library (LibraryID 6561).

## Authentication

Legacy console (APP ID + Access Token):

```
X-Api-App-Id:      {APPID}
X-Api-Access-Key:  {Access Token}
X-Api-Resource-Id: volc.megatts.voiceclone   # training / query
                   seed-icl-2.0              # synthesis
X-Api-Request-Id:  {uuid}
Content-Type:      application/json
```

The new console uses `X-Api-Key` (obtained under API Key management). The official docs say the legacy version will be retired gradually.

## Three endpoints

| Purpose | Path |
|---|---|
| Train a voice | `POST /api/v3/tts/voice_clone` |
| Query status | `POST /api/v3/tts/get_voice` |
| Synthesis | `POST /api/v3/tts/unidirectional` (HTTP chunked streaming) |

The host is always `https://openspeech.bytedance.com`.

### Training

```json
{
  "speaker_id": "S_xxxxxxxx",
  "audio": { "data": "<base64>", "format": "wav" },
  "source": 2,
  "language": 0,
  "model_type": 5
}
```

- **Only `model_type: 5` is cloning 2.0.** Omitting it or passing another value trains a 1.0 voice.
- **The request body takes a single `audio` object, not an `audios` array.** The v1 interface used an array; v3 changed it;
  passing an array returns `45000000 add unmapped key audios`.
- Optional: `text` (the transcript matching the reference audio; the server runs a WER check and returns `45001109` when it diverges too much),
  `enable_audio_denoise` (denoising, which costs similarity),
  `disable_volume_normalization` (turn off volume normalization so the synthesized volume tracks the reference audio more closely).
- Returned `status`: 0 NotFound / 1 Training / 2 Success / 3 Failed / 4 Active.
  **Both 2 and 4 can synthesize directly.**
- In the response, `speaker_status` is an array that holds both the 1.0 and the 2.0 version;
  the entry with `model_type: 5` is the 2.0 one, and each carries a `demo_audio` preview link valid for one hour.

### Query (measured 2026-09-18)

The v3 `get_voice` request body uses the singular `{"speaker_id":"S_xxxxxxxx"}`, not a `speaker_ids` array. Query multiple slots one at a time; HTTP errors must be reported explicitly and never treated as the voice not existing. `vo.py voices` has been corrected accordingly.

### Synthesis

```json
{
  "user": { "uid": "koubo" },
  "req_params": {
    "text": "...",
    "speaker": "S_xxxxxxxx",
    "model": "seed-tts-2.0-expressive",
    "tone_fidelity": true,
    "audio_params": { "format": "wav", "sample_rate": 48000, "speech_rate": -20 }
  }
}
```

The response is streamed, one JSON object per line; the audio is base64-chunked in the `data` field, and concatenating the chunks gives the complete file.

## Two counter-intuitive parameter positions

1. **`speech_rate` must go inside `audio_params`.** Put at the top level of `req_params` it is **silently ignored** —
   no error, a 200 response, normal audio, but the speech rate does not budge.
   Measured, `audio_params.speech_rate = -50` takes the same sentence from 10.36s to 21.53s (exactly 2×).
   Range `[-50, 100]`, 0 by default, 100 = 2.0× speed, -50 = 0.5× speed, linear.
   Also silently ignored is `speed_ratio` (at any level) — that is a parameter name from another product line.

2. **`tone_fidelity` goes at the top level of `req_params`**, not inside `audio_params`. It only takes effect on 2.0 voices.

## Sample rate

`sample_rate` supports `[8000, 16000, 22050, 24000, 32000, 44100, 48000]`, **and defaults to 24000 only**.
When dropping back into a 48k editing project you must pass 48000 explicitly, otherwise it sounds dull.
`ogg_opus` supports 48000 only. For streaming, the official guidance is pcm, not wav.

## Other limits

- Reference audio: **the 10MB cap counts the original file, not the base64** (a measured 9.16MB wav passes).
  Supports wav / mp3 / ogg / m4a / aac / pcm; pcm is 24k mono only.
- Keep synthesis text under 300 characters per request (about 60 seconds of audio); split long text yourself, then concatenate.
- Each voice slot gets 15 training attempts, and retraining overwrites in place.
- The "voice upgrade" endpoint (`/api/v3/tts/upgrade_voice`) is only a V1→V3 migration,
  and **cannot append reference audio to an existing voice**. To change the reference audio you can only retrain the same slot.

## Common error codes

| Code | Meaning | What to do |
|---|---|---|
| `45000000` | Request body fields are wrong | Look at the unmapped key in the message |
| `45001122` | `no speaker detected` | No voice in the reference audio. Check the average level first; below -36dB is basically noise floor |
| `45001109` | `WERError` | The `text` you passed does not match the audio content; drop text or make it accurate |
| `45000030` | `resource not granted` | The service for this Resource-Id is not enabled |

## Network

`openspeech.bytedance.com` is a mainland-China endpoint. If the machine runs a socks proxy,
**passing `proxies=None` to requests alone does not stop it** — it still reads `ALL_PROXY` from the environment,
showing up as intermittent `SSL: UNEXPECTED_EOF_WHILE_READING`.
Affected environments can set `bindings.volcengine.trust_env=false`; the default honors the environment proxy, and it is not forced to bypass for every user.

## On "how long should the reference audio be"

In past listening selections, a longer clean voiceover reference sounded more like the original speaker than thirty seconds did. That is the experience of a single voice, not a uniform default for every voice; go by the user's own sample listening and the current service limits.

I ran one duration-gradient measurement (nested samples at 15/30/60/120/200/400 seconds, three syntheses per rung),
comparing median pitch and spectral centroid against the real speaker's original; the differences across rungs (1.7%–8.5%) and the
standard deviation among the three runs of the same rung (1.7–9.5) are the same order of magnitude, **so on these two metrics there is no separating them**.

But that is no refutation — these two metrics cover only the pitch and brightness of a voice,
**and do not cover prosody, pauses, breath points, or tone at all**, and those are exactly the main ingredients of "does it sound like this person".
A metric failing to detect a difference does not mean there is no difference. Trust the ear.
