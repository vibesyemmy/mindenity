# Admin Compliance Module Implementation Plan

> Use superpowers:subagent-driven-development to execute task-by-task.

**Goal:** Ship A10 module (dashboard + subject requests + residency) per `docs/superpowers/specs/2026-05-27-admin-compliance-module-design.md`.

**Architecture:** 3 routes inside `(dashboard)` group. Reuses every component from earlier modules. **No new deps.**

---

## File structure

| File | Role |
|---|---|
| `admin/lib/dummy/compliance.ts` | Types + dummy data + getters/stats |
| `admin/components/compliance/audits-table.tsx` | A10.1 recent audits |
| `admin/components/compliance/action-items-list.tsx` | A10.1 outstanding actions |
| `admin/app/(dashboard)/compliance/page.tsx` | A10.1 entry |
| `admin/components/compliance/request-columns.tsx` | A10.2 columns |
| `admin/components/compliance/request-filters.tsx` | A10.2 filters + tabs |
| `admin/components/compliance/request-drawer.tsx` | A10.2 sheet drawer + dialogs |
| `admin/components/compliance/requests-list.tsx` | A10.2 client wrapper |
| `admin/app/(dashboard)/compliance/requests/page.tsx` | A10.2 entry |
| `admin/components/compliance/residency-card.tsx` | A10.3 region card |
| `admin/app/(dashboard)/compliance/residency/page.tsx` | A10.3 entry |

---

## Task CP1: Dummy compliance data + types

**File:** `admin/lib/dummy/compliance.ts`

