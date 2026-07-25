import type { ReactNode } from "react";

export function Badge({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-semibold ${
        dark ? "bg-white/10 text-white" : "bg-white text-navy-60 shadow-sm ring-1 ring-navy-10"
      }`}
    >
      <LogoMark className="h-4 w-4" />
      {children}
    </span>
  );
}

export function LogoMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <circle cx="16" cy="16" r="14" className="fill-navy-60" />
      <path
        d="M10 21v-8.5c0-.8.9-1.3 1.6-.8l4.4 3.1 4.4-3.1c.7-.5 1.6 0 1.6.8V21"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wordmark({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2">
      <LogoMark />
      <span className={`text-lg font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Mindenity
      </span>
    </span>
  );
}

export function PrimaryButton({
  children,
  magenta = false,
  className = "",
}: {
  children: ReactNode;
  magenta?: boolean;
  className?: string;
}) {
  return (
    <a
      href="#"
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] ${
        magenta ? "bg-magenta-60 hover:bg-magenta-70" : "bg-navy-60 hover:bg-navy-70"
      } ${className}`}
    >
      {children}
    </a>
  );
}

export function GhostButton({
  children,
  dark = false,
  className = "",
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <a
      href="#"
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-colors ${
        dark
          ? "bg-white/10 text-white hover:bg-white/20"
          : "bg-white text-ink shadow-sm ring-1 ring-navy-10 hover:bg-cloud"
      } ${className}`}
    >
      {children}
    </a>
  );
}

export function Tag({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        dark ? "bg-white/10 text-white/80" : "bg-navy-5 text-navy-50"
      }`}
    >
      {children}
    </span>
  );
}

export function Em({ children }: { children: ReactNode }) {
  return <em className="font-medium italic">{children}</em>;
}
