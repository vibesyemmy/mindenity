// Shared types + dummy data for admin clients module.

export type Region = "NG" | "Int'l";
export type Currency = "NGN" | "USD";
export type ClientStatus = "Active" | "Past-due" | "Cancelled" | "Lapsed";
export type PaymentStatus = "Succeeded" | "Refunded" | "Failed" | "Pending";
export type PaymentMethod = "Paystack" | "Stripe";
export type RiskLevel = "green" | "orange" | "red";

export type Plan = {
  name: string; // "Balance", "Essential", etc.
  type: "Subscription" | "PAYG";
  sessionsPerMonth: number; // 0 for PAYG-as-needed
};

export type SessionRecord = {
  id: string;
  date: string; // ISO
  therapist: string;
  durationMin: number;
  riskLevel: RiskLevel;
  format: "Video" | "Voice" | "Chat";
};

export type PaymentRecord = {
  id: string;
  date: string; // ISO
  description: string;
  amount: number; // minor units (kobo / cents)
  currency: Currency;
  method: PaymentMethod;
  last4: string;
  status: PaymentStatus;
  eligibleForRefund: boolean;
};

export type PlanHistoryEntry = {
  id: string;
  date: string;
  from: string | null;
  to: string;
  reason: "Signup" | "Upgrade" | "Downgrade" | "Cancellation" | "Reactivation";
};

export type RiskEvent = {
  id: string;
  date: string;
  therapist: string;
  level: RiskLevel;
  note: string;
  riskFormId?: string;
};

export type AdminNote = {
  id: string;
  date: string;
  author: string;
  body: string;
  pinned?: boolean;
};

export type Client = {
  id: string;
  alias: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  region: Region;
  country: string;
  timezone: string;
  joinedAt: string;
  status: ClientStatus;
  plan: Plan;
  sessionsUsedThisCycle: number;
  cycleResetsOn: string | null; // null for PAYG
  currentTherapist: string | null;
  lifetimeSessions: number;
  lifetimeSpend: { amount: number; currency: Currency };
  lastSessionAgo: string | null;
  lastPaymentAgo: string;
  careSummary: string;
  riskLevel: RiskLevel;
  sessions: SessionRecord[];
  payments: PaymentRecord[];
  planHistory: PlanHistoryEntry[];
  riskEvents: RiskEvent[];
  notes: AdminNote[];
};

export type ClientFilters = {
  q?: string;
  region?: "all" | "ng" | "intl";
  plan?: string; // "all" or plan name lowercase
  status?: "all" | "active" | "past-due" | "cancelled" | "lapsed";
};

const PLANS: Record<string, Plan> = {
  Essential: { name: "Essential", type: "PAYG", sessionsPerMonth: 0 },
  Balance: { name: "Balance", type: "Subscription", sessionsPerMonth: 4 },
  Thrive: { name: "Thrive", type: "Subscription", sessionsPerMonth: 8 },
  Together: { name: "Together", type: "PAYG", sessionsPerMonth: 0 },
  Harmony: { name: "Harmony", type: "Subscription", sessionsPerMonth: 4 },
  Restore: { name: "Restore", type: "Subscription", sessionsPerMonth: 8 },
  Home: { name: "Home", type: "PAYG", sessionsPerMonth: 0 },
  "Family Care": { name: "Family Care", type: "Subscription", sessionsPerMonth: 4 },
  "Family Thrive": { name: "Family Thrive", type: "Subscription", sessionsPerMonth: 8 },
};

