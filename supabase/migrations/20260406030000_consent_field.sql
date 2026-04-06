-- 003_consent_field.sql
-- Add consent_given_at to profiles for Ley 8968 compliance

alter table public.profiles
  add column consent_given_at timestamptz;
