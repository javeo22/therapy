"use client";

import { Card } from "@/components/ui/card";
import { MetricChart } from "@/components/shared/metric-chart";
import type { Metric } from "@/lib/types/database";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricWithValues extends Metric {
  values: {
    value: number;
    sessions: { session_date: string } | null;
  }[];
}

interface MetricSummaryProps {
  metrics: MetricWithValues[];
}

function getTrend(values: { value: number }[]): "up" | "down" | "stable" {
  if (values.length < 2) return "stable";
  const last = values[values.length - 1].value;
  const prev = values[values.length - 2].value;
  if (last > prev) return "up";
  if (last < prev) return "down";
  return "stable";
}

const trendIcon = {
  up: <TrendingUp size={14} className="text-secondary" />,
  down: <TrendingDown size={14} className="text-error" />,
  stable: <Minus size={14} className="text-on-surface-variant" />,
};

export function MetricSummary({ metrics }: MetricSummaryProps) {
  if (metrics.length === 0) {
    return (
      <Card className="py-8 text-center">
        <p className="text-sm text-on-surface-variant">
          Tu terapeuta aún no ha definido métricas de seguimiento.
        </p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {metrics.map((metric) => {
        const chartData = metric.values.map((v) => ({
          date: v.sessions?.session_date || "",
          value: v.value,
        }));

        const latestValue =
          chartData.length > 0 ? chartData[chartData.length - 1].value : null;
        const trend = getTrend(metric.values);

        return (
          <Card key={metric.id} variant="elevated" className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-on-surface">
                  {metric.name}
                </p>
                {metric.description && (
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {metric.description}
                  </p>
                )}
              </div>
              {latestValue !== null && (
                <div className="flex items-center gap-1.5">
                  {trendIcon[trend]}
                  <span className="text-xl font-bold text-primary tabular-nums">
                    {latestValue}
                  </span>
                </div>
              )}
            </div>
            <MetricChart
              data={chartData}
              name={metric.name}
              minValue={metric.min_value}
              maxValue={metric.max_value}
              variant={chartData.length <= 5 ? "default" : "sparkline"}
            />
          </Card>
        );
      })}
    </div>
  );
}
