'use server';

import type { Prisma } from '@prisma/client';
// import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import type { Resume } from '@/lib/types';
import prisma from '../prisma';

/**
 * Server-side resume sync via Prisma.
 *
 * The client sends its local resumes; we reconcile them against the signed-in
 * user's rows and return the resumes that should be written back into the local
 * store. Merge is last-write-wins per resume, keyed on `updatedAt`.
 *
 * Security: the user is resolved from the Supabase session on the server (never
 * trusted from the client), and every write is scoped to that user's id, so a
 * client cannot read or overwrite another user's resumes.
 *
 * Deletions are not propagated — a resume missing on one side is treated as new
 * on the other, so sync only ever adds/updates. This is a backup, not a mirror.
 */

export interface SyncResult {
  toStore: Resume[];
  pushed: number;
}

export async function syncResumesAction(
  local: Resume[]
): Promise<SyncResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const rows = await prisma.resume.findMany({
    where: { userId: user.id },
    select: { id: true, data: true },
  });

  const remoteById = new Map<string, Resume>(
    rows.map((r) => [r.id, r.data as unknown as Resume])
  );
  const localById = new Map(local.map((r) => [r.id, r]));

  const toStore: Resume[] = [];
  // Split pushes by whether the row already belongs to this user, so updates
  // can be ownership-scoped and creates can't collide across users.
  const toUpdate: Resume[] = [];
  const toCreate: Resume[] = [];

  const allIds = new Set([...remoteById.keys(), ...localById.keys()]);
  for (const id of allIds) {
    const localResume = localById.get(id);
    const remoteResume = remoteById.get(id);

    if (localResume && remoteResume) {
      if (remoteResume.updatedAt > localResume.updatedAt) {
        toStore.push(remoteResume);
      } else if (localResume.updatedAt > remoteResume.updatedAt) {
        toUpdate.push(localResume);
      }
    } else if (remoteResume) {
      toStore.push(remoteResume);
    } else if (localResume) {
      toCreate.push(localResume);
    }
  }

  const asJson = (r: Resume) => r as unknown as Prisma.InputJsonValue;

  if (toUpdate.length > 0 || toCreate.length > 0) {
    await prisma.$transaction([
      ...toUpdate.map((r) =>
        // Scoped by userId — updateMany won't touch another user's row even if
        // the id somehow matched.
        prisma.resume.updateMany({
          where: { id: r.id, userId: user.id },
          data: {
            name: r.name,
            data: asJson(r),
            updatedAt: new Date(r.updatedAt),
          },
        })
      ),
      ...toCreate.map((r) =>
        prisma.resume.create({
          data: {
            id: r.id,
            userId: user.id,
            name: r.name,
            data: asJson(r),
            updatedAt: new Date(r.updatedAt),
            createdAt: new Date(r.createdAt),
          },
        })
      ),
    ]);
  }

  return { toStore, pushed: toUpdate.length + toCreate.length };
}

/**
 * Delete a resume from the database.
 *
 * This is called when a user deletes a resume locally, to ensure the deletion
 * is also propagated to the server and the resume doesn't get restored on the
 * next sync.
 */
export async function deleteResumeAction(resumeId: string): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not authenticated, just return silently - the local delete will still work
  // and there's no server-side data to delete
  if (!user) return;

  // Delete the resume, scoped to the current user for security
  await prisma.resume.deleteMany({
    where: { id: resumeId, userId: user.id },
  });
}
