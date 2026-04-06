import { Card } from "@/components/ui/card";
import { DeleteSessionButton } from "@/components/therapist/delete-session-button";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string; sessionId: string }>;
}) {
  const { id, sessionId } = await params;
  const supabase = await createClient();

  const { data: session } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (!session) notFound();

  const { data: patient } = await supabase
    .from("patient_records")
    .select("full_name")
    .eq("id", id)
    .single();

  const { data: metricValues } = await supabase
    .from("metric_values")
    .select("*, metrics(name, min_value, max_value)")
    .eq("session_id", sessionId);

  const sessionDate = new Date(session.session_date + "T12:00:00").toLocaleDateString("es-CR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="py-6">
      <Link
        href={`/terapeuta/pacientes/${id}/sesiones`}
        className="inline-flex items-center gap-1 text-sm text-tertiary mb-4"
      >
        <ArrowLeft size={14} />
        Sesiones
      </Link>

      <div className="flex items-start justify-between mb-1">
        <h2 className="font-serif text-2xl font-bold text-on-surface capitalize">
          {sessionDate}
        </h2>
        <div className="flex items-center gap-3">
          <Link
            href={`/terapeuta/pacientes/${id}/sesiones/${sessionId}/editar`}
            className="flex items-center gap-1 text-xs text-tertiary hover:text-primary transition-colors"
          >
            <Pencil size={12} />
            Editar
          </Link>
          <DeleteSessionButton sessionId={sessionId} patientRecordId={id} />
        </div>
      </div>
      <p className="text-sm text-on-surface-variant mb-4">
        {patient?.full_name}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

      {session.notes && (
        <Card variant="elevated" className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-on-surface mb-2">Notas</h3>
          <p className="text-sm text-on-surface-variant whitespace-pre-wrap leading-relaxed">
            {session.notes}
          </p>
        </Card>
      )}

      {metricValues && metricValues.length > 0 && (
        <Card variant="elevated" className="lg:col-span-1">
          <h3 className="text-sm font-semibold text-on-surface mb-3">
            Métricas registradas
          </h3>
          <div className="flex flex-col gap-3">
            {metricValues.map((mv: any) => (
              <div key={mv.id} className="flex items-center justify-between">
                <span className="text-sm text-on-surface-variant">
                  {mv.metrics?.name}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 rounded-full bg-surface-container-highest overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${((mv.value - (mv.metrics?.min_value || 0)) / ((mv.metrics?.max_value || 10) - (mv.metrics?.min_value || 0))) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-bold text-primary tabular-nums w-6 text-right">
                    {mv.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      </div>{/* End grid */}
    </div>
  );
}
