'use client';

import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './index';
import { useAppDispatch, useAppSelector } from './hooks';
import { importResume, selectResumeCount } from './slices/resumes-slice';
import {
  DEFAULT_SECTION_ORDER,
  type Resume,
  type SectionType,
} from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const LEGACY_KEY = 'resume';

/**
 * One-time migration: the pre-Redux app stored a single resume under
 * localStorage['resume']. If the Redux store is empty after rehydration and that
 * legacy key exists, import it as the user's first resume and remove the key so
 * this only runs once.
 */
function LegacyMigration() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectResumeCount);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current || count > 0) return;
    ran.current = true;

    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      const now = new Date().toISOString();
      const migrated: Resume = {
        id: parsed.id && parsed.id !== 'default' ? parsed.id : uuidv4(),
        name: parsed.name || 'My Resume',
        createdAt: now,
        updatedAt: now,
        contact: parsed.contact ?? {
          fullName: '',
          email: '',
          phone: '',
          location: '',
          website: '',
          linkedin: '',
        },
        experience: parsed.experience ?? [],
        education: parsed.education ?? [],
        certifications: parsed.certifications ?? [],
        skills: parsed.skills ?? [],
        customSections: parsed.customSections ?? [],
        summary: parsed.summary ?? '',
        template: parsed.template === 'harvard' ? 'harvard' : 'fshape',
        sectionOrder: (parsed.sectionOrder as SectionType[]) ?? [
          ...DEFAULT_SECTION_ORDER,
        ],
      };
      dispatch(importResume(migrated));
      localStorage.removeItem(LEGACY_KEY);
    } catch {
      // Corrupt legacy data — nothing to migrate.
    }
  }, [count, dispatch]);

  return null;
}

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LegacyMigration />
        {children}
      </PersistGate>
    </Provider>
  );
}
