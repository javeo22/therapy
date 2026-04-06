export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: "therapist" | "patient";
          full_name: string;
          created_at: string;
          consent_given_at: string | null;
          avatar_url: string | null;
        };
        Insert: {
          id: string;
          role: "therapist" | "patient";
          full_name: string;
          created_at?: string;
          consent_given_at?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          id?: string;
          role?: "therapist" | "patient";
          full_name?: string;
          created_at?: string;
          consent_given_at?: string | null;
          avatar_url?: string | null;
        };
      };
      patient_records: {
        Row: {
          id: string;
          therapist_id: string;
          patient_id: string | null;
          full_name: string;
          invite_token: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          therapist_id: string;
          patient_id?: string | null;
          full_name: string;
          invite_token?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          therapist_id?: string;
          patient_id?: string | null;
          full_name?: string;
          invite_token?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          patient_record_id: string;
          session_date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_record_id: string;
          session_date?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_record_id?: string;
          session_date?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      metrics: {
        Row: {
          id: string;
          patient_record_id: string;
          name: string;
          description: string | null;
          min_value: number;
          max_value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_record_id: string;
          name: string;
          description?: string | null;
          min_value?: number;
          max_value?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_record_id?: string;
          name?: string;
          description?: string | null;
          min_value?: number;
          max_value?: number;
          created_at?: string;
        };
      };
      metric_values: {
        Row: {
          id: string;
          session_id: string;
          metric_id: string;
          value: number;
          recorded_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          metric_id: string;
          value: number;
          recorded_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          metric_id?: string;
          value?: number;
          recorded_at?: string;
        };
      };
      form_templates: {
        Row: {
          id: string;
          therapist_id: string;
          patient_record_id: string;
          title: string;
          description: string | null;
          frequency: "once" | "daily" | "weekly" | "biweekly" | "session";
          instructions: string | null;
          fields: Json;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          therapist_id: string;
          patient_record_id: string;
          title: string;
          description?: string | null;
          frequency?: "once" | "daily" | "weekly" | "biweekly" | "session";
          instructions?: string | null;
          fields?: Json;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          therapist_id?: string;
          patient_record_id?: string;
          title?: string;
          description?: string | null;
          frequency?: "once" | "daily" | "weekly" | "biweekly" | "session";
          instructions?: string | null;
          fields?: Json;
          is_active?: boolean;
          created_at?: string;
        };
      };
      form_submissions: {
        Row: {
          id: string;
          form_template_id: string;
          patient_id: string;
          responses: Json;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          form_template_id: string;
          patient_id: string;
          responses?: Json;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          form_template_id?: string;
          patient_id?: string;
          responses?: Json;
          submitted_at?: string;
        };
      };
      assignments: {
        Row: {
          id: string;
          patient_record_id: string;
          therapist_id: string;
          title: string;
          description: string | null;
          due_date: string | null;
          is_completed: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_record_id: string;
          therapist_id: string;
          title: string;
          description?: string | null;
          due_date?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_record_id?: string;
          therapist_id?: string;
          title?: string;
          description?: string | null;
          due_date?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
};

// Convenience aliases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type PatientRecord = Database["public"]["Tables"]["patient_records"]["Row"];
export type Session = Database["public"]["Tables"]["sessions"]["Row"];
export type Metric = Database["public"]["Tables"]["metrics"]["Row"];
export type MetricValue = Database["public"]["Tables"]["metric_values"]["Row"];
export type FormTemplate = Database["public"]["Tables"]["form_templates"]["Row"];
export type FormSubmission = Database["public"]["Tables"]["form_submissions"]["Row"];
export type Assignment = Database["public"]["Tables"]["assignments"]["Row"];
