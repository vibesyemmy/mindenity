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

import { ActionBar } from "@/components/pricing-approvals/action-dialogs";

import {
  deltaFromBand,
  formatMoney,
  formatRelative,
  getApprovalsByTherapist,
  type PricingRequest,
} from "@/lib/dummy/pricing-approvals";

const statusVariant: Record<
  PricingRequest["status"],
  "secondary" | "outline" | "destructive" | "default"
> = {
  Pending: "default",
  Approved: "secondary",
  Rejected: "destructive",
  Countered: "outline",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type Props = {
  request: PricingRequest;
};

export function ApprovalReview({ request: r }: Props) {
  const delta = deltaFromBand(r);
  const history = getApprovalsByTherapist(r.therapistId).filter(
    (h) => h.id !== r.id
  );
  const recentHistory = history.slice(0, 3);
  const deltaVariant: "destructive" | "secondary" =
    delta.direction === "over_max" || delta.direction === "under_min"
      ? "destructive"
      : "secondary";

  return (
    <div className="space-y-6">
      <Link
        href="/pricing-approvals"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Approvals queue
      </Link>

      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-3xl tracking-tight">
            Pricing request — {r.therapistName}
          </h1>
          <Badge variant={statusVariant[r.status]}>{r.status}</Badge>
          <Badge variant="outline" className="font-normal">
            {r.region}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {r.planName} · {r.planSegment} · submitted {formatRelative(r.submittedAt)}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_220px]">
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Request</CardTitle>
              <Badge variant={deltaVariant} className="font-normal">
                {delta.label}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-md border border-border/60 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Min band
                  </p>
                  <p className="font-heading text-lg tabular-nums">
                    {formatMoney(r.minBand, r.currency)}
                  </p>
                </div>
                <div className="rounded-md border border-border/60 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Base price
                  </p>
                  <p className="font-heading text-lg tabular-nums">
                    {formatMoney(r.basePrice, r.currency)}
                  </p>
                </div>
                <div className="rounded-md border border-border/60 px-3 py-2">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Max band
                  </p>
                  <p className="font-heading text-lg tabular-nums">
                    {formatMoney(r.maxBand, r.currency)}
                  </p>
                </div>
              </div>
              <div className="rounded-md border border-primary/40 bg-primary/5 px-3 py-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Therapist proposed
                </p>
                <p className="font-heading text-2xl tabular-nums">
                  {formatMoney(r.proposedPrice, r.currency)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Therapist&apos;s reasoning
                </p>
                <p className="text-sm leading-relaxed">{r.reasoning}</p>
              </div>
              {r.status !== "Pending" && r.decisionNote && (
                <div className="rounded-md bg-muted/50 px-3 py-2 space-y-1">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Decision · {r.decidedBy} ·{" "}
                    {r.decidedAt && formatDate(r.decidedAt)}
                  </p>
                  <p className="text-sm">{r.decisionNote}</p>
                  {r.counterPrice && (
                    <p className="text-xs text-muted-foreground">
                      Counter: {formatMoney(r.counterPrice, r.currency)}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Therapist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">{r.therapistName}</p>
                <Badge variant="secondary" className="font-normal">
                  {r.therapistTier}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  Region: {r.region}
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <Link href={`/therapists/${r.therapistId}`}>
                    Open therapist →
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">
                  {r.planName} · {r.planSegment}
                </p>
                <p className="text-muted-foreground text-xs">
                  Currency: {r.currency}
                </p>
                <p className="text-muted-foreground text-xs">
                  Band set in Plans & pricing.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <Link href="/plans">Edit in plans →</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent requests by this therapist</CardTitle>
              <span className="text-xs text-muted-foreground">
                {history.length} total
              </span>
            </CardHeader>
            <CardContent>
              {recentHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No prior requests on record.
                </p>
              ) : (
                <ul className="space-y-2 text-sm">
                  {recentHistory.map((h) => (
                    <li
                      key={h.id}
                      className="flex items-center justify-between"
                    >
                      <span>
                        {formatDate(h.submittedAt)} ·{" "}
                        <span className="text-muted-foreground">{h.planName}</span>
                      </span>
                      <Badge
                        variant={statusVariant[h.status]}
                        className="font-normal"
                      >
                        {h.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>

        <aside>
          {r.status === "Pending" ? (
            <ActionBar request={r} />
          ) : (
            <div className="sticky top-20 rounded-md border border-border/60 px-3 py-3 text-sm text-muted-foreground">
              This request is already {r.status.toLowerCase()}. No further action
              available.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
