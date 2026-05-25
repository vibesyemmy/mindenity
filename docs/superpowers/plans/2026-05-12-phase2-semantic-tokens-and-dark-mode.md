# Phase 2 — Semantic tokens + dark mode Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Semantic variable collection with light + dark modes in the Mindenity-DS Figma file, rebind ~80% of main-component palette bindings to semantics via heuristics, then retire the Mobile-Dark page.

**Architecture:** Two-collection model — rename `Colors` → `Palette` (immutable single mode); create new `Semantic` collection with two modes (`Light`, `Dark`) holding 31 alias variables that point at Palette variables. Sample existing Mobile-Dark for dark-value reconciliation before committing. Then walk DS-page components and apply deterministic rules to rebind palette refs → semantic refs. Templates inherit via instances. Mobile-Light gets explicit Semantic-mode set; Mobile-Dark page gets deleted after parity checks.

**Tech Stack:**
- Figma file: Mindenity-DS (`fileKey: qU7OupeoYyrtlNMEKi7ao5`)
- Bridge: `paperclip-figma-bridge` MCP (loopback `http://127.0.0.1:9333`)
- Primary tool: `mcp__paperclip-figma-bridge__figma_execute` (30s per-call timeout; mutations land sequentially as `await` resolves, so partial state is safe and re-runnable)
- Document access mode: `dynamic-page` — requires async setters (`setBoundVariableForPaint`, `setFillStyleIdAsync`, etc.)
- Not a git repo — "commit" steps mean writing the backup JSON / doc file via the Write tool.

**Prerequisites before starting:**
- Phase 1 complete (verified by presence of [design-system/migrations/backups/phase1-paint-to-variable-map.json](../../../design-system/migrations/backups/phase1-paint-to-variable-map.json)).
- Figma Desktop is open on the Mindenity-DS file with `Plugins → Development → Paperclip` running. Verify via `figma_get_status` returning a connected file.
- Working directory: `/Users/opeyemiajagbe/Documents/Projects/mindenity-2`.

---

## File structure

**Will be created:**
- `design-system/migrations/backups/phase2-pre-state.json` — pre-flight snapshot (Task 1)
- `design-system/migrations/backups/phase2-semantic-tokens.json` — final 31-token light+dark mappings (Task 3 + Task 5)
- `design-system/migrations/backups/phase2-dark-override-report.json` — Mobile-Dark frequency report + approved overrides (Task 4)
- `design-system/migrations/backups/phase2-rebind-log.json` — per-node rebind record (Task 6)
- `design-system/migrations/backups/phase2-coverage-report.json` — post-rebind per-category Semantic vs Palette counts (Task 6)
- `design-system/migrations/phase2-rollback.js` — one-shot rollback script (Task 7)
- `design-system/migrations/phase2-semantic-tokens-and-dark-mode.md` — Phase 2 retrospective doc (Task 11)
- `design-system/migrations/qa-screenshots/` — directory for visual QA captures (Task 7, Task 8)

**Will be modified:**
- `design-system/migrations/backups/phase1-paint-to-variable-map.json` — rename `collectionName: "Colors"` → `"Palette"` (Task 2)
- `design-system/README.md` — update color/variable counts + theme model (Task 11)
- `design-system/foundations/colors.md` — note Semantic collection + rename Colors → Palette (Task 11)
- `design-system/foundations/tokens.md` — update note about Colors → Palette name (Task 11)
- `design-system/templates.md` — remove Mobile-Dark section, replace with mode-flip workflow (Task 11)
- `design-system/manifest.json` — remove `templates.mobileDark` section; update `pages` entry (Task 11)
- `CLAUDE.md` (project root) — update theme model + workflow notes (Task 11)

**Will be deleted (in Figma):**
- `Mobile template - Dark` page (`pageId: 22590:65589`) — Task 10

---

## Task 1: Pre-flight + snapshot baseline state

**Files:**
- Verify exists: `design-system/migrations/backups/phase1-paint-to-variable-map.json`
- Create: `design-system/migrations/backups/phase2-pre-state.json`

### - [ ] Step 1.1: Verify bridge connection

Run via `mcp__paperclip-figma-bridge__figma_get_status`.

Expected response shape:
```json
{
  "connectedFiles": [{ "fileKey": "qU7OupeoYyrtlNMEKi7ao5", "fileName": "Mindenity-DS", ... }],
  "lastActiveFileKey": "qU7OupeoYyrtlNMEKi7ao5"
}
```

If `connectedFiles: []`, stop and ask user to open Mindenity-DS in Figma Desktop and re-launch the Paperclip plugin (`Plugins → Development → Paperclip`).

### - [ ] Step 1.2: Verify Phase 1 completed

Confirm the `Colors` collection exists with 144 variables and zero remaining solid-paint-style bindings on DS-page main components. Run via `figma_execute`:

```js
await figma.loadAllPagesAsync();
const colls = await figma.variables.getLocalVariableCollectionsAsync();
const colors = colls.find(c => c.name === 'Colors');
if (!colors) return { error: 'Colors collection missing — Phase 1 not complete' };

const paints = await figma.getLocalPaintStylesAsync();
const solidStyleIds = new Set();
for (const s of paints) if (s.paints?.[0]?.type === 'SOLID') solidStyleIds.add(s.id);

const dsPage = figma.root.children.find(p => p.id === '10611:33504');
let remaining = 0;
const nodes = dsPage.findAllWithCriteria({ types: ['RECTANGLE','ELLIPSE','FRAME','VECTOR','TEXT','LINE','POLYGON','STAR','COMPONENT','COMPONENT_SET','BOOLEAN_OPERATION'] });
for (const n of nodes) {
  if (typeof n.fillStyleId === 'string' && solidStyleIds.has(n.fillStyleId)) remaining++;
  if (typeof n.strokeStyleId === 'string' && solidStyleIds.has(n.strokeStyleId)) remaining++;
}
return { collectionName: colors.name, variableCount: colors.variableIds.length, phase1ResidualBindings: remaining };
```

Expected: `variableCount: 144`, `phase1ResidualBindings: 0` (or ≤10 — small leftovers from Foundations swatches are OK).

### - [ ] Step 1.3: Snapshot pre-state of all current variable bindings in DS page

Run via `figma_execute`. Walks DS page main components, records `{nodeId, kind, currentBoundVariableId, currentBoundVariableName}` for each binding into a structure we can save.

```js
await figma.loadAllPagesAsync();
const dsPage = figma.root.children.find(p => p.id === '10611:33504');
const vars = await figma.variables.getLocalVariablesAsync();
const varById = {};
for (const v of vars) varById[v.id] = v.name;

const bindings = [];
const nodes = dsPage.findAllWithCriteria({ types: ['RECTANGLE','ELLIPSE','FRAME','VECTOR','TEXT','LINE','POLYGON','STAR','COMPONENT','COMPONENT_SET','BOOLEAN_OPERATION'] });

for (const n of nodes) {
  if (Array.isArray(n.fills)) {
    for (let i = 0; i < n.fills.length; i++) {
      const f = n.fills[i];
      if (f.type === 'SOLID' && f.boundVariables?.color) {
        const id = f.boundVariables.color.id;
        bindings.push({ nodeId: n.id, kind: 'fill', fillIndex: i, varId: id, varName: varById[id] });
      }
    }
  }
  if (Array.isArray(n.strokes)) {
    for (let i = 0; i < n.strokes.length; i++) {
      const f = n.strokes[i];
      if (f.type === 'SOLID' && f.boundVariables?.color) {
        const id = f.boundVariables.color.id;
        bindings.push({ nodeId: n.id, kind: 'stroke', strokeIndex: i, varId: id, varName: varById[id] });
      }
    }
  }
  // Text range fills: only sample whole-text (mixed ranges very rare; Phase 1 found 0)
  if (n.type === 'TEXT' && n.characters?.length > 0) {
    const len = n.characters.length;
    try {
      const fills = n.getRangeFills(0, len);
      if (Array.isArray(fills) && fills[0]?.type === 'SOLID' && fills[0].boundVariables?.color) {
        const id = fills[0].boundVariables.color.id;
        bindings.push({ nodeId: n.id, kind: 'textFill', varId: id, varName: varById[id] });
      }
    } catch(e) {}
  }
}
return { count: bindings.length, sample: bindings.slice(0, 5), totalBytes: JSON.stringify(bindings).length };
```

Expected count: ~30,000+ bindings (matches Phase 1 final count). If full result exceeds context window, the tool overflow handler will save it to a temp file path — use that path for Step 1.4.

### - [ ] Step 1.4: Write the snapshot to backup file

