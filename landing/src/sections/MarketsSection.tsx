const SEGMENTS = [
  {
    label: "From ₦30,000 / $55",
    title: "Individual",
    description:
      "One-to-one therapy for anxiety, stress, grief and the weight of everyday life.",
    plans: ["Essential", "Balance", "Thrive"],
  },
  {
    label: "From ₦50,000 / $62",
    title: "Couple",
    description:
      "Two people, one room. For conflict, trust, grief and life after a big change.",
    plans: ["Together", "Harmony", "Restore"],
  },
  {
    label: "From ₦100,000 / $85",
    title: "Family",
    description:
      "Up to five people. For parenting strain, adolescent support and family transition.",
    plans: ["Home", "Family Care", "Family Thrive"],
  },
];

export default function MarketsSection() {
  return (
<>
<section className="styles_section__ZlvVq styles_section__DYAms " data-alternate-styling="false">
<div className="styles_inner__mnNbL">
<div className="styles_content__aHSjq">
<div className="styles_product__Ntvbx " style={{opacity:"1"}}>
Plans</div>
<div className="styles_headingGroup__0n2Zi">
<h1 className="styles_heading__VB3wz styles_level1Large__bDeUm styles_title__G9AAz">
<span>
<span style={{display:"inline-block",position:"relative",opacity:"1"}}>Care</span> <span style={{display:"inline-block",position:"relative",opacity:"1"}}>for</span>
</span> <span className="styles_highlight__dzRbM">
<span>
<span style={{display:"inline-block",position:"relative",opacity:"1"}}>every</span>
</span>
</span> <span>
<span style={{display:"inline-block",position:"relative",opacity:"1"}}>season.</span>
</span>
</h1>
<p className="styles_description__5Hvnp" style={{opacity:"1"}}>Nine plans across three segments. Start with a single session, or commit to weekly work &mdash; you choose the intensity.</p>
</div>
<div className="styles_buttons__I2eai" style={{opacity:"1"}}>
<a href="/plans" className="styles_button__dr0t2 styles_variant-solid__XVs0U styles_size-large__hWtuW styles_color-white__Ob5Ba">See all plans</a>
<a className="styles_button__dr0t2 styles_variant-soft__KmN8b styles_size-large__hWtuW styles_color-white__Ob5Ba" href="/find-my-plan">Find my plan</a>
</div>
{/* Illustration frame removed: the scrape referenced /images/aave-pro-borrow.svg,
    which was never captured, so the <object> 404'd and vite's SPA fallback
    recursively embedded index.html here. Restore the frame when a real product
    screenshot (plan selection UI from the Figma DS) is exported. */}
<div className="styles_subsection__hAbWi">
<div style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%"}}>
<div className="section-heading_sectionHeading__nt8p8">
<div className="section-heading_sectionTitleBlock__JY3cm">
<h2>
<span>
<span style={{display:"inline-block",position:"relative",opacity:"1"}}>Priced</span> <span style={{display:"inline-block",position:"relative",opacity:"1"}}>for</span> <span style={{display:"inline-block",position:"relative",opacity:"1"}}>where</span> <span style={{display:"inline-block",position:"relative",opacity:"1"}}>you</span> <span style={{display:"inline-block",position:"relative",opacity:"1"}}>are.</span>
</span>
</h2>
</div>
<p>Nigeria pays in naira. Everywhere else pays in dollars, at rates set 30% below the global standard. Two tracks, never a surprise conversion.</p>
</div>
</div>
<a className="styles_button__dr0t2 styles_variant-soft__KmN8b styles_size-large__hWtuW styles_color-white__Ob5Ba" href="/plans">Compare plans</a>
</div>
<div className="styles_cards__yrfVG">
{SEGMENTS.map((seg) => (
  <div key={seg.title} className="market-card_card__9IVq5">
    <div className="market-card_body__hM_sx">
      <div className="market-card_header__VC2lH">
        <div className="market-card_titleBlock__wqFI8">
          <span className="market-card_label__w6NOo">{seg.label}</span>
          <h3 className="market-card_title__HEJvk">{seg.title}</h3>
        </div>
        <p className="market-card_description__w4iKY">{seg.description}</p>
      </div>
    </div>
    <div className="market-card_tokens__bDtDP">
      {seg.plans.map((plan) => (
        <div key={plan} style={{opacity:"1"}}>
          <span className="token-badge_badge__i08jS">
            <span className="token-badge_name__yIbwt">{plan}</span>
          </span>
        </div>
      ))}
    </div>
  </div>
))}
</div>
</div>
</div>
</section>
</>
  );
}
