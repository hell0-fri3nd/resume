'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Resume, defaultResume } from '@/lib/types';
import BuilderLayout from '@/components/builder/builder-layout';
// import Loading from './loading'; // Import the Loading component

export default function BuilderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const template = (searchParams.get('template') as 'fshape' | 'harvard') || 'fshape';
  
  const [resume, setResume] = useState<Resume>(() => ({
    ...defaultResume,
    template,
  }));

  // Load from localStorage if available
  useEffect(() => {
    const saved = localStorage.getItem('resume');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure sectionOrder exists for backward compatibility
        if (!parsed.sectionOrder) {
          parsed.sectionOrder = defaultResume.sectionOrder;
        }
        // Ensure certifications array exists
        if (!parsed.certifications) {
          parsed.certifications = [];
        }
        setResume(parsed);
      } catch (e) {
        console.log('[v0] Failed to load resume from localStorage');
      }
    }
  }, []);

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('resume', JSON.stringify(resume));
  }, [resume]);

  return (
    <BuilderLayout resume={resume} setResume={setResume} />
  );
}

// loading.tsx
// export default function Loading() {
//   return null;
// }
