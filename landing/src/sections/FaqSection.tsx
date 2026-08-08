import { useState } from "react";
import "./faq.css";

/* The five most-asked, in the client's own wording. The full set lives on /faq. */
const FAQS = [
  {
    q: "What is Mindenity?",
    a: "A mental health and wellness platform that connects you with licensed therapists, counsellors and wellness coaches by voice or video, from your phone. Alongside sessions you get a guided wellness check-in, a private AI companion for the hours between appointments, and plans for individuals, couples and families.",
  },
  {
    q: "Do I need a diagnosis or a referral to start?",
    a: "No. You do not need a referral, a diagnosis, or a reason that sounds serious enough. The check-in you complete when you sign up asks about your mood, stress, sleep and what is on your mind, then points you toward the kind of support that fits.",
  },
  {
    q: "How do I find the right therapist?",
    a: "Your check-in produces a short profile of what you are dealing with, and the app recommends professionals whose training matches. You see each person's specialisms, approach, languages and availability before you book. Nobody is assigned to you without your say-so.",
  },
  {
    q: "What does it cost?",
    a: "You can pay per session or subscribe monthly. In Nigeria that starts at ₦30,000 for a single individual session, ₦120,000 for four a month and ₦350,000 for eight. Outside Nigeria you pay in US dollars, from $55 a session — roughly 30% below comparable Western platforms.",
  },
  {
    q: "What if I need help urgently?",
    a: "Mindenity is not an emergency service. If you or someone near you is in immediate danger, contact your local emergency services or go to the nearest hospital now. Inside the app, crisis support is one tap away on subscription plans and reaches your professional directly.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
<section className="faq">
<h2 className="faq-title">Questions, <em>answered</em></h2>
<p className="faq-sub">The things people ask before they start.</p>
<div className="faq-list">
{FAQS.map((faq, i) => (
<div key={faq.q} className="faq-item" data-open={open === i}>
<button
  className="faq-q"
  type="button"
  aria-expanded={open === i}
  onClick={() => setOpen(open === i ? null : i)}
>
<span>{faq.q}</span>
<svg className="faq-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
<path d="M3 10h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
<path d="M10 3v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
  style={{transform: open === i ? "rotate(90deg)" : "none", transformOrigin: "50% 50%", transition: "transform 0.2s ease-out"}}/>
</svg>
</button>
<div className="faq-a" style={{height: open === i ? "auto" : "0px", overflow: "hidden"}}>
<p>{faq.a}</p>
</div>
</div>
))}
</div>
<a className="faq-cta" href="/faq">
See all questions
<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
<path d="M3 8.5h9.5M12.5 8.5l-4-4M12.5 8.5l-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
</a>
</section>
  );
}
