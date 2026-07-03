'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export interface ProfileInfo {
  fullName: string;
  onboarded: boolean;
}

/** Resolve the signed-in user's id from the server session, or throw. */
async function requireUserId(): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

/**
 * Fetch the current user's profile. Returns null when no profile row exists yet
 * (i.e. the user has never onboarded).
 */
export async function getMyProfile(): Promise<ProfileInfo | null> {
  const userId = await requireUserId();
  const profile = await prisma.profile.findUnique({ where: { userId } });
  if (!profile) return null;
  return { fullName: profile.fullName, onboarded: profile.onboardedAt !== null };
}

/**
 * Save the user's name and mark onboarding complete. Idempotent — re-running
 * just updates the name and refreshes the timestamp.
 */
export async function completeOnboarding(
  fullName: string
): Promise<ProfileInfo> {
  const userId = await requireUserId();
  const name = fullName.trim();
  if (!name) throw new Error('Please enter your name.');

  const now = new Date();
  const profile = await prisma.profile.upsert({
    where: { userId },
    create: { userId, fullName: name, onboardedAt: now },
    update: { fullName: name, onboardedAt: now },
  });
  return { fullName: profile.fullName, onboarded: profile.onboardedAt !== null };
}
