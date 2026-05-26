"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

import type { VerificationApplication } from "@/lib/dummy/therapists";

type Action = "approve" | "reject" | "info";

type Props = {
  application: VerificationApplication;
};

export function ActionBar({ application }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<Action | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const handleAction = (action: Action) => {
    if (action === "approve") {
      toast.success(`${application.name} approved`, {
        description: "Welcome email queued for delivery.",
      });
    } else if (action === "reject") {
      if (rejectReason.trim().length < 5) {
        toast.error("Add a rejection reason of at least 5 characters.");
        return;
      }
      toast.success(`${application.name} rejected`, {
        description: "Resubmission link sent.",
      });
    } else {
      toast.success(`Info request sent to ${application.name}`, {
        description: infoMessage.trim() || "Applicant will be notified.",
      });
    }
    setOpen(null);
    router.push("/therapists/verifications");
  };

  return (
    <>
      <div className="sticky top-20 flex flex-col gap-2">
        <Button onClick={() => setOpen("approve")} className="w-full">
          Approve
        </Button>
        <Button
          variant="outline"
          onClick={() => setOpen("info")}
          className="w-full"
        >
          Request more info
        </Button>
        <Button
          variant="destructive"
          onClick={() => setOpen("reject")}
          className="w-full"
        >
          Reject
        </Button>
      </div>

      <Dialog open={open === "approve"} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve {application.name}?</DialogTitle>
            <DialogDescription>
              Activates the therapist account and queues the welcome email.
              They&apos;ll be prompted to set up plan preferences and visibility.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Email preview</p>
            <p>Subject: Welcome to Mindenity, {application.name}</p>
            <p className="mt-1">
              Hi {application.name.split(" ").slice(-1)[0]}, your application has
              been approved…
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleAction("approve")}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open === "reject"} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject {application.name}?</DialogTitle>
            <DialogDescription>
              A rejection reason is required. The applicant will receive it with
              a resubmission link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="E.g. License document unreadable; please resubmit a higher-resolution scan."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleAction("reject")}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open === "info"} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request more info from {application.name}</DialogTitle>
            <DialogDescription>
              Add a message describing what&apos;s missing. Optional — applicant
              will be notified either way.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="info-message">Message (optional)</Label>
            <Textarea
              id="info-message"
              value={infoMessage}
              onChange={(e) => setInfoMessage(e.target.value)}
              placeholder="E.g. Could you confirm your specializations? Bio is short."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleAction("info")}>Send request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
