'use client';

import React from 'react';
import { Resume, Skill } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface SkillsFormProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

export default function SkillsForm({ resume, setResume }: SkillsFormProps) {
  const handleAddSkillCategory = () => {
    const newSkill: Skill = {
      id: uuidv4(),
      category: '',
      skills: [],
    };
    setResume({
      ...resume,
      skills: [...resume.skills, newSkill],
    });
  };

  const handleUpdateSkillCategory = (id: string, category: string) => {
    setResume({
      ...resume,
      skills: resume.skills.map((skill) =>
        skill.id === id ? { ...skill, category } : skill
      ),
    });
  };

  const handleAddSkill = (skillId: string, skillText: string) => {
    if (!skillText.trim()) return;
    setResume({
      ...resume,
      skills: resume.skills.map((skill) =>
        skill.id === skillId
          ? { ...skill, skills: [...skill.skills, skillText.trim()] }
          : skill
      ),
    });
  };

  const handleRemoveSkill = (skillId: string, skillIndex: number) => {
    setResume({
      ...resume,
      skills: resume.skills.map((skill) =>
        skill.id === skillId
          ? { ...skill, skills: skill.skills.filter((_, i) => i !== skillIndex) }
          : skill
      ),
    });
  };

  const handleDeleteSkillCategory = (id: string) => {
    setResume({
      ...resume,
      skills: resume.skills.filter((skill) => skill.id !== id),
    });
  };

  return (
    <div className="space-y-4">
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-foreground">Skills</h3>
          <Button
            size="sm"
            onClick={handleAddSkillCategory}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus size={16} />
            Add Skill Category
          </Button>
        </div>
      </Card>

      {resume.skills.map((skill, index) => (
        <Card key={skill.id} className="p-6 bg-card border-border">
          <div className="flex items-start justify-between mb-4">
            <h4 className="font-semibold text-foreground">Category {index + 1}</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDeleteSkillCategory(skill.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground font-semibold">Category Name *</Label>
              <Input
                placeholder="e.g., Programming Languages, Tools, Frameworks"
                value={skill.category}
                onChange={(e) => handleUpdateSkillCategory(skill.id, e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-3">
              <Label className="text-foreground font-semibold">Skills in this Category</Label>

              {skill.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skill.skills.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                    >
                      {s}
                      <button
                        onClick={() => handleRemoveSkill(skill.id, idx)}
                        className="hover:text-primary/70 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <SkillInput
                onAdd={(skillText) => handleAddSkill(skill.id, skillText)}
                placeholder="Add a skill and press Enter"
              />
            </div>
          </div>
        </Card>
      ))}

      {resume.skills.length === 0 && (
        <Card className="p-6 bg-muted border-border">
          <p className="text-muted-foreground text-center">
            No skills added yet. Click "Add Skill Category" to get started.
          </p>
        </Card>
      )}
    </div>
  );
}

function SkillInput({
  onAdd,
  placeholder,
}: {
  onAdd: (skill: string) => void;
  placeholder: string;
}) {
  const [value, setValue] = React.useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (value.trim()) {
        onAdd(value);
        setValue('');
      }
    }
  };

  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className="bg-background border-border"
    />
  );
}
