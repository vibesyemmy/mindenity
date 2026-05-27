"use client";

import { Pencil } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";

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
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold"
            >
              {a.initials}
            </span>
            <span className="font-medium">{a.name}</span>
          </div>
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
      id: "edit",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            toast.info(`Role-change dialog for ${row.original.name}`, {
              description: "Not built in prototype — would change role here.",
            })
          }
        >
          <Pencil className="size-3.5 mr-1" />
          Edit
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
