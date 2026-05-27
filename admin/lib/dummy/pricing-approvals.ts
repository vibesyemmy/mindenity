// Shared types + dummy data for admin custom pricing approvals module.
// Cross-references existing therapist + plan IDs.

import { ALL_PLAN_NAMES_ORDERED, getPricingByRegion } from "@/lib/dummy/plans";

export type Region = "NG" | "Int'l";
export type Currency = "NGN" | "USD";
export type ApprovalStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Countered";

export type PricingRequest = {
  id: string;
  submittedAt: string; // ISO
  therapistId: string;
  therapistName: string;
  therapistTier: "Standard" | "Senior" | "Clinical";
  planName: string;
  planSegment: "Individual" | "Couple" | "Family";
  region: Region;
  currency: Currency;
  proposedPrice: number; // minor units
  basePrice: number; // minor units (snapshot at request time)
  minBand: number; // minor units
  maxBand: number; // minor units
  reasoning: string;
  status: ApprovalStatus;
  decidedAt?: string; // ISO
  decidedBy?: string;
  decisionNote?: string;
  counterPrice?: number; // for Countered status
};

export type ApprovalFilters = {
  status?: "pending" | "approved" | "rejected" | "countered" | "all";
  region?: "all" | "ng" | "intl";
  plan?: string; // plan name lowercase
};

const REQUESTS: PricingRequest[] = [
  {
    id: "ar-001",
    submittedAt: "2026-05-23T08:00:00Z",
    therapistId: "t-001",
    therapistName: "Dr. Tola Adesina",
    therapistTier: "Senior",
    planName: "Restore",
    planSegment: "Couple",
    region: "NG",
    currency: "NGN",
    proposedPrice: 650_000_00,
    basePrice: 480_000_00,
    minBand: 420_000_00,
    maxBand: 520_000_00,
    reasoning:
      "12 years of practice, EFT Level 2 certified. Requesting +25% over max band for clinical complexity of long-term couples work.",
    status: "Pending",
  },
  {
    id: "ar-002",
    submittedAt: "2026-05-26T11:00:00Z",
    therapistId: "t-003",
    therapistName: "Dr. Lina Park",
    therapistTier: "Senior",
    planName: "Harmony",
    planSegment: "Couple",
    region: "Int'l",
    currency: "USD",
    proposedPrice: 360_00,
    basePrice: 320_00,
    minBand: 280_00,
    maxBand: 380_00,
    reasoning:
      "Cross-cultural specialisation premium. Within max band, requesting slight bump over base.",
    status: "Pending",
  },
  {
    id: "ar-003",
    submittedAt: "2026-05-26T15:30:00Z",
    therapistId: "t-002",
    therapistName: "Dr. Marcus Quinn",
    therapistTier: "Clinical",
    planName: "Family Thrive",
    planSegment: "Family",
    region: "Int'l",
    currency: "USD",
    proposedPrice: 1_100_00,
    basePrice: 800_00,
    minBand: 720_00,
    maxBand: 960_00,
    reasoning:
      "18 years clinical experience, complex CPTSD family caseload. Above-band rate reflects scarcity of qualified family trauma therapists.",
    status: "Pending",
  },
  {
    id: "ar-004",
    submittedAt: "2026-05-20T14:00:00Z",
    therapistId: "t-004",
    therapistName: "Dr. Aisha Bello",
    therapistTier: "Standard",
    planName: "Essential",
    planSegment: "Individual",
    region: "NG",
    currency: "NGN",
    proposedPrice: 22_000_00,
    basePrice: 20_000_00,
    minBand: 15_000_00,
    maxBand: 30_000_00,
    reasoning: "Standard rate adjustment within band.",
    status: "Approved",
    decidedAt: "2026-05-21T09:30:00Z",
    decidedBy: "Adaeze Nwosu",
    decisionNote: "Within band, approved immediately.",
  },
  {
    id: "ar-005",
    submittedAt: "2026-05-18T10:00:00Z",
    therapistId: "t-001",
    therapistName: "Dr. Tola Adesina",
    therapistTier: "Senior",
    planName: "Harmony",
    planSegment: "Couple",
    region: "NG",
    currency: "NGN",
    proposedPrice: 250_000_00,
    basePrice: 220_000_00,
    minBand: 180_000_00,
    maxBand: 240_000_00,
    reasoning: "Adjusting for inflation; previous rate unchanged for 18 months.",
    status: "Countered",
    decidedAt: "2026-05-19T11:15:00Z",
    decidedBy: "Adaeze Nwosu",
    decisionNote:
      "Counter at ₦240,000 — top of band. Acknowledge inflation but want to keep within current band until next quarter's band review.",
    counterPrice: 240_000_00,
  },
  {
    id: "ar-006",
    submittedAt: "2026-05-15T09:00:00Z",
    therapistId: "t-006",
    therapistName: "Dr. Femi Ojo",
    therapistTier: "Standard",
    planName: "Together",
    planSegment: "Couple",
    region: "NG",
    currency: "NGN",
    proposedPrice: 80_000_00,
    basePrice: 50_000_00,
    minBand: 40_000_00,
    maxBand: 60_000_00,
    reasoning: "Specialised in couples work.",
    status: "Rejected",
    decidedAt: "2026-05-16T14:00:00Z",
    decidedBy: "Adaeze Nwosu",
    decisionNote:
      "Significantly above max band. Therapist tier (Standard) does not yet justify Senior-tier pricing. Recommend resubmission after tier upgrade.",
  },
  {
    id: "ar-007",
    submittedAt: "2026-05-12T16:00:00Z",
    therapistId: "t-005",
    therapistName: "Dr. Priya Shah",
    therapistTier: "Clinical",
    planName: "Restore",
    planSegment: "Couple",
    region: "Int'l",
    currency: "USD",
    proposedPrice: 600_00,
    basePrice: 480_00,
    minBand: 420_00,
    maxBand: 560_00,
    reasoning:
      "21 years experience, grief and bereavement specialisation. Above max for complex caseload.",
    status: "Approved",
    decidedAt: "2026-05-13T10:00:00Z",
    decidedBy: "Adaeze Nwosu",
    decisionNote:
      "Approved given Clinical tier + specialisation depth. Note: still slightly above max, flagged for next band review.",
  },
];

