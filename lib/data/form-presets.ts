import type { FormField } from "@/lib/types/forms";
import { DEFAULT_EMOTIONS } from "@/lib/types/forms";

export interface FormPreset {
  id: string;
  name: string;
  description: string;
  frequency: "once" | "daily" | "weekly" | "biweekly" | "session";
  instructions: string;
  model: string;
  fields: FormField[];
}

export const FORM_PRESETS: FormPreset[] = [
  {
    id: "thought-record-3",
    name: "Registro de pensamientos (3 columnas)",
    description: "Registro para identificar pensamientos automáticos y emociones asociadas",
    frequency: "daily",
    instructions: "Cuando notes un cambio en tu estado de ánimo, anotá la situación, el pensamiento que tuviste y la emoción que sentiste.",
    model: "TCC (Beck)",
    fields: [
      { type: "text", id: crypto.randomUUID(), label: "Situación", placeholder: "¿Qué estaba pasando?", multiline: true },
      { type: "text", id: crypto.randomUUID(), label: "Pensamiento automático", placeholder: "¿Qué pensaste en ese momento?", multiline: true },
      { type: "emotion", id: crypto.randomUUID(), label: "Emoción", options: [...DEFAULT_EMOTIONS] },
      { type: "scale", id: crypto.randomUUID(), label: "Intensidad de la emoción", min: 0, max: 10, minLabel: "Nada", maxLabel: "Muy intensa" },
    ],
  },
  {
    id: "thought-record-5",
    name: "Registro de pensamientos (5 columnas)",
    description: "Registro completo con reestructuración cognitiva",
    frequency: "daily",
    instructions: "Identificá el pensamiento, evaluá la evidencia a favor y en contra, y formulá un pensamiento alternativo más equilibrado.",
    model: "TCC (Greenberger & Padesky)",
    fields: [
      { type: "text", id: crypto.randomUUID(), label: "Situación", placeholder: "¿Qué pasó?", multiline: true },
      { type: "text", id: crypto.randomUUID(), label: "Pensamiento automático", placeholder: "¿Qué pensaste?", multiline: true },
      { type: "emotion", id: crypto.randomUUID(), label: "Emoción", options: [...DEFAULT_EMOTIONS] },
      { type: "scale", id: crypto.randomUUID(), label: "Intensidad", min: 0, max: 10 },
      { type: "text", id: crypto.randomUUID(), label: "Evidencia a favor", placeholder: "¿Qué datos apoyan este pensamiento?", multiline: true },
      { type: "text", id: crypto.randomUUID(), label: "Evidencia en contra", placeholder: "¿Qué datos contradicen este pensamiento?", multiline: true },
    ],
  },
  {
    id: "emotion-diary",
    name: "Diario emocional",
    description: "Registro diario de emociones con intensidad y contexto",
    frequency: "daily",
    instructions: "Cada noche, registrá la emoción principal del día, su intensidad y qué la provocó.",
    model: "Transdiagnóstico",
    fields: [
      { type: "emotion", id: crypto.randomUUID(), label: "Emoción principal", options: [...DEFAULT_EMOTIONS] },
      { type: "scale", id: crypto.randomUUID(), label: "Intensidad", min: 0, max: 10, minLabel: "Leve", maxLabel: "Muy intensa" },
      { type: "text", id: crypto.randomUUID(), label: "¿Qué la provocó?", placeholder: "Situación o evento...", multiline: true },
      { type: "time_block", id: crypto.randomUUID(), label: "Momento del día", blocks: ["Mañana", "Tarde", "Noche"] },
    ],
  },
  {
    id: "dbt-diary-card",
    name: "Tarjeta diario (DBT simplificada)",
    description: "Seguimiento diario de emociones, impulsos y habilidades usadas",
    frequency: "daily",
    instructions: "Completá este registro cada noche. Calificá tus emociones e impulsos del día y marcá las habilidades que usaste.",
    model: "TDC (Linehan)",
    fields: [
      { type: "scale", id: crypto.randomUUID(), label: "Tristeza", min: 0, max: 5 },
      { type: "scale", id: crypto.randomUUID(), label: "Enojo", min: 0, max: 5 },
      { type: "scale", id: crypto.randomUUID(), label: "Ansiedad", min: 0, max: 5 },
      { type: "scale", id: crypto.randomUUID(), label: "Impulsos dañinos", min: 0, max: 5, minLabel: "Ninguno", maxLabel: "Muy fuertes" },
      { type: "checklist", id: crypto.randomUUID(), label: "Habilidades usadas", options: [
        "Mindfulness",
        "Tolerancia al malestar",
        "Regulación emocional",
        "Efectividad interpersonal",
        "Respiración profunda",
        "Distracción saludable",
      ]},
      { type: "yes_no", id: crypto.randomUUID(), label: "¿Hubo autolesión?" },
    ],
  },
  {
    id: "activity-log",
    name: "Registro de actividades",
    description: "Registro de actividades con valoración de ánimo y logro",
    frequency: "daily",
    instructions: "Registrá las actividades principales del día y cómo te sentiste durante cada una.",
    model: "Activación conductual (Martell)",
    fields: [
      { type: "time_block", id: crypto.randomUUID(), label: "Momento del día", blocks: ["Mañana", "Tarde", "Noche"] },
      { type: "text", id: crypto.randomUUID(), label: "Actividad realizada", placeholder: "¿Qué hiciste?" },
      { type: "scale", id: crypto.randomUUID(), label: "Estado de ánimo", min: 0, max: 10, minLabel: "Muy bajo", maxLabel: "Muy bien" },
      { type: "scale", id: crypto.randomUUID(), label: "Sensación de logro", min: 0, max: 10, minLabel: "Nada", maxLabel: "Mucho" },
    ],
  },
  {
    id: "sleep-diary",
    name: "Diario de sueño",
    description: "Registro de calidad y patrones de sueño",
    frequency: "daily",
    instructions: "Completá este registro cada mañana al despertar.",
    model: "TCC para insomnio",
    fields: [
      { type: "text", id: crypto.randomUUID(), label: "Hora de acostarse", placeholder: "Ej: 22:30" },
      { type: "text", id: crypto.randomUUID(), label: "Hora de despertar", placeholder: "Ej: 06:45" },
      { type: "scale", id: crypto.randomUUID(), label: "Calidad del sueño", min: 1, max: 5, minLabel: "Muy mala", maxLabel: "Excelente" },
      { type: "scale", id: crypto.randomUUID(), label: "Nivel de descanso", min: 0, max: 10, minLabel: "Agotado", maxLabel: "Descansado" },
      { type: "yes_no", id: crypto.randomUUID(), label: "¿Despertaste durante la noche?" },
    ],
  },
  {
    id: "worry-record",
    name: "Registro de preocupaciones",
    description: "Seguimiento de episodios de preocupación excesiva",
    frequency: "daily",
    instructions: "Cuando sientas preocupación intensa, anotá el contenido y la intensidad.",
    model: "TAG (Borkovec)",
    fields: [
      { type: "text", id: crypto.randomUUID(), label: "Contenido de la preocupación", placeholder: "¿Qué te preocupa?", multiline: true },
      { type: "scale", id: crypto.randomUUID(), label: "Intensidad", min: 0, max: 10, minLabel: "Leve", maxLabel: "Insoportable" },
      { type: "time_block", id: crypto.randomUUID(), label: "Momento del día", blocks: ["Mañana", "Tarde", "Noche"] },
      { type: "yes_no", id: crypto.randomUUID(), label: "¿Ocurrió lo que temías?" },
    ],
  },
  {
    id: "exposure-record",
    name: "Registro de exposición",
    description: "Registro pre/post exposición a situaciones temidas",
    frequency: "session",
    instructions: "Completá este registro después de cada ejercicio de exposición.",
    model: "Terapia de exposición",
    fields: [
      { type: "text", id: crypto.randomUUID(), label: "Situación enfrentada", placeholder: "¿Qué situación enfrentaste?", multiline: true },
      { type: "scale", id: crypto.randomUUID(), label: "Ansiedad antes (SUDS)", min: 0, max: 100, minLabel: "Nada", maxLabel: "Máxima" },
      { type: "scale", id: crypto.randomUUID(), label: "Ansiedad después (SUDS)", min: 0, max: 100, minLabel: "Nada", maxLabel: "Máxima" },
      { type: "text", id: crypto.randomUUID(), label: "Observaciones", placeholder: "¿Qué aprendiste?", multiline: true },
    ],
  },
];
