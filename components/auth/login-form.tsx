"use client";

import { useState } from "react";
import { signIn, signInWithMagicLink } from "@/lib/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoginForm() {
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    setLoading(true);

    const action = useMagicLink ? signInWithMagicLink : signIn;
    const result = await action(formData);

    if (result?.error) {
      setError(result.error);
    }
    if (result && "success" in result && result.success) {
      setSuccess(result.success);
    }

    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-5">
      <Input
        label="Correo electrónico"
        name="email"
        type="email"
        placeholder="tu@correo.com"
        required
        autoComplete="email"
      />

      {!useMagicLink && (
        <Input
          label="Contraseña"
          name="password"
          type="password"
          placeholder="Tu contraseña"
          required
          autoComplete="current-password"
        />
      )}

      {error && (
        <p className="text-sm text-error font-medium">{error}</p>
      )}

      {success && (
        <p className="text-sm text-secondary font-medium">{success}</p>
      )}

      <Button type="submit" loading={loading}>
        {useMagicLink ? "Enviar enlace" : "Iniciar sesión"}
      </Button>

      <button
        type="button"
        onClick={() => {
          setUseMagicLink(!useMagicLink);
          setError(null);
          setSuccess(null);
        }}
        className="text-sm text-tertiary font-medium text-center"
      >
        {useMagicLink
          ? "Usar contraseña"
          : "Iniciar con enlace mágico"}
      </button>

      <p className="text-sm text-on-surface-variant text-center">
        ¿No tenés cuenta?{" "}
        <Link href="/registro" className="text-tertiary font-medium">
          Registrate
        </Link>
      </p>
    </form>
  );
}
