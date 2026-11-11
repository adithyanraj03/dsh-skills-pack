#!/usr/bin/env python3
"""Voiceover — generate and patch voiceover segments for a video using a cloned voice.

Under the hood this is Volcengine Doubao voice cloning 2.0 (seed-icl-2.0).

  say     speak a piece of text with an existing voice; optionally fit a target duration and match a target loudness
  train   feed a real recording and train a new voice
  voices  list locally registered voices / query online training status

Credentials and default voice come from the personal config outside the install directory (loaded by capabilities.py);
this file keeps the say/train/voices compatibility entry points. Base configuration and system audio do not depend on requests.
"""
import argparse
import base64
import json
import os
import pathlib
import re
import subprocess
import sys
import tempfile
import uuid


HOST = "https://openspeech.bytedance.com"
RES_CLONE = "volc.megatts.voiceclone"             # train / query
RES_TTS = "seed-icl-2.0"                          # synthesize
REGISTRY = pathlib.Path.home() / ".vo" / "voices.json"
MAX_UPLOAD = 10 * 1024 * 1024                     # reference audio limit (raw file, not base64)


# ---------- infrastructure ----------

ACTIVE_CONFIG = None


def configure_backend(config):
    global ACTIVE_CONFIG, REGISTRY
    ACTIVE_CONFIG = config
    REGISTRY = pathlib.Path(config["bindings"]["volcengine"]["registry_file"]).expanduser()


def load_env():
    from capabilities import credentials, effective
    config = ACTIVE_CONFIG or effective()[0]
    appid, token = credentials(config)
    if not appid or not token:
        sys.exit("missing credentials; configure environment variables or an explicitly named env_file (other .env files are never scanned)")
    return appid, token


def _session():
    import requests
    from capabilities import effective
    config = ACTIVE_CONFIG or effective()[0]
    session = requests.Session()
    session.trust_env = config["bindings"]["volcengine"]["trust_env"]
    return session


def api(path, resource_id, payload, stream=False, retries=1):
    # A POST may already have been accepted/billed on timeout; never blind-retry with a fresh request_id.
    import requests
    appid, token = load_env()
    headers = {
        "X-Api-App-Id": appid, "X-Api-Access-Key": token,
        "X-Api-Resource-Id": resource_id, "X-Api-Request-Id": str(uuid.uuid4()),
        "Content-Type": "application/json",
    }
    try:
        return _session().post(HOST + path, headers=headers, json=payload,
                               timeout=300, stream=stream)
    except requests.exceptions.RequestException:
        sys.exit("outcome_unknown: the network request was not confirmed complete; check the server state first, do not resubmit automatically")


def registry_load():
    if REGISTRY.is_file():
        return json.loads(REGISTRY.read_text(encoding="utf-8"))
    return {"default": None, "voices": {}}


def registry_save(data):
    REGISTRY.parent.mkdir(parents=True, exist_ok=True)
    REGISTRY.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def resolve_speaker(name_or_id):
    """Accept a voice name (from the registry) or a raw speaker_id. Nothing given → the default voice."""
    reg = registry_load()
    if not name_or_id:
        name_or_id = reg.get("default") or os.getenv("VOLC_VO_DEFAULT_SPEAKER")
        if not name_or_id:
            sys.exit("✗ no voice given and no default voice. Run `vo.py voices` to see what exists")
    if name_or_id in reg["voices"]:
        return reg["voices"][name_or_id]["speaker_id"], name_or_id
    return name_or_id, name_or_id


def ffprobe_duration(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
        capture_output=True, text=True).stdout.strip()
    return float(out) if out else 0.0


def mean_volume(path, ss=None, t=None):
    cmd = ["ffmpeg", "-hide_banner", "-nostats"]
    if ss is not None:
        cmd += ["-ss", str(ss)]
    if t is not None:
        cmd += ["-t", str(t)]
    cmd += ["-i", str(path), "-af", "volumedetect", "-f", "null", "-"]
    err = subprocess.run(cmd, capture_output=True, text=True).stderr
    m = re.search(r"mean_volume:\s*(-?[\d.]+) dB", err)
    return float(m.group(1)) if m else None


# ---------- say ----------

