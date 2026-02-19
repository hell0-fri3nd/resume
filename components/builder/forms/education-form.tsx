'use client';

import { Resume, Education } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Lightbulb } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import CardHeaderForm from '@/components/custom/card-header-form';
import InputField from '@/components/custom/input-field';

interface EducationFormProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export default function EducationForm({ resume, setResume }: EducationFormProps) {
  const handleAddEducation = () => {
    const newEducation: Education = {
      id: uuidv4(),
      school: '',
      degree: '',
      field: '',
      graduationDate: '',
      details: '',
    };
    setResume({
      ...resume,
      education: [...resume.education, newEducation],
    });
  };

  const handleUpdateEducation = (id: string, field: keyof Education, value: string) => {
    setResume({
      ...resume,
      education: resume.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    });
  };

  const handleDeleteEducation = (id: string) => {
    setResume({
      ...resume,
      education: resume.education.filter((edu) => edu.id !== id),
    });
  };

  return (
    <div className="space-y-4">

      <CardHeaderForm 
      showButton
      className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
      title='Education'
      buttonLabel='Add Education'
      onClick={handleAddEducation}/>
            

      {resume.education.map((edu, index) => (
        <Card key={edu.id} className="p-6 bg-card border-border">
          <div className="flex items-start justify-between mb-4">
            <h4 className="font-semibold text-foreground">Education {index + 1}</h4>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => handleDeleteEducation(edu.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <InputField 
              label='School'
              required
              placeholder="Rizal Technological University"
              value={edu.school}
              onChange={(e) => handleUpdateEducation(edu.id, 'school', e.target.value)}
              className="bg-background border-border"/>

              <InputField 
              label='Degree'
              required
              placeholder="Bachelor of Science"
              value={edu.degree}
              onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
              className="bg-background border-border"/>
              
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <InputField 
              label='Field of Study'
              required
              placeholder="Computer Engineering"
              value={edu.field}
              onChange={(e) => handleUpdateEducation(edu.id, 'field', e.target.value)}
              className="bg-background border-border"/>

              <InputField 
              label='Graduation Date'
              type="date"
              value={edu.graduationDate}
              onChange={(e) => handleUpdateEducation(edu.id, 'graduationDate', e.target.value)}
              className="bg-background border-border"/>

            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-semibold">Additional Details</Label>
              <Textarea
                placeholder="e.g., Developed a full-stack IoT Smart Locker System with facial recognition, enabling secure, keyless access and real-time usage tracking, including a blinking-based liveness check to verify users."
                value={edu.details || ''}
                onChange={(e) => handleUpdateEducation(edu.id, 'details', e.target.value)}
                className="min-h-20 bg-background border-border resize-none"
              />

              <div className="flex items-start gap-2">
                <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 text-yellow-500 shrink-0" />
                <p> Include your GPA, honors, relevant coursework, awards, and any major projects to make your education stand out.</p>
              </div>

            </div>
          </div>
        </Card>
      ))}
      
      {resume.education.length === 0 && (
        <Card className="p-4 sm:p-6 bg-muted border-border">
          <p className="text-center text-sm sm:text-base">
            No education added yet. Click{" "}
            <span className="inline-flex items-center gap-1 text-red-500 font-semibold text-sm sm:text-base">
              <Plus size={14} />
              Add Education
            </span>{" "}
            to get started.
          </p>
        </Card>
      )}

    </div>
  );
}
