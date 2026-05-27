import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  formatDate,
  getRecentAudits,
  type AuditEntry,
} from "@/lib/dummy/compliance";

const outcomeVariant: Record<
  AuditEntry["outcome"],
  "secondary" | "outline" | "destructive"
> = {
  Passed: "secondary",
  "Passed with notes": "outline",
  "Action required": "destructive",
};

export function AuditsTable() {
  const audits = getRecentAudits();

  return (
    <div className="rounded-md border border-border/60 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Audit type</TableHead>
            <TableHead>Outcome</TableHead>
            <TableHead>Auditor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.map((a) => (
            <TableRow key={a.id}>
              <TableCell className="tabular-nums text-sm">{formatDate(a.date)}</TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {a.region}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{a.auditType}</TableCell>
              <TableCell>
                <Badge variant={outcomeVariant[a.outcome]} className="font-normal">
                  {a.outcome}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {a.auditor}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
