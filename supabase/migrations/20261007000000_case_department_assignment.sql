-- Route complaints to the department that should handle them without changing
-- the department selected by the person who submitted the case.
alter table public.feedback_cases
  add column if not exists assigned_department text,
  add column if not exists assigned_at timestamptz;

create index if not exists feedback_cases_assigned_department_idx
  on public.feedback_cases (assigned_department)
  where assigned_department is not null;

revoke update on public.feedback_cases from authenticated;
grant update (
  status,
  escalated,
  response,
  responded_at,
  updated_at,
  department_head_checked,
  department_head_checked_at,
  assigned_department,
  assigned_at
) on public.feedback_cases to authenticated;

drop policy if exists "Department heads can read their department" on public.feedback_cases;
create policy "Department heads can read their assigned department"
  on public.feedback_cases for select
  to authenticated
  using (
    public.current_staff_role() = 'department_head'
    and coalesce(assigned_department, department) = public.current_staff_department()
  );

drop policy if exists "Managers and department heads can update assigned cases" on public.feedback_cases;
create policy "Managers and department heads can update assigned cases"
  on public.feedback_cases for update
  to authenticated
  using (
    public.current_staff_role() = 'customer_service_manager'
    or (
      public.current_staff_role() = 'department_head'
      and coalesce(assigned_department, department) = public.current_staff_department()
    )
  )
  with check (
    public.current_staff_role() = 'customer_service_manager'
    or (
      public.current_staff_role() = 'department_head'
      and coalesce(assigned_department, department) = public.current_staff_department()
    )
  );

-- Keep complaint audio access aligned with the assigned department.
drop policy if exists "Assigned staff can listen to complaint recordings" on storage.objects;
create policy "Assigned staff can listen to complaint recordings"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'complaint-audio'
    and exists (
      select 1
      from public.feedback_cases as cases
      where cases.reference = split_part(storage.objects.name, '/', 1)
        and cases.audio_path = storage.objects.name
        and cases.kind = 'complaint'
        and (
          public.current_staff_role() in ('superadmin', 'customer_service_manager')
          or (
            public.current_staff_role() = 'department_head'
            and coalesce(cases.assigned_department, cases.department) = public.current_staff_department()
          )
          or (
            public.current_staff_role() = 'ceo'
            and cases.escalated
          )
        )
    )
  );
