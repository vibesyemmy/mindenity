import { useState } from "react";
import "./newsletter.css";

/*
 * Newsletter on the Grammarly reference (user-picked from Mobbin): one
 * rounded full-width card on a colour gradient, white centred copy, input +
 * button on top. The gradient is the hero's own ramp, so the page opens and
 * closes on the same surface.
 *
 * Front-end only for now — submit stores nothing and just acknowledges.
 * TODO: wire to a real list endpoint before treating signups as captured.
 */
export default function NewsletterSection() {
  const [done, setDone] = useState(false);
  return (
<section className="newsletter">
<div className="nl-card">
<h2 className="nl-title">Stay updated</h2>
<p className="nl-sub">Occasional notes on new features, therapist openings and mental health resources.</p>
{done ? (
<p className="nl-status" role="status">Thanks &mdash; we&rsquo;ll be in touch when there&rsquo;s news.</p>
) : (
<form
  className="nl-form"
  noValidate={false}
  onSubmit={(e) => { e.preventDefault(); setDone(true); }}
>
<input className="nl-input" type="email" required aria-label="Email address" placeholder="Your email" />
<button className="nl-button" type="submit">Notify me</button>
</form>
)}
</div>
</section>
  );
}
