import Header from "../sections/Header";
import Footer from "../sections/Footer";
import { SEGMENTS, INTERNATIONAL, NO_FEES } from "./plans-content";
import "./plans.css";

export default function PlansPage() {
  return (
    <div id="__next">
      <Header />
      <main className="styles_main__XsB95">
        <div className="pl">
          <header className="pl-head">
            <p className="pl-eyebrow">Plans</p>
            <h1 className="pl-title">
              Care that fits <em>your life</em>
            </h1>
            <p className="pl-sub">
              Pay for a single session, or subscribe for continuity with the same
              professional. {NO_FEES}
            </p>
          </header>

          {SEGMENTS.map((segment) => (
            <section key={segment.id} id={segment.id} className="pl-segment">
              <div className="pl-segment-head">
                <h2>{segment.label}</h2>
                <p>{segment.intro}</p>
              </div>

              <div className="pl-grid" data-count={segment.plans.length}>
                {segment.plans.map((plan) => (
                  <article key={plan.name} className="pl-card">
                    <h3 className="pl-name">{plan.name}</h3>
                    <p className="pl-price">
                      <span>{plan.price}</span>
                      <small>{plan.cadence}</small>
                    </p>
                    <p className="pl-summary">{plan.summary}</p>
                    <ul className="pl-includes">
                      {plan.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <a className="pl-cta" href="/find-my-plan">
                      Get started
                    </a>
                  </article>
                ))}

                {segment.pending && (
                  <p className="pl-pending" role="note">
                    {segment.pending}
                  </p>
                )}
              </div>
            </section>
          ))}

          <section className="pl-intl">
            <h2>{INTERNATIONAL.heading}</h2>
            <p>{INTERNATIONAL.body}</p>
            <p className="pl-intl-note">{INTERNATIONAL.note}</p>
          </section>

          <p className="pl-more">
            More detail on how sessions, changes and cancellations work is in the{" "}
            <a href="/faq">FAQ</a>.
          </p>

          <aside className="pl-urgent">
            <h2>If you are in crisis right now</h2>
            <p>
              Mindenity is not an emergency service and cannot respond instantly. If
              your life or someone else&rsquo;s is at risk, contact your local
              emergency services or go to your nearest hospital immediately.
            </p>
          </aside>
        </div>
        <Footer />
      </main>
    </div>
  );
}
