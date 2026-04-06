"use client";

import { useState } from "react";
import { toggleTemplateActive } from "@/lib/actions/form-templates";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

interface ToggleFormButtonProps {
  formId: string;
  isActive: boolean;
}

export function ToggleFormButton({ formId, isActive }: ToggleFormButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const result = await toggleTemplateActive(formId);
    setLoading(false);

    if (result.error) {
      toast(result.error, "error");
      return;
    }

    toast(result.is_active ? "Formulario activado" : "Formulario desactivado");
    router.refresh();
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`text-xs font-medium px-3 py-1 rounded-full transition-colors disabled:opacity-50 ${
        isActive
          ? "bg-secondary/10 text-secondary hover:bg-secondary/20"
          : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
      }`}
    >
      {loading ? "..." : isActive ? "Activo" : "Inactivo"}
    </button>
  );
}
