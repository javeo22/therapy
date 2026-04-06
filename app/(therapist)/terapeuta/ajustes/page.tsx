import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";
import { createClient } from "@/lib/supabase/server";
import { User, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

export default async function AjustesPage() {
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
        Ajustes
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
          <span>Terapeuta</span>
          {profile?.consent_given_at && (
            <span className="ml-2">
              · Consentimiento:{" "}
              {new Date(profile.consent_given_at).toLocaleDateString("es-CR")}
            </span>
          )}
        </div>
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
