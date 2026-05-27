// Shared types + dummy data for admin commission & payouts module.
// Cross-references existing therapist IDs from `admin/lib/dummy/therapists.ts`.

export type Region = "NG" | "Int'l";
export type Currency = "NGN" | "USD";
export type TierLabel =
  | "New"
  | "T1"
  | "T1+"
  | "T2"
  | "T2+"
  | "T3"
  | "T3+"
  | "T4"
  | "T4+";
export type PayoutRunStatus = "Scheduled" | "Processing" | "Completed" | "Failed";
export type PayoutItemStatus = "Paid" | "Pending" | "Failed";
export type OverrideType = "Tier" | "Custom %";

export type TierDistributionEntry = {
  tier: TierLabel;
  therapistCount: number;
};

export type EarnerRow = {
  rank: number;
  therapistId: string;
  therapistName: string;
  tier: TierLabel;
  sessionsMonth: number;
  gross: number; // minor units
  share: number; // therapist take in minor units
  platformFee: number; // minor units
  currency: Currency;
  region: Region;
};

export type PayoutItem = {
  therapistId: string;
  therapistName: string;
  tier: TierLabel;
  sessions: number;
  gross: number;
  commissionPct: number; // e.g. 80 for 80%
  platformFee: number;
  net: number;
  status: PayoutItemStatus;
};

export type PayoutRun = {
  id: string;
  date: string; // ISO
  region: Region;
  currency: Currency;
  therapistsCount: number;
  totalGross: number;
  totalPlatformFee: number;
  totalNet: number;
  status: PayoutRunStatus;
  triggeredBy: string;
  triggeredAt: string;
  notes?: string;
  items: PayoutItem[];
};

export type TierOverride = {
  id: string;
  therapistId: string;
  therapistName: string;
  type: OverrideType;
  tier?: TierLabel;
  customPct?: number;
  appliedBy: string;
  appliedAt: string; // ISO
  expiresAt: string; // ISO
  reason: string;
};

export type PayoutRunFilters = {
  status?: "all" | "scheduled" | "processing" | "completed" | "failed";
  region?: "all" | "ng" | "intl";
  range?: "30d" | "90d" | "all";
};

const TIER_PCT: Record<TierLabel, number> = {
  New: 70,
  T1: 75,
  "T1+": 77,
  T2: 80,
  "T2+": 82,
  T3: 85,
  "T3+": 87,
  T4: 88,
  "T4+": 90,
};

const TIER_LADDER: TierLabel[] = [
  "New",
  "T1",
  "T1+",
  "T2",
  "T2+",
  "T3",
  "T3+",
  "T4",
  "T4+",
];

const TIER_DIST: Record<Region, TierDistributionEntry[]> = {
  NG: [
    { tier: "New", therapistCount: 8 },
    { tier: "T1", therapistCount: 14 },
    { tier: "T1+", therapistCount: 6 },
    { tier: "T2", therapistCount: 11 },
    { tier: "T2+", therapistCount: 4 },
    { tier: "T3", therapistCount: 5 },
    { tier: "T3+", therapistCount: 2 },
    { tier: "T4", therapistCount: 1 },
    { tier: "T4+", therapistCount: 1 },
  ],
  "Int'l": [
    { tier: "New", therapistCount: 4 },
    { tier: "T1", therapistCount: 7 },
    { tier: "T1+", therapistCount: 3 },
    { tier: "T2", therapistCount: 8 },
    { tier: "T2+", therapistCount: 3 },
    { tier: "T3", therapistCount: 6 },
    { tier: "T3+", therapistCount: 2 },
    { tier: "T4", therapistCount: 2 },
    { tier: "T4+", therapistCount: 1 },
  ],
};

const TOP_EARNERS_NG: EarnerRow[] = [
  { rank: 1, therapistId: "t-001", therapistName: "Dr. Tola Adesina", tier: "T2+", sessionsMonth: 87, gross: 4_350_000_00, share: 3_567_000_00, platformFee: 783_000_00, currency: "NGN", region: "NG" },
  { rank: 2, therapistId: "t-004", therapistName: "Dr. Aisha Bello", tier: "T1", sessionsMonth: 41, gross: 820_000_00, share: 615_000_00, platformFee: 205_000_00, currency: "NGN", region: "NG" },
];

