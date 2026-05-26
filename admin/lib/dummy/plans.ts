// Shared types + dummy data for admin plans & pricing module.

export type Region = "NG" | "Int'l";
export type Currency = "NGN" | "USD";
export type PlanType = "PAYG" | "Subscription";
export type PlanSegment = "Individual" | "Couple" | "Family";
export type Tier = "Standard" | "Senior" | "Clinical";

export type PlanPricing = {
  planName: string;
  segment: PlanSegment;
  type: PlanType;
  sessionsPerMonth: number;
  basePrice: number;
  minBand: number;
  maxBand: number;
  currency: Currency;
  active: boolean;
};

export type EligibilityCell = {
  plan: string;
  region: Region;
  tier: Tier;
  enabled: boolean;
};

export type PlanCoverage = {
  plan: string;
  region: Region;
  therapists: number;
  threshold: number;
  gap: number;
};

const NGN_PRICING: PlanPricing[] = [
  { planName: "Essential", segment: "Individual", type: "PAYG", sessionsPerMonth: 0, basePrice: 20_000_00, minBand: 15_000_00, maxBand: 30_000_00, currency: "NGN", active: true },
  { planName: "Balance", segment: "Individual", type: "Subscription", sessionsPerMonth: 4, basePrice: 40_000_00, minBand: 35_000_00, maxBand: 50_000_00, currency: "NGN", active: true },
  { planName: "Thrive", segment: "Individual", type: "Subscription", sessionsPerMonth: 8, basePrice: 80_000_00, minBand: 70_000_00, maxBand: 100_000_00, currency: "NGN", active: true },
  { planName: "Together", segment: "Couple", type: "PAYG", sessionsPerMonth: 0, basePrice: 50_000_00, minBand: 40_000_00, maxBand: 60_000_00, currency: "NGN", active: true },
  { planName: "Harmony", segment: "Couple", type: "Subscription", sessionsPerMonth: 4, basePrice: 220_000_00, minBand: 180_000_00, maxBand: 240_000_00, currency: "NGN", active: true },
  { planName: "Restore", segment: "Couple", type: "Subscription", sessionsPerMonth: 8, basePrice: 480_000_00, minBand: 420_000_00, maxBand: 520_000_00, currency: "NGN", active: true },
  { planName: "Home", segment: "Family", type: "PAYG", sessionsPerMonth: 0, basePrice: 100_000_00, minBand: 80_000_00, maxBand: 120_000_00, currency: "NGN", active: true },
  { planName: "Family Care", segment: "Family", type: "Subscription", sessionsPerMonth: 4, basePrice: 350_000_00, minBand: 320_000_00, maxBand: 400_000_00, currency: "NGN", active: true },
  { planName: "Family Thrive", segment: "Family", type: "Subscription", sessionsPerMonth: 8, basePrice: 600_000_00, minBand: 560_000_00, maxBand: 680_000_00, currency: "NGN", active: false },
];

const USD_PRICING: PlanPricing[] = [
  { planName: "Essential", segment: "Individual", type: "PAYG", sessionsPerMonth: 0, basePrice: 30_00, minBand: 25_00, maxBand: 50_00, currency: "USD", active: true },
  { planName: "Balance", segment: "Individual", type: "Subscription", sessionsPerMonth: 4, basePrice: 80_00, minBand: 70_00, maxBand: 100_00, currency: "USD", active: true },
  { planName: "Thrive", segment: "Individual", type: "Subscription", sessionsPerMonth: 8, basePrice: 160_00, minBand: 140_00, maxBand: 200_00, currency: "USD", active: true },
  { planName: "Together", segment: "Couple", type: "PAYG", sessionsPerMonth: 0, basePrice: 90_00, minBand: 75_00, maxBand: 120_00, currency: "USD", active: true },
  { planName: "Harmony", segment: "Couple", type: "Subscription", sessionsPerMonth: 4, basePrice: 320_00, minBand: 280_00, maxBand: 380_00, currency: "USD", active: true },
  { planName: "Restore", segment: "Couple", type: "Subscription", sessionsPerMonth: 8, basePrice: 480_00, minBand: 420_00, maxBand: 560_00, currency: "USD", active: true },
  { planName: "Home", segment: "Family", type: "PAYG", sessionsPerMonth: 0, basePrice: 180_00, minBand: 150_00, maxBand: 220_00, currency: "USD", active: true },
  { planName: "Family Care", segment: "Family", type: "Subscription", sessionsPerMonth: 4, basePrice: 600_00, minBand: 540_00, maxBand: 720_00, currency: "USD", active: true },
  { planName: "Family Thrive", segment: "Family", type: "Subscription", sessionsPerMonth: 8, basePrice: 800_00, minBand: 720_00, maxBand: 960_00, currency: "USD", active: false },
];

