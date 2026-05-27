# Admin Custom Pricing Approvals Module Implementation Plan

> Use superpowers:subagent-driven-development to execute task-by-task.

**Goal:** Ship A8 module (queue + review) per `docs/superpowers/specs/2026-05-27-admin-pricing-approvals-module-design.md`.

**Architecture:** 2 routes inside `(dashboard)` group. Reuses every component from earlier modules. **No new deps.**

**Verification per task:** `pnpm tsc --noEmit` clean + fetch returns expected status + HTML contains expected anchor text.

---

## File structure

| File | Role |
|---|---|
| `admin/lib/dummy/pricing-approvals.ts` | Types + dummy data + getters/stats |
| `admin/components/pricing-approvals/queue-columns.tsx` | A8.1 columns |
| `admin/components/pricing-approvals/queue-filters.tsx` | A8.1 filters + status tabs |
| `admin/app/(dashboard)/pricing-approvals/page.tsx` | A8.1 entry |
| `admin/components/pricing-approvals/action-dialogs.tsx` | 3 action dialogs |
| `admin/components/pricing-approvals/approval-review.tsx` | A8.2 composition |
| `admin/app/(dashboard)/pricing-approvals/[id]/page.tsx` | A8.2 entry |

---

## Task PA1: Dummy approval data + types

**File:** `admin/lib/dummy/pricing-approvals.ts`

