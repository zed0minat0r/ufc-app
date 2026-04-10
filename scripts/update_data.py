#!/usr/bin/env python3
"""
FightIQ — UFC Data Pipeline
Scrapes UFCStats.com and ESPN API to refresh fighter stats and upcoming events.

Sources (priority order):
  1. UFCStats.com          — canonical fighter stats + upcoming events
  2. ESPN scoreboard API   — current/live events with fight cards
  3. ESPN schedule API     — next 90 days of events
  4. The Odds API          — moneyline odds (optional, requires ODDS_API_KEY env var)

Usage:
  python3 scripts/update_data.py           # Dry run — prints what would change
  python3 scripts/update_data.py --patch   # Actually modifies main.js
"""

import json
import os
import re
import sys
import time
import shutil
from datetime import datetime, timezone
from difflib import SequenceMatcher

try:
    import requests
    from bs4 import BeautifulSoup
    HAS_DEPS = True
except ImportError:
    HAS_DEPS = False
    print("[WARN] requests/beautifulsoup4 not installed. Falling back to stdlib.")
    import urllib.request
    import urllib.error

# ── Paths ──────────────────────────────────────────────────────────────────────

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT  = os.path.dirname(SCRIPT_DIR)
MAIN_JS    = os.path.join(REPO_ROOT, "main.js")

# ── Constants ──────────────────────────────────────────────────────────────────

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

UFCSTATS_BASE    = "http://ufcstats.com"
UFCSTATS_EVENTS  = "http://ufcstats.com/statistics/events/upcoming"
ESPN_SCOREBOARD  = "https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard"
ESPN_SCHEDULE    = "https://site.api.espn.com/apis/site/v2/sports/mma/ufc/schedule"
ODDS_API_BASE    = "https://api.the-odds-api.com/v4/sports/mma_mixed_martial_arts/odds/"

WEIGHT_CLASSES = [
    "Heavyweight", "Light Heavyweight", "Middleweight", "Welterweight",
    "Lightweight", "Featherweight", "Bantamweight", "Flyweight",
    "Strawweight", "Women's Strawweight", "Women's Flyweight",
    "Women's Bantamweight", "Women's Featherweight",
]

# Normalize weight class strings from various sources
WEIGHT_ALIASES = {
    "hw": "Heavyweight", "heavyweight": "Heavyweight",
    "lhw": "Light Heavyweight", "light heavyweight": "Light Heavyweight",
    "mw": "Middleweight", "middleweight": "Middleweight",
    "ww": "Welterweight", "welterweight": "Welterweight",
    "lw": "Lightweight", "lightweight": "Lightweight",
    "fw": "Featherweight", "featherweight": "Featherweight",
    "bw": "Bantamweight", "bantamweight": "Bantamweight",
    "flw": "Flyweight", "flyweight": "Flyweight",
    "sw": "Strawweight", "strawweight": "Strawweight",
    "w-sw": "Women's Strawweight", "women's strawweight": "Women's Strawweight",
    "women strawweight": "Women's Strawweight",
    "w-flw": "Women's Flyweight", "women's flyweight": "Women's Flyweight",
    "women flyweight": "Women's Flyweight",
    "w-bw": "Women's Bantamweight", "women's bantamweight": "Women's Bantamweight",
    "women bantamweight": "Women's Bantamweight",
    "w-fw": "Women's Featherweight", "women's featherweight": "Women's Featherweight",
    "women featherweight": "Women's Featherweight",
}

# ── HTTP helpers ───────────────────────────────────────────────────────────────

def get_headers(accept="text/html"):
    return {
        "User-Agent": USER_AGENT,
        "Accept": accept,
        "Accept-Language": "en-US,en;q=0.9",
    }

def fetch_html(url, timeout=15):
    """Fetch HTML via requests (preferred) or urllib fallback."""
    print(f"  GET {url}")
    if HAS_DEPS:
        try:
            r = requests.get(url, headers=get_headers(), timeout=timeout)
            r.raise_for_status()
            return r.text
        except requests.RequestException as e:
            print(f"  [ERR] {e}")
            return None
    else:
        import urllib.request
        import urllib.error
        req = urllib.request.Request(url, headers=get_headers())
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.read().decode("utf-8", errors="replace")
        except Exception as e:
            print(f"  [ERR] {e}")
            return None

def fetch_json(url, timeout=10):
    """Fetch JSON from an API endpoint."""
    print(f"  GET {url[:80]}{'...' if len(url) > 80 else ''}")
    if HAS_DEPS:
        try:
            r = requests.get(url, headers=get_headers("application/json"), timeout=timeout)
            r.raise_for_status()
            return r.json()
        except requests.RequestException as e:
            print(f"  [ERR] {e}")
            return None
    else:
        import urllib.request
        import urllib.error
        req = urllib.request.Request(url, headers=get_headers("application/json"))
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.loads(resp.read().decode())
        except Exception as e:
            print(f"  [ERR] {e}")
            return None

