# Admin Settings & Roles Module Implementation Plan

> Use superpowers:subagent-driven-development to execute task-by-task.

**Goal:** Ship A11 module (admin users + role permissions + audit log) per `docs/superpowers/specs/2026-05-27-admin-settings-roles-module-design.md`.

**Architecture:** 3 routes inside `(dashboard)` group. Reuses every component from earlier modules. **No new deps.**

---

## File structure

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

---

## Task SR1: Dummy admins + capabilities + audit data

**File:** `admin/lib/dummy/settings.ts`

```ts
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
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add lib/dummy/settings.ts && \
git commit -m "Add settings + roles + audit dummy data"
```

---

## Task SR2: A11.1 Admin users + invite/deactivate dialogs

**File 1:** `admin/components/settings/admin-columns.tsx`

```tsx
"use client";

import { Pencil } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { formatRelative, type AdminUser } from "@/lib/dummy/settings";

const roleVariant: Record<
  AdminUser["role"],
  "default" | "secondary" | "outline"
> = {
  "Super Admin": "default",
  Admin: "secondary",
  "Read-only": "outline",
};

const statusVariant: Record<
  AdminUser["status"],
  "secondary" | "destructive" | "outline"
> = {
  Active: "secondary",
  Suspended: "destructive",
  Invited: "outline",
};

export function makeAdminColumns(
  onDeactivate: (u: AdminUser) => void
): ColumnDef<AdminUser>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const a = row.original;
        return (
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold"
            >
              {a.initials}
            </span>
            <span className="font-medium">{a.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant={roleVariant[row.original.role]}>
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "lastActiveAt",
      header: "Last active",
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-muted-foreground">
          {formatRelative(row.original.lastActiveAt)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={statusVariant[row.original.status]}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "edit",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            toast.info(`Role-change dialog for ${row.original.name}`, {
              description: "Not built in prototype — would change role here.",
            })
          }
        >
          <Pencil className="size-3.5 mr-1" />
          Edit
        </Button>
      ),
    },
    {
      id: "deactivate",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          disabled={row.original.status !== "Active"}
          onClick={() => onDeactivate(row.original)}
        >
          Deactivate
        </Button>
      ),
    },
  ];
}
```

**File 2:** `admin/components/settings/admin-filters.tsx`

```tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdminFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value === "" || value === "all") next.delete(key);
    else next.set(key, value);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        type="search"
        placeholder="Search by name or email…"
        defaultValue={params.get("q") ?? ""}
        onChange={(e) => setParam("q", e.target.value)}
        className="w-[260px]"
      />

      <Select
        value={params.get("role") ?? "all"}
        onValueChange={(v) => setParam("role", v)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="super-admin">Super Admin</SelectItem>
          <SelectItem value="read-only">Read-only</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={params.get("status") ?? "all"}
        onValueChange={(v) => setParam("status", v)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
          <SelectItem value="invited">Invited</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

**File 3:** `admin/components/settings/admin-actions.tsx`

```tsx
"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { AdminUser } from "@/lib/dummy/settings";

export function InviteAdminButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Admin" | "Super Admin" | "Read-only">("Admin");
  const [note, setNote] = useState("");

  const handleInvite = () => {
    if (!email.includes("@") || email.length < 5) {
      return toast.error("Enter a valid email address");
    }
    toast.success(`Invitation sent to ${email}`, {
      description: `${role} role · they'll receive a sign-in link.`,
    });
    setOpen(false);
    setEmail("");
    setNote("");
    setRole("Admin");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="size-4 mr-1" />
          Invite admin
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite admin</DialogTitle>
          <DialogDescription>
            Send a sign-in link to a colleague. They&apos;ll set up 2FA on first
            login.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@mindenity.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
              <SelectTrigger id="invite-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
                <SelectItem value="Read-only">Read-only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-note">Personal note (optional)</Label>
            <Textarea
              id="invite-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Welcome to the ops team — ping me with any questions."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleInvite}>Send invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type DeactivateProps = {
  target: AdminUser | null;
  onOpenChange: (open: boolean) => void;
};

