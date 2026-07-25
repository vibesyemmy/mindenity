import { Header } from "./sections/Header";
import { Hero } from "./sections/Hero";
import { ProSection } from "./sections/ProSection";
import { CareSection } from "./sections/CareSection";
import { TrustSection } from "./sections/TrustSection";
import { FaqSection } from "./sections/FaqSection";
import { Footer } from "./sections/Footer";

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProSection />
        <CareSection />
        <TrustSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  );
}
