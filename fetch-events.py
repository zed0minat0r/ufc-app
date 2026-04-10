#!/usr/bin/env python3
# SUPERSEDED: This script has been replaced by scripts/update_data.py
# which provides full UFCStats scraping, fighter stat updates, odds integration,
# and proper EXTRA_FIGHTERS patching. Use that script instead.
"""
FightIQ — UFC Event Fetcher
Pulls upcoming UFC events from multiple sources for maximum accuracy.

Sources (in priority order):
  1. ESPN scoreboard API  — current/live event fights
  2. ESPN schedule API    — next 90 days of events
  3. UFC.com events page  — full cards including main card (HTML scrape)

Usage:
  python3 fetch-events.py           # Print verified events
  python3 fetch-events.py --patch   # Also update main.js UPCOMING_EVENTS
"""

import json
import os
import re
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone
from html.parser import HTMLParser

# Work relative to this script's directory (works locally and in GitHub Actions)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MAIN_JS = os.path.join(SCRIPT_DIR, "main.js")

ESPN_SCOREBOARD = "https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard"
ESPN_SCHEDULE   = "https://site.api.espn.com/apis/site/v2/sports/mma/ufc/schedule"
UFC_EVENTS_API  = "https://d29dxerjsp82yg.cloudfront.net/api/v3/event/upcoming.json"
UFC_EVENTS_PAGE = "https://www.ufc.com/events"


def fetch_json(url):
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "application/json",
    })
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        print(f"  HTTP {e.code}: {url}")
        return None
    except Exception as e:
        print(f"  Error: {e} — {url}")
        return None


def fetch_html(url):
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        "Accept": "text/html,application/xhtml+xml",
    })
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.read().decode("utf-8", errors="replace")
    except Exception as e:
        print(f"  Error fetching HTML: {e}")
        return None


# ── Source 1 & 2: ESPN API ────────────────────────────────────────────────────

def parse_espn_events(data):
    events = []
    if not data:
        return events
    for ev in data.get("events", []):
        # Use full name (e.g. "UFC Fight Night: Moicano vs. Duncan"), not shortName
        name = ev.get("name") or ev.get("shortName", "")
        date_str = ev.get("date", "")
        venue = ev.get("competitions", [{}])[0].get("venue", {})
        location = venue.get("fullName", "") or venue.get("address", {}).get("city", "")
        try:
            dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
            friendly_date = dt.strftime("%B %-d, %Y")
            is_future = dt > datetime.now(timezone.utc)
        except Exception:
            friendly_date = date_str
            is_future = True
        # Collect all bouts — ESPN lists them prelims-first, main card last
        fights = []
        for comp in ev.get("competitions", []):
            comps = comp.get("competitors", [])
            if len(comps) >= 2:
                f1 = comps[0].get("athlete", {}).get("displayName", "TBA")
                f2 = comps[1].get("athlete", {}).get("displayName", "TBA")
                fights.append({"fighter1": f1, "fighter2": f2})
        # Show main card first (last entries in ESPN's list) + top prelims
        fights_display = list(reversed(fights[-5:])) + fights[:-5]
        if is_future:
            events.append({
                "name": name, "date": friendly_date,
                "location": location, "fights": fights_display[:10],
                "source": "espn",
            })
    return events


def fetch_espn_scoreboard():
    print("[1] ESPN scoreboard...")
    return parse_espn_events(fetch_json(ESPN_SCOREBOARD))


def fetch_espn_schedule():
    now = datetime.now(timezone.utc)
    start = now.strftime("%Y%m%d")
    m3 = now.month + 3
    y = now.year + (m3 - 1) // 12
    m = ((m3 - 1) % 12) + 1
    end = f"{y}{m:02d}01"
    url = f"{ESPN_SCHEDULE}?dates={start}-{end}&limit=20"
    print(f"[2] ESPN schedule ({start}→{end})...")
    return parse_espn_events(fetch_json(url))


# ── Source 3: UFC.com Cloudfront API ─────────────────────────────────────────

