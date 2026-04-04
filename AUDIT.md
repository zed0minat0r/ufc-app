# FightIQ — Nigel Audit v3
**Date:** 2026-04-04
**Auditor:** Nigel (Strict Auditor)
**Live Site:** https://zed0minat0r.github.io/ufc-app/
**Previous Audits:** v1: 6.0 | v2: 6.7 | v3: 7.2

---

## Scoring Calibration
- 5.0 = average/basic | 6.0 = generic template | 7.0 = genuinely better than most (HIGH bar)
- 8.0 = user would choose over competitors | 9.0 = award-worthy

**Benchmark:** ESPN, UFC.com, Tapology

---

## What Changed Since v2 (6.7)

Five significant changes landed since the last audit:

1. **Hero banner with fighter photos** — Moicano and Duncan now appear face-to-face in the hero with red/blue gradient sides and a probability bar beneath. This is the most impactful UI change the app has shipped.

2. **Face-off layout for main/co-main events** — Main event and co-main bouts now render in a portrait-photo face-off style with fighter names, records, VS label, and weight class. Prelims remain compact rows.

3. **All 43 fighter photos stored locally** — Eliminated the UFC CDN hotlink-blocking issue. All images are served from GitHub at `./fighters/{slug}.png`. Zero image load failures.

4. **AI fight narratives on all 3 tabs** — `generateFightNarrative()` produces 2-3 sentence breakdowns explaining why the model picks the winner, what method is expected, and confidence level. Appears in Predictions, Betting, and Simulator.

5. **All 40+ fighters visible in database** — `ALL_FIGHTERS = { ...FIGHTERS, ...EXTRA_FIGHTERS }` now correctly populates the Fighters tab. Previously only 15 fighters showed; now all 43 do.

---

## Category Scores

### 1. Visual Design — 7.3/10

The hero banner is now the app's strongest visual element. Fighter photos appearing face-to-face with a gradient background and the AI probability bar beneath feels intentional and sports-media adjacent. This is a genuine step up from v2.

The face-off layout for main/co-main events is also well-executed — large portrait photos, clean VS label, weight class — and clearly differentiates this from a basic fight schedule list.

**Issues:**
- The f2 (right-side) fighter in both the hero banner and the faceoff rows uses a blue gradient (`rgba(59,130,246,0.06)` and `rgba(59,130,246,0.08)`). Blue has no relationship to the app's design language (red/gold/dark). It looks like a copy-paste from a generic sports template. Use a neutral or gold tone instead.
- The fighter card `.fighter-avatar` no longer has explicit dimensions. It has `flex-shrink: 0` and no width/height, relying entirely on the child `.fighter-photo--lg` (120×140px) to define its size. This works but the CSS comment `/* fighter-avatar sizing is handled in the main .fighter-avatar block above */` at line 1753 is a lie — the block above does not set dimensions either. One deleted duplicate block left the container dimension-less.
- Logo is still a plain red square with "U". A UFC octagon silhouette or gloves SVG would immediately elevate the brand identity. This is the first thing a user sees.

### 2. Mobile UX (375px) — 7.0/10

The hero face-off at 375px: 100px + 54px center + 100px = 254px minimum, leaving ~121px for margins. Fits. The fighter names truncate appropriately at 13px.

The fight list is readable at 375px. Prelim rows are compact and clear. Main/co-main face-off cards are the right call for featured bouts.

**Issues:**
- **CSS conflict on hero banner at 480px:** The old `@media (max-width: 480px)` block sets `.hero-banner { padding: 18px 16px; }`. The new hero design uses `padding: 0` on the banner with inner `.hero-header` handling its own spacing. On phones ≤480px, this stale rule adds 18px outer padding to the entire banner container — visually pushing the hero-header and fighter photos inward and adding double spacing. This is a visible bug on iPhones.
- Fighter filter buttons cover only 6 weight classes: HW, LHW, MW, WW, LW, FW. No Flyweight, Strawweight, or Women's filter. Six fighters in the database (Jandiroba, Ricci, Van, Taira, Gatto, Barbosa) cannot be filtered to — they only appear under "All." For a UFC card with Women's Strawweight and Flyweight bouts, this is an obvious gap.
- Tab bar: 5 tabs at 375px require scroll. `overflow-x: auto` handles this, but there's no visual indicator (gradient fade at edges) showing the user the bar is scrollable. Users often don't discover horizontal scroll on tab bars.

### 3. Features — 7.2/10

Five fully functional tabs with real logic. The AI narratives are the standout new feature — they elevate the app from "stats display" to "analysis tool." The simulator is genuinely fun and responsive.

**Issues:**
- The Predictions tab shows all fights from all events in a flat grid with no event grouping or separator. Once more events are added, a user cannot tell which card a fight belongs to without reading the weight class.
- No Fighters tab search. With 43 fighters, "All" is a long scroll. Even a basic `<input type="text">` filter would be a quality-of-life win.
- The simulator still uses `Math.floor(Math.random() * 3) + 1` for KO/Sub round number — running the same matchup twice gives different round results. Deterministic output would feel more like "AI analysis" and less like a random number generator.

### 4. Data Quality — 6.5/10

**Critical bug:** `./fighters/alexander-volkov.png` contains the wrong fighter. The file was downloaded from the URL `VOLKANOVSKI_ALEXANDER_BELT_01-31.png` — Alexander Volkanovski, the Featherweight champion — not Alexander Volkov, the Heavyweight. Any user who knows UFC will immediately notice Alexander Volkov's card showing Volkanovski's face. This needs to be fixed with the correct Volkov image.

