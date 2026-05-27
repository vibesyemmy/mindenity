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
