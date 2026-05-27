"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  getCapabilities,
  type AdminRole,
} from "@/lib/dummy/settings";

const ROLES: AdminRole[] = ["Admin", "Super Admin", "Read-only"];

type CellKey = string; // `${capId}|${role}`

function keyOf(capId: string, role: AdminRole): CellKey {
  return `${capId}|${role}`;
}

export function RoleMatrix() {
  const capabilities = getCapabilities();
  const [enabled, setEnabled] = useState<Record<CellKey, boolean>>(() => {
    const next: Record<CellKey, boolean> = {};
    for (const cap of capabilities) {
      for (const role of ROLES) {
        next[keyOf(cap.id, role)] = cap.defaults[role];
      }
    }
    return next;
  });

  const toggle = (capId: string, role: AdminRole) => {
    // Super Admin always retains all permissions.
    if (role === "Super Admin") return;
    setEnabled((prev) => ({
      ...prev,
      [keyOf(capId, role)]: !prev[keyOf(capId, role)],
    }));
  };

  const handleSave = () => {
    const changed = capabilities
      .flatMap((cap) =>
        ROLES.map((role) => ({
          key: keyOf(cap.id, role),
          isDefault: cap.defaults[role],
        }))
      )
      .filter((c) => enabled[c.key] !== c.isDefault).length;
    if (changed === 0) {
      toast.info("No changes to save");
      return;
    }
    toast.success("Role permissions updated", {
      description: `${changed} cell${changed === 1 ? "" : "s"} changed · applies on next login per admin.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 rounded-md border border-border/60 bg-muted/40 px-4 py-3">
        <Info className="size-4 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Permission changes apply on next login for each admin. Super Admins
          always retain all permissions.
        </p>
      </div>

      <div className="rounded-md border border-border/60 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-card z-10">Capability</TableHead>
              {ROLES.map((role) => (
                <TableHead key={role} className="text-center">
                  {role}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {capabilities.map((cap) => (
              <TableRow key={cap.id}>
                <TableCell className="sticky left-0 bg-card z-10 align-top">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="font-medium cursor-help underline decoration-dotted underline-offset-4">
                        {cap.label}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="max-w-xs">
                      {cap.description}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                {ROLES.map((role) => {
                  const key = keyOf(cap.id, role);
                  const isSuperAdmin = role === "Super Admin";
                  return (
                    <TableCell key={role} className="text-center">
                      <Switch
                        checked={isSuperAdmin ? true : enabled[key]}
                        onCheckedChange={() => toggle(cap.id, role)}
                        disabled={isSuperAdmin}
                        aria-label={`${cap.label} · ${role}`}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save changes</Button>
      </div>
    </div>
  );
}
