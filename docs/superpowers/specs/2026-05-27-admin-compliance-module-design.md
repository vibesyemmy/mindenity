# Admin Compliance Module — Design Spec

**Date:** 2026-05-27
**Owner:** Mindenity admin app
**Status:** Approved
**Implements:** [admin-app-flow.md](../../../design-tasks/admin-app-flow.md) Flow A10
**Project:** `admin/` (Next.js 16 · shadcn/ui · TanStack Table · UI prototype only)

---

## 1. Purpose

Three screens covering NDPR + GDPR governance + data residency monitoring (US-042).

| Screen | Route | Job |
|---|---|---|
| **A10.1 Compliance dashboard** | `/compliance` | KPI snapshot · recent audits · outstanding action items |
| **A10.2 Data subject requests** | `/compliance/requests` | NDPR/GDPR export + deletion requests with per-row Sheet drawer |
| **A10.3 Regional residency settings** | `/compliance/residency` | Read-only cards per region — storage location, processors, certs |

Sidebar `Compliance` already points at `/compliance`.

## 2. Non-goals

- No real data export pipeline / encryption-key handling
- No real subject access request (SAR) automation
- No editing of residency settings — infrastructure decisions live outside admin UI
- No GDPR Article-30 register of processing activities (separate compliance tool)
- No DPIA workflow
- No real consent record CRUD — just status display

## 3. User stories addressed

- **US-042** — Admin manages international compliance and data residency (primary)
- US-026 cross-reference — Crisis events surface country/region context that compliance tracks

## 4. Pre-existing decisions (confirmed)

| Decision | Choice |
|---|---|
| A10.2 detail surface | Sheet drawer (single route — faster triage than separate page) |
| A10.3 surface | Read-only cards — residency is infrastructure |
| Routes | 3 distinct routes; sidebar lands on dashboard |
| Persistence | None — toast confirmations only |

## 5. Per-screen anatomy

### 5.1 A10.1 Compliance dashboard (`/compliance`)

| Slot | Contents |
|---|---|
| Page header | Title `Compliance` · subtitle `NDPR + GDPR governance · {openRequestCount} open requests · {overdueCount} overdue` · right rail [Subject requests →] + [Residency settings →] |
| KPI strip (3 cards) | **Subject requests** (pending count · overdue) · **Consent records** (% up-to-date · last refresh) · **Residency status** (regions in compliance / total) |
| Recent audits card | Table: Date · Region · Audit type · Outcome · Auditor (5 rows max) |
| Outstanding action items card | List: priority dot · item description · due date · owner. Tap → routes to relevant detail (most → A10.2 requests) |

### 5.2 A10.2 Data subject requests (`/compliance/requests`)

