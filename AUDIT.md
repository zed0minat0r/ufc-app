# FightIQ — Nigel Audit v12
*Date: 2026-04-04 | Auditor: Nigel (strict mode) | Benchmark: ESPN, UFC.com, Tapology*

---

## What Changed Since v11

The v11 priorities were all addressed in the current commit:

1. **Fight row keyboard accessibility added** — `.fight-row` elements now have `role="button"`, `tabindex="0"`, and `aria-label="View predictions for [f1.name] vs [f2.name]"`. A `keydown` listener fires `row.click()` on Enter or Space. This resolves the WCAG 2.1 AA gap flagged in v10 and v11.

2. **Hero countdown timer implemented** — `startHeroCountdown(event.date)` runs a live countdown in the hero banner. Shows `XD XXH XXM` for days-away, flips to `HH:MM:SS` format when under 24 hours, switches to `FIGHT NIGHT — LIVE NOW` (green pulse) when past event time. Styled as a gold pill badge with tabular-nums for stable width. This was the single most glaring feature gap vs. UFC.com and Tapology.

3. **Bottom navigation bar added (mobile)** — Fixed bottom nav with 5 tabs (Events/Picks/Sim/Odds/Fighters), SVG icons, gold active state, `min-height: 44px`, `env(safe-area-inset-bottom)` support for iPhone notch. Active state syncs bidirectionally with tab buttons (both `[data-goto-tab]` click and direct tab button click). Main content pushed up via `padding-bottom: calc(56px + 16px + env(...))`.

4. **Mobile center-alignment additions** — `.pred-filters`, `.section-header`, `.pred-event-header` now center-align in the 480px breakpoint. Previously only the 390px breakpoint had these rules.