def fetch_ufc_api():
    print("[3] UFC upcoming API...")
    data = fetch_json(UFC_EVENTS_API)
    if not data:
        return []
    events = []
    items = data if isinstance(data, list) else data.get("events", data.get("items", []))
    for ev in items[:10]:
        name = ev.get("FightNightName") or ev.get("name") or ev.get("EventName", "")
        date_str = ev.get("StartTime") or ev.get("date") or ev.get("EventDate", "")
        location = ev.get("Location") or ev.get("Venue") or ev.get("location", "")
        fights = []
        for bout in ev.get("FightCard", ev.get("fights", []))[:8]:
            f1 = (bout.get("FighterA") or bout.get("fighter1") or {})
            f2 = (bout.get("FighterB") or bout.get("fighter2") or {})
            n1 = f1.get("Name") or f1.get("displayName") or (f1 if isinstance(f1, str) else "TBA")
            n2 = f2.get("Name") or f2.get("displayName") or (f2 if isinstance(f2, str) else "TBA")
            if n1 and n2 and n1 != "TBA":
                fights.append({"fighter1": n1, "fighter2": n2})
        try:
            dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
            friendly = dt.strftime("%B %-d, %Y")
            is_future = dt > datetime.now(timezone.utc)
        except Exception:
            friendly = date_str
            is_future = True
        if is_future and name:
            events.append({
                "name": name, "date": friendly,
                "location": location, "fights": fights,
                "source": "ufc-api",
            })
    return events


# ── Source 4: UFC.com HTML scrape ─────────────────────────────────────────────

def fetch_ufc_html():
    print("[4] UFC.com events page (HTML)...")
    html = fetch_html(UFC_EVENTS_PAGE)
    if not html:
        return []

    events = []

    # UFC embeds event data as JSON in a <script> tag — look for it
    json_match = re.search(r'window\.__INITIAL_STATE__\s*=\s*({.+?});\s*</script>', html, re.DOTALL)
    if not json_match:
        # Try next-data pattern
        json_match = re.search(r'<script id="__NEXT_DATA__"[^>]*>({.+?})</script>', html, re.DOTALL)

    if json_match:
        try:
            state = json.loads(json_match.group(1))
            # Dig for events list — structure varies by UFC site version
            ev_list = (
                state.get("events", {}).get("upcoming", []) or
                state.get("page", {}).get("events", []) or
                []
            )
            for ev in ev_list[:5]:
                name = ev.get("name", "")
                date_str = ev.get("date") or ev.get("startTime", "")
                location = ev.get("location", "")
                fights = []
                for bout in ev.get("fights", [])[:8]:
                    f1 = bout.get("fighter1", {}).get("name", "TBA")
                    f2 = bout.get("fighter2", {}).get("name", "TBA")
                    fights.append({"fighter1": f1, "fighter2": f2})
                try:
                    dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
                    friendly = dt.strftime("%B %-d, %Y")
                    is_future = dt > datetime.now(timezone.utc)
                except Exception:
                    friendly = date_str
                    is_future = True
                if is_future and name:
                    events.append({
                        "name": name, "date": friendly,
                        "location": location, "fights": fights,
                        "source": "ufc-html",
                    })
            if events:
                return events
        except Exception:
            pass

    # Fallback: parse fight names from HTML text patterns
    # Look for "vs." patterns near UFC event name spans
    event_blocks = re.findall(
        r'(UFC\s+(?:Fight Night|\d{3})[^<]{0,60}?).*?'
        r'((?:[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\s+vs\.\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+\n?){1,8})',
        html, re.DOTALL
    )
    for ev_name, fights_text in event_blocks[:3]:
        fight_pairs = re.findall(
            r'([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\s+vs\.\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)',
            fights_text
        )
        fights = [{"fighter1": f1, "fighter2": f2} for f1, f2 in fight_pairs[:8]]
        if fights:
            events.append({
                "name": ev_name.strip(),
                "date": "TBA", "location": "TBA",
                "fights": fights, "source": "ufc-html-fallback",
            })

    return events


# ── Merge & deduplicate ───────────────────────────────────────────────────────

