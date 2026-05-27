import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AuditsTable } from "@/components/compliance/audits-table";
import { ActionItemsList } from "@/components/compliance/action-items-list";
import { StatCard, StatCardGrid } from "@/components/stat-card";
import { MoreActionsMenu } from "@/components/more-actions-menu";

import { getComplianceStats } from "@/lib/dummy/compliance";

export default function CompliancePage() {
  const stats = getComplianceStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Compliance</h1>
          <p className="text-sm text-muted-foreground">
            NDPR + GDPR governance · {stats.openRequestCount} open requests ·{" "}
            {stats.overdueCount} overdue
          </p>
        </div>
        <MoreActionsMenu
          items={[
            { label: "Subject requests", href: "/compliance/requests" },
            { label: "Residency settings", href: "/compliance/residency" },
          ]}
        />
      </header>

      <StatCardGrid columns={3}>
        <StatCard
          label="Subject requests"
          value={stats.openRequestCount}
          sub={`${stats.overdueCount} overdue · NDPR + GDPR SLA 30 days`}
        />
        <StatCard
          label="Consent records up to date"
          value={`${stats.consentFreshnessPct}%`}
          sub={`Last refresh ${stats.consentLastRefresh}`}
        />
        <StatCard
          label="Residency status"
          value={`${stats.compliantRegions} / ${stats.totalRegions}`}
          sub="regions in full compliance"
        />
      </StatCardGrid>

      <Card>
        <CardHeader>
          <CardTitle>Recent audits</CardTitle>
        </CardHeader>
        <CardContent>
          <AuditsTable />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Outstanding action items</CardTitle>
        </CardHeader>
        <CardContent>
          <ActionItemsList />
        </CardContent>
      </Card>
    </div>
  );
}
