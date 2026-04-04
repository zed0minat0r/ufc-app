# FightIQ — Nigel Audit v5
**Date:** 2026-04-04
**Auditor:** Nigel (Strict Auditor)
**Live Site:** https://zed0minat0r.github.io/ufc-app/
**Previous Audits:** v1: 6.0 | v2: 6.7 | v3: 7.2 | v4: 7.3

---

## Scoring Calibration
- 5.0 = average/basic | 6.0 = generic template | 7.0 = genuinely better than most (HIGH bar)
- 8.0 = user would choose over competitors | 9.0 = award-worthy

**Benchmark:** ESPN, UFC.com, Tapology

---

## What Changed Since v4 (7.3)

Two changes landed since v4:

1. **Dead code removed** — `ESPN_CDN` constant was defined at the top of `main.js` but never referenced anywhere in the codebase. It has been removed. Clean.

2. **sim-result-winner CSS rules merged** — Previously two split CSS rules covered `.sim-result-winner`. They have been collapsed into a single unified block at line 1038. A separate `.sim-result-winner .fighter-photo--md` rule at line 1844 remains correctly separated (it targets a child element, not the winner container itself). The merge did not break rendering.

**What did NOT change:** All four v4 Priority items remain unaddressed. The VALUE badge layout is still broken, the Bantamweight filter is still missing, Yakhyaev's `via.placeholder.com` is still the external dependency, and Topuria's weight class is still listed as Lightweight.

---

## v5 Checklist

| Check | Status |
|-------|--------|
| VALUE badge layout fixed (column flex → row) | NOT FIXED — `flex-direction: column` still at style.css:1153 |
| Bantamweight filter button present | NOT FIXED — no BW button in index.html |
| Yakhyaev via.placeholder.com removed | NOT FIXED — `PH_CDN + 'AY'` still at main.js:277 |
| Topuria weight class corrected | NOT FIXED — `weight: "Lightweight"` still at main.js:87 |
| ESPN_CDN dead code removed | FIXED — constant removed from main.js |
| sim-result-winner CSS merge working | FIXED — unified block renders correctly |

---

## Category Scores

### 1. Visual Design — 7.3/10

No change. The split CSS merge was a code hygiene fix that has no visible effect. The gold-accent event group headers, red/gold/dark design language, and hero banner remain the strongest visual elements.

**Active issues (unchanged from v4):**
- **Betting card VALUE badge is still layout-broken.** `.bet-card-header` has `flex-direction: column` (style.css line 1153). The VALUE/FAIR/FADE badge stacks full-width below the fighter matchup strip instead of sitting right-aligned in the same row. The badge now reads like a caption under a photo rather than an action indicator. This was Priority 1 in v4 and was not touched.

- **SVG fallback vs. rectangular photo container mismatch** — Fallback SVG is `120×120px`; CSS containers are `120×140px`, `80×96px`, `56×68px`. Yakhyaev (the only fighter without a local PNG) exposes this on every tab where his card appears.

- **Logo background is a rounded rectangle**, not an octagon. The SVG inside it has an octagon outline but the red background container is `border-radius: 6px`. A real octagon `clip-path` would take 5 minutes.

### 2. Mobile UX (375px) — 7.1/10

No change. The VALUE badge stacking is even worse at 375px — full-width orphaned below the tiny photo strip. The filter buttons centering fix from v3 remains in place. No regressions.

**Active issues (unchanged from v4):**
- VALUE badge column stacking amplifies the regression on narrow screens.
- Bantamweight filter still missing — Ewing and Estevam cannot be found by weight class.
- Betting card fighter photos at ≤480px (44×54px) add clutter without recognition value.

### 3. Features — 7.3/10

No change. Five functional tabs, fighter search, event grouping in Predictions and Betting. The simulator is deterministic but functional.

**Active issues (unchanged from v4):**
- **No Bantamweight filter.** Ethyn Ewing and Rafael Estevam have `weight: "Bantamweight"` in the database. They appear under "All" but no weight class filter surfaces them. This has been flagged in two consecutive audits.
- Events tab fight rows remain non-interactive (cursor: pointer in CSS, no click handler in JS).
- Simulator is deterministic — same two fighters always produce the same result. No randomness or variance in outcome.

### 4. Data Quality — 6.8/10

No change.

**Active bugs:**
- **Yakhyaev's image is `PH_CDN + 'AY'`** (main.js line 277). `PH_CDN = 'https://via.placeholder.com/120x120/1a1a2e/ffffff?text='`. This is a live external HTTP request to `https://via.placeholder.com/120x120/1a1a2e/ffffff?text=AY` every time the page loads and the Fighters tab or Predictions tab renders Yakhyaev. It is the sole remaining external dependency. He is on the co-main card of UFC Fight Night on April 4 — this is a prominent position.

- **Topuria's weight class is `"Lightweight", rank: "Champion"`** (main.js line 87-88). Ilia Topuria is the Featherweight champion. He has publicly announced intent to move to Lightweight but has not fought there. A UFC fan looking for the Featherweight champion under the FW filter will not find him. A UFC fan filtering by LW will find him listed as champion which is factually incorrect. Change to `weight: "Featherweight"`.

- **Women's Strawweight fighters listed as `"Strawweight"`** — Jandiroba and Ricci appear under the STR filter but are technically Women's Strawweight. The filter works (silent mismatch) but the label misleads.

### 5. Performance — 8.5/10

