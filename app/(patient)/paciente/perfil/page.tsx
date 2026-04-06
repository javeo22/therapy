import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { User, LogOut, Download, Trash2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import Link from "next/link";

export default async function PerfilPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div className="py-6">
      <h2 className="font-serif text-2xl font-bold text-on-surface mb-4">
        Perfil
      </h2>

      <Card variant="elevated" className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar name={profile?.full_name || ""} size="lg" />
          <div>
            <p className="font-semibold text-on-surface">
              {profile?.full_name}
            </p>
            <p className="text-xs text-on-surface-variant">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          <User size={12} />
          <span>Paciente</span>
          {profile?.consent_given_at && (
            <span className="ml-2">
              · Consentimiento:{" "}
              {new Date(profile.consent_given_at).toLocaleDateString("es-CR")}
            </span>
          )}
        </div>
      </Card>

      {/* Data export */}
      <Card variant="elevated" className="mb-4">
        <h3 className="text-sm font-semibold text-on-surface mb-2">
          Tus datos
        </h3>
        <p className="text-xs text-on-surface-variant mb-3 leading-relaxed">
          Según la Ley 8968, tenés derecho a acceder a todos tus datos
          personales almacenados en esta aplicación.
        </p>
        <Link href="/api/export">
          <Button variant="secondary" size="sm" className="gap-2">
            <Download size={14} />
            Exportar mis datos (JSON)
          </Button>
        </Link>
      </Card>

      {/* Delete account info */}
      <Card className="mb-4">
        <h3 className="text-sm font-semibold text-on-surface mb-2 flex items-center gap-1.5">
          <Trash2 size={14} className="text-error" />
          Eliminar cuenta
        </h3>
        <p className="text-xs text-on-surface-variant leading-relaxed">
          Para solicitar la eliminación de tu cuenta y todos tus datos,
          contactá a tu terapeuta. Según la Ley 8968, todos tus datos serán
          eliminados de forma permanente.
        </p>
      </Card>

      <Card variant="elevated">
        <form action={signOut}>
          <Button variant="ghost" type="submit" className="w-full gap-2">
            <LogOut size={16} />
            Cerrar sesión
          </Button>
        </form>
      </Card>
    </div>
  );
}
