# Admin Custom Pricing Approvals Module — Design Spec

**Date:** 2026-05-27
**Owner:** Mindenity admin app
**Status:** Approved
**Implements:** [admin-app-flow.md](../../../design-tasks/admin-app-flow.md) Flow A8
**Project:** `admin/` (Next.js 16 · shadcn/ui · TanStack Table · UI prototype only)

---

## 1. Purpose

Two screens that let admins review therapist requests to price sessions outside the admin-set bands (from A6 Plans & Pricing).

| Screen | Route | Job |
|---|---|---|
| **A8.1 Approvals queue** | `/pricing-approvals` | Pending custom-pricing requests with status filters |
| **A8.2 Approval review** | `/pricing-approvals/[id]` | Single request review · Approve / Counter-offer / Reject |

Dashboard `Open queue →` already deep-links to `/pricing-approvals` — this module materializes that destination.

## 2. Non-goals

- No real backend / persistence — toast confirmations only
- No automated price-band recomputation when approving (would re-cascade to A6; out of prototype scope)
- No bulk approve/reject
- No price-history per therapist (lives in A11.3 audit log when built)
- No real notify-therapist email send
- No editing the request payload mid-review

## 3. User stories addressed

- **US-015** — Approve Therapist Custom Pricing Requests (primary)
- US-013 cross-reference — bands set in A6 determine what's "out of band" here

## 4. Pre-existing decisions (confirmed)

| Decision | Choice |
|---|---|
| Routes | 2 dedicated routes (queue + review) — matches A3 + A4 pattern |
| Action surface | 3 dialogs from review page (Approve · Counter-offer · Reject) — matches A3.2 ApplicationReview |
| Counter-offer | Dialog with new price + admin note (auto-validated against bands) |
| Reject | Required note ≥5 chars per US-015 AC#4 |
| Persistence | None — toast + redirect to queue |
| Per-therapist audit log | Inline card on review page (count + last 3 requests with status) |

## 5. Per-screen anatomy

### 5.1 A8.1 Approvals queue (`/pricing-approvals`)

