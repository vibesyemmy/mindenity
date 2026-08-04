import "./who.css";

/*
 * "Who it's for" — Maze-reference segment cards plus a Headspace-style
 * concern-chip strip. Segments mirror the three plan segments; the chips are
 * the brief's real intake categories (§5.4's 13 concern areas).
 *
 * Card photography from Pexels (free for commercial use, no attribution
 * required) — placeholders-with-a-license until brand photography exists:
 *   self.jpg    pexels.com/photo/38594246
 *   two.jpg     pexels.com/photo/7741569
 *   family.jpg  pexels.com/photo/4262410
 */

const SEGMENTS = [
  {
    variant: "w-self",
    title: "For yourself",
    body: "When everyday life starts weighing more than it should — anxiety, stress, low mood, or just needing someone in your corner.",
    href: "/plans#individual",
    img: "/images/who/self.jpg",
    alt: "A woman with a calm expression, surrounded by greenery",
  },
  {
    variant: "w-two",
    title: "For you two",
    body: "Work on communication, trust and conflict together — including life after a big change.",
    href: "/plans#couple",
    img: "/images/who/two.jpg",
    alt: "A couple laughing together outdoors",
  },
  {
    variant: "w-family",
    title: "For your family",
    body: "Up to five people. Parenting strain, adolescent support, and grief shared across a household.",
    href: "/plans#family",
    img: "/images/who/family.jpg",
    alt: "A family sharing a warm embrace at home",
  },
];

const CONCERNS = [
  "Loss & grief",
  "Family & relationship conflict",
  "Work, school & money stress",
  "Anxiety & inner struggles",
  "Health & medical trauma",
  "Addiction & behaviour change",
  "Pre & post-birth support",
  "Identity & social pressure",
  "Childhood & development",
  "Spiritual & existential questions",
];

export default function WhoSection() {
  return (
<section className="who">
<h2 className="who-title">Who is Mindenity <em>for?</em></h2>
<p className="who-sub">Individuals, couples and families &mdash; matched to therapists who work your way.</p>
<div className="who-grid">
{SEGMENTS.map((s) => (
  <a key={s.title} className={`w-card ${s.variant}`} href={s.href}>
    <div className="w-img"><img src={s.img} alt={s.alt} loading="lazy"/></div>
    <div className="w-content">
      <h3 className="w-title">{s.title}</h3>
      <p className="w-body">{s.body}</p>
      <span className="w-arrow" aria-hidden="true">&rarr;</span>
    </div>
  </a>
))}
</div>
<div className="who-chips">
<p className="who-chips-label">Whatever you&rsquo;re carrying &mdash;</p>
<div className="who-chips-row">
{CONCERNS.map((c) => (
  <a key={c} className="who-chip" href="/find-my-plan">{c}</a>
))}
<a className="who-chip who-chip-more" href="/find-my-plan">+ more</a>
</div>
</div>
</section>
  );
}
