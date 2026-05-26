"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { Therapist } from "@/lib/dummy/therapists";

const tierVariant: Record<Therapist["tier"], "default" | "secondary" | "outline"> = {
  Standard: "outline",
  Senior: "secondary",
  Clinical: "default",
};

const statusVariant: Record<Therapist["status"], "secondary" | "destructive" | "outline"> = {
  Active: "secondary",
  Suspended: "destructive",
  "On leave": "outline",
};

function formatEarnings(e: Therapist["earnings30d"]): string {
  if (e.amount === 0) return "—";
  if (e.currency === "NGN") return `₦${(e.amount / 1000).toFixed(0)}k`;
  return `$${e.amount.toLocaleString()}`;
}

export const directoryColumns: ColumnDef<Therapist>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const t = row.original;
      return (
        <Link
          href={`/therapists/${t.id}`}
          className="flex items-center gap-3 hover:underline"
        >
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold"
          >
            {t.initials}
          </span>
          <span className="font-medium">{t.name}</span>
        </Link>
      );
    },
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
    accessorKey: "tier",
    header: "Tier",
    cell: ({ row }) => (
      <Badge variant={tierVariant[row.original.tier]}>
        {row.original.tier}
      </Badge>
    ),
  },
  {
    accessorKey: "plansAccepted",
    header: "Plans",
    cell: ({ row }) => {
      const plans = row.original.plansAccepted;
      if (plans.length === 0) return <span className="text-muted-foreground">—</span>;
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
    accessorKey: "sessions30d",
    header: "Sessions (30d)",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.sessions30d}</span>
    ),
  },
  {
    accessorKey: "earnings30d",
    header: "Earnings (30d)",
    cell: ({ row }) => (
      <span className="tabular-nums">{formatEarnings(row.original.earnings30d)}</span>
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
        href={`/therapists/${row.original.id}`}
        aria-label={`Open ${row.original.name}`}
      >
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    ),
  },
];
