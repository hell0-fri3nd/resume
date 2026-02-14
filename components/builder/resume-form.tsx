'use client';

import React, { useState } from 'react';
import { Resume, SectionType } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Code 
} from 'lucide-react';
import ContactForm from './forms/contact-form';
import SummaryForm from './forms/summary-form';
import ExperienceForm from './forms/experience-form';
import EducationForm from './forms/education-form';
import CertificationsForm from './forms/certifications-form';
import SkillsForm from './forms/skills-form';
import SectionReorderer from './section-reorderer';

// ============================================================================
// Type Definitions
// ============================================================================

interface ResumeFormProps {
  resume: Resume;
  setResume: (resume: Resume) => void;
}

interface SectionConfig {
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType<{ resume: Resume; setResume: (resume: Resume) => void }>;
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

const SECTION_LABELS = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  certifications: 'Certifications',
  skills: 'Skills',
};

const SECTION_COMPONENTS = {
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
    <div className="p-3 lg:p-8 flex flex-col gap-6">
      
      <div className="m-3 space-y-4 flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground ">Create Your Resume</h1>
          <p className="text-muted-foreground">Fill in your information section by section</p>
        </div>
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" orientation="vertical">

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
            {sectionOrder.map((section) => (
              <TabsTrigger 
                key={section} 
                value={section}
                className="justify-start gap-3 px-4 py-3 text-sm font-medium rounded-lg hover:bg-muted"
              >
                {SECTION_CONFIG[section].icon}
                <span className="hidden lg:inline">
                  {SECTION_CONFIG[section].label}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          <TabsContent value="contact">
            <ContactForm resume={resume} setResume={setResume} />
          </TabsContent>

          {sectionOrder.map((section) => {
            const Component = SECTION_CONFIG[section].component;
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
