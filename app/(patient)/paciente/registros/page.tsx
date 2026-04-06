import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { ClipboardList, CheckCircle, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function RegistrosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: record } = await supabase
    .from("patient_records")
    .select("id")
    .eq("patient_id", user!.id)
    .eq("is_active", true)
    .single();

  if (!record) {
    return (
      <div className="py-6">
        <h2 className="font-serif text-2xl font-bold text-on-surface mb-4">
          Autorregistros
        </h2>
        <Card className="py-8 text-center">
          <p className="text-sm text-on-surface-variant">
            Aún no estás vinculado con un terapeuta.
          </p>
        </Card>
      </div>
    );
  }

  // Get active templates
  const { data: templates } = await supabase
    .from("form_templates")
    .select("*")
    .eq("patient_record_id", record.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  // Get my submissions
  const { data: submissions } = await supabase
    .from("form_submissions")
    .select("*, form_templates(title)")
    .eq("patient_id", user!.id)
    .order("submitted_at", { ascending: false });

  const submittedTemplateIds = new Set(
    (submissions || []).map((s) => s.form_template_id)
  );

  const pendingForms = (templates || []).filter(
    (t) => !submittedTemplateIds.has(t.id)
  );

  return (
    <div className="py-6">
      <h2 className="font-serif text-2xl font-bold text-on-surface mb-4">
        Autorregistros
      </h2>

      {/* Pending */}
      {pendingForms.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-on-surface mb-2">
            Pendientes
          </h3>
          <div className="flex flex-col gap-2 mb-6">
            {pendingForms.map((form) => (
              <Link key={form.id} href={`/paciente/registros/${form.id}`}>
                <Card className="flex items-center gap-3 py-4 px-4 active:scale-[0.98] transition-transform duration-150">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <ClipboardList size={16} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">
                      {form.title}
                    </p>
                    <p className="text-xs text-tertiary font-medium">
                      Pendiente
                    </p>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-on-surface-variant/40"
                  />
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Completed */}
      <h3 className="text-sm font-semibold text-on-surface mb-2">
        Completados
      </h3>
      {submissions && submissions.length > 0 ? (
        <div className="flex flex-col gap-2">
          {submissions.map((submission) => {
            const templateTitle =
              (submission.form_templates as any)?.title || "Formulario";

            return (
              <Card
                key={submission.id}
                className="flex items-center gap-3 py-4 px-4"
              >
                <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <CheckCircle size={16} className="text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">
                    {templateTitle}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {new Date(submission.submitted_at).toLocaleDateString(
                      "es-CR",
                      {
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="flex items-center gap-3 py-4 px-4">
          <CheckCircle size={18} className="text-on-surface-variant/40" />
          <p className="text-sm text-on-surface-variant">
            No has completado ningún registro aún.
          </p>
        </Card>
      )}

      {pendingForms.length === 0 && (!submissions || submissions.length === 0) && (
        <Card className="py-8 text-center mt-4">
          <ClipboardList
            size={36}
            className="text-on-surface-variant/40 mx-auto mb-3"
          />
          <p className="text-sm text-on-surface-variant">
            Tu terapeuta aún no te ha asignado autorregistros.
          </p>
        </Card>
      )}
    </div>
  );
}
