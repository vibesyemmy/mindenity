import { Em, GhostButton, PrimaryButton } from "../components/ui";

const STATS = [
  { value: "6+ Years", label: "Of continuous care." },
  { value: "50K+", label: "Members supported." },
  { value: "180K+", label: "Therapy sessions delivered." },
  { value: "12", label: "Countries served today." },
  { value: "4.9★", label: "Average member rating." },
  { value: "NDPR + GDPR", label: "Annual compliance audit." },
];

const BARS = [
  { name: "Mindenity", pct: 100, cls: "bg-navy-60" },
  { name: "In-person", pct: 42, cls: "bg-navy-20" },
  { name: "Employer EAP", pct: 28, cls: "bg-magenta-40" },
];

export function TrustSection() {
  return (
    <section className="bg-gradient-to-b from-white via-navy-5 to-white py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          <Em>Trusted</Em> by Default
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-ink-soft">
          Backed by licensed clinicians. NDPR + GDPR compliant. Every session is private,
          encrypted, and never sold.
        </p>
        <div className="mt-7 flex items-center justify-center gap-3">
          <PrimaryButton>Learn More</PrimaryButton>
          <GhostButton>View Careers</GhostButton>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.value}
              className="rounded-3xl bg-white p-6 text-left shadow-sm ring-1 ring-navy-10/60"
            >
              <p className="text-2xl font-bold tracking-tight text-navy-60">{s.value}</p>
              <p className="mt-1 text-sm text-ink-soft">{s.label}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-20 text-3xl font-bold tracking-tight">The home of mental wellness.</h3>
        <p className="mx-auto mt-3 max-w-xl text-ink-soft">
          Mindenity is the most trusted teletherapy platform across Africa and beyond.
        </p>

        <div className="mt-8 rounded-3xl bg-white p-8 text-left shadow-sm ring-1 ring-navy-10/60">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-lg font-bold">More care per session with Mindenity.</p>
              <p className="text-sm text-ink-soft">
                Cost per outcome for a typical 12-week program.
              </p>
            </div>
            <div className="flex gap-4 text-xs text-ink-soft">
              {BARS.map((b) => (
                <span key={b.name} className="inline-flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${b.cls}`} />
                  {b.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {BARS.map((b) => (
              <div key={b.name} className="flex items-center gap-4">
                <span className="w-28 shrink-0 text-sm font-medium">{b.name}</span>
                <div className="h-8 flex-1 rounded-full bg-navy-5">
                  <div
                    style={{ width: `${b.pct}%` }}
                    className={`h-8 rounded-full ${b.cls}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-ink-soft">
            Mindenity per-session cost from platform data (avg 2026) · In-person: national avg per
            50-min session · EAP: 6-session cap national avg
          </p>
        </div>
      </div>
    </section>
  );
}
