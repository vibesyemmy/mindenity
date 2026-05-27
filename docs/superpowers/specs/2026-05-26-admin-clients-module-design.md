# Admin Clients Module — Design Spec

**Date:** 2026-05-26
**Owner:** Mindenity admin app
**Status:** Approved
**Implements:** [admin-app-flow.md](../../../design-tasks/admin-app-flow.md) Flow A4 (Clients)
**Project:** `admin/` (Next.js 16 · shadcn/ui radix-luma · TanStack Table · UI prototype only)

---

## 1. Purpose

Two screens that let admins find any client on the platform and manage their plan + payments + suspension state.

| Screen | Route | Job |
|---|---|---|
| **A4.1 Client list** | `/clients` | Searchable, filterable roster of every client. Sidebar `Clients` lands here. |
| **A4.2 Client detail (admin view)** | `/clients/[id]` | Per-client deep-dive: plan + sessions + payments + risk record + admin actions (refund, pause plan, suspend account). |

**Original A4.3 Refund/dispute handler is killed** — refund is a dialog from the Payments tab on A4.2, matching the action-modal pattern from A3 therapist module (Suspend dialog).

## 2. Non-goals

- No real backend, no live data — dummy `TS` modules
- No real refund execution (Paystack/Stripe SDKs not wired) — toast confirmation only
- No client edit-on-behalf — admin views read-only, can only refund/pause/suspend
- No therapist clinical notes visible to admin (privacy wall — those stay therapist-side)
- No wellness deep data (mood/sleep/stress) visible to admin (privacy wall — only escalations surface via risk record)
- No AI Companion conversation content (privacy wall)
- No bulk operations on clients
- No client-side metric charts beyond payment trend

## 3. User stories addressed

- **US-031** — Client upgrades/downgrades plan (Plan history tab — stub)
- **US-020** — Payment history + receipts (Payments tab — built)
- **US-025** — Post-session risk assessment (Risk events tab — stub, deep-link to A5.2)
- **US-026** — Crisis support alerts (Risk events tab cross-reference)
- **US-034** — Plan details visibility (Overview tab card)
- **US-042** — NDPR/GDPR data governance (Suspend/delete actions documented but defer real wiring to A10 Compliance)
- Baseline: search, filter, status badges

## 4. Pre-existing decisions (confirmed before spec)

| Decision | Choice |
|---|---|
| Refund surface | Dialog from A4.2 Payments tab row action (not separate route) |
| Tab scope on A4.2 | Overview + Payments built; Plan history / Sessions / Risk events / Notes = stubs |
| Currency | Strict to region — NG clients always NGN, Int'l always USD (per US-036) |
| Alias-only in client-facing UIs | Admin view shows alias + name + email (ops contact need) |
| Routes | 2 dedicated routes (no nested tab groups) |

## 5. Per-screen anatomy

### 5.1 A4.1 Client list (`/clients`)

