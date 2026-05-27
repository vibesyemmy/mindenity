"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import {
  formatCountdown,
  formatDate,
  formatRelative,
  getSubjectHref,
  type SubjectRequest,
} from "@/lib/dummy/compliance";

type Props = {
  request: SubjectRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const typeVariant: Record<
  SubjectRequest["type"],
  "secondary" | "destructive"
> = {
  Export: "secondary",
  Delete: "destructive",
};

const statusVariant: Record<
  SubjectRequest["status"],
  "secondary" | "outline" | "destructive" | "default"
> = {
  Pending: "default",
  "In progress": "outline",
  Fulfilled: "secondary",
  Rejected: "destructive",
};

export function RequestDrawer({ request, open, onOpenChange }: Props) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectNote, setRejectNote] = useState("");

  if (!request) return null;

  const cd = formatCountdown(request.dueBy);
  const isClosed = request.status === "Fulfilled" || request.status === "Rejected";

  const handleFulfil = () => {
    toast.success(
      `${request.type} request fulfilled for ${request.subjectAlias}`,
      {
        description:
          request.type === "Export"
            ? "Export bundle queued. Subject notified via email."
            : "Account data scheduled for deletion. Subject notified.",
      }
    );
    onOpenChange(false);
  };

  const handleReject = () => {
    if (rejectNote.trim().length < 5) {
      toast.error("Add a rejection note of at least 5 characters.");
      return;
    }
    toast.success(`${request.type} request rejected`, {
      description: `${request.subjectAlias} notified. They may resubmit.`,
    });
    setRejectOpen(false);
    setRejectNote("");
    onOpenChange(false);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full max-w-md sm:max-w-lg overflow-y-auto p-6">
          <SheetHeader className="space-y-3 p-0">
            <div className="flex items-center gap-2">
              <Badge variant={typeVariant[request.type]}>
                {request.type}
              </Badge>
              <Badge variant={statusVariant[request.status]}>
                {request.status}
              </Badge>
              <Badge variant="outline" className="font-normal">
                {request.regulation}
              </Badge>
            </div>
            <SheetTitle className="text-2xl">
              Request from {request.subjectAlias}
            </SheetTitle>
            <SheetDescription>
              Submitted {formatRelative(request.submittedAt)} ·{" "}
              <span
                className={
                  cd.overdue ? "text-destructive font-medium" : "text-muted-foreground"
                }
              >
                {cd.text}
              </span>
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            <section className="space-y-2">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
                Subject
              </h3>
              <div className="rounded-md border border-border/60 px-3 py-3 space-y-1.5">
                <p className="font-medium">{request.subjectName}</p>
                <p className="text-sm text-muted-foreground">
                  {request.subjectAlias} · {request.subjectType}
                </p>
                <p className="text-sm text-muted-foreground">
                  {request.subjectEmail}
                </p>
                <p className="text-sm text-muted-foreground">
                  {request.region} · {request.country}
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <Link href={getSubjectHref(request)}>
                    Open {request.subjectType.toLowerCase()} →
                  </Link>
                </Button>
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
                Request
              </h3>
              <div className="rounded-md border border-border/60 px-3 py-3 space-y-1.5 text-sm">
                <p>
                  <span className="text-muted-foreground">Type:</span>{" "}
                  {request.type}
                </p>
                <p>
                  <span className="text-muted-foreground">Submitted:</span>{" "}
                  {formatDate(request.submittedAt)}
                </p>
                <p>
                  <span className="text-muted-foreground">Due by:</span>{" "}
                  {formatDate(request.dueBy)}
                </p>
                {request.clientReason && (
                  <div className="pt-2">
                    <p className="text-muted-foreground mb-1">Subject said:</p>
                    <p className="leading-relaxed italic">
                      &quot;{request.clientReason}&quot;
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="space-y-2">
              <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
                Regulation
              </h3>
              <div className="rounded-md border border-border/60 px-3 py-3 space-y-1.5 text-sm">
                <p>
                  <span className="text-muted-foreground">Framework:</span>{" "}
                  <span className="font-medium">{request.regulation}</span>
                </p>
                <p className="text-muted-foreground text-xs">
                  {request.regulation === "GDPR"
                    ? "Article 15 (Export) / Article 17 (Right to erasure) — respond within 30 days."
                    : "NDPR Subject Access Rights — respond within 30 days."}
                </p>
              </div>
            </section>

            {request.decisionNote && (
              <section className="space-y-2">
                <h3 className="text-xs uppercase tracking-wide text-muted-foreground">
                  Decision note
                </h3>
                <p className="rounded-md bg-muted/50 px-3 py-2 text-sm">
                  {request.decisionNote}
                </p>
              </section>
            )}

            {!isClosed && (
              <section className="flex flex-col gap-2 pt-2">
                <Button onClick={handleFulfil}>Fulfil request</Button>
                <Button
                  variant="destructive"
                  onClick={() => setRejectOpen(true)}
                >
                  Reject
                </Button>
              </section>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject request?</DialogTitle>
            <DialogDescription>
              The subject receives your note with resubmission instructions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-note">Reason (required)</Label>
            <Textarea
              id="reject-note"
              rows={4}
              value={rejectNote}
              onChange={(e) => setRejectNote(e.target.value)}
              placeholder="E.g. Identity verification failed — could not confirm requester is account holder."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
