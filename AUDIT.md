# FightIQ — Nigel Audit v9
*Date: 2026-04-04 | Auditor: Nigel (strict mode) | Benchmark: ESPN, UFC.com, Tapology*

---

## What Changed Since v8

The v8 priorities were all addressed in commit `d305790`:

1. **UFC 327 card expanded** — From 2 fights to 7 (added Chimaev vs Du Plessis, Muhammad vs Edwards, Adesanya vs Strickland, Costa vs Murzakanov, Blaydes vs Volkov). Fighter data was also added to `EXTRA_FIGHTERS` for all new participants.
2. **Hero image fallback fixed** — `onerror="this.style.display='none'"` replaced with the proper SVG initials fallback pattern. Gap-on-fail eliminated.
3. **Simulator accessibility** — `aria-live="polite"` and `aria-atomic="true"` added to `#sim-result` in `index.html`. Screen readers will now announce simulation results.
4. **Side-by-side stat compare in Simulator** — A new `.sim-fighter-compare` section was added showing SLpM, Str Acc, and Finish % for both fighters with the winner highlighted in red. This transforms the breakdown from winner-only to a genuine comparison.
5. **Data accuracy fixes** — Holloway corrected from Champion to `#1` (Topuria is the FW champion), Miocic marked `Retired`.

All three v8 priorities were implemented cleanly. The score now needs to be reassessed from first principles.

---

## Category Scores

### 1. Visual Design — 7.5 / 10

**What works:**
- The hero banner with the dual red/gold probability bar is the best-looking element on the page. The color coding (red = F1, gold = F2) is consistent and readable.
- Dark card system with subtle gradient borders is professional. Not generic bootstrap — looks intentional.
- The event card face-off layout (photo + VS + photo for main and co-main) gives the Events tab a premium editorial feel.
- Typography is tight: Inter 800/900 weight for headers, consistent use of letter-spacing, `text-transform: uppercase` used appropriately.
- Gold `section-badge` with `livePulse` animation on the ML MODEL badge is a nice live-data signal even though the data is static.

**Remaining issues:**
- The hero banner shows the *first upcoming event* (Fight Night: Moicano vs. Duncan) rather than the bigger UFC 327 PPV scheduled for next week. A real fan opening this app on April 4 sees the smaller card headlined rather than the 7-fight PPV. The hero should prioritize PPV over Fight Night when both are upcoming.
- The `.win-prob-hero-pct` font at 44px renders the percentage numbers impressively on desktop but at 375px those numbers collide with the "VS" divider — particularly on long surnames. The `overflow: hidden; text-overflow: ellipsis` on `.win-prob-hero-name` truncates surnames without indication.
- The `method-grid` three-column layout forces very tight cells on mobile (375px). At 375px wide with 16px padding on both sides, each method cell is ~103px wide. `method-pct` at 20px font is fine but `method-label` at 10px is at the absolute edge of readability.
- No visual differentiation between MAIN EVENT and PPV in the hero banner. Both use the same "Next Main Event" label. A "UFC 327 — PPV" marker would set stakes.

### 2. Mobile UX (375px) — 7.0 / 10

*Tested mental model at 375px viewport.*

**What works:**
- Tab bar scrolls horizontally with hidden scrollbar and a right-side fade gradient. The 5 tabs are accessible by scrolling and all have `min-height: 44px` touch targets.
- Hamburger menu at `max-width: 768px` is implemented. Toggle works, closes on tab click.
- At 480px, sim dropdowns stack vertically — correct behavior.
- Filter buttons wrap and center on mobile. All 9 weight class buttons have 44px min-height — good.
- `fight-row-compact` for prelims is tight but usable at 375px. Name truncation with `text-overflow: ellipsis` prevents overflow.
- Hero photo width scales from 120px to 100px at 768px breakpoint.

