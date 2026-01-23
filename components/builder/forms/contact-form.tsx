'use client';

import { Resume } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

interface ContactFormProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export default function ContactForm({ resume, setResume }: ContactFormProps) {
  const handleChange = (field: keyof typeof resume.contact, value: string) => {
    setResume({
      ...resume,
      contact: {
        ...resume.contact,
        [field]: value,
      },
    });
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">Full Name *</Label>
            <Input
              placeholder="John Doe"
              value={resume.contact.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">Email *</Label>
            <Input
              type="email"
              placeholder="john@example.com"
              value={resume.contact.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="bg-background border-border"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">Phone *</Label>
            <Input
              type="tel"
              placeholder="(555) 123-4567"
              value={resume.contact.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">Location *</Label>
            <Input
              placeholder="San Francisco, CA"
              value={resume.contact.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="bg-background border-border"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">Website</Label>
            <Input
              placeholder="www.johndoe.com"
              value={resume.contact.website || ''}
              onChange={(e) => handleChange('website', e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground font-semibold">LinkedIn</Label>
            <Input
              placeholder="linkedin.com/in/johndoe"
              value={resume.contact.linkedin || ''}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              className="bg-background border-border"
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          * Required fields. These will appear at the top of your resume.
        </p>
      </div>
    </Card>
  );
}