const ALL_PLANS = NGN_PRICING.map((p) => p.planName);
const ALL_TIERS: Tier[] = ["Standard", "Senior", "Clinical"];

// Default eligibility: most plans enabled for all tiers, with realistic restrictions.
// Restore (8-session couple) gated to Senior+ — high intensity.
// Family Thrive (8-session family) gated to Senior+ for the same reason.
// Thrive (8-session individual) Standard-tier allowed but flagged for QA.
const DISABLED_CELLS = new Set([
  // NG: Restore + Family Thrive locked to Senior+
  "Restore|NG|Standard",
  "Family Thrive|NG|Standard",
  // Int'l: same plus Family Care for Standard
  "Restore|Int'l|Standard",
  "Family Thrive|Int'l|Standard",
  "Family Care|Int'l|Standard",
]);

const ELIGIBILITY: EligibilityCell[] = ALL_PLANS.flatMap((plan) =>
  (["NG", "Int'l"] as Region[]).flatMap((region) =>
    ALL_TIERS.map((tier) => ({
      plan,
      region,
      tier,
      enabled: !DISABLED_CELLS.has(`${plan}|${region}|${tier}`),
    }))
  )
);

// Coverage data cross-references the therapist module's plansAccepted arrays.
// Hand-curated to match real therapist coverage from `admin/lib/dummy/therapists.ts`.
const COVERAGE: PlanCoverage[] = [
  // Nigeria
  { plan: "Essential", region: "NG", therapists: 2, threshold: 3, gap: -1 },
  { plan: "Balance", region: "NG", therapists: 0, threshold: 3, gap: -3 },
  { plan: "Thrive", region: "NG", therapists: 0, threshold: 3, gap: -3 },
  { plan: "Together", region: "NG", therapists: 2, threshold: 3, gap: -1 },
  { plan: "Harmony", region: "NG", therapists: 1, threshold: 3, gap: -2 },
  { plan: "Restore", region: "NG", therapists: 1, threshold: 3, gap: -2 },
  { plan: "Home", region: "NG", therapists: 0, threshold: 3, gap: -3 },
  { plan: "Family Care", region: "NG", therapists: 0, threshold: 3, gap: -3 },
  { plan: "Family Thrive", region: "NG", therapists: 0, threshold: 3, gap: -3 },
  // International
  { plan: "Essential", region: "Int'l", therapists: 2, threshold: 3, gap: -1 },
  { plan: "Balance", region: "Int'l", therapists: 0, threshold: 3, gap: -3 },
  { plan: "Thrive", region: "Int'l", therapists: 0, threshold: 3, gap: -3 },
  { plan: "Together", region: "Int'l", therapists: 2, threshold: 3, gap: -1 },
  { plan: "Harmony", region: "Int'l", therapists: 3, threshold: 3, gap: 0 },
  { plan: "Restore", region: "Int'l", therapists: 3, threshold: 3, gap: 0 },
  { plan: "Home", region: "Int'l", therapists: 1, threshold: 3, gap: -2 },
  { plan: "Family Care", region: "Int'l", therapists: 2, threshold: 3, gap: -1 },
  { plan: "Family Thrive", region: "Int'l", therapists: 1, threshold: 3, gap: -2 },
];

export function getPricingByRegion(region: Region): PlanPricing[] {
  return region === "NG" ? NGN_PRICING : USD_PRICING;
}

export function getEligibilityMatrix(): EligibilityCell[] {
  return ELIGIBILITY;
}

export function getCoverageByPlan(region?: Region): PlanCoverage[] {
  if (!region) return COVERAGE;
  return COVERAGE.filter((c) => c.region === region);
}

export function getPlanStats() {
  const ngActive = NGN_PRICING.filter((p) => p.active).length;
  const usdActive = USD_PRICING.filter((p) => p.active).length;
  return {
    activeNg: ngActive,
    activeIntl: usdActive,
    totalPlans: NGN_PRICING.length,
    pendingApprovals: 1, // mocked — would query A8 in real impl
  };
}

export function getCoverageStats() {
  const lowCoverage = COVERAGE.filter((c) => c.gap < 0).length;
  return {
    lowCoverage,
    totalPerRegion: NGN_PRICING.length,
  };
}

export function formatMoney(amount: number, currency: Currency): string {
  if (currency === "NGN") {
    if (amount >= 100_000_00) return `₦${(amount / 100 / 1000).toFixed(0)}k`;
    return `₦${(amount / 100).toLocaleString()}`;
  }
  return `$${(amount / 100).toLocaleString()}`;
}

export const ALL_PLAN_NAMES_ORDERED = ALL_PLANS;
export const ALL_TIERS_ORDERED = ALL_TIERS;
