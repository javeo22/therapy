import { Card } from "@/components/ui/card";
import { ClipboardList, ChevronRight, Clock } from "lucide-react";
import type { FormTemplate } from "@/lib/types/database";
import Link from "next/link";

interface FormWithStatus extends FormTemplate {
  lastSubmittedAt: string | null;
  isDue: boolean;
}

interface PendingFormsProps {
  forms: FormWithStatus[];
}

const FREQUENCY_LABELS: Record<string, string> = {
  once: "Una vez",
  daily: "Diario",
  weekly: "Semanal",
  biweekly: "Quincenal",
  session: "Por sesión",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Hoy";
  if (days === 1) return "Ayer";
  return `Hace ${days} días`;
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
      {forms.map((form) => {
        const freq = (form as any).frequency || "once";
        const freqLabel = FREQUENCY_LABELS[freq];

        return (
          <Link key={form.id} href={`/paciente/registros/${form.id}`}>
            <Card
              className={`flex items-center gap-3 py-4 px-4 active:scale-[0.98] transition-transform duration-150 ${
                form.isDue ? "" : "opacity-70"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  form.isDue ? "bg-primary/10" : "bg-secondary/10"
                }`}
              >
                <ClipboardList
                  size={16}
                  className={form.isDue ? "text-primary" : "text-secondary"}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">
                  {form.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {freq !== "once" && (
                    <span className="text-[10px] font-medium text-tertiary bg-tertiary/10 px-1.5 py-0.5 rounded-full">
                      {freqLabel}
                    </span>
                  )}
                  {form.isDue ? (
                    <span className="text-xs text-primary font-medium">
                      Completar
                    </span>
                  ) : (
                    <span className="text-xs text-on-surface-variant flex items-center gap-1">
                      <Clock size={10} />
                      {form.lastSubmittedAt
                        ? timeAgo(form.lastSubmittedAt)
                        : "Al día"}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight size={16} className="text-on-surface-variant/40" />
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
