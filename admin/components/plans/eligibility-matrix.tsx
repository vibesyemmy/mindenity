"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  getEligibilityMatrix,
  ALL_PLAN_NAMES_ORDERED,
  ALL_TIERS_ORDERED,
  type EligibilityCell,
} from "@/lib/dummy/plans";

const REGIONS: Array<"NG" | "Int'l"> = ["NG", "Int'l"];

type CellKey = string; // `${plan}|${region}|${tier}`

function keyOf(c: { plan: string; region: "NG" | "Int'l"; tier: string }): CellKey {
  return `${c.plan}|${c.region}|${c.tier}`;
}

export function EligibilityMatrix() {
  const initial = getEligibilityMatrix();
  const [enabled, setEnabled] = useState<Record<CellKey, boolean>>(
    Object.fromEntries(initial.map((c) => [keyOf(c), c.enabled]))
  );
  const [notifyOnEnable, setNotifyOnEnable] = useState(false);

  const toggle = (cell: { plan: string; region: "NG" | "Int'l"; tier: string }) => {
    const key = keyOf(cell);
    setEnabled((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    const changed = Object.entries(enabled).filter(
      ([key, v]) => initial.find((c) => keyOf(c) === key)?.enabled !== v
    ).length;
    if (changed === 0) {
      toast.info("No changes to save");
      return;
    }
    toast.success(`Eligibility updated`, {
      description: `${changed} cell${changed === 1 ? "" : "s"} changed${notifyOnEnable ? " · therapists notified" : ""}.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border/60 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2} className="sticky left-0 bg-card z-10 align-bottom">
                Plan
              </TableHead>
              {REGIONS.map((region) => (
                <TableHead
                  key={region}
                  colSpan={ALL_TIERS_ORDERED.length}
                  className="text-center border-l border-border/40"
                >
                  {region === "NG" ? "Nigeria" : "International"}
                </TableHead>
              ))}
            </TableRow>
            <TableRow>
              {REGIONS.flatMap((region) =>
                ALL_TIERS_ORDERED.map((tier, idx) => (
                  <TableHead
                    key={`${region}-${tier}`}
                    className={`text-center text-xs ${idx === 0 ? "border-l border-border/40" : ""}`}
                  >
                    {tier}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {ALL_PLAN_NAMES_ORDERED.map((plan) => (
              <TableRow key={plan}>
                <TableCell className="sticky left-0 bg-card z-10 font-medium">
                  {plan}
                </TableCell>
                {REGIONS.flatMap((region) =>
                  ALL_TIERS_ORDERED.map((tier, idx) => {
                    const key = keyOf({ plan, region, tier });
                    return (
                      <TableCell
                        key={`${plan}-${region}-${tier}`}
                        className={`text-center ${idx === 0 ? "border-l border-border/40" : ""}`}
                      >
                        <Switch
                          checked={enabled[key]}
                          onCheckedChange={() => toggle({ plan, region, tier })}
                          aria-label={`${plan} · ${region} · ${tier}`}
                        />
                      </TableCell>
                    );
                  })
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between rounded-md border border-border/60 px-3 py-3">
        <div className="flex items-center gap-3">
          <Switch
            id="notify"
            checked={notifyOnEnable}
            onCheckedChange={setNotifyOnEnable}
          />
          <label
            htmlFor="notify"
            className="text-sm cursor-pointer select-none"
          >
            Notify therapists when re-enabling a previously disabled plan
          </label>
        </div>
        <Button onClick={handleSave}>Save changes</Button>
      </div>
    </div>
  );
}

// silence unused type re-export warning
export type _EligibilityCell = EligibilityCell;