# ── Utility ────────────────────────────────────────────────────────────────────

def to_fighter_id(name):
    """Convert a fighter name to kebab-case ID."""
    name = name.strip().lower()
    name = re.sub(r"[''`]", "", name)           # remove apostrophes
    name = re.sub(r"[^a-z0-9\s\-]", " ", name) # keep alphanumeric + hyphen
    name = re.sub(r"\s+", "-", name.strip())    # spaces to hyphens
    name = re.sub(r"-+", "-", name)             # collapse multiple hyphens
    return name.strip("-")

def normalize_weight(raw):
    """Map raw weight class string to canonical form."""
    if not raw:
        return "Lightweight"
    key = raw.strip().lower()
    # Try direct alias lookup
    if key in WEIGHT_ALIASES:
        return WEIGHT_ALIASES[key]
    # Try partial match
    for alias, canonical in WEIGHT_ALIASES.items():
        if alias in key:
            return canonical
    # Try to find a canonical class name in the raw string
    for wc in WEIGHT_CLASSES:
        if wc.lower() in key:
            return wc
    return "Lightweight"  # default fallback

def name_similarity(a, b):
    """Fuzzy name similarity score 0-1."""
    return SequenceMatcher(None, a.lower().strip(), b.lower().strip()).ratio()

def infer_initials(name):
    parts = name.split()
    if len(parts) >= 2:
        return (parts[0][0] + parts[-1][0]).upper()
    return name[:2].upper()

def infer_event_type(name):
    return "ppv" if re.search(r'\bUFC\s+\d{3}\b', name) else "fight-night"

def infer_event_id(name, date_str=""):
    """Generate a stable event ID from the event name."""
    m = re.search(r'UFC\s+(\d{3})', name)
    if m:
        return f"ufc-{m.group(1)}"
    slug = re.sub(r'[^a-z0-9\s]', '', name.lower())
    slug = re.sub(r'\s+', '-', slug.strip())[:30]
    # Append short date suffix for uniqueness
    if date_str:
        try:
            dt = datetime.strptime(date_str, "%B %d, %Y")
            slug += f"-{dt.strftime('%b%d').lower()}"
        except Exception:
            pass
    return slug

def parse_record(rec_str):
    """Parse 'W-L-D' record from various formats."""
    m = re.search(r'(\d+)\s*-\s*(\d+)\s*(?:-\s*(\d+))?', str(rec_str))
    if m:
        w, l, d = m.group(1), m.group(2), m.group(3) or "0"
        return f"{w}-{l}-{d}"
    return "0-0-0"

def parse_stat_float(val):
    """Parse a stat value to float, return 0.0 on failure."""
    try:
        return float(str(val).replace("%", "").strip())
    except Exception:
        return 0.0

def pct_to_int(val):
    """Parse percentage like '57%' or '0.57' to integer 0-100."""
    s = str(val).strip().replace("%", "")
    try:
        f = float(s)
        return int(f if f > 1 else f * 100)
    except Exception:
        return 0

def friendly_date(date_str):
    """Parse various date formats to 'Month D, YYYY'."""
    if not date_str:
        return "TBA"
    for fmt in ("%Y-%m-%dT%H:%M:%SZ", "%Y-%m-%dT%H:%M:%S%z",
                "%Y-%m-%d", "%B %d, %Y", "%b %d, %Y"):
        try:
            dt = datetime.strptime(date_str.split("+")[0].replace("Z", ""), fmt.replace("%z", ""))
            return dt.strftime("%B %-d, %Y")
        except Exception:
            pass
    # ISO with timezone offset
    try:
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        return dt.strftime("%B %-d, %Y")
    except Exception:
        return date_str

def is_future_date(date_str):
    """Return True if the date is in the future."""
    if not date_str or date_str == "TBA":
        return True
    try:
        dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        return dt.replace(tzinfo=timezone.utc) > datetime.now(timezone.utc)
    except Exception:
        pass
    for fmt in ("%Y-%m-%d", "%B %d, %Y", "%B %-d, %Y", "%b %d, %Y"):
        try:
            dt = datetime.strptime(date_str, fmt)
            return dt > datetime.now()
        except Exception:
            pass
    return True  # assume future if we can't parse

# ── UFCStats scraper ───────────────────────────────────────────────────────────

