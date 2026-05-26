"use client";

import { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";

import type { PlanPricing } from "@/lib/dummy/plans";

type Props = {
  plan: PlanPricing | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function priceToInput(amount: number, currency: PlanPricing["currency"]): string {
  return (amount / 100).toString();
}

export function PricingEditDialog({ plan, open, onOpenChange }: Props) {
  const [basePrice, setBasePrice] = useState("");
  const [minBand, setMinBand] = useState("");
  const [maxBand, setMaxBand] = useState("");
  const [sessions, setSessions] = useState("");
  const [active, setActive] = useState(true);

  useEffect(() => {
    if (!plan) return;
    setBasePrice(priceToInput(plan.basePrice, plan.currency));
    setMinBand(priceToInput(plan.minBand, plan.currency));
    setMaxBand(priceToInput(plan.maxBand, plan.currency));
    setSessions(plan.sessionsPerMonth.toString());
    setActive(plan.active);
  }, [plan]);

  if (!plan) return null;

  const currencyPrefix = plan.currency === "NGN" ? "₦" : "$";

  const handleSubmit = () => {
    const base = Number(basePrice);
    const min = Number(minBand);
    const max = Number(maxBand);
    const sess = Number(sessions);

    if (!base || base <= 0) return toast.error("Base price must be greater than 0");
    if (min < 0) return toast.error("Min band cannot be negative");
    if (min > base) return toast.error("Min band cannot be greater than base price");
    if (max <= base) return toast.error("Max band must be greater than base price");
    if (plan.type === "Subscription" && (!sess || sess <= 0)) {
      return toast.error("Sessions/month must be greater than 0 for subscription plans");
    }

    toast.success(`${plan.planName} updated`, {
      description: `${currencyPrefix}${min.toLocaleString()} – ${currencyPrefix}${base.toLocaleString()} – ${currencyPrefix}${max.toLocaleString()} · ${active ? "active" : "paused"}`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {plan.planName}</DialogTitle>
          <DialogDescription>
            {plan.segment} · {plan.type} · {plan.currency}. Therapists may set
            prices within the band; out-of-band requests route to approval.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="base">Base price ({currencyPrefix})</Label>
              <Input
                id="base"
                type="number"
                step="1"
                min="0"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min">Min band</Label>
              <Input
                id="min"
                type="number"
                step="1"
                min="0"
                value={minBand}
                onChange={(e) => setMinBand(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="max">Max band</Label>
              <Input
                id="max"
                type="number"
                step="1"
                min="0"
                value={maxBand}
                onChange={(e) => setMaxBand(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sessions">Sessions/month</Label>
            <Input
              id="sessions"
              type="number"
              step="1"
              min="0"
              value={sessions}
              onChange={(e) => setSessions(e.target.value)}
              disabled={plan.type === "PAYG"}
              placeholder={plan.type === "PAYG" ? "PAYG — not applicable" : ""}
            />
          </div>

          <div className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2">
            <div>
              <p className="text-sm font-medium">Active</p>
              <p className="text-xs text-muted-foreground">
                When off, plan is hidden from clients in this region.
              </p>
            </div>
            <Switch checked={active} onCheckedChange={setActive} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
