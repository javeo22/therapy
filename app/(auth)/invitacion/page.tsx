import { RegisterForm } from "@/components/auth/register-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

interface InvitacionPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function InvitacionPage({ searchParams }: InvitacionPageProps) {
  const { token } = await searchParams;

  if (!token) {
    redirect("/login");
  }

  // Verify the invite token exists and is unclaimed
  const supabase = await createClient();
  const { data: record } = await supabase
    .from("patient_records")
    .select("id, full_name")
    .eq("invite_token", token)
    .is("patient_id", null)
    .single();

  if (!record) {
    return (
      <div
        className="bg-surface-container rounded-3xl p-8 text-center"
        style={{ boxShadow: "var(--shadow-ambient)" }}
      >
        <h1 className="font-serif text-2xl font-bold text-primary mb-2">
          Enlace no válido
        </h1>
        <p className="text-on-surface-variant">
          Este enlace de invitación ya fue utilizado o no existe.
        </p>
      </div>
    );
  }

  return (
    <div
      className="bg-surface-container rounded-3xl p-8"
      style={{ boxShadow: "var(--shadow-ambient)" }}
    >
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl font-bold text-primary mb-2">
          Therapy
        </h1>
        <p className="text-on-surface-variant">
          Tu terapeuta te invitó a unirte
        </p>
      </div>
      <RegisterForm inviteToken={token} />
    </div>
  );
}
