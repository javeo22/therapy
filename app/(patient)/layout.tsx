"use client";

import { BottomNav, type NavTab } from "@/components/ui/bottom-nav";
import { Home, ClipboardList, UserCircle } from "lucide-react";

const patientTabs: NavTab[] = [
  { href: "/paciente", label: "Inicio", icon: Home },
  { href: "/paciente/registros", label: "Registros", icon: ClipboardList },
  { href: "/paciente/perfil", label: "Perfil", icon: UserCircle },
];

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-surface flex flex-col">
      <header
        className="sticky top-0 z-40 px-4 py-3"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "var(--glass-blur)",
          WebkitBackdropFilter: "var(--glass-blur)",
        }}
      >
        <h1 className="font-serif text-lg font-bold text-on-surface">
          Therapy
        </h1>
      </header>
      <main className="flex-1 px-4 pb-20">{children}</main>
      <BottomNav tabs={patientTabs} />
    </div>
  );
}
