# FightIQ — Nigel Audit Report
**Date:** 2026-04-03
**Auditor:** Nigel (Strict Scoring Mode)
**URL:** https://zed0minat0r.github.io/ufc-app/

---

## Overall Score: 6.1 / 10

Scoring anchor: 5.0 = average/basic web app, 6.0 = generic template, 7.0 = genuinely better than most (high bar), 8.0 = user would choose over competitors.

FightIQ sits just above a generic template. It has a coherent dark theme, 5 working tabs, and a functional prediction engine. But from a real user's perspective, the core promise — "AI-powered UFC predictions" — is undermined by static hardcoded data, no live results, a single stale event, and a prediction model that is simply arithmetic on hardcoded stats. A UFC fan would use it once, recognize it has no real data, and leave.

---

## Category Scores

| Category | Score | Notes |
|---|---|---|
| Visual Design | 6.5 | Clean dark theme, gold accents, Inter font. Consistent system. Cards feel generic though — no real visual identity beyond the color palette. |
| Mobile UX (375px) | 6.0 | Tabs scroll horizontally (correct), grids collapse to 1-col (correct). Hero banner looks OK. Fight rows on small screens hide weight class which is acceptable. Simulator dropdowns stack properly at 480px. BUT: tab buttons at 13–14px with 10–14px padding are tight targets on 375px. Hamburger nav works. No major breakages. |
| Features | 5.5 | 5 tabs (Events, Predictions, Simulator, Betting, Fighters). Simulator is interactive. Betting tab shows model edge vs book. These are good ideas. But predictions only work for the ~30 fighters in the hardcoded list — the Events tab shows 6 fights by name strings (e.g., "Kai Kamaka III") that don't exist in the FIGHTERS object, so predictions and betting tabs render empty for those fights. |
| Data Quality | 4.5 | Single event hardcoded: UFC Fight Night April 4, 2026 with 6 prelim-only fights, no main event tier set, no weight classes set. The fight objects use `fighter1`/`fighter2` keys in UPCOMING_EVENTS but the rendering code looks for `fight.f1`/`fight.f2` — so `getFighterOrPlaceholder` falls back to generic placeholder stats for all 6 fights. Fights display placeholder data throughout. Hero banner shows a prelim fight (Kamaka vs Hope) as "Next Main Event." Records for several fighters appear stale or incorrect (Conor McGregor as Welterweight "22-6-0", Ilia Topuria listed as Lightweight Champion with old record). No fight card structure (no main event, no co-main). No last-updated timestamp. |
| Performance | 7.0 | Pure HTML/CSS/JS, no build step, no frameworks, no external API calls at runtime. Loads fast. Animations are CSS-based. Google Fonts is the only network dependency. No lazy loading needed at this scale. |
| Accessibility | 5.0 | No `aria-label` on tabs (they are `<button>` elements which is correct, but no roles for tab panels). Hamburger has `aria-label="Menu"` (good). Color contrast: gold (#c9a84c) on dark (#181818) may fail WCAG AA at small sizes. Grey (#888) text on dark fails contrast. No `alt` on SVG favicon. No skip-to-content link. No focus-visible styles visible in CSS for most interactive elements. |
| Overall App Feel | 6.0 | Feels like a polished starter template with broken data. The visual layer is competent but the actual functionality is hollow — a real user clicking through sees generic placeholder percentages, empty prediction cards, and a hero banner that misidentifies the main event. The "LIVE DATA" badge on Events is misleading since data is hardcoded. |

---

## Critical Bugs Found

### Bug 1: fighter1/fighter2 vs f1/f2 key mismatch
**File:** main.js, UPCOMING_EVENTS array (line ~120) vs renderEvents/renderPredictions/renderBetting
- UPCOMING_EVENTS stores fights with keys `fighter1` and `fighter2`
- All render functions access `fight.f1` and `fight.f2`
- Result: `getFighterOrPlaceholder` is always called with `undefined`, generating placeholder stats for every fight row
- Predictions tab renders 0 prediction cards (requires both fighters to be in ALL_FIGHTERS via exact key lookup)
- Betting tab similarly renders 0 cards
- Hero banner renders correct event metadata but wrong fighter data

### Bug 2: No main event tier assigned
- All 6 fights in the event have no `tier` field
- Fight badges all show "PRELIM" by default
- Hero banner labels a prelim undercard fight as "Next Main Event"

### Bug 3: Fight weight class missing
- All fight objects lack a `weight` field
- Fight rows show blank weight class column
- Prediction cards show blank weight class

---

## Top 3 Priorities

### Priority 1: Fix the f1/f2 key mismatch (data integrity)
The entire app's core functionality — predictions, betting analysis — is broken because fight data uses `fighter1`/`fighter2` but the render code expects `f1`/`f2`. Fix the UPCOMING_EVENTS data to use `f1`/`f2` keys, AND populate those with valid fighter IDs from the FIGHTERS/EXTRA_FIGHTERS objects. This single fix would make predictions and betting tabs actually render content.

### Priority 2: Add fight card structure (tiers + weight classes)
Every fight needs `tier` ("main", "co-main", "prelim") and `weight` ("Lightweight", "Welterweight", etc.) populated. Without this, the event card looks like an undifferentiated list of names with no context. The main event should be the first fight with `tier: "main"` so the hero banner shows the right matchup.

### Priority 3: Replace "LIVE DATA" badge with honest framing
The section badge says "LIVE DATA" but data is hardcoded static JavaScript. Either replace with "SCHEDULED" or "UPCOMING" badge, or implement actual data fetching. A UFC fan who sees "LIVE DATA" and then finds stale/wrong information will immediately distrust the entire app. Honest framing ("Model predictions based on historical stats") builds more credibility than false claims.

---

## Additional Issues (Lower Priority)

- **Conor McGregor listed as Welterweight "Unranked"** — outdated, he is retired/inactive as of 2026
- **Ilia Topuria listed as Lightweight Champion** — he won the Featherweight belt, moved to Lightweight later; record may be stale
- **No search or filter on Fighters tab** — 15+ cards with no way to filter by weight class
- **Simulator uses `alert()`** for same-fighter validation — should be inline UI error
- **Prediction probability is capped at 25–75%** — makes every fight look close regardless of actual skill gap; a 25% floor is unrealistic
- **"LIVE DATA" badge pulses via CSS animation** — draws attention to a misleading label
- **No empty state messaging** — when predictions/betting render 0 cards (due to the key bug), user sees a blank panel with no explanation
- **Betting tab "book odds" are derived from the model itself** (bookF1Prob is model prob * 0.9 + 0.05) — not real odds; this is circular and should be disclosed
- **No favicon for actual browsers** — SVG data URI favicon is functional but minimal
- **`fight.f2` key used in renderEvents but `fighter2` stored in data** — fight-weight column also blank because `fight.weight` undefined

---

## What's Working Well

- Dark theme is cohesive and readable
- Mobile breakpoints are thoughtfully implemented
- Tabs + hamburger nav work correctly
- CSS animations add life without being distracting
- Fighter stat cards in the Fighters tab look genuinely good
- Simulator UI layout is clean and functional in isolation
- Betting edge concept (model vs implied) is the right idea
- Disclaimer and "for entertainment only" framing is appropriate

---

*Audit complete. Score: 6.1/10.*
