// Interim layout for the (dashboard) route group.
// Replaced when the global-chrome spec (sidebar + topbar) lands.
// Per design spec §9 interim-unblocking note.

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/30">
      <main className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  );
}
