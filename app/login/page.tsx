'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/components/auth/auth-provider';
import { GoogleIcon } from '@/components/auth/google-icon';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, configured, signInWithGoogle } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const hasError = searchParams.get('error');

  // Already signed in — skip the form.
  useEffect(() => {
    if (!loading && user) router.replace('/dashboard');
  }, [loading, user, router]);

  const handleGoogle = async () => {
    setSubmitting(true);
    try {
      await signInWithGoogle();
      // On success the browser is redirected to Google, so this rarely returns.
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
            Sign in to sync your resumes
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to back up your resumes to the cloud and access them from any
            device. Your local drafts stay put either way.
          </p>
        </div>

        {hasError && (
          <p className="mt-6 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
            Sign-in failed. Please try again.
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
            Continue with Google
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

          <Button
            variant="ghost"
            className="w-full text-muted-foreground"
            onClick={() => router.push('/dashboard')}
          >
            Continue without signing in
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{' '}
          <Link
            href="/register"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
