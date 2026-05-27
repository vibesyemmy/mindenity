import { notFound } from "next/navigation";

import { RiskFormDetail } from "@/components/clinical/risk-form-detail";
import { getRiskForm } from "@/lib/dummy/clinical";

type Params = Promise<{ id: string }>;

export default async function RiskFormDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const riskForm = getRiskForm(id);
  if (!riskForm) notFound();

  return <RiskFormDetail riskForm={riskForm} />;
}
