# Admin Sessions & Clinical Safety Module Implementation Plan

> Use superpowers:subagent-driven-development to execute task-by-task.

**Goal:** Ship A5 module (Sessions list + Risk alerts queue + Crisis log + Crisis detail) per `docs/superpowers/specs/2026-05-26-admin-clinical-safety-module-design.md`.

**Architecture:** 4 routes inside `(dashboard)` group. Reuses DataTable wrapper + every shadcn component from earlier modules. **No new deps.**

**Verification per task:** `pnpm tsc --noEmit` clean + fetch returns 200 + HTML contains expected anchor text.

---

## File structure

| File | Role |
|---|---|
| `admin/lib/dummy/clinical.ts` | Types + dummy data + getters/stats |
| `admin/components/clinical/session-columns.tsx` | A5.1 columns |
| `admin/components/clinical/session-filters.tsx` | A5.1 filters + active chips |
| `admin/app/(dashboard)/sessions/page.tsx` | A5.1 entry |
| `admin/components/clinical/risk-form-columns.tsx` | A5.2 columns |
| `admin/components/clinical/risk-form-filters.tsx` | A5.2 filters + status tabs |
| `admin/app/(dashboard)/risk-forms/page.tsx` | A5.2 entry |
| `admin/components/clinical/crisis-columns.tsx` | A5.3 columns |
| `admin/components/clinical/crisis-filters.tsx` | A5.3 filters + status tabs |
| `admin/app/(dashboard)/crisis/page.tsx` | A5.3 entry |
| `admin/components/clinical/crisis-detail.tsx` | A5.4 composition |
| `admin/app/(dashboard)/crisis/[id]/page.tsx` | A5.4 entry |

---

## Task S1: Dummy clinical data + types

**File:** `admin/lib/dummy/clinical.ts`

