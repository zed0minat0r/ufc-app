# FightIQ — Nigel Audit v4
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

## What Changed Since v3 (7.2)

Six changes landed since v3:

1. **Predictions tab grouped by event** — A gold-accent section header (with event name, date, location, and PPV/Fight Night badge) now separates UFC Fight Night from UFC 327 fights. Clean and functional.

2. **Fighter search added to Fighters tab** — Text input filters cards in real time using `data-name` attributes. Works correctly. Good quality-of-life addition.

3. **Betting tab now grouped by event** — Mirrors the Predictions tab structure. Event headers appear above each `betting-grid`. Consistent with the Predictions experience.

4. **Fighter photos added to betting card headers** — Each bet-card now shows both fighter portraits side-by-side in the header. More visual than the old text-only header.

5. **Design consistency fixes** — `--card-bg` was undefined (now `#181818`); f2 win-probability bar was blue (now gold). Both were real bugs. Fixed correctly.

6. **Mobile polish** — Filter buttons center on 375px. Prediction event headers center on mobile. `pred-event-header` has gold left-border accent.

---

## Category Scores

### 1. Visual Design — 7.4/10

The gold left-border on `pred-event-header` is the strongest visual addition this round — it differentiates event groups cleanly without being heavy. The overall red/gold/dark design language is now internally consistent: no rogue blue values left in the active UI path.

**Issues:**
- **Betting card VALUE badge is layout-broken.** The `.bet-card-header` was changed to `flex-direction: column`, which means the VALUE/FAIR/FADE badge stacks as a full-width element below the fighter matchup row, left-aligned. The badge now looks like an orphaned label underneath the fighters rather than a prominent call-to-action. The original side-by-side layout (fight name left, badge right) was better. This is a regression introduced in this round.

- **SVG fallback is square, photo containers are rectangular.** `getFighterImage()` returns an SVG with `width='120' height='120'`, but the CSS containers are 120×140px (--lg), 80×96px (--md), and 56×68px (--sm). For fighters with missing photos the fallback renders a square clipped into a rectangle — initials appear off-center and the background square creates visible dead space. Yakhyaev (the only fighter on the April 4 card without a local photo) exposes this on every tab.

- **Logo remains a red square.** The SVG octagon + "IQ" text is a step up from the plain "U" in v1, but the red square background makes it look like a rounded rectangle app icon rather than a sports brand mark. An actual octagon polygon SVG shape as the background would take 10 minutes and make a clear difference.

### 2. Mobile UX (375px) — 7.1/10

Real improvements this round: filter buttons now center instead of left-aligning, event headers center in Predictions and Betting. These were visible rough edges in v3.

**Issues:**
- **Betting card fighter photos at 44×54px are barely visible.** At the 480px breakpoint the photos scale down to 44×54px — functional but so small they add clutter without adding recognition. At that size initials-only fallback would be cleaner. Consider hiding the header photos at ≤480px and relying on the fighter name in the odds rows instead.

- **VALUE badge column stacking is worse on mobile.** The regression from the column `flex-direction` is amplified at 375px: the badge goes full-width below the matchup, which on a narrow screen looks like a floating label under a photo strip. The old layout had the badge right-aligned in the same row — that was more scannable.

- **Bantamweight filter is still missing.** Ethyn Ewing and Rafael Estevam fight on the April 4 card but there is no Bantamweight filter button in `index.html`. Those are card fighters — users browsing by weight class can't find them under any filter except "All."

### 3. Features — 7.3/10

Fighter search and betting event grouping are solid additions. The app now has five fully functional, differentiated tabs. Simulator is deterministic.

**Issues:**
- **No Bantamweight filter** despite BW being the third fight on the April 4 card. This is the same oversight the Women's Flyweight/Strawweight filters were in v3. Easy fix: one `<button>` in index.html.

- **Events tab fight rows are not interactive.** Clicking a fight row in the Events tab does nothing. Even a simple scroll to the matching Predictions card (or a tab switch to Predictions) would make the Events tab a navigation entry point rather than a dead display.

- **Betting event grouping introduces a visual regression** (the VALUE badge layout) that undermines an otherwise good feature addition.

### 4. Data Quality — 6.8/10

**Active bug:** `./fighters/yakhyaev.png` does not exist — the code falls back to `PH_CDN + 'AY'` which is `https://via.placeholder.com/...`. This makes a live external HTTP request for the UFC Fight Night co-main card fighter. It is the last external dependency, and the UFC card fighter's spot is the worst place to have it visible.

**Data accuracy issues:**
- Ilia Topuria is listed as `weight: "Lightweight", rank: "Champion"`. Topuria won the Featherweight title and announced a move to Lightweight but has not yet fought there. His weight class should be "Featherweight" in the database.