Fight card data (Moicano vs Duncan, April 4) and UFC 327 (Prochazka vs Ulberg, April 11) are accurate and well-structured.

Yakhyaev remains on placeholder — acceptable since UFC has no headshot for him yet.

**Accepted limitations:**
- Stats are manually curated, not live — values could drift from Tapology/UFCStats over time.
- No pre/after-hours fight result updates.

### 5. Performance — 8.5/10

Excellent. Zero external API calls on load. All 43 fighter images are served locally from GitHub Pages. No JavaScript dependencies. The entire app loads from 3 static files totaling ~3,100 lines. Render is essentially instant.

This is a genuine strength versus competitor apps (ESPN, Tapology) which hammer external APIs.

**Minor issues:**
- No service worker or offline support — acceptable for a static demo.
- `via.placeholder.com` is still referenced as a fallback in `getFighterImage()`. For a fighter without a local image, this makes an external request.

### 6. Accessibility — 6.5/10

Improvements since v2: `role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls` are all correctly set on the tab bar.

**Remaining issues:**
- Tab panels (`div.tab-panel`) lack `role="tabpanel"` and `aria-labelledby` attributes. Screen reader tab navigation announces the tab but the panel has no semantic role.
- `.fight-faceoff-initials` divs (fallback for fighters without photos) have no accessible label.
- The simulator run button text contains a Unicode `▶` character that may not be read by all screen readers. `aria-label="Run fight simulation"` would fix this.
- `<h3>Pick Any Two Fighters</h3>` inside the simulator panel has no preceding h2 — heading hierarchy skips a level.

### 7. Overall App Feel — 7.2/10

This is a meaningfully different app from v2. The hero banner with fighter portraits facing off under an AI probability bar is the clearest signal that this was built for UFC specifically, not adapted from a generic sports template. The AI narratives in the Predictions and Betting tabs create a "scouting report" feel that ESPN doesn't offer at this level of granularity.

**What prevents 7.5+:**
- The wrong fighter photo (Volkov/Volkanovski bug) is immediately credibility-destroying for any UFC fan.
- The blue gradient on the f2 side of every face-off is an aesthetic mismatch with the design system.
- The fighter filters don't cover Women's divisions despite the card featuring two women's bouts.
- The app still has no distinctive identity marker — a real brand would have an octagon motif, proper logomark, or distinctive typographic treatment.

---

## Score History

| Audit | Date       | Score | Key Addition |
|-------|------------|-------|--------------|
| v1    | 2026-04-03 | 6.0   | Baseline — 5 tabs, static data |
| v2    | 2026-04-03 | 6.7   | Fighter photos (CDN), prob range widened, 40+ fighters in DB, model odds reframing |
| v3    | 2026-04-04 | 7.2   | Hero banner with fighter photos, face-off layout, local images, AI narratives |

---

## Overall Score: 7.2 / 10

Up from 6.7. The hero banner redesign and face-off fight card layout are the highest-ROI changes shipped so far. AI narratives are genuinely differentiating. The app now clears the "genuinely better than most" threshold. The path to 7.5+ runs through fixing the Volkov photo bug, removing the off-brand blue gradient, and adding missing weight class filters.

---

## Top 3 Priorities for v4

### Priority 1: Fix Alexander Volkov's Photo
`./fighters/alexander-volkov.png` contains Alexander Volkanovski's image (wrong fighter — downloaded from wrong URL). Fetch and replace with the correct Volkov headshot from `https://www.ufc.com/athlete/alexander-volkov`. This is a credibility bug — any UFC fan will notice immediately.

### Priority 2: Remove the Blue Gradient from f2 Faceoff Sides
Three CSS rules use `rgba(59,130,246,...)` blue for the right-side fighter: `.hero-banner::before`, `.hero-fighter--right`, and `.fight-faceoff-fighter.f2`. Blue is completely absent from the design system (red/gold/dark). Replace with neutral dark or subtle gold tint. A red-left / gold-right treatment would be more on-brand and differentiated.

### Priority 3: Add Flyweight, Strawweight, and Women's Filter Buttons
The fighter database has 6 fighters in divisions not covered by any filter button (Jandiroba, Ricci, Van, Taira, Gatto, Barbosa). Add `FLY`, `STR`, and `W-STR` filter buttons to `index.html`. The co-main event on April 4 is a Women's Strawweight bout — users looking for those fighters via the filter will find nothing.

---

## Bonus Notes (Lower Priority)

- **Stale hero padding:** Remove `.hero-banner { padding: 18px 16px; }` from the `@media (max-width: 480px)` block — conflicts with the new zero-padding hero design and adds unwanted outer padding on small phones.
- **Tab scroll indicator:** Add a subtle right-edge gradient on the tabs container to signal horizontal scrollability on mobile.
- **Simulator determinism:** Replace `Math.floor(Math.random() * 3) + 1` for round number with a deterministic value derived from fighter stats so the same matchup always produces the same result.
- **Logo upgrade:** Replace the plain red square "U" with an SVG octagon outline or crossed-gloves icon. Takes 20 minutes, makes the header feel legitimate.
- **Placeholder fallback:** Replace `via.placeholder.com` external calls in `getFighterImage()` with an inline SVG data URI showing fighter initials. Eliminates the last external dependency.
