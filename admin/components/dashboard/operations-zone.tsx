import Link from "next/link";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { DashboardData } from "@/lib/dummy/types";

type Props = {
  queues: DashboardData["queues"];
};

export function OperationsZone({ queues }: Props) {
  const { verifications, pricingApprovals } = queues;

  return (
    <Card>
      <Tabs defaultValue="verifications">
        <CardHeader>
          <CardDescription>Operations queues</CardDescription>
          <CardTitle>Things waiting on ops</CardTitle>
          <CardAction>
            <TabsList>
              <TabsTrigger value="verifications">
                Verifications
                <Badge variant="secondary" className="ml-1 font-normal">
                  {verifications.pending}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="pricing">
                Pricing
                {pricingApprovals.overdue > 0 ? (
                  <Badge variant="destructive" className="ml-1 font-normal">
                    {pricingApprovals.overdue}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="ml-1 font-normal">
                    {pricingApprovals.pending}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </CardAction>
        </CardHeader>
        <CardContent>
          <TabsContent value="verifications" className="mt-0">
            <VerificationsList items={verifications.items} />
            <FooterLink href="/therapists/verifications">
              Open verifications queue
            </FooterLink>
          </TabsContent>
          <TabsContent value="pricing" className="mt-0">
            <PricingList items={pricingApprovals.items} />
            <FooterLink href="/pricing-approvals">
              Open pricing approvals
            </FooterLink>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}

function VerificationsList({
  items,
}: {
  items: DashboardData["queues"]["verifications"]["items"];
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        All applications reviewed. Nice.
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {items.map((item) => (
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
  );
}

function PricingList({
  items,
}: {
  items: DashboardData["queues"]["pricingApprovals"]["items"];
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No pending pricing approvals.
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {items.map((item) => (
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
    <div className="mt-4 flex justify-end">
      <Button asChild variant="ghost" size="sm">
        <Link href={href}>{children} →</Link>
      </Button>
    </div>
  );
}
