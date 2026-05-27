# Admin Therapist Module — Design Spec

**Date:** 2026-05-26
**Owner:** Mindenity admin app
**Status:** Approved
**Implements:** [admin-app-flow.md](../../../design-tasks/admin-app-flow.md) Flow A3 (Therapists — Verification & Directory)
**Project:** `admin/` (Next.js 16 App Router · shadcn/ui radix-luma preset · TanStack Table · UI prototype only)

---

## 1. Purpose

Four screens that let admins manage every therapist on the platform — from initial application review through ongoing tier/coverage governance.

| Screen | Route | Job |
|---|---|---|
| **A3.3 Directory** | `/therapists` | Browse all active therapists. Default landing for the sidebar `Therapists` nav. |
| **A3.4 Detail (admin view)** | `/therapists/[id]` | Per-therapist deep-dive: profile, plans, sessions, earnings, suspend. |
| **A3.1 Verification queue** | `/therapists/verifications` | Pending therapist applications awaiting admin review. |
| **A3.2 Application review** | `/therapists/verifications/[id]` | Single application deep-dive — Approve / Reject / Request info. |

Dashboard links (`Open queue →` in CrisisTier + OperationsZone) already point at `/therapists/verifications` — this spec materializes that destination.

## 2. Non-goals

- No real backend, no live data — dummy `TS` modules
- No real document viewer for uploaded license/ID files — show file name + open-in-new-tab placeholder
- No email/SMS notifications on Approve/Reject — toast confirmation only
- No bulk approve/reject — single-action per row (bulk-approve flagged in admin-app-flow.md A3.1 as nice-to-have; deferred)
- No therapist edit-on-behalf — admin views read-only, can only suspend/reinstate or override tier (super-admin actions documented but not implemented)
- No client-side filtering of session history beyond what TanStack Table gives

## 3. User stories addressed

- **US-023** — Verify Therapist Applications (primary for A3.1 + A3.2)
- **US-035** — Plan Adoption + Coverage Metrics (A3.3 shows tier + plans-accepted columns)
- **US-013.5** — Super-admin band overrides (mentioned in A3.4 tier-overrides tab; UI stub only)
- Baseline ops: search, filter, status badge (no explicit US — required for any admin app)

## 4. Pre-existing decisions (confirmed before spec)

| Decision | Choice |
|---|---|
| Routes | 4 dedicated routes (no tab-grouping) — `/therapists` (directory), `/therapists/[id]`, `/therapists/verifications`, `/therapists/verifications/[id]` |
| Sidebar `Therapists` lands on | Directory (most-used view) — verifications reached via direct URL or dashboard drill-down |
| Application review surface | Separate page (URL-addressable, browser back/forward, room for inline doc viewer) — not a sheet drawer |
| Detail screen layout | Tabs — Overview / Plans & pricing / Sessions / Risk record / Earnings / Activity log |
| Table approach | TanStack Table for both queue + directory (filter / sort / paginate) |
| Dummy data | Shared module `admin/lib/dummy/therapists.ts` |

## 5. Per-screen anatomy

### 5.1 A3.3 Therapist directory (`/therapists`)

