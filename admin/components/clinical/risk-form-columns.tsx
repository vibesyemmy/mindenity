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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { formatRelative, formatCountdown } from "@/lib/dummy/clinical";
import type { RiskForm } from "@/lib/dummy/clinical";

const levelVariant: Record<RiskForm["level"], "secondary" | "outline" | "destructive"> = {
  green: "secondary",
  orange: "outline",
  red: "destructive",
};

const statusVariant: Record<RiskForm["status"], "secondary" | "outline" | "destructive"> = {
  Open: "destructive",
  "In follow-up": "outline",
  Resolved: "secondary",
  Escalated: "destructive",
};

const verifyVariant: Record<
  RiskForm["emergencyVerify"],
  "secondary" | "outline" | "destructive"
> = {
  verified: "secondary",
  pending: "destructive",
  "n/a": "outline",
};

export const riskFormColumns: ColumnDef<RiskForm>[] = [
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
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => (
      <span className="text-sm">
        <Badge variant="outline" className="font-normal">
          {row.original.region}
        </Badge>{" "}
        <span className="text-muted-foreground">{row.original.country}</span>
      </span>
    ),
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => (
      <Badge variant={levelVariant[row.original.level]} className="font-normal">
        {row.original.level}
      </Badge>
    ),
  },
  {
    accessorKey: "actionPlan",
    header: "Action plan",
    cell: ({ row }) => {
      const plan = row.original.actionPlan;
      const truncated = plan.length > 60 ? plan.slice(0, 57) + "…" : plan;
      return (
        <Popover>
          <PopoverTrigger className="text-sm text-left hover:underline">
            {truncated}
          </PopoverTrigger>
          <PopoverContent className="text-sm max-w-sm">{plan}</PopoverContent>
        </Popover>
      );
    },
  },
  {
    accessorKey: "followUpDueAt",
    header: "Follow-up",
    cell: ({ row }) => {
      const cd = formatCountdown(row.original.followUpDueAt);
      return (
        <span
          className={`text-sm tabular-nums ${cd.overdue ? "text-destructive font-medium" : "text-muted-foreground"}`}
        >
          {cd.text}
        </span>
      );
    },
  },
  {
    accessorKey: "emergencyVerify",
    header: "Emergency verified",
    cell: ({ row }) => {
      const v = row.original.emergencyVerify;
      const label = v === "verified" ? "Verified" : v === "pending" ? "Pending" : "N/A";
      return (
        <Badge variant={verifyVariant[v]} className="font-normal">
          {label}
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
