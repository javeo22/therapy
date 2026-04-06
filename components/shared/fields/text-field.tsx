"use client";

import type { TextField as TextFieldType } from "@/lib/types/forms";

interface TextFieldProps {
  field: TextFieldType;
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function TextField({
  field,
  value,
  onChange,
  error,
  disabled,
}: TextFieldProps) {
  const commonClasses =
    "w-full px-4 py-3 rounded-xl bg-surface-container-highest text-on-surface placeholder:text-on-surface-variant/50 border-b-2 border-transparent focus:bg-white focus:border-primary/40 focus:outline-none transition-all duration-300 ease-out disabled:opacity-50";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-on-surface">
        {field.label}
      </label>
      {field.multiline ? (
        <textarea
          rows={4}
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`${commonClasses} resize-none`}
        />
      ) : (
        <input
          type="text"
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={commonClasses}
        />
      )}
      {error && <p className="text-xs text-error font-medium">{error}</p>}
    </div>
  );
}
