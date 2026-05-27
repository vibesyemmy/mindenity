# Admin Clients Module Implementation Plan

> Use superpowers:subagent-driven-development to execute task-by-task.

**Goal:** Ship A4 Clients module (A4.1 list + A4.2 detail) per `docs/superpowers/specs/2026-05-26-admin-clients-module-design.md`.

**Architecture:** 2 routes inside `(dashboard)` group. Reuses TanStack DataTable wrapper + all shadcn components from earlier modules. **No new deps.**

**Verification per task:** `pnpm tsc --noEmit` clean + fetch returns 200 + HTML contains expected anchor text.

---

## File structure

| File | Role |
|---|---|
| `admin/lib/dummy/clients.ts` | Types + dummy data + getters |
| `admin/components/clients/client-list-columns.tsx` | Column defs for A4.1 |
| `admin/components/clients/client-list-filters.tsx` | Filter row |
| `admin/components/clients/client-detail.tsx` | A4.2 composition |
| `admin/components/clients/refund-dialog.tsx` | Refund dialog (own file due to form state) |
| `admin/app/(dashboard)/clients/page.tsx` | A4.1 entry |
| `admin/app/(dashboard)/clients/[id]/page.tsx` | A4.2 entry |

---

## Task C1: Dummy client data + types

**File:** `admin/lib/dummy/clients.ts`

