'use client';

import { Resume } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface SummaryFormProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export default function SummaryForm({ resume, setResume }: SummaryFormProps) {
  const handleChange = (value: string) => {
    setResume({
      ...resume,
      summary: value,
    });
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

        <Textarea
          placeholder="Write a brief summary about your professional experience, skills, and career goals..."
          value={resume.summary || ''}
          onChange={(e) => handleChange(e.target.value)}
          className="min-h-32 bg-background border-border resize-none"
        />

        <p className="text-sm text-muted-foreground">
          Keep it to 2-3 sentences. This section is optional but recommended.
        </p>
      </div>
    </Card>
  );
}
