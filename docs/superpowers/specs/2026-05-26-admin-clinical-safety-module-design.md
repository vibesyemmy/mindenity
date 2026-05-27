# Admin Sessions & Clinical Safety Module — Design Spec

**Date:** 2026-05-26
**Owner:** Mindenity admin app
**Status:** Approved
**Implements:** [admin-app-flow.md](../../../design-tasks/admin-app-flow.md) Flow A5
**Project:** `admin/` (Next.js 16 · shadcn/ui radix-luma · TanStack Table · UI prototype only)

---

## 1. Purpose

Four screens covering platform-wide session visibility plus the two safety-critical surfaces — red-flag risk follow-up tracking (US-025) and crisis alert governance (US-026).

| Screen | Route | Job |
|---|---|---|
| **A5.1 Sessions list** | `/sessions` | All sessions across platform. Filter by date, region, risk, therapist, client. |
| **A5.2 Risk alerts queue** | `/risk-forms` | Red-flag submissions per US-025 AC#4. 24–48h follow-up tracker. International red-level local emergency verification per AC#5. |
| **A5.3 Crisis log** | `/crisis` | Every crisis alert triggered from client app. Status per US-026. |
| **A5.4 Crisis detail** | `/crisis/[id]` | Single crisis incident drill-down. Timeline + status changer + admin notes. |

Dashboard CrisisTier + Clinical Safety zone already link to `/crisis` and `/risk-forms` — this module materializes those destinations.

## 2. Non-goals

- No real backend, no live data — dummy `TS` modules
- No live crisis alert simulation (websocket / poll) — static dummy state only
- No real follow-up reminders / notifications
- No real "verify local emergency services" workflow — display-only field
- No clinical record export
- No bulk operations
- No deep wellness metric history visible to admin (privacy wall — same as A4 Clients)

## 3. User stories addressed

