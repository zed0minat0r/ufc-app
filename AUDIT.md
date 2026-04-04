# FightIQ — Nigel Audit v10
*Date: 2026-04-04 | Auditor: Nigel (strict mode) | Benchmark: ESPN, UFC.com, Tapology*

---

## What Changed Since v9

The v9 priorities were addressed in the current commit:

1. **Hero banner now prioritizes PPV** — `renderHero()` uses `UPCOMING_EVENTS.find(e => e.type === 'ppv') || UPCOMING_EVENTS[0]`. On UFC 327 fight week, the hero correctly shows Prochazka vs. Ulberg instead of the Fight Night card. The hero event label now reads "PPV Main Event" vs. "Fight Night Main Event" dynamically. This was the single highest-impact fix requested in v9.

2. **Fighter profile modal implemented** — Full tap-to-expand modal on fighter cards. Includes: photo (with SVG fallback), name, nickname, record, weight class, rank, stance, reach, style, all 8 stats in two 4-column grids, and a "Simulate vs…" button that pre-fills Simulator Fighter 1 and navigates to the tab. Escape key closes, overlay click closes, focus snaps to close button on open. `role="dialog"`, `aria-modal="true"`, `aria-labelledby` all correct. Keyboard Enter/Space on fighter cards triggers the modal. This was the largest outstanding feature gap vs. Tapology.

3. **Title fight label logic updated** — Predictions and Betting tabs now show "· Title Fight" for fights where `fight.title === true` OR `fight.tier === 'main'`. A TITLE badge renders inline for explicitly flagged title fights. The data, however, does NOT have `title: true` flags on any UFC 327 main-card fights (Chimaev vs Du Plessis, Muhammad vs Edwards), so those two bouts still appear without title indicators in practice.

4. **UFC 327 confirmed as 2-fight card** — The data correctly reflects the actual confirmed card: Prochazka vs. Ulberg (main) and Van vs. Taira (co-main). This is accurate and not a data error.

---

## Category Scores

### 1. Visual Design — 7.6 / 10

**What works:**
- Hero banner is the strongest element on the page. PPV prioritization now means it always shows the marquee fight during fight week. The red/gold split probability bar animates cleanly and is instantly readable.
- Dark card system with subtle gradient borders looks intentional and premium — not bootstrap.
- The event card face-off layout (photo + VS + photo for main/co-main) is the best execution of an event card in any free UFC tracker.
- Fighter profile modal is well-designed. The 4-column stats grid, photo with SVG fallback, and header layout match the aesthetic of the rest of the app. The `modalFadeIn` animation is smooth.
- Typography is consistent and tight: Inter 800/900, letter-spacing, uppercase used purposefully.
- Gold pulse animation on "ML MODEL" badge is a smart signal.

