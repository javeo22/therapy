"use client";

import { BottomNav, type NavTab } from "@/components/ui/bottom-nav";
import { Users, Settings } from "lucide-react";

const therapistTabs: NavTab[] = [
  { href: "/terapeuta/pacientes", label: "Pacientes", icon: Users },
  { href: "/terapeuta/ajustes", label: "Ajustes", icon: Settings },
];

export default function TherapistLayout({
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
      <BottomNav tabs={therapistTabs} />
    </div>
  );
}
