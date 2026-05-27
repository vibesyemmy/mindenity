import { notFound } from "next/navigation";

import { PayoutRunDetail } from "@/components/commission/payout-run-detail";
import { getPayoutRun } from "@/lib/dummy/commission";

type Params = Promise<{ id: string }>;

export default async function PayoutRunDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const run = getPayoutRun(id);
  if (!run) notFound();

  return <PayoutRunDetail run={run} />;
}
