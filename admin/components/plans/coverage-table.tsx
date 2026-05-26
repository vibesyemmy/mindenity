"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getCoverageByPlan,
  type PlanCoverage,
} from "@/lib/dummy/plans";

type Props = {
  region?: "NG" | "Int'l";
};

export function CoverageTable({ region }: Props) {
  const all = getCoverageByPlan(region);
  const low = all.filter((c) => c.gap < 0);

  if (low.length === 0) {
    return (
      <div className="rounded-md border border-border/60 px-4 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          All plans have ≥3 therapists per region. Healthy supply.
        </p>
      </div>
    );
  }

  const handleNudge = (row: PlanCoverage) => {
    toast.info("Bulk notify not built", {
      description: `Outreach for ${row.plan} (${row.region}) is currently handled by ops manually.`,
    });
  };

  return (
    <div className="rounded-md border border-border/60 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plan</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Current therapists</TableHead>
            <TableHead>Gap to threshold (3)</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {low.map((c) => (
            <TableRow key={`${c.plan}-${c.region}`}>
              <TableCell className="font-medium">{c.plan}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {c.region}
                </Badge>
              </TableCell>
              <TableCell className="tabular-nums">{c.therapists}</TableCell>
              <TableCell>
                <Badge variant="destructive" className="font-normal">
                  Need {Math.abs(c.gap)} more
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleNudge(c)}
                  disabled
                >
                  Send onboarding nudge
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
