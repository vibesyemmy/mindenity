import { Badge, Em, GhostButton, ProductSection, SolidButton } from "../components/ui";

function PhoneMockup({
  src,
  featured = false,
  zIndex = 0,
}: {
  src: string;
  featured?: boolean;
  zIndex?: number;
}) {
  return (
    <div
      className={`relative shrink-0 ${featured ? "z-10 -mt-4" : "opacity-90"}`}
      style={{ zIndex }}
    >
      <div
        className={`overflow-hidden rounded-[2.5rem] border-[6px] ${
          featured
            ? "border-white/20 shadow-2xl shadow-purple-3/20"
            : "border-white/10 shadow-xl"
        }`}
        style={{ width: 260, aspectRatio: "390/700" }}
      >
        <div className="flex h-full items-center justify-center bg-[#1a1a2e]">
          <span className="text-sm text-white/30">App preview</span>
        </div>
      </div>
    </div>
  );
}

/* ── Product card (for the "Markets" style row) ────────────── */

function ProductCard({
  kicker,
  name,
  desc,
}: {
  kicker: string;
  name: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur transition-colors hover:bg-white/[0.06]">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{kicker}</p>
      <h4 className="mt-2 text-xl font-bold">{name}</h4>
      <p className="mt-2 text-sm leading-relaxed text-white/50">{desc}</p>
    </div>
  );
}

/* ── Hero section (Aave App pattern) ───────────────────────── */

const PROGRAM_CARDS = [
  {
    kicker: "Individual",
    name: "Balance",
    desc: "Weekly therapy plus mood tracking, CBT exercises, and AI companion check-ins for anxiety, stress, and everyday well-being.",
  },
  {
    kicker: "Couples & Family",
    name: "Together",
    desc: "Communication frameworks, cross-cultural counseling, and grief support for couples and families navigating life together.",
  },
  {
    kicker: "Clinical Track",
    name: "Restore",
    desc: "High-need programs led by clinical specialists — EMDR, CPTSD, and complex trauma recovery with structured progress plans.",
  },
];

export function Hero() {
  return (
    <ProductSection product="Mindenity App" theme="purple">
      <div className="text-center">
        {/* Badge */}
        <div className="flex justify-center">
          <Badge>Mindenity App</Badge>
        </div>

        {/* Heading */}
        <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl">
          Care for{" "}
          <span
            className="bg-gradient-to-r from-purple-3 via-purple-1 to-purple-5 bg-clip-text text-transparent"
          >
            Everyone
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-white/60">
          Put mental wellness within reach, every single day of the year.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <SolidButton color="purple" large>
            <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor">
              <path d="M13.36 10.64c.02-1.55.84-3 2.13-3.82-.81-1.18-2.18-1.93-3.6-1.98-1.52-.16-2.99.92-3.76.92-.79 0-1.98-.9-3.26-.88-1.67.06-3.23 1.02-4.04 2.5C.92 10.47 2.22 15 3.9 17.48c.83 1.22 1.81 2.58 3.09 2.53 1.25-.05 1.72-.81 3.23-.81 1.5 0 1.94.81 3.25.78 1.34-.02 2.19-1.22 3-2.45.6-.87 1.06-1.83 1.37-2.84-1.58-.68-2.63-2.3-2.64-4.04Z" />
              <path d="M10.9 3.2c.73-.9 1.09-2.05 1-3.2-1.12.12-2.15.66-2.9 1.52-.72.84-1.1 1.97-1.03 3.09 1.12.01 2.22-.52 2.93-1.4Z" />
            </svg>
            Download on iOS
          </SolidButton>
          <GhostButton large>Learn More</GhostButton>
        </div>

        {/* Phone mockups */}
        <div className="relative mt-16 flex items-end justify-center gap-6 overflow-visible">
          <PhoneMockup src="/images/hero-left.png" zIndex={1} />
          <PhoneMockup src="/images/hero-center.png" featured zIndex={2} />
          <PhoneMockup src="/images/hero-right.png" zIndex={1} />
        </div>

        {/* Program cards — like Aave's market cards */}
        <div className="mt-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="text-left">
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
              Programs <Em>for every need.</Em>
            </h3>
            <p className="mt-2 max-w-xl text-white/50">
              From individual therapy for anxiety to family programs for grief — choose the program
              that matches your journey.
            </p>
          </div>
          <GhostButton className="shrink-0">View all programs</GhostButton>
        </div>

        <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
          {PROGRAM_CARDS.map((p) => (
            <ProductCard key={p.name} {...p} />
          ))}
        </div>
      </div>
    </ProductSection>
  );
}
