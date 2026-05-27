"use client";

import { useMemo, useState } from "react";

import { DataTable } from "@/components/therapists/data-table";

import { makeAdminColumns } from "@/components/settings/admin-columns";
import { DeactivateAdminDialog } from "@/components/settings/admin-actions";

import type { AdminUser } from "@/lib/dummy/settings";

type Props = {
  admins: AdminUser[];
};

export function AdminsList({ admins }: Props) {
  const [deactivateTarget, setDeactivateTarget] = useState<AdminUser | null>(null);

  const columns = useMemo(
    () => makeAdminColumns((u) => setDeactivateTarget(u)),
    []
  );

  return (
    <>
      <DataTable
        columns={columns}
        data={admins}
        emptyMessage="No admin users match these filters."
      />
      <DeactivateAdminDialog
        target={deactivateTarget}
        onOpenChange={(open) => {
          if (!open) setDeactivateTarget(null);
        }}
      />
    </>
  );
}
