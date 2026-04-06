import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Get patient record
  const { data: record } = await supabase
    .from("patient_records")
    .select("*")
    .eq("patient_id", user.id)
    .single();

  let sessions: unknown[] = [];
  let metrics: unknown[] = [];
  let metricValues: unknown[] = [];
  let formSubmissions: unknown[] = [];

  if (record) {
    // Get sessions (without therapist notes for patient export)
    const { data: sessionsData } = await supabase
      .from("sessions")
      .select("id, session_date, created_at")
      .eq("patient_record_id", record.id)
      .order("session_date", { ascending: false });
    sessions = sessionsData || [];

    // Get metrics
    const { data: metricsData } = await supabase
      .from("metrics")
      .select("*")
      .eq("patient_record_id", record.id);
    metrics = metricsData || [];

    // Get metric values
    if (sessions.length > 0) {
      const sessionIds = (sessions as { id: string }[]).map((s) => s.id);
      const { data: mvData } = await supabase
        .from("metric_values")
        .select("*, metrics(name)")
        .in("session_id", sessionIds);
      metricValues = mvData || [];
    }
  }

  // Get form submissions
  const { data: submissionsData } = await supabase
    .from("form_submissions")
    .select("*, form_templates(title)")
    .eq("patient_id", user.id);
  formSubmissions = submissionsData || [];

  const exportData = {
    exported_at: new Date().toISOString(),
    profile: {
      full_name: profile?.full_name,
      role: profile?.role,
      created_at: profile?.created_at,
    },
    sessions,
    metrics,
    metric_values: metricValues,
    form_submissions: formSubmissions,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="therapy-export-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
