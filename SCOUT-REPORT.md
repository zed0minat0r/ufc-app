# FightIQ — Scout Report: Competitor UI/UX Research
**Date:** April 4, 2026  
**Agent:** Scout  
**Scope:** UI/UX only — no data or backend changes

---

## Executive Summary

FightIQ has a strong dark-premium foundation (black/red/gold palette, Inter typography, clean card system) that rivals the best MMA prediction apps. However, research across five competitor platforms reveals clear, actionable gaps in: fight probability visualization depth, fighter profile richness, simulator interactivity, betting-odds UX, and mobile navigation. All recommendations below are purely UI/UX — no data pipeline changes required.

---

## Competitor Analysis

### 1. ESPN MMA (espn.com/mma)

**Observed Patterns:**
- Tiered content hierarchy: hero story → ranked cards → news feed. Visual weight descends intentionally.
- Multi-level navigation: sport selector → sub-nav tabs (Schedule, Fightcenter, Rankings, Champions). Clean separation of concerns.
- Light mode default with dark mode behind feature flag — suggests dark mode is a premium differentiator.
- "Manage Favorites" personalization: users bookmark fighters/events, persistent across sessions.
- Consistent breakpoints: mobile (≤767px) single column, tablet (768–1023px) two column, desktop (1024+) three column.
- Schema markup and screen-reader support baked in from the start.

**Gaps FightIQ can address:**
- ESPN has no fight probability model — FightIQ's `predictFight()` is a genuine differentiator ESPN does not offer.
- ESPN's fight cards use text-heavy rows with minimal visual drama. FightIQ's hero-banner and faceoff layouts already outperform this.

---

### 2. Tapology (tapology.com)

**Observed Patterns:**
- Per-fight prediction builder: users pick winner + method of victory + round. Results tracked post-event. This creates **social engagement loops** that FightIQ lacks.
- Event pages organize fights into tiers with visual distinction (main event vs prelims), similar to FightIQ's current `.fight-row.main-event` / `.fight-row.co-main-event` split — but Tapology adds **community pick percentages** next to each fight (e.g., "64% picked Moicano").
- Fighter profile pages include: all bouts with results, stats table, forum posts, rankings by promotion.
- "Trending" fighters and fights surfaced on homepage — recency/popularity signals drive discovery.
- Color scheme: dark navy/charcoal with red highlights — similar to FightIQ but uses navy for depth.
- Table-driven stats pages (not cards) for dense data — efficient on mobile with horizontal scroll.

**Gaps FightIQ can address:**
- Tapology's fight cards feel utilitarian/dated. FightIQ's card system with `.fight-faceoff` layout is visually superior.
- Community pick % display (even simulated/model-only) would add authority to each prediction card.

---

### 3. UFC Stats (ufcstats.com)

**Observed Patterns:**
- Pure data-table aesthetic: white background, minimal styling, stat columns sortable by click.
- No visual hierarchy for key stats — everything treated equally. Overwhelming for casual fans.
- Fighter profile has: record table, striking stats per fight, grappling stats per fight. Very data-dense.
- No images, no color coding of good/bad stats, no comparison mode.

**Gaps FightIQ can address:**
- UFC Stats is the "raw data" reference. FightIQ can own the "interpreted data" niche by translating the same numbers into visual context — e.g., color-coding high `slpm` as red/hot, low `strAcc` as grey/cold.
- The `.fighter-card` system in FightIQ already does this better — it needs to go further with contextual color gradients.

---

### 4. MMA Fight Sim (mmafightsim.com) — Direct Competitor

