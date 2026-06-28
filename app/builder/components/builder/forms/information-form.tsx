'use client';

import { Contact } from '@/lib/types';
import { Card } from '@/components/ui/card';
import InputField from '@/components/custom/input-field';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectResumeById, updateContact } from '@/store/slices/resumes-slice';

interface ContactFormProps {
  resumeId: string;
}

export default function InformationForm({ resumeId }: ContactFormProps) {
  const dispatch = useAppDispatch();
  const resume = useAppSelector((state) => selectResumeById(state, resumeId));

  if (!resume) return null;

  const handleChange = (field: keyof Contact, value: string) => {
    dispatch(updateContact({ id: resumeId, field, value }));
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
          value={resume.contact.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          className="bg-background border-border"/>

          <InputField 
          label='Location'
          type="text"
          placeholder="Cainta, Rizal"
          value={resume.contact.location}
          onChange={(e) => handleChange('location', e.target.value)}
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
          </div>

          <div className="space-y-2">
            <InputField 
            label='Github'
            placeholder="github.com/hell0-fri3nd"
            value={resume.contact.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            className="bg-background border-border"/>

          </div>

          <div className="space-y-2">
            <InputField 
            label='Website / Portfolio'
            placeholder="hello-friend-00.web.app"
            value={resume.contact.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
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