const TOP_EARNERS_INTL: EarnerRow[] = [
  { rank: 1, therapistId: "t-002", therapistName: "Dr. Marcus Quinn", tier: "T3+", sessionsMonth: 102, gross: 11_240_00, share: 9_778_80, platformFee: 1_461_20, currency: "USD", region: "Int'l" },
  { rank: 2, therapistId: "t-003", therapistName: "Dr. Lina Park", tier: "T2", sessionsMonth: 64, gross: 8_120_00, share: 6_496_00, platformFee: 1_624_00, currency: "USD", region: "Int'l" },
  { rank: 3, therapistId: "t-005", therapistName: "Dr. Priya Shah", tier: "T3", sessionsMonth: 0, gross: 0, share: 0, platformFee: 0, currency: "USD", region: "Int'l" },
];

const PAYOUT_RUNS: PayoutRun[] = [
  {
    id: "pr-001",
    date: "2026-06-01T00:00:00Z",
    region: "NG",
    currency: "NGN",
    therapistsCount: 0,
    totalGross: 0,
    totalPlatformFee: 0,
    totalNet: 0,
    status: "Scheduled",
    triggeredBy: "System",
    triggeredAt: "2026-05-25T00:00:00Z",
    notes: "Monthly NG payout cycle. Calculated automatically.",
    items: [],
  },
  {
    id: "pr-002",
    date: "2026-06-01T00:00:00Z",
    region: "Int'l",
    currency: "USD",
    therapistsCount: 0,
    totalGross: 0,
    totalPlatformFee: 0,
    totalNet: 0,
    status: "Scheduled",
    triggeredBy: "System",
    triggeredAt: "2026-05-25T00:00:00Z",
    notes: "Monthly International payout cycle.",
    items: [],
  },
  {
    id: "pr-003",
    date: "2026-05-01T00:00:00Z",
    region: "NG",
    currency: "NGN",
    therapistsCount: 2,
    totalGross: 5_170_000_00,
    totalPlatformFee: 988_000_00,
    totalNet: 4_182_000_00,
    status: "Completed",
    triggeredBy: "Adaeze Nwosu",
    triggeredAt: "2026-05-01T08:00:00Z",
    notes: "April NG payout · processed via Paystack transfers · all therapists confirmed receipt.",
    items: [
      { therapistId: "t-001", therapistName: "Dr. Tola Adesina", tier: "T2+", sessions: 87, gross: 4_350_000_00, commissionPct: 82, platformFee: 783_000_00, net: 3_567_000_00, status: "Paid" },
      { therapistId: "t-004", therapistName: "Dr. Aisha Bello", tier: "T1", sessions: 41, gross: 820_000_00, commissionPct: 75, platformFee: 205_000_00, net: 615_000_00, status: "Paid" },
    ],
  },
  {
    id: "pr-004",
    date: "2026-05-01T00:00:00Z",
    region: "Int'l",
    currency: "USD",
    therapistsCount: 3,
    totalGross: 19_360_00,
    totalPlatformFee: 3_085_20,
    totalNet: 16_274_80,
    status: "Completed",
    triggeredBy: "Adaeze Nwosu",
    triggeredAt: "2026-05-01T08:00:00Z",
    notes: "April International payout · processed via Stripe Connect.",
    items: [
      { therapistId: "t-002", therapistName: "Dr. Marcus Quinn", tier: "T3+", sessions: 102, gross: 11_240_00, commissionPct: 87, platformFee: 1_461_20, net: 9_778_80, status: "Paid" },
      { therapistId: "t-003", therapistName: "Dr. Lina Park", tier: "T2", sessions: 64, gross: 8_120_00, commissionPct: 80, platformFee: 1_624_00, net: 6_496_00, status: "Paid" },
      { therapistId: "t-005", therapistName: "Dr. Priya Shah", tier: "T3", sessions: 0, gross: 0, commissionPct: 85, platformFee: 0, net: 0, status: "Paid" },
    ],
  },
  {
    id: "pr-005",
    date: "2026-04-01T00:00:00Z",
    region: "NG",
    currency: "NGN",
    therapistsCount: 2,
    totalGross: 4_980_000_00,
    totalPlatformFee: 956_400_00,
    totalNet: 4_023_600_00,
    status: "Completed",
    triggeredBy: "Adaeze Nwosu",
    triggeredAt: "2026-04-01T08:00:00Z",
    items: [
      { therapistId: "t-001", therapistName: "Dr. Tola Adesina", tier: "T2", sessions: 84, gross: 4_200_000_00, commissionPct: 80, platformFee: 840_000_00, net: 3_360_000_00, status: "Paid" },
      { therapistId: "t-004", therapistName: "Dr. Aisha Bello", tier: "T1", sessions: 39, gross: 780_000_00, commissionPct: 75, platformFee: 195_000_00, net: 585_000_00, status: "Paid" },
    ],
  },
  {
    id: "pr-006",
    date: "2026-05-15T00:00:00Z",
    region: "NG",
    currency: "NGN",
    therapistsCount: 1,
    totalGross: 372_000_00,
    totalPlatformFee: 93_000_00,
    totalNet: 279_000_00,
    status: "Failed",
    triggeredBy: "System",
    triggeredAt: "2026-05-15T08:00:00Z",
    notes: "Mid-cycle adjustment payout · Paystack returned BANK_DECLINED for primary account · therapist contacted to update bank details.",
    items: [
      { therapistId: "t-006", therapistName: "Dr. Femi Ojo", tier: "T1", sessions: 18, gross: 372_000_00, commissionPct: 75, platformFee: 93_000_00, net: 279_000_00, status: "Failed" },
    ],
  },
];

