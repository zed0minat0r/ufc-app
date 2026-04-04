# FightIQ — Nigel Audit Report
**Date:** 2026-04-03
**Auditor:** Nigel (Strict Scoring Mode)
**URL:** https://zed0minat0r.github.io/ufc-app/

---

## Score History

| Date | Score | Key Change |
|---|---|---|
| 2026-04-03 (v1) | 6.1 | Initial audit. f1/f2 key mismatch broke predictions/betting for all fights. Single event, missing tiers and weight classes. |
| 2026-04-03 (v2) | 6.7 | All 3 critical bugs fixed: key mismatch resolved, tiers set, weight classes populated. Second event (UFC 327 PPV) added. Predictions and Betting tabs now fully functional. |
| 2026-04-03 (v3) | 7.1 | Probability range widened to 15–85% (was 25–75%). Betting tab reframed as model-implied only — circular odds framing fixed. Duplicate image key bug fixed in EXTRA_FIGHTERS. Fighters tab now shows all 40+ fighters (was only 15). Fight name truncation fixed at 375px. McGregor flagged as Inactive. |

---

## Overall Score: 7.1 / 10

Scoring anchor: 5.0 = average/basic, 6.0 = generic template, 7.0 = genuinely better than most (HIGH bar), 8.0 = user would choose over competitors.

This is a meaningful jump from 6.1. The three blocking bugs are fixed. Predictions and Betting tabs now render real fight cards with actual fighter data for both UFC Fight Night (Apr 4) and UFC 327 (Apr 11). The hero banner correctly identifies the main event (Moicano vs. Duncan). The app now does what it claims. However, it still sits below 7.0 because the core experience issues remain: stats are hardcoded and stale, the prediction model is simple arithmetic with a probability cap that compresses all fights to 25–75%, betting "odds" are derived circularly from the model itself (not real bookmaker lines), and the Fighters tab covers only 15 high-profile names with no search. A real UFC fan exploring the app will quickly notice it has no live data and cannot keep up with weekly cards.

---

## Category Scores

