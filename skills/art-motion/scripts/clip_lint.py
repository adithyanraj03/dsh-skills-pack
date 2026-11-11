#!/usr/bin/env python3
"""Parametric clip spec validation: run it before rendering so the traps where "a mistake does not error, it just silently does nothing" get said out loud early.

uv run scripts/clip_lint.py spec.json [--strict]
Red light (exit code 1): grammar does not exist, cue kind is not one of this grammar's, a required field is missing, at is not a number, theme/finish misspelled, image file does not exist, all cues outside the duration.
Yellow light: fields outside the table (usually a typo or the wrong nesting level), camera written where it has no effect, too long an empty start/end, clip >8 seconds, cues crowded onto the same frame.
--strict: yellow lights count as failures too. The field table is engine/clip_schema.json; change it when you change a grammar.
"""
import argparse, json, sys
from pathlib import Path

ENG = Path(__file__).resolve().parent / 'engine'


def get(o, path):
    for k in path.split('.'):
        if not isinstance(o, dict) or k not in o: return None
        o = o[k]
    return o


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('spec'); ap.add_argument('--strict', action='store_true')
    a = ap.parse_args()
    sp = Path(a.spec).resolve(); red, yel = [], []
    try: spec = json.loads(sp.read_text(encoding='utf-8'))
    except Exception as e: sys.exit(f'🔴 JSON unreadable: {e}')
    S = json.loads((ENG / 'clip_schema.json').read_text(encoding='utf-8')); C = S['common']
    g = spec.get('grammar'); G = S['grammars'].get(g)
    if not G or not (ENG / 'clips' / f'{g}.js').exists():
        red.append(f'grammar "{g}" does not exist. Available: {" / ".join(S["grammars"])}'); report(red, yel, a); return
    for k in spec:
        if k.startswith('_'): continue                      # comment keys such as _note
        if k not in C['spec']:
            hint = ' (camera must be written inside data: {"data": {"camera": "snap"}})' if k == 'camera' else ''
            yel.append(f'top-level spec "{k}" is not recognized and will be ignored{hint}')
    d = spec.get('duration')
    if not isinstance(d, (int, float)) or d <= 0: red.append('duration must be a number >0 (seconds)'); d = 0
    elif d > 8: yel.append(f'duration={d}s exceeds 8s: one clip stretched that long reads as a single slide, split it into several shots')
    th = spec.get('theme')
    if isinstance(th, str) and th not in C['themes'] and g != 't3_finance_chart': red.append(f'theme "{th}" is not a palette name: {" / ".join(C["themes"])}')
    fn = spec.get('finish')
    if fn is not None and not (isinstance(fn, dict) or fn in C['finish']): red.append(f'finish "{fn}" is not a preset: {" / ".join(C["finish"])} (or write an object)')
    sd = spec.get('data') or {}
    if isinstance(sd, dict):
        for k in sd:
            if k not in G['specData']: yel.append(f'spec.data "{k}" is not in the field table of {g} (typo or wrong nesting level? accepts: {", ".join(G["specData"])})')
        for need in G.get('specNeeds', []):
            if get(spec, need) in (None, [], {}, ''): red.append(f'{g} requires {need}')
        if sd.get('camera') not in (None, 'smooth', 'snap'): red.append(f'data.camera only accepts smooth / snap, got "{sd.get("camera")}"')
    cues = spec.get('cues') or []
    if not cues: red.append('cues is empty')
    prev = -1; seen_at = {}
    inside = 0
    for i, q in enumerate(cues):
        tag = f'cue[{i}]'
        if not isinstance(q, dict): red.append(f'{tag} is not an object'); continue
        at, kind = q.get('at'), q.get('kind')
        tag = f'cue[{i}] {kind}@{at}'
        if not isinstance(at, (int, float)): red.append(f'{tag}: at must be a number'); continue
        if kind not in G['kinds']: red.append(f'{tag}: {g} has no such kind. Available: {" / ".join(G["kinds"])}'); continue
        if at < prev - 1e-9: yel.append(f'{tag}: at is smaller than the previous one (cues are re-sorted by time; confirm this is intentional)')
        prev = max(prev, at)
        if d and at > d + 1e-9: yel.append(f'{tag}: beyond the clip duration {d}s, never visible, will be dropped')
        else: inside += 1
        key = round(at, 3); seen_at[key] = seen_at.get(key, 0) + 1
        for k in q:
            if k not in C['cue']: yel.append(f'{tag}: cue field "{k}" is not recognized (accepts: {", ".join(C["cue"])})')
        qd = q.get('data') or {}
        if isinstance(qd, dict):
            for k in qd:
                if k == 'camera': yel.append(f'{tag}: camera inside a cue\'s data has no effect, write it in the spec-level data')
                elif k not in G['cueData']: yel.append(f'{tag}: data field "{k}" is not in the field table of {g}/{kind} (typo? accepts: {", ".join(G["cueData"])})')
        for need in (G.get('needs', {}).get(kind) or []):
            ok = any(get(q, n) not in (None, '', [], {}) for n in need.split('|'))
            if not ok: red.append(f'{tag}: missing {need}')
        for im in ([q.get('image')] if q.get('image') else []) + (q['frames'] if isinstance(q.get('frames'), list) else []):
            if isinstance(im, str) and not im.startswith(('data:', 'http')) and not (sp.parent / im).exists() and not Path(im).exists():
                red.append(f'{tag}: image does not exist {im} (relative to the spec file)')
    if cues and d and inside == 0: red.append('all cues are outside the clip duration')
    if cues and d:
        ats = [q['at'] for q in cues if isinstance(q, dict) and isinstance(q.get('at'), (int, float)) and q['at'] <= d]
        if ats:
            if min(ats) > 1.2: yel.append(f'first cue at {min(ats)}s: a {min(ats)}s empty start (the voiceover pipeline may leave this intentionally)')
            if d - max(ats) > 3.0: yel.append(f'last cue at {max(ats)}s, then {d - max(ats):.1f}s with no new event; the picture will freeze')
    for k, n in seen_at.items():
        if n >= 3: yel.append(f'{n} cues crowded onto the same instant {k}s: only the last one is visible')
    report(red, yel, a)


def report(red, yel, a):
    for r in red: print('🔴', r)
    for y in yel: print('🟡', y)
    if not red and not yel: print('✅ spec has no problems')
    sys.exit(1 if red or (a.strict and yel) else 0)


main()