```ts
// Shared types + dummy data for admin clients module.

export type Region = "NG" | "Int'l";
export type Currency = "NGN" | "USD";
export type ClientStatus = "Active" | "Past-due" | "Cancelled" | "Lapsed";
export type PaymentStatus = "Succeeded" | "Refunded" | "Failed" | "Pending";
export type PaymentMethod = "Paystack" | "Stripe";
export type RiskLevel = "green" | "orange" | "red";

export type Plan = {
  name: string; // "Balance", "Essential", etc.
  type: "Subscription" | "PAYG";
  sessionsPerMonth: number; // 0 for PAYG-as-needed
};

export type SessionRecord = {
  id: string;
  date: string; // ISO
  therapist: string;
  durationMin: number;
  riskLevel: RiskLevel;
  format: "Video" | "Voice" | "Chat";
};

export type PaymentRecord = {
  id: string;
  date: string; // ISO
  description: string;
  amount: number; // minor units (kobo / cents)
  currency: Currency;
  method: PaymentMethod;
  last4: string;
  status: PaymentStatus;
  eligibleForRefund: boolean;
};

export type PlanHistoryEntry = {
  id: string;
  date: string;
  from: string | null;
  to: string;
  reason: "Signup" | "Upgrade" | "Downgrade" | "Cancellation" | "Reactivation";
};

export type RiskEvent = {
  id: string;
  date: string;
  therapist: string;
  level: RiskLevel;
  note: string;
};

export type Client = {
  id: string;
  alias: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  region: Region;
  country: string;
  timezone: string;
  joinedAt: string;
  status: ClientStatus;
  plan: Plan;
  sessionsUsedThisCycle: number;
  cycleResetsOn: string | null; // null for PAYG
  currentTherapist: string | null;
  lifetimeSessions: number;
  lifetimeSpend: { amount: number; currency: Currency };
  lastSessionAgo: string | null;
  lastPaymentAgo: string;
  careSummary: string;
  riskLevel: RiskLevel;
  sessions: SessionRecord[];
  payments: PaymentRecord[];
  planHistory: PlanHistoryEntry[];
  riskEvents: RiskEvent[];
};

export type ClientFilters = {
  q?: string;
  region?: "all" | "ng" | "intl";
  plan?: string; // "all" or plan name lowercase
  status?: "all" | "active" | "past-due" | "cancelled" | "lapsed";
};

const PLANS: Record<string, Plan> = {
  Essential: { name: "Essential", type: "PAYG", sessionsPerMonth: 0 },
  Balance: { name: "Balance", type: "Subscription", sessionsPerMonth: 4 },
  Thrive: { name: "Thrive", type: "Subscription", sessionsPerMonth: 8 },
  Together: { name: "Together", type: "PAYG", sessionsPerMonth: 0 },
  Harmony: { name: "Harmony", type: "Subscription", sessionsPerMonth: 4 },
  Restore: { name: "Restore", type: "Subscription", sessionsPerMonth: 8 },
  Home: { name: "Home", type: "PAYG", sessionsPerMonth: 0 },
  "Family Care": { name: "Family Care", type: "Subscription", sessionsPerMonth: 4 },
  "Family Thrive": { name: "Family Thrive", type: "Subscription", sessionsPerMonth: 8 },
};

const CLIENTS: Client[] = [
  {
    id: "c-001",
    alias: "Client-9128",
    name: "Ada Okeke",
    initials: "AO",
    email: "ada.okeke@example.com",
    phone: "+234 802 555 0144",
    region: "NG",
    country: "Nigeria",
    timezone: "Africa/Lagos",
    joinedAt: "2025-02-12",
    status: "Active",
    plan: PLANS.Balance,
    sessionsUsedThisCycle: 2,
    cycleResetsOn: "2026-06-12",
    currentTherapist: "Dr. Tola Adesina",
    lifetimeSessions: 28,
    lifetimeSpend: { amount: 1_120_000, currency: "NGN" },
    lastSessionAgo: "2d ago",
    lastPaymentAgo: "14d ago",
    careSummary: "Workplace anxiety + sleep regulation. CBT-focused.",
    riskLevel: "green",
    sessions: [
      { id: "s-001-1", date: "2026-05-24T10:00:00Z", therapist: "Dr. Tola Adesina", durationMin: 50, riskLevel: "green", format: "Video" },
      { id: "s-001-2", date: "2026-05-17T10:00:00Z", therapist: "Dr. Tola Adesina", durationMin: 50, riskLevel: "green", format: "Video" },
      { id: "s-001-3", date: "2026-05-10T10:00:00Z", therapist: "Dr. Tola Adesina", durationMin: 50, riskLevel: "orange", format: "Video" },
    ],
    payments: [
      { id: "p-001-1", date: "2026-05-12T08:30:00Z", description: "Balance plan · monthly", amount: 40_000_00, currency: "NGN", method: "Paystack", last4: "4242", status: "Succeeded", eligibleForRefund: true },
      { id: "p-001-2", date: "2026-04-12T08:30:00Z", description: "Balance plan · monthly", amount: 40_000_00, currency: "NGN", method: "Paystack", last4: "4242", status: "Succeeded", eligibleForRefund: true },
      { id: "p-001-3", date: "2026-03-12T08:30:00Z", description: "Balance plan · monthly", amount: 40_000_00, currency: "NGN", method: "Paystack", last4: "4242", status: "Succeeded", eligibleForRefund: false },
    ],
    planHistory: [
      { id: "ph-001-1", date: "2026-03-12", from: "Essential", to: "Balance", reason: "Upgrade" },
      { id: "ph-001-2", date: "2025-02-12", from: null, to: "Essential", reason: "Signup" },
    ],
    riskEvents: [
      { id: "re-001-1", date: "2026-05-10", therapist: "Dr. Tola Adesina", level: "orange", note: "Reported elevated work stress; agreed weekly check-ins for 1 month." },
    ],
  },
  {
    id: "c-002",
    alias: "Client-8842",
    name: "James Carter",
    initials: "JC",
    email: "james.c@example.com",
    phone: "+44 7700 555 0119",
    region: "Int'l",
    country: "United Kingdom",
    timezone: "Europe/London",
    joinedAt: "2024-11-08",
    status: "Active",
    plan: PLANS.Restore,
    sessionsUsedThisCycle: 5,
    cycleResetsOn: "2026-06-08",
    currentTherapist: "Dr. Marcus Quinn",
    lifetimeSessions: 64,
    lifetimeSpend: { amount: 8_640_00, currency: "USD" },
    lastSessionAgo: "1d ago",
    lastPaymentAgo: "18d ago",
    careSummary: "Trauma recovery (CPTSD). EMDR-based. Active engagement.",
    riskLevel: "red",
    sessions: [
      { id: "s-002-1", date: "2026-05-25T14:00:00Z", therapist: "Dr. Marcus Quinn", durationMin: 50, riskLevel: "red", format: "Video" },
      { id: "s-002-2", date: "2026-05-18T14:00:00Z", therapist: "Dr. Marcus Quinn", durationMin: 50, riskLevel: "orange", format: "Video" },
      { id: "s-002-3", date: "2026-05-11T14:00:00Z", therapist: "Dr. Marcus Quinn", durationMin: 50, riskLevel: "orange", format: "Video" },
    ],
    payments: [
      { id: "p-002-1", date: "2026-05-08T08:30:00Z", description: "Restore plan · monthly", amount: 480_00, currency: "USD", method: "Stripe", last4: "9876", status: "Succeeded", eligibleForRefund: true },
      { id: "p-002-2", date: "2026-04-08T08:30:00Z", description: "Restore plan · monthly", amount: 480_00, currency: "USD", method: "Stripe", last4: "9876", status: "Succeeded", eligibleForRefund: true },
    ],
    planHistory: [
      { id: "ph-002-1", date: "2025-03-08", from: "Harmony", to: "Restore", reason: "Upgrade" },
      { id: "ph-002-2", date: "2024-11-08", from: null, to: "Harmony", reason: "Signup" },
    ],
    riskEvents: [
      { id: "re-002-1", date: "2026-05-25", therapist: "Dr. Marcus Quinn", level: "red", note: "Crisis escalation triggered Crisis Support; therapist responded within 4m, follow-up scheduled in 24h." },
      { id: "re-002-2", date: "2026-04-18", therapist: "Dr. Marcus Quinn", level: "orange", note: "Trauma flashbacks intensified; agreed double-session frequency for 2 weeks." },
    ],
  },
  {
    id: "c-003",
    alias: "Client-7710",
    name: "Funmi Adebayo",
    initials: "FA",
    email: "funmi.a@example.com",
    phone: "+234 803 555 0188",
    region: "NG",
    country: "Nigeria",
    timezone: "Africa/Lagos",
    joinedAt: "2025-08-20",
    status: "Active",
    plan: PLANS.Essential,
    sessionsUsedThisCycle: 4,
    cycleResetsOn: null,
    currentTherapist: "Dr. Aisha Bello",
    lifetimeSessions: 4,
    lifetimeSpend: { amount: 80_000_00, currency: "NGN" },
    lastSessionAgo: "5d ago",
    lastPaymentAgo: "5d ago",
    careSummary: "First-time client; exploring therapy options. Currently PAYG.",
    riskLevel: "green",
    sessions: [
      { id: "s-003-1", date: "2026-05-21T11:00:00Z", therapist: "Dr. Aisha Bello", durationMin: 50, riskLevel: "green", format: "Voice" },
      { id: "s-003-2", date: "2026-05-14T11:00:00Z", therapist: "Dr. Aisha Bello", durationMin: 50, riskLevel: "green", format: "Voice" },
    ],
    payments: [
      { id: "p-003-1", date: "2026-05-21T11:00:00Z", description: "Essential · single session", amount: 20_000_00, currency: "NGN", method: "Paystack", last4: "0021", status: "Succeeded", eligibleForRefund: true },
      { id: "p-003-2", date: "2026-05-14T11:00:00Z", description: "Essential · single session", amount: 20_000_00, currency: "NGN", method: "Paystack", last4: "0021", status: "Succeeded", eligibleForRefund: true },
    ],
    planHistory: [
      { id: "ph-003-1", date: "2025-08-20", from: null, to: "Essential", reason: "Signup" },
    ],
    riskEvents: [],
  },
  {
    id: "c-004",
    alias: "Client-6451",
    name: "Marina Costa",
    initials: "MC",
    email: "marina.c@example.com",
    phone: "+34 612 555 0188",
    region: "Int'l",
    country: "Spain",
    timezone: "Europe/Madrid",
    joinedAt: "2025-04-02",
    status: "Past-due",
    plan: PLANS.Together,
    sessionsUsedThisCycle: 0,
    cycleResetsOn: null,
    currentTherapist: "Dr. Lina Park",
    lifetimeSessions: 18,
    lifetimeSpend: { amount: 1_620_00, currency: "USD" },
    lastSessionAgo: "21d ago",
    lastPaymentAgo: "Payment failed 4d ago",
    careSummary: "Couples therapy (cross-cultural). Partner attendance variable.",
    riskLevel: "green",
    sessions: [
      { id: "s-004-1", date: "2026-05-05T15:00:00Z", therapist: "Dr. Lina Park", durationMin: 50, riskLevel: "green", format: "Video" },
    ],
    payments: [
      { id: "p-004-1", date: "2026-05-22T08:30:00Z", description: "Together · session", amount: 90_00, currency: "USD", method: "Stripe", last4: "1110", status: "Failed", eligibleForRefund: false },
      { id: "p-004-2", date: "2026-05-05T15:00:00Z", description: "Together · session", amount: 90_00, currency: "USD", method: "Stripe", last4: "1110", status: "Succeeded", eligibleForRefund: true },
    ],
    planHistory: [
      { id: "ph-004-1", date: "2025-04-02", from: null, to: "Together", reason: "Signup" },
    ],
    riskEvents: [],
  },
  {
    id: "c-005",
    alias: "Client-5527",
    name: "Tomi & Femi Eze",
    initials: "TE",
    email: "tomi.eze@example.com",
    phone: "+234 802 555 0233",
    region: "NG",
    country: "Nigeria",
    timezone: "Africa/Lagos",
    joinedAt: "2025-01-04",
    status: "Active",
    plan: PLANS.Harmony,
    sessionsUsedThisCycle: 3,
    cycleResetsOn: "2026-06-04",
    currentTherapist: "Dr. Tola Adesina",
    lifetimeSessions: 36,
    lifetimeSpend: { amount: 3_960_000, currency: "NGN" },
    lastSessionAgo: "3d ago",
    lastPaymentAgo: "22d ago",
    careSummary: "Couples therapy. Strong engagement; communication-focused work.",
    riskLevel: "green",
    sessions: [
      { id: "s-005-1", date: "2026-05-23T16:00:00Z", therapist: "Dr. Tola Adesina", durationMin: 50, riskLevel: "green", format: "Video" },
      { id: "s-005-2", date: "2026-05-16T16:00:00Z", therapist: "Dr. Tola Adesina", durationMin: 50, riskLevel: "green", format: "Video" },
    ],
    payments: [
      { id: "p-005-1", date: "2026-05-04T08:30:00Z", description: "Harmony plan · monthly", amount: 220_000_00, currency: "NGN", method: "Paystack", last4: "8881", status: "Succeeded", eligibleForRefund: true },
    ],
    planHistory: [
      { id: "ph-005-1", date: "2025-01-04", from: null, to: "Harmony", reason: "Signup" },
    ],
    riskEvents: [],
  },
  {
    id: "c-006",
    alias: "Client-4318",
    name: "Sofia Müller",
    initials: "SM",
    email: "sofia.m@example.com",
    phone: "+49 170 555 0144",
    region: "Int'l",
    country: "Germany",
    timezone: "Europe/Berlin",
    joinedAt: "2024-07-15",
    status: "Cancelled",
    plan: PLANS.Thrive,
    sessionsUsedThisCycle: 0,
    cycleResetsOn: null,
    currentTherapist: null,
    lifetimeSessions: 96,
    lifetimeSpend: { amount: 7_680_00, currency: "USD" },
    lastSessionAgo: "62d ago",
    lastPaymentAgo: "62d ago",
    careSummary: "Long-term anxiety + workplace burnout. Cancelled plan after recovery milestone.",
    riskLevel: "green",
    sessions: [],
    payments: [
      { id: "p-006-1", date: "2026-03-25T08:30:00Z", description: "Thrive plan · monthly", amount: 320_00, currency: "USD", method: "Stripe", last4: "3344", status: "Succeeded", eligibleForRefund: false },
    ],
    planHistory: [
      { id: "ph-006-1", date: "2026-03-25", from: "Thrive", to: "Cancelled", reason: "Cancellation" },
      { id: "ph-006-2", date: "2024-07-15", from: null, to: "Thrive", reason: "Signup" },
    ],
    riskEvents: [],
  },
  {
    id: "c-007",
    alias: "Client-3902",
    name: "Tunde Okafor",
    initials: "TO",
    email: "tunde.o@example.com",
    phone: "+234 803 555 0299",
    region: "NG",
    country: "Nigeria",
    timezone: "Africa/Lagos",
    joinedAt: "2024-09-30",
    status: "Lapsed",
    plan: PLANS.Home,
    sessionsUsedThisCycle: 0,
    cycleResetsOn: null,
    currentTherapist: null,
    lifetimeSessions: 6,
    lifetimeSpend: { amount: 600_000_00, currency: "NGN" },
    lastSessionAgo: "94d ago",
    lastPaymentAgo: "94d ago",
    careSummary: "Family therapy. PAYG; no session booked in 3 months.",
    riskLevel: "green",
    sessions: [],
    payments: [
      { id: "p-007-1", date: "2026-02-21T11:00:00Z", description: "Home · session", amount: 100_000_00, currency: "NGN", method: "Paystack", last4: "5552", status: "Succeeded", eligibleForRefund: false },
    ],
    planHistory: [
      { id: "ph-007-1", date: "2024-09-30", from: null, to: "Home", reason: "Signup" },
    ],
    riskEvents: [],
  },
  {
    id: "c-008",
    alias: "Client-2218",
    name: "The Smith Family",
    initials: "SF",
    email: "primary@smithfamily.example.com",
    phone: "+1 415 555 0177",
    region: "Int'l",
    country: "United States",
    timezone: "America/Los_Angeles",
    joinedAt: "2025-06-18",
    status: "Active",
    plan: PLANS["Family Thrive"],
    sessionsUsedThisCycle: 6,
    cycleResetsOn: "2026-06-18",
    currentTherapist: "Dr. Priya Shah",
    lifetimeSessions: 52,
    lifetimeSpend: { amount: 4_800_00, currency: "USD" },
    lastSessionAgo: "1d ago",
    lastPaymentAgo: "9d ago",
    careSummary: "Family unit (4 members) working through grief after recent loss.",
    riskLevel: "orange",
    sessions: [
      { id: "s-008-1", date: "2026-05-25T17:00:00Z", therapist: "Dr. Priya Shah", durationMin: 90, riskLevel: "orange", format: "Video" },
    ],
    payments: [
      { id: "p-008-1", date: "2026-05-17T08:30:00Z", description: "Family Thrive · monthly", amount: 800_00, currency: "USD", method: "Stripe", last4: "7710", status: "Succeeded", eligibleForRefund: true },
    ],
    planHistory: [
      { id: "ph-008-1", date: "2025-06-18", from: null, to: "Family Thrive", reason: "Signup" },
    ],
    riskEvents: [
      { id: "re-008-1", date: "2026-05-25", therapist: "Dr. Priya Shah", level: "orange", note: "Eldest child showing signs of complicated grief; individual sessions recommended in parallel." },
    ],
  },
];

function matchesQuery(haystack: string, q?: string) {
  if (!q) return true;
  return haystack.toLowerCase().includes(q.toLowerCase());
}

export function getClients(filters: ClientFilters = {}): Client[] {
  return CLIENTS.filter((c) => {
    if (!matchesQuery(`${c.alias} ${c.name} ${c.email}`, filters.q)) return false;
    if (filters.region && filters.region !== "all") {
      const target = filters.region === "ng" ? "NG" : "Int'l";
      if (c.region !== target) return false;
    }
    if (filters.plan && filters.plan !== "all") {
      if (c.plan.name.toLowerCase() !== filters.plan.toLowerCase()) return false;
    }
    if (filters.status && filters.status !== "all") {
      const map: Record<string, ClientStatus> = {
        active: "Active",
        "past-due": "Past-due",
        cancelled: "Cancelled",
        lapsed: "Lapsed",
      };
      if (c.status !== map[filters.status]) return false;
    }
    return true;
  });
}

export function getClient(id: string): Client | undefined {
  return CLIENTS.find((c) => c.id === id);
}

export function getClientListStats() {
  return {
    activeCount: CLIENTS.filter((c) => c.status === "Active").length,
    pastDueCount: CLIENTS.filter((c) => c.status === "Past-due").length,
    riskWatchCount: CLIENTS.filter((c) => c.riskLevel === "orange" || c.riskLevel === "red").length,
    totalPlans: 9,
  };
}

export const ALL_PLAN_NAMES = Object.keys(PLANS);
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add lib/dummy/clients.ts && \
git commit -m "Add client dummy data + types"
```

