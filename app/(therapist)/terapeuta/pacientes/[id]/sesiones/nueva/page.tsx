import { SessionForm } from "@/components/therapist/session-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function NuevaSesionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: patient } = await supabase
    .from("patient_records")
    .select("*")
    .eq("id", id)
    .single();

  if (!patient) notFound();

  const { data: metrics } = await supabase
    .from("metrics")
    .select("*")
    .eq("patient_record_id", id)
    .order("created_at", { ascending: true });

  return (
    <div className="py-6">
      <h2 className="font-serif text-2xl font-bold text-on-surface mb-1">
        Nueva sesión
      </h2>
      <p className="text-sm text-on-surface-variant mb-4">
        {patient.full_name}
      </p>
      <SessionForm
        patientRecordId={id}
        patientName={patient.full_name}
        metrics={metrics || []}
      />
    </div>
  );
}
