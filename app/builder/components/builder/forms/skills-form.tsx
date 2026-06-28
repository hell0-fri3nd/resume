'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, X } from 'lucide-react';
import CardHeaderForm from '@/components/custom/card-header-form';
import InputField from '@/components/custom/input-field';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addSkillGroup,
  addSkillToGroup,
  removeSkillFromGroup,
  removeSkillGroup,
  selectResumeById,
  updateSkillGroup,
} from '@/store/slices/resumes-slice';

interface SkillsFormProps {
  resumeId: string;
}

export default function SkillsForm({ resumeId }: SkillsFormProps) {
  const dispatch = useAppDispatch();
  const resume = useAppSelector((state) => selectResumeById(state, resumeId));

  if (!resume) return null;

  const handleAddSkillCategory = () => {
    dispatch(addSkillGroup({ id: resumeId }));
  };

  const handleUpdateSkillCategory = (itemId: string, category: string) => {
    dispatch(updateSkillGroup({ id: resumeId, itemId, changes: { category } }));
  };

  const handleAddSkill = (itemId: string, skillText: string) => {
    dispatch(addSkillToGroup({ id: resumeId, itemId, skill: skillText }));
  };

  const handleRemoveSkill = (itemId: string, skillIndex: number) => {
    dispatch(removeSkillFromGroup({ id: resumeId, itemId, index: skillIndex }));
  };

  const handleDeleteSkillCategory = (itemId: string) => {
    dispatch(removeSkillGroup({ id: resumeId, itemId }));
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
