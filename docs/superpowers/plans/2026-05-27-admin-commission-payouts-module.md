# Admin Commission & Payouts Module Implementation Plan

> Use superpowers:subagent-driven-development to execute task-by-task.

**Goal:** Ship A9 module (analytics + payout runs list/detail + tier overrides) per `docs/superpowers/specs/2026-05-27-admin-commission-payouts-module-design.md`.

**Architecture:** 4 routes inside `(dashboard)` group. Reuses every component from earlier modules. **No new deps.**

**Verification per task:** `pnpm tsc --noEmit` clean + fetch returns expected status + HTML contains expected anchor text.

---

## File structure

| File | Role |
|---|---|
| `admin/lib/dummy/commission.ts` | Types + dummy data + getters/stats |
| `admin/components/commission/tier-chart.tsx` | A9.1 Recharts bar chart |
| `admin/components/commission/top-earners-table.tsx` | A9.1 top earners |
| `admin/app/(dashboard)/commission/page.tsx` | A9.1 entry |
| `admin/components/commission/payout-runs-columns.tsx` | A9.2 list columns |
| `admin/components/commission/payout-runs-filters.tsx` | A9.2 list filters |
| `admin/app/(dashboard)/commission/payouts/page.tsx` | A9.2 list |
| `admin/components/commission/payout-run-detail.tsx` | A9.2 detail composition |
| `admin/app/(dashboard)/commission/payouts/[id]/page.tsx` | A9.2 detail entry |
| `admin/components/commission/override-form.tsx` | A9.3 new override form |
| `admin/components/commission/active-overrides-table.tsx` | A9.3 active list |
| `admin/app/(dashboard)/commission/overrides/page.tsx` | A9.3 entry |

---

## Task CO1: Dummy commission/payouts/overrides data + types

**File:** `admin/lib/dummy/commission.ts`

