import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  formatMoney,
  type PayoutRun,
} from "@/lib/dummy/commission";

const runStatusVariant: Record<
  PayoutRun["status"],
  "secondary" | "outline" | "destructive" | "default"
> = {
  Scheduled: "outline",
  Processing: "default",
  Completed: "secondary",
  Failed: "destructive",
};

const itemStatusVariant: Record<
  "Paid" | "Pending" | "Failed",
  "secondary" | "outline" | "destructive"
> = {
  Paid: "secondary",
  Pending: "outline",
  Failed: "destructive",
};

type Props = {
  run: PayoutRun;
};

export function PayoutRunDetail({ run }: Props) {
  return (
    <div className="space-y-6">
      <Link
        href="/commission/payouts"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Payout runs
      </Link>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            Payout run · {formatDate(run.date)}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Badge variant={runStatusVariant[run.status]}>{run.status}</Badge>
            <Badge variant="outline" className="font-normal">
              {run.region}
            </Badge>
            <span className="text-muted-foreground">
              Triggered by {run.triggeredBy}
            </span>
          </div>
        </div>
        <Button variant="outline" disabled>
          Export CSV
        </Button>
      </header>

      <section
        aria-label="Summary"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {[
          { label: "Therapists", value: run.therapistsCount.toString() },
          { label: "Total gross", value: formatMoney(run.totalGross, run.currency) },
          { label: "Total platform fee", value: formatMoney(run.totalPlatformFee, run.currency) },
          { label: "Total payout", value: formatMoney(run.totalNet, run.currency) },
        ].map((s) => (
          <Card key={s.label} className="gap-1 py-4">
            <CardHeader className="p-0 px-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {s.label}
              </p>
            </CardHeader>
            <CardContent className="px-5">
              <p className="font-heading text-xl tabular-nums">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Itemised therapists</CardTitle>
        </CardHeader>
        <CardContent>
          {run.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No items yet — run hasn&apos;t executed.
            </p>
          ) : (
            <div className="rounded-md border border-border/60 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Therapist</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Gross</TableHead>
                    <TableHead>Commission %</TableHead>
                    <TableHead>Platform fee</TableHead>
                    <TableHead>Net payout</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {run.items.map((item) => (
                    <TableRow key={item.therapistId}>
                      <TableCell>
                        <Link
                          href={`/therapists/${item.therapistId}`}
                          className="hover:underline"
                        >
                          {item.therapistName}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {item.tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {item.sessions}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {formatMoney(item.gross, run.currency)}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {item.commissionPct}%
                      </TableCell>
                      <TableCell className="tabular-nums text-muted-foreground">
                        {formatMoney(item.platformFee, run.currency)}
                      </TableCell>
                      <TableCell className="tabular-nums font-medium">
                        {formatMoney(item.net, run.currency)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={itemStatusVariant[item.status]}>
                          {item.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {run.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Run notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            {run.notes}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