```ts
// Shared types + dummy data for admin clinical safety module.
// Cross-references existing therapist + client IDs so deep-links work.

export type Region = "NG" | "Int'l";
export type RiskLevel = "green" | "orange" | "red";
export type SessionStatus = "Completed" | "Cancelled" | "No-show" | "In progress";
export type SessionFormat = "Video" | "Voice" | "Chat";
export type RiskFormStatus = "Open" | "In follow-up" | "Resolved" | "Escalated";
export type CrisisStatus = "Active" | "Responded" | "Escalated" | "Resolved";
export type EmergencyVerifyStatus = "verified" | "pending" | "n/a";

export type Session = {
  id: string;
  date: string; // ISO
  clientId: string;
  clientAlias: string;
  therapistId: string;
  therapistName: string;
  plan: string;
  region: Region;
  durationMin: number;
  format: SessionFormat;
  status: SessionStatus;
  riskLevel: RiskLevel;
  hasRiskForm: boolean;
};

export type RiskForm = {
  id: string;
  submittedAt: string; // ISO
  sessionId: string;
  clientId: string;
  clientAlias: string;
  therapistId: string;
  therapistName: string;
  region: Region;
  country: string;
  level: RiskLevel;
  actionPlan: string;
  followUpDueAt: string; // ISO
  status: RiskFormStatus;
  emergencyVerify: EmergencyVerifyStatus;
};

export type CrisisTimelineEvent = {
  id: string;
  timestamp: string; // ISO
  type:
    | "alert_triggered"
    | "therapist_notified"
    | "therapist_responded"
    | "escalated"
    | "resolved"
    | "admin_note";
  actor: string;
  note: string;
};

export type CrisisEvent = {
  id: string;
  triggeredAt: string; // ISO
  clientId: string;
  clientAlias: string;
  therapistId: string | null;
  therapistName: string | null;
  region: Region;
  country: string;
  responseTimeSec: number | null;
  status: CrisisStatus;
  localEmergencyLine: string;
  resolutionNote?: string;
  timeline: CrisisTimelineEvent[];
};

export type SessionFilters = {
  q?: string;
  range?: "7d" | "30d" | "90d" | "all";
  region?: "all" | "ng" | "intl";
  risk?: "all" | "green" | "orange" | "red";
  therapist?: string; // therapist id
  client?: string; // client id
};

export type RiskFormFilters = {
  status?: "all" | "open" | "in-follow-up" | "resolved" | "escalated";
  severity?: "all" | "red";
  region?: "all" | "ng" | "intl";
  therapist?: string;
  client?: string;
};

export type CrisisFilters = {
  status?: "all" | "active" | "responded" | "escalated" | "resolved";
  region?: "all" | "ng" | "intl";
  therapist?: string;
  client?: string;
  range?: "7d" | "30d" | "all";
};

const SESSIONS: Session[] = [
  { id: "se-001", date: "2026-05-26T08:00:00Z", clientId: "c-001", clientAlias: "Client-9128", therapistId: "t-001", therapistName: "Dr. Tola Adesina", plan: "Balance", region: "NG", durationMin: 50, format: "Video", status: "Completed", riskLevel: "green", hasRiskForm: true },
  { id: "se-002", date: "2026-05-26T13:00:00Z", clientId: "c-002", clientAlias: "Client-8842", therapistId: "t-002", therapistName: "Dr. Marcus Quinn", plan: "Restore", region: "Int'l", durationMin: 50, format: "Video", status: "Completed", riskLevel: "red", hasRiskForm: true },
  { id: "se-003", date: "2026-05-25T17:00:00Z", clientId: "c-008", clientAlias: "Client-2218", therapistId: "t-005", therapistName: "Dr. Priya Shah", plan: "Family Thrive", region: "Int'l", durationMin: 90, format: "Video", status: "Completed", riskLevel: "orange", hasRiskForm: true },
  { id: "se-004", date: "2026-05-25T11:00:00Z", clientId: "c-003", clientAlias: "Client-7710", therapistId: "t-004", therapistName: "Dr. Aisha Bello", plan: "Essential", region: "NG", durationMin: 50, format: "Voice", status: "Completed", riskLevel: "green", hasRiskForm: false },
  { id: "se-005", date: "2026-05-24T16:00:00Z", clientId: "c-005", clientAlias: "Client-5527", therapistId: "t-001", therapistName: "Dr. Tola Adesina", plan: "Harmony", region: "NG", durationMin: 50, format: "Video", status: "Completed", riskLevel: "green", hasRiskForm: false },
  { id: "se-006", date: "2026-05-24T10:00:00Z", clientId: "c-001", clientAlias: "Client-9128", therapistId: "t-001", therapistName: "Dr. Tola Adesina", plan: "Balance", region: "NG", durationMin: 50, format: "Video", status: "Completed", riskLevel: "green", hasRiskForm: false },
  { id: "se-007", date: "2026-05-23T14:00:00Z", clientId: "c-002", clientAlias: "Client-8842", therapistId: "t-002", therapistName: "Dr. Marcus Quinn", plan: "Restore", region: "Int'l", durationMin: 50, format: "Video", status: "No-show", riskLevel: "orange", hasRiskForm: false },
  { id: "se-008", date: "2026-05-22T11:00:00Z", clientId: "c-003", clientAlias: "Client-7710", therapistId: "t-004", therapistName: "Dr. Aisha Bello", plan: "Essential", region: "NG", durationMin: 50, format: "Voice", status: "Completed", riskLevel: "green", hasRiskForm: false },
  { id: "se-009", date: "2026-05-21T15:00:00Z", clientId: "c-004", clientAlias: "Client-6451", therapistId: "t-003", therapistName: "Dr. Lina Park", plan: "Together", region: "Int'l", durationMin: 50, format: "Video", status: "Cancelled", riskLevel: "green", hasRiskForm: false },
  { id: "se-010", date: "2026-05-20T17:00:00Z", clientId: "c-008", clientAlias: "Client-2218", therapistId: "t-005", therapistName: "Dr. Priya Shah", plan: "Family Thrive", region: "Int'l", durationMin: 90, format: "Video", status: "Completed", riskLevel: "green", hasRiskForm: false },
  { id: "se-011", date: "2026-05-18T14:00:00Z", clientId: "c-002", clientAlias: "Client-8842", therapistId: "t-002", therapistName: "Dr. Marcus Quinn", plan: "Restore", region: "Int'l", durationMin: 50, format: "Video", status: "Completed", riskLevel: "orange", hasRiskForm: true },
  { id: "se-012", date: "2026-05-17T10:00:00Z", clientId: "c-001", clientAlias: "Client-9128", therapistId: "t-001", therapistName: "Dr. Tola Adesina", plan: "Balance", region: "NG", durationMin: 50, format: "Video", status: "Completed", riskLevel: "green", hasRiskForm: false },
];

const RISK_FORMS: RiskForm[] = [
  { id: "rf-001", submittedAt: "2026-05-26T14:00:00Z", sessionId: "se-002", clientId: "c-002", clientAlias: "Client-8842", therapistId: "t-002", therapistName: "Dr. Marcus Quinn", region: "Int'l", country: "United Kingdom", level: "red", actionPlan: "Crisis intervention triggered. Follow-up within 24h. Therapist on-call. Local emergency line shared with client.", followUpDueAt: "2026-05-27T14:00:00Z", status: "Open", emergencyVerify: "verified" },
  { id: "rf-002", submittedAt: "2026-05-25T18:00:00Z", sessionId: "se-003", clientId: "c-008", clientAlias: "Client-2218", therapistId: "t-005", therapistName: "Dr. Priya Shah", region: "Int'l", country: "United States", level: "orange", actionPlan: "Eldest child showing signs of complicated grief. Recommended parallel individual sessions. Follow-up in 48h.", followUpDueAt: "2026-05-27T18:00:00Z", status: "In follow-up", emergencyVerify: "n/a" },
  { id: "rf-003", submittedAt: "2026-05-22T17:00:00Z", sessionId: "se-007", clientId: "c-002", clientAlias: "Client-8842", therapistId: "t-002", therapistName: "Dr. Marcus Quinn", region: "Int'l", country: "United Kingdom", level: "red", actionPlan: "Client no-show after expressing distress in last session. Attempt phone outreach within 24h.", followUpDueAt: "2026-05-23T17:00:00Z", status: "Escalated", emergencyVerify: "verified" },
  { id: "rf-004", submittedAt: "2026-05-18T15:00:00Z", sessionId: "se-011", clientId: "c-002", clientAlias: "Client-8842", therapistId: "t-002", therapistName: "Dr. Marcus Quinn", region: "Int'l", country: "United Kingdom", level: "orange", actionPlan: "Trauma flashbacks intensified. Agreed double-session frequency for 2 weeks.", followUpDueAt: "2026-05-20T15:00:00Z", status: "Resolved", emergencyVerify: "n/a" },
  { id: "rf-005", submittedAt: "2026-05-26T09:00:00Z", sessionId: "se-001", clientId: "c-001", clientAlias: "Client-9128", therapistId: "t-001", therapistName: "Dr. Tola Adesina", region: "NG", country: "Nigeria", level: "green", actionPlan: "Continue CBT homework. Standard follow-up.", followUpDueAt: "2026-06-02T09:00:00Z", status: "Resolved", emergencyVerify: "n/a" },
  { id: "rf-006", submittedAt: "2026-05-10T11:00:00Z", sessionId: "se-006", clientId: "c-001", clientAlias: "Client-9128", therapistId: "t-001", therapistName: "Dr. Tola Adesina", region: "NG", country: "Nigeria", level: "orange", actionPlan: "Elevated work stress. Agreed weekly check-ins for 1 month.", followUpDueAt: "2026-05-17T11:00:00Z", status: "Resolved", emergencyVerify: "n/a" },
];

const CRISIS_EVENTS: CrisisEvent[] = [
  {
    id: "cr-001",
    triggeredAt: "2026-05-26T13:48:00Z",
    clientId: "c-002",
    clientAlias: "Client-8842",
    therapistId: "t-002",
    therapistName: "Dr. Marcus Quinn",
    region: "Int'l",
    country: "United Kingdom",
    responseTimeSec: 252,
    status: "Active",
    localEmergencyLine: "Samaritans · 116 123",
    timeline: [
      { id: "tl-001-1", timestamp: "2026-05-26T13:48:00Z", type: "alert_triggered", actor: "Client-8842", note: "Crisis Support button activated from home screen." },
      { id: "tl-001-2", timestamp: "2026-05-26T13:48:05Z", type: "therapist_notified", actor: "System", note: "Push + in-app alert delivered to Dr. Marcus Quinn." },
      { id: "tl-001-3", timestamp: "2026-05-26T13:52:12Z", type: "therapist_responded", actor: "Dr. Marcus Quinn", note: "Initiated video call. Client in distress; staying on-line." },
    ],
  },
  {
    id: "cr-002",
    triggeredAt: "2026-05-25T17:32:00Z",
    clientId: "c-008",
    clientAlias: "Client-2218",
    therapistId: "t-005",
    therapistName: "Dr. Priya Shah",
    region: "Int'l",
    country: "United States",
    responseTimeSec: 184,
    status: "Resolved",
    localEmergencyLine: "988 Suicide & Crisis Lifeline",
    resolutionNote: "Client de-escalated within 20m. Follow-up session scheduled in 24h. Risk form filed at orange level.",
    timeline: [
      { id: "tl-002-1", timestamp: "2026-05-25T17:32:00Z", type: "alert_triggered", actor: "Client-2218", note: "Crisis Support activated by primary account holder." },
      { id: "tl-002-2", timestamp: "2026-05-25T17:32:08Z", type: "therapist_notified", actor: "System", note: "Push + in-app alert delivered to Dr. Priya Shah." },
      { id: "tl-002-3", timestamp: "2026-05-25T17:35:04Z", type: "therapist_responded", actor: "Dr. Priya Shah", note: "Initiated video call." },
      { id: "tl-002-4", timestamp: "2026-05-25T17:55:00Z", type: "resolved", actor: "Dr. Priya Shah", note: "Resolved. Follow-up scheduled. Risk form filed at orange." },
    ],
  },
  {
    id: "cr-003",
    triggeredAt: "2026-05-22T22:14:00Z",
    clientId: "c-002",
    clientAlias: "Client-8842",
    therapistId: null,
    therapistName: null,
    region: "Int'l",
    country: "United Kingdom",
    responseTimeSec: null,
    status: "Escalated",
    localEmergencyLine: "Samaritans · 116 123",
    resolutionNote: "Therapist unresponsive within 5-min SLA. Escalated to on-call admin. Local emergency line shared with client via SMS.",
    timeline: [
      { id: "tl-003-1", timestamp: "2026-05-22T22:14:00Z", type: "alert_triggered", actor: "Client-8842", note: "Crisis Support activated." },
      { id: "tl-003-2", timestamp: "2026-05-22T22:14:06Z", type: "therapist_notified", actor: "System", note: "Push + in-app alert delivered to Dr. Marcus Quinn." },
      { id: "tl-003-3", timestamp: "2026-05-22T22:19:06Z", type: "escalated", actor: "System", note: "No therapist response within 5 minutes. Escalated to admin. Local emergency line SMS sent." },
      { id: "tl-003-4", timestamp: "2026-05-22T22:25:30Z", type: "admin_note", actor: "Adaeze Nwosu", note: "Confirmed client safe via SMS. Therapist contacted off-platform for follow-up next day." },
    ],
  },
  {
    id: "cr-004",
    triggeredAt: "2026-05-20T09:18:00Z",
    clientId: "c-001",
    clientAlias: "Client-9128",
    therapistId: "t-001",
    therapistName: "Dr. Tola Adesina",
    region: "NG",
    country: "Nigeria",
    responseTimeSec: 142,
    status: "Resolved",
    localEmergencyLine: "Nigerian Lifeline · 0800 222 1212",
    resolutionNote: "Quick response. Client de-escalated; no further action required.",
    timeline: [
      { id: "tl-004-1", timestamp: "2026-05-20T09:18:00Z", type: "alert_triggered", actor: "Client-9128", note: "Crisis Support activated." },
      { id: "tl-004-2", timestamp: "2026-05-20T09:18:04Z", type: "therapist_notified", actor: "System", note: "Push delivered to Dr. Tola Adesina." },
      { id: "tl-004-3", timestamp: "2026-05-20T09:20:22Z", type: "therapist_responded", actor: "Dr. Tola Adesina", note: "Voice call initiated." },
      { id: "tl-004-4", timestamp: "2026-05-20T09:35:00Z", type: "resolved", actor: "Dr. Tola Adesina", note: "Resolved. Routine follow-up next week." },
    ],
  },
  {
    id: "cr-005",
    triggeredAt: "2026-05-26T11:05:00Z",
    clientId: "c-008",
    clientAlias: "Client-2218",
    therapistId: "t-005",
    therapistName: "Dr. Priya Shah",
    region: "Int'l",
    country: "United States",
    responseTimeSec: 96,
    status: "Responded",
    localEmergencyLine: "988 Suicide & Crisis Lifeline",
    timeline: [
      { id: "tl-005-1", timestamp: "2026-05-26T11:05:00Z", type: "alert_triggered", actor: "Client-2218", note: "Crisis Support activated by adult family member." },
      { id: "tl-005-2", timestamp: "2026-05-26T11:05:03Z", type: "therapist_notified", actor: "System", note: "Push delivered to Dr. Priya Shah." },
      { id: "tl-005-3", timestamp: "2026-05-26T11:06:36Z", type: "therapist_responded", actor: "Dr. Priya Shah", note: "Video call initiated; in active conversation." },
    ],
  },
];

function matchesQuery(haystack: string, q?: string) {
  if (!q) return true;
  return haystack.toLowerCase().includes(q.toLowerCase());
}

function withinRange(date: string, range?: "7d" | "30d" | "90d" | "all"): boolean {
  if (!range || range === "all") return true;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return new Date(date).getTime() >= cutoff;
}

export function getSessions(filters: SessionFilters = {}): Session[] {
  return SESSIONS.filter((s) => {
    if (!matchesQuery(`${s.clientAlias} ${s.therapistName}`, filters.q)) return false;
    if (!withinRange(s.date, filters.range)) return false;
    if (filters.region && filters.region !== "all") {
      const target: Region = filters.region === "ng" ? "NG" : "Int'l";
      if (s.region !== target) return false;
    }
    if (filters.risk && filters.risk !== "all" && s.riskLevel !== filters.risk) return false;
    if (filters.therapist && s.therapistId !== filters.therapist) return false;
    if (filters.client && s.clientId !== filters.client) return false;
    return true;
  });
}

export function getRiskForms(filters: RiskFormFilters = {}): RiskForm[] {
  return RISK_FORMS.filter((r) => {
    if (filters.status && filters.status !== "all") {
      const map: Record<string, RiskFormStatus> = {
        open: "Open",
        "in-follow-up": "In follow-up",
        resolved: "Resolved",
        escalated: "Escalated",
      };
      if (r.status !== map[filters.status]) return false;
    }
    if (filters.severity === "red" && r.level !== "red") return false;
    if (filters.region && filters.region !== "all") {
      const target: Region = filters.region === "ng" ? "NG" : "Int'l";
      if (r.region !== target) return false;
    }
    if (filters.therapist && r.therapistId !== filters.therapist) return false;
    if (filters.client && r.clientId !== filters.client) return false;
    return true;
  });
}

export function getCrisisEvents(filters: CrisisFilters = {}): CrisisEvent[] {
  return CRISIS_EVENTS.filter((c) => {
    if (filters.status && filters.status !== "all") {
      const map: Record<string, CrisisStatus> = {
        active: "Active",
        responded: "Responded",
        escalated: "Escalated",
        resolved: "Resolved",
      };
      if (c.status !== map[filters.status]) return false;
    }
    if (filters.region && filters.region !== "all") {
      const target: Region = filters.region === "ng" ? "NG" : "Int'l";
      if (c.region !== target) return false;
    }
    if (filters.therapist && c.therapistId !== filters.therapist) return false;
    if (filters.client && c.clientId !== filters.client) return false;
    if (!withinRange(c.triggeredAt, filters.range)) return false;
    return true;
  });
}

export function getCrisisEvent(id: string): CrisisEvent | undefined {
  return CRISIS_EVENTS.find((c) => c.id === id);
}

export function getSessionStats(filters: SessionFilters = {}) {
  const filtered = getSessions(filters);
  const redFlag = filtered.filter((s) => s.riskLevel === "red").length;
  const avgDuration =
    filtered.length === 0
      ? 0
      : Math.round(filtered.reduce((sum, s) => sum + s.durationMin, 0) / filtered.length);
  return { total: filtered.length, redFlag, avgDuration };
}

export function getRiskFormStats() {
  return {
    open: RISK_FORMS.filter((r) => r.status === "Open").length,
    overdue: RISK_FORMS.filter(
      (r) => r.status === "Open" && new Date(r.followUpDueAt).getTime() < Date.now()
    ).length,
    internationalRedPending: RISK_FORMS.filter(
      (r) => r.region === "Int'l" && r.level === "red" && r.emergencyVerify === "pending"
    ).length,
  };
}

export function getCrisisStats() {
  const active = CRISIS_EVENTS.filter((c) => c.status === "Active").length;
  const dayCutoff = Date.now() - 24 * 60 * 60 * 1000;
  const today24h = CRISIS_EVENTS.filter(
    (c) => new Date(c.triggeredAt).getTime() >= dayCutoff
  ).length;
  const responded = CRISIS_EVENTS.filter((c) => c.responseTimeSec != null);
  const avgResponseSec =
    responded.length === 0
      ? 0
      : Math.round(
          responded.reduce((sum, c) => sum + (c.responseTimeSec ?? 0), 0) /
            responded.length
        );
  return { active, today24h, avgResponseSec };
}

export function formatResponseTime(sec: number | null): string {
  if (sec == null) return "Not responded";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
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
  const diffMin = Math.round(abs / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);
  if (abs < 3600) return { text: `${overdue ? "overdue" : "due"} ${diffMin}m`, overdue };
  if (abs < 86_400) return { text: `${overdue ? "overdue" : "due"} ${diffHour}h`, overdue };
  return { text: `${overdue ? "overdue" : "due"} ${diffDay}d`, overdue };
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add lib/dummy/clinical.ts && \
git commit -m "Add clinical safety dummy data (sessions + risk forms + crisis events)"
```

