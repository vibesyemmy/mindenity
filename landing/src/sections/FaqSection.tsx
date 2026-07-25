import { useState } from "react";

const FAQS = [
  {
    q: "What is Mindenity?",
    a: "Mindenity is a licensed teletherapy platform pairing you with clinically-vetted therapists plus an AI wellness companion, mood tools, and structured programs for individuals, couples, and families.",
  },
  {
    q: "Where is my session data stored?",
    a: "Nigerian members' data lives in AWS af-south-1 with an encrypted EU disaster-recovery replica. EU members' data never leaves EU regions. All records are encrypted at rest and in transit.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Sessions are end-to-end confidential, NDPR + GDPR compliant, independently audited each year, and never sold or shared with employers.",
  },
  {
    q: "What plans are available?",
    a: "Nine plans across three tracks: individual (Essential, Balance, Thrive), couples (Together, Harmony, Restore), and family (Home, Family Care, Family Thrive) — pay-as-you-go or subscription.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="resources" className="py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-[1fr_2fr]">
        <h2 className="text-4xl font-bold tracking-tight">FAQs</h2>
        <div className="divide-y divide-navy-10">
          {FAQS.map((f, i) => (
            <div key={f.q} className="py-5">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between text-left"
              >
                <span className="text-lg font-semibold">{f.q}</span>
                <span className="text-2xl text-navy-40">{open === i ? "−" : "+"}</span>
              </button>
              {open === i && <p className="mt-3 max-w-2xl text-ink-soft">{f.a}</p>}
            </div>
          ))}
          <div className="py-5">
            <a href="#" className="text-sm font-semibold text-navy-60 hover:underline">
              Learn More About Mindenity →
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-20 max-w-xl px-6 text-center">
        <h3 className="text-2xl font-bold tracking-tight">Stay in the loop</h3>
        <p className="mt-2 text-ink-soft">
          Be first to hear when new programs and features go live.
        </p>
        <form
          className="mt-6 flex gap-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="Email"
            className="h-12 flex-1 rounded-full border border-navy-10 bg-white px-5 text-sm outline-none placeholder:text-ink-soft/60 focus:border-navy-60"
          />
          <button
            type="submit"
            className="h-12 rounded-full bg-navy-60 px-6 text-sm font-semibold text-white hover:bg-navy-70"
          >
            Notify Me
          </button>
        </form>
      </div>
    </section>
  );
}
