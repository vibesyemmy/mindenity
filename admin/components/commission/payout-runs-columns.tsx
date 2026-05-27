"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import {
  formatDate,
  formatMoney,
  type PayoutRun,
} from "@/lib/dummy/commission";

const statusVariant: Record<
  PayoutRun["status"],
  "secondary" | "outline" | "destructive" | "default"
> = {
  Scheduled: "outline",
  Processing: "default",
  Completed: "secondary",
  Failed: "destructive",
};

export const payoutRunsColumns: ColumnDef<PayoutRun>[] = [
  {
    accessorKey: "date",
    header: "Run date",
    cell: ({ row }) => (
      <span className="tabular-nums text-sm">{formatDate(row.original.date)}</span>
    ),
  },
  {
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal">
        {row.original.region}
      </Badge>
    ),
  },
  {
    accessorKey: "therapistsCount",
    header: "Therapists",
    cell: ({ row }) => (
      <span className="tabular-nums text-sm">{row.original.therapistsCount}</span>
    ),
  },
  {
    accessorKey: "totalNet",
    header: "Total payout",
    cell: ({ row }) => (
      <span className="tabular-nums font-medium">
        {formatMoney(row.original.totalNet, row.original.currency)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>
        {row.original.status}
      </Badge>
    ),
  },
  {
    id: "open",
    header: "",
    cell: ({ row }) => (
      <Link
        href={`/commission/payouts/${row.original.id}`}
        aria-label={`Open run ${row.original.id}`}
      >
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    ),
  },
];
