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

import {
  ALL_ACTION_TYPES,
  getAdminsForFilter,
} from "@/lib/dummy/settings";

export function AuditFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [, startTransition] = useTransition();
  const admins = getAdminsForFilter();

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
        placeholder="Search by target…"
        defaultValue={params.get("q") ?? ""}
        onChange={(e) => setParam("q", e.target.value)}
        className="w-[240px]"
      />

      <Select
        value={params.get("adminId") ?? "all"}
        onValueChange={(v) => setParam("adminId", v)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Admin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All admins</SelectItem>
          {admins.map((a) => (
            <SelectItem key={a.id} value={a.id}>
              {a.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.get("action") ?? "all"}
        onValueChange={(v) => setParam("action", v)}
      >
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Action" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All actions</SelectItem>
          {ALL_ACTION_TYPES.map((a) => (
            <SelectItem key={a} value={a}>
              {a}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={params.get("range") ?? "all"}
        onValueChange={(v) => setParam("range", v)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Date range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
