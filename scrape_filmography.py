#!/usr/bin/env python3
"""Scrape TV drama filmographies from Wikipedia for all actors."""
import json
import re
import time
import urllib.request
import urllib.error
from bs4 import BeautifulSoup

ACTORS = [
    ("gong-yoo", "Gong_Yoo", "Gong Yoo", "공유"),
    ("kim-soo-hyun", "Kim_Soo-hyun", "Kim Soo-hyun", "김수현"),
    ("iu", "IU_(singer)", "IU", "아이유"),
    ("lee-min-ho", "Lee_Min-ho_(actor)", "Lee Min-ho", "이민호"),
    ("song-joong-ki", "Song_Joong-ki", "Song Joong-ki", "송중기"),
    ("park-seo-joon", "Park_Seo-joon", "Park Seo-joon", "박서준"),
    ("son-ye-jin", "Son_Ye-jin", "Son Ye-jin", "손예진"),
    ("hyun-bin", "Hyun_Bin", "Hyun Bin", "현빈"),
    ("song-hye-kyo", "Song_Hye-kyo", "Song Hye-kyo", "송혜교"),
    ("lee-jong-suk", "Lee_Jong-suk", "Lee Jong-suk", "이종석"),
    ("park-bo-gum", "Park_Bo-gum", "Park Bo-gum", "박보검"),
    ("kim-ji-won", "Kim_Ji-won_(actress)", "Kim Ji-won", "김지원"),
    ("wi-ha-joon", "Wi_Ha-joon", "Wi Ha-joon", "위하준"),
    ("lee-do-hyun", "Lee_Do-hyun", "Lee Do-hyun", "이도현"),
    ("jung-hae-in", "Jung_Hae-in", "Jung Hae-in", "정해인"),
    ("cha-eun-woo", "Cha_Eun-woo", "Cha Eun-woo", "차은우"),
    ("kim-se-jeong", "Kim_Se-jeong", "Kim Se-jeong", "김세정"),
    ("park-min-young", "Park_Min-young", "Park Min-young", "박민영"),
    ("bae-suzy", "Bae_Suzy", "Bae Suzy", "배수지"),
    ("lee-sung-kyung", "Lee_Sung-kyung", "Lee Sung-kyung", "이성경"),
    ("nam-joo-hyuk", "Nam_Joo-hyuk", "Nam Joo-hyuk", "남주혁"),
    ("kim-go-eun", "Kim_Go-eun", "Kim Go-eun", "김고은"),
    ("park-shin-hye", "Park_Shin-hye", "Park Shin-hye", "박신혜"),
    ("shin-min-a", "Shin_Min-a", "Shin Min-a", "신민아"),
]

HEADERS = {"User-Agent": "KDramaOSTGame/1.0 (personal project; filmography scraper)"}


def fetch_html(wiki_title, retries=3):
    """Fetch Wikipedia page HTML with retry logic."""
    url = f"https://en.wikipedia.org/api/rest_v1/page/html/{wiki_title}"
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=HEADERS)
            with urllib.request.urlopen(req, timeout=15) as resp:
                return resp.read().decode("utf-8")
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < retries - 1:
                wait = 5 * (attempt + 1)
                print(f"  Rate limited, waiting {wait}s...")
                time.sleep(wait)
            else:
                raise
    return None


def classify_role(role_text, notes_text=""):
    """Classify a role as main, supporting, or guest."""
    combined = (role_text + " " + notes_text).lower()
    if any(kw in combined for kw in ["guest", "cameo", "special appearance",
                                      "special episode", "ep. ", "ep ", "episode"]):
        return "guest"
    if any(kw in combined for kw in ["supporting", "recurring", "minor"]):
        return "supporting"
    return "main"


def parse_table(table):
    """Parse a filmography table and return drama entries."""
    dramas = []
    rows = table.find_all("tr")
    if not rows:
        return dramas

    header_cells = rows[0].find_all(["th", "td"])
    header_texts = [c.get_text().strip().lower() for c in header_cells]

    year_idx = title_idx = role_idx = notes_idx = -1
    for i, h in enumerate(header_texts):
        if "year" in h:
            year_idx = i
        elif "title" in h:
            title_idx = i
        elif "role" in h and role_idx == -1:
            role_idx = i
        elif "note" in h:
            notes_idx = i

    if title_idx == -1:
        if len(header_texts) >= 3:
            year_idx, title_idx, role_idx = 0, 1, 2
            if len(header_texts) >= 4:
                notes_idx = len(header_texts) - 1

    if title_idx == -1:
        return dramas

    last_year = ""
    for row in rows[1:]:
        cells = row.find_all(["td", "th"])
        if len(cells) < 2:
            continue

        def cell_text(idx):
            if 0 <= idx < len(cells):
                return cells[idx].get_text().strip()
            return ""

        year_text = cell_text(year_idx)
        title_text = cell_text(title_idx)
        role_text = cell_text(role_idx)
        notes_text = cell_text(notes_idx)

        if year_text:
            last_year = year_text
        else:
            year_text = last_year

        title_text = re.sub(r"\[.*?\]", "", title_text).strip()
        # Keep parenthetical info for now, clean later
        clean_title = re.sub(r"\s*\(.*?\)", "", title_text).strip()

        if not clean_title or clean_title.lower() in ["title", ""]:
            continue

        year_match = re.search(r"(\d{4})", year_text)
        year = int(year_match.group(1)) if year_match else 0

        role_type = classify_role(role_text, notes_text)

        dramas.append({
            "title": clean_title,
            "year": year,
            "role": role_type,
            "role_name": role_text,
            "notes": notes_text,
        })

    return dramas