def synthesize(text, speaker, out, fmt="wav", sample_rate=48000,
               model="seed-tts-2.0-expressive", fidelity=True, speech_rate=0):
    req = {
        "text": text,
        "speaker": speaker,
        "audio_params": {"format": fmt, "sample_rate": sample_rate},
        "model": model,
    }
    if fidelity:
        req["tone_fidelity"] = True
    if speech_rate:
        # Measured: only works inside audio_params; at the top of req_params it is silently ignored
        req["audio_params"]["speech_rate"] = int(speech_rate)

    r = api("/api/v3/tts/unidirectional", RES_TTS,
            {"user": {"uid": "vo"}, "req_params": req}, stream=True)
    if r.status_code != 200:
        sys.exit(f"✗ HTTP {r.status_code} {r.text[:400]}")

    chunks, errs, complete = [], [], False
    for line in r.iter_lines():
        if not line:
            continue
        s = line.decode("utf-8", "ignore")
        if s.startswith("data:"):
            s = s[5:].strip()
        try:
            obj = json.loads(s)
        except ValueError:
            continue
        if obj.get("code") == 20000000:
            complete = True
        if obj.get("data"):
            chunks.append(base64.b64decode(obj["data"]))
        if obj.get("code") not in (None, 0, 20000000):
            errs.append(obj)
    if errs or not chunks or not complete:
        sys.exit("synthesis failed or returned incomplete audio; partial output is never written")
    pathlib.Path(out).write_bytes(b"".join(chunks))
    return pathlib.Path(out)


def fit_duration(path, target, tol=0.05):
    """Trim audio to the target duration with atempo. Beyond ±10% we don't: quality would degrade."""
    cur = ffprobe_duration(path)
    if not cur or abs(cur - target) <= tol:
        return cur, 1.0
    ratio = cur / target
    if not 0.9 <= ratio <= 1.1:
        return cur, ratio        # way off: the caller decides (usually by changing speech_rate)
    tmp = pathlib.Path(tempfile.mkstemp(suffix=path.suffix)[1])
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(path),
                    "-filter:a", f"atempo={ratio:.6f}", str(tmp)], check=True)
    tmp.replace(path)
    return ffprobe_duration(path), ratio


def match_loudness(path, target_db):
    """Bring the synthesized level to the original track's level so the join doesn't jump in volume."""
    cur = mean_volume(path)
    if cur is None or target_db is None:
        return None
    gain = target_db - cur
    if abs(gain) < 0.5:
        return 0.0
    tmp = pathlib.Path(tempfile.mkstemp(suffix=path.suffix)[1])
    subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(path),
                    "-filter:a", f"volume={gain:.2f}dB", str(tmp)], check=True)
    tmp.replace(path)
    return gain


def cmd_say(args):
    speaker, label = resolve_speaker(args.voice)
    out = pathlib.Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)

    # Target loudness: a dB value, or a reference audio (usually the few seconds of the original track)
    target_db = args.loudness
    if args.match:
        target_db = mean_volume(args.match, args.match_ss, args.match_t)

    speech_rate = args.speech_rate
    for attempt in range(3):
        synthesize(args.text, speaker, out, fmt=args.format, sample_rate=args.sample_rate,
                   model=args.model, fidelity=not args.no_fidelity, speech_rate=speech_rate)
        dur = ffprobe_duration(out)
        if not args.fit:
            break
        ratio = dur / args.fit
        if 0.93 <= ratio <= 1.07:      # inside atempo's lossless band — good enough
            break
        # speech_rate is absolute, not a delta: rate r means (1 + r/100)× speed.
        # Back out the duration at rate=0, then compute the speed needed to land on target.
        base = dur * (1 + speech_rate / 100)
        want = max(-50, min(100, int(round((base / args.fit - 1) * 100))))
        if want == speech_rate:
            break
        speech_rate = want
        print(f"  duration {dur:.2f}s vs target {args.fit:.2f}s — retrying with speech_rate {speech_rate}")
        if speech_rate <= -50:
            print("  ⚠️ already at the slowest 0.5× — the text is too short to fill this slot; consider adding words")
        elif speech_rate >= 100:
            print("  ⚠️ already at the fastest 2× — the text is too long for this slot; consider cutting words")

    info = [f"{ffprobe_duration(out):.2f}s"]
    if args.fit:
        dur, ratio = fit_duration(out, args.fit)
        info = [f"{dur:.2f}s (target {args.fit:.2f}s)"]
        if not 0.9 <= ratio <= 1.1:
            info.append(f"⚠️ off by {abs(ratio-1)*100:.0f}%, outside atempo's lossless band — not stretched")
    if target_db is not None:
        gain = match_loudness(out, target_db)
        if gain:
            info.append(f"loudness {gain:+.1f}dB → {target_db:.1f}dB")

    return info


# ---------- train ----------

