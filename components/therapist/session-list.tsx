import { Card } from "@/components/ui/card";
import type { Session } from "@/lib/types/database";
import { Calendar, FileText } from "lucide-react";
import Link from "next/link";

interface SessionListProps {
  sessions: Session[];
  patientRecordId: string;
}

export function SessionList({ sessions, patientRecordId }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Calendar size={36} className="text-on-surface-variant/40" />
        <p className="text-on-surface-variant">
          No hay sesiones registradas.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {sessions.map((session) => (
        <Link
          key={session.id}
          href={`/terapeuta/pacientes/${patientRecordId}/sesiones/${session.id}`}
        >
          <Card className="flex items-start gap-3 py-4 px-4 active:scale-[0.98] transition-transform duration-150">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <FileText size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-on-surface text-sm">
                {new Date(session.session_date + "T12:00:00").toLocaleDateString("es-CR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              {session.notes && (
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                  {session.notes}
                </p>
              )}
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