Up 0.1 from v4. `ESPN_CDN` dead code removed. The only remaining external dependency is the `via.placeholder.com` call for Yakhyaev. Everything else is local: three static files plus 43 fighter PNGs served from GitHub Pages. Essentially instant load.

`PH_CDN` is still defined and used (line 5 and line 277). `getFighterOrPlaceholder()` also uses it as a fallback for unknown fighter IDs (line 489). Removing the Yakhyaev placeholder would eliminate the live HTTP request entirely; `PH_CDN` could then be deleted too since no fighter in `FIGHTERS` would reference it.

### 6. Accessibility — 6.8/10

No change. The CSS merge and dead code removal have no accessibility impact.

**Remaining gaps (unchanged):**
- Filter buttons (`HW`, `LHW`, `MW`, etc.) have no `aria-label`. Screen readers announce abbreviations only.
- Simulator run button has `&#9654;` (right-pointing triangle) with no `aria-label`. Screen reader behavior is implementation-dependent — may announce "right-pointing triangle" or skip it.
- Fighter initials fallback divs have no `aria-hidden` — empty divs exposed to assistive technology.

### 7. Overall App Feel — 7.3/10

No change. The app looks and feels the same to a real user in v5 as it did in v4. The two fixes this round are invisible to users: one removes an unused JavaScript constant, the other cleans up a CSS comment structure. No user-visible improvement was shipped.

The app remains at a level where a UFC fan who finds it stays past 30 seconds — the hero banner, event grouping, and AI narratives are genuinely above average. But it has stalled. Two consecutive audits have logged the same four issues without resolution.

---

## Score History

| Audit | Date       | Score | Key Addition |
|-------|------------|-------|--------------|
| v1    | 2026-04-03 | 6.0   | Baseline — 5 tabs, static data |
| v2    | 2026-04-03 | 6.7   | Fighter photos (CDN), prob range widened, 40+ fighters in DB |
| v3    | 2026-04-04 | 7.2   | Hero banner with fighter photos, face-off layout, local images, AI narratives |
| v4    | 2026-04-04 | 7.3   | Predictions/Betting event grouping, fighter search, design consistency |
| v5    | 2026-04-04 | 7.3   | ESPN_CDN dead code removed, sim-result CSS merged (no user-visible change) |

---

## Overall Score: 7.3 / 10

Unchanged from v4. The two changes in v5 are invisible to users. No v4 priorities were addressed. The app is stalled at 7.3 — the same four issues that prevented 7.5 in v4 still prevent it now.

The path to 7.5 is the same as it was in v4: fix the VALUE badge layout, add the Bantamweight filter, remove the Yakhyaev external dependency, and correct Topuria's weight class. All four are small changes. Three of them are single-line edits.

---

## Top 3 Priorities for v6

### Priority 1: Fix Betting Card VALUE Badge Layout (CARRY-OVER — v4 P1)
`.bet-card-header` at style.css line 1148 has `flex-direction: column`. This pushes the VALUE/FAIR/FADE badge full-width below the fighter matchup strip. Restore horizontal layout: change `flex-direction` to `row`, give `.bet-card-names` `flex: 1` to absorb remaining space, and let the badge float right with `align-self: flex-start`. The fighter photos + names live in a flex column on the left; the badge is a fixed-width pill on the right. This is a regression from v3 that has now survived two audits.

### Priority 2: Add BW Filter + Fix Yakhyaev Image (CARRY-OVER — v4 P2)
Two single-line fixes:
- `index.html`: Add `<button class="filter-btn" data-filter="Bantamweight">BW</button>` to the `#fighter-filters` row. Ewing and Estevam are on the April 4 card and are unfindable by weight class filter.
- `main.js` line 277: Change `image: PH_CDN + 'AY'` to `image: ''`. Empty string triggers the inline SVG fallback in `getFighterImage()`. This eliminates the last external HTTP dependency. Once no fighter uses `PH_CDN`, the constant can be deleted (along with its use in `getFighterOrPlaceholder()` which can also switch to `''`).

### Priority 3: Correct Topuria's Weight Class (CARRY-OVER — v4 P3)
`main.js` line 87: Change `weight: "Lightweight"` to `weight: "Featherweight"`. Topuria is the Featherweight champion. He appears under the LW filter as "Champion" (wrong) and does not appear under the FW filter (wrong). A UFC fan looking for the current Featherweight champion cannot find him. One word change.

---

## Bonus Notes (Lower Priority)

- **`PH_CDN` constant** — Still defined at line 5. Once Yakhyaev's image and `getFighterOrPlaceholder()` are updated, this constant can be fully removed.
- **`getFighterOrPlaceholder()` fallback** — Line 489 still uses `PH_CDN + initials` for unknown fighter IDs. Changing to `''` makes the fallback use the SVG initials path instead of a network request.
- **Filter button aria-labels** — All abbreviated buttons need `aria-label` with full weight class name.
- **Simulator run button** — Add `aria-label="Run fight simulation"` to `#sim-run-btn`.
- **Events tab fight rows** — `cursor: pointer` in CSS but no click handler. Either remove the pointer cursor or add a handler that scrolls to the Predictions tab entry.
- **`section-badge.gold` duplicate rule** — Defined at style.css line 161 (background/color) and again at line 1695 (animation). Both apply correctly via cascade — not a bug, but the comment at line 1689 says "Pulsing live badge — only for ML MODEL badge" which implies this was intended as a separate feature addition. Consider consolidating into one rule for clarity.
