import { notFound } from "next/navigation";

import { PayoutRunDetail } from "@/components/commission/payout-run-detail";
import { getPayoutRun, getPayoutRuns } from "@/lib/dummy/commission";

export function generateStaticParams() {
  return getPayoutRuns().map((r) => ({ id: r.id }));
}

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
