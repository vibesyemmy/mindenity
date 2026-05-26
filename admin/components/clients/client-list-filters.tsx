"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ALL_PLAN_NAMES } from "@/lib/dummy/clients";

export function ClientListFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value === "" || value === "all") next.delete(key);
    else next.set(key, value);
    startTransition(() => {
      router.replace(`${pathname}?${next.toString()}`);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Input
        type="search"
        placeholder="Search by alias, name, email…"
        defaultValue={params.get("q") ?? ""}
        onChange={(e) => setParam("q", e.target.value)}
        className="w-[280px]"
      />

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
          {ALL_PLAN_NAMES.map((p) => (
            <SelectItem key={p} value={p.toLowerCase()}>
              {p}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.get("status") ?? "all"}
        onValueChange={(v) => setParam("status", v)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="past-due">Past-due</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
          <SelectItem value="lapsed">Lapsed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
