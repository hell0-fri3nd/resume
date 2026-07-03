'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { syncResumesAction } from '@/lib/actions/sync-resumes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectAllResumes,
  upsertResumes,
} from '@/store/slices/resumes-slice';
import { useAuth } from './auth-provider';

const AUTO_SYNC_KEY = 'resume-auto-sync';
/** Debounce window for auto-sync after the last edit. */
const AUTO_SYNC_DEBOUNCE_MS = 4000;

type SyncState = 'idle' | 'syncing' | 'error';

/**
 * Drives cloud sync from the dashboard: a manual `sync()` action plus an
 * opt-in auto-sync that pushes changes shortly after they happen while the
 * user is signed in.
 */
export function useResumeSync() {
  const { user, configured } = useAuth();
  const dispatch = useAppDispatch();
  const resumes = useAppSelector(selectAllResumes);

  const [state, setState] = useState<SyncState>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [autoSync, setAutoSyncState] = useState(false);

  // Hold the latest resumes in a ref so callbacks don't need them as deps.
  const resumesRef = useRef(resumes);
  resumesRef.current = resumes;

  // Load the persisted auto-sync preference once on mount.
  useEffect(() => {
    setAutoSyncState(localStorage.getItem(AUTO_SYNC_KEY) === 'true');
  }, []);

  const setAutoSync = useCallback((value: boolean) => {
    setAutoSyncState(value);
    localStorage.setItem(AUTO_SYNC_KEY, String(value));
  }, []);

  const sync = useCallback(
    async ({ silent = false }: { silent?: boolean } = {}) => {
      if (!user || !configured) return;
      setState('syncing');
      try {
        const { toStore, pushed } = await syncResumesAction(resumesRef.current);
        if (toStore.length > 0) dispatch(upsertResumes(toStore));
        setState('idle');
        setLastSyncedAt(Date.now());
        if (!silent) {
          const pulled = toStore.length;
          toast.success(
            pulled || pushed
              ? `Synced — ${pushed} uploaded, ${pulled} downloaded.`
              : 'Everything is already up to date.'
          );
        }
      } catch (err) {
        setState('error');
        if (!silent) {
          toast.error('Sync failed. Check your connection and try again.');
        }
        console.error('[resume-sync]', err);
      }
    },
    [user, configured, dispatch]
  );

  // Sync once when the user signs in.
  const signedInUserId = user?.id ?? null;
  useEffect(() => {
    if (signedInUserId && configured) void sync({ silent: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedInUserId, configured]);

  // Auto-sync: debounce a silent push whenever resumes change.
  useEffect(() => {
    if (!autoSync || !signedInUserId || !configured) return;
    const handle = setTimeout(() => void sync({ silent: true }), AUTO_SYNC_DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [autoSync, signedInUserId, configured, resumes, sync]);

  return {
    syncing: state === 'syncing',
    error: state === 'error',
    lastSyncedAt,
    autoSync,
    setAutoSync,
    sync,
  };
}
