"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { deleteAssignment } from "@/lib/actions/assignments";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import type { Assignment } from "@/lib/types/database";
import { CheckCircle, Circle, Trash2, Calendar } from "lucide-react";

interface AssignmentListProps {
  assignments: Assignment[];
}

function formatDueDate(dueDate: string): { label: string; isOverdue: boolean } {
  const due = new Date(dueDate + "T23:59:59");
  const now = new Date();
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: `Vencido hace ${Math.abs(diffDays)} día${Math.abs(diffDays) === 1 ? "" : "s"}`, isOverdue: true };
  if (diffDays === 0) return { label: "Vence hoy", isOverdue: false };
  if (diffDays === 1) return { label: "Vence mañana", isOverdue: false };
  return {
    label: new Date(dueDate + "T12:00:00").toLocaleDateString("es-CR", { day: "numeric", month: "short" }),
    isOverdue: false,
  };
}

export function TherapistAssignmentList({ assignments }: AssignmentListProps) {
  const router = useRouter();
  const { toast } = useToast();

  async function handleDelete(id: string) {
    const result = await deleteAssignment(id);
    if (result.error) {
      toast(result.error, "error");
      return;
    }
    toast("Tarea eliminada");
    router.refresh();
  }

  if (assignments.length === 0) return null;

  const pending = assignments.filter((a) => !a.is_completed);
  const completed = assignments.filter((a) => a.is_completed);

  return (
    <div className="flex flex-col gap-1.5">
      {pending.map((a) => {
        const due = a.due_date ? formatDueDate(a.due_date) : null;

        return (
          <div
            key={a.id}
            className="flex items-start gap-2 py-2 px-2 -mx-2 rounded-xl hover:bg-surface-container-high transition-colors"
          >
            <Circle size={16} className="text-on-surface-variant/30 mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-on-surface">{a.title}</p>
              {a.description && (
                <p className="text-xs text-on-surface-variant line-clamp-1">
                  {a.description}
                </p>
              )}
              {due && (
                <span className={`text-[10px] font-medium ${due.isOverdue ? "text-error" : "text-on-surface-variant"}`}>
                  {due.label}
                </span>
              )}
            </div>
            <button
              onClick={() => handleDelete(a.id)}
              className="p-1 text-error/40 hover:text-error shrink-0"
            >
              <Trash2 size={12} />
            </button>
          </div>
        );
      })}
      {completed.map((a) => (
        <div
          key={a.id}
          className="flex items-start gap-2 py-2 px-2 -mx-2 opacity-50"
        >
          <CheckCircle size={16} className="text-secondary mt-0.5 shrink-0" />
          <p className="text-sm text-on-surface-variant line-through flex-1">
            {a.title}
          </p>
          <button
            onClick={() => handleDelete(a.id)}
            className="p-1 text-error/40 hover:text-error shrink-0"
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
