import LegalPage from "./LegalPage";
import blocks from "./terms";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      standfirst="Client and Professional terms of use for the Mindenity platform."
      blocks={blocks}
    />
  );
}
