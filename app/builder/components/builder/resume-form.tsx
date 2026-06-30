'use client';

import React, { useState } from 'react';
import { SectionType, isBuiltinSection } from '@/lib/types';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addCustomSection, selectResumeById } from '@/store/slices/resumes-slice';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Settings,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Plus,
  LayoutList,
} from 'lucide-react';
import InformationForm from './forms/information-form';
import SummaryForm from './forms/summary-form';
import ExperienceForm from './forms/experience-form';
import EducationForm from './forms/education-form';
import CertificationsForm from './forms/certifications-form';
import SkillsForm from './forms/skills-form';
import CustomSectionForm from './forms/custom-section-form';
import SectionReorderer from './section-reorderer';

// ============================================================================
// Type Definitions
// ============================================================================

interface ResumeFormProps {
  resumeId: string;
}

interface SectionConfig {
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType<{ resumeId: string }>;
}

// ============================================================================
// Section Configuration
// ============================================================================

const SECTION_CONFIG: Record<SectionType, SectionConfig> = {
  summary: {
    label: 'Summary',
    icon: <FileText className="w-5 h-5 md:w-6 md:h-6" />,
    component: SummaryForm,
  },
  experience: {
    label: 'Experience',
    icon: <Briefcase className="w-5 h-5 md:w-6 md:h-6" />,
    component: ExperienceForm,
  },
  education: {
    label: 'Education',
    icon: <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />,
    component: EducationForm,
  },
  certifications: {
    label: 'Certifications',
    icon: <Award className="w-5 h-5 md:w-6 md:h-6" />,
    component: CertificationsForm,
  },
  skills: {
    label: 'Skills',
    icon: <Code className="w-5 h-5 md:w-6 md:h-6" />,
    component: SkillsForm,
  },
};

const SECTION_ICONS = {
  summary: <FileText className="w-5 h-5 md:w-6 md:h-6" />,
  experience: <Briefcase className="w-5 h-5 md:w-6 md:h-6" />,
  education: <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />,
  certifications: <Award className="w-5 h-5 md:w-6 md:h-6" />,
  skills: <Code className="w-5 h-5 md:w-6 md:h-6" />,
};


export default function ResumeForm({ resumeId }: ResumeFormProps) {
  const dispatch = useAppDispatch();
  const [showReorderer, setShowReorderer] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');
  const resume = useAppSelector((state) => selectResumeById(state, resumeId));

  // Ensure sectionOrder exists
  const sectionOrder = resume?.sectionOrder || ['summary', 'education', 'experience', 'certifications', 'skills'];
  const customSections = resume?.customSections ?? [];
  const customSectionById = (id: string) => customSections.find((s) => s.id === id);

  const handleAddCustomSection = () => {
    const action = dispatch(addCustomSection({ id: resumeId }));
    setActiveTab(action.payload.section.id);
  };

  return (
    <div className="flex flex-col gap-6">

      <div className="p-3 lg:p-8 m-3 space-y-4 flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground ">Create Your Resume</h1>
          <p className="text-muted-foreground">Fill in your information section by section</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleAddCustomSection}
            variant="outline"
            size="lg"
            className="gap-2 border-border text-foreground hover:bg-muted"
          >
            <Plus size={16} />
            <span className="hidden md:inline">Add Section</span>
          </Button>
          <Button
            onClick={() => setShowReorderer(true)}
            variant="outline"
            size="lg"
            className="gap-2 border-border text-foreground hover:bg-muted"
          >
            <Settings size={16} />
            <span className="hidden md:inline">Organize</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full  lg:p-8" orientation="vertical">

        <div className="lg:block w-15 lg:w-48 flex-shrink-0">
          <TabsList variant="line">
            <TabsTrigger 
              value="contact" 
              className="justify-start gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted"
            >
              <User className="w-5 h-5" />
              <span className="hidden lg:inline">
                information
              </span>
            </TabsTrigger>
            {sectionOrder.map((section) => {
              const isBuiltin = isBuiltinSection(section);
              const custom = isBuiltin ? undefined : customSectionById(section);
              // A custom id in sectionOrder with no matching section (stale) is skipped.
              if (!isBuiltin && !custom) return null;
              return (
                <TabsTrigger
                  key={section}
                  value={section}
                  className="justify-start gap-2 px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted"
                >
                  {isBuiltin ? (
                    SECTION_CONFIG[section as SectionType].icon
                  ) : (
                    <LayoutList className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                  <span className="hidden lg:inline">
                    {isBuiltin
                      ? SECTION_CONFIG[section as SectionType].label
                      : custom!.title.trim() || 'Untitled Section'}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6 px-2 md:px-0">
          <TabsContent value="contact">
            <InformationForm resumeId={resumeId} />
          </TabsContent>

          {sectionOrder.map((section) => {
            if (isBuiltinSection(section)) {
              const Component = SECTION_CONFIG[section].component;
              return (
                <TabsContent key={section} value={section}>
                  <Component resumeId={resumeId} />
                </TabsContent>
              );
            }
            if (!customSectionById(section)) return null;
            return (
              <TabsContent key={section} value={section}>
                <CustomSectionForm resumeId={resumeId} sectionId={section} />
              </TabsContent>
            );
          })}
        </div>
        
      </Tabs>
      
      <SectionReorderer
        resumeId={resumeId}
        isOpen={showReorderer}
        onClose={() => setShowReorderer(false)}
      />

      
    </div>
  );
}
