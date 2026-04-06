import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Create an unmodified response
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Initialize the Supabase Server Client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Check if the user is logged in
  const { data: { user } } = await supabase.auth.getUser();

  // Protect Admin Routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // If it's the admin login page, let them see it
    if (request.nextUrl.pathname === '/admin/login') {
      return supabaseResponse;
    }

    // If they are not logged in at all, kick them to login
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If they are logged in, check if they are an admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single();

    // If not an admin, kick them to the customer home page
    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return supabaseResponse;
}

// Tell the middleware which routes to protect
export const config = {
  matcher: ['/admin/:path*'],
};
