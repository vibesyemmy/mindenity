import { Fragment, useMemo } from "react";
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

          <nav className="lg-toc" aria-label="Contents">
            <p className="lg-toc-label">Contents</p>
            <ol>
              {contents.map((heading) => (
                <li key={heading}>
                  <a href={`#${slug(heading)}`}>{heading}</a>
                </li>
              ))}
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
        </article>
        <Footer />
      </main>
    </div>
  );
}
