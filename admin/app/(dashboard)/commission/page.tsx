"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TierChart } from "@/components/commission/tier-chart";
import { TopEarnersTable } from "@/components/commission/top-earners-table";

import {
  formatMoney,
  getCommissionStats,
  type Region,
} from "@/lib/dummy/commission";

type RegionTab = "all" | "ng" | "intl";

function tabToRegion(t: RegionTab): Region | undefined {
  if (t === "ng") return "NG";
  if (t === "intl") return "Int'l";
  return undefined;
}

export default function CommissionPage() {
  const [tab, setTab] = useState<RegionTab>("all");
  const region = tabToRegion(tab);
  const stats = getCommissionStats(region);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            Commission &amp; payouts
          </h1>
          <p className="text-sm text-muted-foreground">
            {stats.tierPlusCount} of {stats.totalTherapists} on Tier+ this month ·
            avg therapist share {stats.avgPct}%
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/commission/payouts">Payout runs →</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/commission/overrides">Tier overrides →</Link>
          </Button>
        </div>
      </header>

      <Tabs value={tab} onValueChange={(v) => setTab(v as RegionTab)}>
        <TabsList>
          <TabsTrigger value="all">All regions</TabsTrigger>
          <TabsTrigger value="ng">Nigeria</TabsTrigger>
          <TabsTrigger value="intl">International</TabsTrigger>
        </TabsList>
      </Tabs>

      <section
        aria-label="KPI strip"
        className="grid grid-cols-1 gap-3 lg:grid-cols-3"
      >
        <Card className="gap-1 py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Tier+ activation rate
            </p>
          </CardHeader>
          <CardContent className="px-5">
            <p className="font-heading text-2xl tabular-nums">
              {stats.tierPlusRate}%
            </p>
            <p className="text-xs text-muted-foreground">
              {stats.tierPlusCount} of {stats.totalTherapists} therapists
            </p>
          </CardContent>
        </Card>

        <Card className="gap-1 py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Avg commission % paid
            </p>
          </CardHeader>
          <CardContent className="px-5">
            <p className="font-heading text-2xl tabular-nums">{stats.avgPct}%</p>
            <p className="text-xs text-muted-foreground">
              Weighted by therapist count per tier
            </p>
          </CardContent>
        </Card>

        <Card className="gap-1 py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Last payout total
            </p>
          </CardHeader>
          <CardContent className="px-5">
            <p className="font-heading text-2xl tabular-nums">
              {formatMoney(stats.totalPaidLastRun, stats.paidCurrency)}
            </p>
            <p className="text-xs text-muted-foreground">
              Most recent completed run
            </p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Tier distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <TierChart region={region} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Top earners (this month)</CardTitle>
          <Button variant="outline" size="sm" disabled>
            Export CSV
          </Button>
        </CardHeader>
        <CardContent>
          <TopEarnersTable region={region} />
        </CardContent>
      </Card>
    </div>
  );
}