```ts
// Shared types + dummy data for admin commission & payouts module.
// Cross-references existing therapist IDs from `admin/lib/dummy/therapists.ts`.

export type Region = "NG" | "Int'l";
export type Currency = "NGN" | "USD";
export type TierLabel =
  | "New"
  | "T1"
  | "T1+"
  | "T2"
  | "T2+"
  | "T3"
  | "T3+"
  | "T4"
  | "T4+";
export type PayoutRunStatus = "Scheduled" | "Processing" | "Completed" | "Failed";
export type PayoutItemStatus = "Paid" | "Pending" | "Failed";
export type OverrideType = "Tier" | "Custom %";

export type TierDistributionEntry = {
  tier: TierLabel;
  therapistCount: number;
};

export type EarnerRow = {
  rank: number;
  therapistId: string;
  therapistName: string;
  tier: TierLabel;
  sessionsMonth: number;
  gross: number; // minor units
  share: number; // therapist take in minor units
  platformFee: number; // minor units
  currency: Currency;
  region: Region;
};

export type PayoutItem = {
  therapistId: string;
  therapistName: string;
  tier: TierLabel;
  sessions: number;
  gross: number;
  commissionPct: number; // e.g. 80 for 80%
  platformFee: number;
  net: number;
  status: PayoutItemStatus;
};

export type PayoutRun = {
  id: string;
  date: string; // ISO
  region: Region;
  currency: Currency;
  therapistsCount: number;
  totalGross: number;
  totalPlatformFee: number;
  totalNet: number;
  status: PayoutRunStatus;
  triggeredBy: string;
  triggeredAt: string;
  notes?: string;
  items: PayoutItem[];
};

export type TierOverride = {
  id: string;
  therapistId: string;
  therapistName: string;
  type: OverrideType;
  tier?: TierLabel;
  customPct?: number;
  appliedBy: string;
  appliedAt: string; // ISO
  expiresAt: string; // ISO
  reason: string;
};

export type PayoutRunFilters = {
  status?: "all" | "scheduled" | "processing" | "completed" | "failed";
  region?: "all" | "ng" | "intl";
  range?: "30d" | "90d" | "all";
};

const TIER_PCT: Record<TierLabel, number> = {
  New: 70,
  T1: 75,
  "T1+": 77,
  T2: 80,
  "T2+": 82,
  T3: 85,
  "T3+": 87,
  T4: 88,
  "T4+": 90,
};

const TIER_LADDER: TierLabel[] = [
  "New",
  "T1",
  "T1+",
  "T2",
  "T2+",
  "T3",
  "T3+",
  "T4",
  "T4+",
];

const TIER_DIST: Record<Region, TierDistributionEntry[]> = {
  NG: [
    { tier: "New", therapistCount: 8 },
    { tier: "T1", therapistCount: 14 },
    { tier: "T1+", therapistCount: 6 },
    { tier: "T2", therapistCount: 11 },
    { tier: "T2+", therapistCount: 4 },
    { tier: "T3", therapistCount: 5 },
    { tier: "T3+", therapistCount: 2 },
    { tier: "T4", therapistCount: 1 },
    { tier: "T4+", therapistCount: 1 },
  ],
  "Int'l": [
    { tier: "New", therapistCount: 4 },
    { tier: "T1", therapistCount: 7 },
    { tier: "T1+", therapistCount: 3 },
    { tier: "T2", therapistCount: 8 },
    { tier: "T2+", therapistCount: 3 },
    { tier: "T3", therapistCount: 6 },
    { tier: "T3+", therapistCount: 2 },
    { tier: "T4", therapistCount: 2 },
    { tier: "T4+", therapistCount: 1 },
  ],
};

const TOP_EARNERS_NG: EarnerRow[] = [
  { rank: 1, therapistId: "t-001", therapistName: "Dr. Tola Adesina", tier: "T2+", sessionsMonth: 87, gross: 4_350_000_00, share: 3_567_000_00, platformFee: 783_000_00, currency: "NGN", region: "NG" },
  { rank: 2, therapistId: "t-004", therapistName: "Dr. Aisha Bello", tier: "T1", sessionsMonth: 41, gross: 820_000_00, share: 615_000_00, platformFee: 205_000_00, currency: "NGN", region: "NG" },
];

const TOP_EARNERS_INTL: EarnerRow[] = [
  { rank: 1, therapistId: "t-002", therapistName: "Dr. Marcus Quinn", tier: "T3+", sessionsMonth: 102, gross: 11_240_00, share: 9_778_80, platformFee: 1_461_20, currency: "USD", region: "Int'l" },
  { rank: 2, therapistId: "t-003", therapistName: "Dr. Lina Park", tier: "T2", sessionsMonth: 64, gross: 8_120_00, share: 6_496_00, platformFee: 1_624_00, currency: "USD", region: "Int'l" },
  { rank: 3, therapistId: "t-005", therapistName: "Dr. Priya Shah", tier: "T3", sessionsMonth: 0, gross: 0, share: 0, platformFee: 0, currency: "USD", region: "Int'l" },
];

const PAYOUT_RUNS: PayoutRun[] = [
  {
    id: "pr-001",
    date: "2026-06-01T00:00:00Z",
    region: "NG",
    currency: "NGN",
    therapistsCount: 0,
    totalGross: 0,
    totalPlatformFee: 0,
    totalNet: 0,
    status: "Scheduled",
    triggeredBy: "System",
    triggeredAt: "2026-05-25T00:00:00Z",
    notes: "Monthly NG payout cycle. Calculated automatically.",
    items: [],
  },
  {
    id: "pr-002",
    date: "2026-06-01T00:00:00Z",
    region: "Int'l",
    currency: "USD",
    therapistsCount: 0,
    totalGross: 0,
    totalPlatformFee: 0,
    totalNet: 0,
    status: "Scheduled",
    triggeredBy: "System",
    triggeredAt: "2026-05-25T00:00:00Z",
    notes: "Monthly International payout cycle.",
    items: [],
  },
  {
    id: "pr-003",
    date: "2026-05-01T00:00:00Z",
    region: "NG",
    currency: "NGN",
    therapistsCount: 2,
    totalGross: 5_170_000_00,
    totalPlatformFee: 988_000_00,
    totalNet: 4_182_000_00,
    status: "Completed",
    triggeredBy: "Adaeze Nwosu",
    triggeredAt: "2026-05-01T08:00:00Z",
    notes: "April NG payout · processed via Paystack transfers · all therapists confirmed receipt.",
    items: [
      { therapistId: "t-001", therapistName: "Dr. Tola Adesina", tier: "T2+", sessions: 87, gross: 4_350_000_00, commissionPct: 82, platformFee: 783_000_00, net: 3_567_000_00, status: "Paid" },
      { therapistId: "t-004", therapistName: "Dr. Aisha Bello", tier: "T1", sessions: 41, gross: 820_000_00, commissionPct: 75, platformFee: 205_000_00, net: 615_000_00, status: "Paid" },
    ],
  },
  {
    id: "pr-004",
    date: "2026-05-01T00:00:00Z",
    region: "Int'l",
    currency: "USD",
    therapistsCount: 3,
    totalGross: 19_360_00,
    totalPlatformFee: 3_085_20,
    totalNet: 16_274_80,
    status: "Completed",
    triggeredBy: "Adaeze Nwosu",
    triggeredAt: "2026-05-01T08:00:00Z",
    notes: "April International payout · processed via Stripe Connect.",
    items: [
      { therapistId: "t-002", therapistName: "Dr. Marcus Quinn", tier: "T3+", sessions: 102, gross: 11_240_00, commissionPct: 87, platformFee: 1_461_20, net: 9_778_80, status: "Paid" },
      { therapistId: "t-003", therapistName: "Dr. Lina Park", tier: "T2", sessions: 64, gross: 8_120_00, commissionPct: 80, platformFee: 1_624_00, net: 6_496_00, status: "Paid" },
      { therapistId: "t-005", therapistName: "Dr. Priya Shah", tier: "T3", sessions: 0, gross: 0, commissionPct: 85, platformFee: 0, net: 0, status: "Paid" },
    ],
  },
  {
    id: "pr-005",
    date: "2026-04-01T00:00:00Z",
    region: "NG",
    currency: "NGN",
    therapistsCount: 2,
    totalGross: 4_980_000_00,
    totalPlatformFee: 956_400_00,
    totalNet: 4_023_600_00,
    status: "Completed",
    triggeredBy: "Adaeze Nwosu",
    triggeredAt: "2026-04-01T08:00:00Z",
    items: [
      { therapistId: "t-001", therapistName: "Dr. Tola Adesina", tier: "T2", sessions: 84, gross: 4_200_000_00, commissionPct: 80, platformFee: 840_000_00, net: 3_360_000_00, status: "Paid" },
      { therapistId: "t-004", therapistName: "Dr. Aisha Bello", tier: "T1", sessions: 39, gross: 780_000_00, commissionPct: 75, platformFee: 195_000_00, net: 585_000_00, status: "Paid" },
    ],
  },
  {
    id: "pr-006",
    date: "2026-05-15T00:00:00Z",
    region: "NG",
    currency: "NGN",
    therapistsCount: 1,
    totalGross: 372_000_00,
    totalPlatformFee: 93_000_00,
    totalNet: 279_000_00,
    status: "Failed",
    triggeredBy: "System",
    triggeredAt: "2026-05-15T08:00:00Z",
    notes: "Mid-cycle adjustment payout · Paystack returned BANK_DECLINED for primary account · therapist contacted to update bank details.",
    items: [
      { therapistId: "t-006", therapistName: "Dr. Femi Ojo", tier: "T1", sessions: 18, gross: 372_000_00, commissionPct: 75, platformFee: 93_000_00, net: 279_000_00, status: "Failed" },
    ],
  },
];

const OVERRIDES: TierOverride[] = [
  {
    id: "ov-001",
    therapistId: "t-005",
    therapistName: "Dr. Priya Shah",
    type: "Tier",
    tier: "T3+",
    appliedBy: "Adaeze Nwosu",
    appliedAt: "2026-05-10T10:00:00Z",
    expiresAt: "2026-08-10T00:00:00Z",
    reason: "On medical leave from 2026-05-12. Freezing Tier+ status per US-046 sick-leave exemption — preserves rolling-average from re-calculation until return.",
  },
  {
    id: "ov-002",
    therapistId: "t-002",
    therapistName: "Dr. Marcus Quinn",
    type: "Custom %",
    customPct: 90,
    appliedBy: "Founder",
    appliedAt: "2026-04-15T00:00:00Z",
    expiresAt: "2027-04-15T00:00:00Z",
    reason: "Strategic clinical hire for trauma expansion in EU markets. 90% commission for first 12 months as per offer letter.",
  },
];

export function getCommissionStats(region?: Region) {
  const dist = region ? TIER_DIST[region] : ([] as TierDistributionEntry[]);
  const allDist = [...TIER_DIST.NG, ...TIER_DIST["Int'l"]];
  const source = region ? dist : allDist;
  const totalTherapists = source.reduce((sum, e) => sum + e.therapistCount, 0);
  const tierPlusCount = source
    .filter((e) => e.tier.endsWith("+"))
    .reduce((sum, e) => sum + e.therapistCount, 0);
  const tierPlusRate =
    totalTherapists === 0 ? 0 : Math.round((tierPlusCount / totalTherapists) * 100);
  const avgPct =
    source.length === 0
      ? 0
      : Math.round(
          source.reduce((sum, e) => sum + TIER_PCT[e.tier] * e.therapistCount, 0) /
            Math.max(totalTherapists, 1)
        );
  const lastRun = PAYOUT_RUNS.find(
    (r) =>
      r.status === "Completed" && (!region || r.region === region)
  );
  return {
    totalTherapists,
    tierPlusCount,
    tierPlusRate,
    avgPct,
    totalPaidLastRun: lastRun?.totalNet ?? 0,
    paidCurrency: lastRun?.currency ?? "NGN",
  };
}

export function getTierDistribution(region?: Region): TierDistributionEntry[] {
  if (region) return TIER_DIST[region];
  return TIER_LADDER.map((tier) => ({
    tier,
    therapistCount:
      (TIER_DIST.NG.find((e) => e.tier === tier)?.therapistCount ?? 0) +
      (TIER_DIST["Int'l"].find((e) => e.tier === tier)?.therapistCount ?? 0),
  }));
}

export function getTopEarners(region?: Region, limit = 10): EarnerRow[] {
  const source = region
    ? region === "NG"
      ? TOP_EARNERS_NG
      : TOP_EARNERS_INTL
    : [...TOP_EARNERS_NG, ...TOP_EARNERS_INTL];
  return source.slice(0, limit);
}

export function getPayoutRuns(filters: PayoutRunFilters = {}): PayoutRun[] {
  return PAYOUT_RUNS.filter((r) => {
    if (filters.status && filters.status !== "all") {
      const map: Record<string, PayoutRunStatus> = {
        scheduled: "Scheduled",
        processing: "Processing",
        completed: "Completed",
        failed: "Failed",
      };
      if (r.status !== map[filters.status]) return false;
    }
    if (filters.region && filters.region !== "all") {
      const target: Region = filters.region === "ng" ? "NG" : "Int'l";
      if (r.region !== target) return false;
    }
    return true;
  });
}

export function getPayoutRun(id: string): PayoutRun | undefined {
  return PAYOUT_RUNS.find((r) => r.id === id);
}

export function getPayoutRunStats() {
  const next = PAYOUT_RUNS.find((r) => r.status === "Scheduled");
  return {
    nextRunDate: next?.date,
    pending: PAYOUT_RUNS.filter((r) => r.status === "Scheduled" || r.status === "Processing").length,
    failed: PAYOUT_RUNS.filter((r) => r.status === "Failed").length,
  };
}

export function getActiveOverrides(): TierOverride[] {
  return OVERRIDES;
}

export function getAllTherapistsForOverride(): Array<{ id: string; name: string }> {
  return [
    { id: "t-001", name: "Dr. Tola Adesina" },
    { id: "t-002", name: "Dr. Marcus Quinn" },
    { id: "t-003", name: "Dr. Lina Park" },
    { id: "t-004", name: "Dr. Aisha Bello" },
    { id: "t-005", name: "Dr. Priya Shah" },
    { id: "t-006", name: "Dr. Femi Ojo" },
  ];
}

export const ALL_TIER_LABELS = TIER_LADDER;
export const TIER_PCT_MAP = TIER_PCT;

export function formatMoney(amount: number, currency: Currency): string {
  if (currency === "NGN") {
    if (amount >= 1_000_000_00) return `₦${(amount / 100 / 1_000_000).toFixed(2)}M`;
    if (amount >= 100_000_00) return `₦${(amount / 100 / 1000).toFixed(0)}k`;
    return `₦${(amount / 100).toLocaleString()}`;
  }
  if (amount >= 1_000_000_00) return `$${(amount / 100 / 1_000_000).toFixed(2)}M`;
  if (amount >= 10_000_00) return `$${(amount / 100 / 1000).toFixed(1)}k`;
  return `$${(amount / 100).toLocaleString()}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add lib/dummy/commission.ts && \
