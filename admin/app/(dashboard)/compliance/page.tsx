import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AuditsTable } from "@/components/compliance/audits-table";
import { ActionItemsList } from "@/components/compliance/action-items-list";

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
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/compliance/requests">Subject requests →</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/compliance/residency">Residency settings →</Link>
          </Button>
        </div>
      </header>

      <section
        aria-label="KPIs"
        className="grid grid-cols-1 gap-3 lg:grid-cols-3"
      >
        <Card className="gap-1 py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Subject requests
            </p>
          </CardHeader>
          <CardContent className="px-5">
            <p className="font-heading text-2xl tabular-nums">
              {stats.openRequestCount}
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.overdueCount} overdue · NDPR + GDPR SLA 30 days
            </p>
          </CardContent>
        </Card>

        <Card className="gap-1 py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Consent records up to date
            </p>
          </CardHeader>
          <CardContent className="px-5">
            <p className="font-heading text-2xl tabular-nums">
              {stats.consentFreshnessPct}%
            </p>
            <p className="text-xs text-muted-foreground">
              Last refresh {stats.consentLastRefresh}
            </p>
          </CardContent>
        </Card>

        <Card className="gap-1 py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Residency status
            </p>
          </CardHeader>
          <CardContent className="px-5">
            <p className="font-heading text-2xl tabular-nums">
              {stats.compliantRegions} / {stats.totalRegions}
            </p>
            <p className="text-xs text-muted-foreground">
              regions in full compliance
            </p>
          </CardContent>
        </Card>
      </section>

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
