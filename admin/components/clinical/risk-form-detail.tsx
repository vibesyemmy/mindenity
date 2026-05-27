"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  RefreshCw,
  StickyNote,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  formatCountdown,
  formatRelative,
  type RiskForm,
  type RiskFormStatus,
  type RiskTimelineEvent,
} from "@/lib/dummy/clinical";

const levelVariant = {
  green: "secondary",
  orange: "outline",
  red: "destructive",
} as const;

const statusVariant: Record<
  RiskFormStatus,
  "secondary" | "outline" | "destructive" | "default"
> = {
  Open: "default",
  "In follow-up": "outline",
  Resolved: "secondary",
  Escalated: "destructive",
};

const iconForType: Record<RiskTimelineEvent["type"], typeof FileText> = {
  form_submitted: FileText,
  status_changed: RefreshCw,
  emergency_verified: ShieldCheck,
  admin_note: StickyNote,
  escalated_to_crisis: ArrowUpRight,
  resolved: CheckCircle2,
};

const labelForType: Record<RiskTimelineEvent["type"], string> = {
  form_submitted: "Form submitted",
  status_changed: "Status changed",
  emergency_verified: "Emergency line verified",
  admin_note: "Admin note",
  escalated_to_crisis: "Escalated to crisis",
  resolved: "Resolved",
};

function formatStamp(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  riskForm: RiskForm;
};

