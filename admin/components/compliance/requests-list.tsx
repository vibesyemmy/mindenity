"use client";

import { useMemo, useState } from "react";

import { DataTable } from "@/components/therapists/data-table";
import { makeRequestColumns } from "@/components/compliance/request-columns";
import { RequestDrawer } from "@/components/compliance/request-drawer";

import type { SubjectRequest } from "@/lib/dummy/compliance";

type Props = {
  requests: SubjectRequest[];
};

export function RequestsList({ requests }: Props) {
  const [active, setActive] = useState<SubjectRequest | null>(null);

  const columns = useMemo(() => makeRequestColumns((r) => setActive(r)), []);

  return (
    <>
      <DataTable
        columns={columns}
        data={requests}
        emptyMessage="No requests in this view."
      />
      <RequestDrawer
        request={active}
        open={active !== null}
        onOpenChange={(open) => {
          if (!open) setActive(null);
        }}
      />
    </>
  );
}
