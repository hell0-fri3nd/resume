'use client';

import { Resume } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import InputField from '@/components/custom/input-field';

interface ContactFormProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export default function InformationForm({ resume, setResume }: ContactFormProps) {
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

          <InputField 
          label='Full Name'
          required
          placeholder="Art Lisboa"
          value={resume.contact.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          className="bg-background border-border"/>

          <InputField 
          label='Email'
          required
          placeholder="lisboamillen30@gmail.com"
          value={resume.contact.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="bg-background border-border"/>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <InputField 
          label='Phone'
          required
          type="tel"
          placeholder="+63 91* **** ***"
          value={resume.contact.fullName}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="bg-background border-border"/>

          <InputField 
          label='Location'
          type="tel"
          placeholder="+63 91* **** ***"
          value={resume.contact.fullName}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="bg-background border-border"/>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <div className="space-y-2">
            <InputField 
            label='LinkedIn'
            placeholder="linkedin.com/in/art-lisboa"
            value={resume.contact.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            className="bg-background border-border"/>

            <InputField 
            placeholder="https://www.linkedin.com/in/art-lisboa/"
            value={resume.contact.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            className="bg-background border-border"/>
          </div>

          <div className="space-y-2">
            <InputField 
            label='Github'
            placeholder="github.com/hell0-fri3nd"
            value={resume.contact.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            className="bg-background border-border"/>

            <InputField 
            placeholder="https://github.com/hell0-fri3nd"
            value={resume.contact.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            className="bg-background border-border"/>
          </div>

          <div className="space-y-2">
            <InputField 
            label='Website / Portfolio'
            placeholder="hello-friend-00.web.app"
            value={resume.contact.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            className="bg-background border-border"/>

            <InputField 
            placeholder="https://hello-friend-00.web.app"
            value={resume.contact.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            className="bg-background border-border"/>
          </div>
          
        </div>

        <p className="text-sm text-muted-foreground text-red-500 font-semibold">
          * Required fields. These will appear at the top of your resume.
        </p>
      </div>
    </Card>
  );
}
