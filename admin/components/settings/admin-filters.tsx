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

export function AdminFilters() {
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
        placeholder="Search by name or email…"
        defaultValue={params.get("q") ?? ""}
        onChange={(e) => setParam("q", e.target.value)}
        className="w-[260px]"
      />

      <Select
        value={params.get("role") ?? "all"}
        onValueChange={(v) => setParam("role", v)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="super-admin">Super Admin</SelectItem>
          <SelectItem value="read-only">Read-only</SelectItem>
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
          <SelectItem value="suspended">Suspended</SelectItem>
          <SelectItem value="invited">Invited</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
