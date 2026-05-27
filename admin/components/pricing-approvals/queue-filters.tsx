"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ALL_PLAN_NAMES_FOR_FILTER } from "@/lib/dummy/pricing-approvals";

export function QueueFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const status = params.get("status") ?? "pending";

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value === "" || value === "all") next.delete(key);
    else next.set(key, value);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  };

  return (
    <div className="space-y-3">
      <Tabs value={status} onValueChange={(v) => setParam("status", v)}>
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="countered">Countered</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={params.get("region") ?? "all"}
          onValueChange={(v) => setParam("region", v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All regions</SelectItem>
            <SelectItem value="ng">Nigeria</SelectItem>
            <SelectItem value="intl">International</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={params.get("plan") ?? "all"}
          onValueChange={(v) => setParam("plan", v)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All plans</SelectItem>
            {ALL_PLAN_NAMES_FOR_FILTER.map((p) => (
              <SelectItem key={p} value={p.toLowerCase()}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
