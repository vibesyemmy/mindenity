// Shared types + dummy data for admin settings & roles module.
// Cross-references real admins (Adaeze, Sarah) and targets from earlier modules.

export type AdminRole = "Admin" | "Super Admin" | "Read-only";
export type AdminStatus = "Active" | "Suspended" | "Invited";

export type AdminUser = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastActiveAt: string; // ISO
  invitedAt: string; // ISO
};

export type Capability = {
  id: string;
  label: string;
  description: string;
  defaults: Record<AdminRole, boolean>;
};

export type AuditAction =
  | "Therapist verified"
  | "Therapist rejected"
  | "Pricing approved"
  | "Pricing rejected"
  | "Pricing band updated"
  | "Tier override applied"
  | "Tier override removed"
  | "Refund issued"
  | "Client suspended"
  | "Subject request fulfilled"
  | "Subject request rejected"
  | "Promotion created"
  | "Promotion deleted"
  | "Admin invited"
  | "Role permissions updated";

export type AuditEntry = {
  id: string;
  timestamp: string; // ISO
  adminId: string;
  adminName: string;
  action: AuditAction;
  target: string;
  ip: string;
  detail: string; // synthetic payload summary
};

export type AdminFilters = {
  q?: string;
  role?: "all" | "admin" | "super-admin" | "read-only";
  status?: "all" | "active" | "suspended" | "invited";
};

export type AuditFilters = {
  q?: string;
  adminId?: string;
  action?: string;
  range?: "today" | "7d" | "30d" | "all";
};

const ADMINS: AdminUser[] = [
  {
    id: "u-001",
    name: "Adaeze Nwosu",
    initials: "AN",
    email: "adaeze@mindenity.com",
    role: "Super Admin",
    status: "Active",
    lastActiveAt: "2026-05-27T08:00:00Z",
    invitedAt: "2024-01-04T00:00:00Z",
  },
  {
    id: "u-002",
    name: "Sarah Okeke",
    initials: "SO",
    email: "sarah@mindenity.com",
    role: "Admin",
    status: "Active",
    lastActiveAt: "2026-05-27T06:30:00Z",
    invitedAt: "2024-08-12T00:00:00Z",
  },
  {
    id: "u-003",
    name: "Marcus Founder",
    initials: "MF",
    email: "founder@mindenity.com",
    role: "Super Admin",
    status: "Active",
    lastActiveAt: "2026-05-26T22:14:00Z",
    invitedAt: "2023-09-01T00:00:00Z",
  },
  {
    id: "u-004",
    name: "Folake Adeyemi",
    initials: "FA",
    email: "folake@mindenity.com",
    role: "Admin",
    status: "Active",
    lastActiveAt: "2026-05-26T14:42:00Z",
    invitedAt: "2025-03-18T00:00:00Z",
  },
  {
    id: "u-005",
    name: "Daniel Mensah",
    initials: "DM",
    email: "daniel@mindenity.com",
    role: "Read-only",
    status: "Active",
    lastActiveAt: "2026-05-25T18:00:00Z",
    invitedAt: "2025-11-02T00:00:00Z",
  },
  {
    id: "u-006",
    name: "Ngozi Eze",
    initials: "NE",
    email: "ngozi@mindenity.com",
    role: "Admin",
    status: "Suspended",
    lastActiveAt: "2026-04-15T10:00:00Z",
    invitedAt: "2024-06-20T00:00:00Z",
  },
  {
    id: "u-007",
    name: "Priya Ops",
    initials: "PO",
    email: "priya.ops@mindenity.com",
    role: "Admin",
    status: "Invited",
    lastActiveAt: "2026-05-25T00:00:00Z", // invite sent — never logged in
    invitedAt: "2026-05-25T00:00:00Z",
  },
];

