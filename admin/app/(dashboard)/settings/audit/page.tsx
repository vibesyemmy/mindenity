import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/therapists/data-table";

import { auditColumns } from "@/components/settings/audit-columns";
import { AuditFilters } from "@/components/settings/audit-filters";

import {
  formatRelative,
  getAuditEntries,
  getSettingsStats,
  type AuditFilters as AuditFilterShape,
} from "@/lib/dummy/settings";

export const dynamic = "force-static";

type SearchParams = Promise<{
  q?: string;
  adminId?: string;
  action?: string;
  range?: string;
}>;

function asFilters(p: Awaited<SearchParams>): AuditFilterShape {
  return {
    q: p.q,
    adminId: p.adminId,
    action: p.action,
    range: (p.range as AuditFilterShape["range"]) ?? "all",
  };
}

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const entries = getAuditEntries(filters);
  const stats = getSettingsStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Audit log</h1>
          <p className="text-sm text-muted-foreground">
            {stats.totalEntries} actions logged
            {stats.lastEntryAt
              ? ` · last entry ${formatRelative(stats.lastEntryAt)}`
              : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/settings">← Admin users</Link>
          </Button>
          <Button variant="outline" disabled>
            Export CSV
          </Button>
        </div>
      </header>

      <AuditFilters />

      <DataTable
        columns={auditColumns}
        data={entries}
        emptyMessage="No audit entries match these filters."
      />
    </div>
  );
}
