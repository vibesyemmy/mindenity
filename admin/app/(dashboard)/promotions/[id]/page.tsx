import { notFound } from "next/navigation";

import { PromoEditor } from "@/components/promotions/promo-editor";
import { getPromotion, getPromotions } from "@/lib/dummy/promotions";

export function generateStaticParams() {
  return getPromotions().map((p) => ({ id: p.id }));
}

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
