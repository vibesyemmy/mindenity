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
