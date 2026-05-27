"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type { Promotion } from "@/lib/dummy/promotions";

type Props = {
  promotion: Promotion;
};

export function DeleteDialog({ promotion }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    toast.success(`Promotion "${promotion.name}" deleted`, {
      description: "Active subscriptions stop receiving the discount immediately.",
    });
    setOpen(false);
    router.push("/promotions");
  };

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        <Trash2 className="size-3.5 mr-1" />
        Delete
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete &quot;{promotion.name}&quot;?</DialogTitle>
            <DialogDescription>
              Active subscriptions stop receiving the discount immediately. This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
