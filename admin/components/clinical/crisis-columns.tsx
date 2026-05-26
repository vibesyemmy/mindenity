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

import { formatRelative, formatResponseTime } from "@/lib/dummy/clinical";
import type { CrisisEvent } from "@/lib/dummy/clinical";

const statusVariant: Record<
  CrisisEvent["status"],
  "secondary" | "outline" | "destructive"
> = {
  Active: "destructive",
  Responded: "outline",
  Escalated: "destructive",
  Resolved: "secondary",
};

export const crisisColumns: ColumnDef<CrisisEvent>[] = [
  {
    accessorKey: "triggeredAt",
    header: "Triggered",
    cell: ({ row }) => {
      const iso = row.original.triggeredAt;
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
    cell: ({ row }) => {
      const c = row.original;
      if (!c.therapistId) {
        return (
          <span className="text-sm text-muted-foreground italic">
            Escalated to next available
          </span>
        );
      }
      return (
        <Link
          href={`/therapists/${c.therapistId}`}
          className="text-sm hover:underline"
        >
          {c.therapistName}
        </Link>
      );
    },
  },
  {
    accessorKey: "responseTimeSec",
    header: "Response time",
    cell: ({ row }) => {
      const t = row.original.responseTimeSec;
      if (t == null) return <span className="text-sm text-destructive">Not responded</span>;
      return <span className="text-sm tabular-nums">{formatResponseTime(t)}</span>;
    },
  },
  {
    id: "escalation",
    header: "Escalation",
    cell: ({ row }) => {
      if (row.original.status === "Escalated") {
        return <Badge variant="destructive" className="font-normal">Escalated to admin</Badge>;
      }
      return <span className="text-sm text-muted-foreground">None</span>;
    },
  },
  {
    accessorKey: "localEmergencyLine",
    header: "Local emergency",
    cell: ({ row }) => {
      const c = row.original;
      if (c.region === "NG") return <span className="text-sm text-muted-foreground">—</span>;
      return <span className="text-sm">{c.localEmergencyLine}</span>;
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
        href={`/crisis/${row.original.id}`}
        aria-label={`Open crisis ${row.original.id}`}
      >
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    ),
  },
];
