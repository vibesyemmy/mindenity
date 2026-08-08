import { useEffect, useState } from "react";
import Header from "../sections/Header";
import Footer from "../sections/Footer";
import { SEGMENTS, INTERNATIONAL, NO_FEES } from "./plans-content";
import "./plans.css";

const IDS = SEGMENTS.map((s) => s.id);

function segmentFromHash() {
  const id = window.location.hash.replace("#", "");
  return IDS.includes(id) ? id : IDS[0];
}

export default function PlansPage() {
  /* The nav and the who-it's-for cards deep-link to #individual/#couple/#family,
     so the hash picks the tab rather than scrolling to a section. */
  const [activeId, setActiveId] = useState(segmentFromHash);

  useEffect(() => {
    const onHash = () => setActiveId(segmentFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const select = (id: string) => {
    setActiveId(id);
    /* Keeps the link shareable without jumping the page. */
    window.history.replaceState(null, "", `#${id}`);
  };

  const active = SEGMENTS.find((s) => s.id === activeId) ?? SEGMENTS[0];

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

          <div className="pl-tabs" role="tablist" aria-label="Who the plan is for">
            {SEGMENTS.map((segment) => (
              <button
                key={segment.id}
                role="tab"
                type="button"
                id={`tab-${segment.id}`}
                aria-selected={segment.id === activeId}
                aria-controls={`panel-${segment.id}`}
                className={`pl-tab ${segment.id === activeId ? "is-active" : ""}`}
                onClick={() => select(segment.id)}
              >
                <span className="pl-tab-full">{segment.tab}</span>
                <span className="pl-tab-short">{segment.short}</span>
              </button>
            ))}
          </div>

          <section
            className="pl-panel"
            role="tabpanel"
            id={`panel-${active.id}`}
            aria-labelledby={`tab-${active.id}`}
          >
            <p className="pl-intro">{active.intro}</p>

            <div className="pl-grid" data-count={active.plans.length}>
              {active.plans.map((plan) => (
                <article
                  key={plan.name}
                  className={`pl-card ${plan.badge ? "is-featured" : ""}`}
                >
                  {plan.badge && <span className="pl-badge">{plan.badge}</span>}

                  <h2 className="pl-name">{plan.name}</h2>

                  <p className="pl-price">
                    <span>{plan.price}</span>
                    <small>{plan.cadence}</small>
                  </p>

                  <p className="pl-summary">{plan.summary}</p>

                  <a
                    className={`pl-cta ${plan.badge ? "is-solid" : ""}`}
                    href="/find-my-plan"
                  >
                    Get started
                  </a>

                  {plan.inherits && (
                    <p className="pl-inherits">Everything in {plan.inherits}, plus</p>
                  )}

                  <ul className="pl-includes">
                    {plan.includes.map((item) => (
                      <li key={item}>
                        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                          <path
                            d="M2.5 7.5l3 3 6-6.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            {active.pending && (
              <p className="pl-pending" role="note">
                {active.pending}
              </p>
            )}
          </section>

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
