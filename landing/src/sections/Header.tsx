import { useState } from "react";
import { Wordmark } from "../components/ui";

const NAV = ["Products", "Solutions", "Partners", "Resources", "About"];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#0f0f10]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="shrink-0">
          <Wordmark light />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <button
              key={item}
              type="button"
              className="rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-colors hover:text-white"
            >
              {item}
            </button>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#0f0f10] transition-transform hover:scale-[1.02]"
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-8 w-8 items-center justify-center md:hidden"
        >
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none">
            <path
              d={mobileOpen ? "M8 8L24 24M24 8L8 24" : "M5.25 11H26.75M5.25 21H26.75"}
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
