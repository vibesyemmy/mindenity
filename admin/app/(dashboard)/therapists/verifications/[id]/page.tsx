import { notFound } from "next/navigation";

import { ApplicationReview } from "@/components/therapists/application-review";
import { getVerification, getVerifications } from "@/lib/dummy/therapists";

export function generateStaticParams() {
  return getVerifications().map((v) => ({ id: v.id }));
}

type Params = Promise<{ id: string }>;

export default async function ApplicationReviewPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const application = getVerification(id);
  if (!application) notFound();

  return <ApplicationReview application={application} />;
}