def find_separate_filmography_page(soup):
    """Check if there's a link to a separate filmography page."""
    for div in soup.find_all("div"):
        text = div.get_text().lower()
        if "main article" in text or "further information" in text:
            for a in div.find_all("a"):
                href = a.get("href", "")
                title = a.get("title", "")
                if "filmography" in href.lower() or "filmography" in title.lower():
                    # Extract the wiki page title from the href
                    match = re.search(r"/wiki/(.+?)(?:\?|#|$)", href)
                    if match:
                        return match.group(1)
                    # Try the title attribute
                    if title:
                        return title.replace(" ", "_")
    return None


def find_tv_tables(soup):
    """Find TV/television filmography tables in the page."""
    tables = []

    # Strategy 1: Look for Television section headers
    for header in soup.find_all(["h2", "h3"]):
        text = header.get_text().lower().strip()
        if any(kw in text for kw in ["television", "tv series", "television series",
                                      "television drama", "drama"]):
            current = header.find_next_sibling()
            while current:
                if current.name in ["h2"]:
                    break
                if current.name in ["h3"]:
                    sub_text = current.get_text().lower()
                    if "film" in sub_text and "television" not in sub_text:
                        break
                if current.name == "table":
                    tables.append(current)
                current = current.find_next_sibling()
            if tables:
                return tables

    # Strategy 2: Look for Filmography section, then find TV subsection or tables
    for header in soup.find_all("h2"):
        text = header.get_text().lower().strip()
        if "filmography" in text:
            current = header.find_next_sibling()
            in_tv_section = False
            while current:
                if current.name == "h2":
                    break
                if current.name == "h3":
                    sub_text = current.get_text().lower()
                    in_tv_section = any(kw in sub_text for kw in
                                        ["television", "tv", "drama", "series"])
                if current.name == "table" and (in_tv_section or not tables):
                    tables.append(current)
                current = current.find_next_sibling()
            if tables:
                return tables

    # Strategy 3: Just find all tables with "Year" and "Title" headers
    for table in soup.find_all("table"):
        headers = [th.get_text().strip().lower() for th in table.find_all("th")]
        if "year" in headers and "title" in headers:
            tables.append(table)

    return tables


def fetch_filmography(wiki_title):
    """Fetch and parse TV drama filmography from Wikipedia."""
    html = fetch_html(wiki_title)
    if not html:
        return []

    soup = BeautifulSoup(html, "html.parser")

    # Check for separate filmography page
    sep_page = find_separate_filmography_page(soup)
    if sep_page:
        print(f"  → Following filmography page: {sep_page}")
        try:
            html2 = fetch_html(sep_page)
            if html2:
                soup2 = BeautifulSoup(html2, "html.parser")
                tables = find_tv_tables(soup2)
                if tables:
                    dramas = []
                    for t in tables:
                        dramas.extend(parse_table(t))
                    if dramas:
                        return dramas
        except Exception as e:
            print(f"  → Separate page failed: {e}")
        time.sleep(1)

    # Parse from main page
    tables = find_tv_tables(soup)
    dramas = []
    for t in tables:
        dramas.extend(parse_table(t))

    return dramas


def main():
    all_data = {}
    for actor_id, wiki, name, name_ko in ACTORS:
        print(f"Fetching: {name}...")
        try:
            dramas = fetch_filmography(wiki)
            dramas = [d for d in dramas if d["year"] > 0 and d["year"] <= 2026]
            # Deduplicate by title
            seen = set()
            unique = []
            for d in dramas:
                if d["title"] not in seen:
                    seen.add(d["title"])
                    unique.append(d)
            all_data[actor_id] = {
                "name": name,
                "nameKo": name_ko,
                "dramas": unique,
            }
            print(f"  OK: {len(unique)} dramas")
        except Exception as e:
            print(f"  FAIL: {e}")
            all_data[actor_id] = {"name": name, "nameKo": name_ko, "dramas": []}
        time.sleep(2)

    with open("filmography_raw.json", "w", encoding="utf-8") as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)

    print(f"\nSaved filmography_raw.json")
    total = sum(len(a["dramas"]) for a in all_data.values())
    actors_ok = sum(1 for a in all_data.values() if a["dramas"])
    print(f"Total: {total} drama entries across {actors_ok}/{len(all_data)} actors")


if __name__ == "__main__":
    main()