def prepare_audio(src, seconds=None, start=0):
    """Convert to 24k mono; wav first, auto-downgrade to mp3 past 10MB. Returns a temp file path."""
    src = pathlib.Path(src)
    for fmt, codec, extra in (("wav", ["-c:a", "pcm_s16le"], []),
                              ("mp3", [], ["-b:a", "192k"]),
                              ("mp3", [], ["-b:a", "96k"])):
        tmp = pathlib.Path(tempfile.mkstemp(suffix=f".{fmt}")[1])
        cmd = ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", str(start)]
        if seconds:
            cmd += ["-t", str(seconds)]
        cmd += ["-i", str(src), "-ac", "1", "-ar", "24000"] + codec + extra + [str(tmp)]
        subprocess.run(cmd, check=True)
        if tmp.stat().st_size <= MAX_UPLOAD:
            return tmp, fmt
        tmp.unlink()
    sys.exit("✗ audio is still over 10MB after 96k mp3 — shorten --seconds")


def cmd_train(args):
    src = pathlib.Path(args.audio)
    if not src.is_file():
        sys.exit(f"✗ {src} not found")

    # Block the most common failure first: what gets fed in is actually room noise; the server answers 45001122 no speaker detected
    vol = mean_volume(src, args.start, args.seconds)
    if vol is not None and vol < -36:
        print(f"⚠️ this clip averages only {vol:.1f} dB — very likely no voice, or too quiet.")
        print("   First confirm someone is actually speaking in it, use another clip, or normalize the loudness.")
        if not args.force:
            sys.exit("   If it's really fine, add --force and run again.")

    audio, fmt = prepare_audio(src, args.seconds, args.start)
    dur = ffprobe_duration(audio)
    size_mb = audio.stat().st_size / 1024 / 1024
    print(f"reference audio: {dur:.0f}s  {fmt}  {size_mb:.1f}MB")

    payload = {
        "speaker_id": args.speaker,
        "audio": {"data": base64.b64encode(audio.read_bytes()).decode(), "format": fmt},
        "source": 2,
        "language": args.language,
        "model_type": 5,                       # 5 = voice cloning 2.0
    }
    if args.reference_text:
        payload["text"] = args.reference_text
    if args.denoise:
        payload["enable_audio_denoise"] = True
    if args.keep_volume:
        payload["disable_volume_normalization"] = True

    r = api("/api/v3/tts/voice_clone", RES_CLONE, payload)
    audio.unlink(missing_ok=True)
    if r.status_code != 200:
        sys.exit(f"✗ HTTP {r.status_code} {r.text[:500]}")
    data = r.json()
    status = data.get("status")
    if status not in (2, 4):
        sys.exit(f"✗ training did not succeed status={status} {data.get('message','')}")

    reg = registry_load()
    reg["voices"][args.name] = {
        "speaker_id": args.speaker,
        "source": str(src),
        "seconds": round(dur),
        "trained_at": data.get("create_time"),
        "remaining_trainings": data.get("available_training_times"),
    }
    if args.default:
        reg["default"] = args.name
    registry_save(reg)

    print(f"✓ '{args.name}' trained  speaker_id={args.speaker}  "
          f"remaining trainings {data.get('available_training_times')}")
    if reg["default"] == args.name:
        print(f"  set as the default voice")
    demo = data.get("demo_audio")
    if demo:
        print(f"  official sample (valid for 1 hour): {demo}")


# ---------- voices ----------

def cmd_voices(args):
    reg = registry_load()
    if not reg["voices"]:
        print("no voices registered locally yet. Feed a recording with `vo.py train`.")
        print(f"(registry location: {REGISTRY})")
        return
    print(f"default voice: {reg.get('default') or '(none)'}\n")
    for name, v in reg["voices"].items():
        mark = "★" if name == reg.get("default") else " "
        print(f"{mark} {name:<24} {v['speaker_id']:<16} {v.get('seconds','?')}s  ← {v.get('source','')}")
    if args.check:
        print("\nonline status:")
        for name, v in reg["voices"].items():
            r = api("/api/v3/tts/get_voice", RES_CLONE, {"speaker_id": v["speaker_id"]})
            try:
                st = r.json()
                st = st[0] if isinstance(st, list) else st
                if r.status_code != 200:
                    print(f"  {name:<24} query failed HTTP {r.status_code}: {st.get('message','')}")
                    continue
                print(f"  {name:<24} status={st.get('status')} "
                      f"remaining trainings {st.get('available_training_times','?')}")
            except ValueError:
                print(f"  {name:<24} query failed HTTP {r.status_code}")


