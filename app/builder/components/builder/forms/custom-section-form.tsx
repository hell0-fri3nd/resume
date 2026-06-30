'use client';

import { CustomSectionItem } from '@/lib/types';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import RichTextEditor from '@/components/custom/rich-text-editor';
import CardHeaderForm from '@/components/custom/card-header-form';
import InputField from '@/components/custom/input-field';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addCustomSectionItem,
  removeCustomSection,
  removeCustomSectionItem,
  selectResumeById,
  updateCustomSection,
  updateCustomSectionItem,
} from '@/store/slices/resumes-slice';

interface CustomSectionFormProps {
  resumeId: string;
  sectionId: string;
}

export default function CustomSectionForm({ resumeId, sectionId }: CustomSectionFormProps) {
  const dispatch = useAppDispatch();
  const resume = useAppSelector((state) => selectResumeById(state, resumeId));
  const section = resume?.customSections?.find((s) => s.id === sectionId);

  if (!resume || !section) return null;

  const handleRename = (title: string) => {
    dispatch(updateCustomSection({ id: resumeId, sectionId, changes: { title } }));
  };

  const handleDeleteSection = () => {
    dispatch(removeCustomSection({ id: resumeId, sectionId }));
  };

  const handleAddItem = () => {
    dispatch(addCustomSectionItem({ id: resumeId, sectionId }));
  };

  const handleUpdateItem = (
    itemId: string,
    field: keyof CustomSectionItem,
    value: string
  ) => {
    dispatch(
      updateCustomSectionItem({ id: resumeId, sectionId, itemId, changes: { [field]: value } })
    );
  };

  const handleDeleteItem = (itemId: string) => {
    dispatch(removeCustomSectionItem({ id: resumeId, sectionId, itemId }));
  };

  return (
    <div className="space-y-4">

      <Card className="p-6 bg-card border-border space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <InputField
              label="Section Name"
              required
              placeholder="e.g. Projects, Leadership, Activities"
              value={section.title}
              onChange={(e) => handleRename(e.target.value)}
              className="bg-background border-border"
            />
          </div>
          <Button
            variant="ghost"
            size="lg"
            onClick={handleDeleteSection}
            className="mt-7 text-destructive hover:text-destructive"
          >
            <Trash2 size={16} />
            <span className="hidden lg:inline">Delete Section</span>
          </Button>
        </div>
      </Card>

      <CardHeaderForm
        showButton
        className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
        title={section.title.trim() || 'Custom Section'}
        buttonLabel="Add Entry"
        onClick={handleAddItem}
      />

      {section.items.map((item, index) => (
        <Card key={item.id} className="p-6 bg-card border-border">

          <div className="flex items-start justify-between">
            <h4 className="font-semibold text-foreground">Entry {index + 1}</h4>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => handleDeleteItem(item.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Title"
                placeholder="e.g. Project name or activity"
                value={item.title}
                onChange={(e) => handleUpdateItem(item.id, 'title', e.target.value)}
                className="bg-background border-border"
              />

              <InputField
                label="Role"
                placeholder="e.g. Team Lead (optional)"
                value={item.role ?? ''}
                onChange={(e) => handleUpdateItem(item.id, 'role', e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField
                label="Start Date"
                type="date"
                value={item.startDate ?? ''}
                onChange={(e) => handleUpdateItem(item.id, 'startDate', e.target.value)}
                className="bg-background border-border"
              />

              <InputField
                label="End Date"
                type="date"
                value={item.endDate ?? ''}
                onChange={(e) => handleUpdateItem(item.id, 'endDate', e.target.value)}
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground font-semibold">Description</Label>
              <RichTextEditor
                placeholder="Describe this entry. Use bullet points and measurable results where possible."
                value={item.description}
                onChange={(html) => handleUpdateItem(item.id, 'description', html)}
                minHeight="min-h-24"
              />
            </div>
          </div>
        </Card>
      ))}

      {section.items.length === 0 && (
        <Card className="p-4 sm:p-6 bg-muted border-border">
          <p className="text-center text-sm sm:text-base">
            No entries yet. Click{" "}
            <span className="inline-flex items-center gap-1 text-red-500 font-semibold text-sm sm:text-base">
              <Plus size={14} />
              Add Entry
            </span>{" "}
            to get started.
          </p>
        </Card>
      )}
    </div>
  );
}
