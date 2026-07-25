import { Badge, Em, GhostButton, PrimaryButton } from "../components/ui";

const PARTNERS = [
  { name: "Ada HR", stat: "1,200+ employees", sub: "covered through Mindenity for Work." },
  { name: "Bright Schools", stat: "5,000+ students", sub: "with weekly counsellor sessions." },
  { name: "Kairos", stat: "12 clinics onboarded", sub: "augmented with AI wellness tools." },
  { name: "Refresh", stat: "10K+ lives", sub: "touched by crisis outreach." },
  { name: "Momentum", stat: "~85%", sub: "employee engagement." },
  {
    name: "Health for Life NG",
    stat: "Health for Life",
    sub: "runs Nigeria's largest teletherapy network on Mindenity.",
  },
];

function Cube({ size, tint }: { size: number; tint: string }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`rounded-2xl ${tint} shadow-lg ring-1 ring-navy-10`}
    />
  );
}

export function CareSection() {
  return (
    <section id="partners" className="py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <div className="flex justify-center">
          <Badge>Mindenity Care</Badge>
        </div>
        <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
          Care <Em>with Mindenity</Em>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">
          Bring evidence-based mental health support into your team, school, or platform.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <PrimaryButton>Explore Partnerships</PrimaryButton>
          <GhostButton>Talk to Care Team</GhostButton>
        </div>

        <div className="mt-14 flex items-end justify-center gap-8">
          <Cube size={72} tint="bg-navy-10" />
          <Cube size={104} tint="bg-navy-30" />
          <Cube size={144} tint="bg-navy-60" />
        </div>

        <div className="mt-20 flex flex-col gap-4 text-left md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-3xl font-bold tracking-tight">
              The best run <Em>with Mindenity.</Em>
            </h3>
            <p className="mt-3 max-w-lg text-ink-soft">
              Serve members across countries with clinically-proven mental health outcomes.
            </p>
          </div>
          <GhostButton className="shrink-0">Learn More</GhostButton>
        </div>

        <div className="mt-8 grid gap-4 text-left sm:grid-cols-2 lg:grid-cols-3">
          {PARTNERS.map((p) => (
            <div key={p.name} className="rounded-3xl bg-cloud p-6 ring-1 ring-navy-10/60">
              <p className="text-sm font-semibold text-navy-50">{p.name}</p>
              <p className="mt-3 text-2xl font-bold tracking-tight">{p.stat}</p>
              <p className="mt-1 text-sm text-ink-soft">{p.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
