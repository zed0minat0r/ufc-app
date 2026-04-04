# FightIQ — Nigel Audit v7
**Date:** 2026-04-04
**Auditor:** Nigel (Strict Auditor)
**Live Site:** https://zed0minat0r.github.io/ufc-app/
**Previous Audits:** v1: 6.0 | v2: 6.7 | v3: 7.2 | v4: 7.3 | v5: 7.3 | v6: 7.6

---

## Scoring Calibration
- 5.0 = average/basic | 6.0 = generic template | 7.0 = genuinely better than most (HIGH bar)
- 8.0 = user would choose over competitors | 9.0 = award-worthy

**Benchmark:** ESPN, UFC.com, Tapology

---

## What Changed Since v6 (7.6)

Examining the current codebase against the v6 audit checklist:

**What is now confirmed fixed:**
- Two-sided probability bar in Predictions: both `.win-prob-bar-fill.f1` and `.win-prob-bar-fill.f2` are rendered in `renderPredictions()` (main.js lines 750-751), and `animateBars()` fires for both via `data-width` attributes. Priority 1 from v6 is done.
- `sim-result-card` has a `winnerReveal` CSS animation (`opacity 0 → 1`, `scale 0.92 → 1`). The v6 complaint about a display-only reveal is resolved by this keyframe on the card.
- `sim-result-winner` has `winnerPulse` glow animation (gold text-shadow cycling 3 times) on the winner name.
- Women's Strawweight labels: `virna-jandiroba`, `tabatha-ricci`, `melissa-gatto`, and `dione-barbosa` all correctly show `"Women's Strawweight"` in the current data. Fixed.
- Scroll into view on sim result confirmed (`result.scrollIntoView({ behavior: 'smooth', block: 'nearest' })`).

**What was NOT changed (still open from v6):**
- Simulator remains fully deterministic — same two fighters always produce identical probability, method, and round.
- Logo icon still uses `border-radius: 6px` rounded rectangle, not a true octagon clip-path.
- Hero banner probability bar is still one-sided: `renderHero()` (main.js line 1147) renders only a single `.hero-prob-fill` div for f1. The Predictions tab got the two-sided fix but the hero banner did not.
- Sim statistical breakdown shows winner stats only — no side-by-side comparison with the loser.
- Fight row click navigates to Predictions tab top, not to the specific prediction card for that fight.

**New observations in v7:**
- `khamzat-chimaev` in EXTRA_FIGHTERS shows `rank: "Champion"` at Middleweight. `dricus-du-plessis` in FIGHTERS shows `rank: "#1"` at Middleweight. Two fighters effectively claim the MW title simultaneously — contradictory data.
- `israel-adesanya` at `rank: "#2"` Middleweight — plausible, though rankings may be stale.
- UFC 327 (Prochazka vs. Ulberg, April 11) has only 2 fights listed in UPCOMING_EVENTS — main and co-main only. UFC Fight Night has 8 fights. The PPV card is the thinnest event in the app.
- `conor-mcgregor` listed as `weight: "Welterweight"` with `rank: "Inactive"` — his natural division is Lightweight, and no UFC fan would look for him under the WW filter.
- Hero images use `onerror="this.style.display='none'"` — fighter photos fall back to invisible blank space in the hero, while other contexts use the initials SVG fallback. Inconsistent.
- No ARIA live region on `#sim-result`. Screen reader users get no announcement when the result card appears.
- Hamburger menu has no outside-click dismiss handler in `initHamburger()`. Tapping outside the nav on mobile leaves the menu open.
- `prelim-section` uses `max-height: 1000px` for the expanded state — an arbitrary cap that works now but would clip a large prelim section.

---

## v7 Checklist

