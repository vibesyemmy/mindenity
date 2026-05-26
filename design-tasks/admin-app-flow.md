# Mindenity Admin Dashboard — Flow & Screen Plan

> **Surface:** Web (desktop-first, ≥1280px), sidebar-nav layout.
> **Tech:** shadcn/ui + Next.js 16 App Router + Tailwind 4 (preset `b2M8rcCumZ` — radix-luma / taupe). UI-only prototype with dummy data.
> **Persona:** Admin + Super Admin (per PRD `personas` table).
> **Mirror docs:** [client-app-flow.md](./client-app-flow.md) · [therapist-app-flow.md](./therapist-app-flow.md)

---

## Status overview

- **Total proposed screens:** 32 (pending audit)
- **Total built:** 3 (A1.1, A1.2, A1.3)
- **Pending:** 29

Per-flow status:

| Flow | Screens | Done | Pending |
|------|---------|------|---------|
| A1. Authentication | 3 | 3 | 0 |
| A2. Dashboard | 1 | 0 | 1 |
| A3. Therapists (Verification & Directory) | 4 | 0 | 4 |
| A4. Clients | 3 | 0 | 3 |
| A5. Sessions & Clinical Safety | 4 | 0 | 4 |
| A6. Plans & Pricing | 4 | 0 | 4 |
| A7. Promotions | 2 | 0 | 2 |
| A8. Custom Pricing Approvals | 2 | 0 | 2 |
| A9. Commission & Payouts | 3 | 0 | 3 |
| A10. Compliance | 3 | 0 | 3 |
| A11. Settings & Roles | 3 | 0 | 3 |

---

## User stories — admin coverage

