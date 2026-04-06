"use client";

import type { Metric } from "@/lib/types/database";

interface MetricRecorderProps {
  metric: Metric;
  value?: number;
  onChange: (value: number) => void;
}

export function MetricRecorder({
  metric,
  value,
  onChange,
}: MetricRecorderProps) {
  const steps = Array.from(
    { length: metric.max_value - metric.min_value + 1 },
    (_, i) => metric.min_value + i
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-on-surface">
          {metric.name}
        </span>
        {value !== undefined && (
          <span className="text-lg font-bold text-primary tabular-nums">
            {value}
          </span>
        )}
      </div>
      {metric.description && (
        <p className="text-xs text-on-surface-variant">{metric.description}</p>
      )}
      <div className="flex gap-1">
        {steps.map((step) => {
          const isSelected = value === step;
          const isFilled = value !== undefined && step <= value;

          return (
            <button
              key={step}
              type="button"
              onClick={() => onChange(step)}
              className={`
                flex-1 py-2 rounded-lg text-xs font-medium
                transition-all duration-200
                ${
                  isSelected
                    ? "text-white scale-105"
                    : isFilled
                      ? "bg-primary/20 text-primary"
                      : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high"
                }
              `}
              style={isSelected ? { background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dim))" } : undefined}
            >
              {step}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-on-surface-variant/60">
        <span>{metric.min_value}</span>
        <span>{metric.max_value}</span>
      </div>
    </div>
  );
}