**Remaining issues:**
- At 375px, the hero fighter photos (100px wide) with the `hero-center` column (54px) leaves each fighter only ~104px for the photo column. The fighter name below (`hero-fighter-name` at 13px, `text-transform: uppercase`) truncates for longer names like "Renato Moicano" with no indication of truncation — there is no `text-overflow: ellipsis` on `.hero-fighter-name`.
- The sim dropdowns at 375px: the grid switches to single column at 480px (correct), but between 375px and 480px the grid stays `1fr auto 1fr` — at exactly 375px the dropdowns are cramped (each select is ~145px wide with the VS label eating ~40px). A fighter like "Abdul-Rakhman Yakhyaev" overflows the select's visible text area.
- The `.predictions-grid` collapses to `1fr` at 768px. This is correct. But the 44px prediction win-prob numbers at mobile become dominant — the whole prediction card feels like the number is the content and the fighter context is secondary. A real fan wants to scan the fight first, then see the %. The layout hierarchy on mobile inverts the natural reading order.
- No swipe gesture between tabs. On mobile at 375px, tab switching requires a precise tap on the small tab bar. No swipe support (expected for a plain HTML app, but a gap vs. Tapology and UFC app).
- The `.fight-faceoff` min-height of 130px on mobile means the main event face-off card is large — takes up most of the screen. A first-time mobile user on UFC 327 sees only 1.2 fight rows before needing to scroll. Tapology fits 3+ rows before first scroll.

### 3. Features — 7.3 / 10

**What works:**
- Five tabs with meaningfully different content: Events (schedule), Predictions (AI), Simulator (interactive), Betting (model odds), Fighters (database).
- Fight simulator is now genuinely interactive with per-matchup variance. Re-running same matchup gives slightly different results — good design decision that mimics real uncertainty.
- Side-by-side stat compare in simulator (new in v9 fixes) shows SLpM, Str Acc, and Finish % head-to-head. Winner is highlighted in red. This is the most significant UX improvement in the v8 fixes.
- Statistical breakdown bar rows (Striking Edge, Takedown Avg, Str. Accuracy, Finish Rate) still show winner-only values — the v8 fix added the side-by-side *compare* section above but did not convert these 4 bars to dual-comparison. Partial delivery on P3 from v8.
- Collapsible prelim section with chevron animation and aria-expanded is implemented correctly.
- Fighter search + weight class filter works. Filters and search combine correctly.
- Betting tab shows model-implied American odds, VALUE/FAIR/FADE badge, and edge percentage. Confidence-keyed left border (green for strong, gold for moderate) is a thoughtful UI signal.

**Missing (relative to benchmark apps):**
- No fighter profile drill-down. Clicking a fighter card does nothing. Tapology provides detailed fighter pages. Even a modal with full stats would be a meaningful step up.
- No event countdown timer. The hero banner shows "April 4, 2026" but no real-time countdown. UFC.com shows "Event starts in X hours."
- No share/export of predictions. A user who picks their card and wants to share has no mechanism.
- Hero shows Fight Night over the upcoming PPV — a product-level issue, not just UI.
- All 5 tabs are rendered on `DOMContentLoaded` synchronously. With 40+ fighters this is still fast, but no progressive rendering.

### 4. Data Quality — 7.4 / 10

**What improved:**
- UFC 327 now has 7 fights: Prochazka vs. Ulberg (main), Van vs. Taira (co-main), Chimaev vs. Du Plessis, Muhammad vs. Edwards, Adesanya vs. Strickland, Costa vs. Murzakanov, Blaydes vs. Volkov.
- Holloway is correctly `#1` FW (Topuria is Champion). Miocic is `Retired`.
- The Middleweight title conflict is resolved: Chimaev is `Champion`, Du Plessis is `#1`, Adesanya is `#2`, Strickland is `#3`. Coherent MW rankings at last.

