import { Card } from "@/components/ui/card";

export default function ProgresoPage() {
  return (
    <div className="py-6">
      <h2 className="font-serif text-2xl font-bold text-on-surface mb-4">
        Progreso
      </h2>
      <Card>
        <p className="text-on-surface-variant">
          Tus métricas de progreso aparecerán aquí.
        </p>
      </Card>
    </div>
  );
}
