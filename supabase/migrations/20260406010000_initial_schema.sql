-- 001_initial_schema.sql
-- Therapy app: all tables, indexes, RLS policies, and triggers
-- Tables created first, then RLS policies (to avoid circular references)

-- ============================================================
-- 1. CREATE ALL TABLES
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null check (role in ('therapist', 'patient')),
  full_name text not null,
  created_at timestamptz not null default now()
);

create table public.patient_records (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references public.profiles(id) on delete cascade,
  patient_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  invite_token text unique default encode(gen_random_bytes(32), 'hex'),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  patient_record_id uuid not null references public.patient_records(id) on delete cascade,
  session_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create table public.metrics (
  id uuid primary key default gen_random_uuid(),
  patient_record_id uuid not null references public.patient_records(id) on delete cascade,
  name text not null,
  description text,
  min_value integer not null default 0,
  max_value integer not null default 10,
  created_at timestamptz not null default now()
);

create table public.metric_values (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  metric_id uuid not null references public.metrics(id) on delete cascade,
  value integer not null,
  recorded_at timestamptz not null default now()
);

create table public.form_templates (
  id uuid primary key default gen_random_uuid(),
  therapist_id uuid not null references public.profiles(id) on delete cascade,
  patient_record_id uuid not null references public.patient_records(id) on delete cascade,
  title text not null,
  fields jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_template_id uuid not null references public.form_templates(id) on delete cascade,
  patient_id uuid not null references public.profiles(id) on delete cascade,
  responses jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now()
);

-- ============================================================
-- 2. INDEXES
-- ============================================================

create index idx_patient_records_therapist on public.patient_records(therapist_id);
create index idx_patient_records_patient on public.patient_records(patient_id);
create index idx_patient_records_invite on public.patient_records(invite_token) where invite_token is not null;
create index idx_sessions_patient_record on public.sessions(patient_record_id);
create index idx_metrics_patient_record on public.metrics(patient_record_id);
create index idx_metric_values_session on public.metric_values(session_id);
create index idx_metric_values_metric on public.metric_values(metric_id);
create index idx_form_templates_therapist on public.form_templates(therapist_id);
create index idx_form_templates_patient_record on public.form_templates(patient_record_id);
create index idx_form_submissions_template on public.form_submissions(form_template_id);
create index idx_form_submissions_patient on public.form_submissions(patient_id);

-- ============================================================
-- 3. ENABLE RLS ON ALL TABLES
-- ============================================================

alter table public.profiles enable row level security;
alter table public.patient_records enable row level security;
alter table public.sessions enable row level security;
alter table public.metrics enable row level security;
alter table public.metric_values enable row level security;
alter table public.form_templates enable row level security;
alter table public.form_submissions enable row level security;

-- ============================================================
-- 4. RLS POLICIES
-- ============================================================

-- PROFILES
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Therapists can read their patients profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.patient_records pr
      where pr.therapist_id = auth.uid()
        and pr.patient_id = profiles.id
    )
  );

-- PATIENT RECORDS
create policy "Therapists manage own patient records"
  on public.patient_records for all
  using (therapist_id = auth.uid());

create policy "Patients read own record"
  on public.patient_records for select
  using (patient_id = auth.uid());

create policy "Invite token lookup"
  on public.patient_records for select
  using (invite_token is not null);

-- SESSIONS
create policy "Therapists manage sessions"
  on public.sessions for all
  using (
    exists (
      select 1 from public.patient_records pr
      where pr.id = sessions.patient_record_id
        and pr.therapist_id = auth.uid()
    )
  );

create policy "Patients read own sessions"
  on public.sessions for select
  using (
    exists (
      select 1 from public.patient_records pr
      where pr.id = sessions.patient_record_id
        and pr.patient_id = auth.uid()
    )
  );

-- METRICS
create policy "Therapists manage metrics"
  on public.metrics for all
  using (
    exists (
      select 1 from public.patient_records pr
      where pr.id = metrics.patient_record_id
        and pr.therapist_id = auth.uid()
    )
  );

create policy "Patients read own metrics"
  on public.metrics for select
  using (
    exists (
      select 1 from public.patient_records pr
      where pr.id = metrics.patient_record_id
        and pr.patient_id = auth.uid()
    )
  );

-- METRIC VALUES
create policy "Therapists manage metric values"
  on public.metric_values for all
  using (
    exists (
      select 1 from public.sessions s
      join public.patient_records pr on pr.id = s.patient_record_id
      where s.id = metric_values.session_id
        and pr.therapist_id = auth.uid()
    )
  );

create policy "Patients read own metric values"
  on public.metric_values for select
  using (
    exists (
      select 1 from public.sessions s
      join public.patient_records pr on pr.id = s.patient_record_id
      where s.id = metric_values.session_id
        and pr.patient_id = auth.uid()
    )
  );

-- FORM TEMPLATES
create policy "Therapists manage form templates"
  on public.form_templates for all
  using (therapist_id = auth.uid());

create policy "Patients read own form templates"
  on public.form_templates for select
  using (
    exists (
      select 1 from public.patient_records pr
      where pr.id = form_templates.patient_record_id
        and pr.patient_id = auth.uid()
    )
    and is_active = true
  );

-- FORM SUBMISSIONS
create policy "Patients submit forms"
  on public.form_submissions for insert
  with check (patient_id = auth.uid());

create policy "Patients read own submissions"
  on public.form_submissions for select
  using (patient_id = auth.uid());

create policy "Therapists read submissions"
  on public.form_submissions for select
  using (
    exists (
      select 1 from public.form_templates ft
      where ft.id = form_submissions.form_template_id
        and ft.therapist_id = auth.uid()
    )
  );

-- ============================================================
-- 5. TRIGGER: Auto-create profile on signup
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'role', 'patient'),
    coalesce(new.raw_user_meta_data ->> 'full_name', '')
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