git commit -m "Add commission + payouts + overrides dummy data"
```

---

## Task CO2: A9.1 Commission analytics

**File 1:** `admin/components/commission/tier-chart.tsx`

```tsx
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  getTierDistribution,
  type Region,
} from "@/lib/dummy/commission";

type Props = {
  region?: Region;
};

const config = {
  therapistCount: { label: "Therapists", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function TierChart({ region }: Props) {
  const data = getTierDistribution(region);

  return (
    <ChartContainer config={config} className="h-[280px] w-full">
      <BarChart data={data} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} className="stroke-border/50" />
        <XAxis
          dataKey="tier"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          className="text-xs"
          width={32}
          allowDecimals={false}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <Bar
          dataKey="therapistCount"
          fill="var(--color-therapistCount)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
```

**File 2:** `admin/components/commission/top-earners-table.tsx`

```tsx
"use client";

import Link from "next/link";

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
  formatMoney,
  getTopEarners,
  type Region,
} from "@/lib/dummy/commission";

type Props = {
  region?: Region;
};

export function TopEarnersTable({ region }: Props) {
  const rows = getTopEarners(region);

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No earners in this view.
      </p>
    );
  }

  return (
    <div className="rounded-md border border-border/60 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Therapist</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Sessions (mo)</TableHead>
            <TableHead>Gross</TableHead>
            <TableHead>Therapist share</TableHead>
            <TableHead>Platform fee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={`${r.region}-${r.rank}-${r.therapistId}`}>
              <TableCell className="tabular-nums font-medium">{r.rank}</TableCell>
              <TableCell>
                <Link
                  href={`/therapists/${r.therapistId}`}
                  className="hover:underline"
                >
                  {r.therapistName}
                </Link>
                <span className="text-xs text-muted-foreground ml-1.5">
                  ({r.region})
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal">
                  {r.tier}
                </Badge>
              </TableCell>
              <TableCell className="tabular-nums">{r.sessionsMonth}</TableCell>
              <TableCell className="tabular-nums">
                {formatMoney(r.gross, r.currency)}
              </TableCell>
              <TableCell className="tabular-nums font-medium">
                {formatMoney(r.share, r.currency)}
              </TableCell>
              <TableCell className="tabular-nums text-muted-foreground">
                {formatMoney(r.platformFee, r.currency)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

**File 3:** `admin/app/(dashboard)/commission/page.tsx`

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TierChart } from "@/components/commission/tier-chart";
import { TopEarnersTable } from "@/components/commission/top-earners-table";

import {
  formatMoney,
  getCommissionStats,
  type Region,
} from "@/lib/dummy/commission";

type RegionTab = "all" | "ng" | "intl";

function tabToRegion(t: RegionTab): Region | undefined {
  if (t === "ng") return "NG";
  if (t === "intl") return "Int'l";
  return undefined;
}

export default function CommissionPage() {
  const [tab, setTab] = useState<RegionTab>("all");
  const region = tabToRegion(tab);
  const stats = getCommissionStats(region);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            Commission &amp; payouts
          </h1>
          <p className="text-sm text-muted-foreground">
            {stats.tierPlusCount} of {stats.totalTherapists} on Tier+ this month ·
            avg therapist share {stats.avgPct}%
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/commission/payouts">Payout runs →</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/commission/overrides">Tier overrides →</Link>
          </Button>
        </div>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as RegionTab)}>
        <TabsList>
          <TabsTrigger value="all">All regions</TabsTrigger>
          <TabsTrigger value="ng">Nigeria</TabsTrigger>
          <TabsTrigger value="intl">International</TabsTrigger>
        </TabsList>
      </Tabs>

      <section
        aria-label="KPI strip"
        className="grid grid-cols-1 gap-3 lg:grid-cols-3"
      >
        <Card className="gap-1 py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Tier+ activation rate
            </p>
          </CardHeader>
          <CardContent className="px-5">
            <p className="font-heading text-2xl tabular-nums">
              {stats.tierPlusRate}%
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.tierPlusCount} of {stats.totalTherapists} therapists
            </p>
          </CardContent>
        </Card>

        <Card className="gap-1 py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Avg commission % paid
            </p>
          </CardHeader>
          <CardContent className="px-5">
            <p className="font-heading text-2xl tabular-nums">{stats.avgPct}%</p>
            <p className="text-xs text-muted-foreground">
              Weighted by therapist count per tier
            </p>
          </CardContent>
        </Card>

        <Card className="gap-1 py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Last payout total
            </p>
          </CardHeader>
          <CardContent className="px-5">
            <p className="font-heading text-2xl tabular-nums">
              {formatMoney(stats.totalPaidLastRun, stats.paidCurrency)}
            </p>
            <p className="text-xs text-muted-foreground">
              Most recent completed run
            </p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Tier distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <TierChart region={region} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Top earners (this month)</CardTitle>
          <Button variant="outline" size="sm" disabled>
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <TopEarnersTable region={region} />
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
const r = await fetch('http://localhost:3000/commission');
const html = await r.text();
console.log(r.status, html.includes('Commission') && html.includes('Tier distribution') ? 'OK' : 'missing');
```
Expected: `200 OK`.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/commission/tier-chart.tsx components/commission/top-earners-table.tsx "app/(dashboard)/commission/page.tsx" && \
git commit -m "Add A9.1 commission analytics page"
```

