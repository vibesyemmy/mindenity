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
