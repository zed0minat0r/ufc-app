# FightIQ — Nigel Audit v6
**Date:** 2026-04-04
**Auditor:** Nigel (Strict Auditor)
**Live Site:** https://zed0minat0r.github.io/ufc-app/
**Previous Audits:** v1: 6.0 | v2: 6.7 | v3: 7.2 | v4: 7.3 | v5: 7.3

---

## Scoring Calibration
- 5.0 = average/basic | 6.0 = generic template | 7.0 = genuinely better than most (HIGH bar)
- 8.0 = user would choose over competitors | 9.0 = award-worthy

**Benchmark:** ESPN, UFC.com, Tapology

---

## What Changed Since v5 (7.3)

Three commits landed since v5, covering several categories:

**Commit: QA+Pixel+Refiner — fix VALUE badge, BW filter, Yakhyaev, Topuria**
1. **VALUE badge layout fixed** — `.bet-card-header` changed from `flex-direction: column` to `flex-direction: row` (style.css line 1202). `.bet-card-matchup` has `flex: 1` and `min-width: 0`. The badge now sits right-aligned in the same row as the fighter matchup strip. Priority 1 from v4 finally resolved after two audit cycles.
2. **BW filter added** — `<button class="filter-btn" data-filter="Bantamweight" aria-label="Bantamweight">BW</button>` added to `#fighter-filters` in index.html. Ewing and Estevam are now filterable.
3. **Yakhyaev image fixed** — `image: ''` at main.js line 275. Empty string triggers the inline SVG initials fallback. `PH_CDN` constant fully removed from main.js. `getFighterOrPlaceholder()` fallback also updated to `image: ''`. No remaining external HTTP dependencies.
4. **Topuria weight class corrected** — `weight: "Featherweight"` at main.js line 85. He now appears under the FW filter as Champion and no longer appears under LW.

**Commit: QA+Pixel+Refiner — fight row nav, a11y, section-badge merge, mobile fixes**
5. **Fight rows now navigate to Predictions tab** — Each `.fight-row` has a click listener (main.js lines 648–653) that fires the Predictions tab button and scrolls to top. The Events tab rows were cursor-pointer dead zones for two audits. Fixed.
6. **Focus-visible ring added** — `style.css` lines 1714–1723 define a 2px gold outline on `:focus-visible` for all interactive elements (tabs, sim button, selects, hamburger, filter buttons, nav links). Keyboard navigation now has visible focus.

**Commit: Builder+Spark — win-prob hero display, sim reveal animation, confidence betting**
7. **Win probability hero display in Predictions** — Large 44px percentage numbers (red for f1, gold for f2) with a VS divider now anchor every prediction card. This is the most visible UX improvement in v6.
8. **Sim result reveal** — `result.classList.add('visible')` and `result.scrollIntoView()` added. The result panel now appears with a `display: block` toggle and auto-scrolls into view after simulation.
9. **Spark polish pass** — Fighter avatar glow on hover (`box-shadow` + `scale(1.05)`), prediction card lift on hover (`translateY(-2px)`), bet card lift on hover, tab press scale, sim button idle glow animation (`btnGlow`). Multiple micro-interaction improvements.

**What did NOT change:**
- Simulator remains deterministic — same fighters always produce identical results.
- No actual animation on sim result reveal (display toggle, not a CSS transition).
- Women's Strawweight/Strawweight label mismatch (Jandiroba, Ricci, Gatto, Barbosa listed as "Strawweight" instead of "Women's Strawweight").
- Logo icon still uses `border-radius: 6px` rounded rectangle, not octagon clip-path.

---

## v6 Checklist

| Check | Status |
|-------|--------|
| VALUE badge layout fixed (column flex → row) | FIXED — `flex-direction: row` at style.css:1202 |
| Bantamweight filter button present | FIXED — BW button in index.html:143 with aria-label |
| Yakhyaev placeholder removed | FIXED — `image: ''` at main.js:275; PH_CDN fully removed |
| Topuria weight class corrected | FIXED — `weight: "Featherweight"` at main.js:85 |
| Fight rows navigate to Predictions | FIXED — click handler at main.js:648–653 |
| Focus-visible ring for keyboard users | FIXED — style.css:1714–1723 |
| Win-prob hero display in Predictions | NEW — 44px percentage hero at style.css:804–847 |
| Sim result reveal with scroll | NEW — .visible toggle + scrollIntoView at main.js:877–878 |
| Spark micro-interactions | NEW — hover lifts, avatar glow, button pulse |
| Simulator determinism | STILL OPEN — same input always = same output |
| Sim result reveal CSS animation | STILL OPEN — display toggle only, no transition |
| Women's weight class label mismatch | STILL OPEN — 4 fighters show "Strawweight" not "Women's Strawweight" |
| Logo octagon clip-path | STILL OPEN — border-radius: 6px rounded rectangle |

