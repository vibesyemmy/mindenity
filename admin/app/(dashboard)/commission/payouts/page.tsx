import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/therapists/data-table";

import { payoutRunsColumns } from "@/components/commission/payout-runs-columns";
import { PayoutRunsFilters } from "@/components/commission/payout-runs-filters";

import {
  formatDate,
  getPayoutRuns,
  getPayoutRunStats,
  type PayoutRunFilters,
} from "@/lib/dummy/commission";

export const dynamic = "force-static";

type SearchParams = Promise<{
  status?: string;
  region?: string;
  range?: string;
}>;

function asFilters(p: Awaited<SearchParams>): PayoutRunFilters {
  return {
    status: (p.status as PayoutRunFilters["status"]) ?? "all",
    region: p.region as PayoutRunFilters["region"],
    range: (p.range as PayoutRunFilters["range"]) ?? "all",
  };
}

export default async function PayoutRunsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const runs = getPayoutRuns(filters);
  const stats = getPayoutRunStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Payout runs</h1>
          <p className="text-sm text-muted-foreground">
            {stats.nextRunDate
              ? `Next scheduled ${formatDate(stats.nextRunDate)} · `
              : ""}
            {stats.pending} pending · {stats.failed} need attention
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/commission">← Commission</Link>
        </Button>
      </header>

      <PayoutRunsFilters />

      <DataTable
        columns={payoutRunsColumns}
        data={runs}
        emptyMessage="No payout runs in this view."
      />
    </div>
  );
}