```ts
// Shared types + dummy data for admin compliance module.
// Cross-references existing client + therapist IDs.

export type Region = "NG" | "Int'l";
export type SubjectType = "Client" | "Therapist";
export type RequestType = "Export" | "Delete";
export type Regulation = "NDPR" | "GDPR";
export type RequestStatus = "Pending" | "In progress" | "Fulfilled" | "Rejected";
export type AuditOutcome = "Passed" | "Passed with notes" | "Action required";
export type ResidencyStatus = "Compliant" | "Action required";

export type SubjectRequest = {
  id: string;
  type: RequestType;
  subjectType: SubjectType;
  subjectId: string;
  subjectAlias: string;
  subjectName: string;
  subjectEmail: string;
  region: Region;
  country: string;
  regulation: Regulation;
  submittedAt: string; // ISO
  dueBy: string; // ISO
  status: RequestStatus;
  clientReason?: string;
  decisionNote?: string;
};

export type AuditEntry = {
  id: string;
  date: string; // ISO
  region: Region;
  auditType: string;
  outcome: AuditOutcome;
  auditor: string;
};

export type ActionItem = {
  id: string;
  priority: "high" | "medium" | "low";
  description: string;
  dueDate: string; // ISO
  owner: string;
  href: string;
};

export type ResidencyRegion = {
  id: string;
  name: string;
  flagEmoji: string;
  storageLocation: string;
  primaryProcessor: string;
  subProcessors: string[];
  lastAuditDate: string; // ISO
  complianceCerts: string[];
  status: ResidencyStatus;
  notes: string;
};

export type RequestFilters = {
  status?: "all" | "pending" | "in-progress" | "fulfilled" | "rejected";
  type?: "all" | "export" | "delete";
  region?: "all" | "ng" | "intl";
};

const SUBJECT_REQUESTS: SubjectRequest[] = [
  {
    id: "sr-001",
    type: "Export",
    subjectType: "Client",
    subjectId: "c-002",
    subjectAlias: "Client-8842",
    subjectName: "James Carter",
    subjectEmail: "james.c@example.com",
    region: "Int'l",
    country: "United Kingdom",
    regulation: "GDPR",
    submittedAt: "2026-05-20T10:00:00Z",
    dueBy: "2026-06-19T10:00:00Z",
    status: "Pending",
    clientReason:
      "Switching therapy providers; would like full record export for new clinician.",
  },
  {
    id: "sr-002",
    type: "Delete",
    subjectType: "Client",
    subjectId: "c-006",
    subjectAlias: "Client-4318",
    subjectName: "Sofia Müller",
    subjectEmail: "sofia.m@example.com",
    region: "Int'l",
    country: "Germany",
    regulation: "GDPR",
    submittedAt: "2026-04-25T14:00:00Z",
    dueBy: "2026-05-25T14:00:00Z",
    status: "In progress",
    clientReason:
      "Account cancelled — exercising right to erasure under GDPR Article 17.",
  },
  {
    id: "sr-003",
    type: "Export",
    subjectType: "Client",
    subjectId: "c-001",
    subjectAlias: "Client-9128",
    subjectName: "Ada Okeke",
    subjectEmail: "ada.okeke@example.com",
    region: "NG",
    country: "Nigeria",
    regulation: "NDPR",
    submittedAt: "2026-05-22T09:00:00Z",
    dueBy: "2026-06-21T09:00:00Z",
    status: "Pending",
  },
  {
    id: "sr-004",
    type: "Export",
    subjectType: "Therapist",
    subjectId: "t-006",
    subjectAlias: "Dr. Femi Ojo",
    subjectName: "Dr. Femi Ojo",
    subjectEmail: "femi@mindenity.com",
    region: "NG",
    country: "Nigeria",
    regulation: "NDPR",
    submittedAt: "2026-05-18T11:00:00Z",
    dueBy: "2026-06-17T11:00:00Z",
    status: "Pending",
    clientReason: "Account suspended; requesting all data on file before contesting.",
  },
  {
    id: "sr-005",
    type: "Delete",
    subjectType: "Client",
    subjectId: "c-007",
    subjectAlias: "Client-3902",
    subjectName: "Tunde Okafor",
    subjectEmail: "tunde.o@example.com",
    region: "NG",
    country: "Nigeria",
    regulation: "NDPR",
    submittedAt: "2026-03-15T10:00:00Z",
    dueBy: "2026-04-14T10:00:00Z",
    status: "Fulfilled",
    decisionNote:
      "Deletion completed 2026-04-10. Audit trail entry preserved per retention policy.",
  },
  {
    id: "sr-006",
    type: "Export",
    subjectType: "Client",
    subjectId: "c-004",
    subjectAlias: "Client-6451",
    subjectName: "Marina Costa",
    subjectEmail: "marina.c@example.com",
    region: "Int'l",
    country: "Spain",
    regulation: "GDPR",
    submittedAt: "2026-02-08T15:00:00Z",
    dueBy: "2026-03-10T15:00:00Z",
    status: "Rejected",
    decisionNote:
      "Identity verification failed twice — could not confirm requester is account holder. Resubmission instructions sent.",
  },
];

const AUDITS: AuditEntry[] = [
  {
    id: "a-001",
    date: "2026-05-12T00:00:00Z",
    region: "NG",
    auditType: "NDPR quarterly review",
    outcome: "Passed",
    auditor: "External · Andersen Compliance",
  },
  {
    id: "a-002",
    date: "2026-04-28T00:00:00Z",
    region: "Int'l",
    auditType: "GDPR sub-processor refresh",
    outcome: "Passed with notes",
    auditor: "Internal · DPO",
  },
  {
    id: "a-003",
    date: "2026-04-10T00:00:00Z",
    region: "NG",
    auditType: "Data residency spot-check",
    outcome: "Passed",
    auditor: "Internal · Security",
  },
  {
    id: "a-004",
    date: "2026-03-22T00:00:00Z",
    region: "Int'l",
    auditType: "Consent record sampling",
    outcome: "Action required",
    auditor: "External · PrivacyHub",
  },
  {
    id: "a-005",
    date: "2026-03-01T00:00:00Z",
    region: "NG",
    auditType: "Encryption-at-rest audit",
    outcome: "Passed",
    auditor: "External · Andersen Compliance",
  },
];

const ACTION_ITEMS: ActionItem[] = [
  {
    id: "ai-001",
    priority: "high",
    description: "Client-4318 deletion request overdue (GDPR · DE)",
    dueDate: "2026-05-25T14:00:00Z",
    owner: "Adaeze Nwosu",
    href: "/compliance/requests",
  },
  {
    id: "ai-002",
    priority: "high",
    description: "Refresh GDPR consent banner copy for EU clients",
    dueDate: "2026-06-15T00:00:00Z",
    owner: "Legal team",
    href: "/compliance/requests",
  },
  {
    id: "ai-003",
    priority: "medium",
    description: "Annual sub-processor disclosure update",
    dueDate: "2026-07-01T00:00:00Z",
    owner: "DPO",
    href: "/compliance/residency",
  },
  {
    id: "ai-004",
    priority: "low",
    description: "Document retention schedule review",
    dueDate: "2026-08-30T00:00:00Z",
    owner: "Adaeze Nwosu",
    href: "/compliance/residency",
  },
];

const RESIDENCY_REGIONS: ResidencyRegion[] = [
  {
    id: "rr-ng",
    name: "Nigeria",
    flagEmoji: "🇳🇬",
    storageLocation: "AWS af-south-1 (Cape Town) · primary · AWS eu-west-1 (Dublin) · DR replica encrypted at rest",
    primaryProcessor: "Amazon Web Services Africa",
    subProcessors: [
      "Paystack · payment processing",
      "Twilio · SMS (crisis line + 2FA)",
      "Postmark · transactional email",
      "OpenAI · AI Companion (de-identified messages only)",
    ],
    lastAuditDate: "2026-05-12T00:00:00Z",
    complianceCerts: ["NDPR-registered DPO", "ISO 27001", "SOC 2 Type II"],
    status: "Compliant",
    notes:
      "All client + therapist data for NG residents stored in af-south-1. DR replica in Dublin under DPA covering cross-border transfer.",
  },
  {
    id: "rr-eu",
    name: "European Union",
    flagEmoji: "🇪🇺",
    storageLocation: "AWS eu-west-1 (Dublin) · primary · AWS eu-central-1 (Frankfurt) · DR replica",
    primaryProcessor: "Amazon Web Services EMEA",
    subProcessors: [
      "Stripe Connect · payment processing",
      "Twilio EU · SMS",
      "Postmark · transactional email",
      "OpenAI · AI Companion (DPA + EU data residency)",
    ],
    lastAuditDate: "2026-04-28T00:00:00Z",
    complianceCerts: ["GDPR DPO", "ISO 27001", "SOC 2 Type II", "EU SCC 2021 (with US sub-processors)"],
    status: "Compliant",
    notes:
      "EU client + therapist data never leaves EU AWS regions. US sub-processors covered under Standard Contractual Clauses + Transfer Impact Assessment.",
  },
  {
    id: "rr-other",
    name: "Other International",
    flagEmoji: "🌍",
    storageLocation: "AWS us-east-1 (Virginia) · primary · AWS ap-southeast-1 (Singapore) · DR replica",
    primaryProcessor: "Amazon Web Services",
    subProcessors: [
      "Stripe Connect · payment processing",
      "Twilio · SMS",
      "Postmark · transactional email",
      "OpenAI · AI Companion",
    ],
    lastAuditDate: "2026-04-10T00:00:00Z",
    complianceCerts: ["SOC 2 Type II", "Local regs reviewed per-country (US, CA, AU, SG, JP)"],
    status: "Action required",
    notes:
      "New therapists onboarding from Japan + Singapore — local data protection law review pending with external counsel. Target completion 2026-07-01.",
  },
];

function isOverdue(req: SubjectRequest): boolean {
  if (req.status === "Fulfilled" || req.status === "Rejected") return false;
  return new Date(req.dueBy).getTime() < Date.now();
}

export function getSubjectRequests(
  filters: RequestFilters = {}
): SubjectRequest[] {
  return SUBJECT_REQUESTS.filter((r) => {
    if (filters.status && filters.status !== "all") {
      const map: Record<string, RequestStatus> = {
        pending: "Pending",
        "in-progress": "In progress",
        fulfilled: "Fulfilled",
        rejected: "Rejected",
      };
      if (r.status !== map[filters.status]) return false;
    }
    if (filters.type && filters.type !== "all") {
      const target: RequestType = filters.type === "export" ? "Export" : "Delete";
      if (r.type !== target) return false;
    }
    if (filters.region && filters.region !== "all") {
      const target: Region = filters.region === "ng" ? "NG" : "Int'l";
      if (r.region !== target) return false;
    }
    return true;
  });
}

export function getSubjectRequest(id: string): SubjectRequest | undefined {
  return SUBJECT_REQUESTS.find((r) => r.id === id);
}

export function getRecentAudits(limit = 5): AuditEntry[] {
  return AUDITS.slice(0, limit);
}

export function getActionItems(): ActionItem[] {
  return ACTION_ITEMS;
}

export function getResidencyRegions(): ResidencyRegion[] {
  return RESIDENCY_REGIONS;
}

export function getComplianceStats() {
  const pending = SUBJECT_REQUESTS.filter(
    (r) => r.status === "Pending" || r.status === "In progress"
  ).length;
  const overdue = SUBJECT_REQUESTS.filter(isOverdue).length;
  const compliantRegions = RESIDENCY_REGIONS.filter(
    (r) => r.status === "Compliant"
  ).length;
  return {
    openRequestCount: pending,
    overdueCount: overdue,
    consentFreshnessPct: 94,
    consentLastRefresh: "2026-05-15",
    compliantRegions,
    totalRegions: RESIDENCY_REGIONS.length,
  };
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

export function formatCountdown(iso: string): { text: string; overdue: boolean } {
  const diffSec = Math.round((new Date(iso).getTime() - Date.now()) / 1000);
  const overdue = diffSec < 0;
  const abs = Math.abs(diffSec);
  const diffDay = Math.round(abs / 86_400);
  const diffHour = Math.round(abs / 3600);
  if (abs < 86_400)
    return { text: `${overdue ? "overdue" : "due in"} ${diffHour}h`, overdue };
  return {
    text: `${overdue ? "overdue" : "due in"} ${diffDay}d`,
    overdue,
  };
}

export function getSubjectHref(req: SubjectRequest): string {
  if (req.subjectType === "Client") return `/clients/${req.subjectId}`;
  return `/therapists/${req.subjectId}`;
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add lib/dummy/compliance.ts && \
git commit -m "Add compliance dummy data (subject requests + audits + residency)"
```

