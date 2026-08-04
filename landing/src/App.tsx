import Header from "./sections/Header";
import Hero from "./sections/Hero";
import FeaturesSection from "./sections/FeaturesSection";
import WhoSection from "./sections/WhoSection";
import TherapistsSection from "./sections/TherapistsSection";
import TrustedSection from "./sections/TrustedSection";
import FaqSection from "./sections/FaqSection";
import NewsletterSection from "./sections/NewsletterSection";
import Footer from "./sections/Footer";

export default function App() {
  return (
<div id="__next"><Header /><div style={{opacity:"1"}}>
<main className="styles_main__XsB95">
<div className="styles_container__KfcyI" data-theme="purple" data-product="Mindenity App">
<div className="styles_bgWrap__Zd6Bj">
<div className="styles_bg__Bg0d3">
<canvas className="styles_canvas__fjpJS">
</canvas>
</div><Hero /></div>
</div>
<div className="styles_container__KfcyI" data-theme="light" data-product="Mindenity Features">
<div className="styles_bgWrap__Zd6Bj features-wrap"><FeaturesSection /></div>
</div>
<div className="styles_container__KfcyI" data-theme="light" data-product="Mindenity Who">
<div className="styles_bgWrap__Zd6Bj"><WhoSection /></div>
</div>
<div className="styles_container__KfcyI" data-theme="dark" data-product="Mindenity Therapists">
<div className="styles_bgWrap__Zd6Bj therapists-wrap"><TherapistsSection /></div>
</div>
<div className="styles_container__KfcyI" data-theme="light" data-product="Mindenity">
<div className="styles_bgWrap__Zd6Bj">
<div className="styles_bg__Bg0d3">
<canvas className="styles_canvas__fjpJS">
</canvas>
</div><TrustedSection /></div>
</div><FaqSection /><NewsletterSection /><Footer /></main>
</div>
</div>

  );
}
