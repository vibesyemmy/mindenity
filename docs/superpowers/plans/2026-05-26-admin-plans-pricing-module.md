# Admin Plans & Pricing Module Implementation Plan

> Use superpowers:subagent-driven-development to execute task-by-task.

**Goal:** Ship A6 module (pricing tables merged with bands + eligibility matrix + coverage report) per `docs/superpowers/specs/2026-05-26-admin-plans-pricing-module-design.md`.

**Architecture:** 3 routes inside `(dashboard)` group. Reuses every shadcn component from earlier modules + 1 new install (`switch`). Recharts already installed.

**Verification per task:** `pnpm tsc --noEmit` clean + fetch returns 200 + HTML contains expected anchor text.

---

## File structure

| File | Role |
|---|---|
| `admin/lib/dummy/plans.ts` | Types + dummy data + getters/stats |
| `admin/components/plans/pricing-columns.tsx` | A6.1 column defs |
| `admin/components/plans/pricing-edit-dialog.tsx` | Per-row Edit dialog |
| `admin/app/(dashboard)/plans/page.tsx` | A6.1 entry (NGN/USD tabs) |
| `admin/components/plans/eligibility-matrix.tsx` | A6.3 matrix component |
| `admin/app/(dashboard)/plans/eligibility/page.tsx` | A6.3 entry |
| `admin/components/plans/coverage-chart.tsx` | A6.4 Recharts bar chart |
| `admin/components/plans/coverage-table.tsx` | A6.4 low-coverage table |
| `admin/app/(dashboard)/plans/coverage/page.tsx` | A6.4 entry |

---

## Task P1: Dummy plans data + types + install switch

**Step 1 — Install `switch` shadcn component**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
pnpm dlx shadcn@latest add switch -y
```

Expected: `admin/components/ui/switch.tsx` created.

**Step 2 — Create dummy data file**

Write `/Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin/lib/dummy/plans.ts` with EXACT content:

```ts
// Shared types + dummy data for admin plans & pricing module.

export type Region = "NG" | "Int'l";
export type Currency = "NGN" | "USD";
export type PlanType = "PAYG" | "Subscription";
export type PlanSegment = "Individual" | "Couple" | "Family";
export type Tier = "Standard" | "Senior" | "Clinical";

export type PlanPricing = {
  planName: string;
  segment: PlanSegment;
  type: PlanType;
  sessionsPerMonth: number;
  basePrice: number;
  minBand: number;
  maxBand: number;
  currency: Currency;
  active: boolean;
};

export type EligibilityCell = {
  plan: string;
  region: Region;
  tier: Tier;
  enabled: boolean;
};

export type PlanCoverage = {
  plan: string;
  region: Region;
  therapists: number;
  threshold: number;
  gap: number;
};

const NGN_PRICING: PlanPricing[] = [
  { planName: "Essential", segment: "Individual", type: "PAYG", sessionsPerMonth: 0, basePrice: 20_000_00, minBand: 15_000_00, maxBand: 30_000_00, currency: "NGN", active: true },
  { planName: "Balance", segment: "Individual", type: "Subscription", sessionsPerMonth: 4, basePrice: 40_000_00, minBand: 35_000_00, maxBand: 50_000_00, currency: "NGN", active: true },
  { planName: "Thrive", segment: "Individual", type: "Subscription", sessionsPerMonth: 8, basePrice: 80_000_00, minBand: 70_000_00, maxBand: 100_000_00, currency: "NGN", active: true },
  { planName: "Together", segment: "Couple", type: "PAYG", sessionsPerMonth: 0, basePrice: 50_000_00, minBand: 40_000_00, maxBand: 60_000_00, currency: "NGN", active: true },
  { planName: "Harmony", segment: "Couple", type: "Subscription", sessionsPerMonth: 4, basePrice: 220_000_00, minBand: 180_000_00, maxBand: 240_000_00, currency: "NGN", active: true },
  { planName: "Restore", segment: "Couple", type: "Subscription", sessionsPerMonth: 8, basePrice: 480_000_00, minBand: 420_000_00, maxBand: 520_000_00, currency: "NGN", active: true },
  { planName: "Home", segment: "Family", type: "PAYG", sessionsPerMonth: 0, basePrice: 100_000_00, minBand: 80_000_00, maxBand: 120_000_00, currency: "NGN", active: true },
  { planName: "Family Care", segment: "Family", type: "Subscription", sessionsPerMonth: 4, basePrice: 350_000_00, minBand: 320_000_00, maxBand: 400_000_00, currency: "NGN", active: true },
  { planName: "Family Thrive", segment: "Family", type: "Subscription", sessionsPerMonth: 8, basePrice: 600_000_00, minBand: 560_000_00, maxBand: 680_000_00, currency: "NGN", active: false },
];

