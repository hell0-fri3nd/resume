'use client';

import React from 'react';
import { Resume, Skill } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import CardHeaderForm from '@/components/custom/card-header-form';
import InputField from '@/components/custom/input-field';

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


      <CardHeaderForm 
      showButton
      className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
      title='Skills'
      buttonLabel='Add Skill Category'
      onClick={handleAddSkillCategory}/>


      {resume.skills.map((skill, index) => (
        <Card key={skill.id} className="p-6 bg-card border-border mb-6">
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
            
            <InputField 
            label='School'
            required
            placeholder="e.g., Frontend"
            value={skill.category}
            onChange={(e) => handleUpdateSkillCategory(skill.id, e.target.value)}
            className="bg-background border-border"/>

            <div className="space-y-3">
              <Label className="text-foreground font-semibold">Skills in this Category</Label>

              {skill.skills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {skill.skills.map((s, idx) => (
                    <div key={idx}
                    className="flex items-center 
                    gap-2 bg-primary/10 
                    text-primary px-3 py-1 
                    rounded-full text-sm">
                      {s}
                    
                      <button onClick={() => handleRemoveSkill(skill.id, idx)}
                      className="hover:text-primary/70 transition-colors">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <SkillInput
                onAdd={(skillText) => handleAddSkill(skill.id, skillText)}
                placeholder="NextJS"
              />
              
            </div>
          </div>
        </Card>
      ))}


            {resume.skills.length === 0 && (
              <Card className="p-4 sm:p-6 bg-muted border-border">
                <p className="text-center text-sm sm:text-base">
                  No added added yet. Click{" "}
                  <span className="inline-flex items-center gap-1 text-red-500 font-semibold text-sm sm:text-base">
                    <Plus size={14} />
                    Add Skill Category
                  </span>{" "}
                  to get started.
                </p>
              </Card>
            )}

    </div>
  );
}

function SkillInput({ onAdd, placeholder, }: { onAdd: (skill: string) => void; placeholder: string; }) {
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
