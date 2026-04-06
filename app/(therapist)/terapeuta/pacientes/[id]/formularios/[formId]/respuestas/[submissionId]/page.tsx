import { SubmissionDetail } from "@/components/therapist/submission-detail";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { FormField } from "@/lib/types/forms";

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string; formId: string; submissionId: string }>;
}) {
  const { id, formId, submissionId } = await params;
  const supabase = await createClient();

  const { data: submission } = await supabase
    .from("form_submissions")
    .select("*, form_templates(title, fields), profiles(full_name)")
    .eq("id", submissionId)
    .single();

  if (!submission) notFound();

  const template = submission.form_templates as unknown as {
    title: string;
    fields: FormField[];
  };
  const profile = submission.profiles as unknown as { full_name: string } | null;

  return (
    <div className="py-6">
      <Link
        href={`/terapeuta/pacientes/${id}/formularios/${formId}`}
        className="inline-flex items-center gap-1 text-sm text-tertiary mb-3"
      >
        <ArrowLeft size={14} />
        {template.title}
      </Link>

      <h2 className="font-serif text-2xl font-bold text-on-surface mb-1">
        Respuesta
      </h2>
      <p className="text-sm text-on-surface-variant mb-4">
        {profile?.full_name || "Paciente"}
        {" · "}
        {new Date(submission.submitted_at).toLocaleDateString("es-CR", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <SubmissionDetail
        fields={template.fields}
        responses={submission.responses as Record<string, unknown>}
      />
    </div>
  );
}
