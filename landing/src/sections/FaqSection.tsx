import { useState } from "react";
import "./faq.css";

const FAQS = [
  {
    q: "What is Mindenity?",
    a: "A mental wellness platform pairing licensed therapists with an app that supports you between sessions — mood, sleep, journaling, guided breathing and an AI companion.",
  },
  {
    q: "How do I find the right therapist?",
    a: "A short intake asks what you're facing, how urgent it feels and how you'd like to meet. You get three matched therapists and a suggested plan. You can ignore both and browse freely.",
  },
  {
    q: "What does it cost?",
    a: "In Nigeria, individual therapy starts at ₦30,000 for a single session, with monthly plans at ₦120,000 for four sessions and ₦350,000 for eight. Couple and family plans are priced separately. International pricing is in US dollars, set around 30% below the global standard.",
  },
  {
    q: "What if I need help urgently?",
    a: "Crisis Support Access connects you to your therapist or a support line. If you flag a crisis at intake, you're matched with priority and a therapist responds within 30 minutes. Mindenity is not an emergency service — if you are in immediate danger, contact your local emergency number.",
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
</section>
  );
}
