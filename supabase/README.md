# Supabase setup

## Configure the app

1. Copy `.env.example` to `.env`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the Supabase project's API settings. The anon/publishable key is intended for browser use; never use the service-role key in this app.
3. In Supabase Auth, enable email OTP/magic-link sign-in, turn off public sign-ups, set the local Site URL to `http://localhost:3000`, and add the deployed app URL to the allowed redirect URLs. Configure the hospital's SMTP sender for reliable delivery to assigned work emails.
4. Run [`migrations/20261001120000_create_feedback_access.sql`](./migrations/20261001120000_create_feedback_access.sql), [`migrations/20261001155900_allow_multiple_customer_service_managers.sql`](./migrations/20261001155900_allow_multiple_customer_service_managers.sql), [`migrations/20261001194000_department_questionnaire_responses.sql`](./migrations/20261001194000_department_questionnaire_responses.sql), [`migrations/20261001202000_private_complaint_audio.sql`](./migrations/20261001202000_private_complaint_audio.sql), and [`migrations/20261001210000_superadmin_staff_administration.sql`](./migrations/20261001210000_superadmin_staff_administration.sql) in the Supabase SQL Editor. They add access policies, questionnaire/audio fields and private storage, and superadmin staff-role management without deleting records.

## Department questionnaires

The combined Feedback option covers both suggestions and compliments and selects a department-specific bilingual questionnaire. Complaints do not use these questionnaires; their subject is optional, but a written description or voice recording is required. Questionnaire responses are required and saved in `feedback_cases.questionnaire_answers` as question-ID-to-rating JSON, with a version string in `questionnaire_version`. Staff can read each submitted answer in the case review modal. The public tracking RPC intentionally does not return these answers or patient contact details.

Complaint submitters can optionally record and attach up to three minutes of audio. Recordings are limited to 10 MB and stored in the private `complaint-audio` bucket. Staff receive a 15-minute signed playback link only when their case role permits access to that complaint. Apply the storage migration before enabling audio submissions in a deployed app. Browser microphone access requires HTTPS on deployed sites (localhost is permitted for development).

The attached questionnaire photos were blurry, so the digital form uses adapted questions based on the visible themes, rather than claiming to be a verbatim transcription. The survey catalog is maintained in [`../src/data/questionnaires.ts`](../src/data/questionnaires.ts). Clearly identified ED, AICU, ICU, and NICU units are available separately in the department selector.

## Provision staff

Create each staff identity in the Supabase Dashboard under **Authentication → Users → Add user** (or invite the person) using their assigned work email. Keep public sign-ups disabled; the app intentionally uses OTP only for pre-created accounts. Then run [`provision_requested_staff.sql`](./provision_requested_staff.sql) in the SQL Editor to attach profiles and roles:

- `alexgetahun@afran.com` — Alex Getahun, Superadmin.
- `tamima@afranhospital.com` — Tamima, Customer Service Manager.
- `belay@afranhospital.com` — Ato Belay, CEO.

The script is safe to rerun. It raises an error listing any requested Auth users that have not yet been created; create those identities in the dashboard, then run it again. Do not insert rows directly into `auth.users`.

Repeat with one of these role values:

- `customer_service_manager` — read all cases and the staff directory; role assignments are managed only by superadmins.
- `superadmin` — full case access and may update staff roles/departments for existing Auth profiles; cannot demote their own role or the last superadmin.
- `department_head` — set `department` to the exact department name used by the app.
- `ceo` — read-only access to escalated cases only.
- `staff` — no case access.

For example, a department head profile must include a department:

```sql
insert into public.staff_profiles (id, email, full_name, role, department)
select id, email, 'Emergency Department Head', 'department_head', 'Emergency'
from auth.users
where email = 'emergency.head@afranhospital.com';
```

Only pre-created Auth users with a matching `staff_profiles` row can sign in. Superadmins can change role and department assignments from the Staff Access screen; user accounts must still be created in Supabase Auth. The database enforces row-level security for case listing, updates, and staff-role management; public case tracking uses a database function that returns no patient contact details. Multiple customer service managers may be provisioned; the role's database policy grants them access to all cases, while CEOs can read escalated cases only.

Cases previously stored in a browser's local storage are not uploaded automatically. Export and review any records that must be retained before switching users to the Supabase-backed app.
