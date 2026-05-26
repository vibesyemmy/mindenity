"use client";

import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import type { RevenuePoint } from "@/lib/dummy/types";

type Props = {
  points: RevenuePoint[];
};

const config = {
  ngn: {
    label: "NGN",
    color: "var(--chart-1)",
  },
  usd: {
    label: "USD",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

const formatNgn = (v: number) => `₦${(v / 1000).toFixed(0)}k`;
const formatUsd = (v: number) => `$${v.toLocaleString()}`;

export function RevenueChart({ points }: Props) {
  return (
    <Card className="gap-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Revenue</CardTitle>
        <Link
          href="/revenue"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          View revenue detail
        </Link>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[260px] w-full">
          <AreaChart data={points} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
            <CartesianGrid vertical={false} className="stroke-border/50" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs"
            />
            <YAxis
              yAxisId="ngn"
              orientation="left"
              tickFormatter={formatNgn}
              tickLine={false}
              axisLine={false}
              className="text-xs"
              width={50}
            />
            <YAxis
              yAxisId="usd"
              orientation="right"
              tickFormatter={formatUsd}
              tickLine={false}
              axisLine={false}
              className="text-xs"
              width={50}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area
              yAxisId="ngn"
              type="monotone"
              dataKey="ngn"
              stroke="var(--color-ngn)"
              fill="var(--color-ngn)"
              fillOpacity={0.18}
            />
            <Area
              yAxisId="usd"
              type="monotone"
              dataKey="usd"
              stroke="var(--color-usd)"
              fill="var(--color-usd)"
              fillOpacity={0.18}
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