const CAPABILITIES: Capability[] = [
  {
    id: "cap-verify-therapist",
    label: "Approve therapist applications",
    description: "Verify and approve new therapist accounts (A3.2).",
    defaults: { Admin: true, "Super Admin": true, "Read-only": false },
  },
  {
    id: "cap-edit-pricing",
    label: "Edit plan pricing",
    description: "Change plan base prices and bands (A6.1).",
    defaults: { Admin: true, "Super Admin": true, "Read-only": false },
  },
  {
    id: "cap-override-tier",
    label: "Override commission tier",
    description: "Apply per-therapist tier or custom % overrides (A9.3).",
    defaults: { Admin: false, "Super Admin": true, "Read-only": false },
  },
  {
    id: "cap-refund",
    label: "Refund payments",
    description: "Issue full or partial refunds on client payments (A4.2).",
    defaults: { Admin: true, "Super Admin": true, "Read-only": false },
  },
  {
    id: "cap-suspend-client",
    label: "Suspend client account",
    description: "Suspend client login + cancel active bookings (A4.2).",
    defaults: { Admin: true, "Super Admin": true, "Read-only": false },
  },
  {
    id: "cap-suspend-therapist",
    label: "Suspend therapist account",
    description: "Remove therapist from client searches (A3.4).",
    defaults: { Admin: true, "Super Admin": true, "Read-only": false },
  },
  {
    id: "cap-fulfil-subject-request",
    label: "Fulfil GDPR/NDPR requests",
    description: "Approve or reject subject access requests (A10.2).",
    defaults: { Admin: true, "Super Admin": true, "Read-only": false },
  },
  {
    id: "cap-edit-promotions",
    label: "Edit promotions",
    description: "Create, edit, or delete promotional pricing windows (A7).",
    defaults: { Admin: true, "Super Admin": true, "Read-only": false },
  },
  {
    id: "cap-counter-pricing",
    label: "Counter-offer pricing requests",
    description: "Send counter-offers on therapist custom-pricing requests (A8.2).",
    defaults: { Admin: true, "Super Admin": true, "Read-only": false },
  },
  {
    id: "cap-view-audit",
    label: "View audit log",
    description: "Access the full admin action history (A11.3).",
    defaults: { Admin: true, "Super Admin": true, "Read-only": true },
  },
];

