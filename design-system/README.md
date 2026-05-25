# Mindenity Design System

Catalog of every published token, style, component, and template page in the Mindenity-DS Figma file (`fileKey: qU7OupeoYyrtlNMEKi7ao5`). Use this to assemble screens that consume the DS exclusively.

## File facts

- **File:** Mindenity-DS
- **Bridge:** paperclip-figma-bridge (mcp__paperclip-figma-bridge__*)
- **Pages:** 7 — Design System & Components, Icon Set, Mobile template - light, Mobile template - Dark, Desktop template, ---, 📷 Thumbnail
- **Total components:** 183 across 24 groups
- **Variables:** 36 numeric (radius, spacing, size, icon-size) + 144 colors in `Palette` collection + 32 alias tokens in `Semantic` collection (31 from Phase 2 + `surface/base` from Phase 2.5 Step 1). Semantic has both `Light` and `Dark` modes wired up, but **only Light mode is in production use** — see migration notes below.
- **Paint styles:** 245 (134 solid colors + 51 gradients + 10 transparent + 50 image fills). Solid color paint styles are legacy after Phase 1; gradients + image fills still in use.
- **Text styles:** 73 (Display, Heading, Text, Paragraph, Label families)
- **Typeface:** Urbanist (single family across all text styles)
- **Theme model:** light + dark are **separate template pages**, NOT variable modes. Pick the page that matches the request.

## Folder map

| File | Use for |
|------|---------|
| [foundations/colors.md](foundations/colors.md) | 13 named color ramps + transparent overlays. Hex values per step. |
| [foundations/typography.md](foundations/typography.md) | All 73 text styles grouped by family, with size/weight/line-height. |
| [foundations/tokens.md](foundations/tokens.md) | All 36 numeric variables (radius, spacing, size, icon-size). |
| [components.md](components.md) | All 183 components grouped by category, with variants, prop names, prop types, nodeIds. |
| [templates.md](templates.md) | Mobile light, Mobile dark, Desktop sections. Pick a section and copy a screen as starting point. |
| [manifest.json](manifest.json) | Machine-readable index of everything above. Load this when you need to enumerate components programmatically. |

## How to build a screen from this DS

1. **Pick a template.** Open [templates.md](templates.md), find the section closest to the requested screen (e.g. "Mood Tracker" for any mood-related screen). Light vs dark = different page.
2. **Duplicate the closest screen frame.** Use the section's nodeId as the starting point, then drill into the screens grid to copy a single 375×812 (mobile) or 1440×1024 (desktop) frame.
3. **Swap content via component instances.** Look up the components you need in [components.md](components.md) by category (Button, Input, Tab, Card variants, etc). Use `figma_search_components` to resolve fresh nodeIds (the cached ones may be stale).
4. **Stick to tokens.** Every dimension should reference a variable from [foundations/tokens.md](foundations/tokens.md). Every color should be from [foundations/colors.md](foundations/colors.md). Every text style from [foundations/typography.md](foundations/typography.md).
5. **Verify.** Capture screenshot via `figma_capture_screenshot` after each mutation.

## Color migration

- **Phase 1 (complete, 2026-05-12):** 134 solid paint styles + 10 transparent overlays → 144 color variables in `Palette` collection (was named `Colors`, renamed in Phase 2A). 31,684 fill/stroke/text-fill bindings on main components migrated. Old paint styles kept as fallback.
- **Phase 2 (partial, complete 2026-05-12):** Created `Semantic` collection with 31 role-based tokens and Light + Dark modes. Rebound 8,894 component bindings from `Palette` to `Semantic` via heuristic. **64% overall coverage** — the remaining 36% are decorative palette uses (badge tints, chart series) that stay on `Palette` by design.
- **Phase 2.5 Step 1 (complete, 2026-05-12):** Added `surface/base` Semantic token for cream brand backgrounds. Bound 542 raw `#f7f3ef` fills/strokes on Mobile-Light template pages — pure Light-mode token discipline, zero visual change. See [migrations/phase2.5-step1-surface-base.md](migrations/phase2.5-step1-surface-base.md).
- **Phase 2 deferred — Phase 2.5 candidates:**
  - Template page screen frame backgrounds: cream (Brand/5) done in Phase 2.5 Step 1. White card fills (`#ffffff`) and other raw hex patterns still pending.
  - 3 low-coverage component categories: Tab (38%), Badge/Tag (38%), Loader (37%).
  - Once those land, Mobile-Dark page can be retired and Mobile-Light becomes the single template with mode-flip dark.
  - **Dark mode is NOT yet wired to any page or frame** — the `Semantic.Dark` values exist as intent, ready for Phase 2.5.

## Critical rules

- **NodeIds in this catalog are session hints.** Always re-resolve via `figma_search_components` or by walking the page tree at the start of a session.
- **No new components.** If a needed pattern doesn't exist, ask before authoring — the DS owner may want it added properly first.
- **Light vs dark = different page.** Don't try to recolor a light screen for dark; copy from the dark page instead.
- **Mobile artboard:** 375×812. **Desktop artboard:** 1440×1024 (some 1440×960, 1520×1024).
- **Bridge:** always use `mcp__paperclip-figma-bridge__*`. Never use `mcp__figma-console__*` (retired, PUR-131).
