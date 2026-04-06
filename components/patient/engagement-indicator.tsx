import { Card } from "@/components/ui/card";
import { Flame, CheckCircle, TrendingUp, Calendar } from "lucide-react";

interface EngagementIndicatorProps {
  totalSessions: number;
  totalFormsCompleted: number;
  weeklyCompletionRate?: { completed: number; expected: number } | null;
  streakWeeks?: number;
}

const MILESTONES = [5, 10, 20, 50, 100];

function getSessionMilestone(count: number): string | null {
  const milestone = MILESTONES.find((m) => count === m);
  return milestone ? `${milestone}ª sesión alcanzada` : null;
}

export function EngagementIndicator({
  totalSessions,
  totalFormsCompleted,
  weeklyCompletionRate,
  streakWeeks = 0,
}: EngagementIndicatorProps) {
  const milestone = getSessionMilestone(totalSessions);

  return (
    <div className="flex flex-col gap-2">
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

      {/* Weekly rate + streak */}
      {(weeklyCompletionRate || streakWeeks > 1) && (
        <Card className="flex items-center gap-3 py-2.5 px-3">
          {weeklyCompletionRate && weeklyCompletionRate.expected > 0 && (
            <div className="flex items-center gap-1.5 flex-1">
              <TrendingUp size={14} className="text-secondary shrink-0" />
              <span className="text-xs text-on-surface-variant">
                {weeklyCompletionRate.completed} de{" "}
                {weeklyCompletionRate.expected} esta semana
              </span>
            </div>
          )}
          {streakWeeks > 1 && (
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-tertiary shrink-0" />
              <span className="text-xs text-tertiary font-medium">
                Semana {streakWeeks} consecutiva
              </span>
            </div>
          )}
        </Card>
      )}

      {/* Milestone */}
      {milestone && (
        <p className="text-xs text-secondary font-medium text-center">
          {milestone}
        </p>
      )}
    </div>
  );
}
