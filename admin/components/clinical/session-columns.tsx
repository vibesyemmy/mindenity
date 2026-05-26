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

import type { Session } from "@/lib/dummy/clinical";

const riskVariant: Record<Session["riskLevel"], "secondary" | "outline" | "destructive"> = {
  green: "secondary",
  orange: "outline",
  red: "destructive",
};

const statusVariant: Record<Session["status"], "secondary" | "outline" | "destructive"> = {
  Completed: "secondary",
  Cancelled: "outline",
  "No-show": "destructive",
  "In progress": "outline",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export const sessionColumns: ColumnDef<Session>[] = [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <span className="tabular-nums text-sm">{formatDate(row.original.date)}</span>,
  },
  {
    id: "time",
    header: "Time",
    cell: ({ row }) => (
      <span className="tabular-nums text-sm text-muted-foreground">
        {formatTime(row.original.date)}
      </span>
    ),
  },
  {
    accessorKey: "clientAlias",
    header: "Client",
    cell: ({ row }) => (
      <Link
        href={`/clients/${row.original.clientId}`}
        className="text-sm font-medium hover:underline"
      >
        {row.original.clientAlias}
      </Link>
    ),
  },
  {
    accessorKey: "therapistName",
    header: "Therapist",
    cell: ({ row }) => (
      <Link
        href={`/therapists/${row.original.therapistId}`}
        className="text-sm hover:underline"
      >
        {row.original.therapistName}
      </Link>
    ),
  },
  {
    accessorKey: "plan",
    header: "Plan",
    cell: ({ row }) => (
      <Badge variant="secondary" className="font-normal">
        {row.original.plan}
      </Badge>
    ),
  },
  {
    accessorKey: "durationMin",
    header: "Duration",
    cell: ({ row }) => (
      <span className="text-sm tabular-nums">{row.original.durationMin}m</span>
    ),
  },
  {
    accessorKey: "format",
    header: "Format",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">{row.original.format}</span>
    ),
  },
  {
    accessorKey: "riskLevel",
    header: "Risk",
    cell: ({ row }) => (
      <Badge variant={riskVariant[row.original.riskLevel]} className="font-normal">
        {row.original.riskLevel}
      </Badge>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusVariant[row.original.status]}>{row.original.status}</Badge>
    ),
  },
  {
    id: "open",
    header: "",
    cell: () => (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex">
            <ChevronRight className="size-4 text-muted-foreground/40" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="left">Detail view not built</TooltipContent>
      </Tooltip>
    ),
  },
];