---

## Category Scores

### 1. Visual Design — 7.8/10
*Up from 7.3 in v5.*

The win-probability hero display is the single biggest visual step the app has taken since the hero banner arrived in v3. Large 44px numerals in red and gold, flanking a VS label, make the model output feel like a genuine product feature rather than a stat row. Prediction cards now have a clear visual hierarchy: photo matchup → probability hero → method breakdown → pick banner → narrative. That is a complete, logical information flow.

The Spark polish pass adds consistent micro-interactions across every interactive surface. Card hover lifts, avatar glow, tab press scale, and the sim button idle pulse bring the feel noticeably closer to a polished consumer app.

The VALUE badge fix is invisible in isolation but it matters: the betting tab was broken-looking for three audits. It is now correct.

**Remaining issues:**
- **Logo icon** is still a rounded rectangle (`border-radius: 6px`). The octagon SVG outline lives inside a red box rather than being clipped to an actual octagon shape. At small sizes this reads as a generic icon.
- **Win-prob bar in Predictions** only shows f1's fill. There is no f2 fill drawn — only `.win-prob-bar-fill.f1` is rendered in `renderPredictions()`. The opposing fighter's probability share is invisible on the bar. The bar reads as a one-sided indicator rather than a split bar. This is a regression from the intent of the two-sided bar the CSS supports (`.f2` class exists but is not used in the prediction card template).
- **Strawweight label mismatch** — Jandiroba, Ricci, Gatto, Barbosa are listed as `weight: "Strawweight"` in the database but compete at Women's Strawweight. They appear under the STR filter which is labelled correctly in the filter row, but the fighter card itself displays "Strawweight" without the "Women's" prefix. Minor but inaccurate.

### 2. Mobile UX (375px) — 7.5/10
*Up from 7.1 in v5.*

The VALUE badge fix eliminates the worst visual regression on mobile. At 375px the betting cards now render as intended. The focus-visible ring on filter buttons and tabs is a meaningful keyboard/switch-access improvement on iOS Safari (which respects `:focus-visible` for pointer users differently than desktop).

The win-prob hero with 44px percentages is slightly cramped on a 375px card. The figures are legible but the VS divider squeezes the two percentage blocks. At full content (long fighter names like "Brendson Ribeiro") the name labels under the percentages can truncate awkwardly. No overflow: hidden or text-overflow: ellipsis is set on `.win-prob-hero-name` — the label can bleed.

The sim result `scrollIntoView` on mobile is a real UX improvement; previously the result rendered off-screen and required manual scrolling.

**Remaining issues:**
- `.win-prob-hero-name` has no overflow protection — long last names can bleed on narrow cards.
- The one-sided probability bar (f1 only) is visually confusing at any viewport: a bar at 60% fill communicates nothing about the 40% opposing side.
- Betting card `flex-wrap: wrap` is still present for very narrow viewports — the badge can still wrap below on 320px devices (minor, edge case).

### 3. Features — 7.6/10
*Up from 7.3 in v5.*

Fight rows now navigate to Predictions — the Events tab is no longer a dead end. Clicking a fight row loads the Predictions panel with scroll-to-top. This creates a genuine user flow: Events → click fight → Predictions card for that fight. However the scroll goes to top of the page, not to the specific prediction card for the clicked fight. A user on a 10-fight card will still need to scan manually.

Simulator now auto-reveals and scrolls. Not a new capability but a significant UX improvement — the result was previously hidden below the fold on mobile.

**Remaining issues:**
- **Simulator is still fully deterministic.** Same two fighters always produce identical percentages, method, and round. A casual user who runs Makhachev vs Jones twice gets the exact same output both times. Any randomness or variance (even ±3–5%) would make it feel alive. This has been flagged in every audit.
- **Events → specific Predictions card navigation missing.** The fight row click lands on the Predictions tab but does not anchor to the specific prediction card for the clicked fight. Adding `data-fight-id` attributes and a `scrollIntoView` on the target card would close this gap.
- **No live odds integration.** The Betting tab shows model-implied odds but there is no comparison to actual market lines. The "edge" column headers imply a comparison that does not exist in the data.

