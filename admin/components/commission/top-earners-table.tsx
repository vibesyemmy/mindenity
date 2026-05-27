"use client";

import Link from "next/link";

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
  formatMoney,
  getTopEarners,
  type Region,
} from "@/lib/dummy/commission";

type Props = {
  region?: Region;
};

export function TopEarnersTable({ region }: Props) {
  const rows = getTopEarners(region);

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No earners in this view.
      </p>
    );
  }

  return (
    <div className="rounded-md border border-border/60 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Therapist</TableHead>
            <TableHead>Tier</TableHead>
            <TableHead>Sessions (mo)</TableHead>
            <TableHead>Gross</TableHead>
            <TableHead>Therapist share</TableHead>
            <TableHead>Platform fee</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={`${r.region}-${r.rank}-${r.therapistId}`}>
              <TableCell className="tabular-nums font-medium">{r.rank}</TableCell>
              <TableCell>
                <Link
                  href={`/therapists/${r.therapistId}`}
                  className="hover:underline"
                >
                  {r.therapistName}
                </Link>
                <span className="text-xs text-muted-foreground ml-1.5">
                  ({r.region})
                </span>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal">
                  {r.tier}
                </Badge>
              </TableCell>
              <TableCell className="tabular-nums">{r.sessionsMonth}</TableCell>
              <TableCell className="tabular-nums">
                {formatMoney(r.gross, r.currency)}
              </TableCell>
              <TableCell className="tabular-nums font-medium">
                {formatMoney(r.share, r.currency)}
              </TableCell>
              <TableCell className="tabular-nums text-muted-foreground">
                {formatMoney(r.platformFee, r.currency)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
