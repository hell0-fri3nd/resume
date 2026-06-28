'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import { selectAllResumes } from '@/store/slices/resumes-slice';
import CreateResumeDialog from './components/create-resume-dialog';
import ResumeCard from './components/resume-card';

export default function DashboardPage() {
  const router = useRouter();
  const resumes = useAppSelector(selectAllResumes);

  return (
    <div className="min-h-screen bg-background">
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
          <CreateResumeDialog />
        </div>
      </header>

      {/* Content */}
      <main className="w-full md:w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-1">
          <h1 className="text-3xl font-bold text-foreground">My Resumes</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage all your resumes in one place.
          </p>
        </div>

        {resumes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border py-20 text-center">
            <FileText className="w-12 h-12 text-muted-foreground" />
            <div className="space-y-1">
              <h2 className="text-lg font-semibold text-foreground">
                No resumes yet
              </h2>
              <p className="text-muted-foreground">
                Create your first resume to get started.
              </p>
            </div>
            <CreateResumeDialog />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
