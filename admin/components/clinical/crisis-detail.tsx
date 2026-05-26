"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  AlertOctagon,
  Bell,
  PhoneCall,
  ArrowUpRight,
  CheckCircle2,
  StickyNote,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { CrisisEvent, CrisisStatus, CrisisTimelineEvent } from "@/lib/dummy/clinical";

const statusVariant: Record<
  CrisisStatus,
  "secondary" | "outline" | "destructive"
> = {
  Active: "destructive",
  Responded: "outline",
  Escalated: "destructive",
  Resolved: "secondary",
};

const iconForType: Record<CrisisTimelineEvent["type"], typeof AlertOctagon> = {
  alert_triggered: AlertOctagon,
  therapist_notified: Bell,
  therapist_responded: PhoneCall,
  escalated: ArrowUpRight,
  resolved: CheckCircle2,
  admin_note: StickyNote,
};

const labelForType: Record<CrisisTimelineEvent["type"], string> = {
  alert_triggered: "Alert triggered",
  therapist_notified: "Therapist notified",
  therapist_responded: "Therapist responded",
  escalated: "Escalated",
  resolved: "Resolved",
  admin_note: "Admin note",
};

function formatStamp(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

type Props = {
  crisis: CrisisEvent;
};

export function CrisisDetail({ crisis }: Props) {
  const [timeline, setTimeline] = useState<CrisisTimelineEvent[]>(crisis.timeline);
  const [status, setStatus] = useState<CrisisStatus>(crisis.status);
  const [note, setNote] = useState("");
  const shortId = crisis.id.replace(/^cr-/, "#");

  const addNote = () => {
    if (note.trim().length < 5) {
      toast.error("Add a note of at least 5 characters.");
      return;
    }
    const newEvent: CrisisTimelineEvent = {
      id: `tl-local-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "admin_note",
      actor: "Adaeze Nwosu",
      note: note.trim(),
    };
    setTimeline([newEvent, ...timeline]);
    setNote("");
    toast.success("Note added to timeline");
  };

  const saveStatus = () => {
    toast.success(`Status set to ${status}`, {
      description: "Stakeholders notified.",
    });
  };

  const escalate = () => {
    if (status === "Escalated") return;
    setStatus("Escalated");
    const newEvent: CrisisTimelineEvent = {
      id: `tl-local-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: "escalated",
      actor: "Adaeze Nwosu",
      note: "Manually escalated to admin team.",
    };
    setTimeline([newEvent, ...timeline]);
    toast.success("Escalated to admin team");
  };

  return (
    <div className="space-y-6">
      <Link
        href="/crisis"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Crisis log
      </Link>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <h1 className="font-heading text-3xl tracking-tight">
            Crisis {shortId}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={statusVariant[status]}>{status}</Badge>
            <Badge variant="outline" className="font-normal">
              {crisis.region} · {crisis.country}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Triggered {formatStamp(crisis.triggeredAt)}
            </span>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={escalate}
          disabled={status === "Escalated"}
        >
          Escalate to admin
        </Button>
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
              href={`/clients/${crisis.clientId}`}
              className="font-heading text-lg hover:underline"
            >
              {crisis.clientAlias}
            </Link>
            <p className="text-xs text-muted-foreground">
              Open client record →
            </p>
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Therapist
            </p>
          </CardHeader>
          <CardContent className="px-5 space-y-1">
            {crisis.therapistId ? (
              <>
                <Link
                  href={`/therapists/${crisis.therapistId}`}
                  className="font-heading text-lg hover:underline"
                >
                  {crisis.therapistName}
                </Link>
                <p className="text-xs text-muted-foreground">Open therapist →</p>
              </>
            ) : (
              <>
                <p className="font-heading text-lg italic">Escalated</p>
                <p className="text-xs text-muted-foreground">
                  No therapist assigned at escalation
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="py-4">
          <CardHeader className="p-0 px-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Local emergency line
            </p>
          </CardHeader>
          <CardContent className="px-5 space-y-1">
            <p className="font-heading text-lg">{crisis.localEmergencyLine}</p>
            <p className="text-xs text-muted-foreground">{crisis.country}</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Timeline</CardTitle>
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
                      <p className="font-medium text-sm">
                        {labelForType[ev.type]}
                      </p>
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
                placeholder="E.g. Confirmed client safe via SMS. Therapist contacted off-platform."
              />
            </div>
            <Button onClick={addNote}>Add to timeline</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as CrisisStatus)}
              >
                <SelectTrigger id="status" className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Responded">Responded</SelectItem>
                  <SelectItem value="Escalated">Escalated</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={saveStatus}>Save status</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
