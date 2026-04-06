"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-dvh bg-surface flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-error/10 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} className="text-error" />
        </div>
        <h1 className="font-serif text-xl font-bold text-on-surface mb-2">
          Algo salió mal
        </h1>
        <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
          Ocurrió un error inesperado. Podés intentar de nuevo o volver al
          inicio.
        </p>
        <div className="flex flex-col gap-2">
          <Button onClick={reset}>Intentar de nuevo</Button>
          <Button variant="ghost" onClick={() => (window.location.href = "/")}>
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
