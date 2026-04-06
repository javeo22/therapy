import { FormCompletion } from "@/components/patient/form-completion";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { FormField } from "@/lib/types/forms";

export default async function FormCompletionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: template } = await supabase
    .from("form_templates")
    .select("*")
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (!template) notFound();

  const fields = template.fields as unknown as FormField[];

  return (
    <div className="py-6">
      <Link
        href="/paciente/registros"
        className="inline-flex items-center gap-1 text-sm text-tertiary mb-3"
      >
        <ArrowLeft size={14} />
        Registros
      </Link>

      <h2 className="font-serif text-2xl font-bold text-on-surface mb-1">
        {template.title}
      </h2>
      {template.description && (
        <p className="text-sm text-on-surface-variant mb-2">
          {template.description}
        </p>
      )}
      {template.instructions && (
        <div className="bg-surface-container rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            {template.instructions}
          </p>
        </div>
      )}

      <FormCompletion
        formTemplateId={id}
        title={template.title}
        fields={fields}
      />
    </div>
  );
}
