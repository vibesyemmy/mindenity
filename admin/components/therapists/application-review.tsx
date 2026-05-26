import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ActionBar } from "@/components/therapists/action-modals";

import type { VerificationApplication } from "@/lib/dummy/therapists";

type Props = {
  application: VerificationApplication;
};

const statusVariant: Record<
  VerificationApplication["status"],
  "secondary" | "outline" | "default"
> = {
  Pending: "default",
  "Info requested": "outline",
  "On hold": "secondary",
};

const checkVariant: Record<
  "pass" | "fail" | "warn",
  "secondary" | "destructive" | "outline"
> = {
  pass: "secondary",
  fail: "destructive",
  warn: "outline",
};

const checkLabel: Record<"pass" | "fail" | "warn", string> = {
  pass: "Pass",
  fail: "Fail",
  warn: "Warn",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function ApplicationReview({ application: v }: Props) {
  return (
    <div className="space-y-6">
      <Link
        href="/therapists/verifications"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        Verifications queue
      </Link>

      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-heading text-3xl tracking-tight">
            Application — {v.name}
          </h1>
          <Badge variant={statusVariant[v.status]}>{v.status}</Badge>
          {v.aiFlag === "Flagged" && <Badge variant="destructive">AI flagged</Badge>}
        </div>
        <p className="text-sm text-muted-foreground">
          Submitted {v.submittedAgo} from {v.country}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_220px]">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3 text-sm">
              <p>
                <span className="text-muted-foreground">Email:</span> {v.email}
              </p>
              <p>
                <span className="text-muted-foreground">Phone:</span> {v.phone}
              </p>
              <p>
                <span className="text-muted-foreground">Country:</span>{" "}
                {v.country}
              </p>
              <p>
                <span className="text-muted-foreground">Time zone:</span>{" "}
                {v.timeZone}
              </p>
              <p>
                <span className="text-muted-foreground">Date of birth:</span>{" "}
                {formatDate(v.dob)}
              </p>
              <p>
                <span className="text-muted-foreground">Region:</span> {v.region}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Credentials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <span className="text-muted-foreground">License number:</span>{" "}
                <span className="font-medium">{v.licenseNumber}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Issuing body:</span>{" "}
                {v.licenseIssuer}
              </p>
              <p>
                <span className="text-muted-foreground">Expires:</span>{" "}
                {formatDate(v.licenseExpiry)}
              </p>
              <div className="flex flex-col gap-2 pt-1">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm hover:underline"
                >
                  <FileText className="size-3.5" />
                  {v.licenseFile}
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-sm hover:underline"
                >
                  <FileText className="size-3.5" />
                  {v.idFile}
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Practice info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Specializations</p>
                <div className="flex flex-wrap gap-1.5">
                  {v.specializations.map((s) => (
                    <Badge key={s} variant="outline" className="font-normal">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Session formats</p>
                <p>{v.sessionFormats.join(" · ")}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Languages</p>
                <p>{v.languages.join(" · ")}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Years of practice</p>
                <p>{v.yearsOfPractice}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Bio</p>
                <p className="leading-relaxed">{v.bio}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>AI pre-screening</CardTitle>
              {v.aiFlag === "Flagged" ? (
                <Badge variant="destructive">Flagged</Badge>
              ) : (
                <Badge variant="secondary">Clean</Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <ul className="space-y-2">
                {(
                  [
                    ["License OCR match", v.aiChecks.licenseOcr],
                    ["Sanctions check", v.aiChecks.sanctions],
                    ["Duplicate account", v.aiChecks.duplicate],
                    ["Bio quality", v.aiChecks.bioQuality],
                  ] as const
                ).map(([label, result]) => (
                  <li key={label} className="flex items-center justify-between">
                    <span>{label}</span>
                    <Badge variant={checkVariant[result]} className="font-normal">
                      {checkLabel[result]}
                    </Badge>
                  </li>
                ))}
              </ul>
              <p className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                {v.aiNote}
              </p>
            </CardContent>
          </Card>
        </div>

        <aside>
          <ActionBar application={v} />
        </aside>
      </div>
    </div>
  );
}
