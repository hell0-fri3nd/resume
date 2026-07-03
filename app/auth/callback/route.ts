import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

/**
 * OAuth redirect target. Supabase sends the user back here with a `code` after
 * they authorise with Google; we exchange it for a session (which sets the auth
 * cookies) and then send them on to their destination.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Where to land after login; defaults to the dashboard.
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // First-time users (no completed profile) go to onboarding; returning
      // users go to their intended destination.
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let dest = next;
      if (user) {
        const profile = await prisma.profile.findUnique({
          where: { userId: user.id },
          select: { onboardedAt: true },
        });
        if (!profile?.onboardedAt) dest = '/onboarding';
      }

      // `x-forwarded-host` is set by the host (e.g. Vercel) behind a proxy.
      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${dest}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${dest}`);
      }
      return NextResponse.redirect(`${origin}${dest}`);
    }
  }

  // Auth failed — bounce back to login with a flag the page can surface.
  return NextResponse.redirect(`${origin}/login?error=auth`);
}
