import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const allowedRoles = new Set(['superadmin', 'customer_service_manager', 'department_head', 'ceo', 'staff']);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  const authorization = request.headers.get('Authorization');
  if (!supabaseUrl || !serviceRoleKey || !anonKey || !authorization) {
    return json({ error: 'The account service is not configured.' }, 500);
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: authData, error: authError } = await userClient.auth.getUser();
  if (authError || !authData.user) return json({ error: 'You must be signed in.' }, 401);

  const admin = createClient(supabaseUrl, serviceRoleKey);
  const { data: requester, error: requesterError } = await admin
    .from('staff_profiles')
    .select('role, is_active')
    .eq('id', authData.user.id)
    .maybeSingle();
  if (requesterError) return json({ error: requesterError.message }, 500);
  if (requester?.role !== 'superadmin' || !requester.is_active) {
    return json({ error: 'Only active superadmins can manage staff accounts.' }, 403);
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const action = typeof body?.action === 'string' ? body.action : '';
  const username = typeof body?.username === 'string' ? body.username.trim().toLowerCase() : '';
  if (!username) return json({ error: 'Select a staff account.' }, 400);

  const { data: target, error: targetError } = await admin
    .from('staff_profiles')
    .select('id, username, full_name, role, department, is_active')
    .eq('username', username)
    .maybeSingle();
  if (targetError) return json({ error: targetError.message }, 500);
  if (!target) return json({ error: 'Staff account not found.' }, 404);
  if (target.id === authData.user.id) return json({ error: 'You cannot manage your own superadmin account here.' }, 403);

  if (action === 'update') {
    const newUsername = typeof body?.newUsername === 'string' ? body.newUsername.trim().toLowerCase() : '';
    const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : '';
    const role = typeof body?.role === 'string' ? body.role : '';
    const department = typeof body?.department === 'string' ? body.department.trim() : null;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUsername) || !fullName || !allowedRoles.has(role)) {
      return json({ error: 'Provide a valid username, full name, and staff role.' }, 400);
    }
    if (role === 'department_head' && !department) {
      return json({ error: 'Department heads require a department.' }, 400);
    }
    if (target.role === 'superadmin' && role !== 'superadmin') {
      const { count, error } = await admin
        .from('staff_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'superadmin')
        .eq('is_active', true);
      if (error) return json({ error: error.message }, 500);
      if ((count ?? 0) <= 1) return json({ error: 'At least one active superadmin must remain.' }, 400);
    }

    const { data: authTarget, error: authTargetError } = await admin.auth.admin.getUserById(target.id);
    if (authTargetError || !authTarget.user) {
      return json({ error: authTargetError?.message ?? 'Unable to load the staff login.' }, 500);
    }
    const oldAuthEmail = authTarget.user.email;
    const { error: authUpdateError } = await admin.auth.admin.updateUserById(target.id, {
      email: newUsername,
      email_confirm: true,
    });
    if (authUpdateError) return json({ error: authUpdateError.message }, 400);

    const { error: profileUpdateError } = await admin.from('staff_profiles')
      .update({
        username: newUsername,
        email: newUsername,
        full_name: fullName,
        role,
        department: role === 'department_head' ? department : null,
      })
      .eq('id', target.id);
    if (profileUpdateError) {
      if (oldAuthEmail) {
        const { error: rollbackError } = await admin.auth.admin.updateUserById(target.id, {
          email: oldAuthEmail,
          email_confirm: true,
        });
        if (rollbackError) {
          return json({ error: `${profileUpdateError.message} Login rollback failed: ${rollbackError.message}` }, 500);
        }
      }
      return json({ error: profileUpdateError.message }, 400);
    }
    return json({ ok: true });
  }

  if (action === 'reset_password') {
    const password = typeof body?.password === 'string' ? body.password : '';
    if (password.length < 12) return json({ error: 'Password must be at least 12 characters.' }, 400);
    const { error: passwordError } = await admin.auth.admin.updateUserById(target.id, { password });
    if (passwordError) return json({ error: passwordError.message }, 400);
    const { error: sessionError } = await admin.auth.admin.signOut(target.id, 'global');
    if (sessionError) {
      return json({ error: `Password updated, but existing sessions could not be revoked: ${sessionError.message}` }, 500);
    }
    return json({ ok: true });
  }

  if (action === 'set_active') {
    const isActive = body?.isActive;
    if (typeof isActive !== 'boolean') return json({ error: 'Choose whether this account is active.' }, 400);
    if (!isActive && target.role === 'superadmin') {
      const { count, error } = await admin
        .from('staff_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'superadmin')
        .eq('is_active', true);
      if (error) return json({ error: error.message }, 500);
      if ((count ?? 0) <= 1) return json({ error: 'At least one active superadmin must remain.' }, 400);
    }
    const { error } = await admin.from('staff_profiles')
      .update({ is_active: isActive })
      .eq('id', target.id);
    if (error) return json({ error: error.message }, 400);
    if (!isActive) {
      const { error: sessionError } = await admin.auth.admin.signOut(target.id, 'global');
      if (sessionError) {
        return json({ error: `Account deactivated, but existing sessions could not be revoked: ${sessionError.message}` }, 500);
      }
    }
    return json({ ok: true });
  }

  if (action === 'delete') {
    if (target.role === 'superadmin') {
      const { count, error } = await admin
        .from('staff_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('role', 'superadmin')
        .eq('is_active', true);
      if (error) return json({ error: error.message }, 500);
      if (target.is_active && (count ?? 0) <= 1) {
        return json({ error: 'At least one active superadmin must remain.' }, 400);
      }
    }
    const { error } = await admin.auth.admin.deleteUser(target.id);
    if (error) return json({ error: error.message }, 400);
    return json({ ok: true });
  }

  return json({ error: 'Unsupported staff account action.' }, 400);
});
