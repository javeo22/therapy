"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updatePatient } from "@/lib/actions/patients";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { Pencil, X } from "lucide-react";

interface EditPatientNameProps {
  patientId: string;
  currentName: string;
}

export function EditPatientName({
  patientId,
  currentName,
}: EditPatientNameProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updatePatient(patientId, formData);

    setLoading(false);

    if (result.error) {
      toast(result.error, "error");
      return;
    }

    toast("Nombre actualizado");
    setEditing(false);
    router.refresh();
  }

  if (editing) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          name="full_name"
          defaultValue={currentName}
          autoFocus
          className="text-lg font-bold"
        />
        <Button type="submit" size="sm" loading={loading}>
          Guardar
        </Button>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="p-1 text-on-surface-variant hover:text-on-surface"
        >
          <X size={16} />
        </button>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <h2 className="font-serif text-2xl font-bold text-on-surface">
        {currentName}
      </h2>
      <button
        onClick={() => setEditing(true)}
        className="p-1 text-on-surface-variant/40 hover:text-on-surface transition-colors"
      >
        <Pencil size={14} />
      </button>
    </div>
  );
}
