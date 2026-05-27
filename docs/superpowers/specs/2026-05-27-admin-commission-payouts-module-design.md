# Admin Commission & Payouts Module — Design Spec

**Date:** 2026-05-27
**Owner:** Mindenity admin app
**Status:** Approved
**Implements:** [admin-app-flow.md](../../../design-tasks/admin-app-flow.md) Flow A9
**Project:** `admin/` (Next.js 16 · shadcn/ui · TanStack Table · Recharts · UI prototype only)

---

## 1. Purpose

Three screens covering platform-wide commission analytics + payout run management + super-admin tier-override governance.

| Screen | Route | Job |
|---|---|---|
| **A9.1 Commission analytics** | `/commission` | Sidebar landing · region toggle · tier distribution chart · top earners · KPIs |
| **A9.2 Payout runs list + detail** | `/commission/payouts` · `/commission/payouts/[id]` | Scheduled + historical batches · itemised per-therapist detail |
| **A9.3 Tier overrides (super-admin)** | `/commission/overrides` | Per-therapist commission rate overrides · active overrides table |

Sidebar `Commission & payouts` already points at `/commission`.

## 2. Non-goals

- No real backend / persistence — toast confirmations only
- No real payout SDK integration (Paystack/Stripe Connect)
- No bulk payout retry
- No commission reconciliation / ledger reconciliation
- No Tier+ auto-activation logic (lives in backend cron per US-045)
- No per-session commission audit trail (lives in A11.3 audit log when built)

## 3. User stories addressed

- **US-047** — Admin views commission analytics across all therapists (primary for A9.1)
- **US-048** — Therapist receives itemised payout (admin-side payout-run UI — A9.2)
- **US-013.5** — Super-admin band overrides (commission-rate variant — A9.3)
- **US-045** — Tier+ auto-activation (admin-side visibility — A9.1 shows Tier+ activation rate)
- **US-046** — Tier+ removal (visibility via override "Freeze" action — A9.3)
- **US-043** — Commission tier calculation (read-only display throughout)

PRD tier ladder (US-043) used throughout:

| Tier | Lifetime sessions | Therapist % | Platform % | Tier+ bonus |
|---|---|---|---|---|
| New | 0–49 | 70% | 30% | — |
| Tier 1 | 50+ | 75% | 25% | +2% |
| Tier 2 | 100+ | 80% | 20% | +2% |
| Tier 3 | 200+ | 85% | 15% | +2% |
| Tier 4 | 250+ | 88% | 12% | +2% |

## 4. Pre-existing decisions (confirmed)

| Decision | Choice |
|---|---|
| A9.2 surface | Split into list + detail (matches A3/A8 pattern) |
| Chart library | Recharts (already in use) |
| Tier override scope | Single-page (form + active list) |
| Persistence | None — toast only |
| Cross-references | Existing therapist IDs from `admin/lib/dummy/therapists.ts` |

## 5. Per-screen anatomy

### 5.1 A9.1 Commission analytics (`/commission`)

| Slot | Contents |
|---|---|
| Page header | Title `Commission & payouts` · subtitle `{tierPlusCount} of {totalTherapists} on Tier+ this month · avg therapist share {avgPct}%` · right rail [Payout runs →] + [Tier overrides →] |
| Region tabs | All (default) · Nigeria · International |
| KPI strip (3 cards) | **Tier+ activation rate** (%) · **Avg commission % paid** (this month) · **Total paid out** (this month, currency-correct per region tab) |
| Tier distribution chart | Recharts bar chart · X = tier ladder (New / T1 / T1+ / T2 / T2+ / T3 / T3+ / T4 / T4+) · Y = therapist count |
| Top earners table | Cols: Rank · Therapist (name + link) · Tier · Sessions (this month) · Gross · Therapist share · Platform fee. Top 10 default. |
| Footer | [Export CSV] (disabled) |

### 5.2 A9.2 Payout runs list (`/commission/payouts`)

| Slot | Contents |
|---|---|
| Page header | Title `Payout runs` · subtitle `{nextRunDate} next scheduled · {pendingCount} pending · {failedCount} need attention` · right rail [← Commission] |
| Status tabs | All (default) · Scheduled · Processing · Completed · Failed |
| Filter row | Region select · Date range select (Last 30d / 90d / All) |
| Table | Cols: Run date · Region · Therapists · Total amount · Status · Open (chevron → detail) |
| Empty state | `No payout runs in this view.` |

### 5.3 A9.2 Payout run detail (`/commission/payouts/[id]`)

| Slot | Contents |
|---|---|
| Page header | Back link `← Payout runs` · Title `Payout run · {date}` · status badge · region pill · [Export CSV] |
| Summary cards (4) | Therapists count · Total gross · Total platform fee · Total payout |
| Itemised therapist table | Cols: Therapist (name + link to A3.4) · Tier (badge) · Sessions · Gross · Commission % · Platform fee · Net payout · Status (per-therapist: Paid / Pending / Failed) |
| Footer | Run notes section (read-only — admin who triggered + timestamp + any retry notes) |

