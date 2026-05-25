# Tokens (Variables)

Single collection: `Variables` (id `VariableCollectionId:5971:22615`), 1 mode, 36 FLOAT variables. Use these for **all** dimensions — no raw pixel values in components.

Apply via `node.setBoundVariable('<property>', variable)` or pull `variable.id` from [manifest.json](../manifest.json).

## Border radius

| Token | Value | Use |
|-------|-------|-----|
| `border-radius/radius-none` | 0 | Square corners |
| `border-radius/radius-3xs` | 1 | Hairline rounding |
| `border-radius/radius-2xs` | 2 | Tight chips |
| `border-radius/radius-xs` | 4 | Small inputs, badges |
| `border-radius/radius-sm` | 6 | Compact controls |
| `border-radius/radius-md` | 8 | Default buttons, inputs |
| `border-radius/radius-lg` | 16 | Cards |
| `border-radius/radius-xl` | 24 | Large cards, sheets |
| `border-radius/radius-2xl` | 32 | Hero panels |
| `border-radius/radius-3xl` | 48 | Marketing blocks |
| `border-radius/radius-4xl` | 64 | Decorative |
| `border-radius/radius-full` | 9999 | Pills, avatars |

## Spacing (gap, padding, margin)

| Token | Value |
|-------|-------|
| `spacing/spacing-4xs` | 2 |
| `spacing/spacing-3xs` | 4 |
| `spacing/spacing-2xs` | 6 |
| `spacing/spacing-xs` | 8 |
| `spacing/spacing-sm` | 12 |
| `spacing/spacing-md` | 16 |
| `spacing/spacing-lg` | 20 |
| `spacing/spacing-xl` | 24 |
| `spacing/spacing-2xl` | 32 |
| `spacing/spacing-3xl` | 40 |
| `spacing/spacing-4xl` | 48 |
| `spacing/spacing-5xl` | 64 |
| `spacing/spacing-6xl` | 80 |

## Component size (height of buttons, inputs, control surfaces)

| Token | Value |
|-------|-------|
| `size/size-2xs` | 16 |
| `size/size-xs` | 24 |
| `size/size-sm` | 32 |
| `size/size-md` | 40 |
| `size/size-lg` | 48 |
| `size/size-xl` | 64 |

## Icon size

| Token | Value |
|-------|-------|
| `size-icon/size-icon-2xs` | 12 |
| `size-icon/size-icon-xs` | 16 |
| `size-icon/size-icon-sm` | 20 |
| `size-icon/size-icon-md` | 24 |
| `size-icon/size-icon-lg` | 32 |

## Picking guide

- **Default button height:** `size-md` (40).
- **Compact button (table actions):** `size-sm` (32).
- **Touch-target buttons (mobile):** `size-lg` (48) min.
- **Card padding:** `spacing-md` to `spacing-xl` (16–24).
- **Section gap:** `spacing-2xl` to `spacing-3xl` (32–40).
- **Icon inside Text md row:** `size-icon-sm` (20).
- **Icon inside Button:** `size-icon-xs` (16) for sm buttons, `size-icon-sm` (20) for md/lg.
- **Card radius:** `radius-lg` (16).
- **Pill / chip:** `radius-full` or `radius-md`.

## Note: color tokens live in separate collections

This `Variables` collection holds only numeric tokens. Color is split across two collections:
- **`Palette`** (renamed from `Colors` in Phase 2A, `VariableCollectionId:24302:186441`) — 144 raw color values, single mode.
- **`Semantic`** (`VariableCollectionId:24312:128110`) — 32 role-based tokens with `Light` + `Dark` modes (the public API for components). Light mode is production-current; Dark mode is wired up but no page is flipped yet.

See [colors.md](colors.md).
