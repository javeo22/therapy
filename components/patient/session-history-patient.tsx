import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface MetricValueWithName {
  value: number;
  metrics: { name: string; min_value: number; max_value: number } | null;
}

interface PatientSession {
  id: string;
  session_date: string;
  metric_values: MetricValueWithName[];
}

interface SessionHistoryPatientProps {
  sessions: PatientSession[];
}

export function SessionHistoryPatient({
  sessions,
}: SessionHistoryPatientProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Calendar size={36} className="text-on-surface-variant/40" />
        <p className="text-on-surface-variant">
          Aún no hay sesiones registradas.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {sessions.map((session) => (
        <Card key={session.id} className="py-4 px-4">
          <p className="text-sm font-medium text-on-surface mb-2 capitalize">
            {new Date(session.session_date + "T12:00:00").toLocaleDateString(
              "es-CR",
              {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </p>
          {session.metric_values.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {session.metric_values.map((mv, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 bg-surface-container-highest rounded-lg px-2.5 py-1"
                >
                  <span className="text-xs text-on-surface-variant">
                    {mv.metrics?.name}
                  </span>
                  <span className="text-xs font-bold text-primary tabular-nums">
                    {mv.value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant/60">
              Sin métricas registradas
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