### 4. Data Quality — 7.2/10
*Up from 6.8 in v5.*

The three primary data bugs are resolved: Topuria is now Featherweight Champion (correctly filterable under FW), Yakhyaev has an inline SVG fallback with no external request, and PH_CDN is gone entirely.

**Remaining issues:**
- **Women's Strawweight mismatch.** Jandiroba (`weight: "Strawweight"`), Ricci (`weight: "Strawweight"`), Gatto (`weight: "Strawweight"`), and Barbosa (`weight: "Strawweight"`) are all Women's Strawweight fighters. Their fighter cards display the weight class as "Strawweight" rather than "Women's Strawweight". The filter button labeled STR does surface them correctly, but the card display is wrong.
- **Aspinall listed as "Interim Champ."** As of early 2026 Aspinall is the undisputed Heavyweight Champion following Jones' retirement/vacating. He should be `rank: "Champion"`. Jones should be `rank: "Inactive"` or the fight scheduled.
- **McGregor listed as Welterweight.** McGregor's natural division is Lightweight (and to a lesser extent Featherweight). He only fought at Welterweight twice. Listing him as Welterweight rank "Inactive" is technically defensible but misleads users who search for him under LW.
- **Simulator stat bars show winner-only stats.** In the "Statistical Breakdown" section of the simulator, all four bars (Striking Edge, Takedown Avg, Str. Accuracy, Finish Rate) show the winner's stats in isolation. There is no comparison bar for the loser. A user cannot tell whether a 57% accuracy bar is dominant or merely average without the opponent's number alongside it.

### 5. Performance — 8.8/10
*Up from 8.5 in v5.*

Zero external dependencies remaining. PH_CDN and `via.placeholder.com` are fully eliminated. All images are local PNGs or inline SVG data URIs. The Spark animation additions (CSS keyframes, transitions) are GPU-compositable properties (`transform`, `box-shadow`) and do not cause layout reflow. The idle `btnGlow` animation on the sim button is perpetual — a marginal battery/performance cost on mobile, but negligible in practice.

The one-sided probability bar renders a single animated div via `requestAnimationFrame` — clean.

### 6. Accessibility — 7.2/10
*Up from 6.8 in v5.*

The focus-visible ring is the most meaningful accessibility improvement in several audits. Every interactive element now has a visible 2px gold outline on keyboard focus. This closes the most serious gap that had existed since v1.

BW filter button now has `aria-label="Bantamweight"` — matching the other filter buttons added in the earlier pass.

**Remaining gaps:**
- **Simulator run button has no aria-label.** `#sim-run-btn` has `aria-label="Run fight simulation"` in index.html (line 103) — this is set. However the button content is `&#9654;&nbsp; Run Simulation` — the play triangle may still be read literally by some screen readers before the aria-label overrides it. The aria-label should prevent issues in compliant readers, but the hidden character is not `aria-hidden`.
- **Win-prob hero percentages have no screen reader context.** The large `44px` numbers render as bare percentages (`68%`, `32%`) with a last-name label below. Screen readers will announce "68% MOICANO VS 32% DUNCAN" without the word "win probability." Adding `aria-label="Renato Moicano win probability: 68%"` to the `.win-prob-hero-fighter` divs would fix this.
- **Method grid items have no ARIA role.** The KO/TKO, Sub, and Decision cells are plain divs. Wrapping with `role="img"` or `aria-label` would provide context to non-visual users.
- **Fighter initials fallback divs** rendered by the faceoff template (`fight-faceoff-initials` class) are still raw text nodes with no `aria-hidden`. Minor.

### 7. Overall App Feel — 7.6/10
*Up from 7.3 in v5.*

This is the most substantive single-version improvement the app has made since v3. Five previously flagged bugs were fixed (VALUE badge, BW filter, Yakhyaev, Topuria, fight row navigation), plus three user-visible feature enhancements landed (win-prob hero, sim reveal, Spark polish). A real UFC fan opening this today would see something that feels genuinely considered — the prediction card hierarchy is strong, the micro-interactions are professional, and the betting tab finally looks correct.

The gap to 8.0 is now about quality rather than bugs. The one-sided probability bar, the deterministic simulator, and the women's weight class labels are the visible items that would strike a knowledgeable user as rough edges. The path to 8.0 requires the simulator to feel alive, the probability bar to be a real split visualization, and the data labels to be accurate for every fighter on the card.

