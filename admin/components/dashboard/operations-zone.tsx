import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import type { DashboardData } from "@/lib/dummy/types";

type Props = {
  queues: DashboardData["queues"];
};

export function OperationsZone({ queues }: Props) {
  return (
    <section
      aria-label="Operations queues"
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Verifications waiting</CardTitle>
          <Badge variant="secondary">{queues.verifications.pending} pending</Badge>
        </CardHeader>
        <CardContent>
          {queues.verifications.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              All applications reviewed. Nice.
            </p>
          ) : (
            <ul className="space-y-2">
              {queues.verifications.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">
                    {item.country} · {item.submittedAgo}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter>
          <Link
            href="/therapists/verifications"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Open queue →
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pricing approvals</CardTitle>
          <div className="flex items-center gap-2">
            {queues.pricingApprovals.pending > 0 && (
              <Badge variant="secondary">
                {queues.pricingApprovals.pending} pending
              </Badge>
            )}
            {queues.pricingApprovals.overdue > 0 && (
              <Badge variant="destructive">
                {queues.pricingApprovals.overdue} overdue
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {queues.pricingApprovals.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No pending pricing approvals.
            </p>
          ) : (
            <ul className="space-y-2">
              {queues.pricingApprovals.items.map((item) => (
                <li key={item.id} className="text-sm space-y-0.5">
                  <p>
                    <span className="font-medium">{item.therapist}</span>
                    <span className="text-muted-foreground"> · {item.plan}</span>
                  </p>
                  <p
                    className={
                      item.isOverdue
                        ? "text-xs text-destructive"
                        : "text-xs text-muted-foreground"
                    }
                  >
                    {item.deltaFromBand} · {item.submittedAgo}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter>
          <Link
            href="/pricing-approvals"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Open queue →
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