---

## Task CO3: A9.2 Payout runs list + detail

**File 1:** `admin/components/commission/payout-runs-columns.tsx`

```tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import {
  formatDate,
  formatMoney,
  type PayoutRun,
} from "@/lib/dummy/commission";

const statusVariant: Record<
  PayoutRun["status"],
  "secondary" | "outline" | "destructive" | "default"
> = {
  Scheduled: "outline",
  Processing: "default",
  Completed: "secondary",
  Failed: "destructive",
};

export const payoutRunsColumns: ColumnDef<PayoutRun>[] = [
  {
    accessorKey: "date",
    header: "Run date",
    cell: ({ row }) => (
      <span className="tabular-nums text-sm">{formatDate(row.original.date)}</span>
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
    accessorKey: "therapistsCount",
    header: "Therapists",
    cell: ({ row }) => (
      <span className="tabular-nums text-sm">{row.original.therapistsCount}</span>
    ),
  },
  {
    accessorKey: "totalNet",
    header: "Total payout",
    cell: ({ row }) => (
      <span className="tabular-nums font-medium">
        {formatMoney(row.original.totalNet, row.original.currency)}
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
        href={`/commission/payouts/${row.original.id}`}
        aria-label={`Open run ${row.original.id}`}
      >
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    ),
  },
];
```

