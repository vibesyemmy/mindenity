import { DataTable } from "@/components/therapists/data-table";

import { crisisColumns } from "@/components/clinical/crisis-columns";
import { CrisisFilters } from "@/components/clinical/crisis-filters";

import {
  getCrisisEvents,
  getCrisisStats,
  formatResponseTime,
  type CrisisFilters as CrisisFilterShape,
} from "@/lib/dummy/clinical";

export const dynamic = "force-static";

type SearchParams = Promise<{
  status?: string;
  region?: string;
  therapist?: string;
  client?: string;
  range?: string;
}>;

function asFilters(p: Awaited<SearchParams>): CrisisFilterShape {
  return {
    status: (p.status as CrisisFilterShape["status"]) ?? "all",
    region: p.region as CrisisFilterShape["region"],
    therapist: p.therapist,
    client: p.client,
    range: (p.range as CrisisFilterShape["range"]) ?? "all",
  };
}

export default async function CrisisPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const events = getCrisisEvents(filters);
  const stats = getCrisisStats();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-heading text-3xl tracking-tight">Crisis log</h1>
        <p className="text-sm text-muted-foreground">
          {stats.active} active · {stats.today24h} in last 24h · avg response{" "}
          {formatResponseTime(stats.avgResponseSec)}
        </p>
      </header>

      <CrisisFilters />

      <DataTable
        columns={crisisColumns}
        data={events}
        emptyMessage="No crisis alerts in this view."
      />
    </div>
  );
}
