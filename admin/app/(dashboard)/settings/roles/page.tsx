import Link from "next/link";

import { Button } from "@/components/ui/button";

import { RoleMatrix } from "@/components/settings/role-matrix";

export default function RolePermissionsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-1">
          <h1 className="font-heading text-3xl tracking-tight">
            Role permissions
          </h1>
          <p className="text-sm text-muted-foreground">
            What each role can do across the admin console.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/settings">← Admin users</Link>
        </Button>
      </header>

      <RoleMatrix />
    </div>
  );
}
