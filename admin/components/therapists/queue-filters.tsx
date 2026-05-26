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

export function QueueFilters() {
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
        placeholder="Search applicants…"
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
        value={params.get("aiFlag") ?? "all"}
        onValueChange={(v) => setParam("aiFlag", v)}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="AI flag" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All flags</SelectItem>
          <SelectItem value="flagged">Flagged</SelectItem>
          <SelectItem value="clean">Clean</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
