# Phase 2 — Semantic tokens + dark mode + Mobile-Dark retirement

**Status:** Design approved 2026-05-12. Ready for implementation planning.
**Predecessor:** Phase 1 (paint styles → palette variables, complete 2026-05-12). See [design-system/migrations/phase1-paints-to-variables.md](../../../design-system/migrations/phase1-paints-to-variables.md).
**Target file:** Mindenity-DS Figma file (`fileKey: qU7OupeoYyrtlNMEKi7ao5`).
**Bridge:** `paperclip-figma-bridge` exclusively.

## Goal

Replace direct palette-variable bindings on components with a semantic token layer that supports light + dark modes. Use this to collapse the dual Mobile-Light / Mobile-Dark template pages into a single Mobile-Light page that renders dark via a mode flip. After Phase 2, the Mobile-Dark page is deleted.

## Why

1. **Eliminate dual-page maintenance.** Every component change today requires identical updates on Mobile-Light and Mobile-Dark. This is a maintenance tax on every design change and a source of drift.
2. **Make dark mode the default rendering capability** rather than a parallel reality. Future modes (high-contrast, on-brand themes) become incremental — add a mode, not a page.
3. **Make designer intent explicit in component code.** "This fill is the body text color" beats "this fill is Gray/60". Semantic tokens move the file from palette-as-API to roles-as-API.

## Non-goals

