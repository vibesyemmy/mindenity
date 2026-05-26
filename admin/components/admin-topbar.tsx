"use client";

import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Breadcrumbs intentionally omitted for now — the dashboard is the only built
// screen and it doesn't need one. When downstream screens want a breadcrumb
// we'll add a server-rendered per-page slot to avoid hydration mismatch.
export function AdminTopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur lg:px-6">
      <SidebarTrigger />

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>
        <button
          type="button"
          aria-label="Account menu"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold hover:bg-muted/70"
        >
          AN
        </button>
      </div>
    </header>
  );
}
