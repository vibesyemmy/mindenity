import "./therapists.css";

/*
 * For-therapists section on the Kajabi reference (user-picked from Mobbin):
 * near-black ground, giant uppercase headline left, numbered benefits column
 * right. Deliberately the loudest, most asymmetric section on an otherwise
 * light, centred, card-based page.
 *
 * Benefits are the epics' real substance: availability (Epic 2), plan
 * preferences and verification (Epic 8), dual-region + commission (Epics 12
 * and 13).
 */

const BENEFITS = [
  {
    n: "1",
    tone: "t-magenta",
    title: "Set your own hours",
    body: "Your weekly schedule, your session lengths, your buffer time. Clients book in their timezone — you work in yours.",
  },
  {
    n: "2",
    tone: "t-sage",
    title: "Keep your standards",
    body: "Choose which plans, segments and clients you take. Verify once, then practise the way you already work.",
  },
  {
    n: "3",
    tone: "t-peri",
    title: "Reach two markets",
    body: "Serve Nigeria in naira and international clients in dollars — tiered commission, performance bonuses, transparent payouts.",
  },
];

export default function TherapistsSection() {
  return (
<section className="therapists">
<div className="th-left">
<p className="th-eyebrow">For therapists</p>
<h2 className="th-headline">Why practise with Mindenity?</h2>
<a className="th-cta" href="/therapists/apply">Apply to join</a>
<a className="th-link" href="/therapists/verification">How verification works &rarr;</a>
</div>
<ol className="th-benefits">
{BENEFITS.map((b) => (
  <li key={b.n} className="th-benefit">
    <span className={`th-num ${b.tone}`} aria-hidden="true">{b.n}</span>
    <div>
      <h3 className="th-title">{b.title}</h3>
      <p className="th-body">{b.body}</p>
    </div>
  </li>
))}
</ol>
</section>
  );
}
