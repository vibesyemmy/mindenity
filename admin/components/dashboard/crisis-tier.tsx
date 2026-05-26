import Link from "next/link";

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

  // Priority routing: crisis > verifications > pricing
  const href =
    crisisCount > 0
      ? "/crisis"
      : verificationsOverdue > 0
        ? "/therapists/verifications"
        : "/pricing-approvals";

  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-4 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3"
    >
      <p className="text-sm text-destructive">
        <span aria-hidden className="mr-1.5">
          🚨
        </span>
        {parts.join(" · ")}
      </p>
      <Button asChild size="sm" variant="destructive">
        <Link href={href}>Open</Link>
      </Button>
    </div>
  );
}