def scrape_ufcstats_events():
    """Scrape upcoming events from UFCStats.com/statistics/events/upcoming."""
    print("\n[UFCStats] Fetching upcoming events...")
    html = fetch_html(UFCSTATS_EVENTS)
    if not html:
        print("  [WARN] UFCStats events page unavailable.")
        return []

    if not HAS_DEPS:
        return _parse_ufcstats_events_stdlib(html)

    soup = BeautifulSoup(html, "html.parser")
    events = []

    # UFCStats table has 2 cells per row:
    #   cell[0]: event name (as a link) + date (as trailing text)
    #   cell[1]: location
    rows = soup.select("tr.b-statistics__table-row")
    for row in rows:
        cells = row.select("td.b-statistics__table-col")
        if not cells:
            continue
        link_el = cells[0].select_one("a.b-link") if cells else None
        if not link_el:
            continue
        event_url = link_el.get("href", "").strip()
        name = link_el.get_text(strip=True)
        if not name or not event_url:
            continue

        # Date is the text remaining in cell[0] after stripping the name
        cell0_text = cells[0].get_text(separator=" ", strip=True)
        date_raw = cell0_text.replace(name, "").strip()
        # Location is in cell[1]
        location = cells[1].get_text(strip=True) if len(cells) > 1 else ""

        # Only include future events
        date_parsed = _parse_ufcstats_date(date_raw)
        if not is_future_date(date_parsed):
            continue

        print(f"  Found: {name} — {date_parsed} @ {location}")
        time.sleep(1)

        # Fetch the event detail page for fight card
        fights = scrape_ufcstats_event_detail(event_url, name)

        events.append({
            "name": name,
            "date": date_parsed,
            "location": location,
            "fights": fights,
            "source": "ufcstats",
        })

    return events

def _parse_ufcstats_date(raw):
    """UFCStats dates look like 'April 12, 2026' or 'Apr. 12, 2026'."""
    raw = raw.replace(".", "")
    for fmt in ("%B %d, %Y", "%b %d, %Y"):
        try:
            dt = datetime.strptime(raw.strip(), fmt)
            return dt.strftime("%B %-d, %Y")
        except Exception:
            pass
    return raw.strip() or "TBA"

def _parse_ufcstats_events_stdlib(html):
    """Minimal stdlib fallback parser for UFCStats events page."""
    events = []
    rows = re.findall(
        r'<tr[^>]*b-statistics__table-row[^>]*>(.*?)</tr>',
        html, re.DOTALL | re.IGNORECASE
    )
    for row in rows:
        href = re.search(r'href="(http://ufcstats\.com/event-details/[^"]+)"', row)
        name = re.search(r'class="b-link[^"]*">([^<]+)<', row)
        if not href or not name:
            continue
        cells = re.findall(r'<td[^>]*>(.*?)</td>', row, re.DOTALL)
        clean = lambda s: re.sub(r'<[^>]+>', '', s).strip()
        date_raw = clean(cells[1]) if len(cells) > 1 else ""
        location = clean(cells[2]) if len(cells) > 2 else ""
        date_parsed = _parse_ufcstats_date(date_raw)
        if not is_future_date(date_parsed):
            continue
        events.append({
            "name": name.group(1).strip(),
            "date": date_parsed,
            "location": location,
            "fights": [],
            "source": "ufcstats-stdlib",
            "_url": href.group(1),
        })
    return events

def scrape_ufcstats_event_detail(event_url, event_name=""):
    """Scrape a single event detail page for the fight card."""
    html = fetch_html(event_url)
    if not html:
        return []

    if not HAS_DEPS:
        return _parse_event_detail_stdlib(html)

    soup = BeautifulSoup(html, "html.parser")
    fights = []

    # UFCStats event detail table structure:
    #   col[0]: empty checkbox col
    #   col[1]: fighter names (two <a> or <p> tags)
    #   col[6]: weight class
    # Only rows with a data-link attribute are actual fight rows (not header/divider rows)
    fight_rows = [
        row for row in soup.select("tr.b-fight-details__table-row")
        if row.get("data-link")
    ]

    for i, row in enumerate(fight_rows):
        cols = row.select("td")
        if len(cols) < 7:
            continue

        # Fighter names — col[1] has two <a> tags
        fighter_links = cols[1].select("a")
        if len(fighter_links) < 2:
            # Fallback: use <p> tags
            fighter_ps = cols[1].select("p")
            if len(fighter_ps) < 2:
                continue
            f1_name = fighter_ps[0].get_text(strip=True)
            f2_name = fighter_ps[1].get_text(strip=True)
        else:
            f1_name = fighter_links[0].get_text(strip=True)
            f2_name = fighter_links[1].get_text(strip=True)

        if not f1_name or not f2_name:
            continue

        # Weight class — col[6]
        weight_raw = cols[6].get_text(strip=True) if len(cols) > 6 else ""
        weight = normalize_weight(weight_raw)
        tier = _infer_tier(i, len(fight_rows))

        fights.append({
            "f1": to_fighter_id(f1_name),
            "f2": to_fighter_id(f2_name),
            "f1_name": f1_name,
            "f2_name": f2_name,
            "weight": weight,
            "tier": tier,
        })

    return fights

