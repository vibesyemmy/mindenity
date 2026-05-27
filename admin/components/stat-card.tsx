import { TrendingDown, TrendingUp, Minus } from "lucide-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "flat";

const trendIcon: Record<Direction, typeof TrendingUp> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

const trendHeadline: Record<Direction, string> = {
  up: "Trending up",
  down: "Trending down",
  flat: "Holding steady",
};

export type StatCardProps = {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  delta?: { text: string; direction: Direction };
};

export function StatCard({ label, value, sub, delta }: StatCardProps) {
  const Icon = delta ? trendIcon[delta.direction] : null;
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription
          className={cn(delta && "flex items-center justify-between gap-2")}
        >
          <span>{label}</span>
          {delta && Icon && (
            <Badge variant="outline" className="shrink-0">
              <Icon className="size-3" />
              {delta.text}
            </Badge>
          )}
        </CardDescription>
        <CardTitle className="whitespace-nowrap text-2xl font-semibold tabular-nums @[300px]/card:text-3xl">
          {value}
        </CardTitle>
      </CardHeader>
      {(delta || sub) && (
        <CardFooter className="flex-col items-start gap-1 text-sm">
          {delta && Icon && (
            <div className="line-clamp-1 flex gap-2 font-medium">
              {trendHeadline[delta.direction]} <Icon className="size-4" />
            </div>
          )}
          {sub && <div className="text-muted-foreground">{sub}</div>}
        </CardFooter>
      )}
    </Card>
  );
}

type StatCardGridProps = {
  columns?: 2 | 3 | 4;
  className?: string;
  children: React.ReactNode;
};

const colsClass: Record<NonNullable<StatCardGridProps["columns"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
};

export function StatCardGrid({
  columns = 4,
  className,
  children,
}: StatCardGridProps) {
  return (
    <section
      className={cn(
        "grid grid-cols-1 gap-4",
        colsClass[columns],
        "*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card",
        className
      )}
    >
      {children}
    </section>
  );
}