**File 2:** `admin/components/commission/payout-runs-filters.tsx`

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

export function PayoutRunsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const status = params.get("status") ?? "all";

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
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
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
          value={params.get("range") ?? "all"}
          onValueChange={(v) => setParam("range", v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
```

**File 3:** `admin/app/(dashboard)/commission/payouts/page.tsx`

```tsx
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/therapists/data-table";

import { payoutRunsColumns } from "@/components/commission/payout-runs-columns";
import { PayoutRunsFilters } from "@/components/commission/payout-runs-filters";

import {
  formatDate,
  getPayoutRuns,
  getPayoutRunStats,
  type PayoutRunFilters,
} from "@/lib/dummy/commission";

type SearchParams = Promise<{
  status?: string;
  region?: string;
  range?: string;
}>;

function asFilters(p: Awaited<SearchParams>): PayoutRunFilters {
  return {
    status: (p.status as PayoutRunFilters["status"]) ?? "all",
    region: p.region as PayoutRunFilters["region"],
    range: (p.range as PayoutRunFilters["range"]) ?? "all",
  };
}

export default async function PayoutRunsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const runs = getPayoutRuns(filters);
  const stats = getPayoutRunStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Payout runs</h1>
          <p className="text-sm text-muted-foreground">
            {stats.nextRunDate
              ? `Next scheduled ${formatDate(stats.nextRunDate)} · `
              : ""}
            {stats.pending} pending · {stats.failed} need attention
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/commission">← Commission</Link>
        </Button>
      </header>

      <PayoutRunsFilters />

      <DataTable
        columns={payoutRunsColumns}
        data={runs}
        emptyMessage="No payout runs in this view."
      />
    </div>
  );
}
```

**File 4:** `admin/components/commission/payout-run-detail.tsx`

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  formatDate,
  formatMoney,
  type PayoutRun,
} from "@/lib/dummy/commission";

const runStatusVariant: Record<
  PayoutRun["status"],
  "secondary" | "outline" | "destructive" | "default"
> = {
  Scheduled: "outline",
  Processing: "default",
  Completed: "secondary",
  Failed: "destructive",
};

const itemStatusVariant: Record<
  "Paid" | "Pending" | "Failed",
  "secondary" | "outline" | "destructive"
> = {
  Paid: "secondary",
  Pending: "outline",
  Failed: "destructive",
};

type Props = {
  run: PayoutRun;
};

export function PayoutRunDetail({ run }: Props) {
  return (
    <div className="space-y-6">
      <Link
        href="/commission/payouts"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Payout runs
      </Link>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            Payout run · {formatDate(run.date)}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant={runStatusVariant[run.status]}>{run.status}</Badge>
            <Badge variant="outline" className="font-normal">
              {run.region}
            </Badge>
            <span className="text-muted-foreground">
              Triggered by {run.triggeredBy}
            </span>
          </div>
        </div>
        <Button variant="outline" disabled>
          Export CSV
        </Button>
      </header>

      <section
        aria-label="Summary"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {[
          { label: "Therapists", value: run.therapistsCount.toString() },
          { label: "Total gross", value: formatMoney(run.totalGross, run.currency) },
          { label: "Total platform fee", value: formatMoney(run.totalPlatformFee, run.currency) },
          { label: "Total payout", value: formatMoney(run.totalNet, run.currency) },
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

      <Card>
        <CardHeader>
          <CardTitle>Itemised therapists</CardTitle>
        </CardHeader>
        <CardContent>
          {run.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No items yet — run hasn&apos;t executed.
            </p>
          ) : (
            <div className="rounded-md border border-border/60 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Therapist</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Gross</TableHead>
                    <TableHead>Commission %</TableHead>
                    <TableHead>Platform fee</TableHead>
                    <TableHead>Net payout</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {run.items.map((item) => (
                    <TableRow key={item.therapistId}>
                      <TableCell>
                        <Link
                          href={`/therapists/${item.therapistId}`}
                          className="hover:underline"
                        >
                          {item.therapistName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {item.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {item.sessions}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {formatMoney(item.gross, run.currency)}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {item.commissionPct}%
                      </TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {formatMoney(item.platformFee, run.currency)}
                      </TableCell>
                      <TableCell className="tabular-nums font-medium">
                        {formatMoney(item.net, run.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={itemStatusVariant[item.status]}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {run.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Run notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {run.notes}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

**File 5:** `admin/app/(dashboard)/commission/payouts/[id]/page.tsx`

```tsx
import { notFound } from "next/navigation";

