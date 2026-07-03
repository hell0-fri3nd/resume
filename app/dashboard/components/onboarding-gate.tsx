'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { getMyProfile } from '@/lib/actions/profile';

/**
 * Belt-and-suspenders onboarding guard for the dashboard. The auth callback
 * already routes first-time sign-ins to /onboarding, but a user with a
 * persisted session that predates their profile (or who navigates here
 * directly) would slip past it — this catches them and redirects.
 *
 * Renders nothing.
 */
export default function OnboardingGate() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const checked = useRef<string | null>(null);

  useEffect(() => {
    if (loading || !user) return;
    // Only check once per user id.
    if (checked.current === user.id) return;
    checked.current = user.id;

    getMyProfile()
      .then((profile) => {
        if (!profile?.onboarded) router.replace('/onboarding');
      })
      .catch((err) => console.error('[onboarding-gate]', err));
  }, [user, loading, router]);

  return null;
}