```ts
// Shared types + dummy data for admin custom pricing approvals module.
// Cross-references existing therapist + plan IDs.

import { ALL_PLAN_NAMES_ORDERED, getPricingByRegion } from "@/lib/dummy/plans";

export type Region = "NG" | "Int'l";
export type Currency = "NGN" | "USD";
export type ApprovalStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Countered";

export type PricingRequest = {
  id: string;
  submittedAt: string; // ISO
  therapistId: string;
  therapistName: string;
  therapistTier: "Standard" | "Senior" | "Clinical";
  planName: string;
  planSegment: "Individual" | "Couple" | "Family";
  region: Region;
  currency: Currency;
  proposedPrice: number; // minor units
  basePrice: number; // minor units (snapshot at request time)
  minBand: number; // minor units
  maxBand: number; // minor units
  reasoning: string;
  status: ApprovalStatus;
  decidedAt?: string; // ISO
  decidedBy?: string;
  decisionNote?: string;
  counterPrice?: number; // for Countered status
};

export type ApprovalFilters = {
  status?: "pending" | "approved" | "rejected" | "countered" | "all";
  region?: "all" | "ng" | "intl";
  plan?: string; // plan name lowercase
};

const REQUESTS: PricingRequest[] = [
  {
    id: "ar-001",
    submittedAt: "2026-05-23T08:00:00Z",
    therapistId: "t-001",
    therapistName: "Dr. Tola Adesina",
    therapistTier: "Senior",
    planName: "Restore",
    planSegment: "Couple",
    region: "NG",
    currency: "NGN",
    proposedPrice: 650_000_00,
    basePrice: 480_000_00,
    minBand: 420_000_00,
    maxBand: 520_000_00,
    reasoning:
      "12 years of practice, EFT Level 2 certified. Requesting +25% over max band for clinical complexity of long-term couples work.",
    status: "Pending",
  },
  {
    id: "ar-002",
    submittedAt: "2026-05-26T11:00:00Z",
    therapistId: "t-003",
    therapistName: "Dr. Lina Park",
    therapistTier: "Senior",
    planName: "Harmony",
    planSegment: "Couple",
    region: "Int'l",
    currency: "USD",
    proposedPrice: 360_00,
    basePrice: 320_00,
    minBand: 280_00,
    maxBand: 380_00,
    reasoning:
      "Cross-cultural specialisation premium. Within max band, requesting slight bump over base.",
    status: "Pending",
  },
  {
    id: "ar-003",
    submittedAt: "2026-05-26T15:30:00Z",
    therapistId: "t-002",
    therapistName: "Dr. Marcus Quinn",
    therapistTier: "Clinical",
    planName: "Family Thrive",
    planSegment: "Family",
    region: "Int'l",
    currency: "USD",
    proposedPrice: 1_100_00,
    basePrice: 800_00,
    minBand: 720_00,
    maxBand: 960_00,
    reasoning:
      "18 years clinical experience, complex CPTSD family caseload. Above-band rate reflects scarcity of qualified family trauma therapists.",
    status: "Pending",
  },
  {
    id: "ar-004",
    submittedAt: "2026-05-20T14:00:00Z",
    therapistId: "t-004",
    therapistName: "Dr. Aisha Bello",
    therapistTier: "Standard",
    planName: "Essential",
    planSegment: "Individual",
    region: "NG",
    currency: "NGN",
    proposedPrice: 22_000_00,
    basePrice: 20_000_00,
    minBand: 15_000_00,
    maxBand: 30_000_00,
    reasoning: "Standard rate adjustment within band.",
    status: "Approved",
    decidedAt: "2026-05-21T09:30:00Z",
    decidedBy: "Adaeze Nwosu",
    decisionNote: "Within band, approved immediately.",
  },
  {
    id: "ar-005",
    submittedAt: "2026-05-18T10:00:00Z",
    therapistId: "t-001",
    therapistName: "Dr. Tola Adesina",
    therapistTier: "Senior",
    planName: "Harmony",
    planSegment: "Couple",
    region: "NG",
    currency: "NGN",
    proposedPrice: 250_000_00,
    basePrice: 220_000_00,
    minBand: 180_000_00,
    maxBand: 240_000_00,
    reasoning: "Adjusting for inflation; previous rate unchanged for 18 months.",
    status: "Countered",
    decidedAt: "2026-05-19T11:15:00Z",
    decidedBy: "Adaeze Nwosu",
    decisionNote:
      "Counter at ₦240,000 — top of band. Acknowledge inflation but want to keep within current band until next quarter's band review.",
    counterPrice: 240_000_00,
  },
  {
    id: "ar-006",
    submittedAt: "2026-05-15T09:00:00Z",
    therapistId: "t-006",
    therapistName: "Dr. Femi Ojo",
    therapistTier: "Standard",
    planName: "Together",
    planSegment: "Couple",
    region: "NG",
    currency: "NGN",
    proposedPrice: 80_000_00,
    basePrice: 50_000_00,
    minBand: 40_000_00,
    maxBand: 60_000_00,
    reasoning: "Specialised in couples work.",
    status: "Rejected",
    decidedAt: "2026-05-16T14:00:00Z",
    decidedBy: "Adaeze Nwosu",
    decisionNote:
      "Significantly above max band. Therapist tier (Standard) does not yet justify Senior-tier pricing. Recommend resubmission after tier upgrade.",
  },
  {
    id: "ar-007",
    submittedAt: "2026-05-12T16:00:00Z",
    therapistId: "t-005",
    therapistName: "Dr. Priya Shah",
    therapistTier: "Clinical",
    planName: "Restore",
    planSegment: "Couple",
    region: "Int'l",
    currency: "USD",
    proposedPrice: 600_00,
    basePrice: 480_00,
    minBand: 420_00,
    maxBand: 560_00,
    reasoning:
      "21 years experience, grief and bereavement specialisation. Above max for complex caseload.",
    status: "Approved",
    decidedAt: "2026-05-13T10:00:00Z",
    decidedBy: "Adaeze Nwosu",
    decisionNote:
      "Approved given Clinical tier + specialisation depth. Note: still slightly above max, flagged for next band review.",
  },
];

function isOverdue(req: PricingRequest): boolean {
  if (req.status !== "Pending") return false;
  const sla = 3 * 24 * 60 * 60 * 1000; // 3 business days approx
  return Date.now() - new Date(req.submittedAt).getTime() > sla;
}

export function getApprovals(filters: ApprovalFilters = {}): PricingRequest[] {
  return REQUESTS.filter((r) => {
    if (filters.status && filters.status !== "all") {
      const map: Record<string, ApprovalStatus> = {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        countered: "Countered",
      };
      if (r.status !== map[filters.status]) return false;
    }
    if (filters.region && filters.region !== "all") {
      const target: Region = filters.region === "ng" ? "NG" : "Int'l";
      if (r.region !== target) return false;
    }
    if (filters.plan && filters.plan !== "all") {
      if (r.planName.toLowerCase() !== filters.plan.toLowerCase()) return false;
    }
    return true;
  });
}

export function getApproval(id: string): PricingRequest | undefined {
  return REQUESTS.find((r) => r.id === id);
}

export function getApprovalsByTherapist(therapistId: string): PricingRequest[] {
  return REQUESTS.filter((r) => r.therapistId === therapistId);
}

export function getApprovalStats() {
  return {
    pending: REQUESTS.filter((r) => r.status === "Pending").length,
    overdue: REQUESTS.filter(isOverdue).length,
    countered: REQUESTS.filter((r) => r.status === "Countered").length,
  };
}

export function deltaFromBand(req: PricingRequest): {
  pct: number;
  direction: "over_max" | "under_min" | "within";
  label: string;
} {
  if (req.proposedPrice > req.maxBand) {
    const pct = Math.round(
      ((req.proposedPrice - req.maxBand) / req.maxBand) * 100
    );
    return { pct, direction: "over_max", label: `+${pct}% over max` };
  }
  if (req.proposedPrice < req.minBand) {
    const pct = Math.round(
      ((req.minBand - req.proposedPrice) / req.minBand) * 100
    );
    return { pct, direction: "under_min", label: `-${pct}% under min` };
  }
  const pctFromBase = Math.round(
    ((req.proposedPrice - req.basePrice) / req.basePrice) * 100
  );
  return {
    pct: pctFromBase,
    direction: "within",
    label:
      pctFromBase === 0
        ? "At base"
        : pctFromBase > 0
          ? `+${pctFromBase}% from base · within band`
          : `${pctFromBase}% from base · within band`,
  };
}

export function formatMoney(amount: number, currency: Currency): string {
  if (currency === "NGN") {
    if (amount >= 100_000_00) return `₦${(amount / 100 / 1000).toFixed(0)}k`;
    return `₦${(amount / 100).toLocaleString()}`;
  }
  return `$${(amount / 100).toLocaleString()}`;
}

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

// Re-export for filters dropdown.
export const ALL_PLAN_NAMES_FOR_FILTER = ALL_PLAN_NAMES_ORDERED;

// Silence unused import (used implicitly for type narrowing if needed downstream).
export function _getPlanBandRange(region: Region, planName: string) {
  return getPricingByRegion(region).find((p) => p.planName === planName);
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add lib/dummy/pricing-approvals.ts && \
git commit -m "Add pricing-approvals dummy data + types"
```

