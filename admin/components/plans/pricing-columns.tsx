"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { formatMoney, type PlanPricing } from "@/lib/dummy/plans";

const segmentVariant: Record<
  PlanPricing["segment"],
  "secondary" | "outline"
> = {
  Individual: "secondary",
  Couple: "outline",
  Family: "outline",
};

export function makePricingColumns(
  onEdit: (plan: PlanPricing) => void
): ColumnDef<PlanPricing>[] {
  return [
    {
      accessorKey: "planName",
      header: "Plan",
      cell: ({ row }) => {
        const p = row.original;
        return (
          <div className="space-y-1">
            <p className="font-medium">{p.planName}</p>
            <Badge variant={segmentVariant[p.segment]} className="font-normal">
              {p.segment}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "sessionsPerMonth",
      header: "Sessions/mo",
      cell: ({ row }) =>
        row.original.type === "PAYG" ? (
          <span className="text-muted-foreground">—</span>
        ) : (
          <span className="tabular-nums">{row.original.sessionsPerMonth}</span>
        ),
    },
    {
      accessorKey: "basePrice",
      header: "Base price",
      cell: ({ row }) => (
        <span className="tabular-nums font-medium">
          {formatMoney(row.original.basePrice, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: "minBand",
      header: "Min band",
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">
          {formatMoney(row.original.minBand, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: "maxBand",
      header: "Max band",
      cell: ({ row }) => (
        <span className="tabular-nums text-muted-foreground">
          {formatMoney(row.original.maxBand, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: "active",
      header: "Active",
      cell: ({ row }) =>
        row.original.active ? (
          <Badge variant="secondary" className="font-normal">
            Active
          </Badge>
        ) : (
          <Badge variant="outline" className="font-normal">
            Paused
          </Badge>
        ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button variant="ghost" size="sm" onClick={() => onEdit(row.original)}>
          Edit
        </Button>
      ),
    },
  ];
}
