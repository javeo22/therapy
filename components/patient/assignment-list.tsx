"use client";

import { Card } from "@/components/ui/card";
import { toggleAssignmentComplete } from "@/lib/actions/assignments";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import type { Assignment } from "@/lib/types/database";
import { CheckCircle, Circle, Calendar } from "lucide-react";

interface PatientAssignmentListProps {
  assignments: Assignment[];
}

function formatDueDate(dueDate: string): { label: string; isOverdue: boolean } {
  const due = new Date(dueDate + "T23:59:59");
  const now = new Date();
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: `Vencido`, isOverdue: true };
  if (diffDays === 0) return { label: "Hoy", isOverdue: false };
  if (diffDays === 1) return { label: "Mañana", isOverdue: false };
  return {
    label: new Date(dueDate + "T12:00:00").toLocaleDateString("es-CR", { day: "numeric", month: "short" }),
    isOverdue: false,
  };
}

export function PatientAssignmentList({
  assignments,
}: PatientAssignmentListProps) {
  const router = useRouter();
  const { toast } = useToast();

  async function handleToggle(id: string) {
    const result = await toggleAssignmentComplete(id);
    if (result.error) {
      toast(result.error, "error");
      return;
    }
    toast(result.is_completed ? "Tarea completada" : "Tarea marcada como pendiente");
    router.refresh();
  }

  if (assignments.length === 0) {
    return (
      <Card className="flex items-center gap-3 py-4 px-4">
        <CheckCircle size={18} className="text-on-surface-variant/40" />
        <p className="text-sm text-on-surface-variant">
          No tenés tareas asignadas.
        </p>
      </Card>
    );
  }

  const pending = assignments.filter((a) => !a.is_completed);
  const completed = assignments.filter((a) => a.is_completed);

  return (
    <div className="flex flex-col gap-2">
      {pending.map((a) => {
        const due = a.due_date ? formatDueDate(a.due_date) : null;

        return (
          <Card
            key={a.id}
            className="flex items-start gap-3 py-3 px-4 active:scale-[0.98] transition-transform cursor-pointer"
            onClick={() => handleToggle(a.id)}
          >
            <Circle size={18} className="text-primary mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-surface">{a.title}</p>
              {a.description && (
                <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">
                  {a.description}
                </p>
              )}
              {due && (
                <div className={`flex items-center gap-1 mt-1 text-[10px] font-medium ${due.isOverdue ? "text-error" : "text-on-surface-variant"}`}>
                  <Calendar size={10} />
                  {due.label}
                </div>
              )}
            </div>
          </Card>
        );
      })}
      {completed.map((a) => (
        <Card
          key={a.id}
          className="flex items-start gap-3 py-3 px-4 opacity-60 cursor-pointer active:scale-[0.98] transition-transform"
          onClick={() => handleToggle(a.id)}
        >
          <CheckCircle size={18} className="text-secondary mt-0.5 shrink-0" />
          <p className="text-sm text-on-surface-variant line-through flex-1">
            {a.title}
          </p>
        </Card>
      ))}
    </div>
  );
}
