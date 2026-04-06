"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteSession } from "@/lib/actions/sessions";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeleteSessionButtonProps {
  sessionId: string;
  patientRecordId: string;
}

export function DeleteSessionButton({
  sessionId,
  patientRecordId,
}: DeleteSessionButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const result = await deleteSession(sessionId, patientRecordId);
    setLoading(false);

    if (result.error) return;
    router.push(`/terapeuta/pacientes/${patientRecordId}/sesiones`);
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-on-surface-variant">¿Eliminar?</span>
        <Button size="sm" variant="ghost" onClick={() => setConfirming(false)} disabled={loading}>
          No
        </Button>
        <Button
          size="sm"
          onClick={handleDelete}
          loading={loading}
          style={{ background: "var(--color-error)" }}
          className="text-white"
        >
          Sí
        </Button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1 text-xs text-error/60 hover:text-error transition-colors"
    >
      <Trash2 size={12} />
      Eliminar
    </button>
  );
}