export function DeactivateAdminDialog({ target, onOpenChange }: DeactivateProps) {
  const handleConfirm = () => {
    if (!target) return;
    toast.success(`${target.name} suspended`, {
      description: "They lose access immediately. Reactivate by re-inviting.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={target !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suspend {target?.name}?</DialogTitle>
          <DialogDescription>
            They lose admin access immediately. To restore, re-invite them with
            the same email — their audit history is preserved.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Suspend admin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**File 4:** `admin/components/settings/admins-list.tsx`

```tsx
"use client";

import { useMemo, useState } from "react";

import { DataTable } from "@/components/therapists/data-table";

import { makeAdminColumns } from "@/components/settings/admin-columns";
import { DeactivateAdminDialog } from "@/components/settings/admin-actions";

import type { AdminUser } from "@/lib/dummy/settings";

type Props = {
  admins: AdminUser[];
};

export function AdminsList({ admins }: Props) {
  const [deactivateTarget, setDeactivateTarget] = useState<AdminUser | null>(null);

  const columns = useMemo(
    () => makeAdminColumns((u) => setDeactivateTarget(u)),
    []
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={admins}
        emptyMessage="No admin users match these filters."
      />
      <DeactivateAdminDialog
        target={deactivateTarget}
        onOpenChange={(open) => {
          if (!open) setDeactivateTarget(null);
        }}
      />
    </>
  );
}
```

**File 5:** `admin/app/(dashboard)/settings/page.tsx`

```tsx
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { AdminFilters } from "@/components/settings/admin-filters";
import { AdminsList } from "@/components/settings/admins-list";
import { InviteAdminButton } from "@/components/settings/admin-actions";

import {
  getAdminUsers,
  getSettingsStats,
  type AdminFilters as AdminFilterShape,
} from "@/lib/dummy/settings";

type SearchParams = Promise<{
  q?: string;
  role?: string;
  status?: string;
}>;

function asFilters(p: Awaited<SearchParams>): AdminFilterShape {
  return {
    q: p.q,
    role: p.role as AdminFilterShape["role"],
    status: p.status as AdminFilterShape["status"],
  };
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const admins = getAdminUsers(filters);
  const stats = getSettingsStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Admin users</h1>
          <p className="text-sm text-muted-foreground">
            {stats.activeAdmins} active · {stats.invitedAdmins} invited ·{" "}
            {stats.suspendedAdmins} suspended
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/settings/roles">Role permissions →</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/settings/audit">Audit log →</Link>
          </Button>
          <InviteAdminButton />
        </div>
      </header>

      <AdminFilters />

      <AdminsList admins={admins} />
    </div>
  );
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

```js
for (const url of ['/settings', '/settings?role=admin', '/settings?status=suspended', '/settings?q=adaeze']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: all 200.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/settings/admin-columns.tsx components/settings/admin-filters.tsx components/settings/admin-actions.tsx components/settings/admins-list.tsx "app/(dashboard)/settings/page.tsx" && \
git commit -m "Add A11.1 admin users page with invite + deactivate dialogs"
```

---

## Task SR3: A11.2 Role permissions matrix

**File 1:** `admin/components/settings/role-matrix.tsx`

```tsx
"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  getCapabilities,
  type AdminRole,
} from "@/lib/dummy/settings";

const ROLES: AdminRole[] = ["Admin", "Super Admin", "Read-only"];

type CellKey = string; // `${capId}|${role}`

function keyOf(capId: string, role: AdminRole): CellKey {
  return `${capId}|${role}`;
}

export function RoleMatrix() {
  const capabilities = getCapabilities();
  const [enabled, setEnabled] = useState<Record<CellKey, boolean>>(() => {
    const next: Record<CellKey, boolean> = {};
    for (const cap of capabilities) {
      for (const role of ROLES) {
        next[keyOf(cap.id, role)] = cap.defaults[role];
      }
    }
    return next;
  });

  const toggle = (capId: string, role: AdminRole) => {
    // Super Admin always retains all permissions.
    if (role === "Super Admin") return;
    setEnabled((prev) => ({
      ...prev,
      [keyOf(capId, role)]: !prev[keyOf(capId, role)],
    }));
  };

  const handleSave = () => {
    const changed = capabilities
      .flatMap((cap) =>
        ROLES.map((role) => ({
          key: keyOf(cap.id, role),
          isDefault: cap.defaults[role],
        }))
      )
      .filter((c) => enabled[c.key] !== c.isDefault).length;
    if (changed === 0) {
      toast.info("No changes to save");
      return;
    }
    toast.success("Role permissions updated", {
      description: `${changed} cell${changed === 1 ? "" : "s"} changed · applies on next login per admin.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-md border border-border/60 bg-muted/40 px-4 py-3">
        <Info className="size-4 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Permission changes apply on next login for each admin. Super Admins
          always retain all permissions.
        </p>
      </div>

      <div className="rounded-md border border-border/60 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-card z-10">Capability</TableHead>
              {ROLES.map((role) => (
                <TableHead key={role} className="text-center">
                  {role}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {capabilities.map((cap) => (
              <TableRow key={cap.id}>
                <TableCell className="sticky left-0 bg-card z-10 align-top">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-medium cursor-help underline decoration-dotted underline-offset-4">
                        {cap.label}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      {cap.description}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                {ROLES.map((role) => {
                  const key = keyOf(cap.id, role);
                  const isSuperAdmin = role === "Super Admin";
                  return (
                    <TableCell key={role} className="text-center">
                      <Switch
                        checked={isSuperAdmin ? true : enabled[key]}
                        onCheckedChange={() => toggle(cap.id, role)}
                        disabled={isSuperAdmin}
                        aria-label={`${cap.label} · ${role}`}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save changes</Button>
      </div>
    </div>
  );
}
```

**File 2:** `admin/app/(dashboard)/settings/roles/page.tsx`

```tsx
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { RoleMatrix } from "@/components/settings/role-matrix";

export default function RolePermissionsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            Role permissions
          </h1>
          <p className="text-sm text-muted-foreground">
            What each role can do across the admin console.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/settings">← Admin users</Link>
        </Button>
      </header>

      <RoleMatrix />
    </div>
  );
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

```js
const r = await fetch('http://localhost:3000/settings/roles');
const html = await r.text();
console.log(r.status, html.includes('Role permissions') && html.includes('Approve therapist applications') ? 'OK' : 'missing');
```
Expected: `200 OK`.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/settings/role-matrix.tsx "app/(dashboard)/settings/roles/page.tsx" && \
git commit -m "Add A11.2 role permissions matrix"
```

---

## Task SR4: A11.3 Audit log

**File 1:** `admin/components/settings/audit-columns.tsx`

```tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatRelative, type AuditEntry } from "@/lib/dummy/settings";

const actionVariant = (
  action: AuditEntry["action"]
): "secondary" | "destructive" | "outline" => {
  if (
    action.includes("rejected") ||
    action.includes("suspended") ||
    action.includes("deleted") ||
    action.includes("removed")
  )
    return "destructive";
  if (action.includes("approved") || action.includes("verified") || action.includes("fulfilled"))
    return "secondary";
  return "outline";
};

export const auditColumns: ColumnDef<AuditEntry>[] = [
  {
    accessorKey: "timestamp",
    header: "When",
    cell: ({ row }) => {
      const iso = row.original.timestamp;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm tabular-nums">{formatRelative(iso)}</span>
          </TooltipTrigger>
          <TooltipContent side="top">
            {new Date(iso).toLocaleString("en-GB")}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "adminName",
    header: "Admin",
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.adminName}</span>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <Badge variant={actionVariant(row.original.action)} className="font-normal">
        {row.original.action}
      </Badge>
    ),
  },
  {
    accessorKey: "target",
    header: "Target",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.target}</span>
    ),
  },
  {
    accessorKey: "ip",
    header: "IP",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground tabular-nums">
        {row.original.ip}
      </span>
    ),
  },
  {
    id: "detail",
    header: "Detail",
    cell: ({ row }) => (
      <Popover>
        <PopoverTrigger className="text-xs text-muted-foreground hover:text-foreground hover:underline">
          View
        </PopoverTrigger>
        <PopoverContent className="text-sm max-w-md">
          {row.original.detail}
        </PopoverContent>
      </Popover>
    ),
  },
];
```

**File 2:** `admin/components/settings/audit-filters.tsx`

```tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ALL_ACTION_TYPES,
  getAdminsForFilter,
} from "@/lib/dummy/settings";

export function AuditFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const admins = getAdminsForFilter();

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value === "" || value === "all") next.delete(key);
    else next.set(key, value);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        type="search"
        placeholder="Search by target…"
        defaultValue={params.get("q") ?? ""}
        onChange={(e) => setParam("q", e.target.value)}
        className="w-[240px]"
      />

      <Select
        value={params.get("adminId") ?? "all"}
        onValueChange={(v) => setParam("adminId", v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Admin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All admins</SelectItem>
          {admins.map((a) => (
            <SelectItem key={a.id} value={a.id}>
              {a.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.get("action") ?? "all"}
        onValueChange={(v) => setParam("action", v)}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All actions</SelectItem>
          {ALL_ACTION_TYPES.map((a) => (
            <SelectItem key={a} value={a}>
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.get("range") ?? "all"}
        onValueChange={(v) => setParam("range", v)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

**File 3:** `admin/app/(dashboard)/settings/audit/page.tsx`

```tsx
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/therapists/data-table";

import { auditColumns } from "@/components/settings/audit-columns";
import { AuditFilters } from "@/components/settings/audit-filters";

import {
  formatRelative,
  getAuditEntries,
  getSettingsStats,
  type AuditFilters as AuditFilterShape,
} from "@/lib/dummy/settings";

type SearchParams = Promise<{
  q?: string;
  adminId?: string;
  action?: string;
  range?: string;
}>;

function asFilters(p: Awaited<SearchParams>): AuditFilterShape {
  return {
    q: p.q,
    adminId: p.adminId,
    action: p.action,
    range: (p.range as AuditFilterShape["range"]) ?? "all",
  };
}

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const entries = getAuditEntries(filters);
  const stats = getSettingsStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Audit log</h1>
          <p className="text-sm text-muted-foreground">
            {stats.totalEntries} actions logged
            {stats.lastEntryAt
              ? ` · last entry ${formatRelative(stats.lastEntryAt)}`
              : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/settings">← Admin users</Link>
          </Button>
          <Button variant="outline" disabled>
            Export CSV
          </Button>
        </div>
      </header>

      <AuditFilters />

      <DataTable
        columns={auditColumns}
        data={entries}
        emptyMessage="No audit entries match these filters."
      />
    </div>
  );
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

```js
for (const url of ['/settings/audit', '/settings/audit?range=7d', '/settings/audit?adminId=u-001', '/settings/audit?action=Therapist verified']) {
  const r = await fetch('http://localhost:3000' + encodeURI(url));
  console.log(url, r.status);
}
```
Expected: all 200.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/settings/audit-columns.tsx components/settings/audit-filters.tsx "app/(dashboard)/settings/audit/page.tsx" && \
git commit -m "Add A11.3 audit log page"
```

---

## Task SR5: Final smoke + push

**Step 1:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

**Step 2:**

```js
for (const url of [
  '/settings',
  '/settings?role=admin',
  '/settings?status=suspended',
  '/settings/roles',
  '/settings/audit',
  '/settings/audit?range=7d',
  '/settings/audit?adminId=u-001',
]) {
  const r = await fetch('http://localhost:3000' + encodeURI(url));
  console.log(url, r.status);
}
```
Expected: all 200.

**Step 3:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2 && git push
```

---

## Out-of-scope reminders

- Real authentication / RBAC enforcement
- SSO + SCIM
- Cryptographic audit chain
- Webhook export of audit events
- Password reset workflow
- Loading skeletons
- Mobile view
- Dashboard `Recent activity` link target correction (currently `/audit-log` — should be `/settings/audit`)
