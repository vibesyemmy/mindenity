# Admin Settings & Roles Module — Design Spec

**Date:** 2026-05-27
**Owner:** Mindenity admin app
**Status:** Approved
**Implements:** [admin-app-flow.md](../../../design-tasks/admin-app-flow.md) Flow A11
**Project:** `admin/` (Next.js 16 · shadcn/ui · TanStack Table · UI prototype only)

---

## 1. Purpose

Three screens for managing who has admin access, what each role can do, and what every admin has done.

| Screen | Route | Job |
|---|---|---|
| **A11.1 Admin users** | `/settings` | List of admins · invite new · deactivate existing |
| **A11.2 Role permissions** | `/settings/roles` | Matrix · 3 roles × ~10 capabilities |
| **A11.3 Audit log** | `/settings/audit` | All admin actions with admin/action/date filters |

Sidebar `Settings & roles` already points at `/settings`.

## 2. Non-goals

- No real authentication / session management
- No real role-based access control enforcement (UI-only)
- No SSO integration / SCIM provisioning
- No password reset for other admins
- No real audit log immutability / cryptographic chain
- No webhook export of audit events

## 3. User stories addressed

- Baseline ops surface — no explicit US, required for any admin app
- Cross-references US-023 (verifications) · US-015 (pricing approvals) · US-013.5 (tier overrides) etc. as the capability targets

## 4. Pre-existing decisions (confirmed)

| Decision | Choice |
|---|---|
| Routes | 3 separate routes (no shared tabs) — distinct content shapes |
| Roles | 3 fixed: Admin · Super Admin · Read-only |
| Capabilities | ~10 representative ones drawn from earlier modules |
| Matrix | Switch toggle per cell (same as A6.3 eligibility) |
| Persistence | None — toast confirmations only |

## 5. Per-screen anatomy

### 5.1 A11.1 Admin users (`/settings`)

| Slot | Contents |
|---|---|
| Page header | Title `Admin users` · subtitle `{activeCount} active · {suspendedCount} suspended` · right rail [Role permissions →] + [Audit log →] + [+ Invite admin] |
| Filter row | Search (placeholder `Search by name or email…`) · Role select (All / Admin / Super Admin / Read-only) · Status select (All / Active / Suspended) |
| Table | Cols: Name (avatar initials + name) · Email · Role (badge) · Last active (relative time) · Status · Edit (button → would open role-change dialog; opens toast in prototype) · Deactivate (destructive button — disabled when already suspended) |
| Empty state | `No admin users match these filters.` |
| Invite dialog | Email input · Role select · Personal welcome note textarea (optional) · [Send invite] → toast |
| Deactivate dialog | "Suspend {name}? They lose access immediately. Reactivate by re-inviting." · Confirm → toast |

### 5.2 A11.2 Role permissions (`/settings/roles`)

| Slot | Contents |
|---|---|
| Page header | Title `Role permissions` · subtitle `What each role can do across the admin console` · right rail [← Admin users] |
| Warning banner | "Permission changes apply on next login for each admin. Super Admins always retain all permissions." (info variant) |
| Matrix | Sticky-left capability column · 3 toggle columns (Admin / Super Admin / Read-only) |
| Capabilities (10 rows) | Approve therapist applications · Edit plan pricing · Override commission tier · Refund payments · Suspend client account · Suspend therapist account · Fulfil GDPR/NDPR requests · Edit promotions · Counter-offer pricing requests · View audit log |
| Footer | Save changes button (toast with count of changed cells) |

Super Admin column shows always-on (disabled toggles) per the warning copy.

### 5.3 A11.3 Audit log (`/settings/audit`)

| Slot | Contents |
|---|---|
| Page header | Title `Audit log` · subtitle `{totalEntries} actions logged · last entry {lastRelative}` · right rail [← Admin users] + [Export CSV] (disabled) |
| Filter row | Search (placeholder `Search by target…`) · Admin select (All / each admin name) · Action type select (All / 10 action categories) · Date range select (Today / Last 7d / Last 30d / All) |
| Table | Cols: When (relative + ISO tooltip) · Admin · Action (verb) · Target · IP address (monospace) · Detail (popover with full event payload) |
| Pagination | 50 rows / page (audit is denser than other lists) |

## 6. Per-card states

| State | Treatment |
|---|---|
| Loading | shadcn `skeleton` (documented; not implemented) |
| Empty | Per-section above |
| Error | `Couldn't load — [Retry]` (documented) |

## 7. Data flow (UI-only prototype)

- All data dummy in `admin/lib/dummy/settings.ts`
- Exports:
  - `getAdminUsers(filters?)`
  - `getCapabilities()` — 10 capabilities with default per-role flags
  - `getAuditEntries(filters?)`
  - `getSettingsStats()`
- URL params on A11.1 + A11.3 for filtering
- A11.2 matrix uses local state

## 8. Responsive

| Breakpoint | Behaviour |
|---|---|
| ≥ 1280px | Layout as described |
| 1024–1279px | A11.2 matrix preserves sticky-left; A11.3 horizontal-scroll on overflow |
| < 1024px | Out of scope |

## 9. shadcn components

All already installed. **No new shadcn additions needed.**

Reuses: card, badge, button, input, label, select, tabs, table, dialog, switch, textarea, popover, dropdown-menu, separator, tooltip, sidebar, sheet, sonner.

## 10. Implementation surface

| File | Role |
|---|---|
| `admin/lib/dummy/settings.ts` | Types + dummy data + getters/stats |
| `admin/components/settings/admin-columns.tsx` | A11.1 columns |
| `admin/components/settings/admin-filters.tsx` | A11.1 filters |
| `admin/components/settings/admin-actions.tsx` | A11.1 invite + deactivate dialogs |
| `admin/components/settings/admins-list.tsx` | A11.1 client wrapper |
| `admin/app/(dashboard)/settings/page.tsx` | A11.1 entry |
| `admin/components/settings/role-matrix.tsx` | A11.2 matrix |
| `admin/app/(dashboard)/settings/roles/page.tsx` | A11.2 entry |
| `admin/components/settings/audit-columns.tsx` | A11.3 columns |
| `admin/components/settings/audit-filters.tsx` | A11.3 filters |
| `admin/app/(dashboard)/settings/audit/page.tsx` | A11.3 entry |

Reuses: `admin/components/therapists/data-table.tsx`.

## 11. Wiring decisions

- Sidebar `Settings & roles` → `/settings` ✓
- Header shortcuts on A11.1 → A11.2 + A11.3
- Invite dialog email validation (basic — required + must contain @)
- Deactivate dialog only enabled when row.status === "Active"
- A11.3 row "Detail" popover shows full action payload (synthetic) for transparency
- Dashboard's `Recent activity` card "Open audit log →" already targets `/audit-log` — adjust to `/settings/audit` OR leave broken (low-priority — covered in open polish)

## 12. Open polish (deferred)

- Real authentication / RBAC enforcement
- SSO + SCIM
- Cryptographic audit chain
- Webhook export of audit events
- Password reset workflow
- Loading skeletons
- Mobile view
- Dashboard `Recent activity` link target (currently `/audit-log` — should be `/settings/audit`; defer correction or fix as polish)

## 13. Success criteria

1. Sidebar `Settings & roles` lands on `/settings` with admin list
2. Filters work; Invite admin dialog opens + validates + toast
3. Deactivate dialog opens for Active rows + toast
4. `/settings/roles` shows 10×3 matrix; Super Admin column always-on disabled
5. `/settings/audit` shows ≥15 entries; filters work; Detail popover shows synthetic payload
6. TypeScript clean; no hydration mismatch; no console errors
