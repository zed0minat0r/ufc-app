# FightIQ Audit — v8
**Auditor:** Nigel  
**Date:** 2026-04-04  
**Version:** v8  
**Live URL:** https://zed0minat0r.github.io/ufc-app/

---

## What Changed Since v7

The three v7 priorities were addressed with varying success:

**Priority 1 — Hero Banner Probability Bar (FIXED):** `renderHero()` now correctly renders two sibling `.hero-prob-fill` divs (`--f1` in red, `--f2` in gold) with `data-width` attributes. The CSS for `.hero-prob-fill--f1` and `.hero-prob-fill--f2` was also added. `animateBars()` fires on page load via `setTimeout(..., 80)`. The hero banner now shows a proper two-sided bar that visually matches the Predictions tab. This was the most visible trust issue and it is resolved.

**Priority 2 — Simulator Variance + Title Fight Round (FIXED):** `runSimulator()` now applies ±4% noise (`(Math.random() * 8) - 4`) to `f1WinProb` post-prediction, clamped to 5–95%. Same fighters now produce slightly different results each run. Additionally, `isTitleFight` is detected by checking whether the selected pair appear as a `tier: 'main'` fight in `UPCOMING_EVENTS`, and if so `decisionRound` randomly selects round 4 or 5. KO/sub round logic now uses meaningful thresholds based on the winner's actual stats rather than a hardcoded `3`. These are real improvements.

**Priority 3 — UFC 327 Card Data (PARTIALLY ADDRESSED):** The card still only has 2 fights (main event Prochazka vs. Ulberg, co-main Van vs. Taira). No additional main card or prelim fights were added. The PPV card still renders as a visually thin event compared to the 8-fight Fight Night. The championship conflict between `dricus-du-plessis` (rank: "#1") and `khamzat-chimaev` (rank: "Champion") in the same weight class remains unresolved.

**Additional Changes Observed:**
- 375px breakpoint media query block added (`@media (max-width: 390px)`) with `.pred-pick` flex-wrap, badge font-size adjustments, and `.hero-prob-labels` font-size correction.
- Sim matchup photos section (`sim-matchup-photos`, `sim-matchup-name`, `sim-matchup-vs`) added to show both fighters' photos/initials at the top of the result card before the winner reveal.
- Focus-visible ring set remains intact. No accessibility regressions detected.

---

## Category Scores

### 1. Visual Design — 7.8 / 10
The dark red-gold palette is distinctive and consistent. The hero banner now correctly shows a two-sided probability bar, which was the last major visual inconsistency. The sim matchup photo display (both fighters shown above the result) is a genuine UX improvement — it looks closer to how ESPN or Tapology frames matchup content. The `winnerReveal` and `winnerPulse` animations feel premium.

**Remaining gaps:**
- The hero banner's `onerror` on fighter photos sets `this.style.display='none'` — leaving a visible empty box where the photo should be. The Predictions and Fighter tabs use an SVG initials fallback, which is the correct pattern. The hero is inconsistent and shows a broken-image gap on slow connections or when fighter images are missing.
- The UFC 327 event card still looks sparse (2 fights, no prelims) compared to the Fight Night card. This contrast makes the PPV look broken or placeholder-level.
- No skeleton loading states — the loaders (spinning ring) are a placeholder that users on fast connections see for a fraction of a second. Low priority, but a real product would render synchronously (which is easy since all data is static).
- Typography size jumps between desktop and mobile feel slightly abrupt. The prediction card fighter name at 15px can truncate on 375px without ellipsis protection in the `.pred-fighter-name` element.

### 2. Mobile UX (375px) — 7.4 / 10
*Up from implied 7.2 in v7. The 390px breakpoint media query addresses the primary 375px issues directly.*

**Working well:**
- Tabs scroll horizontally with no scrollbar visible, fade gradient on right edge functions.
- Filter buttons on the Fighters tab are centered via `justify-content: center` at narrow widths.
- `.pred-pick` now wraps to allow the confidence badge to break to a new line rather than overflowing.
- Sim selectors switch to single-column at 480px — correct.
- `min-height: 44px` on tabs, filter buttons, and prelim toggle buttons meets touch target spec.

