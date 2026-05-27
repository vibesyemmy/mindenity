"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  formatDate,
  getActiveOverrides,
  type TierOverride,
} from "@/lib/dummy/commission";

export function ActiveOverridesTable() {
  const overrides = getActiveOverrides();
  const [removeTarget, setRemoveTarget] = useState<TierOverride | null>(null);

  const handleRemove = () => {
    if (!removeTarget) return;
    toast.success(`Override removed for ${removeTarget.therapistName}`, {
      description: "Therapist's tier reverts to automatic calculation.",
    });
    setRemoveTarget(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Active overrides</CardTitle>
        <span className="text-xs text-muted-foreground">
          {overrides.length} active
        </span>
      </CardHeader>
      <CardContent>
        {overrides.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No active overrides. Therapists earn at their auto-calculated tier rate.
          </p>
        ) : (
          <div className="rounded-md border border-border/60 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Therapist</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Override</TableHead>
                  <TableHead>Applied by</TableHead>
                  <TableHead>Applied at</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {overrides.map((o) => (
                  <TableRow key={o.id}>
                    <TableCell>
                      <Link
                        href={`/therapists/${o.therapistId}`}
                        className="font-medium hover:underline"
                      >
                        {o.therapistName}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {o.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {o.type === "Tier" ? o.tier : `${o.customPct}%`}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {o.appliedBy}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {formatDate(o.appliedAt)}
                    </TableCell>
                    <TableCell className="text-sm tabular-nums">
                      {formatDate(o.expiresAt)}
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger className="text-sm text-left hover:underline">
                          {o.reason.length > 40
                            ? o.reason.slice(0, 37) + "…"
                            : o.reason}
                        </PopoverTrigger>
                        <PopoverContent className="text-sm max-w-sm">
                          {o.reason}
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setRemoveTarget(o)}
                      >
                        <Trash2 className="size-3.5 mr-1" />
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog
        open={removeTarget !== null}
        onOpenChange={(o) => !o && setRemoveTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove override?</DialogTitle>
            <DialogDescription>
              The therapist will immediately revert to their auto-calculated tier
              rate. This action is logged in the audit trail.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemoveTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemove}>
              Remove override
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
