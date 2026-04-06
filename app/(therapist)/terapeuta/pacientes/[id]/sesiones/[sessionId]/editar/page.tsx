import { EditSessionForm } from "@/components/therapist/edit-session-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditarSesionPage({
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

  const { data: metrics } = await supabase
    .from("metrics")
    .select("*")
    .eq("patient_record_id", id)
    .order("created_at", { ascending: true });

  const { data: metricValues } = await supabase
    .from("metric_values")
    .select("metric_id, value")
    .eq("session_id", sessionId);

  const existingMetricValues: Record<string, number> = {};
  (metricValues || []).forEach((mv) => {
    existingMetricValues[mv.metric_id] = mv.value;
  });

  return (
    <div className="py-6">
      <Link
        href={`/terapeuta/pacientes/${id}/sesiones/${sessionId}`}
        className="inline-flex items-center gap-1 text-sm text-tertiary mb-3"
      >
        <ArrowLeft size={14} />
        Sesión
      </Link>

      <h2 className="font-serif text-2xl font-bold text-on-surface mb-1">
        Editar sesión
      </h2>
      <p className="text-sm text-on-surface-variant mb-4">
        {patient?.full_name}
      </p>

      <EditSessionForm
        session={session}
        patientRecordId={id}
        metrics={metrics || []}
        existingMetricValues={existingMetricValues}
      />
    </div>
  );
}
