"use client";

import { useState } from "react";
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
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

import type { Client, PaymentRecord } from "@/lib/dummy/clients";
import { formatMoney } from "@/components/clients/client-list-columns";

type Props = {
  client: Client;
  payment: PaymentRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RefundDialog({ client, payment, open, onOpenChange }: Props) {
  const [refundType, setRefundType] = useState<"full" | "partial">("full");
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  if (!payment) return null;

  const fullAmount = (payment.amount / 100).toFixed(2);
  const handleSubmit = () => {
    const parsed = refundType === "full" ? Number(fullAmount) : Number(amount);
    if (refundType === "partial" && (!parsed || parsed <= 0 || parsed > Number(fullAmount))) {
      toast.error(`Enter a partial amount between 0 and ${fullAmount}.`);
      return;
    }
    if (reason.trim().length < 5) {
      toast.error("Add a refund reason of at least 5 characters.");
      return;
    }
    toast.success(`Refund issued for ${client.alias}`, {
      description: `${refundType === "full" ? "Full" : "Partial"} refund of ${payment.currency} ${parsed.toFixed(2)} queued via ${payment.method}.`,
    });
    onOpenChange(false);
    setRefundType("full");
    setAmount("");
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refund payment</DialogTitle>
          <DialogDescription>
            Issue a refund for {client.alias}. Funds return via the original
            payment method.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-sm">
            <p className="font-medium">{payment.description}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(payment.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              · {formatMoney(payment.amount, payment.currency)} ·{" "}
              {payment.method} · •••• {payment.last4}
            </p>
          </div>

          <div className="space-y-2">
            <Label>Refund type</Label>
            <RadioGroup
              value={refundType}
              onValueChange={(v) => setRefundType(v as "full" | "partial")}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="full" id="r-full" />
                <Label htmlFor="r-full" className="font-normal">
                  Full ({payment.currency} {fullAmount})
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="partial" id="r-partial" />
                <Label htmlFor="r-partial" className="font-normal">
                  Partial
                </Label>
              </div>
            </RadioGroup>
          </div>

          {refundType === "partial" && (
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ({payment.currency})</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={fullAmount}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={`Up to ${fullAmount}`}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.g. Session canceled by therapist; client requested refund."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Issue refund</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
