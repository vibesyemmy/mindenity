// Phase 2 rollback — re-binds all Semantic-bound nodes back to their original Palette variables.
//
// Pre-req: phase2-rebind-log.json must exist at the path below.
// Usage: paste THIS FILE'S BODY into mcp__paperclip-figma-bridge__figma_execute. Re-run if it times out — mutations land sequentially as await resolves.
// Re-running is safe — nodes already on Palette are skipped (their boundVariable resolves out of the Semantic collection).

const REBIND_LOG_PATH = '/Users/opeyemiajagbe/Documents/Projects/mindenity-2/design-system/migrations/backups/phase2-rebind-log.json';

// IMPORTANT: figma_execute sandbox has no fs access. Before running this script, read REBIND_LOG_PATH
// from the controller side and substitute REBIND_LOG_ENTRIES with the entries array (or a slice for chunked rollback).
// For chunked rollback: split entries into 5-frame-ID-equivalent slices (~2000 entries each) and paste one at a time.
const REBIND_LOG_ENTRIES = [ /* paste entries array here, or a slice */ ];

await figma.loadAllPagesAsync();
const palette = (await figma.variables.getLocalVariableCollectionsAsync()).find(c => c.name === 'Palette');
const palVars = await figma.variables.getLocalVariablesAsync();
const palByName = {};
for (const v of palVars) if (v.variableCollectionId === palette.id) palByName[v.name] = v;

const start = Date.now();
const BAIL_MS = 25000;
let restored = 0;
let skipped = 0;
let errors = 0;

for (const entry of REBIND_LOG_ENTRIES) {
  if (Date.now() - start > BAIL_MS) break;
  try {
    const node = await figma.getNodeByIdAsync(entry.nodeId);
    if (!node) { skipped++; continue; }
    const target = palByName[entry.fromVar];
    if (!target) { skipped++; continue; }

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
  } catch(e) {
    errors++;
  }
}

return { restored, skipped, errors, elapsedMs: Date.now() - start };
