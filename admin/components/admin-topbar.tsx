"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

// Routes that should NOT show a breadcrumb (top-level destinations where it's redundant).
const HIDE_BREADCRUMB_ON: ReadonlySet<string> = new Set(["/dashboard"]);

export function AdminTopBar() {
  const pathname = usePathname();
  const showBreadcrumb = !HIDE_BREADCRUMB_ON.has(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur lg:px-6">
      <SidebarTrigger />

      {showBreadcrumb && (
        <>
          <Separator orientation="vertical" className="h-6" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Mindenity Admin</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{pathname.replace(/^\//, "")}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </>
      )}

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
