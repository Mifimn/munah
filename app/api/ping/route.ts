import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // 1. Check missing environment variables before executing
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Missing SUPABASE_URL or SUPABASE_ANON_KEY in Vercel environment' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 2. Query the profiles table
    const { data, error } = await supabase.from('profiles').select('id').limit(1);

    // 3. Handle database/RLS errors cleanly
    if (error) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: 'active',
      timestamp: new Date().toISOString(),
      rowsReturned: data.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Unhandled Server Error' },
      { status: 500 }
    );
  }
}