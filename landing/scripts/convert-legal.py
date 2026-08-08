"""Convert the client's legal .docx files into structured JSON for the site.

Deliberately drops two things that must not be published:
  * the Word TOC field ("Contents") — the page builds its own from headings
  * the trailing internal annex of items requiring pre-publication confirmation
"""
import json
import re
import zipfile
from xml.etree import ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


def para_text(p):
    return "".join(t.text or "" for t in p.iter(W + "t")).strip()


def para_style(p):
    ps = p.find(f"{W}pPr/{W}pStyle")
    return ps.get(W + "val", "") if ps is not None else ""


def is_list(p):
    return p.find(f"{W}pPr/{W}numPr") is not None


def convert(path):
    z = zipfile.ZipFile(path)
    body = ET.fromstring(z.read("word/document.xml")).find(W + "body")
    blocks = []

    for el in body:
        tag = el.tag.replace(W, "")

        if tag == "tbl":
            rows = []
            for tr in el.findall(W + "tr"):
                cells = [
                    " ".join(
                        para_text(p) for p in tc.findall(W + "p") if para_text(p)
                    )
                    for tc in tr.findall(W + "tc")
                ]
                if any(c for c in cells):
                    rows.append(cells)
            if rows:
                blocks.append({"kind": "table", "rows": rows})
            continue

        if tag != "p":
            continue

        text = para_text(el)
        if not text:
            continue

        style = para_style(el)
        if style in ("Title",):
            blocks.append({"kind": "title", "text": text})
        elif style == "Heading1":
            blocks.append({"kind": "h2", "text": text})
        elif style == "Heading2":
            blocks.append({"kind": "h3", "text": text})
        elif is_list(el):
            blocks.append({"kind": "li", "text": text})
        else:
            blocks.append({"kind": "p", "text": text})

    return blocks


DRAFT_BANNER = re.compile(r"this is a draft,? not legal advice", re.I)


def strip_internal(blocks):
    """Remove the Word TOC, the draft banner and the confirmation annex."""
    out, skipping_toc, dropped = [], False, []

    for i, b in enumerate(blocks):
        text = b.get("text", "")

        # Trailing internal annex: everything from its heading onward.
        if b["kind"] in ("h2", "h3") and re.search(
            r"requiring confirmation before publication", text, re.I
        ):
            dropped.append(("confirmation-annex", len(blocks) - i))
            break

        # The "this is a draft, not legal advice" callout the documents open
        # with. Removed at the client's request.
        if b["kind"] == "table" and any(
            DRAFT_BANNER.search(cell) for row in b["rows"] for cell in row
        ):
            dropped.append(("draft-banner", 1))
            continue

        # Word's generated table of contents.
        if b["kind"] in ("h2", "h3") and text.strip().lower() == "contents":
            skipping_toc = True
            continue
        if skipping_toc:
            if b["kind"] in ("h2", "h3"):
                skipping_toc = False
            else:
                continue

        out.append(b)

    # Word cover-page lines ("MINDENITY", the document title, the standfirst)
    # run before the first table. The page renders its own header from those,
    # so keeping them would print the title twice.
    lead = 0
    while lead < len(out) and out[lead]["kind"] == "p":
        lead += 1
    if lead:
        dropped.append(("cover-lines", lead))
        out = out[lead:]

    return out, dropped


PLACEHOLDER = re.compile(r"\[[^\]]{1,80}\]")

DOCS = {
    "privacy": "/Users/opeyemiajagbe/Downloads/Mindenity_Privacy_Policy.docx",
    "terms": "/Users/opeyemiajagbe/Downloads/Mindenity_Terms_and_Conditions.docx",
}

OUT_DIR = "/Users/opeyemiajagbe/Documents/Projects/mindenity-2/landing/src/pages/legal"

report = {}
for name, path in DOCS.items():
    blocks = convert(path)
    blocks, dropped = strip_internal(blocks)

    placeholders = []
    for b in blocks:
        texts = (
            [c for row in b["rows"] for c in row] if b["kind"] == "table" else [b["text"]]
        )
        for t in texts:
            for m in PLACEHOLDER.findall(t):
                placeholders.append(m)

    header = (
        "/*\n"
        " * Generated from the client's Word document by scripts/convert-legal.py.\n"
        " * Do not hand-edit — re-run the script against an updated .docx instead.\n"
        " *\n"
        " * The Word TOC and the internal 'items requiring confirmation before\n"
        " * publication' annex are deliberately excluded; the page builds its own\n"
        " * contents list from the headings.\n"
        " */\n"
        'import type { LegalBlock } from "./types";\n\n'
        "const BLOCKS: LegalBlock[] = "
    )
    with open(f"{OUT_DIR}/{name}.ts", "w") as fh:
        fh.write(header)
        fh.write(json.dumps(blocks, ensure_ascii=False, indent=2))
        fh.write(";\n\nexport default BLOCKS;\n")

    report[name] = {
        "blocks": len(blocks),
        "headings": sum(1 for b in blocks if b["kind"] in ("h2", "h3")),
        "tables": sum(1 for b in blocks if b["kind"] == "table"),
        "dropped": dropped,
        "placeholders": sorted(set(placeholders)),
    }

print(json.dumps(report, indent=1, ensure_ascii=False))