**Observed Patterns:**
- Dark black background (`#0a0a0a`) with **gold** (`#D4AF37`) as primary accent — nearly identical to FightIQ's color system.
- Uses **"Orbitron"** font for headings — adds sci-fi/esports energy. FightIQ uses Inter throughout which is cleaner but less dramatic for hero states.
- Fighter stat bars use **letter grades (S+, S, A, B, C)** with color coding per tier — gold for S+, red for S, orange for A, purple for B, blue for C. This is highly legible and gamified.
- Simulation results: winner name displayed at `text-6xl` with pulse animation and gold color. Very high-impact.
- Win probability shown as two large percentages flanking a vertical divider — clean split-screen format.
- **Stat categories** organized into: Striking, Grappling, Physical, Tactical. Each has sub-stats with individual letter grades and gradient fill bars.
- Fighter selector includes **weight class filter dropdown** — essential for a 40+ fighter roster.
- Fight duration and preparation pills (toggle states) add simulation depth.
- Animated fade-in on results at `0.5s ease-out`.

**FightIQ gaps vs MMA Fight Sim:**
- `sim-result` in FightIQ shows simple stats rows. MMA Fight Sim shows a full per-category breakdown with letter grades.
- FightIQ's `sim-select` dropdowns are unstyled browser defaults. MMA Fight Sim has custom-styled, dark-themed dropdowns with glow states.
- FightIQ has no winner reveal animation — just a static render. The pulse + large winner name is a key engagement moment.
- No weight class filter on FightIQ's simulator dropdown — with 40+ fighters, scrolling the full list is poor UX.

---

### 5. Polymarket UFC (polymarket.com/predictions/ufc)

**Observed Patterns:**
- Each fight is a **prediction market card** with: fighter names, event badge, trading volume, 24h volume, liquidity, and time-remaining countdown.
- **Win probability displayed as a single large percentage** (60%, 55%, 91%) centered on the card — extremely high visual priority. No bar needed — the number alone is the message.
- Supports both light and dark themes via `data-theme` attribute on `<html>`.
- Sort controls: Trending, Liquidity, Volume, Newest, Ending Soon, Competitive. Lets users find the fight they care about instantly.
- Topic tags (Sports → UFC → Games) create a browsable taxonomy.
- Status filters: Active, Resolved, All. Lets users review past predictions.

**FightIQ gaps vs Polymarket:**
- FightIQ's `win-prob-pct` is 13px/800 weight in a sidebar. Polymarket's is the headline of the card. Consider making the probability percentage much larger on `pred-card` — e.g., 36–42px bold.
- FightIQ has no sort/filter on the Predictions tab. With multiple events and many fights, a filter by confidence or method would improve discoverability.
- FightIQ predictions are always "Upcoming" — adding a "Resolved" state (past events with model accuracy tracking) would add credibility.

---

### 6. BestFightOdds (bestfightodds.com)

**Observed Patterns:**
- Horizontal table comparing moneyline odds across 8+ sportsbooks side by side — the gold standard for odds comparison UX.
- **Movement arrows** (▲▼) in green/red next to each odds value — instant visual signal of line movement.
- Odds format toggle: American / Decimal / Fractional — single setting persists globally.
- Props sections collapse/expand, reducing cognitive load on initial view.
- Event-level grouping with date headers.
- Auto-refresh toggle for real-time updates.
- Fighter names are clickable links to deeper profiles.

**FightIQ gaps vs BestFightOdds:**
- FightIQ's `betting-container` renders implied odds but has no visual differentiation between strong model edges and near-50/50 fights.
- Adding a visual "edge indicator" (e.g., a green/red bar or directional arrow) next to each implied odd would instantly communicate which picks the model is most confident in.
- No prop-style collapsible sections — all betting content is flat. Collapsible sections by event or confidence tier would reduce scroll.

---

### 7. StatsFight / Live Analytics Apps

**Observed Patterns:**
- **G-Fight Scale**: Real-time win probability gauge that updates during fights — momentum indicator.
- **AI-Scorecard**: Per-round fighter analytics comparison engine.
- **Course of Fight**: Visual graph showing strike intensity + position over time.
- Primary blue (`#405cbf`) and orange-red gradient for CTAs — professional/analytical feel.
- Fighter photo cards with 24px border-radius and heavy box shadows (`0px 0px 40px rgba(64,92,191,0.24)`).
- Carousel navigation for multi-feature browsing.
- App Store / Google Play CTAs prominent — mobile-first ambition.

