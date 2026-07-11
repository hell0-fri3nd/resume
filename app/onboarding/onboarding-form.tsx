'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { completeOnboarding } from '@/lib/actions/profile';
import Image from 'next/image';

export default function OnboardingForm({
  defaultName,
}: {
  defaultName: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [pending, startTransition] = useTransition();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    startTransition(async () => {
      try {

        await completeOnboarding(trimmed);
        toast.success(`Welcome, ${trimmed.split(' ')[0]}!`);
        router.refresh();

      } catch (err) {
        toast.error('Could not save your details. Please try again.');
        console.error('[onboarding]', err);
      }
    });
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

          <h1 className="text-xl font-semibold text-foreground">
            Welcome! Let&apos;s set up your profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Tell us your name so we can personalize your resumes.
          </p>
        </div>

        <form onSubmit={submit} className="mt-0 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              className="bg-background"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={pending || !name.trim()}
          >
            {pending && <Loader2 className="animate-spin" />}
            Continue
          </Button>
        </form>
      </Card>
    </div>
  );
}
