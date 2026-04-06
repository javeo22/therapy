import { SubmissionList } from "@/components/therapist/submission-list";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { FormField } from "@/lib/types/forms";
import { FIELD_TYPE_LABELS } from "@/lib/types/forms";

export default async function FormDetailPage({
  params,
}: {
  params: Promise<{ id: string; formId: string }>;
}) {
  const { id, formId } = await params;
  const supabase = await createClient();

  const { data: template } = await supabase
    .from("form_templates")
    .select("*")
    .eq("id", formId)
    .single();

  if (!template) notFound();

  const { data: patient } = await supabase
    .from("patient_records")
    .select("full_name")
    .eq("id", id)
    .single();

  const { data: submissions } = await supabase
    .from("form_submissions")
    .select("*, profiles(full_name)")
    .eq("form_template_id", formId)
    .order("submitted_at", { ascending: false });

  const fields = template.fields as unknown as FormField[];

  return (
    <div className="py-6">
      <Link
        href={`/terapeuta/pacientes/${id}`}
        className="inline-flex items-center gap-1 text-sm text-tertiary mb-3"
      >
        <ArrowLeft size={14} />
        {patient?.full_name}
      </Link>

      <h2 className="font-serif text-2xl font-bold text-on-surface mb-1">
        {template.title}
      </h2>
      <p className="text-sm text-on-surface-variant mb-4">
        {fields.length} {fields.length === 1 ? "campo" : "campos"}
        {" · "}
        {template.is_active ? "Activo" : "Inactivo"}
      </p>

      {/* Template structure */}
      <Card variant="elevated" className="mb-4">
        <h3 className="text-sm font-semibold text-on-surface mb-3">
          Estructura
        </h3>
        <div className="flex flex-col gap-2">
          {fields.map((field, i) => (
            <div
              key={field.id}
              className="flex items-center gap-2 text-sm"
            >
              <span className="text-on-surface-variant/40 text-xs tabular-nums w-5">
                {i + 1}.
              </span>
              <span className="text-on-surface flex-1">{field.label}</span>
              <span className="text-[10px] text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">
                {FIELD_TYPE_LABELS[field.type]}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Submissions */}
      <h3 className="text-sm font-semibold text-on-surface mb-3">
        Respuestas ({submissions?.length || 0})
      </h3>
      <SubmissionList
        submissions={submissions || []}
        patientRecordId={id}
        formId={formId}
      />
    </div>
  );
}
