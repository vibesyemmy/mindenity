# Admin Dashboard — Design Spec

**Date:** 2026-05-26
**Owner:** Mindenity admin app
**Status:** Approved (brainstorming complete)
**Implements:** [admin-app-flow.md](../../../design-tasks/admin-app-flow.md) A2.1 Dashboard home
**Project:** `admin/` (Next.js 16 + shadcn/ui radix-luma preset · UI prototype only)

---

## 1. Purpose

Single curated landing screen for the admin Tab Bar after sign-in. Answers two questions every visit:

1. **Is anything broken or urgent right now?**
2. **How is the business doing this week?**

Pre-existing scope decisions (captured during brainstorming, 2026-05-26):

| Decision | Choice |
|---|---|
| Primary intent | Both urgent + business health, equally weighted |
| Default time window | Rolling 7 days |
| Default region | All (NGN + USD stacked, never combined per PRD US-024 AC#2) |
| Architecture | Curated single page + drill-downs to flow screens A3 / A5 / A6 / A8 / A9 / A11 |
| Density principle | Comprehensive surface area, density-disciplined per card |

## 2. Non-goals

- Not building a real backend or live data — dummy data only
- Not building dedicated revenue / financial-detail screen (deferred — no PRD US backing yet)
- Not building system-health monitoring (uptime, error rate) — engineering concern
- Not building full activity feed on home — that lives in A11.3 Audit log
- Not building therapist directory previews on home — that lives in A3.3
- Not building per-plan editable controls on home — A6 owns plan/pricing edits

## 3. User stories addressed

- **US-024** — Monitor Platform Analytics Dashboard (primary)
- **US-035** — Plan Adoption + Coverage Metrics (plan coverage spotlight card)
- **US-023** — Verify Therapist Applications (verifications queue card)
- **US-015** — Approve Therapist Custom Pricing Requests (pricing approvals card)
- **US-025** — Post-Session Risk Assessment (risk forms card)
- **US-026** — Crisis Support Alert (crisis tier + crisis activity card)

## 4. Page anatomy

Top → bottom, no horizontal scrolling at ≥1280px viewport.

### 4.1 Page header

| Slot | Contents |
|---|---|
| Title | `Dashboard` (h1, font-heading) |
| Subtitle | `Mon, 26 May · Hello, Adaeze` (muted-foreground) |
| Right control 1 | **Window selector** — Select dropdown · 4 options: 7d (default) · 30d · 90d · YTD |
| Right control 2 | **Region toggle** — Tabs · 3 options: All (default) · NG · Int'l |
| Right control 3 | **Export ▾** — Dropdown menu · CSV · PDF (PRD US-024 AC#6) |
| Right control 4 | Refresh timestamp · plain text `Updated 2 min ago` · refreshes every 5 min |

Layout: title block left-aligned, controls right-aligned, single row at ≥1280px. Wraps to two rows at smaller widths.

### 4.2 Crisis tier (conditional alert strip)

Renders only when at least one urgent item exists. Renders in this priority order:

1. Active crisis alerts (US-026)
2. Verifications pending > 24h
3. Pricing approvals > SLA (3 business days)

Layout: single horizontal alert row, destructive surface, full width.

Copy template: `🚨 {N} crisis alerts active · {M} verifications pending review · {P} pricing approvals overdue`

Right CTA: `Open` → routes to highest-priority surface (crisis log A5.3 if alerts exist, else verifications A3.1).

Empty state: strip is hidden (DOM-removed, not just invisible — preserves spacing).

### 4.3 KPI strip (4 cards)

Equal width, single row at ≥1280px. Each card structure:

```
+--------------------------------+
| Label                          |
| Primary number  (large)        |
| Secondary breakdown (small)    |
| Δ vs prior 7d   (badge: ↑ ↓ =) |
+--------------------------------+
```

Per-card content:

| Card | Primary | Secondary | Δ |
|---|---|---|---|
| **MRR** | `₦4.2M` (top row) + `$8,450` (bottom row, stacked) | Region split implied via two rows | NGN `+6.1%` · USD `+2.4%` (two badges) |
| **Active subscribers** | `1,287` | `NG 1,104 · Int'l 183` | `+42 this week` |
| **Active therapists** | `94` | `Verified · accepting bookings` | `+3 onboarded · 2 pending verif` |
| **Sessions completed (7d)** | `512` | `Avg 5.4 / active client` | `+8.3%` |

Δ color: green (positive), red (negative for MRR/sessions/subs; reversed for churn), muted (no change).

### 4.4 Revenue chart

Full-width card. Height: ~260px.

| Property | Value |
|---|---|
| Library | Recharts (already in shadcn `chart` install) |
| Type | Area chart, dual-axis |
| X axis | Trailing 7 days · daily ticks |
| Y axis left | NGN (₦ formatted) |
| Y axis right | USD ($ formatted) |
| Two series | NGN revenue (chart-1 token color) · USD revenue (chart-3 token color) |
| Hover tooltip | Date · NGN total · USD total · sessions count |
| Header right | `View revenue detail` link (deferred destination — placeholder route `/revenue` returning a "Not built — see dashboard" stub) |

Adjusts X-axis granularity per selected window: **7d** = daily ticks (7 points) · **30d** = daily ticks (30 points) · **90d** = weekly aggregation (13 points) · **YTD** = monthly aggregation (1–12 points depending on month-of-year).

### 4.5 Operations zone

Two cards side-by-side, equal width.

#### 4.5.1 Verifications queue card

| Slot | Contents |
|---|---|
| Header | `Verifications waiting` + count badge `5 pending` |
| Body | 3 most recent rows (small list): avatar · `Dr. Name` · country flag · `Submitted 2h ago` |
| Footer | `Open queue → A3.1` link |

Empty state: `All applications reviewed. Nice.` muted text + check icon.

#### 4.5.2 Pricing approvals card

| Slot | Contents |
|---|---|
| Header | `Pricing approvals` + two inline badges: `1 pending` (default variant) and `1 overdue` (destructive variant). If only one count is non-zero, render only that badge. |
| Body | 3 most recent rows: `Dr. Name` · plan name · `+25% over band` · `Submitted 1d ago` |
| Footer | `Open queue → A8.1` link |

Empty state: `No pending pricing approvals.`

### 4.6 Plan coverage spotlight (conditional)

Full-width card. Renders only if any plan has <3 therapists in any region (per PRD US-024 AC#4).

| Slot | Contents |
|---|---|
| Header | `Plans need therapist coverage` + count badge (e.g. `3`) |
| Body | Up to 3 amber rows max. Each row: plan name · region · `2 therapists` · gap-to-threshold `(need 1 more)` |
| Footer | `Open coverage report → A6.4` link |

Empty state: card hidden (DOM-removed).

### 4.7 Clinical safety zone

Two cards side-by-side.

#### 4.7.1 Crisis activity card

| Slot | Contents |
|---|---|
| Header | `Crisis activity (24h)` |
| Stats row | `2 active · avg response 4m 12s · 0 escalations` (3 inline stats) |
| Body | 3 most recent alerts: `Client alias · therapist · time · status badge` |
| Footer | `Open crisis log → A5.3` link |

Empty state: `No crisis alerts in the last 24h.`

#### 4.7.2 Risk forms card

| Slot | Contents |
|---|---|
| Header | `Risk forms (7d)` |
| Stats row | `12 submitted · 2 red flags · 1 follow-up overdue` |
| Body | 3 most recent red-flag rows: `Client alias · therapist · region · follow-up due` |
| Footer | `Open risk queue → A5.2` link |

Empty state: `No risk forms submitted this week.`

### 4.8 International onboarding funnel

Full-width card. PRD US-024 AC#5 mandates this view.

| Slot | Contents |
|---|---|
| Header | `Onboarding funnel` |
| Body | 4-step stepped bar: Signups → Intake done → Plan purchased → First session |
| Per step | Count (absolute) + conversion % from previous step |
| Region selector | Tabs inside card · All / NG / Int'l · independent of global region filter (cross-comparison use case) |
| Footer | `Export funnel CSV` button |

Empty state: `No onboarding activity in the last 7 days.`

### 4.9 Recent activity (narrow card)

Sits in bottom row, narrower than full width (alongside white space or paired with a small "Refresh status" widget).

| Slot | Contents |
|---|---|
| Header | `Recent activity` |
| Body | 5 most recent material events (audit-log derived) |
| Per row | Actor · action verb · target · timestamp |
| Examples | `Adaeze verified Dr. Tola · 4m ago` · `Sarah resolved crisis #4318 · 2h ago` · `Pricing band updated · Together NGN · 1h ago` |
| Footer | `Open audit log → A11.3` link |

Empty state: `No recent activity.`

## 5. Per-card states

Every card has three states:

| State | Treatment |
|---|---|
| **Loading** | Skeleton block matching card height. shadcn `skeleton` component. Show during initial mount + after window/region change. |
| **Empty** | Inline muted message specific to card (see per-section copy above). |
| **Error** | `Couldn't load this card.` + small `Retry` ghost button. shadcn `alert` component, destructive variant. |

Dummy data flow does not actually fail, but **error state must exist as a documented variant** so future wiring has a target.

## 6. Data flow (UI-only prototype)

- All data lives in `admin/lib/dummy/dashboard.ts` as typed TS objects
- Module exports: `getDashboardData(window: Window, region: Region): DashboardData`
- `DashboardData` shape: `{ kpis, revenue, queues: { verifications, pricing }, planCoverage, clinical: { crisis, risk }, funnel, activity }`
- Window selector + region toggle update URL search params (`?window=7d&region=all`) so links can deep-link to a filtered view
- "Refresh every 5 min" simulated via `setInterval` updating only the timestamp string (data does not change in prototype)
- Region toggle inside funnel card uses local React state (does not affect URL)

## 7. Responsive behaviour

| Breakpoint | Behaviour |
|---|---|
| ≥ 1280px (default admin) | Layout as described. 4-card KPI strip in one row. 2-card ops zone side by side. |
| 1024–1279px | KPI strip wraps to 2×2. Ops zone stays side by side. |
| < 1024px | KPI strip stacks 4×1. Ops zone stacks 2×1. Clinical zone stacks 2×1. |

Admin is desktop-first; mobile not a target.

## 8. shadcn components to install

Already installed: `card`, `input`, `label`, `button`, `checkbox`, `input-otp`, `alert`.

New for dashboard:
- `badge` — KPI deltas, count badges
- `select` — window selector
- `tabs` — region toggle (top + inside funnel card)
- `table` — funnel rows if we use a table layout (otherwise just CSS grid)
- `chart` — Recharts wrapper for revenue + funnel charts
- `skeleton` — loading states
- `dropdown-menu` — Export ▾
- `separator` — visual section breaks

Optional / phase 2:
- `sheet` — if we keep "Export drawer" instead of plain dropdown
- `tooltip` — chart hover, KPI delta explanations

## 9. Implementation surface

| File | Role |
|---|---|
| `admin/app/(dashboard)/layout.tsx` | New route group for authenticated app shell. Sidebar + top bar (to be specified separately — out of dashboard scope but blocked on it). For now, minimal layout so `/dashboard` renders. |
| `admin/app/(dashboard)/dashboard/page.tsx` | Dashboard page entry. Reads search params for window + region. Renders sections via composed card components. |
| `admin/components/dashboard/` | New directory for per-section components |
| `admin/components/dashboard/page-header.tsx` | Section 4.1 |
| `admin/components/dashboard/crisis-tier.tsx` | Section 4.2 |
| `admin/components/dashboard/kpi-strip.tsx` | Section 4.3 (4 sub-cards composed inside) |
| `admin/components/dashboard/revenue-chart.tsx` | Section 4.4 |
| `admin/components/dashboard/operations-zone.tsx` | Section 4.5 wrapper, composes 2 cards |
| `admin/components/dashboard/plan-coverage-spotlight.tsx` | Section 4.6 |
| `admin/components/dashboard/clinical-safety-zone.tsx` | Section 4.7 wrapper, composes 2 cards |
| `admin/components/dashboard/onboarding-funnel.tsx` | Section 4.8 |
| `admin/components/dashboard/recent-activity.tsx` | Section 4.9 |
| `admin/lib/dummy/dashboard.ts` | All dummy data + `getDashboardData()` |
| `admin/lib/dummy/types.ts` | Shared TypeScript types |

Sidebar + top bar are **dependencies** for the dashboard route but live outside this spec — they belong to a global-chrome spec covering all post-auth screens.

**Interim unblocking:** Build the dashboard route inside a `(dashboard)` route group with a **minimal placeholder layout** — single `<main>` with reasonable padding and the page header section. No sidebar, no top bar yet. When the global-chrome spec lands, the placeholder layout gets replaced and the dashboard page itself does not change. This lets the dashboard ship without blocking on chrome work.

## 10. Wiring decisions / call-outs

- **Login redirect target after 2FA** currently points to `/`. After this dashboard ships, change `app/(auth)/2fa/page.tsx` redirect from `router.push("/")` to `router.push("/dashboard")`. Plus update root `app/page.tsx` redirect target accordingly.
- **Activity feed source** — dummy log entries hardcoded for prototype. Real wiring routes to A11.3 audit log later.
- **Funnel card region toggle** — independent of global region filter on purpose (lets admin compare cross-region without losing global context).
- **Crisis tier priority order** — fixed as: crisis alerts → verifications overdue → pricing approvals overdue. If all empty, strip hidden entirely.
- **Plan coverage spotlight** — only renders if there's a real coverage gap. Don't render an empty "all good" state for this card; the absence is the signal.

## 11. Open polish items (deferred, log as TODOs in code)

- Real-time crisis tier — currently rerenders on window/region change only; future wiring needs websocket or 30s poll for crisis alerts specifically
- Export CSV/PDF — buttons render but do nothing in prototype
- Revenue chart "View detail" destination — placeholder route, no real screen yet
- Notification bell unread count in top bar — out of dashboard scope but visible on the screen (top bar is shared chrome)
- Sidebar Active state for "Dashboard" — depends on sidebar spec

## 12. Success criteria

The dashboard is "done" when:

1. Lands on `/dashboard` after sign-in + 2FA
2. All sections render with realistic dummy data
3. Window selector + region toggle update URL + visible data
4. Every drill-down link points to its target route (even if target is a stub page)
5. Loading + empty + error states implementable per card (at least 2 of 3 verifiable via dummy data toggle)
6. Renders cleanly at 1280×800 without horizontal scroll
7. Drops to 1024px and < 1024px stacks per section 7
8. No console errors at load or on interaction
