import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/therapists/data-table";

import { sessionColumns } from "@/components/clinical/session-columns";
import { SessionFilters } from "@/components/clinical/session-filters";

import {
  getSessions,
  getSessionStats,
  type SessionFilters as SessionFilterShape,
} from "@/lib/dummy/clinical";

export const dynamic = "force-static";

type SearchParams = Promise<{
  q?: string;
  range?: string;
  region?: string;
  risk?: string;
  therapist?: string;
  client?: string;
}>;

function asFilters(p: Awaited<SearchParams>): SessionFilterShape {
  return {
    q: p.q,
    range: (p.range as SessionFilterShape["range"]) ?? "all",
    region: p.region as SessionFilterShape["region"],
    risk: p.risk as SessionFilterShape["risk"],
    therapist: p.therapist,
    client: p.client,
  };
}

export default async function SessionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const sessions = getSessions(filters);
  const stats = getSessionStats(filters);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Sessions</h1>
          <p className="text-sm text-muted-foreground">
            {stats.total} session{stats.total === 1 ? "" : "s"} in window · {stats.redFlag} red-flag · avg {stats.avgDuration} min
          </p>
        </div>
        <Button variant="outline" disabled>
          Export CSV
        </Button>
      </header>

      <SessionFilters />

      <DataTable
        columns={sessionColumns}
        data={sessions}
        emptyMessage="No sessions match these filters."
      />
    </div>
  );
}
