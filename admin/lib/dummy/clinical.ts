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

export type RiskTimelineEvent = {
  id: string;
  timestamp: string; // ISO
  type:
    | "form_submitted"
    | "status_changed"
    | "emergency_verified"
    | "admin_note"
    | "escalated_to_crisis"
    | "resolved";
  actor: string;
  note: string;
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
  timeline: RiskTimelineEvent[];
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
  {
    id: "rf-001",
    submittedAt: "2026-05-26T14:00:00Z",
    sessionId: "se-002",
    clientId: "c-002",
    clientAlias: "Client-8842",
    therapistId: "t-002",
    therapistName: "Dr. Marcus Quinn",
    region: "Int'l",
    country: "United Kingdom",
    level: "red",
    actionPlan: "Crisis intervention triggered. Follow-up within 24h. Therapist on-call. Local emergency line shared with client.",
    followUpDueAt: "2026-05-27T14:00:00Z",
    status: "Open",
    emergencyVerify: "verified",
    timeline: [
      { id: "rtl-001-1", timestamp: "2026-05-26T14:00:00Z", type: "form_submitted", actor: "Dr. Marcus Quinn", note: "Red-level risk form submitted after session se-002. Crisis intervention initiated." },
      { id: "rtl-001-2", timestamp: "2026-05-26T14:02:00Z", type: "emergency_verified", actor: "System", note: "Local emergency line (Samaritans · 116 123) verified and shared with client via in-app message." },
    ],
  },
  {
    id: "rf-002",
    submittedAt: "2026-05-25T18:00:00Z",
    sessionId: "se-003",
    clientId: "c-008",
    clientAlias: "Client-2218",
    therapistId: "t-005",
    therapistName: "Dr. Priya Shah",
    region: "Int'l",
    country: "United States",
    level: "orange",
    actionPlan: "Eldest child showing signs of complicated grief. Recommended parallel individual sessions. Follow-up in 48h.",
    followUpDueAt: "2026-05-27T18:00:00Z",
    status: "In follow-up",
    emergencyVerify: "n/a",
    timeline: [
      { id: "rtl-002-1", timestamp: "2026-05-25T18:00:00Z", type: "form_submitted", actor: "Dr. Priya Shah", note: "Orange-level risk form submitted after family session se-003." },
      { id: "rtl-002-2", timestamp: "2026-05-26T09:30:00Z", type: "status_changed", actor: "Adaeze Nwosu", note: "Marked as in follow-up · individual sessions for eldest child scheduled." },
    ],
  },
  {
    id: "rf-003",
    submittedAt: "2026-05-22T17:00:00Z",
    sessionId: "se-007",
    clientId: "c-002",
    clientAlias: "Client-8842",
    therapistId: "t-002",
    therapistName: "Dr. Marcus Quinn",
    region: "Int'l",
    country: "United Kingdom",
    level: "red",
    actionPlan: "Client no-show after expressing distress in last session. Attempt phone outreach within 24h.",
    followUpDueAt: "2026-05-23T17:00:00Z",
    status: "Escalated",
    emergencyVerify: "verified",
    timeline: [
      { id: "rtl-003-1", timestamp: "2026-05-22T17:00:00Z", type: "form_submitted", actor: "Dr. Marcus Quinn", note: "Red-level risk form submitted · client no-show after distressed last session." },
      { id: "rtl-003-2", timestamp: "2026-05-22T17:05:00Z", type: "emergency_verified", actor: "System", note: "Local emergency line confirmed and shared with client via SMS." },
      { id: "rtl-003-3", timestamp: "2026-05-23T17:01:00Z", type: "escalated_to_crisis", actor: "System", note: "Follow-up SLA breached (24h). Auto-escalated to crisis log as cr-003." },
      { id: "rtl-003-4", timestamp: "2026-05-23T17:30:00Z", type: "admin_note", actor: "Adaeze Nwosu", note: "Confirmed client safe via SMS. Follow-up session booked for next week." },
    ],
  },
  {
    id: "rf-004",
    submittedAt: "2026-05-18T15:00:00Z",
    sessionId: "se-011",
    clientId: "c-002",
    clientAlias: "Client-8842",
    therapistId: "t-002",
    therapistName: "Dr. Marcus Quinn",
    region: "Int'l",
    country: "United Kingdom",
    level: "orange",
    actionPlan: "Trauma flashbacks intensified. Agreed double-session frequency for 2 weeks.",
    followUpDueAt: "2026-05-20T15:00:00Z",
    status: "Resolved",
    emergencyVerify: "n/a",
    timeline: [
      { id: "rtl-004-1", timestamp: "2026-05-18T15:00:00Z", type: "form_submitted", actor: "Dr. Marcus Quinn", note: "Orange-level risk form submitted after session se-011." },
      { id: "rtl-004-2", timestamp: "2026-05-19T10:00:00Z", type: "status_changed", actor: "Adaeze Nwosu", note: "Marked as in follow-up · double-session frequency scheduled." },
      { id: "rtl-004-3", timestamp: "2026-05-20T14:30:00Z", type: "resolved", actor: "Dr. Marcus Quinn", note: "Resolved · client engaged in increased-frequency plan; no further escalation." },
    ],
  },
  {
    id: "rf-005",
    submittedAt: "2026-05-26T09:00:00Z",
    sessionId: "se-001",
    clientId: "c-001",
    clientAlias: "Client-9128",
    therapistId: "t-001",
    therapistName: "Dr. Tola Adesina",
    region: "NG",
    country: "Nigeria",
    level: "green",
    actionPlan: "Continue CBT homework. Standard follow-up.",
    followUpDueAt: "2026-06-02T09:00:00Z",
    status: "Resolved",
    emergencyVerify: "n/a",
    timeline: [
      { id: "rtl-005-1", timestamp: "2026-05-26T09:00:00Z", type: "form_submitted", actor: "Dr. Tola Adesina", note: "Green-level risk form submitted · routine post-session check." },
      { id: "rtl-005-2", timestamp: "2026-05-26T09:00:30Z", type: "resolved", actor: "System", note: "Auto-resolved · green level requires no admin follow-up." },
    ],
  },
  {
    id: "rf-006",
    submittedAt: "2026-05-10T11:00:00Z",
    sessionId: "se-006",
    clientId: "c-001",
    clientAlias: "Client-9128",
    therapistId: "t-001",
    therapistName: "Dr. Tola Adesina",
    region: "NG",
    country: "Nigeria",
    level: "orange",
    actionPlan: "Elevated work stress. Agreed weekly check-ins for 1 month.",
    followUpDueAt: "2026-05-17T11:00:00Z",
    status: "Resolved",
    emergencyVerify: "n/a",
    timeline: [
      { id: "rtl-006-1", timestamp: "2026-05-10T11:00:00Z", type: "form_submitted", actor: "Dr. Tola Adesina", note: "Orange-level risk form submitted · elevated workplace stress reported." },
      { id: "rtl-006-2", timestamp: "2026-05-11T08:00:00Z", type: "status_changed", actor: "Sarah Okeke", note: "Marked as in follow-up · weekly check-ins agreed." },
      { id: "rtl-006-3", timestamp: "2026-05-17T11:00:00Z", type: "resolved", actor: "Dr. Tola Adesina", note: "Resolved · stress levels normalised; standard cadence resumed." },
    ],
  },
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

export function getRiskForm(id: string): RiskForm | undefined {
  return RISK_FORMS.find((r) => r.id === id);
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
