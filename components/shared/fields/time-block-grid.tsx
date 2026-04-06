"use client";

import type { TimeBlockField } from "@/lib/types/forms";
import { Sun, Sunset, Moon } from "lucide-react";

interface TimeBlockGridProps {
  field: TimeBlockField;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

const blockIcons: Record<string, React.ReactNode> = {
  Mañana: <Sun size={16} />,
  Tarde: <Sunset size={16} />,
  Noche: <Moon size={16} />,
};

export function TimeBlockGrid({
  field,
  value,
  onChange,
  error,
  disabled,
}: TimeBlockGridProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-on-surface">
        {field.label}
      </label>
      <div className="grid grid-cols-3 gap-2">
        {field.blocks.map((block) => {
          const isSelected = value === block;

          return (
            <button
              key={block}
              type="button"
              disabled={disabled}
              onClick={() => onChange(block)}
              className={`
                flex flex-col items-center gap-1 py-3 rounded-xl text-xs font-medium
                transition-all duration-200
                disabled:opacity-50
                ${
                  isSelected
                    ? "text-white"
                    : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                }
              `}
              style={
                isSelected
                  ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dim))" }
                  : undefined
              }
            >
              {blockIcons[block] || null}
              {block}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}
