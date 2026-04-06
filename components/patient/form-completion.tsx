"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormRenderer } from "@/components/shared/form-renderer";
import { submitForm } from "@/lib/actions/form-submissions";
import { validateSubmission } from "@/lib/utils/form-validation";
import type { FormField } from "@/lib/types/forms";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";

interface FormCompletionProps {
  formTemplateId: string;
  title: string;
  fields: FormField[];
}

export function FormCompletion({
  formTemplateId,
  title,
  fields,
}: FormCompletionProps) {
  const router = useRouter();
  const [responses, setResponses] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = fields.filter((f) => {
    const v = responses[f.id];
    if (v === undefined || v === null) return false;
    if (typeof v === "string" && !v.trim()) return false;
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  }).length;

  function handleChange(fieldId: string, value: unknown) {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  }

  async function handleSubmit() {
    const validation = validateSubmission(fields, responses);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    const result = await submitForm(formTemplateId, fields, responses);
    setLoading(false);

    if (result.error) {
      if (result.fieldErrors) {
        setErrors(result.fieldErrors);
      } else {
        setErrors({ _form: result.error });
      }
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
          <CheckCircle size={32} className="text-secondary" />
        </div>
        <h3 className="font-serif text-xl font-bold text-on-surface">
          ¡Listo!
        </h3>
        <p className="text-sm text-on-surface-variant max-w-xs">
          Tu respuesta fue enviada. Tu terapeuta podrá revisarla en tu próxima
          sesión.
        </p>
        <Button
          variant="ghost"
          onClick={() => router.push("/paciente/registros")}
        >
          Volver a registros
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(answeredCount / fields.length) * 100}%` }}
          />
        </div>
        <span className="text-xs text-on-surface-variant tabular-nums">
          {answeredCount} / {fields.length}
        </span>
      </div>

      <Card variant="elevated">
        <FormRenderer
          fields={fields}
          responses={responses}
          onChange={handleChange}
          errors={errors}
        />
      </Card>

      {errors._form && (
        <p className="text-sm text-error font-medium">{errors._form}</p>
      )}

      <Button onClick={handleSubmit} loading={loading} className="w-full">
        Enviar respuestas
      </Button>
    </div>
  );
}
