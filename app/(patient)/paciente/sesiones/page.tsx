import { SessionHistoryPatient } from "@/components/patient/session-history-patient";
import { createClient } from "@/lib/supabase/server";

export default async function PatientSesionesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: record } = await supabase
    .from("patient_records")
    .select("id")
    .eq("patient_id", user!.id)
    .eq("is_active", true)
    .single();

  if (!record) {
    return (
      <div className="py-6">
        <h2 className="font-serif text-2xl font-bold text-on-surface mb-4">
          Sesiones
        </h2>
        <p className="text-sm text-on-surface-variant">
          Aún no estás vinculado con un terapeuta.
        </p>
      </div>
    );
  }

  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, session_date, created_at, patient_record_id")
    .eq("patient_record_id", record.id)
    .order("session_date", { ascending: false });

  const sessionIds = (sessions || []).map((s) => s.id);

  const { data: metricValues } = sessionIds.length
    ? await supabase
        .from("metric_values")
        .select("*, metrics(name, min_value, max_value)")
        .in("session_id", sessionIds)
    : { data: [] };

  const sessionsWithMetrics = (sessions || []).map((session) => ({
    ...session,
    metric_values: (metricValues || []).filter(
      (mv) => mv.session_id === session.id
    ),
  }));

  return (
    <div className="py-6">
      <h2 className="font-serif text-2xl font-bold text-on-surface mb-4">
        Sesiones
      </h2>
      <SessionHistoryPatient sessions={sessionsWithMetrics} />
    </div>
  );
}