const AUDIT_ENTRIES: AuditEntry[] = [
  {
    id: "ev-001",
    timestamp: "2026-05-27T08:14:00Z",
    adminId: "u-001",
    adminName: "Adaeze Nwosu",
    action: "Therapist verified",
    target: "Dr. Chinwe Okoro · v-001",
    ip: "102.89.4.122",
    detail: "Verification approved · NDPR-clean · all AI checks passed · welcome email queued.",
  },
  {
    id: "ev-002",
    timestamp: "2026-05-27T07:50:00Z",
    adminId: "u-002",
    adminName: "Sarah Okeke",
    action: "Refund issued",
    target: "Client-9128 · payment p-001-1",
    ip: "102.89.4.187",
    detail: "Full refund of ₦40,000 via Paystack · reason: 'Session canceled due to therapist illness'.",
  },
  {
    id: "ev-003",
    timestamp: "2026-05-26T22:14:00Z",
    adminId: "u-003",
    adminName: "Marcus Founder",
    action: "Tier override applied",
    target: "Dr. Marcus Quinn · t-002",
    ip: "185.213.66.41",
    detail: "Custom 90% for 12 months · reason: 'Strategic clinical hire offer letter'.",
  },
  {
    id: "ev-004",
    timestamp: "2026-05-26T18:30:00Z",
    adminId: "u-001",
    adminName: "Adaeze Nwosu",
    action: "Pricing approved",
    target: "Dr. Aisha Bello · Essential · ₦22,000",
    ip: "102.89.4.122",
    detail: "Within band · approved immediately.",
  },
  {
    id: "ev-005",
    timestamp: "2026-05-26T15:00:00Z",
    adminId: "u-001",
    adminName: "Adaeze Nwosu",
    action: "Pricing band updated",
    target: "Together · NGN",
    ip: "102.89.4.122",
    detail: "Min ₦40k → ₦42k · Max ₦60k → ₦65k · base unchanged.",
  },
  {
    id: "ev-006",
    timestamp: "2026-05-26T11:18:00Z",
    adminId: "u-002",
    adminName: "Sarah Okeke",
    action: "Therapist rejected",
    target: "Dr. Mateo Alvarez · v-002",
    ip: "102.89.4.187",
    detail: "Rejected · AI flagged duplicate account; manual review confirmed second registration attempt under same identity.",
  },
  {
    id: "ev-007",
    timestamp: "2026-05-26T09:00:00Z",
    adminId: "u-004",
    adminName: "Folake Adeyemi",
    action: "Promotion created",
    target: "June Int'l Launch",
    ip: "102.89.5.12",
    detail: "$20 flat off Balance + Thrive · Int'l only · 30-day window.",
  },
  {
    id: "ev-008",
    timestamp: "2026-05-25T14:00:00Z",
    adminId: "u-001",
    adminName: "Adaeze Nwosu",
    action: "Subject request fulfilled",
    target: "Client-3902 · GDPR Article 17",
    ip: "102.89.4.122",
    detail: "Deletion completed · audit trail entry preserved per retention policy.",
  },
  {
    id: "ev-009",
    timestamp: "2026-05-25T11:30:00Z",
    adminId: "u-002",
    adminName: "Sarah Okeke",
    action: "Client suspended",
    target: "Client-6451 · Marina Costa",
    ip: "102.89.4.187",
    detail: "Suspended · reason: 'Repeated terms-of-service violations after warning on 2026-05-12'.",
  },
  {
    id: "ev-010",
    timestamp: "2026-05-25T09:00:00Z",
    adminId: "u-001",
    adminName: "Adaeze Nwosu",
    action: "Admin invited",
    target: "priya.ops@mindenity.com · Admin role",
    ip: "102.89.4.122",
    detail: "Invitation sent · welcome note: 'Welcome to the ops team, Priya. Ping me with any questions.'",
  },
  {
    id: "ev-011",
    timestamp: "2026-05-24T16:42:00Z",
    adminId: "u-001",
    adminName: "Adaeze Nwosu",
    action: "Pricing rejected",
    target: "Dr. Femi Ojo · Together · NGN",
    ip: "102.89.4.122",
    detail: "Rejected · reason: 'Significantly above max band; therapist tier (Standard) does not yet justify Senior-tier pricing.'",
  },
  {
    id: "ev-012",
    timestamp: "2026-05-24T10:00:00Z",
    adminId: "u-003",
    adminName: "Marcus Founder",
    action: "Role permissions updated",
    target: "Admin role · 1 capability changed",
    ip: "185.213.66.41",
    detail: "Override commission tier moved from Admin to Super Admin only.",
  },
  {
    id: "ev-013",
    timestamp: "2026-05-23T17:20:00Z",
    adminId: "u-002",
    adminName: "Sarah Okeke",
    action: "Therapist verified",
    target: "Dr. Kemi Adeyemi · v-004",
    ip: "102.89.4.187",
    detail: "Verification approved · all AI checks clean.",
  },
  {
    id: "ev-014",
    timestamp: "2026-05-23T09:15:00Z",
    adminId: "u-001",
    adminName: "Adaeze Nwosu",
    action: "Subject request rejected",
    target: "Client-6451 · GDPR Article 15",
    ip: "102.89.4.122",
    detail: "Rejected · identity verification failed twice; resubmission instructions sent.",
  },
  {
    id: "ev-015",
    timestamp: "2026-05-22T11:40:00Z",
    adminId: "u-004",
    adminName: "Folake Adeyemi",
    action: "Promotion deleted",
    target: "Spring NG Trial",
    ip: "102.89.5.12",
    detail: "Promotion deleted · reason: 'Replaced by May NG Onboarding with broader plan coverage'.",
  },
  {
    id: "ev-016",
    timestamp: "2026-05-21T18:00:00Z",
    adminId: "u-001",
    adminName: "Adaeze Nwosu",
    action: "Tier override removed",
    target: "Dr. Tola Adesina",
    ip: "102.89.4.122",
    detail: "Override removed · therapist reverts to auto-calculated Tier 2 (was forced Tier 1 during onboarding).",
  },
];

