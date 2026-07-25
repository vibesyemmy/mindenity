import type { ReactNode } from "react";

/* ── Shared UI components ─────────────────────────────────── */

export function LogoMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <circle cx="16" cy="16" r="14" className="fill-purple-3" />
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
      <span className={`text-lg font-bold tracking-tight ${light ? "text-white" : "text-fg-1"}`}>
        Mindenity
      </span>
    </span>
  );
}

export function Badge({ children, icon }: { children: ReactNode; icon?: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/[0.08] px-3.5 py-1.5 text-sm font-medium text-white/80 backdrop-blur">
      {icon && <img src={icon} alt="" className="h-5 w-5" />}
      {children}
    </span>
  );
}

export function SolidButton({
  children,
  color = "purple",
  large = false,
  className = "",
}: {
  children: ReactNode;
  color?: "purple" | "white" | "dark";
  large?: boolean;
  className?: string;
}) {
  const base = large ? "px-7 py-3.5 text-base" : "px-5 py-2.5 text-sm";
  const colors: Record<string, string> = {
    purple: "bg-[#978eff] text-white hover:bg-[#8673ff]",
    white: "bg-white text-[#0f0f10] hover:bg-white/90",
    dark: "bg-[#252228] text-white hover:bg-[#3b383e]",
  };
  return (
    <a
      href="#"
      className={`inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-transform hover:scale-[1.02] ${base} ${colors[color]} ${className}`}
    >
      {children}
    </a>
  );
}

export function GhostButton({
  children,
  large = false,
  className = "",
}: {
  children: ReactNode;
  large?: boolean;
  className?: string;
}) {
  const base = large ? "px-7 py-3.5 text-base" : "px-5 py-2.5 text-sm";
  return (
    <a
      href="#"
      className={`inline-flex items-center justify-center rounded-full bg-white/[0.08] font-semibold text-white backdrop-blur transition-colors hover:bg-white/[0.14] ${base} ${className}`}
    >
      {children}
    </a>
  );
}

export function Em({ children }: { children: ReactNode }) {
  return <span className="italic" style={{ fontFamily: "var(--font-display)" }}>{children}</span>;
}

/* ── Section wrapper ──────────────────────────────────────── */

export function ProductSection({
  product,
  theme = "purple",
  children,
  className = "",
}: {
  product: string;
  theme?: "purple" | "dark" | "light";
  children: ReactNode;
  className?: string;
}) {
  const themes: Record<string, string> = {
    purple: "from-[#0f0f10] via-[#12121a] to-[#0f0f10]",
    dark: "from-[#0f0f10] via-[#0f0f10] to-[#0f0f10]",
    light: "from-white via-[#fafaf9] to-white",
  };
  const textTheme = theme === "light" ? "text-fg-1" : "text-white";

  return (
    <section
      data-product={product}
      className={`relative overflow-hidden ${textTheme} ${className}`}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className={`absolute inset-0 bg-gradient-to-b ${themes[theme]}`} />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              theme === "purple"
                ? "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(152,150,255,0.15), transparent 70%)"
                : "none",
          }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-24">{children}</div>
    </section>
  );
}