function isOverdue(req: PricingRequest): boolean {
  if (req.status !== "Pending") return false;
  const sla = 3 * 24 * 60 * 60 * 1000; // 3 business days approx
  return Date.now() - new Date(req.submittedAt).getTime() > sla;
}

export function getApprovals(filters: ApprovalFilters = {}): PricingRequest[] {
  return REQUESTS.filter((r) => {
    if (filters.status && filters.status !== "all") {
      const map: Record<string, ApprovalStatus> = {
        pending: "Pending",
        approved: "Approved",
        rejected: "Rejected",
        countered: "Countered",
      };
      if (r.status !== map[filters.status]) return false;
    }
    if (filters.region && filters.region !== "all") {
      const target: Region = filters.region === "ng" ? "NG" : "Int'l";
      if (r.region !== target) return false;
    }
    if (filters.plan && filters.plan !== "all") {
      if (r.planName.toLowerCase() !== filters.plan.toLowerCase()) return false;
    }
    return true;
  });
}

export function getApproval(id: string): PricingRequest | undefined {
  return REQUESTS.find((r) => r.id === id);
}

export function getApprovalsByTherapist(therapistId: string): PricingRequest[] {
  return REQUESTS.filter((r) => r.therapistId === therapistId);
}

export function getApprovalStats() {
  return {
    pending: REQUESTS.filter((r) => r.status === "Pending").length,
    overdue: REQUESTS.filter(isOverdue).length,
    countered: REQUESTS.filter((r) => r.status === "Countered").length,
  };
}

export function deltaFromBand(req: PricingRequest): {
  pct: number;
  direction: "over_max" | "under_min" | "within";
  label: string;
} {
  if (req.proposedPrice > req.maxBand) {
    const pct = Math.round(
      ((req.proposedPrice - req.maxBand) / req.maxBand) * 100
    );
    return { pct, direction: "over_max", label: `+${pct}% over max` };
  }
  if (req.proposedPrice < req.minBand) {
    const pct = Math.round(
      ((req.minBand - req.proposedPrice) / req.minBand) * 100
    );
    return { pct, direction: "under_min", label: `-${pct}% under min` };
  }
  const pctFromBase = Math.round(
    ((req.proposedPrice - req.basePrice) / req.basePrice) * 100
  );
  return {
    pct: pctFromBase,
    direction: "within",
    label:
      pctFromBase === 0
        ? "At base"
        : pctFromBase > 0
          ? `+${pctFromBase}% from base · within band`
          : `${pctFromBase}% from base · within band`,
  };
}

export function formatMoney(amount: number, currency: Currency): string {
  if (currency === "NGN") {
    if (amount >= 100_000_00) return `₦${(amount / 100 / 1000).toFixed(0)}k`;
    return `₦${(amount / 100).toLocaleString()}`;
  }
  return `$${(amount / 100).toLocaleString()}`;
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

// Re-export for filters dropdown.
export const ALL_PLAN_NAMES_FOR_FILTER = ALL_PLAN_NAMES_ORDERED;

// Silence unused import (used implicitly for type narrowing if needed downstream).
export function _getPlanBandRange(region: Region, planName: string) {
  return getPricingByRegion(region).find((p) => p.planName === planName);
}
