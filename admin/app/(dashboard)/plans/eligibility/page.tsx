import Link from "next/link";

import { Button } from "@/components/ui/button";

import { EligibilityMatrix } from "@/components/plans/eligibility-matrix";

export default function EligibilityPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            Plan-tier eligibility
          </h1>
          <p className="text-sm text-muted-foreground">
            Which therapist tiers can accept which plans per region (US-029).
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/plans">← Back to plans</Link>
        </Button>
      </header>

      <EligibilityMatrix />
    </div>
  );
}
