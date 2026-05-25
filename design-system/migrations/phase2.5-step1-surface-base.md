# Phase 2.5 Step 1 — `surface/base` token for cream page backgrounds

**Status:** ✅ Complete (2026-05-12)
**Predecessor:** Phase 2 partial completion (semantic layer + 8,894 component rebinds).
**Scope:** Mobile-Light template page only. Light-mode token discipline. Does NOT enable dark mode in production.

## What this fixed

Mobile-Light template pages had 542 raw hex `#f7f3ef` (cream / Brand/5) fills on screen-frame backgrounds and section containers. These were not bound to any variable — un-named, un-discoverable, un-refactorable.

Phase 2 left them alone because Phase 2 only walked the DS page (component definitions), not the template pages. The visual QA pass at the end of Phase 2 surfaced this gap: dark-mode preview showed cream-on-dark-components because cream fills couldn't flip.

## What landed

- **New Semantic token:** `surface/base`
  - Variable ID: `VariableID:24315:194991`
  - Light: aliases `Brand/5` (`#f7f3ef`)
  - Dark: aliases `Gray/95` (`#0c0a09`)
  - Scopes: `ALL_FILLS`, `STROKE_COLOR`
- **Bindings:** 542 (539 fills + 3 strokes) across all 21 Mobile-Light sections
- **Visual impact in Light mode:** zero. Pre/post Authentication screenshots are byte-identical (100,068 bytes each). `surface/base` resolves to `#f7f3ef` in Light — same as the raw hex it replaced.
- **Errors:** 0
- **Anomalous olive `#9bb167`** on screen `22398:39230` (Splash & Loading section) deliberately skipped — different hex, deferred for designer review.

## Per-section coverage

| Section | Fills bound | Strokes bound |
|---------|-------------|---------------|
| Authentication | 7 | 0 |
| Splash & Loading | 1 | 0 |
| Welcome Screen | 26 | 0 |
| Comprehensive Mental Health Assessment | 27 | 1 |
| Profile Setup & Account Completion | 25 | 0 |
| Home & Mental Health Metrics | 67 | 0 |
| Mindful AI Companion | 50 | 0 |
| AI Symptom Checker | 38 | 0 |
| Gratefulness & Affirmations | 9 | 0 |
| Self Journaling | 45 | 0 |
| Stress Management | 27 | 1 |
| Mood Tracker | 32 | 1 |
| Sleep Level | 30 | 0 |
| Mindful Minutes | 29 | 0 |
| Therapist Appointment | 29 | 0 |
| Search & Notifications | 7 | 0 |
| Error & Utility | 14 | 0 |
| Mental Health Resources | 22 | 0 |
| Mindful Community | 16 | 0 |
| Profile Settings & Help Center | 32 | 0 |
| Achievements | 6 | 0 |

Full per-binding log: [backups/phase2.5-rebind-log.json](backups/phase2.5-rebind-log.json).
Coverage report: [backups/phase2.5-coverage-report.json](backups/phase2.5-coverage-report.json).

## Why a new token (`surface/base`) instead of reusing `surface/primary`

The Mindenity brand background is cream (`#f7f3ef` = Brand/5), not white. Existing `surface/primary` aliases `Gray/0 (White)` — binding cream fills to it would have changed the rendered page from cream to white. That would have been a brand regression.

`surface/base` keeps cream-on-cream-pages in Light mode while still wiring up the dark mode mapping for future use. Existing `surface/primary` continues to serve white-card surfaces correctly.

## Visual QA

Screenshots in [qa-screenshots/](qa-screenshots/):
- `phase2.5-mobile-auth-light-PRE.png` + `phase2.5-mobile-auth-light.png` — byte-identical, proves no Light regression
- `phase2.5-mobile-auth-dark.png`, `phase2.5-mood-tracker-dark.png`, `phase2.5-self-journaling-dark.png`, `phase2.5-profile-settings-dark.png` — dark-mode verification artifacts (NOT a production state — these were captured by temporarily flipping section frames and then restoring)

## Rollback

To unbind these 542 fills, walk the entries in `backups/phase2.5-rebind-log.json` and for each entry replace the bound variable with the original raw hex. Pattern:

```js
const newFills = n.fills.map(f => {
  if (f.type === 'SOLID' && f.boundVariables?.color?.id === surfaceBase.id) {
    return { ...f, color: { r: 0.969, g: 0.953, b: 0.937 }, boundVariables: {} };
  }
  return f;
});
```

To remove the `surface/base` token entirely (after unbinding):
```js
const sem = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Semantic');
const sb = (await figma.variables.getLocalVariablesAsync()).find(v => v.variableCollectionId === sem.id && v.name === 'surface/base');
sb.remove();
```

## What's NOT in this step (Phase 2.5 backlog)

- **White card fills (`#ffffff` raw)** — if cards inside the cream pages are raw white, they're still un-named. Same pattern could bind them to `surface/primary`. Light-mode improvement, not dark-mode work.
- **Other systematic raw hex patterns** — section dividers, accent panels, etc.
- **Anomalous olive on `22398:39230`** — needs designer review.
- **Component coverage polish** — Tab/Badge/Loader heuristic gaps from Phase 2.
- **Dark mode enablement** — explicitly deferred. Semantic.Dark values exist; no page is flipped.
- **Mobile-Dark page deletion** — deferred until dark mode is properly enabled.
