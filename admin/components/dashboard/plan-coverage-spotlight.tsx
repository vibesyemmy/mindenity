import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import type { PlanCoverageItem } from "@/lib/dummy/types";

type Props = {
  items: PlanCoverageItem[];
};

export function PlanCoverageSpotlight({ items }: Props) {
  if (items.length === 0) return null;

  const summary = items
    .map((i) => `${i.plan} · ${i.region} (need ${i.gap} more)`)
    .join(" · ");

  return (
    <Alert className="border-amber-500/40 bg-amber-50/60 text-amber-900 dark:bg-amber-950/20 dark:text-amber-100 [&>svg]:text-amber-700 dark:[&>svg]:text-amber-300">
      <AlertTriangle />
      <AlertTitle>
        {items.length} plan{items.length === 1 ? "" : "s"} need therapist coverage
      </AlertTitle>
      <AlertDescription className="text-amber-900/80 dark:text-amber-100/80">
        {summary}
      </AlertDescription>
      <AlertAction>
        <Button asChild size="sm" variant="outline">
          <Link href="/plans/coverage">Open</Link>
        </Button>
      </AlertAction>
    </Alert>
  );
}
