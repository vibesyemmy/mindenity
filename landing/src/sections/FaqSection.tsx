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
    <section className="bg-[#0f0f10] py-24 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-[1fr_2fr]">
        <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
          FAQs
        </h2>
        <div className="divide-y divide-white/[0.06]">
          {FAQS.map((f, i) => (
            <div key={i} className="py-5">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between text-left gap-4"
              >
                <span className="text-lg font-semibold">{f.q}</span>
                <span className="shrink-0 text-2xl text-white/40 transition-transform duration-200"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <p className="mt-3 max-w-2xl text-white/50 leading-relaxed">{f.a}</p>
              )}
            </div>
          ))}
          <div className="py-5">
            <a href="#" className="text-sm font-semibold text-purple-3 hover:text-purple-1 transition-colors">
              Learn more about Mindenity →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
