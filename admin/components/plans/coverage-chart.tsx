"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  getCoverageByPlan,
  ALL_PLAN_NAMES_ORDERED,
} from "@/lib/dummy/plans";

type Props = {
  region?: "NG" | "Int'l";
};

const config = {
  ng: { label: "Nigeria", color: "var(--chart-1)" },
  intl: { label: "International", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function CoverageChart({ region }: Props) {
  const all = getCoverageByPlan();
  const data = ALL_PLAN_NAMES_ORDERED.map((plan) => {
    const ng = all.find((c) => c.plan === plan && c.region === "NG")?.therapists ?? 0;
    const intl = all.find((c) => c.plan === plan && c.region === "Int'l")?.therapists ?? 0;
    return { plan, ng, intl };
  });

  return (
    <ChartContainer config={config} className="h-[320px] w-full">
      <BarChart data={data} margin={{ left: 0, right: 0, top: 8, bottom: 24 }}>
        <CartesianGrid vertical={false} className="stroke-border/50" />
        <XAxis
          dataKey="plan"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          className="text-xs"
          interval={0}
          angle={-25}
          textAnchor="end"
          height={60}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          className="text-xs"
          width={32}
          allowDecimals={false}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        {(!region || region === "NG") && (
          <Bar dataKey="ng" stackId="r" fill="var(--color-ng)" radius={[0, 0, 0, 0]} />
        )}
        {(!region || region === "Int'l") && (
          <Bar dataKey="intl" stackId="r" fill="var(--color-intl)" radius={[4, 4, 0, 0]} />
        )}
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
}
