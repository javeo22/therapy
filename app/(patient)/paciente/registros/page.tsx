import { Card } from "@/components/ui/card";

export default function RegistrosPage() {
  return (
    <div className="py-6">
      <h2 className="font-serif text-2xl font-bold text-on-surface mb-4">
        Autorregistros
      </h2>
      <Card>
        <p className="text-on-surface-variant">
          Tus formularios pendientes y completados aparecerán aquí.
        </p>
      </Card>
    </div>
  );
}
