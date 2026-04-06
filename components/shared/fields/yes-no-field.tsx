"use client";

import type { YesNoField as YesNoFieldType } from "@/lib/types/forms";

interface YesNoFieldProps {
  field: YesNoFieldType;
  value?: boolean;
  onChange: (value: boolean) => void;
  error?: string;
  disabled?: boolean;
}

export function YesNoField({
  field,
  value,
  onChange,
  error,
  disabled,
}: YesNoFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-on-surface">
        {field.label}
      </label>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Sí", val: true },
          { label: "No", val: false },
        ].map(({ label, val }) => {
          const isSelected = value === val;

          return (
            <button
              key={label}
              type="button"
              disabled={disabled}
              onClick={() => onChange(val)}
              className={`
                py-3 rounded-xl text-sm font-medium
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
              {label}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}
