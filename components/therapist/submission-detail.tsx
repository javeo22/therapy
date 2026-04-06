import { Card } from "@/components/ui/card";
import type { FormField } from "@/lib/types/forms";

interface SubmissionDetailProps {
  fields: FormField[];
  responses: Record<string, unknown>;
}

export function SubmissionDetail({ fields, responses }: SubmissionDetailProps) {
  return (
    <div className="flex flex-col gap-3">
      {fields.map((field) => {
        const value = responses[field.id];

        return (
          <Card key={field.id} className="py-3 px-4">
            <p className="text-xs text-on-surface-variant mb-1">
              {field.label}
            </p>
            <p className="text-sm font-medium text-on-surface">
              {formatValue(field, value)}
            </p>
          </Card>
        );
      })}
    </div>
  );
}

function formatValue(field: FormField, value: unknown): string {
  if (value === undefined || value === null) return "—";

  switch (field.type) {
    case "scale":
      return `${value} / ${field.max}`;
    case "emotion":
    case "text":
    case "time_block":
    case "select":
      return String(value);
    case "yes_no":
      return value === true ? "Sí" : value === false ? "No" : "—";
    case "checklist":
      return Array.isArray(value) ? value.join(", ") : "—";
    default:
      return String(value);
  }
}
