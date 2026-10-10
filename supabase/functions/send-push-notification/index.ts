import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

interface NotificationPayload {
  title: string;
  body: string;
  caseReference?: string;
}

serve(async (req) => {
  try {
    const { caseReference, title, body }: NotificationPayload = await req.json();

    if (!caseReference || !title || !body) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: caseReference, title, body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get device tokens for this case
    const deviceTokensResult = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/rest/v1/device_tokens?case_reference=eq.${caseReference}&select=*`,
      {
        headers: {
          'apikey': Deno.env.get('SUPABASE_ANON_KEY') || '',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY') || ''}`,
        },
      }
    );

    if (!deviceTokensResult.ok) {
      throw new Error('Failed to fetch device tokens');
    }

    const deviceTokens = await deviceTokensResult.json();
    
    if (!deviceTokens || deviceTokens.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No device tokens found for this case' }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Send FCM notification
    const fcmResponse = await fetch('https://fcm.googleapis.com/v1/projects/' + Deno.env.get('FIREBASE_PROJECT_ID') + '/messages:send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAccessToken()}`,
      },
      body: JSON.stringify({
        message: {
          token: deviceTokens[0].token,
          notification: {
            title,
            body,
          },
          data: {
            caseReference,
          },
        },
      }),
    });

    if (!fcmResponse.ok) {
      const error = await fcmResponse.text();
      throw new Error(`FCM error: ${error}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notification sent successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

async function getAccessToken(): Promise<string> {
  const response = await fetch(
    `https://oauth2.googleapis.com/token`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: await generateJWT(),
      }),
    }
  );

  const data = await response.json();
  return data.access_token;
}

async function generateJWT(): Promise<string> {
  // This is a simplified version. In production, you should use a proper JWT library
  // For now, this assumes you have a service account key configured
  const serviceAccountKey = JSON.parse(Deno.env.get('FIREBASE_SERVICE_ACCOUNT_KEY') || '{}');
  
  // You'll need to implement proper JWT signing here
  // This is a placeholder - in production use a library like jose or similar
  throw new Error('JWT generation not implemented - requires proper Firebase service account setup');
}
