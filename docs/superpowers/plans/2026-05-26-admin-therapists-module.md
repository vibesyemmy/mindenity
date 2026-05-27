# Admin Therapist Module Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development to execute task-by-task. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Ship the 4 therapist module screens (A3.1–A3.4) per `docs/superpowers/specs/2026-05-26-admin-therapists-module-design.md`.

**Architecture:** 4 routes inside the existing `(dashboard)` route group. Two TanStack-Table-backed list pages (directory + verifications queue) and two detail pages (therapist detail with tabs + application review with action modals). All data dummy.

**Verification gates per task** (no unit-test TDD for UI prototype):
1. `cd admin && pnpm tsc --noEmit` → exit 0
2. `fetch http://localhost:3000/<route>` → 200
3. HTML contains expected anchor text

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 · shadcn/ui · `@tanstack/react-table` v8 · Recharts.

---

## File structure

| File | Role |
|---|---|
| `admin/lib/dummy/therapists.ts` | Types + dummy data + 4 getter fns |
| `admin/components/therapists/data-table.tsx` | Reusable TanStack DataTable wrapper |
| `admin/app/(dashboard)/therapists/page.tsx` | A3.3 Directory landing |
| `admin/components/therapists/directory-columns.tsx` | Directory column defs |
| `admin/components/therapists/directory-filters.tsx` | Directory filter row |
| `admin/app/(dashboard)/therapists/[id]/page.tsx` | A3.4 Detail page |
| `admin/components/therapists/therapist-detail.tsx` | Detail composition |
| `admin/app/(dashboard)/therapists/verifications/page.tsx` | A3.1 Queue |
| `admin/components/therapists/queue-columns.tsx` | Queue column defs |
| `admin/components/therapists/queue-filters.tsx` | Queue filter row |
| `admin/app/(dashboard)/therapists/verifications/[id]/page.tsx` | A3.2 Review |
| `admin/components/therapists/application-review.tsx` | Review composition |
| `admin/components/therapists/action-modals.tsx` | Approve / Reject / Request-info dialogs |

---

## Task T1: Install dependencies

**Step 1 — shadcn additions + TanStack Table**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
pnpm dlx shadcn@latest add popover dialog textarea sonner -y && \
pnpm add @tanstack/react-table
```

Expected: 4 shadcn files added. `@tanstack/react-table` in package.json.

**Step 2 — Mount Sonner toaster in root layout**

Edit `admin/app/layout.tsx`. Add import `import { Toaster } from "@/components/ui/sonner";` and place `<Toaster />` inside `<TooltipProvider>` after `{children}`:

```tsx
<body className="min-h-full flex flex-col">
  <TooltipProvider>
    {children}
    <Toaster />
  </TooltipProvider>
</body>
```

**Step 3 — Verify + commit**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/ui/ package.json pnpm-lock.yaml app/layout.tsx && \
git commit -m "Install therapist-module deps (popover/dialog/textarea/sonner + tanstack-table)"
```

---

## Task T2: Dummy data + types

**File:** `admin/lib/dummy/therapists.ts`

