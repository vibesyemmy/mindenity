"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import type { AdminUser } from "@/lib/dummy/settings";

export function InviteAdminButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Admin" | "Super Admin" | "Read-only">("Admin");
  const [note, setNote] = useState("");

  const handleInvite = () => {
    if (!email.includes("@") || email.length < 5) {
      return toast.error("Enter a valid email address");
    }
    toast.success(`Invitation sent to ${email}`, {
      description: `${role} role · they'll receive a sign-in link.`,
    });
    setOpen(false);
    setEmail("");
    setNote("");
    setRole("Admin");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="size-4 mr-1" />
          Invite admin
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite admin</DialogTitle>
          <DialogDescription>
            Send a sign-in link to a colleague. They&apos;ll set up 2FA on first
            login.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@mindenity.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-role">Role</Label>
            <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
              <SelectTrigger id="invite-role" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Super Admin">Super Admin</SelectItem>
                <SelectItem value="Read-only">Read-only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="invite-note">Personal note (optional)</Label>
            <Textarea
              id="invite-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Welcome to the ops team — ping me with any questions."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleInvite}>Send invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type DeactivateProps = {
  target: AdminUser | null;
  onOpenChange: (open: boolean) => void;
};

export function DeactivateAdminDialog({ target, onOpenChange }: DeactivateProps) {
  const handleConfirm = () => {
    if (!target) return;
    toast.success(`${target.name} suspended`, {
      description: "They lose access immediately. Reactivate by re-inviting.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={target !== null} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Suspend {target?.name}?</DialogTitle>
          <DialogDescription>
            They lose admin access immediately. To restore, re-invite them with
            the same email — their audit history is preserved.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Suspend admin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
