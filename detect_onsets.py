#!/usr/bin/env python3
"""
Find where each preview clip actually becomes audible.

The first Heardle guess plays only 0.75s. Several iTunes previews open on a
fade-in, a held breath, or near-silence, so that first guess was unwinnable.
This measures a short-window RMS envelope per clip and reports the first
moment sustained audible content starts, to be stored as `startAt` and used
as the playback offset instead of 0.

Writes onsets.json: {drama_id: {startAt, duration, lead_rms_db, ...}}
"""
import json
import re
import subprocess
import sys
import tempfile
import urllib.request
from pathlib import Path

import numpy as np

SR = 16000          # analysis sample rate
HOP = 0.02          # 20 ms envelope resolution
SUSTAIN = 0.18      # content must stay loud this long to count (ignores clicks)
REL_DB = -26.0      # "audible" = this many dB below the clip's loud level
PREROLL = 0.06      # back off slightly so the attack isn't clipped
LONGEST = 10.0      # longest snippet the game plays
CACHE = Path(tempfile.gettempdir()) / "ost_preview_cache"


def fetch(url, dest):
    if dest.exists() and dest.stat().st_size > 10000:
        return
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=40) as r:
        dest.write_bytes(r.read())


def pcm(path):
    out = subprocess.run(
        ["ffmpeg", "-v", "quiet", "-i", str(path), "-f", "s16le",
         "-ac", "1", "-ar", str(SR), "-"],
        capture_output=True, check=True).stdout
    return np.frombuffer(out, dtype="<i2").astype(np.float32) / 32768.0


def envelope(x):
    n = int(SR * HOP)
    if len(x) < n:
        return np.zeros(1), n
    frames = len(x) // n
    e = x[:frames * n].reshape(frames, n)
    return np.sqrt((e ** 2).mean(axis=1) + 1e-12), n


def db(v):
    return 20.0 * np.log10(np.maximum(v, 1e-9))


def onset(x):
    """First time sustained audible content begins, in seconds."""
    env, _ = envelope(x)
    edb = db(env)
    loud = np.percentile(edb, 95)          # clip's characteristic loud level
    thresh = loud + REL_DB
    need = max(1, int(SUSTAIN / HOP))
    above = edb >= thresh
    # first index where `need` consecutive frames are above threshold
    run = 0
    for i, a in enumerate(above):
        run = run + 1 if a else 0
        if run >= need:
            start = (i - need + 1) * HOP
            return max(0.0, start - PREROLL), edb, loud
    return 0.0, edb, loud


def main():
    src = Path("src/data/dramas.js").read_text(encoding="utf-8")
    CACHE.mkdir(exist_ok=True)
    rows = {}
    blocks = src.split("\n  {\n")[1:]
    for b in blocks:
        did = re.search(r"id: '([^']+)'", b)
        aud = re.search(r"audio: '([^']*)'", b)
        if not (did and aud):
            continue
        did, url = did.group(1), aud.group(1)
        f = CACHE / f"{did}.m4a"
        try:
            fetch(url, f)
            x = pcm(f)
        except Exception as e:
            print(f"  !! {did}: {e}")
            continue
        dur = len(x) / SR
        st, edb, loud = onset(x)
        # never seek so late that the 10s snippet runs past the end
        st = float(min(st, max(0.0, dur - LONGEST - 0.25)))
        # how loud is the first 0.75s as-is vs after the shift?
        f075 = int(0.75 / HOP)
        before = float(db(np.sqrt((x[:int(0.75 * SR)] ** 2).mean() + 1e-12)))
        seg = x[int(st * SR):int((st + 0.75) * SR)]
        after = float(db(np.sqrt((seg ** 2).mean() + 1e-12)))
        rows[did] = {
            "startAt": round(st, 2), "duration": round(dur, 2),
            "loud_db": round(float(loud), 1),
            "first075_db_before": round(before, 1),
            "first075_db_after": round(after, 1),
            "gain_db": round(after - before, 1),
        }
    json.dump(rows, open("onsets.json", "w"), indent=2)

    print(f"{'drama':22} {'start':>6} {'dur':>6} {'0.75s before':>13} {'after':>7} {'gain':>6}")
    for k, v in sorted(rows.items(), key=lambda kv: -kv[1]["gain_db"]):
        flag = "  <-- was silent" if v["gain_db"] >= 6 else ""
        print(f"{k:22} {v['startAt']:6.2f} {v['duration']:6.2f} "
              f"{v['first075_db_before']:13.1f} {v['first075_db_after']:7.1f} "
              f"{v['gain_db']:6.1f}{flag}")


if __name__ == "__main__":
    main()
