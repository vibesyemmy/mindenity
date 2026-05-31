"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { formatRelative, type AdminUser } from "@/lib/dummy/settings";

const roleVariant: Record<
  AdminUser["role"],
  "default" | "secondary" | "outline"
> = {
  "Super Admin": "default",
  Admin: "secondary",
  "Read-only": "outline",
};

const statusVariant: Record<
  AdminUser["status"],
  "secondary" | "destructive" | "outline"
> = {
  Active: "secondary",
  Suspended: "destructive",
  Invited: "outline",
};

export function makeAdminColumns(
  onDeactivate: (u: AdminUser) => void
): ColumnDef<AdminUser>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const a = row.original;
        return (
          <Link
            href={`/settings/admins/${a.id}`}
            className="flex items-center gap-3 hover:underline"
          >
            <span
              aria-hidden
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold"
            >
              {a.initials}
            </span>
            <span className="font-medium">{a.name}</span>
          </Link>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant={roleVariant[row.original.role]}>
          {row.original.role}
        </Badge>
      ),
    },
    {
      accessorKey: "lastActiveAt",
      header: "Last active",
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-muted-foreground">
          {formatRelative(row.original.lastActiveAt)}
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
        <Button asChild variant="ghost" size="icon" className="size-7">
          <Link
            href={`/settings/admins/${row.original.id}`}
            aria-label={`Open profile for ${row.original.name}`}
          >
            <ChevronRight className="size-4 text-muted-foreground" />
          </Link>
        </Button>
      ),
    },
    {
      id: "deactivate",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          disabled={row.original.status !== "Active"}
          onClick={() => onDeactivate(row.original)}
        >
          Deactivate
        </Button>
      ),
    },
  ];
}