---

## Task C2: A4.1 Client list page

**File 1:** `admin/components/clients/client-list-columns.tsx`

```tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import type { Client } from "@/lib/dummy/clients";

const statusVariant: Record<
  Client["status"],
  "secondary" | "destructive" | "outline"
> = {
  Active: "secondary",
  "Past-due": "destructive",
  Cancelled: "outline",
  Lapsed: "outline",
};

function formatMoney(amount: number, currency: "NGN" | "USD"): string {
  if (currency === "NGN") {
    if (amount >= 100_000_00) return `₦${(amount / 100 / 1000).toFixed(0)}k`;
    return `₦${(amount / 100).toLocaleString()}`;
  }
  return `$${(amount / 100).toLocaleString()}`;
}

function sessionsUsedDisplay(c: Client): string {
  if (c.plan.type === "PAYG") return `${c.sessionsUsedThisCycle} done`;
  return `${c.sessionsUsedThisCycle}/${c.plan.sessionsPerMonth}`;
}

export const clientListColumns: ColumnDef<Client>[] = [
  {
    accessorKey: "alias",
    header: "Alias",
    cell: ({ row }) => {
      const c = row.original;
      return (
        <Link
          href={`/clients/${c.id}`}
          className="flex items-center gap-3 hover:underline"
        >
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold"
          >
            {c.initials}
          </span>
          <span className="flex flex-col">
            <span className="font-medium">{c.alias}</span>
            <span className="text-xs text-muted-foreground">{c.name}</span>
          </span>
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal">
        {row.original.region}
      </Badge>
    ),
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-normal">
        {row.original.plan.name}
      </Badge>
    ),
  },
  {
    id: "sessionsUsed",
    header: "Sessions used",
    cell: ({ row }) => (
      <span className="tabular-nums text-sm">{sessionsUsedDisplay(row.original)}</span>
    ),
  },
  {
    accessorKey: "lastSessionAgo",
    header: "Last session",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground tabular-nums">
        {row.original.lastSessionAgo ?? "—"}
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
    id: "open",
    header: "",
    cell: ({ row }) => (
      <Link
        href={`/clients/${row.original.id}`}
        aria-label={`Open ${row.original.alias}`}
      >
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    ),
  },
];

export { formatMoney };
```

