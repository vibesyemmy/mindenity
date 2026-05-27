import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { formatDate, type ResidencyRegion } from "@/lib/dummy/compliance";

const statusVariant: Record<
  ResidencyRegion["status"],
  "secondary" | "destructive"
> = {
  Compliant: "secondary",
  "Action required": "destructive",
};

type Props = {
  region: ResidencyRegion;
};

export function ResidencyCard({ region }: Props) {
  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span aria-hidden className="text-xl">
              {region.flagEmoji}
            </span>
            {region.name}
          </CardTitle>
          <Badge variant={statusVariant[region.status]}>{region.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Storage location
          </p>
          <p>{region.storageLocation}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Primary processor
          </p>
          <p className="font-medium">{region.primaryProcessor}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Sub-processors
          </p>
          <ul className="list-disc pl-5 space-y-0.5 marker:text-muted-foreground">
            {region.subProcessors.map((sp) => (
              <li key={sp}>{sp}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Compliance certifications
          </p>
          <div className="flex flex-wrap gap-1.5">
            {region.complianceCerts.map((cert) => (
              <Badge key={cert} variant="outline" className="font-normal">
                {cert}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Last audit
          </p>
          <p className="text-muted-foreground tabular-nums">
            {formatDate(region.lastAuditDate)}
          </p>
        </div>

        <div className="rounded-md bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
          {region.notes}
        </div>
      </CardContent>
    </Card>
  );
}