def _parse_event_detail_stdlib(html):
    """Minimal stdlib fallback for event detail page."""
    fights = []
    # Look for fighter name links in fight rows
    rows = re.findall(
        r'<tr[^>]*b-fight-details__table-row[^>]*data-link="([^"]+)"[^>]*>(.*?)</tr>',
        html, re.DOTALL | re.IGNORECASE
    )
    for i, (_, row_html) in enumerate(rows):
        names = re.findall(r'<a[^>]*href="[^"]*fighter-details[^"]*"[^>]*>([^<]+)</a>', row_html)
        if len(names) < 2:
            continue
        f1, f2 = names[0].strip(), names[1].strip()
        weight_m = re.search(r'(Heavyweight|Light Heavyweight|Middleweight|Welterweight|Lightweight|Featherweight|Bantamweight|Flyweight|Strawweight)', row_html)
        weight = weight_m.group(1) if weight_m else "Lightweight"
        fights.append({
            "f1": to_fighter_id(f1), "f2": to_fighter_id(f2),
            "f1_name": f1, "f2_name": f2,
            "weight": weight, "tier": _infer_tier(i, len(rows)),
        })
    return fights

def _infer_tier(index, total):
    """Assign tier based on position in fight card (main card first)."""
    if index == 0:
        return "main"
    elif index == 1:
        return "co-main"
    elif index < max(5, total - 4):
        return "main-card"
    else:
        return "prelim"

# ── UFCStats fighter stats ─────────────────────────────────────────────────────

def scrape_fighter_stats(fighter_id_url):
    """Scrape detailed stats from UFCStats fighter detail page."""
    url = f"{UFCSTATS_BASE}/fighter-details/{fighter_id_url}"
    html = fetch_html(url)
    if not html or not HAS_DEPS:
        return {}

    soup = BeautifulSoup(html, "html.parser")
    stats = {}

    # Striking stats block
    for item in soup.select("li.b-list__box-list-item"):
        label_el = item.select_one("i.b-list__box-item-title")
        if not label_el:
            continue
        label = label_el.get_text(strip=True).rstrip(":").strip().lower()
        value = item.get_text(strip=True).replace(label_el.get_text(strip=True), "").strip()

        if "slpm" in label or "sig. str. landed" in label:
            stats["slpm"] = parse_stat_float(value)
        elif "str. acc" in label:
            stats["strAcc"] = pct_to_int(value)
        elif "td avg" in label:
            stats["tdAvg"] = parse_stat_float(value)
        elif "sub. avg" in label:
            stats["subAvg"] = parse_stat_float(value)
        elif "height" in label:
            stats["height"] = value
        elif "reach" in label:
            stats["reach"] = _parse_reach(value)
        elif "stance" in label:
            stats["stance"] = value
        elif "weight" in label:
            stats["weightRaw"] = value
        elif "record" in label or "w-l" in label:
            stats["record"] = parse_record(value)

    return stats

def _parse_reach(val):
    """Parse reach like '74\"' → 74.0."""
    m = re.search(r'([\d.]+)', str(val))
    return float(m.group(1)) if m else 0.0

def scrape_all_fighters_for_letter(letter):
    """Scrape fighter list page for a single letter."""
    url = f"{UFCSTATS_BASE}/statistics/fighters?char={letter}&page=all"
    html = fetch_html(url)
    if not html or not HAS_DEPS:
        return []

    soup = BeautifulSoup(html, "html.parser")
    fighters = []

    rows = soup.select("tr.b-statistics__table-row")
    for row in rows:
        cells = row.select("td.b-statistics__table-col")
        if len(cells) < 6:
            continue

        first_name = cells[0].get_text(strip=True)
        last_name  = cells[1].get_text(strip=True)
        if not first_name and not last_name:
            continue
        name = f"{first_name} {last_name}".strip()
        if not name:
            continue

        # Fighter detail URL is on the first-name link
        link_el = cells[0].select_one("a") or cells[1].select_one("a")
        detail_url = link_el.get("href", "") if link_el else ""

        nickname  = cells[2].get_text(strip=True)
        height    = cells[3].get_text(strip=True)
        weight    = cells[4].get_text(strip=True)
        reach     = cells[5].get_text(strip=True)
        stance    = cells[6].get_text(strip=True) if len(cells) > 6 else ""
        record    = cells[7].get_text(strip=True) if len(cells) > 7 else ""

        fighters.append({
            "name": name,
            "nickname": nickname,
            "height": height,
            "weightRaw": weight,
            "reach": _parse_reach(reach),
            "stance": stance,
            "record": parse_record(record),
            "detail_url": detail_url,
        })

    return fighters