---

## Task CP2: A10.1 Compliance dashboard

**File 1:** `admin/components/compliance/audits-table.tsx`

```tsx
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
  formatDate,
  getRecentAudits,
  type AuditEntry,
} from "@/lib/dummy/compliance";

const outcomeVariant: Record<
  AuditEntry["outcome"],
  "secondary" | "outline" | "destructive"
> = {
  Passed: "secondary",
  "Passed with notes": "outline",
  "Action required": "destructive",
};

export function AuditsTable() {
  const audits = getRecentAudits();

  return (
    <div className="rounded-md border border-border/60 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Audit type</TableHead>
            <TableHead>Outcome</TableHead>
            <TableHead>Auditor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="tabular-nums text-sm">{formatDate(a.date)}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {a.region}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{a.auditType}</TableCell>
              <TableCell>
                <Badge variant={outcomeVariant[a.outcome]} className="font-normal">
                  {a.outcome}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {a.auditor}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

**File 2:** `admin/components/compliance/action-items-list.tsx`

```tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  formatDate,
  getActionItems,
  type ActionItem,
} from "@/lib/dummy/compliance";

const priorityDot: Record<ActionItem["priority"], string> = {
  high: "bg-destructive",
  medium: "bg-amber-500",
  low: "bg-muted-foreground/40",
};

