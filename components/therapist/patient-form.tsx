"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { createPatient } from "@/lib/actions/patients";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import { Copy, Check, Link as LinkIcon } from "lucide-react";

export function PatientForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createPatient(formData);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    toast("Paciente creado");
    if (result.data?.invite_token) {
      const baseUrl = window.location.origin;
      setInviteLink(`${baseUrl}/invitacion?token=${result.data.invite_token}`);
    }
  }

  async function copyLink() {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (inviteLink) {
    return (
      <Card variant="elevated" className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-secondary">
          <LinkIcon size={20} />
          <h3 className="font-semibold text-on-surface">Paciente creado</h3>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Compartí este enlace con tu paciente para que se registre y quede
          vinculado a tu cuenta.
        </p>
        <div className="flex items-center gap-2 bg-surface-container-highest rounded-xl p-3">
          <code className="text-xs text-on-surface-variant flex-1 break-all">
            {inviteLink}
          </code>
          <button
            onClick={copyLink}
            className="shrink-0 p-2 rounded-lg hover:bg-surface-container-high transition-colors"
          >
            {copied ? (
              <Check size={16} className="text-secondary" />
            ) : (
              <Copy size={16} className="text-on-surface-variant" />
            )}
          </button>
        </div>
        <Button
          variant="ghost"
          onClick={() => router.push("/terapeuta/pacientes")}
        >
          Volver a pacientes
        </Button>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          name="full_name"
          label="Nombre completo"
          placeholder="Ej: María López"
          required
          autoFocus
        />

        {error && (
          <p className="text-sm text-error font-medium">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={loading} className="flex-1">
            Crear paciente
          </Button>
        </div>
      </form>
    </Card>
  );
}
