import { Badge, Em, GhostButton, ProductSection, SolidButton } from "../components/ui";

function ProCard({
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

const MARKETS = [
  {
    kicker: "Individual",
    name: "Essential",
    desc: "Affordable talk therapy. Weekly 50-minute sessions with licensed therapists, plus mood tracking and AI companion check-ins.",
  },
  {
    kicker: "Couples",
    name: "Harmony",
    desc: "Dedicated couples counseling. Communication tools, conflict resolution frameworks, and cross-cultural relationship support.",
  },
  {
    kicker: "Clinical",
    name: "Thrive",
    desc: "Specialist-led programs for complex needs. EMDR, CPTSD recovery, and psychiatric coordination with medication management.",
  },
];

export function ProSection() {
  return (
    <ProductSection product="Mindenity Pro" theme="dark">
      <div className="text-center">
        <div className="flex justify-center">
          <Badge>Mindenity Pro</Badge>
        </div>
        <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-[1.15] tracking-tight md:text-6xl">
          The full power of <Em>therapy</Em>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-white/60">
          Earn, borrow, and swap across curated markets. Built on Mindenity v4.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <SolidButton color="white" large>
            Get Started
          </SolidButton>
          <GhostButton large>Learn More</GhostButton>
        </div>

        {/* Markets grid — like Aave Pro's market cards */}
        <div className="mt-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="text-left">
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
              Plans <Em>for every stage.</Em>
            </h3>
            <p className="mt-2 max-w-xl text-white/50">
              Nine plans across three tracks. Flexible pricing, subscription or pay-as-you-go.
            </p>
          </div>
          <GhostButton className="shrink-0">Compare plans</GhostButton>
        </div>

        <div className="mt-8 grid gap-4 text-left md:grid-cols-3">
          {MARKETS.map((m) => (
            <ProCard key={m.name} {...m} />
          ))}
        </div>
      </div>
    </ProductSection>
  );
}
