import { Badge, Em, GhostButton, ProductSection, SolidButton } from "../components/ui";

const PARTNERS = [
  { name: "Ada HR", stat: "1,200+ employees", sub: "covered through Mindenity for Work." },
  { name: "Bright Schools", stat: "5,000+ students", sub: "with weekly counsellor sessions." },
  { name: "Kairos", stat: "12 clinics onboarded", sub: "augmented with AI wellness tools." },
  { name: "Refresh", stat: "10K+ lives", sub: "touched by crisis outreach." },
  { name: "Momentum", stat: "~85%", sub: "employee engagement rate." },
  { name: "Health for Life NG", stat: "Largest network", sub: "runs Nigeria's biggest teletherapy network on Mindenity." },
];

export function CareSection() {
  return (
    <ProductSection product="Mindenity Care" theme="dark">
      <div className="text-center">
        <div className="flex justify-center">
          <Badge>Mindenity Care</Badge>
        </div>
        <h2 className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-[1.15] tracking-tight md:text-6xl">
          Care <Em>with Mindenity</Em>
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-white/60">
          Launch mental health experiences with Mindenity's integration stack.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <SolidButton color="white" large>
            Explore Partnerships
          </SolidButton>
          <GhostButton large>Talk to Care Team</GhostButton>
        </div>

        {/* Partner logos / stats */}
        <div className="mt-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="text-left">
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
              The best run <Em>with Mindenity.</Em>
            </h3>
            <p className="mt-2 max-w-xl text-white/50">
              Organizations across Africa and beyond power their mental health programs on Mindenity.
            </p>
          </div>
          <GhostButton className="shrink-0">View case studies</GhostButton>
        </div>

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="rounded-3xl border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur transition-colors hover:bg-white/[0.06]"
            >
              <p className="text-sm font-semibold text-purple-3">{p.name}</p>
              <p className="mt-3 text-2xl font-bold tracking-tight">{p.stat}</p>
              <p className="mt-1 text-sm text-white/50">{p.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </ProductSection>
  );
}
