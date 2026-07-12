'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import { selectAllResumes } from '@/store/slices/resumes-slice';
import CreateResumeDialog from './components/create-resume-dialog';
import ResumeCard from './components/resume-card';
import AccountMenu from './components/account-menu';
import OnboardingGate from './components/onboarding-gate';

export default function DashboardPage() {
  const router = useRouter();
  const resumes = useAppSelector(selectAllResumes);

  return (
    <div className="min-h-screen bg-background">
      <OnboardingGate />
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="w-full md:w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
          <Button
            variant="link"
            onClick={() => router.push('/')}
            className="text-foreground hover:text-primary font-semibold cursor-pointer p-0"
          >
            <span className="flex items-center gap-1 text-lg font-semibold tracking-tight">
              <Image
                src="/letter-r.png"
                alt="R"
                width={30}
                height={30}
                className="w-8 h-8 object-contain rounded-lg shrink-0"
              />
              esume
            </span>
          </Button>
          <AccountMenu />
        </div>
      </header>

      {/* Content */}
      {resumes.length > 0 && (
        <main className="w-full md:w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">My Resumes</h1>
            <p className="text-muted-foreground">
              Create, edit, and manage all your resumes in one place.
            </p>
          </div>
          <CreateResumeDialog />
        </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
