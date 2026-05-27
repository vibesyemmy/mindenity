import Link from "next/link";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { DashboardData } from "@/lib/dummy/types";

type Props = {
  clinical: DashboardData["clinical"];
};

export function ClinicalSafetyZone({ clinical }: Props) {
  const { crisis, risk } = clinical;

  return (
    <Card>
      <Tabs defaultValue="crisis">
        <CardHeader>
          <CardDescription>Clinical safety</CardDescription>
          <CardTitle>Crisis and risk follow-up</CardTitle>
          <CardAction>
            <TabsList>
              <TabsTrigger value="crisis">Crisis (24h)</TabsTrigger>
              <TabsTrigger value="risk">Risk forms (7d)</TabsTrigger>
            </TabsList>
          </CardAction>
        </CardHeader>
        <CardContent>
          <TabsContent value="crisis" className="mt-0 space-y-3">
            <p className="text-sm">
              <span className="font-medium tabular-nums">
                {crisis.activeCount}
              </span>{" "}
              active ·{" "}
              <span className="font-medium tabular-nums">
                {crisis.avgResponse}
              </span>{" "}
              avg response ·{" "}
              <span className="font-medium tabular-nums">
                {crisis.escalations}
              </span>{" "}
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
                      <span className="text-muted-foreground">
                        {item.therapist}
                      </span>
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {item.loggedAgo} · {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <FooterLink href="/crisis">Open crisis log</FooterLink>
          </TabsContent>

          <TabsContent value="risk" className="mt-0 space-y-3">
            <p className="text-sm">
              <span className="font-medium tabular-nums">{risk.submitted}</span>{" "}
              submitted ·{" "}
              <span className="font-medium tabular-nums">{risk.redFlags}</span>{" "}
              red flags ·{" "}
              <span className="font-medium tabular-nums">
                {risk.followUpOverdue}
              </span>{" "}
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
            <FooterLink href="/risk-forms">Open risk queue</FooterLink>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-1 flex justify-end">
      <Button asChild variant="ghost" size="sm">
        <Link href={href}>{children} →</Link>
      </Button>
    </div>
  );
}