const CLIENTS: Client[] = [
  {
    id: "c-001",
    alias: "Client-9128",
    name: "Ada Okeke",
    initials: "AO",
    email: "ada.okeke@example.com",
    phone: "+234 802 555 0144",
    region: "NG",
    country: "Nigeria",
    timezone: "Africa/Lagos",
    joinedAt: "2025-02-12",
    status: "Active",
    plan: PLANS.Balance,
    sessionsUsedThisCycle: 2,
    cycleResetsOn: "2026-06-12",
    currentTherapist: "Dr. Tola Adesina",
    lifetimeSessions: 28,
    lifetimeSpend: { amount: 1_120_000, currency: "NGN" },
    lastSessionAgo: "2d ago",
    lastPaymentAgo: "14d ago",
    careSummary: "Workplace anxiety + sleep regulation. CBT-focused.",
    riskLevel: "green",
    sessions: [
      { id: "s-001-1", date: "2026-05-24T10:00:00Z", therapist: "Dr. Tola Adesina", durationMin: 50, riskLevel: "green", format: "Video" },
      { id: "s-001-2", date: "2026-05-17T10:00:00Z", therapist: "Dr. Tola Adesina", durationMin: 50, riskLevel: "green", format: "Video" },
      { id: "s-001-3", date: "2026-05-10T10:00:00Z", therapist: "Dr. Tola Adesina", durationMin: 50, riskLevel: "orange", format: "Video" },
    ],
    payments: [
      { id: "p-001-1", date: "2026-05-12T08:30:00Z", description: "Balance plan · monthly", amount: 40_000_00, currency: "NGN", method: "Paystack", last4: "4242", status: "Succeeded", eligibleForRefund: true },
      { id: "p-001-2", date: "2026-04-12T08:30:00Z", description: "Balance plan · monthly", amount: 40_000_00, currency: "NGN", method: "Paystack", last4: "4242", status: "Succeeded", eligibleForRefund: true },
      { id: "p-001-3", date: "2026-03-12T08:30:00Z", description: "Balance plan · monthly", amount: 40_000_00, currency: "NGN", method: "Paystack", last4: "4242", status: "Succeeded", eligibleForRefund: false },
    ],
    planHistory: [
      { id: "ph-001-1", date: "2026-03-12", from: "Essential", to: "Balance", reason: "Upgrade" },
      { id: "ph-001-2", date: "2025-02-12", from: null, to: "Essential", reason: "Signup" },
    ],
    riskEvents: [
      { id: "re-001-1", date: "2026-05-10", therapist: "Dr. Tola Adesina", level: "orange", note: "Reported elevated work stress; agreed weekly check-ins for 1 month." },
    ],
    notes: [
      { id: "n-001-1", date: "2026-05-14T11:00:00Z", author: "Adaeze Nwosu", body: "Client requested a male therapist next cycle — flagged for matching team.", pinned: true },
      { id: "n-001-2", date: "2026-03-13T09:20:00Z", author: "Sarah Okeke", body: "Upgrade to Balance plan processed manually after Paystack hiccup; account reconciled." },
    ],
  },
  {
    id: "c-002",
    alias: "Client-8842",
    name: "James Carter",
    initials: "JC",
    email: "james.c@example.com",
    phone: "+44 7700 555 0119",
    region: "Int'l",
    country: "United Kingdom",
    timezone: "Europe/London",
    joinedAt: "2024-11-08",
    status: "Active",
    plan: PLANS.Restore,
    sessionsUsedThisCycle: 5,
    cycleResetsOn: "2026-06-08",
    currentTherapist: "Dr. Marcus Quinn",
    lifetimeSessions: 64,
    lifetimeSpend: { amount: 8_640_00, currency: "USD" },
    lastSessionAgo: "1d ago",
    lastPaymentAgo: "18d ago",
    careSummary: "Trauma recovery (CPTSD). EMDR-based. Active engagement.",
    riskLevel: "red",
    sessions: [
      { id: "s-002-1", date: "2026-05-25T14:00:00Z", therapist: "Dr. Marcus Quinn", durationMin: 50, riskLevel: "red", format: "Video" },
      { id: "s-002-2", date: "2026-05-18T14:00:00Z", therapist: "Dr. Marcus Quinn", durationMin: 50, riskLevel: "orange", format: "Video" },
      { id: "s-002-3", date: "2026-05-11T14:00:00Z", therapist: "Dr. Marcus Quinn", durationMin: 50, riskLevel: "orange", format: "Video" },
    ],
    payments: [
      { id: "p-002-1", date: "2026-05-08T08:30:00Z", description: "Restore plan · monthly", amount: 480_00, currency: "USD", method: "Stripe", last4: "9876", status: "Succeeded", eligibleForRefund: true },
      { id: "p-002-2", date: "2026-04-08T08:30:00Z", description: "Restore plan · monthly", amount: 480_00, currency: "USD", method: "Stripe", last4: "9876", status: "Succeeded", eligibleForRefund: true },
    ],
    planHistory: [
      { id: "ph-002-1", date: "2025-03-08", from: "Harmony", to: "Restore", reason: "Upgrade" },
      { id: "ph-002-2", date: "2024-11-08", from: null, to: "Harmony", reason: "Signup" },
    ],
    riskEvents: [
      { id: "re-002-1", date: "2026-05-25", therapist: "Dr. Marcus Quinn", level: "red", note: "Crisis escalation triggered Crisis Support; therapist responded within 4m, follow-up scheduled in 24h.", riskFormId: "rf-001" },
      { id: "re-002-2", date: "2026-04-18", therapist: "Dr. Marcus Quinn", level: "orange", note: "Trauma flashbacks intensified; agreed double-session frequency for 2 weeks.", riskFormId: "rf-003" },
    ],
    notes: [
      { id: "n-002-1", date: "2026-05-25T15:00:00Z", author: "Adaeze Nwosu", body: "Post-crisis review: therapist response time within target. Follow-up due in 24h.", pinned: true },
      { id: "n-002-2", date: "2026-02-10T10:00:00Z", author: "Sarah Okeke", body: "Plan switched from Harmony to Restore at client's request after intake review." },
    ],
  },
  {
    id: "c-003",
    alias: "Client-7710",
    name: "Funmi Adebayo",
    initials: "FA",
    email: "funmi.a@example.com",
    phone: "+234 803 555 0188",
    region: "NG",
    country: "Nigeria",
    timezone: "Africa/Lagos",
    joinedAt: "2025-08-20",
    status: "Active",
    plan: PLANS.Essential,
    sessionsUsedThisCycle: 4,
    cycleResetsOn: null,
    currentTherapist: "Dr. Aisha Bello",
    lifetimeSessions: 4,
    lifetimeSpend: { amount: 80_000_00, currency: "NGN" },
    lastSessionAgo: "5d ago",
    lastPaymentAgo: "5d ago",
    careSummary: "First-time client; exploring therapy options. Currently PAYG.",
    riskLevel: "green",
    sessions: [
      { id: "s-003-1", date: "2026-05-21T11:00:00Z", therapist: "Dr. Aisha Bello", durationMin: 50, riskLevel: "green", format: "Voice" },
      { id: "s-003-2", date: "2026-05-14T11:00:00Z", therapist: "Dr. Aisha Bello", durationMin: 50, riskLevel: "green", format: "Voice" },
    ],
    payments: [
      { id: "p-003-1", date: "2026-05-21T11:00:00Z", description: "Essential · single session", amount: 20_000_00, currency: "NGN", method: "Paystack", last4: "0021", status: "Succeeded", eligibleForRefund: true },
      { id: "p-003-2", date: "2026-05-14T11:00:00Z", description: "Essential · single session", amount: 20_000_00, currency: "NGN", method: "Paystack", last4: "0021", status: "Succeeded", eligibleForRefund: true },
    ],
    planHistory: [
      { id: "ph-003-1", date: "2025-08-20", from: null, to: "Essential", reason: "Signup" },
    ],
    riskEvents: [],
    notes: [
      { id: "n-003-1", date: "2025-08-20T09:00:00Z", author: "Adaeze Nwosu", body: "First-time client. Onboarded via referral campaign — keep on PAYG until they pick a plan." },
    ],
  },
  {
    id: "c-004",
    alias: "Client-6451",
    name: "Marina Costa",
    initials: "MC",
    email: "marina.c@example.com",
    phone: "+34 612 555 0188",
    region: "Int'l",
    country: "Spain",
    timezone: "Europe/Madrid",
    joinedAt: "2025-04-02",
    status: "Past-due",
    plan: PLANS.Together,
    sessionsUsedThisCycle: 0,
    cycleResetsOn: null,
    currentTherapist: "Dr. Lina Park",
    lifetimeSessions: 18,
    lifetimeSpend: { amount: 1_620_00, currency: "USD" },
    lastSessionAgo: "21d ago",
    lastPaymentAgo: "Payment failed 4d ago",
    careSummary: "Couples therapy (cross-cultural). Partner attendance variable.",
    riskLevel: "green",
    sessions: [
      { id: "s-004-1", date: "2026-05-05T15:00:00Z", therapist: "Dr. Lina Park", durationMin: 50, riskLevel: "green", format: "Video" },
    ],
    payments: [
      { id: "p-004-1", date: "2026-05-22T08:30:00Z", description: "Together · session", amount: 90_00, currency: "USD", method: "Stripe", last4: "1110", status: "Failed", eligibleForRefund: false },
      { id: "p-004-2", date: "2026-05-05T15:00:00Z", description: "Together · session", amount: 90_00, currency: "USD", method: "Stripe", last4: "1110", status: "Succeeded", eligibleForRefund: true },
    ],
    planHistory: [
      { id: "ph-004-1", date: "2025-04-02", from: null, to: "Together", reason: "Signup" },
    ],
    riskEvents: [],
    notes: [
      { id: "n-004-1", date: "2026-05-22T09:30:00Z", author: "Sarah Okeke", body: "Stripe charge failed; outreach email sent. Awaiting card update.", pinned: true },
    ],
  },
  {
    id: "c-005",
    alias: "Client-5527",
    name: "Tomi & Femi Eze",
    initials: "TE",
    email: "tomi.eze@example.com",
    phone: "+234 802 555 0233",
    region: "NG",
    country: "Nigeria",
    timezone: "Africa/Lagos",
    joinedAt: "2025-01-04",
    status: "Active",
    plan: PLANS.Harmony,
    sessionsUsedThisCycle: 3,
    cycleResetsOn: "2026-06-04",
    currentTherapist: "Dr. Tola Adesina",
    lifetimeSessions: 36,
    lifetimeSpend: { amount: 3_960_000, currency: "NGN" },
    lastSessionAgo: "3d ago",
    lastPaymentAgo: "22d ago",
    careSummary: "Couples therapy. Strong engagement; communication-focused work.",
    riskLevel: "green",
    sessions: [
      { id: "s-005-1", date: "2026-05-23T16:00:00Z", therapist: "Dr. Tola Adesina", durationMin: 50, riskLevel: "green", format: "Video" },
      { id: "s-005-2", date: "2026-05-16T16:00:00Z", therapist: "Dr. Tola Adesina", durationMin: 50, riskLevel: "green", format: "Video" },
    ],
    payments: [
      { id: "p-005-1", date: "2026-05-04T08:30:00Z", description: "Harmony plan · monthly", amount: 220_000_00, currency: "NGN", method: "Paystack", last4: "8881", status: "Succeeded", eligibleForRefund: true },
    ],
    planHistory: [
      { id: "ph-005-1", date: "2025-01-04", from: null, to: "Harmony", reason: "Signup" },
    ],
    riskEvents: [],
    notes: [],
  },
  {
    id: "c-006",
    alias: "Client-4318",
    name: "Sofia Müller",
    initials: "SM",
    email: "sofia.m@example.com",
    phone: "+49 170 555 0144",
    region: "Int'l",
    country: "Germany",
    timezone: "Europe/Berlin",
    joinedAt: "2024-07-15",
    status: "Cancelled",
    plan: PLANS.Thrive,
    sessionsUsedThisCycle: 0,
    cycleResetsOn: null,
    currentTherapist: null,
    lifetimeSessions: 96,
    lifetimeSpend: { amount: 7_680_00, currency: "USD" },
    lastSessionAgo: "62d ago",
    lastPaymentAgo: "62d ago",
    careSummary: "Long-term anxiety + workplace burnout. Cancelled plan after recovery milestone.",
    riskLevel: "green",
    sessions: [],
    payments: [
      { id: "p-006-1", date: "2026-03-25T08:30:00Z", description: "Thrive plan · monthly", amount: 320_00, currency: "USD", method: "Stripe", last4: "3344", status: "Succeeded", eligibleForRefund: false },
    ],
    planHistory: [
      { id: "ph-006-1", date: "2026-03-25", from: "Thrive", to: "Cancelled", reason: "Cancellation" },
      { id: "ph-006-2", date: "2024-07-15", from: null, to: "Thrive", reason: "Signup" },
    ],
    riskEvents: [],
    notes: [
      { id: "n-006-1", date: "2026-03-25T14:00:00Z", author: "Adaeze Nwosu", body: "Cancellation reason: recovery milestone reached. Offered re-engagement path; client declined." },
    ],
  },
  {
    id: "c-007",
    alias: "Client-3902",
    name: "Tunde Okafor",
    initials: "TO",
    email: "tunde.o@example.com",
    phone: "+234 803 555 0299",
    region: "NG",
    country: "Nigeria",
    timezone: "Africa/Lagos",
    joinedAt: "2024-09-30",
    status: "Lapsed",
    plan: PLANS.Home,
    sessionsUsedThisCycle: 0,
    cycleResetsOn: null,
    currentTherapist: null,
    lifetimeSessions: 6,
    lifetimeSpend: { amount: 600_000_00, currency: "NGN" },
    lastSessionAgo: "94d ago",
    lastPaymentAgo: "94d ago",
    careSummary: "Family therapy. PAYG; no session booked in 3 months.",
    riskLevel: "green",
    sessions: [],
    payments: [
      { id: "p-007-1", date: "2026-02-21T11:00:00Z", description: "Home · session", amount: 100_000_00, currency: "NGN", method: "Paystack", last4: "5552", status: "Succeeded", eligibleForRefund: false },
    ],
    planHistory: [
      { id: "ph-007-1", date: "2024-09-30", from: null, to: "Home", reason: "Signup" },
    ],
    riskEvents: [],
    notes: [
      { id: "n-007-1", date: "2026-02-22T11:00:00Z", author: "Sarah Okeke", body: "No session booked in 3 months; sent re-engagement email. No response yet." },
    ],
  },
  {
    id: "c-008",
    alias: "Client-2218",
    name: "The Smith Family",
    initials: "SF",
    email: "primary@smithfamily.example.com",
    phone: "+1 415 555 0177",
    region: "Int'l",
    country: "United States",
    timezone: "America/Los_Angeles",
    joinedAt: "2025-06-18",
    status: "Active",
    plan: PLANS["Family Thrive"],
    sessionsUsedThisCycle: 6,
    cycleResetsOn: "2026-06-18",
    currentTherapist: "Dr. Priya Shah",
    lifetimeSessions: 52,
    lifetimeSpend: { amount: 4_800_00, currency: "USD" },
    lastSessionAgo: "1d ago",
    lastPaymentAgo: "9d ago",
    careSummary: "Family unit (4 members) working through grief after recent loss.",
    riskLevel: "orange",
    sessions: [
      { id: "s-008-1", date: "2026-05-25T17:00:00Z", therapist: "Dr. Priya Shah", durationMin: 90, riskLevel: "orange", format: "Video" },
    ],
    payments: [
      { id: "p-008-1", date: "2026-05-17T08:30:00Z", description: "Family Thrive · monthly", amount: 800_00, currency: "USD", method: "Stripe", last4: "7710", status: "Succeeded", eligibleForRefund: true },
    ],
    planHistory: [
      { id: "ph-008-1", date: "2025-06-18", from: null, to: "Family Thrive", reason: "Signup" },
    ],
    riskEvents: [
      { id: "re-008-1", date: "2026-05-25", therapist: "Dr. Priya Shah", level: "orange", note: "Eldest child showing signs of complicated grief; individual sessions recommended in parallel.", riskFormId: "rf-002" },
    ],
    notes: [
      { id: "n-008-1", date: "2026-05-26T09:00:00Z", author: "Adaeze Nwosu", body: "Family unit (4 members) on shared account. Therapist requested 90-min slots going forward.", pinned: true },
    ],
  },
];