# ── ESPN API ───────────────────────────────────────────────────────────────────

def _parse_espn_response(data):
    """Parse ESPN scoreboard or schedule JSON into normalized event dicts."""
    events = []
    if not data:
        return events

    for ev in data.get("events", []):
        name      = ev.get("name") or ev.get("shortName", "")
        date_raw  = ev.get("date", "")
        date_str  = friendly_date(date_raw)

        if not is_future_date(date_raw):
            continue

        # Venue from first competition
        competitions = ev.get("competitions", [])
        comp0 = competitions[0] if competitions else {}
        venue = comp0.get("venue", {})
        venue_name = venue.get("fullName", "")
        city       = venue.get("address", {}).get("city", "")
        state      = venue.get("address", {}).get("state", "")
        if venue_name:
            location = venue_name
            if city:
                location += f", {city}"
                if state:
                    location += f", {state}"
        elif city:
            location = f"{city}, {state}" if state else city
        else:
            location = ""

        # Build fight list — ESPN puts prelims first, main card last
        fights_raw = []
        for comp in competitions:
            competitors = comp.get("competitors", [])
            if len(competitors) < 2:
                continue
            f1_name = competitors[0].get("athlete", {}).get("displayName", "TBA")
            f2_name = competitors[1].get("athlete", {}).get("displayName", "TBA")
            weight_raw = comp.get("notes", [{}])[0].get("headline", "") if comp.get("notes") else ""
            fights_raw.append({
                "f1_name": f1_name, "f2_name": f2_name,
                "weight": normalize_weight(weight_raw),
            })

        # Reverse so main card fights are first
        fights_raw = list(reversed(fights_raw))

        structured_fights = []
        for i, f in enumerate(fights_raw):
            f1_id = to_fighter_id(f["f1_name"])
            f2_id = to_fighter_id(f["f2_name"])
            structured_fights.append({
                "f1": f1_id, "f2": f2_id,
                "f1_name": f["f1_name"], "f2_name": f["f2_name"],
                "weight": f["weight"],
                "tier": _infer_tier(i, len(fights_raw)),
            })

        events.append({
            "name": name,
            "date": date_str,
            "location": location,
            "fights": structured_fights,
            "source": "espn",
        })

    return events

def fetch_espn_scoreboard():
    print("\n[ESPN Scoreboard] Fetching live/current events...")
    data = fetch_json(ESPN_SCOREBOARD)
    return _parse_espn_response(data)

def fetch_espn_schedule():
    now   = datetime.now(timezone.utc)
    start = now.strftime("%Y%m%d")
    m3    = now.month + 3
    year  = now.year + (m3 - 1) // 12
    month = ((m3 - 1) % 12) + 1
    end   = f"{year}{month:02d}01"
    url   = f"{ESPN_SCHEDULE}?dates={start}-{end}&limit=20"
    print(f"\n[ESPN Schedule] Fetching {start} → {end}...")
    data = fetch_json(url)
    return _parse_espn_response(data)

# ── Odds API ───────────────────────────────────────────────────────────────────

def fetch_odds(known_fighters=None):
    """Fetch moneyline odds from The Odds API. Returns dict of fighter_id → odds."""
    api_key = os.environ.get("ODDS_API_KEY", "")
    if not api_key:
        print("\n[Odds API] ODDS_API_KEY not set — skipping odds.")
        return {}

    url = (
        f"{ODDS_API_BASE}"
        f"?apiKey={api_key}&regions=us&markets=h2h&oddsFormat=american"
    )
    print("\n[Odds API] Fetching moneyline odds...")
    data = fetch_json(url)
    if not data or not isinstance(data, list):
        return {}

    odds_map = {}
    for game in data:
        title = game.get("home_team", "") + " vs " + game.get("away_team", "")
        bookmakers = game.get("bookmakers", [])
        if not bookmakers:
            continue
        markets = bookmakers[0].get("markets", [])
        h2h = next((m for m in markets if m.get("key") == "h2h"), None)
        if not h2h:
            continue
        for outcome in h2h.get("outcomes", []):
            name = outcome.get("name", "")
            price = outcome.get("price", 0)
            fid = to_fighter_id(name)
            # Fuzzy match to known fighter IDs
            if known_fighters:
                best_match = None
                best_score = 0.0
                for kid in known_fighters:
                    score = name_similarity(fid, kid)
                    if score > best_score:
                        best_score = score
                        best_match = kid
                if best_match and best_score > 0.7:
                    fid = best_match
            odds_map[fid] = price

    print(f"  → {len(odds_map)} odds entries fetched")
    return odds_map

# ── Merge events from multiple sources ────────────────────────────────────────

