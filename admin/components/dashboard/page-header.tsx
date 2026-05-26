"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Region, Window } from "@/lib/dummy/types";

const WINDOW_LABELS: Record<Window, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  ytd: "Year to date",
};

type Props = {
  window: Window;
  region: Region;
  updatedLabel: string; // e.g. "Updated 2 min ago"
};

export function PageHeader({ window, region, updatedLabel }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const setParam = (key: "window" | "region", value: string) => {
    const next = new URLSearchParams(params);
    next.set(key, value);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  };

  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-1">
        <h1 className="font-heading text-3xl tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Mon, 26 May · Hello, Adaeze
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={window}
          onValueChange={(value) => setParam("window", value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.entries(WINDOW_LABELS) as [Window, string][]).map(
              ([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <Tabs
          value={region}
          onValueChange={(value) => setParam("region", value)}
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="ng">NG</TabsTrigger>
            <TabsTrigger value="intl">Int&apos;l</TabsTrigger>
          </TabsList>
        </Tabs>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Export</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>CSV (prototype)</DropdownMenuItem>
            <DropdownMenuItem disabled>PDF (prototype)</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="text-xs text-muted-foreground tabular-nums">
          {updatedLabel}
        </span>
      </div>
    </header>
  );
}
