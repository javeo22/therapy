"use client";

import type { EmotionField } from "@/lib/types/forms";

interface EmotionPickerProps {
  field: EmotionField;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function EmotionPicker({
  field,
  value,
  onChange,
  error,
  disabled,
}: EmotionPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-on-surface">
        {field.label}
      </label>
      <div className="flex flex-wrap gap-2">
        {field.options.map((emotion) => {
          const isSelected = value === emotion;

          return (
            <button
              key={emotion}
              type="button"
              disabled={disabled}
              onClick={() => onChange(emotion)}
              className={`
                px-3 py-2 rounded-xl text-sm font-medium
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
              {emotion}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}
