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

const SOCIALS = [
  { name: "Twitter", href: "#" },
  { name: "LinkedIn", href: "#" },
  { name: "Instagram", href: "#" },
];

export function Footer() {
  return (
    <footer className="bg-[#0f0f10] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Link columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-bold text-white/80">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-white/40 transition-colors hover:text-white"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="mt-14 max-w-4xl text-xs leading-relaxed text-white/25">
          Mindenity.com is the digital front door of Mindenity — a licensed teletherapy and
          mental-health-technology platform operating in Nigeria and select international markets.
          Mindenity connects members with clinically-vetted therapists, an AI wellness companion,
          and evidence-based programs for individuals, couples, and families. Not intended as
          emergency medical care — if you are in crisis, contact your local emergency services.
        </p>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-6 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Wordmark light />

          {/* Socials */}
          <div className="flex items-center gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                className="text-sm text-white/40 transition-colors hover:text-white"
              >
                {s.name}
              </a>
            ))}
          </div>

          <p className="text-xs text-white/25">© Mindenity 2026 · Heal. Grow. Thrive.</p>
        </div>
      </div>
    </footer>
  );
}