---

## Task S2: A5.1 Sessions list page

**File 1:** `admin/components/clinical/session-columns.tsx`

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

import type { Session } from "@/lib/dummy/clinical";

const riskVariant: Record<Session["riskLevel"], "secondary" | "outline" | "destructive"> = {
  green: "secondary",
  orange: "outline",
  red: "destructive",
};

const statusVariant: Record<Session["status"], "secondary" | "outline" | "destructive"> = {
  Completed: "secondary",
  Cancelled: "outline",
  "No-show": "destructive",
  "In progress": "outline",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export const sessionColumns: ColumnDef<Session>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <span className="tabular-nums text-sm">{formatDate(row.original.date)}</span>,
  },
  {
    id: "time",
    header: "Time",
    cell: ({ row }) => (
      <span className="tabular-nums text-sm text-muted-foreground">
        {formatTime(row.original.date)}
      </span>
    ),
  },
  {
    accessorKey: "clientAlias",
    header: "Client",
    cell: ({ row }) => (
      <Link
        href={`/clients/${row.original.clientId}`}
        className="text-sm font-medium hover:underline"
      >
        {row.original.clientAlias}
      </Link>
    ),
  },
  {
    accessorKey: "therapistName",
    header: "Therapist",
    cell: ({ row }) => (
      <Link
        href={`/therapists/${row.original.therapistId}`}
        className="text-sm hover:underline"
      >
        {row.original.therapistName}
      </Link>
    ),
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-normal">
        {row.original.plan}
      </Badge>
    ),
  },
  {
    accessorKey: "durationMin",
    header: "Duration",
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">{row.original.durationMin}m</span>
    ),
  },
  {
    accessorKey: "format",
    header: "Format",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.format}</span>
    ),
  },
  {
    accessorKey: "riskLevel",
    header: "Risk",
    cell: ({ row }) => (
      <Badge variant={riskVariant[row.original.riskLevel]} className="font-normal">
        {row.original.riskLevel}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge>
    ),
  },
  {
    id: "open",
    header: "",
    cell: () => (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <ChevronRight className="size-4 text-muted-foreground/40" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="left">Detail view not built</TooltipContent>
      </Tooltip>
    ),
  },
];
```

**File 2:** `admin/components/clinical/session-filters.tsx`

```tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const RANGES = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "all", label: "All time" },
];