**Remaining issues:**
- Chimaev vs. Du Plessis and Muhammad vs. Edwards are both title fights on UFC 327, but both are `tier: "main-card"`. The prediction card title label (`fight.tier === 'main' ? '· Title Fight' : ''`) only fires for the main event. Two championship bouts show no title fight label — a factual miss visible to any MW or WW fan.
- `azamat-murzakanov` in `EXTRA_FIGHTERS` has `weight: "Light Heavyweight"` and `rank: "#8"` but appears in UFC 327 as a Middleweight fight vs. Paulo Costa. The fighter object and the fight entry are in different weight classes.
- Conor McGregor's record is `22-6-0`. He has been inactive since 2021. Stale but low-impact.
- `renato-moicano` record is `20-7-1`. The draw is correct but renders as plain text — no visual treatment for the draw result.
- Joshua Van: record `11-0-0`, listed as Flyweight Champion. Any MMA fan would raise an eyebrow at an 11-0 champion with no context on when/how he won the belt.
- The prediction model adds `+/-4% noise` in the simulator *after* calculating probabilities. The narrative (`generateFightNarrative`) uses the non-noised probabilities but the displayed win % is noised. A user who reads "Model confidence: 28%" but sees a displayed % that has shifted 4 points lower might notice the mismatch.

### 5. Performance — 8.0 / 10

*Unchanged from v8. No regressions.*

- Zero external API calls. All data is static inline JS.
- CSS uses GPU-composited properties only: `transform`, `opacity`, `box-shadow`.
- `animateBars()` uses a single `requestAnimationFrame` plus `setTimeout` delays — minimal and correct.
- Images use `loading="lazy"` throughout except hero photos which correctly use `loading="eager"`.
- `will-change: transform` on `.prelim-chevron` only — not over-applied.
- No memory leaks: event listeners are attached once on `DOMContentLoaded`, no polling, no timers.
- The `max-height: 0 to 1000px` approach for collapsible prelims can cause a visible snap when content is shorter than 1000px. A JS-measured `height` animation would be cleaner, but minor.

### 6. Accessibility — 7.5 / 10

*Improved from 7.3 — the aria-live fix is meaningful.*

**What improved:**
- `aria-live="polite"` and `aria-atomic="true"` on `#sim-result` — screen readers will now announce simulation results. Correct implementation.
- `aria-expanded` on prelim toggle buttons updates dynamically.

