import { AdminFilters } from "@/components/settings/admin-filters";
import { AdminsList } from "@/components/settings/admins-list";
import { InviteAdminButton } from "@/components/settings/admin-actions";
import { MoreActionsMenu } from "@/components/more-actions-menu";

import {
  getAdminUsers,
  getSettingsStats,
  type AdminFilters as AdminFilterShape,
} from "@/lib/dummy/settings";

type SearchParams = Promise<{
  q?: string;
  role?: string;
  status?: string;
}>;

function asFilters(p: Awaited<SearchParams>): AdminFilterShape {
  return {
    q: p.q,
    role: p.role as AdminFilterShape["role"],
    status: p.status as AdminFilterShape["status"],
  };
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = asFilters(params);
  const admins = getAdminUsers(filters);
  const stats = getSettingsStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">Admin users</h1>
          <p className="text-sm text-muted-foreground">
            {stats.activeAdmins} active · {stats.invitedAdmins} invited ·{" "}
            {stats.suspendedAdmins} suspended
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <MoreActionsMenu
            items={[
              { label: "Role permissions", href: "/settings/roles" },
              { label: "Audit log", href: "/settings/audit" },
            ]}
          />
          <InviteAdminButton />
        </div>
      </header>

      <AdminFilters />

      <AdminsList admins={admins} />
    </div>
  );
}
