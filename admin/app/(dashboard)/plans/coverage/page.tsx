"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { CoverageChart } from "@/components/plans/coverage-chart";
import { CoverageTable } from "@/components/plans/coverage-table";

import { getCoverageStats } from "@/lib/dummy/plans";

type RegionParam = "all" | "ng" | "intl";

function asRegion(v: string | null): RegionParam {
  if (v === "ng" || v === "intl") return v;
  return "all";
}

function regionToData(r: RegionParam): "NG" | "Int'l" | undefined {
  if (r === "ng") return "NG";
  if (r === "intl") return "Int'l";
  return undefined;
}

export default function CoveragePage() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const region = asRegion(params.get("region"));
  const stats = getCoverageStats();

  const setRegion = (v: string) => {
    const next = new URLSearchParams(params);
    if (v === "all") next.delete("region");
    else next.set("region", v);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Plan coverage</h1>
          <p className="text-sm text-muted-foreground">
            {stats.lowCoverage} plans below 3-therapist threshold ·{" "}
            {stats.totalPerRegion} total per region
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/plans">← Back to plans</Link>
          </Button>
          <Button variant="outline" disabled>
            Export CSV
          </Button>
        </div>
      </header>

      <Tabs value={region} onValueChange={setRegion}>
        <TabsList>
          <TabsTrigger value="all">All regions</TabsTrigger>
          <TabsTrigger value="ng">Nigeria</TabsTrigger>
          <TabsTrigger value="intl">International</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Therapist count per plan</CardTitle>
        </CardHeader>
        <CardContent>
          <CoverageChart region={regionToData(region)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plans needing coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <CoverageTable region={regionToData(region)} />
        </CardContent>
      </Card>
    </div>
  );
}
