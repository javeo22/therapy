"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface MetricDataPoint {
  date: string;
  value: number;
}

interface MetricChartProps {
  data: MetricDataPoint[];
  name: string;
  minValue?: number;
  maxValue?: number;
  variant?: "default" | "sparkline";
}

export function MetricChart({
  data,
  name,
  minValue = 0,
  maxValue = 10,
  variant = "default",
}: MetricChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-20 text-xs text-on-surface-variant/50">
        Sin datos
      </div>
    );
  }

  const isSparkline = variant === "sparkline";

  const chartData = data.map((d) => ({
    date: new Date(d.date + "T12:00:00").toLocaleDateString("es-CR", {
      day: "numeric",
      month: "short",
    }),
    value: d.value,
    rawDate: d.date,
  }));

  if (isSparkline) {
    return (
      <div className="h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "var(--color-on-surface-variant)" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[minValue, maxValue]}
            tick={{ fontSize: 10, fill: "var(--color-on-surface-variant)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "none",
              borderRadius: "0.75rem",
              boxShadow: "var(--shadow-ambient)",
              fontSize: "0.75rem",
            }}
            formatter={(value) => [String(value), name]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-surface)",
              stroke: "var(--color-primary)",
              strokeWidth: 2,
              r: 3,
            }}
            activeDot={{
              fill: "var(--color-primary)",
              strokeWidth: 0,
              r: 5,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