- **US-025** — Post-Session Risk Assessment (red-flag triggers admin alert + 24–48h follow-up — A5.2 owns this surface)
- **US-026** — Crisis Support Alert (5-min response SLA; escalation if no response — A5.3 + A5.4 own this)
- **US-006** — View bookings in calendar (A5.1 is the cross-platform analog — therapist views in mobile, admin views all on web)
- **US-042** — International compliance (A5.4 surfaces local emergency line per AC#5 for international red-level)

## 4. Pre-existing decisions (confirmed before spec)

| Decision | Choice |
|---|---|
| A5.2 + A5.3 layout | Separate routes (not tabs on one page) — matches A3.1/A3.3 pattern; dashboard already deep-links each independently |
| Cross-module deep links | A5.1, A5.2, A5.3 accept `?client=c-001` AND `?therapist=t-001` query params for filtering. Enables future swap of stub tabs on Therapist + Client detail pages to "Open in Sessions →" / "Open in Risk →" links. |
| A5.4 surface | Separate page (URL-addressable, audit-trail friendly) — matches A3.2 pattern |
| A5.2 default view | Red-flag focused (AC#4 spec) + filter chip to expand to all severities |

## 5. Per-screen anatomy

### 5.1 A5.1 Sessions list (`/sessions`)

| Slot | Contents |
|---|---|
| Page header | Title `Sessions` · subtitle `{total} sessions in window · {redFlagCount} red-flag · avg session length {avg}` · right-rail [Export CSV] (disabled) |
| Filter row | Search (placeholder `Search by client alias, therapist name…`) · Date range (Last 7d / 30d / 90d / All) · Region · Risk level · Therapist · Client |
| Active filter chips | When `?client=` or `?therapist=` URL param is present, show a removable chip `Client: Client-9128 ×` so the deep-linked filter is visible + clearable |
| Table | Cols: Date · Time · Client (alias + link) · Therapist (name + link) · Plan · Duration · Format · Risk (badge) · Status · Open (chevron → no destination for now; future A5.5 session detail) |
| Pagination | 25 rows / page |
| Empty state | `No sessions match these filters.` |

### 5.2 A5.2 Risk alerts queue (`/risk-forms`)

| Slot | Contents |
|---|---|
| Page header | Title `Risk follow-up queue` · subtitle `{openCount} open · {overdueCount} overdue · {internationalRedCount} international red-level pending verification` |
| Status filter chips (Tabs component) | `Open` (default) · `In follow-up` · `Resolved` · `Escalated` · `All` |
| Filter row | Severity select (All / Red only — default Red per AC#4) · Region · Therapist · Client |
| Active filter chips | Same `?client=` / `?therapist=` pattern as A5.1 |
| Table | Cols: Submitted (relative time + ISO tooltip) · Client (alias + link) · Therapist (name + link) · Region (with country badge if Int'l) · Level (Red/Orange badge, Red destructive) · Action plan (truncated, popover for full) · Follow-up due (relative + countdown · destructive if overdue) · Emergency verified (badge for international red — Verified / Pending / N/A per AC#5) · Status (badge) · Open (chevron → no destination yet) |

Empty state: `No risk forms in this view. Nice.`

### 5.3 A5.3 Crisis log (`/crisis`)

| Slot | Contents |
|---|---|
| Page header | Title `Crisis log` · subtitle `{activeCount} active · {today24hCount} in last 24h · avg response {avgResponseTime}` |
| Status filter chips (Tabs) | `Active` · `Responded` · `Escalated` · `Resolved` · `All` (default `All`) |
| Filter row | Region · Therapist · Client · Date range |
| Active filter chips | `?client=` / `?therapist=` pattern |
| Table | Cols: Triggered (relative + ISO tooltip) · Client (alias + link) · Therapist (or `Escalated to next available` if null) · Response time (formatted `4m 12s` or destructive `not responded`) · Escalation status (badge: None / Escalated to admin) · Local emergency line (text or `—` for NG) · Status (badge) · Open (chevron → A5.4) |
| Empty state | `No crisis alerts in this view.` |

### 5.4 A5.4 Crisis detail (`/crisis/[id]`)

| Slot | Contents |
|---|---|
| Page header | Back link `← Crisis log` · Title `Crisis #{shortId}` · status badge · region badge · destructive `Escalate to admin` button if not yet escalated |
| Context strip (3 cards) | **Client** (alias + plan + link to A4.2) · **Therapist** (name + link to A3.4 — or `Escalated to next available` if null) · **Local emergency** (line + country for international, or `Nigerian 112` for NG) |
| **Timeline card** | Vertical list of events in reverse-chronological. Each event: icon + timestamp + actor + note. Event types: alert_triggered, therapist_notified, therapist_responded, escalated, resolved, admin_note. |
| Add admin note | Textarea + Add note button (appends to timeline as `admin_note` type — local state only; no persistence) |
| Status changer | Select dropdown: Active / Responded / Escalated / Resolved · Save status button (toast confirm; no persistence) |

## 6. Per-card states

| State | Treatment |
|---|---|
| Loading | shadcn `skeleton` (documented; not implemented) |
| Empty | Per-section copy above |
| Error | `Couldn't load — [Retry]` (documented; dummy data never throws) |

## 7. Data flow (UI-only prototype)

- All data dummy in `admin/lib/dummy/clinical.ts`
- Exports:
  - `getSessions(filters?: SessionFilters): Session[]`
  - `getRiskForms(filters?: RiskFormFilters): RiskForm[]`
  - `getCrisisEvents(filters?: CrisisFilters): CrisisEvent[]`
  - `getCrisisEvent(id: string): CrisisEvent | undefined`
  - `getSessionStats(filters?)`, `getRiskFormStats()`, `getCrisisStats()`
- Filters use URL search params on all 3 list pages
- A5.4 in-page note adds (local state) — array of timeline events maintained in component memory; resets on remount

## 8. Responsive

| Breakpoint | Behaviour |
|---|---|
| ≥ 1280px | Layout as described |
| 1024–1279px | Tables horizontal-scroll; A5.4 context strip wraps |
| < 1024px | Out of scope |

## 9. shadcn components

All already installed. **No new shadcn additions needed.**

Reuses: card, badge, button, input, select, tabs, table, dialog, label, textarea, popover, dropdown-menu, separator, tooltip, sidebar, sheet, sonner, radio-group.

External dep: `@tanstack/react-table` already installed.

## 10. Implementation surface

| File | Role |
|---|---|
| `admin/lib/dummy/clinical.ts` | Types + dummy data + 7 getter/stats fns |
| `admin/components/clinical/session-columns.tsx` | A5.1 column defs |
| `admin/components/clinical/session-filters.tsx` | A5.1 filter row + active-chip |
| `admin/app/(dashboard)/sessions/page.tsx` | A5.1 entry |
| `admin/components/clinical/risk-form-columns.tsx` | A5.2 column defs |
| `admin/components/clinical/risk-form-filters.tsx` | A5.2 filter row + status tabs |
| `admin/app/(dashboard)/risk-forms/page.tsx` | A5.2 entry |
| `admin/components/clinical/crisis-columns.tsx` | A5.3 column defs |
| `admin/components/clinical/crisis-filters.tsx` | A5.3 filter row + status tabs |
| `admin/app/(dashboard)/crisis/page.tsx` | A5.3 entry |
| `admin/components/clinical/crisis-detail.tsx` | A5.4 composition (header + context strip + timeline + note input + status changer) |
| `admin/app/(dashboard)/crisis/[id]/page.tsx` | A5.4 entry |

Reuses: `admin/components/therapists/data-table.tsx` (generic — no need to duplicate).

## 11. Wiring decisions

- Dashboard CrisisTier `/crisis` → A5.3 ✓
- Dashboard Clinical Safety zone `/risk-forms` → A5.2 ✓
- Dashboard Clinical Safety zone `/crisis` → A5.3 ✓
- A5.1 row chevrons → no destination yet (future A5.5 session detail). Render disabled-look chevron with tooltip `Detail view not built`.
- A5.4 → no destination from sidebar; reached from A5.3 row open or direct URL
- Cross-module deep-link: `/sessions?client=c-001` → filters Sessions list to that client (chip removable). Future enhancement: swap Sessions stub tab on `/clients/[id]` to a `Open in Sessions →` link.

## 12. Open polish (deferred)

- A5.5 Session detail (not built; chevrons in A5.1 are placeholders)
- Real crisis simulation (websocket / 30s poll)
- Real follow-up notification scheduling
- Real local emergency-line verification workflow
- Crisis incident PDF export (audit trail)
- Therapist + client deep-link chips' counter-action (e.g., link to A3.4 or A4.2 from chip)
- Loading skeletons
- Mobile card-list

## 13. Success criteria

1. Sidebar nav doesn't have direct links yet (A5 reached via dashboard or direct URL) — but `/sessions`, `/risk-forms`, `/crisis` all return 200
2. Dashboard CrisisTier `Open →` lands on `/crisis`
3. Dashboard Crisis activity card `Open crisis log →` lands on `/crisis`
4. Dashboard Risk forms card `Open risk queue →` lands on `/risk-forms`
5. All 3 list pages support URL-param filtering (including `?client=` and `?therapist=`)
6. A5.3 row open lands on `/crisis/[id]` with timeline rendered
7. A5.4 add-note input appends to timeline (in-memory)
8. A5.4 status changer fires toast
9. `/crisis/does-not-exist` returns 404
10. TypeScript compiles clean; no hydration mismatch; no console errors
