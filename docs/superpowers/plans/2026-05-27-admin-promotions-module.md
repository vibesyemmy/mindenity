# Admin Promotions Module Implementation Plan

> Use superpowers:subagent-driven-development to execute task-by-task.

**Goal:** Ship A7 module (list + editor) per `docs/superpowers/specs/2026-05-27-admin-promotions-module-design.md`.

**Architecture:** 3 routes inside `(dashboard)` group. Reuses every component from earlier modules. **No new deps.**

**Verification per task:** `pnpm tsc --noEmit` clean + fetch returns expected status + HTML contains expected anchor text.

---

## File structure

| File | Role |
|---|---|
| `admin/lib/dummy/promotions.ts` | Types + dummy data + getters/stats |
| `admin/components/promotions/promo-columns.tsx` | A7.1 columns |
| `admin/components/promotions/promo-filters.tsx` | A7.1 filters + status tabs |
| `admin/app/(dashboard)/promotions/page.tsx` | A7.1 entry |
| `admin/components/promotions/promo-editor.tsx` | A7.2 editor (new + edit) |
| `admin/components/promotions/delete-dialog.tsx` | A7.2 delete dialog |
| `admin/app/(dashboard)/promotions/new/page.tsx` | A7.2 create entry |
| `admin/app/(dashboard)/promotions/[id]/page.tsx` | A7.2 edit entry |

---

## Task PR1: Dummy promotions data + types

**File:** `admin/lib/dummy/promotions.ts`

```ts
// Shared types + dummy data for admin promotions module.
// Cross-references plan names from `admin/lib/dummy/plans.ts`.

import { ALL_PLAN_NAMES_ORDERED } from "@/lib/dummy/plans";

export type DiscountType = "percent" | "flat";
export type Currency = "NGN" | "USD";
export type RegionScope = "NGN" | "USD" | "Both";
export type PromotionStatus = "Scheduled" | "Active" | "Ended";

export type Promotion = {
  id: string;
  name: string;
  discountType: DiscountType;
  discountValue: number; // for percent: 1-100, for flat: minor units
  flatCurrency?: Currency; // only relevant when discountType === "flat"
  region: RegionScope;
  applicablePlans: string[]; // plan names from ALL_PLAN_NAMES_ORDERED
  startAt: string; // ISO
  endAt: string; // ISO
  estimatedReachable: number; // dummy subs estimate
};

export type PromoFilters = {
  status?: "all" | "scheduled" | "active" | "ended";
  region?: "all" | "ngn" | "usd" | "both";
};

const PROMOTIONS: Promotion[] = [
  {
    id: "p-001",
    name: "May NG Onboarding",
    discountType: "percent",
    discountValue: 20,
    region: "NGN",
    applicablePlans: ["Essential", "Together"],
    startAt: "2026-05-01T00:00:00Z",
    endAt: "2026-05-31T23:59:00Z",
    estimatedReachable: 287,
  },
  {
    id: "p-002",
    name: "June Int'l Launch",
    discountType: "flat",
    discountValue: 20_00,
    flatCurrency: "USD",
    region: "USD",
    applicablePlans: ["Balance", "Thrive"],
    startAt: "2026-06-01T00:00:00Z",
    endAt: "2026-06-30T23:59:00Z",
    estimatedReachable: 134,
  },
  {
    id: "p-003",
    name: "Family Refresh",
    discountType: "percent",
    discountValue: 15,
    region: "Both",
    applicablePlans: ["Family Care", "Family Thrive", "Home"],
    startAt: "2026-05-15T00:00:00Z",
    endAt: "2026-07-15T23:59:00Z",
    estimatedReachable: 96,
  },
  {
    id: "p-004",
    name: "April Couples Promo",
    discountType: "percent",
    discountValue: 10,
    region: "NGN",
    applicablePlans: ["Together", "Harmony"],
    startAt: "2026-04-01T00:00:00Z",
    endAt: "2026-04-30T23:59:00Z",
    estimatedReachable: 152,
  },
  {
    id: "p-005",
    name: "March Wellness Week",
    discountType: "percent",
    discountValue: 25,
    region: "Both",
    applicablePlans: ["Essential"],
    startAt: "2026-03-01T00:00:00Z",
    endAt: "2026-03-08T23:59:00Z",
    estimatedReachable: 412,
  },
];

export function getPromotionStatus(p: Promotion): PromotionStatus {
  const now = Date.now();
  const start = new Date(p.startAt).getTime();
  const end = new Date(p.endAt).getTime();
  if (now < start) return "Scheduled";
  if (now > end) return "Ended";
  return "Active";
}

export function getPromotions(filters: PromoFilters = {}): Promotion[] {
  return PROMOTIONS.filter((p) => {
    if (filters.status && filters.status !== "all") {
      const status = getPromotionStatus(p);
      const map: Record<string, PromotionStatus> = {
        scheduled: "Scheduled",
        active: "Active",
        ended: "Ended",
      };
      if (status !== map[filters.status]) return false;
    }
    if (filters.region && filters.region !== "all") {
      const map: Record<string, RegionScope> = {
        ngn: "NGN",
        usd: "USD",
        both: "Both",
      };
      if (p.region !== map[filters.region]) return false;
    }
    return true;
  });
}

export function getPromotion(id: string): Promotion | undefined {
  return PROMOTIONS.find((p) => p.id === id);
}

export function getPromotionStats() {
  return {
    active: PROMOTIONS.filter((p) => getPromotionStatus(p) === "Active").length,
    scheduled: PROMOTIONS.filter((p) => getPromotionStatus(p) === "Scheduled").length,
    ended: PROMOTIONS.filter((p) => getPromotionStatus(p) === "Ended").length,
  };
}

export function formatDiscount(p: Promotion): string {
  if (p.discountType === "percent") return `${p.discountValue}% off`;
  const v = p.discountValue / 100;
  if (p.flatCurrency === "USD") return `$${v.toLocaleString()} off`;
  return `₦${v.toLocaleString()} off`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTimeForInput(iso: string): string {
  // YYYY-MM-DDTHH:mm for <input type="datetime-local">
  const d = new Date(iso);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export const ALL_PLAN_NAMES_FOR_PROMOTIONS = ALL_PLAN_NAMES_ORDERED;
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add lib/dummy/promotions.ts && \
git commit -m "Add promotions dummy data + types"
```

