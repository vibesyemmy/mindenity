"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type State = "idle" | "submitting" | "sent";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state !== "idle") return;
    setState("submitting");
    await new Promise((resolve) => setTimeout(resolve, 700));
    setState("sent");
  };

  if (state === "sent") {
    return (
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-heading tracking-tight">
            Check your inbox
          </CardTitle>
          <CardDescription>
            We sent a password reset link to{" "}
            <span className="text-foreground font-medium">{email}</span>. The link
            expires in 15 minutes.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border border-border/60 bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Didn’t get it? Check spam, or{" "}
            <button
              type="button"
              onClick={() => setState("idle")}
              className="text-foreground hover:underline underline-offset-4"
            >
              try a different email
            </button>
            .
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Back to sign in</Link>
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Still stuck?{" "}
            <Link
              href="mailto:ops@mindenity.com"
              className="underline-offset-4 hover:underline text-foreground"
            >
              Contact ops
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-heading tracking-tight">
          Reset your password
        </CardTitle>
        <CardDescription>
          Enter the admin email you sign in with. We’ll email a reset link.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@mindenity.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={state === "submitting"}
            />
          </div>

          <p className="text-xs text-muted-foreground">
            For security, we always show the same confirmation — even if the email
            isn’t in our system.
          </p>
        </CardContent>

        <CardFooter className="flex-col gap-3">
          <Button
            type="submit"
            className="w-full"
            disabled={state === "submitting" || email.trim().length < 5}
          >
            {state === "submitting" ? "Sending…" : "Send reset link"}
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/login">Back to sign in</Link>
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
