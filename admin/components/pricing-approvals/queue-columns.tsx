"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  deltaFromBand,
  formatMoney,
  formatRelative,
  type PricingRequest,
} from "@/lib/dummy/pricing-approvals";

const statusVariant: Record<
  PricingRequest["status"],
  "secondary" | "outline" | "destructive" | "default"
> = {
  Pending: "default",
  Approved: "secondary",
  Rejected: "destructive",
  Countered: "outline",
};

const segmentVariant: Record<
  PricingRequest["planSegment"],
  "secondary" | "outline"
> = {
  Individual: "secondary",
  Couple: "outline",
  Family: "outline",
};

export const queueColumns: ColumnDef<PricingRequest>[] = [
  {
    accessorKey: "submittedAt",
    header: "Submitted",
    cell: ({ row }) => {
      const iso = row.original.submittedAt;
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm tabular-nums">{formatRelative(iso)}</span>
          </TooltipTrigger>
          <TooltipContent side="top">
            {new Date(iso).toLocaleString("en-GB")}
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "therapistName",
    header: "Therapist",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <Link
          href={`/therapists/${r.therapistId}`}
          className="flex flex-col gap-0.5 hover:underline"
        >
          <span className="text-sm font-medium">{r.therapistName}</span>
          <span className="text-xs text-muted-foreground">{r.therapistTier}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: "planName",
    header: "Plan",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{r.planName}</span>
          <Badge variant={segmentVariant[r.planSegment]} className="font-normal w-fit">
            {r.planSegment}
          </Badge>
        </div>
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
    accessorKey: "proposedPrice",
    header: "Their price",
    cell: ({ row }) => (
      <span className="tabular-nums font-medium">
        {formatMoney(row.original.proposedPrice, row.original.currency)}
      </span>
    ),
  },
  {
    id: "band",
    header: "Band",
    cell: ({ row }) => {
      const r = row.original;
      return (
        <span className="tabular-nums text-xs text-muted-foreground">
          {formatMoney(r.minBand, r.currency)} – {formatMoney(r.maxBand, r.currency)}
        </span>
      );
    },
  },
  {
    id: "delta",
    header: "Δ from band",
    cell: ({ row }) => {
      const d = deltaFromBand(row.original);
      const variant: "destructive" | "outline" | "secondary" =
        d.direction === "over_max" || d.direction === "under_min"
          ? "destructive"
          : "secondary";
      return (
        <Badge variant={variant} className="font-normal">
          {d.label}
        </Badge>
      );
    },
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
        href={`/pricing-approvals/${row.original.id}`}
        aria-label={`Open request ${row.original.id}`}
      >
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    ),
  },
];
