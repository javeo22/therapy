"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMetric } from "@/lib/actions/metrics";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

interface MetricDefinitionFormProps {
  patientRecordId: string;
  onClose?: () => void;
}

export function MetricDefinitionForm({
  patientRecordId,
  onClose,
}: MetricDefinitionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createMetric(patientRecordId, formData);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    toast("Métrica agregada");
    router.refresh();
    onClose?.();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        name="name"
        label="Nombre de la métrica"
        placeholder="Ej: Ansiedad, Sueño, Estado de ánimo"
        required
        autoFocus
      />

      <Input
        name="description"
        label="Descripción (opcional)"
        placeholder="Ej: Nivel de ansiedad general durante la semana"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          name="min_value"
          label="Mínimo"
          type="number"
          defaultValue="0"
        />
        <Input
          name="max_value"
          label="Máximo"
          type="number"
          defaultValue="10"
        />
      </div>

      {error && (
        <p className="text-sm text-error font-medium">{error}</p>
      )}

      <div className="flex gap-3 pt-1">
        {onClose && (
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button type="submit" loading={loading} className="flex-1">
          Agregar métrica
        </Button>
      </div>
    </form>
  );
}