**Still failing at 375px:**
- The hero banner fight-faceoff area at 375px with photos sized 100px × 122px is tight. The center `hero-center` column is 54px wide. The three columns total ~254px of content in 343px of usable space. This works numerically but the photos feel crowded next to the VS column.
- The sim result `sim-bar-label` has a fixed `width: 90px` with no responsive override. At 375px the bar track and value label are competing for ~185px. The bar labels ("Str. Accuracy", "Takedown Avg") can truncate or visually crowd.
- Fighter card `fighter-photo--lg` is 120px × 140px with no mobile size reduction. On 375px single-column layout, the photo uses nearly one-third of the card width, which is fine aesthetically but pushes name/record to a narrower column than ideal.
- No `-webkit-tap-highlight-color: transparent` on interactive elements. Tap highlight flashes are visible on iOS Safari for fight rows and filter buttons.

### 3. Features — 7.2 / 10
The five-tab structure (Events, Predictions, Simulator, Betting, Fighters) is solid and internally consistent. The simulator improvement (noise + title fight rounds) makes it meaningfully more interactive. The prelim collapsible toggle continues to work well.

**What's missing relative to competitors:**
- No fight history on fighter cards. Tapology's most basic fighter page shows last 5 fights. FightIQ cards show 6 stats but no record of recent wins/losses/opponents — which is what a real user checks first when evaluating a fighter.
- No ability to click a fighter name in Events or Predictions and jump to their stats. Fight rows click through to the Predictions tab generically (not scrolled to that specific fight). Fight row → specific prediction card would be genuinely useful.
- The Betting tab edge calculation uses a model-to-model comparison, not actual bookmaker lines. The disclaimer is present but a user who skims it will assume these are real lines, which undermines trust when they check an actual sportsbook and see different numbers.
- Simulator only shows the winner's stats in the breakdown bars — not both fighters' stats side-by-side. Comparing fighters is the whole point of the simulator; showing only the winner's stats is a half-result.

### 4. Data Quality — 6.8 / 10
*Unchanged from v7. The UFC 327 gap continues to be the primary issue.*

**Issues:**
- UFC 327 (April 11) has only 2 of an expected ~8–10 fights. The PPV card in the Events tab renders a header + 2 fight rows, no prelim section. On fight week (which today is — UFC Fight Night is tonight, April 4), the PPV card should be the most complete entry in the app.
- Middleweight championship conflict: `khamzat-chimaev` is tagged `rank: "Champion"` and `dricus-du-plessis` is tagged `rank: "#1"` in the same weight class. One of these is factually wrong. A user who notices this will immediately distrust the entire fighter database.
- The app has no data freshness timestamp. A user has no way to know whether the records shown are from this week or six months ago.
- `conor-mcgregor` marked `rank: "Inactive"` is accurate, but he appears in the simulator pool alongside active title challengers — a casual user may be confused by why an inactive fighter is in a current fight predictor.

### 5. Performance — 8.0 / 10
*Unchanged from v7. No regressions.*

All rendering is synchronous, inline JS with no external data fetches. `animateBars()` uses a single `requestAnimationFrame`. Fighter images use `loading="lazy"` except the hero (correctly using `loading="eager"`). CSS uses `will-change: transform` only on `.prelim-chevron` where it is warranted. The `btnGlow` animation on `.sim-run-btn` is CSS-only and GPU-composited. No memory leaks, no polling, no unnecessary timers. Holds at 8.0.

### 6. Accessibility — 7.3 / 10
*Unchanged from v7.*

**Working:**
- ARIA tab roles, `aria-selected`, `aria-controls`, `role="tabpanel"`, `aria-labelledby` correctly implemented.
- Gold `focus-visible` rings on all interactive elements.
- Filter buttons have `aria-label` with full weight class names.
- Prelim toggle has `aria-expanded` that updates dynamically on click.

