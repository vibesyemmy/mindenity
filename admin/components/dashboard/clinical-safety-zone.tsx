import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { DashboardData } from "@/lib/dummy/types";

type Props = {
  clinical: DashboardData["clinical"];
};

export function ClinicalSafetyZone({ clinical }: Props) {
  const { crisis, risk } = clinical;

  return (
    <section
      aria-label="Clinical safety"
      className="grid grid-cols-1 gap-4 lg:grid-cols-2"
    >
      <Card>
        <CardHeader>
          <CardTitle>Crisis activity (24h)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            <span className="font-medium tabular-nums">{crisis.activeCount}</span>{" "}
            active ·{" "}
            <span className="font-medium tabular-nums">{crisis.avgResponse}</span>{" "}
            avg response ·{" "}
            <span className="font-medium tabular-nums">{crisis.escalations}</span>{" "}
            escalations
          </p>
          {crisis.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No crisis alerts in the last 24h.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {crisis.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {item.clientAlias} ·{" "}
                    <span className="text-muted-foreground">{item.therapist}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.loggedAgo} · {item.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter>
          <Link
            href="/crisis"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Open crisis log →
          </Link>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk forms (7d)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            <span className="font-medium tabular-nums">{risk.submitted}</span>{" "}
            submitted ·{" "}
            <span className="font-medium tabular-nums">{risk.redFlags}</span> red
            flags ·{" "}
            <span className="font-medium tabular-nums">{risk.followUpOverdue}</span>{" "}
            follow-up overdue
          </p>
          {risk.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No red-flag risk forms this week.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {risk.items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span>
                    {item.clientAlias} ·{" "}
                    <span className="text-muted-foreground">
                      {item.therapist} · {item.region}
                    </span>
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {item.followUpDue}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
        <CardFooter>
          <Link
            href="/risk-forms"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Open risk queue →
          </Link>
        </CardFooter>
      </Card>
    </section>
  );
}