const USD_PRICING: PlanPricing[] = [
  { planName: "Essential", segment: "Individual", type: "PAYG", sessionsPerMonth: 0, basePrice: 30_00, minBand: 25_00, maxBand: 50_00, currency: "USD", active: true },
  { planName: "Balance", segment: "Individual", type: "Subscription", sessionsPerMonth: 4, basePrice: 80_00, minBand: 70_00, maxBand: 100_00, currency: "USD", active: true },
  { planName: "Thrive", segment: "Individual", type: "Subscription", sessionsPerMonth: 8, basePrice: 160_00, minBand: 140_00, maxBand: 200_00, currency: "USD", active: true },
  { planName: "Together", segment: "Couple", type: "PAYG", sessionsPerMonth: 0, basePrice: 90_00, minBand: 75_00, maxBand: 120_00, currency: "USD", active: true },
  { planName: "Harmony", segment: "Couple", type: "Subscription", sessionsPerMonth: 4, basePrice: 320_00, minBand: 280_00, maxBand: 380_00, currency: "USD", active: true },
  { planName: "Restore", segment: "Couple", type: "Subscription", sessionsPerMonth: 8, basePrice: 480_00, minBand: 420_00, maxBand: 560_00, currency: "USD", active: true },
  { planName: "Home", segment: "Family", type: "PAYG", sessionsPerMonth: 0, basePrice: 180_00, minBand: 150_00, maxBand: 220_00, currency: "USD", active: true },
  { planName: "Family Care", segment: "Family", type: "Subscription", sessionsPerMonth: 4, basePrice: 600_00, minBand: 540_00, maxBand: 720_00, currency: "USD", active: true },
  { planName: "Family Thrive", segment: "Family", type: "Subscription", sessionsPerMonth: 8, basePrice: 800_00, minBand: 720_00, maxBand: 960_00, currency: "USD", active: false },
];

const ALL_PLANS = NGN_PRICING.map((p) => p.planName);
const ALL_TIERS: Tier[] = ["Standard", "Senior", "Clinical"];

// Default eligibility: most plans enabled for all tiers, with realistic restrictions.
// Restore (8-session couple) gated to Senior+ — high intensity.
// Family Thrive (8-session family) gated to Senior+ for the same reason.
// Thrive (8-session individual) Standard-tier allowed but flagged for QA.
const DISABLED_CELLS = new Set([
  // NG: Restore + Family Thrive locked to Senior+
  "Restore|NG|Standard",
  "Family Thrive|NG|Standard",
  // Int'l: same plus Family Care for Standard
  "Restore|Int'l|Standard",
  "Family Thrive|Int'l|Standard",
  "Family Care|Int'l|Standard",
]);

const ELIGIBILITY: EligibilityCell[] = ALL_PLANS.flatMap((plan) =>
  (["NG", "Int'l"] as Region[]).flatMap((region) =>
    ALL_TIERS.map((tier) => ({
      plan,
      region,
      tier,
      enabled: !DISABLED_CELLS.has(`${plan}|${region}|${tier}`),
    }))
  )
);

