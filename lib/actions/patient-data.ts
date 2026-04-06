"use server";

import { createClient } from "@/lib/supabase/server";

export async function getMyPatientRecord() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { data, error } = await supabase
    .from("patient_records")
    .select("*")
    .eq("patient_id", user.id)
    .eq("is_active", true)
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function getMyProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function getMyMetrics() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  // Get patient record
  const { data: record } = await supabase
    .from("patient_records")
    .select("id")
    .eq("patient_id", user.id)
    .eq("is_active", true)
    .single();

  if (!record) return { data: [] };

  // Get metrics with values
  const { data: metrics, error } = await supabase
    .from("metrics")
    .select("*")
    .eq("patient_record_id", record.id)
    .order("created_at", { ascending: true });

  if (error) return { error: error.message };
  if (!metrics?.length) return { data: [] };

  const metricIds = metrics.map((m) => m.id);

  const { data: values } = await supabase
    .from("metric_values")
    .select("*, sessions(session_date)")
    .in("metric_id", metricIds)
    .order("recorded_at", { ascending: true });

  return {
    data: metrics.map((metric) => ({
      ...metric,
      values: (values || []).filter((v) => v.metric_id === metric.id),
    })),
  };
}

export async function getMySessionHistory() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { data: record } = await supabase
    .from("patient_records")
    .select("id")
    .eq("patient_id", user.id)
    .eq("is_active", true)
    .single();

  if (!record) return { data: [] };

  // Get sessions (without notes — patient shouldn't see therapist notes)
  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("id, session_date, created_at, patient_record_id")
    .eq("patient_record_id", record.id)
    .order("session_date", { ascending: false });

  if (error) return { error: error.message };
  if (!sessions?.length) return { data: [] };

  // Get metric values for these sessions
  const sessionIds = sessions.map((s) => s.id);

  const { data: metricValues } = await supabase
    .from("metric_values")
    .select("*, metrics(name, min_value, max_value)")
    .in("session_id", sessionIds);

  return {
    data: sessions.map((session) => ({
      ...session,
      metric_values: (metricValues || []).filter(
        (mv) => mv.session_id === session.id
      ),
    })),
  };
}

export async function getMyActiveForms() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { data: record } = await supabase
    .from("patient_records")
    .select("id")
    .eq("patient_id", user.id)
    .eq("is_active", true)
    .single();

  if (!record) return { data: [] };

  // Get active form templates
  const { data: templates } = await supabase
    .from("form_templates")
    .select("*")
    .eq("patient_record_id", record.id)
    .eq("is_active", true);

  if (!templates?.length) return { data: [] };

  // Get most recent submission per template
  const { data: submissions } = await supabase
    .from("form_submissions")
    .select("form_template_id, submitted_at")
    .eq("patient_id", user.id)
    .order("submitted_at", { ascending: false });

  // Build map: template_id → most recent submission date
  const lastSubmission = new Map<string, string>();
  (submissions || []).forEach((s) => {
    if (!lastSubmission.has(s.form_template_id)) {
      lastSubmission.set(s.form_template_id, s.submitted_at);
    }
  });

  // Get last session date for "session" frequency
  const { data: lastSession } = await supabase
    .from("sessions")
    .select("session_date")
    .eq("patient_record_id", record.id)
    .order("session_date", { ascending: false })
    .limit(1)
    .single();

  const now = new Date();

  // Determine status per template
  const formsWithStatus = templates.map((template) => {
    const freq = (template as any).frequency || "once";
    const lastSub = lastSubmission.get(template.id);
    let isDue = true;

    if (lastSub) {
      const lastDate = new Date(lastSub);
      const diffMs = now.getTime() - lastDate.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);

      switch (freq) {
        case "once":
          isDue = false; // already submitted
          break;
        case "daily":
          isDue = lastDate.toDateString() !== now.toDateString();
          break;
        case "weekly":
          isDue = diffDays >= 7;
          break;
        case "biweekly":
          isDue = diffDays >= 14;
          break;
        case "session":
          isDue = lastSession
            ? new Date(lastSub) < new Date(lastSession.session_date + "T00:00:00")
            : true;
          break;
      }
    }

    return {
      ...template,
      lastSubmittedAt: lastSub || null,
      isDue,
    };
  });

  // Sort: due forms first
  formsWithStatus.sort((a, b) => (a.isDue === b.isDue ? 0 : a.isDue ? -1 : 1));

  return { data: formsWithStatus };
}
