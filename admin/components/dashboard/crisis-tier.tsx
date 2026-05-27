import Link from "next/link";
import { AlertOctagon } from "lucide-react";

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

import type { CrisisTierState } from "@/lib/dummy/types";

type Props = {
  state: CrisisTierState;
};

export function CrisisTier({ state }: Props) {
  const { crisisCount, verificationsOverdue, pricingApprovalsOverdue } = state;
  const total = crisisCount + verificationsOverdue + pricingApprovalsOverdue;

  if (total === 0) return null;

  const parts: string[] = [];
  if (crisisCount > 0) parts.push(`${crisisCount} crisis alerts active`);
  if (verificationsOverdue > 0)
    parts.push(`${verificationsOverdue} verifications pending review`);
  if (pricingApprovalsOverdue > 0)
    parts.push(
      `${pricingApprovalsOverdue} pricing approval${
        pricingApprovalsOverdue === 1 ? "" : "s"
      } overdue`
    );

  const href =
    crisisCount > 0
      ? "/crisis"
      : verificationsOverdue > 0
        ? "/therapists/verifications"
        : "/pricing-approvals";

  const title =
    crisisCount > 0 ? "Crisis attention required" : "Queue items overdue";

  return (
    <Alert variant="destructive">
      <AlertOctagon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{parts.join(" · ")}</AlertDescription>
      <AlertAction>
        <Button asChild size="sm" variant="destructive">
          <Link href={href}>Open</Link>
        </Button>
      </AlertAction>
    </Alert>
  );
}
