"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function giveConsent(): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase
    .from("profiles")
    .update({ consent_given_at: new Date().toISOString() })
    .eq("id", user.id);

  // Get role and redirect
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  redirect(
    profile?.role === "therapist" ? "/terapeuta/pacientes" : "/paciente"
  );
}
