'use client';

import { use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { selectResumeById } from '@/store/slices/resumes-slice';
import BuilderLayout from '../components/builder/builder-layout';

export default function BuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const resume = useAppSelector((state) => selectResumeById(state, id));

  // Resume doesn't exist (bad URL or deleted) — send the user back to the list.
  useEffect(() => {
    if (!resume) router.replace('/dashboard');
  }, [resume, router]);

  if (!resume) return null;

  return <BuilderLayout resumeId={id} />;
}
