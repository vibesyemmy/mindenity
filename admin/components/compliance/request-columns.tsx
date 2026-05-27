"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  formatCountdown,
  formatRelative,
  getSubjectHref,
  type SubjectRequest,
} from "@/lib/dummy/compliance";

const statusVariant: Record<
  SubjectRequest["status"],
  "secondary" | "outline" | "destructive" | "default"
> = {
  Pending: "default",
  "In progress": "outline",
  Fulfilled: "secondary",
  Rejected: "destructive",
};

const typeVariant: Record<
  SubjectRequest["type"],
  "secondary" | "destructive"
> = {
  Export: "secondary",
  Delete: "destructive",
};

const regulationVariant: Record<
  SubjectRequest["regulation"],
  "outline"
> = {
  NDPR: "outline",
  GDPR: "outline",
};

export function makeRequestColumns(
  onOpen: (req: SubjectRequest) => void
): ColumnDef<SubjectRequest>[] {
  return [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <Badge variant={typeVariant[row.original.type]} className="font-normal">
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: "subjectAlias",
      header: "Subject",
      cell: ({ row }) => {
        const r = row.original;
        return (
          <Link
            href={getSubjectHref(r)}
            className="flex flex-col hover:underline"
          >
            <span className="text-sm font-medium">{r.subjectAlias}</span>
            <span className="text-xs text-muted-foreground">
              {r.subjectName} · {r.subjectType}
            </span>
          </Link>
        );
      },
    },
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
      accessorKey: "dueBy",
      header: "Due by",
      cell: ({ row }) => {
        const cd = formatCountdown(row.original.dueBy);
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
      accessorKey: "regulation",
      header: "Regulation",
      cell: ({ row }) => (
        <Badge variant={regulationVariant[row.original.regulation]} className="font-normal">
          {row.original.regulation}
        </Badge>
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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpen(row.original)}
          aria-label={`Open request ${row.original.id}`}
        >
          Open
          <ChevronRight className="size-3.5 ml-1" />
        </Button>
      ),
    },
  ];
}
