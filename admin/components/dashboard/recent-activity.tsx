import Link from "next/link";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { ActivityItem } from "@/lib/dummy/types";

type Props = {
  items: ActivityItem[];
};

export function RecentActivity({ items }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Audit</CardDescription>
        <CardTitle>Recent admin activity</CardTitle>
        <CardAction>
          <Button asChild variant="ghost" size="sm">
            <Link href="/audit-log">Open audit log →</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent activity.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-baseline justify-between gap-3"
              >
                <span>
                  <span className="font-medium">{item.actor}</span>{" "}
                  {item.action}{" "}
                  <span className="text-muted-foreground">{item.target}</span>
                </span>
                <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                  {item.timestampAgo}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