import { PayoutRunDetail } from "@/components/commission/payout-run-detail";
import { getPayoutRun } from "@/lib/dummy/commission";

type Params = Promise<{ id: string }>;

export default async function PayoutRunDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const run = getPayoutRun(id);
  if (!run) notFound();

  return <PayoutRunDetail run={run} />;
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

```js
for (const url of ['/commission/payouts', '/commission/payouts?status=failed', '/commission/payouts/pr-003', '/commission/payouts/pr-006', '/commission/payouts/does-not-exist']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: list + pr-003 + pr-006 → 200; does-not-exist → 404.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/commission/payout-runs-columns.tsx components/commission/payout-runs-filters.tsx "app/(dashboard)/commission/payouts/page.tsx" components/commission/payout-run-detail.tsx "app/(dashboard)/commission/payouts/[id]/page.tsx" && \
git commit -m "Add A9.2 payout runs list + detail pages"
```

---

## Task CO4: A9.3 Tier overrides

**File 1:** `admin/components/commission/override-form.tsx`

```tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  ALL_TIER_LABELS,
  getAllTherapistsForOverride,
  type OverrideType,
  type TierLabel,
} from "@/lib/dummy/commission";

export function OverrideForm() {
  const therapists = getAllTherapistsForOverride();
  const [therapistId, setTherapistId] = useState("");
  const [type, setType] = useState<OverrideType>("Tier");
  const [tier, setTier] = useState<TierLabel | "">("");
  const [customPct, setCustomPct] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [reason, setReason] = useState("");

  const reset = () => {
    setTherapistId("");
    setType("Tier");
    setTier("");
    setCustomPct("");
    setExpiresAt("");
    setReason("");
  };

  const handleSubmit = () => {
    if (!therapistId) return toast.error("Select a therapist");
    if (type === "Tier" && !tier) return toast.error("Select an override tier");
    if (type === "Custom %") {
      const pct = Number(customPct);
      if (!pct || pct <= 0 || pct > 100) {
        return toast.error("Custom % must be between 0 and 100");
      }
    }
    if (!expiresAt) return toast.error("Set an expiry date");
    if (reason.trim().length < 10) {
      return toast.error("Reason must be at least 10 characters");
    }
    const therapist = therapists.find((t) => t.id === therapistId);
    toast.success(`Override applied for ${therapist?.name ?? therapistId}`, {
      description:
        type === "Tier"
          ? `Tier set to ${tier}. Expires ${expiresAt}.`
          : `Custom ${customPct}% set. Expires ${expiresAt}.`,
    });
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New override</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="therapist">Therapist</Label>
          <Select value={therapistId} onValueChange={setTherapistId}>
            <SelectTrigger id="therapist" className="w-full">
              <SelectValue placeholder="Select therapist…" />
            </SelectTrigger>
            <SelectContent>
              {therapists.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Override type</Label>
          <RadioGroup
            value={type}
            onValueChange={(v) => setType(v as OverrideType)}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Tier" id="ov-tier" />
              <Label htmlFor="ov-tier" className="font-normal">
                Set tier (uses PRD tier ladder rate)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Custom %" id="ov-custom" />
              <Label htmlFor="ov-custom" className="font-normal">
                Custom % (bespoke rate)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {type === "Tier" ? (
          <div className="space-y-2">
            <Label htmlFor="tier-select">Tier</Label>
            <Select value={tier} onValueChange={(v) => setTier(v as TierLabel)}>
              <SelectTrigger id="tier-select" className="w-[160px]">
                <SelectValue placeholder="Select tier…" />
              </SelectTrigger>
              <SelectContent>
                {ALL_TIER_LABELS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="custom-pct">Custom % (1–100)</Label>
            <Input
              id="custom-pct"
              type="number"
              step="0.5"
              min="0"
              max="100"
              value={customPct}
              onChange={(e) => setCustomPct(e.target.value)}
              placeholder="e.g. 90"
              className="w-[160px]"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="expires">Expires</Label>
          <Input
            id="expires"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-[200px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason (audit log)</Label>
          <Textarea
            id="reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="E.g. On medical leave — freezing Tier+ status per US-046 sick-leave exemption."
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
          <Button onClick={handleSubmit}>Apply override</Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

**File 2:** `admin/components/commission/active-overrides-table.tsx`

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  formatDate,
  getActiveOverrides,
  type TierOverride,
} from "@/lib/dummy/commission";

export function ActiveOverridesTable() {
  const overrides = getActiveOverrides();
  const [removeTarget, setRemoveTarget] = useState<TierOverride | null>(null);

  const handleRemove = () => {
    if (!removeTarget) return;
    toast.success(`Override removed for ${removeTarget.therapistName}`, {
      description: "Therapist's tier reverts to automatic calculation.",
    });
    setRemoveTarget(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active overrides</CardTitle>
        <span className="text-xs text-muted-foreground">
          {overrides.length} active
        </span>
      </CardHeader>
      <CardContent>
        {overrides.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No active overrides. Therapists earn at their auto-calculated tier rate.
          </p>
        ) : (
          <div className="rounded-md border border-border/60 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Therapist</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Override</TableHead>
                  <TableHead>Applied by</TableHead>
                  <TableHead>Applied at</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overrides.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>
                      <Link
                        href={`/therapists/${o.therapistId}`}
                        className="font-medium hover:underline"
                      >
                        {o.therapistName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {o.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {o.type === "Tier" ? o.tier : `${o.customPct}%`}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {o.appliedBy}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {formatDate(o.appliedAt)}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {formatDate(o.expiresAt)}
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger className="text-sm text-left hover:underline">
                          {o.reason.length > 40
                            ? o.reason.slice(0, 37) + "…"
                            : o.reason}
                        </PopoverTrigger>
                        <PopoverContent className="text-sm max-w-sm">
                          {o.reason}
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRemoveTarget(o)}
                      >
                        <Trash2 className="size-3.5 mr-1" />
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog
        open={removeTarget !== null}
        onOpenChange={(o) => !o && setRemoveTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove override?</DialogTitle>
            <DialogDescription>
              The therapist will immediately revert to their auto-calculated tier
              rate. This action is logged in the audit trail.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemove}>
              Remove override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
```

