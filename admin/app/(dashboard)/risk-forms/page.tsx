import { DataTable } from "@/components/therapists/data-table";

import { riskFormColumns } from "@/components/clinical/risk-form-columns";
import { RiskFormFilters } from "@/components/clinical/risk-form-filters";

import {
  getRiskForms,
  getRiskFormStats,
  type RiskFormFilters as RiskFormFilterShape,
} from "@/lib/dummy/clinical";

type SearchParams = Promise<{
  status?: string;
  severity?: string;
  region?: string;
  therapist?: string;
  client?: string;
}>;

function asFilters(p: Awaited<SearchParams>): RiskFormFilterShape {
  return {
    status: (p.status as RiskFormFilterShape["status"]) ?? "open",
    severity: (p.severity as RiskFormFilterShape["severity"]) ?? "red",
    region: p.region as RiskFormFilterShape["region"],
    therapist: p.therapist,
    client: p.client,
  };
}

export default async function RiskFormsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const forms = getRiskForms(filters);
  const stats = getRiskFormStats();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-heading text-3xl tracking-tight">
          Risk follow-up queue
        </h1>
        <p className="text-sm text-muted-foreground">
          {stats.open} open · {stats.overdue} overdue ·{" "}
          {stats.internationalRedPending} international red-level pending verification
        </p>
      </header>

      <RiskFormFilters />

      <DataTable
        columns={riskFormColumns}
        data={forms}
        emptyMessage="No risk forms in this view. Nice."
      />
    </div>
  );
}
