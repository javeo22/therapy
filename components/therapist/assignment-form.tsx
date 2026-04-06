"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAssignment } from "@/lib/actions/assignments";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

interface AssignmentFormProps {
  patientRecordId: string;
  onClose?: () => void;
}

export function AssignmentForm({
  patientRecordId,
  onClose,
}: AssignmentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createAssignment(patientRecordId, formData);

    setLoading(false);

    if (result.error) {
      toast(result.error, "error");
      return;
    }

    toast("Tarea asignada");
    router.refresh();
    onClose?.();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        name="title"
        label="Tarea"
        placeholder="Ej: Practicar respiración diafragmática"
        required
        autoFocus
      />
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-on-surface-variant">
          Descripción (opcional)
        </label>
        <textarea
          name="description"
          rows={2}
          placeholder="Instrucciones adicionales..."
          className="w-full px-4 py-3 rounded-xl bg-surface-container-highest text-on-surface placeholder:text-on-surface-variant/50 border-b-2 border-transparent focus:bg-white focus:border-primary/40 focus:outline-none transition-all duration-300 ease-out resize-none text-sm"
        />
      </div>
      <Input name="due_date" label="Fecha límite (opcional)" type="date" />
      <div className="flex gap-3 pt-1">
        {onClose && (
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button type="submit" size="sm" loading={loading} className="flex-1">
          Asignar
        </Button>
      </div>
    </form>
  );
}