---

## Task PA2: A8.1 Approvals queue

**File 1:** `admin/components/pricing-approvals/queue-columns.tsx`

```tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  deltaFromBand,
  formatMoney,
  formatRelative,
  type PricingRequest,
} from "@/lib/dummy/pricing-approvals";

const statusVariant: Record<
  PricingRequest["status"],
  "secondary" | "outline" | "destructive" | "default"
> = {
  Pending: "default",
  Approved: "secondary",
  Rejected: "destructive",
  Countered: "outline",
};

const segmentVariant: Record<
  PricingRequest["planSegment"],
  "secondary" | "outline"
> = {
  Individual: "secondary",
  Couple: "outline",
  Family: "outline",
};

export const queueColumns: ColumnDef<PricingRequest>[] = [
  {
    accessorKey: "submittedAt",
    header: "Submitted",
    cell: ({ row }) => {
      const iso = row.original.submittedAt;
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
    accessorKey: "therapistName",
    header: "Therapist",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <Link
          href={`/therapists/${r.therapistId}`}
          className="flex flex-col gap-0.5 hover:underline"
        >
          <span className="text-sm font-medium">{r.therapistName}</span>
          <span className="text-xs text-muted-foreground">{r.therapistTier}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: "planName",
    header: "Plan",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{r.planName}</span>
          <Badge variant={segmentVariant[r.planSegment]} className="font-normal w-fit">
            {r.planSegment}
          </Badge>
        </div>
      );
    },
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
    accessorKey: "proposedPrice",
    header: "Their price",
    cell: ({ row }) => (
      <span className="tabular-nums font-medium">
        {formatMoney(row.original.proposedPrice, row.original.currency)}
      </span>
    ),
  },
  {
    id: "band",
    header: "Band",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <span className="tabular-nums text-xs text-muted-foreground">
          {formatMoney(r.minBand, r.currency)} – {formatMoney(r.maxBand, r.currency)}
        </span>
      );
    },
  },
  {
    id: "delta",
    header: "Δ from band",
    cell: ({ row }) => {
      const d = deltaFromBand(row.original);
      const variant: "destructive" | "outline" | "secondary" =
        d.direction === "over_max" || d.direction === "under_min"
          ? "destructive"
          : "secondary";
      return (
        <Badge variant={variant} className="font-normal">
          {d.label}
        </Badge>
      );
    },
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
        href={`/pricing-approvals/${row.original.id}`}
        aria-label={`Open request ${row.original.id}`}
      >
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    ),
  },
];
```

