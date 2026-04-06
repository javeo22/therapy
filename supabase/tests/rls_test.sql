-- RLS Test Script
-- Run these tests after applying migrations to verify row-level security.
-- Each test block uses set_config to simulate different authenticated users.
-- Expected results are noted in comments.

-- ============================================================
-- SETUP: Create test users and data
-- ============================================================

-- Therapist A
insert into auth.users (id, email, raw_user_meta_data)
values (
  '11111111-1111-1111-1111-111111111111',
  'therapist_a@test.com',
  '{"role": "therapist", "full_name": "Terapeuta A"}'::jsonb
);

-- Therapist B
insert into auth.users (id, email, raw_user_meta_data)
values (
  '22222222-2222-2222-2222-222222222222',
  'therapist_b@test.com',
  '{"role": "therapist", "full_name": "Terapeuta B"}'::jsonb
);

-- Patient A (linked to Therapist A)
insert into auth.users (id, email, raw_user_meta_data)
values (
  '33333333-3333-3333-3333-333333333333',
  'patient_a@test.com',
  '{"role": "patient", "full_name": "Paciente A"}'::jsonb
);

-- Patient B (linked to Therapist B)
insert into auth.users (id, email, raw_user_meta_data)
values (
  '44444444-4444-4444-4444-444444444444',
  'patient_b@test.com',
  '{"role": "patient", "full_name": "Paciente B"}'::jsonb
);

-- Note: The on_auth_user_created trigger should auto-create profiles.
-- Verify profiles exist:
select id, role, full_name from public.profiles order by created_at;
-- Expected: 4 rows

-- Create patient records
insert into public.patient_records (id, therapist_id, patient_id, full_name)
values (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  '33333333-3333-3333-3333-333333333333',
  'Paciente A'
);

insert into public.patient_records (id, therapist_id, patient_id, full_name)
values (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '22222222-2222-2222-2222-222222222222',
  '44444444-4444-4444-4444-444444444444',
  'Paciente B'
);

-- Create sessions
insert into public.sessions (id, patient_record_id, notes)
values (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Session notes for Patient A'
);

insert into public.sessions (id, patient_record_id, notes)
values (
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Session notes for Patient B'
);

-- Create metrics
insert into public.metrics (id, patient_record_id, name)
values (
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Ansiedad'
);

-- Create metric values
insert into public.metric_values (session_id, metric_id, value)
values (
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  7
);

-- ============================================================
-- TEST 1: Therapist A can see their own patients, NOT Therapist B's
-- ============================================================
set local role authenticated;
set local request.jwt.claims to '{"sub": "11111111-1111-1111-1111-111111111111"}';

select count(*) as therapist_a_patients from public.patient_records;
-- Expected: 1 (only their own patient record + invite token lookup may show others)

select count(*) as therapist_a_sessions from public.sessions;
-- Expected: 1

select count(*) as therapist_a_metrics from public.metrics;
-- Expected: 1

-- ============================================================
-- TEST 2: Therapist B cannot see Therapist A's data
-- ============================================================
set local request.jwt.claims to '{"sub": "22222222-2222-2222-2222-222222222222"}';

select count(*) as therapist_b_sessions from public.sessions;
-- Expected: 1 (only their own patient's session)

select count(*) as therapist_b_metrics from public.metrics;
-- Expected: 0 (no metrics defined for their patient)

-- ============================================================
-- TEST 3: Patient A can see their own data, NOT Patient B's
-- ============================================================
set local request.jwt.claims to '{"sub": "33333333-3333-3333-3333-333333333333"}';

select count(*) as patient_a_records from public.patient_records;
-- Expected: 1 (their own record)

select count(*) as patient_a_sessions from public.sessions;
-- Expected: 1

select count(*) as patient_a_metrics from public.metrics;
-- Expected: 1

select count(*) as patient_a_metric_values from public.metric_values;
-- Expected: 1

-- ============================================================
-- TEST 4: Patient B cannot see Patient A's data
-- ============================================================
set local request.jwt.claims to '{"sub": "44444444-4444-4444-4444-444444444444"}';

select count(*) as patient_b_sessions from public.sessions;
-- Expected: 1 (only their own)

select count(*) as patient_b_metrics from public.metrics;
-- Expected: 0

select count(*) as patient_b_metric_values from public.metric_values;
-- Expected: 0

-- ============================================================
-- TEST 5: Patient cannot insert sessions (therapist-only)
-- ============================================================
set local request.jwt.claims to '{"sub": "33333333-3333-3333-3333-333333333333"}';

-- This should fail (no insert policy for patients on sessions)
-- insert into public.sessions (patient_record_id, notes)
-- values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Patient trying to create session');
-- Expected: RLS violation

-- ============================================================
-- TEST 6: Profile isolation
-- ============================================================
set local request.jwt.claims to '{"sub": "33333333-3333-3333-3333-333333333333"}';

select count(*) as patient_a_visible_profiles from public.profiles;
-- Expected: 1 (only their own profile)

-- Reset
reset role;
reset request.jwt.claims;

-- ============================================================
-- CLEANUP
-- ============================================================
-- delete from public.metric_values;
-- delete from public.metrics;
-- delete from public.sessions;
-- delete from public.patient_records;
-- delete from public.profiles;
-- delete from auth.users where id in (
--   '11111111-1111-1111-1111-111111111111',
--   '22222222-2222-2222-2222-222222222222',
--   '33333333-3333-3333-3333-333333333333',
--   '44444444-4444-4444-4444-444444444444'
-- );
