import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/therapists/data-table";

import { clientListColumns } from "@/components/clients/client-list-columns";
import { ClientListFilters } from "@/components/clients/client-list-filters";

import {
  getClients,
  getClientListStats,
  type ClientFilters,
} from "@/lib/dummy/clients";

type SearchParams = Promise<{
  q?: string;
  region?: string;
  plan?: string;
  status?: string;
}>;

function asClientFilters(p: Awaited<SearchParams>): ClientFilters {
  return {
    q: p.q,
    region: p.region as ClientFilters["region"],
    plan: p.plan,
    status: p.status as ClientFilters["status"],
  };
}

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asClientFilters(params);
  const clients = getClients(filters);
  const stats = getClientListStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Clients</h1>
          <p className="text-sm text-muted-foreground">
            {stats.activeCount} active across {stats.totalPlans} plans ·{" "}
            {stats.pastDueCount} past-due · {stats.riskWatchCount} on risk watch
          </p>
        </div>
        <Button variant="outline" disabled>
          Export CSV
        </Button>
      </header>

      <ClientListFilters />

      <DataTable
        columns={clientListColumns}
        data={clients}
        emptyMessage="No clients match these filters."
      />
    </div>
  );
}
