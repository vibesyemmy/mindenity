import Link from "next/link";
import { ChevronRight } from "lucide-react";

import {
  formatDate,
  getActionItems,
  type ActionItem,
} from "@/lib/dummy/compliance";

const priorityDot: Record<ActionItem["priority"], string> = {
  high: "bg-destructive",
  medium: "bg-amber-500",
  low: "bg-muted-foreground/40",
};

export function ActionItemsList() {
  const items = getActionItems();

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No outstanding action items. Nice.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-3 rounded-md border border-border/60 px-3 py-2"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span
              aria-hidden
              className={`size-2 shrink-0 rounded-full ${priorityDot[item.priority]}`}
              title={`${item.priority} priority`}
            />
            <div className="min-w-0">
              <p className="text-sm">{item.description}</p>
              <p className="text-xs text-muted-foreground">
                Due {formatDate(item.dueDate)} · {item.owner}
              </p>
            </div>
          </div>
          <Link
            href={item.href}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-0.5"
          >
            Open <ChevronRight className="size-3" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
