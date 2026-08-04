import StoreBadge from "./StoreBadge";

export default function Hero() {
  return (
<>

<section className="styles_section__ZlvVq styles_section__DYAms styles_flushBottom__CxTdt hero-calm-section" data-alternate-styling="false">
<div className="styles_inner__mnNbL">
<div className="hero-calm">
<div className="hero-copy">
<h1 className="styles_heading__VB3wz styles_level1Large__bDeUm styles_title__G9AAz">
<span>
<span style={{display:"inline-block",position:"relative",opacity:"1"}}>Your</span> <span style={{display:"inline-block",position:"relative",opacity:"1"}}>therapist,</span> <span style={{display:"inline-block",position:"relative",opacity:"1"}}>your</span> <span style={{display:"inline-block",position:"relative",opacity:"1"}}>tools,</span>
</span> <span className="styles_highlight__dzRbM">
<span>
<span style={{display:"inline-block",position:"relative",opacity:"1"}}>your</span> <span style={{display:"inline-block",position:"relative",opacity:"1"}}>pace.</span>
</span>
</span>
</h1>
<p className="styles_description__5Hvnp" style={{opacity:"1"}}>Therapy that works around you, an AI companion that listens between sessions, and tools for your mood, sleep and stress.</p>
<div className="store-badges">
{/* TODO: real store listings once published —
    https://apps.apple.com/app/id<APP_ID>
    https://play.google.com/store/apps/details?id=<PACKAGE_NAME> */}
<StoreBadge href="#" src="/app-store-apple.png" label="Available on the App Store" />
<StoreBadge href="#" src="/google-play-button.png" label="Get it on Google Play" />
</div>
</div>
<div className="hero-phones">
<img className="ph-l" src="/images/app/hero/row/hero-1.png" alt="" width="972" height="1545"/>
<img className="ph-c" src="/images/app/hero/row/hero-2.png" alt="Mindenity app home screen showing mood and mental health metrics" width="972" height="1665"/>
<img className="ph-r" src="/images/app/hero/row/hero-3.png" alt="" width="972" height="1545"/>
</div>
</div>
</div>
</section>

</>
  );
}