export function ActionItemsList() {
  const items = getActionItems();

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No outstanding action items. Nice.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-3 rounded-md border border-border/60 px-3 py-2"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              aria-hidden
              className={`size-2 shrink-0 rounded-full ${priorityDot[item.priority]}`}
              title={`${item.priority} priority`}
            />
            <div className="min-w-0">
              <p className="text-sm">{item.description}</p>
              <p className="text-xs text-muted-foreground">
                Due {formatDate(item.dueDate)} · {item.owner}
              </p>
            </div>
          </div>
          <Link
            href={item.href}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5"
          >
            Open <ChevronRight className="size-3" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
```

**File 3:** `admin/app/(dashboard)/compliance/page.tsx`

```tsx
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AuditsTable } from "@/components/compliance/audits-table";
import { ActionItemsList } from "@/components/compliance/action-items-list";

import { getComplianceStats } from "@/lib/dummy/compliance";

export default function CompliancePage() {
  const stats = getComplianceStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Compliance</h1>
          <p className="text-sm text-muted-foreground">
            NDPR + GDPR governance · {stats.openRequestCount} open requests ·{" "}
            {stats.overdueCount} overdue
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/compliance/requests">Subject requests →</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/compliance/residency">Residency settings →</Link>
          </Button>
        </div>
      </header>

      <section
        aria-label="KPIs"
        className="grid grid-cols-1 gap-3 lg:grid-cols-3"
      >
        <Card className="gap-1 py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Subject requests
            </p>
          </CardHeader>
          <CardContent className="px-5">
            <p className="font-heading text-2xl tabular-nums">
              {stats.openRequestCount}
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.overdueCount} overdue · NDPR + GDPR SLA 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="gap-1 py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Consent records up to date
            </p>
          </CardHeader>
          <CardContent className="px-5">
            <p className="font-heading text-2xl tabular-nums">
              {stats.consentFreshnessPct}%
            </p>
            <p className="text-xs text-muted-foreground">
              Last refresh {stats.consentLastRefresh}
            </p>
          </CardContent>
        </Card>

        <Card className="gap-1 py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Residency status
            </p>
          </CardHeader>
          <CardContent className="px-5">
            <p className="font-heading text-2xl tabular-nums">
              {stats.compliantRegions} / {stats.totalRegions}
            </p>
            <p className="text-xs text-muted-foreground">
              regions in full compliance
            </p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Recent audits</CardTitle>
        </CardHeader>
        <CardContent>
          <AuditsTable />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Outstanding action items</CardTitle>
        </CardHeader>
        <CardContent>
          <ActionItemsList />
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
const r = await fetch('http://localhost:3000/compliance');
const html = await r.text();
console.log(r.status, html.includes('Compliance') && html.includes('Recent audits') ? 'OK' : 'missing');
```
Expected: `200 OK`.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/compliance/audits-table.tsx components/compliance/action-items-list.tsx "app/(dashboard)/compliance/page.tsx" && \
git commit -m "Add A10.1 compliance dashboard"
```

