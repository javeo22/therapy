"use client";

import type { ScaleField as ScaleFieldType } from "@/lib/types/forms";

interface ScaleFieldProps {
  field: ScaleFieldType;
  value?: number;
  onChange: (value: number) => void;
  error?: string;
  disabled?: boolean;
}

export function ScaleField({
  field,
  value,
  onChange,
  error,
  disabled,
}: ScaleFieldProps) {
  const steps = Array.from(
    { length: field.max - field.min + 1 },
    (_, i) => field.min + i
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-on-surface">
        {field.label}
      </label>
      <div className="flex gap-1">
        {steps.map((step) => {
          const isSelected = value === step;
          const isFilled = value !== undefined && step <= value;

          return (
            <button
              key={step}
              type="button"
              disabled={disabled}
              onClick={() => onChange(step)}
              className={`
                flex-1 py-2.5 rounded-lg text-xs font-medium
                transition-all duration-200
                disabled:opacity-50
                ${
                  isSelected
                    ? "text-white scale-105"
                    : isFilled
                      ? "bg-primary/20 text-primary"
                      : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                }
              `}
              style={
                isSelected
                  ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dim))" }
                  : undefined
              }
            >
              {step}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-on-surface-variant/60">
        <span>{field.minLabel || field.min}</span>
        <span>{field.maxLabel || field.max}</span>
      </div>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}
