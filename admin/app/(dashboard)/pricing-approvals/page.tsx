import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/therapists/data-table";

import { queueColumns } from "@/components/pricing-approvals/queue-columns";
import { QueueFilters } from "@/components/pricing-approvals/queue-filters";

import {
  getApprovals,
  getApprovalStats,
  type ApprovalFilters,
} from "@/lib/dummy/pricing-approvals";

type SearchParams = Promise<{
  status?: string;
  region?: string;
  plan?: string;
}>;

function asFilters(p: Awaited<SearchParams>): ApprovalFilters {
  return {
    status: (p.status as ApprovalFilters["status"]) ?? "pending",
    region: p.region as ApprovalFilters["region"],
    plan: p.plan,
  };
}

export default async function PricingApprovalsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const requests = getApprovals(filters);
  const stats = getApprovalStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            Custom pricing approvals
          </h1>
          <p className="text-sm text-muted-foreground">
            {stats.pending} pending · {stats.overdue} overdue ·{" "}
            {stats.countered} awaiting therapist response
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/plans">← Back to plans</Link>
        </Button>
      </header>

      <QueueFilters />

      <DataTable
        columns={queueColumns}
        data={requests}
        emptyMessage="No requests in this view."
      />
    </div>
  );
}
