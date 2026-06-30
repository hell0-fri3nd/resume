'use client';

import { Education } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Lightbulb } from 'lucide-react';
import RichTextEditor from '@/components/custom/rich-text-editor';
import CardHeaderForm from '@/components/custom/card-header-form';
import InputField from '@/components/custom/input-field';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addEducation,
  removeEducation,
  selectResumeById,
  updateEducation,
} from '@/store/slices/resumes-slice';

interface EducationFormProps {
  resumeId: string;
}

export default function EducationForm({ resumeId }: EducationFormProps) {
  const dispatch = useAppDispatch();
  const resume = useAppSelector((state) => selectResumeById(state, resumeId));

  if (!resume) return null;

  const handleAddEducation = () => {
    dispatch(addEducation({ id: resumeId }));
  };

  const handleUpdateEducation = (
    itemId: string,
    field: keyof Education,
    value: string
  ) => {
    dispatch(
      updateEducation({ id: resumeId, itemId, changes: { [field]: value } })
    );
  };

  const handleDeleteEducation = (itemId: string) => {
    dispatch(removeEducation({ id: resumeId, itemId }));
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
              label='Graduation Date'
              type="date"
              value={edu.graduationDate}
              onChange={(e) => handleUpdateEducation(edu.id, 'graduationDate', e.target.value)}
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
              label='Degree'
              required
              placeholder="Bachelor of Science"
              value={edu.degree}
              onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
              className="bg-background border-border"/>

            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-semibold">Additional Details</Label>
              <RichTextEditor
                placeholder="e.g., Developed a full-stack IoT Smart Locker System with facial recognition, enabling secure, keyless access and real-time usage tracking."
                value={edu.details || ''}
                onChange={(html) => handleUpdateEducation(edu.id, 'details', html)}
                minHeight="min-h-20"
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