def merge_events(all_events):
    """
    Merge events from multiple sources. UFCStats is canonical for fight cards.
    ESPN is authoritative for dates/locations when UFCStats is missing them.
    """
    merged = {}  # key → event dict

    def event_key(name):
        k = name.strip().lower()
        # Normalize numbered events: "ufc 327" → canonical key
        m = re.search(r'ufc\s+(\d{3})', k)
        if m:
            return f"ufc-{m.group(1)}"
        # Normalize fight night events to single key per event
        if "fight night" in k:
            # Extract headliner if present: "ufc fight night: jones vs smith"
            m2 = re.search(r'fight night\s*:?\s*(.+)', k)
            if m2:
                return "ufc-fn-" + re.sub(r'[^a-z0-9]', '-', m2.group(1).strip())[:30]
            return "ufc-fight-night"
        return re.sub(r'[^a-z0-9]', '-', k)[:40]

    # Priority order: ufcstats > espn > fallback
    source_priority = {"ufcstats": 0, "ufcstats-stdlib": 1, "espn": 2}

    for ev in all_events:
        k = event_key(ev["name"])
        if k not in merged:
            merged[k] = ev.copy()
        else:
            existing = merged[k]
            ex_prio = source_priority.get(existing.get("source", ""), 99)
            new_prio = source_priority.get(ev.get("source", ""), 99)

            # Take fight card from higher-priority source (or more fights)
            if new_prio < ex_prio or len(ev["fights"]) > len(existing["fights"]):
                existing["fights"] = ev["fights"]

            # Take better location
            if not existing.get("location") and ev.get("location"):
                existing["location"] = ev["location"]

            # Take better date
            if existing.get("date") in ("TBA", "", None) and ev.get("date") not in ("TBA", "", None):
                existing["date"] = ev["date"]

            # Take better name (more descriptive)
            if len(ev["name"]) > len(existing["name"]):
                existing["name"] = ev["name"]

    return list(merged.values())

# ── main.js parser ─────────────────────────────────────────────────────────────

def parse_existing_fighters(js_content):
    """
    Extract existing fighter IDs from FIGHTERS and EXTRA_FIGHTERS objects
    in main.js. Returns a set of IDs.
    """
    ids = set()
    # Match quoted keys: "fighter-id": {
    for m in re.finditer(r'"([\w-]+)"\s*:\s*\{', js_content):
        candidate = m.group(1)
        # Only include if it looks like a fighter ID (contains hyphens or is all alpha)
        if re.match(r'^[a-z][a-z0-9-]+$', candidate):
            ids.add(candidate)
    return ids

def parse_existing_events(js_content):
    """Extract existing UPCOMING_EVENTS array content as raw string."""
    m = re.search(r'const\s+UPCOMING_EVENTS\s*=\s*\[(.+?)\];', js_content, re.DOTALL)
    return m.group(1).strip() if m else ""

# ── JavaScript builders ────────────────────────────────────────────────────────

def build_fighter_js(fid, data):
    """Build a JavaScript fighter object string."""
    name    = data.get("name", fid.replace("-", " ").title())
    nick    = data.get("nickname", "")
    record  = data.get("record", "0-0-0")
    weight  = data.get("weight", "Lightweight")
    rank    = data.get("rank", "Unranked")
    initials = data.get("initials", infer_initials(name))
    image   = data.get("image", "")
    stats   = data.get("stats", {})
    slpm    = stats.get("slpm", 4.0)
    strAcc  = stats.get("strAcc", 48)
    tdAvg   = stats.get("tdAvg", 1.5)
    subAvg  = stats.get("subAvg", 0.5)
    koPct   = stats.get("koPct", 33)
    subPct  = stats.get("subPct", 33)
    decPct  = stats.get("decPct", 34)
    style   = data.get("style", "MMA")
    reach   = data.get("reach", 72)
    stance  = data.get("stance", "Orthodox")

    return (
        f'  "{fid}": {{\n'
        f'    id: "{fid}", name: {json.dumps(name)}, nickname: {json.dumps(nick)},\n'
        f'    record: "{record}", weight: "{weight}", rank: "{rank}",\n'
        f'    initials: "{initials}", image: {json.dumps(image)},\n'
        f'    stats: {{ slpm: {slpm}, strAcc: {strAcc}, tdAvg: {tdAvg}, subAvg: {subAvg},'
        f' koPct: {koPct}, subPct: {subPct}, decPct: {decPct} }},\n'
        f'    style: "{style}", reach: {reach}, stance: "{stance}"\n'
        f'  }}'
    )

