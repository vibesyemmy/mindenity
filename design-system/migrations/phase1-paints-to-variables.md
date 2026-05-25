# Phase 1 — paint styles → color variables

**Status:** ✅ Complete (2026-05-12)
**Scope:** `Design System & Components` page only (main components). Templates inherit via instances.
**Reversible:** Yes — original paint styles intact, mapping saved in [backups/phase1-paint-to-variable-map.json](backups/phase1-paint-to-variable-map.json).

## What changed

- **Created:** `Colors` variable collection (`VariableCollectionId:24302:186441`), single mode `Default`.
- **Variables created:** 144 color variables, names mirror paint styles exactly.
  - Solid color ramps: 134 (Gray, Brand, Destructive, Warning, Success, Violet, Cyan, Teal, Blue, Purple, Pink, Orange × 11 steps each, plus Gray extra steps)
  - Transparent overlays: 10 (white + black × 5 opacity steps)
- **Bindings updated:** 31,684 across main components in DS page.
  - 21,688 fill bindings
  - 2,986 stroke bindings
  - 7,010 text range fills
- **Bindings skipped:** 0 mixed-range text fills detected.
- **Untouched:** 51 gradient paint styles + 50 image-fill paint styles (Avatar/Doctor/Device) — Figma variables don't support those types yet.

## What didn't change

- All paint styles (245) still exist in the file as fallback.
- Templates (Mobile light, Mobile dark, Desktop) — they reference instances of main components, so they auto-inherit the variable bindings. No direct mutation on template pages.
- Variant matrices, component prop definitions, layout, names, nodeIds — all preserved.

## Method

Run via `paperclip-figma-bridge` MCP, `figma_execute` calls. Sandbox is `dynamic-page` access mode — required async setters (`setFillStyleIdAsync`, `setStrokeStyleIdAsync`, `setRangeFillStyleIdAsync`).

Bridge has a hard 30s timeout per call. The migration ran in ~10 chunks (one per category/sub-frame), each completing under the timeout. Mutations land even if the response times out — the work commits on each `await`, so partial state is safe and re-runnable.

### Core script (per-frame chunked mutator)

```js
const start = Date.now();
const BAIL_MS = 25000;
await figma.loadAllPagesAsync();

// Build styleId → variable map
const colls = await figma.variables.getLocalVariableCollectionsAsync();
const coll = colls.find(c => c.name === 'Colors');
const varsAll = await figma.variables.getLocalVariablesAsync();
const varsByName = {};
for (const v of varsAll) if (v.variableCollectionId === coll.id) varsByName[v.name] = v;
const paints = await figma.getLocalPaintStylesAsync();
const styleToVar = new Map();
for (const s of paints) {
  if (s.paints?.[0]?.type === 'SOLID' && varsByName[s.name]) {
    styleToVar.set(s.id, varsByName[s.name]);
  }
}

// Walk a single frame (or DS page) and mutate
const root = await figma.getNodeByIdAsync('<frame-id>');
const nodes = root.findAllWithCriteria({
  types: ['RECTANGLE','ELLIPSE','FRAME','VECTOR','TEXT','LINE','POLYGON','STAR',
          'COMPONENT','COMPONENT_SET','BOOLEAN_OPERATION']
});

for (const n of nodes) {
  if (Date.now() - start > BAIL_MS) break;

  // Fills
  if (typeof n.fillStyleId === 'string' && styleToVar.has(n.fillStyleId)) {
    const v = styleToVar.get(n.fillStyleId);
    const newFills = n.fills.map(p =>
      p.type === 'SOLID'
        ? figma.variables.setBoundVariableForPaint(p, 'color', v)
        : p
    );
    await n.setFillStyleIdAsync('');
    n.fills = newFills;
  }

  // Strokes (same pattern)
  if (typeof n.strokeStyleId === 'string' && styleToVar.has(n.strokeStyleId)) {
    const v = styleToVar.get(n.strokeStyleId);
    const newStrokes = n.strokes.map(p =>
      p.type === 'SOLID'
        ? figma.variables.setBoundVariableForPaint(p, 'color', v)
        : p
    );
    await n.setStrokeStyleIdAsync('');
    n.strokes = newStrokes;
  }

  // Text range fills
  if (n.type === 'TEXT' && n.characters.length > 0) {
    const len = n.characters.length;
    const sid = n.getRangeFillStyleId(0, len);
    if (typeof sid === 'string' && styleToVar.has(sid)) {
      const v = styleToVar.get(sid);
      const fills = n.getRangeFills(0, len);
      if (Array.isArray(fills)) {
        const newFills = fills.map(p =>
          p.type === 'SOLID'
            ? figma.variables.setBoundVariableForPaint(p, 'color', v)
            : p
        );
        await n.setRangeFillStyleIdAsync(0, len, '');
        n.setRangeFills(0, len, newFills);
      }
    }
  }
}
```

## Verification

Spot-check after migration: sample any node's fills, confirm `boundVariables.color.id` points into the `Colors` collection and the resolved hex matches the variable's stored value.

```js
const node = await figma.getNodeByIdAsync('<id>');
for (const f of node.fills) {
  if (f.type === 'SOLID' && f.boundVariables?.color) {
    const v = await figma.variables.getVariableByIdAsync(f.boundVariables.color.id);
    console.log(v.name, f.color);
  }
}
```

QA pass on Button, Badge/Tag, Input frames: 451 of 455 solid fills bound (4 custom one-off colors that were never on the migrated paint styles — left untouched).

## Rollback

If needed, walk all nodes, find any fill with `boundVariables.color.id` matching a variable in the `Colors` collection, look up the original `paintStyleId` via the inverse of [backups/phase1-paint-to-variable-map.json](backups/phase1-paint-to-variable-map.json), and call `setFillStyleIdAsync(originalStyleId)` on the node. The paint style still exists in the file. Same pattern for strokes and text range fills.

## Phase 2 plan (next)

1. Add semantic-token sub-collection: `color/surface/primary`, `color/surface/elevated`, `color/text/body`, `color/text/muted`, `color/border/subtle`, `color/border/strong`, `color/state/success`, `color/state/danger`, etc.
2. In single mode (light), each semantic alias points at a palette step (e.g. `color/surface/primary` → `Gray/0 (White)`).
3. Add a second mode `Dark` to the `Colors` collection. For each semantic, set its `Dark` value to the dark-mode palette step (e.g. `color/surface/primary` → `Gray/95`).
4. Rebind all node fills currently pointing at raw palette steps (`Gray/0`, etc.) to the appropriate semantic alias instead. This is the **design-decision-heavy** step — not automated.
5. Once all components reference semantics, the Mobile-Dark template page becomes redundant. Delete it; switch the surviving Mobile template's Colors mode to `Dark` to render dark previews.

This collapses 21 duplicate dark-template sections (~516 screen frames) into a single mode toggle. Massive maintenance reduction.
