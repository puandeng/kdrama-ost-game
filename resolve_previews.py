#!/usr/bin/env python3
"""
Resolve each drama's OST to an Apple iTunes 30-second preview URL.

Apple publishes these previews for embedding, so the game can play real OST
audio without hosting copyrighted files. The game uses a plain HTMLAudioElement
(`new Audio(url)`), so no CORS handling is needed.

Matching is verified, not trusted: the API's first hit is often a cover, a live
version, or an unrelated track that merely shares a word. Each candidate is
scored on title AND artist similarity after normalisation, and anything below
the accept threshold is reported for manual review instead of being written.

Writes previews.json: {drama_id: {url, track, artist, score, status}}
"""
import json
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.request

API = "https://itunes.apple.com/search"
UA = "KdramaOstGame/1.0 (personal project; OST preview resolver)"

ACCEPT = 0.72   # write automatically
REVIEW = 0.45   # below this, treat as no match at all


def norm(s):
    """Fold case, strip accents/punctuation/spacing so romanisation variants match.
    'Yoon Mi-rae' and 'YOON MIRAE' must compare equal."""
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = s.lower()
    s = re.sub(r"\([^)]*\)", " ", s)        # drop "(NCT)", "(feat. ...)"
    s = re.sub(r"\b(feat|ft|with)\b.*", " ", s)
    s = re.sub(r"[^a-z0-9]+", "", s)
    return s


def toks(s):
    s = unicodedata.normalize("NFKD", s or "")
    s = "".join(c for c in s if not unicodedata.combining(c))
    s = re.sub(r"\([^)]*\)", " ", s.lower())
    return {t for t in re.split(r"[^a-z0-9]+", s) if t}


def sim(a, b):
    """Containment-biased similarity on normalised strings."""
    if not a or not b:
        return 0.0
    if a == b:
        return 1.0
    if a in b or b in a:
        return 0.88
    # token overlap fallback
    ta, tb = toks(a), toks(b)
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / max(len(ta), len(tb))


def score(want_title, want_artist, got_title, got_artist):
    t = sim(norm(want_title), norm(got_title))
    a = sim(norm(want_artist), norm(got_artist))
    # An exact-ish title with a plausible artist is what we want; weight title
    # higher but require the artist to not be wildly off.
    return round(0.65 * t + 0.35 * a, 3)


def search(term, limit=8):
    url = f"{API}?" + urllib.parse.urlencode(
        {"term": term, "media": "music", "entity": "song", "limit": limit}
    )
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=25) as r:
                return json.loads(r.read().decode("utf-8")).get("results", [])
        except Exception as e:
            if attempt == 3:
                print(f"    ! {e}")
                return []
            time.sleep(3 * (attempt + 1))
    return []


def best(title, artist):
    """Try a few query shapes; keep the highest-scoring candidate overall."""
    seen, cands = set(), []
    for term in (f"{title} {artist}", f"{artist} {title}", title):
        for r in search(term):
            tid = r.get("trackId")
            if tid in seen:
                continue
            seen.add(tid)
            if not r.get("previewUrl"):
                continue
            cands.append((
                score(title, artist, r.get("trackName", ""), r.get("artistName", "")),
                r,
            ))
        time.sleep(1.8)
        if cands and max(c[0] for c in cands) >= 0.95:
            break  # already perfect, stop querying
    if not cands:
        return None
    cands.sort(key=lambda c: -c[0])
    return cands[0]


def main():
    src = open("src/data/dramas.js", encoding="utf-8").read()
    # Parse per entry block. A file-wide regex mis-pairs ids with songs whenever
    # an OST title contains an apostrophe (those are written with "double
    # quotes"), because the non-greedy match runs on to the next entry.
    entries = []
    for block in src.split("\n  {\n")[1:]:
        m_id = re.search(r"id: '([^']+)'", block)
        m_ost = re.search(
            r"ost: \{ title: (?:'([^']*)'|\"([^\"]*)\"), artist: '([^']*)' \}", block)
        if m_id and m_ost:
            entries.append((m_id.group(1), m_ost.group(1) or m_ost.group(2), m_ost.group(3)))
    print(f"resolving {len(entries)} tracks\n")

    out = {}
    for i, (did, title, artist) in enumerate(entries, 1):
        hit = best(title, artist)
        if not hit:
            out[did] = {"status": "NOT_FOUND", "want": f"{title} - {artist}"}
            print(f"{i:2}. {did:22} NOT_FOUND   {title} - {artist}")
            continue
        sc, r = hit
        status = "ok" if sc >= ACCEPT else ("review" if sc >= REVIEW else "NOT_FOUND")
        out[did] = {
            "status": status, "score": sc, "url": r["previewUrl"],
            "track": r.get("trackName", ""), "artist": r.get("artistName", ""),
            "want": f"{title} - {artist}",
        }
        flag = {"ok": "  ", "review": "?!", "NOT_FOUND": "!!"}[status]
        print(f"{i:2}. {did:22} {flag} {sc:.2f}  {r.get('trackName','')[:30]:32} / {r.get('artistName','')[:24]}")

    json.dump(out, open("previews.json", "w"), indent=2, ensure_ascii=False)
    n_ok = sum(1 for v in out.values() if v["status"] == "ok")
    n_rev = sum(1 for v in out.values() if v["status"] == "review")
    n_no = sum(1 for v in out.values() if v["status"] == "NOT_FOUND")
    print(f"\nok={n_ok}  review={n_rev}  not_found={n_no}")


if __name__ == "__main__":
    main()
