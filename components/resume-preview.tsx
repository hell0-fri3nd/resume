'use client';

import { Resume } from '@/lib/types';
import FShapeTemplate from '@/components/fshape-template';
import HarvardTemplate from '@/components/harvard-template';

interface ResumePreviewProps {
  resume: Resume;
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    <div className="p-6 lg:p-8 overflow-auto h-full">
      <div id="resume-preview">
        {resume.template === 'fshape' && <FShapeTemplate resume={resume} />}
        {resume.template === 'harvard' && <HarvardTemplate resume={resume} />}
      </div>
    </div>
  );
}
