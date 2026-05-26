"use client";

import Link from "next/link";
import { useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DataTable } from "@/components/therapists/data-table";
import { makePricingColumns } from "@/components/plans/pricing-columns";
import { PricingEditDialog } from "@/components/plans/pricing-edit-dialog";

import {
  getPricingByRegion,
  getPlanStats,
  type PlanPricing,
} from "@/lib/dummy/plans";

export default function PlansPage() {
  const [editPlan, setEditPlan] = useState<PlanPricing | null>(null);
  const stats = getPlanStats();
  const ngPricing = getPricingByRegion("NG");
  const usdPricing = getPricingByRegion("Int'l");

  const columns = useMemo(
    () => makePricingColumns((p) => setEditPlan(p)),
    []
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            Plans &amp; pricing
          </h1>
          <p className="text-sm text-muted-foreground">
            {stats.activeNg + stats.activeIntl} active plan listings across 2 regions ·{" "}
            {stats.pendingApprovals} with out-of-band requests pending
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/plans/eligibility">Eligibility matrix →</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/plans/coverage">Coverage report →</Link>
          </Button>
        </div>
      </header>

      <Tabs defaultValue="ng">
        <TabsList>
          <TabsTrigger value="ng">Nigeria (NGN)</TabsTrigger>
          <TabsTrigger value="intl">International (USD)</TabsTrigger>
        </TabsList>

        <TabsContent value="ng" className="pt-4">
          <DataTable columns={columns} data={ngPricing} emptyMessage="No plans." />
        </TabsContent>
        <TabsContent value="intl" className="pt-4">
          <DataTable columns={columns} data={usdPricing} emptyMessage="No plans." />
        </TabsContent>
      </Tabs>

      <p className="text-xs text-muted-foreground">
        Therapists may set their own price within the min/max band. Out-of-band
        requests route to approval (see Custom pricing approvals).
      </p>

      <PricingEditDialog
        plan={editPlan}
        open={editPlan !== null}
        onOpenChange={(open) => {
          if (!open) setEditPlan(null);
        }}
      />
    </div>
  );
}
