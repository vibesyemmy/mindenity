"use client";

import { useEffect, useState, type FormEvent } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const VALID_OTP = "000000";
const VALID_RECOVERY = "MIND-1234-RCVY";
const CODE_TTL_SECONDS = 60;

type Mode = "otp" | "recovery";
type State = "idle" | "submitting" | "invalid" | "expired";

export default function TwoFactorPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("otp");
  const [code, setCode] = useState("");
  const [recovery, setRecovery] = useState("");
  const [state, setState] = useState<State>("idle");
  const [secondsLeft, setSecondsLeft] = useState(CODE_TTL_SECONDS);

  // 60s countdown only relevant in OTP mode.
  useEffect(() => {
    if (mode !== "otp") return;
    if (secondsLeft <= 0) {
      setState("expired");
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [mode, secondsLeft]);

  const handleSwitchMode = (next: Mode) => {
    setMode(next);
    setState("idle");
    setCode("");
    setRecovery("");
    if (next === "otp") setSecondsLeft(CODE_TTL_SECONDS);
  };

  const handleResend = () => {
    setSecondsLeft(CODE_TTL_SECONDS);
    setState("idle");
    setCode("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    await new Promise((resolve) => setTimeout(resolve, 600));

    const valid =
      mode === "otp" ? code === VALID_OTP : recovery.toUpperCase() === VALID_RECOVERY;

    if (valid) {
      // Dashboard not built yet — land on root so we can wire later.
      router.push("/dashboard");
      return;
    }

    setState("invalid");
  };

  const showInvalid = state === "invalid";
  const showExpired = mode === "otp" && state === "expired";
  const disabled = state === "submitting" || showExpired;

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-heading tracking-tight">
          Two-factor verification
        </CardTitle>
        <CardDescription>
          {mode === "otp"
            ? "Enter the 6-digit code from your authenticator app."
            : "Enter one of your saved recovery codes."}
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
        <CardContent className="space-y-5">
          {showInvalid && (
            <div
              role="alert"
              className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {mode === "otp"
                ? "That code didn’t match. Check your authenticator and try again."
                : "Recovery code not recognised. Make sure you copied it exactly."}
            </div>
          )}

          {showExpired && (
            <div
              role="alert"
              className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300"
            >
              Code expired. Request a new one to continue.
            </div>
          )}

          {mode === "otp" ? (
            <div className="space-y-3">
              <Label htmlFor="otp" className="sr-only">
                Verification code
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  id="otp"
                  maxLength={6}
                  value={code}
                  onChange={(value) => {
                    setCode(value);
                    if (state === "invalid") setState("idle");
                  }}
                  disabled={disabled}
                  autoFocus
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {showExpired
                  ? "Code expired."
                  : `Code expires in ${secondsLeft}s.`}{" "}
                {showExpired ? (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-foreground hover:underline underline-offset-4"
                  >
                    Send a new code
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    className="text-foreground hover:underline underline-offset-4 disabled:opacity-50"
                    disabled={secondsLeft > 30}
                  >
                    Resend
                  </button>
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="recovery">Recovery code</Label>
              <Input
                id="recovery"
                type="text"
                placeholder="MIND-XXXX-XXXX"
                value={recovery}
                onChange={(event) => {
                  setRecovery(event.target.value);
                  if (state === "invalid") setState("idle");
                }}
                autoComplete="one-time-code"
                autoFocus
                disabled={state === "submitting"}
              />
              <p className="text-xs text-muted-foreground">
                Recovery codes are issued when you first set up 2FA. Each works once.
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={
              disabled ||
              (mode === "otp" ? code.length < 6 : recovery.trim().length < 4)
            }
          >
            {state === "submitting" ? "Verifying…" : "Verify"}
          </Button>

          <button
            type="button"
            onClick={() => handleSwitchMode(mode === "otp" ? "recovery" : "otp")}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {mode === "otp" ? "Use a recovery code instead" : "Back to authenticator code"}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            Lost your device?{" "}
            <Link
              href="mailto:ops@mindenity.com"
              className="underline-offset-4 hover:underline text-foreground"
            >
              Contact ops
            </Link>
            .
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
