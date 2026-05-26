"use client";

import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { RefundDialog } from "@/components/clients/refund-dialog";
import { formatMoney } from "@/components/clients/client-list-columns";

import type { Client, PaymentRecord } from "@/lib/dummy/clients";

const statusVariant: Record<
  Client["status"],
  "secondary" | "destructive" | "outline"
> = {
  Active: "secondary",
  "Past-due": "destructive",
  Cancelled: "outline",
  Lapsed: "outline",
};

const paymentStatusVariant: Record<
  PaymentRecord["status"],
  "secondary" | "destructive" | "outline"
> = {
  Succeeded: "secondary",
  Refunded: "outline",
  Failed: "destructive",
  Pending: "outline",
};

const riskVariant: Record<Client["riskLevel"], "secondary" | "outline" | "destructive"> = {
  green: "secondary",
  orange: "outline",
  red: "destructive",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type Props = {
  client: Client;
};

export function ClientDetail({ client: c }: Props) {
  const [pauseOpen, setPauseOpen] = useState(false);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [refundPayment, setRefundPayment] = useState<PaymentRecord | null>(null);

  const handlePause = () => {
    toast.success(`Plan paused for ${c.alias}`, {
      description: "Billing will pause from the next cycle.",
    });
    setPauseOpen(false);
  };

  const handleSuspend = () => {
    if (suspendReason.trim().length < 5) {
      toast.error("Add a suspension reason of at least 5 characters.");
      return;
    }
    toast.success(`${c.alias} suspended`, {
      description: "Client login revoked; active bookings auto-canceled.",
    });
    setSuspendOpen(false);
    setSuspendReason("");
  };

  return (
    <div className="space-y-6">
      <Link
        href="/clients"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Clients
      </Link>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-muted text-base font-semibold"
          >
            {c.initials}
          </span>
          <div className="space-y-1.5">
            <h1 className="font-heading text-3xl tracking-tight">{c.alias}</h1>
            <p className="text-sm text-muted-foreground">{c.name}</p>
            <div className="flex flex-wrap items-center gap-2 text-sm pt-1">
              <Badge variant="outline" className="font-normal">
                {c.region} · {c.country}
              </Badge>
              <Badge variant="secondary">{c.plan.name}</Badge>
              <Badge variant={statusVariant[c.status]}>{c.status}</Badge>
              <Badge variant={riskVariant[c.riskLevel]} className="font-normal">
                Risk: {c.riskLevel}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPauseOpen(true)}
            disabled={c.status !== "Active"}
          >
            Pause plan
          </Button>
          <Button
            variant="destructive"
            onClick={() => setSuspendOpen(true)}
            disabled={c.status === "Cancelled"}
          >
            Suspend account
          </Button>
        </div>
      </header>

      <section
        aria-label="Stats"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {[
          { label: "Lifetime sessions", value: c.lifetimeSessions.toLocaleString() },
          { label: "Member since", value: formatDate(c.joinedAt) },
          { label: "Last payment", value: c.lastPaymentAgo },
          {
            label: "Lifetime spend",
            value: formatMoney(c.lifetimeSpend.amount, c.lifetimeSpend.currency),
          },
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

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="planHistory">Plan history</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="risk">Risk events</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Care summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>{c.careSummary}</p>
                <div className="pt-2 space-y-1.5">
                  <p>
                    <span className="text-muted-foreground">Plan:</span>{" "}
                    <span className="font-medium">{c.plan.name}</span>{" "}
                    <span className="text-muted-foreground">({c.plan.type})</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground">Current therapist:</span>{" "}
                    {c.currentTherapist ?? "Not assigned"}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Sessions this cycle:</span>{" "}
                    {c.plan.type === "PAYG"
                      ? `${c.sessionsUsedThisCycle} (PAYG)`
                      : `${c.sessionsUsedThisCycle}/${c.plan.sessionsPerMonth}`}
                  </p>
                  {c.cycleResetsOn && (
                    <p>
                      <span className="text-muted-foreground">Cycle resets:</span>{" "}
                      {formatDate(c.cycleResetsOn)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1.5 text-sm">
                <p>
                  <span className="text-muted-foreground">Email:</span> {c.email}
                </p>
                <p>
                  <span className="text-muted-foreground">Phone:</span> {c.phone}
                </p>
                <p>
                  <span className="text-muted-foreground">Region:</span> {c.region}
                </p>
                <p>
                  <span className="text-muted-foreground">Timezone:</span>{" "}
                  {c.timezone}
                </p>
                <p>
                  <span className="text-muted-foreground">Joined:</span>{" "}
                  {formatDate(c.joinedAt)}
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Latest activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Recent sessions
                </p>
                {c.sessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No sessions yet.</p>
                ) : (
                  <ul className="space-y-1.5 text-sm">
                    {c.sessions.slice(0, 3).map((s) => (
                      <li
                        key={s.id}
                        className="flex items-center justify-between"
                      >
                        <span>
                          {formatDate(s.date)} ·{" "}
                          <span className="text-muted-foreground">
                            {s.therapist}
                          </span>
                        </span>
                        <Badge
                          variant={riskVariant[s.riskLevel]}
                          className="font-normal"
                        >
                          {s.riskLevel}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                  Recent payments
                </p>
                {c.payments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No payments yet.</p>
                ) : (
                  <ul className="space-y-1.5 text-sm">
                    {c.payments.slice(0, 3).map((p) => (
                      <li
                        key={p.id}
                        className="flex items-center justify-between"
                      >
                        <span>
                          {formatDate(p.date)} ·{" "}
                          <span className="text-muted-foreground">
                            {p.description}
                          </span>
                        </span>
                        <span className="tabular-nums">
                          {formatMoney(p.amount, p.currency)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payments</CardTitle>
              <span className="text-xs text-muted-foreground">
                {c.payments.length} transaction{c.payments.length === 1 ? "" : "s"}
              </span>
            </CardHeader>
            <CardContent>
              {c.payments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No payments on record.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {c.payments.map((p) => {
                      const canRefund =
                        p.status === "Succeeded" && p.eligibleForRefund;
                      return (
                        <TableRow key={p.id}>
                          <TableCell className="tabular-nums">
                            {formatDate(p.date)}
                          </TableCell>
                          <TableCell>{p.description}</TableCell>
                          <TableCell className="tabular-nums">
                            {formatMoney(p.amount, p.currency)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {p.method} · •••• {p.last4}
                          </TableCell>
                          <TableCell>
                            <Badge variant={paymentStatusVariant[p.status]}>
                              {p.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={!canRefund}
                              onClick={() => setRefundPayment(p)}
                            >
                              <RotateCcw className="size-3.5 mr-1" />
                              Refund
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {(["planHistory", "sessions", "risk", "notes"] as const).map((key) => (
          <TabsContent key={key} value={key} className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">
                  {key === "planHistory"
                    ? "Plan history"
                    : key === "risk"
                      ? "Risk events"
                      : key}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Full {key === "planHistory" ? "plan history" : key === "risk" ? "risk events" : key}{" "}
                  view not built in this prototype. Wire when the parent module
                  lands.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={pauseOpen} onOpenChange={setPauseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pause {c.alias}&apos;s plan?</DialogTitle>
            <DialogDescription>
              Billing will pause from the next cycle. Existing booked sessions
              continue until the plan ends. Client can reactivate from their
              Settings at any time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPauseOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePause}>Pause plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend {c.alias}?</DialogTitle>
            <DialogDescription>
              Client will lose login access immediately. Active bookings are
              auto-canceled and refunded per plan terms. This action is
              reversible by a super-admin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="suspend-reason">Reason (required)</Label>
            <Textarea
              id="suspend-reason"
              rows={3}
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="E.g. Repeated terms of service violations after warning on 2026-05-12."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSuspend}>
              Suspend account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RefundDialog
        client={c}
        payment={refundPayment}
        open={refundPayment !== null}
        onOpenChange={(open) => {
          if (!open) setRefundPayment(null);
        }}
      />
    </div>
  );
}
