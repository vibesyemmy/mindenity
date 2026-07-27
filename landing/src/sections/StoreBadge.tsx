import { useState } from "react";
import "./store-badges.css";

/**
 * A store badge.
 *
 * The artwork is an official vendor file served from public/ — see
 * public/images/badges/BADGES.md. It is deliberately not inlined or redrawn:
 * Apple and Google both require their badges unmodified, so the only correct
 * source is their own download.
 *
 * If the image fails to load we fall back to a dashed placeholder carrying the
 * badge's own wording rather than a broken-image glyph.
 */
export default function StoreBadge({ href, src, label }: { href: string; src: string; label: string }) {
  const [missing, setMissing] = useState(false);
  return (
    <a
      className={`store-badge${missing ? " store-badge--placeholder" : ""}`}
      href={href}
      aria-label={label}
    >
      {missing ? label : <img src={src} alt={label} onError={() => setMissing(true)} />}
    </a>
  );
}