const ACTION_TYPES: AuditAction[] = [
  "Therapist verified",
  "Therapist rejected",
  "Pricing approved",
  "Pricing rejected",
  "Pricing band updated",
  "Tier override applied",
  "Tier override removed",
  "Refund issued",
  "Client suspended",
  "Subject request fulfilled",
  "Subject request rejected",
  "Promotion created",
  "Promotion deleted",
  "Admin invited",
  "Role permissions updated",
];

function withinRange(iso: string, range?: AuditFilters["range"]): boolean {
  if (!range || range === "all") return true;
  const dayMs = 24 * 60 * 60 * 1000;
  const days = range === "today" ? 1 : range === "7d" ? 7 : 30;
  return Date.now() - new Date(iso).getTime() <= days * dayMs;
}

function matchesQuery(haystack: string, q?: string): boolean {
  if (!q) return true;
  return haystack.toLowerCase().includes(q.toLowerCase());
}

export function getAdminUsers(filters: AdminFilters = {}): AdminUser[] {
  return ADMINS.filter((a) => {
    if (!matchesQuery(`${a.name} ${a.email}`, filters.q)) return false;
    if (filters.role && filters.role !== "all") {
      const map: Record<string, AdminRole> = {
        admin: "Admin",
        "super-admin": "Super Admin",
        "read-only": "Read-only",
      };
      if (a.role !== map[filters.role]) return false;
    }
    if (filters.status && filters.status !== "all") {
      const map: Record<string, AdminStatus> = {
        active: "Active",
        suspended: "Suspended",
        invited: "Invited",
      };
      if (a.status !== map[filters.status]) return false;
    }
    return true;
  });
}

export function getCapabilities(): Capability[] {
  return CAPABILITIES;
}

export function getAuditEntries(filters: AuditFilters = {}): AuditEntry[] {
  return AUDIT_ENTRIES.filter((e) => {
    if (!matchesQuery(`${e.target} ${e.adminName} ${e.action}`, filters.q)) return false;
    if (filters.adminId && filters.adminId !== "all" && e.adminId !== filters.adminId) {
      return false;
    }
    if (filters.action && filters.action !== "all" && e.action !== filters.action) {
      return false;
    }
    if (!withinRange(e.timestamp, filters.range)) return false;
    return true;
  });
}

export function getSettingsStats() {
  return {
    activeAdmins: ADMINS.filter((a) => a.status === "Active").length,
    suspendedAdmins: ADMINS.filter((a) => a.status === "Suspended").length,
    invitedAdmins: ADMINS.filter((a) => a.status === "Invited").length,
    totalEntries: AUDIT_ENTRIES.length,
    lastEntryAt: AUDIT_ENTRIES[0]?.timestamp,
  };
}

export function getAdminsForFilter(): Array<{ id: string; name: string }> {
  return ADMINS.map((a) => ({ id: a.id, name: a.name }));
}

// Return audit entries whose `target` string contains the given name (case-insensitive).
// Used by therapist + client detail pages to show per-subject activity log.
export function getAuditEntriesByTarget(name: string, limit = 5): AuditEntry[] {
  const needle = name.toLowerCase();
  return AUDIT_ENTRIES.filter((e) => e.target.toLowerCase().includes(needle)).slice(
    0,
    limit
  );
}

export const ALL_ACTION_TYPES = ACTION_TYPES;

export function formatRelative(iso: string): string {
  const diffSec = Math.round((Date.now() - new Date(iso).getTime()) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.round(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.round(diffHour / 24);
  return `${diffDay}d ago`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
