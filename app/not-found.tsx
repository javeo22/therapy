import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-dvh bg-surface flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 rounded-full bg-tertiary/10 flex items-center justify-center mx-auto mb-4">
          <SearchX size={32} className="text-tertiary" />
        </div>
        <h1 className="font-serif text-xl font-bold text-on-surface mb-2">
          Página no encontrada
        </h1>
        <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
          La página que buscás no existe o fue movida.
        </p>
        <Link href="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    </div>
  );
}
