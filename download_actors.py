#!/usr/bin/env python3
import json
import os
import time
import urllib.request

ACTORS = [
    ("gong-yoo", "Gong_Yoo"),
    ("kim-soo-hyun", "Kim_Soo-hyun"),
    ("iu", "IU_(singer)"),
    ("lee-min-ho", "Lee_Min-ho_(actor)"),
    ("song-joong-ki", "Song_Joong-ki"),
    ("park-seo-joon", "Park_Seo-joon"),
    ("son-ye-jin", "Son_Ye-jin"),
    ("hyun-bin", "Hyun_Bin"),
    ("song-hye-kyo", "Song_Hye-kyo"),
    ("lee-jong-suk", "Lee_Jong-suk"),
    ("park-bo-gum", "Park_Bo-gum"),
    ("kim-ji-won", "Kim_Ji-won_(actress)"),
    ("wi-ha-joon", "Wi_Ha-joon"),
    ("lee-do-hyun", "Lee_Do-hyun"),
    ("jung-hae-in", "Jung_Hae-in"),
    ("cha-eun-woo", "Cha_Eun-woo"),
    ("kim-se-jeong", "Kim_Se-jeong"),
    ("park-min-young", "Park_Min-young"),
    ("bae-suzy", "Bae_Suzy"),
    ("lee-sung-kyung", "Lee_Sung-kyung"),
    ("nam-joo-hyuk", "Nam_Joo-hyuk"),
    ("kim-go-eun", "Kim_Go-eun"),
    ("park-shin-hye", "Park_Shin-hye"),
    ("shin-min-a", "Shin_Min-a"),
]

os.makedirs("public/actors", exist_ok=True)
headers = {"User-Agent": "KDramaOSTGame/1.0 (personal project)"}

ok = 0
fail = 0

for actor_id, wiki in ACTORS:
    api_url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{wiki}"
    req = urllib.request.Request(api_url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())

        img_url = data.get("thumbnail", {}).get("source", "")
        if not img_url:
            print(f"SKIP (no thumbnail): {actor_id}")
            fail += 1
            continue

        img_req = urllib.request.Request(img_url, headers=headers)
        with urllib.request.urlopen(img_req, timeout=10) as img_resp:
            img_data = img_resp.read()

        out_path = f"public/actors/{actor_id}.jpg"
        with open(out_path, "wb") as f:
            f.write(img_data)

        print(f"OK: {actor_id} ({len(img_data):,} bytes)")
        ok += 1
    except Exception as e:
        print(f"FAIL: {actor_id} — {e}")
        fail += 1

    time.sleep(0.5)

print(f"\nDone: {ok} downloaded, {fail} failed")