def main():
    p = argparse.ArgumentParser(description="Voiceover · cloned-voice generation and patching")
    sub = p.add_subparsers(dest="cmd", required=True)

    s = sub.add_parser("say", help="speak a piece of text with a cloned voice")
    s.add_argument("text")
    s.add_argument("--out", required=True)
    s.add_argument("--voice", help="voice name or speaker_id; omit to use the default")
    s.add_argument("--fit", type=float, metavar="seconds",
                   help="fit a target duration: coarse-tune speech_rate first, then fine-tune with atempo")
    s.add_argument("--match", metavar="audio", help="match this audio's loudness (usually the original track)")
    s.add_argument("--match-ss", dest="match_ss", type=float, help="--match: start at this second")
    s.add_argument("--match-t", dest="match_t", type=float, help="--match: how many seconds to use")
    s.add_argument("--loudness", type=float, metavar="dB", help="set the target mean level directly")
    s.add_argument("--format", default="wav", choices=["wav", "mp3", "pcm", "ogg_opus"])
    s.add_argument("--sample-rate", dest="sample_rate", type=int, default=48000,
                   choices=[8000, 16000, 22050, 24000, 32000, 44100, 48000])
    s.add_argument("--model", default=None,
                   choices=["seed-tts-2.0-expressive", "seed-tts-2.0-standard"])
    s.add_argument("--no-fidelity", dest="no_fidelity", action="store_true", default=None,
                   help="turn off fidelity mode (on by default)")
    s.add_argument("--speech-rate", dest="speech_rate", type=int, default=None,
                   help="Volcengine speech rate -50..100; when omitted the personal config is used (public default 0)")
    s.set_defaults(func=cmd_say)

    t = sub.add_parser("train", help="feed a real recording and train a new voice")
    t.add_argument("--audio", required=True)
    t.add_argument("--speaker", required=True, help="empty voice slot ID from the console")
    t.add_argument("--name", required=True, help="name for this voice")
    t.add_argument("--seconds", type=float, help="take only the first N seconds (whole file otherwise; auto-downgrades format past 10MB)")
    t.add_argument("--start", type=float, default=0, help="start at this second")
    t.add_argument("--reference-text", dest="reference_text",
                   help="text matching the reference audio; the server runs a WER check and fails if it drifts too far")
    t.add_argument("--language", type=int, default=0, help="0=Chinese 1=English")
    t.add_argument("--denoise", action="store_true", help="enable denoise (costs similarity; leave off on clean samples)")
    t.add_argument("--keep-volume", dest="keep_volume", action="store_true",
                   help="disable volume normalization so synthesis stays closer to the reference level")
    t.add_argument("--default", action="store_true", help="make this the default voice")
    t.add_argument("--force", action="store_true", help="upload even when the level is too low")
    t.set_defaults(func=cmd_train)

    v = sub.add_parser("voices", help="list voices")
    v.add_argument("--check", action="store_true", help="also query online training status")
    v.set_defaults(func=cmd_voices)

    s.add_argument("--mode", choices=["off", "system", "clone"], help="override the voice method for this call only")
    for command in (s, t, v):
        command.add_argument("--config", help="explicitly choose a user config outside the install directory")
        command.add_argument("--project", help="read that project's restricted media preferences")
        command.add_argument("--allow-cloud", action="store_true", help="cloud-call permission granted for this run; never overrides deny")
        command.add_argument("--allow-paid-api", action="store_true", help="paid-call permission granted for this run; never overrides deny")
    t.add_argument("--allow-voice-training", action="store_true", help="training explicitly allowed this run; not implied by ordinary synthesis permission")
    args = p.parse_args()
    from capabilities import effective, resolve, run_say, ConfigError
    config, _ = effective(args.config, args.project)
    configure_backend(config)
    if args.cmd == "say":
        return run_say(args, config)
    if args.cmd == "train" or (args.cmd == "voices" and args.check):
        operation = "train" if args.cmd == "train" else "check"
        grants = [key for key in ("cloud", "paid_api", "voice_training") if getattr(args, "allow_" + key, False)]
        result = resolve(config, mode="clone", operation=operation, grants=grants)
        if result["status"] != "configured_unverified":
            print(json.dumps(result, ensure_ascii=False)); raise SystemExit(2)
    args.func(args)


if __name__ == "__main__":
    from capabilities import ConfigError
    try:
        main()
    except (ConfigError, OSError, subprocess.SubprocessError) as e:
        print(str(e) if isinstance(e, ConfigError) else type(e).__name__, file=sys.stderr)
        raise SystemExit(2)
