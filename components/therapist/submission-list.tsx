import { Card } from "@/components/ui/card";
import { FileCheck, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Submission {
  id: string;
  submitted_at: string;
  profiles: { full_name: string } | null;
}

interface SubmissionListProps {
  submissions: Submission[];
  patientRecordId: string;
  formId: string;
}

export function SubmissionList({
  submissions,
  patientRecordId,
  formId,
}: SubmissionListProps) {
  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <FileCheck size={36} className="text-on-surface-variant/40" />
        <p className="text-on-surface-variant">
          No hay respuestas todavía.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {submissions.map((submission) => (
        <Link
          key={submission.id}
          href={`/terapeuta/pacientes/${patientRecordId}/formularios/${formId}/respuestas/${submission.id}`}
        >
          <Card className="flex items-center gap-3 py-4 px-4 active:scale-[0.98] transition-transform duration-150">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
              <FileCheck size={16} className="text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-on-surface">
                {submission.profiles?.full_name || "Paciente"}
              </p>
              <p className="text-xs text-on-surface-variant">
                {new Date(submission.submitted_at).toLocaleDateString("es-CR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <ChevronRight size={16} className="text-on-surface-variant/40" />
          </Card>
        </Link>
      ))}
    </div>
  );
}