---

## Task CP3: A10.2 Data subject requests + drawer

**File 1:** `admin/components/compliance/request-columns.tsx`

```tsx
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  formatCountdown,
  formatRelative,
  getSubjectHref,
  type SubjectRequest,
} from "@/lib/dummy/compliance";

const statusVariant: Record<
  SubjectRequest["status"],
  "secondary" | "outline" | "destructive" | "default"
> = {
  Pending: "default",
  "In progress": "outline",
  Fulfilled: "secondary",
  Rejected: "destructive",
};

const typeVariant: Record<
  SubjectRequest["type"],
  "secondary" | "destructive"
> = {
  Export: "secondary",
  Delete: "destructive",
};

const regulationVariant: Record<
  SubjectRequest["regulation"],
  "outline"
> = {
  NDPR: "outline",
  GDPR: "outline",
};

export function makeRequestColumns(
  onOpen: (req: SubjectRequest) => void
): ColumnDef<SubjectRequest>[] {
  return [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={typeVariant[row.original.type]} className="font-normal">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "subjectAlias",
      header: "Subject",
      cell: ({ row }) => {
        const r = row.original;
        return (
          <Link
            href={getSubjectHref(r)}
            className="flex flex-col hover:underline"
          >
            <span className="text-sm font-medium">{r.subjectAlias}</span>
            <span className="text-xs text-muted-foreground">
              {r.subjectName} · {r.subjectType}
            </span>
          </Link>
        );
      },
    },
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
      accessorKey: "dueBy",
      header: "Due by",
      cell: ({ row }) => {
        const cd = formatCountdown(row.original.dueBy);
        return (
          <span
            className={`text-sm tabular-nums ${cd.overdue ? "text-destructive font-medium" : "text-muted-foreground"}`}
          >
            {cd.text}
          </span>
        );
      },
    },
    {
      accessorKey: "regulation",
      header: "Regulation",
      cell: ({ row }) => (
        <Badge variant={regulationVariant[row.original.regulation]} className="font-normal">
          {row.original.regulation}
        </Badge>
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpen(row.original)}
          aria-label={`Open request ${row.original.id}`}
        >
          Open
          <ChevronRight className="size-3.5 ml-1" />
        </Button>
      ),
    },
  ];
}
```