**FightIQ gaps vs StatsFight:**
- StatsFight's photo cards have significantly deeper shadow treatment than FightIQ's `hero-fighter-photo` (`border: 2px solid rgba(255,255,255,0.1)` only). Adding a glow shadow keyed to fighter corner color (red left, gold right) would add drama.
- No round-by-round or momentum visualization in FightIQ — out of scope for static model, but a "predicted round distribution" donut chart per fight would be a compelling addition.

---

## Prioritized Recommendations for FightIQ

### Priority 1 — HIGH IMPACT, LOW EFFORT

#### 1A. Enlarge Win Probability Numbers on Prediction Cards
- **Current:** `.win-prob-pct` is `13px / font-weight: 800` in a side column.
- **Recommendation:** Make the win probability the card's headline. Display the leading fighter's probability at 40–48px bold gold/red, centered above the bar. The narrative text supports it — the number should be unmissable.
- **Reference:** Polymarket displays probabilities at ~2.5rem centered on each market card as the primary signal.
- **CSS to update:** `.win-prob-pct`, add a new `.win-prob-hero` class for the dominant fighter.

#### 1B. Custom-Styled Simulator Dropdowns with Weight Class Filter
- **Current:** `sim-select` is an unstyled `<select>` — jarring against the dark premium theme.
- **Recommendation:** Style with `background: var(--card2)`, `border: 1px solid var(--border)`, `color: var(--white)`, `border-radius: 8px`, `padding: 10px 14px`. Add a weight class filter `<select>` above each fighter dropdown to filter the options list — critical UX given 40+ fighters.
- **CSS to update:** `.sim-select`, `.sim-select-wrap`.
- **JS to update:** `populateSimSelects()` — add filter dropdown that calls `sel.innerHTML` with filtered subset.

#### 1C. Animated Winner Reveal in Simulator
- **Current:** `sim-result-winner` renders statically with no entrance animation.
- **Recommendation:** Add a `.sim-winner-reveal` CSS animation — scale from 0.8 to 1.0 + fade in over 0.4s with a brief pulse glow on the winner's card. Winner name should render at ~36px bold gold (currently implied but visually underwhelming).
- **CSS to add:** `@keyframes winnerPulse` with `box-shadow` glow using `var(--gold)` then fading.
- **Reference:** MMA Fight Sim uses `pulse 2s infinite` on winner name with gold color at `text-6xl`.

---

### Priority 2 — HIGH IMPACT, MODERATE EFFORT

#### 2A. Confidence-Keyed Color on Betting Cards
- **Current:** All betting rows in `betting-container` render identically regardless of model confidence.
- **Recommendation:** Add a left-border or background tint keyed to confidence tier:
  - `confidence >= 25`: green left-border + subtle green tint (`rgba(46,204,113,0.06)`)
  - `confidence 12–24`: gold left-border
  - `confidence < 12`: no accent (grey border as now)
- **CSS to add:** `.bet-row--strong`, `.bet-row--moderate`, `.bet-row--lean` modifier classes.
- **JS to update:** The betting render function — add class assignment based on `pred.confidence`.

#### 2B. Fighter Profile Stat Color-Coding (Hot/Cold Scale)
- **Current:** `.fighter-card` displays stats as plain numbers. `slpm: 7.9` and `slpm: 3.6` look identical in style.
- **Recommendation:** Apply a contextual color scale to displayed stat values. High volume/accuracy = warm (red/orange), low = cool (grey/blue). Thresholds:
  - `slpm >= 6`: `color: var(--red-bright)`
  - `slpm 4–5.9`: `color: var(--white)`
  - `slpm < 4`: `color: var(--grey)`
  - `koPct >= 60`: `color: var(--red-bright)`
  - `subAvg >= 1.5`: `color: #3498db`