export function RiskFormDetail({ riskForm }: Props) {
  const [timeline, setTimeline] = useState<RiskTimelineEvent[]>(riskForm.timeline);
  const [status, setStatus] = useState<RiskFormStatus>(riskForm.status);
  const [note, setNote] = useState("");
  const [resolutionNote, setResolutionNote] = useState("");
  const cd = formatCountdown(riskForm.followUpDueAt);
  const shortId = riskForm.id.replace(/^rf-/, "#");
  const needsEmergencyVerify =
    riskForm.region === "Int'l" &&
    riskForm.level === "red" &&
    riskForm.emergencyVerify === "pending";

  const pushEvent = (event: Omit<RiskTimelineEvent, "id">) => {
    setTimeline((prev) => [
      { ...event, id: `rtl-local-${Date.now()}` },
      ...prev,
    ]);
  };

  const handleMarkInFollowUp = () => {
    setStatus("In follow-up");
    pushEvent({
      timestamp: new Date().toISOString(),
      type: "status_changed",
      actor: "Adaeze Nwosu",
      note: "Marked as in follow-up.",
    });
    toast.success("Marked as in follow-up");
  };

  const handleResolve = () => {
    if (resolutionNote.trim().length < 5) {
      toast.error("Add a resolution note of at least 5 characters.");
      return;
    }
    setStatus("Resolved");
    pushEvent({
      timestamp: new Date().toISOString(),
      type: "resolved",
      actor: "Adaeze Nwosu",
      note: `Resolved · ${resolutionNote.trim()}`,
    });
    setResolutionNote("");
    toast.success("Marked as resolved");
  };

  const handleEscalate = () => {
    setStatus("Escalated");
    pushEvent({
      timestamp: new Date().toISOString(),
      type: "escalated_to_crisis",
      actor: "Adaeze Nwosu",
      note: "Manually escalated to crisis log for immediate review.",
    });
    toast.success("Escalated to crisis log", {
      description: "Crisis log entry created · therapist + on-call admin notified.",
    });
  };

  const handleVerifyEmergency = () => {
    pushEvent({
      timestamp: new Date().toISOString(),
      type: "emergency_verified",
      actor: "Adaeze Nwosu",
      note: "Local emergency services verified for client country.",
    });
    toast.success("Emergency services verified", {
      description: "Confirmed local crisis line for the client's country.",
    });
  };

  const addAdminNote = () => {
    if (note.trim().length < 5) {
      toast.error("Add a note of at least 5 characters.");
      return;
    }
    pushEvent({
      timestamp: new Date().toISOString(),
      type: "admin_note",
      actor: "Adaeze Nwosu",
      note: note.trim(),
    });
    setNote("");
    toast.success("Note added to timeline");
  };

  const isClosed = status === "Resolved";

  return (
    <div className="space-y-6">
      <Link
        href="/risk-forms"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Risk follow-up queue
      </Link>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl tracking-tight">
            Risk follow-up {shortId}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={levelVariant[riskForm.level]} className="font-normal">
              {riskForm.level}
            </Badge>
            <Badge variant={statusVariant[status]}>{status}</Badge>
            <Badge variant="outline" className="font-normal">
              {riskForm.region} · {riskForm.country}
            </Badge>
            <span
              className={`text-sm tabular-nums ${cd.overdue ? "text-destructive font-medium" : "text-muted-foreground"}`}
            >
              Follow-up {cd.text}
            </span>
            <span className="text-sm text-muted-foreground">
              · Submitted {formatRelative(riskForm.submittedAt)}
            </span>
          </div>
        </div>
      </header>

      <section
        aria-label="Context"
        className="grid grid-cols-1 gap-3 lg:grid-cols-3"
      >
        <Card className="py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Client
            </p>
          </CardHeader>
          <CardContent className="px-5 space-y-1">
            <Link
              href={`/clients/${riskForm.clientId}`}
              className="font-heading text-lg hover:underline"
            >
              {riskForm.clientAlias}
            </Link>
            <p className="text-xs text-muted-foreground">Open client record →</p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Therapist
            </p>
          </CardHeader>
          <CardContent className="px-5 space-y-1">
            <Link
              href={`/therapists/${riskForm.therapistId}`}
              className="font-heading text-lg hover:underline"
            >
              {riskForm.therapistName}
            </Link>
            <p className="text-xs text-muted-foreground">Open therapist →</p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Source session
            </p>
          </CardHeader>
          <CardContent className="px-5 space-y-1">
            <p className="font-heading text-lg">{riskForm.sessionId}</p>
            <Link
              href={`/sessions?client=${riskForm.clientId}&therapist=${riskForm.therapistId}`}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              View related sessions →
            </Link>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Risk assessment</CardTitle>
          <Badge variant={levelVariant[riskForm.level]} className="font-normal">
            {riskForm.level} · {riskForm.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
              Action plan
            </p>
            <p className="leading-relaxed">{riskForm.actionPlan}</p>
          </div>
          {riskForm.region === "Int'l" && riskForm.level === "red" && (
            <div className="rounded-md border border-border/60 bg-muted/40 px-3 py-2 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5" />
                  Local emergency services
                </p>
                <Badge
                  variant={
                    riskForm.emergencyVerify === "verified"
                      ? "secondary"
                      : "destructive"
                  }
                  className="font-normal"
                >
                  {riskForm.emergencyVerify === "verified"
                    ? "Verified"
                    : riskForm.emergencyVerify === "pending"
                      ? "Pending"
                      : "N/A"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                US-025 AC#5 requires verification for international red-level
                cases. Emergency line for {riskForm.country} confirmed and
                shared with client at submission.
              </p>
              {needsEmergencyVerify && (
                <Button size="sm" variant="outline" onClick={handleVerifyEmergency}>
                  <PhoneCall className="size-3.5 mr-1" />
                  Verify emergency services now
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Follow-up timeline</CardTitle>
          <span className="text-xs text-muted-foreground">
            {timeline.length} event{timeline.length === 1 ? "" : "s"}
          </span>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            {timeline.map((ev) => {
              const Icon = iconForType[ev.type];
              return (
                <li key={ev.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-muted">
                      <Icon className="size-3.5" />
                    </span>
                    <span className="mt-2 w-px flex-1 bg-border" />
                  </div>
                  <div className="flex-1 pb-2 space-y-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium text-sm">{labelForType[ev.type]}</p>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatStamp(ev.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="text-foreground">{ev.actor}</span> ·{" "}
                      {ev.note}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      {!isClosed && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Add admin note</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="admin-note">Note</Label>
                <Textarea
                  id="admin-note"
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="E.g. Confirmed client booked follow-up session via phone outreach."
                />
              </div>
              <Button onClick={addAdminNote}>Add to timeline</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Status actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {status !== "In follow-up" && (
                <Button
                  variant="outline"
                  onClick={handleMarkInFollowUp}
                  className="w-full justify-start"
                >
                  Mark as in follow-up
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={handleEscalate}
                disabled={status === "Escalated"}
                className="w-full justify-start"
              >
                Escalate to crisis log
              </Button>
              <div className="space-y-2 pt-2">
                <Label htmlFor="resolution-note">Resolution note</Label>
                <Textarea
                  id="resolution-note"
                  rows={2}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="E.g. Client engaged in increased-frequency plan; no further escalation needed."
                />
                <Button onClick={handleResolve} className="w-full">
                  Mark resolved
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
