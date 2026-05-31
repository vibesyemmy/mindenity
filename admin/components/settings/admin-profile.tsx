"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, X, Pencil } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { StatCard, StatCardGrid } from "@/components/stat-card";

import {
  formatDate,
  formatRelative,
  type AdminRole,
  type AdminUser,
  type AuditEntry,
  type Capability,
} from "@/lib/dummy/settings";

const roleVariant: Record<AdminRole, "default" | "secondary" | "outline"> = {
  "Super Admin": "default",
  Admin: "secondary",
  "Read-only": "outline",
};

const statusVariant: Record<
  AdminUser["status"],
  "secondary" | "destructive" | "outline"
> = {
  Active: "secondary",
  Suspended: "destructive",
  Invited: "outline",
};

type Props = {
  admin: AdminUser;
  activity: AuditEntry[];
  capabilities: Capability[];
};

function statusForLastActive(iso: string, status: AdminUser["status"]): string {
  if (status === "Invited") return "Never signed in";
  return formatRelative(iso);
}

export function AdminProfile({ admin, activity, capabilities }: Props) {
  const [editOpen, setEditOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState<AdminRole>(admin.role);
  const [suspendOpen, setSuspendOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");

  const handleEditRole = () => {
    if (pendingRole === admin.role) {
      toast.info("No role change");
      setEditOpen(false);
      return;
    }
    toast.success(`${admin.name}'s role updated to ${pendingRole}`, {
      description: "Applies on their next login.",
    });
    setEditOpen(false);
  };

  const handleSuspend = () => {
    if (suspendReason.trim().length < 5) {
      toast.error("Add a suspension reason of at least 5 characters.");
      return;
    }
    toast.success(`${admin.name} suspended`, {
      description: "Login revoked. They can be reinstated by a super-admin.",
    });
    setSuspendOpen(false);
    setSuspendReason("");
  };

  const enabledCaps = capabilities.filter((c) => c.defaults[admin.role]);
  const disabledCaps = capabilities.filter((c) => !c.defaults[admin.role]);

  return (
    <div className="space-y-6">
      <Link
        href="/settings"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Admin users
      </Link>

      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-muted text-base font-semibold"
          >
            {admin.initials}
          </span>
          <div className="space-y-1.5">
            <h1 className="font-heading text-3xl tracking-tight">
              {admin.name}
            </h1>
            <p className="text-sm text-muted-foreground">{admin.email}</p>
            <div className="flex flex-wrap items-center gap-2 text-sm pt-1">
              <Badge variant={roleVariant[admin.role]}>{admin.role}</Badge>
              <Badge variant={statusVariant[admin.status]}>{admin.status}</Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setEditOpen(true)}>
            <Pencil className="size-3.5 mr-1" />
            Edit role
          </Button>
          <Button
            variant="destructive"
            onClick={() => setSuspendOpen(true)}
            disabled={admin.status !== "Active"}
          >
            Suspend
          </Button>
        </div>
      </header>

      <StatCardGrid columns={4}>
        <StatCard label="Last active" value={statusForLastActive(admin.lastActiveAt, admin.status)} />
        <StatCard label="Invited" value={formatDate(admin.invitedAt)} />
        <StatCard label="Recent actions (audit)" value={activity.length.toString()} />
        <StatCard
          label="Permissions"
          value={`${enabledCaps.length} / ${capabilities.length}`}
          sub="capabilities granted"
        />
      </StatCardGrid>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Name:</span>{" "}
                  <span className="font-medium">{admin.name}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Email:</span>{" "}
                  {admin.email}
                </p>
                <p>
                  <span className="text-muted-foreground">Role:</span>{" "}
                  <Badge variant={roleVariant[admin.role]} className="ml-1">
                    {admin.role}
                  </Badge>
                </p>
                <p>
                  <span className="text-muted-foreground">Status:</span>{" "}
                  <Badge
                    variant={statusVariant[admin.status]}
                    className="ml-1"
                  >
                    {admin.status}
                  </Badge>
                </p>
                <p>
                  <span className="text-muted-foreground">Invited:</span>{" "}
                  {formatDate(admin.invitedAt)}
                </p>
                <p>
                  <span className="text-muted-foreground">Last active:</span>{" "}
                  {statusForLastActive(admin.lastActiveAt, admin.status)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <Button asChild variant="outline" size="sm" className="w-full justify-between">
                  <Link href={`/settings/audit?admin=${encodeURIComponent(admin.name)}`}>
                    <span>Open in audit log</span>
                    <span aria-hidden>→</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full justify-between">
                  <Link href="/settings/roles">
                    <span>View role permissions matrix</span>
                    <span aria-hidden>→</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="w-full justify-between">
                  <Link href={`mailto:${admin.email}`}>
                    <span>Email {admin.name.split(" ")[0]}</span>
                    <span aria-hidden>→</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Permissions granted to {admin.role}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {capabilities.map((c) => {
                  const on = c.defaults[admin.role];
                  return (
                    <li
                      key={c.id}
                      className="flex items-start justify-between gap-3 rounded-md border border-border/60 px-3 py-2"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-sm font-medium">{c.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.description}
                        </p>
                      </div>
                      {on ? (
                        <Badge variant="secondary" className="shrink-0">
                          <Check className="size-3 mr-1" />
                          Granted
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="shrink-0 text-muted-foreground">
                          <X className="size-3 mr-1" />
                          Not granted
                        </Badge>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                Edit the matrix in{" "}
                <Link
                  href="/settings/roles"
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  Role permissions
                </Link>{" "}
                — changes apply to every {admin.role}.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4 pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent activity by {admin.name}</CardTitle>
              <Button asChild variant="outline" size="sm">
                <Link href={`/settings/audit?admin=${encodeURIComponent(admin.name)}`}>
                  Open full audit log →
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {activity.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No actions recorded for this admin yet.
                </p>
              ) : (
                <ul className="space-y-2">
                  {activity.map((e) => (
                    <li
                      key={e.id}
                      className="flex items-start justify-between gap-3 rounded-md border border-border/60 px-3 py-2"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-sm">
                          <Badge variant="outline" className="mr-2 font-normal">
                            {e.action}
                          </Badge>
                          <span className="text-muted-foreground">
                            {e.target}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {e.detail}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                        {formatRelative(e.timestamp)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit role for {admin.name}</DialogTitle>
            <DialogDescription>
              Role changes take effect on the admin&apos;s next login. Super
              Admin retains all permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="edit-role">Role</Label>
            <Select
              value={pendingRole}
              onValueChange={(v) => setPendingRole(v as AdminRole)}
            >
              <SelectTrigger id="edit-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
                <SelectItem value="Read-only">Read-only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRole}>Save role</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={suspendOpen} onOpenChange={setSuspendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suspend {admin.name}?</DialogTitle>
            <DialogDescription>
              Their login is revoked immediately. Audit history is preserved. A
              super-admin can reinstate them later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="suspend-reason">Reason (required)</Label>
            <Textarea
              id="suspend-reason"
              rows={3}
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="E.g. Off-boarded from ops team on 2026-05-31."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSuspendOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSuspend}>
              Suspend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
