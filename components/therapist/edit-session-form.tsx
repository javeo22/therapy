"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MetricRecorder } from "@/components/shared/metric-recorder";
import { updateSession } from "@/lib/actions/sessions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import type { Metric, Session } from "@/lib/types/database";

interface EditSessionFormProps {
  session: Session;
  patientRecordId: string;
  metrics: Metric[];
  existingMetricValues: Record<string, number>;
}

export function EditSessionForm({
  session,
  patientRecordId,
  metrics,
  existingMetricValues,
}: EditSessionFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [metricValues, setMetricValues] = useState<Record<string, number>>(existingMetricValues);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    for (const [metricId, value] of Object.entries(metricValues)) {
      formData.set(`metric_${metricId}`, value.toString());
    }

    const result = await updateSession(session.id, patientRecordId, formData);
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    toast("Sesión actualizada");
    router.push(`/terapeuta/pacientes/${patientRecordId}/sesiones/${session.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card variant="elevated" className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            <Input
              name="session_date"
              label="Fecha de la sesión"
              type="date"
              defaultValue={session.session_date}
              required
            />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="notes" className="text-sm font-medium text-on-surface-variant">
                Notas de la sesión
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={5}
                defaultValue={session.notes || ""}
                placeholder="Observaciones, temas tratados, avances..."
                className="w-full px-4 py-3 rounded-xl bg-surface-container-highest text-on-surface placeholder:text-on-surface-variant/50 border-b-2 border-transparent focus:bg-white focus:border-primary/40 focus:outline-none transition-all duration-300 ease-out resize-none lg:min-h-[300px]"
              />
            </div>
          </div>
        </Card>

        {metrics.length > 0 && (
          <Card variant="elevated" className="lg:col-span-1">
            <h3 className="font-semibold text-on-surface mb-4">Métricas</h3>
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
      </div>

      {error && <p className="text-sm text-error font-medium px-1">{error}</p>}

      <div className="flex gap-3">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading} className="flex-1 lg:flex-none lg:px-12">
          Guardar cambios
        </Button>
      </div>
    </form>
  );
}
