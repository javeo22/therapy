// Form field discriminated union — matches JSONB stored in form_templates.fields

export type ScaleField = {
  type: "scale";
  id: string;
  label: string;
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
};

export type EmotionField = {
  type: "emotion";
  id: string;
  label: string;
  options: string[];
};

export type TextField = {
  type: "text";
  id: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
};

export type TimeBlockField = {
  type: "time_block";
  id: string;
  label: string;
  blocks: string[];
};

export type YesNoField = {
  type: "yes_no";
  id: string;
  label: string;
};

export type ChecklistField = {
  type: "checklist";
  id: string;
  label: string;
  options: string[];
};

export type SelectField = {
  type: "select";
  id: string;
  label: string;
  options: string[];
};

export type FormField =
  | ScaleField
  | EmotionField
  | TextField
  | TimeBlockField
  | YesNoField
  | ChecklistField
  | SelectField;

export type FormFieldType = FormField["type"];

// Response value types per field
export type FormResponses = Record<string, unknown>;

// Default emotion options (Costa Rican Spanish)
export const DEFAULT_EMOTIONS = [
  "Alegría",
  "Tristeza",
  "Enojo",
  "Miedo",
  "Angustia",
  "Sorpresa",
  "Asco",
  "Calma",
  "Frustración",
  "Vergüenza",
  "Culpa",
  "Esperanza",
];

// Default time blocks
export const DEFAULT_TIME_BLOCKS = [
  "Mañana",
  "Tarde",
  "Noche",
];

// Field type labels (Spanish)
export const FIELD_TYPE_LABELS: Record<FormFieldType, string> = {
  scale: "Escala numérica",
  emotion: "Selector de emociones",
  text: "Texto libre",
  time_block: "Bloque de tiempo",
  yes_no: "Sí / No",
  checklist: "Lista de opciones",
  select: "Selección única",
};

// Create a new empty field by type
export function createEmptyField(type: FormFieldType): FormField {
  const id = crypto.randomUUID();

  switch (type) {
    case "scale":
      return { type: "scale", id, label: "", min: 0, max: 10 };
    case "emotion":
      return { type: "emotion", id, label: "", options: [...DEFAULT_EMOTIONS] };
    case "text":
      return { type: "text", id, label: "", placeholder: "", multiline: false };
    case "time_block":
      return { type: "time_block", id, label: "", blocks: [...DEFAULT_TIME_BLOCKS] };
    case "yes_no":
      return { type: "yes_no", id, label: "" };
    case "checklist":
      return { type: "checklist", id, label: "", options: [""] };
    case "select":
      return { type: "select", id, label: "", options: [""] };
  }
}
