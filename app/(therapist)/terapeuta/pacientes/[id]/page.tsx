import { PatientDashboardView } from "@/components/therapist/patient-dashboard-view";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch patient record
  const { data: patient } = await supabase
    .from("patient_records")
    .select("*")
    .eq("id", id)
    .single();

  if (!patient) notFound();

  // Fetch sessions
  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("patient_record_id", id)
    .order("session_date", { ascending: false });

  // Fetch metrics with their values
  const { data: metrics } = await supabase
    .from("metrics")
    .select("*")
    .eq("patient_record_id", id)
    .order("created_at", { ascending: true });

  const metricsWithValues = await Promise.all(
    (metrics || []).map(async (metric) => {
      const { data: values } = await supabase
        .from("metric_values")
        .select("value, sessions(session_date)")
        .eq("metric_id", metric.id)
        .order("recorded_at", { ascending: true });

      return {
        ...metric,
        values: (values || []).map((v: any) => ({
          value: v.value,
          sessions: v.sessions,
        })),
      };
    })
  );

  return (
    <div className="py-6">
      <Link
        href="/terapeuta/pacientes"
        className="inline-flex items-center gap-1 text-sm text-tertiary mb-3"
      >
        <ArrowLeft size={14} />
        Pacientes
      </Link>

      <h2 className="font-serif text-2xl font-bold text-on-surface mb-4">
        {patient.full_name}
      </h2>

      <PatientDashboardView
        patient={patient}
        sessions={sessions || []}
        metricsWithValues={metricsWithValues}
      />
    </div>
  );
}