const OVERRIDES: TierOverride[] = [
  {
    id: "ov-001",
    therapistId: "t-005",
    therapistName: "Dr. Priya Shah",
    type: "Tier",
    tier: "T3+",
    appliedBy: "Adaeze Nwosu",
    appliedAt: "2026-05-10T10:00:00Z",
    expiresAt: "2026-08-10T00:00:00Z",
    reason: "On medical leave from 2026-05-12. Freezing Tier+ status per US-046 sick-leave exemption — preserves rolling-average from re-calculation until return.",
  },
  {
    id: "ov-002",
    therapistId: "t-002",
    therapistName: "Dr. Marcus Quinn",
    type: "Custom %",
    customPct: 90,
    appliedBy: "Founder",
    appliedAt: "2026-04-15T00:00:00Z",
    expiresAt: "2027-04-15T00:00:00Z",
    reason: "Strategic clinical hire for trauma expansion in EU markets. 90% commission for first 12 months as per offer letter.",
  },
];

export function getCommissionStats(region?: Region) {
  const dist = region ? TIER_DIST[region] : ([] as TierDistributionEntry[]);
  const allDist = [...TIER_DIST.NG, ...TIER_DIST["Int'l"]];
  const source = region ? dist : allDist;
  const totalTherapists = source.reduce((sum, e) => sum + e.therapistCount, 0);
  const tierPlusCount = source
    .filter((e) => e.tier.endsWith("+"))
    .reduce((sum, e) => sum + e.therapistCount, 0);
  const tierPlusRate =
    totalTherapists === 0 ? 0 : Math.round((tierPlusCount / totalTherapists) * 100);
  const avgPct =
    source.length === 0
      ? 0
      : Math.round(
          source.reduce((sum, e) => sum + TIER_PCT[e.tier] * e.therapistCount, 0) /
            Math.max(totalTherapists, 1)
        );
  const lastRun = PAYOUT_RUNS.find(
    (r) =>
      r.status === "Completed" && (!region || r.region === region)
  );
  return {
    totalTherapists,
    tierPlusCount,
    tierPlusRate,
    avgPct,
    totalPaidLastRun: lastRun?.totalNet ?? 0,
    paidCurrency: lastRun?.currency ?? "NGN",
  };
}

export function getTierDistribution(region?: Region): TierDistributionEntry[] {
  if (region) return TIER_DIST[region];
  return TIER_LADDER.map((tier) => ({
    tier,
    therapistCount:
      (TIER_DIST.NG.find((e) => e.tier === tier)?.therapistCount ?? 0) +
      (TIER_DIST["Int'l"].find((e) => e.tier === tier)?.therapistCount ?? 0),
  }));
}

export function getTopEarners(region?: Region, limit = 10): EarnerRow[] {
  const source = region
    ? region === "NG"
      ? TOP_EARNERS_NG
      : TOP_EARNERS_INTL
    : [...TOP_EARNERS_NG, ...TOP_EARNERS_INTL];
  return source.slice(0, limit);
}

