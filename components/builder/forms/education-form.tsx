'use client';

import { Resume, Education } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

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
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Education</h3>
          <Button
            size="sm"
            onClick={handleAddEducation}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus size={16} />
            Add Education
          </Button>
        </div>
      </Card>

      {resume.education.map((edu, index) => (
        <Card key={edu.id} className="p-6 bg-card border-border">
          <div className="flex items-start justify-between mb-4">
            <h4 className="font-semibold text-foreground">Education {index + 1}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteEducation(edu.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">School *</Label>
                <Input
                  placeholder="University of California"
                  value={edu.school}
                  onChange={(e) => handleUpdateEducation(edu.id, 'school', e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Degree *</Label>
                <Input
                  placeholder="Bachelor of Science"
                  value={edu.degree}
                  onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Field of Study *</Label>
                <Input
                  placeholder="Computer Science"
                  value={edu.field}
                  onChange={(e) => handleUpdateEducation(edu.id, 'field', e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Graduation Date</Label>
                <Input
                  type="date"
                  value={edu.graduationDate}
                  onChange={(e) => handleUpdateEducation(edu.id, 'graduationDate', e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-semibold">Additional Details</Label>
              <Textarea
                placeholder="GPA, honors, relevant coursework, etc."
                value={edu.details || ''}
                onChange={(e) => handleUpdateEducation(edu.id, 'details', e.target.value)}
                className="min-h-20 bg-background border-border resize-none"
              />
            </div>
          </div>
        </Card>
      ))}

      {resume.education.length === 0 && (
        <Card className="p-6 bg-muted border-border">
          <p className="text-muted-foreground text-center">
            No education added yet. Click "Add Education" to get started.
          </p>
        </Card>
      )}
    </div>
  );
}
