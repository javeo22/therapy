import { PatientList } from "@/components/therapist/patient-list";
import { createClient } from "@/lib/supabase/server";

export default async function PacientesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch patients with session stats
  const { data: patients } = await supabase
    .from("patient_records")
    .select("*")
    .eq("therapist_id", user!.id)
    .order("created_at", { ascending: false });

  // Fetch session counts and last session dates
  const patientsWithStats = await Promise.all(
    (patients || []).map(async (patient) => {
      const { count } = await supabase
        .from("sessions")
        .select("*", { count: "exact", head: true })
        .eq("patient_record_id", patient.id);

      const { data: lastSession } = await supabase
        .from("sessions")
        .select("session_date")
        .eq("patient_record_id", patient.id)
        .order("session_date", { ascending: false })
        .limit(1)
        .single();

      return {
        ...patient,
        sessionCount: count || 0,
        lastSessionDate: lastSession?.session_date || null,
      };
    })
  );

  return (
    <div className="py-6">
      <h2 className="font-serif text-2xl font-bold text-on-surface mb-4">
        Pacientes
      </h2>
      <PatientList initialPatients={patientsWithStats} />
    </div>
  );
}
