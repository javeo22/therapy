import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { PatientRecord } from "@/lib/types/database";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface PatientCardProps {
  patient: PatientRecord;
  sessionCount?: number;
  lastSessionDate?: string | null;
}

export function PatientCard({
  patient,
  sessionCount = 0,
  lastSessionDate,
}: PatientCardProps) {
  const isLinked = !!patient.patient_id;

  return (
    <Link href={`/terapeuta/pacientes/${patient.id}`}>
      <Card className="flex items-center gap-3 py-4 px-4 active:scale-[0.98] transition-transform duration-150">
        <Avatar name={patient.full_name} size="md" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-on-surface truncate">
            {patient.full_name}
          </p>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {sessionCount > 0
              ? `${sessionCount} ${sessionCount === 1 ? "sesión" : "sesiones"}`
              : "Sin sesiones"}
            {lastSessionDate && (
              <span>
                {" · "}
                {new Date(lastSessionDate).toLocaleDateString("es-CR", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!isLinked && (
            <span className="text-[10px] font-medium text-tertiary bg-surface-container-high px-2 py-0.5 rounded-full">
              Pendiente
            </span>
          )}
          {!patient.is_active && (
            <span className="text-[10px] font-medium text-error bg-error/10 px-2 py-0.5 rounded-full">
              Inactivo
            </span>
          )}
          <ChevronRight size={16} className="text-on-surface-variant/40" />
        </div>
      </Card>
    </Link>
  );
}
