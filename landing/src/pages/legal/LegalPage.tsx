import { Fragment, useEffect, useMemo, useState } from "react";
import Header from "../../sections/Header";
import Footer from "../../sections/Footer";
import type { LegalBlock } from "./types";
import "./legal.css";

/*
 * Shared shell for the Privacy Policy and Terms pages. Both documents share a
 * structure — numbered top-level sections, occasional sub-headings, definition
 * and contact tables — so one renderer serves both.
 */

/* Placeholders the client has still to fill in ("[Insert effective date]",
   "[CONFIRM ...]"). Marked rather than silently rendered: while these documents
   are in draft, anyone reviewing the page should be able to see what is
   unresolved instead of mistaking a bracketed stub for finished wording. */
const PLACEHOLDER = /(\[[^\]]{1,80}\])/g;

function withPlaceholders(text: string) {
  return text.split(PLACEHOLDER).map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="lg-todo" title="Unresolved in the source document">
        {part}
      </mark>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}

function slug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* Consecutive `li` blocks belong in one list; everything else passes through. */
function group(blocks: LegalBlock[]) {
  const out: (LegalBlock | { kind: "ul"; items: string[] })[] = [];
  for (const block of blocks) {
    const last = out[out.length - 1];
    if (block.kind === "li") {
      if (last && last.kind === "ul") last.items.push(block.text);
      else out.push({ kind: "ul", items: [block.text] });
    } else {
      out.push(block);
    }
  }
  return out;
}

export default function LegalPage({
  title,
  standfirst,
  blocks,
}: {
  title: string;
  standfirst: string;
  blocks: LegalBlock[];
}) {
  const grouped = useMemo(() => group(blocks), [blocks]);
  const contents = useMemo(
    () => blocks.filter((b) => b.kind === "h2").map((b) => (b as { text: string }).text),
    [blocks]
  );
  const [active, setActive] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  /* Panel is a mobile-only overlay, so it closes on Escape, on choosing a
     section, and when the viewport grows back to the sidebar layout. The page
     behind it is locked while it is open. */
  useEffect(() => {
    if (!menuOpen) return;

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    const mq = window.matchMedia("(min-width: 1000px)");
    const onChange = () => mq.matches && setMenuOpen(false);

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [menuOpen]);

  /* Highlight whichever section is currently being read. The bottom margin
     keeps the trigger band near the top of the viewport, so the active entry
     changes as a heading reaches the top rather than the middle. */
  useEffect(() => {
    const headings = contents
      .map((heading) => document.getElementById(slug(heading)))
      .filter((el): el is HTMLElement => el !== null);
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      () => {
        const onscreen = headings.filter(
          (el) => el.getBoundingClientRect().top <= 140
        );
        const current = onscreen.length ? onscreen[onscreen.length - 1] : headings[0];
        setActive(current.id);
      },
      { rootMargin: "-88px 0px -65% 0px", threshold: [0, 1] }
    );

    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [contents]);

  return (
    <div id="__next">
      <Header />
      <main className="styles_main__XsB95">
        <article className="lg">
          <header className="lg-head">
            <p className="lg-eyebrow">Legal</p>
            <h1 className="lg-title">{title}</h1>
            <p className="lg-standfirst">{standfirst}</p>
          </header>

          <div className="lg-layout">
          <div
            className="lg-toc-backdrop"
            data-open={menuOpen}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <nav className="lg-toc" aria-label="Contents" data-open={menuOpen}>
            <div className="lg-toc-head">
              <p className="lg-toc-label">Contents</p>
              <button
                className="lg-toc-close"
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close contents"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <ol>
              {contents.map((heading) => {
                const id = slug(heading);
                return (
                  <li key={heading}>
                    <a
                      href={`#${id}`}
                      className={active === id ? "is-active" : undefined}
                      aria-current={active === id ? "location" : undefined}
                      onClick={() => setMenuOpen(false)}
                    >
                      {heading}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="lg-body">
            {grouped.map((block, i) => {
              if (block.kind === "ul")
                return (
                  <ul key={i}>
                    {block.items.map((item, j) => (
                      <li key={j}>{withPlaceholders(item)}</li>
                    ))}
                  </ul>
                );

              if (block.kind === "table")
                return (
                  <div key={i} className="lg-table-wrap">
                    <table className="lg-table">
                      <tbody>
                        {block.rows.map((row, r) => (
                          <tr key={r}>
                            {row.map((cell, c) => (
                              <td key={c}>{withPlaceholders(cell)}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );

              if (block.kind === "h2")
                return (
                  <h2 key={i} id={slug(block.text)}>
                    {block.text}
                  </h2>
                );

              if (block.kind === "h3") return <h3 key={i}>{block.text}</h3>;
              if (block.kind === "title") return <h2 key={i}>{block.text}</h2>;

              return <p key={i}>{withPlaceholders(block.text)}</p>;
            })}
          </div>
          </div>

          {/* Sidebar replacement below the two-column breakpoint. */}
          <button
            className="lg-toc-trigger"
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-label="Open contents"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M2.5 4.5h13M2.5 9h13M2.5 13.5h8"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Contents
          </button>
        </article>
        <Footer />
      </main>
    </div>
  );
}
