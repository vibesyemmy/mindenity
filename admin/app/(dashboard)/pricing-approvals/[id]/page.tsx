import { notFound } from "next/navigation";

import { ApprovalReview } from "@/components/pricing-approvals/approval-review";
import { getApproval, getApprovals } from "@/lib/dummy/pricing-approvals";

export function generateStaticParams() {
  return getApprovals().map((a) => ({ id: a.id }));
}

type Params = Promise<{ id: string }>;

export default async function PricingApprovalReviewPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const request = getApproval(id);
  if (!request) notFound();

  return <ApprovalReview request={request} />;
}
