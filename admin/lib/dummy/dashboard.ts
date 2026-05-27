import type {
  DashboardData,
  Region,
  Window,
} from "@/lib/dummy/types";

// Single fixed snapshot. Window + region toggles change displayed metadata but
// not the underlying dummy points (prototype constraint).

const REVENUE_7D = [
  { date: "Tue 20", ngn: 612_000, usd: 1_120, sessions: 68 },
  { date: "Wed 21", ngn: 588_000, usd: 1_240, sessions: 72 },
  { date: "Thu 22", ngn: 642_000, usd: 1_080, sessions: 74 },
  { date: "Fri 23", ngn: 701_000, usd: 1_360, sessions: 81 },
  { date: "Sat 24", ngn: 520_000, usd: 980, sessions: 58 },
  { date: "Sun 25", ngn: 498_000, usd: 1_020, sessions: 61 },
  { date: "Mon 26", ngn: 689_000, usd: 1_650, sessions: 98 },
];

export function getDashboardData(window: Window, region: Region): DashboardData {
  // For the prototype, the same dummy set is returned regardless of window/region;
  // a "(filtered)" tag is appended to the subtitle copy upstream when region != "all".
  void window;
  void region;

  return {
    window,
    region,
    updatedAt: new Date().toISOString(),
    crisisTier: {
      crisisCount: 2,
      verificationsOverdue: 5,
      pricingApprovalsOverdue: 1,
    },
    kpis: [
      {
        id: "mrr",
        label: "MRR",
        primary: "₦4.2M · $8,450",
        secondary: "Region split",
        delta: "NGN +6.1% · USD +2.4%",
        deltaDirection: "up",
      },
      {
        id: "subscribers",
        label: "Active subscribers",
        primary: "1,287",
        secondary: "NG 1,104 · Int'l 183",
        delta: "+42 this week",
        deltaDirection: "up",
      },
      {
        id: "therapists",
        label: "Active therapists",
        primary: "94",
        secondary: "Verified · accepting bookings",
        delta: "+3 onboarded · 2 pending verif",
        deltaDirection: "up",
      },
      {
        id: "sessions",
        label: "Sessions completed (7d)",
        primary: "512",
        secondary: "Avg 5.4 / active client",
        delta: "+8.3%",
        deltaDirection: "up",
      },
    ],
    revenue: REVENUE_7D,
    queues: {
      verifications: {
        pending: 5,
        items: [
          { id: "v1", name: "Dr. Aisha Bello", country: "Nigeria", submittedAgo: "2h ago" },
          { id: "v2", name: "Dr. Marcus Quinn", country: "UK", submittedAgo: "5h ago" },
          { id: "v3", name: "Dr. Priya Shah", country: "Canada", submittedAgo: "1d ago" },
        ],
      },
      pricingApprovals: {
        pending: 1,
        overdue: 1,
        items: [
          {
            id: "p1",
            therapist: "Dr. Tola Adesina",
            plan: "Together · Couple",
            deltaFromBand: "+25% over band",
            submittedAgo: "4d ago",
            isOverdue: true,
          },
          {
            id: "p2",
            therapist: "Dr. Lina Park",
            plan: "Harmony · Couple Monthly",
            deltaFromBand: "+10% over band",
            submittedAgo: "1d ago",
            isOverdue: false,
          },
        ],
      },
    },
    planCoverage: [
      { plan: "Family Care · Family Monthly", region: "NG", therapists: 2, gap: 1 },
      { plan: "Restore · Couple Monthly", region: "Int'l", therapists: 1, gap: 2 },
      { plan: "Home · Family PAYG", region: "Int'l", therapists: 2, gap: 1 },
    ],
    clinical: {
      crisis: {
        activeCount: 2,
        avgResponse: "4m 12s",
        escalations: 0,
        items: [
          { id: "c1", clientAlias: "Client-9128", therapist: "Dr. Tola Adesina", loggedAgo: "12m ago", status: "active" },
          { id: "c2", clientAlias: "Client-8842", therapist: "Dr. Marcus Quinn", loggedAgo: "37m ago", status: "responded" },
          { id: "c3", clientAlias: "Client-7710", therapist: "Dr. Priya Shah", loggedAgo: "2h ago", status: "resolved" },
        ],
      },
      risk: {
        submitted: 12,
        redFlags: 2,
        followUpOverdue: 1,
        items: [
          { id: "r1", clientAlias: "Client-9128", therapist: "Dr. Tola Adesina", region: "NG", followUpDue: "overdue 1d" },
          { id: "r2", clientAlias: "Client-8842", therapist: "Dr. Marcus Quinn", region: "Int'l", followUpDue: "due tomorrow" },
        ],
      },
    },
    funnel: {
      steps: [
        { label: "Signups", count: 312, conversionPct: null },
        { label: "Intake done", count: 247, conversionPct: 79 },
        { label: "Plan purchased", count: 168, conversionPct: 68 },
        { label: "First session", count: 142, conversionPct: 85 },
      ],
    },
    activity: [
      { id: "a1", actor: "Adaeze", action: "verified", target: "Dr. Tola Adesina", timestampAgo: "4m ago" },
      { id: "a2", actor: "Sarah", action: "resolved crisis", target: "#4318", timestampAgo: "2h ago" },
      { id: "a3", actor: "System", action: "auto-paused promo", target: "May Onboarding (NG)", timestampAgo: "3h ago" },
      { id: "a4", actor: "Adaeze", action: "updated pricing band", target: "Together NGN", timestampAgo: "5h ago" },
      { id: "a5", actor: "Marcus", action: "approved custom pricing", target: "Dr. Lina Park", timestampAgo: "1d ago" },
    ],
  };
}
