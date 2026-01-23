'use client';

import React, { useState } from 'react';
import { Resume, SectionType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GripVertical, X } from 'lucide-react';

interface SectionReordererProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SECTION_LABELS: Record<SectionType, string> = {
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  certifications: 'Certifications & Licenses',
  skills: 'Skills',
};

const AVAILABLE_SECTIONS: SectionType[] = ['summary', 'experience', 'education', 'certifications', 'skills'];

export default function SectionReorderer({ resume, setResume, isOpen, onClose }: SectionReordererProps) {
  const [sections, setSections] = useState<SectionType[]>(resume.sectionOrder);
  const [draggedItem, setDraggedItem] = useState<SectionType | null>(null);

  const handleDragStart = (section: SectionType) => {
    setDraggedItem(section);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetSection: SectionType) => {
    if (!draggedItem || draggedItem === targetSection) return;

    const draggedIndex = sections.indexOf(draggedItem);
    const targetIndex = sections.indexOf(targetSection);

    const newSections = [...sections];
    newSections.splice(draggedIndex, 1);
    newSections.splice(targetIndex, 0, draggedItem);

    setSections(newSections);
    setDraggedItem(null);
  };

  const toggleSection = (section: SectionType) => {
    if (sections.includes(section)) {
      setSections(sections.filter((s) => s !== section));
    } else {
      setSections([...sections, section]);
    }
  };

  const handleSave = () => {
    setResume({
      ...resume,
      sectionOrder: sections,
    });
    onClose();
  };

  const hiddenSections = AVAILABLE_SECTIONS.filter((s) => !sections.includes(s));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-card border-border shadow-lg">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Organize Sections</h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            <p className="text-sm text-muted-foreground">Drag to reorder sections:</p>
            {sections.map((section) => (
              <div
                key={section}
                draggable
                onDragStart={() => handleDragStart(section)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(section)}
                className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-move hover:bg-muted/80 transition-colors border-2 border-transparent"
              >
                <GripVertical size={18} className="text-muted-foreground flex-shrink-0" />
                <span className="text-sm font-medium text-foreground flex-1">{SECTION_LABELS[section]}</span>
              </div>
            ))}
          </div>

          {hiddenSections.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Hidden sections:</p>
              <div className="space-y-2">
                {hiddenSections.map((section) => (
                  <button
                    key={section}
                    onClick={() => toggleSection(section)}
                    className="w-full text-left text-sm p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    + Show {SECTION_LABELS[section]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose} className="flex-1 text-foreground border-border bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">
              Save Order
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
