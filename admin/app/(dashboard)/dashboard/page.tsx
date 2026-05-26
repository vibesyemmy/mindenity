import { getDashboardData } from "@/lib/dummy/dashboard";
import type { Region, Window } from "@/lib/dummy/types";
import { PageHeader } from "@/components/dashboard/page-header";
import { CrisisTier } from "@/components/dashboard/crisis-tier";
import { KpiStrip } from "@/components/dashboard/kpi-strip";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { OperationsZone } from "@/components/dashboard/operations-zone";
import { PlanCoverageSpotlight } from "@/components/dashboard/plan-coverage-spotlight";
import { ClinicalSafetyZone } from "@/components/dashboard/clinical-safety-zone";

type SearchParams = Promise<{ window?: string; region?: string }>;

function asWindow(v?: string): Window {
  return v === "30d" || v === "90d" || v === "ytd" ? v : "7d";
}
function asRegion(v?: string): Region {
  return v === "ng" || v === "intl" ? v : "all";
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const window = asWindow(params.window);
  const region = asRegion(params.region);
  const data = getDashboardData(window, region);

  return (
    <div className="space-y-8">
      <PageHeader window={window} region={region} updatedLabel="Updated just now" />
      <CrisisTier state={data.crisisTier} />
      <KpiStrip cards={data.kpis} />
      <RevenueChart points={data.revenue} />
      <OperationsZone queues={data.queues} />
      <PlanCoverageSpotlight items={data.planCoverage} />
      <ClinicalSafetyZone clinical={data.clinical} />
    </div>
  );
}
