import Header from "./sections/Header";
import Hero from "./sections/Hero";
import FeaturesSection from "./sections/FeaturesSection";
import WhoSection from "./sections/WhoSection";
import TherapistsSection from "./sections/TherapistsSection";
import FaqSection from "./sections/FaqSection";
import NewsletterSection from "./sections/NewsletterSection";
import Footer from "./sections/Footer";
import FaqPage from "./pages/FaqPage";
import PlansPage from "./pages/PlansPage";
import PrivacyPage from "./pages/legal/PrivacyPage";
import TermsPage from "./pages/legal/TermsPage";

/* Static site, so routing is a lookup rather than a router — every entry is a
   full page load. Revisit if these pages ever need shared client-side state. */
const ROUTES: Record<string, () => React.ReactElement> = {
  "/faq": FaqPage,
  /* The nav and the who-it's-for cards have always pointed at /plans; /pricing
     is an alias for anyone who guesses that instead. */
  "/plans": PlansPage,
  "/pricing": PlansPage,
  "/privacy": PrivacyPage,
  "/terms": TermsPage,
};

export default function App() {
  const path = window.location.pathname.replace(/\/+$/, "");
  const Page = ROUTES[path];
  if (Page) return <Page />;

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
<FaqSection /><NewsletterSection /><Footer /></main>
</div>
</div>

  );
}