// Coverage data cross-references the therapist module's plansAccepted arrays.
// Hand-curated to match real therapist coverage from `admin/lib/dummy/therapists.ts`.
const COVERAGE: PlanCoverage[] = [
  // Nigeria
  { plan: "Essential", region: "NG", therapists: 2, threshold: 3, gap: -1 },
  { plan: "Balance", region: "NG", therapists: 0, threshold: 3, gap: -3 },
  { plan: "Thrive", region: "NG", therapists: 0, threshold: 3, gap: -3 },
  { plan: "Together", region: "NG", therapists: 2, threshold: 3, gap: -1 },
  { plan: "Harmony", region: "NG", therapists: 1, threshold: 3, gap: -2 },
  { plan: "Restore", region: "NG", therapists: 1, threshold: 3, gap: -2 },
  { plan: "Home", region: "NG", therapists: 0, threshold: 3, gap: -3 },
  { plan: "Family Care", region: "NG", therapists: 0, threshold: 3, gap: -3 },
  { plan: "Family Thrive", region: "NG", therapists: 0, threshold: 3, gap: -3 },
  // International
  { plan: "Essential", region: "Int'l", therapists: 2, threshold: 3, gap: -1 },
  { plan: "Balance", region: "Int'l", therapists: 0, threshold: 3, gap: -3 },
  { plan: "Thrive", region: "Int'l", therapists: 0, threshold: 3, gap: -3 },
  { plan: "Together", region: "Int'l", therapists: 2, threshold: 3, gap: -1 },
  { plan: "Harmony", region: "Int'l", therapists: 3, threshold: 3, gap: 0 },
  { plan: "Restore", region: "Int'l", therapists: 3, threshold: 3, gap: 0 },
  { plan: "Home", region: "Int'l", therapists: 1, threshold: 3, gap: -2 },
  { plan: "Family Care", region: "Int'l", therapists: 2, threshold: 3, gap: -1 },
  { plan: "Family Thrive", region: "Int'l", therapists: 1, threshold: 3, gap: -2 },
];

export function getPricingByRegion(region: Region): PlanPricing[] {
  return region === "NG" ? NGN_PRICING : USD_PRICING;
}

export function getEligibilityMatrix(): EligibilityCell[] {
  return ELIGIBILITY;
}

export function getCoverageByPlan(region?: Region): PlanCoverage[] {
  if (!region) return COVERAGE;
  return COVERAGE.filter((c) => c.region === region);
}

export function getPlanStats() {
  const ngActive = NGN_PRICING.filter((p) => p.active).length;
  const usdActive = USD_PRICING.filter((p) => p.active).length;
  return {
    activeNg: ngActive,
    activeIntl: usdActive,
    totalPlans: NGN_PRICING.length,
    pendingApprovals: 1, // mocked — would query A8 in real impl
  };
}

export function getCoverageStats() {
  const lowCoverage = COVERAGE.filter((c) => c.gap < 0).length;
  return {
    lowCoverage,
    totalPerRegion: NGN_PRICING.length,
  };
}

export function formatMoney(amount: number, currency: Currency): string {
  if (currency === "NGN") {
    if (amount >= 100_000_00) return `₦${(amount / 100 / 1000).toFixed(0)}k`;
    return `₦${(amount / 100).toLocaleString()}`;
  }
  return `$${(amount / 100).toLocaleString()}`;
}

export const ALL_PLAN_NAMES_ORDERED = ALL_PLANS;
export const ALL_TIERS_ORDERED = ALL_TIERS;
```

**Step 3 — Verify + commit**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/ui/switch.tsx lib/dummy/plans.ts package.json pnpm-lock.yaml && \
git commit -m "Add plans + pricing dummy data; install switch component"
```

---

## Task P2: A6.1+A6.2 pricing tables with edit dialog

**File 1:** `admin/components/plans/pricing-edit-dialog.tsx`