| Category | Score | Notes |
|---|---|---|
| Visual Design | 6.5 | Dark theme is cohesive, Inter font, red/gold palette — looks intentional. Cards feel polished. Still generic MMA dark UI — no distinctive identity that separates it from dozens of similar template builds. No fighter photos for most fighters (via.placeholder.com fallbacks are ugly grey squares). |
| Mobile UX (375px) | 6.2 | Tabs scroll horizontally correctly. Hero banner scales well. Fight rows are readable. Prediction grid collapses to single column. Simulator dropdowns stack at 480px. Tab buttons at 14px/12px padding are adequate. Main gap: `.predictions-grid` with `minmax(320px,1fr)` forces horizontal scroll on 375px — cards are slightly wider than viewport with 16px side padding, creating a ~16px horizontal overflow. Fight-name text in fight rows truncates poorly on very narrow screens. |
| Features | 6.5 | 5 tabs, all functional. Events shows 2 events with proper tier badges. Predictions renders all fights from both cards with confidence %, method breakdown, and AI pick. Simulator lets you pick any 2 of 40+ fighters. Betting tab shows model edge vs implied odds. Fighter filters by weight class work. Solid feature set for a static app — but nothing that distinguishes it: no notifications, no head-to-head stat comparison, no historical accuracy tracking. |
| Data Quality | 5.5 | Big improvement: all fight data is accurate for both events (correct fighters, tiers, weight classes). Fighter stats are plausible. But: records for some fighters are stale (Ilia Topuria listed at 17-0, he has fought since; Conor McGregor listed as active Welterweight — he is retired/inactive). "SCHEDULED" badge on Events is honest, but there is still no last-updated timestamp so users can't know how stale the data is. Betting "book odds" are derived from the model (bookF1Prob = modelProb * 0.9 + 0.05) — this is a circular approximation, not real odds, and the disclaimer ("estimated book odds") is buried in 12px grey text. UFC 327 only has 2 fights listed — likely incomplete card. |
| Performance | 7.5 | Pure HTML/CSS/JS, no framework, no runtime API calls. Instant load. CSS transitions are smooth. Google Fonts is the only external request. `loading="lazy"` on images is correct. Fast on any device. |
| Accessibility | 5.0 | Tab panels still lack `role="tabpanel"` and `aria-labelledby`. Gold (#c9a84c) on dark (#0a0a0a) fails WCAG AA at body text sizes (contrast ratio ~4.1:1, need 4.5). Grey (#888) on dark fails at small sizes. No focus-visible ring visible in CSS for most interactive elements (only `.sim-select:focus` has a border). No skip-to-content link. Simulator same-fighter error is now inline (good) rather than alert() — actually this was already inline in this version. Fighter filter buttons have no aria-pressed state. |
| Overall App Feel | 6.5 | It feels like a real app now — you can navigate to Predictions, see fights with win probabilities, click over to Betting and see odds-style formatting. The hero banner pulls up the right main event. The simulator is fun to use. The experience cap is: all probabilities cluster between 45–65% (the 25–75% model cap means even a huge skill gap shows as 65/35 at most), making every fight feel coin-flip. Real UFC fans know Makhachev should be 80%+ against most opponents. This undermines trust in the AI framing. |

---

## Bugs Fixed Since Last Audit (Good Work)

- **f1/f2 key mismatch RESOLVED** — UPCOMING_EVENTS now uses `f1`/`f2` keys throughout. Predictions and Betting tabs render correctly.
- **Fight tiers populated** — All fights have proper `tier` values (main, co-main, main-card, prelim). Hero banner correctly shows main event.
- **Weight classes populated** — All fights have `weight` field. Fight rows display correct weight class abbreviations.
- **Second event added** — UFC 327 (April 11, Miami) with Prochazka vs. Ulberg as main event and Flyweight co-main.
- **"LIVE DATA" badge removed** — Events section badge now reads "SCHEDULED" — honest framing.
- **Simulator error is inline** — No alert() usage found; error renders in the DOM.

---

## Remaining Issues

### Priority 1: Prediction probability floor is too conservative (25–75% cap)
`f1WinProb = Math.max(0.25, Math.min(0.75, f1WinProb))` — this means the largest possible edge shown is 75/25. For Topuria vs. a late-notice replacement, or Makhachev in a pure striker matchup, a real model would show 70–80%+ confidence. The hard floor makes every prediction look uncertain and undermines the "AI" framing. Consider widening to 20–80% or 15–85%, or showing a confidence tier (High/Medium/Low) that communicates certainty without fake precision.

### Priority 2: Betting odds are circular and misleading
`bookF1Prob = modelProb * 0.9 + 0.05` — the "book odds" are just the model's own output, compressed. This means the model can never find an edge beyond the compression math. Real edge detection requires actual bookmaker lines. Either fetch real odds (DraftKings API, The Odds API) or be explicit: rename to "Model-Implied Odds" and drop the "vs book" framing. Currently a user might bet based on a phantom edge.

### Priority 3: Horizontal overflow on predictions grid at mobile widths
`.predictions-grid { grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)) }` with 16px body padding creates overflow at 375px viewport width (375 - 32px padding = 343px available, below 320px minimum). Change `minmax(320px,1fr)` to `minmax(280px,1fr)` or add a `@media (max-width: 440px) { grid-template-columns: 1fr }` override.

---

## Additional Issues (Lower Priority)

- **Fighter data completeness** — Fighters tab only shows 15 fighters from the `FIGHTERS` object (not `EXTRA_FIGHTERS`). The 30+ fighters in `EXTRA_FIGHTERS` who appear on the actual fight cards aren't visible in the database tab — a user wants to look up Moicano or Jiri Prochazka and can't find them.
- **UFC 327 fight card is incomplete** — Only 2 fights listed (main and co-main). A real PPV card has 12+ fights. At minimum, populate 4–5 more fights.
- **No search on Fighters tab** — With 40+ fighters available, filter buttons only cover weight classes. A name search field would be a significant UX improvement.
- **Conor McGregor listed as active Welterweight** — He has been inactive/retired since 2021 injury. His presence without an "inactive" flag misleads users.
- **Ilia Topuria record 17-0 is stale** — Check current record.
- **No last-updated timestamp anywhere** — Users can't tell if the data is from last week or 6 months ago.
- **Fighter photos** — Most fighters use via.placeholder.com grey squares. Even initials-on-colored-background would look better. ESPN CDN links (used for some fighters) may break without proper referrer.
- **Simulator method round is random** — `Math.floor(Math.random() * 3) + 1` for round number means running the same simulation twice gives different results. A deterministic output would be more credible for an "AI model."
- **`aria-controls` on tab buttons points to panel IDs** — panels lack matching `role="tabpanel"` attributes and `id` attributes are present but panels don't have `aria-labelledby`. Screen reader navigation is incomplete.

---

## What's Working Well

- All 5 tabs fully functional with real data
- Hero banner shows correct main event with animated probability bar
- Fight tier badges (MAIN / CO-MN / CARD / PRELIM) display correctly
- Dark theme is polished and readable
- Fighter filter by weight class works correctly
- Simulator is enjoyable to use — good output layout
- Two events on the card with correct metadata
- No browser console errors expected from the core render path
- Performance is excellent — no bloat

---

*Audit complete. Score: 6.7/10. Solid fixes since last round — the app is functional. The path to 7.0+ requires widening the probability range, fixing the circular betting odds framing, and surfacing EXTRA_FIGHTERS in the Fighters tab.*
