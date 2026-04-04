#!/usr/bin/env python3
"""
FightIQ — UFC Event Fetcher
Pulls upcoming UFC events from ESPN API and optionally patches main.js.

Usage:
  python3 fetch-events.py           # Print verified events
  python3 fetch-events.py --patch   # Also update main.js UPCOMING_EVENTS
"""

import json
import sys
import re
import urllib.request
import urllib.error
from datetime import datetime, timezone

ESPN_SCOREBOARD = "https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard"
ESPN_SCHEDULE   = "https://site.api.espn.com/apis/site/v2/sports/mma/ufc/schedule"


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        print(f"  HTTP {e.code} from {url}")
        return None
    except Exception as e:
        print(f"  Error fetching {url}: {e}")
        return None


def parse_espn_events(data):
    events = []
    if not data:
        return events

    # ESPN schedule returns {"events": [...]} or {"leagues": [...]}
    raw_events = data.get("events", [])

    for ev in raw_events:
        name = ev.get("name", "")
        short = ev.get("shortName", name)
        date_str = ev.get("date", "")
        venue = ev.get("competitions", [{}])[0].get("venue", {})
        location = venue.get("fullName", "") or venue.get("address", {}).get("city", "")

        # Parse date
        try:
            dt = datetime.fromisoformat(date_str.replace("Z", "+00:00"))
            friendly_date = dt.strftime("%B %-d, %Y")
            future = dt > datetime.now(timezone.utc)
        except Exception:
            friendly_date = date_str
            future = True

        # Get competitors (main event fighters)
        fights = []
        for comp in ev.get("competitions", []):
            competitors = comp.get("competitors", [])
            if len(competitors) >= 2:
                f1 = competitors[0].get("athlete", {}).get("displayName", "TBA")
                f2 = competitors[1].get("athlete", {}).get("displayName", "TBA")
                fights.append({"fighter1": f1, "fighter2": f2})

        events.append({
            "name": short or name,
            "date": friendly_date,
            "location": location,
            "future": future,
            "fights": fights[:6],  # cap at 6
        })

    return events


def try_schedule_endpoint():
    """Try the ESPN schedule endpoint with a date range."""
    now = datetime.now(timezone.utc)
    # Build URL for next 90 days
    start = now.strftime("%Y%m%d")
    end_dt = datetime(now.year + (1 if now.month > 9 else 0),
                      ((now.month + 3 - 1) % 12) + 1, 1)
    end = end_dt.strftime("%Y%m%d")
    url = f"{ESPN_SCHEDULE}?dates={start}-{end}&limit=10"
    print(f"  Trying: {url}")
    return fetch(url)


def main():
    patch = "--patch" in sys.argv
    print("=" * 60)
    print("FightIQ — UFC Event Fetcher")
    print(f"Run at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S ET')}")
    print("=" * 60)

    events = []

    # Try scoreboard first
    print("\n[1] Fetching ESPN scoreboard...")
    data = fetch(ESPN_SCOREBOARD)
    if data:
        events = parse_espn_events(data)

    # Try schedule if scoreboard came back empty
    if not events:
        print("[2] Scoreboard empty — trying schedule endpoint...")
        data = try_schedule_endpoint()
        if data:
            events = parse_espn_events(data)

    if not events:
        print("\n⚠️  No events returned from ESPN API.")
        print("   ESPN may have rate-limited or changed their endpoint.")
        print("   Manual verification needed at: https://ufc.com/events")
        print("\nCurrent hardcoded events in main.js:")
        show_current_events()
        return

    # Filter to future events only
    upcoming = [e for e in events if e["future"]]

    print(f"\n✅ Found {len(upcoming)} upcoming UFC event(s):\n")
    for i, ev in enumerate(upcoming, 1):
        print(f"  {i}. {ev['name']}")
        print(f"     Date:     {ev['date']}")
        print(f"     Location: {ev['location'] or 'TBA'}")
        if ev["fights"]:
            print(f"     Fights:")
            for f in ev["fights"]:
                print(f"       • {f['fighter1']} vs. {f['fighter2']}")
        print()

    if patch:
        patch_main_js(upcoming)


def show_current_events():
    try:
        with open("/tmp/ufc-app/main.js") as f:
            content = f.read()
        # Find event names and dates
        names = re.findall(r'name:\s*"([^"]+UFC[^"]*)"', content)
        dates = re.findall(r'date:\s*"([^"]+202[0-9][^"]*)"', content)
        for n, d in zip(names, dates):
            print(f"  • {n} — {d}")
    except Exception as e:
        print(f"  Could not read main.js: {e}")


def patch_main_js(events):
    """
    Replaces the UPCOMING_EVENTS array in main.js with fresh data.
    Backs up the original first.
    """
    try:
        with open("/tmp/ufc-app/main.js") as f:
            content = f.read()
    except FileNotFoundError:
        print("⚠️  main.js not found at /tmp/ufc-app/main.js")
        return

    # Build JS array
    lines = ["const UPCOMING_EVENTS = ["]
    for i, ev in enumerate(events):
        fights_js = json.dumps(ev["fights"])
        sep = "," if i < len(events) - 1 else ""
        event_type = "ppv" if re.search(r'UFC \d{3}', ev["name"]) else "fight-night"
        lines.append(f"""  {{
    id: "evt{i+1}",
    name: {json.dumps(ev["name"])},
    type: "{event_type}",
    date: {json.dumps(ev["date"])},
    location: {json.dumps(ev["location"])},
    fights: {fights_js}
  }}{sep}""")
    lines.append("];")
    new_block = "\n".join(lines)

    # Replace existing UPCOMING_EVENTS block
    pattern = r'const UPCOMING_EVENTS\s*=\s*\[.*?\];'
    new_content, count = re.subn(pattern, new_block, content, flags=re.DOTALL)

    if count == 0:
        print("⚠️  Could not locate UPCOMING_EVENTS in main.js. No changes made.")
        return

    # Write backup
    with open("/tmp/ufc-app/main.js.bak", "w") as f:
        f.write(content)

    with open("/tmp/ufc-app/main.js", "w") as f:
        f.write(new_content)

    print(f"✅ main.js patched with {len(events)} event(s).")
    print("   Backup saved to main.js.bak")


if __name__ == "__main__":
    main()