**Issues:**
- The sim compare section uses `var(--red-bright)` for the "winner" stat value. Red is also the FADE/warning color in the betting tab. A user who has browsed Betting then returns to Simulator will see red stat values and associate them with a negative signal. This is a semantic color conflict.
- The Statistical Breakdown bars in the simulator still only show winner stats. With the compare section above them, users now see the same data twice — once as a head-to-head, once as winner-only bars. The bars section is redundant and adds visual noise.
- `var(--grey)` (#888888) on `var(--black)` (#0a0a0a) is ~4.4:1 contrast — just under WCAG AA 4.5:1. Affected: `.hero-fighter-record` (11px), `.fight-faceoff-record` (10px), `.f-stat-label` (9px), `.fight-faceoff-weight` (8px), `.hero-weight` (8px), `.hero-ai-label` (10px). All fail WCAG AA at their font sizes.
- The modal close button is 32×32px — below the 44×44px WCAG touch target minimum.

---

### 2. Mobile UX (375px) — 7.2 / 10

**What works:**
- Tabs are scrollable with `overflow-x: auto` and a fade-right gradient indicating overflow. All 5 tabs are reachable without a zoom.
- `@media (max-width: 390px)` breakpoint adds specific fixes: `win-prob-hero-pct` scales from 56px to 42px, `pred-pick` wraps, `odds-fighter` truncates. These were correct and intentional.
- Hamburger menu works; `min-height: 44px` on `.filter-btn` and `.prelim-toggle-btn` meets touch target specs.
- Simulator stacks to single-column select layout at 480px. Selects have `min-height: 44px` at 390px.

**Issues:**
- The fighter profile modal has `max-height: 85vh` and `overflow-y: auto`. On a 375px phone in portrait (667px viewport), the modal is ~567px max. The stats grid (two 4-column rows) and header can push close to the bottom. Users may not realize the modal scrolls — there's no scroll indicator or fade gradient on the modal content.
- The sim fighter compare section header shows two fighter last names. On 375px, names like "Prochazka" and "Murzakanov" will overflow or truncate with no ellipsis applied in `.sim-compare-header .sim-compare-name`. No `overflow: hidden` or `text-overflow: ellipsis` is set for that class.
- `fighter-modal-stats-grid` uses 4 columns at all widths. On 375px, 4-column stat cells are ~84px wide each, making the `font-size: 18px` stat values tight. No mobile override exists.
- Prelim section `max-height: 1000px` transition creates a slow expand when 4 prelims are collapsed — visible lag on low-end mobile.

---

### 3. Features — 7.8 / 10

**What works:**
- **Fighter profile modal** is the biggest new feature and it genuinely delivers: photo, identity, 12 stats, stance/reach, and a "Simulate vs…" shortcut. This closes the main dead-end on the Fighters tab. Tapology shows more historical data, but FightIQ's modal is faster and cleaner.
- **Hero PPV prioritization** means users landing on the app this week see the UFC 327 card, not the Fight Night prelim card. Correct editorial decision.
- **Prediction filters** (All / PPV Only / Fight Night / Main Events) work correctly, including the `data-tier` filtering for main events only.
- **Simulator variance** (±4% noise per run) makes re-running feel like a legitimate model re-sample rather than a static lookup.
- **Betting tab** with model-implied vs. simulated book odds gives the app a concrete use case beyond curiosity.

**Issues:**
- The "Simulate vs…" button in the modal pre-fills Fighter 1 only. Fighter 2 remains whatever was last selected. A user tapping "Simulate vs…" from a fighter card has no way to know who they'll be simulating against. A cleaner UX would show the current Fighter 2 selection inline, or default F2 to a relevant upcoming opponent.
- No back-navigation from Predictions to the specific event that triggered the click. Fight row click → Predictions tab scrolls to top, but doesn't highlight or scroll to that fight's prediction card.
- The `title: true` flag infrastructure exists in code (both `renderPredictions` and `renderBetting` check `fight.title`), but no fights in `UPCOMING_EVENTS` actually have `title: true` set. The two Middleweight and Welterweight title fights on UFC 327 (if the card had them) would be silently unlabeled.
- No "next event" countdown timer or date-relative display ("5 days away"). UFC.com and Tapology both show event proximity prominently.

---

### 4. Data Quality — 7.0 / 10

**What works:**
- UFC Fight Night (April 4) has complete fighter data for all 8 fights including all prelim fighters. Every fight resolves through `ALL_FIGHTERS` — no placeholder fallbacks on this card.
- UFC 327 (April 11) correctly shows 2 fights. This accurately reflects the confirmed card. Not a data issue.
- Holloway is correctly ranked #1 (not Champion), Miocic correctly marked Retired. Previous corrections from v9 hold.
- Fighter stats (SLpM, accuracy, TD avg) are plausible approximations based on publicly available UFC stats.

**Issues:**
- `azamat-murzakanov` is listed with `weight: "Middleweight"` in `EXTRA_FIGHTERS`. This was flagged in v9 but remains: Murzakanov competes at Light Heavyweight. His record (13-1-0) is also stale — he has more UFC appearances now.
- `dricus-du-plessis` is listed as `rank: "#1"` in `FIGHTERS`. He is the Middleweight Champion. His rank should be "Champion". This is directly contradicted by `khamzat-chimaev` who is listed as `rank: "Champion"` for the same weight class. Conflicting data for the same division title.
- Several fighter records appear outdated relative to April 2026 (e.g. `israel-adesanya` at 24-4-0 — he has fought since). These are cosmetic approximations, but they undermine the app's credibility when users cross-reference.
- The prediction model uses `calcRecordEdge()` which weights raw win % from the record string. This means a 10-0 regional circuit fighter would score comparably to an elite 10-0 UFC fighter. The model doesn't account for opponent quality at all.
- `stipe-miocic` is marked "Retired" but still appears in the simulator roster. He retired after the Jones fight (Nov 2023) and shouldn't be a selectable match candidate for current events.

---

### 5. Performance — 8.0 / 10

**What works:**
- Single-file architecture: one HTML, one CSS, one JS. No framework, no build step, no CDN dependencies beyond Google Fonts. The entire app loads in one round-trip after DNS resolution.
- `loading="lazy"` on non-hero fighter images. Hero images use `loading="eager"` correctly.
- SVG fallback is inline data URI — zero additional network requests on image failure.
- `requestAnimationFrame` for bar animations prevents layout thrash.
- Count-up animation uses `performance.now()` with ease-out cubic — smooth and CPU-efficient.
- No JS bundle split needed at this size (~1,445 lines of JS). Page weight is negligible.

**Issues:**
- All data (`FIGHTERS`, `EXTRA_FIGHTERS`, `UPCOMING_EVENTS`) is hardcoded in `main.js`. The entire 47-fighter dataset loads on page init regardless of which tab is active. Not a real problem at current scale, but it will degrade if the app grows to 150+ fighters.
- `renderPredictions()` and `renderBetting()` both call `predictFight()` for every fight independently. The same matchup is computed twice (once per tab). Results can differ due to the variance noise added in `runSimulator()` — but the betting tab uses raw `predictFight()` output without variance, so at least that's consistent. The duplication is still inefficient.
- `prelim-section` `max-height: 1000px` transition is an anti-pattern. On a section with exactly 4 fights (~320px of content), the animation takes the full duration to reach 320px then abruptly stops. Use `ResizeObserver` or measure `scrollHeight` for a smooth collapse.

---

### 6. Accessibility — 7.0 / 10

**What works:**
- Fighter modal has full ARIA: `role="dialog"`, `aria-modal="true"`, `aria-labelledby="modal-fighter-name"`, Escape key close, overlay click close, focus trap to close button on open.
- Fighter cards have `role="button"`, `tabindex="0"`, `aria-label="View [name] profile"` and respond to Enter/Space keydown. This is correct.
- `aria-live="polite"` and `aria-atomic="true"` on `#sim-result` so screen readers announce simulation results.
- Tab system uses `role="tab"`, `aria-selected`, `aria-controls`, `role="tabpanel"`, `aria-labelledby`. Correct ARIA tab pattern.
- `focus-visible` outlines on all interactive elements in gold. Keyboard navigation is usable.
- `prelim-toggle-btn` updates `aria-expanded` correctly on toggle.

**Issues:**
- The fighter modal close button is 32×32px. WCAG 2.5.5 (Level AAA) requires 44×44px; 2.5.8 (Level AA, WCAG 2.2) requires 24×24px minimum target with no adjacent targets. At 32px it passes the letter of AA but fails best practice and is too small for one-handed mobile use.
- `.fight-row` elements have `cursor: pointer` and a click handler but no `role="button"` and no `tabindex`. A keyboard user cannot focus or activate these rows. The navigation-to-Predictions shortcut is invisible to keyboard/screen reader users.
- The fight-row click handler navigates to the Predictions tab but gives no contextual feedback. No `aria-label` describes the row's purpose ("Click to view predictions for this fight"). A sighted user can infer this from hover styling; a screen reader user cannot.
- Modal focus trap is partial: focus is set to the close button on open, but there's no Tab key cycling that keeps focus within the modal. A keyboard user tabbing past the "Simulate vs…" button will reach background content.
- The `&#9654;` play triangle in `.sim-run-btn` is present in the accessibility tree unnecessarily (button has `aria-label` but the triangle character is not `aria-hidden`).
- `var(--grey)` text contrast remains under WCAG AA 4.5:1 (as noted in v9, unresolved).

---

### 7. Overall App Feel — 7.9 / 10

FightIQ v10 is the best version yet. The fighter profile modal transforms the Fighters tab from a stat-browsing dead end into a genuine lookup tool. The PPV hero prioritization means the app now makes correct editorial decisions automatically — the UFC 327 main event card is front-and-center during fight week without any user configuration.

**What pushes it to 7.9:**
- A user opening the app on fight week sees: UFC 327 hero banner with Prochazka vs. Ulberg odds, Fight Night card for tonight, full prediction cards for both events, and can now tap any fighter to get a full profile with all stats and a simulator shortcut. This is a complete fight-week experience.
- The modal interaction feels native. The `modalFadeIn` animation, SVG fallback, backdrop blur, and Escape-to-close all meet the quality bar of a polished product.
- The simulator compare section + variance + method prediction gives users a reason to run the sim multiple times.

**Where 7.9 stops at 8.0:**
- Du Plessis is listed as rank "#1" when he should be "Champion." If a user notices this, trust in the data drops immediately.
- The Statistical Breakdown bars in the simulator duplicate the compare section. The app has redundant UI that makes it feel slightly unpolished.
- Full focus trap in the modal is missing — advanced keyboard users will notice.
- No countdown to event ("5 days away") — a small but noticeable gap vs. UFC.com and Tapology.

For a user coming from Tapology: FightIQ now offers a cleaner fighter lookup (faster modal vs. Tapology's full-page load), a unique fight simulator, and competitive event data. The gap is live results, historical fight data, forum/community features, and verified real-time odds. FightIQ is now a legitimate pre-event research tool.

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
| v10 | 7.9 | Fighter profile modal, PPV hero prioritization, title fight label logic |

---

## Overall Score: 7.9 / 10

Score improves from 7.8 to 7.9. Both major v9 priorities were shipped (fighter modal, PPV hero). The third priority (title fight labels) was structurally implemented in code but the data flags were never set, so it has no visible effect. The fighter modal closes the largest feature gap vs. competitors. The data issue (Du Plessis rank conflict) and the redundant breakdown bars are the main drag on an 8.0.

---

## Top 3 Priorities for v11

### Priority 1: Fix Du Plessis Rank and Add Title Flags to UFC 327 Data
`dricus-du-plessis` in `FIGHTERS` is `rank: "#1"` while `khamzat-chimaev` is `rank: "Champion"` — two fighters cannot hold the same Middleweight title simultaneously. Du Plessis is the current Middleweight Champion. Change:

```js
// In FIGHTERS object:
"dricus-du-plessis": { ..., rank: "Champion", ... }
```

Then add `title: true` to the two title bouts in `UPCOMING_EVENTS` (if the UFC 327 card grows to include them). The label infrastructure already exists in `renderPredictions()` and `renderBetting()` — it just needs the data flags. Also fix `azamat-murzakanov` weight from `"Middleweight"` to `"Light Heavyweight"` in `EXTRA_FIGHTERS`. These are 3-line data fixes that eliminate verifiable factual errors.

### Priority 2: Remove Redundant Simulator Breakdown Bars
The "Statistical Breakdown" section in `.sim-breakdown` shows 4 winner-only stat bars (Striking Edge, Takedown Avg, Str. Accuracy, Finish Rate). The `.sim-fighter-compare` section directly above it already shows SLpM, Str Acc, and Finish % as head-to-head comparisons. The bars duplicate the same data in a less informative format. Remove the entire `.sim-breakdown` div and its CSS. Alternatively, replace the 4 winner-only bars with 4 head-to-head compare rows (adding TD Avg as the fourth row to the existing compare section). The net result: cleaner layout, no redundant data, and the compare section becomes more comprehensive. This is a deletion that improves quality — the best kind of change.

### Priority 3: Fix Modal Focus Trap and Close Button Size
Two accessibility issues in the fighter modal that require ~20 lines of JS and 2 CSS property changes:

**Focus trap**: In `initFighterModal()`, add a `keydown` listener on the modal that intercepts Tab/Shift+Tab and cycles focus between the close button and the "Simulate vs…" button only while the modal is open:
```js
modal.addEventListener('keydown', (e) => {
  if (e.key !== 'Tab' || modal.hasAttribute('hidden')) return;
  const focusable = modal.querySelectorAll('button, [tabindex="0"]');
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
```

**Close button size**: Change `.fighter-modal-close` from `width: 32px; height: 32px` to `width: 44px; height: 44px`. Adjust `top: 8px; right: 10px` to compensate. These two fixes together bring the modal to full WCAG 2.2 AA compliance.

---

*FightIQ at v10 is a polished, content-complete fight predictor with a genuine fighter lookup feature. The gap to 8.0 is three targeted fixes: data accuracy (3 lines), UI redundancy removal (deletion), and modal accessibility (20 lines + 2 CSS rules). None require new features or a backend.*
