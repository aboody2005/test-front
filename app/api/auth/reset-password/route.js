import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY on server');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const supabaseAdmin = getAdminClient();

    // 1. Find profile by reset token
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, reset_token_expiry')
      .eq('reset_token', token)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    // 2. Check if token is expired
    const expiry = new Date(profile.reset_token_expiry);
    if (expiry < new Date()) {
      return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 });
    }

    // 3. Update password in auth.users
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(profile.id, {
      password: password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // 4. Clear reset token in profiles
    const { error: clearError } = await supabaseAdmin
      .from('profiles')
      .update({
        reset_token: null,
        reset_token_expiry: null,
      })
      .eq('id', profile.id);

    if (clearError) {
      console.error('Failed to clear reset token from profile:', clearError.message);
    }

    return NextResponse.json({ message: 'Password reset successfully' }, { status: 200 });
  } catch (err) {
    console.error('Reset password API error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
