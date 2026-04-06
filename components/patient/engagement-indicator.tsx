import { Card } from "@/components/ui/card";
import { Flame, CheckCircle } from "lucide-react";

interface EngagementIndicatorProps {
  totalSessions: number;
  totalFormsCompleted: number;
}

export function EngagementIndicator({
  totalSessions,
  totalFormsCompleted,
}: EngagementIndicatorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Card className="flex items-center gap-2 py-3 px-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Flame size={16} className="text-primary" />
        </div>
        <div>
          <p className="text-lg font-bold text-on-surface tabular-nums">
            {totalSessions}
          </p>
          <p className="text-[10px] text-on-surface-variant">
            {totalSessions === 1 ? "Sesión" : "Sesiones"}
          </p>
        </div>
      </Card>
      <Card className="flex items-center gap-2 py-3 px-3">
        <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
          <CheckCircle size={16} className="text-secondary" />
        </div>
        <div>
          <p className="text-lg font-bold text-on-surface tabular-nums">
            {totalFormsCompleted}
          </p>
          <p className="text-[10px] text-on-surface-variant">
            {totalFormsCompleted === 1 ? "Registro" : "Registros"}
          </p>
        </div>
      </Card>
    </div>
  );
}
