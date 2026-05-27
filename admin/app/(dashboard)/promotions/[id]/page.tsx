import { notFound } from "next/navigation";

import { PromoEditor } from "@/components/promotions/promo-editor";
import { getPromotion } from "@/lib/dummy/promotions";

type Params = Promise<{ id: string }>;

export default async function EditPromotionPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const promotion = getPromotion(id);
  if (!promotion) notFound();

  return <PromoEditor promotion={promotion} />;
}
