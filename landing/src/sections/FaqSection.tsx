import { useState } from "react";

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
  // The scrape shipped the accordion frozen shut — the JS that measured and
  // set wrapper heights never survived, so every answer sat at height:0.
  const [open, setOpen] = useState<number | null>(null);
  return (
<>
<section className="styles_section__ZlvVq styles_section__SyNeT" data-alternate-styling="false">
<div className="styles_inner__mnNbL">
<div className="styles_container__JttJK">
<h2 className="styles_heading__VB3wz styles_level2__ilE9d ">
<span>
<span style={{display:"inline-block",position:"relative"}}>FAQs</span>
</span>
</h2>
<div className="styles_content__PgRgh">
<div className="styles_body__PbHUL">
<div className="">
{FAQS.map((faq, i) => (
<div key={faq.q} className="styles_collapsibleContainer__6ElmP" style={{opacity:"1"}}>
<div className="styles_collapsible__aqKSz " data-show-number="false" data-is-open={open === i} data-color="purple">
<button
  className="styles_collapsibleButton__MlK3f"
  type="button"
  aria-expanded={open === i}
  onClick={() => setOpen(open === i ? null : i)}
>
<div className="styles_headerLeft__2ckOK">
<h3 className="styles_collapsibleTitle__nQ5wa">{faq.q}</h3>
</div>
<svg className="styles_collapsibleIcon__WuJte styles_purple__KqAAT" width="52" height="52" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">
<path d="M19 25.5H26L33 25.5" strokeWidth="2" strokeLinecap="round" style={{transform:"none",transformOrigin:"50% 50%",transformBox:"fill-box"}}>
</path>
<path d="M26 18.5L26 25.5L26 32.5" strokeWidth="2" strokeLinecap="round" style={{transform:open === i ? "rotate(90deg)" : "none",transformOrigin:"50% 50%",transformBox:"fill-box",transition:"transform 0.2s ease-out"}}>
</path>
</svg>
</button>
<div className="styles_collapsibleContentWrapper__gWHrn" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer" tabIndex={-1} style={{height: open === i ? "auto" : "0px", overflow: "hidden"}}>
<div className="styles_collapsibleContent__g9P4z" style={{opacity:"1"}}>
<p>{faq.a}</p>
</div>
</div>
</div>
</div>
))}
</div>
</div>
<div className="styles_footer__ed8ng">
<a className="styles_link__3GG_T styles_purple__8oM7m styles_circle__hlCLg " href="/faq">
<span>More about Mindenity</span>
<span className="styles_iconCircle__kK_7C">
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
<path d="M3 8.5H12.5M12.5 8.5L8.5 4.5M12.5 8.5L8.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
</path>
</svg>
</span>
</a>
</div>
</div>
</div>
</div>
</section>
</>
  );
}
