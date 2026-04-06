"use client";

import type { SelectField as SelectFieldType } from "@/lib/types/forms";

interface SelectFieldProps {
  field: SelectFieldType;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function SelectField({
  field,
  value,
  onChange,
  error,
  disabled,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-on-surface">
        {field.label}
      </label>
      <div className="flex flex-col gap-1.5">
        {field.options.map((option) => {
          const isSelected = value === option;

          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option)}
              className={`
                px-4 py-3 rounded-xl text-sm text-left
                transition-all duration-200
                disabled:opacity-50
                ${
                  isSelected
                    ? "text-white font-medium"
                    : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                }
              `}
              style={
                isSelected
                  ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dim))" }
                  : undefined
              }
            >
              {option}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}
