"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatRelative, type AuditEntry } from "@/lib/dummy/settings";

const actionVariant = (
  action: AuditEntry["action"]
): "secondary" | "destructive" | "outline" => {
  if (
    action.includes("rejected") ||
    action.includes("suspended") ||
    action.includes("deleted") ||
    action.includes("removed")
  )
    return "destructive";
  if (action.includes("approved") || action.includes("verified") || action.includes("fulfilled"))
    return "secondary";
  return "outline";
};

export const auditColumns: ColumnDef<AuditEntry>[] = [
  {
    accessorKey: "timestamp",
    header: "When",
    cell: ({ row }) => {
      const iso = row.original.timestamp;
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
    accessorKey: "adminName",
    header: "Admin",
    cell: ({ row }) => (
      <span className="text-sm font-medium">{row.original.adminName}</span>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <Badge variant={actionVariant(row.original.action)} className="font-normal">
        {row.original.action}
      </Badge>
    ),
  },
  {
    accessorKey: "target",
    header: "Target",
    cell: ({ row }) => (
      <span className="text-sm">{row.original.target}</span>
    ),
  },
  {
    accessorKey: "ip",
    header: "IP",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground tabular-nums">
        {row.original.ip}
      </span>
    ),
  },
  {
    id: "detail",
    header: "Detail",
    cell: ({ row }) => (
      <Popover>
        <PopoverTrigger className="text-xs text-muted-foreground hover:text-foreground hover:underline">
          View
        </PopoverTrigger>
        <PopoverContent className="text-sm max-w-md">
          {row.original.detail}
        </PopoverContent>
      </Popover>
    ),
  },
];
