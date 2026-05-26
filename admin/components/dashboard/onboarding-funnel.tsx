"use client";

import { useState } from "react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { DashboardData } from "@/lib/dummy/types";

type LocalRegion = "all" | "ng" | "intl";

type Props = {
  funnel: DashboardData["funnel"];
};

export function OnboardingFunnel({ funnel }: Props) {
  const [localRegion, setLocalRegion] = useState<LocalRegion>("all");

  const max = Math.max(...funnel.steps.map((s) => s.count), 1);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Onboarding funnel</CardTitle>
        <Tabs
          value={localRegion}
          onValueChange={(v) => setLocalRegion(v as LocalRegion)}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="ng">NG</TabsTrigger>
            <TabsTrigger value="intl">Int&apos;l</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {funnel.steps.map((step, idx) => {
            const widthPct = (step.count / max) * 100;
            return (
              <div key={step.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{step.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {step.count.toLocaleString()}
                    {step.conversionPct !== null && idx > 0 && (
                      <span className="ml-2 text-xs">
                        ({step.conversionPct}%)
                      </span>
                    )}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary/80"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" disabled>
          Export funnel CSV (prototype)
        </Button>
      </CardFooter>
    </Card>
  );
}
