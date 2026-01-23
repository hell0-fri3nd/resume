'use client';

import { Resume, Experience } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ExperienceFormProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export default function ExperienceForm({ resume, setResume }: ExperienceFormProps) {
  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: uuidv4(),
      jobTitle: '',
      company: '',
      startDate: '',
      endDate: '',
      currentlyWorking: false,
      description: '',
    };
    setResume({
      ...resume,
      experience: [...resume.experience, newExperience],
    });
  };

  const handleUpdateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setResume({
      ...resume,
      experience: resume.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    });
  };

  const handleDeleteExperience = (id: string) => {
    setResume({
      ...resume,
      experience: resume.experience.filter((exp) => exp.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Work Experience</h3>
          <Button
            size="sm"
            onClick={handleAddExperience}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus size={16} />
            Add Experience
          </Button>
        </div>
      </Card>

      {resume.experience.map((exp, index) => (
        <Card key={exp.id} className="p-6 bg-card border-border">
          <div className="flex items-start justify-between mb-4">
            <h4 className="font-semibold text-foreground">Experience {index + 1}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteExperience(exp.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Job Title *</Label>
                <Input
                  placeholder="Software Engineer"
                  value={exp.jobTitle}
                  onChange={(e) => handleUpdateExperience(exp.id, 'jobTitle', e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Company *</Label>
                <Input
                  placeholder="Tech Company Inc"
                  value={exp.company}
                  onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                  className="bg-background border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">Start Date *</Label>
                <Input
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground font-semibold">End Date</Label>
                <Input
                  type="date"
                  value={exp.endDate}
                  onChange={(e) => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                  disabled={exp.currentlyWorking}
                  className="bg-background border-border disabled:opacity-50"
                />
              </div>
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
              <Textarea
                placeholder="Describe your responsibilities and achievements..."
                value={exp.description}
                onChange={(e) => handleUpdateExperience(exp.id, 'description', e.target.value)}
                className="min-h-24 bg-background border-border resize-none"
              />
              <p className="text-sm text-muted-foreground">Use bullet points or paragraphs</p>
            </div>
          </div>
        </Card>
      ))}

      {resume.experience.length === 0 && (
        <Card className="p-6 bg-muted border-border">
          <p className="text-muted-foreground text-center">
            No experience added yet. Click "Add Experience" to get started.
          </p>
        </Card>
      )}
    </div>
  );
}