Use the Write tool. Write a JSON file with `{ phase: 2, step: 'pre-state', createdAt: '<today>', bindings: [...] }` to:
`/Users/opeyemiajagbe/Documents/Projects/mindenity-2/design-system/migrations/backups/phase2-pre-state.json`

If the figma_execute output overflowed to a temp file, read it back via `ctx_execute_file` and re-serialize to the backup path. Don't load the full bindings array into context.

### - [ ] Step 1.5: Save progress checkpoint

State to user: "Pre-flight complete. Phase 1 verified. Pre-state snapshot saved. Ready to rename Colors → Palette (Task 2)."

---

## Task 2: Rename `Colors` collection → `Palette` (Phase 2A)

**Files:**
- Mutate: Figma file — rename one variable collection
- Modify: `design-system/migrations/backups/phase1-paint-to-variable-map.json`

### - [ ] Step 2.1: Run rename script

Via `figma_execute`:

```js
await figma.loadAllPagesAsync();
const coll = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Colors');
if (!coll) return { error: 'Colors collection not found' };
coll.name = 'Palette';
return { newName: coll.name, id: coll.id };
```

Expected: `{ newName: "Palette", id: "VariableCollectionId:24302:186441" }`.

### - [ ] Step 2.2: Verify the rename took effect

Via `figma_execute`:
```js
const colls = await figma.variables.getLocalVariableCollectionsAsync();
return colls.map(c => ({ id: c.id, name: c.name, variableCount: c.variableIds.length }));
```

Expected: a collection named `Palette` exists with 144 variables. A collection named `Colors` does NOT exist.

### - [ ] Step 2.3: Update Phase 1 backup JSON to reflect rename

Use the Edit tool on `/Users/opeyemiajagbe/Documents/Projects/mindenity-2/design-system/migrations/backups/phase1-paint-to-variable-map.json`:

Old: `"collectionName": "Colors",`
New: `"collectionName": "Palette",`

(`collectionId` stays the same — Figma IDs are stable.)

### - [ ] Step 2.4: Save progress checkpoint

State to user: "`Colors` renamed to `Palette`. No node bindings affected. Ready to create Semantic collection (Task 3)."

---

## Task 3: Create `Semantic` collection with Light mode + 31 alias variables (Phase 2B)

**Files:**
- Mutate: Figma file — create one variable collection + 31 variables
- Create: `design-system/migrations/backups/phase2-semantic-tokens.json`

### - [ ] Step 3.1: Run create-collection script

Via `figma_execute` (60s timeout safe — single creation pass):

```js
await figma.loadAllPagesAsync();

// Get Palette collection and variable name lookup
const palette = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Palette');
if (!palette) return { error: 'Palette collection missing' };
const palVars = await figma.variables.getLocalVariablesAsync();
const palByName = {};
for (const v of palVars) if (v.variableCollectionId === palette.id) palByName[v.name] = v;

// Bail if Semantic already exists
const existing = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Semantic');
if (existing) return { error: 'Semantic collection already exists', id: existing.id };

// Create Semantic collection
const sem = figma.variables.createVariableCollection('Semantic');
sem.renameMode(sem.modes[0].modeId, 'Light');
const lightMode = sem.modes[0].modeId;

const taxonomy = [
  { name: 'surface/primary',                light: 'Gray/0 (White)',         dark: 'Gray/95' },
  { name: 'surface/secondary',              light: 'Gray/5',                 dark: 'Gray/90' },
  { name: 'surface/elevated',               light: 'Gray/0 (White)',         dark: 'Gray/80' },
  { name: 'surface/inverse',                light: 'Gray/95',                dark: 'Gray/0 (White)' },
  { name: 'surface/overlay',                light: 'Transparent/Black/48%',  dark: 'Transparent/Black/64%' },
  { name: 'text/primary',                   light: 'Gray/80',                dark: 'Gray/10' },
  { name: 'text/secondary',                 light: 'Gray/60',                dark: 'Gray/30' },
  { name: 'text/tertiary',                  light: 'Gray/50',                dark: 'Gray/40' },
  { name: 'text/disabled',                  light: 'Gray/30',                dark: 'Gray/70' },
  { name: 'text/inverse',                   light: 'Gray/0 (White)',         dark: 'Gray/95' },
  { name: 'border/subtle',                  light: 'Gray/20',                dark: 'Gray/80' },
  { name: 'border/strong',                  light: 'Gray/40',                dark: 'Gray/60' },
  { name: 'border/focus',                   light: 'Brand/60',               dark: 'Brand/40' },
  { name: 'border/error',                   light: 'Destructive/60',         dark: 'Destructive/40' },
  { name: 'interactive/primary',            light: 'Brand/60',               dark: 'Brand/40' },
  { name: 'interactive/primary-hover',      light: 'Brand/70',               dark: 'Brand/30' },
  { name: 'interactive/primary-pressed',    light: 'Brand/80',               dark: 'Brand/20' },
  { name: 'interactive/primary-disabled',   light: 'Brand/20',               dark: 'Brand/80' },
  { name: 'interactive/secondary',          light: 'Gray/10',                dark: 'Gray/80' },
  { name: 'interactive/secondary-hover',    light: 'Gray/20',                dark: 'Gray/70' },
  { name: 'interactive/secondary-pressed',  light: 'Gray/30',                dark: 'Gray/60' },
  { name: 'interactive/destructive',        light: 'Destructive/60',         dark: 'Destructive/40' },
  { name: 'interactive/destructive-hover',  light: 'Destructive/70',         dark: 'Destructive/30' },
  { name: 'interactive/destructive-pressed',light: 'Destructive/80',         dark: 'Destructive/20' },
  { name: 'text/link',                      light: 'Blue/60',                dark: 'Blue/40' },
  { name: 'text/link-hover',                light: 'Blue/70',                dark: 'Blue/30' },
  { name: 'state/success',                  light: 'Success/50',             dark: 'Success/30' },
  { name: 'state/danger',                   light: 'Destructive/60',         dark: 'Destructive/40' },
  { name: 'state/warning',                  light: 'Warning/50',             dark: 'Warning/30' },
  { name: 'state/info',                     light: 'Blue/60',                dark: 'Blue/40' },
  { name: 'state/neutral',                  light: 'Gray/50',                dark: 'Gray/40' }
];

const created = [];
const errors = [];
for (const t of taxonomy) {
  const target = palByName[t.light];
  if (!target) { errors.push({ name: t.name, missingPaletteName: t.light }); continue; }
  const v = figma.variables.createVariable(t.name, sem, 'COLOR');
  v.setValueForMode(lightMode, { type: 'VARIABLE_ALIAS', id: target.id });
  v.scopes = ['ALL_FILLS', 'STROKE_COLOR'];
  created.push({ name: t.name, id: v.id, lightAlias: target.name });
}
return { collectionId: sem.id, lightModeId: lightMode, createdCount: created.length, errors, created };
```

Expected: `createdCount: 31`, `errors: []`.