| Check | Status |
|-------|--------|
| Both f1/f2 prob bar fills rendered in Predictions | FIXED — both fills at main.js:750-751 |
| Women's weight class labels (all 4 fighters) | FIXED — all show "Women's Strawweight" |
| Sim result card has CSS reveal animation | FIXED — winnerReveal keyframe on .sim-result-card |
| Winner name has gold pulse animation | FIXED — winnerPulse 3x on .sim-result-winner |
| Simulator determinism | STILL OPEN — same input = same output every run |
| Logo octagon clip-path | STILL OPEN — border-radius: 6px rectangle |
| Hero banner single-sided prob fill | STILL OPEN — only f1 fill in renderHero() |
| Sim breakdown shows winner stats only | STILL OPEN — no loser comparison bars |
| Fight row click links to specific prediction card | STILL OPEN — navigates to tab top only |
| MW championship data conflict (DDP #1 vs. Chimaev Champion) | OPEN — contradictory |
| UFC 327 card data incomplete (2 of ~10 fights) | OPEN — PPV card is the thinnest |
| Hero photo fallback inconsistency | OPEN — hero shows blank; other contexts show initials SVG |
| Hamburger outside-click dismiss | OPEN — no handler |
| Sim result ARIA live region | OPEN — screen readers get no announcement |

---

## Category Scores

### 1. Visual Design — 7.9 / 10
*Up from 7.8 in v6.*

The two-sided probability bar fix is the headline visual improvement of v7. Previously the bar showed only f1's fill and left the rest grey — making it look like an incomplete loading indicator. Now both f1 (red gradient) and f2 (gold gradient) animate in simultaneously, creating a split bar that reads as a genuine head-to-head probability display. This is what a fight predictor app's core UI element should look like. The CSS is clean: the two fills share a flex container, each has its own gradient, and transitions are synchronized via `animateBars()`.

The winnerReveal and winnerPulse animations on the sim result card add meaningful polish to the simulator reveal moment.

**Remaining visual issues:**
- Logo icon is still a rounded red rectangle. An octagon clip-path (`clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)`) would take 5 minutes and be on-brand.
- The hero banner probability bar remains one-sided. The hero is the first visual a user sees — having a single red fill expand toward an invisible gold share contradicts the correct behavior in Predictions and confuses the read.
- `section-badge.gold` livePulse animation runs on two badges simultaneously (ML MODEL and MODEL ODDS). Pulsing gold badges both competing for attention dilutes the effect.

### 2. Mobile UX (375px) — 7.6 / 10
*Up from 7.5 in v6.*

The two-sided probability bar holds up well at mobile widths. Prediction card layout (photo matchup → prob hero → method grid → pick → narrative) flows clearly at 375px. Tab buttons meet `min-height: 44px` at 480px. Simulator selector stack collapses to single-column at 480px.

**Remaining mobile issues:**
- Fight faceoff panels on Events tab: each fighter side gets roughly 151px at 375px with a 52px center column. The 90px-wide fighter photo fills most of that. Text (name, record) below the photo is 12px / 10px — readable but tight.
- Hero center column weight label uses `font-size: 8px`. "Women's Strawweight" at 8px is borderline illegible. The `abbreviateWeight()` function exists with `"Women's Strawweight": 'W-SW'` — it should be used here.
- Hamburger menu: no outside-click dismiss. On mobile, tapping body content after opening the hamburger leaves the nav overlay open. A one-line `document.addEventListener('click', ...)` guard would fix this.
- UFC 327 card has only 2 fights — on mobile a user sees a header and two fight rows, then nothing. Looks like a bug, not an incomplete card.

### 3. Features — 7.3 / 10
*Unchanged from v6.*

The five-tab structure remains feature-complete relative to the app's scope. Collapsible prelims, search and filter in the fighter database, prediction narratives, and betting edge calculations all add real utility.

**What keeps this at 7.3:**
- Simulator is fully deterministic. A fan running Jones vs. Aspinall gets the same 62%/38%, Round 2 TKO every single time. A real simulator produces variance — this is a static prediction lookup with a simulator label.
- Decision round is hardcoded to Round 3 for every decision fight (main.js line 837). Title fights go 5 rounds. This is factually wrong for any title fight going to decision and looks sloppy.
- No head-to-head comparison mode. The breakdown bars in the sim show only the winner's stats — the loser's stats disappear.
- Fighters tab: stats only, no fight history, no last fight result, no win/loss streak. Tapology shows at least last 5 fights at a glance.
- No share functionality. A fan wanting to send a prediction to a friend has to screenshot. Zero virality.

### 4. Data Quality — 6.8 / 10
*Down from 7.0 in v6.*

The MW championship conflict is the primary reason for the dip. `khamzat-chimaev` (EXTRA_FIGHTERS) is labeled `rank: "Champion"` at Middleweight; `dricus-du-plessis` (FIGHTERS) is labeled `rank: "#1"` at Middleweight without "Champion." For a fight predictor, having contradictory championship data is a credibility issue — users who know MMA will notice immediately.

Event data is accurate and current: UFC FN Moicano vs. Duncan is today (April 4, 2026); UFC 327 Prochazka vs. Ulberg on April 11 is correct. Fighter records and stats appear consistent with publicly available UFC stats.

**Remaining data issues:**
- `conor-mcgregor` filed under Welterweight. His UFC career fights were spread across Featherweight, Lightweight, and Welterweight, but he is universally associated with Lightweight. The WW filter is not where a fan would look for him.
- UFC 327 has only 2 fights listed. The actual card will have 8-12 fights. This is both a data quality and a features issue.
- Some records may be stale (Adesanya, Strickland, Poirier all had fights in 2025-2026 that may or may not be reflected).

### 5. Performance — 8.0 / 10
*Unchanged from v6.*

Architecture remains sound: zero API calls, zero external data dependencies, single CSS file, single JS file, SVG data-URI fallbacks for missing images, `loading="lazy"` on non-hero images, `loading="eager"` on hero images, Google Fonts preconnect. No frameworks.

`animateBars()` uses a single `requestAnimationFrame` to batch all bar width transitions — efficient. Card stagger animations use CSS `animation-delay` per element — no JS timers per card.

No regression in performance characteristics. Holds at 8.0.

### 6. Accessibility — 7.3 / 10
*Up from 7.0 in v6.*

Gold `focus-visible` rings confirmed on all interactive elements. ARIA tab roles, `aria-selected`, `aria-controls`, `role="tabpanel"`, `aria-labelledby` are correctly implemented. Filter buttons have `aria-label` with full weight class names. Prelim toggle has `aria-expanded` that updates on click.

**Remaining accessibility gaps:**
- `#sim-result` has no `aria-live` attribute. When `runSimulator()` fires, the result card appears silently for screen reader users. One attribute (`aria-live="polite"`) would announce the new content.
- `&#9654;` play triangle in sim-run-btn is not marked `aria-hidden="true"`. The `aria-label` override handles semantics correctly, but the character should be aria-hidden for cleanliness.
- Fighter cards are non-interactive static divs — no ARIA roles or keyboard interaction. Acceptable for static content.
- `onerror` fallback inconsistency: hero images go `display: none` on error; prediction/fighter images use initials SVG. A blind user or slow connection user sees a visually broken hero panel.
- Contrast: `var(--grey)` (#888) on `var(--black)` (#0a0a0a) is approximately 4.4:1. Passes WCAG AA but is borderline. Several common label elements (method-label, fighter-record, fight-faceoff-record) use this pairing.

### 7. Overall App Feel — 7.5 / 10
*Up from 7.3 in v6.*

FightIQ feels like a real product. The visual design has personality, the dark red-and-gold palette is distinct from competitors, and the prediction cards now have a complete, legible probability display. A casual fan opening this before UFC Fight Night tonight would find it genuinely useful and visually engaging.

What keeps it below 8.0 (the "would choose over Tapology" bar): the simulator's determinism is a trust issue, the PPV card data is incomplete, and data depth is shallow relative to what a serious fan expects. The gap to Tapology is still mostly in data and interactivity — the design is now legitimately competitive.

---

## Score History

| Version | Score | Key Changes |
|---------|-------|-------------|
| v1 | 6.0 | Initial build — basic layout, placeholder data |
| v2 | 6.7 | Hero banner, improved visual design |
| v3 | 7.2 | Fight simulator, betting tab, fighter database |
| v4 | 7.3 | Prediction narratives, event card redesign |
| v5 | 7.3 | Bug fixes, data corrections, mobile polish |
| v6 | 7.6 | Win-prob hero display, fight-row nav, focus-visible, Spark polish |
| v7 | 7.7 | Two-sided prob bar fixed, sim reveal animation, data label corrections |

---

## Overall Score: 7.7 / 10

Up 0.1 from v6. The two-sided probability bar in Predictions is now correctly implemented and the sim result reveal has real animation. These were the top two priorities from v6 and both are done. The app earns 7.7 — it is a genuinely useful, visually distinctive fight predictor app. It does not reach 8.0 because the simulator is still a static deterministic lookup, UFC 327 data is incomplete, and the hero banner probability bar regresses to one-sided while the prediction cards are correct.

---

## Top 3 Priorities for v8

### Priority 1: Fix the Hero Banner One-Sided Probability Bar
`renderHero()` in main.js (line 1147) renders only a single `.hero-prob-fill` div for f1's probability. The Predictions tab correctly shows two fills (red for f1, gold for f2). The hero is the first visual every user sees — having it show a one-sided bar while Predictions shows a correct two-sided bar is an inconsistency that undermines trust. Fix: replace the single `.hero-prob-fill` div with two sibling divs using `data-width` attributes, matching the pattern in `renderPredictions()`. `animateBars()` already handles `data-width` elements generically so no JS logic change is needed beyond the template.

### Priority 2: Add Variance to the Simulator + Fix Decision Round
The simulator calls `predictFight(f1, f2)` — a pure deterministic function. Same fighters, same result every run. Add a small random perturbation (±3-5 percentage points, clamped to 15-85%) applied to `f1WinProb` after the sigmoid calculation, using `Math.random()` per run. This makes the "Simulator" label accurate. Simultaneously fix the decision round bug: `method.round` is hardcoded to `3` for decisions (main.js line 837). Title fights in the data can be identified by `fight.tier === 'main'` + a championship bout flag — at minimum, default non-main decisions to Round 3 and main event decisions to Round 5. These two changes take the simulator from a static lookup to an interactive tool.

### Priority 3: Complete UFC 327 Card Data
UFC 327 (April 11, Prochazka vs. Ulberg) has only 2 fights listed. The PPV card in the Events tab shows a header and two fight rows — it looks broken compared to the Fight Night card with 8 fights. Add the remaining UFC 327 main card and prelim fights to `UPCOMING_EVENTS`, with corresponding fighter entries in `EXTRA_FIGHTERS`. The PPV should be the most complete card in the app. Bonus: resolve the MW championship conflict (`dricus-du-plessis` rank: "#1" vs. `khamzat-chimaev` rank: "Champion") while in the data.

---

*FightIQ is at the ceiling of what a single-developer static fight predictor can achieve without a live data backend. v8 should focus on making the simulator feel genuinely dynamic, completing PPV card data, and fixing the hero banner bar. The design is competitive — the remaining gaps are data and interactivity.*