**File 2:** `admin/components/compliance/request-filters.tsx`

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

export function RequestFilters() {
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
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In progress</TabsTrigger>
          <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={params.get("type") ?? "all"}
          onValueChange={(v) => setParam("type", v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="export">Export</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
          </SelectContent>
        </Select>

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
      </div>
    </div>
  );
}
```

**File 3:** `admin/components/compliance/request-drawer.tsx`

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import {
  formatCountdown,
  formatDate,
  formatRelative,
  getSubjectHref,
  type SubjectRequest,
} from "@/lib/dummy/compliance";

type Props = {
  request: SubjectRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const typeVariant: Record<
  SubjectRequest["type"],
  "secondary" | "destructive"
> = {
  Export: "secondary",
  Delete: "destructive",
};

const statusVariant: Record<
  SubjectRequest["status"],
  "secondary" | "outline" | "destructive" | "default"
> = {
  Pending: "default",
  "In progress": "outline",
  Fulfilled: "secondary",
  Rejected: "destructive",
};

export function RequestDrawer({ request, open, onOpenChange }: Props) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState("");

  if (!request) return null;

  const cd = formatCountdown(request.dueBy);
  const isClosed = request.status === "Fulfilled" || request.status === "Rejected";

  const handleFulfil = () => {
    toast.success(
      `${request.type} request fulfilled for ${request.subjectAlias}`,
      {
        description:
          request.type === "Export"
            ? "Export bundle queued. Subject notified via email."
            : "Account data scheduled for deletion. Subject notified.",
      }
    );
    onOpenChange(false);
  };

  const handleReject = () => {
    if (rejectNote.trim().length < 5) {
      toast.error("Add a rejection note of at least 5 characters.");
      return;
    }
    toast.success(`${request.type} request rejected`, {
      description: `${request.subjectAlias} notified. They may resubmit.`,
    });
    setRejectOpen(false);
    setRejectNote("");
    onOpenChange(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full max-w-md sm:max-w-lg overflow-y-auto p-6">
          <SheetHeader className="space-y-3 p-0">
            <div className="flex items-center gap-2">
              <Badge variant={typeVariant[request.type]}>
                {request.type}
              </Badge>
              <Badge variant={statusVariant[request.status]}>
                {request.status}
              </Badge>
              <Badge variant="outline" className="font-normal">
                {request.regulation}
              </Badge>
            </div>
            <SheetTitle className="text-2xl">
              Request from {request.subjectAlias}
            </SheetTitle>
            <SheetDescription>
              Submitted {formatRelative(request.submittedAt)} ·{" "}
              <span
                className={
                  cd.overdue ? "text-destructive font-medium" : "text-muted-foreground"
                }
              >
                {cd.text}
              </span>
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            <section className="space-y-2">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
                Subject
              </h3>
              <div className="rounded-md border border-border/60 px-3 py-3 space-y-1.5">
                <p className="font-medium">{request.subjectName}</p>
                <p className="text-sm text-muted-foreground">
                  {request.subjectAlias} · {request.subjectType}
                </p>
                <p className="text-sm text-muted-foreground">
                  {request.subjectEmail}
                </p>
                <p className="text-sm text-muted-foreground">
                  {request.region} · {request.country}
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <Link href={getSubjectHref(request)}>
                    Open {request.subjectType.toLowerCase()} →
                  </Link>
                </Button>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
                Request
              </h3>
              <div className="rounded-md border border-border/60 px-3 py-3 space-y-1.5 text-sm">
                <p>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  {request.type}
                </p>
                <p>
                  <span className="text-muted-foreground">Submitted:</span>{" "}
                  {formatDate(request.submittedAt)}
                </p>
                <p>
                  <span className="text-muted-foreground">Due by:</span>{" "}
                  {formatDate(request.dueBy)}
                </p>
                {request.clientReason && (
                  <div className="pt-2">
                    <p className="text-muted-foreground mb-1">Subject said:</p>
                    <p className="leading-relaxed italic">
                      &quot;{request.clientReason}&quot;
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
                Regulation
              </h3>
              <div className="rounded-md border border-border/60 px-3 py-3 space-y-1.5 text-sm">
                <p>
                  <span className="text-muted-foreground">Framework:</span>{" "}
                  <span className="font-medium">{request.regulation}</span>
                </p>
                <p className="text-muted-foreground text-xs">
                  {request.regulation === "GDPR"
                    ? "Article 15 (Export) / Article 17 (Right to erasure) — respond within 30 days."
                    : "NDPR Subject Access Rights — respond within 30 days."}
                </p>
              </div>
            </section>

            {request.decisionNote && (
              <section className="space-y-2">
                <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
                  Decision note
                </h3>
                <p className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                  {request.decisionNote}
                </p>
              </section>
            )}

            {!isClosed && (
              <section className="flex flex-col gap-2 pt-2">
                <Button onClick={handleFulfil}>Fulfil request</Button>
                <Button
                  variant="destructive"
                  onClick={() => setRejectOpen(true)}
                >
                  Reject
                </Button>
              </section>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject request?</DialogTitle>
            <DialogDescription>
              The subject receives your note with resubmission instructions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-note">Reason (required)</Label>
            <Textarea
              id="reject-note"
              rows={4}
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="E.g. Identity verification failed — could not confirm requester is account holder."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

**File 4:** `admin/components/compliance/requests-list.tsx`

```tsx
"use client";

import { useMemo, useState } from "react";

import { DataTable } from "@/components/therapists/data-table";
import { makeRequestColumns } from "@/components/compliance/request-columns";
import { RequestDrawer } from "@/components/compliance/request-drawer";

import type { SubjectRequest } from "@/lib/dummy/compliance";

type Props = {
  requests: SubjectRequest[];
};

export function RequestsList({ requests }: Props) {
  const [active, setActive] = useState<SubjectRequest | null>(null);

  const columns = useMemo(() => makeRequestColumns((r) => setActive(r)), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={requests}
        emptyMessage="No requests in this view."
      />
      <RequestDrawer
        request={active}
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      />
    </>
  );
}
```

**File 5:** `admin/app/(dashboard)/compliance/requests/page.tsx`

```tsx
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { RequestFilters } from "@/components/compliance/request-filters";
import { RequestsList } from "@/components/compliance/requests-list";

import {
  getSubjectRequests,
  getComplianceStats,
  type RequestFilters as RequestFilterShape,
} from "@/lib/dummy/compliance";

type SearchParams = Promise<{
  status?: string;
  type?: string;
  region?: string;
}>;

function asFilters(p: Awaited<SearchParams>): RequestFilterShape {
  return {
    status: (p.status as RequestFilterShape["status"]) ?? "all",
    type: p.type as RequestFilterShape["type"],
    region: p.region as RequestFilterShape["region"],
  };
}

export default async function ComplianceRequestsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const requests = getSubjectRequests(filters);
  const stats = getComplianceStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Subject requests</h1>
          <p className="text-sm text-muted-foreground">
            {stats.openRequestCount} pending · {stats.overdueCount} overdue ·
            NDPR + GDPR responses ≤30 days
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/compliance">← Compliance</Link>
        </Button>
      </header>

      <RequestFilters />

      <RequestsList requests={requests} />
    </div>
  );
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

