import { Card } from "@/components/ui/card";
import { signOut } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export default function AjustesPage() {
  return (
    <div className="py-6">
      <h2 className="font-serif text-2xl font-bold text-on-surface mb-4">
        Ajustes
      </h2>
      <Card className="flex flex-col gap-4">
        <p className="text-on-surface-variant">
          Configuración de tu cuenta y práctica.
        </p>
        <form action={signOut}>
          <Button variant="ghost" type="submit">
            Cerrar sesión
          </Button>
        </form>
      </Card>
    </div>
  );
}