def merge_events(all_sources):
    """
    Merge events from multiple sources. UFC.com data takes priority for
    fight cards (more complete). ESPN data is used for dates/locations.
    """
    merged = {}
    for ev in all_sources:
        # Normalize name as key (e.g. "UFC 327", "UFC Fight Night")
        key = re.sub(r'\s+', ' ', ev["name"]).strip().lower()
        key = re.sub(r'ufc fight night.*', 'ufc fight night', key)
        if key not in merged:
            merged[key] = ev.copy()
        else:
            existing = merged[key]
            # Take more fights if new source has more
            if len(ev["fights"]) > len(existing["fights"]):
                existing["fights"] = ev["fights"]
            # Take better location
            if not existing["location"] and ev["location"]:
                existing["location"] = ev["location"]
            # Take better date
            if existing["date"] == "TBA" and ev["date"] != "TBA":
                existing["date"] = ev["date"]

    return list(merged.values())


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    patch = "--patch" in sys.argv
    print("=" * 60)
    print("FightIQ — UFC Event Fetcher (multi-source)")
    print(f"Run at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    print()

    all_events = []

    sb = fetch_espn_scoreboard()
    if sb:
        print(f"  → {len(sb)} event(s) from scoreboard")
        all_events.extend(sb)

    sched = fetch_espn_schedule()
    if sched:
        print(f"  → {len(sched)} event(s) from schedule")
        all_events.extend(sched)

    ufc_api = fetch_ufc_api()
    if ufc_api:
        print(f"  → {len(ufc_api)} event(s) from UFC API")
        all_events.extend(ufc_api)

    ufc_html = fetch_ufc_html()
    if ufc_html:
        print(f"  → {len(ufc_html)} event(s) from UFC.com HTML")
        all_events.extend(ufc_html)

    if not all_events:
        print("\n⚠️  All sources failed. Check network or API changes.")
        print("Manual reference: https://www.ufc.com/events")
        return

    upcoming = merge_events(all_events)

    print(f"\n{'=' * 60}")
    print(f"VERIFIED UPCOMING EVENTS ({len(upcoming)} total)")
    print(f"{'=' * 60}\n")

    for i, ev in enumerate(upcoming, 1):
        src = ev.get("source", "?")
        print(f"  {i}. {ev['name']}  [{src}]")
        print(f"     Date:     {ev['date']}")
        print(f"     Location: {ev['location'] or 'TBA'}")
        if ev["fights"]:
            print(f"     Fights ({len(ev['fights'])}):")
            for f in ev["fights"]:
                print(f"       • {f['fighter1']} vs. {f['fighter2']}")
        else:
            print(f"     Fights:   TBA")
        print()

    if patch:
        patch_main_js(upcoming)


def patch_main_js(events):
    try:
        with open(MAIN_JS) as f:
            content = f.read()
    except FileNotFoundError:
        print(f"⚠️  main.js not found at {MAIN_JS}")
        return

    lines = ["const UPCOMING_EVENTS = ["]
    for i, ev in enumerate(events):
        sep = "," if i < len(events) - 1 else ""
        event_type = "ppv" if re.search(r'UFC \d{3}', ev["name"]) else "fight-night"
        lines.append(f"""  {{
    id: "evt{i+1}",
    name: {json.dumps(ev["name"])},
    type: "{event_type}",
    date: {json.dumps(ev["date"])},
    location: {json.dumps(ev["location"])},
    fights: {json.dumps(ev["fights"])}
  }}{sep}""")
    lines.append("];")
    new_block = "\n".join(lines)

    pattern = r'const UPCOMING_EVENTS\s*=\s*\[.*?\];'
    new_content, count = re.subn(pattern, new_block, content, flags=re.DOTALL)

    if count == 0:
        print("⚠️  Could not find UPCOMING_EVENTS in main.js.")
        return

    with open(MAIN_JS + ".bak", "w") as f:
        f.write(content)
    with open(MAIN_JS, "w") as f:
        f.write(new_content)

    print(f"✅ main.js patched with {len(events)} event(s).")
    print(f"   Backup: {MAIN_JS}.bak")


if __name__ == "__main__":
    main()
