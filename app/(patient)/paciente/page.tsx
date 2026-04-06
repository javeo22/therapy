import { Card } from "@/components/ui/card";

export default function PatientDashboardPage() {
  return (
    <div className="py-6">
      <h2 className="font-serif text-2xl font-bold text-on-surface mb-1">
        Hola
      </h2>
      <p className="text-on-surface-variant mb-6">Tu progreso terapéutico</p>
      <Card>
        <p className="text-on-surface-variant">
          Tu panel de progreso aparecerá aquí cuando tu terapeuta registre tus
          primeras sesiones.
        </p>
      </Card>
    </div>
  );
}