**File 2:** `admin/components/pricing-approvals/queue-filters.tsx`

```tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ALL_PLAN_NAMES_FOR_FILTER } from "@/lib/dummy/pricing-approvals";

export function QueueFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const status = params.get("status") ?? "pending";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value === "" || value === "all") next.delete(key);
    else next.set(key, value);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  };

  return (
    <div className="space-y-3">
      <Tabs value={status} onValueChange={(v) => setParam("status", v)}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="countered">Countered</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-3">
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
            {ALL_PLAN_NAMES_FOR_FILTER.map((p) => (
              <SelectItem key={p} value={p.toLowerCase()}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
```

**File 3:** `admin/app/(dashboard)/pricing-approvals/page.tsx`

```tsx
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/therapists/data-table";

import { queueColumns } from "@/components/pricing-approvals/queue-columns";
import { QueueFilters } from "@/components/pricing-approvals/queue-filters";

import {
  getApprovals,
  getApprovalStats,
  type ApprovalFilters,
} from "@/lib/dummy/pricing-approvals";

type SearchParams = Promise<{
  status?: string;
  region?: string;
  plan?: string;
}>;

function asFilters(p: Awaited<SearchParams>): ApprovalFilters {
  return {
    status: (p.status as ApprovalFilters["status"]) ?? "pending",
    region: p.region as ApprovalFilters["region"],
    plan: p.plan,
  };
}

export default async function PricingApprovalsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const requests = getApprovals(filters);
  const stats = getApprovalStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            Custom pricing approvals
          </h1>
          <p className="text-sm text-muted-foreground">
            {stats.pending} pending · {stats.overdue} overdue ·{" "}
            {stats.countered} awaiting therapist response
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/plans">← Back to plans</Link>
        </Button>
      </header>

      <QueueFilters />

      <DataTable
        columns={queueColumns}
        data={requests}
        emptyMessage="No requests in this view."
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
for (const url of ['/pricing-approvals', '/pricing-approvals?status=all', '/pricing-approvals?status=approved', '/pricing-approvals?region=ng']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: all 200.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/pricing-approvals/queue-columns.tsx components/pricing-approvals/queue-filters.tsx "app/(dashboard)/pricing-approvals/page.tsx" && \
git commit -m "Add A8.1 custom pricing approvals queue"
```

---

## Task PA3: A8.2 Approval review + action dialogs

**File 1:** `admin/components/pricing-approvals/action-dialogs.tsx`

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  formatMoney,
  type PricingRequest,
} from "@/lib/dummy/pricing-approvals";

type Action = "approve" | "counter" | "reject";

type Props = {
  request: PricingRequest;
};

