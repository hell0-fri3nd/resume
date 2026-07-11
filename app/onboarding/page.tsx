import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import OnboardingForm from './onboarding-form';

/**
 * Server-guarded onboarding step. Sends signed-out users to login and
 * already-onboarded users straight to the dashboard, so this page only renders
 * for first-time users who still need to provide their name.
 */
export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
    select: { onboardedAt: true },
  });
  if (profile?.onboardedAt) redirect('/dashboard');

  // Pre-fill from the Google profile when available.
  const meta = user.user_metadata ?? {};
  const suggestedName: string = meta.full_name || meta.name || '';

  return <OnboardingForm defaultName={suggestedName} />;
}
