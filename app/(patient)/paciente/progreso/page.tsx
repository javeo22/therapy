import { MetricSummary } from "@/components/patient/metric-summary";
import { createClient } from "@/lib/supabase/server";

export default async function ProgresoPage() {
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

  let metricsWithValues: any[] = [];

  if (record) {
    const { data: metrics } = await supabase
      .from("metrics")
      .select("*")
      .eq("patient_record_id", record.id)
      .order("created_at", { ascending: true });

    metricsWithValues = await Promise.all(
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
  }

  return (
    <div className="py-6">
      <h2 className="font-serif text-2xl font-bold text-on-surface mb-4">
        Progreso
      </h2>
      <MetricSummary metrics={metricsWithValues} />
    </div>
  );
}