If `errors` contains entries: a palette variable name we're aliasing doesn't exist. Investigate (likely a typo or a palette variable that wasn't created in Phase 1). Do not proceed until errors are empty.

### - [ ] Step 3.2: Verify Semantic collection looks correct in Figma

Via `figma_execute`:

```js
const sem = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Semantic');
const vars = await figma.variables.getLocalVariablesAsync();
const semVars = vars.filter(v => v.variableCollectionId === sem.id);
const sample = [];
for (const v of semVars.slice(0, 5)) {
  const val = v.valuesByMode[sem.modes[0].modeId];
  let resolvedHex = null;
  if (val?.type === 'VARIABLE_ALIAS') {
    const target = await figma.variables.getVariableByIdAsync(val.id);
    const targetVal = target.valuesByMode[Object.keys(target.valuesByMode)[0]];
    if (targetVal && typeof targetVal === 'object' && 'r' in targetVal) {
      const t = (n) => Math.round(n*255).toString(16).padStart(2,'0');
      resolvedHex = '#' + t(targetVal.r) + t(targetVal.g) + t(targetVal.b);
    }
  }
  sample.push({ name: v.name, aliasTarget: val?.id, resolvedHex });
}
return { collectionName: sem.name, modeCount: sem.modes.length, modeName: sem.modes[0].name, variableCount: semVars.length, sample };
```

Expected: `modeCount: 1`, `modeName: "Light"`, `variableCount: 31`. Sample resolves to expected hex values (e.g. `surface/primary` → `#ffffff`, `text/primary` → `#292524`).

### - [ ] Step 3.3: Save the initial semantic-tokens backup

Use the Write tool to write `/Users/opeyemiajagbe/Documents/Projects/mindenity-2/design-system/migrations/backups/phase2-semantic-tokens.json` with:

```json
{
  "phase": 2,
  "step": "2B-initial",
  "createdAt": "2026-05-12",
  "collectionId": "<from Step 3.1 result>",
  "lightModeId": "<from Step 3.1 result>",
  "darkModeId": null,
  "tokens": [
    {
      "name": "surface/primary",
      "variableId": "<from created array>",
      "light": "Gray/0 (White)",
      "lightVariableId": "<resolved>",
      "dark": "Gray/95",
      "darkVariableId": null,
      "darkApplied": false
    }
    // ... full 31 entries from the taxonomy + IDs from Step 3.1 result
  ]
}
```

This file gets updated in Task 5 with the Dark mode commit.

### - [ ] Step 3.4: User checkpoint pause

State to user: "Semantic collection created with 31 variables in Light mode only. Please open the Variables panel in Figma and spot-check that `surface/primary`, `text/primary`, `interactive/primary`, and `state/danger` look right. Then confirm to proceed to Mobile-Dark sampling (Task 4)."

Wait for user approval before continuing.

---

## Task 4: Sample Mobile-Dark page + generate override report (Phase 2C)

**Files:**
- Read-only: Figma Mobile-Dark page (`22590:65589`)
- Create: `design-system/migrations/backups/phase2-dark-override-report.json`

### - [ ] Step 4.1: Walk Mobile-Dark page + classify bindings by inferred role

Via `figma_execute` (may need chunking; if >25s, split by section). Apply the same heuristic rules from Task 6 to each binding, count which palette variable is most-used per inferred role:

```js
await figma.loadAllPagesAsync();
const palette = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Palette');
const palVars = await figma.variables.getLocalVariablesAsync();
const palById = {};
for (const v of palVars) if (v.variableCollectionId === palette.id) palById[v.id] = v.name;

// Heuristic — infer semantic role from {node, kind, paletteName}. Returns role string or null.
function inferRole(node, kind, paletteName) {
  if (kind === 'textFill' || (kind === 'fill' && node.type === 'TEXT') || (kind === 'fill' && node.type === 'VECTOR')) {
    if (paletteName === 'Gray/80' || paletteName === 'Gray/90' || paletteName === 'Gray/95') return 'text/primary';
    if (paletteName === 'Gray/60' || paletteName === 'Gray/70') return 'text/secondary';
    if (paletteName === 'Gray/40' || paletteName === 'Gray/50') return 'text/tertiary';
    if (paletteName === 'Gray/20' || paletteName === 'Gray/30') return 'text/disabled';
    if (paletteName === 'Gray/0 (White)' || paletteName === 'Gray/5' || paletteName === 'Gray/10') return 'text/inverse';
    if (paletteName === 'Blue/60' || paletteName === 'Blue/70') return 'text/link';
  }
  if (kind === 'stroke') {
    if (paletteName === 'Gray/20' || paletteName === 'Gray/30') return 'border/subtle';
    if (paletteName === 'Gray/40' || paletteName === 'Gray/50') return 'border/strong';
    if (paletteName?.startsWith('Destructive/')) return 'border/error';
    if (paletteName === 'Brand/60') return 'border/focus';
  }
  if (paletteName === 'Success/50') return 'state/success';
  if (paletteName === 'Warning/50') return 'state/warning';
  if (paletteName === 'Destructive/60') return 'state/danger';
  if (paletteName === 'Blue/60' && kind !== 'textFill') return 'state/info';
  // Brand-as-interactive — buttons context (simplified for Mobile-Dark sampling: any Brand fill)
  if (paletteName === 'Brand/60' && kind === 'fill' && node.type !== 'TEXT') return 'interactive/primary';
  if (paletteName === 'Brand/70' && kind === 'fill' && node.type !== 'TEXT') return 'interactive/primary-hover';
  if (paletteName === 'Brand/80' && kind === 'fill' && node.type !== 'TEXT') return 'interactive/primary-pressed';
  // Surface inference — large frame with no parent text
  if (kind === 'fill' && (node.type === 'FRAME' || node.type === 'RECTANGLE')) {
    if (paletteName === 'Gray/95') return 'surface/primary';
    if (paletteName === 'Gray/90') return 'surface/secondary';
    if (paletteName === 'Gray/80') return 'surface/elevated';
  }
  return null;
}

const darkPage = figma.root.children.find(p => p.id === '22590:65589');
const tally = {}; // role → { paletteName: count }
const nodes = darkPage.findAllWithCriteria({ types: ['RECTANGLE','ELLIPSE','FRAME','VECTOR','TEXT','LINE','POLYGON','STAR','COMPONENT','COMPONENT_SET','BOOLEAN_OPERATION'] });

for (const n of nodes) {
  if (Array.isArray(n.fills)) {
    for (const f of n.fills) {
      if (f.type === 'SOLID' && f.boundVariables?.color) {
        const pname = palById[f.boundVariables.color.id];
        if (!pname) continue;
        const role = inferRole(n, 'fill', pname);
        if (role) {
          tally[role] = tally[role] || {};
          tally[role][pname] = (tally[role][pname] || 0) + 1;
        }
      }
    }
  }
  if (Array.isArray(n.strokes)) {
    for (const f of n.strokes) {
      if (f.type === 'SOLID' && f.boundVariables?.color) {
        const pname = palById[f.boundVariables.color.id];
        if (!pname) continue;
        const role = inferRole(n, 'stroke', pname);
        if (role) {
          tally[role] = tally[role] || {};
          tally[role][pname] = (tally[role][pname] || 0) + 1;
        }
      }
    }
  }
  if (n.type === 'TEXT' && n.characters?.length > 0) {
    try {
      const fills = n.getRangeFills(0, n.characters.length);
      if (Array.isArray(fills) && fills[0]?.type === 'SOLID' && fills[0].boundVariables?.color) {
        const pname = palById[fills[0].boundVariables.color.id];
        const role = inferRole(n, 'textFill', pname);
        if (role) {
          tally[role] = tally[role] || {};
          tally[role][pname] = (tally[role][pname] || 0) + 1;
        }
      }
    } catch(e) {}
  }
}
return { roleCount: Object.keys(tally).length, tally };
```

Expected: tally object covering most of the 31 roles with palette-name → count breakdowns. If the call times out, chunk by Mobile-Dark section (21 sections; ~5 per chunk fits easily under 25s).

### - [ ] Step 4.2: Build the override-proposal report

In a `ctx_execute` step (Node.js), compare `tally` against the defaults from the spec. For each role, find the palette name with >70% of votes; if that differs from our default Dark value, propose an override.

```js
const tally = /* paste from Step 4.1 result */;
const defaults = {
  'surface/primary': 'Gray/95',
  'surface/secondary': 'Gray/90',
  'surface/elevated': 'Gray/80',
  'surface/inverse': 'Gray/0 (White)',
  'surface/overlay': 'Transparent/Black/64%',
  'text/primary': 'Gray/10',
  'text/secondary': 'Gray/30',
  'text/tertiary': 'Gray/40',
  'text/disabled': 'Gray/70',
  'text/inverse': 'Gray/95',
  'border/subtle': 'Gray/80',
  'border/strong': 'Gray/60',
  'border/focus': 'Brand/40',
  'border/error': 'Destructive/40',
  'interactive/primary': 'Brand/40',
  'interactive/primary-hover': 'Brand/30',
  'interactive/primary-pressed': 'Brand/20',
  'interactive/primary-disabled': 'Brand/80',
  'interactive/secondary': 'Gray/80',
  'interactive/secondary-hover': 'Gray/70',
  'interactive/secondary-pressed': 'Gray/60',
  'interactive/destructive': 'Destructive/40',
  'interactive/destructive-hover': 'Destructive/30',
  'interactive/destructive-pressed': 'Destructive/20',
  'text/link': 'Blue/40',
  'text/link-hover': 'Blue/30',
  'state/success': 'Success/30',
  'state/danger': 'Destructive/40',
  'state/warning': 'Warning/30',
  'state/info': 'Blue/40',
  'state/neutral': 'Gray/40'
};

const overrides = [];
for (const [role, defaultVal] of Object.entries(defaults)) {
  const counts = tally[role] || {};
  const total = Object.values(counts).reduce((a,b)=>a+b, 0);
  if (total === 0) continue;
  const sorted = Object.entries(counts).sort((a,b) => b[1]-a[1]);
  const [topName, topCount] = sorted[0];
  const topPct = total ? (topCount / total) : 0;
  if (topPct >= 0.7 && topName !== defaultVal) {
    overrides.push({
      role,
      default: defaultVal,
      mobileDarkChoice: topName,
      confidence: (topPct * 100).toFixed(0) + '%',
      total
    });
  }
}
console.log(JSON.stringify({ proposedOverrides: overrides, fullTally: tally }, null, 2));
```

Expected: 3–7 proposed overrides. Save the output for Step 4.3.

### - [ ] Step 4.3: Save dark-override report

Use the Write tool to write `/Users/opeyemiajagbe/Documents/Projects/mindenity-2/design-system/migrations/backups/phase2-dark-override-report.json`:

```json
{
  "phase": 2,
  "step": "2C",
  "createdAt": "2026-05-12",
  "fullTally": { /* tally object from Step 4.1 */ },
  "proposedOverrides": [ /* array from Step 4.2 */ ],
  "approvedOverrides": []
}
```

### - [ ] Step 4.4: User checkpoint — review + approve overrides

Present the proposed overrides table to the user. Format:

```
| Role                    | Default → Dark | Mobile-Dark uses | Confidence |
|-------------------------|----------------|------------------|------------|
| interactive/primary     | Brand/40       | Brand/50         | 80% (320/400) |
| surface/secondary       | Gray/90        | Gray/85          | 75% (180/240) |
```

For each, ask the user "Accept Mobile-Dark choice, or keep default?" Collect approved overrides into an `approvedOverrides` array. If no overrides proposed (rare but possible), say so and proceed.

Update the `approvedOverrides` array in `phase2-dark-override-report.json` via the Edit tool.

Wait for user approval before proceeding to Task 5.

---

## Task 5: Add Dark mode to Semantic + commit values (Phase 2D)

**Files:**
- Mutate: Figma file — add second mode to Semantic collection + set values for all 31 variables
- Modify: `design-system/migrations/backups/phase2-semantic-tokens.json`

### - [ ] Step 5.1: Build the final taxonomy with approved overrides

In a `ctx_execute` step, read `phase2-dark-override-report.json`, apply `approvedOverrides` to the taxonomy default Dark values:

```js
const fs = require('fs');
const report = JSON.parse(fs.readFileSync('/Users/opeyemiajagbe/Documents/Projects/mindenity-2/design-system/migrations/backups/phase2-dark-override-report.json', 'utf8'));

const taxonomy = /* same array from Step 3.1 */;
const overrideMap = {};
for (const o of report.approvedOverrides) overrideMap[o.role] = o.mobileDarkChoice;

const finalTaxonomy = taxonomy.map(t => ({
  ...t,
  dark: overrideMap[t.name] ?? t.dark
}));
console.log(JSON.stringify(finalTaxonomy, null, 2));
```

Expected: 31 entries with `dark` values reflecting any overrides.

### - [ ] Step 5.2: Run add-Dark-mode script

Via `figma_execute`:

```js
await figma.loadAllPagesAsync();
const sem = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Semantic');
if (!sem) return { error: 'Semantic collection missing' };

// Bail if Dark mode already exists
if (sem.modes.some(m => m.name === 'Dark')) return { error: 'Dark mode already exists', modes: sem.modes };

const darkModeId = sem.addMode('Dark');

const palette = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Palette');
const palVars = await figma.variables.getLocalVariablesAsync();
const palByName = {};
for (const v of palVars) if (v.variableCollectionId === palette.id) palByName[v.name] = v;
const semVars = palVars.filter(v => v.variableCollectionId === sem.id);
const semByName = {};
for (const v of semVars) semByName[v.name] = v;

const finalTaxonomy = /* paste array from Step 5.1 */;

const errors = [];
let applied = 0;
for (const t of finalTaxonomy) {
  const v = semByName[t.name];
  if (!v) { errors.push({ name: t.name, error: 'semantic variable missing' }); continue; }
  const target = palByName[t.dark];
  if (!target) { errors.push({ name: t.name, error: 'dark palette target missing: ' + t.dark }); continue; }
  v.setValueForMode(darkModeId, { type: 'VARIABLE_ALIAS', id: target.id });
  applied++;
}
return { darkModeId, applied, errors };
```

Expected: `applied: 31`, `errors: []`.

### - [ ] Step 5.3: Verify Dark mode resolves correctly

Via `figma_execute`:

```js
const sem = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Semantic');
const lightMode = sem.modes.find(m => m.name === 'Light').modeId;
const darkMode = sem.modes.find(m => m.name === 'Dark').modeId;
const vars = await figma.variables.getLocalVariablesAsync();
const semVars = vars.filter(v => v.variableCollectionId === sem.id);

const t = (n) => Math.round(n*255).toString(16).padStart(2,'0');
async function resolve(v, modeId) {
  const val = v.valuesByMode[modeId];
  if (val?.type === 'VARIABLE_ALIAS') {
    const target = await figma.variables.getVariableByIdAsync(val.id);
    const tval = target.valuesByMode[Object.keys(target.valuesByMode)[0]];
    if (tval && 'r' in tval) return '#' + t(tval.r) + t(tval.g) + t(tval.b);
  }
  return null;
}

const sample = [];
for (const name of ['surface/primary', 'text/primary', 'interactive/primary', 'state/danger', 'border/subtle']) {
  const v = semVars.find(sv => sv.name === name);
  if (!v) { sample.push({ name, error: 'missing' }); continue; }
  sample.push({ name, light: await resolve(v, lightMode), dark: await resolve(v, darkMode) });
}
return { modes: sem.modes.map(m => ({ id: m.modeId, name: m.name })), sample };
```

Expected sample shape (assuming no overrides):
```
{ name: 'surface/primary', light: '#ffffff', dark: '#0c0a09' }
{ name: 'text/primary',    light: '#292524', dark: '#f5f5f4' }
{ name: 'interactive/primary', light: '#926247', dark: '#b1865e' }
```

### - [ ] Step 5.4: Update semantic-tokens backup with final dark values

Edit `/Users/opeyemiajagbe/Documents/Projects/mindenity-2/design-system/migrations/backups/phase2-semantic-tokens.json`:
- Set `step` to `"2D-final"`
- Set `darkModeId` to the value from Step 5.2 result
- For each token entry, set `darkApplied: true` and update `dark` to the final value (with overrides) and `darkVariableId` to the resolved palette variable ID.

### - [ ] Step 5.5: User checkpoint pause

State to user: "Dark mode added. Spot-checked 5 variables — light + dark hex values resolve correctly. Ready to start rebinding component fills (Task 6, the long one)."

Wait for user approval.

---

## Task 6: Hybrid heuristic rebind of component bindings (Phase 2E)

This task has the most steps because it runs in chunks (30s bridge timeout). The pattern is "kick off rebind script → re-scan progress → repeat until 0 remaining". Same approach as Phase 1.

**Files:**
- Mutate: Figma file — rebind ~24,000 fills/strokes/text-fills on DS-page components
- Create: `design-system/migrations/backups/phase2-rebind-log.json` (accumulated across runs)
- Create: `design-system/migrations/backups/phase2-coverage-report.json` (final, after rebind complete)

### - [ ] Step 6.1: Build the rebind script (reusable, runs against one or more frame IDs)

Save the canonical script to a variable so we can re-invoke it per chunk. Here's the full script body:

```js
const start = Date.now();
const BAIL_MS = 25000;
await figma.loadAllPagesAsync();

const palette = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Palette');
const sem = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Semantic');
const allVars = await figma.variables.getLocalVariablesAsync();
const palById = {};
const palByName = {};
const semByName = {};
for (const v of allVars) {
  if (v.variableCollectionId === palette.id) { palById[v.id] = v.name; palByName[v.name] = v; }
  if (v.variableCollectionId === sem.id) { semByName[v.name] = v; }
}

// Heuristic: same rules as spec §2E. Returns semantic variable or null.
function pickSemantic(node, kind, paletteName) {
  // Skip Foundations section descendants (handled by caller scope, not here)

  // Rule 1: Text fills
  if (kind === 'textFill' || (kind === 'fill' && (node.type === 'TEXT' || node.type === 'VECTOR'))) {
    if (paletteName === 'Gray/80' || paletteName === 'Gray/90') return semByName['text/primary'];
    if (paletteName === 'Gray/60' || paletteName === 'Gray/70') return semByName['text/secondary'];
    if (paletteName === 'Gray/40' || paletteName === 'Gray/50') return semByName['text/tertiary'];
    if (paletteName === 'Gray/20' || paletteName === 'Gray/30') return semByName['text/disabled'];
    if (paletteName === 'Gray/0 (White)' || paletteName === 'Gray/5') return semByName['text/inverse'];
    if (paletteName === 'Blue/60' || paletteName === 'Blue/70') return semByName['text/link'];
  }

  // Rule 3: Strokes
  if (kind === 'stroke') {
    if (paletteName === 'Gray/20' || paletteName === 'Gray/30') return semByName['border/subtle'];
    if (paletteName === 'Gray/40' || paletteName === 'Gray/50') return semByName['border/strong'];
    if (paletteName?.startsWith('Destructive/')) return semByName['border/error'];
    if (paletteName === 'Brand/60') return semByName['border/focus'];
  }

  // Rule 4: Obvious semantic-role palette colors
  if (paletteName === 'Success/50') return semByName['state/success'];
  if (paletteName === 'Warning/50') return semByName['state/warning'];

  // Brand-as-interactive: name-based context check via ancestor walk
  function isInButtonContext(n) {
    let cur = n;
    for (let i = 0; i < 6 && cur; i++) {
      if (cur.name && /button|cta/i.test(cur.name)) return true;
      cur = cur.parent;
    }
    return false;
  }
  if (kind === 'fill') {
    if (paletteName === 'Destructive/60') {
      return isInButtonContext(node) ? semByName['interactive/destructive'] : semByName['state/danger'];
    }
    if (paletteName === 'Destructive/70' && isInButtonContext(node)) return semByName['interactive/destructive-hover'];
    if (paletteName === 'Destructive/80' && isInButtonContext(node)) return semByName['interactive/destructive-pressed'];
    if (paletteName === 'Brand/60' && isInButtonContext(node)) return semByName['interactive/primary'];
    if (paletteName === 'Brand/70' && isInButtonContext(node)) return semByName['interactive/primary-hover'];
    if (paletteName === 'Brand/80' && isInButtonContext(node)) return semByName['interactive/primary-pressed'];
    if (paletteName === 'Brand/20' && isInButtonContext(node)) return semByName['interactive/primary-disabled'];
    if (paletteName === 'Gray/10' && isInButtonContext(node)) return semByName['interactive/secondary'];
    if (paletteName === 'Gray/20' && isInButtonContext(node)) return semByName['interactive/secondary-hover'];
    if (paletteName === 'Gray/30' && isInButtonContext(node)) return semByName['interactive/secondary-pressed'];
  }

  return null;
}

// Skip Foundations section: any node with an ancestor named 'Foundations' (id 10827:19797) — check by walking parents
function isInFoundations(node) {
  let cur = node;
  for (let i = 0; i < 12 && cur; i++) {
    if (cur.id === '10827:19797') return true;
    cur = cur.parent;
  }
  return false;
}

const FRAME_IDS = /* PARAMETER — passed in per call. Array of frame IDs. */ [];

const log = []; // { nodeId, kind, fromVar, toVar }
const stats = { processedNodes: 0, fillsRebound: 0, strokesRebound: 0, textFillsRebound: 0, foundationsSkipped: 0, leftOnPalette: 0 };

for (const frameId of FRAME_IDS) {
  if (Date.now() - start > BAIL_MS) break;
  const root = await figma.getNodeByIdAsync(frameId);
  if (!root) continue;
  const nodes = root.findAllWithCriteria({ types: ['RECTANGLE','ELLIPSE','FRAME','VECTOR','TEXT','LINE','POLYGON','STAR','COMPONENT','COMPONENT_SET','BOOLEAN_OPERATION'] });
  for (const n of nodes) {
    if (Date.now() - start > BAIL_MS + 3000) break;
    stats.processedNodes++;
    if (isInFoundations(n)) { stats.foundationsSkipped++; continue; }

    // Fills
    if (Array.isArray(n.fills) && n.fills.some(f => f.type === 'SOLID' && f.boundVariables?.color)) {
      let changed = false;
      const newFills = n.fills.map(f => {
        if (f.type !== 'SOLID' || !f.boundVariables?.color) return f;
        const palName = palById[f.boundVariables.color.id];
        if (!palName) return f; // not a Palette variable (maybe already Semantic)
        const sv = pickSemantic(n, 'fill', palName);
        if (!sv) { stats.leftOnPalette++; return f; }
        log.push({ nodeId: n.id, kind: 'fill', fromVar: palName, toVar: sv.name });
        changed = true;
        return figma.variables.setBoundVariableForPaint(f, 'color', sv);
      });
      if (changed) { n.fills = newFills; stats.fillsRebound++; }
    }

    // Strokes
    if (Array.isArray(n.strokes) && n.strokes.some(f => f.type === 'SOLID' && f.boundVariables?.color)) {
      let changed = false;
      const newStrokes = n.strokes.map(f => {
        if (f.type !== 'SOLID' || !f.boundVariables?.color) return f;
        const palName = palById[f.boundVariables.color.id];
        if (!palName) return f;
        const sv = pickSemantic(n, 'stroke', palName);
        if (!sv) { stats.leftOnPalette++; return f; }
        log.push({ nodeId: n.id, kind: 'stroke', fromVar: palName, toVar: sv.name });
        changed = true;
        return figma.variables.setBoundVariableForPaint(f, 'color', sv);
      });
      if (changed) { n.strokes = newStrokes; stats.strokesRebound++; }
    }

    // Text range fills (whole-range only — mixed ranges left alone)
    if (n.type === 'TEXT' && n.characters?.length > 0) {
      try {
        const len = n.characters.length;
        const fills = n.getRangeFills(0, len);
        if (fills === figma.mixed) continue;
        if (!Array.isArray(fills) || !fills[0]?.boundVariables?.color) continue;
        const palName = palById[fills[0].boundVariables.color.id];
        if (!palName) continue;
        const sv = pickSemantic(n, 'textFill', palName);
        if (!sv) { stats.leftOnPalette++; continue; }
        const newFills = fills.map(f =>
          f.type === 'SOLID' && f.boundVariables?.color
            ? figma.variables.setBoundVariableForPaint(f, 'color', sv)
            : f
        );
        n.setRangeFills(0, len, newFills);
        log.push({ nodeId: n.id, kind: 'textFill', fromVar: palName, toVar: sv.name });
        stats.textFillsRebound++;
      } catch(e) {}
    }
  }
}

return { stats, logSize: log.length, log };
```

This is **the reusable rebind script**. Save it as a string to re-invoke per chunk. The `FRAME_IDS` array is the only thing that changes per call.

### - [ ] Step 6.2: Run rebind for Foundations (skipped) + smallest component categories

Frame IDs for first chunk (sorted smallest first, expected to fit easily):

```
const FRAME_IDS = [
  '10693:61575', // Progress & Indicator
  '10693:61704', // Slider
  '10611:56853', // File Upload
  '10611:53754', // Dialog/Modal
  '10611:45620', // Accordion
  '10611:45340', // Alert & Notification
  '10693:60129', // Pagination
  '10611:52644', // Line Chart
  '10693:66491', // Tooltip
  '10724:20795', // Navigations
  '10611:58477', // Loader
  '10611:51141', // Breadcrumb
  '10611:54548', // Dropdown
  '10611:57418', // Form Controls
  '10611:53545'  // Date Picker
];
```

Substitute into the script from Step 6.1 and invoke `figma_execute`. Expected: 5,000-8,000 rebinds + log entries. If the result overflows context, the result file will be saved to the tool-output temp path — capture the path for later log aggregation.

If a timeout occurs, the mutations still landed — proceed to the next step. Phase 1 established this is safe.

### - [ ] Step 6.3: Run rebind for medium categories

```
const FRAME_IDS = [
  '10693:63163', // Table
  '10693:59457', // Misc & Helper
  '10611:46889', // Badge/Tag
  '10611:58324', // Input
  '10611:51249'  // Chat System
];
```

Invoke. Capture log.

### - [ ] Step 6.4: Run rebind for large categories

```
const FRAME_IDS = [
  '10693:62948', // Step
  '10693:66383', // Tab
  '10723:18403'  // Mobile App Components
];
```

Invoke. Capture log.

### - [ ] Step 6.5: Run rebind for Button (largest — split by child sub-frame if needed)

Button has 5 child sub-frames. Try the parent first:

```
const FRAME_IDS = ['10611:50091']; // Button
```

If it times out and progress is partial, split:

```
const FRAME_IDS = [
  '10734:27175', '10734:27170', '22399:21534', '10734:26931', '10734:26926'
];
```

Phase 1 used this exact pattern. Re-run as many times as needed; each call only rebinds the still-palette-bound nodes (already-semantic-bound nodes are skipped by the `palById` lookup returning undefined).

### - [ ] Step 6.6: Re-scan to confirm 0 remaining palette bindings on rebind candidates

Via `figma_execute`:

```js
await figma.loadAllPagesAsync();
const palette = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Palette');
const palVars = await figma.variables.getLocalVariablesAsync();
const palById = {};
for (const v of palVars) if (v.variableCollectionId === palette.id) palById[v.id] = v.name;

const dsPage = figma.root.children.find(p => p.id === '10611:33504');
const nodes = dsPage.findAllWithCriteria({ types: ['RECTANGLE','ELLIPSE','FRAME','VECTOR','TEXT','LINE','POLYGON','STAR','COMPONENT','COMPONENT_SET','BOOLEAN_OPERATION'] });

// Count palette bindings that the heuristic would rebind (vs those it deliberately leaves)
// Simplification: count all current palette bindings + bucket by frame ancestor
let onPaletteCount = 0;
let onSemanticCount = 0;
let foundationsCount = 0;

function isInFoundations(node) {
  let cur = node;
  for (let i = 0; i < 12 && cur; i++) {
    if (cur.id === '10827:19797') return true;
    cur = cur.parent;
  }
  return false;
}

for (const n of nodes) {
  const inFoundations = isInFoundations(n);
  function tally(arr) {
    if (!Array.isArray(arr)) return;
    for (const f of arr) {
      if (f.type === 'SOLID' && f.boundVariables?.color) {
        if (palById[f.boundVariables.color.id]) {
          if (inFoundations) foundationsCount++;
          else onPaletteCount++;
        } else onSemanticCount++;
      }
    }
  }
  tally(n.fills);
  tally(n.strokes);
}

return { onPalette: onPaletteCount, onSemantic: onSemanticCount, foundationsKept: foundationsCount };
```

Expected: `onSemantic` ≈ 20,000-25,000; `onPalette` (leftover, expected to stay on palette per the heuristic rules) ≈ 5,000-10,000; `foundationsKept` is whatever's left in the Primary Colors swatches (preserved intentionally).

If `onPalette` is dramatically higher than expected (>15,000), inspect whether the heuristic rules need tuning. Otherwise proceed.

### - [ ] Step 6.7: Aggregate the rebind log into one file

Across Steps 6.2-6.5, multiple `figma_execute` calls returned `log` arrays. Concatenate them and write to `/Users/opeyemiajagbe/Documents/Projects/mindenity-2/design-system/migrations/backups/phase2-rebind-log.json`:

```json
{
  "phase": 2,
  "step": "2E",
  "createdAt": "2026-05-12",
  "totalRebinds": <sum>,
  "byKind": { "fill": <n>, "stroke": <n>, "textFill": <n> },
  "byTargetSemantic": { "text/primary": <n>, "surface/primary": <n>, ... },
  "entries": [
    { "nodeId": "...", "kind": "fill", "fromVar": "Gray/60", "toVar": "text/secondary" }
    // ... all log entries
  ]
}
```

If the combined log is too large to write inline (likely — could be 20MB+), use `ctx_execute` to write it from a script that concatenates the temp-file outputs from each call.

### - [ ] Step 6.8: Generate per-category coverage report

Via `figma_execute`:

```js
await figma.loadAllPagesAsync();
const palette = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Palette');
const sem = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Semantic');
const allVars = await figma.variables.getLocalVariablesAsync();
const palById = {};
const semById = {};
for (const v of allVars) {
  if (v.variableCollectionId === palette.id) palById[v.id] = v.name;
  if (v.variableCollectionId === sem.id) semById[v.id] = v.name;
}

const categories = [
  ['Alert & Notification', '10611:45340'],
  ['Accordion', '10611:45620'],
  ['Badge/Tag', '10611:46889'],
  ['Button', '10611:50091'],
  ['Breadcrumb', '10611:51141'],
  ['Chat System', '10611:51249'],
  ['Line Chart', '10611:52644'],
  ['Date Picker', '10611:53545'],
  ['Dialog/Modal', '10611:53754'],
  ['Dropdown', '10611:54548'],
  ['File Upload', '10611:56853'],
  ['Form Controls', '10611:57418'],
  ['Input', '10611:58324'],
  ['Loader', '10611:58477'],
  ['Misc & Helper', '10693:59457'],
  ['Pagination', '10693:60129'],
  ['Progress & Indicator', '10693:61575'],
  ['Slider', '10693:61704'],
  ['Step', '10693:62948'],
  ['Table', '10693:63163'],
  ['Tab', '10693:66383'],
  ['Tooltip', '10693:66491'],
  ['Navigations', '10724:20795'],
  ['Mobile App Components', '10723:18403']
];

const out = [];
for (const [name, id] of categories) {
  const root = await figma.getNodeByIdAsync(id);
  const nodes = root.findAllWithCriteria({ types: ['RECTANGLE','ELLIPSE','FRAME','VECTOR','TEXT','LINE','POLYGON','STAR','COMPONENT','COMPONENT_SET','BOOLEAN_OPERATION'] });
  let onPal = 0, onSem = 0;
  for (const n of nodes) {
    const tally = (arr) => {
      if (!Array.isArray(arr)) return;
      for (const f of arr) {
        if (f.type === 'SOLID' && f.boundVariables?.color) {
          if (palById[f.boundVariables.color.id]) onPal++;
          else if (semById[f.boundVariables.color.id]) onSem++;
        }
      }
    };
    tally(n.fills);
    tally(n.strokes);
  }
  const total = onPal + onSem;
  out.push({ category: name, total, onSemantic: onSem, onPalette: onPal, semanticPct: total ? (onSem/total*100).toFixed(1) : '0' });
}
return out;
```

Write the result to `/Users/opeyemiajagbe/Documents/Projects/mindenity-2/design-system/migrations/backups/phase2-coverage-report.json` via the Write tool.

### - [ ] Step 6.9: User checkpoint — review coverage report

Surface the table to the user. Flag any category with `semanticPct < 50` for Phase 2.5 manual polish. Ask user to confirm before proceeding to verification.

---

## Task 7: Verification + rollback script (Phase 2F)

**Files:**
- Read-only: Figma
- Create: `design-system/migrations/phase2-rollback.js`
- Create: ~10 PNG files in `design-system/migrations/qa-screenshots/`

### - [ ] Step 7.1: Resolution sanity check (20 random rebound samples)

Via `figma_execute`:

```js
const log = /* sample 20 entries from rebind log via Read of phase2-rebind-log.json */;
const out = [];
for (const entry of log) {
  const node = await figma.getNodeByIdAsync(entry.nodeId);
  if (!node) { out.push({ ...entry, error: 'node missing' }); continue; }
  let bindings;
  if (entry.kind === 'fill') bindings = node.fills;
  else if (entry.kind === 'stroke') bindings = node.strokes;
  else if (entry.kind === 'textFill') bindings = node.getRangeFills(0, node.characters.length);
  const bound = (bindings || []).find(b => b.type === 'SOLID' && b.boundVariables?.color);
  if (!bound) { out.push({ ...entry, error: 'no bound variable' }); continue; }
  const v = await figma.variables.getVariableByIdAsync(bound.boundVariables.color.id);
  out.push({ ...entry, currentVar: v?.name, isSemantic: v?.name === entry.toVar });
}
return out;
```

Expected: all 20 samples show `isSemantic: true` and `currentVar === entry.toVar`.

### - [ ] Step 7.2: Capture screenshots in Light mode

Via `mcp__paperclip-figma-bridge__figma_capture_screenshot` for each of these nodes (one call each):

1. Button frame: `10611:50091`
2. Input frame: `10611:58324`
3. Modal: `10611:53754`
4. Top Nav: `10724:20795`
5. Mobile-Light Authentication section: `22543:61121`

Save the resulting base64 PNG data to files under `design-system/migrations/qa-screenshots/`:
- `phase2-button-light.png`
- `phase2-input-light.png`
- `phase2-modal-light.png`
- `phase2-topnav-light.png`
- `phase2-mobile-auth-light.png`

If the response is too large, save the path the bridge wrote it to and reference it.

### - [ ] Step 7.3: Flip Mobile-Light section to Dark mode + capture

Via `figma_execute`:

```js
await figma.loadAllPagesAsync();
const sem = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Semantic');
const darkMode = sem.modes.find(m => m.name === 'Dark').modeId;
const sectionNode = await figma.getNodeByIdAsync('22543:61121');
sectionNode.setExplicitVariableModeForCollection(sem, darkMode);
return { ok: true };
```

Then capture screenshot of `22543:61121`, save as `phase2-mobile-auth-dark.png`.

Then restore the section's mode:
```js
const sectionNode = await figma.getNodeByIdAsync('22543:61121');
sectionNode.clearExplicitVariableModeForCollection(sem);
```

### - [ ] Step 7.4: Visual eyeball check

Show the user paths to all the PNG files. Ask: "Do these look right in both light and dark? Any obvious bugs (white-on-white, illegible contrast)?"

If user reports an issue, fix the specific binding manually (look up node in rebind log, manually rebind to a different semantic) and re-capture.

### - [ ] Step 7.5: Write the rollback script

Use Write tool to create `/Users/opeyemiajagbe/Documents/Projects/mindenity-2/design-system/migrations/phase2-rollback.js` with:

```js
// Phase 2 rollback — re-binds all Semantic-bound nodes back to their original Palette variables.
// Pre-req: design-system/migrations/backups/phase2-rebind-log.json exists.
// Usage: paste into mcp__paperclip-figma-bridge__figma_execute. Run in chunks if needed.

const REBIND_LOG = /* Paste the contents of phase2-rebind-log.json's entries array — or shard if >5000 entries */;

await figma.loadAllPagesAsync();
const palette = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Palette');
const palVars = await figma.variables.getLocalVariablesAsync();
const palByName = {};
for (const v of palVars) if (v.variableCollectionId === palette.id) palByName[v.name] = v;

const start = Date.now();
const BAIL_MS = 25000;
let restored = 0;
for (const entry of REBIND_LOG) {
  if (Date.now() - start > BAIL_MS) break;
  const node = await figma.getNodeByIdAsync(entry.nodeId);
  if (!node) continue;
  const target = palByName[entry.fromVar];
  if (!target) continue;

  if (entry.kind === 'fill' && Array.isArray(node.fills)) {
    node.fills = node.fills.map(f =>
      f.type === 'SOLID' && f.boundVariables?.color
        ? figma.variables.setBoundVariableForPaint(f, 'color', target)
        : f
    );
    restored++;
  } else if (entry.kind === 'stroke' && Array.isArray(node.strokes)) {
    node.strokes = node.strokes.map(f =>
      f.type === 'SOLID' && f.boundVariables?.color
        ? figma.variables.setBoundVariableForPaint(f, 'color', target)
        : f
    );
    restored++;
  } else if (entry.kind === 'textFill' && node.type === 'TEXT') {
    const len = node.characters.length;
    const fills = node.getRangeFills(0, len);
    if (Array.isArray(fills)) {
      const newFills = fills.map(f =>
        f.type === 'SOLID' && f.boundVariables?.color
          ? figma.variables.setBoundVariableForPaint(f, 'color', target)
          : f
      );
      node.setRangeFills(0, len, newFills);
      restored++;
    }
  }
}
return { restored };
```

### - [ ] Step 7.6: User checkpoint pause

State to user: "Verification passed. Rollback script written. Ready to switch Mobile-Light page to use Semantic Light mode explicitly (Task 8)."

Wait for user approval.

---

## Task 8: Set explicit Semantic mode on Mobile-Light page (Phase 2G)

**Files:**
- Mutate: Figma file — set page-level Semantic mode

### - [ ] Step 8.1: Set Mobile-Light page mode to Light explicitly

Via `figma_execute`:

```js
await figma.loadAllPagesAsync();
const sem = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Semantic');
const lightMode = sem.modes.find(m => m.name === 'Light').modeId;
const page = figma.root.children.find(p => p.id === '20307:23730');
page.setExplicitVariableModeForCollection(sem, lightMode);
return { ok: true, pageName: page.name };
```

Expected: `ok: true, pageName: "Mobile template - light"`.

### - [ ] Step 8.2: Spot-check Mobile-Light renders correctly

Capture screenshot of Mobile-Light Authentication section (`22543:61121`) and save as `phase2-mobile-auth-light-mode-set.png`.

User visually compares to the pre-set state — should be identical (same renderings, just now under explicit mode declaration).

### - [ ] Step 8.3: Confirm Dark mode override still works on individual frames

Repeat the flip-and-restore from Task 7.3 on a different section frame (e.g. Sleep Level `22557:63998`). Capture before + after.

### - [ ] Step 8.4: User checkpoint

State to user: "Mobile-Light is now under explicit Semantic Light mode. Frame-level Dark mode override confirmed working. Ready to validate dark-mode parity across all 21 mobile sections before deleting Mobile-Dark (Task 9)."

Wait for user approval.

---

## Task 9: Mobile-Dark deletion pre-checks

**Files:**
- Read-only: Figma; capture screenshots
- Create: ~21 PNG pairs in `design-system/migrations/qa-screenshots/parity/`

### - [ ] Step 9.1: For each of 21 mobile sections, flip Mobile-Light section to Dark + capture

For each section in Mobile-Light, do the same flip-and-restore as Task 7.3. Capture screenshot under Dark mode. Save with naming `phase2-parity-<section-slug>-darkmode.png`.

The 21 sections (from `phase2-semantic-tokens-and-dark-mode-design.md` Section 4):
```
['Splash & Loading', '22543:56128'],
['Welcome Screen', '22543:60702'],
['Authentication', '22543:61121'],
['Comprehensive Mental Health Assessment', '22544:67968'],
['Profile Setup & Account Completion', '22545:60042'],
['Home & Mental Health Metrics', '22548:102299'],
['Mindful AI Companion', '22572:67306'],
['AI Symptom Checker', '22576:67293'],
['Gratefulness & Affirmations', '22573:60811'],
['Self Journaling', '22549:64318'],
['Stress Management', '22550:44765'],
['Mood Tracker', '22556:45332'],
['Sleep Level', '22557:63998'],
['Mindful Minutes', '22570:49353'],
['Therapist Appointment', '22571:47187'],
['Search & Notifications', '22576:70870'],
['Error & Utility', '22579:48841'],
['Mental Health Resources', '22582:53319'],
['Mindful Community', '22582:75676'],
['Profile Settings & Help Center', '22583:67135'],
['Achievements', '22583:72850']
```

Make sure to clear the mode override after each capture so the section returns to inherit-from-page (Light).

### - [ ] Step 9.2: Capture corresponding Mobile-Dark sections

The Mobile-Dark mirror sections (already in dark mode natively):
```
['Splash & Loading', '22590:66191'],
['Welcome Screen', '22590:66303'],
... (21 entries — same names as Mobile-Light, different IDs)
```

Full list is in `design-system/manifest.json` under `templates.mobileDark.sections`.

Capture each, save as `phase2-parity-<section-slug>-mobiledark.png`.

### - [ ] Step 9.3: Side-by-side visual diff for user review

State to user: "21 section pairs captured. For each pair, the Mobile-Light-in-dark-mode rendering should match Mobile-Dark within 95% visual parity. Please review the screenshots in `design-system/migrations/qa-screenshots/parity/` and flag any sections where the new dark rendering looks structurally wrong (missing background, wrong contrast hierarchy, illegible text)."

Wait for user response. If user flags any sections, address before proceeding — could be heuristic mismatches (Task 6 leftover) or a wrong semantic value (fix via the Semantic variable's mode value).

### - [ ] Step 9.4: Confirm coverage report is acceptable

Re-read `phase2-coverage-report.json`. Confirm: no category has `semanticPct < 50`. If any does, ask user to decide: proceed with deletion anyway (Phase 2.5 polish later), or block on that category first.

---

## Task 10: Delete Mobile-Dark page

**Files:**
- Mutate: Figma file — delete one page

### - [ ] Step 10.1: Run delete script

Via `figma_execute`:

```js
await figma.loadAllPagesAsync();
const darkPage = figma.root.children.find(p => p.id === '22590:65589');
if (!darkPage) return { error: 'Mobile-Dark page already missing or different ID' };
const pageName = darkPage.name;
darkPage.remove();
return { ok: true, deletedPageName: pageName, remainingPageCount: figma.root.children.length };
```

Expected: `ok: true, deletedPageName: "Mobile template - Dark", remainingPageCount: 6` (was 7).

### - [ ] Step 10.2: Verify deletion

Via `figma_execute`:
```js
const pages = figma.root.children.map(p => ({ id: p.id, name: p.name }));
return pages;
```

Confirm no page with name containing "Dark" or ID `22590:65589`.

### - [ ] Step 10.3: User checkpoint

State: "Mobile-Dark page deleted. Figma file version history preserves it if rollback needed (File → Show version history). Ready for documentation updates (Task 11)."

---

## Task 11: Documentation updates

**Files:**
- Modify: `design-system/templates.md`
- Modify: `design-system/manifest.json`
- Modify: `design-system/README.md`
- Modify: `design-system/foundations/colors.md`
- Modify: `design-system/foundations/tokens.md`
- Modify: `CLAUDE.md` (project root)
- Create: `design-system/migrations/phase2-semantic-tokens-and-dark-mode.md`

### - [ ] Step 11.1: Update `design-system/templates.md`

Use Edit tool to:
- Delete the entire `## Mobile template — Dark` section (table + heading).
- Rewrite `## Mobile template — light` heading to `## Mobile template` (drop "light" since it's the only page).
- In the "How to use this for a screen-build prompt" section, replace any text about picking the dark page with: "For dark-mode previews, flip the section frame's Semantic mode to Dark via the Variables panel."

### - [ ] Step 11.2: Update `design-system/manifest.json`

Use ctx_execute to read the manifest, remove `templates.mobileDark` entirely, update `pages` array (drop the Mobile-Dark entry), then write back.

```js
const fs = require('fs');
const path = '/Users/opeyemiajagbe/Documents/Projects/mindenity-2/design-system/manifest.json';
const m = JSON.parse(fs.readFileSync(path, 'utf8'));
delete m.templates.mobileDark;
delete m.pages.mobileDark;
m.notes.themes = 'Single Mobile template page. Dark mode via Semantic collection mode flip (page or frame level).';
fs.writeFileSync(path, JSON.stringify(m, null, 2));
console.log('manifest updated; size:', fs.statSync(path).size);
```

### - [ ] Step 11.3: Update `design-system/README.md`

Use Edit tool to:
- Update the "Variables" line to: `**Variables:** 36 numeric + 144 Palette colors + 31 Semantic tokens (Phase 2 complete 2026-05-12).`
- Update the "Pages" line: `**Pages:** 6 — Design System & Components, Icon Set, Mobile template, Desktop template, ---, 📷 Thumbnail` (drop Mobile-Dark).
- Update the "Theme model" line: `**Theme model:** light + dark are **Semantic collection modes**, not separate pages. Flip the page or frame's Semantic mode to render dark.`

### - [ ] Step 11.4: Update `design-system/foundations/colors.md`

Use Edit tool to:
- Replace the `Colors` collection ID reference with `Palette` collection (`VariableCollectionId:24302:186441`).
- Add a new top section pointing to the `Semantic` collection as the public API. Move the existing palette tables down as "Palette reference (implementation detail)".

Replace the existing intro paragraph with:

```markdown
Source: `Design System & Components` page → `Foundations` section → `Primary Colors` frame (nodeId `10611:34536`).

**Two-layer color system:**
- **`Semantic` collection** — 31 role-based tokens (`surface/primary`, `text/primary`, etc.) with `Light` + `Dark` modes. **This is what components bind to.** See [migrations/phase2-semantic-tokens-and-dark-mode.md](../migrations/phase2-semantic-tokens-and-dark-mode.md) for the full list.
- **`Palette` collection** — 144 raw color variables (single mode). Used by Semantic aliases. Don't bind to these directly except in Foundations swatch displays.

Original 245 paint styles still in the file as legacy (gradients + image fills can't be variables; solid color paint styles are unused but preserved for rollback).
```

### - [ ] Step 11.5: Update `design-system/foundations/tokens.md`

Use Edit tool. Replace the note that ends the file:

Old:
```markdown
## Note: color tokens live in a separate collection

This `Variables` collection holds only numeric tokens. **Color variables live in the `Colors` collection** (`VariableCollectionId:24302:186441`) — see [colors.md](colors.md). Phase 1 migration completed 2026-05-12.
```

New:
```markdown
## Note: color tokens live in separate collections

This `Variables` collection holds only numeric tokens. Color is split into two collections:
- **`Palette`** (formerly `Colors`) — 144 raw color values, single mode.
- **`Semantic`** — 31 role-based tokens with `Light` + `Dark` modes (the public API for components).

See [colors.md](colors.md).
```

### - [ ] Step 11.6: Update `CLAUDE.md` (project root)

Use Edit tool. Replace the Theme model + Tokens bullets:

Old:
```markdown
- **Theme model:** light + dark are separate Figma pages today (NOT variable modes). Phase 2 migration will collapse this into a single mode toggle. Until then, pick the matching page.
- **Tokens:** 36 numeric variables (radius, spacing, size, icon-size) **+ 144 color variables in the `Colors` collection** (Phase 1 migration complete 2026-05-12). Use color variables for all fills/strokes; gradients + image fills still come from paint styles.
```

New:
```markdown
- **Theme model:** light + dark are `Semantic` collection modes on a single Mobile template page. Flip the page or frame's Semantic mode to switch.
- **Tokens:** 36 numeric variables (radius, spacing, size, icon-size) + 144 `Palette` colors + 31 `Semantic` tokens with light/dark modes (Phase 2 complete 2026-05-12). Components bind to Semantic; Palette is implementation detail.
```

Also replace the screen-build workflow line that mentions picking light vs dark page:

Old: `2. Pick light or dark page based on the request.`
New: `2. Open the Mobile template page. For dark-mode requests, flip the section frame's Semantic mode to Dark before duplicating.`

### - [ ] Step 11.7: Write the Phase 2 retrospective

Use Write tool. Create `/Users/opeyemiajagbe/Documents/Projects/mindenity-2/design-system/migrations/phase2-semantic-tokens-and-dark-mode.md` with structure:

```markdown
# Phase 2 — semantic tokens + dark mode + Mobile-Dark retirement

**Status:** ✅ Complete (2026-05-12)
**Predecessor:** Phase 1 paint→palette migration.
**Spec:** [docs/superpowers/specs/2026-05-12-phase2-semantic-tokens-and-dark-mode-design.md](../../docs/superpowers/specs/2026-05-12-phase2-semantic-tokens-and-dark-mode-design.md)
**Plan:** [docs/superpowers/plans/2026-05-12-phase2-semantic-tokens-and-dark-mode.md](../../docs/superpowers/plans/2026-05-12-phase2-semantic-tokens-and-dark-mode.md)

## What landed

- `Colors` collection renamed → `Palette`.
- New `Semantic` collection: 31 tokens, two modes (`Light`, `Dark`). Token list and final mappings in [backups/phase2-semantic-tokens.json](backups/phase2-semantic-tokens.json).
- <N> component bindings rebound palette → semantic across the DS page (full log: [backups/phase2-rebind-log.json](backups/phase2-rebind-log.json)).
- Mobile-Light page set to explicit `Semantic = Light` mode.
- Mobile-Dark page deleted.
- Coverage report: [backups/phase2-coverage-report.json](backups/phase2-coverage-report.json).
- Override decisions for dark values: [backups/phase2-dark-override-report.json](backups/phase2-dark-override-report.json).

## Visual QA

Screenshots in [qa-screenshots/](qa-screenshots/). 21 section parity checks confirmed.

## Rollback

If needed, run [phase2-rollback.js](phase2-rollback.js) in `figma_execute` chunks. Restores every node rebound by Phase 2 to its original Palette binding. The Semantic collection itself can stay or be deleted separately.

Mobile-Dark page can be restored from Figma version history (File → Show version history).

## Outstanding (Phase 2.5 candidates)

<List of any categories with <50% semantic coverage from the coverage report. Document specific tokens or component areas worth a manual review.>
```

Fill in `<N>` and `<List>` from the actual artifacts after Task 6 + Task 9.

### - [ ] Step 11.8: Final state announcement

State to user: "Phase 2 complete. Semantic + dark mode shipped. Mobile-Dark retired. Docs updated. Ready for production use."

---

## Self-review notes (writing-plans checklist)

**Spec coverage check:**
- Spec Section 1 (taxonomy) → Task 3 implements; Task 5 commits dark
- Spec Section 2 (migration plan 2A-2G) → Tasks 2, 3, 4, 5, 6, 7, 8 (1:1)
- Spec Section 3 (rollback + verification + failure modes) → Task 7 (verification + rollback script)
- Spec Section 4 (Mobile-Dark deletion) → Tasks 9, 10 (pre-checks + delete)
- Spec backup file list (5 files) → all created in Tasks 1, 3, 4, 6, 6
- Spec documentation updates → Task 11

**Placeholder scan:** Each script step contains the full executable code. `<N>` placeholder in Step 11.7 is intentional — it's the final-state count to fill in at execution time.

**Type/method consistency:** All Figma Plugin API calls use the verified async setter pattern from Phase 1. `setBoundVariableForPaint`, `setExplicitVariableModeForCollection`, `clearExplicitVariableModeForCollection`, `setRangeFills`, `getRangeFills`, `figma.variables.createVariable` — all verified existing methods. Variable names (`palByName`, `semByName`, `palById`) consistent across all scripts.

**Scope:** Single implementation plan, single Figma file mutation. Phase 2.5 is explicitly a follow-up — not part of this plan.