| Slot | Contents |
|---|---|
| Page header | Title `Therapists` · subtitle `94 active across 9 plans · 5 awaiting verification` · right-rail [Open verifications →] button + [Export CSV] |
| Filter row | Search input (placeholder `Search by name, country, email…`) · Region select (All / NG / Int'l) · Tier select (All / Standard / Senior / Clinical) · Status select (All / Active / Suspended) |
| Table | Columns: Name (avatar + name + link to detail) · Region (flag badge) · Tier (badge) · Plans accepted (count + popover w/ full list) · Sessions 30d · Earnings 30d (NGN/USD region-appropriate) · Status (badge) · Open (chevron) |
| Pagination | TanStack Table pagination · 25 rows per page default · prev/next |
| Empty state | `No therapists match these filters.` + [Clear filters] |

Default sort: by Name asc. Click any column header to sort.

### 5.2 A3.4 Therapist detail (`/therapists/[id]`)

| Slot | Contents |
|---|---|
| Page header | Back link `← Therapists` · Avatar + name + tier badge + region flag + status pill · right-rail [Suspend therapist] destructive (super-admin only — always visible in prototype) |
| Hero stats strip (4 cards) | Sessions completed (lifetime) · Active clients · Earnings (30d) · Avg rating |
| **Tabs** | `Overview` (default) · `Plans & pricing` · `Sessions` · `Risk record` · `Earnings` · `Activity log` |
| Overview tab | Bio paragraph · License # + expiry · Specializations (chips) · Languages · Country of practice · Joined date · Verified by + date |
| Plans & pricing tab | Table of plans the therapist accepts · per-plan custom price vs band · "Pending approvals" inline if any |
| Sessions tab | Table of recent sessions (date, client alias, duration, risk level) · 25 row paginate |
| Risk record tab | List of red-flag submissions w/ follow-up status · empty state: `No red-flag submissions on record.` |
| Earnings tab | Mini bar chart (last 6 months) · payout history table |
| Activity log tab | Timeline of admin actions touching this therapist (verifications, suspensions, tier overrides) |

Only Overview tab gets full content; Plans / Sessions / Risk / Earnings / Activity render lightweight stub tables with dummy rows + section heading + `Open full record →` link to nowhere (no PRD US mandates these full screens).

### 5.3 A3.1 Verifications queue (`/therapists/verifications`)

| Slot | Contents |
|---|---|
| Page header | Title `Verifications waiting` · subtitle `5 applications pending review · 1 flagged by AI` · right-rail [Back to directory] button |
| Filter row | Search · Region select (All / NG / Int'l) · AI flag select (All / Flagged / Clean) |
| Table | Columns: Applicant (avatar + name + link to review) · Country · Specializations (chips, max 3 + overflow) · Submitted (relative time) · AI flag (badge: Clean / Flagged · reason on hover) · Status (Pending / Info requested / On hold) · Open |
| Empty state | `All caught up — no pending applications.` |

### 5.4 A3.2 Application review (`/therapists/verifications/[id]`)

| Slot | Contents |
|---|---|
| Page header | Back link `← Verifications queue` · Title `Application — [Name]` · status badge |
| Sticky action bar | `Approve` (primary) · `Request more info` (outline) · `Reject` (destructive) — sticky on right rail OR bottom on mobile |
| Personal details card | Name · email · phone · country · time zone · DOB · gender (optional disclosure) |
| Credentials card | License number · issuing body · expiry · uploaded license file (name + Open) · uploaded ID file (name + Open) — files are non-functional placeholders |
| Practice info card | Specializations chips · session formats (Video/Voice/Chat) · languages · years of practice · short bio |
| AI pre-screening card | Overall flag (Clean / Flagged) · individual checks (license OCR match · sanctions check · duplicate account check · bio quality) · reviewer note |
| Action modals | **Approve**: confirm modal with welcome email preview · **Reject**: required reason textarea · **Request info**: optional message textarea |

After any action: toast `Application approved` / `Marked for info request` / `Application rejected` + redirect back to queue. (No actual state mutation in prototype — dummy data unchanged.)

## 6. Per-card states

| State | Treatment |
|---|---|
| Loading | shadcn `skeleton` rows in tables; skeleton blocks in detail cards |
| Empty | Inline muted message per spec above |
| Error | `Couldn't load — [Retry]` alert (documented for future wiring; not visible in prototype since dummy data never throws) |

## 7. Data flow (UI-only prototype)

- All data dummy in `admin/lib/dummy/therapists.ts`
- Module exports:
  - `getTherapists(filters?: TherapistFilters): Therapist[]` — directory
  - `getTherapist(id: string): Therapist | undefined` — detail
  - `getVerifications(filters?: VerificationFilters): VerificationApplication[]` — queue
  - `getVerification(id: string): VerificationApplication | undefined` — review
- Filters use URL search params (so deep-links work): `?region=ng&tier=senior&status=active&q=adesina`
- TanStack Table sort/pagination state lives in component memory (not URL) — keeps URLs clean

## 8. Responsive behaviour

| Breakpoint | Behaviour |
|---|---|
| ≥ 1280px (default) | All tables full width inside SidebarInset max-w-1400px main area |
| 1024–1279px | Tables get horizontal scroll on overflow columns (Earnings + Status hide first via TanStack column visibility) |
| < 1024px | Tables become card-list view (1 row per card) — out of scope for this pass, defer to V2 |

## 9. shadcn components needed

Already installed: card, input, label, button, checkbox, badge, select, tabs, table, dropdown-menu, separator, tooltip, skeleton, sheet, sidebar, breadcrumb, avatar, alert, chart, input-otp.

New for therapist module:
- `popover` — full plans-accepted list on directory hover
- `dialog` — Approve/Reject/Request-info confirm modals
- `textarea` — reject reason + request-info message
- `sonner` — toast notifications after actions

New external dep:
- `@tanstack/react-table` — TanStack Table v8 (shadcn `table` component is just markup; for sort/filter/paginate we need the engine)

## 10. Implementation surface

| File | Role |
|---|---|
| `admin/lib/dummy/therapists.ts` | Dummy data + types: `Therapist`, `VerificationApplication`, `TherapistFilters`, `VerificationFilters`. Getter fns. |
| `admin/components/therapists/data-table.tsx` | Reusable `<DataTable>` component (TanStack wrapper) used by directory + queue |
| `admin/app/(dashboard)/therapists/page.tsx` | A3.3 Directory page (server component reads search params, renders table) |
| `admin/components/therapists/directory-columns.tsx` | Column defs for directory table |
| `admin/components/therapists/directory-filters.tsx` | Filter row (client component) |
| `admin/app/(dashboard)/therapists/[id]/page.tsx` | A3.4 Detail page entry |
| `admin/components/therapists/therapist-detail.tsx` | Detail page composition (hero + stats + tabs) |
| `admin/app/(dashboard)/therapists/verifications/page.tsx` | A3.1 Queue page |
| `admin/components/therapists/queue-columns.tsx` | Column defs for verifications table |
| `admin/components/therapists/queue-filters.tsx` | Filter row for queue |
| `admin/app/(dashboard)/therapists/verifications/[id]/page.tsx` | A3.2 Review page |
| `admin/components/therapists/application-review.tsx` | Review page composition (cards + action bar) |
| `admin/components/therapists/action-modals.tsx` | Approve / Reject / Request-info dialogs |

## 11. Wiring decisions

- Sidebar nav `Therapists` already points at `/therapists` — A3.3 directory becomes the landing.
- Dashboard CrisisTier + OperationsZone "Open queue →" already points at `/therapists/verifications` — A3.1 picks it up.
- Approve/Reject/Request-info actions don't persist (no backend). They show a toast then `router.push('/therapists/verifications')`.
- The Suspend action on A3.4 opens a confirm modal but does not persist.
- The 4 routes live inside the `(dashboard)` group → inherit sidebar + topbar automatically.

## 12. Open polish (deferred)

- Card-list responsive variant for tables below 1024px (low priority — admin is desktop-first)
- Real OCR / sanctions-check integration on application review (would require backend)
- Bulk approve safe applications (PRD US-023 implies single-action; bulk is a nice-to-have)
- Plan / Session / Risk / Earnings / Activity full screens (A3.4 tabs render stubs only)
- Email preview UI in Approve confirm modal (just shows static placeholder text in prototype)
- Sortable column hint icons (TanStack supplies behaviour but visual icon swap is per-skin)

## 13. Success criteria

1. Sidebar `Therapists` lands on `/therapists` with the directory table populated
2. Directory filters update URL search params and table rerenders
3. Click a therapist row → lands on `/therapists/[id]` with hero + stats + Overview tab
4. Tabs on detail page switch content client-side
5. Dashboard `Open verifications queue →` lands on `/therapists/verifications`
6. Queue filters work like directory
7. Click an application row → lands on `/therapists/verifications/[id]` with all cards rendered
8. Approve / Reject / Request-info buttons open modals; submit fires toast + redirects
9. All 4 routes return 200; no console errors; no hydration mismatch
10. TypeScript compiles clean
