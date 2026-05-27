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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  formatMoney,
  type PricingRequest,
} from "@/lib/dummy/pricing-approvals";

type Action = "approve" | "counter" | "reject";

type Props = {
  request: PricingRequest;
};

export function ActionBar({ request }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState<Action | null>(null);
  const [counterPrice, setCounterPrice] = useState(
    (request.basePrice / 100).toString()
  );
  const [counterNote, setCounterNote] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const currencyPrefix = request.currency === "NGN" ? "₦" : "$";
  const parsedCounter = Number(counterPrice);
  const counterMinor = Math.round(parsedCounter * 100);
  const counterWithinBand =
    counterMinor >= request.minBand && counterMinor <= request.maxBand;

  const handleAction = (action: Action) => {
    if (action === "approve") {
      toast.success(`Approved ${request.therapistName}'s ${request.planName} pricing`, {
        description: `Rate ${formatMoney(request.proposedPrice, request.currency)} takes effect immediately.`,
      });
    } else if (action === "counter") {
      if (!parsedCounter || parsedCounter <= 0) {
        toast.error("Counter price must be greater than 0");
        return;
      }
      if (counterNote.trim().length < 5) {
        toast.error("Add a counter note of at least 5 characters.");
        return;
      }
      toast.success(`Counter-offer sent to ${request.therapistName}`, {
        description: `Proposed ${currencyPrefix}${parsedCounter.toLocaleString()} (${counterWithinBand ? "within band" : "outside band"}).`,
      });
    } else {
      if (rejectReason.trim().length < 5) {
        toast.error("Add a rejection reason of at least 5 characters.");
        return;
      }
      toast.success(`Request rejected`, {
        description: `${request.therapistName} notified. They may resubmit.`,
      });
    }
    setOpen(null);
    router.push("/pricing-approvals");
  };

  return (
    <>
      <div className="sticky top-20 flex flex-col gap-2">
        <Button onClick={() => setOpen("approve")} className="w-full">
          Approve
        </Button>
        <Button
          variant="outline"
          onClick={() => setOpen("counter")}
          className="w-full"
        >
          Counter-offer
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
            <DialogTitle>
              Approve {request.therapistName}&apos;s {request.planName} pricing?
            </DialogTitle>
            <DialogDescription>
              Therapist&apos;s price of{" "}
              <span className="font-medium text-foreground">
                {formatMoney(request.proposedPrice, request.currency)}
              </span>{" "}
              will take effect immediately. They&apos;ll be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-xs text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">Snapshot</p>
            <p>Plan band: {formatMoney(request.minBand, request.currency)} – {formatMoney(request.maxBand, request.currency)}</p>
            <p>Base: {formatMoney(request.basePrice, request.currency)}</p>
            <p>Proposed: {formatMoney(request.proposedPrice, request.currency)}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleAction("approve")}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open === "counter"} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Counter {request.therapistName}&apos;s offer</DialogTitle>
            <DialogDescription>
              Propose an alternative price. The therapist receives this counter
              with your note and can accept, reject, or resubmit.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="counter-price">
                Counter price ({currencyPrefix})
              </Label>
              <Input
                id="counter-price"
                type="number"
                step="1"
                min="0"
                value={counterPrice}
                onChange={(e) => setCounterPrice(e.target.value)}
              />
              <div className="flex items-center gap-2 text-xs">
                <Badge
                  variant={counterWithinBand ? "secondary" : "destructive"}
                  className="font-normal"
                >
                  {counterWithinBand ? "Within band" : "Outside band"}
                </Badge>
                <span className="text-muted-foreground">
                  Band: {formatMoney(request.minBand, request.currency)} – {formatMoney(request.maxBand, request.currency)}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="counter-note">Note to therapist</Label>
              <Textarea
                id="counter-note"
                rows={3}
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                placeholder="E.g. We can offer top of band given your tier; let's revisit after next quarterly band review."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>
              Cancel
            </Button>
            <Button onClick={() => handleAction("counter")}>
              Send counter-offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open === "reject"} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject pricing request?</DialogTitle>
            <DialogDescription>
              The therapist receives your reason and can resubmit a revised request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason (required)</Label>
            <Textarea
              id="reject-reason"
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="E.g. Significantly above max band. Recommend tier upgrade before resubmitting."
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
    </>
  );
}
