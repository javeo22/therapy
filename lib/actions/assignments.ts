"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createAssignment(
  patientRecordId: string,
  formData: FormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado." };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const dueDate = formData.get("due_date") as string;

  if (!title?.trim()) return { error: "El título es requerido." };

  const { data, error } = await supabase
    .from("assignments")
    .insert({
      patient_record_id: patientRecordId,
      therapist_id: user.id,
      title: title.trim(),
      description: description?.trim() || null,
      due_date: dueDate || null,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath(`/terapeuta/pacientes/${patientRecordId}`);
  return { data };
}

export async function getAssignmentsByPatient(patientRecordId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .eq("patient_record_id", patientRecordId)
    .order("created_at", { ascending: false });

  if (error) return { error: error.message };
  return { data };
}

export async function toggleAssignmentComplete(assignmentId: string) {
  const supabase = await createClient();

  const { data: assignment } = await supabase
    .from("assignments")
    .select("is_completed, patient_record_id")
    .eq("id", assignmentId)
    .single();

  if (!assignment) return { error: "Tarea no encontrada." };

  const nowCompleted = !assignment.is_completed;

  const { error } = await supabase
    .from("assignments")
    .update({
      is_completed: nowCompleted,
      completed_at: nowCompleted ? new Date().toISOString() : null,
    })
    .eq("id", assignmentId);

  if (error) return { error: error.message };

  revalidatePath("/paciente");
  revalidatePath(`/terapeuta/pacientes/${assignment.patient_record_id}`);
  return { success: true, is_completed: nowCompleted };
}

export async function deleteAssignment(assignmentId: string) {
  const supabase = await createClient();

  const { data: assignment } = await supabase
    .from("assignments")
    .select("patient_record_id")
    .eq("id", assignmentId)
    .single();

  if (!assignment) return { error: "Tarea no encontrada." };

  const { error } = await supabase
    .from("assignments")
    .delete()
    .eq("id", assignmentId);

  if (error) return { error: error.message };

  revalidatePath(`/terapeuta/pacientes/${assignment.patient_record_id}`);
  return { success: true };
}
