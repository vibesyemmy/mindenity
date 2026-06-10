import { notFound } from "next/navigation";

import { TherapistDetail } from "@/components/therapists/therapist-detail";
import { getTherapist, getTherapists } from "@/lib/dummy/therapists";

export function generateStaticParams() {
  return getTherapists().map((t) => ({ id: t.id }));
}

type Params = Promise<{ id: string }>;

export default async function TherapistDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const therapist = getTherapist(id);
  if (!therapist) notFound();

  return <TherapistDetail therapist={therapist} />;
}