---

## Score History

| Audit | Date       | Score | Key Addition |
|-------|------------|-------|--------------|
| v1    | 2026-04-03 | 6.0   | Baseline — 5 tabs, static data |
| v2    | 2026-04-03 | 6.7   | Fighter photos (CDN), prob range widened, 40+ fighters in DB |
| v3    | 2026-04-04 | 7.2   | Hero banner with fighter photos, face-off layout, local images, AI narratives |
| v4    | 2026-04-04 | 7.3   | Predictions/Betting event grouping, fighter search, design consistency |
| v5    | 2026-04-04 | 7.3   | ESPN_CDN dead code removed, sim-result CSS merged (no user-visible change) |
| v6    | 2026-04-04 | 7.6   | Win-prob hero display, fight row nav, VALUE badge fixed, BW filter, Spark polish |

---

## Overall Score: 7.6 / 10

Up 0.3 from v5. The four carry-over bugs are resolved, fight rows are interactive, and the win-probability hero display is a genuine product improvement that raises the visual ceiling. The app is now in the range where a motivated UFC fan would bookmark it. It is not yet at the level where a UFC fan would choose it over Tapology (8.0+) because the simulator feels static, the data has a handful of visible inaccuracies, and the probability visualization has a functional gap (one-sided bar).

---

## Top 3 Priorities for v7

### Priority 1: Fix One-Sided Probability Bar in Predictions
`renderPredictions()` in main.js only renders `.win-prob-bar-fill.f1` (the red fill at `pred.f1WinProb`%). The bar ends at the f1 percentage and shows empty grey for the rest — a user reading it cannot see the f2 probability as a visual share. Replace the single fill with a two-segment bar: f1 fill (red) animated to `pred.f1WinProb`% width, and f2 fill (gold) taking the remainder. Both `.win-prob-bar-fill.f1` and `.win-prob-bar-fill.f2` CSS classes exist and are styled — they just need to both be rendered in the HTML template. This is a two-line template change in `renderPredictions()`.

### Priority 2: Add Variance to Simulator Output
The simulator uses a fully deterministic formula — same two fighters always return the same probability, method, and round. Add a small seeded random offset (±3–5 percentage points, capped at the 15–85% bounds) so repeated runs feel like different simulations. Even a `Math.random() * 0.08 - 0.04` offset on `f1WinProb` before clamping would make the tool feel alive. Simultaneously, add a CSS transition on `.sim-result` instead of the current `display: none` → `display: block` toggle — a `fadeInUp` or `opacity` transition would make the reveal feel polished rather than abrupt.

### Priority 3: Fix Women's Weight Class Labels + Aspinall Rank
Two data accuracy fixes:
- `main.js` EXTRA_FIGHTERS: Change `weight: "Strawweight"` to `weight: "Women's Strawweight"` for `virna-jandiroba`, `tabatha-ricci`, `melissa-gatto`, and `dione-barbosa`. Their cards currently display the wrong gender division.
- `main.js` FIGHTERS: Change `tom-aspinall` `rank: "Interim Champ"` to `rank: "Champion"`. Jones is inactive/retired and Aspinall is the undisputed Heavyweight champion.

---

## Bonus Notes (Lower Priority)

- **One-sided sim breakdown bars** — The "Statistical Breakdown" section in the simulator shows winner stats only. Adding a second bar row for the loser's same stat (or a two-sided split bar) would make the comparison meaningful.
- **Events → specific prediction card** — Fight row click navigates to Predictions tab top. Anchoring to the specific prediction card (via `data-fight-id` + `getElementById` + `scrollIntoView`) would close the navigation loop fully.
- **Win-prob hero name overflow** — `.win-prob-hero-name` has no `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`. Long last names bleed on narrow cards.
- **Logo octagon clip-path** — `.logo-icon` uses `border-radius: 6px`. Replacing with `clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)` would create a true octagon in 5 minutes.
- **McGregor weight class** — Listed as Welterweight. Natural home is Lightweight. Minor but affects filter accuracy.
- **Sim button aria character** — `&#9654;` play triangle is before the aria-label text. The aria-label overrides it in compliant readers but `aria-hidden="true"` on the character span would be cleaner.
- **`section-badge.gold` split rule** — Still defined at line 165 (background/color) and referenced again in the animation block. Not a bug, cascade is correct, but consolidating would remove the ambiguity.
