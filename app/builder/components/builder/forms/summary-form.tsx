'use client';

import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import RichTextEditor from '@/components/custom/rich-text-editor';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectResumeById, setSummary } from '@/store/slices/resumes-slice';

interface SummaryFormProps {
  resumeId: string;
}

export default function SummaryForm({ resumeId }: SummaryFormProps) {
  const dispatch = useAppDispatch();
  const resume = useAppSelector((state) => selectResumeById(state, resumeId));

  if (!resume) return null;

  const handleChange = (value: string) => {
    dispatch(setSummary({ id: resumeId, summary: value }));
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-foreground font-semibold">Professional Summary</Label>
          <p className="text-sm text-muted-foreground">
            A brief overview of your professional background and key accomplishments
          </p>
        </div>

        <RichTextEditor
          placeholder="Write a brief summary about your professional experience, skills, and career goals..."
          value={resume.summary || ''}
          onChange={(html) => handleChange(html)}
          minHeight="min-h-32"
        />

        <p className="text-sm text-muted-foreground text-red-500 font-semibold">
        * Keep it to 2-3 sentences. This section is optional.
        </p>
      </div>
    </Card>
  );
}
