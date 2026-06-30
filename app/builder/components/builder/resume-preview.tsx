'use client';

import dynamic from 'next/dynamic';
import { Resume } from '@/lib/types';
import { Spinner } from '@/components/ui/spinner';

// react-pdf's PDFViewer touches browser-only APIs, so load it client-side only.
const PdfPreview = dynamic(() => import('./pdf-preview'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full">
      <Spinner />
    </div>
  ),
});

interface ResumePreviewProps {
  resume: Resume;
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    <div
      id="resume-preview"
      className="h-[calc(100vh-120px)] w-full"
    >
      <PdfPreview resume={resume} />
    </div>
  );
}
