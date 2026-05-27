"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  formatDate,
  formatDiscount,
  getPromotionStatus,
  type Promotion,
} from "@/lib/dummy/promotions";

const statusVariant: Record<
  ReturnType<typeof getPromotionStatus>,
  "secondary" | "outline" | "destructive" | "default"
> = {
  Scheduled: "outline",
  Active: "secondary",
  Ended: "destructive",
};

const regionVariant: Record<Promotion["region"], "outline"> = {
  NGN: "outline",
  USD: "outline",
  Both: "outline",
};

export const promoColumns: ColumnDef<Promotion>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <Link
        href={`/promotions/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    id: "discount",
    header: "Discount",
    cell: ({ row }) => (
      <span className="tabular-nums">{formatDiscount(row.original)}</span>
    ),
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => (
      <Badge variant={regionVariant[row.original.region]} className="font-normal">
        {row.original.region}
      </Badge>
    ),
  },
  {
    accessorKey: "applicablePlans",
    header: "Plans",
    cell: ({ row }) => {
      const plans = row.original.applicablePlans;
      return (
        <Popover>
          <PopoverTrigger className="text-sm hover:underline">
            {plans.length} plan{plans.length === 1 ? "" : "s"}
          </PopoverTrigger>
          <PopoverContent className="text-sm">
            <ul className="space-y-1">
              {plans.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: "startAt",
    header: "Starts",
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">{formatDate(row.original.startAt)}</span>
    ),
  },
  {
    accessorKey: "endAt",
    header: "Ends",
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-muted-foreground">
        {formatDate(row.original.endAt)}
      </span>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = getPromotionStatus(row.original);
      return <Badge variant={statusVariant[status]}>{status}</Badge>;
    },
  },
  {
    id: "edit",
    header: "",
    cell: ({ row }) => (
      <Button asChild variant="ghost" size="sm">
        <Link
          href={`/promotions/${row.original.id}`}
          aria-label={`Edit ${row.original.name}`}
        >
          <Pencil className="size-3.5 mr-1" />
          Edit
        </Link>
      </Button>
    ),
  },
];
