import { notFound } from "next/navigation";

import { ApprovalReview } from "@/components/pricing-approvals/approval-review";
import { getApproval } from "@/lib/dummy/pricing-approvals";

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