```tsx
"use client";

import { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";

import type { PlanPricing } from "@/lib/dummy/plans";

type Props = {
  plan: PlanPricing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function priceToInput(amount: number, currency: PlanPricing["currency"]): string {
  return (amount / 100).toString();
}

export function PricingEditDialog({ plan, open, onOpenChange }: Props) {
  const [basePrice, setBasePrice] = useState("");
  const [minBand, setMinBand] = useState("");
  const [maxBand, setMaxBand] = useState("");
  const [sessions, setSessions] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!plan) return;
    setBasePrice(priceToInput(plan.basePrice, plan.currency));
    setMinBand(priceToInput(plan.minBand, plan.currency));
    setMaxBand(priceToInput(plan.maxBand, plan.currency));
    setSessions(plan.sessionsPerMonth.toString());
    setActive(plan.active);
  }, [plan]);

  if (!plan) return null;

  const currencyPrefix = plan.currency === "NGN" ? "₦" : "$";

  const handleSubmit = () => {
    const base = Number(basePrice);
    const min = Number(minBand);
    const max = Number(maxBand);
    const sess = Number(sessions);

    if (!base || base <= 0) return toast.error("Base price must be greater than 0");
    if (min < 0) return toast.error("Min band cannot be negative");
    if (min > base) return toast.error("Min band cannot be greater than base price");
    if (max <= base) return toast.error("Max band must be greater than base price");
    if (plan.type === "Subscription" && (!sess || sess <= 0)) {
      return toast.error("Sessions/month must be greater than 0 for subscription plans");
    }

    toast.success(`${plan.planName} updated`, {
      description: `${currencyPrefix}${min.toLocaleString()} – ${currencyPrefix}${base.toLocaleString()} – ${currencyPrefix}${max.toLocaleString()} · ${active ? "active" : "paused"}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {plan.planName}</DialogTitle>
          <DialogDescription>
            {plan.segment} · {plan.type} · {plan.currency}. Therapists may set
            prices within the band; out-of-band requests route to approval.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="base">Base price ({currencyPrefix})</Label>
              <Input
                id="base"
                type="number"
                step="1"
                min="0"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min">Min band</Label>
              <Input
                id="min"
                type="number"
                step="1"
                min="0"
                value={minBand}
                onChange={(e) => setMinBand(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max">Max band</Label>
              <Input
                id="max"
                type="number"
                step="1"
                min="0"
                value={maxBand}
                onChange={(e) => setMaxBand(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessions">Sessions/month</Label>
            <Input
              id="sessions"
              type="number"
              step="1"
              min="0"
              value={sessions}
              onChange={(e) => setSessions(e.target.value)}
              disabled={plan.type === "PAYG"}
              placeholder={plan.type === "PAYG" ? "PAYG — not applicable" : ""}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2">
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-xs text-muted-foreground">
                When off, plan is hidden from clients in this region.
              </p>
            </div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**File 2:** `admin/components/plans/pricing-columns.tsx`

```tsx
"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { formatMoney, type PlanPricing } from "@/lib/dummy/plans";

const segmentVariant: Record<
  PlanPricing["segment"],
  "secondary" | "outline"
> = {
  Individual: "secondary",
  Couple: "outline",
  Family: "outline",
};

export function makePricingColumns(
  onEdit: (plan: PlanPricing) => void
): ColumnDef<PlanPricing>[] {
  return [
    {
      accessorKey: "planName",
      header: "Plan",
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="space-y-1">
            <p className="font-medium">{p.planName}</p>
            <Badge variant={segmentVariant[p.segment]} className="font-normal">
              {p.segment}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "sessionsPerMonth",
      header: "Sessions/mo",
      cell: ({ row }) =>
        row.original.type === "PAYG" ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          <span className="tabular-nums">{row.original.sessionsPerMonth}</span>
        ),
    },
    {
      accessorKey: "basePrice",
      header: "Base price",
      cell: ({ row }) => (
        <span className="tabular-nums font-medium">
          {formatMoney(row.original.basePrice, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: "minBand",
      header: "Min band",
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">
          {formatMoney(row.original.minBand, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: "maxBand",
      header: "Max band",
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">
          {formatMoney(row.original.maxBand, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: "active",
      header: "Active",
      cell: ({ row }) =>
        row.original.active ? (
          <Badge variant="secondary" className="font-normal">
            Active
          </Badge>
        ) : (
          <Badge variant="outline" className="font-normal">
            Paused
          </Badge>
        ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => onEdit(row.original)}>
          Edit
        </Button>
      ),
    },
  ];
}
```

**File 3:** `admin/app/(dashboard)/plans/page.tsx`

```tsx
"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DataTable } from "@/components/therapists/data-table";
import { makePricingColumns } from "@/components/plans/pricing-columns";
import { PricingEditDialog } from "@/components/plans/pricing-edit-dialog";

import {
  getPricingByRegion,
  getPlanStats,
  type PlanPricing,
} from "@/lib/dummy/plans";

export default function PlansPage() {
  const [editPlan, setEditPlan] = useState<PlanPricing | null>(null);
  const stats = getPlanStats();
  const ngPricing = getPricingByRegion("NG");
  const usdPricing = getPricingByRegion("Int'l");

  const columns = useMemo(
    () => makePricingColumns((p) => setEditPlan(p)),
    []
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            Plans &amp; pricing
          </h1>
          <p className="text-sm text-muted-foreground">
            {stats.activeNg + stats.activeIntl} active plan listings across 2 regions ·{" "}
            {stats.pendingApprovals} with out-of-band requests pending
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/plans/eligibility">Eligibility matrix →</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/plans/coverage">Coverage report →</Link>
          </Button>
        </div>
      </header>

      <Tabs defaultValue="ng">
        <TabsList>
          <TabsTrigger value="ng">Nigeria (NGN)</TabsTrigger>
          <TabsTrigger value="intl">International (USD)</TabsTrigger>
        </TabsList>

        <TabsContent value="ng" className="pt-4">
          <DataTable columns={columns} data={ngPricing} emptyMessage="No plans." />
        </TabsContent>
        <TabsContent value="intl" className="pt-4">
          <DataTable columns={columns} data={usdPricing} emptyMessage="No plans." />
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground">
        Therapists may set their own price within the min/max band. Out-of-band
        requests route to approval (see Custom pricing approvals).
      </p>

      <PricingEditDialog
        plan={editPlan}
        open={editPlan !== null}
        onOpenChange={(open) => {
          if (!open) setEditPlan(null);
        }}
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
const r = await fetch('http://localhost:3000/plans');
const html = await r.text();
console.log(r.status, html.includes('Essential') && html.includes('Family Thrive') ? 'plans OK' : 'missing');
```
Expected: `200 plans OK`.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/plans/pricing-edit-dialog.tsx components/plans/pricing-columns.tsx "app/(dashboard)/plans/page.tsx" && \
git commit -m "Add A6.1+A6.2 pricing tables with bands and edit dialog"
```

---

## Task P3: A6.3 Eligibility matrix

**File 1:** `admin/components/plans/eligibility-matrix.tsx`

```tsx
"use client";

import { useState } from "react";
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
  getEligibilityMatrix,
  ALL_PLAN_NAMES_ORDERED,
  ALL_TIERS_ORDERED,
  type EligibilityCell,
} from "@/lib/dummy/plans";

const REGIONS: Array<"NG" | "Int'l"> = ["NG", "Int'l"];

type CellKey = string; // `${plan}|${region}|${tier}`

function keyOf(c: { plan: string; region: "NG" | "Int'l"; tier: string }): CellKey {
  return `${c.plan}|${c.region}|${c.tier}`;
}

export function EligibilityMatrix() {
  const initial = getEligibilityMatrix();
  const [enabled, setEnabled] = useState<Record<CellKey, boolean>>(
    Object.fromEntries(initial.map((c) => [keyOf(c), c.enabled]))
  );
  const [notifyOnEnable, setNotifyOnEnable] = useState(false);

  const toggle = (cell: { plan: string; region: "NG" | "Int'l"; tier: string }) => {
    const key = keyOf(cell);
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    const changed = Object.entries(enabled).filter(
      ([key, v]) => initial.find((c) => keyOf(c) === key)?.enabled !== v
    ).length;
    if (changed === 0) {
      toast.info("No changes to save");
      return;
    }
    toast.success(`Eligibility updated`, {
      description: `${changed} cell${changed === 1 ? "" : "s"} changed${notifyOnEnable ? " · therapists notified" : ""}.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border/60 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2} className="sticky left-0 bg-card z-10 align-bottom">
                Plan
              </TableHead>
              {REGIONS.map((region) => (
                <TableHead
                  key={region}
                  colSpan={ALL_TIERS_ORDERED.length}
                  className="text-center border-l border-border/40"
                >
                  {region === "NG" ? "Nigeria" : "International"}
                </TableHead>
              ))}
            </TableRow>
            <TableRow>
              {REGIONS.flatMap((region) =>
                ALL_TIERS_ORDERED.map((tier, idx) => (
                  <TableHead
                    key={`${region}-${tier}`}
                    className={`text-center text-xs ${idx === 0 ? "border-l border-border/40" : ""}`}
                  >
                    {tier}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {ALL_PLAN_NAMES_ORDERED.map((plan) => (
              <TableRow key={plan}>
                <TableCell className="sticky left-0 bg-card z-10 font-medium">
                  {plan}
                </TableCell>
                {REGIONS.flatMap((region) =>
                  ALL_TIERS_ORDERED.map((tier, idx) => {
                    const key = keyOf({ plan, region, tier });
                    return (
                      <TableCell
                        key={`${plan}-${region}-${tier}`}
                        className={`text-center ${idx === 0 ? "border-l border-border/40" : ""}`}
                      >
                        <Switch
                          checked={enabled[key]}
                          onCheckedChange={() => toggle({ plan, region, tier })}
                          aria-label={`${plan} · ${region} · ${tier}`}
                        />
                      </TableCell>
                    );
                  })
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between rounded-md border border-border/60 px-3 py-3">
        <div className="flex items-center gap-3">
          <Switch
            id="notify"
            checked={notifyOnEnable}
            onCheckedChange={setNotifyOnEnable}
          />
          <label
            htmlFor="notify"
            className="text-sm cursor-pointer select-none"
          >
            Notify therapists when re-enabling a previously disabled plan
          </label>
        </div>
        <Button onClick={handleSave}>Save changes</Button>
      </div>
    </div>
  );
}

// silence unused type re-export warning
export type _EligibilityCell = EligibilityCell;
```

**File 2:** `admin/app/(dashboard)/plans/eligibility/page.tsx`

```tsx
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { EligibilityMatrix } from "@/components/plans/eligibility-matrix";

export default function EligibilityPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            Plan-tier eligibility
          </h1>
          <p className="text-sm text-muted-foreground">
            Which therapist tiers can accept which plans per region (US-029).
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/plans">← Back to plans</Link>
        </Button>
      </header>

      <EligibilityMatrix />
    </div>
  );
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

```js
const r = await fetch('http://localhost:3000/plans/eligibility');
const html = await r.text();
console.log(r.status, html.includes('Plan-tier eligibility') && html.includes('Standard') && html.includes('Clinical') ? 'matrix OK' : 'missing');
```
Expected: `200 matrix OK`.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/plans/eligibility-matrix.tsx "app/(dashboard)/plans/eligibility/page.tsx" && \
git commit -m "Add A6.3 plan-tier eligibility matrix"
```

---

## Task P4: A6.4 Coverage report

**File 1:** `admin/components/plans/coverage-chart.tsx`

```tsx
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  getCoverageByPlan,
  ALL_PLAN_NAMES_ORDERED,
} from "@/lib/dummy/plans";

type Props = {
  region?: "NG" | "Int'l";
};

const config = {
  ng: { label: "Nigeria", color: "var(--chart-1)" },
  intl: { label: "International", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function CoverageChart({ region }: Props) {
  const all = getCoverageByPlan();
  const data = ALL_PLAN_NAMES_ORDERED.map((plan) => {
    const ng = all.find((c) => c.plan === plan && c.region === "NG")?.therapists ?? 0;
    const intl = all.find((c) => c.plan === plan && c.region === "Int'l")?.therapists ?? 0;
    return { plan, ng, intl };
  });

  return (
    <ChartContainer config={config} className="h-[320px] w-full">
      <BarChart data={data} margin={{ left: 0, right: 0, top: 8, bottom: 24 }}>
        <CartesianGrid vertical={false} className="stroke-border/50" />
        <XAxis
          dataKey="plan"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs"
          interval={0}
          angle={-25}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          className="text-xs"
          width={32}
          allowDecimals={false}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        {(!region || region === "NG") && (
          <Bar dataKey="ng" stackId="r" fill="var(--color-ng)" radius={[0, 0, 0, 0]} />
        )}
        {(!region || region === "Int'l") && (
          <Bar dataKey="intl" stackId="r" fill="var(--color-intl)" radius={[4, 4, 0, 0]} />
        )}
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
}
```

**File 2:** `admin/components/plans/coverage-table.tsx`

```tsx
"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getCoverageByPlan,
  type PlanCoverage,
} from "@/lib/dummy/plans";

type Props = {
  region?: "NG" | "Int'l";
};

export function CoverageTable({ region }: Props) {
  const all = getCoverageByPlan(region);
  const low = all.filter((c) => c.gap < 0);

  if (low.length === 0) {
    return (
      <div className="rounded-md border border-border/60 px-4 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          All plans have ≥3 therapists per region. Healthy supply.
        </p>
      </div>
    );
  }

  const handleNudge = (row: PlanCoverage) => {
    toast.info("Bulk notify not built", {
      description: `Outreach for ${row.plan} (${row.region}) is currently handled by ops manually.`,
    });
  };

  return (
    <div className="rounded-md border border-border/60 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Current therapists</TableHead>
            <TableHead>Gap to threshold (3)</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {low.map((c) => (
            <TableRow key={`${c.plan}-${c.region}`}>
              <TableCell className="font-medium">{c.plan}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {c.region}
                </Badge>
              </TableCell>
              <TableCell className="tabular-nums">{c.therapists}</TableCell>
              <TableCell>
                <Badge variant="destructive" className="font-normal">
                  Need {Math.abs(c.gap)} more
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNudge(c)}
                  disabled
                >
                  Send onboarding nudge
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

**File 3:** `admin/app/(dashboard)/plans/coverage/page.tsx`

```tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CoverageChart } from "@/components/plans/coverage-chart";
import { CoverageTable } from "@/components/plans/coverage-table";

import { getCoverageStats } from "@/lib/dummy/plans";

type RegionParam = "all" | "ng" | "intl";

function asRegion(v: string | null): RegionParam {
  if (v === "ng" || v === "intl") return v;
  return "all";
}

function regionToData(r: RegionParam): "NG" | "Int'l" | undefined {
  if (r === "ng") return "NG";
  if (r === "intl") return "Int'l";
  return undefined;
}

export default function CoveragePage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const region = asRegion(params.get("region"));
  const stats = getCoverageStats();

  const setRegion = (v: string) => {
    const next = new URLSearchParams(params);
    if (v === "all") next.delete("region");
    else next.set("region", v);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Plan coverage</h1>
          <p className="text-sm text-muted-foreground">
            {stats.lowCoverage} plans below 3-therapist threshold ·{" "}
            {stats.totalPerRegion} total per region
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/plans">← Back to plans</Link>
          </Button>
          <Button variant="outline" disabled>
            Export CSV
          </Button>
        </div>
      </header>

      <Tabs value={region} onValueChange={setRegion}>
        <TabsList>
          <TabsTrigger value="all">All regions</TabsTrigger>
          <TabsTrigger value="ng">Nigeria</TabsTrigger>
          <TabsTrigger value="intl">International</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Therapist count per plan</CardTitle>
        </CardHeader>
        <CardContent>
          <CoverageChart region={regionToData(region)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plans needing coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <CoverageTable region={regionToData(region)} />
        </CardContent>
      </Card>
    </div>
  );
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

```js
for (const url of ['/plans/coverage', '/plans/coverage?region=ng', '/plans/coverage?region=intl']) {
  const r = await fetch('http://localhost:3000' + url);
  const html = await r.text();
  console.log(url, r.status, html.includes('Plan coverage') ? 'OK' : 'missing');
}
```
Expected: all `200 OK`.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/plans/coverage-chart.tsx components/plans/coverage-table.tsx "app/(dashboard)/plans/coverage/page.tsx" && \
git commit -m "Add A6.4 plan coverage report with Recharts bar chart"
```

---

## Task P5: Final smoke + push

**Step 1 — tsc clean**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

**Step 2 — Hit every plans route**

```js
for (const url of [
  '/plans',
  '/plans/eligibility',
  '/plans/coverage',
  '/plans/coverage?region=ng',
  '/plans/coverage?region=intl',
]) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: all 200.

**Step 3 — Push**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2 && git push
```

---

## Out-of-scope reminders

- Real persistence
- Pricing history / audit log per change
- Bulk re-pricing
- Promo discount overlay (A7)
- Tier override per individual therapist (US-013.5 → A3.4)
- Send onboarding nudge bulk action (button disabled with info toast)
- Loading skeletons
- Mobile card view