export function ActionBar({ request }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<Action | null>(null);
  const [counterPrice, setCounterPrice] = useState(
    (request.basePrice / 100).toString()
  );
  const [counterNote, setCounterNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const currencyPrefix = request.currency === "NGN" ? "₦" : "$";
  const parsedCounter = Number(counterPrice);
  const counterMinor = Math.round(parsedCounter * 100);
  const counterWithinBand =
    counterMinor >= request.minBand && counterMinor <= request.maxBand;

  const handleAction = (action: Action) => {
    if (action === "approve") {
      toast.success(`Approved ${request.therapistName}'s ${request.planName} pricing`, {
        description: `Rate ${formatMoney(request.proposedPrice, request.currency)} takes effect immediately.`,
      });
    } else if (action === "counter") {
      if (!parsedCounter || parsedCounter <= 0) {
        toast.error("Counter price must be greater than 0");
        return;
      }
      if (counterNote.trim().length < 5) {
        toast.error("Add a counter note of at least 5 characters.");
        return;
      }
      toast.success(`Counter-offer sent to ${request.therapistName}`, {
        description: `Proposed ${currencyPrefix}${parsedCounter.toLocaleString()} (${counterWithinBand ? "within band" : "outside band"}).`,
      });
    } else {
      if (rejectReason.trim().length < 5) {
        toast.error("Add a rejection reason of at least 5 characters.");
        return;
      }
      toast.success(`Request rejected`, {
        description: `${request.therapistName} notified. They may resubmit.`,
      });
    }
    setOpen(null);
    router.push("/pricing-approvals");
  };

  return (
    <>
      <div className="sticky top-20 flex flex-col gap-2">
        <Button onClick={() => setOpen("approve")} className="w-full">
          Approve
        </Button>
        <Button
          variant="outline"
          onClick={() => setOpen("counter")}
          className="w-full"
        >
          Counter-offer
        </Button>
        <Button
          variant="destructive"
          onClick={() => setOpen("reject")}
          className="w-full"
        >
          Reject
        </Button>
      </div>

      <Dialog open={open === "approve"} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Approve {request.therapistName}&apos;s {request.planName} pricing?
            </DialogTitle>
            <DialogDescription>
              Therapist&apos;s price of{" "}
              <span className="font-medium text-foreground">
                {formatMoney(request.proposedPrice, request.currency)}
              </span>{" "}
              will take effect immediately. They&apos;ll be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Snapshot</p>
            <p>Plan band: {formatMoney(request.minBand, request.currency)} – {formatMoney(request.maxBand, request.currency)}</p>
            <p>Base: {formatMoney(request.basePrice, request.currency)}</p>
            <p>Proposed: {formatMoney(request.proposedPrice, request.currency)}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleAction("approve")}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open === "counter"} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Counter {request.therapistName}&apos;s offer</DialogTitle>
            <DialogDescription>
              Propose an alternative price. The therapist receives this counter
              with your note and can accept, reject, or resubmit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="counter-price">
                Counter price ({currencyPrefix})
              </Label>
              <Input
                id="counter-price"
                type="number"
                step="1"
                min="0"
                value={counterPrice}
                onChange={(e) => setCounterPrice(e.target.value)}
              />
              <div className="flex items-center gap-2 text-xs">
                <Badge
                  variant={counterWithinBand ? "secondary" : "destructive"}
                  className="font-normal"
                >
                  {counterWithinBand ? "Within band" : "Outside band"}
                </Badge>
                <span className="text-muted-foreground">
                  Band: {formatMoney(request.minBand, request.currency)} – {formatMoney(request.maxBand, request.currency)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="counter-note">Note to therapist</Label>
              <Textarea
                id="counter-note"
                rows={3}
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                placeholder="E.g. We can offer top of band given your tier; let's revisit after next quarterly band review."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleAction("counter")}>
              Send counter-offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open === "reject"} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject pricing request?</DialogTitle>
            <DialogDescription>
              The therapist receives your reason and can resubmit a revised request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason (required)</Label>
            <Textarea
              id="reject-reason"
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="E.g. Significantly above max band. Recommend tier upgrade before resubmitting."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleAction("reject")}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

**File 2:** `admin/components/pricing-approvals/approval-review.tsx`

```tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { ActionBar } from "@/components/pricing-approvals/action-dialogs";

import {
  deltaFromBand,
  formatMoney,
  formatRelative,
  getApprovalsByTherapist,
  type PricingRequest,
} from "@/lib/dummy/pricing-approvals";

const statusVariant: Record<
  PricingRequest["status"],
  "secondary" | "outline" | "destructive" | "default"
> = {
  Pending: "default",
  Approved: "secondary",
  Rejected: "destructive",
  Countered: "outline",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type Props = {
  request: PricingRequest;
};

export function ApprovalReview({ request: r }: Props) {
  const delta = deltaFromBand(r);
  const history = getApprovalsByTherapist(r.therapistId).filter(
    (h) => h.id !== r.id
  );
  const recentHistory = history.slice(0, 3);
  const deltaVariant: "destructive" | "secondary" =
    delta.direction === "over_max" || delta.direction === "under_min"
      ? "destructive"
      : "secondary";

  return (
    <div className="space-y-6">
      <Link
        href="/pricing-approvals"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Approvals queue
      </Link>

      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-3xl tracking-tight">
            Pricing request — {r.therapistName}
          </h1>
          <Badge variant={statusVariant[r.status]}>{r.status}</Badge>
          <Badge variant="outline" className="font-normal">
            {r.region}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {r.planName} · {r.planSegment} · submitted {formatRelative(r.submittedAt)}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_220px]">
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Request</CardTitle>
              <Badge variant={deltaVariant} className="font-normal">
                {delta.label}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-md border border-border/60 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Min band
                  </p>
                  <p className="font-heading text-lg tabular-nums">
                    {formatMoney(r.minBand, r.currency)}
                  </p>
                </div>
                <div className="rounded-md border border-border/60 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Base price
                  </p>
                  <p className="font-heading text-lg tabular-nums">
                    {formatMoney(r.basePrice, r.currency)}
                  </p>
                </div>
                <div className="rounded-md border border-border/60 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Max band
                  </p>
                  <p className="font-heading text-lg tabular-nums">
                    {formatMoney(r.maxBand, r.currency)}
                  </p>
                </div>
              </div>
              <div className="rounded-md border border-primary/40 bg-primary/5 px-3 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Therapist proposed
                </p>
                <p className="font-heading text-2xl tabular-nums">
                  {formatMoney(r.proposedPrice, r.currency)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Therapist&apos;s reasoning
                </p>
                <p className="text-sm leading-relaxed">{r.reasoning}</p>
              </div>
              {r.status !== "Pending" && r.decisionNote && (
                <div className="rounded-md bg-muted/50 px-3 py-2 space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Decision · {r.decidedBy} ·{" "}
                    {r.decidedAt && formatDate(r.decidedAt)}
                  </p>
                  <p className="text-sm">{r.decisionNote}</p>
                  {r.counterPrice && (
                    <p className="text-xs text-muted-foreground">
                      Counter: {formatMoney(r.counterPrice, r.currency)}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Therapist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">{r.therapistName}</p>
                <Badge variant="secondary" className="font-normal">
                  {r.therapistTier}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Region: {r.region}
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <Link href={`/therapists/${r.therapistId}`}>
                    Open therapist →
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">
                  {r.planName} · {r.planSegment}
                </p>
                <p className="text-muted-foreground text-xs">
                  Currency: {r.currency}
                </p>
                <p className="text-muted-foreground text-xs">
                  Band set in Plans & pricing.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <Link href="/plans">Edit in plans →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent requests by this therapist</CardTitle>
              <span className="text-xs text-muted-foreground">
                {history.length} total
              </span>
            </CardHeader>
            <CardContent>
              {recentHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No prior requests on record.
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {recentHistory.map((h) => (
                    <li
                      key={h.id}
                      className="flex items-center justify-between"
                    >
                      <span>
                        {formatDate(h.submittedAt)} ·{" "}
                        <span className="text-muted-foreground">{h.planName}</span>
                      </span>
                      <Badge
                        variant={statusVariant[h.status]}
                        className="font-normal"
                      >
                        {h.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <aside>
          {r.status === "Pending" ? (
            <ActionBar request={r} />
          ) : (
            <div className="sticky top-20 rounded-md border border-border/60 px-3 py-3 text-sm text-muted-foreground">
              This request is already {r.status.toLowerCase()}. No further action
              available.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
```

**File 3:** `admin/app/(dashboard)/pricing-approvals/[id]/page.tsx`

```tsx
import { notFound } from "next/navigation";

import { ApprovalReview } from "@/components/pricing-approvals/approval-review";
import { getApproval } from "@/lib/dummy/pricing-approvals";

type Params = Promise<{ id: string }>;

export default async function PricingApprovalReviewPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const request = getApproval(id);
  if (!request) notFound();

  return <ApprovalReview request={request} />;
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

```js
for (const url of ['/pricing-approvals/ar-001', '/pricing-approvals/ar-005', '/pricing-approvals/ar-007', '/pricing-approvals/does-not-exist']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: ar-001/ar-005/ar-007 → 200; does-not-exist → 404.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/pricing-approvals/action-dialogs.tsx components/pricing-approvals/approval-review.tsx "app/(dashboard)/pricing-approvals/[id]/page.tsx" && \
git commit -m "Add A8.2 pricing approval review page with action dialogs"
```

---

## Task PA4: Final smoke + push

**Step 1 — tsc**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

**Step 2 — smoke**

```js
for (const url of [
  '/pricing-approvals',
  '/pricing-approvals?status=all',
  '/pricing-approvals?status=approved',
  '/pricing-approvals?status=countered',
  '/pricing-approvals?region=ng',
  '/pricing-approvals?plan=harmony',
  '/pricing-approvals/ar-001',
  '/pricing-approvals/ar-004',
  '/pricing-approvals/ar-005',
  '/pricing-approvals/ar-006',
  '/pricing-approvals/ar-007',
  '/pricing-approvals/does-not-exist',
]) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: all 200 except `does-not-exist` → 404.

**Step 3 — push**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2 && git push
```

---

## Out-of-scope reminders

- Real persistence
- Bulk approve within-band
- Email preview in Approve modal
- Full per-therapist request history (currently last 3)
- Auto-validation tooltip on counter price as admin types (band check only)
- Loading skeletons
- Mobile card view
