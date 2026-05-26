import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/therapists/data-table";
import { directoryColumns } from "@/components/therapists/directory-columns";
import { DirectoryFilters } from "@/components/therapists/directory-filters";

import {
  getTherapists,
  getTherapistDirectoryStats,
  type TherapistFilters,
} from "@/lib/dummy/therapists";

type SearchParams = Promise<{
  q?: string;
  region?: string;
  tier?: string;
  status?: string;
}>;

function asTherapistFilters(p: Awaited<SearchParams>): TherapistFilters {
  return {
    q: p.q,
    region: p.region as TherapistFilters["region"],
    tier: p.tier as TherapistFilters["tier"],
    status: p.status as TherapistFilters["status"],
  };
}

export default async function TherapistsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asTherapistFilters(params);
  const therapists = getTherapists(filters);
  const stats = getTherapistDirectoryStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Therapists</h1>
          <p className="text-sm text-muted-foreground">
            {stats.activeCount} active across {stats.plansCount} plans ·{" "}
            {stats.awaitingVerification} awaiting verification
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/therapists/verifications">Open verifications →</Link>
          </Button>
          <Button variant="outline" disabled>
            Export CSV
          </Button>
        </div>
      </header>

      <DirectoryFilters />

      <DataTable
        columns={directoryColumns}
        data={therapists}
        emptyMessage="No therapists match these filters."
      />
    </div>
  );
}
