import { FormBuilder } from "@/components/therapist/form-builder";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NuevoFormularioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: patient } = await supabase
    .from("patient_records")
    .select("full_name")
    .eq("id", id)
    .single();

  if (!patient) notFound();

  return (
    <div className="py-6">
      <Link
        href={`/terapeuta/pacientes/${id}`}
        className="inline-flex items-center gap-1 text-sm text-tertiary mb-3"
      >
        <ArrowLeft size={14} />
        {patient.full_name}
      </Link>

      <h2 className="font-serif text-2xl font-bold text-on-surface mb-4">
        Nuevo autorregistro
      </h2>

      <FormBuilder patientRecordId={id} />
    </div>
  );
}
