# Admin Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the admin dashboard landing page (`/dashboard`) for the Mindenity admin app per the design spec at `docs/superpowers/specs/2026-05-26-admin-dashboard-design.md`.

**Architecture:** Single curated page composed of 9 small section components living in `admin/components/dashboard/`. All data dummy and lives in `admin/lib/dummy/dashboard.ts`. UI-only prototype — no backend, no API, no real auth. The dashboard route group `(dashboard)` ships with an **interim minimal layout** until the sidebar/topbar spec lands.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 · shadcn/ui (radix-luma preset) · Recharts (via shadcn `chart`).

**Verification strategy:** This is a UI prototype with dummy data. Replace unit-test TDD with three automated gates after each task:
1. `pnpm tsc --noEmit` (type check)
2. `pnpm next build` skipped during dev (slow); use dev compile signal from `pnpm dev` log
3. `fetch http://localhost:3000/dashboard` returns 200

Plus a manual visual check by the engineer (load the URL, click through, confirm shape matches spec). The dev server is already running on port 3000 (background task launched earlier — check it's still up; if not, run `cd admin && pnpm dev`).

**Spec reference:** All `§` references point to sections in `docs/superpowers/specs/2026-05-26-admin-dashboard-design.md`.

---

## File structure

| File | Role | Spec ref |
|---|---|---|
| `admin/app/(dashboard)/layout.tsx` | Interim minimal layout for the dashboard route group | §9 (interim unblocking) |
| `admin/app/(dashboard)/dashboard/page.tsx` | Dashboard page entry. Reads URL search params, composes sections. | §4, §6 |
| `admin/lib/dummy/types.ts` | All shared TypeScript types | §6 |
| `admin/lib/dummy/dashboard.ts` | `getDashboardData(window, region)` returning typed dummy data | §6 |
| `admin/components/dashboard/page-header.tsx` | §4.1 | |
| `admin/components/dashboard/crisis-tier.tsx` | §4.2 conditional alert strip | |
| `admin/components/dashboard/kpi-strip.tsx` | §4.3 four-card KPI row | |
| `admin/components/dashboard/revenue-chart.tsx` | §4.4 dual-axis area chart | |
| `admin/components/dashboard/operations-zone.tsx` | §4.5 two-card row (verifications + pricing approvals) | |
| `admin/components/dashboard/plan-coverage-spotlight.tsx` | §4.6 conditional spotlight card | |
| `admin/components/dashboard/clinical-safety-zone.tsx` | §4.7 two-card row (crisis + risk forms) | |
| `admin/components/dashboard/onboarding-funnel.tsx` | §4.8 4-step funnel | |
| `admin/components/dashboard/recent-activity.tsx` | §4.9 5-row feed | |

Modifications:

| File | Change |
|---|---|
| `admin/app/(auth)/2fa/page.tsx` | Update `router.push("/")` → `router.push("/dashboard")` |
| `admin/app/page.tsx` | Update redirect target from `/login` → `/dashboard` (root sends authenticated users to dashboard; this prototype has no auth state, but the link reflects intent) |

---

## Task 0: Verify environment

**Files:** none

- [ ] **Step 1: Check dev server is running**

Run:
```bash
fetch http://localhost:3000/login   # via ctx_execute javascript fetch
```

Expected: status `200`. If not 200, restart the dev server:
```bash
cd admin && pnpm dev
```
Wait for `Ready in <ms>ms` in the output.

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
cd admin && pnpm tsc --noEmit
```

Expected: exit code 0, no errors.

---

## Task 1: Install missing shadcn components

**Files:** `admin/components/ui/badge.tsx`, `admin/components/ui/select.tsx`, `admin/components/ui/tabs.tsx`, `admin/components/ui/table.tsx`, `admin/components/ui/chart.tsx`, `admin/components/ui/skeleton.tsx`, `admin/components/ui/dropdown-menu.tsx`, `admin/components/ui/separator.tsx`, `admin/components/ui/tooltip.tsx` (all created by shadcn CLI)

- [ ] **Step 1: Install components via shadcn CLI**

Run:
```bash
cd admin && pnpm dlx shadcn@latest add badge select tabs table chart skeleton dropdown-menu separator tooltip -y
```

Expected: 9 files created in `admin/components/ui/`. Recharts installed as transitive dep of `chart`.

- [ ] **Step 2: Verify TypeScript still compiles**

Run:
```bash
cd admin && pnpm tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
cd admin && git add components/ui/ package.json pnpm-lock.yaml
git commit -m "Add shadcn components needed for admin dashboard"
```

---

## Task 2: Dummy data types

**Files:**
- Create: `admin/lib/dummy/types.ts`

- [ ] **Step 1: Create types file**

Write `admin/lib/dummy/types.ts`:

```ts
// Shared types for admin dashboard dummy data.
// All money values use minor units to avoid float math (NGN kobo, USD cents).

export type Window = "7d" | "30d" | "90d" | "ytd";
export type Region = "all" | "ng" | "intl";

export type Money = {
  amount: number; // minor units
  currency: "NGN" | "USD";
};

export type Delta = {
  pctChange: number; // signed percentage, e.g. +6.1
  direction: "up" | "down" | "flat";
};

export type KpiCard = {
  id: "mrr" | "subscribers" | "therapists" | "sessions";
  label: string;
  primary: string; // formatted display value
  secondary: string; // sub-line
  delta: string; // formatted delta line
  deltaDirection: "up" | "down" | "flat";
};

export type RevenuePoint = {
  date: string; // ISO date or label like "Mon 19"
  ngn: number; // NGN amount (whole units for chart simplicity)
  usd: number;
  sessions: number;
};

export type VerificationItem = {
  id: string;
  name: string;
  country: string;
  submittedAgo: string; // human "2h ago"
};

export type PricingApprovalItem = {
  id: string;
  therapist: string;
  plan: string;
  deltaFromBand: string; // "+25% over band"
  submittedAgo: string;
  isOverdue: boolean;
};

export type PlanCoverageItem = {
  plan: string;
  region: "NG" | "Int'l";
  therapists: number;
  gap: number; // therapists still needed to hit threshold (3)
};

export type CrisisItem = {
  id: string;
  clientAlias: string;
  therapist: string;
  loggedAgo: string;
  status: "active" | "responded" | "escalated" | "resolved";
};

export type RiskFormItem = {
  id: string;
  clientAlias: string;
  therapist: string;
  region: "NG" | "Int'l";
  followUpDue: string; // "due tomorrow"
};

export type FunnelStep = {
  label: string;
  count: number;
  conversionPct: number | null; // null for first step
};

export type ActivityItem = {
  id: string;
  actor: string;
  action: string; // verb phrase
  target: string;
  timestampAgo: string;
};

export type CrisisTierState = {
  crisisCount: number;
  verificationsOverdue: number;
  pricingApprovalsOverdue: number;
};

export type DashboardData = {
  window: Window;
  region: Region;
  updatedAt: string; // ISO timestamp
  crisisTier: CrisisTierState;
  kpis: KpiCard[];
  revenue: RevenuePoint[];
  queues: {
    verifications: { pending: number; items: VerificationItem[] };
    pricingApprovals: {
      pending: number;
      overdue: number;
      items: PricingApprovalItem[];
    };
  };
  planCoverage: PlanCoverageItem[]; // empty array = no spotlight
  clinical: {
    crisis: {
      activeCount: number;
      avgResponse: string;
      escalations: number;
      items: CrisisItem[];
    };
    risk: {
      submitted: number;
      redFlags: number;
      followUpOverdue: number;
      items: RiskFormItem[];
    };
  };
  funnel: {
    steps: FunnelStep[];
  };
  activity: ActivityItem[];
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
cd admin && pnpm tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
cd admin && git add lib/dummy/types.ts
git commit -m "Add dashboard data types"
```

---

## Task 3: Dummy data module

**Files:**
- Create: `admin/lib/dummy/dashboard.ts`

- [ ] **Step 1: Create dummy data module**

Write `admin/lib/dummy/dashboard.ts`:

```ts
import type {
  DashboardData,
  Region,
  Window,
} from "@/lib/dummy/types";

// Single fixed snapshot. Window + region toggles change displayed metadata but
// not the underlying dummy points (prototype constraint).

const REVENUE_7D = [
  { date: "Tue 20", ngn: 612_000, usd: 1_120, sessions: 68 },
  { date: "Wed 21", ngn: 588_000, usd: 1_240, sessions: 72 },
  { date: "Thu 22", ngn: 642_000, usd: 1_080, sessions: 74 },
  { date: "Fri 23", ngn: 701_000, usd: 1_360, sessions: 81 },
  { date: "Sat 24", ngn: 520_000, usd: 980, sessions: 58 },
  { date: "Sun 25", ngn: 498_000, usd: 1_020, sessions: 61 },
  { date: "Mon 26", ngn: 689_000, usd: 1_650, sessions: 98 },
];

export function getDashboardData(window: Window, region: Region): DashboardData {
  // For the prototype, the same dummy set is returned regardless of window/region;
  // a "(filtered)" tag is appended to the subtitle copy upstream when region != "all".
  void window;
  void region;

  return {
    window,
    region,
    updatedAt: new Date().toISOString(),
    crisisTier: {
      crisisCount: 2,
      verificationsOverdue: 5,
      pricingApprovalsOverdue: 1,
    },
    kpis: [
      {
        id: "mrr",
        label: "MRR",
        primary: "₦4.2M\n$8,450",
        secondary: "Region split",
        delta: "NGN +6.1% · USD +2.4%",
        deltaDirection: "up",
      },
      {
        id: "subscribers",
        label: "Active subscribers",
        primary: "1,287",
        secondary: "NG 1,104 · Int'l 183",
        delta: "+42 this week",
        deltaDirection: "up",
      },
      {
        id: "therapists",
        label: "Active therapists",
        primary: "94",
        secondary: "Verified · accepting bookings",
        delta: "+3 onboarded · 2 pending verif",
        deltaDirection: "up",
      },
      {
        id: "sessions",
        label: "Sessions completed (7d)",
        primary: "512",
        secondary: "Avg 5.4 / active client",
        delta: "+8.3%",
        deltaDirection: "up",
      },
    ],
    revenue: REVENUE_7D,
    queues: {
      verifications: {
        pending: 5,
        items: [
          { id: "v1", name: "Dr. Aisha Bello", country: "Nigeria", submittedAgo: "2h ago" },
          { id: "v2", name: "Dr. Marcus Quinn", country: "UK", submittedAgo: "5h ago" },
          { id: "v3", name: "Dr. Priya Shah", country: "Canada", submittedAgo: "1d ago" },
        ],
      },
      pricingApprovals: {
        pending: 1,
        overdue: 1,
        items: [
          {
            id: "p1",
            therapist: "Dr. Tola Adesina",
            plan: "Together · Couple",
            deltaFromBand: "+25% over band",
            submittedAgo: "4d ago",
            isOverdue: true,
          },
          {
            id: "p2",
            therapist: "Dr. Lina Park",
            plan: "Harmony · Couple Monthly",
            deltaFromBand: "+10% over band",
            submittedAgo: "1d ago",
            isOverdue: false,
          },
        ],
      },
    },
    planCoverage: [
      { plan: "Family Care · Family Monthly", region: "NG", therapists: 2, gap: 1 },
      { plan: "Restore · Couple Monthly", region: "Int'l", therapists: 1, gap: 2 },
      { plan: "Home · Family PAYG", region: "Int'l", therapists: 2, gap: 1 },
    ],
    clinical: {
      crisis: {
        activeCount: 2,
        avgResponse: "4m 12s",
        escalations: 0,
        items: [
          { id: "c1", clientAlias: "Client-9128", therapist: "Dr. Tola Adesina", loggedAgo: "12m ago", status: "active" },
          { id: "c2", clientAlias: "Client-8842", therapist: "Dr. Marcus Quinn", loggedAgo: "37m ago", status: "responded" },
          { id: "c3", clientAlias: "Client-7710", therapist: "Dr. Priya Shah", loggedAgo: "2h ago", status: "resolved" },
        ],
      },
      risk: {
        submitted: 12,
        redFlags: 2,
        followUpOverdue: 1,
        items: [
          { id: "r1", clientAlias: "Client-9128", therapist: "Dr. Tola Adesina", region: "NG", followUpDue: "overdue 1d" },
          { id: "r2", clientAlias: "Client-8842", therapist: "Dr. Marcus Quinn", region: "Int'l", followUpDue: "due tomorrow" },
        ],
      },
    },
    funnel: {
      steps: [
        { label: "Signups", count: 312, conversionPct: null },
        { label: "Intake done", count: 247, conversionPct: 79 },
        { label: "Plan purchased", count: 168, conversionPct: 68 },
        { label: "First session", count: 142, conversionPct: 85 },
      ],
    },
    activity: [
      { id: "a1", actor: "Adaeze", action: "verified", target: "Dr. Tola Adesina", timestampAgo: "4m ago" },
      { id: "a2", actor: "Sarah", action: "resolved crisis", target: "#4318", timestampAgo: "2h ago" },
      { id: "a3", actor: "System", action: "auto-paused promo", target: "May Onboarding (NG)", timestampAgo: "3h ago" },
      { id: "a4", actor: "Adaeze", action: "updated pricing band", target: "Together NGN", timestampAgo: "5h ago" },
      { id: "a5", actor: "Marcus", action: "approved custom pricing", target: "Dr. Lina Park", timestampAgo: "1d ago" },
    ],
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
cd admin && pnpm tsc --noEmit
```

Expected: exit code 0.

- [ ] **Step 3: Commit**

```bash
cd admin && git add lib/dummy/dashboard.ts
git commit -m "Add dashboard dummy data module"
```

---

## Task 4: Interim dashboard route group + layout

**Files:**
- Create: `admin/app/(dashboard)/layout.tsx`
- Create: `admin/app/(dashboard)/dashboard/page.tsx` (placeholder body only — full composition added in Task 14)

- [ ] **Step 1: Create dashboard route group folder structure**

Run:
```bash
mkdir -p "admin/app/(dashboard)/dashboard"
```

- [ ] **Step 2: Create interim layout**

Write `admin/app/(dashboard)/layout.tsx`:

```tsx
// Interim layout for the (dashboard) route group.
// Replaced when the global-chrome spec (sidebar + topbar) lands.
// Per design spec §9 interim-unblocking note.

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <main className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 3: Create placeholder dashboard page**

Write `admin/app/(dashboard)/dashboard/page.tsx`:

```tsx
export default function DashboardPage() {
  return (
    <div className="space-y-2">
      <h1 className="font-heading text-3xl tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground text-sm">
        Sections render here as they ship.
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Verify route renders**

Run via `ctx_execute` (JavaScript):
```js
const r = await fetch('http://localhost:3000/dashboard');
console.log(r.status);
```

Expected: `200`.

- [ ] **Step 5: Commit**

```bash
cd admin && git add "app/(dashboard)/"
git commit -m "Scaffold (dashboard) route group with interim layout"
```

---

## Task 5: PageHeader component (§4.1)

**Files:**
- Create: `admin/components/dashboard/page-header.tsx`

- [ ] **Step 1: Create PageHeader**

Write `admin/components/dashboard/page-header.tsx`:

```tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Region, Window } from "@/lib/dummy/types";

const WINDOW_LABELS: Record<Window, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  ytd: "Year to date",
};

type Props = {
  window: Window;
  region: Region;
  updatedLabel: string; // e.g. "Updated 2 min ago"
};

export function PageHeader({ window, region, updatedLabel }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const setParam = (key: "window" | "region", value: string) => {
    const next = new URLSearchParams(params);
    next.set(key, value);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  };

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Mon, 26 May · Hello, Adaeze
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={window}
          onValueChange={(value) => setParam("window", value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(WINDOW_LABELS) as [Window, string][]).map(
              ([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Tabs
          value={region}
          onValueChange={(value) => setParam("region", value)}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="ng">NG</TabsTrigger>
            <TabsTrigger value="intl">Int&apos;l</TabsTrigger>
          </TabsList>
        </Tabs>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Export</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>CSV (prototype)</DropdownMenuItem>
            <DropdownMenuItem disabled>PDF (prototype)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-xs text-muted-foreground tabular-nums">
          {updatedLabel}
        </span>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Render in page**

Replace `admin/app/(dashboard)/dashboard/page.tsx` body:

```tsx
import { getDashboardData } from "@/lib/dummy/dashboard";
import type { Region, Window } from "@/lib/dummy/types";
import { PageHeader } from "@/components/dashboard/page-header";

type SearchParams = Promise<{ window?: string; region?: string }>;

function asWindow(v?: string): Window {
  return v === "30d" || v === "90d" || v === "ytd" ? v : "7d";
}
function asRegion(v?: string): Region {
  return v === "ng" || v === "intl" ? v : "all";
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const window = asWindow(params.window);
  const region = asRegion(params.region);
  const data = getDashboardData(window, region);

  return (
    <div className="space-y-8">
      <PageHeader window={window} region={region} updatedLabel="Updated just now" />
    </div>
  );
}
```

- [ ] **Step 3: Verify**

Run:
```bash
cd admin && pnpm tsc --noEmit
```
Expected: exit code 0.

Via `ctx_execute`:
```js
for (const url of ['/dashboard', '/dashboard?window=30d', '/dashboard?region=ng']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: all `200`.

- [ ] **Step 4: Commit**

```bash
cd admin && git add components/dashboard/page-header.tsx "app/(dashboard)/dashboard/page.tsx"
git commit -m "Add dashboard PageHeader with window + region URL state"
```

---

## Task 6: CrisisTier component (§4.2)

**Files:**
- Create: `admin/components/dashboard/crisis-tier.tsx`

- [ ] **Step 1: Create CrisisTier**

Write `admin/components/dashboard/crisis-tier.tsx`:

```tsx
import Link from "next/link";

import { Button } from "@/components/ui/button";

import type { CrisisTierState } from "@/lib/dummy/types";

type Props = {
  state: CrisisTierState;
};

export function CrisisTier({ state }: Props) {
  const { crisisCount, verificationsOverdue, pricingApprovalsOverdue } = state;
  const total = crisisCount + verificationsOverdue + pricingApprovalsOverdue;

  if (total === 0) return null;

  const parts: string[] = [];
  if (crisisCount > 0) parts.push(`${crisisCount} crisis alerts active`);
  if (verificationsOverdue > 0)
    parts.push(`${verificationsOverdue} verifications pending review`);
  if (pricingApprovalsOverdue > 0)
    parts.push(
      `${pricingApprovalsOverdue} pricing approval${
        pricingApprovalsOverdue === 1 ? "" : "s"
      } overdue`
    );

  // Priority routing: crisis > verifications > pricing
  const href =
    crisisCount > 0
      ? "/crisis"
      : verificationsOverdue > 0
        ? "/therapists/verifications"
        : "/pricing-approvals";

  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-4 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3"
    >
      <p className="text-sm text-destructive">
        <span aria-hidden className="mr-1.5">
          🚨
        </span>
        {parts.join(" · ")}
      </p>
      <Button asChild size="sm" variant="destructive">
        <Link href={href}>Open</Link>
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Wire into page**

Modify `admin/app/(dashboard)/dashboard/page.tsx` — add the import + render below PageHeader:

```tsx
import { CrisisTier } from "@/components/dashboard/crisis-tier";
```

Inside the returned JSX, add directly below `<PageHeader … />`:
```tsx
      <CrisisTier state={data.crisisTier} />
```

- [ ] **Step 3: Verify**

```bash
cd admin && pnpm tsc --noEmit
```
Expected: exit code 0.

Then via `ctx_execute`:
```js
const r = await fetch('http://localhost:3000/dashboard');
const html = await r.text();
console.log(r.status, html.includes('crisis alerts active') ? 'has strip' : 'no strip');
```
Expected: `200 has strip`.

- [ ] **Step 4: Commit**

```bash
cd admin && git add components/dashboard/crisis-tier.tsx "app/(dashboard)/dashboard/page.tsx"
git commit -m "Add dashboard CrisisTier alert strip"
```

---

## Task 7: KpiStrip component (§4.3)

**Files:**
- Create: `admin/components/dashboard/kpi-strip.tsx`

- [ ] **Step 1: Create KpiStrip**

Write `admin/components/dashboard/kpi-strip.tsx`:

```tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { KpiCard } from "@/lib/dummy/types";

type Props = {
  cards: KpiCard[];
};

const directionStyles: Record<KpiCard["deltaDirection"], string> = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-destructive",
  flat: "text-muted-foreground",
};

export function KpiStrip({ cards }: Props) {
  return (
    <section
      aria-label="Key performance indicators"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {cards.map((card) => (
        <Card key={card.id} className="gap-3 py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {card.label}
            </p>
          </CardHeader>
          <CardContent className="px-5 space-y-1">
            <p className="font-heading text-2xl tabular-nums whitespace-pre-line leading-tight">
              {card.primary}
            </p>
            <p className="text-xs text-muted-foreground">{card.secondary}</p>
            <Badge
              variant="secondary"
              className={`mt-2 font-normal ${directionStyles[card.deltaDirection]}`}
            >
              {card.delta}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
```

- [ ] **Step 2: Wire into page**

Add to `admin/app/(dashboard)/dashboard/page.tsx`:
```tsx
import { KpiStrip } from "@/components/dashboard/kpi-strip";
```
Render below CrisisTier:
```tsx
      <KpiStrip cards={data.kpis} />
```

- [ ] **Step 3: Verify**

```bash
cd admin && pnpm tsc --noEmit
```
Expected: exit code 0.

```js
const r = await fetch('http://localhost:3000/dashboard');
const html = await r.text();
console.log(r.status, html.includes('Active subscribers') ? 'has KPIs' : 'no KPIs');
```
Expected: `200 has KPIs`.

- [ ] **Step 4: Commit**

```bash
cd admin && git add components/dashboard/kpi-strip.tsx "app/(dashboard)/dashboard/page.tsx"
git commit -m "Add dashboard KpiStrip"
```

---

## Task 8: RevenueChart component (§4.4)

**Files:**
- Create: `admin/components/dashboard/revenue-chart.tsx`

- [ ] **Step 1: Create RevenueChart**

Write `admin/components/dashboard/revenue-chart.tsx`:

```tsx
"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import type { RevenuePoint } from "@/lib/dummy/types";

type Props = {
  points: RevenuePoint[];
};

const config = {
  ngn: {
    label: "NGN",
    color: "var(--chart-1)",
  },
  usd: {
    label: "USD",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const formatNgn = (v: number) => `₦${(v / 1000).toFixed(0)}k`;
const formatUsd = (v: number) => `$${v.toLocaleString()}`;

export function RevenueChart({ points }: Props) {
  return (
    <Card className="gap-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Revenue</CardTitle>
        <Link
          href="/revenue"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          View revenue detail
        </Link>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[260px] w-full">
          <AreaChart data={points} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} className="stroke-border/50" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis
              yAxisId="ngn"
              orientation="left"
              tickFormatter={formatNgn}
              tickLine={false}
              axisLine={false}
              className="text-xs"
              width={50}
            />
            <YAxis
              yAxisId="usd"
              orientation="right"
              tickFormatter={formatUsd}
              tickLine={false}
              axisLine={false}
              className="text-xs"
              width={50}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area
              yAxisId="ngn"
              type="monotone"
              dataKey="ngn"
              stroke="var(--color-ngn)"
              fill="var(--color-ngn)"
              fillOpacity={0.18}
            />
            <Area
              yAxisId="usd"
              type="monotone"
              dataKey="usd"
              stroke="var(--color-usd)"
              fill="var(--color-usd)"
              fillOpacity={0.18}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: Wire into page**

Add to page:
```tsx
import { RevenueChart } from "@/components/dashboard/revenue-chart";
```
Render below KpiStrip:
```tsx
      <RevenueChart points={data.revenue} />
```

- [ ] **Step 3: Verify**

```bash
cd admin && pnpm tsc --noEmit
```
Expected: exit code 0.

```js
const r = await fetch('http://localhost:3000/dashboard');
console.log(r.status);
```
Expected: `200`. Manually open `http://localhost:3000/dashboard` in a browser and confirm the dual-axis area chart renders.

- [ ] **Step 4: Commit**

```bash
cd admin && git add components/dashboard/revenue-chart.tsx "app/(dashboard)/dashboard/page.tsx"
git commit -m "Add dashboard RevenueChart"
```

---

## Task 9: OperationsZone (§4.5)

**Files:**
- Create: `admin/components/dashboard/operations-zone.tsx`

- [ ] **Step 1: Create OperationsZone**

Write `admin/components/dashboard/operations-zone.tsx`:

```tsx
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { DashboardData } from "@/lib/dummy/types";

type Props = {
  queues: DashboardData["queues"];
};

export function OperationsZone({ queues }: Props) {
  return (
    <section
      aria-label="Operations queues"
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Verifications waiting</CardTitle>
          <Badge variant="secondary">{queues.verifications.pending} pending</Badge>
        </CardHeader>
        <CardContent>
          {queues.verifications.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              All applications reviewed. Nice.
            </p>
          ) : (
            <ul className="space-y-2">
              {queues.verifications.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">
                    {item.country} · {item.submittedAgo}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter>
          <Link
            href="/therapists/verifications"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Open queue →
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pricing approvals</CardTitle>
          <div className="flex items-center gap-2">
            {queues.pricingApprovals.pending > 0 && (
              <Badge variant="secondary">
                {queues.pricingApprovals.pending} pending
              </Badge>
            )}
            {queues.pricingApprovals.overdue > 0 && (
              <Badge variant="destructive">
                {queues.pricingApprovals.overdue} overdue
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {queues.pricingApprovals.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No pending pricing approvals.
            </p>
          ) : (
            <ul className="space-y-2">
              {queues.pricingApprovals.items.map((item) => (
                <li key={item.id} className="text-sm space-y-0.5">
                  <p>
                    <span className="font-medium">{item.therapist}</span>
                    <span className="text-muted-foreground"> · {item.plan}</span>
                  </p>
                  <p
                    className={
                      item.isOverdue
                        ? "text-xs text-destructive"
                        : "text-xs text-muted-foreground"
                    }
                  >
                    {item.deltaFromBand} · {item.submittedAgo}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter>
          <Link
            href="/pricing-approvals"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Open queue →
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
```

- [ ] **Step 2: Wire into page**

Add import + render:
```tsx
import { OperationsZone } from "@/components/dashboard/operations-zone";
```
```tsx
      <OperationsZone queues={data.queues} />
```

- [ ] **Step 3: Verify**

```bash
cd admin && pnpm tsc --noEmit
```
Expected: exit code 0.

```js
const r = await fetch('http://localhost:3000/dashboard');
const html = await r.text();
console.log(r.status, html.includes('Verifications waiting') && html.includes('Pricing approvals') ? 'ops zone OK' : 'missing');
```
Expected: `200 ops zone OK`.

- [ ] **Step 4: Commit**

```bash
cd admin && git add components/dashboard/operations-zone.tsx "app/(dashboard)/dashboard/page.tsx"
git commit -m "Add dashboard OperationsZone"
```

---

## Task 10: PlanCoverageSpotlight (§4.6)

**Files:**
- Create: `admin/components/dashboard/plan-coverage-spotlight.tsx`

- [ ] **Step 1: Create PlanCoverageSpotlight**

Write `admin/components/dashboard/plan-coverage-spotlight.tsx`:

```tsx
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { PlanCoverageItem } from "@/lib/dummy/types";

type Props = {
  items: PlanCoverageItem[];
};

export function PlanCoverageSpotlight({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <Card className="border-amber-500/40 bg-amber-50/60 dark:bg-amber-950/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Plans need therapist coverage</CardTitle>
        <Badge variant="secondary">{items.length}</Badge>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={`${item.plan}-${item.region}`}
              className="flex items-center justify-between text-sm"
            >
              <span>
                <span className="font-medium">{item.plan}</span>
                <span className="text-muted-foreground"> · {item.region}</span>
              </span>
              <span className="text-muted-foreground">
                {item.therapists} therapist{item.therapists === 1 ? "" : "s"} · need{" "}
                {item.gap} more
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link
          href="/plans/coverage"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Open coverage report →
        </Link>
      </CardFooter>
    </Card>
  );
}
```

- [ ] **Step 2: Wire into page**

Add import + render below OperationsZone:
```tsx
import { PlanCoverageSpotlight } from "@/components/dashboard/plan-coverage-spotlight";
```
```tsx
      <PlanCoverageSpotlight items={data.planCoverage} />
```

- [ ] **Step 3: Verify**

```bash
cd admin && pnpm tsc --noEmit
```
Expected: exit code 0.

```js
const r = await fetch('http://localhost:3000/dashboard');
const html = await r.text();
console.log(r.status, html.includes('Plans need therapist coverage') ? 'spotlight OK' : 'missing');
```
Expected: `200 spotlight OK`.

- [ ] **Step 4: Commit**

```bash
cd admin && git add components/dashboard/plan-coverage-spotlight.tsx "app/(dashboard)/dashboard/page.tsx"
git commit -m "Add dashboard PlanCoverageSpotlight"
```

---

## Task 11: ClinicalSafetyZone (§4.7)

**Files:**
- Create: `admin/components/dashboard/clinical-safety-zone.tsx`

- [ ] **Step 1: Create ClinicalSafetyZone**

Write `admin/components/dashboard/clinical-safety-zone.tsx`:

```tsx
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { DashboardData } from "@/lib/dummy/types";

type Props = {
  clinical: DashboardData["clinical"];
};

export function ClinicalSafetyZone({ clinical }: Props) {
  const { crisis, risk } = clinical;

  return (
    <section
      aria-label="Clinical safety"
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
    >
      <Card>
        <CardHeader>
          <CardTitle>Crisis activity (24h)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            <span className="font-medium tabular-nums">{crisis.activeCount}</span>{" "}
            active ·{" "}
            <span className="font-medium tabular-nums">{crisis.avgResponse}</span>{" "}
            avg response ·{" "}
            <span className="font-medium tabular-nums">{crisis.escalations}</span>{" "}
            escalations
          </p>
          {crisis.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No crisis alerts in the last 24h.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {crisis.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {item.clientAlias} ·{" "}
                    <span className="text-muted-foreground">{item.therapist}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.loggedAgo} · {item.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter>
          <Link
            href="/crisis"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Open crisis log →
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk forms (7d)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            <span className="font-medium tabular-nums">{risk.submitted}</span>{" "}
            submitted ·{" "}
            <span className="font-medium tabular-nums">{risk.redFlags}</span> red
            flags ·{" "}
            <span className="font-medium tabular-nums">{risk.followUpOverdue}</span>{" "}
            follow-up overdue
          </p>
          {risk.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No red-flag risk forms this week.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {risk.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {item.clientAlias} ·{" "}
                    <span className="text-muted-foreground">
                      {item.therapist} · {item.region}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.followUpDue}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter>
          <Link
            href="/risk-forms"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Open risk queue →
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
```

- [ ] **Step 2: Wire into page**

```tsx
import { ClinicalSafetyZone } from "@/components/dashboard/clinical-safety-zone";
```
```tsx
      <ClinicalSafetyZone clinical={data.clinical} />
```

- [ ] **Step 3: Verify**

```bash
cd admin && pnpm tsc --noEmit
```
Expected: exit code 0.

```js
const r = await fetch('http://localhost:3000/dashboard');
const html = await r.text();
console.log(r.status, html.includes('Crisis activity (24h)') && html.includes('Risk forms (7d)') ? 'safety OK' : 'missing');
```
Expected: `200 safety OK`.

- [ ] **Step 4: Commit**

```bash
cd admin && git add components/dashboard/clinical-safety-zone.tsx "app/(dashboard)/dashboard/page.tsx"
git commit -m "Add dashboard ClinicalSafetyZone"
```

---

## Task 12: OnboardingFunnel (§4.8)

**Files:**
- Create: `admin/components/dashboard/onboarding-funnel.tsx`

- [ ] **Step 1: Create OnboardingFunnel**

Write `admin/components/dashboard/onboarding-funnel.tsx`:

```tsx
"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { DashboardData } from "@/lib/dummy/types";

type LocalRegion = "all" | "ng" | "intl";

type Props = {
  funnel: DashboardData["funnel"];
};

export function OnboardingFunnel({ funnel }: Props) {
  const [localRegion, setLocalRegion] = useState<LocalRegion>("all");

  const max = Math.max(...funnel.steps.map((s) => s.count), 1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Onboarding funnel</CardTitle>
        <Tabs
          value={localRegion}
          onValueChange={(v) => setLocalRegion(v as LocalRegion)}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="ng">NG</TabsTrigger>
            <TabsTrigger value="intl">Int&apos;l</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {funnel.steps.map((step, idx) => {
            const widthPct = (step.count / max) * 100;
            return (
              <div key={step.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{step.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {step.count.toLocaleString()}
                    {step.conversionPct !== null && idx > 0 && (
                      <span className="ml-2 text-xs">
                        ({step.conversionPct}%)
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary/80"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" disabled>
          Export funnel CSV (prototype)
        </Button>
      </CardFooter>
    </Card>
  );
}
```

- [ ] **Step 2: Wire into page**

```tsx
import { OnboardingFunnel } from "@/components/dashboard/onboarding-funnel";
```
```tsx
      <OnboardingFunnel funnel={data.funnel} />
```

- [ ] **Step 3: Verify**

```bash
cd admin && pnpm tsc --noEmit
```
Expected: exit code 0.

```js
const r = await fetch('http://localhost:3000/dashboard');
const html = await r.text();
console.log(r.status, html.includes('Onboarding funnel') ? 'funnel OK' : 'missing');
```
Expected: `200 funnel OK`.

- [ ] **Step 4: Commit**

```bash
cd admin && git add components/dashboard/onboarding-funnel.tsx "app/(dashboard)/dashboard/page.tsx"
git commit -m "Add dashboard OnboardingFunnel"
```

---

## Task 13: RecentActivity (§4.9)

**Files:**
- Create: `admin/components/dashboard/recent-activity.tsx`

- [ ] **Step 1: Create RecentActivity**

Write `admin/components/dashboard/recent-activity.tsx`:

```tsx
import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { ActivityItem } from "@/lib/dummy/types";

type Props = {
  items: ActivityItem[];
};

export function RecentActivity({ items }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li key={item.id} className="flex items-baseline justify-between gap-3">
                <span>
                  <span className="font-medium">{item.actor}</span>{" "}
                  {item.action}{" "}
                  <span className="text-muted-foreground">{item.target}</span>
                </span>
                <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                  {item.timestampAgo}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Link
          href="/audit-log"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Open audit log →
        </Link>
      </CardFooter>
    </Card>
  );
}
```

- [ ] **Step 2: Wire into page**

```tsx
import { RecentActivity } from "@/components/dashboard/recent-activity";
```
```tsx
      <RecentActivity items={data.activity} />
```

- [ ] **Step 3: Verify**

```bash
cd admin && pnpm tsc --noEmit
```
Expected: exit code 0.

```js
const r = await fetch('http://localhost:3000/dashboard');
const html = await r.text();
console.log(r.status, html.includes('Recent activity') ? 'activity OK' : 'missing');
```
Expected: `200 activity OK`.

- [ ] **Step 4: Commit**

```bash
cd admin && git add components/dashboard/recent-activity.tsx "app/(dashboard)/dashboard/page.tsx"
git commit -m "Add dashboard RecentActivity"
```

---

## Task 14: Update auth redirects to land on /dashboard

**Files:**
- Modify: `admin/app/(auth)/2fa/page.tsx`
- Modify: `admin/app/page.tsx`

- [ ] **Step 1: Update 2FA redirect**

In `admin/app/(auth)/2fa/page.tsx`, change:
```tsx
router.push("/");
```
to:
```tsx
router.push("/dashboard");
```

- [ ] **Step 2: Update root redirect**

In `admin/app/page.tsx`, change:
```tsx
redirect("/login");
```
to:
```tsx
redirect("/dashboard");
```

Note: this prototype has no auth state, so `/dashboard` will render even without sign-in. Acceptable for a UI prototype.

- [ ] **Step 3: Verify**

```bash
cd admin && pnpm tsc --noEmit
```
Expected: exit code 0.

```js
const r = await fetch('http://localhost:3000/', { redirect: 'manual' });
console.log('/', r.status, r.headers.get('location'));
```
Expected: `307` redirect to `/dashboard`.

- [ ] **Step 4: Commit**

```bash
cd admin && git add "app/(auth)/2fa/page.tsx" "app/page.tsx"
git commit -m "Land on /dashboard after sign in"
```

---

## Task 15: Responsive verification + final polish

**Files:** none (visual check + small fixes if needed)

- [ ] **Step 1: Open dashboard at default viewport**

Open `http://localhost:3000/dashboard` in a browser. Set viewport to **1280×800**. Confirm visually:

- Page header: title left, controls right, single row
- KPI strip: 4 cards in one row
- Revenue chart renders with both NGN and USD areas
- Operations zone: 2 cards side by side
- Plan coverage spotlight: amber card with 3 plans
- Clinical safety: 2 cards side by side
- Onboarding funnel: 4 bars stacked vertically with widths proportional
- Recent activity: card with 5 rows
- No horizontal scrollbar

- [ ] **Step 2: Resize to 1024×768**

Confirm:
- KPI strip wraps to 2×2
- Operations zone still 2 columns OR stacks (acceptable either way at this width)
- No horizontal scrollbar

- [ ] **Step 3: Resize to 768×800**

Confirm:
- All multi-column sections stack to single column
- Page header controls wrap to second row
- No horizontal scrollbar

- [ ] **Step 4: Toggle window selector**

Confirm: URL changes to include `?window=30d` (and other values). Page reloads with no console errors.

- [ ] **Step 5: Toggle region tabs**

Confirm: URL changes to include `&region=ng` etc. Page reloads with no console errors.

- [ ] **Step 6: Click each "Open …" link**

Each link goes to a route that does not exist yet. Expected: Next.js 404 page. That is correct for a prototype where downstream screens are not built. **Do not fix these 404s** — those routes belong to other planned screens (A3.1, A5.2, A5.3, A6.4, A8.1, A11.3).

- [ ] **Step 7: Commit (only if changes were needed)**

If steps 1–5 required any CSS/layout fixes, commit them:

```bash
cd admin && git add -A
git commit -m "Polish dashboard responsive behaviour"
```

If no changes needed, skip this commit.

---

## Task 16: Final integration smoke

**Files:** none

- [ ] **Step 1: Full type check**

```bash
cd admin && pnpm tsc --noEmit
```
Expected: exit code 0.

- [ ] **Step 2: Hit every relevant route**

Via `ctx_execute`:
```js
for (const url of [
  '/',
  '/login',
  '/2fa',
  '/forgot',
  '/dashboard',
  '/dashboard?window=30d',
  '/dashboard?window=90d&region=ng',
  '/dashboard?window=ytd&region=intl',
]) {
  const r = await fetch('http://localhost:3000' + url, { redirect: 'manual' });
  console.log(url, r.status, r.headers.get('location') ?? '');
}
```

Expected:
- `/` → 307 → `/dashboard`
- `/login`, `/2fa`, `/forgot`, `/dashboard*` → all 200

- [ ] **Step 3: Final commit if anything was tweaked**

If everything passed without changes, no commit is needed. Otherwise:

```bash
cd admin && git add -A
git commit -m "Dashboard integration smoke fixes"
```

- [ ] **Step 4: Push**

```bash
git push
```

---

## Out-of-scope reminders (do not implement in this plan)

- Real backend / data fetching
- Real authentication state checks
- Loading skeletons (deferred — spec §5 acknowledges loading state but our dummy data is synchronous; add skeletons when data goes async)
- Error-state rendering (deferred — spec §5 documents the variant for each card; no implementation needed in prototype because dummy data never throws. The shape is documented in the spec so a future engineer can wire it in by short-circuiting card rendering when a fetch rejects.)
- Real export CSV / PDF generation (buttons render disabled per dummy data)
- Sidebar + top bar (separate global-chrome spec — interim layout used here)
- The 7 drill-down destination screens (separate flow specs A3, A5, A6, A8, A11)