**File 2:** `admin/components/clients/client-list-filters.tsx`

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

import { ALL_PLAN_NAMES } from "@/lib/dummy/clients";

export function ClientListFilters() {
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
        placeholder="Search by alias, name, email…"
        defaultValue={params.get("q") ?? ""}
        onChange={(e) => setParam("q", e.target.value)}
        className="w-[280px]"
      />

      <Select
        value={params.get("region") ?? "all"}
        onValueChange={(v) => setParam("region", v)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All regions</SelectItem>
          <SelectItem value="ng">Nigeria</SelectItem>
          <SelectItem value="intl">International</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={params.get("plan") ?? "all"}
        onValueChange={(v) => setParam("plan", v)}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All plans</SelectItem>
          {ALL_PLAN_NAMES.map((p) => (
            <SelectItem key={p} value={p.toLowerCase()}>
              {p}
            </SelectItem>
          ))}
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
          <SelectItem value="past-due">Past-due</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
          <SelectItem value="lapsed">Lapsed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

**File 3:** `admin/app/(dashboard)/clients/page.tsx`

```tsx
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/therapists/data-table";

import { clientListColumns } from "@/components/clients/client-list-columns";
import { ClientListFilters } from "@/components/clients/client-list-filters";

import {
  getClients,
  getClientListStats,
  type ClientFilters,
} from "@/lib/dummy/clients";

type SearchParams = Promise<{
  q?: string;
  region?: string;
  plan?: string;
  status?: string;
}>;

function asClientFilters(p: Awaited<SearchParams>): ClientFilters {
  return {
    q: p.q,
    region: p.region as ClientFilters["region"],
    plan: p.plan,
    status: p.status as ClientFilters["status"],
  };
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asClientFilters(params);
  const clients = getClients(filters);
  const stats = getClientListStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground">
            {stats.activeCount} active across {stats.totalPlans} plans ·{" "}
            {stats.pastDueCount} past-due · {stats.riskWatchCount} on risk watch
          </p>
        </div>
        <Button variant="outline" disabled>
          Export CSV
        </Button>
      </header>

      <ClientListFilters />

      <DataTable
        columns={clientListColumns}
        data={clients}
        emptyMessage="No clients match these filters."
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
for (const url of ['/clients', '/clients?region=ng', '/clients?status=past-due', '/clients?plan=balance']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: all 200.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/clients/client-list-columns.tsx components/clients/client-list-filters.tsx "app/(dashboard)/clients/page.tsx" && \
git commit -m "Add A4.1 client list page"
```

---

## Task C3: A4.2 Client detail + refund/pause/suspend dialogs

**File 1:** `admin/components/clients/refund-dialog.tsx`

```tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import type { Client, PaymentRecord } from "@/lib/dummy/clients";
import { formatMoney } from "@/components/clients/client-list-columns";

type Props = {
  client: Client;
  payment: PaymentRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RefundDialog({ client, payment, open, onOpenChange }: Props) {
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  if (!payment) return null;

  const fullAmount = (payment.amount / 100).toFixed(2);
  const handleSubmit = () => {
    const parsed = refundType === "full" ? Number(fullAmount) : Number(amount);
    if (refundType === "partial" && (!parsed || parsed <= 0 || parsed > Number(fullAmount))) {
      toast.error(`Enter a partial amount between 0 and ${fullAmount}.`);
      return;
    }
    if (reason.trim().length < 5) {
      toast.error("Add a refund reason of at least 5 characters.");
      return;
    }
    toast.success(`Refund issued for ${client.alias}`, {
      description: `${refundType === "full" ? "Full" : "Partial"} refund of ${payment.currency} ${parsed.toFixed(2)} queued via ${payment.method}.`,
    });
    onOpenChange(false);
    setRefundType("full");
    setAmount("");
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refund payment</DialogTitle>
          <DialogDescription>
            Issue a refund for {client.alias}. Funds return via the original
            payment method.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-sm">
            <p className="font-medium">{payment.description}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(payment.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              · {formatMoney(payment.amount, payment.currency)} ·{" "}
              {payment.method} · •••• {payment.last4}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Refund type</Label>
            <RadioGroup
              value={refundType}
              onValueChange={(v) => setRefundType(v as "full" | "partial")}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="full" id="r-full" />
                <Label htmlFor="r-full" className="font-normal">
                  Full ({payment.currency} {fullAmount})
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="partial" id="r-partial" />
                <Label htmlFor="r-partial" className="font-normal">
                  Partial
                </Label>
              </div>
            </RadioGroup>
          </div>

          {refundType === "partial" && (
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ({payment.currency})</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={fullAmount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Up to ${fullAmount}`}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.g. Session canceled by therapist; client requested refund."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Issue refund</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**File 2:** `admin/components/clients/client-detail.tsx`

```tsx
"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RefundDialog } from "@/components/clients/refund-dialog";
import { formatMoney } from "@/components/clients/client-list-columns";

import type { Client, PaymentRecord } from "@/lib/dummy/clients";

const statusVariant: Record<
  Client["status"],
  "secondary" | "destructive" | "outline"
> = {
  Active: "secondary",
  "Past-due": "destructive",
  Cancelled: "outline",
  Lapsed: "outline",
};

const paymentStatusVariant: Record<
  PaymentRecord["status"],
  "secondary" | "destructive" | "outline"
> = {
  Succeeded: "secondary",
  Refunded: "outline",
  Failed: "destructive",
  Pending: "outline",
};

const riskVariant: Record<Client["riskLevel"], "secondary" | "outline" | "destructive"> = {
  green: "secondary",
  orange: "outline",
  red: "destructive",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type Props = {
  client: Client;
};

export function ClientDetail({ client: c }: Props) {
  const [pauseOpen, setPauseOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [refundPayment, setRefundPayment] = useState<PaymentRecord | null>(null);

  const handlePause = () => {
    toast.success(`Plan paused for ${c.alias}`, {
      description: "Billing will pause from the next cycle.",
    });
    setPauseOpen(false);
  };

  const handleSuspend = () => {
    if (suspendReason.trim().length < 5) {
      toast.error("Add a suspension reason of at least 5 characters.");
      return;
    }
    toast.success(`${c.alias} suspended`, {
      description: "Client login revoked; active bookings auto-canceled.",
    });
    setSuspendOpen(false);
    setSuspendReason("");
  };

  return (
    <div className="space-y-6">
      <Link
        href="/clients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Clients
      </Link>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-muted text-base font-semibold"
          >
            {c.initials}
          </span>
          <div className="space-y-1.5">
            <h1 className="font-heading text-3xl tracking-tight">{c.alias}</h1>
            <p className="text-sm text-muted-foreground">{c.name}</p>
            <div className="flex flex-wrap items-center gap-2 text-sm pt-1">
              <Badge variant="outline" className="font-normal">
                {c.region} · {c.country}
              </Badge>
              <Badge variant="secondary">{c.plan.name}</Badge>
              <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
              <Badge variant={riskVariant[c.riskLevel]} className="font-normal">
                Risk: {c.riskLevel}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPauseOpen(true)}
            disabled={c.status !== "Active"}
          >
            Pause plan
          </Button>
          <Button
            variant="destructive"
            onClick={() => setSuspendOpen(true)}
            disabled={c.status === "Cancelled"}
          >
            Suspend account
          </Button>
        </div>
      </header>

      <section
        aria-label="Stats"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {[
          { label: "Lifetime sessions", value: c.lifetimeSessions.toLocaleString() },
          { label: "Member since", value: formatDate(c.joinedAt) },
          { label: "Last payment", value: c.lastPaymentAgo },
          {
            label: "Lifetime spend",
            value: formatMoney(c.lifetimeSpend.amount, c.lifetimeSpend.currency),
          },
        ].map((s) => (
          <Card key={s.label} className="gap-1 py-4">
            <CardHeader className="p-0 px-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {s.label}
              </p>
            </CardHeader>
            <CardContent className="px-5">
              <p className="font-heading text-xl tabular-nums">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="planHistory">Plan history</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="risk">Risk events</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Care summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>{c.careSummary}</p>
                <div className="pt-2 space-y-1.5">
                  <p>
                    <span className="text-muted-foreground">Plan:</span>{" "}
                    <span className="font-medium">{c.plan.name}</span>{" "}
                    <span className="text-muted-foreground">({c.plan.type})</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Current therapist:</span>{" "}
                    {c.currentTherapist ?? "Not assigned"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Sessions this cycle:</span>{" "}
                    {c.plan.type === "PAYG"
                      ? `${c.sessionsUsedThisCycle} (PAYG)`
                      : `${c.sessionsUsedThisCycle}/${c.plan.sessionsPerMonth}`}
                  </p>
                  {c.cycleResetsOn && (
                    <p>
                      <span className="text-muted-foreground">Cycle resets:</span>{" "}
                      {formatDate(c.cycleResetsOn)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 text-sm">
                <p>
                  <span className="text-muted-foreground">Email:</span> {c.email}
                </p>
                <p>
                  <span className="text-muted-foreground">Phone:</span> {c.phone}
                </p>
                <p>
                  <span className="text-muted-foreground">Region:</span> {c.region}
                </p>
                <p>
                  <span className="text-muted-foreground">Timezone:</span>{" "}
                  {c.timezone}
                </p>
                <p>
                  <span className="text-muted-foreground">Joined:</span>{" "}
                  {formatDate(c.joinedAt)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Latest activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Recent sessions
                </p>
                {c.sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No sessions yet.</p>
                ) : (
                  <ul className="space-y-1.5 text-sm">
                    {c.sessions.slice(0, 3).map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center justify-between"
                      >
                        <span>
                          {formatDate(s.date)} ·{" "}
                          <span className="text-muted-foreground">
                            {s.therapist}
                          </span>
                        </span>
                        <Badge
                          variant={riskVariant[s.riskLevel]}
                          className="font-normal"
                        >
                          {s.riskLevel}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Recent payments
                </p>
                {c.payments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No payments yet.</p>
                ) : (
                  <ul className="space-y-1.5 text-sm">
                    {c.payments.slice(0, 3).map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between"
                      >
                        <span>
                          {formatDate(p.date)} ·{" "}
                          <span className="text-muted-foreground">
                            {p.description}
                          </span>
                        </span>
                        <span className="tabular-nums">
                          {formatMoney(p.amount, p.currency)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payments</CardTitle>
              <span className="text-xs text-muted-foreground">
                {c.payments.length} transaction{c.payments.length === 1 ? "" : "s"}
              </span>
            </CardHeader>
            <CardContent>
              {c.payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payments on record.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {c.payments.map((p) => {
                      const canRefund =
                        p.status === "Succeeded" && p.eligibleForRefund;
                      return (
                        <TableRow key={p.id}>
                          <TableCell className="tabular-nums">
                            {formatDate(p.date)}
                          </TableCell>
                          <TableCell>{p.description}</TableCell>
                          <TableCell className="tabular-nums">
                            {formatMoney(p.amount, p.currency)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {p.method} · •••• {p.last4}
                          </TableCell>
                          <TableCell>
                            <Badge variant={paymentStatusVariant[p.status]}>
                              {p.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={!canRefund}
                              onClick={() => setRefundPayment(p)}
                            >
                              <RotateCcw className="size-3.5 mr-1" />
                              Refund
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {(["planHistory", "sessions", "risk", "notes"] as const).map((key) => (
          <TabsContent key={key} value={key} className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">
                  {key === "planHistory"
                    ? "Plan history"
                    : key === "risk"
                      ? "Risk events"
                      : key}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Full {key === "planHistory" ? "plan history" : key === "risk" ? "risk events" : key}{" "}
                  view not built in this prototype. Wire when the parent module
                  lands.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={pauseOpen} onOpenChange={setPauseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pause {c.alias}&apos;s plan?</DialogTitle>
            <DialogDescription>
              Billing will pause from the next cycle. Existing booked sessions
              continue until the plan ends. Client can reactivate from their
              Settings at any time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPauseOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePause}>Pause plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend {c.alias}?</DialogTitle>
            <DialogDescription>
              Client will lose login access immediately. Active bookings are
              auto-canceled and refunded per plan terms. This action is
              reversible by a super-admin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="suspend-reason">Reason (required)</Label>
            <Textarea
              id="suspend-reason"
              rows={3}
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="E.g. Repeated terms of service violations after warning on 2026-05-12."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSuspend}>
              Suspend account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RefundDialog
        client={c}
        payment={refundPayment}
        open={refundPayment !== null}
        onOpenChange={(open) => {
          if (!open) setRefundPayment(null);
        }}
      />
    </div>
  );
}
```

**File 3:** `admin/app/(dashboard)/clients/[id]/page.tsx`

```tsx
import { notFound } from "next/navigation";

import { ClientDetail } from "@/components/clients/client-detail";
import { getClient } from "@/lib/dummy/clients";

type Params = Promise<{ id: string }>;

export default async function ClientDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const client = getClient(id);
  if (!client) notFound();

  return <ClientDetail client={client} />;
}
```

**Step 1 — Install missing shadcn `radio-group`**

Refund dialog uses `radio-group` which isn't installed yet. Add it:

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
pnpm dlx shadcn@latest add radio-group -y
```

**Step 2 — Verify + commit**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

```js
for (const url of ['/clients/c-001', '/clients/c-002', '/clients/c-006', '/clients/does-not-exist']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: c-001, c-002, c-006 → 200; does-not-exist → 404.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/ui/radio-group.tsx components/clients/refund-dialog.tsx components/clients/client-detail.tsx "app/(dashboard)/clients/[id]/page.tsx" package.json pnpm-lock.yaml && \
git commit -m "Add A4.2 client detail page with refund + pause + suspend dialogs"
```

---

## Task C4: Final smoke + push

**Step 1 — tsc clean**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

**Step 2 — Hit every client route**

```js
for (const url of [
  '/clients',
  '/clients?region=ng',
  '/clients?status=past-due',
  '/clients?plan=balance',
  '/clients?q=client-91',
  '/clients/c-001',
  '/clients/c-002',
  '/clients/c-006',
  '/clients/does-not-exist',
]) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: all 200 except `does-not-exist` → 404.

**Step 3 — Push**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2 && git push
```

---

## Out-of-scope reminders

- Real refund SDK wiring (Paystack/Stripe)
- Real loading skeletons
- Mobile card-list view
- Full content for Plan history / Sessions / Risk events / Notes tabs
- Bulk operations
- Region-aware currency helper extraction (defer until 3rd consumer)
