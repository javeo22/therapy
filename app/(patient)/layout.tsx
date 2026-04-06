export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <header className="sticky top-0 z-40 px-4 py-3" style={{ background: "var(--glass-bg)", backdropFilter: "var(--glass-blur)" }}>
        <h1 className="font-serif text-lg font-bold text-on-surface">Therapy</h1>
      </header>
      <main className="flex-1 px-4 pb-20">{children}</main>
      <nav
        className="fixed bottom-0 inset-x-0 z-50 flex justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "var(--glass-blur)",
          borderTop: "var(--glass-border)",
        }}
      >
        <NavItem href="/paciente" label="Inicio" />
        <NavItem href="/paciente/registros" label="Registros" />
        <NavItem href="/paciente/progreso" label="Progreso" />
        <NavItem href="/paciente/perfil" label="Perfil" />
      </nav>
    </div>
  );
}

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="flex flex-col items-center gap-0.5 text-on-surface-variant text-xs font-medium px-4 py-1"
    >
      <span>{label}</span>
    </a>
  );
}
