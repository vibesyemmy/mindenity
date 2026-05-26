"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

import type { VerificationApplication } from "@/lib/dummy/therapists";

const statusVariant: Record<
  VerificationApplication["status"],
  "secondary" | "outline" | "default"
> = {
  Pending: "default",
  "Info requested": "outline",
  "On hold": "secondary",
};

export const queueColumns: ColumnDef<VerificationApplication>[] = [
  {
    accessorKey: "name",
    header: "Applicant",
    cell: ({ row }) => {
      const v = row.original;
      return (
        <Link
          href={`/therapists/verifications/${v.id}`}
          className="flex items-center gap-3 hover:underline"
        >
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold"
          >
            {v.initials}
          </span>
          <span className="font-medium">{v.name}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: "country",
    header: "Country",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.country}</span>
    ),
  },
  {
    accessorKey: "specializations",
    header: "Specializations",
    cell: ({ row }) => {
      const specs = row.original.specializations;
      const visible = specs.slice(0, 2);
      const overflow = specs.length - visible.length;
      return (
        <div className="flex flex-wrap items-center gap-1">
          {visible.map((s) => (
            <Badge key={s} variant="outline" className="font-normal">
              {s}
            </Badge>
          ))}
          {overflow > 0 && (
            <Badge variant="outline" className="font-normal">
              +{overflow}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "submittedAgo",
    header: "Submitted",
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">{row.original.submittedAgo}</span>
    ),
  },
  {
    accessorKey: "aiFlag",
    header: "AI flag",
    cell: ({ row }) => {
      const v = row.original;
      const badge =
        v.aiFlag === "Flagged" ? (
          <Badge variant="destructive">Flagged</Badge>
        ) : (
          <Badge variant="secondary">Clean</Badge>
        );
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">{badge}</span>
          </TooltipTrigger>
          <TooltipContent side="top">{v.aiNote}</TooltipContent>
        </Tooltip>
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
        href={`/therapists/verifications/${row.original.id}`}
        aria-label={`Open ${row.original.name}`}
      >
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    ),
  },
];
