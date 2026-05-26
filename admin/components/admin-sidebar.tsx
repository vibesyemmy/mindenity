"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserCircle2,
  CalendarClock,
  AlertOctagon,
  BadgeDollarSign,
  Receipt,
  Megaphone,
  Wallet,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "People",
    items: [
      { title: "Therapists", href: "/therapists", icon: Users },
      { title: "Clients", href: "/clients", icon: UserCircle2 },
    ],
  },
  {
    label: "Operations",
    items: [
      { title: "Sessions", href: "/sessions", icon: CalendarClock },
      { title: "Crisis log", href: "/crisis", icon: AlertOctagon },
      { title: "Pricing approvals", href: "/pricing-approvals", icon: BadgeDollarSign },
    ],
  },
  {
    label: "Money",
    items: [
      { title: "Plans & pricing", href: "/plans", icon: Receipt },
      { title: "Promotions", href: "/promotions", icon: Megaphone },
      { title: "Commission & payouts", href: "/commission", icon: Wallet },
    ],
  },
  {
    label: "Governance",
    items: [
      { title: "Compliance", href: "/compliance", icon: ShieldCheck },
      { title: "Settings & roles", href: "/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1.5">
          <span
            aria-hidden
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold"
          >
            M
          </span>
          <span className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-heading text-sm font-semibold tracking-tight">
              Mindenity
            </span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
              Admin
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {GROUPS.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" &&
                      pathname.startsWith(item.href));
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                      >
                        <Link href={item.href}>
                          <Icon className="size-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" tooltip="Adaeze · Super-admin">
              <span
                aria-hidden
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-foreground text-xs font-semibold"
              >
                AN
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-medium">Adaeze Nwosu</span>
                <span className="text-[10px] text-muted-foreground">
                  Super-admin
                </span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Sign out">
              <Link href="/login">
                <LogOut className="size-4" />
                <span>Sign out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
