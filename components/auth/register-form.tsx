"use client";

import { useState } from "react";
import { signUp } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RoleSelector } from "@/components/auth/role-selector";
import Link from "next/link";

interface RegisterFormProps {
  inviteToken?: string | null;
}

export function RegisterForm({ inviteToken }: RegisterFormProps) {
  const [role, setRole] = useState<"therapist" | "patient">(
    inviteToken ? "patient" : "therapist"
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    formData.set("role", role);
    if (inviteToken) {
      formData.set("invite_token", inviteToken);
    }

    const result = await signUp(formData);

    if (result?.error) {
      setError(result.error);
    }

    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      {!inviteToken && (
        <RoleSelector value={role} onChange={setRole} />
      )}

      <Input
        label="Nombre completo"
        name="full_name"
        type="text"
        placeholder="Tu nombre"
        required
        autoComplete="name"
      />

      <Input
        label="Correo electrónico"
        name="email"
        type="email"
        placeholder="tu@correo.com"
        required
        autoComplete="email"
      />

      <Input
        label="Contraseña"
        name="password"
        type="password"
        placeholder="Mínimo 6 caracteres"
        required
        minLength={6}
        autoComplete="new-password"
      />

      {error && (
        <p className="text-sm text-error font-medium">{error}</p>
      )}

      <Button type="submit" loading={loading}>
        Crear cuenta
      </Button>

      <p className="text-sm text-on-surface-variant text-center">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="text-tertiary font-medium">
          Iniciá sesión
        </Link>
      </p>
    </form>
  );
}
