import { Fragment, useMemo, useState } from "react";
import Header from "../sections/Header";
import Footer from "../sections/Footer";
import { FAQ_GROUPS, type Block } from "./faq-content";
import "./faq-page.css";

function renderRich(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>
  );
}

function AnswerBlock({ block }: { block: Block }) {
  if (block.kind === "p") return <p>{renderRich(block.text)}</p>;
  if (block.kind === "ul")
    return (
      <ul>
        {block.items.map((item) => (
          <li key={item}>{renderRich(item)}</li>
        ))}
      </ul>
    );
  return (
    <div className="fp-prices">
      {block.rows.map(([label, price]) => (
        <div key={label}>
          <span>{label}</span>
          <span>{price}</span>
        </div>
      ))}
    </div>
  );
}

function blockText(block: Block): string {
  if (block.kind === "p") return block.text;
  if (block.kind === "ul") return block.items.join(" ");
  return block.rows.flat().join(" ");
}

export default function FaqPage() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return FAQ_GROUPS;
    return FAQ_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        `${item.q} ${item.a.map(blockText).join(" ")}`.toLowerCase().includes(q)
      ),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  return (
    <div id="__next">
      <Header />
      <main className="styles_main__XsB95">
        <section className="fp">
          <div className="fp-head">
            <h1 className="fp-title">
              Questions, <em>answered</em>
            </h1>
            <p className="fp-sub">The things people ask before they start.</p>
            <div className="fp-filter">
              <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                <circle cx="7" cy="7" r="5" />
                <line x1="10.8" y1="10.8" x2="14" y2="14" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions"
                aria-label="Search questions"
              />
            </div>
          </div>

          {groups.map((group) => (
            <div key={group.label} className="fp-group">
              <p className="fp-group-label">{group.label}</p>
              {group.items.map((item) => {
                const isOpen = open === item.q;
                return (
                  <div key={item.q} className="fp-item" data-open={isOpen}>
                    <button
                      className="fp-q"
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : item.q)}
                    >
                      <span>{item.q}</span>
                      <svg
                        className="fp-icon"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path d="M3 10h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                        <path
                          d="M10 3v14"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          style={{
                            transform: isOpen ? "rotate(90deg)" : "none",
                            transformOrigin: "50% 50%",
                            transition: "transform 0.24s ease-out",
                            opacity: isOpen ? 0 : 1,
                          }}
                        />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="fp-a">
                        {item.a.map((block, i) => (
                          <AnswerBlock key={i} block={block} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {groups.length === 0 && (
            <p className="fp-empty">
              No questions match that search. Try a different word, or reach us directly.
            </p>
          )}

          <div className="fp-urgent">
            <h2>If you are in crisis right now</h2>
            <p>
              Mindenity is not an emergency service and cannot respond instantly. If your life or
              someone else&rsquo;s is at risk, contact your local emergency services or go to your
              nearest hospital immediately.
            </p>
          </div>
        </section>
        <Footer />
      </main>
    </div>
  );
}
