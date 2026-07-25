import { Badge, Em, GhostButton, PrimaryButton } from "../components/ui";

function PhoneCard({
  label,
  value,
  sub,
  featured = false,
  dark = false,
}: {
  label: string;
  value: string;
  sub: string;
  featured?: boolean;
  dark?: boolean;
}) {
  return (
    <div
      className={`w-56 shrink-0 rounded-[2rem] border-8 p-5 shadow-xl ${
        dark
          ? "border-navy-90 bg-navy-80 text-white"
          : "border-navy-90 bg-white text-ink"
      } ${featured ? "z-10 scale-110" : "opacity-90"}`}
    >
      <p className={`text-xs font-medium ${dark ? "text-white/60" : "text-ink-soft"}`}>{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
      <p className={`mt-1 text-xs ${dark ? "text-white/60" : "text-ink-soft"}`}>{sub}</p>
      <div className="mt-4 flex h-24 items-end gap-1.5">
        {[34, 52, 40, 68, 55, 80, 62, 92].map((h, i) => (
          <div
            key={i}
            style={{ height: `${h}%` }}
            className={`flex-1 rounded-t ${
              featured ? "bg-navy-60" : dark ? "bg-white/25" : "bg-navy-20"
            } ${i === 7 ? "!bg-magenta-60" : ""}`}
          />
        ))}
      </div>
      <div className={`mt-4 rounded-xl px-3 py-2 text-xs ${dark ? "bg-white/10" : "bg-navy-5"}`}>
        <p className="font-semibold">Mood check-in</p>
        <p className={dark ? "text-white/60" : "text-ink-soft"}>{featured ? "Feeling steadier 4 weeks in" : "Weekly reflection ready"}</p>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="bg-gradient-to-b from-navy-5 via-navy-10/60 to-white">
      <div className="mx-auto max-w-6xl px-6 pb-0 pt-16 text-center">
        <div className="flex justify-center">
          <Badge>Mindenity App</Badge>
        </div>
        <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-bold tracking-tight text-ink md:text-6xl">
          Care for <Em>Everyone</Em>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink-soft">
          Put mental wellness within reach, every day of the year.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <PrimaryButton>Download on iOS</PrimaryButton>
          <GhostButton>Learn More</GhostButton>
        </div>

        <div className="relative mt-14 flex items-end justify-center gap-4 overflow-hidden pb-0">
          <PhoneCard label="This month" value="12 sessions" sub="Balance · weekly therapy" />
          <PhoneCard
            label="Wellness score"
            value="82 / 100"
            sub="Up 18 points since intake"
            featured
          />
          <PhoneCard label="Streak" value="34 days" sub="Daily mood check-ins" dark />
        </div>
      </div>
    </section>
  );
}
