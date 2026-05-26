import { notFound } from "next/navigation";

import { CrisisDetail } from "@/components/clinical/crisis-detail";
import { getCrisisEvent } from "@/lib/dummy/clinical";

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