- Virna Jandiroba and Tabatha Ricci are listed as `weight: "Strawweight"` in the fighter database but their scheduled bout is `"Women's Strawweight"` in the event data. Filtering by "STR" does find them because the filter matches `card.dataset.weight === "Strawweight"`, so this is a silent data inconsistency rather than a broken feature — but it means the STR filter label is misleading (it catches Women's Strawweight, not labeled as such).

- Joshua Van is listed as Flyweight "Champion" (record 11-0-0). The UFC 327 fight vs. Taira appears to be a Flyweight title fight. This seems plausible but warrants verification.

**Accepted:** Stats are manually curated. Abdul-Rakhman Yakhyaev has no headshot available from UFC.

### 5. Performance — 8.4/10

Essentially instant. Three static files (~3,097 lines total), zero external API calls on load (one via.placeholder.com request for Yakhyaev's absent photo is the only remaining external dependency). GitHub Pages serves everything locally including 43 fighter PNGs.

Minor: The `PH_CDN` constant and `ESPN_CDN` constant are both defined at the top of `main.js` but `ESPN_CDN` is never used anywhere in the codebase. Dead code.

### 6. Accessibility — 6.8/10

ARIA roles correctly implemented on tab system (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, `aria-labelledby` on panels). Focus visible styles use gold outline. Fighter photo `alt` attributes are correctly set.

**Remaining gaps:**
- Filter buttons use abbreviated labels (`HW`, `LHW`, `MW`, etc.) with no `aria-label` — a screen reader announces "HW" with no further context. `aria-label="Heavyweight"` on each button would fix this.
- The simulator run button contains a Unicode ▶ character (`&#9654;`) with no `aria-label`. Screen readers may announce "right-pointing triangle" or skip it entirely. Add `aria-label="Run fight simulation"`.
- Fighter initials fallback divs (`.fight-faceoff-initials`, `.hero-fighter-initials`) have no `aria-hidden` or accessible label — a screen reader will encounter empty divs with no content.

### 7. Overall App Feel — 7.3/10

The app now has clear, consistent structure across Predictions and Betting tabs — event grouping with gold headers, AI narratives, fighter portraits. This is the level where a UFC fan who finds the site stays past the first 30 seconds. The hero banner with face-off photos and probability bar is still the best single element.

**What prevents 7.5+:**
- The VALUE badge regression in the Betting tab is the sharpest rough edge. It was a better layout before.
- Yakhyaev's via.placeholder.com request is the last external dependency, and he's on the main card — it's visible on load.
- Missing Bantamweight filter for two card fighters.
- The app still lacks any way to click into a fight for deeper analysis — every interaction is read-only browsing, not exploration.

---

## Score History

| Audit | Date       | Score | Key Addition |
|-------|------------|-------|--------------|
| v1    | 2026-04-03 | 6.0   | Baseline — 5 tabs, static data |
| v2    | 2026-04-03 | 6.7   | Fighter photos (CDN), prob range widened, 40+ fighters in DB |
| v3    | 2026-04-04 | 7.2   | Hero banner with fighter photos, face-off layout, local images, AI narratives |
| v4    | 2026-04-04 | 7.3   | Predictions/Betting event grouping, fighter search, design consistency |

---

## Overall Score: 7.3 / 10

Up from 7.2. The improvements this round are incremental polish — event grouping in Betting, fighter search, design consistency fixes. These are correct changes but none are dramatic. The VALUE badge layout regression in the Betting tab partially offsets the gains. The path to 7.5 runs through fixing that badge, closing the Bantamweight filter gap, and removing the last external dependency.

---

## Top 3 Priorities for v5

### Priority 1: Fix Betting Card VALUE Badge Layout
The `.bet-card-header` change to `flex-direction: column` pushes the VALUE/FAIR/FADE badge below the matchup row as a full-width left-aligned element. This is a regression. Restore the horizontal layout: use `flex-direction: row`, with the matchup on the left taking available space (`flex: 1`) and the badge right-aligned (`align-self: flex-start`). The fighter photos and names should sit in a flex column on the left; the badge floats right.

### Priority 2: Add Bantamweight Filter Button + Fix Yakhyaev Photo
Two issues, similar effort:
- Add `<button class="filter-btn" data-filter="Bantamweight">BW</button>` to the filter row in `index.html`. Ewing and Estevam are on the card and completely unfiltered.
- Replace `image: PH_CDN + 'AY'` for Yakhyaev with the inline SVG fallback used by all other fighters without local photos: `image: ''` (empty string triggers the SVG fallback in `getFighterImage()`). Eliminates the last external dependency.

### Priority 3: Correct Topuria's Weight Class
`ilia-topuria` has `weight: "Lightweight"` — he's the former Featherweight champion making his first move to Lightweight. The database should reflect his actual UFC classification. Change to `weight: "Featherweight"` (where he holds the title) or `weight: "Lightweight"` only after his first LW fight. Current state creates confusion in the Fighters tab filter (he won't appear under FW where fans look for him).

---

## Bonus Notes (Lower Priority)

- **Dead code:** `ESPN_CDN` constant defined at line 5 of `main.js`, never referenced anywhere. Remove it.
- **Inconsistent indentation in `renderPredictions()`:** The inner `forEach` callback at line 684 has 4-space indent then inner variables jump to 4-space (`const pred = predictFight...` is indented to 4 while the outer block is at 4). Minor, doesn't affect function but signals hasty merge.
- **Filter button aria-labels:** All filter buttons (`HW`, `LHW`, etc.) need `aria-label` with full weight class name for screen reader usability.
- **Simulator run button:** Add `aria-label="Run fight simulation"` to the `#sim-run-btn`.
- **Events tab fight rows:** Add click handler to navigate to corresponding Predictions card or switch tab to Predictions for the fight. Currently rows are marked `cursor: pointer` in CSS but do nothing on click.
