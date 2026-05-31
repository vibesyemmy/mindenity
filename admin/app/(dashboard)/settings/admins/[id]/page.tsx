import { notFound } from "next/navigation";

import { AdminProfile } from "@/components/settings/admin-profile";
import {
  getAdminUser,
  getAuditEntriesByAdmin,
  getCapabilities,
} from "@/lib/dummy/settings";

type Params = Promise<{ id: string }>;

export default async function AdminProfilePage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const admin = getAdminUser(id);
  if (!admin) notFound();

  const activity = getAuditEntriesByAdmin(admin.name, 25);
  const capabilities = getCapabilities();

  return (
    <AdminProfile admin={admin} activity={activity} capabilities={capabilities} />
  );
}
