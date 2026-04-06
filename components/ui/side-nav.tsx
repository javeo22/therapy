"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavTab } from "./bottom-nav";

interface SideNavProps {
  tabs: NavTab[];
}

export function SideNav({ tabs }: SideNavProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex flex-col w-56 shrink-0 h-dvh sticky top-0 bg-surface-container py-6 px-3">
      <Link href="/terapeuta/pacientes" className="px-3 mb-8">
        <h1 className="font-serif text-xl font-bold text-on-surface">
          Therapy
        </h1>
      </Link>

      <div className="flex flex-col gap-1">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl
                text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "text-white"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }
              `}
              style={
                isActive
                  ? {
                      background:
                        "linear-gradient(135deg, var(--color-primary), var(--color-primary-dim))",
                    }
                  : undefined
              }
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
