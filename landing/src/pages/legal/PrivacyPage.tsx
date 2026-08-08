import LegalPage from "./LegalPage";
import blocks from "./privacy";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      standfirst="How Mindenity collects, uses and protects your information, including your health information."
      blocks={blocks}
    />
  );
}
