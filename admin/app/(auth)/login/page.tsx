"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Dummy creds for clickthrough prototype. Replace with real auth later.
const VALID_EMAIL = "admin@mindenity.com";
const VALID_PASSWORD = "admin123";

type LoginState = "idle" | "submitting" | "invalid" | "locked";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [state, setState] = useState<LoginState>("idle");
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "locked") return;

    setState("submitting");

    // Fake network latency for realism.
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      router.push("/2fa");
      return;
    }

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    setState(nextAttempts >= 5 ? "locked" : "invalid");
  };

  const showError = state === "invalid" || state === "locked";

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-heading tracking-tight">
          Sign in to admin
        </CardTitle>
        <CardDescription>
          Use your Mindenity admin email. 2FA required after sign in.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <CardContent className="space-y-5">
          {showError && (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {state === "locked"
                ? "Too many attempts. Account locked. Reset your password or contact a super-admin."
                : "Email or password is incorrect. Try again."}
            </div>
          )}

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
              disabled={state === "submitting" || state === "locked"}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={state === "submitting" || state === "locked"}
            />
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="remember"
              checked={remember}
              onCheckedChange={(value) => setRemember(value === true)}
              disabled={state === "submitting" || state === "locked"}
            />
            <Label
              htmlFor="remember"
              className="text-sm font-normal text-muted-foreground leading-snug"
            >
              Remember this device for 7 days
            </Label>
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={state === "submitting" || state === "locked"}
          >
            {state === "submitting" ? "Signing in…" : "Sign in"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Admin accounts are invite-only. Need access?{" "}
            <Link
              href="mailto:ops@mindenity.com"
              className="underline-offset-4 hover:underline text-foreground"
            >
              Ask ops
            </Link>
            .
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
