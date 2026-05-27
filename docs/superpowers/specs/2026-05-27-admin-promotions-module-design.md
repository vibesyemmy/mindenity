# Admin Promotions Module — Design Spec

**Date:** 2026-05-27
**Owner:** Mindenity admin app
**Status:** Approved
**Implements:** [admin-app-flow.md](../../../design-tasks/admin-app-flow.md) Flow A7
**Project:** `admin/` (Next.js 16 · shadcn/ui · TanStack Table · UI prototype only)

---

## 1. Purpose

Two screens for creating and managing time-limited promotional pricing windows on Mindenity plans (US-014).

| Screen | Routes | Job |
|---|---|---|
| **A7.1 Promotions list** | `/promotions` | All past/active/scheduled promos with status filter |
| **A7.2 Promotion editor** | `/promotions/new` · `/promotions/[id]` | Create or edit a single promo with delete action |

Sidebar `Promotions` already points at `/promotions`.

## 2. Non-goals

- No real promo SDK / payment-side discount application
- No A/B test variant tracking
- No promo code generation (these are admin-controlled time windows, not user-redeemable codes)
- No revenue impact analytics (lives in dashboard / commission analytics)
- No bulk promo operations

## 3. User stories addressed

- **US-014** — Admin creates promotional pricing windows (primary)

PRD AC#1: Admin sets `promo name, discount type (% or flat amount), currency region (NGN / USD / Both), applicable plans, start and end datetime`.

## 4. Pre-existing decisions (confirmed)

| Decision | Choice |
|---|---|
| A7.2 surface | Separate routes for new vs edit (matches A8 pattern) |
| Date inputs | Native `datetime-local` HTML inputs (no calendar dep) |
| Plans selection | Checkbox-per-plan grid (no Select-multi) |
| Currency region | Radio group: NGN / USD / Both |
| Impact preview | Static dummy calc (region × selected plans) in a card |
| Persistence | None — toast confirmations only |

## 5. Per-screen anatomy

### 5.1 A7.1 Promotions list (`/promotions`)

| Slot | Contents |
|---|---|
| Page header | Title `Promotions` · subtitle `{activeCount} active · {scheduledCount} scheduled · {endedCount} ended` · right rail [+ New promotion] |
| Status tabs | All (default) · Scheduled · Active · Ended |
| Filter row | Region select (All / NG / USD / Both) |
| Table | Cols: Name · Discount (e.g. `20% off` or `$20 off` or `₦5,000 off`) · Region (badge) · Plans (count + popover full list) · Starts · Ends · Status (badge with state-color) · Edit (button → `/promotions/[id]`) |
| Empty state | `No promotions in this view.` |

Default sort: Starts desc (most recent first).

### 5.2 A7.2 Promotion editor (`/promotions/new` and `/promotions/[id]`)

| Slot | Contents |
|---|---|
| Page header | Back link `← Promotions` · Title `New promotion` OR `Edit promotion` (with status badge for edit) · right rail [Delete] (edit-only, destructive) |
| Form card 1 (Basics) | Name input (required, ≥3 chars) · Discount type radio (% / Flat amount) · Discount value input with prefix · Region radio (NGN / USD / Both) |
| Form card 2 (Plans) | Applicable plans — 9 checkboxes (Essential, Balance, Thrive, Together, Harmony, Restore, Home, Family Care, Family Thrive) · "Select all" / "Clear" links |
| Form card 3 (Window) | Start datetime input · End datetime input · "End must be after start" inline validation |
| Form card 4 (Preview) | Impact preview — dummy calc: `~{N} active subscribers reachable · {plansCount} plans · {windowDays}d window` |
| Footer | Cancel link · [Save & schedule] (or [Save changes] in edit) — toast confirm + redirect to `/promotions` |
| Delete dialog | Destructive · "Delete this promotion? Active subscriptions stop receiving the discount immediately." · Cancel / Delete (toast + redirect) |

## 6. Per-card states

| State | Treatment |
|---|---|
| Loading | shadcn `skeleton` (documented; not implemented) |
| Empty | Per-section above |
| Error | `Couldn't load — [Retry]` (documented) |
| Validation | Inline error per field; toast.error on submit if invalid |

## 7. Data flow (UI-only prototype)

- All data dummy in `admin/lib/dummy/promotions.ts`
- Exports:
  - `getPromotions(filters?: PromoFilters): Promotion[]`
  - `getPromotion(id: string): Promotion | undefined`
  - `getPromotionStats()`
- URL params on A7.1: `?status=`, `?region=`
- Editor form state is local (no URL state)
- `/promotions/new` renders the editor with empty defaults
- `/promotions/[id]` renders the editor pre-filled from dummy; if not found → 404

## 8. Responsive

| Breakpoint | Behaviour |
|---|---|
| ≥ 1280px | Layout as described · plan checkboxes 3-col grid |
| 1024–1279px | Plan checkboxes 2-col |
| < 1024px | Out of scope |

## 9. shadcn components

All already installed. **No new shadcn additions needed.**

Reuses: card, badge, button, input, label, select, tabs, table, dialog, switch, textarea, popover, checkbox, radio-group, dropdown-menu, separator, tooltip, sidebar, sheet, sonner.

External dep: `@tanstack/react-table` already installed.

## 10. Implementation surface

| File | Role |
|---|---|
| `admin/lib/dummy/promotions.ts` | Types + dummy data + getters/stats |
| `admin/components/promotions/promo-columns.tsx` | A7.1 column defs |
| `admin/components/promotions/promo-filters.tsx` | A7.1 filter row + status tabs |
| `admin/app/(dashboard)/promotions/page.tsx` | A7.1 entry |
| `admin/components/promotions/promo-editor.tsx` | A7.2 editor form (shared by new + edit) |
| `admin/components/promotions/delete-dialog.tsx` | A7.2 delete confirmation |
| `admin/app/(dashboard)/promotions/new/page.tsx` | A7.2 create entry |
| `admin/app/(dashboard)/promotions/[id]/page.tsx` | A7.2 edit entry |

Reuses: `admin/components/therapists/data-table.tsx`.

## 11. Wiring decisions

- Sidebar `Promotions` → `/promotions` ✓
- A7.1 `+ New promotion` button → `/promotions/new`
- A7.1 row `Edit` button → `/promotions/[id]`
- After Save → toast + `router.push('/promotions')`
- After Delete → toast + redirect to list
- Editor accepts an optional `promotion` prop; absence = create mode

## 12. Open polish (deferred)

- Calendar picker for dates (using shadcn `calendar` would add complexity)
- Live impact preview that updates as plans/region change (currently static estimate)
- Promo code redemption flow (separate feature)
- Revenue impact tracking
- Loading skeletons
- Mobile card view
- Duplicate-promo guard (overlapping windows for same plans)

## 13. Success criteria

1. Sidebar `Promotions` lands on `/promotions` with 5 dummy promos
2. Status tabs filter correctly
3. `+ New promotion` → `/promotions/new` shows empty form
4. Click any row's `Edit` → `/promotions/[id]` shows pre-filled form
5. Form validation fires inline + toast on invalid submit
6. Valid Save fires toast + redirects to list
7. Delete dialog opens, confirm fires toast + redirects
8. `/promotions/does-not-exist` returns 404
9. TypeScript clean; no hydration mismatch; no console errors