- **JS to update:** Fighter card render function — wrap stat values in `<span class="stat-hot|stat-warm|stat-cold">` based on threshold.
- **CSS to add:** `.stat-hot`, `.stat-warm`, `.stat-cold` color classes.

#### 2C. Sort/Filter Controls on Predictions Tab
- **Current:** `predictions-container` renders all fights in event order with no user control.
- **Recommendation:** Add a filter bar above the `predictions-grid`:
  - Sort by: "Confidence" (high → low) | "Event Order" (default) | "Method: KO" | "Method: Sub" | "Method: Decision"
  - These can be simple `<button class="filter-btn">` elements reusing the existing `.filter-btn` / `.fighter-filters` pattern already used on the Fighters tab.
- **JS to add:** A `sortPredictions(mode)` function that re-renders the grid sorted/filtered by the selected mode. Re-use `renderPredictions()` logic with a sort step.
- **CSS reuse:** `.fighter-filters` and `.filter-btn` styles — no new CSS needed.

---

### Priority 3 — MEDIUM IMPACT, MODERATE EFFORT

#### 3A. Collapsible Prelim Rows on Event Cards
- **Current:** All fights in `.fight-list` render expanded by default. On mobile, events with 8 fights are very long.
- **Recommendation:** Prelim fights (`.fight-badge.prelim`) should be collapsed behind a "Show Prelims (4)" toggle button. Main card and co-main always visible.
- **Pattern reference:** BestFightOdds uses expand/collapse for props sections. Tapology collapses undercard fights.
- **JS to add:** Toggle listener in `renderEvents()` — add a `data-prelim-toggle` button that toggles `.fight-row.prelim-row` visibility with a `max-height` CSS transition.
- **CSS to add:** `.fight-row.prelim-row { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }` + `.prelim-row.visible { max-height: 80px; }`.

#### 3B. "Pick Confidence" Tier Badge on Prediction Cards
- **Current:** `pred-pick` shows confidence as `"${Math.round(pred.confidence)}% conf."` in small grey text.
- **Recommendation:** Replace with a visual badge:
  - `>= 25%`: `🔥 STRONG LEAN` (red badge using `.section-badge` style)
  - `12–24%`: `MODERATE` (gold badge)
  - `< 12%`: `COIN FLIP` (grey badge)
- **CSS reuse:** `.section-badge` and `.section-badge.gold` already exist. Add `.section-badge.grey`.
- **JS to update:** `renderPredictions()` — replace the conf% text with badge HTML.

#### 3C. Hero Banner Countdown Timer
- **Current:** `hero-banner` shows the next event's date as static text via `.hero-event-meta`.
- **Recommendation:** Add a live countdown (`DD HH MM SS`) below the event name using `setInterval`. Creates urgency and a "live" feel.
- **Pattern reference:** Polymarket shows "Ends in about 23 hours" on each market card. Countdown timers are a proven engagement hook on prediction platforms.
- **JS to add:** `startHeroCountdown(eventDateStr)` — parses event date, updates a `.hero-countdown` element every second.
- **CSS to add:** `.hero-countdown` with monospace font, gold color, letter-spacing, and `font-size: 14px`.

---

### Priority 4 — LOWER IMPACT OR HIGHER EFFORT

#### 4A. Bottom Navigation Bar (Mobile)
- **Current:** Mobile uses a hamburger menu that expands a dropdown nav. Standard but less ergonomic.
- **Recommendation:** At ≤480px, replace the hamburger with a fixed bottom nav bar (5 icons + labels: Events, Predictions, Simulator, Betting, Fighters). This is the dominant pattern in MMA Hub app design and modern sports apps.
- **Pattern reference:** MMA Hub app UX case study identifies bottom nav as the primary mobile pattern for 5-section apps.
- **CSS to add:** `.bottom-nav { position: fixed; bottom: 0; width: 100%; display: flex; ... }` inside `@media (max-width: 480px)`.
- **Note:** Requires hiding the `.hamburger` and `.tabs-wrap` on mobile and keeping bottom nav in sync with tab state.