- Adding new components or modifying existing component structure / variant matrices.
- Building a component-token layer (Comprehensive Option C from brainstorming was rejected — Standard is sufficient).
- Recoloring the brand or adjusting the palette ramps. Palette values are immutable in this phase.
- Migrating template pages directly. Templates inherit via instances; main components are the only mutation target.
- Touching gradient or image-fill paint styles (Figma variables don't support those types).

---

## Architecture

### Two collections

The existing `Colors` collection gets renamed to **`Palette`** and stays single-mode. A new **`Semantic`** collection is created with two modes (`Light`, `Dark`) and 31 alias variables that point at Palette variables.

```
Palette (single mode "Default", 144 variables — UNCHANGED VALUES)
    Gray/0 (White) = #ffffff
    Gray/60        = #57534e
    Brand/60       = #926247
    ...

Semantic (two modes: Light, Dark, 31 variables, all aliases)
    surface/primary
        Light: → Palette.Gray/0 (White)
        Dark:  → Palette.Gray/95
    text/primary
        Light: → Palette.Gray/80
        Dark:  → Palette.Gray/10
    ...
```

Components bind to Semantic variables only (with documented exceptions for swatch samples and palette decorations). Palette is implementation detail — the public API is Semantic.

### Why two collections, not one

Rejected single-collection approach: adding semantics + Dark mode to the existing `Colors` collection mixes two abstraction levels. Designers could accidentally bind to a raw palette step instead of the semantic. Two collections create a clean public/private boundary — same pattern as Material Design 3, Polaris, GitHub Primer.

---

## Semantic taxonomy (31 tokens)

Each row lists the semantic name and the Palette variable it aliases per mode. Dark values are starting points — subject to reconciliation against the existing Mobile-Dark page during step 2C (see Migration Plan below).

### Surface (5 tokens)
| Semantic | Light | Dark | Use |
|----------|-------|------|-----|
| `surface/primary` | `Gray/0 (White)` | `Gray/95` | Main page background |
| `surface/secondary` | `Gray/5` | `Gray/90` | Subtle alt sections, lists |
| `surface/elevated` | `Gray/0 (White)` | `Gray/80` | Cards, modals, popovers (brighter than primary in dark — matches Material/iOS elevation conventions) |
| `surface/inverse` | `Gray/95` | `Gray/0 (White)` | Tooltips, dark-on-light callouts |
| `surface/overlay` | `Transparent/Black/48%` | `Transparent/Black/64%` | Modal scrims |

### Text (5 tokens)
| Semantic | Light | Dark | Use |
|----------|-------|------|-----|
| `text/primary` | `Gray/80` | `Gray/10` | Headings, primary body |
| `text/secondary` | `Gray/60` | `Gray/30` | Supporting text |
| `text/tertiary` | `Gray/50` | `Gray/40` | Captions, metadata |
| `text/disabled` | `Gray/30` | `Gray/70` | Disabled labels |
| `text/inverse` | `Gray/0 (White)` | `Gray/95` | Text on inverse / colored surfaces |

### Border (4 tokens)
| Semantic | Light | Dark | Use |
|----------|-------|------|-----|
| `border/subtle` | `Gray/20` | `Gray/80` | Default dividers, card edges |
| `border/strong` | `Gray/40` | `Gray/60` | Input borders, emphasized dividers |
| `border/focus` | `Brand/60` | `Brand/40` | Focus rings (a11y) |
| `border/error` | `Destructive/60` | `Destructive/40` | Error state on inputs |

### Interactive — primary (4 tokens)
| Semantic | Light | Dark | Use |
|----------|-------|------|-----|
| `interactive/primary` | `Brand/60` | `Brand/40` | Default primary button fill |
| `interactive/primary-hover` | `Brand/70` | `Brand/30` | Hover state |
| `interactive/primary-pressed` | `Brand/80` | `Brand/20` | Pressed state |
| `interactive/primary-disabled` | `Brand/20` | `Brand/80` | Disabled state |

### Interactive — secondary (3 tokens)
| Semantic | Light | Dark | Use |
|----------|-------|------|-----|
| `interactive/secondary` | `Gray/10` | `Gray/80` | Secondary button fill |
| `interactive/secondary-hover` | `Gray/20` | `Gray/70` | Hover |
| `interactive/secondary-pressed` | `Gray/30` | `Gray/60` | Pressed |

### Interactive — destructive (3 tokens)
| Semantic | Light | Dark | Use |
|----------|-------|------|-----|
| `interactive/destructive` | `Destructive/60` | `Destructive/40` | Destructive button fill |
| `interactive/destructive-hover` | `Destructive/70` | `Destructive/30` | Hover |
| `interactive/destructive-pressed` | `Destructive/80` | `Destructive/20` | Pressed |

### Link (2 tokens)
| Semantic | Light | Dark | Use |
|----------|-------|------|-----|
| `text/link` | `Blue/60` | `Blue/40` | Inline links |
| `text/link-hover` | `Blue/70` | `Blue/30` | Hover state |

### State (5 tokens)
| Semantic | Light | Dark | Use |
|----------|-------|------|-----|
| `state/success` | `Success/50` | `Success/30` | Success badges, valid indicators |
| `state/danger` | `Destructive/60` | `Destructive/40` | Error indicators (matches `border/error` for consistency) |
| `state/warning` | `Warning/50` | `Warning/30` | Warning indicators |
| `state/info` | `Blue/60` | `Blue/40` | Info indicators |
| `state/neutral` | `Gray/50` | `Gray/40` | Neutral / disabled state indicators |

### Notes on the dark mappings

- Body text uses `Gray/80 ↔ Gray/10` rather than `Gray/100 ↔ Gray/0` — the extremes cause eye strain. Standard practice.
- Interactive states invert direction in dark: in light mode hover goes darker (Brand/60 → Brand/70), in dark hover goes lighter (Brand/40 → Brand/30).
- `surface/elevated` is brighter than `surface/primary` in dark mode (Gray/80 vs Gray/95). Counterintuitive but correct — elevated content lifts toward the light source.
- The 5 transparent overlay variables in Palette remain accessible for direct use (scrim, hover overlays).

---

## Migration plan

Seven steps. Each is a separate `figma_execute` call with a checkpoint pause for human review before the next step.

### 2A. Rename `Colors` collection to `Palette` (~30 sec)

Cosmetic but important. Establishes Semantic as the public API name.

```js
const coll = (await figma.variables.getLocalVariableCollectionsAsync())
  .find(c => c.name === 'Colors');
coll.name = 'Palette';
```

No node bindings change. Existing references use IDs, not names. Update `design-system/foundations/colors.md` and `design-system/migrations/backups/phase1-paint-to-variable-map.json` to reflect the new name.

### 2B. Create `Semantic` collection with Light mode only (~1 min)

Create collection, set initial mode name to `Light`, create 31 alias variables according to the taxonomy above.

```js
const sem = figma.variables.createVariableCollection('Semantic');
sem.renameMode(sem.modes[0].modeId, 'Light');

const palette = (await figma.variables.getLocalVariableCollectionsAsync())
  .find(c => c.name === 'Palette');
const palVars = await figma.variables.getLocalVariablesAsync();
const palByName = {};
for (const v of palVars) if (v.variableCollectionId === palette.id) palByName[v.name] = v;

const taxonomy = [
  { name: 'surface/primary',           light: 'Gray/0 (White)',          dark: 'Gray/95' },
  { name: 'surface/secondary',         light: 'Gray/5',                  dark: 'Gray/90' },
  { name: 'surface/elevated',          light: 'Gray/0 (White)',          dark: 'Gray/80' },
  { name: 'surface/inverse',           light: 'Gray/95',                 dark: 'Gray/0 (White)' },
  { name: 'surface/overlay',           light: 'Transparent/Black/48%',   dark: 'Transparent/Black/64%' },
  { name: 'text/primary',              light: 'Gray/80',                 dark: 'Gray/10' },
  { name: 'text/secondary',            light: 'Gray/60',                 dark: 'Gray/30' },
  { name: 'text/tertiary',             light: 'Gray/50',                 dark: 'Gray/40' },
  { name: 'text/disabled',             light: 'Gray/30',                 dark: 'Gray/70' },
  { name: 'text/inverse',              light: 'Gray/0 (White)',          dark: 'Gray/95' },
  { name: 'border/subtle',             light: 'Gray/20',                 dark: 'Gray/80' },
  { name: 'border/strong',             light: 'Gray/40',                 dark: 'Gray/60' },
  { name: 'border/focus',              light: 'Brand/60',                dark: 'Brand/40' },
  { name: 'border/error',              light: 'Destructive/60',          dark: 'Destructive/40' },
  { name: 'interactive/primary',           light: 'Brand/60', dark: 'Brand/40' },
  { name: 'interactive/primary-hover',     light: 'Brand/70', dark: 'Brand/30' },
  { name: 'interactive/primary-pressed',   light: 'Brand/80', dark: 'Brand/20' },
  { name: 'interactive/primary-disabled',  light: 'Brand/20', dark: 'Brand/80' },
  { name: 'interactive/secondary',         light: 'Gray/10', dark: 'Gray/80' },
  { name: 'interactive/secondary-hover',   light: 'Gray/20', dark: 'Gray/70' },
  { name: 'interactive/secondary-pressed', light: 'Gray/30', dark: 'Gray/60' },
  { name: 'interactive/destructive',         light: 'Destructive/60', dark: 'Destructive/40' },
  { name: 'interactive/destructive-hover',   light: 'Destructive/70', dark: 'Destructive/30' },
  { name: 'interactive/destructive-pressed', light: 'Destructive/80', dark: 'Destructive/20' },
  { name: 'text/link',       light: 'Blue/60', dark: 'Blue/40' },
  { name: 'text/link-hover', light: 'Blue/70', dark: 'Blue/30' },
  { name: 'state/success', light: 'Success/50',     dark: 'Success/30' },
  { name: 'state/danger',  light: 'Destructive/60', dark: 'Destructive/40' },
  { name: 'state/warning', light: 'Warning/50',     dark: 'Warning/30' },
  { name: 'state/info',    light: 'Blue/60',        dark: 'Blue/40' },
  { name: 'state/neutral', light: 'Gray/50',        dark: 'Gray/40' }
];

const semByName = {};
for (const t of taxonomy) {
  const v = figma.variables.createVariable(t.name, sem, 'COLOR');
  v.setValueForMode(sem.modes[0].modeId, {
    type: 'VARIABLE_ALIAS',
    id: palByName[t.light].id
  });
  v.scopes = ['ALL_FILLS', 'STROKE_COLOR'];
  semByName[t.name] = v;
}
```

**Checkpoint 2B:** User opens Variables panel in Figma, confirms `Semantic` collection exists with 31 entries grouped by category. Spot-check 3-4 variables resolve to the expected hex (same as their Light-mode palette target).

### 2C. Sample Mobile-Dark page to reconcile dark values (~2 min, read-only)

Walk the existing Mobile-Dark page (`22590:65589`). For each fill / stroke / text fill that's currently bound to a Palette variable, classify the binding by likely semantic role using the same heuristic rules from step 2E. Build a frequency table per role:

```
For inferred role text/primary, the Mobile-Dark page uses:
  Gray/10  → 890 nodes   (default value ✓)
  Gray/5   → 145 nodes
  Gray/0   →  12 nodes

For inferred role interactive/primary, the Mobile-Dark page uses:
  Brand/50 → 320 nodes   (≠ default Brand/40)
  Brand/40 →  80 nodes
```

For each role where Mobile-Dark's most-common choice differs from the default, surface a proposed override. Expected: 3–7 overrides out of 31 tokens.

Save the full report to `design-system/migrations/backups/phase2-dark-override-report.json`.

**Checkpoint 2C:** User reviews override proposals and confirms which to accept. Expected user time: ~10 min.

### 2D. Add Dark mode to Semantic + commit final values (~30 sec)

```js
const sem = (await figma.variables.getLocalVariableCollectionsAsync())
  .find(c => c.name === 'Semantic');
const darkModeId = sem.addMode('Dark');

const finalTaxonomy = taxonomy.map(t => ({
  ...t,
  dark: overrides[t.name] ?? t.dark   // apply approved overrides
}));

for (const t of finalTaxonomy) {
  const v = semByName[t.name];
  v.setValueForMode(darkModeId, {
    type: 'VARIABLE_ALIAS',
    id: palByName[t.dark].id
  });
}
```

**Checkpoint 2D:** User flips mode on a test frame, confirms variables resolve to expected dark-mode hex values. Spot-check 4-5 variables.

### 2E. Hybrid heuristic migration of component bindings (~5-10 min in chunks)

Walks the DS page (`10611:33504`). For each fill / stroke / text range fill currently bound to a Palette variable, apply the rules below. If a rule matches, rebind to the corresponding Semantic variable. If no rule matches, leave the binding on Palette.

#### Auto-rebind rules (run in order; first match wins per binding)

1. **TEXT node fills, by palette step → text semantic:**
   - `Gray/80`, `Gray/90` → `text/primary`
   - `Gray/60`, `Gray/70` → `text/secondary`
   - `Gray/40`, `Gray/50` → `text/tertiary`
   - `Gray/20`, `Gray/30` → `text/disabled`
   - `Gray/0 (White)`, `Gray/5` → `text/inverse`
   - `Blue/60`, `Blue/70` → `text/link`

2. **VECTOR fills inside COMPONENT or COMPONENT_SET (icons), by palette step → text semantic:**
   - Same mapping as rule 1 (icons follow text color).

3. **Strokes on FRAME or RECTANGLE, by palette step → border semantic:**
   - `Gray/20`, `Gray/30` → `border/subtle`
   - `Gray/40`, `Gray/50` → `border/strong`
   - `Destructive/*` → `border/error`
   - `Brand/60` → `border/focus`

4. **Obvious palette colors with semantic role (any node type):**
   - `Success/50` → `state/success`
   - `Warning/50` → `state/warning`
   - `Destructive/60` → `state/danger` (or `interactive/destructive` if the node's nearest named ancestor matches `/button|cta/i`)
   - `Brand/60` on a node whose nearest named ancestor matches `/button|cta|primary/i` → `interactive/primary`
   - `Brand/70` similarly → `interactive/primary-hover`
   - `Brand/80` similarly → `interactive/primary-pressed`
   - `Gray/10` similarly on a secondary-button context → `interactive/secondary`

#### Leave-alone rules

1. Any binding inside the `Foundations` section (nodeId `10827:19797`). The Primary Colors swatches must keep raw palette references — they're displaying the palette itself.
2. Any palette step that doesn't appear in the rules above (e.g. `Pink/*`, `Purple/*`, `Cyan/*` outside of obvious state contexts). These keep palette bindings as-is — they're decorative accents.
3. Fills on non-text nodes whose role can't be inferred (e.g. a Gray/30 fill on a non-stroked decorative shape). Keep on palette for the manual top-N polish.

Run the script in chunks of ≤25s elapsed each (Phase 1 established this is the bridge timeout). Save a rebind log to `design-system/migrations/backups/phase2-rebind-log.json` with one entry per change: `{nodeId, kind, fromPaletteVar, toSemanticVar}`.

**Checkpoint 2E:** Coverage report — for each of the 24 component categories, count bindings now on Semantic vs still on Palette. If any category has >50% still on Palette, flag for manual review in Phase 2.5.

### 2F. Verification (~1 min)

Three checks:

1. **Resolution sanity (programmatic):** Pick 20 random rebound fills. Read the bound Semantic variable. Check its Light value resolves to the same hex as the original Palette binding. Switch to Dark mode in a sandbox frame and confirm the resolved hex matches the planned dark step.

2. **Visual sanity (screenshots):** Capture before/after of 5 high-traffic components in both modes:
   - Button (`10611:50091`)
   - Input (`10611:58324`)
   - Modal (inside `10611:53754`)
   - Top Nav (inside `10724:20795`)
   - One representative Mobile-Light section with mode flipped to Dark.
   Save to `design-system/migrations/qa-screenshots/`. Surface any visual oddities (white-on-white, illegible contrast, mode flip not taking effect).

3. **Coverage report:** Per-category breakdown of Semantic vs Palette bindings. Output to `design-system/migrations/backups/phase2-coverage-report.json`.

### 2G. Switch Mobile-Light page Semantic mode (~30 sec)

```js
const mobileLightPage = figma.root.children.find(p => p.id === '20307:23730');
mobileLightPage.setExplicitVariableModeForCollection(semColl, lightModeId);
```

Sets the explicit mode for the Semantic collection on Mobile-Light to `Light`. Individual frames can still override to `Dark` for previews. This is the change that makes the page render correctly post-migration.

**Checkpoint 2G:** User opens a Mobile-Light section, confirms it still renders correctly. Then flips the section frame's Semantic mode to Dark and confirms a passable dark render.

---

## Backup files written

| File | When | Contents |
|------|------|----------|
| `design-system/migrations/backups/phase2-pre-state.json` | Before 2A | Snapshot: `Colors` collection name, list of all bound nodes in DS page (nodeId + which palette variable they bind to). |
| `design-system/migrations/backups/phase2-semantic-tokens.json` | After 2B | The 31 semantic tokens with their final Light + Dark palette variable references (post-override). |
| `design-system/migrations/backups/phase2-dark-override-report.json` | After 2C | Mobile-Dark frequency analysis + approved overrides + the values you chose for each contested role. |
| `design-system/migrations/backups/phase2-rebind-log.json` | After 2E | For each rebound node: `{nodeId, kind, fromPaletteVar, toSemanticVar}`. Enables targeted rollback per-component if needed. |
| `design-system/migrations/backups/phase2-coverage-report.json` | After 2F | Per-category Semantic vs Palette binding counts. |

## Rollback (per step)

| Step | Rollback |
|------|----------|
| 2A | Set `coll.name = 'Colors'` |
| 2B | `semColl.remove()` (no bindings reference it yet) |
| 2C | Read-only — nothing to roll back |
| 2D | `semColl.removeMode(darkModeId)` |
| 2E | Walk the rebind log, for each entry re-bind the node's fill back to `fromPaletteVar` using the same `setBoundVariableForPaint` pattern from Phase 1. Saved as `design-system/migrations/phase2-rollback.js` for one-command rollback. |
| 2F | Read-only |
| 2G | `mobileLightPage.clearExplicitVariableModeForCollection(semColl)` |
| Post — Mobile-Dark deletion | Figma version history (File → Show version history) |

## Failure modes

| Failure | Cause | Recovery |
|---------|-------|----------|
| Component looks wrong in Dark mode (e.g. white-on-white) | Wrong heuristic mapped a fill to the wrong semantic | Manually fix the offending node's binding, or use the rebind log to identify a pattern and bulk-fix |
| Variable alias resolves to wrong palette step | Section 1 mapping decision was wrong | Edit the Semantic variable's value for the affected mode — single-source update, no node touches needed |
| Mode toggle doesn't take effect on a frame | Frame inherits from a parent with explicit mode override | Set frame mode explicitly OR clear the parent override |
| Some bindings missed by heuristic | Edge case node type or unusual structure | Listed in coverage report; address in Phase 2.5 |
| Plugin times out mid-migration in 2E | Bridge has 30s call limit | Mutations land sequentially as `await` resolves; re-run with same script to continue. Phase 1 established this pattern. |

---

## Mobile-Dark deletion (post-Phase 2 gate)

After Phase 2 verification passes:

### Pre-deletion checks

1. **Sanity flip:** Take Mobile-Light, flip one section per category to Dark mode, screenshot. Compare to Mobile-Dark's matching section. Goal: visual parity ≥ 95% per section. Small differences are OK; structural differences (missing background, wrong contrast hierarchy) flag a problem.
2. **Coverage report** confirms no category has >50% of bindings still on Palette.
3. **User eyeballs** 2-3 representative Dark-mode renders and confirms they're acceptable.

If any check fails, abort the deletion and triage in a Phase 2.5 manual polish pass before retiring Mobile-Dark.

### Deletion

```js
await figma.loadAllPagesAsync();
const darkPage = figma.root.children.find(p => p.id === '22590:65589');
if (darkPage) darkPage.remove();
```

### Documentation updates after deletion

- `design-system/templates.md`: remove the Mobile-Dark table; update the "How to use this for a screen-build prompt" section to describe mode flipping instead of choosing a page.
- `design-system/manifest.json`: remove the `templates.mobileDark` section.
- `design-system/README.md`: update theme model note to "single template page with mode toggle".
- `CLAUDE.md` (project root): update Theme model and screen-build workflow lines.

---

## What does NOT change

- Components catalog (the 183 components, their structure, variants, props, nodeIds — all preserved).
- Foundations docs other than the color file (typography, tokens, manifest stay as-is except for collection rename).
- Phase 1 backup (paint→variable map) — still a valid historical record.
- Mobile-Light page structure (just gets its Semantic mode set explicitly).
- Desktop template page.

---

## Implementation skill handoff

After this design is approved (and the spec self-reviewed), the next step is to invoke the `writing-plans` skill to produce a step-by-step implementation plan. The plan will:

- Sequence the seven migration steps (2A–2G) with their checkpoints.
- Build the per-step scripts (most code already in this spec) into executable units.
- Define exit criteria for each checkpoint.
- Build the Mobile-Dark deletion gate as a final discrete step with its own checks.

This spec is the design source-of-truth; the plan is the operational source-of-truth for running the migration.
