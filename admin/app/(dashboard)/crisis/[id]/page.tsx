import { notFound } from "next/navigation";

import { CrisisDetail } from "@/components/clinical/crisis-detail";
import { getCrisisEvent, getCrisisEvents } from "@/lib/dummy/clinical";

export function generateStaticParams() {
  return getCrisisEvents().map((c) => ({ id: c.id }));
}

type Params = Promise<{ id: string }>;

export default async function CrisisDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const crisis = getCrisisEvent(id);
  if (!crisis) notFound();

  return <CrisisDetail crisis={crisis} />;
}
