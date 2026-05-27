"use client";

import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  PlansPricingTab,
  SessionsTab,
  RiskRecordTab,
  EarningsTab,
  ActivityLogTab,
} from "@/components/therapists/therapist-tabs";

import type { Therapist } from "@/lib/dummy/therapists";

const statusVariant: Record<
  Therapist["status"],
  "secondary" | "destructive" | "outline"
> = {
  Active: "secondary",
  Suspended: "destructive",
  "On leave": "outline",
};

type Props = {
  therapist: Therapist;
};

function formatEarnings(e: Therapist["earnings30d"]): string {
  if (e.amount === 0) return "—";
  if (e.currency === "NGN") return `₦${(e.amount / 1000).toFixed(0)}k`;
  return `$${e.amount.toLocaleString()}`;
}

export function TherapistDetail({ therapist: t }: Props) {
  const [suspendOpen, setSuspendOpen] = useState(false);

  const handleSuspend = () => {
    toast.success(`${t.name} suspended`, {
      description: "Therapist will not appear in client searches.",
    });
    setSuspendOpen(false);
  };

  return (
    <div className="space-y-6">
      <Link
        href="/therapists"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Therapists
      </Link>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-muted text-base font-semibold"
          >
            {t.initials}
          </span>
          <div className="space-y-1.5">
            <h1 className="font-heading text-3xl tracking-tight">{t.name}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <Badge variant="outline" className="font-normal">
                {t.region} · {t.country}
              </Badge>
              <Badge variant="secondary">{t.tier}</Badge>
              <Badge variant={statusVariant[t.status]}>{t.status}</Badge>
              <span className="text-muted-foreground">
                {t.rating.toFixed(1)} ★ ({t.ratingCount.toLocaleString()})
              </span>
            </div>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={() => setSuspendOpen(true)}
          disabled={t.status !== "Active"}
        >
          Suspend therapist
        </Button>
      </header>

      <section
        aria-label="Stats"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        {[
          { label: "Sessions (lifetime)", value: (t.sessions30d * 14).toLocaleString() },
          { label: "Active clients", value: Math.round(t.sessions30d / 4).toString() },
          { label: "Earnings (30d)", value: formatEarnings(t.earnings30d) },
          { label: "Avg rating", value: `${t.rating.toFixed(1)} ★` },
        ].map((s) => (
          <Card key={s.label} className="gap-1 py-4">
            <CardHeader className="p-0 px-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {s.label}
              </p>
            </CardHeader>
            <CardContent className="px-5">
              <p className="font-heading text-2xl tabular-nums">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans &amp; pricing</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="risk">Risk record</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="activity">Activity log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Bio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{t.bio}</p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Credentials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">License:</span>{" "}
                  <span className="font-medium">{t.licenseNumber}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Expires:</span>{" "}
                  {new Date(t.licenseExpiry).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <span className="text-muted-foreground">Years of practice:</span>{" "}
                  {t.yearsOfPractice}
                </p>
                <p>
                  <span className="text-muted-foreground">Joined:</span>{" "}
                  {new Date(t.joinedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p>
                  <span className="text-muted-foreground">Verified by:</span>{" "}
                  {t.verifiedBy} ·{" "}
                  {new Date(t.verifiedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Practice info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Specializations</p>
                  <div className="flex flex-wrap gap-1.5">
                    {t.specializations.map((s) => (
                      <Badge key={s} variant="outline" className="font-normal">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Languages</p>
                  <p>{t.languages.join(" · ")}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Uploaded documents</CardTitle>
              <Badge variant="secondary" className="font-normal">
                {t.documents.length}
              </Badge>
            </CardHeader>
            <CardContent>
              {t.documents.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No documents on file.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {t.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href="#"
                      className="flex items-center justify-between gap-3 rounded-md border border-border/60 px-3 py-2 hover:bg-muted/40"
                    >
                      <span className="flex items-center gap-2 min-w-0">
                        <FileText className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="flex flex-col min-w-0">
                          <span className="text-sm font-medium truncate">
                            {doc.label}
                          </span>
                          <span className="text-xs text-muted-foreground truncate">
                            {doc.fileName} · {doc.sizeKb} KB
                          </span>
                        </span>
                      </span>
                      {doc.kind === "license" && (
                        <Badge variant="secondary" className="font-normal shrink-0">
                          License
                        </Badge>
                      )}
                      {doc.kind === "id" && (
                        <Badge variant="secondary" className="font-normal shrink-0">
                          ID
                        </Badge>
                      )}
                      {doc.kind === "certification" && (
                        <Badge variant="outline" className="font-normal shrink-0">
                          Certification
                        </Badge>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="pt-4">
          <PlansPricingTab therapist={t} />
        </TabsContent>
        <TabsContent value="sessions" className="pt-4">
          <SessionsTab therapist={t} />
        </TabsContent>
        <TabsContent value="risk" className="pt-4">
          <RiskRecordTab therapist={t} />
        </TabsContent>
        <TabsContent value="earnings" className="pt-4">
          <EarningsTab therapist={t} />
        </TabsContent>
        <TabsContent value="activity" className="pt-4">
          <ActivityLogTab therapist={t} />
        </TabsContent>
      </Tabs>

      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend {t.name}?</DialogTitle>
            <DialogDescription>
              The therapist will be removed from client searches and existing
              bookings will need to be rescheduled. They can be reinstated at any
              time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSuspend}>
              Suspend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
