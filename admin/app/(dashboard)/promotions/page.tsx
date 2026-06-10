import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/therapists/data-table";

import { promoColumns } from "@/components/promotions/promo-columns";
import { PromoFilters } from "@/components/promotions/promo-filters";

import {
  getPromotions,
  getPromotionStats,
  type PromoFilters as PromoFilterShape,
} from "@/lib/dummy/promotions";

export const dynamic = "force-static";

type SearchParams = Promise<{
  status?: string;
  region?: string;
}>;

function asFilters(p: Awaited<SearchParams>): PromoFilterShape {
  return {
    status: (p.status as PromoFilterShape["status"]) ?? "all",
    region: p.region as PromoFilterShape["region"],
  };
}

export default async function PromotionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const promos = getPromotions(filters);
  const stats = getPromotionStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Promotions</h1>
          <p className="text-sm text-muted-foreground">
            {stats.active} active · {stats.scheduled} scheduled · {stats.ended} ended
          </p>
        </div>
        <Button asChild>
          <Link href="/promotions/new">
            <Plus className="size-4 mr-1" />
            New promotion
          </Link>
        </Button>
      </header>

      <PromoFilters />

      <DataTable
        columns={promoColumns}
        data={promos}
        emptyMessage="No promotions in this view."
      />
    </div>
  );
}