| US | Title | Flow |
|----|-------|------|
| US-012 | View and Edit Platform Pricing Table (NGN and USD) | A6 |
| US-013 | Set Minimum and Maximum Price Bands per Region | A6 |
| US-014 | Create Promotional Pricing Windows | A7 |
| US-015 | Approve Therapist Custom Pricing Requests | A8 |
| US-023 | Verify Therapist Applications | A3 |
| US-024 | Monitor Platform Analytics Dashboard | A2 |
| US-025 | Post-Session Risk Assessment (admin red-flag alerts) | A5 |
| US-026 | Crisis Support Alert (admin escalation per AC#4) | A5 |
| US-029 | Plan-Therapist Eligibility Rules | A6 |
| US-035 | Plan Adoption + Coverage Metrics | A2 / A6 |
| US-042 | International Compliance + Data Residency | A10 |
| US-047 | Commission Analytics Across Therapists | A9 |
| US-048 | Itemised Payout (admin-side runs) | A9 |

**Coverage:** 13 of 13 admin-tagged USs mapped. Auth + Client management + Roles are baseline (no explicit US — required for any admin app).

---

## Global chrome

Persistent across all admin screens (except A1 Auth):

- **Sidebar nav** (collapsible, 240px expanded / 64px collapsed)
  - Logo / brand
  - Region toggle (All · Nigeria · International) — affects every metric on every screen per US-024 AC#1
  - Nav groups:
    - **Overview**: Dashboard
    - **People**: Therapists · Clients
    - **Operations**: Sessions · Crisis log · Custom pricing approvals
    - **Money**: Plans & pricing · Promotions · Commission & payouts
    - **Governance**: Compliance · Settings & roles
  - Footer: admin avatar + role badge + sign out
- **Top bar**
  - Breadcrumb path
  - Global search (clients / therapists / sessions by ID)
  - Notifications bell (verification queue · pricing approvals · crisis alerts)
  - Admin profile menu
- **Density toggle** (compact / comfortable) — tables are central to admin UX

---

## Flow A1 — Authentication

Admin-only login. Stronger than client/therapist auth: required 2FA, IP allowlist (optional), session timeout 30 min.

### - [x] A1.1 Sign in
- **Status:** ✅ Done 2026-05-26 — `admin/app/(auth)/login/page.tsx`. Demo creds: `admin@mindenity.com` / `admin123`.
- **Purpose:** Email + password entry for admin or super-admin. Lands on `/2fa` after valid creds.
- **States built:** default · submitting (600ms fake latency) · invalid creds (destructive alert) · account locked (after 5 failed attempts — inputs + CTA disabled)
- **shadcn components used:** `card`, `input`, `label`, `button`, `checkbox`
- **Layout:** `app/(auth)/layout.tsx` route group — centered card · brand mark in top-left · footer with Privacy/Terms/Status links

### - [x] A1.2 Two-factor verification
- **Status:** ✅ Done 2026-05-26 — `admin/app/(auth)/2fa/page.tsx`. Demo OTP: `000000` · recovery: `MIND-1234-RCVY`.
- **Purpose:** 6-digit code or fallback recovery code. Mandatory after sign in.
- **States built:** OTP mode (3+3 slots with separator, 60s countdown, resend disabled until 30s left) · expired (amber alert, "Send a new code") · invalid (destructive alert) · recovery mode (text input toggle, "Use a recovery code instead" link)
- **shadcn components used:** `input-otp`, `card`, `input`, `label`, `button`

### - [x] A1.3 Password reset request
- **Status:** ✅ Done 2026-05-26 — `admin/app/(auth)/forgot/page.tsx`.
- **Purpose:** Email-based reset. Always shows same confirmation (security — never reveal whether email exists).
- **States built:** idle · submitting (700ms fake latency) · sent (swap to "Check your inbox" card with email echoed, "try a different email" link rewinds, "Back to sign in" CTA)
- **shadcn components used:** `card`, `input`, `label`, `button`

**Spacing fix applied 2026-05-26:** All 3 forms wrapped with `<form className="flex flex-col gap-6">` because Card's `gap-6` only applies to direct children, and the form was breaking the gap between CardContent and CardFooter.

---

## Flow A2 — Dashboard

US-024. Single dense home screen. Sidebar lands here on login.

### - [ ] A2.1 Dashboard home
- **Purpose:** Live platform health snapshot. Region toggle in global chrome filters everything below.
- **User stories:** US-024, US-035 (plan coverage)
- **Key elements:**
  - **KPI strip** (4 cards): Active subscribers · MRR (region-split — NGN row + USD row, never combined per US-024 AC#2) · Therapists active · Sessions completed (7d)
  - **Revenue chart**: dual-axis NGN + USD over 30d
  - **Plan adoption table** (US-024 AC#3): rows = 9 plans, cols = Region · Active subs · Δ7d · Therapists accepting · Coverage status
  - **Low-coverage alerts** (US-024 AC#4): plans with <3 therapists per region, amber row treatment
  - **International onboarding funnel** (US-024 AC#5): signups → intake done → plan purchased → first session (stepped bar)
  - **Crisis activity strip**: open crisis alerts count · avg response time · escalations to admin (last 24h)
  - **Verification queue summary**: pending therapist apps + pending pricing approvals (links to A3.1, A8.1)
  - Refresh indicator + Export CSV/PDF buttons (US-024 AC#6)
- **shadcn components:** `card`, `tabs`, `table`, `badge`, `chart` (Recharts wrapper), `button`, `tooltip`

---

## Flow A3 — Therapists (Verification & Directory)

US-023. Verify applications + manage active therapist directory.

### - [ ] A3.1 Verification queue
- **Purpose:** Pending therapist applications awaiting review. Tab Bar destination from sidebar.
- **User stories:** US-023
- **Key elements:** Filter chips (All / NG / International / Flagged by AI) · table cols (Applicant · Country · Specialisations · Submitted · AI flag · Status · Open). Bulk actions: bulk-approve safe ones, bulk-request-info.
- **shadcn components:** `data-table` (TanStack), `badge`, `select`, `button`

### - [ ] A3.2 Application review
- **Purpose:** Single application deep-dive per US-023 AC#2. Approve / Reject / Request more info.
- **User stories:** US-023
- **Key elements:** Personal details panel · Country + region · Uploaded docs (license, ID, certs — viewable inline) · Specialisations chips · AI pre-screening flag with reasoning · Action row: [Approve] [Request info] [Reject]. Approve modal triggers welcome email + nudges therapist to Plan Preferences (US-023 AC#4). Reject requires reason textarea (AC#5).
- **shadcn components:** `card`, `sheet`, `dialog`, `textarea`, `badge`, `tabs` (Details / Docs / AI flags)

### - [ ] A3.3 Therapist directory
- **Purpose:** All active therapists. Manage tier, suspend, override settings.
- **Key elements:** Filter (Region · Tier · Plan accepted · Active/Suspended) · table cols (Name · Region · Tier · Plans accepted · Sessions (30d) · Earnings (30d) · Status · Open)
- **shadcn components:** `data-table`, `badge`, `dropdown-menu`

### - [ ] A3.4 Therapist detail (admin view)
- **Purpose:** Per-therapist deep-dive. Profile + tier + bands + sessions + earnings + suspend action.
- **Key elements:** Hero (avatar + name + tier badge + region) · Tabs: Profile · Plans & pricing · Sessions (30d) · Risk record · Earnings · Activity log. Super-admin only: Tier+ override toggle, custom band override, suspend/reinstate action.
- **shadcn components:** `card`, `tabs`, `table`, `badge`, `alert-dialog` (destructive actions)

---

## Flow A4 — Clients

Client lookup, plan changes, refund handling. No PRD US explicit (baseline ops surface).

### - [ ] A4.1 Client list
- **Purpose:** Searchable client roster with plan + status.
- **Key elements:** Search (alias / ID / email) · filters (Region · Plan · Active/Cancelled/Past-due) · table cols (Alias · Region · Plan · Sessions used · Last session · Status · Open)
- **shadcn components:** `data-table`, `input`, `select`, `badge`

### - [ ] A4.2 Client detail (admin view)
- **Purpose:** Full client record. Plan history · payment history · session list · risk events · refund/ban actions.
- **Key elements:** Hero (alias + region + plan badge) · Tabs: Plan history · Sessions · Payments · Risk events · Notes. Action row: [Refund payment] [Pause plan] [Suspend account] — all confirm-modal-gated.
- **shadcn components:** `card`, `tabs`, `table`, `alert-dialog`

### - [ ] A4.3 Refund / dispute handler
- **Purpose:** Process a refund request — either from client support or admin-initiated. Region routes refund through Paystack (NG) or Stripe (Int'l).
- **Key elements:** Payment selector (recent transactions for that client) · Refund type (full / partial) · Amount + currency (locked to original currency) · Reason · Submit
- **shadcn components:** `form`, `input`, `select`, `radio-group`, `button`

---

## Flow A5 — Sessions & Clinical Safety

US-025 red-flag alerts + US-026 crisis escalations. Operational surface.

### - [ ] A5.1 Sessions list
- **Purpose:** All sessions across platform. Filter by date, risk level, region, therapist.
- **Key elements:** Filters (Date range · Region · Risk level · Therapist) · table cols (Date · Client alias · Therapist · Plan · Duration · Risk level · Open)
- **shadcn components:** `data-table`, `date-range-picker`, `select`, `badge`

### - [ ] A5.2 Risk alerts queue
- **Purpose:** Red-flag risk submissions per US-025 AC#4. 24–48h follow-up tracker.
- **User stories:** US-025
- **Key elements:** Filter chips (Open / In follow-up / Resolved) · table cols (Submitted · Client alias · Therapist · Risk level · Country · Action plan · Follow-up due · Open). For Red + international: shows local emergency services verification status per US-025 AC#5.
- **shadcn components:** `data-table`, `badge`, `tabs`, `alert`

### - [ ] A5.3 Crisis log
- **Purpose:** All crisis alerts triggered from client app. Admin sees full chain: trigger → therapist response time → escalation → resolution.
- **User stories:** US-026
- **Key elements:** Table cols (Trigger time · Client · Therapist (assigned) · Response time · Escalation status · Local emergency line (Int'l) · Resolution status · Open)
- **shadcn components:** `data-table`, `badge`, `tooltip`

### - [ ] A5.4 Crisis detail
- **Purpose:** Single crisis incident drill-down. Audit trail of who responded when, what was said.
- **Key elements:** Timeline (alert → therapist notified → response → escalation if any → resolution) · Client context (plan, region, last risk level) · Therapist response notes · Admin notes textarea · Status changer (Open / Escalated / Resolved)
- **shadcn components:** `card`, `timeline` (custom), `textarea`, `select`

---

## Flow A6 — Plans & Pricing

US-012, US-013, US-029. Pricing governance.

### - [ ] A6.1 Pricing tables (NGN + USD)
- **Purpose:** Two tabs per US-012 AC#1: NGN and USD. 9 plans × cols (Base price · Min band · Max band · Sessions/month · Active). Edit inline.
- **User stories:** US-012, US-013
- **Key elements:** Region tabs · table with inline edit · Save changes CTA (batched) · Audit log link
- **shadcn components:** `tabs`, `data-table` (editable), `input`, `button`, `alert`

### - [ ] A6.2 Price bands editor
- **Purpose:** Set min/max bands per plan per region per US-013. Affects therapist custom-pricing limits in T2.2.
- **User stories:** US-013, US-015
- **Key elements:** Plan selector · Region tabs · Min/max range inputs · "Out-of-band requests need approval" toggle · Save CTA
- **shadcn components:** `card`, `select`, `slider`, `input`, `switch`

### - [ ] A6.3 Plan-therapist eligibility matrix
- **Purpose:** US-029. Matrix of 9 plans × 3 tiers (Standard / Senior / Clinical). Toggle enable/disable per cell.
- **User stories:** US-029
- **Key elements:** Plan × Tier grid (9×3) with toggle per cell · "Notify therapists when re-enabled" toggle · Save
- **shadcn components:** `table`, `switch`, `button`

### - [ ] A6.4 Plan coverage report
- **Purpose:** US-035. Therapist count per plan per region. Flag plans with <3 therapists for admin action.
- **User stories:** US-035
- **Key elements:** Region toggle · Bar chart (plans × therapist count) · Low-coverage table · "Send onboarding nudge" bulk action
- **shadcn components:** `chart` (Recharts), `data-table`, `button`

---

## Flow A7 — Promotions

US-014.

### - [ ] A7.1 Promotions list
- **Purpose:** All promo windows — past, active, scheduled.
- **Key elements:** Filter (Status: Scheduled / Active / Ended) · table cols (Name · Discount · Region · Plans · Starts · Ends · Status · Open)
- **shadcn components:** `data-table`, `badge`, `button`

### - [ ] A7.2 Promotion editor
- **Purpose:** Create or edit a promo per US-014 AC#1.
- **Key elements:** Name · Discount type (% / flat) · Discount value · Currency region (NGN / USD / Both) · Applicable plans (multi-select) · Start datetime · End datetime · Preview impact (subs reachable) · Save / Schedule CTA
- **shadcn components:** `form`, `input`, `select`, `checkbox`, `date-picker`, `button`

---

## Flow A8 — Custom Pricing Approvals

US-015. Therapist requests outside admin-set bands route here.

### - [ ] A8.1 Approvals queue
- **Purpose:** Pending therapist custom-pricing requests.
- **User stories:** US-015
- **Key elements:** Filter (Pending / Approved / Rejected / Counter-offered) · table cols (Submitted · Therapist · Plan · Region · Their price · Band · Δ from band · Status · Open)
- **shadcn components:** `data-table`, `badge`, `button`

### - [ ] A8.2 Approval detail
- **Purpose:** Single request review per US-015 AC#3.
- **Key elements:** Therapist mini-card · Plan + region · Their proposed price + reasoning · Band range · Action row: [Approve] [Counter-offer (modal: new price + note)] [Reject (modal: mandatory note per AC#4)]. Audit log of past requests by this therapist.
- **shadcn components:** `card`, `dialog`, `textarea`, `button`

---

## Flow A9 — Commission & Payouts

US-047, US-048.

### - [ ] A9.1 Commission analytics
- **Purpose:** US-047. Cross-therapist commission breakdown.
- **User stories:** US-047
- **Key elements:** Region toggle · Tier distribution chart · Top earners table (this month) · Tier+ activation rate · Avg commission % paid · Export CSV
- **shadcn components:** `chart`, `data-table`, `card`, `button`

### - [ ] A9.2 Payout runs
- **Purpose:** US-048. Scheduled + historical payout batches. Each run lists therapists paid + amounts + status.
- **User stories:** US-048
- **Key elements:** Run list (Run date · Region · Therapists count · Total · Status: Pending / Processing / Completed / Failed) · Click run → detail with itemised therapists
- **shadcn components:** `data-table`, `badge`, `dialog`

### - [ ] A9.3 Tier overrides (super-admin)
- **Purpose:** US-013.5 + US-045/046. Super-admin can override tier bands for individual therapists or freeze Tier+ during sick leave (per PRD scenarios).
- **Key elements:** Therapist search · Override form (Tier · Custom % · Expiry · Reason · Notes) · Active overrides list
- **shadcn components:** `command` (search), `form`, `data-table`

---

## Flow A10 — Compliance

US-042. NDPR (NG) + GDPR (EU) data governance.

### - [ ] A10.1 Compliance dashboard
- **Purpose:** Compliance health snapshot per region.
- **User stories:** US-042
- **Key elements:** KPI strip (Data export requests pending · Consent records up to date · Data residency status per region) · Recent audits table · Outstanding action items
- **shadcn components:** `card`, `data-table`, `badge`

### - [ ] A10.2 Data export / deletion requests
- **Purpose:** NDPR/GDPR subject access + erasure requests from clients or therapists.
- **Key elements:** Request list (Type: Export / Delete · Subject · Submitted · Due by · Status) · Detail drawer with action: [Fulfil] [Reject (with reason)]
- **shadcn components:** `data-table`, `sheet`, `button`

### - [ ] A10.3 Regional residency settings
- **Purpose:** Where each region's data lives (storage region, processor list, sub-processor disclosures).
- **Key elements:** Region cards (NG · EU · Other) with storage location, processors used, last audit date, compliance certs
- **shadcn components:** `card`, `accordion`, `badge`

---

## Flow A11 — Settings & Roles

Admin user management + role permissions. Baseline.

### - [ ] A11.1 Admin users
- **Purpose:** List of all admin + super-admin users. Add, edit role, deactivate.
- **Key elements:** Table cols (Name · Email · Role · Last active · Status · Open) · "Invite admin" CTA → modal with email + role picker
- **shadcn components:** `data-table`, `dialog`, `select`, `button`

### - [ ] A11.2 Role permissions
- **Purpose:** Edit permission sets per role. Matrix of role × capability.
- **Key elements:** Roles (Admin · Super Admin · Read-only) × Capabilities (Approve therapist · Edit pricing · Override tier · Fulfil GDPR request · etc) · Toggle per cell
- **shadcn components:** `table`, `switch`

### - [ ] A11.3 Audit log
- **Purpose:** All admin actions logged. Filter by admin, action type, date.
- **Key elements:** Filter (Admin · Action type · Date range) · table cols (When · Admin · Action · Target · IP · Detail)
- **shadcn components:** `data-table`, `select`, `date-range-picker`

---

## Out of scope (deferred or no US backing)

- **In-app messaging admin moderation** — no messaging US in PRD
- **Marketing email composer** — separate marketing tool, not admin app
- **Content management** (blog posts, articles) — out of MVP scope
- **Mobile admin app** — desktop-only per scope
- **AI Companion governance** — patient feature, no admin-side US
- **Therapist-to-therapist supervision** — not in PRD

---

## Build order recommendation

Phase 1 (skeleton + dashboard):
1. A1.1 Sign in
2. Sidebar + top bar chrome (shared layout)
3. A2.1 Dashboard home

Phase 2 (people ops):
4. A3.1 Verification queue
5. A3.2 Application review
6. A3.3 Therapist directory
7. A3.4 Therapist detail

Phase 3 (money governance):
8. A6.1 Pricing tables
9. A6.2 Price bands
10. A8.1 Approvals queue
11. A8.2 Approval detail
12. A6.3 Eligibility matrix
13. A7.1 Promotions list
14. A7.2 Promotion editor

Phase 4 (clinical safety):
15. A5.1 Sessions list
16. A5.2 Risk alerts queue
17. A5.3 Crisis log
18. A5.4 Crisis detail

Phase 5 (analytics + commission):
19. A6.4 Plan coverage report
20. A9.1 Commission analytics
21. A9.2 Payout runs
22. A9.3 Tier overrides

Phase 6 (clients + governance):
23. A4.1–A4.3 Clients
24. A10.1–A10.3 Compliance
25. A11.1–A11.3 Settings & Roles

Phase 7 (auth polish):
26. A1.2 2FA
27. A1.3 Password reset

---

## Audit notes (apply before building)

Same pushback discipline as therapist-app-flow.md:
- Every screen must trace to a US or be flagged as baseline-ops
- Kill duplicate surfaces (e.g. don't build separate "Crisis alerts inbox" + "Crisis log")
- Defer V2 nice-to-haves
- Sections inside a screen are sections, not separate screens
- Modals + drawers are NOT screens (count them as states on the parent)
