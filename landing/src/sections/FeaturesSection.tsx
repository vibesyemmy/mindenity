import "./features.css";

/*
 * Feature grid on the Ada reference (user-picked from Mobbin): centred
 * headline + one-line sub, then four tall flat-colour cards — geometric mark
 * top, title and body pinned to the bottom.
 *
 * Card palette is the brand's: navy, the darkened sage from the accent
 * family, the brief's crisis magenta (§7.2 assigns magenta to crisis
 * surfaces, so that card is not arbitrary), and the pale sage tint.
 */

const FEATURES = [
  {
    variant: "f-navy",
    title: "Therapy, your way",
    body: "Video, voice or chat sessions with licensed, verified therapists — priced in naira or dollars.",
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect x="18" y="2" width="8" height="8" fill="#9bb167"/>
        <rect x="2" y="18" width="8" height="8" fill="#9bb167"/>
        <rect x="34" y="18" width="8" height="8" fill="#9bb167"/>
        <rect x="18" y="34" width="8" height="8" fill="#9bb167"/>
        <path d="M22 10v24M10 22h24" stroke="#9bb167" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    variant: "f-sage",
    title: "An AI companion",
    body: "Someone to talk to between sessions — it listens, checks in, and remembers what matters to you.",
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect x="4" y="4" width="7" height="7" fill="#fff"/>
        <rect x="19" y="4" width="7" height="7" fill="#fff"/>
        <rect x="4" y="19" width="7" height="7" fill="#fff"/>
        <rect x="19" y="19" width="7" height="7" fill="#fff"/>
        <rect x="33" y="33" width="7" height="7" fill="#fff"/>
        <path d="M11 7.5h8M11 22.5h8M7.5 11v8M22.5 11v8M26 26l7 7" stroke="#fff" strokeWidth="1.4"/>
      </svg>
    ),
  },
  {
    variant: "f-magenta",
    title: "Crisis Support Access",
    body: "Flag something urgent and you're matched with priority — a therapist responds within 30 minutes.",
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect x="19" y="2" width="6" height="6" fill="#fff"/>
        <rect x="19" y="36" width="6" height="6" fill="#fff"/>
        <rect x="2" y="19" width="6" height="6" fill="#fff"/>
        <rect x="36" y="19" width="6" height="6" fill="#fff"/>
        <rect x="7" y="7" width="6" height="6" fill="#fff"/>
        <rect x="31" y="7" width="6" height="6" fill="#fff"/>
        <rect x="7" y="31" width="6" height="6" fill="#fff"/>
        <rect x="31" y="31" width="6" height="6" fill="#fff"/>
        <circle cx="22" cy="22" r="4" fill="#fff"/>
      </svg>
    ),
  },
  {
    variant: "f-soft",
    title: "Mood, sleep & stress",
    body: "Daily check-ins and weekly trends, in one place you can share with your therapist.",
    icon: (
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <rect x="2" y="30" width="7" height="7" fill="#1b2452"/>
        <rect x="13" y="20" width="7" height="7" fill="#1b2452"/>
        <rect x="24" y="24" width="7" height="7" fill="#1b2452"/>
        <rect x="35" y="10" width="7" height="7" fill="#1b2452"/>
        <path d="M5.5 30l11-6.5 11 4 11-14" stroke="#1b2452" strokeWidth="1.4"/>
      </svg>
    ),
  },
];

export default function FeaturesSection() {
  return (
<section className="features">
<h2 className="features-title">Care that goes <em>beyond</em> the session</h2>
<p className="features-sub">Therapy is the core. These carry you through the rest of the week.</p>
<div className="features-grid">
{FEATURES.map((f) => (
  <article key={f.title} className={`f-card ${f.variant}`}>
    {f.icon}
    <div className="f-spacer" />
    <h3 className="f-title">{f.title}</h3>
    <p className="f-body">{f.body}</p>
  </article>
))}
</div>
</section>
  );
}
