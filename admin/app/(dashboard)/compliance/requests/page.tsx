import Link from "next/link";

import { Button } from "@/components/ui/button";

import { RequestFilters } from "@/components/compliance/request-filters";
import { RequestsList } from "@/components/compliance/requests-list";

import {
  getSubjectRequests,
  getComplianceStats,
  type RequestFilters as RequestFilterShape,
} from "@/lib/dummy/compliance";

type SearchParams = Promise<{
  status?: string;
  type?: string;
  region?: string;
}>;

function asFilters(p: Awaited<SearchParams>): RequestFilterShape {
  return {
    status: (p.status as RequestFilterShape["status"]) ?? "all",
    type: p.type as RequestFilterShape["type"],
    region: p.region as RequestFilterShape["region"],
  };
}

export default async function ComplianceRequestsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const requests = getSubjectRequests(filters);
  const stats = getComplianceStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Subject requests</h1>
          <p className="text-sm text-muted-foreground">
            {stats.openRequestCount} pending · {stats.overdueCount} overdue ·
            NDPR + GDPR responses ≤30 days
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/compliance">← Compliance</Link>
        </Button>
      </header>

      <RequestFilters />

      <RequestsList requests={requests} />
    </div>
  );
}
