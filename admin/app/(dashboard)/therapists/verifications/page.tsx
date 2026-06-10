import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/therapists/data-table";
import { queueColumns } from "@/components/therapists/queue-columns";
import { QueueFilters } from "@/components/therapists/queue-filters";

import {
  getVerifications,
  getVerificationStats,
  type VerificationFilters,
} from "@/lib/dummy/therapists";

export const dynamic = "force-static";

type SearchParams = Promise<{
  q?: string;
  region?: string;
  aiFlag?: string;
}>;

function asVerificationFilters(
  p: Awaited<SearchParams>
): VerificationFilters {
  return {
    q: p.q,
    region: p.region as VerificationFilters["region"],
    aiFlag: p.aiFlag as VerificationFilters["aiFlag"],
  };
}

export default async function VerificationsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asVerificationFilters(params);
  const verifications = getVerifications(filters);
  const stats = getVerificationStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            Verifications waiting
          </h1>
          <p className="text-sm text-muted-foreground">
            {stats.pending} applications pending review · {stats.flagged} flagged
            by AI
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/therapists">← Back to directory</Link>
        </Button>
      </header>

      <QueueFilters />

      <DataTable
        columns={queueColumns}
        data={verifications}
        emptyMessage="All caught up — no pending applications."
      />
    </div>
  );
}
