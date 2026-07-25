import { PrimaryButton, Wordmark } from "../components/ui";

const NAV = ["Products", "Programs", "Partners", "Resources", "About"];

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Wordmark />
        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-ink"
            >
              {item}
            </a>
          ))}
        </nav>
        <PrimaryButton className="!px-5 !py-2.5">Get Started</PrimaryButton>
      </div>
    </header>
  );
}
