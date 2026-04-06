"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { deletePatient } from "@/lib/actions/patients";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

interface DeletePatientButtonProps {
  patientId: string;
  patientName: string;
}

export function DeletePatientButton({
  patientId,
  patientName,
}: DeletePatientButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);

    const result = await deletePatient(patientId);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/terapeuta/pacientes");
  }

  if (confirming) {
    return (
      <Card className="bg-error/5">
        <p className="text-sm text-on-surface mb-1">
          ¿Eliminar a <strong>{patientName}</strong>?
        </p>
        <p className="text-xs text-on-surface-variant mb-3">
          Se eliminarán todas sus sesiones, métricas y autorregistros. Esta
          acción no se puede deshacer.
        </p>
        {error && (
          <p className="text-xs text-error font-medium mb-2">{error}</p>
        )}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirming(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            onClick={handleDelete}
            loading={loading}
            className="bg-error hover:bg-error/90"
            style={{ background: "var(--color-error)" }}
          >
            Eliminar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1.5 text-xs text-error/60 hover:text-error transition-colors mt-2"
    >
      <Trash2 size={12} />
      Eliminar paciente
    </button>
  );
}
