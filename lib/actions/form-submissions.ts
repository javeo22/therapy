"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { FormField } from "@/lib/types/forms";
import { validateSubmission } from "@/lib/utils/form-validation";

export async function submitForm(
  formTemplateId: string,
  fields: FormField[],
  responses: Record<string, unknown>
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  // Validate responses against field definitions
  const validation = validateSubmission(fields, responses);
  if (!validation.valid) {
    return { error: "Hay campos incompletos.", fieldErrors: validation.errors };
  }

  const { data, error } = await supabase
    .from("form_submissions")
    .insert({
      form_template_id: formTemplateId,
      patient_id: user.id,
      responses: responses as Record<string, unknown>,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/paciente");
  revalidatePath("/paciente/registros");
  return { data };
}

export async function getSubmissionsByTemplate(formTemplateId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("form_submissions")
    .select("*, profiles(full_name)")
    .eq("form_template_id", formTemplateId)
    .order("submitted_at", { ascending: false });

  if (error) return { error: error.message };
  return { data };
}

export async function getSubmission(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("form_submissions")
    .select("*, form_templates(title, fields), profiles(full_name)")
    .eq("id", id)
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function getMySubmissions() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const { data, error } = await supabase
    .from("form_submissions")
    .select("*, form_templates(title)")
    .eq("patient_id", user.id)
    .order("submitted_at", { ascending: false });

  if (error) return { error: error.message };
  return { data };
}
