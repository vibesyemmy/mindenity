import "./who.css";

/*
 * "Who it's for" — Maze-reference segment cards plus a Headspace-style
 * concern-chip strip. Segments mirror the three plan segments below; the
 * chips are the brief's real intake categories (§5.4's 13 concern areas),
 * shortened for chip length but not renamed beyond recognition.
 */

const SEGMENTS = [
  {
    variant: "w-self",
    title: "For yourself",
    body: "When everyday life starts weighing more than it should — anxiety, stress, low mood, or just needing someone in your corner.",
    href: "/plans#individual",
    marks: 1,
  },
  {
    variant: "w-two",
    title: "For you two",
    body: "Work on communication, trust and conflict together — including life after a big change.",
    href: "/plans#couple",
    marks: 2,
  },
  {
    variant: "w-family",
    title: "For your family",
    body: "Up to five people. Parenting strain, adolescent support, and grief shared across a household.",
    href: "/plans#family",
    marks: 4,
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

function Marks({ count, fill }: { count: number; fill: string }) {
  const pos = [
    [2, 2],
    [20, 2],
    [2, 20],
    [20, 20],
  ].slice(0, count);
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      {pos.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="14" height="14" rx="3" fill={fill} />
      ))}
    </svg>
  );
}

export default function WhoSection() {
  return (
<section className="who">
<h2 className="who-title">Who is Mindenity <em>for?</em></h2>
<p className="who-sub">Individuals, couples and families — matched to therapists who work your way.</p>
<div className="who-grid">
{SEGMENTS.map((s) => (
  <a key={s.title} className={`w-card ${s.variant}`} href={s.href}>
    <Marks count={s.marks} fill="currentColor" />
    <h3 className="w-title">{s.title}</h3>
    <p className="w-body">{s.body}</p>
    <span className="w-arrow" aria-hidden="true">&rarr;</span>
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
