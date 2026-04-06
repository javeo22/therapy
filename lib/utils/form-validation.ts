import { z } from "zod";
import type { FormField } from "@/lib/types/forms";

// ── Field schemas ──

const scaleFieldSchema = z.object({
  type: z.literal("scale"),
  id: z.string().min(1),
  label: z.string().min(1, "La etiqueta es requerida"),
  min: z.number().int(),
  max: z.number().int(),
  minLabel: z.string().optional(),
  maxLabel: z.string().optional(),
});

const emotionFieldSchema = z.object({
  type: z.literal("emotion"),
  id: z.string().min(1),
  label: z.string().min(1, "La etiqueta es requerida"),
  options: z.array(z.string().min(1)).min(2, "Al menos 2 opciones"),
});

const textFieldSchema = z.object({
  type: z.literal("text"),
  id: z.string().min(1),
  label: z.string().min(1, "La etiqueta es requerida"),
  placeholder: z.string().optional(),
  multiline: z.boolean().optional(),
});

const timeBlockFieldSchema = z.object({
  type: z.literal("time_block"),
  id: z.string().min(1),
  label: z.string().min(1, "La etiqueta es requerida"),
  blocks: z.array(z.string().min(1)).min(1, "Al menos 1 bloque"),
});

const yesNoFieldSchema = z.object({
  type: z.literal("yes_no"),
  id: z.string().min(1),
  label: z.string().min(1, "La etiqueta es requerida"),
});

const checklistFieldSchema = z.object({
  type: z.literal("checklist"),
  id: z.string().min(1),
  label: z.string().min(1, "La etiqueta es requerida"),
  options: z.array(z.string().min(1)).min(1, "Al menos 1 opción"),
});

const selectFieldSchema = z.object({
  type: z.literal("select"),
  id: z.string().min(1),
  label: z.string().min(1, "La etiqueta es requerida"),
  options: z.array(z.string().min(1)).min(2, "Al menos 2 opciones"),
});

export const formFieldSchema = z.discriminatedUnion("type", [
  scaleFieldSchema,
  emotionFieldSchema,
  textFieldSchema,
  timeBlockFieldSchema,
  yesNoFieldSchema,
  checklistFieldSchema,
  selectFieldSchema,
]);

// ── Template schema ──

export const formTemplateSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  fields: z.array(formFieldSchema).min(1, "Agregá al menos un campo"),
});

// ── Submission validation ──

export function validateSubmission(
  fields: FormField[],
  responses: Record<string, unknown>
): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = responses[field.id];

    switch (field.type) {
      case "scale": {
        if (value === undefined || value === null) {
          errors[field.id] = "Seleccioná un valor";
          break;
        }
        const num = Number(value);
        if (isNaN(num) || num < field.min || num > field.max) {
          errors[field.id] = `El valor debe estar entre ${field.min} y ${field.max}`;
        }
        break;
      }
      case "emotion": {
        if (!value || typeof value !== "string") {
          errors[field.id] = "Seleccioná una emoción";
        }
        break;
      }
      case "text": {
        if (!value || (typeof value === "string" && !value.trim())) {
          errors[field.id] = "Este campo es requerido";
        }
        break;
      }
      case "time_block": {
        if (!value || typeof value !== "string") {
          errors[field.id] = "Seleccioná un bloque de tiempo";
        }
        break;
      }
      case "yes_no": {
        if (value === undefined || value === null) {
          errors[field.id] = "Seleccioná una opción";
        }
        break;
      }
      case "checklist": {
        if (!Array.isArray(value) || value.length === 0) {
          errors[field.id] = "Seleccioná al menos una opción";
        }
        break;
      }
      case "select": {
        if (!value || typeof value !== "string") {
          errors[field.id] = "Seleccioná una opción";
        }
        break;
      }
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
