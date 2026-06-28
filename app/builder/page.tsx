'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// The builder now requires a specific resume id (/builder/[id]). Visiting
// /builder directly redirects to the dashboard to pick or create one.
export default function BuilderIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return null;
}