def build_events_js(events):
    """Build the UPCOMING_EVENTS JavaScript array content."""
    lines = ["const UPCOMING_EVENTS = ["]
    for i, ev in enumerate(events):
        sep = "," if i < len(events) - 1 else ""
        event_type = infer_event_type(ev["name"])
        event_id   = infer_event_id(ev["name"], ev.get("date", ""))
        date_str   = ev.get("date", "TBA")
        location   = ev.get("location", "TBA")
        fights     = ev.get("fights", [])

        fight_lines = []
        for f in fights:
            f1  = f.get("f1", "")
            f2  = f.get("f2", "")
            tier   = f.get("tier", "main-card")
            weight = f.get("weight", "Lightweight")
            fight_lines.append(
                f'      {{ f1: "{f1}", f2: "{f2}", tier: "{tier}", weight: "{weight}" }}'
            )

        fights_str = ",\n".join(fight_lines)
        lines.append(
            f'  {{\n'
            f'    id: "{event_id}",\n'
            f'    name: {json.dumps(ev["name"])},\n'
            f'    type: "{event_type}",\n'
            f'    date: "{date_str}",\n'
            f'    location: {json.dumps(location)},\n'
            f'    fights: [\n'
            f'{fights_str}\n'
            f'    ]\n'
            f'  }}{sep}'
        )

    lines.append("];")
    return "\n".join(lines)

# ── New fighters from event cards ──────────────────────────────────────────────

def collect_new_fighters_from_events(events, existing_ids):
    """
    Find fighter IDs in event fight cards that don't exist in FIGHTERS or EXTRA_FIGHTERS.
    Return list of (fighter_id, name) tuples.
    """
    new_fighters = []
    seen = set()
    for ev in events:
        for fight in ev.get("fights", []):
            for key in ("f1", "f2"):
                fid = fight.get(key, "")
                name = fight.get(f"{key}_name", "")
                if fid and fid not in existing_ids and fid not in seen:
                    new_fighters.append((fid, name or fid.replace("-", " ").title()))
                    seen.add(fid)
    return new_fighters

def build_new_fighter_entry(fid, name, weight="Lightweight"):
    """Build a minimal fighter entry for a newly discovered fighter."""
    return {
        "name": name,
        "nickname": "",
        "record": "0-0-0",
        "weight": weight,
        "rank": "Unranked",
        "initials": infer_initials(name),
        "image": "",
        "stats": {
            "slpm": 4.0, "strAcc": 48, "tdAvg": 1.5, "subAvg": 0.5,
            "koPct": 33, "subPct": 33, "decPct": 34
        },
        "style": "MMA",
        "reach": 72,
        "stance": "Orthodox",
    }

# ── Patch main.js ──────────────────────────────────────────────────────────────

def patch_main_js(events, new_fighters, dry_run=True):
    """
    Replace UPCOMING_EVENTS and append new fighter entries to EXTRA_FIGHTERS.
    If dry_run=True, print the diff without writing.
    """
    try:
        with open(MAIN_JS, "r") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"\n[ERROR] main.js not found at {MAIN_JS}")
        return False

    print(f"\n{'=' * 60}")
    print("PATCH PREVIEW")
    print(f"{'=' * 60}")

    # 1. Build new UPCOMING_EVENTS block
    new_events_block = build_events_js(events)

    # 2. Replace existing UPCOMING_EVENTS
    pattern = r'const\s+UPCOMING_EVENTS\s*=\s*\[.*?\];'
    new_content, count = re.subn(pattern, new_events_block, content, flags=re.DOTALL)
    if count == 0:
        print("[ERROR] Could not find 'const UPCOMING_EVENTS' in main.js")
        return False

    print(f"\nUPCOMING_EVENTS: replacing with {len(events)} event(s)")
    for ev in events:
        print(f"  - {ev['name']} ({ev['date']}) — {len(ev.get('fights', []))} fight(s)")

    # 3. Append new fighters to EXTRA_FIGHTERS
    if new_fighters:
        print(f"\nNew fighters to add to EXTRA_FIGHTERS ({len(new_fighters)}):")
        insert_lines = []
        for fid, name in new_fighters:
            # Try to find weight from events
            weight = "Lightweight"
            for ev in events:
                for fight in ev.get("fights", []):
                    if fight.get("f1") == fid or fight.get("f2") == fid:
                        weight = fight.get("weight", "Lightweight")
                        break
            print(f"  + {fid} ({name}) — {weight}")
            entry = build_new_fighter_entry(fid, name, weight)
            insert_lines.append(build_fighter_js(fid, entry))

        # Find the closing brace of EXTRA_FIGHTERS
        # Pattern: find "};" that closes EXTRA_FIGHTERS (after its opening)
        ef_close = re.search(
            r'(const\s+EXTRA_FIGHTERS\s*=\s*\{.*?)(};)',
            new_content, re.DOTALL
        )
        if ef_close:
            insert_block = ",\n" + ",\n".join(insert_lines) + "\n"
            new_content = (
                new_content[:ef_close.start(2)]
                + insert_block
                + new_content[ef_close.start(2):]
            )
        else:
            print("[WARN] Could not find EXTRA_FIGHTERS closing brace — new fighters not added")

    if dry_run:
        print("\n[DRY RUN] No files modified. Run with --patch to apply changes.")
        return True

    # 4. Backup and write
    backup_path = MAIN_JS + ".bak"
    shutil.copy2(MAIN_JS, backup_path)
    print(f"\nBackup: {backup_path}")

    with open(MAIN_JS, "w") as f:
        f.write(new_content)

    print(f"main.js patched successfully.")
    return True

