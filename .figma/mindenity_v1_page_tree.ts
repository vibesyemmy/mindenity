// Mindenity v1 — IA-aligned page tree creation script
// Source of truth: information-architecture.md v1.1
// Run via: mcp__paperclip-figma-bridge__figma_execute (paste body inside)
// Precondition: open the new blank `Mindenity v1` Figma file BEFORE running.
// Idempotent: skips pages that already exist by name.

const PAGES: string[] = [
  "00 · Cover",
  "01 · README",
  "─── Patient Mobile ───",
  "Patient · Onboarding & Auth",
  "Patient · Home",
  "Patient · Therapists (Discover)",
  "Patient · Crisis Support",
  "Patient · Sessions",
  "Patient · Account & Plan",
  "Patient · AI Wellness Assessment",
  "Patient · Notifications & Messages",
  "Patient · Settings",
  "─── Therapist Mobile ───",
  "Therapist · Onboarding & Verification",
  "Therapist · Home",
  "Therapist · Schedule & Availability",
  "Therapist · Sessions & Risk Assessments",
  "Therapist · Earnings & Payouts",
  "Therapist · Account & Plan Preferences",
  "Therapist · Notifications & Messages",
  "─── Admin Web ───",
  "Admin · Authentication",
  "Admin · Dashboard",
  "Admin · Therapists (Verification & Directory)",
  "Admin · Clients",
  "Admin · Sessions & Clinical Safety",
  "Admin · Plans & Pricing",
  "Admin · Promotions",
  "Admin · Commission",
  "Admin · Compliance",
  "Admin · Analytics",
  "Admin · Settings & Roles",
  "─── Foundations ───",
  "Foundations · Color",
  "Foundations · Typography",
  "Foundations · Spacing, Radius & Layout",
  "Foundations · Elevation & Motion",
  "Foundations · Iconography",
  "─── Components ───",
  "Components · Buttons & Actions",
  "Components · Forms & Input",
  "Components · Selection & Toggles",
  "Components · Cards & Lists",
  "Components · Navigation (Tab Bar, App Bar, Sidebar)",
  "Components · Crisis FAB",
  "Components · Modals, Sheets & Drawers",
  "Components · Toasts & Banners",
  "Components · Empty, Loading & Error States",
  "Components · Plan Badges & Pricing",
  "Components · Avatars & Profile",
  "Components · Charts & KPIs (Admin)",
];

declare const figma: any;

await figma.loadAllPagesAsync();

const existing = new Map<string, any>();
for (const p of figma.root.children) existing.set(p.name, p);

const created: string[] = [];
const reused: string[] = [];

const ordered: any[] = [];
for (const name of PAGES) {
  let page = existing.get(name);
  if (!page) {
    page = figma.createPage();
    page.name = name;
    created.push(name);
  } else {
    reused.push(name);
  }
  ordered.push(page);
}

// Reorder to match PAGES sequence.
for (let i = 0; i < ordered.length; i++) {
  figma.root.insertChild(i, ordered[i]);
}

return {
  fileName: figma.root.name,
  totalPages: figma.root.children.length,
  created,
  reused,
};
