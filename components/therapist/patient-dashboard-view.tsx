"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricChart } from "@/components/shared/metric-chart";
import { MetricDefinitionForm } from "./metric-definition-form";
import type { PatientRecord, Session, Metric, FormTemplate } from "@/lib/types/database";
import {
  Plus,
  Calendar,
  TrendingUp,
  FileText,
  ClipboardList,
  ChevronRight,
  Copy,
  Check,
  Link as LinkIcon,
} from "lucide-react";
import Link from "next/link";

interface MetricWithValues extends Metric {
  values: {
    value: number;
    sessions: { session_date: string } | null;
  }[];
}

interface FormTemplateWithCount extends FormTemplate {
  submissionCount: number;
}

interface PatientDashboardViewProps {
  patient: PatientRecord;
  sessions: Session[];
  metricsWithValues: MetricWithValues[];
  formTemplates: FormTemplateWithCount[];
}

export function PatientDashboardView({
  patient,
  sessions,
  metricsWithValues,
  formTemplates,
}: PatientDashboardViewProps) {
  const [showMetricForm, setShowMetricForm] = useState(false);
  const [copied, setCopied] = useState(false);

  const lastSession = sessions[0];

  async function copyInviteLink() {
    if (!patient.invite_token) return;
    const link = `${window.location.origin}/invitacion?token=${patient.invite_token}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Invite link if patient hasn't registered */}
      {!patient.patient_id && patient.invite_token && (
        <Card className="flex items-center gap-3 bg-tertiary/5">
          <LinkIcon size={16} className="text-tertiary shrink-0" />
          <p className="text-xs text-on-surface-variant flex-1">
            Paciente pendiente de registro
          </p>
          <button
            onClick={copyInviteLink}
            className="shrink-0 flex items-center gap-1 text-xs font-medium text-tertiary"
          >
            {copied ? (
              <>
                <Check size={12} /> Copiado
              </>
            ) : (
              <>
                <Copy size={12} /> Copiar enlace
              </>
            )}
          </button>
        </Card>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-2">
        <Link href={`/terapeuta/pacientes/${patient.id}/sesiones/nueva`}>
          <Card className="flex items-center gap-2 py-3 px-3 active:scale-[0.97] transition-transform">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Plus size={16} className="text-primary" />
            </div>
            <span className="text-sm font-medium text-on-surface">
              Nueva sesión
            </span>
          </Card>
        </Link>
        <Link href={`/terapeuta/pacientes/${patient.id}/sesiones`}>
          <Card className="flex items-center gap-2 py-3 px-3 active:scale-[0.97] transition-transform">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Calendar size={16} className="text-secondary" />
            </div>
            <span className="text-sm font-medium text-on-surface">
              Historial
            </span>
          </Card>
        </Link>
      </div>

      {/* Last session */}
      {lastSession && (
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
              <FileText size={14} className="text-on-surface-variant" />
              Última sesión
            </h3>
            <Link
              href={`/terapeuta/pacientes/${patient.id}/sesiones/${lastSession.id}`}
              className="text-xs text-tertiary flex items-center gap-0.5"
            >
              Ver <ChevronRight size={12} />
            </Link>
          </div>
          <p className="text-xs text-on-surface-variant mb-1">
            {new Date(lastSession.session_date + "T12:00:00").toLocaleDateString("es-CR", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          {lastSession.notes && (
            <p className="text-sm text-on-surface-variant line-clamp-2">
              {lastSession.notes}
            </p>
          )}
        </Card>
      )}

      {/* Metrics */}
      <Card variant="elevated">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
            <TrendingUp size={14} className="text-on-surface-variant" />
            Métricas
          </h3>
          <button
            onClick={() => setShowMetricForm(!showMetricForm)}
            className="text-xs text-tertiary font-medium flex items-center gap-0.5"
          >
            <Plus size={12} /> Agregar
          </button>
        </div>

        {showMetricForm && (
          <div className="mb-4 pb-4" style={{ borderBottom: "1px solid var(--color-surface-container-high)" }}>
            <MetricDefinitionForm
              patientRecordId={patient.id}
              onClose={() => setShowMetricForm(false)}
            />
          </div>
        )}

        {metricsWithValues.length === 0 && !showMetricForm ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <TrendingUp size={24} className="text-on-surface-variant/30" />
            <p className="text-xs text-on-surface-variant">
              Definí métricas para hacer seguimiento.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {metricsWithValues.map((metric) => {
              const chartData = metric.values.map((v) => ({
                date: v.sessions?.session_date || "",
                value: v.value,
              }));

              const latestValue =
                chartData.length > 0
                  ? chartData[chartData.length - 1].value
                  : null;

              return (
                <div key={metric.id}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-sm font-medium text-on-surface">
                      {metric.name}
                    </span>
                    {latestValue !== null && (
                      <span className="text-lg font-bold text-primary tabular-nums">
                        {latestValue}
                        <span className="text-xs text-on-surface-variant font-normal">
                          /{metric.max_value}
                        </span>
                      </span>
                    )}
                  </div>
                  <MetricChart
                    data={chartData}
                    name={metric.name}
                    minValue={metric.min_value}
                    maxValue={metric.max_value}
                    variant={chartData.length <= 3 ? "default" : "default"}
                  />
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Autorregistros */}
      <Card variant="elevated">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-on-surface flex items-center gap-1.5">
            <ClipboardList size={14} className="text-on-surface-variant" />
            Autorregistros
          </h3>
          <Link
            href={`/terapeuta/pacientes/${patient.id}/formularios/nuevo`}
            className="text-xs text-tertiary font-medium flex items-center gap-0.5"
          >
            <Plus size={12} /> Crear
          </Link>
        </div>

        {formTemplates.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <ClipboardList size={24} className="text-on-surface-variant/30" />
            <p className="text-xs text-on-surface-variant">
              Creá un autorregistro para que tu paciente lo complete.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {formTemplates.map((template) => (
              <Link
                key={template.id}
                href={`/terapeuta/pacientes/${patient.id}/formularios/${template.id}`}
              >
                <div className="flex items-center gap-3 py-2 rounded-xl hover:bg-surface-container-high transition-colors px-2 -mx-2">
                  <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <ClipboardList size={14} className="text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">
                      {template.title}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {template.submissionCount}{" "}
                      {template.submissionCount === 1 ? "respuesta" : "respuestas"}
                      {!template.is_active && " · Inactivo"}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-on-surface-variant/40" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
