"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
  ALL_TIER_LABELS,
  getAllTherapistsForOverride,
  type OverrideType,
  type TierLabel,
} from "@/lib/dummy/commission";

export function OverrideForm() {
  const therapists = getAllTherapistsForOverride();
  const [therapistId, setTherapistId] = useState("");
  const [type, setType] = useState<OverrideType>("Tier");
  const [tier, setTier] = useState<TierLabel | "">("");
  const [customPct, setCustomPct] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [reason, setReason] = useState("");

  const reset = () => {
    setTherapistId("");
    setType("Tier");
    setTier("");
    setCustomPct("");
    setExpiresAt("");
    setReason("");
  };

  const handleSubmit = () => {
    if (!therapistId) return toast.error("Select a therapist");
    if (type === "Tier" && !tier) return toast.error("Select an override tier");
    if (type === "Custom %") {
      const pct = Number(customPct);
      if (!pct || pct <= 0 || pct > 100) {
        return toast.error("Custom % must be between 0 and 100");
      }
    }
    if (!expiresAt) return toast.error("Set an expiry date");
    if (reason.trim().length < 10) {
      return toast.error("Reason must be at least 10 characters");
    }
    const therapist = therapists.find((t) => t.id === therapistId);
    toast.success(`Override applied for ${therapist?.name ?? therapistId}`, {
      description:
        type === "Tier"
          ? `Tier set to ${tier}. Expires ${expiresAt}.`
          : `Custom ${customPct}% set. Expires ${expiresAt}.`,
    });
    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New override</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="therapist">Therapist</Label>
          <Select value={therapistId} onValueChange={setTherapistId}>
            <SelectTrigger id="therapist" className="w-full">
              <SelectValue placeholder="Select therapist…" />
            </SelectTrigger>
            <SelectContent>
              {therapists.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Override type</Label>
          <RadioGroup
            value={type}
            onValueChange={(v) => setType(v as OverrideType)}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Tier" id="ov-tier" />
              <Label htmlFor="ov-tier" className="font-normal">
                Set tier (uses PRD tier ladder rate)
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="Custom %" id="ov-custom" />
              <Label htmlFor="ov-custom" className="font-normal">
                Custom % (bespoke rate)
              </Label>
            </div>
          </RadioGroup>
        </div>

        {type === "Tier" ? (
          <div className="space-y-2">
            <Label htmlFor="tier-select">Tier</Label>
            <Select value={tier} onValueChange={(v) => setTier(v as TierLabel)}>
              <SelectTrigger id="tier-select" className="w-[160px]">
                <SelectValue placeholder="Select tier…" />
              </SelectTrigger>
              <SelectContent>
                {ALL_TIER_LABELS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="custom-pct">Custom % (1–100)</Label>
            <Input
              id="custom-pct"
              type="number"
              step="0.5"
              min="0"
              max="100"
              value={customPct}
              onChange={(e) => setCustomPct(e.target.value)}
              placeholder="e.g. 90"
              className="w-[160px]"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="expires">Expires</Label>
          <Input
            id="expires"
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-[200px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Reason (audit log)</Label>
          <Textarea
            id="reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="E.g. On medical leave — freezing Tier+ status per US-046 sick-leave exemption."
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={reset}>
            Reset
          </Button>
          <Button onClick={handleSubmit}>Apply override</Button>
        </div>
      </CardContent>
    </Card>
  );
}
