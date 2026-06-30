'use client';

import { Experience } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import RichTextEditor from '@/components/custom/rich-text-editor';
import { Trash2, Plus, Lightbulb, Zap, TrendingUp } from 'lucide-react';
import CardHeaderForm from '@/components/custom/card-header-form';
import InputField from '@/components/custom/input-field';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addExperience,
  removeExperience,
  selectResumeById,
  updateExperience,
} from '@/store/slices/resumes-slice';

interface ExperienceFormProps {
  resumeId: string;
}

export default function ExperienceForm({ resumeId }: ExperienceFormProps) {
  const dispatch = useAppDispatch();
  const resume = useAppSelector((state) => selectResumeById(state, resumeId));

  if (!resume) return null;

  const handleAddExperience = () => {
    dispatch(addExperience({ id: resumeId }));
  };

  const handleUpdateExperience = (
    itemId: string,
    field: keyof Experience,
    value: string | boolean
  ) => {
    dispatch(
      updateExperience({ id: resumeId, itemId, changes: { [field]: value } })
    );
  };

  const handleDeleteExperience = (itemId: string) => {
    dispatch(removeExperience({ id: resumeId, itemId }));
  };

  return (
    <div className="space-y-4">


      <CardHeaderForm 
      showButton
      className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
      title='Work Experience'
      buttonLabel='Add Experience'
      onClick={handleAddExperience}/>

      {resume.experience.map((exp, index) => (
        <Card key={exp.id} className="p-6 bg-card border-border">

          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-foreground">Experience {index + 1}</h4>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => handleDeleteExperience(exp.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          <div className="space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <InputField 
              label='Job Title'
              required
              placeholder="Software Engineer"
              value={exp.jobTitle}
              onChange={(e) => handleUpdateExperience(exp.id, 'jobTitle', e.target.value)}
              className="bg-background border-border"/>

              <InputField 
              label='Company'
              required
              placeholder="Tech Company Inc"
              value={exp.company}
              onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
              className="bg-background border-border"/>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <InputField 
              label='Start Date'
              type="date"
              required
              value={exp.startDate}
              onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
              className="bg-background border-border"/>

              <InputField 
              label='End Date'
              type="date"
              required
              value={exp.endDate}
              onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
              disabled={exp.currentlyWorking}
              className="bg-background border-border disabled:opacity-50"/>

            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`current-${exp.id}`}
                checked={exp.currentlyWorking}
                onCheckedChange={(checked) =>
                  handleUpdateExperience(exp.id, 'currentlyWorking', checked as boolean)
                }
              />
              <Label htmlFor={`current-${exp.id}`} className="text-foreground">
                I currently work here
              </Label>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-semibold">Description</Label>
              <RichTextEditor
              placeholder="* Deployed a full-stack web application and reduced development timelines by 50% (12 → 6 months) by developing new features, refactoring legacy code, and resolving critical defects."
              value={exp.description}
              onChange={(html) => handleUpdateExperience(exp.id, 'description', html)}
              minHeight="min-h-24"
              />

              <div className="flex items-start gap-2">
                <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 text-yellow-500 shrink-0" />
                <p>Use bullet points instead of long paragraphs.</p>
              </div>

              <div className="flex items-start gap-2">
                <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 text-blue-500 shrink-0" />
                <p>Start each bullet with strong power verbs.</p>
              </div>

              <div className="flex items-start gap-2">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 text-green-500 shrink-0" />
                <p>Add measurable results.</p>
              </div>

            </div>

          </div>
        </Card>
      ))}

      {resume.experience.length === 0 && (
        <Card className="p-4 sm:p-6 bg-muted border-border">
          <p className="text-center text-sm sm:text-base">
            No experience added yet. Click{" "}
            <span className="inline-flex items-center gap-1 text-red-500 font-semibold text-sm sm:text-base">
              <Plus size={14} />
              Add Experience
            </span>{" "}
            to get started.
          </p>
        </Card>
      )}
    </div>
  );
}