```ts
// Shared types + dummy data for admin therapist module.

export type Region = "NG" | "Int'l";
export type Tier = "Standard" | "Senior" | "Clinical";
export type TherapistStatus = "Active" | "Suspended" | "On leave";
export type VerificationStatus = "Pending" | "Info requested" | "On hold";
export type AiFlag = "Clean" | "Flagged";

export type Therapist = {
  id: string;
  name: string;
  initials: string;
  email: string;
  country: string;
  region: Region;
  tier: Tier;
  status: TherapistStatus;
  plansAccepted: string[];
  sessions30d: number;
  earnings30d: { amount: number; currency: "NGN" | "USD" };
  rating: number;
  ratingCount: number;
  bio: string;
  specializations: string[];
  languages: string[];
  yearsOfPractice: number;
  licenseNumber: string;
  licenseExpiry: string; // ISO date
  joinedAt: string; // ISO date
  verifiedBy: string;
  verifiedAt: string;
};

export type VerificationApplication = {
  id: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  country: string;
  region: Region;
  dob: string; // ISO date
  timeZone: string;
  specializations: string[];
  sessionFormats: ("Video" | "Voice" | "Chat")[];
  languages: string[];
  yearsOfPractice: number;
  bio: string;
  licenseNumber: string;
  licenseIssuer: string;
  licenseExpiry: string;
  licenseFile: string;
  idFile: string;
  submittedAt: string;
  submittedAgo: string;
  status: VerificationStatus;
  aiFlag: AiFlag;
  aiChecks: {
    licenseOcr: "pass" | "fail" | "warn";
    sanctions: "pass" | "fail" | "warn";
    duplicate: "pass" | "fail" | "warn";
    bioQuality: "pass" | "fail" | "warn";
  };
  aiNote: string;
};

export type TherapistFilters = {
  q?: string;
  region?: "all" | "ng" | "intl";
  tier?: "all" | "standard" | "senior" | "clinical";
  status?: "all" | "active" | "suspended";
};

export type VerificationFilters = {
  q?: string;
  region?: "all" | "ng" | "intl";
  aiFlag?: "all" | "flagged" | "clean";
};

const THERAPISTS: Therapist[] = [
  {
    id: "t-001",
    name: "Dr. Tola Adesina",
    initials: "TA",
    email: "tola@mindenity.com",
    country: "Nigeria",
    region: "NG",
    tier: "Senior",
    status: "Active",
    plansAccepted: ["Essential", "Together", "Harmony", "Restore"],
    sessions30d: 87,
    earnings30d: { amount: 2_140_000, currency: "NGN" },
    rating: 4.9,
    ratingCount: 312,
    bio: "Couples and family therapist with 12 years of practice. CBT + EFT trained.",
    specializations: ["Couples", "Family", "Anxiety"],
    languages: ["English", "Yoruba"],
    yearsOfPractice: 12,
    licenseNumber: "NG-CLP-44211",
    licenseExpiry: "2028-08-14",
    joinedAt: "2024-03-12",
    verifiedBy: "Adaeze Nwosu",
    verifiedAt: "2024-03-15",
  },
  {
    id: "t-002",
    name: "Dr. Marcus Quinn",
    initials: "MQ",
    email: "marcus@mindenity.com",
    country: "United Kingdom",
    region: "Int'l",
    tier: "Clinical",
    status: "Active",
    plansAccepted: ["Essential", "Together", "Harmony", "Restore", "Home", "Family Care", "Family Thrive"],
    sessions30d: 102,
    earnings30d: { amount: 11_240, currency: "USD" },
    rating: 4.8,
    ratingCount: 198,
    bio: "Clinical psychologist specialising in trauma and CPTSD. EMDR certified.",
    specializations: ["Trauma", "PTSD", "Anxiety"],
    languages: ["English"],
    yearsOfPractice: 18,
    licenseNumber: "UK-HCPC-29128",
    licenseExpiry: "2027-02-01",
    joinedAt: "2024-01-08",
    verifiedBy: "Adaeze Nwosu",
    verifiedAt: "2024-01-12",
  },
  {
    id: "t-003",
    name: "Dr. Lina Park",
    initials: "LP",
    email: "lina@mindenity.com",
    country: "Singapore",
    region: "Int'l",
    tier: "Senior",
    status: "Active",
    plansAccepted: ["Together", "Harmony", "Restore"],
    sessions30d: 64,
    earnings30d: { amount: 8_120, currency: "USD" },
    rating: 4.7,
    ratingCount: 142,
    bio: "Couples therapist with a focus on cross-cultural relationships.",
    specializations: ["Couples", "Cross-cultural"],
    languages: ["English", "Korean", "Mandarin"],
    yearsOfPractice: 9,
    licenseNumber: "SG-SAC-1187",
    licenseExpiry: "2026-09-30",
    joinedAt: "2024-05-22",
    verifiedBy: "Adaeze Nwosu",
    verifiedAt: "2024-05-25",
  },
  {
    id: "t-004",
    name: "Dr. Aisha Bello",
    initials: "AB",
    email: "aisha@mindenity.com",
    country: "Nigeria",
    region: "NG",
    tier: "Standard",
    status: "Active",
    plansAccepted: ["Essential", "Together"],
    sessions30d: 41,
    earnings30d: { amount: 820_000, currency: "NGN" },
    rating: 4.6,
    ratingCount: 67,
    bio: "Individual therapy focused on workplace anxiety and burnout.",
    specializations: ["Anxiety", "Burnout"],
    languages: ["English", "Hausa", "Yoruba"],
    yearsOfPractice: 5,
    licenseNumber: "NG-CLP-55821",
    licenseExpiry: "2027-11-12",
    joinedAt: "2025-09-01",
    verifiedBy: "Sarah Okeke",
    verifiedAt: "2025-09-04",
  },
  {
    id: "t-005",
    name: "Dr. Priya Shah",
    initials: "PS",
    email: "priya@mindenity.com",
    country: "Canada",
    region: "Int'l",
    tier: "Clinical",
    status: "On leave",
    plansAccepted: ["Essential", "Harmony", "Restore", "Family Care"],
    sessions30d: 0,
    earnings30d: { amount: 0, currency: "USD" },
    rating: 4.9,
    ratingCount: 256,
    bio: "Clinical psychologist with a focus on grief and bereavement.",
    specializations: ["Grief", "Bereavement", "Family"],
    languages: ["English", "Hindi", "Gujarati"],
    yearsOfPractice: 21,
    licenseNumber: "CA-CPO-7821",
    licenseExpiry: "2029-04-18",
    joinedAt: "2023-11-04",
    verifiedBy: "Adaeze Nwosu",
    verifiedAt: "2023-11-08",
  },
  {
    id: "t-006",
    name: "Dr. Femi Ojo",
    initials: "FO",
    email: "femi@mindenity.com",
    country: "Nigeria",
    region: "NG",
    tier: "Standard",
    status: "Suspended",
    plansAccepted: [],
    sessions30d: 0,
    earnings30d: { amount: 0, currency: "NGN" },
    rating: 3.8,
    ratingCount: 12,
    bio: "Couples and individual therapy.",
    specializations: ["Couples"],
    languages: ["English", "Yoruba"],
    yearsOfPractice: 3,
    licenseNumber: "NG-CLP-88341",
    licenseExpiry: "2026-07-22",
    joinedAt: "2025-02-18",
    verifiedBy: "Sarah Okeke",
    verifiedAt: "2025-02-21",
  },
];

const VERIFICATIONS: VerificationApplication[] = [
  {
    id: "v-001",
    name: "Dr. Chinwe Okoro",
    initials: "CO",
    email: "chinwe.okoro@example.com",
    phone: "+234 803 555 0142",
    country: "Nigeria",
    region: "NG",
    dob: "1988-04-21",
    timeZone: "Africa/Lagos",
    specializations: ["Anxiety", "Depression", "Workplace stress"],
    sessionFormats: ["Video", "Voice"],
    languages: ["English", "Igbo"],
    yearsOfPractice: 8,
    bio: "Counselling psychologist with 8 years supporting clients through anxiety and workplace stress. CBT-trained, certified in ACT.",
    licenseNumber: "NG-CLP-66120",
    licenseIssuer: "Nigerian Council for Psychologists",
    licenseExpiry: "2028-03-04",
    licenseFile: "license-chinwe-okoro.pdf",
    idFile: "id-chinwe-okoro.pdf",
    submittedAt: "2026-05-24T10:14:00Z",
    submittedAgo: "2d ago",
    status: "Pending",
    aiFlag: "Clean",
    aiChecks: {
      licenseOcr: "pass",
      sanctions: "pass",
      duplicate: "pass",
      bioQuality: "pass",
    },
    aiNote: "All checks clean. Ready for review.",
  },
  {
    id: "v-002",
    name: "Dr. Mateo Alvarez",
    initials: "MA",
    email: "mateo.alvarez@example.com",
    phone: "+34 612 555 0188",
    country: "Spain",
    region: "Int'l",
    dob: "1980-11-09",
    timeZone: "Europe/Madrid",
    specializations: ["Trauma", "PTSD"],
    sessionFormats: ["Video"],
    languages: ["Spanish", "English"],
    yearsOfPractice: 15,
    bio: "Clinical psychologist focused on trauma recovery. EMDR certified.",
    licenseNumber: "ES-COP-1422",
    licenseIssuer: "Consejo General de la Psicología de España",
    licenseExpiry: "2027-12-19",
    licenseFile: "license-mateo-alvarez.pdf",
    idFile: "id-mateo-alvarez.pdf",
    submittedAt: "2026-05-25T08:30:00Z",
    submittedAgo: "1d ago",
    status: "Pending",
    aiFlag: "Flagged",
    aiChecks: {
      licenseOcr: "pass",
      sanctions: "pass",
      duplicate: "warn",
      bioQuality: "pass",
    },
    aiNote: "Possible duplicate account — similar email pattern matched 1 existing therapist. Verify.",
  },
  {
    id: "v-003",
    name: "Dr. Yui Tanaka",
    initials: "YT",
    email: "yui.tanaka@example.com",
    phone: "+81 90 5555 0124",
    country: "Japan",
    region: "Int'l",
    dob: "1990-07-15",
    timeZone: "Asia/Tokyo",
    specializations: ["Anxiety", "Couples"],
    sessionFormats: ["Video", "Chat"],
    languages: ["Japanese", "English"],
    yearsOfPractice: 6,
    bio: "Bilingual therapist with focus on cross-cultural couples and expat anxiety.",
    licenseNumber: "JP-AP-22118",
    licenseIssuer: "Japanese Association of Psychology",
    licenseExpiry: "2026-10-02",
    licenseFile: "license-yui-tanaka.pdf",
    idFile: "id-yui-tanaka.pdf",
    submittedAt: "2026-05-22T14:00:00Z",
    submittedAgo: "4d ago",
    status: "Info requested",
    aiFlag: "Clean",
    aiChecks: {
      licenseOcr: "pass",
      sanctions: "pass",
      duplicate: "pass",
      bioQuality: "warn",
    },
    aiNote: "Bio quality: short — under 80 characters. Requested longer practice description from applicant.",
  },
  {
    id: "v-004",
    name: "Dr. Kemi Adeyemi",
    initials: "KA",
    email: "kemi.a@example.com",
    phone: "+234 802 555 0167",
    country: "Nigeria",
    region: "NG",
    dob: "1985-01-30",
    timeZone: "Africa/Lagos",
    specializations: ["Grief", "Family"],
    sessionFormats: ["Video", "Voice"],
    languages: ["English", "Yoruba"],
    yearsOfPractice: 11,
    bio: "Family therapist with focus on grief and bereavement support.",
    licenseNumber: "NG-CLP-72441",
    licenseIssuer: "Nigerian Council for Psychologists",
    licenseExpiry: "2029-01-22",
    licenseFile: "license-kemi-adeyemi.pdf",
    idFile: "id-kemi-adeyemi.pdf",
    submittedAt: "2026-05-26T07:45:00Z",
    submittedAgo: "6h ago",
    status: "Pending",
    aiFlag: "Clean",
    aiChecks: {
      licenseOcr: "pass",
      sanctions: "pass",
      duplicate: "pass",
      bioQuality: "pass",
    },
    aiNote: "All checks clean.",
  },
  {
    id: "v-005",
    name: "Dr. Sven Müller",
    initials: "SM",
    email: "sven.mueller@example.com",
    phone: "+49 170 555 0119",
    country: "Germany",
    region: "Int'l",
    dob: "1975-09-22",
    timeZone: "Europe/Berlin",
    specializations: ["Trauma", "Workplace stress", "Burnout"],
    sessionFormats: ["Video"],
    languages: ["German", "English"],
    yearsOfPractice: 20,
    bio: "Clinical psychologist with 20 years in trauma-informed care and corporate wellbeing.",
    licenseNumber: "DE-BDP-88112",
    licenseIssuer: "Berufsverband Deutscher Psychologinnen und Psychologen",
    licenseExpiry: "2028-06-30",
    licenseFile: "license-sven-mueller.pdf",
    idFile: "id-sven-mueller.pdf",
    submittedAt: "2026-05-26T11:00:00Z",
    submittedAgo: "3h ago",
    status: "Pending",
    aiFlag: "Clean",
    aiChecks: {
      licenseOcr: "pass",
      sanctions: "pass",
      duplicate: "pass",
      bioQuality: "pass",
    },
    aiNote: "All checks clean.",
  },
];

function matchesQuery(haystack: string, q?: string) {
  if (!q) return true;
  return haystack.toLowerCase().includes(q.toLowerCase());
}

export function getTherapists(filters: TherapistFilters = {}): Therapist[] {
  return THERAPISTS.filter((t) => {
    if (!matchesQuery(`${t.name} ${t.country} ${t.email}`, filters.q)) return false;
    if (filters.region && filters.region !== "all") {
      const target = filters.region === "ng" ? "NG" : "Int'l";
      if (t.region !== target) return false;
    }
    if (filters.tier && filters.tier !== "all") {
      const map: Record<string, Tier> = {
        standard: "Standard",
        senior: "Senior",
        clinical: "Clinical",
      };
      if (t.tier !== map[filters.tier]) return false;
    }
    if (filters.status && filters.status !== "all") {
      const target = filters.status === "active" ? "Active" : "Suspended";
      if (t.status !== target) return false;
    }
    return true;
  });
}

export function getTherapist(id: string): Therapist | undefined {
  return THERAPISTS.find((t) => t.id === id);
}

export function getVerifications(
  filters: VerificationFilters = {}
): VerificationApplication[] {
  return VERIFICATIONS.filter((v) => {
    if (!matchesQuery(`${v.name} ${v.country} ${v.email}`, filters.q)) return false;
    if (filters.region && filters.region !== "all") {
      const target = filters.region === "ng" ? "NG" : "Int'l";
      if (v.region !== target) return false;
    }
    if (filters.aiFlag && filters.aiFlag !== "all") {
      const target = filters.aiFlag === "flagged" ? "Flagged" : "Clean";
      if (v.aiFlag !== target) return false;
    }
    return true;
  });
}

export function getVerification(id: string): VerificationApplication | undefined {
  return VERIFICATIONS.find((v) => v.id === id);
}

export function getTherapistDirectoryStats() {
  return {
    activeCount: THERAPISTS.filter((t) => t.status === "Active").length,
    plansCount: 9,
    awaitingVerification: VERIFICATIONS.filter((v) => v.status === "Pending").length,
  };
}

export function getVerificationStats() {
  return {
    pending: VERIFICATIONS.filter((v) => v.status === "Pending").length,
    flagged: VERIFICATIONS.filter((v) => v.aiFlag === "Flagged").length,
  };
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add lib/dummy/therapists.ts && \
git commit -m "Add therapist + verification dummy data"
```

