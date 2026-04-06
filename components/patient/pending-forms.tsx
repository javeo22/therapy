import { Card } from "@/components/ui/card";
import { ClipboardList, ChevronRight } from "lucide-react";
import type { FormTemplate } from "@/lib/types/database";
import Link from "next/link";

interface PendingFormsProps {
  forms: FormTemplate[];
}

export function PendingForms({ forms }: PendingFormsProps) {
  if (forms.length === 0) {
    return (
      <Card className="flex items-center gap-3 py-4 px-4">
        <ClipboardList size={18} className="text-on-surface-variant/40" />
        <p className="text-sm text-on-surface-variant">
          No tenés autorregistros asignados.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {forms.map((form) => (
        <Link key={form.id} href={`/paciente/registros/${form.id}`}>
          <Card className="flex items-center gap-3 py-4 px-4 active:scale-[0.98] transition-transform duration-150">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <ClipboardList size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-surface truncate">
                {form.title}
              </p>
              <p className="text-xs text-tertiary font-medium">Completar</p>
            </div>
            <ChevronRight size={16} className="text-on-surface-variant/40" />
          </Card>
        </Link>
      ))}
    </div>
  );
}
