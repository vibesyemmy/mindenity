"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Check,
  KeyRound,
  Laptop,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

type Props = {
  admin: AdminUser;
  activity: AuditEntry[];
  capabilities: Capability[];
};

type Session = {
  id: string;
  device: string;
  location: string;
  lastSeen: string;
  current: boolean;
  os: "macos" | "ios" | "windows" | "android";
};

const SESSIONS: Session[] = [
  {
    id: "s-1",
    device: "MacBook Pro · Chrome 142",
    location: "Lagos, NG · 102.89.4.122",
    lastSeen: "Active now",
    current: true,
    os: "macos",
  },
  {
    id: "s-2",
    device: "iPhone 16 Pro · Safari",
    location: "Lagos, NG · 102.89.4.187",
    lastSeen: "2h ago",
    current: false,
    os: "ios",
  },
  {
    id: "s-3",
    device: "MacBook Pro · Chrome 141",
    location: "Lagos, NG · 102.89.4.93",
    lastSeen: "8d ago",
    current: false,
    os: "macos",
  },
];

const NOTIFICATION_DEFAULTS = {
  crisis: true,
  verifications: true,
  pricing: true,
  payouts: false,
  digest: true,
  weekly: false,
};

export function ProfilePage({ admin, activity, capabilities }: Props) {
  const [displayName, setDisplayName] = useState(admin.name);
  const [pwOpen, setPwOpen] = useState(false);
  const [twofaOpen, setTwofaOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATION_DEFAULTS);
  const enabledCaps = capabilities.filter((c) => c.defaults[admin.role]);

  const handleSaveProfile = () => {
    if (displayName.trim().length < 2) {
      toast.error("Display name must be at least 2 characters.");
      return;
    }
    toast.success("Profile saved");
  };

  const handleSignOut = (s: Session) => {
    if (s.current) return;
    toast.success(`Signed out ${s.device}`);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <span
            aria-hidden
            className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-muted text-base font-semibold"
          >
            {admin.initials}
          </span>
          <div className="space-y-1.5">
            <h1 className="font-heading text-3xl tracking-tight">My profile</h1>
            <p className="text-sm text-muted-foreground">
              Signed in as {admin.name} · {admin.email}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm pt-1">
              <Badge variant={roleVariant[admin.role]}>{admin.role}</Badge>
              <Badge variant="secondary">{admin.status}</Badge>
            </div>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/login">Sign out</Link>
        </Button>
      </header>

      <StatCardGrid columns={4}>
        <StatCard label="Last sign-in" value={formatRelative(admin.lastActiveAt)} />
        <StatCard label="Member since" value={formatDate(admin.invitedAt)} />
        <StatCard label="Active sessions" value={SESSIONS.length.toString()} />
        <StatCard
          label="Permissions"
          value={`${enabledCaps.length} / ${capabilities.length}`}
          sub="capabilities granted"
        />
      </StatCardGrid>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={admin.email} disabled />
              <p className="text-xs text-muted-foreground">
                Email changes need a super-admin in{" "}
                <Link
                  href={`/settings/admins/${admin.id}`}
                  className="text-foreground underline-offset-4 hover:underline"
                >
                  Admin users
                </Link>
                .
              </p>
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <div>
                <Badge variant={roleVariant[admin.role]}>{admin.role}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Role is assigned by a super-admin.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div>
                <Badge variant="secondary">{admin.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Member since {formatDate(admin.invitedAt)}.
              </p>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile}>Save profile</Button>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="security" className="pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-md border border-border/60 px-4 py-3">
            <div className="flex items-start gap-3">
              <KeyRound className="size-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Password</p>
                <p className="text-xs text-muted-foreground">
                  Last changed 62 days ago.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setPwOpen(true)}>
              Change password
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-md border border-border/60 px-4 py-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="size-4 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-sm font-medium">Two-factor authentication</p>
                <p className="text-xs text-muted-foreground">
                  Enabled · Authenticator app + 8 recovery codes remaining.
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setTwofaOpen(true)}>
              Manage 2FA
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Active sessions
            </p>
            <ul className="space-y-2">
              {SESSIONS.map((s) => {
                const Icon = s.os === "ios" ? Smartphone : Laptop;
                return (
                  <li
                    key={s.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-md border border-border/60 px-3 py-2"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="size-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {s.device}
                          {s.current && (
                            <Badge variant="secondary" className="ml-2 font-normal">
                              This device
                            </Badge>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {s.location} · {s.lastSeen}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={s.current}
                      onClick={() => handleSignOut(s)}
                      className="text-destructive hover:text-destructive"
                    >
                      Sign out
                    </Button>
                  </li>
                );
              })}
            </ul>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="notifications" className="pt-4">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(
            [
              ["crisis", "Crisis alerts", "Push + email when a client triggers Crisis Support."],
              ["verifications", "Therapist verifications", "Notify when a new application is pending review."],
              ["pricing", "Pricing approvals", "Notify on out-of-band pricing requests."],
              ["payouts", "Payout runs", "Notify when a monthly payout batch completes."],
              ["digest", "Daily digest email", "End-of-day summary of admin queues."],
              ["weekly", "Weekly summary email", "Friday recap of key metrics."],
            ] as const
          ).map(([key, title, desc]) => (
            <div
              key={key}
              className="flex items-center justify-between gap-3 rounded-md border border-border/60 px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {desc}
                </p>
              </div>
              <Switch
                checked={notifications[key]}
                onCheckedChange={(v) =>
                  setNotifications((prev) => ({ ...prev, [key]: v === true }))
                }
              />
            </div>
          ))}
          <div className="flex justify-end pt-1">
            <Button onClick={() => toast.success("Notification preferences saved")}>
              Save preferences
            </Button>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="activity" className="pt-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent activity</CardTitle>
          <Button asChild variant="outline" size="sm">
            <Link href={`/settings/audit?admin=${encodeURIComponent(admin.name)}`}>
              Open audit log →
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No actions recorded yet.
            </p>
          ) : (
            <ul className="space-y-2">
              {activity.slice(0, 6).map((e) => (
                <li
                  key={e.id}
                  className="flex items-start justify-between gap-3 rounded-md border border-border/60 px-3 py-2"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-sm">
                      <Badge variant="outline" className="mr-2 font-normal">
                        {e.action}
                      </Badge>
                      <span className="text-muted-foreground">{e.target}</span>
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

      <Dialog open={pwOpen} onOpenChange={setPwOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change password</DialogTitle>
            <DialogDescription>
              You&apos;ll be asked for your 2FA code to confirm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="pw-current">Current password</Label>
              <Input id="pw-current" type="password" autoComplete="current-password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw-new">New password</Label>
              <Input id="pw-new" type="password" autoComplete="new-password" />
              <p className="text-xs text-muted-foreground">
                Min 12 characters · mix of letters, numbers, and symbols.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pw-confirm">Confirm new password</Label>
              <Input id="pw-confirm" type="password" autoComplete="new-password" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPwOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                toast.success("Password updated");
                setPwOpen(false);
              }}
            >
              Update password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={twofaOpen} onOpenChange={setTwofaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage two-factor authentication</DialogTitle>
            <DialogDescription>
              2FA is required for all admins. You can re-enrol an authenticator
              or regenerate recovery codes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2.5">
              <div className="flex items-center gap-3">
                <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="font-medium">Authenticator app</p>
                  <p className="text-xs text-muted-foreground">
                    Enrolled 04 Jan 2024.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">Re-enrol</Button>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2.5">
              <div className="flex items-center gap-3">
                <KeyRound className="size-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">Recovery codes</p>
                  <p className="text-xs text-muted-foreground">
                    8 of 10 codes unused.
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">Regenerate</Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTwofaOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
