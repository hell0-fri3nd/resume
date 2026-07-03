'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/components/auth/auth-provider';
import { GoogleIcon } from '@/components/auth/google-icon';

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, configured, signInWithGoogle } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const hasError = searchParams.get('error');

  // Already signed in — the callback will route to onboarding or dashboard.
  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [loading, user, router]);

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      // Google handles both sign-up and sign-in; new users get a profile row
      // on first login and are sent to onboarding by the auth callback.
      await signInWithGoogle();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm p-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex items-center gap-1 text-2xl font-semibold tracking-tight text-foreground">
            <Image
              src="/letter-r.png"
              alt="R"
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-lg object-contain"
            />
            esume
          </span>
          <h1 className="mt-2 text-lg font-semibold text-foreground">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign up with Google to save your resumes to the cloud and pick up
            where you left off on any device.
          </p>
        </div>

        {hasError && (
          <p className="mt-6 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
            Sign-up failed. Please try again.
          </p>
        )}

        <div className="mt-8 space-y-4">
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleGoogle}
            disabled={submitting || !configured}
          >
            {submitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <GoogleIcon className="size-5" />
            )}
            Sign up with Google
          </Button>

          {!configured && (
            <p className="text-center text-xs text-muted-foreground">
              Cloud sync isn&apos;t configured yet. Set{' '}
              <code className="rounded bg-muted px-1 py-0.5">
                NEXT_PUBLIC_SUPABASE_URL
              </code>{' '}
              and{' '}
              <code className="rounded bg-muted px-1 py-0.5">
                NEXT_PUBLIC_SUPABASE_ANON_KEY
              </code>
              .
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterContent />
    </Suspense>
  );
}