**Still failing:**
- `#sim-result` has no `aria-live` attribute. The result card appears silently for screen reader users. One attribute (`aria-live="polite"`) in `index.html` would fix this.
- The `&#9654;` play triangle in `.sim-run-btn` is not `aria-hidden="true"`. The `aria-label` on the button handles semantics correctly, but the character is still in the accessibility tree unnecessarily.
- Hero fighter photo `onerror` sets `display: none` — alt text remains in the DOM but the visual gap is inconsistent with the SVG fallback pattern used elsewhere in the app.
- Contrast: `var(--grey)` (#888) on `var(--black)` (#0a0a0a) is ~4.4:1. Borderline pass for large text, borderline fail for small text. Elements like `.fight-faceoff-record` (10px) and `.hero-fighter-record` (11px) are below the WCAG AA threshold for small text.

### 7. Overall App Feel — 7.7 / 10
FightIQ continues to feel like a real product. The hero banner fix is the most impactful visible change since v6 — the first thing a user sees is now a correctly rendered two-sided probability bar. The sim matchup photo row adds real polish to the result display. At 7.7, the app is above average for an independent fight fan project: it is clearly intentional in its design, has features that even Tapology doesn't (contextual AI narratives, method probability breakdowns), and loads fast.

The ceiling without live data remains real. The UFC 327 gap is the clearest example: a user checking this app on fight week (today) opens Events and sees the PPV card with 2 fights. The actual card has 8–10. This breaks the primary use case — checking fight week matchups — for the next PPV, and no amount of UI polish compensates for missing fight data.

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

---

## Overall Score: 7.7 / 10

Score holds at 7.7. The v7 priorities were meaningfully addressed — the hero bar fix is the most impactful visual change since v6, and the simulator is now genuinely interactive. However, the UFC 327 data gap remains open, the Middleweight championship conflict is still present, and no new user-facing features were added. The app is stable and polished at 7.7 but has not crossed to 7.8+ because the data layer continues to limit real-world utility on fight week.

---

## Top 3 Priorities for v9

### Priority 1: Complete UFC 327 Card Data + Resolve MW Championship Conflict
UFC 327 (April 11) is the next PPV and today is fight week. The event card shows 2 fights when the real card has 8–10. Add the remaining main card and prelim fights to `UPCOMING_EVENTS`, with fighter entries in `EXTRA_FIGHTERS` for any new names. Simultaneously fix the Middleweight championship data: `khamzat-chimaev` is `rank: "Champion"` and `dricus-du-plessis` is `rank: "#1"` in the same division — one is wrong, and the contradiction is visible to any MW fan. This is the highest-impact fix available without a live backend, and it is pure data entry.

### Priority 2: Fix Hero Fighter Photo Fallback — Replace display:none with SVG Initials
In `renderHero()`, the `onerror` handler for fighter photos currently sets `this.style.display='none'`. This leaves a visible empty box where the photo should be. The `getFighterImage()` function already implements the correct pattern: an inline SVG fallback with initials and red background. Apply this same pattern to the hero banner: replace `onerror="this.style.display='none'"` with `onerror="this.onerror=null;this.src='[svgFallback]'"` for both `f1Photo` and `f2Photo` in `renderHero()`. This is a two-line change and affects every user accessing the app on GitHub Pages where `/fighters/` images may not load — which is likely the majority of users.

### Priority 3: Add aria-live="polite" to #sim-result and Show Side-by-Side Stats in Simulator Breakdown
Two targeted changes: First, add `aria-live="polite"` to `<div id="sim-result">` in `index.html` — one attribute, makes the simulator result announced to screen readers. Second, the simulator's "Statistical Breakdown" section currently shows only the winner's stats in 4 bar rows. Change the template in `runSimulator()` to show both fighters' values (f1 stat vs. f2 stat) for each metric. This makes the model's reasoning visible — a user can see *why* the model picked the winner — and transforms the breakdown from a winner summary into a genuine comparison tool. The CSS bar pattern already exists; this is a template change only.

---

*FightIQ at v8 is a polished, fast, and visually distinctive fight predictor. The remaining gap to 8.0 is: complete PPV data, consistent image fallbacks, and a comparison-based simulator breakdown. All three are achievable without a live backend and without major refactoring.*
