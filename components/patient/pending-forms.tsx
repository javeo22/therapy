import { Card } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";
import type { FormTemplate } from "@/lib/types/database";

interface PendingFormsProps {
  forms: FormTemplate[];
}

export function PendingForms({ forms }: PendingFormsProps) {
  if (forms.length === 0) {
    return (
      <Card className="flex items-center gap-3 py-4 px-4">
        <ClipboardList size={18} className="text-on-surface-variant/40" />
        <p className="text-sm text-on-surface-variant">
          No tenés formularios pendientes.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {forms.map((form) => (
        <Card
          key={form.id}
          className="flex items-center gap-3 py-4 px-4"
        >
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <ClipboardList size={16} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-on-surface truncate">
              {form.title}
            </p>
            <p className="text-xs text-on-surface-variant">Pendiente</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