| Slot | Contents |
|---|---|
| Page header | Title `Clients` · subtitle `1,287 active across 9 plans · 23 past-due · 4 on risk watch` · right rail [Export CSV] (disabled in prototype) |
| Filter row | Search input (placeholder `Search by alias, name, email…`) · Region select (All / NG / Int'l) · Plan select (All + 9 plan names) · Status select (All / Active / Past-due / Cancelled / Lapsed) |
| Table | Cols: **Alias** (initials avatar + alias + name + link) · **Email** · **Region** (badge) · **Plan** (badge) · **Sessions used** (`2/4` for subs · `3 done` for PAYG) · **Last session** (relative time or `—`) · **Status** (badge with destructive/outline variants) · **Open** (chevron) |
| Pagination | 25 rows / page |
| Empty state | `No clients match these filters.` |

Default sort: Alias asc.

### 5.2 A4.2 Client detail (`/clients/[id]`)

| Slot | Contents |
|---|---|
| Page header | Back link `← Clients` · Avatar + alias + name + region pill + plan pill + status pill · right rail action cluster |
| Action cluster | [Pause plan] (outline, opens confirm dialog) · [Suspend account] (destructive, opens confirm dialog) |
| Stats strip (4 cards) | Lifetime sessions · Member since · Last payment · Lifetime spend (currency-correct) |
| **Tabs** | `Overview` (default) · `Plan history` (stub) · `Sessions` (stub) · `Payments` (built) · `Risk events` (stub) · `Notes` (stub) |
| **Overview tab** | 3 cards in 2-col grid: **Care summary** (plan + therapist + sessions used + risk level) · **Contact** (email + phone + region + timezone + joined) · **Latest activity** (last 3 sessions + last 3 payments inline) |
| **Payments tab** | Table: Date · Description · Amount (currency-formatted) · Method (Paystack/Stripe + last 4) · Status · `Refund` action (only enabled if `eligibleForRefund` AND status === Succeeded). Refund button opens dialog (see §5.3). |
| Stub tabs (4) | Card with `Full {key} view not built in this prototype. Wire when {module} lands.` per the therapist module pattern. |

### 5.3 Dialogs from A4.2

| Dialog | Trigger | Fields | Submit behaviour |
|---|---|---|---|
| **Refund payment** | Payments tab row `Refund` button | Read-only payment summary (date · client · amount · method) · Refund type radio (Full / Partial) · Amount input (defaults to full; clamps to ≤ original) · Reason textarea (required, min 5 chars) | Toast `Refund issued for {client}` + close dialog. No data mutation. |
| **Pause plan** | Header `Pause plan` button | Read-only "Billing will pause from next cycle. Sessions continue until plan ends." · Confirm/cancel | Toast `Plan paused for {client}` + close. |
| **Suspend account** | Header `Suspend account` button (destructive) | Required reason textarea · "Client will lose login access. Active bookings auto-canceled and refunded per plan terms." · Confirm/cancel | Toast `{client} suspended` + close. |

## 6. Per-card states

| State | Treatment |
|---|---|
| Loading | shadcn `skeleton` (documented variant; not implemented in prototype) |
| Empty | Per-section copy as documented |
| Error | `Couldn't load — [Retry]` (documented; dummy data never throws) |

## 7. Data flow (UI-only prototype)

- All data dummy in `admin/lib/dummy/clients.ts`
- Exports:
  - `getClients(filters?: ClientFilters): Client[]`
  - `getClient(id: string): Client | undefined`
  - `getClientListStats(): { activeCount, pastDueCount, riskWatchCount, totalPlans }`
- Filters use URL search params: `?q=client-9128&region=ng&plan=balance&status=active`
- TanStack Table sort/pagination state lives in component memory

## 8. Responsive

| Breakpoint | Behaviour |
|---|---|
| ≥ 1280px | Layout as described |
| 1024–1279px | Stats strip wraps 2×2; tab content reflows |
| < 1024px | Mobile out of scope (desktop-first admin) |

## 9. shadcn components

All already installed in earlier modules. **No new shadcn additions needed.**

Reuses: card, badge, button, input, select, tabs, table, dialog, label, textarea, popover, dropdown-menu, separator, tooltip, sidebar, sheet, sonner.

External dep: `@tanstack/react-table` (installed for therapist module).

## 10. Implementation surface

| File | Role |
|---|---|
| `admin/lib/dummy/clients.ts` | Types + dummy data + 3 getter fns |
| `admin/components/clients/client-list-columns.tsx` | TanStack column defs for A4.1 |
| `admin/components/clients/client-list-filters.tsx` | Filter row for A4.1 (client component, URL-synced) |
| `admin/components/clients/client-detail.tsx` | A4.2 composition (header + stats + tabs + 2 header dialogs) |
| `admin/components/clients/refund-dialog.tsx` | Refund payment dialog (own file because of form state) |
| `admin/app/(dashboard)/clients/page.tsx` | A4.1 page entry (server) |
| `admin/app/(dashboard)/clients/[id]/page.tsx` | A4.2 page entry (server) |

Reuses: `admin/components/therapists/data-table.tsx` (already generic — no need to duplicate).

## 11. Wiring decisions

- Sidebar nav `Clients` already points at `/clients` — A4.1 picks it up.
- Refund / Pause / Suspend actions don't persist (no backend). Show toast + close dialog.
- After Suspend, page does NOT navigate away (admin may want to keep viewing same client; status badge updates would require a state refresh which is out of prototype scope).
- Payments tab row Refund button is disabled when `payment.status !== "Succeeded"` OR `!payment.eligibleForRefund`.

## 12. Open polish (deferred)

- Real loading skeleton implementation
- Mobile card-list view for list table
- Bulk operations (refund queue, bulk suspend)
- Plan history full tab content (deferred to A6 Plans & Pricing dependency)
- Sessions full tab (deferred to A5)
- Risk events full tab (deferred to A5.2)
- Notes full tab (no PRD US backing yet — future feature)
- Refund partial-amount inline preview (current dialog just shows total; partial entry should preview new balance)
- Region-aware currency formatting helper centralised (currently inlined per component — extract when 3rd component needs it)

## 13. Success criteria

1. Sidebar `Clients` lands on `/clients` with table populated (8 dummy clients)
2. Filters update URL search params and table rerenders
3. Click row → lands on `/clients/[id]` with Overview tab content
4. All 6 tabs switch client-side (4 are stubs as documented)
5. Payments tab Refund button opens dialog; Submit fires toast + closes
6. Header Pause / Suspend buttons open their respective dialogs; Submit fires toast + closes
7. All routes return 200; `/clients/does-not-exist` returns 404
8. TypeScript compiles clean; no hydration mismatch; no console errors
