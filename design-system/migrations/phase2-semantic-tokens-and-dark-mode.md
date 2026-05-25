# Phase 2 — Semantic tokens + (deferred) dark mode

**Status:** Partial — Semantic layer landed; dark mode infrastructure in place but not wired to any page (deferred to Phase 2.5).
**Completed:** 2026-05-12
**Predecessor:** Phase 1 paint→palette migration.
**Spec:** [docs/superpowers/specs/2026-05-12-phase2-semantic-tokens-and-dark-mode-design.md](../../docs/superpowers/specs/2026-05-12-phase2-semantic-tokens-and-dark-mode-design.md)
**Plan:** [docs/superpowers/plans/2026-05-12-phase2-semantic-tokens-and-dark-mode.md](../../docs/superpowers/plans/2026-05-12-phase2-semantic-tokens-and-dark-mode.md)

## What landed

- **`Colors` collection renamed → `Palette`** (Task 2 / Phase 2A).
- **New `Semantic` collection** (Task 3) — 31 role-based tokens grouped:
  - surface/* (5)
  - text/* (5) + text/link, text/link-hover (2)
  - border/* (4)
  - interactive/primary-* (4), interactive/secondary-* (3), interactive/destructive-* (3)
  - state/* (5)
- **Light + Dark modes on `Semantic`** (Tasks 3 + 5) — all 31 tokens have alias values in both modes. Dark values use Tailwind/Material defaults (Mobile-Dark sampling rejected — see below).
- **8,894 component bindings rebound** from `Palette` → `Semantic` via heuristic walk of the DS page (Task 6).
- **Verification** (Task 7): 20 of 20 random sampled bindings resolved correctly. 6 QA screenshots saved.

## What was deferred (Phase 2.5)

> **Update 2026-05-12:** Phase 2.5 Step 1 complete — see [phase2.5-step1-surface-base.md](phase2.5-step1-surface-base.md). Added `surface/base` token and bound 542 cream fills on Mobile-Light template pages. Pure Light-mode token discipline; dark mode remains deferred.

The user identified during visual QA that Mobile-Light's template page screen frame backgrounds bind directly to `Palette.Gray/0`. Because those frame fills aren't component instances, they don't inherit the new Semantic bindings. Flipping a section to Dark mode left the screen background white while components inside flipped dark — broken visual.

Decision: defer dark mode wiring until Phase 2.5 properly migrates template-page screen-level fills. Keep Mobile-Dark page intact until Phase 2.5 can verify dark parity.

**Phase 2.5 scope:**
1. Walk Mobile-Light template page (`20307:23730`) — bind screen-level FRAME fills to surface tokens. **Step 1 done 2026-05-12:** cream backgrounds (#f7f3ef = Brand/5) → `surface/base`. **Step 1 remaining:** white card fills (#ffffff) → `surface/primary` or `surface/elevated`; other systematic raw hex.
2. Address 3 low-coverage component categories with heuristic gaps:
   - **Tab** (38.4% Semantic coverage) — many Brand/* tint variants for color-themed tabs
   - **Badge/Tag** (38.1%) — 135+270 variants spanning every palette ramp
   - **Loader** (37.1%) — Brand/* state tints for animation
3. Visual QA dark mode end-to-end on all 21 Mobile sections.
4. **Then:** set Mobile-Light page's explicit `Semantic.Light` mode and delete the Mobile-Dark page.

## Decision: Mobile-Dark overrides all rejected

Task 4 sampled the existing Mobile-Dark page hoping to inform dark-mode values. Result: Mobile-Dark uses light-theme palette values (Gray/80 for primary text, Brand/60 for buttons, Brand/70 for hover) — it's a stylistic variation page, not a true dark theme. All 12 proposed overrides were rejected in favor of Tailwind/Material defaults (Brand/40 has 9.4:1 contrast vs Brand/60 at 4.7:1 against Gray/95). See `backups/phase2-dark-override-report.json` for the full decision audit.

## Coverage report

64% overall: 16,471 bindings on Semantic / 25,720 total (excluding text fills). 9,249 left on Palette by design — decorative tints in badges, charts, animation states.

Full per-category breakdown: [backups/phase2-coverage-report.json](backups/phase2-coverage-report.json).

Top categories well-served:
- Dropdown 96.6%, Progress & Indicator 90.1%, Dialog/Modal 86.9%, Input 84.9%, Tooltip 84.9%

Categories flagged for Phase 2.5:
- Tab 38.4%, Badge/Tag 38.1%, Loader 37.1%

## Backup files

| File | Contents |
|------|----------|
| [backups/phase2-pre-state.json](backups/phase2-pre-state.json) | 31,436 bindings snapshot before Phase 2 started |
| [backups/phase2-semantic-tokens.json](backups/phase2-semantic-tokens.json) | Final 31-token Light + Dark alias mappings |
| [backups/phase2-dark-override-report.json](backups/phase2-dark-override-report.json) | Mobile-Dark sampling tally + override decision (all rejected) |
| [backups/phase2-rebind-log.json](backups/phase2-rebind-log.json) | 8,894 rebind entries (nodeId, kind, fromVar, toVar) |
| [backups/phase2-coverage-report.json](backups/phase2-coverage-report.json) | Per-category Semantic vs Palette counts |

## QA screenshots

[qa-screenshots/](qa-screenshots/) — 6 PNGs: Button/Input/Modal/Top Nav/Mobile Auth in Light mode + Mobile Auth in Dark mode (which surfaced the deferral decision).

## Rollback

If needed, use [phase2-rollback.js](phase2-rollback.js). The script template walks the rebind log and restores each binding to its original Palette variable. Inject entries from `backups/phase2-rebind-log.json` (in chunks if needed — same 30s timeout pattern as the migration).

To fully reverse Phase 2:
1. Run rollback script in chunks until all 8,894 bindings restored to Palette.
2. Remove `Semantic` collection: `(await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Semantic').remove()`.
3. Rename `Palette` collection back to `Colors`: `coll.name = 'Colors'`.

The Phase 1 paint-style fallback chain is independent and remains valid throughout.
