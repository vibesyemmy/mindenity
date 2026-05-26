import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { PlanCoverageItem } from "@/lib/dummy/types";

type Props = {
  items: PlanCoverageItem[];
};

export function PlanCoverageSpotlight({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <Card className="border-amber-500/40 bg-amber-50/60 dark:bg-amber-950/20">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Plans need therapist coverage</CardTitle>
        <Badge variant="secondary">{items.length}</Badge>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={`${item.plan}-${item.region}`}
              className="flex items-center justify-between text-sm"
            >
              <span>
                <span className="font-medium">{item.plan}</span>
                <span className="text-muted-foreground"> · {item.region}</span>
              </span>
              <span className="text-muted-foreground">
                {item.therapists} therapist{item.therapists === 1 ? "" : "s"} · need{" "}
                {item.gap} more
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link
          href="/plans/coverage"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Open coverage report →
        </Link>
      </CardFooter>
    </Card>
  );
}
