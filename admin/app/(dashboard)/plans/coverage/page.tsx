import { Suspense } from "react";
import { CoverageContent } from "@/components/plans/coverage-content";

export default function CoveragePage() {
  return (
    <Suspense>
      <CoverageContent />
    </Suspense>
  );
}
