# Supabase setup

## Configure the app

1. Copy `.env.example` to `.env`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the Supabase project's API settings. The anon/publishable key is intended for browser use; never use the service-role key in this app.
3. In Supabase Auth, keep public sign-ups disabled and enable password sign-in. Staff sign in with a username and password; the app does not send or use email OTP/magic links. Usernames look like email addresses (for example, `ezeden@afran.com`) and are stored in the `staff_profiles.username` column. The legacy `email` column mirrors that value for compatibility with older app versions, while Supabase Auth uses it internally as the password identity; it is not used for email delivery.
4. Run [`migrations/20261001120000_create_feedback_access.sql`](./migrations/20261001120000_create_feedback_access.sql), [`migrations/20261001155900_allow_multiple_customer_service_managers.sql`](./migrations/20261001155900_allow_multiple_customer_service_managers.sql), [`migrations/20261001194000_department_questionnaire_responses.sql`](./migrations/20261001194000_department_questionnaire_responses.sql), [`migrations/20261001202000_private_complaint_audio.sql`](./migrations/20261001202000_private_complaint_audio.sql), [`migrations/20261001210000_superadmin_staff_administration.sql`](./migrations/20261001210000_superadmin_staff_administration.sql), [`migrations/20261001213000_restrict_case_update_columns.sql`](./migrations/20261001213000_restrict_case_update_columns.sql), [`migrations/20261001214500_enforce_case_submission_integrity.sql`](./migrations/20261001214500_enforce_case_submission_integrity.sql), [`migrations/20261002002400_staff_usernames.sql`](./migrations/20261002002400_staff_usernames.sql), [`migrations/20261002003000_preserve_staff_email_column.sql`](./migrations/20261002003000_preserve_staff_email_column.sql), and [`migrations/20261002004000_manage_staff_accounts.sql`](./migrations/20261002004000_manage_staff_accounts.sql) in the Supabase SQL Editor. They add access policies, questionnaire/audio fields and private storage, superadmin staff administration, account deactivation support, database-side submission validation, and staff usernames without deleting case records.

## Create staff accounts from the app

Deploy [`functions/create-staff-account/index.ts`](./functions/create-staff-account/index.ts) as the `create-staff-account` Supabase Edge Function from the repository root. In PowerShell, replace `your-project-ref` with the project ref from your Supabase dashboard URL (the value after `/project/`):

```powershell
$projectRef = "your-project-ref"
supabase link --project-ref $projectRef
supabase functions deploy create-staff-account
supabase functions deploy manage-staff-account
```

The function checks the caller's `staff_profiles` role before using the server-side service-role key to create the password-authenticated identity and matching staff profile. Never put `SUPABASE_SERVICE_ROLE_KEY` in `.env`, browser code, or Vite variables. Once deployed, sign in with Alex's username and password, open **Staff access**, and enter the new staff member's name, username, initial password, role, and (for department heads) department. Use a password of at least 12 characters and share it securely with the staff member; the app does not email credentials. Public sign-ups stay disabled.

The `manage-staff-account` function is also restricted to active superadmins. It supports editing a staff member's name, username, role, and assigned department; resetting passwords; deactivating/reactivating; and permanently deleting accounts. The management migration adds an active flag that is checked by database authorization functions immediately. At least one active superadmin must remain, and superadmins cannot edit or remove their own account from this screen.

## Department questionnaires

The combined Feedback option covers both suggestions and compliments and selects a department-specific bilingual questionnaire. Complaints do not use these questionnaires; their subject is optional, but a written description or voice recording is required. Questionnaire responses are required and saved in `feedback_cases.questionnaire_answers` as question-ID-to-rating JSON, with a version string in `questionnaire_version`. Staff can read each submitted answer in the case review modal. The public tracking RPC intentionally does not return these answers or patient contact details.

Complaint submitters can optionally record and attach up to three minutes of audio. Recordings are limited to 10 MB and stored in the private `complaint-audio` bucket. Staff receive a 15-minute signed playback link only when their case role permits access to that complaint. Apply the storage migration before enabling audio submissions in a deployed app. Browser microphone access requires HTTPS on deployed sites (localhost is permitted for development).

The attached questionnaire photos were blurry, so the digital form uses adapted questions based on the visible themes, rather than claiming to be a verbatim transcription. The survey catalog is maintained in [`../src/data/questionnaires.ts`](../src/data/questionnaires.ts). Clearly identified ED, AICU, ICU, and NICU units are available separately in the department selector.

## Provision staff

For the initial superadmin bootstrap, create Alex's identity in the Supabase Dashboard under **Authentication → Users → Add user**, using Alex's username as the email-shaped login ID and setting a password (do not send an invite), then run [`provision_alex_admin.sql`](./provision_alex_admin.sql) in the SQL Editor to attach the superadmin profile:

- `alexgetahuntadese@gmail.com` — Alex Getahun Tadesse, Superadmin.

The script is safe to rerun and requires Alex's Auth identity to exist first. Set a password for Alex's existing account in the Supabase Dashboard if it does not already have one. Do not insert rows directly into `auth.users`. After Alex is signed in as a superadmin and the Edge Function above is deployed, create all additional staff accounts from **Staff access** in the app; no dashboard or SQL steps are needed for those accounts.

Repeat with one of these role values:

- `customer_service_manager` — read all cases and the staff directory; role assignments are managed only by superadmins.
- `superadmin` — full case access and may update staff roles/departments for existing Auth profiles; cannot demote their own role or the last superadmin.
- `department_head` — set `department` to the exact department name used by the app.
- `ceo` — read-only access to escalated cases only.
- `staff` — no case access.

For example, a department head profile must include a department:

```sql
insert into public.staff_profiles (id, email, username, full_name, role, department)
select id, email, lower(email), 'Emergency Department Head', 'department_head', 'Emergency'
from auth.users
where email = 'emergency.head@afranhospital.com';
```

Only password-authenticated users with a matching `staff_profiles` row can sign in. The app creates both records for accounts created by a superadmin; usernames are used for password sign-in and no email OTP or magic link is sent. Superadmins can also change role and department assignments from the Staff Access screen. The database enforces row-level security for case listing, updates, and staff-role management; public case tracking uses a database function that returns no patient contact details. Multiple customer service managers may be provisioned; the role's database policy grants them access to all cases, while CEOs can read escalated cases only.

Cases previously stored in a browser's local storage are not uploaded automatically. Export and review any records that must be retained before switching users to the Supabase-backed app.