export function getPayoutRuns(filters: PayoutRunFilters = {}): PayoutRun[] {
  return PAYOUT_RUNS.filter((r) => {
    if (filters.status && filters.status !== "all") {
      const map: Record<string, PayoutRunStatus> = {
        scheduled: "Scheduled",
        processing: "Processing",
        completed: "Completed",
        failed: "Failed",
      };
      if (r.status !== map[filters.status]) return false;
    }
    if (filters.region && filters.region !== "all") {
      const target: Region = filters.region === "ng" ? "NG" : "Int'l";
      if (r.region !== target) return false;
    }
    return true;
  });
}

export function getPayoutRun(id: string): PayoutRun | undefined {
  return PAYOUT_RUNS.find((r) => r.id === id);
}

export type TherapistEarning = {
  runId: string;
  runDate: string; // ISO
  region: Region;
  currency: Currency;
  tier: TierLabel;
  sessions: number;
  gross: number;
  net: number;
  status: PayoutItemStatus;
};

export function getEarningsByTherapist(therapistId: string): {
  lifetimeNet: number;
  lifetimeCurrency: Currency;
  lastPayout: TherapistEarning | undefined;
  currentTier: TierLabel | undefined;
  isTierPlus: boolean;
  recent: TherapistEarning[];
} {
  const items: TherapistEarning[] = [];
  for (const run of PAYOUT_RUNS) {
    for (const it of run.items) {
      if (it.therapistId !== therapistId) continue;
      items.push({
        runId: run.id,
        runDate: run.date,
        region: run.region,
        currency: run.currency,
        tier: it.tier,
        sessions: it.sessions,
        gross: it.gross,
        net: it.net,
        status: it.status,
      });
    }
  }
  items.sort(
    (a, b) => new Date(b.runDate).getTime() - new Date(a.runDate).getTime()
  );
  const lifetimeNet = items
    .filter((e) => e.status === "Paid")
    .reduce((sum, e) => sum + e.net, 0);
  const lifetimeCurrency = items[0]?.currency ?? "NGN";
  const lastPayout = items.find((e) => e.status === "Paid");
  const currentTier = lastPayout?.tier;
  const isTierPlus = currentTier?.endsWith("+") ?? false;
  return {
    lifetimeNet,
    lifetimeCurrency,
    lastPayout,
    currentTier,
    isTierPlus,
    recent: items.slice(0, 3),
  };
}

export function getPayoutRunStats() {
  const next = PAYOUT_RUNS.find((r) => r.status === "Scheduled");
  return {
    nextRunDate: next?.date,
    pending: PAYOUT_RUNS.filter((r) => r.status === "Scheduled" || r.status === "Processing").length,
    failed: PAYOUT_RUNS.filter((r) => r.status === "Failed").length,
  };
}

export function getActiveOverrides(): TierOverride[] {
  return OVERRIDES;
}

export function getAllTherapistsForOverride(): Array<{ id: string; name: string }> {
  return [
    { id: "t-001", name: "Dr. Tola Adesina" },
    { id: "t-002", name: "Dr. Marcus Quinn" },
    { id: "t-003", name: "Dr. Lina Park" },
    { id: "t-004", name: "Dr. Aisha Bello" },
    { id: "t-005", name: "Dr. Priya Shah" },
    { id: "t-006", name: "Dr. Femi Ojo" },
  ];
}

export const ALL_TIER_LABELS = TIER_LADDER;
export const TIER_PCT_MAP = TIER_PCT;

export function formatMoney(amount: number, currency: Currency): string {
  if (currency === "NGN") {
    if (amount >= 1_000_000_00) return `₦${(amount / 100 / 1_000_000).toFixed(2)}M`;
    if (amount >= 100_000_00) return `₦${(amount / 100 / 1000).toFixed(0)}k`;
    return `₦${(amount / 100).toLocaleString()}`;
  }
  if (amount >= 1_000_000_00) return `$${(amount / 100 / 1_000_000).toFixed(2)}M`;
  if (amount >= 10_000_00) return `$${(amount / 100 / 1000).toFixed(1)}k`;
  return `$${(amount / 100).toLocaleString()}`;
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
