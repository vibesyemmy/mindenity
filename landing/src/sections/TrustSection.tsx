import { Em, SolidButton } from "../components/ui";

const STATS = [
  { value: "6+ Years", label: "Uninterrupted care" },
  { value: "50K+", label: "Members supported" },
  { value: "180K+", label: "Sessions delivered" },
  { value: "12", label: "Countries served today" },
  { value: "4.9★", label: "Average member rating" },
  { value: "NDPR+GDPR", label: "Annual compliance audit" },
];

export function TrustSection() {
  return (
    <section className="relative overflow-hidden bg-[#0f0f10] py-24 text-white">
      {/* Subtle gradient top */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#12121a] to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-4xl font-bold leading-[1.15] tracking-tight md:text-6xl">
          <Em>Trusted</Em> by default
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/60">
          Six years of uninterrupted care. Thousands of lives supported. Independently audited, encrypted, and open to verify.
        </p>

        {/* Stats grid */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.value}
              className="rounded-3xl border border-white/[0.06] bg-white/[0.03] p-6 text-left backdrop-blur"
            >
              <p className="text-3xl font-bold tracking-tight text-purple-3">{s.value}</p>
              <p className="mt-1.5 text-sm text-white/50">{s.label}</p>
            </div>
          ))}
        </div>

        {/* FAQ link */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
            Frequently asked questions
          </h3>
          <p className="mx-auto mt-3 max-w-lg text-white/50">
            Everything you need to know about Mindenity — how it works, security, and plans.
          </p>
          <div className="mt-6">
            <SolidButton color="dark">Visit FAQ</SolidButton>
          </div>
        </div>
      </div>
    </section>
  );
}