function matchesQuery(haystack: string, q?: string) {
  if (!q) return true;
  return haystack.toLowerCase().includes(q.toLowerCase());
}

export function getClients(filters: ClientFilters = {}): Client[] {
  return CLIENTS.filter((c) => {
    if (!matchesQuery(`${c.alias} ${c.name} ${c.email}`, filters.q)) return false;
    if (filters.region && filters.region !== "all") {
      const target = filters.region === "ng" ? "NG" : "Int'l";
      if (c.region !== target) return false;
    }
    if (filters.plan && filters.plan !== "all") {
      if (c.plan.name.toLowerCase() !== filters.plan.toLowerCase()) return false;
    }
    if (filters.status && filters.status !== "all") {
      const map: Record<string, ClientStatus> = {
        active: "Active",
        "past-due": "Past-due",
        cancelled: "Cancelled",
        lapsed: "Lapsed",
      };
      if (c.status !== map[filters.status]) return false;
    }
    return true;
  });
}

export function getClient(id: string): Client | undefined {
  return CLIENTS.find((c) => c.id === id);
}

export function getClientListStats() {
  return {
    activeCount: CLIENTS.filter((c) => c.status === "Active").length,
    pastDueCount: CLIENTS.filter((c) => c.status === "Past-due").length,
    riskWatchCount: CLIENTS.filter((c) => c.riskLevel === "orange" || c.riskLevel === "red").length,
    totalPlans: 9,
  };
}

export const ALL_PLAN_NAMES = Object.keys(PLANS);
