import Link from "next/link";
import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ResidencyCard } from "@/components/compliance/residency-card";

import { getResidencyRegions } from "@/lib/dummy/compliance";

export default function ResidencyPage() {
  const regions = getResidencyRegions();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            Regional residency
          </h1>
          <p className="text-sm text-muted-foreground">
            Where each region&apos;s client + therapist data is stored and processed.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/compliance">← Compliance</Link>
        </Button>
      </header>

      <div className="flex items-center gap-3 rounded-md border border-border/60 bg-muted/40 px-4 py-3">
        <Info className="size-4 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Residency settings are read-only here. Changes require infrastructure
          team + DPO approval.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {regions.map((r) => (
          <ResidencyCard key={r.id} region={r} />
        ))}
      </div>
    </div>
  );
}
