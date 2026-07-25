import { Wordmark } from "../components/ui";

const COLUMNS: Array<{ title: string; links: string[] }> = [
  { title: "Products", links: ["Mindenity App", "Mindenity Pro", "Mindenity Care"] },
  { title: "Programs", links: ["Individual", "Couples", "Family & Group"] },
  {
    title: "Partners",
    links: ["Partner Kit", "Documentation", "Case Studies", "Security", "Report an Issue"],
  },
  {
    title: "Resources",
    links: ["Blog", "Brand", "FAQ", "Help & Support", "Community", "Policy"],
  },
  { title: "About", links: ["Mindenity", "Careers", "Contact", "Press"] },
  { title: "Legal & Privacy", links: ["Legal Hub", "Verify Contact", "Manage Analytics"] },
];

export function Footer() {
  return (
    <footer id="about" className="bg-cloud">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-bold">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-4xl text-xs leading-relaxed text-ink-soft">
          Mindenity.com is the digital front door of Mindenity — a licensed teletherapy and
          mental-health-technology platform operating in Nigeria and select international markets.
          Mindenity connects members with clinically-vetted therapists, an AI wellness companion,
          and evidence-based programs for individuals, couples, and families. Not intended as
          emergency medical care — if you are in crisis, contact your local emergency services.
        </p>

        <div className="mt-10 flex items-center justify-between border-t border-navy-10 pt-8">
          <Wordmark />
          <p className="text-xs text-ink-soft">© Mindenity 2026 · Heal. Grow. Thrive.</p>
        </div>
      </div>
    </footer>
  );
}
