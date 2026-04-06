"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { FormField } from "@/lib/types/forms";

export async function createTemplate(
  patientRecordId: string,
  title: string,
  fields: FormField[]
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  if (!title.trim()) return { error: "El título es requerido." };
  if (fields.length === 0) return { error: "Agregá al menos un campo." };

  const { data, error } = await supabase
    .from("form_templates")
    .insert({
      therapist_id: user.id,
      patient_record_id: patientRecordId,
      title: title.trim(),
      fields: fields as unknown as Record<string, unknown>[],
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/terapeuta/pacientes/${patientRecordId}`);
  return { data };
}

export async function getTemplatesByPatient(patientRecordId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("form_templates")
    .select("*")
    .eq("patient_record_id", patientRecordId)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { data };
}

export async function getTemplate(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("form_templates")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function toggleTemplateActive(id: string) {
  const supabase = await createClient();

  // Get current state
  const { data: template } = await supabase
    .from("form_templates")
    .select("is_active, patient_record_id")
    .eq("id", id)
    .single();

  if (!template) return { error: "Formulario no encontrado." };

  const { error } = await supabase
    .from("form_templates")
    .update({ is_active: !template.is_active })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath(`/terapeuta/pacientes/${template.patient_record_id}`);
  return { success: true, is_active: !template.is_active };
}
