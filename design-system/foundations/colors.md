# Colors

Source: `Design System & Components` page → `Foundations` section → `Primary Colors` frame (nodeId `10611:34536`).

**Two-collection color system after Phase 2:**
- **`Semantic` collection** (`VariableCollectionId:24312:128110`) — 32 role-based tokens (`surface/primary`, `surface/base`, `text/primary`, etc.) with `Light` + `Dark` modes. `surface/base` was added in Phase 2.5 Step 1 specifically for the cream brand background (Brand/5). Only Light mode is currently used in production. **This is the preferred binding target for new components.** Full token list in [migrations/phase2-semantic-tokens-and-dark-mode.md](../migrations/phase2-semantic-tokens-and-dark-mode.md).
- **`Palette` collection** (`VariableCollectionId:24302:186441`, was `Colors`) — 144 raw color variables (single mode). Used by Semantic aliases. Also used directly by ~9,249 decorative bindings (badge tints, chart series, palette swatches) that have no semantic role.

Original 245 paint styles still in the file as legacy fallback (gradients + image fills can't be variables; solid color paint styles are unused but preserved for rollback).

| Surface | How to apply |
|---------|--------------|
| Solid color (fill/stroke) | Bind variable: `figma.variables.setBoundVariableForPaint(paint, 'color', variable)` |
| Text color | Same pattern via `setRangeFills` |
| Gradients | Use existing `Gradient/*` paint styles (variables don't support gradients) |
| Image fills | Use existing `Avatar/*`, `Doctor Image/*`, `Device Image/*` paint styles |

13 ramps + transparent overlays. Each ramp follows an 11-step scale (25/50–950 in tailwind-like rhythm). Step indices below correspond to position in the ramp (0 = lightest).

## Gray (neutral)

Stone-based neutral.

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|----|
| `#fafaf9` | `#f5f5f4` | `#e7e5e4` | `#d6d3d1` | `#a8a29e` | `#78716c` | `#57534e` | `#44403c` | `#292524` | `#1c1917` | `#0c0a09` |

## Brand (primary, warm brown)

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|----|
| `#f7f3ef` | `#ebe2d6` | `#d9c7af` | `#c3a381` | `#b1865e` | `#a27450` | `#926247` | `#704738` | `#5f3d34` | `#533630` | `#2f1c19` |

## Destructive (rose)

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|----|
| `#fff1f2` | `#ffe4e6` | `#fecdd3` | `#fda4af` | `#fb7185` | `#f43f5e` | `#e11d48` | `#be123c` | `#9f1239` | `#881337` | `#4c0519` |

## Warning (amber)

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|----|
| `#fffbeb` | `#fef3c7` | `#fde68a` | `#fcd34d` | `#fbbf24` | `#f59e0b` | `#d97706` | `#b45309` | `#92400e` | `#78350f` | `#451a03` |

## Orange

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|----|
| `#fff7ed` | `#ffedd5` | `#fed7aa` | `#fdba74` | `#fb923c` | `#f97316` | `#ea580c` | `#c2410c` | `#9a3412` | `#7c2d12` | `#431407` |

## Success (olive/green)

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|----|
| `#f5f7ee` | `#e9eed9` | `#d4deb8` | `#b8c88e` | `#9bb167` | `#7f974b` | `#627739` | `#4d5c2f` | `#3f4b29` | `#374027` | `#1b2211` |

## Teal

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|----|
| `#f0fdfa` | `#ccfbf1` | `#99f6e4` | `#5eead4` | `#2dd4bf` | `#14b8a6` | `#0d9488` | `#0f766e` | `#115e59` | `#134e4a` | `#042f2e` |

## Cyan

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|----|
| `#ecfeff` | `#cffafe` | `#a5f3fc` | `#67e8f9` | `#22d3ee` | `#06b6d4` | `#0891b2` | `#0e7490` | `#155e75` | `#164e63` | `#083344` |

## Blue

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|----|
| `#eff6ff` | `#dbeafe` | `#bfdbfe` | `#93c5fd` | `#60a5fa` | `#3b82f6` | `#2563eb` | `#1d4ed8` | `#1e40af` | `#1e3a8a` | `#172554` |

## Violet

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|----|
| `#f5f3ff` | `#ede9fe` | `#ede9fe` | `#c4b5fd` | `#a78bfa` | `#8b5cf6` | `#7c3aed` | `#6d28d9` | `#5b21b6` | `#4c1d95` | `#2e1065` |

## Purple

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|----|
| `#faf5ff` | `#f3e8ff` | `#e9d5ff` | `#d8b4fe` | `#c084fc` | `#a855f7` | `#9333ea` | `#7e22ce` | `#6b21a8` | `#581c87` | `#3b0764` |

## Pink

| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|----|
| `#fdf2f8` | `#fdf2f8` | `#fbcfe8` | `#f9a8d4` | `#f472b6` | `#ec4899` | `#db2777` | `#be185d` | `#9d174d` | `#831843` | `#500724` |

## Transparent overlays

White and black at fixed opacity steps. Use for scrims, hover overlays, glass effects.

| Color | Opacity steps |
|-------|---------------|
| `#ffffff` | 16%, 32%, 48%, 64%, 80% |
| `#000000` | 16%, 32%, 48%, 64%, 80% |

## Gradients

`Fade Gradients` and `Gradient Mesh` ramps live in the `Primary Colors` frame as their own swatch sets. Use the visual sampler in Figma — these are not plain solid hex values.

## Usage rules

- **Body text on light:** Gray 9 or 10.
- **Body text on dark:** Gray 0 or 1.
- **Primary brand action:** Brand 5–7 fill, Gray 0 text.
- **Destructive:** Destructive 5–6 fill.
- **Success state:** Success 5–6.
- **Warning state:** Warning 5–6.
- **Surfaces:** Gray 0/1 (light), Gray 9/10 (dark).
- **Borders:** Gray 2–3 (light), Gray 7–8 (dark).
