-- Homework/assignments system
-- Therapists assign tasks to patients with optional due dates

create table public.assignments (
  id uuid primary key default gen_random_uuid(),
  patient_record_id uuid not null references public.patient_records(id) on delete cascade,
  therapist_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  is_completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_assignments_patient_record on public.assignments(patient_record_id);
create index idx_assignments_therapist on public.assignments(therapist_id);

alter table public.assignments enable row level security;

create policy "Therapists manage assignments"
  on public.assignments for all
  using (therapist_id = auth.uid());

create policy "Patients read own assignments"
  on public.assignments for select
  using (
    exists (
      select 1 from public.patient_records pr
      where pr.id = assignments.patient_record_id
        and pr.patient_id = auth.uid()
    )
  );

create policy "Patients update own assignments"
  on public.assignments for update
  using (
    exists (
      select 1 from public.patient_records pr
      where pr.id = assignments.patient_record_id
        and pr.patient_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.patient_records pr
      where pr.id = assignments.patient_record_id
        and pr.patient_id = auth.uid()
    )
  );
