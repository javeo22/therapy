"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createSession(
  patientRecordId: string,
  formData: FormData
) {
  const supabase = await createClient();

  const sessionDate = formData.get("session_date") as string;
  const notes = formData.get("notes") as string;

  if (!sessionDate) return { error: "La fecha es requerida." };

  const { data: session, error } = await supabase
    .from("sessions")
    .insert({
      patient_record_id: patientRecordId,
      session_date: sessionDate,
      notes: notes?.trim() || null,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // Record metric values if provided
  const metricEntries: { session_id: string; metric_id: string; value: number }[] = [];

  for (const [key, val] of formData.entries()) {
    if (key.startsWith("metric_")) {
      const metricId = key.replace("metric_", "");
      const value = parseInt(val as string, 10);
      if (!isNaN(value)) {
        metricEntries.push({
          session_id: session.id,
          metric_id: metricId,
          value,
        });
      }
    }
  }

  if (metricEntries.length > 0) {
    const { error: mvError } = await supabase
      .from("metric_values")
      .insert(metricEntries);

    if (mvError) return { error: mvError.message };
  }

  revalidatePath(`/terapeuta/pacientes/${patientRecordId}`);
  revalidatePath(`/terapeuta/pacientes/${patientRecordId}/sesiones`);
  return { data: session };
}

export async function getSessionsByPatient(patientRecordId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("patient_record_id", patientRecordId)
    .order("session_date", { ascending: false });

  if (error) return { error: error.message };
  return { data };
}

export async function getSession(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { error: error.message };

  // Also fetch metric values for this session
  const { data: metricValues } = await supabase
    .from("metric_values")
    .select("*, metrics(*)")
    .eq("session_id", id);

  return { data: { ...data, metric_values: metricValues || [] } };
}

export async function getSessionWithMetrics(id: string) {
  const supabase = await createClient();

  const { data: session, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { error: error.message };

  const { data: metricValues } = await supabase
    .from("metric_values")
    .select("*, metrics(name, min_value, max_value)")
    .eq("session_id", id);

  return { data: { ...session, metric_values: metricValues || [] } };
}
