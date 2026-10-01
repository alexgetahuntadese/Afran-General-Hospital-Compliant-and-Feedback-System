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
    .select('role')
    .eq('id', authData.user.id)
    .maybeSingle();
  if (requesterError) return json({ error: requesterError.message }, 500);
  if (requester?.role !== 'superadmin') return json({ error: 'Only superadmins can create staff accounts.' }, 403);

  const body = await request.json().catch(() => null) as {
    username?: unknown;
    fullName?: unknown;
    password?: unknown;
    role?: unknown;
    department?: unknown;
  } | null;
  const username = typeof body?.username === 'string' ? body.username.trim().toLowerCase() : '';
  const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const role = typeof body?.role === 'string' ? body.role : '';
  const department = typeof body?.department === 'string' ? body.department.trim() : null;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username) || !fullName || password.length < 12 || !allowedRoles.has(role)) {
    return json({ error: 'Provide a username, full name, password of at least 12 characters, and staff role.' }, 400);
  }
  if (role === 'department_head' && !department) {
    return json({ error: 'Department heads require a department.' }, 400);
  }

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email: username,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });
  if (createError || !created.user) return json({ error: createError?.message ?? 'Unable to create the Auth user.' }, 400);

  const { error: profileError } = await admin.from('staff_profiles').insert({
    id: created.user.id,
    email: username,
    username,
    full_name: fullName,
    role,
    department: role === 'department_head' ? department : null,
  });
  if (profileError) {
    const { error: rollbackError } = await admin.auth.admin.deleteUser(created.user.id);
    if (rollbackError) {
      return json({ error: `${profileError.message} Auth-user rollback failed: ${rollbackError.message}` }, 500);
    }
    return json({ error: profileError.message }, 400);
  }

  return json({ ok: true });
});