---

## Task T3: Shared DataTable wrapper

**File:** `admin/components/therapists/data-table.tsx`

```tsx
"use client";

import * as React from "react";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type Props<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyMessage?: string;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  emptyMessage = "No rows.",
}: Props<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
  });

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {table.getPageCount() > 1 && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/therapists/data-table.tsx && \
git commit -m "Add reusable DataTable wrapper (TanStack v8)"
```

---

## Task T4: A3.3 Directory page

**File 1:** `admin/components/therapists/directory-columns.tsx`

```tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { Therapist } from "@/lib/dummy/therapists";

const tierVariant: Record<Therapist["tier"], "default" | "secondary" | "outline"> = {
  Standard: "outline",
  Senior: "secondary",
  Clinical: "default",
};

const statusVariant: Record<Therapist["status"], "secondary" | "destructive" | "outline"> = {
  Active: "secondary",
  Suspended: "destructive",
  "On leave": "outline",
};

function formatEarnings(e: Therapist["earnings30d"]): string {
  if (e.amount === 0) return "—";
  if (e.currency === "NGN") return `₦${(e.amount / 1000).toFixed(0)}k`;
  return `$${e.amount.toLocaleString()}`;
}

export const directoryColumns: ColumnDef<Therapist>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const t = row.original;
      return (
        <Link
          href={`/therapists/${t.id}`}
          className="flex items-center gap-3 hover:underline"
        >
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold"
          >
            {t.initials}
          </span>
          <span className="font-medium">{t.name}</span>
        </Link>
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
    accessorKey: "tier",
    header: "Tier",
    cell: ({ row }) => (
      <Badge variant={tierVariant[row.original.tier]}>
        {row.original.tier}
      </Badge>
    ),
  },
  {
    accessorKey: "plansAccepted",
    header: "Plans",
    cell: ({ row }) => {
      const plans = row.original.plansAccepted;
      if (plans.length === 0) return <span className="text-muted-foreground">—</span>;
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
    accessorKey: "sessions30d",
    header: "Sessions (30d)",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.sessions30d}</span>
    ),
  },
  {
    accessorKey: "earnings30d",
    header: "Earnings (30d)",
    cell: ({ row }) => (
      <span className="tabular-nums">{formatEarnings(row.original.earnings30d)}</span>
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
        href={`/therapists/${row.original.id}`}
        aria-label={`Open ${row.original.name}`}
      >
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    ),
  },
];
```

