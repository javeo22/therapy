"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import crypto from "crypto";

export async function listPatients(search?: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  let query = supabase
    .from("patient_records")
    .select("*")
    .eq("therapist_id", user.id)
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("full_name", `%${search}%`);
  }

  const { data, error } = await query;

  if (error) return { error: error.message };
  return { data };
}

export async function getPatient(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("patient_records")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function createPatient(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const fullName = formData.get("full_name") as string;
  if (!fullName?.trim()) return { error: "El nombre es requerido." };

  const inviteToken = crypto.randomUUID();

  const { data, error } = await supabase
    .from("patient_records")
    .insert({
      therapist_id: user.id,
      full_name: fullName.trim(),
      invite_token: inviteToken,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/terapeuta/pacientes");
  return { data };
}

export async function updatePatient(id: string, formData: FormData) {
  const supabase = await createClient();

  const fullName = formData.get("full_name") as string;
  if (!fullName?.trim()) return { error: "El nombre es requerido." };

  const isActive = formData.get("is_active") !== "false";

  const { error } = await supabase
    .from("patient_records")
    .update({
      full_name: fullName.trim(),
      is_active: isActive,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/terapeuta/pacientes");
  revalidatePath(`/terapeuta/pacientes/${id}`);
  return { success: true };
}

export async function deletePatient(id: string) {
  const supabase = await createClient();

  // Cascade delete handles sessions, metrics, metric_values, form_templates, form_submissions
  const { error } = await supabase
    .from("patient_records")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/terapeuta/pacientes");
  return { success: true };
}

export async function regenerateInviteToken(id: string) {
  const supabase = await createClient();

  const inviteToken = crypto.randomUUID();

  const { error } = await supabase
    .from("patient_records")
    .update({ invite_token: inviteToken })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath(`/terapeuta/pacientes/${id}`);
  return { data: { invite_token: inviteToken } };
}
