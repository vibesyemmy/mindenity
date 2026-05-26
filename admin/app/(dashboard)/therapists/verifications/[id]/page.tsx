import { notFound } from "next/navigation";

import { ApplicationReview } from "@/components/therapists/application-review";
import { getVerification } from "@/lib/dummy/therapists";

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