```js
for (const url of ['/compliance/requests', '/compliance/requests?status=pending', '/compliance/requests?type=delete', '/compliance/requests?region=ng']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: all 200.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/compliance/request-columns.tsx components/compliance/request-filters.tsx components/compliance/request-drawer.tsx components/compliance/requests-list.tsx "app/(dashboard)/compliance/requests/page.tsx" && \
git commit -m "Add A10.2 compliance subject requests with sheet drawer"
```

---

## Task CP4: A10.3 Regional residency settings

**File 1:** `admin/components/compliance/residency-card.tsx`

```tsx
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { formatDate, type ResidencyRegion } from "@/lib/dummy/compliance";

const statusVariant: Record<
  ResidencyRegion["status"],
  "secondary" | "destructive"
> = {
  Compliant: "secondary",
  "Action required": "destructive",
};

type Props = {
  region: ResidencyRegion;
};

export function ResidencyCard({ region }: Props) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span aria-hidden className="text-xl">
              {region.flagEmoji}
            </span>
            {region.name}
          </CardTitle>
          <Badge variant={statusVariant[region.status]}>{region.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Storage location
          </p>
          <p>{region.storageLocation}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Primary processor
          </p>
          <p className="font-medium">{region.primaryProcessor}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Sub-processors
          </p>
          <ul className="list-disc pl-5 space-y-0.5 marker:text-muted-foreground">
            {region.subProcessors.map((sp) => (
              <li key={sp}>{sp}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Compliance certifications
          </p>
          <div className="flex flex-wrap gap-1.5">
            {region.complianceCerts.map((cert) => (
              <Badge key={cert} variant="outline" className="font-normal">
                {cert}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Last audit
          </p>
          <p className="text-muted-foreground tabular-nums">
            {formatDate(region.lastAuditDate)}
          </p>
        </div>

        <div className="rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          {region.notes}
        </div>
      </CardContent>
    </Card>
  );
}
```

