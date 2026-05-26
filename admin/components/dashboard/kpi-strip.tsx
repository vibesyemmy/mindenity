import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { KpiCard } from "@/lib/dummy/types";

type Props = {
  cards: KpiCard[];
};

const directionStyles: Record<KpiCard["deltaDirection"], string> = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-destructive",
  flat: "text-muted-foreground",
};

export function KpiStrip({ cards }: Props) {
  return (
    <section
      aria-label="Key performance indicators"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {cards.map((card) => (
        <Card key={card.id} className="gap-3 py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              {card.label}
            </p>
          </CardHeader>
          <CardContent className="px-5 space-y-1">
            <p className="font-heading text-2xl tabular-nums whitespace-pre-line leading-tight">
              {card.primary}
            </p>
            <p className="text-xs text-muted-foreground">{card.secondary}</p>
            <Badge
              variant="secondary"
              className={`mt-2 font-normal ${directionStyles[card.deltaDirection]}`}
            >
              {card.delta}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
