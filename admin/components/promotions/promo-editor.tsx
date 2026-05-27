"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";

import { DeleteDialog } from "@/components/promotions/delete-dialog";

import {
  ALL_PLAN_NAMES_FOR_PROMOTIONS,
  formatDateTimeForInput,
  getPromotionStatus,
  type Promotion,
  type DiscountType,
  type RegionScope,
  type Currency,
} from "@/lib/dummy/promotions";

type Props = {
  promotion?: Promotion;
};

const statusVariant: Record<
  ReturnType<typeof getPromotionStatus>,
  "secondary" | "outline" | "destructive"
> = {
  Scheduled: "outline",
  Active: "secondary",
  Ended: "destructive",
};

export function PromoEditor({ promotion }: Props) {
  const router = useRouter();
  const isEdit = !!promotion;

  const [name, setName] = useState(promotion?.name ?? "");
  const [discountType, setDiscountType] = useState<DiscountType>(
    promotion?.discountType ?? "percent"
  );
  const [discountValue, setDiscountValue] = useState(
    promotion
      ? promotion.discountType === "percent"
        ? promotion.discountValue.toString()
        : (promotion.discountValue / 100).toString()
      : ""
  );
  const [flatCurrency, setFlatCurrency] = useState<Currency>(
    promotion?.flatCurrency ?? "NGN"
  );
  const [region, setRegion] = useState<RegionScope>(promotion?.region ?? "NGN");
  const [plans, setPlans] = useState<string[]>(
    promotion?.applicablePlans ?? []
  );
  const [startAt, setStartAt] = useState(
    promotion ? formatDateTimeForInput(promotion.startAt) : ""
  );
  const [endAt, setEndAt] = useState(
    promotion ? formatDateTimeForInput(promotion.endAt) : ""
  );

  const togglePlan = (plan: string) => {
    setPlans((prev) =>
      prev.includes(plan) ? prev.filter((p) => p !== plan) : [...prev, plan]
    );
  };

  const selectAllPlans = () => setPlans([...ALL_PLAN_NAMES_FOR_PROMOTIONS]);
  const clearPlans = () => setPlans([]);

  const handleSubmit = () => {
    if (name.trim().length < 3) {
      return toast.error("Promotion name must be at least 3 characters");
    }
    const v = Number(discountValue);
    if (!v || v <= 0) return toast.error("Discount value must be greater than 0");
    if (discountType === "percent" && v > 100) {
      return toast.error("Percent discount cannot exceed 100");
    }
    if (plans.length === 0) {
      return toast.error("Select at least one applicable plan");
    }
    if (!startAt) return toast.error("Set a start date and time");
    if (!endAt) return toast.error("Set an end date and time");
    if (new Date(endAt).getTime() <= new Date(startAt).getTime()) {
      return toast.error("End date must be after start date");
    }
    toast.success(
      isEdit
        ? `Promotion "${name}" updated`
        : `Promotion "${name}" scheduled`,
      {
        description: `${plans.length} plan${plans.length === 1 ? "" : "s"} · ${region} · ${discountType === "percent" ? `${v}% off` : `${flatCurrency} ${v} off`}`,
      }
    );
    router.push("/promotions");
  };

  // Static dummy reachable estimate
  const estimatedReachable =
    plans.length * (region === "Both" ? 60 : 35) + 20;
  const startTs = startAt ? new Date(startAt).getTime() : 0;
  const endTs = endAt ? new Date(endAt).getTime() : 0;
  const windowDays =
    startTs && endTs && endTs > startTs
      ? Math.round((endTs - startTs) / (24 * 60 * 60 * 1000))
      : 0;

  return (
    <div className="space-y-6">
      <Link
        href="/promotions"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Promotions
      </Link>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            {isEdit ? "Edit promotion" : "New promotion"}
          </h1>
          {isEdit && promotion && (
            <Badge variant={statusVariant[getPromotionStatus(promotion)]}>
              {getPromotionStatus(promotion)}
            </Badge>
          )}
        </div>
        {isEdit && promotion && <DeleteDialog promotion={promotion} />}
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Basics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Promotion name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. May NG Onboarding"
            />
          </div>

          <div className="space-y-2">
            <Label>Discount type</Label>
            <RadioGroup
              value={discountType}
              onValueChange={(v) => setDiscountType(v as DiscountType)}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="percent" id="d-percent" />
                <Label htmlFor="d-percent" className="font-normal">
                  Percent off
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="flat" id="d-flat" />
                <Label htmlFor="d-flat" className="font-normal">
                  Flat amount off
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="value">
                Discount value{" "}
                {discountType === "percent"
                  ? "(1–100)"
                  : `(${flatCurrency === "NGN" ? "₦" : "$"})`}
              </Label>
              <Input
                id="value"
                type="number"
                step="1"
                min="0"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
              />
            </div>
            {discountType === "flat" && (
              <div className="space-y-2">
                <Label>Flat currency</Label>
                <RadioGroup
                  value={flatCurrency}
                  onValueChange={(v) => setFlatCurrency(v as Currency)}
                  className="flex gap-4 pt-2"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="NGN" id="c-ngn" />
                    <Label htmlFor="c-ngn" className="font-normal">
                      NGN
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="USD" id="c-usd" />
                    <Label htmlFor="c-usd" className="font-normal">
                      USD
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Region</Label>
            <RadioGroup
              value={region}
              onValueChange={(v) => setRegion(v as RegionScope)}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="NGN" id="r-ngn" />
                <Label htmlFor="r-ngn" className="font-normal">
                  Nigeria (NGN)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="USD" id="r-usd" />
                <Label htmlFor="r-usd" className="font-normal">
                  International (USD)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Both" id="r-both" />
                <Label htmlFor="r-both" className="font-normal">
                  Both
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Applicable plans</CardTitle>
          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={selectAllPlans}
              className="text-muted-foreground hover:text-foreground"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={clearPlans}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {ALL_PLAN_NAMES_FOR_PROMOTIONS.map((plan) => (
              <div key={plan} className="flex items-center gap-2">
                <Checkbox
                  id={`plan-${plan}`}
                  checked={plans.includes(plan)}
                  onCheckedChange={() => togglePlan(plan)}
                />
                <Label
                  htmlFor={`plan-${plan}`}
                  className="font-normal cursor-pointer"
                >
                  {plan}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Window</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="start">Start</Label>
              <Input
                id="start"
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End</Label>
              <Input
                id="end"
                type="datetime-local"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
              />
            </div>
          </div>
          {startTs > 0 && endTs > 0 && endTs <= startTs && (
            <p className="text-xs text-destructive mt-2">
              End date must be after start date.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Impact preview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            <span className="font-medium tabular-nums">~{estimatedReachable}</span>{" "}
            active subscribers reachable · {plans.length} plan
            {plans.length === 1 ? "" : "s"} ·{" "}
            {windowDays > 0 ? `${windowDays}d window` : "Window not set"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Static estimate based on selected plans + region. Real impact
            calculated at promo launch.
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="outline">
          <Link href="/promotions">Cancel</Link>
        </Button>
        <Button onClick={handleSubmit}>
          {isEdit ? "Save changes" : "Save & schedule"}
        </Button>
      </div>
    </div>
  );
}
