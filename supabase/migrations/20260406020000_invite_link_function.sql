-- 002_invite_link_function.sql
-- Security definer function to link a patient to a therapist via invite token.
-- This bypasses RLS because the patient can't update patient_records directly
-- (only therapists have write access via RLS).

create or replace function public.claim_invite_token(
  p_invite_token text,
  p_patient_id uuid
)
returns void
language plpgsql
security definer set search_path = ''
as $$
begin
  update public.patient_records
  set patient_id = p_patient_id,
      invite_token = null
  where invite_token = p_invite_token
    and patient_id is null;

  if not found then
    raise exception 'Token de invitación inválido o ya utilizado.';
  end if;
end;
$$;

-- Grant execute to authenticated users only
grant execute on function public.claim_invite_token(text, uuid) to authenticated;