**Remaining issues:**
- The `&#9654;` play triangle in `.sim-run-btn` is still not `aria-hidden="true"`. The `aria-label` on the button handles the accessible name correctly, but the Unicode character remains in the accessibility tree unnecessarily.
- Contrast: `var(--grey)` (#888888) on `var(--black)` (#0a0a0a) is ~4.4:1. WCAG AA requires 4.5:1 for normal text. Affected elements include `.hero-fighter-record` (11px), `.fight-faceoff-record` (10px), `.f-stat-label` (9px), `.fight-faceoff-weight` (8px), `.hero-weight` (8px). All of these are WCAG AA fails for small text.
- The `fight-row` elements have `cursor: pointer` and a click handler (navigates to Predictions) but no `role="button"` and no keyboard activation. A keyboard user pressing Enter or Space on a focused fight row will not trigger navigation.
- The `.sim-compare-val.sim-compare-winner` uses red for the better stat. Red is also the warning/negative color elsewhere in the UI (fade badge, negative betting edge). Semantic ambiguity for color-dependent users.
- No `<title>` update on tab switch. Screen reader users navigating tabs don't get a document-level context change.

### 7. Overall App Feel — 7.8 / 10

FightIQ v9 is the strongest version yet. The UFC 327 card expansion and the simulator stat comparison are the two most user-visible improvements. A fan opening the app today (April 4 — Fight Night card day) now sees two real events, a working simulation feature with head-to-head comparison, and a betting tab with model-implied odds.

**What pushes it to 7.8:**
- The simulator's new fighter compare section is genuinely useful. Seeing "Jones 4.3 SLpM vs Aspinall 5.8 SLpM" with the winner highlighted makes the model's reasoning transparent — a feature even Tapology doesn't offer.
- The Fight Night card tonight (Moicano vs. Duncan) has full fighter data for all 8 fights, including prelims behind the collapsible toggle. This is a real-time complete card.
- UFC 327 next week shows 7 fights, all with predictions and betting odds. A user can do full pre-fight research in one sitting.

**Where 7.8 stops at 8.0:**
- Hero prioritization bug — Fight Night shown over the PPV. Strategic miss.
- Two title fights on UFC 327 missing "Title Fight" labels.
- Four stat bars in "Statistical Breakdown" still show winner-only. The new compare section duplicates/replaces the bars logically but doesn't remove them, creating visual redundancy.
- Fighter cards are still a dead end — no profile, no drill-down.

For a user coming from Tapology: they get equivalent event data, more transparent prediction methodology, and a unique simulator. They miss fighter profile pages, verified live data signals, and smooth mobile navigation. The app is not yet a daily driver but is now a compelling pre-event prediction session tool.

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
| v8 | 7.7 | Hero bar two-sided (live), sim variance + title fight rounds, 375px breakpoint fixes |
| v9 | 7.8 | UFC 327 full card, hero fallback fix, aria-live, side-by-side sim stat compare |

---

## Overall Score: 7.8 / 10

Score improves from 7.7 to 7.8. All three v8 priorities were shipped. The increment is real but modest: the stat compare is a partial completion (3 stats added in new section, 4 winner-only bars left unchanged), the hero still prioritizes Fight Night over the PPV during fight week, and two title bouts on UFC 327 are missing their "Title Fight" labels. The gap from 7.8 to 8.0 is three specific changes: PPV hero prioritization, title fight labels, and fighter profile modals.

---

## Top 3 Priorities for v10

### Priority 1: Fix Hero Banner to Prioritize PPV Events
In `renderHero()`, the function always uses `UPCOMING_EVENTS[0]`. Today that is UFC Fight Night (April 4), so the hero shows the smaller card when UFC 327 PPV is imminent. Change one line:

```js
const event = UPCOMING_EVENTS.find(e => e.type === 'ppv') || UPCOMING_EVENTS[0];
```

Also update the hero event label: instead of the generic "Next Main Event", show the event type dynamically — "PPV" or "Fight Night." This ensures that during UFC 327 fight week, the hero banner surfaces Prochazka vs. Ulberg and not Moicano vs. Duncan. Highest-impact single-line change in the codebase.

### Priority 2: Mark Multi-Title Fights with "Title Fight" Labels
`renderPredictions()` shows "· Title Fight" only for `fight.tier === 'main'`. On UFC 327, the Middleweight title (Chimaev vs. Du Plessis) and Welterweight title (Muhammad vs. Edwards) are `main-card` tier but are championship bouts. Add a `title: true` flag to the fight objects in `UPCOMING_EVENTS`:

```js
{ f1: "khamzat-chimaev", f2: "dricus-du-plessis", tier: "main-card", weight: "Middleweight", title: true },
{ f1: "belal-muhammad",  f2: "leon-edwards",      tier: "main-card", weight: "Welterweight", title: true },
```

Then use `fight.title || fight.tier === 'main'` in the prediction card header label. Pure data and template change, no model logic touched. Also fix `azamat-murzakanov`'s weight in EXTRA_FIGHTERS to "Middleweight" to match his UFC 327 fight.

### Priority 3: Fighter Profile Modal — Tap to Expand
Every fighter card in the Fighters tab is a dead end. Add a tap-to-expand modal that shows: record, weight class, rank, style, reach, stance, all 7 stats in readable format, and a "Simulate vs..." shortcut that pre-fills the simulator with this fighter. Requirements: `position: fixed` overlay, close button with `aria-label="Close"`, Escape key to close, focus trap while open. Implementation is approximately 60 lines of JS and 40 lines of CSS. No new dependencies. This is the single largest feature gap vs. Tapology and UFC.com, and it directly enables the stat comparison behavior that users naturally expect when tapping a fighter card.

---

*FightIQ at v9 is a polished, fast, and content-complete fight predictor for two immediately upcoming events. The gap to 8.0 is PPV hero prioritization (1 line), title fight labels (data flag + template), and fighter profile modals (new feature). None require a backend.*
