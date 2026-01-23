'use client';

import React from "react"

import { useState } from 'react';
import { Resume, SectionType } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import ContactForm from './forms/contact-form';
import SummaryForm from './forms/summary-form';
import ExperienceForm from './forms/experience-form';
import EducationForm from './forms/education-form';
import CertificationsForm from './forms/certifications-form';
import SkillsForm from './forms/skills-form';
import SectionReorderer from './section-reorderer';

interface ResumeFormProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

const SECTION_LABELS: Record<SectionType, string> = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  certifications: 'Certifications',
  skills: 'Skills',
};

const SECTION_COMPONENTS: Record<
  SectionType,
  React.ComponentType<{ resume: Resume; setResume: (resume: Resume) => void }>
> = {
  summary: SummaryForm,
  experience: ExperienceForm,
  education: EducationForm,
  certifications: CertificationsForm,
  skills: SkillsForm,
};

export default function ResumeForm({ resume, setResume }: ResumeFormProps) {
  const [showReorderer, setShowReorderer] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');

  // Ensure sectionOrder exists
  const sectionOrder = resume.sectionOrder || ['summary', 'experience', 'education', 'certifications', 'skills'];

  const visibleSections = sectionOrder.filter((section) => {
    if (section === 'summary') return resume.summary;
    if (section === 'experience') return resume.experience.length > 0;
    if (section === 'education') return resume.education.length > 0;
    if (section === 'certifications') return resume.certifications.length > 0;
    if (section === 'skills') return resume.skills.length > 0;
    return true;
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="space-y-4 mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Build Your Resume</h1>
          <p className="text-muted-foreground">Fill in your information section by section</p>
        </div>
        <Button
          onClick={() => setShowReorderer(true)}
          variant="outline"
          size="sm"
          className="gap-2 border-border text-foreground hover:bg-muted"
        >
          <Settings size={16} />
          Organize
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full gap-1 mb-6 bg-muted p-1 h-auto flex-wrap">
          <TabsTrigger value="contact" className="text-xs md:text-sm">
            Contact
          </TabsTrigger>
          {sectionOrder.map((section) => (
            <TabsTrigger key={section} value={section} className="text-xs md:text-sm">
              {SECTION_LABELS[section]}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="space-y-6">
          <TabsContent value="contact">
            <ContactForm resume={resume} setResume={setResume} />
          </TabsContent>

          {sectionOrder.map((section) => {
            const Component = SECTION_COMPONENTS[section];
            return (
              <TabsContent key={section} value={section}>
                <Component resume={resume} setResume={setResume} />
              </TabsContent>
            );
          })}
        </div>
      </Tabs>

      <SectionReorderer
        resume={resume}
        setResume={setResume}
        isOpen={showReorderer}
        onClose={() => setShowReorderer(false)}
      />
    </div>
  );
}