| Slot | Contents |
|---|---|
| Page header | Title `Subject requests` · subtitle `{pendingCount} pending · {overdueCount} overdue · NDPR + GDPR responses ≤30 days` · right rail [← Compliance] |
| Status tabs | All (default) · Pending · In progress · Fulfilled · Rejected |
| Filter row | Type select (All / Export / Delete) · Region select (All / NG / Int'l) |
| Table | Cols: Type (badge) · Subject (alias + name + link to client/therapist) · Submitted (relative) · Due by (countdown · destructive if overdue) · Regulation (NDPR / GDPR badge) · Status · Open (chevron — opens drawer) |
| Detail drawer (Sheet) | Subject info · Request context · Regulation references · Action row: [Fulfil] / [Reject] dialogs |

**Drawer detail content:**
- Subject card: avatar + alias + name + email + region + subject type (Client / Therapist) + link to A4.2 or A3.4
- Request card: type (Export / Delete) · submitted at · due by (with regulation SLA) · client-supplied reason (if any)
- Regulation card: which regulation applies · sub-clauses · 30-day SLA tracking
- Action bar: Fulfil (toast + close), Reject (modal with mandatory note)

### 5.3 A10.3 Regional residency settings (`/compliance/residency`)

| Slot | Contents |
|---|---|
| Page header | Title `Regional residency` · subtitle `Where each region's client + therapist data is stored and processed` · right rail [← Compliance] |
| Info banner | "Residency settings are read-only here. Changes require infrastructure team + DPO approval." |
| Region cards (3) | One per: Nigeria · European Union · Other International. Each shows: storage location · primary processor · sub-processors list · last audit date · compliance certs (badges) · status pill |

## 6. Per-card states

| State | Treatment |
|---|---|
| Loading | shadcn `skeleton` (documented; not implemented) |
| Empty | Per-section above |
| Error | `Couldn't load — [Retry]` (documented) |

## 7. Data flow (UI-only prototype)

- All data dummy in `admin/lib/dummy/compliance.ts`
- Exports:
  - `getSubjectRequests(filters?): SubjectRequest[]`
  - `getSubjectRequest(id): SubjectRequest | undefined`
  - `getRecentAudits()`, `getActionItems()`, `getResidencyRegions()`, `getComplianceStats()`
- URL params on A10.2: `?status=`, `?type=`, `?region=`
- Drawer state local (component memory)

## 8. Responsive

| Breakpoint | Behaviour |
|---|---|
| ≥ 1280px | Layout as described · residency cards 3-col |
| 1024–1279px | Residency cards 2-col |
| < 1024px | Out of scope |

## 9. shadcn components

All already installed. **No new shadcn additions needed.**

Reuses: card, badge, button, input, label, select, tabs, table, dialog, sheet, switch, textarea, popover, dropdown-menu, separator, tooltip, sidebar, sonner.

## 10. Implementation surface

| File | Role |
|---|---|
| `admin/lib/dummy/compliance.ts` | Types + dummy data + getters/stats |
| `admin/components/compliance/audits-table.tsx` | A10.1 recent audits |
| `admin/components/compliance/action-items-list.tsx` | A10.1 outstanding actions |
| `admin/app/(dashboard)/compliance/page.tsx` | A10.1 entry |
| `admin/components/compliance/request-columns.tsx` | A10.2 columns |
| `admin/components/compliance/request-filters.tsx` | A10.2 filters + status tabs |
| `admin/components/compliance/request-drawer.tsx` | A10.2 sheet drawer + action dialogs |
| `admin/components/compliance/requests-list.tsx` | A10.2 client wrapper (orchestrates table + drawer state) |
| `admin/app/(dashboard)/compliance/requests/page.tsx` | A10.2 entry |
| `admin/components/compliance/residency-card.tsx` | A10.3 single region card |
| `admin/app/(dashboard)/compliance/residency/page.tsx` | A10.3 entry |

Reuses: `admin/components/therapists/data-table.tsx`.

## 11. Wiring decisions

- Sidebar `Compliance` → `/compliance` ✓
- A10.1 page header shortcut buttons → `/compliance/requests` + `/compliance/residency`
- A10.1 action items "Open →" → `/compliance/requests` (most items are requests)
- A10.2 drawer subject link → `/clients/{id}` or `/therapists/{id}` based on subject type
- A10.2 Fulfil / Reject → toast + close drawer (no list mutation in prototype)

## 12. Open polish (deferred)

- Real export bundle generation (zip of subject data)
- Real deletion cascade flow
- Editable residency settings (with audit trail)
- DPIA workflow
- Consent record CRUD
- Loading skeletons
- Mobile view

## 13. Success criteria

1. Sidebar `Compliance` lands on `/compliance` with KPIs populated
2. `/compliance/requests` returns 200 with 5+ dummy requests
3. Click row → Sheet drawer opens with subject + request + regulation cards
4. Drawer Fulfil → toast + close
5. Drawer Reject → modal w/ note → toast + close
6. `/compliance/residency` shows 3 region cards (NG · EU · Other)
7. TypeScript clean; no hydration mismatch; no console errors
