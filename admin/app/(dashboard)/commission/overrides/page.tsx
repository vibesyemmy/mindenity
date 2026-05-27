import Link from "next/link";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

import { OverrideForm } from "@/components/commission/override-form";
import { ActiveOverridesTable } from "@/components/commission/active-overrides-table";

import { getActiveOverrides } from "@/lib/dummy/commission";

export default function OverridesPage() {
  const count = getActiveOverrides().length;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Tier overrides</h1>
          <p className="text-sm text-muted-foreground">
            Super-admin only · {count} active override{count === 1 ? "" : "s"} ·
            use sparingly
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/commission">← Commission</Link>
        </Button>
      </header>

      <div className="flex items-center gap-3 rounded-md border border-amber-500/40 bg-amber-50/60 dark:bg-amber-950/20 px-4 py-3">
        <AlertTriangle className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-sm">
          Overrides bypass automatic tier calculation. They&apos;re audited and
          reviewed monthly.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr]">
        <OverrideForm />
        <ActiveOverridesTable />
      </div>
    </div>
  );
}
