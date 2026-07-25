import { Badge, Em, GhostButton, PrimaryButton, Tag } from "../components/ui";

const PROGRAMS = [
  {
    kicker: "Individual Care",
    name: "Balance",
    desc: "The core program for anxiety, stress, and everyday well-being. Weekly therapy plus mood tools.",
    tags: ["Anxiety", "Sleep", "CBT", "Stress", "Focus", "+4 More"],
  },
  {
    kicker: "Couples & Family",
    name: "Together",
    desc: "Programs for couples and families. Communication, cross-cultural, and grief-focused work.",
    tags: ["Couples", "Grief", "Family", "Cultural"],
  },
  {
    kicker: "Clinical Track",
    name: "Restore",
    desc: "High-need programs led by clinical therapists. EMDR, CPTSD, and complex trauma recovery.",
    tags: ["EMDR", "CPTSD", "Trauma", "Recovery"],
  },
];

export function ProSection() {
  return (
    <section id="products" className="px-4 py-6">
      <div className="mx-auto max-w-[88rem] rounded-[2.5rem] bg-navy-90 px-6 py-16 text-white md:px-14">
        <div className="text-center">
          <div className="flex justify-center">
            <Badge dark>Mindenity Pro</Badge>
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
            The <Em>Full Power</Em> of Therapy
          </h2>
          <p className="mt-3 text-white/70">
            Personalised care with licensed therapists. Backed by AI wellness tools.
          </p>
          <div className="mt-7 flex items-center justify-center gap-3">
            <PrimaryButton magenta>Get Started</PrimaryButton>
            <GhostButton dark>Learn More</GhostButton>
          </div>
        </div>

        <div className="mt-12 flex h-[420px] items-center justify-center rounded-3xl border border-white/10 bg-navy-80/60">
          <div className="text-center">
            <p className="text-6xl">🧠</p>
            <p className="mt-3 text-sm text-white/50">Session experience preview</p>
          </div>
        </div>

        <div id="programs" className="mt-16 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-3xl font-bold tracking-tight md:text-4xl">
              Programs <Em>for every need.</Em>
            </h3>
            <p className="mt-3 max-w-xl text-white/70">
              From individual therapy for anxiety to family programs for grief, choose the program
              that matches your journey.
            </p>
          </div>
          <GhostButton dark className="shrink-0">
            Learn More
          </GhostButton>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {PROGRAMS.map((p) => (
            <div key={p.name} className="rounded-3xl border border-white/10 bg-navy-80/60 p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-white/50">
                {p.kicker}
              </p>
              <h4 className="mt-2 text-2xl font-bold">{p.name}</h4>
              <p className="mt-3 min-h-20 text-sm text-white/70">{p.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <Tag key={t} dark>
                    {t}
                  </Tag>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