| Slot | Contents |
|---|---|
| Page header | Title `Custom pricing approvals` · subtitle `{pendingCount} pending · {overdueCount} overdue · {counteredCount} awaiting therapist response` · right rail [Back to plans →] |
| Status tabs | `Pending` (default) · `Approved` · `Rejected` · `Countered` · `All` |
| Filter row | Region select (All / NG / Int'l) · Plan select (All + 9 plan names) |
| Table | Cols: Submitted (relative time + tooltip ISO) · Therapist (name + tier badge + link to A3.4) · Plan (name + segment badge) · Region · Their price (currency-formatted) · Band range · **Δ from band** (e.g. `+25% over max` or `-12% under min`, destructive variant) · Status · Open (chevron → A8.2) |
| Pagination | 25 rows / page |
| Empty state | Per status: `No pending approvals.` / `No approved requests yet.` / etc. |

Default sort: Submitted desc.

### 5.2 A8.2 Approval review (`/pricing-approvals/[id]`)

| Slot | Contents |
|---|---|
| Page header | Back link `← Approvals queue` · Title `Pricing request — {therapist} · {plan}` · status badge · region pill |
| Layout | 2-col on ≥1024px: main column (cards stacked) + 220px sticky action bar |
| **Request card** | Submitted at · Therapist proposed price · Currency · Band (min – base – max with visual delta bar) · Δ from band callout (e.g. `+25% over max — needs admin approval`) · Therapist's reasoning textarea (read-only) |
| **Therapist card** | Avatar · name · tier badge · region · plans accepted count · open-in-A3.4 link |
| **Plan card** | Plan name · type · sessions/mo · currency · base price · band range (read-only — link to A6 to edit) |
| **Recent requests by this therapist** | Count + last 3 historical requests (date · plan · status badge) — surfaces patterns (frequent flyer, recidivism) |
| **Action bar (sticky right)** | [Approve] (primary) · [Counter-offer] (outline) · [Reject] (destructive) |
| Action dialogs (3) | See §5.3 |

### 5.3 Action dialogs

| Dialog | Trigger | Fields | Submit behaviour |
|---|---|---|---|
| **Approve** | `Approve` button | Read-only summary · "Therapist's price takes effect immediately." · Confirm/Cancel | Toast `Approved {therapist}'s {plan} pricing at {price}` + redirect to `/pricing-approvals` |
| **Counter-offer** | `Counter-offer` button | New price input (currency prefix, validates ≥0) · Admin note textarea (required ≥5 chars · "Therapist receives this note with the counter") · "Within band" preview chip · Confirm/Cancel | Toast `Counter-offer sent to {therapist} at {price}` + redirect |
| **Reject** | `Reject` button (destructive) | Required reason textarea ≥5 chars (per US-015 AC#4) · "Therapist receives this reason and can resubmit." · Confirm/Cancel | Toast `Request rejected` + redirect |

## 6. Per-card states

| State | Treatment |
|---|---|
| Loading | shadcn `skeleton` (documented; not implemented) |
| Empty | Per-section copy above |
| Error | `Couldn't load — [Retry]` (documented; dummy data never throws) |

## 7. Data flow (UI-only prototype)

- All data dummy in `admin/lib/dummy/pricing-approvals.ts`
- Cross-references existing therapist + plan IDs so therapist/plan deep-links and band comparison work end-to-end
- Exports:
  - `getApprovals(filters?: ApprovalFilters): PricingRequest[]`
  - `getApproval(id: string): PricingRequest | undefined`
  - `getApprovalsByTherapist(therapistId: string): PricingRequest[]`
  - `getApprovalStats()`
- URL params: A8.1 supports `?status=`, `?region=`, `?plan=` for filtering

## 8. Responsive

| Breakpoint | Behaviour |
|---|---|
| ≥ 1280px | Layout as described |
| 1024–1279px | A8.2 layout collapses sticky action bar inline below main column |
| < 1024px | Out of scope |

## 9. shadcn components

All already installed. **No new shadcn additions needed.**

Reuses: card, badge, button, input, label, select, tabs, table, dialog, switch, textarea, popover, dropdown-menu, separator, tooltip, sidebar, sheet, sonner, radio-group.

External dep: `@tanstack/react-table` already installed.

## 10. Implementation surface

| File | Role |
|---|---|
| `admin/lib/dummy/pricing-approvals.ts` | Types + dummy data + getters/stats |
| `admin/components/pricing-approvals/queue-columns.tsx` | A8.1 column defs |
| `admin/components/pricing-approvals/queue-filters.tsx` | A8.1 filter row + status tabs |
| `admin/app/(dashboard)/pricing-approvals/page.tsx` | A8.1 entry |
| `admin/components/pricing-approvals/approval-review.tsx` | A8.2 composition (cards + action bar) |
| `admin/components/pricing-approvals/action-dialogs.tsx` | 3 action dialogs (Approve · Counter · Reject) |
| `admin/app/(dashboard)/pricing-approvals/[id]/page.tsx` | A8.2 entry |

Reuses: `admin/components/therapists/data-table.tsx` (generic).

## 11. Wiring decisions

- Dashboard `Open queue →` → `/pricing-approvals` ✓
- Dashboard Operations zone "Pricing approvals" card `Open queue →` → `/pricing-approvals` ✓
- After dialog Submit → toast + `router.push('/pricing-approvals')` — admin returns to queue
- Therapist link on review page → `/therapists/{id}` ✓
- Plan "Edit in A6 →" link → `/plans` ✓

## 12. Open polish (deferred)

- Real persistence
- Bulk approve safe within-band requests
- Auto-validation of "within band" preview as admin types in counter dialog (currently text-only feedback)
- Email preview in Approve modal
- Per-therapist full request history (currently shows last 3)
- Loading skeletons
- Mobile card view

## 13. Success criteria

1. Sidebar nav doesn't have direct link (deferred); reached via dashboard or direct URL — `/pricing-approvals` returns 200
2. Dashboard `Open queue →` lands on `/pricing-approvals`
3. Status tabs filter correctly · region/plan filters apply
4. Click row → lands on `/pricing-approvals/[id]` with all cards rendered
5. Approve/Counter/Reject dialogs open, validate, fire toast, redirect
6. `/pricing-approvals/does-not-exist` returns 404
7. Therapist deep-link from review card → A3.4 ✓
8. TypeScript clean; no hydration mismatch; no console errors
