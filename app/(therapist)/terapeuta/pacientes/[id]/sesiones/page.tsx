import { SessionList } from "@/components/therapist/session-list";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function SesionesPage({
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

  const { data: sessions } = await supabase
    .from("sessions")
    .select("*")
    .eq("patient_record_id", id)
    .order("session_date", { ascending: false });

  return (
    <div className="py-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-on-surface">
            Sesiones
          </h2>
          <p className="text-sm text-on-surface-variant">
            {patient.full_name}
          </p>
        </div>
        <Link href={`/terapeuta/pacientes/${id}/sesiones/nueva`}>
          <Button size="sm">
            <Plus size={16} />
            Nueva
          </Button>
        </Link>
      </div>
      <SessionList sessions={sessions || []} patientRecordId={id} />
    </div>
  );
}