**File 3:** `admin/app/(dashboard)/commission/overrides/page.tsx`

```tsx
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { OverrideForm } from "@/components/commission/override-form";
import { ActiveOverridesTable } from "@/components/commission/active-overrides-table";

import { getActiveOverrides } from "@/lib/dummy/commission";

export default function OverridesPage() {
  const count = getActiveOverrides().length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Tier overrides</h1>
          <p className="text-sm text-muted-foreground">
            Super-admin only · {count} active override{count === 1 ? "" : "s"} ·
            use sparingly
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/commission">← Commission</Link>
        </Button>
      </header>

      <div className="flex items-center gap-3 rounded-md border border-amber-500/40 bg-amber-50/60 dark:bg-amber-950/20 px-4 py-3">
        <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-sm">
          Overrides bypass automatic tier calculation. They&apos;re audited and
          reviewed monthly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
        <OverrideForm />
        <ActiveOverridesTable />
      </div>
    </div>
  );
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

```js
const r = await fetch('http://localhost:3000/commission/overrides');
const html = await r.text();
console.log(r.status, html.includes('Tier overrides') && html.includes('Active overrides') ? 'OK' : 'missing');
```
Expected: `200 OK`.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/commission/override-form.tsx components/commission/active-overrides-table.tsx "app/(dashboard)/commission/overrides/page.tsx" && \
git commit -m "Add A9.3 tier overrides page (super-admin)"
```

---

## Task CO5: Final smoke + push

**Step 1 — tsc**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

**Step 2 — smoke**

```js
for (const url of [
  '/commission',
  '/commission/payouts',
  '/commission/payouts?status=completed',
  '/commission/payouts?status=failed',
  '/commission/payouts/pr-003',
  '/commission/payouts/pr-004',
  '/commission/payouts/pr-006',
  '/commission/payouts/does-not-exist',
  '/commission/overrides',
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

- Real payout SDK integration
- Real Tier+ auto-activation cron
- Bulk override apply
- Override approval workflow (2nd super-admin sign-off)
- Per-session commission audit trail (A11.3)
- Loading skeletons
- Mobile card view
