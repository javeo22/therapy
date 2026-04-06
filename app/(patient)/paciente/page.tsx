import { PatientGreeting } from "@/components/patient/patient-greeting";
import { MetricSummary } from "@/components/patient/metric-summary";
import { PendingForms } from "@/components/patient/pending-forms";
import { EngagementIndicator } from "@/components/patient/engagement-indicator";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";

export default async function PatientDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get profile for greeting
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  // Get patient record
  const { data: record } = await supabase
    .from("patient_records")
    .select("id, therapist_id")
    .eq("patient_id", user!.id)
    .eq("is_active", true)
    .single();

  if (!record) {
    return (
      <div className="py-6">
        <PatientGreeting name={profile?.full_name || "Paciente"} />
        <Card className="py-8 text-center">
          <p className="text-sm text-on-surface-variant">
            Aún no estás vinculado con un terapeuta.
          </p>
        </Card>
      </div>
    );
  }

  // Fetch therapist name
  const { data: therapistProfile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", record.therapist_id)
    .single();

  // Fetch metrics with values
  const { data: metrics } = await supabase
    .from("metrics")
    .select("*")
    .eq("patient_record_id", record.id)
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

  // Session count
  const { count: sessionCount } = await supabase
    .from("sessions")
    .select("*", { count: "exact", head: true })
    .eq("patient_record_id", record.id);

  // Completed forms count
  const { count: formsCount } = await supabase
    .from("form_submissions")
    .select("*", { count: "exact", head: true })
    .eq("patient_id", user!.id);

  // Active forms (can be filled repeatedly)
  const { data: activeForms } = await supabase
    .from("form_templates")
    .select("*")
    .eq("patient_record_id", record.id)
    .eq("is_active", true);

  return (
    <div className="py-6">
      <PatientGreeting name={profile?.full_name || "Paciente"} />

      {therapistProfile && (
        <p className="text-xs text-on-surface-variant mb-4">
          Terapeuta: {therapistProfile.full_name}
        </p>
      )}

      <EngagementIndicator
        totalSessions={sessionCount || 0}
        totalFormsCompleted={formsCount || 0}
      />

      <Link href="/paciente/sesiones">
        <Card className="flex items-center gap-3 py-3 px-4 mt-4 active:scale-[0.98] transition-transform duration-150">
          <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
            <Calendar size={16} className="text-secondary" />
          </div>
          <span className="text-sm font-medium text-on-surface flex-1">
            Ver historial de sesiones
          </span>
          <ChevronRight size={16} className="text-on-surface-variant/40" />
        </Card>
      </Link>

      <div className="mt-6 mb-3">
        <h3 className="text-sm font-semibold text-on-surface">Tu progreso</h3>
      </div>
      <MetricSummary metrics={metricsWithValues} />

      <div className="mt-6 mb-3">
        <h3 className="text-sm font-semibold text-on-surface">
          Autorregistros
        </h3>
      </div>
      <PendingForms forms={activeForms || []} />
    </div>
  );
}
