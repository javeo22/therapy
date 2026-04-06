"use client";

import { BottomNav, type NavTab } from "@/components/ui/bottom-nav";
import { SideNav } from "@/components/ui/side-nav";
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
    <div className="min-h-dvh bg-surface flex">
      {/* Desktop sidebar */}
      <SideNav tabs={therapistTabs} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header — hidden on desktop */}
        <header
          className="sticky top-0 z-40 px-4 py-3 md:hidden"
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

        <main className="flex-1 px-4 pb-20 md:pb-6 md:px-8 lg:px-12 md:pt-6 max-w-6xl">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav — hidden on desktop */}
      <div className="md:hidden">
        <BottomNav tabs={therapistTabs} />
      </div>
    </div>
  );
}
