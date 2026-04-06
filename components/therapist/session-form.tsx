"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MetricRecorder } from "@/components/shared/metric-recorder";
import { createSession } from "@/lib/actions/sessions";
import { useRouter } from "next/navigation";
import type { Metric } from "@/lib/types/database";

interface SessionFormProps {
  patientRecordId: string;
  patientName: string;
  metrics: Metric[];
}

export function SessionForm({
  patientRecordId,
  patientName,
  metrics,
}: SessionFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [metricValues, setMetricValues] = useState<Record<string, number>>({});

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    // Append metric values
    for (const [metricId, value] of Object.entries(metricValues)) {
      formData.set(`metric_${metricId}`, value.toString());
    }

    const result = await createSession(patientRecordId, formData);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push(`/terapeuta/pacientes/${patientRecordId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Card variant="elevated">
        <div className="flex flex-col gap-4">
          <Input
            name="session_date"
            label="Fecha de la sesión"
            type="date"
            defaultValue={today}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="notes"
              className="text-sm font-medium text-on-surface-variant"
            >
              Notas de la sesión
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={5}
              placeholder="Observaciones, temas tratados, avances..."
              className="w-full px-4 py-3 rounded-xl bg-surface-container-highest text-on-surface placeholder:text-on-surface-variant/50 border-b-2 border-transparent focus:bg-white focus:border-primary/40 focus:outline-none transition-all duration-300 ease-out resize-none"
            />
          </div>
        </div>
      </Card>

      {metrics.length > 0 && (
        <Card variant="elevated">
          <h3 className="font-semibold text-on-surface mb-4">
            Métricas de seguimiento
          </h3>
          <div className="flex flex-col gap-5">
            {metrics.map((metric) => (
              <MetricRecorder
                key={metric.id}
                metric={metric}
                value={metricValues[metric.id]}
                onChange={(value) =>
                  setMetricValues((prev) => ({ ...prev, [metric.id]: value }))
                }
              />
            ))}
          </div>
        </Card>
      )}

      {error && (
        <p className="text-sm text-error font-medium px-1">{error}</p>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading} className="flex-1">
          Guardar sesión
        </Button>
      </div>
    </form>
  );
}