**File 2:** `admin/components/therapists/directory-filters.tsx`

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

export function DirectoryFilters() {
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
        placeholder="Search by name, country, email…"
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
        value={params.get("tier") ?? "all"}
        onValueChange={(v) => setParam("tier", v)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Tier" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All tiers</SelectItem>
          <SelectItem value="standard">Standard</SelectItem>
          <SelectItem value="senior">Senior</SelectItem>
          <SelectItem value="clinical">Clinical</SelectItem>
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
        </SelectContent>
      </Select>
    </div>
  );
}
```

**File 3:** `admin/app/(dashboard)/therapists/page.tsx`

```tsx
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/therapists/data-table";
import { directoryColumns } from "@/components/therapists/directory-columns";
import { DirectoryFilters } from "@/components/therapists/directory-filters";

import {
  getTherapists,
  getTherapistDirectoryStats,
  type TherapistFilters,
} from "@/lib/dummy/therapists";

type SearchParams = Promise<{
  q?: string;
  region?: string;
  tier?: string;
  status?: string;
}>;

function asTherapistFilters(p: Awaited<SearchParams>): TherapistFilters {
  return {
    q: p.q,
    region: p.region as TherapistFilters["region"],
    tier: p.tier as TherapistFilters["tier"],
    status: p.status as TherapistFilters["status"],
  };
}