export function SessionFilters() {
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

  const clientFilter = params.get("client");
  const therapistFilter = params.get("therapist");

  const removeChip = (key: string) => {
    const next = new URLSearchParams(params);
    next.delete(key);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          type="search"
          placeholder="Search by client alias, therapist name…"
          defaultValue={params.get("q") ?? ""}
          onChange={(e) => setParam("q", e.target.value)}
          className="w-[280px]"
        />
        <Select
          value={params.get("range") ?? "all"}
          onValueChange={(v) => setParam("range", v)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Date range" />
          </SelectTrigger>
          <SelectContent>
            {RANGES.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
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
        <Select
          value={params.get("risk") ?? "all"}
          onValueChange={(v) => setParam("risk", v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All risk</SelectItem>
            <SelectItem value="green">Green</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
            <SelectItem value="red">Red</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(clientFilter || therapistFilter) && (
        <div className="flex flex-wrap items-center gap-2">
          {clientFilter && (
            <Badge variant="outline" className="font-normal">
              Client: {clientFilter}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => removeChip("client")}
                aria-label="Remove client filter"
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}
          {therapistFilter && (
            <Badge variant="outline" className="font-normal">
              Therapist: {therapistFilter}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => removeChip("therapist")}
                aria-label="Remove therapist filter"
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
```

**File 3:** `admin/app/(dashboard)/sessions/page.tsx`

```tsx
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/therapists/data-table";

import { sessionColumns } from "@/components/clinical/session-columns";
import { SessionFilters } from "@/components/clinical/session-filters";

import {
  getSessions,
  getSessionStats,
  type SessionFilters as SessionFilterShape,
} from "@/lib/dummy/clinical";

type SearchParams = Promise<{
  q?: string;
  range?: string;
  region?: string;
  risk?: string;
  therapist?: string;
  client?: string;
}>;

function asFilters(p: Awaited<SearchParams>): SessionFilterShape {
  return {
    q: p.q,
    range: (p.range as SessionFilterShape["range"]) ?? "all",
    region: p.region as SessionFilterShape["region"],
    risk: p.risk as SessionFilterShape["risk"],
    therapist: p.therapist,
    client: p.client,
  };
}

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const sessions = getSessions(filters);
  const stats = getSessionStats(filters);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Sessions</h1>
          <p className="text-sm text-muted-foreground">
            {stats.total} session{stats.total === 1 ? "" : "s"} in window · {stats.redFlag} red-flag · avg {stats.avgDuration} min
          </p>
        </div>
        <Button variant="outline" disabled>
          Export CSV
        </Button>
      </header>

      <SessionFilters />

      <DataTable
        columns={sessionColumns}
        data={sessions}
        emptyMessage="No sessions match these filters."
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
for (const url of ['/sessions', '/sessions?range=7d', '/sessions?risk=red', '/sessions?client=c-002', '/sessions?therapist=t-002']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: all 200.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/clinical/session-columns.tsx components/clinical/session-filters.tsx "app/(dashboard)/sessions/page.tsx" && \
git commit -m "Add A5.1 sessions list page"
```

---

## Task S3: A5.2 Risk alerts queue page

**File 1:** `admin/components/clinical/risk-form-columns.tsx`

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatRelative, formatCountdown } from "@/lib/dummy/clinical";
import type { RiskForm } from "@/lib/dummy/clinical";

const levelVariant: Record<RiskForm["level"], "secondary" | "outline" | "destructive"> = {
  green: "secondary",
  orange: "outline",
  red: "destructive",
};

const statusVariant: Record<RiskForm["status"], "secondary" | "outline" | "destructive"> = {
  Open: "destructive",
  "In follow-up": "outline",
  Resolved: "secondary",
  Escalated: "destructive",
};

const verifyVariant: Record<
  RiskForm["emergencyVerify"],
  "secondary" | "outline" | "destructive"
> = {
  verified: "secondary",
  pending: "destructive",
  "n/a": "outline",
};

export const riskFormColumns: ColumnDef<RiskForm>[] = [
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
    accessorKey: "clientAlias",
    header: "Client",
    cell: ({ row }) => (
      <Link
        href={`/clients/${row.original.clientId}`}
        className="text-sm font-medium hover:underline"
      >
        {row.original.clientAlias}
      </Link>
    ),
  },
  {
    accessorKey: "therapistName",
    header: "Therapist",
    cell: ({ row }) => (
      <Link
        href={`/therapists/${row.original.therapistId}`}
        className="text-sm hover:underline"
      >
        {row.original.therapistName}
      </Link>
    ),
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => (
      <span className="text-sm">
        <Badge variant="outline" className="font-normal">
          {row.original.region}
        </Badge>{" "}
        <span className="text-muted-foreground">{row.original.country}</span>
      </span>
    ),
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => (
      <Badge variant={levelVariant[row.original.level]} className="font-normal">
        {row.original.level}
      </Badge>
    ),
  },
  {
    accessorKey: "actionPlan",
    header: "Action plan",
    cell: ({ row }) => {
      const plan = row.original.actionPlan;
      const truncated = plan.length > 60 ? plan.slice(0, 57) + "…" : plan;
      return (
        <Popover>
          <PopoverTrigger className="text-sm text-left hover:underline">
            {truncated}
          </PopoverTrigger>
          <PopoverContent className="text-sm max-w-sm">{plan}</PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: "followUpDueAt",
    header: "Follow-up",
    cell: ({ row }) => {
      const cd = formatCountdown(row.original.followUpDueAt);
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
    accessorKey: "emergencyVerify",
    header: "Emergency verified",
    cell: ({ row }) => {
      const v = row.original.emergencyVerify;
      const label = v === "verified" ? "Verified" : v === "pending" ? "Pending" : "N/A";
      return (
        <Badge variant={verifyVariant[v]} className="font-normal">
          {label}
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
    cell: () => (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <ChevronRight className="size-4 text-muted-foreground/40" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="left">Detail view not built</TooltipContent>
      </Tooltip>
    ),
  },
];
```

**File 2:** `admin/components/clinical/risk-form-filters.tsx`

```tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function RiskFormFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const status = params.get("status") ?? "open";
  const severity = params.get("severity") ?? "red";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value === "" || value === "all") next.delete(key);
    else next.set(key, value);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  };

  const clientFilter = params.get("client");
  const therapistFilter = params.get("therapist");

  const removeChip = (key: string) => {
    const next = new URLSearchParams(params);
    next.delete(key);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  };

  return (
    <div className="space-y-3">
      <Tabs value={status} onValueChange={(v) => setParam("status", v)}>
        <TabsList>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="in-follow-up">In follow-up</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
          <TabsTrigger value="escalated">Escalated</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={severity} onValueChange={(v) => setParam("severity", v)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="red">Red flag only (default)</SelectItem>
            <SelectItem value="all">All severities</SelectItem>
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

      {(clientFilter || therapistFilter) && (
        <div className="flex flex-wrap items-center gap-2">
          {clientFilter && (
            <Badge variant="outline" className="font-normal">
              Client: {clientFilter}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => removeChip("client")}
                aria-label="Remove client filter"
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}
          {therapistFilter && (
            <Badge variant="outline" className="font-normal">
              Therapist: {therapistFilter}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => removeChip("therapist")}
                aria-label="Remove therapist filter"
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
```

**File 3:** `admin/app/(dashboard)/risk-forms/page.tsx`

```tsx
import { DataTable } from "@/components/therapists/data-table";

import { riskFormColumns } from "@/components/clinical/risk-form-columns";
import { RiskFormFilters } from "@/components/clinical/risk-form-filters";

import {
  getRiskForms,
  getRiskFormStats,
  type RiskFormFilters as RiskFormFilterShape,
} from "@/lib/dummy/clinical";

type SearchParams = Promise<{
  status?: string;
  severity?: string;
  region?: string;
  therapist?: string;
  client?: string;
}>;

function asFilters(p: Awaited<SearchParams>): RiskFormFilterShape {
  return {
    status: (p.status as RiskFormFilterShape["status"]) ?? "open",
    severity: (p.severity as RiskFormFilterShape["severity"]) ?? "red",
    region: p.region as RiskFormFilterShape["region"],
    therapist: p.therapist,
    client: p.client,
  };
}

export default async function RiskFormsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const forms = getRiskForms(filters);
  const stats = getRiskFormStats();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-heading text-3xl tracking-tight">
          Risk follow-up queue
        </h1>
        <p className="text-sm text-muted-foreground">
          {stats.open} open · {stats.overdue} overdue ·{" "}
          {stats.internationalRedPending} international red-level pending verification
        </p>
      </header>

      <RiskFormFilters />

      <DataTable
        columns={riskFormColumns}
        data={forms}
        emptyMessage="No risk forms in this view. Nice."
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
for (const url of ['/risk-forms', '/risk-forms?status=all', '/risk-forms?severity=all&status=all', '/risk-forms?client=c-002']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: all 200.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/clinical/risk-form-columns.tsx components/clinical/risk-form-filters.tsx "app/(dashboard)/risk-forms/page.tsx" && \
git commit -m "Add A5.2 risk alerts queue page"
```

---

## Task S4: A5.3 Crisis log + A5.4 Crisis detail

**File 1:** `admin/components/clinical/crisis-columns.tsx`

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

import { formatRelative, formatResponseTime } from "@/lib/dummy/clinical";
import type { CrisisEvent } from "@/lib/dummy/clinical";

const statusVariant: Record<
  CrisisEvent["status"],
  "secondary" | "outline" | "destructive"
> = {
  Active: "destructive",
  Responded: "outline",
  Escalated: "destructive",
  Resolved: "secondary",
};

export const crisisColumns: ColumnDef<CrisisEvent>[] = [
  {
    accessorKey: "triggeredAt",
    header: "Triggered",
    cell: ({ row }) => {
      const iso = row.original.triggeredAt;
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
    accessorKey: "clientAlias",
    header: "Client",
    cell: ({ row }) => (
      <Link
        href={`/clients/${row.original.clientId}`}
        className="text-sm font-medium hover:underline"
      >
        {row.original.clientAlias}
      </Link>
    ),
  },
  {
    accessorKey: "therapistName",
    header: "Therapist",
    cell: ({ row }) => {
      const c = row.original;
      if (!c.therapistId) {
        return (
          <span className="text-sm text-muted-foreground italic">
            Escalated to next available
          </span>
        );
      }
      return (
        <Link
          href={`/therapists/${c.therapistId}`}
          className="text-sm hover:underline"
        >
          {c.therapistName}
        </Link>
      );
    },
  },
  {
    accessorKey: "responseTimeSec",
    header: "Response time",
    cell: ({ row }) => {
      const t = row.original.responseTimeSec;
      if (t == null) return <span className="text-sm text-destructive">Not responded</span>;
      return <span className="text-sm tabular-nums">{formatResponseTime(t)}</span>;
    },
  },
  {
    id: "escalation",
    header: "Escalation",
    cell: ({ row }) => {
      if (row.original.status === "Escalated") {
        return <Badge variant="destructive" className="font-normal">Escalated to admin</Badge>;
      }
      return <span className="text-sm text-muted-foreground">None</span>;
    },
  },
  {
    accessorKey: "localEmergencyLine",
    header: "Local emergency",
    cell: ({ row }) => {
      const c = row.original;
      if (c.region === "NG") return <span className="text-sm text-muted-foreground">—</span>;
      return <span className="text-sm">{c.localEmergencyLine}</span>;
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
        href={`/crisis/${row.original.id}`}
        aria-label={`Open crisis ${row.original.id}`}
      >
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    ),
  },
];
```

**File 2:** `admin/components/clinical/crisis-filters.tsx`

```tsx
"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { X } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function CrisisFilters() {
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

  const clientFilter = params.get("client");
  const therapistFilter = params.get("therapist");

  const removeChip = (key: string) => {
    const next = new URLSearchParams(params);
    next.delete(key);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  };

  return (
    <div className="space-y-3">
      <Tabs value={status} onValueChange={(v) => setParam("status", v)}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="responded">Responded</TabsTrigger>
          <TabsTrigger value="escalated">Escalated</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
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
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(clientFilter || therapistFilter) && (
        <div className="flex flex-wrap items-center gap-2">
          {clientFilter && (
            <Badge variant="outline" className="font-normal">
              Client: {clientFilter}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => removeChip("client")}
                aria-label="Remove client filter"
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}
          {therapistFilter && (
            <Badge variant="outline" className="font-normal">
              Therapist: {therapistFilter}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-4 w-4 p-0"
                onClick={() => removeChip("therapist")}
                aria-label="Remove therapist filter"
              >
                <X className="size-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
```

**File 3:** `admin/app/(dashboard)/crisis/page.tsx`

```tsx
import { DataTable } from "@/components/therapists/data-table";

import { crisisColumns } from "@/components/clinical/crisis-columns";
import { CrisisFilters } from "@/components/clinical/crisis-filters";

import {
  getCrisisEvents,
  getCrisisStats,
  formatResponseTime,
  type CrisisFilters as CrisisFilterShape,
} from "@/lib/dummy/clinical";

type SearchParams = Promise<{
  status?: string;
  region?: string;
  therapist?: string;
  client?: string;
  range?: string;
}>;

function asFilters(p: Awaited<SearchParams>): CrisisFilterShape {
  return {
    status: (p.status as CrisisFilterShape["status"]) ?? "all",
    region: p.region as CrisisFilterShape["region"],
    therapist: p.therapist,
    client: p.client,
    range: (p.range as CrisisFilterShape["range"]) ?? "all",
  };
}

export default async function CrisisPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const events = getCrisisEvents(filters);
  const stats = getCrisisStats();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-heading text-3xl tracking-tight">Crisis log</h1>
        <p className="text-sm text-muted-foreground">
          {stats.active} active · {stats.today24h} in last 24h · avg response{" "}
          {formatResponseTime(stats.avgResponseSec)}
        </p>
      </header>

      <CrisisFilters />

      <DataTable
        columns={crisisColumns}
        data={events}
        emptyMessage="No crisis alerts in this view."
      />
    </div>
  );
}
```

**File 4:** `admin/components/clinical/crisis-detail.tsx`

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  AlertOctagon,
  Bell,
  PhoneCall,
  ArrowUpRight,
  CheckCircle2,
  StickyNote,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { CrisisEvent, CrisisStatus, CrisisTimelineEvent } from "@/lib/dummy/clinical";

const statusVariant: Record<
  CrisisStatus,
  "secondary" | "outline" | "destructive"
> = {
  Active: "destructive",
  Responded: "outline",
  Escalated: "destructive",
  Resolved: "secondary",
};

const iconForType: Record<CrisisTimelineEvent["type"], typeof AlertOctagon> = {
  alert_triggered: AlertOctagon,
  therapist_notified: Bell,
  therapist_responded: PhoneCall,
  escalated: ArrowUpRight,
  resolved: CheckCircle2,
  admin_note: StickyNote,
};

const labelForType: Record<CrisisTimelineEvent["type"], string> = {
  alert_triggered: "Alert triggered",
  therapist_notified: "Therapist notified",
  therapist_responded: "Therapist responded",
  escalated: "Escalated",
  resolved: "Resolved",
  admin_note: "Admin note",
};

function formatStamp(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

type Props = {
  crisis: CrisisEvent;
};

export function CrisisDetail({ crisis }: Props) {
  const [timeline, setTimeline] = useState<CrisisTimelineEvent[]>(crisis.timeline);
  const [status, setStatus] = useState<CrisisStatus>(crisis.status);
  const [note, setNote] = useState("");
  const shortId = crisis.id.replace(/^cr-/, "#");

  const addNote = () => {
    if (note.trim().length < 5) {
      toast.error("Add a note of at least 5 characters.");
      return;
    }
    const newEvent: CrisisTimelineEvent = {
      id: `tl-local-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "admin_note",
      actor: "Adaeze Nwosu",
      note: note.trim(),
    };
    setTimeline([newEvent, ...timeline]);
    setNote("");
    toast.success("Note added to timeline");
  };

  const saveStatus = () => {
    toast.success(`Status set to ${status}`, {
      description: "Stakeholders notified.",
    });
  };

  const escalate = () => {
    if (status === "Escalated") return;
    setStatus("Escalated");
    const newEvent: CrisisTimelineEvent = {
      id: `tl-local-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "escalated",
      actor: "Adaeze Nwosu",
      note: "Manually escalated to admin team.",
    };
    setTimeline([newEvent, ...timeline]);
    toast.success("Escalated to admin team");
  };

  return (
    <div className="space-y-6">
      <Link
        href="/crisis"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Crisis log
      </Link>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl tracking-tight">
            Crisis {shortId}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant[status]}>{status}</Badge>
            <Badge variant="outline" className="font-normal">
              {crisis.region} · {crisis.country}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Triggered {formatStamp(crisis.triggeredAt)}
            </span>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={escalate}
          disabled={status === "Escalated"}
        >
          Escalate to admin
        </Button>
      </header>

      <section
        aria-label="Context"
        className="grid grid-cols-1 gap-3 lg:grid-cols-3"
      >
        <Card className="py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Client
            </p>
          </CardHeader>
          <CardContent className="px-5 space-y-1">
            <Link
              href={`/clients/${crisis.clientId}`}
              className="font-heading text-lg hover:underline"
            >
              {crisis.clientAlias}
            </Link>
            <p className="text-xs text-muted-foreground">
              Open client record →
            </p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Therapist
            </p>
          </CardHeader>
          <CardContent className="px-5 space-y-1">
            {crisis.therapistId ? (
              <>
                <Link
                  href={`/therapists/${crisis.therapistId}`}
                  className="font-heading text-lg hover:underline"
                >
                  {crisis.therapistName}
                </Link>
                <p className="text-xs text-muted-foreground">Open therapist →</p>
              </>
            ) : (
              <>
                <p className="font-heading text-lg italic">Escalated</p>
                <p className="text-xs text-muted-foreground">
                  No therapist assigned at escalation
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Local emergency line
            </p>
          </CardHeader>
          <CardContent className="px-5 space-y-1">
            <p className="font-heading text-lg">{crisis.localEmergencyLine}</p>
            <p className="text-xs text-muted-foreground">{crisis.country}</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Timeline</CardTitle>
          <span className="text-xs text-muted-foreground">
            {timeline.length} event{timeline.length === 1 ? "" : "s"}
          </span>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {timeline.map((ev) => {
              const Icon = iconForType[ev.type];
              return (
                <li key={ev.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                      <Icon className="size-3.5" />
                    </span>
                    <span className="mt-2 w-px flex-1 bg-border" />
                  </div>
                  <div className="flex-1 pb-2 space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium text-sm">
                        {labelForType[ev.type]}
                      </p>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatStamp(ev.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-foreground">{ev.actor}</span> ·{" "}
                      {ev.note}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add admin note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="admin-note">Note</Label>
              <Textarea
                id="admin-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="E.g. Confirmed client safe via SMS. Therapist contacted off-platform."
              />
            </div>
            <Button onClick={addNote}>Add to timeline</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as CrisisStatus)}
              >
                <SelectTrigger id="status" className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Responded">Responded</SelectItem>
                  <SelectItem value="Escalated">Escalated</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={saveStatus}>Save status</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

**File 5:** `admin/app/(dashboard)/crisis/[id]/page.tsx`

```tsx
import { notFound } from "next/navigation";

import { CrisisDetail } from "@/components/clinical/crisis-detail";
import { getCrisisEvent } from "@/lib/dummy/clinical";

type Params = Promise<{ id: string }>;

export default async function CrisisDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const crisis = getCrisisEvent(id);
  if (!crisis) notFound();

  return <CrisisDetail crisis={crisis} />;
}
```

**Verify + commit:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

```js
for (const url of ['/crisis', '/crisis?status=active', '/crisis/cr-001', '/crisis/cr-003', '/crisis/does-not-exist']) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: list + cr-001 + cr-003 → 200; does-not-exist → 404.

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && \
git add components/clinical/crisis-columns.tsx components/clinical/crisis-filters.tsx "app/(dashboard)/crisis/page.tsx" components/clinical/crisis-detail.tsx "app/(dashboard)/crisis/[id]/page.tsx" && \
git commit -m "Add A5.3 crisis log + A5.4 crisis detail pages"
```

---

## Task S5: Final smoke + push

**Step 1:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2/admin && pnpm tsc --noEmit
```

**Step 2:**

```js
for (const url of [
  '/sessions',
  '/sessions?range=7d',
  '/sessions?risk=red',
  '/sessions?client=c-002',
  '/sessions?therapist=t-002',
  '/risk-forms',
  '/risk-forms?status=all',
  '/risk-forms?severity=all&status=all',
  '/risk-forms?client=c-002',
  '/crisis',
  '/crisis?status=active',
  '/crisis?status=escalated',
  '/crisis/cr-001',
  '/crisis/cr-002',
  '/crisis/cr-003',
  '/crisis/does-not-exist',
]) {
  const r = await fetch('http://localhost:3000' + url);
  console.log(url, r.status);
}
```
Expected: all 200 except `does-not-exist` → 404.

**Step 3:**

```bash
cd /Users/opeyemiajagbe/Documents/Projects/mindenity-2 && git push
```

---

## Out-of-scope reminders

- A5.5 Session detail page (chevrons in A5.1 are placeholders)
- Real crisis simulation / live polling
- Real follow-up notification scheduling
- Loading skeletons
- Mobile card-list view
- Tab integration on Therapist + Client detail (swap stubs to `Open in Sessions →` style links)
