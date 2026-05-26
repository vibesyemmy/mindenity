"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import type { Client } from "@/lib/dummy/clients";

const statusVariant: Record<
  Client["status"],
  "secondary" | "destructive" | "outline"
> = {
  Active: "secondary",
  "Past-due": "destructive",
  Cancelled: "outline",
  Lapsed: "outline",
};

function formatMoney(amount: number, currency: "NGN" | "USD"): string {
  if (currency === "NGN") {
    if (amount >= 100_000_00) return `₦${(amount / 100 / 1000).toFixed(0)}k`;
    return `₦${(amount / 100).toLocaleString()}`;
  }
  return `$${(amount / 100).toLocaleString()}`;
}

function sessionsUsedDisplay(c: Client): string {
  if (c.plan.type === "PAYG") return `${c.sessionsUsedThisCycle} done`;
  return `${c.sessionsUsedThisCycle}/${c.plan.sessionsPerMonth}`;
}

export const clientListColumns: ColumnDef<Client>[] = [
  {
    accessorKey: "alias",
    header: "Alias",
    cell: ({ row }) => {
      const c = row.original;
      return (
        <Link
          href={`/clients/${c.id}`}
          className="flex items-center gap-3 hover:underline"
        >
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold"
          >
            {c.initials}
          </span>
          <span className="flex flex-col">
            <span className="font-medium">{c.alias}</span>
            <span className="text-xs text-muted-foreground">{c.name}</span>
          </span>
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.email}</span>
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
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-normal">
        {row.original.plan.name}
      </Badge>
    ),
  },
  {
    id: "sessionsUsed",
    header: "Sessions used",
    cell: ({ row }) => (
      <span className="tabular-nums text-sm">{sessionsUsedDisplay(row.original)}</span>
    ),
  },
  {
    accessorKey: "lastSessionAgo",
    header: "Last session",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground tabular-nums">
        {row.original.lastSessionAgo ?? "—"}
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
        href={`/clients/${row.original.id}`}
        aria-label={`Open ${row.original.alias}`}
      >
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    ),
  },
];

export { formatMoney };