# ── Report ─────────────────────────────────────────────────────────────────────

def print_event_report(events):
    print(f"\n{'=' * 60}")
    print(f"UPCOMING EVENTS ({len(events)} total)")
    print(f"{'=' * 60}\n")
    for i, ev in enumerate(events, 1):
        src = ev.get("source", "?")
        print(f"  {i}. {ev['name']}  [{src}]")
        print(f"     Date:     {ev.get('date', 'TBA')}")
        print(f"     Location: {ev.get('location', 'TBA')}")
        fights = ev.get("fights", [])
        if fights:
            print(f"     Fight card ({len(fights)} bouts):")
            for f in fights:
                f1 = f.get("f1_name") or f.get("f1", "?")
                f2 = f.get("f2_name") or f.get("f2", "?")
                tier   = f.get("tier", "")
                weight = f.get("weight", "")
                print(f"       [{tier:10s}] {f1} vs. {f2}  ({weight})")
        else:
            print(f"     Fight card: TBA")
        print()

# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    patch_mode = "--patch" in sys.argv

    print("=" * 60)
    print("FightIQ — UFC Data Pipeline")
    print(f"Mode: {'PATCH (will modify main.js)' if patch_mode else 'DRY RUN (no files changed)'}")
    print(f"Run at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

    all_events = []

    # ── Source 1: UFCStats upcoming events ──
    try:
        ufcstats_events = scrape_ufcstats_events()
        if ufcstats_events:
            print(f"  -> {len(ufcstats_events)} event(s) from UFCStats")
            all_events.extend(ufcstats_events)
        else:
            print("  [WARN] No events from UFCStats — trying ESPN fallback")
    except Exception as e:
        print(f"  [ERR] UFCStats scrape failed: {e}")

    # ── Source 2: ESPN Scoreboard ──
    try:
        sb_events = fetch_espn_scoreboard()
        if sb_events:
            print(f"  -> {len(sb_events)} event(s) from ESPN scoreboard")
            all_events.extend(sb_events)
    except Exception as e:
        print(f"  [ERR] ESPN scoreboard failed: {e}")

    # ── Source 3: ESPN Schedule ──
    try:
        sched_events = fetch_espn_schedule()
        if sched_events:
            print(f"  -> {len(sched_events)} event(s) from ESPN schedule")
            all_events.extend(sched_events)
    except Exception as e:
        print(f"  [ERR] ESPN schedule failed: {e}")

    if not all_events:
        print("\n[FATAL] All sources failed. Check network connectivity.")
        print("Manual reference: https://www.ufc.com/events")
        sys.exit(1)

    # ── Merge & sort ──
    upcoming = merge_events(all_events)
    # Sort by date (soonest first)
    def sort_key(ev):
        d = ev.get("date", "TBA")
        if d == "TBA":
            return "9999-99-99"
        for fmt in ("%B %d, %Y", "%B %-d, %Y", "%b %d, %Y"):
            try:
                return datetime.strptime(d, fmt).strftime("%Y-%m-%d")
            except Exception:
                pass
        return d
    upcoming.sort(key=sort_key)

    print_event_report(upcoming)

    # ── Odds (optional) ──
    try:
        odds = fetch_odds()
    except Exception as e:
        print(f"  [ERR] Odds fetch failed: {e}")
        odds = {}

    # ── Find new fighters from event cards ──
    try:
        with open(MAIN_JS, "r") as f:
            js_content = f.read()
        existing_ids = parse_existing_fighters(js_content)
    except FileNotFoundError:
        print(f"[WARN] main.js not found at {MAIN_JS}")
        existing_ids = set()

    new_fighters = collect_new_fighters_from_events(upcoming, existing_ids)

    if new_fighters:
        print(f"\n[New Fighters] {len(new_fighters)} not yet in main.js:")
        for fid, name in new_fighters:
            print(f"  + {fid} ({name})")

    # ── Patch main.js ──
    patch_main_js(upcoming, new_fighters, dry_run=not patch_mode)

    print("\nDone.")

if __name__ == "__main__":
    main()