### 5.4 A9.3 Tier overrides (`/commission/overrides`)

| Slot | Contents |
|---|---|
| Page header | Title `Tier overrides` · subtitle `Super-admin only · {activeCount} active overrides · use sparingly` · right rail [← Commission] |
| Warning banner | `⚠ Overrides bypass automatic tier calculation. They're audited and reviewed monthly.` (amber destructive surface) |
| New override form (card) | Fields: Therapist (Select dropdown of all therapists from dummy data) · Override type (Tier / Custom %) · Tier select OR custom percentage input · Expires (date picker) · Reason (textarea, required ≥10 chars) · [Apply override] button (toast confirm) |
| Active overrides table | Cols: Therapist (name + link) · Type · Override (e.g. `T3 · 85%` or `Custom · 92%`) · Applied by · Applied at · Expires · Reason (popover for full text) · Remove (button → confirm dialog) |

## 6. Per-card states

| State | Treatment |
|---|---|
| Loading | shadcn `skeleton` (documented; not implemented) |
| Empty | Per-section above |
| Error | `Couldn't load — [Retry]` (documented) |

## 7. Data flow (UI-only prototype)

- All data dummy in `admin/lib/dummy/commission.ts`
- Exports:
  - `getCommissionStats(region?: "NG" | "Int'l")`
  - `getTierDistribution(region?): TierDistributionEntry[]`
  - `getTopEarners(region?, limit?): EarnerRow[]`
  - `getPayoutRuns(filters?): PayoutRun[]`
  - `getPayoutRun(id: string): PayoutRun | undefined`
  - `getActiveOverrides(): TierOverride[]`
  - `getAllTherapistsForOverride()` — minimal projection
- URL params on A9.2: `?status=`, `?region=`, `?range=`
- A9.1 region tab is component state (not URL — switches data shown but doesn't share-link)
- A9.3 form state local; new overrides not persisted

## 8. Responsive

| Breakpoint | Behaviour |
|---|---|
| ≥ 1280px | Layout as described |
| 1024–1279px | KPI strip wraps to 2×2; chart shrinks |
| < 1024px | Out of scope |

## 9. shadcn components

All already installed. **No new shadcn additions needed.**

Reuses: card, badge, button, input, label, select, tabs, table, dialog, switch, textarea, popover, dropdown-menu, separator, tooltip, sidebar, sheet, sonner, radio-group, breadcrumb.

External dep: `recharts` already installed.

## 10. Implementation surface

| File | Role |
|---|---|
| `admin/lib/dummy/commission.ts` | Types + dummy data + getters/stats |
| `admin/components/commission/tier-chart.tsx` | A9.1 Recharts bar chart |
| `admin/components/commission/top-earners-table.tsx` | A9.1 top earners |
| `admin/app/(dashboard)/commission/page.tsx` | A9.1 entry |
| `admin/components/commission/payout-runs-columns.tsx` | A9.2 list columns |
| `admin/components/commission/payout-runs-filters.tsx` | A9.2 list filters |
| `admin/app/(dashboard)/commission/payouts/page.tsx` | A9.2 list |
| `admin/components/commission/payout-run-detail.tsx` | A9.2 detail composition |
| `admin/app/(dashboard)/commission/payouts/[id]/page.tsx` | A9.2 detail entry |
| `admin/components/commission/override-form.tsx` | A9.3 new override form |
| `admin/components/commission/active-overrides-table.tsx` | A9.3 active list |
| `admin/app/(dashboard)/commission/overrides/page.tsx` | A9.3 entry |

Reuses: `admin/components/therapists/data-table.tsx`.

## 11. Wiring decisions

- Sidebar `Commission & payouts` → `/commission` ✓
- A9.1 page header has [Payout runs →] + [Tier overrides →] shortcut buttons
- A9.2 list `Open` chevron → `/commission/payouts/[id]`
- A9.3 Therapist deep-link on overrides table → `/therapists/{id}` ✓
- A9.2 detail itemised table therapist deep-link → `/therapists/{id}` ✓
- After override Apply → toast + form resets; new override appended to in-memory list

## 12. Open polish (deferred)

- Real payout SDK retry
- Per-session commission audit trail (lives in A11.3)
- Override approval workflow (currently single-step — would need 2nd super-admin approval in real impl)
- Top earners pagination (currently top 10 fixed)
- Tier+ history per therapist (lives on A3.4 when extended)
- Loading skeletons
- Mobile card view

## 13. Success criteria

1. Sidebar `Commission & payouts` lands on `/commission` with chart + KPIs populated
2. Region tabs swap data
3. `/commission/payouts` returns 200 · status tabs filter
4. Click row → `/commission/payouts/[id]` with itemised therapist table
5. `/commission/payouts/does-not-exist` returns 404
6. `/commission/overrides` warning banner visible · form validates · Apply fires toast
7. Active overrides table renders with remove button
8. TypeScript clean; no hydration mismatch; no console errors
