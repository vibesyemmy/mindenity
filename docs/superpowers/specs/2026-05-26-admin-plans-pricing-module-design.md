# Admin Plans & Pricing Module — Design Spec

**Date:** 2026-05-26
**Owner:** Mindenity admin app
**Status:** Approved
**Implements:** [admin-app-flow.md](../../../design-tasks/admin-app-flow.md) Flow A6
**Project:** `admin/` (Next.js 16 · shadcn/ui · TanStack Table · Recharts · UI prototype only)

---

## 1. Purpose

Three screens covering pricing governance + plan/tier eligibility + coverage monitoring across both regions.

| Screen | Route | Job |
|---|---|---|
| **A6.1 + A6.2 Pricing tables (merged)** | `/plans` | Tabs NGN / USD · 9 plans × cols (Base · Min band · Max band · Sessions/mo · Active) · per-row Edit dialog |
| **A6.3 Eligibility matrix** | `/plans/eligibility` | 9 plans × 3 tiers (Standard / Senior / Clinical) toggle grid |
| **A6.4 Coverage report** | `/plans/coverage` | Bar chart (plans × therapist count per region) + low-coverage table |

Sidebar `Plans & pricing` already points at `/plans`. Dashboard's `Open coverage report` already links to `/plans/coverage`.

## 2. Non-goals