**File 2:** `admin/app/(dashboard)/compliance/residency/page.tsx`

```tsx
import Link from "next/link";
import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ResidencyCard } from "@/components/compliance/residency-card";

import { getResidencyRegions } from "@/lib/dummy/compliance";

export default function ResidencyPage() {
  const regions = getResidencyRegions();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            Regional residency
          </h1>
          <p className="text-sm text-muted-foreground">
            Where each region&apos;s client + therapist data is stored and processed.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/compliance">← Compliance</Link>
        </Button>
      </header>

      <div className="flex items-center gap-3 rounded-md border border-border/60 bg-muted/40 px-4 py-3">
        <Info className="size-4 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Residency settings are read-only here. Changes require infrastructure
          team + DPO approval.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {regions.map((r) => (
          <ResidencyCard key={r.id} region={r} />
        ))}
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
const r = await fetch('http://localhost:3000/compliance/residency');
const html = await r.text();
console.log(r.status, html.includes('Regional residency') && html.includes('Nigeria') && html.includes('European Union') ? 'OK' : 'missing');
```
Expected: `200 OK`.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/compliance/residency-card.tsx "app/(dashboard)/compliance/residency/page.tsx" && \
git commit -m "Add A10.3 regional residency settings (read-only)"
```

---

## Task CP5: Final smoke + push

**Step 1:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

**Step 2:**

```js
for (const url of [
  '/compliance',
  '/compliance/requests',
  '/compliance/requests?status=pending',
  '/compliance/requests?status=fulfilled',
  '/compliance/requests?type=delete',
  '/compliance/requests?region=ng',
  '/compliance/residency',
]) {
  const r = await fetch('http://localhost:3000' + url);
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

- Real export bundle generation
- Real deletion cascade
- Editable residency settings
- DPIA workflow
- Consent record CRUD
- Loading skeletons
- Mobile view