---

## Task PR2: A7.1 Promotions list

**File 1:** `admin/components/promotions/promo-columns.tsx`

```tsx
"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  formatDate,
  formatDiscount,
  getPromotionStatus,
  type Promotion,
} from "@/lib/dummy/promotions";

const statusVariant: Record<
  ReturnType<typeof getPromotionStatus>,
  "secondary" | "outline" | "destructive" | "default"
> = {
  Scheduled: "outline",
  Active: "secondary",
  Ended: "destructive",
};

const regionVariant: Record<Promotion["region"], "outline"> = {
  NGN: "outline",
  USD: "outline",
  Both: "outline",
};

export const promoColumns: ColumnDef<Promotion>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/promotions/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    id: "discount",
    header: "Discount",
    cell: ({ row }) => (
      <span className="tabular-nums">{formatDiscount(row.original)}</span>
    ),
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => (
      <Badge variant={regionVariant[row.original.region]} className="font-normal">
        {row.original.region}
      </Badge>
    ),
  },
  {
    accessorKey: "applicablePlans",
    header: "Plans",
    cell: ({ row }) => {
      const plans = row.original.applicablePlans;
      return (
        <Popover>
          <PopoverTrigger className="text-sm hover:underline">
            {plans.length} plan{plans.length === 1 ? "" : "s"}
          </PopoverTrigger>
          <PopoverContent className="text-sm">
            <ul className="space-y-1">
              {plans.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: "startAt",
    header: "Starts",
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">{formatDate(row.original.startAt)}</span>
    ),
  },
  {
    accessorKey: "endAt",
    header: "Ends",
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-muted-foreground">
        {formatDate(row.original.endAt)}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = getPromotionStatus(row.original);
      return <Badge variant={statusVariant[status]}>{status}</Badge>;
    },
  },
  {
    id: "edit",
    header: "",
    cell: ({ row }) => (
      <Button asChild variant="ghost" size="sm">
        <Link
          href={`/promotions/${row.original.id}`}
          aria-label={`Edit ${row.original.name}`}
        >
          <Pencil className="size-3.5 mr-1" />
          Edit
        </Link>
      </Button>
    ),
  },
];
```

