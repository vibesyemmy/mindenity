import { notFound } from "next/navigation";

import { ProfilePage } from "@/components/profile/profile-page";
import {
  getAdminUser,
  getAuditEntriesByAdmin,
  getCapabilities,
} from "@/lib/dummy/settings";

// Hardcoded signed-in user for the prototype.
const CURRENT_ADMIN_ID = "u-001";

export default function MyProfilePage() {
  const admin = getAdminUser(CURRENT_ADMIN_ID);
  if (!admin) notFound();

  const activity = getAuditEntriesByAdmin(admin.name, 10);
  const capabilities = getCapabilities();

  return (
    <ProfilePage admin={admin} activity={activity} capabilities={capabilities} />
  );
}
