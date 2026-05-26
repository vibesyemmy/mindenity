import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-muted/40">
      <header className="px-8 py-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 font-heading text-lg font-semibold tracking-tight text-foreground"
        >
          <span
            aria-hidden
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-bold"
          >
            M
          </span>
          Mindenity
          <span className="text-muted-foreground font-normal">· Admin</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="px-8 py-6 text-xs text-muted-foreground flex items-center justify-between">
        <span>© Mindenity {new Date().getFullYear()}</span>
        <div className="flex items-center gap-4">
          <Link href="#" className="hover:text-foreground transition-colors">
            Privacy
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            Terms
          </Link>
          <Link href="#" className="hover:text-foreground transition-colors">
            Status
          </Link>
        </div>
      </footer>
    </div>
  );
}
