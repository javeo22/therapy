import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function PacientesPage() {
  return (
    <div className="py-6">
      <h2 className="font-serif text-2xl font-bold text-on-surface mb-4">
        Pacientes
      </h2>
      <Card className="flex flex-col items-center gap-3 py-10 text-center">
        <Users size={40} className="text-on-surface-variant/40" />
        <p className="text-on-surface-variant">
          Aún no tenés pacientes registrados.
        </p>
        <p className="text-sm text-on-surface-variant/70">
          Agregá tu primer paciente para comenzar.
        </p>
      </Card>
    </div>
  );
}
