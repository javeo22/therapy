"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FormRenderer } from "@/components/shared/form-renderer";
import {
  type FormField,
  type FormFieldType,
  FIELD_TYPE_LABELS,
  createEmptyField,
} from "@/lib/types/forms";
import { formTemplateSchema } from "@/lib/utils/form-validation";
import { createTemplate } from "@/lib/actions/form-templates";
import { FORM_PRESETS } from "@/lib/data/form-presets";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";
import {
  Plus,
  Trash2,
  BookOpen,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Eye,
  Pencil,
} from "lucide-react";

interface FormBuilderProps {
  patientRecordId: string;
}

export function FormBuilder({ patientRecordId }: FormBuilderProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<"once" | "daily" | "weekly" | "biweekly" | "session">("once");
  const [instructions, setInstructions] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showFieldMenu, setShowFieldMenu] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  function applyPreset(presetId: string) {
    const preset = FORM_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    // Regenerate IDs so each use is unique
    const newFields = preset.fields.map((f) => ({ ...f, id: crypto.randomUUID() }));
    setTitle(preset.name);
    setDescription(preset.description);
    setFrequency(preset.frequency);
    setInstructions(preset.instructions);
    setFields(newFields);
    setShowPresets(false);
  }

  function addField(type: FormFieldType) {
    const field = createEmptyField(type);
    setFields((prev) => [...prev, field]);
    setShowFieldMenu(false);
    setEditingFieldId(field.id);
  }

  function removeField(id: string) {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (editingFieldId === id) setEditingFieldId(null);
  }

  function moveField(index: number, direction: "up" | "down") {
    const newFields = [...fields];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newFields.length) return;
    [newFields[index], newFields[targetIndex]] = [newFields[targetIndex], newFields[index]];
    setFields(newFields);
  }

  function updateField(id: string, updates: Partial<FormField>) {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } as FormField : f))
    );
  }

  function updateFieldOption(fieldId: string, optionIndex: number, value: string) {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== fieldId) return f;
        if ("options" in f) {
          const newOptions = [...f.options];
          newOptions[optionIndex] = value;
          return { ...f, options: newOptions } as FormField;
        }
        return f;
      })
    );
  }

  function addFieldOption(fieldId: string) {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== fieldId) return f;
        if ("options" in f) {
          return { ...f, options: [...f.options, ""] } as FormField;
        }
        return f;
      })
    );
  }

  function removeFieldOption(fieldId: string, optionIndex: number) {
    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== fieldId) return f;
        if ("options" in f && f.options.length > 1) {
          return { ...f, options: f.options.filter((_, i) => i !== optionIndex) } as FormField;
        }
        return f;
      })
    );
  }

  async function handleSubmit() {
    setErrors({});

    const result = formTemplateSchema.safeParse({ title, fields });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".");
        fieldErrors[key] = issue.message;
      }
      if (!title.trim()) fieldErrors.title = "El título es requerido";
      if (fields.length === 0) fieldErrors.fields = "Agregá al menos un campo";
      // Check for empty labels
      fields.forEach((f, i) => {
        if (!f.label.trim()) fieldErrors[`field_${i}_label`] = "La etiqueta es requerida";
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    const res = await createTemplate(patientRecordId, title, fields, {
      description,
      frequency,
      instructions,
    });

    setLoading(false);

    if (res.error) {
      setErrors({ submit: res.error });
      return;
    }

    toast("Autorregistro creado");
    router.push(`/terapeuta/pacientes/${patientRecordId}`);
    router.refresh();
  }

  // Mobile-only full preview mode
  if (showPreview) {
    return (
      <div className="flex flex-col gap-4 lg:hidden">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-on-surface">
            Vista previa
          </h3>
          <Button size="sm" variant="ghost" onClick={() => setShowPreview(false)}>
            <Pencil size={14} /> Editar
          </Button>
        </div>
        <Card variant="elevated">
          <h4 className="font-semibold text-on-surface mb-4">{title || "Sin título"}</h4>
          <FormRenderer
            fields={fields}
            responses={{}}
            onChange={() => {}}
            disabled
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {/* Left: builder */}
    <div className="flex flex-col gap-4">
      {/* Preset selector */}
      {fields.length === 0 && !showPresets && (
        <button
          onClick={() => setShowPresets(true)}
          className="flex items-center justify-center gap-2 py-3 rounded-3xl bg-tertiary/5 text-sm text-tertiary font-medium hover:bg-tertiary/10 transition-colors"
        >
          <BookOpen size={16} /> Usar plantilla basada en evidencia
        </button>
      )}

      {showPresets && (
        <Card variant="elevated">
          <h3 className="text-sm font-semibold text-on-surface mb-3">
            Plantillas basadas en evidencia
          </h3>
          <div className="flex flex-col gap-1.5">
            {FORM_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset.id)}
                className="text-left px-3 py-2.5 rounded-xl hover:bg-surface-container-high transition-colors"
              >
                <p className="text-sm font-medium text-on-surface">{preset.name}</p>
                <p className="text-xs text-on-surface-variant">{preset.model} · {preset.fields.length} campos</p>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowPresets(false)}
            className="text-xs text-on-surface-variant mt-2"
          >
            Crear desde cero
          </button>
        </Card>
      )}

      {/* Title + scheduling */}
      <Card variant="elevated">
        <div className="flex flex-col gap-3">
          <Input
            label="Título del formulario"
            placeholder="Ej: Registro diario de emociones"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
          />
          <Input
            label="Descripción para el paciente (opcional)"
            placeholder="Ej: Registro para identificar patrones de pensamiento"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-on-surface-variant">
              Frecuencia
            </label>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as typeof frequency)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-highest text-on-surface border-b-2 border-transparent focus:bg-white focus:border-primary/40 focus:outline-none transition-all duration-300 ease-out"
            >
              <option value="once">Una vez</option>
              <option value="daily">Diario</option>
              <option value="weekly">Semanal</option>
              <option value="biweekly">Quincenal</option>
              <option value="session">Antes de cada sesión</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-on-surface-variant">
              Instrucciones para el paciente (opcional)
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={2}
              placeholder="Ej: Completá este registro cada noche antes de dormir..."
              className="w-full px-4 py-3 rounded-xl bg-surface-container-highest text-on-surface placeholder:text-on-surface-variant/50 border-b-2 border-transparent focus:bg-white focus:border-primary/40 focus:outline-none transition-all duration-300 ease-out resize-none"
            />
          </div>
        </div>
      </Card>

      {/* Fields */}
      {fields.map((field, index) => {
        const isEditing = editingFieldId === field.id;

        return (
          <Card key={field.id} variant="elevated" className="relative">
            {/* Field header */}
            <div className="flex items-center gap-2 mb-3">
              <GripVertical size={14} className="text-on-surface-variant/40" />
              <span className="text-[10px] font-medium text-tertiary bg-tertiary/10 px-2 py-0.5 rounded-full">
                {FIELD_TYPE_LABELS[field.type]}
              </span>
              <span className="flex-1 text-sm font-medium text-on-surface truncate">
                {field.label || "Sin etiqueta"}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => moveField(index, "up")}
                  disabled={index === 0}
                  className="p-1 text-on-surface-variant/40 hover:text-on-surface disabled:opacity-30"
                >
                  <ChevronUp size={14} />
                </button>
                <button
                  onClick={() => moveField(index, "down")}
                  disabled={index === fields.length - 1}
                  className="p-1 text-on-surface-variant/40 hover:text-on-surface disabled:opacity-30"
                >
                  <ChevronDown size={14} />
                </button>
                <button
                  onClick={() => setEditingFieldId(isEditing ? null : field.id)}
                  className="p-1 text-on-surface-variant/40 hover:text-on-surface"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => removeField(field.id)}
                  className="p-1 text-error/60 hover:text-error"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {/* Field configurator */}
            {isEditing && (
              <div className="flex flex-col gap-3 pt-3" style={{ borderTop: "1px solid var(--color-surface-container-high)" }}>
                <Input
                  label="Etiqueta"
                  placeholder="Ej: ¿Cómo te sentiste hoy?"
                  value={field.label}
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                  error={errors[`field_${index}_label`]}
                />

                {field.type === "scale" && (
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Mínimo"
                      type="number"
                      value={String(field.min)}
                      onChange={(e) => updateField(field.id, { min: parseInt(e.target.value) || 0 })}
                    />
                    <Input
                      label="Máximo"
                      type="number"
                      value={String(field.max)}
                      onChange={(e) => updateField(field.id, { max: parseInt(e.target.value) || 10 })}
                    />
                    <Input
                      label="Etiqueta mínimo (opcional)"
                      placeholder="Ej: Nada"
                      value={field.minLabel || ""}
                      onChange={(e) => updateField(field.id, { minLabel: e.target.value })}
                    />
                    <Input
                      label="Etiqueta máximo (opcional)"
                      placeholder="Ej: Mucho"
                      value={field.maxLabel || ""}
                      onChange={(e) => updateField(field.id, { maxLabel: e.target.value })}
                    />
                  </div>
                )}

                {field.type === "text" && (
                  <div className="flex flex-col gap-3">
                    <Input
                      label="Placeholder (opcional)"
                      placeholder="Texto de ayuda..."
                      value={field.placeholder || ""}
                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                    />
                    <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <input
                        type="checkbox"
                        checked={field.multiline || false}
                        onChange={(e) => updateField(field.id, { multiline: e.target.checked })}
                        className="rounded"
                      />
                      Texto multilínea
                    </label>
                  </div>
                )}

                {("options" in field && (field.type === "emotion" || field.type === "checklist" || field.type === "select")) && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-on-surface-variant">
                      Opciones
                    </label>
                    {field.options.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <Input
                          value={opt}
                          onChange={(e) => updateFieldOption(field.id, optIdx, e.target.value)}
                          placeholder={`Opción ${optIdx + 1}`}
                          className="flex-1"
                        />
                        {field.options.length > 1 && (
                          <button
                            onClick={() => removeFieldOption(field.id, optIdx)}
                            className="p-2 text-error/60 hover:text-error"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addFieldOption(field.id)}
                      className="text-xs text-tertiary font-medium flex items-center gap-1 self-start mt-1"
                    >
                      <Plus size={12} /> Agregar opción
                    </button>
                  </div>
                )}
              </div>
            )}
          </Card>
        );
      })}

      {/* Add field */}
      {showFieldMenu ? (
        <Card className="flex flex-col gap-1.5">
          <p className="text-xs font-medium text-on-surface-variant mb-1">
            Tipo de campo
          </p>
          {(Object.entries(FIELD_TYPE_LABELS) as [FormFieldType, string][]).map(
            ([type, label]) => (
              <button
                key={type}
                onClick={() => addField(type)}
                className="text-left px-3 py-2.5 rounded-xl text-sm text-on-surface hover:bg-surface-container-high transition-colors"
              >
                {label}
              </button>
            )
          )}
          <button
            onClick={() => setShowFieldMenu(false)}
            className="text-xs text-on-surface-variant mt-1"
          >
            Cancelar
          </button>
        </Card>
      ) : (
        <button
          onClick={() => setShowFieldMenu(true)}
          className="flex items-center justify-center gap-2 py-3 rounded-3xl border-2 border-dashed border-on-surface-variant/20 text-sm text-on-surface-variant hover:border-primary/40 hover:text-primary transition-colors"
        >
          <Plus size={16} /> Agregar campo
        </button>
      )}

      {errors.fields && (
        <p className="text-sm text-error font-medium">{errors.fields}</p>
      )}
      {errors.submit && (
        <p className="text-sm text-error font-medium">{errors.submit}</p>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        {fields.length > 0 && (
          <Button
            variant="secondary"
            onClick={() => setShowPreview(true)}
            className="gap-1 lg:hidden"
          >
            <Eye size={14} /> Vista previa
          </Button>
        )}
        <Button
          onClick={handleSubmit}
          loading={loading}
          className="flex-1"
          disabled={fields.length === 0}
        >
          Guardar formulario
        </Button>
      </div>
    </div>{/* End left: builder */}

    {/* Right: live preview — desktop only */}
    <div className="hidden lg:block">
      <div className="sticky top-6">
        <h3 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-1.5">
          <Eye size={14} className="text-on-surface-variant" />
          Vista previa
        </h3>
        <Card variant="elevated">
          <h4 className="font-semibold text-on-surface mb-4">
            {title || "Sin título"}
          </h4>
          {fields.length === 0 ? (
            <p className="text-xs text-on-surface-variant text-center py-8">
              Agregá campos para ver la vista previa.
            </p>
          ) : (
            <FormRenderer
              fields={fields}
              responses={{}}
              onChange={() => {}}
              disabled
            />
          )}
        </Card>
      </div>
    </div>

    </div>
  );
}
