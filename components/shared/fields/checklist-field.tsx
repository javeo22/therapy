"use client";

import type { ChecklistField as ChecklistFieldType } from "@/lib/types/forms";
import { Check } from "lucide-react";

interface ChecklistFieldProps {
  field: ChecklistFieldType;
  value?: string[];
  onChange: (value: string[]) => void;
  error?: string;
  disabled?: boolean;
}

export function ChecklistField({
  field,
  value = [],
  onChange,
  error,
  disabled,
}: ChecklistFieldProps) {
  function toggle(option: string) {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-on-surface">
        {field.label}
      </label>
      <div className="flex flex-col gap-1.5">
        {field.options.map((option) => {
          const isChecked = value.includes(option);

          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => toggle(option)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-left
                transition-all duration-200
                disabled:opacity-50
                ${
                  isChecked
                    ? "bg-primary/10 text-on-surface font-medium"
                    : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                }
              `}
            >
              <div
                className={`
                  w-5 h-5 rounded-md flex items-center justify-center shrink-0
                  transition-all duration-200
                  ${isChecked ? "bg-primary text-white" : "bg-surface-container-high"}
                `}
              >
                {isChecked && <Check size={12} />}
              </div>
              {option}
            </button>
          );
        })}
      </div>
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}