- No real backend / persistence — toast confirmations only
- No promo / discount editing here (that's A7)
- No custom-pricing approval queue (that's A8)
- No bulk re-pricing / batch operations
- No pricing history / audit log on this surface (lives in A11.3 audit log)
- No real "notify therapists" email send when plans are re-enabled

## 3. User stories addressed

- **US-012** — Admin views + edits NGN/USD pricing tables (A6.1)
- **US-013** — Admin sets min/max bands per region (A6.2 merged into A6.1)
- **US-013.5** — Super-admin band overrides per therapist (deferred; lives on A3.4 therapist detail when built)
- **US-029** — Admin manages plan-therapist eligibility rules (A6.3)
- **US-035** — Plan adoption + coverage metrics (A6.4)

## 4. Pre-existing decisions (confirmed)

| Decision | Choice |
|---|---|
| A6.1 + A6.2 surface | **Merge** into single `/plans` page — bands inline as table columns |
| Edit pattern | **Per-row Edit dialog** (validation-friendly, matches Refund/Suspend pattern) |
| A6.3 + A6.4 layout | **Separate routes** — distinct content shapes; dashboard deep-links each |
| Chart library | **Recharts** (already in use for dashboard revenue chart) |
| Persistence | **None** — toast confirmation only; dummy data unchanged after Save |

## 5. Per-screen anatomy

### 5.1 A6.1 + A6.2 Pricing tables (`/plans`)

| Slot | Contents |
|---|---|
| Page header | Title `Plans & pricing` · subtitle `{activeCount} active plans across 2 regions · 1 with out-of-band requests pending` · right rail [Eligibility matrix →] + [Coverage report →] link-as-button shortcuts |
| Region tabs | **Nigeria (NGN)** (default) · **International (USD)** |
| Table per region | Cols: **Plan** (name + segment badge) · **Type** (PAYG / Subscription) · **Sessions/mo** · **Base price** (formatted with currency) · **Min band** · **Max band** · **Active** (switch — toggles plan visibility to therapists) · **Actions** (Edit button → dialog) |
| Below-table note | `Therapists may set their own price within the min/max band. Out-of-band requests route to approval (A8).` |
| Empty state | Not applicable — all 9 plans always present |

**Edit dialog (per row):**

| Field | Validation |
|---|---|
| Plan name | Read-only display |
| Base price (with currency prefix) | Numeric > 0; min ≤ base ≤ max enforced |
| Min band | Numeric ≥ 0; ≤ base |
| Max band | Numeric > base |
| Sessions/mo | Numeric > 0 (PAYG plans show "—" disabled) |
| Active toggle | Boolean |
| Submit | If any field invalid → inline error + toast.error. Else → toast.success `{plan} updated` + close dialog. |

### 5.2 A6.3 Eligibility matrix (`/plans/eligibility`)

| Slot | Contents |
|---|---|
| Page header | Title `Plan-tier eligibility` · subtitle `Which therapist tiers can accept which plans` · right rail [← Back to plans] |
| Matrix | Sticky-left plan column · 3 columns per region (Standard / Senior / Clinical) under each region group · toggle per cell |
| Region groups | **Nigeria** (3 tier columns) · **International** (3 tier columns) · 6 columns total + plan column = 7 |
| Footer row | "Notify therapists when re-enabling a plan" toggle (default off) · Save changes button (toast confirm) |
| Empty state | Not applicable |

Each toggle ON = therapist of that tier can accept that plan in that region. OFF = plan is hidden from that tier's onboarding flow per US-029 AC#3.

### 5.3 A6.4 Coverage report (`/plans/coverage`)

| Slot | Contents |
|---|---|
| Page header | Title `Plan coverage` · subtitle `{lowCount} plans below 3-therapist threshold · {totalPlans} total per region` · right rail [← Back to plans] + [Export CSV] (disabled) |
| Region tabs | **All regions** (default — stacked bars) · **Nigeria** · **International** |
| Chart | Bar chart (Recharts) — X axis: 9 plan names · Y axis: therapist count · 2 series (NGN + Int'l) stacked when "All" selected, single-series when filtered |
| Low-coverage table | Cols: Plan · Region · Current therapists · Gap to threshold (3) · [Send onboarding nudge] button (disabled — toast info: "Outreach handled by ops; bulk notify not built") |
| Empty state | If no plans below threshold: "All plans have ≥3 therapists per region. Healthy supply." |

## 6. Per-card states

| State | Treatment |
|---|---|
| Loading | shadcn `skeleton` (documented; not implemented) |
| Empty | Per-section above |
| Error | `Couldn't load — [Retry]` (documented; dummy data never throws) |

## 7. Data flow (UI-only prototype)

- All data dummy in `admin/lib/dummy/plans.ts`
- Exports:
  - `getPricingByRegion(region: "NG" | "Int'l"): PlanPricing[]`
  - `getEligibilityMatrix(): EligibilityCell[][]`
  - `getCoverageByPlan(region?): PlanCoverage[]`
  - `getPlanStats()`, `getCoverageStats()`
- No URL search params on A6.1 (region picked via tabs in component state)
- No URL params on A6.3
- A6.4 supports `?region=ng` or `?region=intl` for deep-linking from dashboard

## 8. Responsive

| Breakpoint | Behaviour |
|---|---|
| ≥ 1280px | Layout as described |
| 1024–1279px | Pricing table horizontal-scroll if needed; eligibility matrix preserves sticky-left |
| < 1024px | Out of scope |

## 9. shadcn components

All already installed. **No new shadcn additions needed.**

Reuses: card, badge, button, input, label, select, tabs, table, dialog, switch (NEW — needs install), textarea, popover, dropdown-menu, separator, tooltip, sidebar, sheet, sonner, radio-group.

**One new shadcn install:** `switch` (toggle component for Active + Eligibility cells).

External dep: `@tanstack/react-table` + `recharts` already installed.

## 10. Implementation surface

| File | Role |
|---|---|
| `admin/lib/dummy/plans.ts` | Types + dummy data + getters/stats |
| `admin/components/plans/pricing-columns.tsx` | A6.1 TanStack column defs |
| `admin/components/plans/pricing-edit-dialog.tsx` | Per-row Edit dialog |
| `admin/app/(dashboard)/plans/page.tsx` | A6.1 entry with NGN/USD tabs |
| `admin/components/plans/eligibility-matrix.tsx` | A6.3 matrix component (client) |
| `admin/app/(dashboard)/plans/eligibility/page.tsx` | A6.3 entry |
| `admin/components/plans/coverage-chart.tsx` | A6.4 Recharts bar chart |
| `admin/components/plans/coverage-table.tsx` | A6.4 low-coverage table |
| `admin/app/(dashboard)/plans/coverage/page.tsx` | A6.4 entry |

Reuses: `admin/components/therapists/data-table.tsx` (generic).

## 11. Wiring decisions

- Sidebar nav `Plans & pricing` → `/plans` ✓
- Dashboard `Open coverage report →` → `/plans/coverage` ✓
- Page header on `/plans` has [Eligibility matrix →] + [Coverage report →] shortcut buttons (not relying on sidebar drill)
- After Edit dialog Save → toast + close + dummy data unchanged (admin sees stale row; full prototype acceptable)
- After Eligibility matrix Save → toast + state preserved in component memory (changes survive tab toggles but lost on remount)

## 12. Open polish (deferred)

- Real persistence (no backend)
- Pricing history / audit log per change
- Bulk re-pricing (raise all NGN by X%)
- Promo discount overlay preview (A7 territory)
- Tier override per individual therapist (US-013.5 — lives on A3.4 therapist detail when extended)
- Send onboarding nudge bulk action on A6.4 (button disabled)
- Loading skeletons
- Mobile card view

## 13. Success criteria

1. Sidebar `Plans & pricing` lands on `/plans` with NGN table populated (9 plans)
2. Region tab switches to USD table
3. Per-row Edit button opens dialog with prefilled fields
4. Submit with valid data fires toast + closes
5. Submit with invalid data (e.g. min > base) shows inline error + toast.error
6. `/plans/eligibility` renders 9×6 matrix; toggles persist in component state
7. `/plans/coverage` renders Recharts chart + low-coverage table
8. Dashboard `Open coverage report` lands on `/plans/coverage`
9. `?region=ng` and `?region=intl` filter A6.4 chart + table
10. TypeScript clean; no hydration mismatch; no console errors
