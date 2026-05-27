import { TrendingDown, TrendingUp, Minus } from "lucide-react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { KpiCard } from "@/lib/dummy/types";

type Props = {
  cards: KpiCard[];
};

const trendCopy: Record<
  KpiCard["deltaDirection"],
  { headline: string; Icon: typeof TrendingUp }
> = {
  up: { headline: "Trending up vs last period", Icon: TrendingUp },
  down: { headline: "Trending down vs last period", Icon: TrendingDown },
  flat: { headline: "Holding steady", Icon: Minus },
};

export function KpiStrip({ cards }: Props) {
  return (
    <section
      aria-label="Key performance indicators"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card"
    >
      {cards.map((card) => {
        const { headline, Icon } = trendCopy[card.deltaDirection];
        return (
          <Card key={card.id} className="@container/card">
            <CardHeader>
              <CardDescription className="flex items-center justify-between gap-2">
                <span>{card.label}</span>
                <Badge variant="outline" className="shrink-0">
                  <Icon className="size-3" />
                  {card.delta}
                </Badge>
              </CardDescription>
              <CardTitle className="whitespace-nowrap text-2xl font-semibold tabular-nums @[300px]/card:text-3xl">
                {card.primary}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {headline} <Icon className="size-4" />
              </div>
              <div className="text-muted-foreground">{card.secondary}</div>
            </CardFooter>
          </Card>
        );
      })}
    </section>
  );
}