#### 4B. Method of Victory Donut/Arc Chart on Prediction Cards
- **Current:** `.method-grid` shows three boxes with `koPct`, `subPct`, `decPct` as plain numbers.
- **Recommendation:** Replace or supplement with an SVG arc/donut chart. Three arcs (red=KO, blue=Sub, grey=Decision) animated on render. The dominant method's arc is full-width; others proportional.
- **Pattern reference:** Sports analytics apps consistently use arc charts for "how this fight ends" — more legible at a glance than a 3-number grid.
- **JS to add:** `buildMethodDonut(koPct, subPct, decPct)` — returns an inline SVG string. Called inside `renderPredictions()` and `runSimulator()`.
- **CSS to add:** `.method-donut` sizing/positioning styles.

#### 4C. Fighter Comparison Mode on Fighter Cards
- **Current:** `.fighter-card` shows each fighter in isolation. No head-to-head stat overlay.
- **Recommendation:** Add a "Compare" button to each fighter card that opens a side-by-side modal comparing two selected fighters' stats as opposing horizontal bars (F1 left, F2 right, midpoint at center).
- **Pattern reference:** UFC Predictor and MMA Fight Sim both feature head-to-head stat comparison as a core feature.
- **JS to add:** `openCompareModal(f1id, f2id)` — renders a `.compare-modal` overlay with stat bars for both fighters.
- **CSS to add:** `.compare-modal`, `.compare-bar-row`, `.compare-bar-f1`, `.compare-bar-f2`.

---

## Summary Priority Table

| # | Recommendation | Impact | Effort | CSS/JS Touch Points |
|---|---------------|--------|--------|---------------------|
| 1A | Enlarge win probability numbers | HIGH | LOW | `.win-prob-pct`, new `.win-prob-hero` |
| 1B | Styled sim dropdowns + weight filter | HIGH | LOW | `.sim-select`, `populateSimSelects()` |
| 1C | Animated winner reveal in simulator | HIGH | LOW | `@keyframes winnerPulse`, `sim-result-winner` |
| 2A | Confidence-keyed betting row colors | HIGH | MED | `.bet-row--strong/moderate/lean`, betting render fn |
| 2B | Hot/cold stat color-coding on fighter cards | HIGH | MED | `.stat-hot/warm/cold`, fighter card render fn |
| 2C | Sort/filter controls on Predictions tab | HIGH | MED | `sortPredictions()`, reuse `.filter-btn` |
| 3A | Collapsible prelim rows | MED | MED | `.prelim-row`, `renderEvents()` toggle |
| 3B | Pick confidence tier badge | MED | LOW | Reuse `.section-badge`, update `renderPredictions()` |
| 3C | Hero countdown timer | MED | LOW | `startHeroCountdown()`, `.hero-countdown` |
| 4A | Bottom navigation bar (mobile) | MED | HIGH | `.bottom-nav`, `@media (max-width:480px)` |
| 4B | Method of victory donut chart | MED | HIGH | `buildMethodDonut()`, `.method-donut` SVG |
| 4C | Fighter comparison modal | MED | HIGH | `openCompareModal()`, `.compare-modal` |

---

## Sources Referenced
- [ESPN MMA](https://www.espn.com/mma/)
- [Tapology MMA](https://www.tapology.com/)
- [MMA Fight Sim](https://mmafightsim.com/)
- [Polymarket UFC Predictions](https://polymarket.com/predictions/ufc)
- [BestFightOdds](https://www.bestfightodds.com/)
- [StatsFight Analytics](https://statsfight.com/analytics/)
- [MMA Hub App — UI/UX Case Study (Medium)](https://medium.com/design-bootcamp/ui-ux-case-study-mma-hub-fight-companion-betting-app-872d0085a769)
- [UFC Predictor](https://ufc-predictor.com/)
- [MMAPLAY365 Bayes AI](https://www.mmaplay365.com/bayes-ai/)
- [MMA Predictions](https://mmapredictions.com/)
