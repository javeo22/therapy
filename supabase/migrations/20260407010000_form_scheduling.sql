-- Add scheduling and instructions to form templates
-- Enables frequency-based autorregistro compliance tracking

alter table public.form_templates
  add column description text,
  add column frequency text check (frequency in ('once', 'daily', 'weekly', 'biweekly', 'session')) default 'once',
  add column instructions text;
