"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createMetric(
  patientRecordId: string,
  formData: FormData
) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const minValue = parseInt(formData.get("min_value") as string, 10);
  const maxValue = parseInt(formData.get("max_value") as string, 10);

  if (!name?.trim()) return { error: "El nombre es requerido." };

  const { data, error } = await supabase
    .from("metrics")
    .insert({
      patient_record_id: patientRecordId,
      name: name.trim(),
      description: description?.trim() || null,
      min_value: isNaN(minValue) ? 0 : minValue,
      max_value: isNaN(maxValue) ? 10 : maxValue,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/terapeuta/pacientes/${patientRecordId}`);
  return { data };
}

export async function updateMetric(metricId: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const minValue = parseInt(formData.get("min_value") as string, 10);
  const maxValue = parseInt(formData.get("max_value") as string, 10);

  if (!name?.trim()) return { error: "El nombre es requerido." };

  const { data: metric, error: fetchError } = await supabase
    .from("metrics")
    .select("patient_record_id")
    .eq("id", metricId)
    .single();

  if (fetchError) return { error: fetchError.message };

  const { error } = await supabase
    .from("metrics")
    .update({
      name: name.trim(),
      description: description?.trim() || null,
      min_value: isNaN(minValue) ? 0 : minValue,
      max_value: isNaN(maxValue) ? 10 : maxValue,
    })
    .eq("id", metricId);

  if (error) return { error: error.message };

  revalidatePath(`/terapeuta/pacientes/${metric.patient_record_id}`);
  return { success: true };
}

export async function deleteMetric(metricId: string) {
  const supabase = await createClient();

  const { data: metric, error: fetchError } = await supabase
    .from("metrics")
    .select("patient_record_id")
    .eq("id", metricId)
    .single();

  if (fetchError) return { error: fetchError.message };

  const { error } = await supabase
    .from("metrics")
    .delete()
    .eq("id", metricId);

  if (error) return { error: error.message };

  revalidatePath(`/terapeuta/pacientes/${metric.patient_record_id}`);
  return { success: true };
}

export async function getMetricsByPatient(patientRecordId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("metrics")
    .select("*")
    .eq("patient_record_id", patientRecordId)
    .order("created_at", { ascending: true });

  if (error) return { error: error.message };
  return { data };
}

export async function getMetricHistory(metricId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("metric_values")
    .select("*, sessions(session_date)")
    .eq("metric_id", metricId)
    .order("recorded_at", { ascending: true });

  if (error) return { error: error.message };
  return { data };
}

export async function getMetricHistoryByPatient(patientRecordId: string) {
  const supabase = await createClient();

  // Get all metrics for this patient
  const { data: metrics, error: metricsError } = await supabase
    .from("metrics")
    .select("*")
    .eq("patient_record_id", patientRecordId)
    .order("created_at", { ascending: true });

  if (metricsError) return { error: metricsError.message };
  if (!metrics?.length) return { data: [] };

  const metricIds = metrics.map((m) => m.id);

  // Get all values for these metrics with session dates
  const { data: values, error: valuesError } = await supabase
    .from("metric_values")
    .select("*, sessions(session_date)")
    .in("metric_id", metricIds)
    .order("recorded_at", { ascending: true });

  if (valuesError) return { error: valuesError.message };

  // Group values by metric
  return {
    data: metrics.map((metric) => ({
      ...metric,
      values: (values || []).filter((v) => v.metric_id === metric.id),
    })),
  };
}
