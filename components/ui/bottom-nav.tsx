"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

export interface NavTab {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  tabs: NavTab[];
}

export function BottomNav({ tabs }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 flex justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "var(--glass-blur)",
        WebkitBackdropFilter: "var(--glass-blur)",
        borderTop: "var(--glass-border)",
      }}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href || pathname.startsWith(tab.href + "/");
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`
              flex flex-col items-center gap-0.5 px-4 py-1
              text-xs font-medium transition-colors duration-200
              ${isActive ? "text-primary" : "text-on-surface-variant"}
            `}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