**File 2:** `admin/components/promotions/promo-filters.tsx`

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

export function PromoFilters() {
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
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="ended">Ended</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={params.get("region") ?? "all"}
          onValueChange={(v) => setParam("region", v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All regions</SelectItem>
            <SelectItem value="ngn">Nigeria (NGN)</SelectItem>
            <SelectItem value="usd">International (USD)</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
```

**File 3:** `admin/app/(dashboard)/promotions/page.tsx`

```tsx
import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/therapists/data-table";

import { promoColumns } from "@/components/promotions/promo-columns";
import { PromoFilters } from "@/components/promotions/promo-filters";

import {
  getPromotions,
  getPromotionStats,
  type PromoFilters as PromoFilterShape,
} from "@/lib/dummy/promotions";

type SearchParams = Promise<{
  status?: string;
  region?: string;
}>;

function asFilters(p: Awaited<SearchParams>): PromoFilterShape {
  return {
    status: (p.status as PromoFilterShape["status"]) ?? "all",
    region: p.region as PromoFilterShape["region"],
  };
}

export default async function PromotionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const promos = getPromotions(filters);
  const stats = getPromotionStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Promotions</h1>
          <p className="text-sm text-muted-foreground">
            {stats.active} active · {stats.scheduled} scheduled · {stats.ended} ended
          </p>
        </div>
        <Button asChild>
          <Link href="/promotions/new">
            <Plus className="size-4 mr-1" />
            New promotion
          </Link>
        </Button>
      </header>

      <PromoFilters />

      <DataTable
        columns={promoColumns}
        data={promos}
        emptyMessage="No promotions in this view."
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
for (const url of ['/promotions', '/promotions?status=active', '/promotions?status=ended', '/promotions?region=ngn']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: all 200.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/promotions/promo-columns.tsx components/promotions/promo-filters.tsx "app/(dashboard)/promotions/page.tsx" && \
git commit -m "Add A7.1 promotions list page"
```

---

## Task PR3: A7.2 Promotion editor (new + edit) + delete dialog

**File 1:** `admin/components/promotions/delete-dialog.tsx`

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
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

import type { Promotion } from "@/lib/dummy/promotions";

type Props = {
  promotion: Promotion;
};

export function DeleteDialog({ promotion }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    toast.success(`Promotion "${promotion.name}" deleted`, {
      description: "Active subscriptions stop receiving the discount immediately.",
    });
    setOpen(false);
    router.push("/promotions");
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        <Trash2 className="size-3.5 mr-1" />
        Delete
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete &quot;{promotion.name}&quot;?</DialogTitle>
            <DialogDescription>
              Active subscriptions stop receiving the discount immediately. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

**File 2:** `admin/components/promotions/promo-editor.tsx`

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import { DeleteDialog } from "@/components/promotions/delete-dialog";

import {
  ALL_PLAN_NAMES_FOR_PROMOTIONS,
  formatDateTimeForInput,
  getPromotionStatus,
  type Promotion,
  type DiscountType,
  type RegionScope,
  type Currency,
} from "@/lib/dummy/promotions";

type Props = {
  promotion?: Promotion;
};

const statusVariant: Record<
  ReturnType<typeof getPromotionStatus>,
  "secondary" | "outline" | "destructive"
> = {
  Scheduled: "outline",
  Active: "secondary",
  Ended: "destructive",
};

export function PromoEditor({ promotion }: Props) {
  const router = useRouter();
  const isEdit = !!promotion;

  const [name, setName] = useState(promotion?.name ?? "");
  const [discountType, setDiscountType] = useState<DiscountType>(
    promotion?.discountType ?? "percent"
  );
  const [discountValue, setDiscountValue] = useState(
    promotion
      ? promotion.discountType === "percent"
        ? promotion.discountValue.toString()
        : (promotion.discountValue / 100).toString()
      : ""
  );
  const [flatCurrency, setFlatCurrency] = useState<Currency>(
    promotion?.flatCurrency ?? "NGN"
  );
  const [region, setRegion] = useState<RegionScope>(promotion?.region ?? "NGN");
  const [plans, setPlans] = useState<string[]>(
    promotion?.applicablePlans ?? []
  );
  const [startAt, setStartAt] = useState(
    promotion ? formatDateTimeForInput(promotion.startAt) : ""
  );
  const [endAt, setEndAt] = useState(
    promotion ? formatDateTimeForInput(promotion.endAt) : ""
  );

  const togglePlan = (plan: string) => {
    setPlans((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]
    );
  };

  const selectAllPlans = () => setPlans([...ALL_PLAN_NAMES_FOR_PROMOTIONS]);
  const clearPlans = () => setPlans([]);

  const handleSubmit = () => {
    if (name.trim().length < 3) {
      return toast.error("Promotion name must be at least 3 characters");
    }
    const v = Number(discountValue);
    if (!v || v <= 0) return toast.error("Discount value must be greater than 0");
    if (discountType === "percent" && v > 100) {
      return toast.error("Percent discount cannot exceed 100");
    }
    if (plans.length === 0) {
      return toast.error("Select at least one applicable plan");
    }
    if (!startAt) return toast.error("Set a start date and time");
    if (!endAt) return toast.error("Set an end date and time");
    if (new Date(endAt).getTime() <= new Date(startAt).getTime()) {
      return toast.error("End date must be after start date");
    }
    toast.success(
      isEdit
        ? `Promotion "${name}" updated`
        : `Promotion "${name}" scheduled`,
      {
        description: `${plans.length} plan${plans.length === 1 ? "" : "s"} · ${region} · ${discountType === "percent" ? `${v}% off` : `${flatCurrency} ${v} off`}`,
      }
    );
    router.push("/promotions");
  };

  // Static dummy reachable estimate
  const estimatedReachable =
    plans.length * (region === "Both" ? 60 : 35) + 20;
  const startTs = startAt ? new Date(startAt).getTime() : 0;
  const endTs = endAt ? new Date(endAt).getTime() : 0;
  const windowDays =
    startTs && endTs && endTs > startTs
      ? Math.round((endTs - startTs) / (24 * 60 * 60 * 1000))
      : 0;

  return (
    <div className="space-y-6">
      <Link
        href="/promotions"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Promotions
      </Link>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            {isEdit ? "Edit promotion" : "New promotion"}
          </h1>
          {isEdit && promotion && (
            <Badge variant={statusVariant[getPromotionStatus(promotion)]}>
              {getPromotionStatus(promotion)}
            </Badge>
          )}
        </div>
        {isEdit && promotion && <DeleteDialog promotion={promotion} />}
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Basics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Promotion name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. May NG Onboarding"
            />
          </div>

          <div className="space-y-2">
            <Label>Discount type</Label>
            <RadioGroup
              value={discountType}
              onValueChange={(v) => setDiscountType(v as DiscountType)}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="percent" id="d-percent" />
                <Label htmlFor="d-percent" className="font-normal">
                  Percent off
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="flat" id="d-flat" />
                <Label htmlFor="d-flat" className="font-normal">
                  Flat amount off
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="value">
                Discount value{" "}
                {discountType === "percent"
                  ? "(1–100)"
                  : `(${flatCurrency === "NGN" ? "₦" : "$"})`}
              </Label>
              <Input
                id="value"
                type="number"
                step="1"
                min="0"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
              />
            </div>
            {discountType === "flat" && (
              <div className="space-y-2">
                <Label>Flat currency</Label>
                <RadioGroup
                  value={flatCurrency}
                  onValueChange={(v) => setFlatCurrency(v as Currency)}
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="NGN" id="c-ngn" />
                    <Label htmlFor="c-ngn" className="font-normal">
                      NGN
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="USD" id="c-usd" />
                    <Label htmlFor="c-usd" className="font-normal">
                      USD
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Region</Label>
            <RadioGroup
              value={region}
              onValueChange={(v) => setRegion(v as RegionScope)}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="NGN" id="r-ngn" />
                <Label htmlFor="r-ngn" className="font-normal">
                  Nigeria (NGN)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="USD" id="r-usd" />
                <Label htmlFor="r-usd" className="font-normal">
                  International (USD)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Both" id="r-both" />
                <Label htmlFor="r-both" className="font-normal">
                  Both
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Applicable plans</CardTitle>
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={selectAllPlans}
              className="text-muted-foreground hover:text-foreground"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={clearPlans}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {ALL_PLAN_NAMES_FOR_PROMOTIONS.map((plan) => (
              <div key={plan} className="flex items-center gap-2">
                <Checkbox
                  id={`plan-${plan}`}
                  checked={plans.includes(plan)}
                  onCheckedChange={() => togglePlan(plan)}
                />
                <Label
                  htmlFor={`plan-${plan}`}
                  className="font-normal cursor-pointer"
                >
                  {plan}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Window</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="start">Start</Label>
              <Input
                id="start"
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End</Label>
              <Input
                id="end"
                type="datetime-local"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
              />
            </div>
          </div>
          {startTs > 0 && endTs > 0 && endTs <= startTs && (
            <p className="text-xs text-destructive mt-2">
              End date must be after start date.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Impact preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            <span className="font-medium tabular-nums">~{estimatedReachable}</span>{" "}
            active subscribers reachable · {plans.length} plan
            {plans.length === 1 ? "" : "s"} ·{" "}
            {windowDays > 0 ? `${windowDays}d window` : "Window not set"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Static estimate based on selected plans + region. Real impact
            calculated at promo launch.
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="outline">
          <Link href="/promotions">Cancel</Link>
        </Button>
        <Button onClick={handleSubmit}>
          {isEdit ? "Save changes" : "Save & schedule"}
        </Button>
      </div>
    </div>
  );
}
```

**File 3:** `admin/app/(dashboard)/promotions/new/page.tsx`

```tsx
import { PromoEditor } from "@/components/promotions/promo-editor";

export default function NewPromotionPage() {
  return <PromoEditor />;
}
```

**File 4:** `admin/app/(dashboard)/promotions/[id]/page.tsx`

```tsx
import { notFound } from "next/navigation";

import { PromoEditor } from "@/components/promotions/promo-editor";
import { getPromotion } from "@/lib/dummy/promotions";

type Params = Promise<{ id: string }>;

export default async function EditPromotionPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const promotion = getPromotion(id);
  if (!promotion) notFound();

  return <PromoEditor promotion={promotion} />;
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

```js
for (const url of ['/promotions/new', '/promotions/p-001', '/promotions/p-005', '/promotions/does-not-exist']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: new + p-001 + p-005 → 200; does-not-exist → 404.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/promotions/delete-dialog.tsx components/promotions/promo-editor.tsx "app/(dashboard)/promotions/new/page.tsx" "app/(dashboard)/promotions/[id]/page.tsx" && \
git commit -m "Add A7.2 promotion editor (new + edit) with delete dialog"
```

---

## Task PR4: Final smoke + push

**Step 1 — tsc**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

**Step 2 — smoke**

```js
for (const url of [
  '/promotions',
  '/promotions?status=active',
  '/promotions?status=ended',
  '/promotions?status=scheduled',
  '/promotions?region=ngn',
  '/promotions/new',
  '/promotions/p-001',
  '/promotions/p-002',
  '/promotions/p-005',
  '/promotions/does-not-exist',
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

- Calendar picker for dates
- Live impact preview recalculation
- Promo code redemption flow
- Revenue impact tracking
- Loading skeletons
- Mobile card view
- Duplicate-window conflict guard