export default async function TherapistsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asTherapistFilters(params);
  const therapists = getTherapists(filters);
  const stats = getTherapistDirectoryStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Therapists</h1>
          <p className="text-sm text-muted-foreground">
            {stats.activeCount} active across {stats.plansCount} plans ·{" "}
            {stats.awaitingVerification} awaiting verification
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/therapists/verifications">Open verifications →</Link>
          </Button>
          <Button variant="outline" disabled>
            Export CSV
          </Button>
        </div>
      </header>

      <DirectoryFilters />

      <DataTable
        columns={directoryColumns}
        data={therapists}
        emptyMessage="No therapists match these filters."
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
// via ctx_execute
for (const url of ['/therapists', '/therapists?region=ng', '/therapists?tier=senior&status=active']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: all `200`.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/therapists/ "app/(dashboard)/therapists/page.tsx" && \
git commit -m "Add A3.3 therapist directory page"
```

---

## Task T5: A3.4 Therapist detail page

**File 1:** `admin/components/therapists/therapist-detail.tsx`

```tsx
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { Therapist } from "@/lib/dummy/therapists";
import { toast } from "sonner";

const statusVariant: Record<
  Therapist["status"],
  "secondary" | "destructive" | "outline"
> = {
  Active: "secondary",
  Suspended: "destructive",
  "On leave": "outline",
};

type Props = {
  therapist: Therapist;
};

function formatEarnings(e: Therapist["earnings30d"]): string {
  if (e.amount === 0) return "—";
  if (e.currency === "NGN") return `₦${(e.amount / 1000).toFixed(0)}k`;
  return `$${e.amount.toLocaleString()}`;
}

export function TherapistDetail({ therapist: t }: Props) {
  const [suspendOpen, setSuspendOpen] = useState(false);

  const handleSuspend = () => {
    toast.success(`${t.name} suspended`, {
      description: "Therapist will not appear in client searches.",
    });
    setSuspendOpen(false);
  };

  return (
    <div className="space-y-6">
      <Link
        href="/therapists"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Therapists
      </Link>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-muted text-base font-semibold"
          >
            {t.initials}
          </span>
          <div className="space-y-1.5">
            <h1 className="font-heading text-3xl tracking-tight">{t.name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="outline" className="font-normal">
                {t.region} · {t.country}
              </Badge>
              <Badge variant="secondary">{t.tier}</Badge>
              <Badge variant={statusVariant[t.status]}>{t.status}</Badge>
              <span className="text-muted-foreground">
                {t.rating.toFixed(1)} ★ ({t.ratingCount.toLocaleString()})
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={() => setSuspendOpen(true)}
          disabled={t.status !== "Active"}
        >
          Suspend therapist
        </Button>
      </header>

      <section
        aria-label="Stats"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {[
          { label: "Sessions (lifetime)", value: (t.sessions30d * 14).toLocaleString() },
          { label: "Active clients", value: Math.round(t.sessions30d / 4).toString() },
          { label: "Earnings (30d)", value: formatEarnings(t.earnings30d) },
          { label: "Avg rating", value: `${t.rating.toFixed(1)} ★` },
        ].map((s) => (
          <Card key={s.label} className="gap-1 py-4">
            <CardHeader className="p-0 px-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {s.label}
              </p>
            </CardHeader>
            <CardContent className="px-5">
              <p className="font-heading text-2xl tabular-nums">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans &amp; pricing</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="risk">Risk record</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="activity">Activity log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{t.bio}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Credentials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">License:</span>{" "}
                  <span className="font-medium">{t.licenseNumber}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Expires:</span>{" "}
                  {new Date(t.licenseExpiry).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <span className="text-muted-foreground">Years of practice:</span>{" "}
                  {t.yearsOfPractice}
                </p>
                <p>
                  <span className="text-muted-foreground">Joined:</span>{" "}
                  {new Date(t.joinedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <span className="text-muted-foreground">Verified by:</span>{" "}
                  {t.verifiedBy} ·{" "}
                  {new Date(t.verifiedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Practice info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Specializations</p>
                  <div className="flex flex-wrap gap-1.5">
                    {t.specializations.map((s) => (
                      <Badge key={s} variant="outline" className="font-normal">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Languages</p>
                  <p>{t.languages.join(" · ")}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {(["plans", "sessions", "risk", "earnings", "activity"] as const).map(
          (key) => (
            <TabsContent key={key} value={key} className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="capitalize">
                    {key === "plans"
                      ? "Plans & pricing"
                      : key === "risk"
                        ? "Risk record"
                        : key === "activity"
                          ? "Activity log"
                          : key}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Full {key} view not built in this prototype. Wire to a
                    dedicated screen when the underlying data layer lands.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )
        )}
      </Tabs>

      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend {t.name}?</DialogTitle>
            <DialogDescription>
              The therapist will be removed from client searches and existing
              bookings will need to be rescheduled. They can be reinstated at any
              time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSuspend}>
              Suspend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

**File 2:** `admin/app/(dashboard)/therapists/[id]/page.tsx`

```tsx
import { notFound } from "next/navigation";

import { TherapistDetail } from "@/components/therapists/therapist-detail";
import { getTherapist } from "@/lib/dummy/therapists";

type Params = Promise<{ id: string }>;

export default async function TherapistDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const therapist = getTherapist(id);
  if (!therapist) notFound();

  return <TherapistDetail therapist={therapist} />;
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

```js
for (const url of ['/therapists/t-001', '/therapists/t-006', '/therapists/does-not-exist']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: t-001 + t-006 → 200; does-not-exist → 404.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/therapists/therapist-detail.tsx "app/(dashboard)/therapists/[id]/page.tsx" && \
git commit -m "Add A3.4 therapist detail page"
```

---

## Task T6: A3.1 Verifications queue

**File 1:** `admin/components/therapists/queue-columns.tsx`

```tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import type { VerificationApplication } from "@/lib/dummy/therapists";

const statusVariant: Record<
  VerificationApplication["status"],
  "secondary" | "outline" | "default"
> = {
  Pending: "default",
  "Info requested": "outline",
  "On hold": "secondary",
};

export const queueColumns: ColumnDef<VerificationApplication>[] = [
  {
    accessorKey: "name",
    header: "Applicant",
    cell: ({ row }) => {
      const v = row.original;
      return (
        <Link
          href={`/therapists/verifications/${v.id}`}
          className="flex items-center gap-3 hover:underline"
        >
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold"
          >
            {v.initials}
          </span>
          <span className="font-medium">{v.name}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.country}</span>
    ),
  },
  {
    accessorKey: "specializations",
    header: "Specializations",
    cell: ({ row }) => {
      const specs = row.original.specializations;
      const visible = specs.slice(0, 2);
      const overflow = specs.length - visible.length;
      return (
        <div className="flex flex-wrap items-center gap-1">
          {visible.map((s) => (
            <Badge key={s} variant="outline" className="font-normal">
              {s}
            </Badge>
          ))}
          {overflow > 0 && (
            <Badge variant="outline" className="font-normal">
              +{overflow}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "submittedAgo",
    header: "Submitted",
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">{row.original.submittedAgo}</span>
    ),
  },
  {
    accessorKey: "aiFlag",
    header: "AI flag",
    cell: ({ row }) => {
      const v = row.original;
      const badge =
        v.aiFlag === "Flagged" ? (
          <Badge variant="destructive">Flagged</Badge>
        ) : (
          <Badge variant="secondary">Clean</Badge>
        );
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">{badge}</span>
          </TooltipTrigger>
          <TooltipContent side="top">{v.aiNote}</TooltipContent>
        </Tooltip>
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
        href={`/therapists/verifications/${row.original.id}`}
        aria-label={`Open ${row.original.name}`}
      >
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    ),
  },
];
```

**File 2:** `admin/components/therapists/queue-filters.tsx`

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

export function QueueFilters() {
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
        placeholder="Search applicants…"
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
        value={params.get("aiFlag") ?? "all"}
        onValueChange={(v) => setParam("aiFlag", v)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="AI flag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All flags</SelectItem>
          <SelectItem value="flagged">Flagged</SelectItem>
          <SelectItem value="clean">Clean</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

**File 3:** `admin/app/(dashboard)/therapists/verifications/page.tsx`

```tsx
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/therapists/data-table";
import { queueColumns } from "@/components/therapists/queue-columns";
import { QueueFilters } from "@/components/therapists/queue-filters";

import {
  getVerifications,
  getVerificationStats,
  type VerificationFilters,
} from "@/lib/dummy/therapists";

type SearchParams = Promise<{
  q?: string;
  region?: string;
  aiFlag?: string;
}>;

function asVerificationFilters(
  p: Awaited<SearchParams>
): VerificationFilters {
  return {
    q: p.q,
    region: p.region as VerificationFilters["region"],
    aiFlag: p.aiFlag as VerificationFilters["aiFlag"],
  };
}

export default async function VerificationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asVerificationFilters(params);
  const verifications = getVerifications(filters);
  const stats = getVerificationStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            Verifications waiting
          </h1>
          <p className="text-sm text-muted-foreground">
            {stats.pending} applications pending review · {stats.flagged} flagged
            by AI
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/therapists">← Back to directory</Link>
        </Button>
      </header>

      <QueueFilters />

      <DataTable
        columns={queueColumns}
        data={verifications}
        emptyMessage="All caught up — no pending applications."
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
for (const url of ['/therapists/verifications', '/therapists/verifications?aiFlag=flagged']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: both `200`.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/therapists/queue-*.tsx "app/(dashboard)/therapists/verifications/page.tsx" && \
git commit -m "Add A3.1 verifications queue page"
```

---

## Task T7: A3.2 Application review

**File 1:** `admin/components/therapists/action-modals.tsx`

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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import type { VerificationApplication } from "@/lib/dummy/therapists";

type Action = "approve" | "reject" | "info";

type Props = {
  application: VerificationApplication;
};

export function ActionBar({ application }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<Action | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const handleAction = (action: Action) => {
    if (action === "approve") {
      toast.success(`${application.name} approved`, {
        description: "Welcome email queued for delivery.",
      });
    } else if (action === "reject") {
      if (rejectReason.trim().length < 5) {
        toast.error("Add a rejection reason of at least 5 characters.");
        return;
      }
      toast.success(`${application.name} rejected`, {
        description: "Resubmission link sent.",
      });
    } else {
      toast.success(`Info request sent to ${application.name}`, {
        description: infoMessage.trim() || "Applicant will be notified.",
      });
    }
    setOpen(null);
    router.push("/therapists/verifications");
  };

  return (
    <>
      <div className="sticky top-20 flex flex-col gap-2">
        <Button onClick={() => setOpen("approve")} className="w-full">
          Approve
        </Button>
        <Button
          variant="outline"
          onClick={() => setOpen("info")}
          className="w-full"
        >
          Request more info
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
            <DialogTitle>Approve {application.name}?</DialogTitle>
            <DialogDescription>
              Activates the therapist account and queues the welcome email.
              They&apos;ll be prompted to set up plan preferences and visibility.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Email preview</p>
            <p>Subject: Welcome to Mindenity, {application.name}</p>
            <p className="mt-1">
              Hi {application.name.split(" ").slice(-1)[0]}, your application has
              been approved…
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleAction("approve")}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open === "reject"} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject {application.name}?</DialogTitle>
            <DialogDescription>
              A rejection reason is required. The applicant will receive it with
              a resubmission link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="E.g. License document unreadable; please resubmit a higher-resolution scan."
              rows={4}
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

      <Dialog open={open === "info"} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request more info from {application.name}</DialogTitle>
            <DialogDescription>
              Add a message describing what&apos;s missing. Optional — applicant
              will be notified either way.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="info-message">Message (optional)</Label>
            <Textarea
              id="info-message"
              value={infoMessage}
              onChange={(e) => setInfoMessage(e.target.value)}
              placeholder="E.g. Could you confirm your specializations? Bio is short."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleAction("info")}>Send request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

**File 2:** `admin/components/therapists/application-review.tsx`

```tsx
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ActionBar } from "@/components/therapists/action-modals";

import type { VerificationApplication } from "@/lib/dummy/therapists";

type Props = {
  application: VerificationApplication;
};

const statusVariant: Record<
  VerificationApplication["status"],
  "secondary" | "outline" | "default"
> = {
  Pending: "default",
  "Info requested": "outline",
  "On hold": "secondary",
};

const checkVariant: Record<
  "pass" | "fail" | "warn",
  "secondary" | "destructive" | "outline"
> = {
  pass: "secondary",
  fail: "destructive",
  warn: "outline",
};

const checkLabel: Record<"pass" | "fail" | "warn", string> = {
  pass: "Pass",
  fail: "Fail",
  warn: "Warn",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ApplicationReview({ application: v }: Props) {
  return (
    <div className="space-y-6">
      <Link
        href="/therapists/verifications"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Verifications queue
      </Link>

      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-3xl tracking-tight">
            Application — {v.name}
          </h1>
          <Badge variant={statusVariant[v.status]}>{v.status}</Badge>
          {v.aiFlag === "Flagged" && <Badge variant="destructive">AI flagged</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">
          Submitted {v.submittedAgo} from {v.country}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_220px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <p>
                <span className="text-muted-foreground">Email:</span> {v.email}
              </p>
              <p>
                <span className="text-muted-foreground">Phone:</span> {v.phone}
              </p>
              <p>
                <span className="text-muted-foreground">Country:</span>{" "}
                {v.country}
              </p>
              <p>
                <span className="text-muted-foreground">Time zone:</span>{" "}
                {v.timeZone}
              </p>
              <p>
                <span className="text-muted-foreground">Date of birth:</span>{" "}
                {formatDate(v.dob)}
              </p>
              <p>
                <span className="text-muted-foreground">Region:</span> {v.region}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">License number:</span>{" "}
                <span className="font-medium">{v.licenseNumber}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Issuing body:</span>{" "}
                {v.licenseIssuer}
              </p>
              <p>
                <span className="text-muted-foreground">Expires:</span>{" "}
                {formatDate(v.licenseExpiry)}
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-2 text-sm hover:underline"
                >
                  <FileText className="size-3.5" />
                  {v.licenseFile}
                </a>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-2 text-sm hover:underline"
                >
                  <FileText className="size-3.5" />
                  {v.idFile}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Practice info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Specializations</p>
                <div className="flex flex-wrap gap-1.5">
                  {v.specializations.map((s) => (
                    <Badge key={s} variant="outline" className="font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Session formats</p>
                <p>{v.sessionFormats.join(" · ")}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Languages</p>
                <p>{v.languages.join(" · ")}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Years of practice</p>
                <p>{v.yearsOfPractice}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Bio</p>
                <p className="leading-relaxed">{v.bio}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>AI pre-screening</CardTitle>
              {v.aiFlag === "Flagged" ? (
                <Badge variant="destructive">Flagged</Badge>
              ) : (
                <Badge variant="secondary">Clean</Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <ul className="space-y-2">
                {(
                  [
                    ["License OCR match", v.aiChecks.licenseOcr],
                    ["Sanctions check", v.aiChecks.sanctions],
                    ["Duplicate account", v.aiChecks.duplicate],
                    ["Bio quality", v.aiChecks.bioQuality],
                  ] as const
                ).map(([label, result]) => (
                  <li key={label} className="flex items-center justify-between">
                    <span>{label}</span>
                    <Badge variant={checkVariant[result]} className="font-normal">
                      {checkLabel[result]}
                    </Badge>
                  </li>
                ))}
              </ul>
              <p className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                {v.aiNote}
              </p>
            </CardContent>
          </Card>
        </div>

        <aside>
          <ActionBar application={v} />
        </aside>
      </div>
    </div>
  );
}
```

**File 3:** `admin/app/(dashboard)/therapists/verifications/[id]/page.tsx`

```tsx
import { notFound } from "next/navigation";

import { ApplicationReview } from "@/components/therapists/application-review";
import { getVerification } from "@/lib/dummy/therapists";

type Params = Promise<{ id: string }>;

export default async function ApplicationReviewPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const application = getVerification(id);
  if (!application) notFound();

  return <ApplicationReview application={application} />;
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

```js
for (const url of ['/therapists/verifications/v-001', '/therapists/verifications/v-002', '/therapists/verifications/nope']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: v-001 + v-002 → 200; nope → 404.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/therapists/application-review.tsx components/therapists/action-modals.tsx "app/(dashboard)/therapists/verifications/[id]/page.tsx" && \
git commit -m "Add A3.2 application review page with action modals"
```

---

## Task T8: Final smoke + push

**Step 1 — Full type check**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```
Expected: exit code 0.

**Step 2 — Hit every therapist route**

```js
for (const url of [
  '/therapists',
  '/therapists?region=ng',
  '/therapists?tier=clinical&status=active',
  '/therapists/t-001',
  '/therapists/t-002',
  '/therapists/verifications',
  '/therapists/verifications?aiFlag=flagged',
  '/therapists/verifications/v-001',
  '/therapists/verifications/v-002',
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

- Real document viewer for license/ID files
- Real email send on Approve / Reject / Request info
- Bulk approve / reject
- Mobile (<1024px) card-list view for tables
- Plans / Sessions / Risk / Earnings / Activity tab full content on A3.4
- Tier override UI on A3.4 (placeholder text only)
