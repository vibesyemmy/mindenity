import Link from "next/link";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { Therapist } from "@/lib/dummy/therapists";
import { getPricingByRegion, formatMoney as fmtPlanMoney } from "@/lib/dummy/plans";
import { getSessions, getRiskForms } from "@/lib/dummy/clinical";
import {
  getEarningsByTherapist,
  formatMoney as fmtMoney,
  formatDate,
} from "@/lib/dummy/commission";
import { getAuditEntriesByTarget, formatRelative as fmtRelative } from "@/lib/dummy/settings";
import { StatCard, StatCardGrid } from "@/components/stat-card";

type Props = {
  therapist: Therapist;
};

const riskVariant = {
  green: "secondary",
  orange: "outline",
  red: "destructive",
} as const;

// ─── Plans & pricing tab ─────────────────────────────────────────────────

export function PlansPricingTab({ therapist }: Props) {
  const accepted = therapist.plansAccepted;
  const region = therapist.region;
  const pricing = getPricingByRegion(region);
  const acceptedPricing = pricing.filter((p) => accepted.includes(p.planName));
  const notAccepted = pricing.filter((p) => !accepted.includes(p.planName));

  if (accepted.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plans &amp; pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {therapist.name} has not accepted any plans yet.
            {therapist.status === "Suspended"
              ? " (Plans removed on suspension.)"
              : ""}
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/plans">Open Plans &amp; pricing →</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            Accepted plans · {accepted.length} of {pricing.length}
          </CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/plans">Edit pricing →</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border/60 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Therapist&apos;s price</TableHead>
                  <TableHead>Band</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {acceptedPricing.map((p) => (
                  <TableRow key={p.planName}>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{p.planName}</span>
                        <Badge variant="outline" className="font-normal w-fit">
                          {p.segment}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {p.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="tabular-nums font-medium">
                      {fmtPlanMoney(p.basePrice, p.currency)}
                    </TableCell>
                    <TableCell className="tabular-nums text-xs text-muted-foreground">
                      {fmtPlanMoney(p.minBand, p.currency)} – {fmtPlanMoney(p.maxBand, p.currency)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        Within band
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {notAccepted.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-normal text-muted-foreground">
              Plans not accepted ({notAccepted.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {notAccepted.map((p) => (
                <Badge key={p.planName} variant="outline" className="font-normal">
                  {p.planName}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Sessions tab ────────────────────────────────────────────────────────

export function SessionsTab({ therapist }: Props) {
  const all = getSessions({ therapist: therapist.id });
  const recent = all.slice(0, 10);
  const last30 = all.filter((s) => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    return new Date(s.date).getTime() >= cutoff;
  }).length;
  const redFlags = all.filter((s) => s.riskLevel === "red").length;

  return (
    <div className="space-y-4">
      <StatCardGrid columns={3}>
        <StatCard label="Total sessions (logged)" value={all.length.toString()} />
        <StatCard label="Last 30 days" value={last30.toString()} />
        <StatCard label="Red-flag sessions" value={redFlags.toString()} />
      </StatCardGrid>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent sessions</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href={`/sessions?therapist=${therapist.id}`}>
              Open all in Sessions →
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No sessions on record.</p>
          ) : (
            <div className="rounded-md border border-border/60 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Risk</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recent.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="tabular-nums text-sm">
                        {new Date(s.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/clients/${s.clientId}`}
                          className="text-sm font-medium hover:underline"
                        >
                          {s.clientAlias}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {s.plan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {s.format}
                      </TableCell>
                      <TableCell>
                        <Badge variant={riskVariant[s.riskLevel]} className="font-normal">
                          {s.riskLevel}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{s.status}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Risk record tab ─────────────────────────────────────────────────────

export function RiskRecordTab({ therapist }: Props) {
  const forms = getRiskForms({ therapist: therapist.id });
  const redFlags = forms.filter((f) => f.level === "red").length;
  const overdue = forms.filter(
    (f) =>
      (f.status === "Open" || f.status === "In follow-up") &&
      new Date(f.followUpDueAt).getTime() < Date.now()
  ).length;

  return (
    <div className="space-y-4">
      <StatCardGrid columns={3}>
        <StatCard label="Total forms filed" value={forms.length.toString()} />
        <StatCard label="Red flags" value={redFlags.toString()} />
        <StatCard label="Overdue follow-up" value={overdue.toString()} />
      </StatCardGrid>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent risk forms</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href={`/risk-forms?therapist=${therapist.id}&severity=all&status=all`}>
              Open all in Risk queue →
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {forms.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No risk forms on record. Clean record.
            </p>
          ) : (
            <ul className="space-y-2">
              {forms.slice(0, 5).map((f) => (
                <li
                  key={f.id}
                  className="flex items-start justify-between gap-3 rounded-md border border-border/60 px-3 py-2"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{f.clientAlias}</span>{" "}
                      <Badge
                        variant={riskVariant[f.level]}
                        className="font-normal ml-1"
                      >
                        {f.level}
                      </Badge>
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {f.actionPlan}
                    </p>
                  </div>
                  <Badge
                    variant={f.status === "Resolved" ? "secondary" : "outline"}
                    className="font-normal shrink-0"
                  >
                    {f.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Earnings tab ────────────────────────────────────────────────────────

export function EarningsTab({ therapist }: Props) {
  const earnings = getEarningsByTherapist(therapist.id);

  if (earnings.recent.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Earnings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {therapist.name} has no payout history yet — first payout cycle has
            not run or items not yet itemised.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/commission/payouts">Open payout runs →</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <StatCardGrid columns={4}>
        <StatCard
          label="Lifetime earnings (paid)"
          value={fmtMoney(earnings.lifetimeNet, earnings.lifetimeCurrency)}
        />
        <StatCard
          label="Last payout"
          value={
            earnings.lastPayout
              ? fmtMoney(earnings.lastPayout.net, earnings.lastPayout.currency)
              : "—"
          }
          sub={earnings.lastPayout ? formatDate(earnings.lastPayout.runDate) : undefined}
        />
        <StatCard label="Current tier" value={earnings.currentTier ?? "—"} />
        <StatCard
          label="Tier+ status"
          value={
            <Badge
              variant={earnings.isTierPlus ? "secondary" : "outline"}
              className="font-normal"
            >
              {earnings.isTierPlus ? "Active" : "Not active"}
            </Badge>
          }
        />
      </StatCardGrid>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent payouts</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href="/commission/payouts">Open payout runs →</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {earnings.recent.map((e) => (
              <li
                key={e.runId}
                className="flex items-center justify-between gap-3 rounded-md border border-border/60 px-3 py-2"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">
                    {formatDate(e.runDate)} · {e.region}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {e.sessions} sessions · Tier {e.tier} · gross {fmtMoney(e.gross, e.currency)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium tabular-nums">
                    {fmtMoney(e.net, e.currency)}
                  </span>
                  <Badge
                    variant={e.status === "Paid" ? "secondary" : e.status === "Failed" ? "destructive" : "outline"}
                    className="font-normal"
                  >
                    {e.status}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Activity log tab ────────────────────────────────────────────────────

export function ActivityLogTab({ therapist }: Props) {
  const entries = getAuditEntriesByTarget(therapist.name);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Activity touching this therapist</CardTitle>
        <Button asChild variant="outline" size="sm">
          <Link href="/settings/audit">Open full audit log →</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No admin actions on record for {therapist.name}.
          </p>
        ) : (
          <ul className="space-y-2">
            {entries.map((e) => (
              <li
                key={e.id}
                className="flex items-start justify-between gap-3 rounded-md border border-border/60 px-3 py-2"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{e.adminName}</span>{" "}
                    <span className="text-muted-foreground">·</span>{" "}
                    {e.action}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {e.target}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Popover>
                    <PopoverTrigger className="text-xs text-muted-foreground hover:text-foreground hover:underline">
                      Detail
                    </PopoverTrigger>
                    <PopoverContent className="text-sm max-w-md">
                      {e.detail}
                    </PopoverContent>
                  </Popover>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {fmtRelative(e.timestamp)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
