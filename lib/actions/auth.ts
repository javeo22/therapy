"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;
  const role = formData.get("role") as "therapist" | "patient";
  const inviteToken = formData.get("invite_token") as string | null;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // If registering via invite, link patient to therapist
  if (inviteToken && data.user && role === "patient") {
    const { error: linkError } = await supabase
      .from("patient_records")
      .update({ patient_id: data.user.id, invite_token: null })
      .eq("invite_token", inviteToken);

    if (linkError) {
      return { error: "No se pudo vincular con tu terapeuta. Contactá a tu terapeuta." };
    }
  }

  redirect(role === "therapist" ? "/terapeuta/pacientes" : "/paciente");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Credenciales incorrectas. Intentá de nuevo." };
  }

  // Get user role and redirect
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Error inesperado." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  redirect(profile?.role === "therapist" ? "/terapeuta/pacientes" : "/paciente");
}

export async function signInWithMagicLink(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Revisá tu correo electrónico para el enlace de inicio de sesión." };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