**What was NOT addressed from v11:**
- `sim-compare-winner` still uses `var(--red-bright)` for the winning stat in the comparison table. Semantically ambiguous alongside red = FADE in the Betting tab.
- `&#9654;` (play triangle) in sim button has no `aria-hidden` on its span — minor AT noise.
- `var(--grey)` (#888888) contrast on `var(--black)` (#0a0a0a) remains marginally below WCAG AA at small label sizes.
- The countdown is on the hero banner only — event card headers still show the static date string (no "TONIGHT" or "7 DAYS AWAY" inline labels).
- "Simulate vs…" button still pre-selects Fighter 1 only without confirming who Fighter 2 will be.

---

## Category Scores

### 1. Visual Design — 7.7 / 10

**What works:**
- The hero countdown badge is a visual win. Gold pill, uppercase, letter-spacing: 3px, tabular-nums. It integrates cleanly into the hero header section without competing with the matchup photos. The `live` state uses green + `livePulse` animation — correct color semantics (green = active/live vs. gold = upcoming).
- Bottom nav is clean. 10px font, 20px SVG icons, gold active state. The `env(safe-area-inset-bottom)` is correctly applied to both the nav padding and the main content padding-bottom — this is a detail many developers miss and it matters on iPhones.
- The dual-direction active state sync (bottom nav + tab buttons + top nav) is architecturally correct. No stale state possible.
- Previous v11 strengths intact: hero probability bar, modal animation, card gradient system, consistent typography.

**Issues:**
- Bottom nav icon for "Odds" uses a map-pin SVG — visually this reads as "location" not "betting odds." A dollar sign, scales, or chip icon would communicate intent. At 10px font size the label "Odds" helps, but the icon-label mismatch is still a UX friction point.
- The countdown timer shows `1D 05H 23M` format for UFC 327 (April 11). On April 4 this is correct. However, the `startHeroCountdown` function uses `new Date(dateStr + ' 18:00:00')` — this parses as local time, not ET. If a user is in PT (UTC-7), the countdown will be off by 3 hours. UFC events start at roughly 10pm ET / 7pm PT — the 18:00 assumption is also slightly early for the main card. Minor but a real timezone edge case.
- `.sim-compare-winner` is still `var(--red-bright)`. Semantically inconsistent with the Betting tab where red means "fade/lay off." A user toggling between Simulator and Betting will receive contradictory color signals. This was flagged in v10 and remains in v12.
- The `pred-event-header` left-border gold stripe is a nice detail on desktop. On mobile at 390px the `text-align: center` means the border-left stripe now looks disconnected — the text is centered but the visual weight of the stripe is on the left. Minor but noticeable.

---

### 2. Mobile UX (375px) — 7.7 / 10

**What works:**
- Bottom nav is the biggest mobile UX improvement since the app launched. The previous experience had tabs at the top of the screen and a hamburger menu — both require a long reach on a phone held one-handed. Bottom nav eliminates that. 5 items at 44px min-height with icon + label is the standard native mobile pattern. This genuinely feels like an app now, not a website.
- Safe-area-inset handling means iPhone 12/13/14/15 notch devices don't have the nav content clipped. This is correctly implemented.
- Main content padding-bottom calculation (`56px + 16px + safe-area`) is correct — content scrolls fully clear of the nav.
- Center-alignment additions at 480px fill a previous gap where filters and section headers were left-aligned on larger phones (e.g., iPhone 15 Pro Max at 430px) before the 390px rules kicked in.
- Fight rows now keyboard-accessible — Tab navigation through event fights is functional.

**Issues:**
- The bottom nav coexists with the scrollable top tab row. On 375px, the user now has navigation in two places: the tabs strip near the top and the fixed bottom bar. These are not synced visually in the same way — the top tabs use a gold underline with `border-bottom: 2px solid var(--gold)` active state, while the bottom nav uses a gold text/icon color change. Two navigation patterns for the same action creates mild cognitive overhead.
- The top tab row is NOT hidden at mobile. This means the user sees Events/Predictions/Simulator/Betting/Fighters tabs near the top AND the bottom nav. Most mobile apps hide the duplicate. This doubles the chrome and reduces the content area.
- Hero countdown shows `7D 00H 00M` format — not "7 DAYS AWAY." UFC.com and Tapology use natural language proximity labels ("This Saturday," "Tomorrow," "7 days away"). The raw `XD HH:MM:SS` countdown feels more like a product timer than a sports context. At day-granularity, natural language reads better.
- Simulator "Run Simulation" button could be obscured by the bottom nav at 56px height. `padding-bottom` on `main` is set correctly but the button's `scrollIntoView` target after simulation could land behind the nav. `block: 'nearest'` does not account for a fixed bottom offset — `block: 'end'` would be safer.
- No visual scroll indicator at the bottom of the hero area or event cards to signal there's more content below the fold. First-time users may not scroll.

---

### 3. Features — 7.9 / 10

**What works:**
- Live countdown timer on hero banner. At 11 days to UFC 327 (April 15 being far out from April 4 — UFC 327 is April 11, so 7 days), this actually shows real fight-week utility. The `setInterval(update, 1000)` means the display ticks in real time.
- The countdown's `FIGHT NIGHT — LIVE NOW` state with green pulse is a clever micro-feature for the night of the event. Users checking the app on fight night see an instantly recognizable status.
- Fight row keyboard navigation (Enter/Space) closes a genuine accessibility gap and also improves power-user keyboard workflows.
- Fighter profile modal, simulator, betting analyzer, prediction filters all intact and functional from v11.

**Issues:**
- The countdown is only in the hero banner. Event cards still show static date text. A user browsing the Events tab during fight week sees "April 4, 2026" and "April 11, 2026" with no proximity context — they have to calculate mentally. Tapology shows "Tonight," "This Saturday" inline. This is a 5-line JS addition per event card.
- The hero banner prioritizes the PPV (UFC 327) — but today is April 4, fight night for UFC Fight Night: Moicano vs. Duncan. The headline event on the app is a week away, not the event happening tonight. The countdown correctly shows UFC 327 as 7 days away, but the fight happening in hours is buried below. A UFC fan opening the app tonight to follow Moicano vs. Duncan will be confused why the hero banner isn't showing tonight's card.
- "Simulate vs…" modal button still sets Fighter 1 only, with no indication of current Fighter 2. Opening the Simulator to find a default opponent (Tom Aspinall) already selected instead of the fighter you expected is a friction point.
- No fight result/prediction accuracy tracking over time. After UFC Fight Night tonight, the predictions will still show as open. No "COMPLETED" or "RESULT" state for past fights. This becomes a data freshness problem immediately.

---

### 4. Data Quality — 7.2 / 10

**What works:**
- Both events have complete fighter coverage. UFC FN April 4: 8 fights, all resolve from `ALL_FIGHTERS`. UFC 327: 2 fights, both correct (Prochazka vs. Ulberg, Van vs. Taira).
- The MW title conflict from prior audits: v11 commit `b2b8ddb` fixed `dricus-du-plessis` to `rank: "Champion"`. This is correctly resolved — Du Plessis is Champion, Chimaev is `rank: "#1"`.
- `azamat-murzakanov` weight class was fixed to `"Light Heavyweight"` in the same commit. Both v11 data priorities were addressed.
- Fighter stats are plausible-order-of-magnitude approximations for the current roster.

**Issues:**
- `stipe-miocic` appears in the fighter database with `rank: "Retired"` and in the simulator roster. A user selecting Miocic vs. Jones sees a retired fighter being run through an active fight model with no caveat. This has been flagged in v9, v10, and v11.
- `israel-adesanya` record is `24-4-0`. As of April 2026, Adesanya has fought multiple times since this count. The stale record undermines the app's credibility as a reference tool — knowledgeable fans will catch it immediately.
- `conor-mcgregor` record is `22-6-0` with `rank: "Inactive"`. He fought Michael Chandler in TUF 31 in late 2024 — this fight result is not reflected.
- Hero countdown assumes 18:00 local time for UFC events. Actual UFC Fight Night prelims typically start 4pm ET with the main card at 7pm ET, and PPV prelims 6pm ET, main card 10pm ET. The countdown will read "FIGHT NIGHT — LIVE NOW" at the wrong time depending on the user's timezone and device settings, and will almost certainly be 4+ hours early for the main card.
- `calcRecordEdge()` divides wins by total fights with no opponent quality weighting, as noted in prior audits. A 10-0 prospect scores the same record edge as Jon Jones at 27-1. This is the biggest methodological flaw in the prediction model.

---

### 5. Performance — 8.0 / 10

**What works:**
- `setInterval(update, 1000)` for the countdown is fine at this scale. One interval on one element.
- Bottom nav is pure HTML/CSS/JS — no additional dependencies. The inline SVG icons add negligible weight.
- All prior performance strengths from v11 intact: single-file static, lazy loading, RAF-based animations, inline SVG fallbacks.
- Bottom nav uses CSS `display: none / display: flex` toggled by media query — no JS needed to show/hide it.

**Issues:**
- `setInterval` for the countdown is never cleared. On a page that stays open for hours (very plausible on fight night), this is harmless for a single interval — but it's technically a leak. No `clearInterval` on page unload.
- `renderPredictions()` and `renderBetting()` still both call `predictFight()` for each fight independently with no caching. Same matchup is computed twice on every page load. Low cost at current scale, but the structural inefficiency remains from v11.
- `prelim-section.open` still uses `max-height: 1000px` animation — content appears to "pop" open before the transition completes. `ResizeObserver`-based scrollHeight would give a smooth accordion. Flagged since v10.
- The bottom nav adds ~56px of fixed DOM to every mobile viewport. At current scale this is negligible. No concern.

---

### 6. Accessibility — 7.7 / 10

**What works:**
- Fight rows now have `role="button"`, `tabindex="0"`, `aria-label="View predictions for [name] vs [name]"`, and Enter/Space keydown handling. This fully resolves the WCAG 2.1 AA keyboard navigation gap flagged in v10 and v11. Well-implemented.
- `fight-row:focus-visible` gold outline (`2px solid var(--gold)`, `outline-offset: -2px`) is correctly scoped with `:focus-visible` — keyboard focus visible, mouse focus not shown.
- Hero countdown uses `font-variant-numeric: tabular-nums` — digits don't shift layout as the timer ticks. This is an accessibility and UX detail that many miss.
- Bottom nav items have `min-height: 44px` — meets WCAG 2.5.8 touch target.
- All prior modal/tab/fighter-card accessibility from v11 intact.

**Issues:**
- Bottom nav items do not have `aria-label` attributes. The icon + visible text labels are present (e.g., "Events", "Picks"), but `aria-label` on anchor elements would be cleaner for screen readers since the SVG icons have no `role="img"` and no `aria-hidden`. Currently the AT may read the SVG path content.
- Hero countdown element has no `aria-live` region. When the timer ticks every second, screen readers will not announce updates (which is correct behavior — you do NOT want "7D 05H 23M" announced every second). But the element also has no `aria-label` describing what it represents. A `title` attribute or `aria-label="Countdown to event"` would help AT users understand the element.
- `var(--grey)` (#888888) contrast on `var(--black)` (#0a0a0a) remains ~4.4:1, below WCAG AA 4.5:1 at small sizes. Affects `.hero-fighter-record`, `.fight-faceoff-record`, `.f-stat-label`, `.fight-faceoff-weight`, `.hero-weight`, `.hero-ai-label`, `.fighter-modal-stat-label`. This has been flagged since v9 and remains unaddressed in v12.
- `&#9654;` in sim-run-btn still has no `aria-hidden` span wrapper. The button's `aria-label="Run fight simulation"` takes precedence for AT, but the raw unicode character remains in the DOM tree.
- The `bottom-nav-item.active` state has no `aria-current="page"` attribute. Screen reader users navigating through the bottom nav will hear "Events link" not "Events, current page."

---

### 7. Overall App Feel — 8.1 / 10

**Summary judgment:**

The bottom nav is a tier-change improvement for mobile UX. On every previous version of the app, the navigation model was "desktop-first" — tabs at the top, hamburger menu. This was functional but not native-feeling. The fixed bottom nav with SVG icons, safe-area handling, and active state sync transforms the mobile experience from "mobile-capable website" to "app." A UFC fan who uses Tapology or the UFC app on their phone will recognize this pattern immediately and feel at home.

The hero countdown completes the fight-week experience. Opening the app 7 days before UFC 327 and seeing "7D 05H 23M" next to Prochazka vs. Ulberg is genuinely useful. The `FIGHT NIGHT — LIVE NOW` state is a strong micro-feature. Together with the fight predictions and betting analysis already in the app, FightIQ now covers the full pre-event user journey: discover event → get predictions → check simulated odds → look up fighter → countdown to fight time.

**What pushes it to 8.1:**
- Bottom nav brings the mobile experience to modern app standard
- Live countdown adds real temporal context competitors have that FightIQ previously lacked
- Fight row keyboard accessibility closes the last major WCAG 2.1 AA gap
- The full feature set (events, predictions, simulator, betting, fighters, modal, countdown) is now genuinely competitive as a standalone pre-event research tool

**What keeps it at 8.1:**
- Both nav patterns visible simultaneously on mobile (top tabs + bottom nav) — this is redundant chrome that most apps eliminate
- Hero banner prioritizes next PPV, not tonight's card — on actual fight nights this creates a confusing first impression
- Stale fighter records (Adesanya, McGregor) and Miocic retirement status are still live in the database
- Grey text contrast remains below WCAG AA across multiple small labels — 4+ audits without fix
- Event cards still show static dates, no proximity labels ("TONIGHT", "7 DAYS AWAY")

The app at v12 is a legitimately competitive UFC pre-event tool. The gap to 8.5 is: eliminate the dual-navigation redundancy, fix the hero banner fight-night prioritization logic, and update 3-4 stale fighter records.

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
| v11 | 8.0 | Focus trap implemented, close button 44px, redundant sim breakdown bars removed |
| v12 | 8.1 | Bottom nav, live hero countdown, fight-row keyboard accessibility |

---

## Overall Score: 8.1 / 10

Score improves from 8.0 to 8.1. All three v11 priorities were correctly shipped. The bottom nav is the strongest single UX improvement since the fighter modal. The countdown completes the fight-week experience. Fight rows are now fully keyboard-accessible.

---

## Top 3 Priorities for v13

### Priority 1: Hide Top Tab Bar on Mobile / Resolve Dual-Navigation Conflict

The app now has two full navigation systems visible simultaneously on mobile: the horizontal tab strip near the top of the page AND the fixed bottom nav. Both do the same thing. This creates redundant chrome that reduces content area and introduces mild cognitive overhead. Most native apps that adopt a bottom nav hide the in-page tab strip on mobile.

The fix is a single CSS rule:

```css
@media (max-width: 768px) {
  .tabs-wrap {
    display: none;
  }
}
```

This removes the top tab strip on mobile, leaving only the bottom nav as the navigation system. The bottom nav active state is already fully synced with tab state. Content area increases by approximately 50px on mobile. The app feels cleaner and more native.

Cost: 3 lines of CSS. Benefit: eliminates redundant navigation, increases content area, looks more like a real app.

### Priority 2: Tonight's Card Hero Priority Logic

The hero banner currently shows the PPV (UFC 327, April 11) even when a Fight Night event is occurring today (April 4). This is the wrong priority on actual fight nights. A UFC fan opening the app at 7pm ET on April 4 to check the Moicano vs. Duncan card will see "UFC 327 — 7D away" as the hero.

In `renderHero()`, before falling back to the first PPV, check if any event is occurring today:

```js
function renderHero() {
  const today = new Date();
  const todayStr = today.toDateString();
  const tonightEvent = UPCOMING_EVENTS.find(e => new Date(e.date).toDateString() === todayStr);
  const event = tonightEvent || UPCOMING_EVENTS.find(e => e.type === 'ppv') || UPCOMING_EVENTS[0];
  // ... rest of function
}
```

When there is a Fight Night card today, show that in the hero with the countdown showing "FIGHT NIGHT — LIVE NOW" (or "TONIGHT"). The PPV hero is correct every other day. This one logic change fixes the fight-night experience for actual UFC fans using the app on event nights.

Cost: ~5 lines of JS. Benefit: correct hero content on the nights users actually need the app most.

### Priority 3: Add Proximity Labels to Event Cards ("TONIGHT" / "X DAYS AWAY")

The countdown is on the hero banner only. Event card headers show static date strings ("April 4, 2026", "April 11, 2026"). Tapology and UFC.com both surface event proximity inline — "Tonight," "This Saturday," "7 days." This gives users instant temporal orientation without calculating in their heads.

In `renderEvents()`, compute the delta for each event and inject a proximity label into the event card header:

```js
function getProximityLabel(dateStr) {
  const today = new Date();
  today.setHours(0,0,0,0);
  const eventDate = new Date(dateStr);
  eventDate.setHours(0,0,0,0);
  const days = Math.round((eventDate - today) / 86400000);
  if (days === 0) return '<span class="proximity-label tonight">TONIGHT</span>';
  if (days === 1) return '<span class="proximity-label tomorrow">TOMORROW</span>';
  if (days <= 7) return `<span class="proximity-label soon">${days} DAYS</span>`;
  return '';
}
```

Inject this adjacent to the `.event-card-date` in the event card header. Style `.tonight` in green (pulse animation), `.tomorrow` in gold, `.soon` in grey-light. The proximity label replaces the need for users to parse a date string.

Cost: ~15 lines JS + 6 lines CSS. Benefit: users immediately know which events are imminent without mental date arithmetic.

---

*FightIQ at v12 is a polished mobile-first fight companion. The bottom nav alone would justify the score increment. The path to 8.5 runs through: eliminating the redundant dual-navigation (3 lines CSS), fixing the fight-night hero priority (5 lines JS), and adding event proximity labels to card headers (15 lines JS). All three are low-effort, high-impact changes with no architectural cost.*
