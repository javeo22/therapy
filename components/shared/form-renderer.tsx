"use client";

import type { FormField } from "@/lib/types/forms";
import {
  ScaleField,
  EmotionPicker,
  TextField,
  TimeBlockGrid,
  YesNoField,
  ChecklistField,
  SelectField,
} from "@/components/shared/fields";

interface FormRendererProps {
  fields: FormField[];
  responses: Record<string, unknown>;
  onChange: (fieldId: string, value: unknown) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

export function FormRenderer({
  fields,
  responses,
  onChange,
  errors = {},
  disabled = false,
}: FormRendererProps) {
  return (
    <div className="flex flex-col gap-6">
      {fields.map((field) => {
        const error = errors[field.id];

        switch (field.type) {
          case "scale":
            return (
              <ScaleField
                key={field.id}
                field={field}
                value={responses[field.id] as number | undefined}
                onChange={(v) => onChange(field.id, v)}
                error={error}
                disabled={disabled}
              />
            );
          case "emotion":
            return (
              <EmotionPicker
                key={field.id}
                field={field}
                value={responses[field.id] as string | undefined}
                onChange={(v) => onChange(field.id, v)}
                error={error}
                disabled={disabled}
              />
            );
          case "text":
            return (
              <TextField
                key={field.id}
                field={field}
                value={responses[field.id] as string | undefined}
                onChange={(v) => onChange(field.id, v)}
                error={error}
                disabled={disabled}
              />
            );
          case "time_block":
            return (
              <TimeBlockGrid
                key={field.id}
                field={field}
                value={responses[field.id] as string | undefined}
                onChange={(v) => onChange(field.id, v)}
                error={error}
                disabled={disabled}
              />
            );
          case "yes_no":
            return (
              <YesNoField
                key={field.id}
                field={field}
                value={responses[field.id] as boolean | undefined}
                onChange={(v) => onChange(field.id, v)}
                error={error}
                disabled={disabled}
              />
            );
          case "checklist":
            return (
              <ChecklistField
                key={field.id}
                field={field}
                value={responses[field.id] as string[] | undefined}
                onChange={(v) => onChange(field.id, v)}
                error={error}
                disabled={disabled}
              />
            );
          case "select":
            return (
              <SelectField
                key={field.id}
                field={field}
                value={responses[field.id] as string | undefined}
                onChange={(v) => onChange(field.id, v)}
                error={error}
                disabled={disabled}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
